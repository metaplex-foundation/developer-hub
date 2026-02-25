---
title: Presale
metaTitle: Presale | Metaplex CLI
description: Metaplex CLIを使用してPresale bucketの作成、入金、Genesis Presaleからのトークン請求を行います。
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
  - bucket add-presaleでallocation、quoteCap、タイムウィンドウを指定してPresale bucketを追加
  - genesis finalizeでGenesisアカウントをファイナライズしてローンチを有効化
  - SOLをラップし、入金期間中にクォートトークンを入金
  - 請求期間開始後に固定価格でベーストークンを請求
howToTools:
  - Metaplex CLI (mplx)
  - Solana CLI
faqs:
  - q: How is the presale price determined?
    a: 価格はquoteCap割るallocationで計算されます。例えば、100 SOLのquoteCapと1,000,000トークンの割り当てで、1トークンあたり0.0001 SOLになります。
  - q: What happens if the presale doesn't fill completely?
    a: 入金したユーザーは固定価格でトークンを受け取ります。未販売のトークンはbucketに残ります。
  - q: Can I set deposit limits on a presale?
    a: はい。minimumDepositで1回の取引あたりの最小額を、depositLimitでユーザーあたりの最大額を設定できます。
  - q: How do I calculate my token allocation from a presale?
    a: 受取トークン = (入金額 / quoteCap) * allocation。100 SOLキャップに1 SOL入金し、100万トークン割り当ての場合、10,000トークンを受け取ります。
---

{% callout title="実行内容" %}
CLIからPresaleのライフサイクル全体を実行:
- 固定価格トークン割り当てのPresale bucketを追加
- 販売期間中にクォートトークンを入金
- 事前に決定された価格でベーストークンを請求
{% /callout %}

## 概要

Presaleは`quoteCap / allocation`で決定される固定価格でトークンを販売します。このページではPresaleのライフサイクル全体 — bucketの作成からトークンの請求までを説明します。

- **配布方法**: 固定価格 — `quoteCap / allocation`がトークンあたりのコストを決定
- **コマンド**: `bucket add-presale`、`presale deposit`、`presale claim`
- **価格例**: 100 SOLクォートキャップ / 1,000,000トークン = 1トークンあたり0.0001 SOL
- **クォートトークン**: デフォルトはWrapped SOL — 入金前にSOLをラップしてください

## 対象範囲外

Launch Pool bucket、unlocked bucket、エンドビヘイビア、Genesisアカウントの作成、ファイナライズ、フロントエンド統合。

**ジャンプ先:** [Bucketの追加](#add-presale-bucket) · [入金](#deposit) · [請求](#claim) · [ライフサイクル全体の例](#full-lifecycle-example) · [よくあるエラー](#common-errors) · [FAQ](#faq)

*Metaplex Foundationによる管理 · 最終検証 2026年2月 · Metaplex CLI（mplx）が必要*

## Presale Bucketの追加

`mplx genesis bucket add-presale`コマンドは、GenesisアカウントにPresale bucketを追加します。

```bash {% title="Presale bucketの追加" %}
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

| フラグ | 短縮 | 説明 | 必須 |
|--------|------|------|------|
| `--allocation <string>` | `-a` | 基本単位でのベーストークン割り当て | はい |
| `--quoteCap <string>` | | 受け付ける総クォートトークン量 — 価格を決定 | はい |
| `--bucketIndex <integer>` | `-b` | Bucketインデックス | はい |
| `--depositStart <string>` | | 入金開始のUnixタイムスタンプ | はい |
| `--depositEnd <string>` | | 入金終了のUnixタイムスタンプ | はい |
| `--claimStart <string>` | | 請求開始のUnixタイムスタンプ | はい |
| `--claimEnd <string>` | | 請求終了のUnixタイムスタンプ（デフォルト: 遠い将来） | いいえ |
| `--minimumDeposit <string>` | | 1回の取引あたりの最小入金額（クォートトークン基本単位） | いいえ |
| `--depositLimit <string>` | | ユーザーあたりの最大入金額（クォートトークン基本単位） | いいえ |

### 価格設定

価格は次のように計算されます:
```text {% title="価格の計算式" %}
price per token = quoteCap / allocation
```

**例**: 100 SOLクォートキャップ（`100000000000` lamports）/ 1,000,000トークン（`1000000000000000`基本単位）= 1トークンあたり0.0001 SOL

## 入金

`mplx genesis presale deposit`コマンドは、入金期間中にPresale bucketにクォートトークンを入金します。

```bash {% title="Presaleへの入金" %}
mplx genesis presale deposit <GENESIS_ADDRESS> --amount 10000000000 --bucketIndex 0
```

### オプション

| フラグ | 短縮 | 説明 | 必須 |
|--------|------|------|------|
| `--amount <string>` | `-a` | 基本単位でのクォートトークン量（例: lamports） | はい |
| `--bucketIndex <integer>` | `-b` | Presale bucketのインデックス（デフォルト: 0） | いいえ |

### 例

1. SOLをラップして10 SOLを入金:
```bash {% title="ラップして入金" %}
mplx toolbox sol wrap 10
mplx genesis presale deposit <GENESIS_ADDRESS> --amount 10000000000 --bucketIndex 0
```

## 請求

`mplx genesis presale claim`コマンドは、請求期間開始後にPresale bucketからベーストークンを請求します。

トークン割り当ては次のように計算されます:
```text {% title="請求の計算式" %}
userTokens = (userDeposit / quoteCap) * allocation
```

```bash {% title="Presaleからの請求" %}
mplx genesis presale claim <GENESIS_ADDRESS> --bucketIndex 0
```

### オプション

| フラグ | 短縮 | 説明 | 必須 |
|--------|------|------|------|
| `--bucketIndex <integer>` | `-b` | Presale bucketのインデックス（デフォルト: 0） | いいえ |
| `--recipient <string>` | | 請求したトークンの受取アドレス（デフォルト: 署名者） | いいえ |

### 例

1. 自分のウォレットに請求:
```bash {% title="自分へ請求" %}
mplx genesis presale claim <GENESIS_ADDRESS> --bucketIndex 0
```

2. 別のウォレットに請求:
```bash {% title="別のウォレットへ請求" %}
mplx genesis presale claim <GENESIS_ADDRESS> --bucketIndex 0 --recipient <WALLET_ADDRESS>
```

## ライフサイクル全体の例

```bash {% title="Presaleの完全なライフサイクル" %}
# 1. トークンの作成
mplx genesis create \
  --name "Example Token" \
  --symbol "EXM" \
  --totalSupply 1000000000000000 \
  --decimals 9

GENESIS=<GENESIS_ADDRESS>

# 2. タイムスタンプ
NOW=$(date +%s)
DEPOSIT_END=$((NOW + 86400))
CLAIM_START=$((DEPOSIT_END + 1))
CLAIM_END=$((NOW + 31536000))

# 3. Presale bucketを追加: 100 SOLキャップで100万トークン
mplx genesis bucket add-presale $GENESIS \
  --allocation 1000000000000000 \
  --quoteCap 100000000000 \
  --bucketIndex 0 \
  --depositStart $NOW \
  --depositEnd $DEPOSIT_END \
  --claimStart $CLAIM_START \
  --claimEnd $CLAIM_END

# 4. チームのSOL受け取り用unlocked bucketを追加
mplx genesis bucket add-unlocked $GENESIS \
  --recipient $(solana address) \
  --claimStart $CLAIM_START \
  --allocation 0

# 5. ファイナライズ
mplx genesis finalize $GENESIS

# 6. 確認
mplx genesis fetch $GENESIS
mplx genesis bucket fetch $GENESIS --bucketIndex 0 --type presale

# 7. SOLをラップして入金
mplx toolbox sol wrap 1
mplx genesis presale deposit $GENESIS --amount 1000000000 --bucketIndex 0

# 8. 入金期間後に請求
mplx genesis presale claim $GENESIS --bucketIndex 0
```

## よくあるエラー

| エラー | 原因 | 修正方法 |
|--------|------|----------|
| Deposit period not active | 現在時刻が`depositStart`～`depositEnd`の範囲外 | `genesis bucket fetch --type presale`でタイムスタンプを確認してください |
| Claim period not active | `claimStart`前に請求しようとした | 請求開始タイムスタンプまで待ってください |
| Presale full | 総入金額が`quoteCap`に達した | Presaleは完売です — これ以上の入金は受け付けられません |
| No wrapped SOL | ラップされていないネイティブSOLを入金しようとした | 先に`mplx toolbox sol wrap <amount>`を実行してください |
| Below minimum deposit | 入金額が`minimumDeposit`未満 | 最小値を満たすよう入金額を増やしてください |
| Exceeds deposit limit | ユーザーの総入金額が`depositLimit`を超過 | 入金額を減らしてください — ユーザーごとの上限に達しています |
| Nothing to claim | このPresale bucketにユーザーの入金がない | 正しい`--bucketIndex`を確認し、入金期間中に入金したか確認してください |

## FAQ

**Presaleの価格はどのように決まりますか？**
価格は`quoteCap / allocation`で計算されます。例えば、100 SOLのクォートキャップと1,000,000トークンの割り当てで、1トークンあたり0.0001 SOLになります。

**Presaleが完売しない場合はどうなりますか？**
入金したユーザーは固定価格でトークンを受け取ります。未販売のトークンはbucketに残ります。

**Presaleに入金制限を設定できますか？**
はい。`--minimumDeposit`で1回の取引あたりの最小額を、`--depositLimit`でユーザーあたりの最大額を設定できます。

**Presaleからのトークン割り当てはどのように計算しますか？**
受取トークン = `(入金額 / quoteCap) * allocation`。100 SOLキャップに1 SOL入金し、100万トークン割り当ての場合、10,000トークンを受け取ります。

**PresaleとLaunch Poolの違いは何ですか？**
Presaleは`quoteCap / allocation`で設定される固定価格です。Launch Poolは動的な価格です — 各ユーザーの総入金額に対するシェアに基づいてトークンが比例配分されます。

## 用語集

| 用語 | 定義 |
|------|------|
| **Presale** | `quoteCap / allocation`で決定される固定価格でトークンを販売するbucketタイプ |
| **Quote Cap** | Presaleが受け付ける最大総クォートトークン量 — allocationと合わせてトークン価格を決定 |
| **Allocation** | このPresale bucketで利用可能なベーストークン量（基本単位） |
| **Deposit Limit** | 1人のユーザーが入金できる最大クォートトークン量 |
| **Minimum Deposit** | 1回の入金取引あたりの最小クォートトークン量 |
| **Fixed Price** | `quoteCap / allocation`で計算されるトークンあたりのコスト — 需要によって変動しない |
