---
title: Presale
metaTitle: Presale | Metaplex CLI
description: Metaplex CLI を使用して Presale bucket の作成、入金、Genesis Presale からのトークン請求を行います。
keywords:
  - genesis presale
  - fixed-price token sale
  - presale bucket
  - mplx genesis presale
  - token presale CLI
about:
  - presale bucket
  - fixed-price token distribution
  - presale deposit and claim
  - Genesis CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
howToSteps:
  - Add a presale bucket with allocation, quoteCap, and time windows using bucket add-presale
  - Finalize the Genesis account to activate the launch
  - Wrap SOL and deposit quote tokens during the deposit window
  - Claim base tokens at the fixed price after the claim period opens
howToTools:
  - Metaplex CLI (mplx)
  - Solana CLI
faqs:
  - q: Presale の価格はどのように決まりますか？
    a: 価格は quoteCap を allocation で割って計算されます。例えば、100 SOL の quoteCap と 1,000,000 トークンの allocation の場合、1トークンあたり 0.0001 SOL になります。
  - q: Presale が完全に埋まらなかった場合はどうなりますか？
    a: 入金したユーザーは固定価格でトークンを受け取ります。未販売のトークンは bucket に残ります。
  - q: Presale に入金制限を設定できますか？
    a: はい。トランザクションあたりの最小額には minimumDeposit を、ユーザーあたりの最大額には depositLimit を使用します。
  - q: Presale からのトークン割り当てをどのように計算しますか？
    a: あなたのトークン = (あなたの入金額 / quoteCap) * allocation。100 SOL キャップで 100万トークン割り当ての Presale に 1 SOL 入金した場合、10,000 トークンを受け取ります。
---

{% callout title="このページで行うこと" %}
CLI から Presale の完全なライフサイクルを実行：
- 固定価格のトークン割り当てで Presale bucket を追加
- 販売ウィンドウ中に quote token を入金
- 事前に決められた価格で base token を請求
{% /callout %}

## 概要

Presale は `quoteCap / allocation` で決定される固定価格でトークンを販売します。このページでは、bucket の作成からトークンの請求までの完全な Presale ライフサイクルを説明します。

- **配布方法**: 固定価格 — `quoteCap / allocation` でトークンあたりのコストが決定
- **コマンド**: `bucket add-presale`、`presale deposit`、`presale claim`
- **価格例**: 100 SOL の quote cap / 1,000,000 トークン = 1トークンあたり 0.0001 SOL
- **Quote token**: デフォルトは Wrapped SOL — 入金前に SOL をラップしてください

## 対象外

Launch Pool bucket、unlocked bucket、end behavior、Genesis アカウントの作成、ファイナライズ、フロントエンド統合。

**移動先:** [bucket の追加](#add-presale-bucket) · [入金](#deposit) · [請求](#claim) · [完全なライフサイクル](#full-lifecycle-example) · [一般的なエラー](#common-errors) · [FAQ](#faq)

*Metaplex Foundation によるメンテナンス · 最終確認 2026年2月 · Metaplex CLI（mplx）が必要*

## Presale Bucket の追加

`mplx genesis bucket add-presale` コマンドは、Genesis アカウントに Presale bucket を追加します。

```bash {% title="Presale bucket の追加" %}
mplx genesis bucket add-presale <GENESIS_ADDRESS> \
  --allocation 1000000000000000 \
  --quoteCap 100000000000 \
  --bucketIndex 0 \
  --depositStart 1704067200 \
  --depositEnd 1704153600 \
  --claimStart 1704153601 \
  --claimEnd 1735689600
```

### オプション

| フラグ | 短縮形 | 説明 | 必須 |
|-------|--------|------|------|
| `--allocation <string>` | `-a` | base units での base token 割り当て | はい |
| `--quoteCap <string>` | | 受け入れる quote token の総量 — 価格を決定 | はい |
| `--bucketIndex <integer>` | `-b` | bucket インデックス | はい |
| `--depositStart <string>` | | 入金開始の Unix タイムスタンプ | はい |
| `--depositEnd <string>` | | 入金終了の Unix タイムスタンプ | はい |
| `--claimStart <string>` | | 請求開始の Unix タイムスタンプ | はい |
| `--claimEnd <string>` | | 請求終了の Unix タイムスタンプ（デフォルト: 遠い将来） | いいえ |
| `--minimumDeposit <string>` | | quote token の base units でのトランザクションあたりの最小入金額 | いいえ |
| `--depositLimit <string>` | | quote token の base units でのユーザーあたりの最大入金額 | いいえ |

### 価格設定

価格は以下のように計算されます：
```text {% title="Price formula" %}
price per token = quoteCap / allocation
```

**例**: 100 SOL の quote cap（`100000000000` lamports）/ 1,000,000 トークン（`1000000000000000` base units）= 1トークンあたり 0.0001 SOL

## 入金

`mplx genesis presale deposit` コマンドは、入金ウィンドウ中に Presale bucket に quote token を入金します。

```bash {% title="Presale への入金" %}
mplx genesis presale deposit <GENESIS_ADDRESS> --amount 10000000000 --bucketIndex 0
```

### オプション

| フラグ | 短縮形 | 説明 | 必須 |
|-------|--------|------|------|
| `--amount <string>` | `-a` | base units での quote token 量（例: lamports） | はい |
| `--bucketIndex <integer>` | `-b` | Presale bucket のインデックス（デフォルト: 0） | いいえ |

### 例

1. SOL をラップして 10 SOL を入金：
```bash {% title="Wrap and deposit" %}
mplx toolbox sol wrap 10
mplx genesis presale deposit <GENESIS_ADDRESS> --amount 10000000000 --bucketIndex 0
```

## 請求

`mplx genesis presale claim` コマンドは、請求期間開始後に Presale bucket から base token を請求します。

トークン割り当ては以下のように計算されます：
```text {% title="Claim formula" %}
userTokens = (userDeposit / quoteCap) * allocation
```

```bash {% title="Presale からの請求" %}
mplx genesis presale claim <GENESIS_ADDRESS> --bucketIndex 0
```

### オプション

| フラグ | 短縮形 | 説明 | 必須 |
|-------|--------|------|------|
| `--bucketIndex <integer>` | `-b` | Presale bucket のインデックス（デフォルト: 0） | いいえ |
| `--recipient <string>` | | 請求トークンの受取アドレス（デフォルト: 署名者） | いいえ |

### 例

1. 自分のウォレットに請求：
```bash {% title="Claim to self" %}
mplx genesis presale claim <GENESIS_ADDRESS> --bucketIndex 0
```

2. 別のウォレットに請求：
```bash {% title="Claim to another wallet" %}
mplx genesis presale claim <GENESIS_ADDRESS> --bucketIndex 0 --recipient <WALLET_ADDRESS>
```

## 完全なライフサイクルの例

```bash {% title="Complete presale lifecycle" %}
# 1. Create the token
mplx genesis create \
  --name "Example Token" \
  --symbol "EXM" \
  --totalSupply 1000000000000000 \
  --decimals 9

GENESIS=<GENESIS_ADDRESS>

# 2. Timestamps
NOW=$(date +%s)
DEPOSIT_END=$((NOW + 86400))
CLAIM_START=$((DEPOSIT_END + 1))
CLAIM_END=$((NOW + 31536000))

# 3. Add presale bucket: 1M tokens at 100 SOL cap
mplx genesis bucket add-presale $GENESIS \
  --allocation 1000000000000000 \
  --quoteCap 100000000000 \
  --bucketIndex 0 \
  --depositStart $NOW \
  --depositEnd $DEPOSIT_END \
  --claimStart $CLAIM_START \
  --claimEnd $CLAIM_END

# 4. Add unlocked bucket for team to receive SOL
mplx genesis bucket add-unlocked $GENESIS \
  --recipient $(solana address) \
  --claimStart $CLAIM_START \
  --allocation 0

# 5. Finalize
mplx genesis finalize $GENESIS

# 6. Verify
mplx genesis fetch $GENESIS
mplx genesis bucket fetch $GENESIS --bucketIndex 0 --type presale

# 7. Wrap SOL and deposit
mplx toolbox sol wrap 1
mplx genesis presale deposit $GENESIS --amount 1000000000 --bucketIndex 0

# 8. After deposit period, claim
mplx genesis presale claim $GENESIS --bucketIndex 0
```

## 一般的なエラー

| エラー | 原因 | 対処法 |
|-------|------|--------|
| Deposit period not active | 現在時刻が `depositStart`〜`depositEnd` の範囲外 | `genesis bucket fetch --type presale` でタイムスタンプを確認してください |
| Claim period not active | `claimStart` 前に請求しようとした | 請求開始タイムスタンプまでお待ちください |
| Presale full | 総入金額が `quoteCap` に達した | Presale は完全に埋まっています — これ以上の入金は受け付けられません |
| No wrapped SOL | ラップされていないネイティブ SOL を入金しようとした | まず `mplx toolbox sol wrap <amount>` を実行してください |
| Below minimum deposit | 入金額が `minimumDeposit` 未満 | 最小額を満たすように入金額を増やしてください |
| Exceeds deposit limit | ユーザーの総入金額が `depositLimit` を超過 | 入金額を減らしてください — ユーザーあたりの上限に達しています |
| Nothing to claim | ユーザーがこの Presale bucket に入金していない | 正しい `--bucketIndex` を確認し、入金ウィンドウ中に入金したことを確認してください |

## FAQ

**Presale の価格はどのように決まりますか？**
価格は `quoteCap / allocation` で計算されます。例えば、100 SOL の quote cap と 1,000,000 トークンの allocation の場合、1トークンあたり 0.0001 SOL になります。

**Presale が完全に埋まらなかった場合はどうなりますか？**
入金したユーザーは固定価格でトークンを受け取ります。未販売のトークンは bucket に残ります。

**Presale に入金制限を設定できますか？**
はい。トランザクションあたりの最小額には `--minimumDeposit` を、ユーザーあたりの最大額には `--depositLimit` を使用します。

**Presale からのトークン割り当てをどのように計算しますか？**
あなたのトークン = `(あなたの入金額 / quoteCap) * allocation`。100 SOL キャップで100万トークン割り当ての Presale に 1 SOL 入金した場合、10,000 トークンを受け取ります。

**Presale と Launch Pool の違いは何ですか？**
Presale は `quoteCap / allocation` で設定された固定価格です。Launch Pool は動的価格で、各ユーザーの総入金額に対するシェアに基づいてトークンが比例配分されます。

## 用語集

| 用語 | 定義 |
|------|------|
| **Presale** | `quoteCap / allocation` で決定される固定価格でトークンを販売する bucket タイプ |
| **Quote Cap** | Presale が受け入れる quote token の最大総量 — allocation と合わせてトークン価格を決定 |
| **Allocation** | この Presale bucket で利用可能な base token 量（base units） |
| **Deposit Limit** | 単一ユーザーが入金できる quote token の最大量 |
| **Minimum Deposit** | 入金トランザクションあたりの最小 quote token 量 |
| **Fixed Price** | `quoteCap / allocation` で計算されるトークンあたりのコスト — 需要によって変動しません |
