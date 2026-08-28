---
title: 本番デリバリー
metaTitle: 本番で MPL-Distro クレームを届ける
description: Merkle 証明を永続化し、受取人がクレームできる手段を用意し、期間終了後に未クレームの MPL-Distro トークンを回収します。
keywords:
  - MPL-Distro airdrop
  - Merkle proof delivery
  - token claim page
  - recover unclaimed tokens
about:
  - MPL-Distro
  - Claim Delivery
  - Token Airdrop
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '08-27-2026'
updated: '08-27-2026'
howToSteps:
  - 誰が署名すべきかに合うクレーム送信モードを選ぶ
  - 各割り当てのアドレス、amount、nonce、証明を永続化する
  - クレームページまたはルックアップ API でそれらのレコードを届ける
  - クレーム期間終了後に未クレームトークンを回収する
howToTools:
  - MPL-Distro JavaScript SDK 0.4.x
  - Umi
faqs:
  - q: MPL-Distro はクレーム用ウェブサイトをホストしますか？
    a: いいえ。プログラムが保存するのは Merkle ルートだけです。アプリケーションが証明を永続化し、クレームページまたは API を提供する必要があります。
  - q: メールや Discord ハンドルを Merkle リーフにできますか？
    a: いいえ。リーフはウォレット公開鍵またはレガシー NFT mint です。オフチェーンチャネルで通知できますが、それらはオンチェーン identity ではありません。
  - q: Merkle 証明を公開しても安全ですか？
    a: Permissionless モードでは有効な証明を持つ誰でもクレームを送信できます。トークンはリーフアドレスへ行きます。証明へのアクセスだけでは送信を許可したくない場合は Recipient モードを使います。
  - q: バックエンドがすべての Merkle 証明を自分で送信すべきですか？
    a: いいえ。各 Distro クレームがプロトコル手数料を払うため、通常は SPL 送金より高くなります。ユーザー起点のクレームの SOL をリレイヤーが払うか、一部の割り当てが未クレームになる場合に Distro を使います。
  - q: 未クレームトークンはいつ回収できますか？
    a: 権限者は開始タイムスタンプの前、または終了タイムスタンプの後にトークンを引き出せます。配布がアクティブな間は出金が拒否されます。
---

[MPL-Distro](/ja/smart-contracts/mpl-distro) がオンチェーンに保存するのは Merkle ルートだけです。本番エアドロップは各割り当ての証明をオフチェーンに永続化し、受取人がそれを送信できる手段を用意します。 {% .lead %}

## 概要

本番デリバリーは MPL-Distro 配布を囲むオフチェーン作業です。クレームレコードを保存し、正しい請求者へ届け、期間終了時に余りを回収します。

- [はじめに](/ja/smart-contracts/mpl-distro/getting-started) のフローまたは [Metaplex CLI](/ja/dev-tools/cli/distro) で配布を作成して資金投入します。
- クレーム開始前に、すべての割り当ての `address`、`amount`、`nonce`、`proof` を永続化します。
- 誰が署名すべきかに合わせて [Permissionless、Recipient、または Permissioned](/ja/smart-contracts/mpl-distro/wallet-distribution#ウォレットクレームの送信モード) を選びます。
- 期間終了後に [資金投入と回収](/ja/smart-contracts/mpl-distro/funding-and-recovery) で未クレームトークンを回収します。

{% callout title="ホストされたクレーム UI はない" type="note" %}
MPL-Distro はクレーム用ウェブサイトやメール、SMS、Discord identity を提供しません。[Metaplex CLI](/ja/dev-tools/cli/distro) は配布の作成、資金投入、確認、回収ができますが、Merkle 証明の生成やクレーム送信はしません。既存のチャネルでユーザーに通知してください。オンチェーンリーフは依然としてウォレットまたは [レガシー NFT](/ja/smart-contracts/mpl-distro/legacy-nft-distribution) mint です。
{% /callout %}

**ジャンプ先:** [前提条件](#前提条件) · [送信モード](#クレーム送信モードを選ぶ) · [レコードの永続化](#割り当てレコードを永続化する) · [証明の配信](#merkle-証明を届ける) · [トークン回収](#未クレームトークンを回収する)

## クイックスタート

本番の MPL-Distro エアドロップには、オンチェーンプログラムを囲む 5 つのデリバリー手順があります。

1. 完全な割り当てリストを構築し、`prepareDistribution` でルートを生成します。
2. 割り当てごとに 1 つのクレームレコードを永続化し、配布を作成して資金投入します。
3. ウォレットまたは NFT mint をキーにしたクレームページまたはルックアップ API から各レコードを提供します。
4. 保存済みの amount、nonce、証明で `distribute` または `distributeToLegacyNft` を送信します。
5. `endTime` の後、未クレームトークンと未使用のレシート家賃補助金を引き出します。

## 前提条件

本番デリバリーは、既存の [SPL トークン](/ja/solana/spl-tokens-and-token-programs) mint と完成した割り当てリストから始まります。

- [はじめに](/ja/smart-contracts/mpl-distro/getting-started) の配布（またはバックエンドで同じ作成と入金手順）
- クレームレコード用の耐久ストレージ（データベース、オブジェクトストア、またはダウンロード可能なファイル）
- 家賃、ネットワーク手数料、{% fee product="mpl-distro" config="claim" fee="protocolFee" /%} プロトコル手数料用に資金のあるクレームトランザクション支払者
- 配布タイプ: [ウォレット](/ja/smart-contracts/mpl-distro/wallet-distribution) または [レガシー NFT](/ja/smart-contracts/mpl-distro/legacy-nft-distribution)

割り当て量はトークン最小単位です。decimals が 6 の mint では、`1.0` トークンは `1_000_000` です。

## クレーム送信モードを選ぶ

`allowedDistributor` は有効な証明を誰が送信できるかを決めます。トークンの行き先は変わりません。

| モード | クレームに署名する主体 | 典型的な本番の形 |
|---|---|---|
| `Permissionless` | 資金のある任意の支払者 | ユーザーまたはリレイヤーが支払うクレームページ。トークンはリーフへ行く |
| `Recipient` | リーフウォレットまたは現在の NFT 所有者 | 受益者がトランザクションを承認するクレームページ |
| `Permissioned` | 設定された `permissionedDistributor` | 1 つのバックエンドだけが証明送信を許可される署名者 |

トークンは常にリーフの正規 [associated token account](/ja/solana/understanding-solana-accounts#associated-token-accounts-atas) に届きます（`LegacyNft` では現在の NFT 所有者の ATA）。Permissionless 送信は資金を支払者へ迂回できません。

配布権限者と permissioned distributor の鍵はブラウザアプリケーションの外に置いてください。

## 割り当てレコードを永続化する

各クレームには、そのリーフで `prepareDistribution` が使った同じアドレス、amount、nonce、証明が必要です。オンチェーンアカウントはルートからそれらの値を再構築できません。

完全なリストから始め、同じインデックスに証明を保存します。

```json {% title="allocations.json" %}
[
  {
    "address": "8SoWVrwJ6vPa3rcdNBkhznR54yJ6iQqPSmgcXVGnwtEu",
    "amount": "10000000",
    "nonce": "0"
  },
  {
    "address": "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS",
    "amount": "5000000",
    "nonce": "0"
  }
]
```

{% code-tabs-imported from="mpl-distro/persist_claim_records" frameworks="umi" filename="persistClaimRecords" /%}

`createDistribution` の後、各レコードに配布 [PDA](/ja/solana/understanding-pdas) を保存します。クレームトランザクションにはそのアドレスと `mint`、`amount`、`nonce`、`proof` が必要です。

| フィールド | 必要な場面 | 注記 |
|---|---|---|
| `address` | リーフ identity | ウォレット公開鍵またはレガシー NFT mint |
| `amount` | リーフデータ | 文字列または `bigint` のトークン最小単位 |
| `nonce` | リーフデータ | デフォルトは `0`。同じアドレスと amount が 2 回出るときに必須 |
| `proof` | `distribute` | ツリーレベルごとの 32 バイト兄弟ハッシュ（SDK の順） |
| `distribution` | `distribute` | 作成後の `findDistributionPda` からの PDA |

{% callout title="クレームを開く前に証明を保存する" type="warning" %}
権限者は `startTime <= now <= endTime` の間、Merkle ルート、ツリー高、開始時刻、claimant 数を変更できません。期間開始前に割り当てファイル全体をバックアップしてください。
{% /callout %}

## Merkle 証明を届ける

アプリケーションは保存済みレコードを 1 件ルックアップし、`distribute` または `distributeToLegacyNft` に渡します。MPL-Distro は受取人をインデックスしません。

よくある配信の形:

1. **クレームページ。** ユーザーがウォレットを接続し、ネットワーク手数料を払い、保存済み証明を送信します。
2. **ルックアップ API。** サービスが `address` → `{ amount, nonce, proof, distribution }` をフロントエンドまたはリレイヤーへ提供します。
3. **スポンサー付きクレーム。** 受取人（または適格性チェック）がクレームを起動します。リレイヤーが SOL を払い、ユーザーは資金のあるウォレットを必要としません。トークンはリーフ ATA へ行きます。

スポンサー付きクレームは、バックエンドループで全割り当てを送ることの代替ではありません。各 Distro クレームは {% fee product="mpl-distro" config="claim" fee="protocolFee" /%} プロトコル手数料を払います。すべての受取人がクレーム手順なしですぐにトークンを受け取るなら、直接の [SPL トークン](/ja/solana/spl-tokens-and-token-programs) 送金を使います。

一部の割り当てが未クレームになる場合、公開 Merkle コミットメントと期間が必要な場合、または実際にクレームした人にだけリレイヤーが払う場合に Distro を使います。

`LegacyNft` では NFT mint でルックアップします。クレーム時に現在の所有者を解決してください。スナップショット所有者をリーフに固定するのは、[ウォレット配布](/ja/smart-contracts/mpl-distro/wallet-distribution) を意図した場合だけです。

オンチェーンルートから証明を再構築しないでください。別のハッシュ、バイト順、リーフ集合で生成した証明は `InvalidClaimProof` で失敗します。

## クレーム期間を開く

クレームはクラスタ時刻が包含的な `startTime`–`endTime` の間にあり、ボールトに十分なトークンがあるときだけ成功します。

全受取人にリストを開く前に、[はじめに](/ja/smart-contracts/mpl-distro/getting-started) のフローで作成、入金、最初のテストクレームを送信してください。確認すること:

- 永続化ファイルのサンプル証明が `distribute` と一致する。
- プロトコル手数料の支払者に {% fee product="mpl-distro" config="claim" fee="protocolFee" /%} とレシート家賃用の SOL がある、または [レシート補助金](/ja/smart-contracts/mpl-distro/funding-and-recovery#クレームレシート補助金に資金を入れる) が入っている。
- 権限者の鍵がクレームフロントエンドに露出していない。

## クレームを監視する

成功したクレームは永続的なクレームレシート [PDA](/ja/solana/understanding-pdas) を作成します。そのアカウントを取得するか、配布上の `claimCount` / `claimAmount` を比較して、どの割り当てが完了したかを把握します。

その exact な `(distribution, recipient, amount, nonce)` タプルでは `AlreadyClaimed` を成功として扱います。`LegacyNft` mint の所有権移転はレシートをリセットしません。

## 未クレームトークンを回収する

配布権限者は、配布が非アクティブなとき（`startTime` の前または `endTime` の後）だけ、余りのトークンと未使用補助金 SOL を引き出します。

`withdraw` と `withdrawSubsidy` は [資金投入と回収](/ja/smart-contracts/mpl-distro/funding-and-recovery#未クレームトークンを回収する) を参照してください。最後のクレームが回収トランザクションと競合しないよう、終了タイムスタンプの周りに運用マージンを残します。

## 本番デリバリーチェックリスト

ユーザーが依存する前に、オフチェーンファイルをオンチェーンルートに対して検証します。

- `amount` 値の合計がボールト入金でカバーされている。
- 永続化した各証明が、同じリスト・同じ順の `prepareDistribution` 出力である。
- 漏洩した証明だけでは送信できないようにするなら `Recipient` モードを使う。
- クレームフロントエンドは配布権限者を持たない。
- 未クレームトークンには `endTime` 後に `withdraw` を呼べる所有者がいる。

## 注意事項

MPL-Distro は割り当てデータベース、通知チャネル、クレーム UI の代わりにはなりません。

- `totalClaimants` はメタデータであり、成功する証明数の上限ではありません。
- クレームレシートはクローズされないため、レシート家賃は割り当てられたままです。
- 大きなリストは制御された Node.js プロセスで構築します。`prepareDistribution` は 1,000 リーフで実装を切り替えます。

## FAQ

### MPL-Distro はクレーム用ウェブサイトをホストしますか？

いいえ。プログラムが保存するのは Merkle ルートだけです。アプリケーションが証明を永続化し、クレームページまたは API を提供する必要があります。

### メールや Discord ハンドルを Merkle リーフにできますか？

いいえ。リーフはウォレット公開鍵またはレガシー NFT mint です。オフチェーンチャネルで通知できますが、それらはオンチェーン identity ではありません。

### Merkle 証明を公開しても安全ですか？

`Permissionless` モードでは有効な証明を持つ誰でもクレームを送信できます。トークンはリーフアドレスへ行きます。証明へのアクセスだけでは送信を許可したくない場合は `Recipient` モードを使います。

### バックエンドがすべての Merkle 証明を自分で送信すべきですか？

いいえ。バックエンドからすべての証明を送信するのは、各 Distro クレームがプロトコル手数料を払うため、通常は [SPL トークン](/ja/solana/spl-tokens-and-token-programs) 送金より高くなります。SOL のないユーザーがクレームできるようにリレイヤーを使うか、一部の割り当てが未クレームになり Merkle 期間が必要な場合に Distro を使います。

### 未クレームトークンはいつ回収できますか？

権限者は開始タイムスタンプの前、または終了タイムスタンプの後にトークンを引き出せます。`startTime <= clusterTime <= endTime` の間は出金が拒否されます。
