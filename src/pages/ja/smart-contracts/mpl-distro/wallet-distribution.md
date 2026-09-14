---
title: ウォレット配布
metaTitle: MPL-Distro ウォレットクレームと Merkle 証明
description: ウォレット割り当てツリーを構築し、クレーム権限を設定し、MPL-Distro トークンクレームを送信します。
keywords:
  - MPL-Distro wallet distribution
  - Merkle proof format
  - permissionless token claim
  - Solana airdrop
about:
  - MPL-Distro
  - Wallet Claims
  - Merkle Trees
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '08-25-2026'
updated: '08-27-2026'
howToSteps:
  - ウォレット割り当てと一意の nonce を定義する
  - Merkle ルートと証明を生成して保存する
  - 必要な送信モードで Wallet 配布を作成する
  - distribute 命令で各割り当てを送信する
howToTools:
  - MPL-Distro JavaScript SDK 0.4.x
  - Umi
faqs:
  - q: バックエンドは受取人の署名なしでクレームを送信できますか？
    a: はい。Permissionless モードではリレイヤーが SOL を払って証明を送信できます。トークンはリーフアドレスへ行きます。これはガスレスクレーム用であり、SPL 送金の一括代替ではありません。
  - q: 同じウォレット割り当てが 2 回クレームされるのを何が防ぎますか？
    a: 決定的なクレームレシート PDA が、一意の distribution、recipient、amount、nonce タプルを記録します。
  - q: totalClaimants は成功クレーム数を制限しますか？
    a: いいえ。totalClaimants はメタデータです。Merkle 包含とボールト資金が、割り当てをクレームできるかを決めます。
  - q: Core アセット割り当てのリーフにはどのアドレスを入れますか？
    a: Core アセットサイナー PDA を使います。distributeToAssetAndClaim がそのトークンを現在の所有者へ移します。
---

ウォレット配布は公開鍵に固定トークン量を割り当て、`distribute` で各割り当てを検証します。 {% .lead %}

## 概要

ウォレット配布はウォレットまたはその他の公開鍵を Merkle リーフ identity として使い、常にその identity の associated token account へ割り当てを転送します。

- `prepareDistribution` で互換ルートと証明を生成します。
- 重複する受取人と amount の割り当てを区別する必要があるときは nonce を設定します。
- アプリケーションの署名モデルに合う distributor モードを選びます。
- オンチェーンルートだけから証明を再構築できないため、すべての証明を保存します。

## ウォレット割り当ての形

各ウォレット割り当てにはアドレス、トークン最小単位の amount、任意の符号なし 64 ビット nonce が含まれます。

{% code-tabs-imported from="mpl-distro/wallet_allocations" frameworks="umi" filename="walletAllocations" /%}

amount は 0 より大きくなければなりません。nonce のデフォルトは 0 で、2 つのリーフが同じアドレスと amount になるときだけ変えます。

## MPL-Distro の Merkle 形式

MPL-Distro は Keccak-256 とソート済み内部ノード対で割り当てデータをハッシュします。

| 要素 | エンコード |
|---|---|
| Leaf data | `recipient_pubkey[32] || amount_u64_le || nonce_u64_le` |
| Leaf hash | `keccak256("claim" || leaf_data)` |
| Internal node | `keccak256(0x01 || min(left,right) || max(left,right))` |
| Odd node | 自身とペアになる |
| Proof item | 1 つの 32 バイト兄弟ハッシュ |
| Maximum configured height | 64 |

この形式を独自実装せず、SDK ヘルパーを使ってください。SHA-256、ビッグエンディアン整数、未ソート対、別のドメインプレフィックスで生成した証明は `InvalidClaimProof` で失敗します。

{% callout title="ツリー高は証明の上限" type="note" %}
オンチェーンの `treeHeight` は証明長を制限します。`totalClaimants` を独立に検証しません。`prepareDistribution` が返す値を渡してください。
{% /callout %}

## ウォレットクレームの送信モード

`allowedDistributor` 設定は、誰が `distribute` を送信できるかを決めます。

### Permissionless ウォレットクレーム

Permissionless クレームでは、資金のある任意の支払者が有効な証明を送信でき、プログラムはコミット済み受取人にだけトークンを送ります。

受取人が支払うクレームページ、または実際にクレームしたときにリレイヤーが SOL を払う場合に使います。バックエンドから全割り当てを Distro で押し出さないでください。通常は直接 SPL 送金より高くなります。

### Recipient 署名のウォレットクレーム

Recipient クレームでは、コミット済み受取人がトランザクションに署名する必要があります。

受益者が割り当てを明示的に受け入れる必要がある場合、または証明へのアクセスだけでは送信を許可したくない場合に使います。

### Permissioned ウォレットクレーム

Permissioned クレームでは、設定された `permissionedDistributor` 署名者が必要です。

1 つのバックエンドが、より広いオンチェーンクレーム期間の中で解放タイミングを制御する場合に使います。権限者は後から [permissioned distributor を変更](/ja/smart-contracts/mpl-distro/updates#permissioned-distributor-を変更する) できます。

{% callout title="作成時に Permissioned Distributor を設定する" type="warning" %}
`createDistribution` は `permissionedDistributor` を System Program 公開鍵にデフォルトします。`allowedDistributor` が `Permissioned` のときは実際の distributor アドレスを渡さないと、すべてのクレームが `InvalidDistributor` で失敗します。
{% /callout %}

## ウォレットクレームを送信する

`distribute` 命令は証明を検証し、必要なら associated token account を作成し、トークンを転送し、レシートをアトミックに記録します。

{% code-tabs-imported from="mpl-distro/claim_distribution" frameworks="umi" filename="claimDistribution" /%}

支払者がトランザクション手数料、{% fee product="mpl-distro" config="claim" fee="protocolFee" /%} プロトコル手数料、アカウント家賃を払います。任意のクレームレシート家賃補助金は [資金投入と回収](/ja/smart-contracts/mpl-distro/funding-and-recovery) を参照してください。

## ウォレットクレームレシート

クレームレシートは、1 つの exact な割り当てが 2 回以上処理されないようにします。

| フィールド | 値 |
|---|---|
| PDA seeds | `["claim_receipt", distribution, recipient, amount_le, nonce_le]` |
| Stored distribution | 配布 PDA |
| Stored recipient | リーフのウォレットまたは公開鍵 |
| Stored amount | クレームされたトークン最小単位 |
| Stored nonce | リーフ nonce |
| Account size | 88 バイト |

現行プログラムではクレームレシートは永続的で、クローズ命令はありません。

## コアアセットサイナーへのクレーム

`distributeToAssetAndClaim` は `Wallet` 割り当てを [MPL Core](/ja/smart-contracts/core) アセットサイナー PDA へクレームし、[Core Execute](/ja/smart-contracts/core/execute-asset-signing) でトークンを現在の所有者へ移します。

Merkle リーフは所有者ウォレットではなく、各アセットのサイナー PDA から構築します。ヘルパーはその PDA の associated token account からクレーム済みトークンを転送します。

{% code-tabs-imported from="mpl-distro/claim_to_core_asset" frameworks="umi" filename="claimToCoreAsset" /%}

このヘルパーは `Wallet` 配布フローです。`LegacyNft` クレームではなく、オンチェーンで Core コレクション所属も検証しません。

## ウォレット配布のセキュリティチェックリスト

本番のウォレット配布は、ルートを公開する前に割り当ての整合性を検証すべきです。

- 割り当ての合計が計画入金を超えないことを確認する。
- SDK を呼ぶ前に 0、負、範囲外の amount を拒否する。
- 決定的 nonce を割り当て、証明と一緒に保存する。
- 最終ルートに対してランダム証明とすべての端の割り当てをテストする。
- 権限者と permissioned distributor の鍵をブラウザアプリケーションの外に置く。
- クラスタタイムスタンプを確認し、開始と終了境界の周りに運用時間を残す。

## 注意事項

ウォレット配布は任意の公開鍵をリーフ identity にできますが、デフォルトの宛先はその SPL トークン associated token account です。

- Core アセットクレームは `distributeToAssetAndClaim` を使い、Merkle リーフにアセットサイナー PDA が必要です。
- `totalClaimants` はオンチェーンのクレーム上限ではありません。
- 有効な証明でも、ボールトにトークンが足りないと失敗します。
- 境界の両方のタイムスタンプでクレームは受理されます: `startTime <= now <= endTime`。

## FAQ

### バックエンドは受取人の署名なしでクレームを送信できますか？

はい。`Permissionless` 配布ではリレイヤーが SOL を払って証明を送信できます。トークンはリーフアドレスへ行きます。SOL のない受取人がクレームできるように使うものであり、一括 SPL 送金の代替ではありません。

### 同じウォレット割り当てが 2 回クレームされるのを何が防ぎますか？

決定的なクレームレシート PDA が、一意の distribution、recipient、amount、nonce タプルを記録します。

### totalClaimants は成功クレーム数を制限しますか？

いいえ。`totalClaimants` はメタデータです。Merkle 包含とボールト資金が、割り当てをクレームできるかを決めます。

### Core アセット割り当てのリーフにはどのアドレスを入れますか？

Core アセットサイナー PDA を使います。`distributeToAssetAndClaim` がそのトークンを現在の所有者へ移します。
