---
title: 資金投入と回収
metaTitle: MPL-Distro トークン配布に資金を入れ回収する
description: 配布トークンを入金し、クレームレシート補助金に資金を入れ、未使用の MPL-Distro 残高を回収します。
keywords:
  - fund MPL-Distro
  - withdraw unclaimed tokens
  - claim receipt subsidy
  - token distribution vault
about:
  - MPL-Distro
  - Distribution Funding
  - Fund Recovery
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '08-25-2026'
updated: '08-26-2026'
howToSteps:
  - トークン割り当て全体を計算して入金する
  - 任意でレシート家賃補助金のために配布 PDA に資金を入れる
  - クレーム中にトークンと SOL 残高を監視する
  - アクティブ期間外に未使用トークンと補助金 SOL を回収する
howToTools:
  - MPL-Distro JavaScript SDK 0.4.x
  - Umi
faqs:
  - q: クレームがアクティブな間、権限者はトークンを引き出せますか？
    a: いいえ。トークン出金は開始タイムスタンプから終了タイムスタンプまで（両端含む）拒否されます。
  - q: subsidizeReceipts はどの費用を補填しますか？
    a: クレームレシート家賃のみです。プロトコル手数料、トランザクション手数料、受取人トークンアカウント家賃は対象外です。
  - q: クレーム開始後にトークンを追加で入金できますか？
    a: はい。入金に時間制限はないため、権限者は資金不足のボールトを補充できます。
  - q: 配布権限者なしでトレジャリーウォレットが入金できますか？
    a: いいえ。別の入金者がトークンを供給する場合でも、現在の権限者が deposit に署名する必要があります。
---

[MPL-Distro](/ja/smart-contracts/mpl-distro) は、配布ボールトのトークン資金と、クレームレシート家賃用の任意 SOL 資金を分けます。 {% .lead %}

## 概要

権限者は SPL トークンを配布の associated token account へ入金し、レシート補助金が有効なときは配布 PDA に SOL を入れることができます。

- すべての Merkle 割り当てをカバーする十分なトークン最小単位を入金します。
- 成功が想定されるクレームごとに 1 回のクレームレシート家賃を予算化します。
- 記録された `totalAmount` と実際のボールトトークン残高の両方を監視します。
- 配布が非アクティブなときだけ、未クレームトークンと未使用補助金 SOL を引き出します。

## クイックスタート

MPL-Distro の資金投入と回収は 4 つの運用手順に従います。

1. すべての割り当て量を合計し、そのトークン最小単位を入金します。
2. レシート補助金が有効なときは、想定レシート家賃予算を配布 PDA へ転送します。
3. 実際のボールト残高、配布 SOL、クレーム合計を監視します。
4. 期間終了後、未クレームトークンと未使用補助金 SOL を引き出します。

## 配布トークンを入金する

`deposit` 命令は入金者のアカウントから配布 PDA の正規 associated token account へトークンを転送します。別ウォレットがトークンを供給する場合でも、現在の配布権限者がすべての入金に署名する必要があります。

{% code-tabs-imported from="mpl-distro/fund_distribution" frameworks="umi" filename="fundDistribution" /%}

SDK は `depositor`、`payer`、`authority` を Umi 支払者にデフォルトし、両方の associated token account を導出します。別ウォレットが元トークンを所有するときは別の入金者署名者を渡し、現在の配布権限者も渡します。

{% code-tabs-imported from="mpl-distro/deposit_from_separate_wallet" frameworks="umi" filename="depositFromSeparateWallet" /%}

プログラムは各入金後に `totalAmount` を増やします。Merkle ルートがコミットした割り当ての合計とは比較しません。

## トークン入金額を計算する

必要なトークン入金は、mint の最小単位で表したすべての割り当て量の合計です。

{% code-tabs-imported from="mpl-distro/calculate_deposit" frameworks="umi" filename="calculateDeposit" /%}

意図的なバッファを入金するのは、後で余りを回収することを権限者が受け入れるときだけです。記録残高が割り当てより少ないと有効な証明は `InsufficientFunds` で失敗し、実際のボールト残高が低いと SPL 転送も失敗します。

## クレームレシート補助金に資金を入れる

レシート補助金は、各クレームレシート作成に使った家賃を、配布 PDA がトランザクション支払者へ補填できるようにします。

`createDistribution` 中に `subsidizeReceipts` を有効にし、RPC で家賃を計算し、SOL を配布 PDA へ直接転送します。

{% code-tabs-imported from="mpl-distro/fund_receipt_subsidy" frameworks="umi" filename="fundReceiptSubsidy" /%}

{% callout title="補助金予算の境界" type="warning" %}
配布は自身の rent-exempt 最小額を保持する必要があります。残りの SOL が配布家賃と 1 回のレシート補填の両方をカバーできないとき、クレームは `InsufficientFundsToSubsidizeReceipts` で失敗します。
{% /callout %}

## MPL-Distro 資金投入クイックリファレンス

クレーム費用は固定プロトコル手数料、Solana トランザクション費用、アカウント家賃に分かれます。

| 費用 | デフォルトの支払者 | レシート補助金がカバーするか |
|---|---|---|
| プロトコル手数料（{% fee product="mpl-distro" config="claim" fee="protocolFee" /%}） | クレームトランザクション支払者 | いいえ |
| トランザクション手数料 | クレームトランザクション支払者 | いいえ |
| クレームレシート家賃 | クレームトランザクション支払者 | はい（有効かつ資金があるとき） |
| 受取人 ATA 家賃 | クレームトランザクション支払者 | いいえ |

## 未クレームトークンを回収する

配布権限者は、開始時刻の前または終了時刻の後に `withdraw` で未クレームまたは余りのトークンを回収します。

{% code-tabs-imported from="mpl-distro/recover_funds" frameworks="umi" filename="recoverFunds" /%}

アクティブ区間は包含的です。`startTime <= clusterTime <= endTime` のとき出金は拒否されます。

## 未使用補助金 SOL を回収する

権限者は、補助金が有効で配布が非アクティブなときだけ、`withdrawSubsidy` で未使用レシート補助金を回収します。

`withdrawSubsidy` は要求された lamport 量を転送しつつ、配布アカウントの rent-exempt 最小額を維持します。想定クレームがすべて起きたと仮定せず、現在のアカウント残高から安全な量を決めてください。

## 配布残高を監視する

本番システムはプログラムの帳簿と実際の SPL / SOL アカウント残高を比較すべきです。

| 値 | 出典 | 意味 |
|---|---|---|
| `distribution.totalAmount` | 配布アカウント | プログラムが記録した入金マイナス出金。クレームでは減らない |
| Vault token amount | 配布 associated token account | 実際に転送可能なトークン |
| Distribution lamports | 配布 PDA アカウント | 家賃準備金と任意の未使用レシート補助金 |
| `claimCount` | 配布アカウント | 記録された成功クレーム数 |
| `claimAmount` | 配布アカウント | 記録されたクレーム済みトークン最小単位の合計 |

トークン出金の帳簿は saturating subtraction を使うため、連携側は `totalAmount` が SPL ボールト残高と決して乖離しないと仮定しないでください。

## 注意事項

資金操作には権限者制御と明示的な残高監視が必要です。

- 現在の配布権限者だけが入金を承認できます。
- 入金はクレーム期間の前、最中、後に可能です。
- トークンと補助金の出金はアクティブ期間中ブロックされます。
- 誰でも配布 PDA へ SOL を直接送れますが、プログラム経由で補助金を引き出せるのは権限者だけです。
- クレームレシートは現在クローズできないため、レシート家賃は割り当てられたままです。

## FAQ

### クレームがアクティブな間、権限者はトークンを引き出せますか？

いいえ。トークン出金は開始タイムスタンプから終了タイムスタンプまで（両端含む）拒否されます。

### subsidizeReceipts はどの費用を補填しますか？

クレームレシート家賃のみです。プロトコル手数料、トランザクション手数料、受取人トークンアカウント家賃は対象外です。

### クレーム開始後にトークンを追加で入金できますか？

はい。入金に時間制限はないため、権限者は資金不足のボールトを補充できます。

### 配布権限者なしでトレジャリーウォレットが入金できますか？

いいえ。別の入金者がトークンを供給する場合でも、現在の権限者が `deposit` に署名する必要があります。
