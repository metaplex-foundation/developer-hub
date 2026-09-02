---
title: MPL-Distro
metaTitle: MPL-Distro - Solana 上の Merkle トークンクレームとエアドロップ
description: 既存の SPL トークンをウォレットまたはレガシー NFT 保有者へ配布します。MPL-Distro は受取人リスト全体ではなく Merkle ルートをオンチェーンに保存します。
keywords:
  - MPL-Distro
  - Solana token distribution
  - Merkle airdrop
  - token claim
  - SPL token distribution
  - legacy NFT holder rewards
about:
  - MPL-Distro
  - Token Distribution
  - Merkle Claims
proficiencyLevel: Intermediate
created: '08-25-2026'
updated: '08-27-2026'
faqs:
  - q: MPL-Distro は何に使いますか？
    a: MPL-Distro は既存の SPL トークン割り当てを、ウォレットアドレスまたはレガシー NFT mint の固定リストへ Merkle 証明で配布します。
  - q: MPL-Distro はトークンローンチパッドですか？
    a: いいえ。MPL-Distro は既存 mint を配布します。トークン生成イベント、セール、Launch Pool、ボンディングカーブが必要な場合は Genesis を使います。
  - q: 受取人の代わりに誰かがトランザクション手数料を払えますか？
    a: はい。Permissionless 配布では任意の支払者が受取人の有効なクレームを送信できます。Recipient と Permissioned モードは送信できる主体を制限します。
  - q: MPL-Distro はベスティングに対応していますか？
    a: いいえ。MPL-Distro は各 Merkle 割り当てを 1 回のクレームで解放します。スケジュール型のプロジェクト割り当てには Genesis のプロジェクトベスティングを使います。
---

**MPL-Distro** は、既存の [SPL トークン](/ja/solana/spl-tokens-and-token-programs) をウォレットまたは [レガシー NFT](/ja/smart-contracts/token-metadata) 保有者のリストへ配布する Solana プログラムです。受取人リスト全体ではなく、コンパクトな Merkle ルートをオンチェーンに保存します。 {% .lead %}

## 概要

MPL-Distro は受取人リストを 1 つのオンチェーン Merkle ルートとしてコミットし、トークンをボールトに保持し、各成功クレームを記録して再利用できないようにします。

- 受取人リスト全体をオンチェーンに保存せず、既存の SPL トークン mint を配布します。
- ウォレットアドレス、または特定のレガシー NFT mint の現在の保有者を対象にします。
- Permissionless、recipient のみ、または permissioned のクレーム送信を選べます。
- クレーム期間後に未クレームトークンと未使用のレシート家賃補助金を回収します。

{% quick-links %}
{% quick-link title="配布を構築する" icon="InboxArrowDown" href="/ja/smart-contracts/mpl-distro/getting-started" description="ウォレット配布を作成、資金投入、クレームします。" /%}
{% quick-link title="本番でクレームを届ける" icon="PaperAirplane" href="/ja/smart-contracts/mpl-distro/production-delivery" description="証明を保存し、クレームページまたは API を運用し、未クレームトークンを回収します。" /%}
{% quick-link title="配布タイプを選ぶ" icon="ArrowsRightLeft" href="/ja/smart-contracts/mpl-distro/wallet-distribution" description="ウォレットとレガシー NFT の割り当てモデルを比較します。" /%}
{% quick-link title="CLI" icon="CodeBracketSquare" href="/ja/dev-tools/cli/distro" description="ターミナルから配布の作成、資金投入、確認、回収を行います。" /%}
{% /quick-links %}

## MPL-Distro の配布モデル

Merkle ツリーは受取人リストを 1 つの 32 バイトハッシュ（ルート）にします。各受取人はそのリストに含まれることを短い証明で示せるため、リスト全体をオンチェーンに置く必要はありません。

1. 配布権限者が、各受取人、amount、任意の nonce を含むオフチェーンリストを構築します。
2. `prepareDistribution` が Merkle ルートと割り当てごとの証明を作成します。
3. `createDistribution` がルート、クレーム期間、mint、アクセス規則を保存します。
4. `deposit` がトークン割り当て全体を配布の associated token account へ転送します。
5. `distribute` または `distributeToLegacyNft` が証明を検証し、永続的なクレームレシートを作成します。
6. `withdraw` が配布が非アクティブになった後に未クレームトークンを返します。

{% callout title="クレームデータを保存する" type="warning" %}
プログラムが保存するのは Merkle ルートだけであり、受取人リストや証明は保存しません。各割り当てのアドレス、amount、nonce、証明をデータベースまたはダウンロード可能なクレームファイルに残してください。
{% /callout %}

## MPL-Distro の配布タイプ

MPL-Distro はウォレットアドレス割り当てとレガシー NFT mint 割り当てを、別々のクレーム命令でサポートします。

| 配布タイプ | Merkle リーフの identity | クレーム命令 | 最適な用途 |
|---|---|---|---|
| `Wallet` | ウォレットまたはその他の公開鍵 | `distribute` | 手当、貢献者報酬、直接トークンエアドロップ |
| `LegacyNft` | レガシー NFT mint | `distributeToLegacyNft` | NFT の現在のトークンアカウント所有者がクレームする報酬 |

`LegacyNft` タイプは、リストされた NFT mint を現在所有するウォレットへ支払います。対象 NFT と所有権の確認は [レガシー NFT 配布](/ja/smart-contracts/mpl-distro/legacy-nft-distribution) を参照してください。

## MPL-Distro の Allowed Distributor モード

Allowed distributor モードは、有効な Merkle クレームトランザクションを誰が送信できるかを制御します。

| モード | 必須の署名者 | 動作 |
|---|---|---|
| `Permissionless` | 任意の支払者 | サービスまたは第三者が受取人の代わりにクレームを送信できます |
| `Recipient` | 受取人ウォレットまたはレガシー NFT 所有者 | 受益者がクレームを承認する必要があります |
| `Permissioned` | 設定された distributor | 指定された 1 つの distributor だけがクレームを送信できます |

Permissionless 送信はトークンの行き先を変えません。プログラムは常に受取人の正規 [associated token account](/ja/solana/understanding-solana-accounts#associated-token-accounts-atas) へ割り当てを送ります。

## MPL-Distro のプロトコル手数料

成功した Merkle クレームはプロトコル手数料を課し、クレームトランザクションの支払者が支払います。

{% protocol-fees program="mpl-distro" config="claim" showTitle=false /%}

Metaplex プログラム全体の現行額は [プロトコル手数料](/ja/protocol-fees) を参照してください。

## 注意事項

MPL-Distro のオンチェーンチェックはクレームを保護しますが、オフチェーンの割り当て検証の代わりにはなりません。

- `totalClaimants` はメタデータであり、有効な証明数の上限ではありません。
- 入金はすべての Merkle 割り当ての合計と照合されません。クレーム開始前に十分なトークンをボールトへ入れてください。
- クレームレシートはクローズされないため、家賃は割り当てられたままです。
- プログラムは Token-2022 ではなくオリジナル SPL Token プログラムを対象とします。
- MPL-Distro はベスティング、ストリーミング、部分クレーム、構造化プログラムイベントを提供しません。

## FAQ

### MPL-Distro は何に使いますか？

MPL-Distro は既存の SPL トークン割り当てを、ウォレットアドレスまたはレガシー NFT mint の固定リストへ Merkle 証明で配布します。

### MPL-Distro はトークンローンチパッドですか？

いいえ。MPL-Distro は既存 mint を配布します。トークン生成イベント、セール、Launch Pool、ボンディングカーブが必要な場合は [Genesis](/ja/smart-contracts/genesis) を使います。

### 受取人の代わりに誰かがトランザクション手数料を払えますか？

はい。Permissionless 配布では任意の支払者が受取人の有効なクレームを送信できます。`Recipient` と `Permissioned` モードは送信できる主体を制限します。

### MPL-Distro はベスティングに対応していますか？

いいえ。MPL-Distro は各 Merkle 割り当てを 1 回のクレームで解放します。スケジュール型のプロジェクト割り当てには [Genesis のプロジェクトベスティング](/ja/smart-contracts/genesis/project-vesting) を使います。

## 用語集

MPL-Distro は Merkle 証明と決定的アカウントでトークン割り当てを検証し記録します。

| 用語 | 定義 |
|---|---|
| Distribution | トークン mint、Merkle ルート、期間、権限者、クレーム合計を含むプログラムアカウント |
| Distribution authority | 設定の更新、トークン入金、未クレーム資金の回収ができるウォレット |
| Merkle tree | オンチェーンルートと割り当てごとの証明を生成するオフチェーン構造 |
| Merkle root | オフチェーン割り当てリスト全体への 32 バイトコミットメント |
| Merkle proof | 1 つの割り当てがコミット済みツリーに属することを示す兄弟ハッシュ |
| Claim receipt | 1 つの `(distribution, recipient, amount, nonce)` 割り当てがクレームされたことを示す [PDA](/ja/solana/understanding-pdas) |
| Nonce | それ以外は同一の受取人と amount のリーフを区別する数値 |
| Token base units | mint の最小単位。decimals が 6 のトークンは 1.0 トークンあたり `1_000_000` 単位 |
| Receipt subsidy | クレームレシート家賃を補填するために配布 PDA が任意で保持する SOL |
