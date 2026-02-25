---
title: Launch Pool
metaTitle: Launch Pool | Metaplex CLI
description: Metaplex CLI を使用して Launch Pool bucket の作成、入金、出金、トランジション、トークンの請求を行います。
keywords:
  - launch pool
  - genesis launch pool
  - token distribution
  - proportional distribution
  - mplx genesis deposit
about:
  - launch pool bucket
  - proportional token distribution
  - deposit and claim lifecycle
  - end behaviors
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
howToSteps:
  - Add a launch pool bucket with allocation and time windows using bucket add-launch-pool
  - Optionally configure end behaviors, penalties, vesting, and allowlists
  - Wrap SOL and deposit quote tokens during the deposit window
  - Transition collected funds to destination buckets after deposits close (if end behaviors are set)
  - Claim base tokens proportional to your deposit after the claim period opens
howToTools:
  - Metaplex CLI (mplx)
  - Solana CLI
faqs:
  - q: Launch Pool ではトークンはどのように配布されますか？
    a: トークンは比例配分されます。プール内の総 quote token の10%を入金した場合、bucket の base token 割り当ての10%を受け取ります。
  - q: 入金後に出金できますか？
    a: はい。ただし入金期間中のみです。入金ウィンドウが閉じた後は出金できません。
  - q: End behavior とは何ですか？
    a: End behavior は、入金期間終了後に Launch Pool から収集された quote token を宛先 bucket（通常は unlocked bucket）に転送します。実行には transition コマンドを使用します。
  - q: Claim schedule とは何ですか？
    a: Claim schedule はトークン請求にべスティングを追加します。トークンは一度にすべて受け取るのではなく、オプションのクリフ期間を含めて段階的にリリースされます。
---

{% callout title="このページで行うこと" %}
CLI から Launch Pool の完全なライフサイクルを実行：
- 割り当てと時間ウィンドウを指定して Launch Pool bucket を追加
- オプションのペナルティ、べスティング、allowlist を設定
- 入金、出金、トランジション、トークンの請求
{% /callout %}

## 概要

Launch Pool は入金ウィンドウ中に入金を収集し、トークンを比例配分します。このページでは、bucket の作成からトークンの請求までの完全な Launch Pool ライフサイクルを説明します。

- **配布方法**: 比例配分 — 入金シェアがトークンシェアを決定
- **コマンド**: `bucket add-launch-pool`、`deposit`、`withdraw`、`transition`、`claim`
- **オプション機能**: End behavior、入金/出金ペナルティ、ボーナススケジュール、請求べスティング、allowlist
- **Quote token**: デフォルトは Wrapped SOL — 入金前に SOL をラップしてください

## 対象外

Presale bucket、unlocked bucket、Genesis アカウントの作成、ファイナライズ、フロントエンド統合、トークンエコノミクスのモデリング。


## Launch Pool bucket の追加

`mplx genesis bucket add-launch-pool` コマンドは、Genesis アカウントに Launch Pool bucket を追加します。

```bash {% title="Launch Pool bucket の追加" %}
mplx genesis bucket add-launch-pool <GENESIS_ADDRESS> \
  --allocation 500000000000000 \
  --depositStart 1704067200 \
  --depositEnd 1704153600 \
  --claimStart 1704153601 \
  --claimEnd 1735689600
```

### オプション

| フラグ | 短縮形 | 説明 | 必須 |
|-------|--------|------|------|
| `--allocation <string>` | `-a` | base units での base token 割り当て | はい |
| `--depositStart <string>` | | 入金開始の Unix タイムスタンプ | はい |
| `--depositEnd <string>` | | 入金終了の Unix タイムスタンプ | はい |
| `--claimStart <string>` | | 請求開始の Unix タイムスタンプ | はい |
| `--claimEnd <string>` | | 請求終了の Unix タイムスタンプ | はい |
| `--bucketIndex <integer>` | `-b` | bucket インデックス（デフォルト: 0） | いいえ |
| `--endBehavior <string>` | | 形式: `<destinationBucketAddress>:<percentageBps>`（`10000` = 100%）。複数回指定可能 | いいえ |
| `--minimumDeposit <string>` | | トランザクションあたりの最小入金額（base units） | いいえ |
| `--depositLimit <string>` | | ユーザーあたりの最大入金額（base units） | いいえ |
| `--minimumQuoteTokenThreshold <string>` | | bucket が成功するために必要な最小 quote token 合計額 | いいえ |
| `--depositPenalty <json>` | | ペナルティスケジュール JSON | いいえ |
| `--withdrawPenalty <json>` | | 出金ペナルティスケジュール JSON（depositPenalty と同じ形式） | いいえ |
| `--bonusSchedule <json>` | | ボーナススケジュール JSON | いいえ |
| `--claimSchedule <json>` | | 請求べスティングスケジュール JSON | いいえ |
| `--allowlist <json>` | | allowlist 設定 JSON | いいえ |

### JSON オプションの形式

**ペナルティスケジュール**（入金または出金）：
```json {% title="Penalty schedule format" %}
{"slopeBps":0,"interceptBps":200,"maxBps":200,"startTime":0,"endTime":0}
```

**ボーナススケジュール**：
```json {% title="Bonus schedule format" %}
{"slopeBps":0,"interceptBps":0,"maxBps":0,"startTime":0,"endTime":0}
```

**請求べスティングスケジュール**：
```json {% title="Claim schedule format" %}
{"startTime":0,"endTime":0,"period":0,"cliffTime":0,"cliffAmountBps":0}
```

**Allowlist**：
```json {% title="Allowlist format" %}
{"merkleTreeHeight":10,"merkleRoot":"<hex>","endTime":0,"quoteCap":0}
```

### 例

1. 基本的な Launch Pool：
```bash {% title="Basic launch pool" %}
mplx genesis bucket add-launch-pool <GENESIS_ADDRESS> \
  --allocation 500000000000000 \
  --depositStart 1704067200 \
  --depositEnd 1704153600 \
  --claimStart 1704153601 \
  --claimEnd 1735689600
```

2. End behavior と最小入金額付き：
```bash {% title="With end behavior" %}
mplx genesis bucket add-launch-pool <GENESIS_ADDRESS> \
  --allocation 500000000000000 \
  --depositStart 1704067200 \
  --depositEnd 1704153600 \
  --claimStart 1704153601 \
  --claimEnd 1735689600 \
  --endBehavior "<DESTINATION_BUCKET_ADDRESS>:10000" \
  --minimumDeposit 100000000
```

3. 請求べスティング付き：
```bash {% title="With claim vesting" %}
mplx genesis bucket add-launch-pool <GENESIS_ADDRESS> \
  --allocation 500000000000000 \
  --depositStart 1704067200 \
  --depositEnd 1704153600 \
  --claimStart 1704153601 \
  --claimEnd 1735689600 \
  --claimSchedule '{"startTime":1704153601,"endTime":1735689600,"period":86400,"cliffTime":1704240000,"cliffAmountBps":1000}'
```

## 入金

`mplx genesis deposit` コマンドは、入金ウィンドウ中に Launch Pool bucket に quote token を入金します。SOL を quote token として使用する場合は、先にラップしてください。

```bash {% title="Launch Pool への入金" %}
mplx genesis deposit <GENESIS_ADDRESS> --amount 10000000000 --bucketIndex 0
```

### オプション

| フラグ | 短縮形 | 説明 | 必須 |
|-------|--------|------|------|
| `--amount <string>` | `-a` | base units での quote token 量（例: lamports） | はい |
| `--bucketIndex <integer>` | `-b` | Launch Pool bucket のインデックス（デフォルト: 0） | いいえ |

### 例

1. SOL をラップして 10 SOL を入金：
```bash {% title="Wrap and deposit" %}
mplx toolbox sol wrap 10
mplx genesis deposit <GENESIS_ADDRESS> --amount 10000000000 --bucketIndex 0
```

## 出金

`mplx genesis withdraw` コマンドは、Launch Pool bucket から quote token を出金します。入金期間中のみ利用可能です。

```bash {% title="Launch Pool からの出金" %}
mplx genesis withdraw <GENESIS_ADDRESS> --amount 5000000000 --bucketIndex 0
```

### オプション

| フラグ | 短縮形 | 説明 | 必須 |
|-------|--------|------|------|
| `--amount <string>` | `-a` | 出金する quote token 量（base units） | はい |
| `--bucketIndex <integer>` | `-b` | Launch Pool bucket のインデックス（デフォルト: 0） | いいえ |

## トランジション

`mplx genesis transition` コマンドは、入金期間終了後に end behavior を実行し、収集された quote token を宛先 bucket に移動します。

```bash {% title="End behavior のトランジション" %}
mplx genesis transition <GENESIS_ADDRESS> --bucketIndex 0
```

### オプション

| フラグ | 短縮形 | 説明 | 必須 |
|-------|--------|------|------|
| `--bucketIndex <integer>` | `-b` | Launch Pool bucket のインデックス | はい |

### 注意事項

- 入金期間終了後に呼び出す必要があります
- bucket に end behavior が設定されている場合のみ必要です

## 請求

`mplx genesis claim` コマンドは、Launch Pool bucket から base token を請求します。ユーザーは入金額に比例してトークンを受け取ります。

```bash {% title="Launch Pool からの請求" %}
mplx genesis claim <GENESIS_ADDRESS> --bucketIndex 0
```

### オプション

| フラグ | 短縮形 | 説明 | 必須 |
|-------|--------|------|------|
| `--bucketIndex <integer>` | `-b` | Launch Pool bucket のインデックス（デフォルト: 0） | いいえ |
| `--recipient <string>` | | 請求トークンの受取アドレス（デフォルト: 署名者） | いいえ |

### 例

1. 自分のウォレットに請求：
```bash {% title="Claim to self" %}
mplx genesis claim <GENESIS_ADDRESS> --bucketIndex 0
```

2. 別のウォレットに請求：
```bash {% title="Claim to another wallet" %}
mplx genesis claim <GENESIS_ADDRESS> --bucketIndex 0 --recipient <WALLET_ADDRESS>
```

## 完全なライフサイクルの例

```bash {% title="Complete launch pool lifecycle" %}
# 1. Create the Genesis account
mplx genesis create \
  --name "My Token" \
  --symbol "MTK" \
  --totalSupply 1000000000000000 \
  --decimals 9

# (copy GENESIS_ADDRESS from output)
GENESIS=<GENESIS_ADDRESS>

# 2. Timestamps
NOW=$(date +%s)
DEPOSIT_END=$((NOW + 86400))
CLAIM_START=$((DEPOSIT_END + 1))
CLAIM_END=$((NOW + 31536000))

# 3. Add a launch pool bucket with end behavior
mplx genesis bucket add-launch-pool $GENESIS \
  --allocation 500000000000000 \
  --depositStart $NOW \
  --depositEnd $DEPOSIT_END \
  --claimStart $CLAIM_START \
  --claimEnd $CLAIM_END \
  --endBehavior "<UNLOCKED_BUCKET_ADDRESS>:10000"

# 4. Add an unlocked bucket to receive SOL
mplx genesis bucket add-unlocked $GENESIS \
  --recipient $(solana address) \
  --claimStart $CLAIM_START \
  --allocation 0

# 5. Finalize
mplx genesis finalize $GENESIS

# 6. Wrap SOL and deposit
mplx toolbox sol wrap 10
mplx genesis deposit $GENESIS --amount 10000000000 --bucketIndex 0

# 7. After deposit period, transition
mplx genesis transition $GENESIS --bucketIndex 0

# 8. Claim tokens
mplx genesis claim $GENESIS --bucketIndex 0

# 9. Revoke mint authority
mplx genesis revoke $GENESIS --revokeMint
```

## 一般的なエラー

| エラー | 原因 | 対処法 |
|-------|------|--------|
| Deposit period not active | 現在時刻が `depositStart`〜`depositEnd` の範囲外 | `genesis bucket fetch` でタイムスタンプを確認してください |
| Claim period not active | `claimStart` 前に請求しようとした | 請求開始タイムスタンプまでお待ちください |
| Withdrawal period ended | 入金ウィンドウ終了後に出金しようとした | 出金は入金期間中のみ可能です |
| No wrapped SOL | ラップされていないネイティブ SOL を入金しようとした | まず `mplx toolbox sol wrap <amount>` を実行してください |
| Below minimum deposit | 入金額が `minimumDeposit` 未満 | 最小額を満たすように入金額を増やしてください |
| Exceeds deposit limit | ユーザーの総入金額が `depositLimit` を超過 | 入金額を減らしてください — ユーザーあたりの上限に達しています |
| End behavior not configured | end behavior が設定されていない bucket で `transition` を実行した | トランジションは `--endBehavior` が設定された bucket でのみ必要です |
| Deposit period not ended | 入金終了前に `transition` を実行した | `depositEnd` タイムスタンプまでお待ちください |

## FAQ

**Launch Pool ではトークンはどのように配布されますか？**
トークンは比例配分されます。プール内の総 quote token の10%を入金した場合、bucket の base token 割り当ての10%を受け取ります。

**入金後に出金できますか？**
はい。ただし入金期間中のみです。入金ウィンドウが閉じた後は出金できません。

**End behavior とは何ですか？**
End behavior は、入金期間終了後に Launch Pool から収集された quote token を宛先 bucket（通常は unlocked bucket）に転送します。実行には `genesis transition` を呼び出す必要があります。

**Claim schedule とは何ですか？**
Claim schedule はトークン請求にべスティングを追加します。すべてのトークンを一度に受け取るのではなく、設定された `period`、`cliffTime`、`cliffAmountBps` に基づいて段階的にリリースされます。

**minimumQuoteTokenThreshold が満たされない場合はどうなりますか？**
総入金額がしきい値に達しない場合、bucket は成功せず、入金者は資金を回収できます。

**End behavior を複数の宛先に分割できますか？**
はい。`--endBehavior` を異なる宛先アドレスとパーセンテージ（basis points で指定、合計 10000）で複数回指定してください。

## 用語集

| 用語 | 定義 |
|------|------|
| **Launch Pool** | 入金シェアに基づいてトークンを比例配分する bucket タイプ |
| **End Behavior** | 入金終了後に収集された quote token を宛先 bucket に転送するルール |
| **Transition** | End behavior を実行するコマンド — 入金期間後に明示的に呼び出す必要があります |
| **Claim Schedule** | 段階的なトークンリリースを制御するべスティング設定 |
| **Deposit Penalty** | 入金に適用される手数料。basis points で設定し、オプションの時間ベースの傾斜あり |
| **Withdraw Penalty** | 入金期間中の出金に適用される手数料 |
| **Bonus Schedule** | 早期入金または特定タイミングの入金に対する追加トークン割り当て |
| **Allowlist** | 入金可能なユーザーを制限する Merkle ツリーベースのアクセス制御 |
| **Basis Points (bps)** | パーセントの100分の1 — 10000 bps = 100%、100 bps = 1% |
