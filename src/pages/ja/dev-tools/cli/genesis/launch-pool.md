---
title: Launch Pool
metaTitle: Launch Pool | Metaplex CLI
description: Metaplex CLIを使用してLaunch Pool bucketの作成、入金、出金、トランジション、トークンの請求を行います。
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
  - bucket add-launch-poolで割り当てとタイムウィンドウを指定してLaunch Pool bucketを追加
  - 必要に応じてエンドビヘイビア、ペナルティ、ベスティング、許可リストを設定
  - SOLをラップし、入金期間中にクォートトークンを入金
  - エンドビヘイビアが設定されている場合、入金終了後にtransitionで収集した資金を宛先bucketに転送
  - 請求期間開始後に入金額に比例したベーストークンを請求
howToTools:
  - Metaplex CLI (mplx)
  - Solana CLI
faqs:
  - q: How are tokens distributed in a launch pool?
    a: トークンは比例配分されます。プール内の総クォートトークンの10%を入金した場合、bucketのベーストークン割り当ての10%を受け取ります。
  - q: Can I withdraw after depositing?
    a: はい。ただし入金期間中のみです。入金期間終了後は出金できません。
  - q: What are end behaviors?
    a: エンドビヘイビアは、入金期間終了後にLaunch Poolから収集されたクォートトークンを宛先bucket（通常はunlocked bucket）に転送します。transitionコマンドで実行します。
  - q: What is a claim schedule?
    a: Claim scheduleはトークン請求にベスティングを追加します — トークンは一度にすべてではなく、時間をかけて徐々にリリースされ、オプションのクリフ期間があります。
---

{% callout title="実行内容" %}
CLIからLaunch Poolのライフサイクル全体を実行:
- 割り当てとタイムウィンドウを指定してLaunch Pool bucketを追加
- オプションのペナルティ、ベスティング、許可リストを設定
- 入金、出金、トランジション、トークンの請求
{% /callout %}

## 概要

Launch Poolは入金期間中に入金を集め、トークンを比例配分します。このページではLaunch Poolのライフサイクル全体 — bucketの作成からトークンの請求までを説明します。

- **配布方法**: 比例配分 — 入金のシェアがトークンのシェアを決定
- **コマンド**: `bucket add-launch-pool`、`deposit`、`withdraw`、`transition`、`claim`
- **オプション機能**: エンドビヘイビア、入金/出金ペナルティ、ボーナススケジュール、請求ベスティング、許可リスト
- **クォートトークン**: デフォルトはWrapped SOL — 入金前にSOLをラップしてください

## 対象範囲外

Presale bucket、unlocked bucket、Genesisアカウントの作成、ファイナライズ、フロントエンド統合、トークンエコノミクスのモデリング。

**ジャンプ先:** [Bucketの追加](#add-launch-pool-bucket) · [入金](#deposit) · [出金](#withdraw) · [トランジション](#transition) · [請求](#claim) · [ライフサイクル全体の例](#full-lifecycle-example) · [よくあるエラー](#common-errors) · [FAQ](#faq)

## Launch Pool Bucketの追加

`mplx genesis bucket add-launch-pool`コマンドは、GenesisアカウントにLaunch Pool bucketを追加します。

```bash {% title="Launch Pool bucketの追加" %}
mplx genesis bucket add-launch-pool <GENESIS_ADDRESS> \
  --allocation 500000000000000 \
  --depositStart 1704067200 \
  --depositEnd 1704153600 \
  --claimStart 1704153601 \
  --claimEnd 1735689600
```

### オプション

| フラグ | 短縮 | 説明 | 必須 |
|--------|------|------|------|
| `--allocation <string>` | `-a` | 基本単位でのベーストークン割り当て | はい |
| `--depositStart <string>` | | 入金開始のUnixタイムスタンプ | はい |
| `--depositEnd <string>` | | 入金終了のUnixタイムスタンプ | はい |
| `--claimStart <string>` | | 請求開始のUnixタイムスタンプ | はい |
| `--claimEnd <string>` | | 請求終了のUnixタイムスタンプ | はい |
| `--bucketIndex <integer>` | `-b` | Bucketインデックス（デフォルト: 0） | いいえ |
| `--endBehavior <string>` | | 形式: `<destinationBucketAddress>:<percentageBps>`（`10000` = 100%）。複数回指定可能 | いいえ |
| `--minimumDeposit <string>` | | 1回の取引あたりの最小入金額（基本単位） | いいえ |
| `--depositLimit <string>` | | ユーザーあたりの最大入金額（基本単位） | いいえ |
| `--minimumQuoteTokenThreshold <string>` | | bucketが成功するために必要な最小総クォートトークン | いいえ |
| `--depositPenalty <json>` | | ペナルティスケジュールJSON | いいえ |
| `--withdrawPenalty <json>` | | 出金ペナルティスケジュールJSON（depositPenaltyと同じ形式） | いいえ |
| `--bonusSchedule <json>` | | ボーナススケジュールJSON | いいえ |
| `--claimSchedule <json>` | | 請求ベスティングスケジュールJSON | いいえ |
| `--allowlist <json>` | | 許可リスト設定JSON | いいえ |

### JSONオプションの形式

**ペナルティスケジュール**（入金または出金）:
```json {% title="ペナルティスケジュールの形式" %}
{"slopeBps":0,"interceptBps":200,"maxBps":200,"startTime":0,"endTime":0}
```

**ボーナススケジュール**:
```json {% title="ボーナススケジュールの形式" %}
{"slopeBps":0,"interceptBps":0,"maxBps":0,"startTime":0,"endTime":0}
```

**請求ベスティングスケジュール**:
```json {% title="Claim scheduleの形式" %}
{"startTime":0,"endTime":0,"period":0,"cliffTime":0,"cliffAmountBps":0}
```

**許可リスト**:
```json {% title="許可リストの形式" %}
{"merkleTreeHeight":10,"merkleRoot":"<hex>","endTime":0,"quoteCap":0}
```

### 例

1. 基本的なLaunch Pool:
```bash {% title="基本的なLaunch Pool" %}
mplx genesis bucket add-launch-pool <GENESIS_ADDRESS> \
  --allocation 500000000000000 \
  --depositStart 1704067200 \
  --depositEnd 1704153600 \
  --claimStart 1704153601 \
  --claimEnd 1735689600
```

2. エンドビヘイビアと最小入金額付き:
```bash {% title="エンドビヘイビア付き" %}
mplx genesis bucket add-launch-pool <GENESIS_ADDRESS> \
  --allocation 500000000000000 \
  --depositStart 1704067200 \
  --depositEnd 1704153600 \
  --claimStart 1704153601 \
  --claimEnd 1735689600 \
  --endBehavior "<DESTINATION_BUCKET_ADDRESS>:10000" \
  --minimumDeposit 100000000
```

3. 請求ベスティング付き:
```bash {% title="請求ベスティング付き" %}
mplx genesis bucket add-launch-pool <GENESIS_ADDRESS> \
  --allocation 500000000000000 \
  --depositStart 1704067200 \
  --depositEnd 1704153600 \
  --claimStart 1704153601 \
  --claimEnd 1735689600 \
  --claimSchedule '{"startTime":1704153601,"endTime":1735689600,"period":86400,"cliffTime":1704240000,"cliffAmountBps":1000}'
```

## 入金

`mplx genesis deposit`コマンドは、入金期間中にLaunch Pool bucketにクォートトークンを入金します。SOLをクォートトークンとして使用する場合は、先にラップしてください。

```bash {% title="Launch Poolへの入金" %}
mplx genesis deposit <GENESIS_ADDRESS> --amount 10000000000 --bucketIndex 0
```

### オプション

| フラグ | 短縮 | 説明 | 必須 |
|--------|------|------|------|
| `--amount <string>` | `-a` | 基本単位でのクォートトークン量（例: lamports） | はい |
| `--bucketIndex <integer>` | `-b` | Launch Pool bucketのインデックス（デフォルト: 0） | いいえ |

### 例

1. SOLをラップして10 SOLを入金:
```bash {% title="ラップして入金" %}
mplx toolbox sol wrap 10
mplx genesis deposit <GENESIS_ADDRESS> --amount 10000000000 --bucketIndex 0
```

## 出金

`mplx genesis withdraw`コマンドは、Launch Pool bucketからクォートトークンを出金します。入金期間中のみ利用可能です。

```bash {% title="Launch Poolからの出金" %}
mplx genesis withdraw <GENESIS_ADDRESS> --amount 5000000000 --bucketIndex 0
```

### オプション

| フラグ | 短縮 | 説明 | 必須 |
|--------|------|------|------|
| `--amount <string>` | `-a` | 基本単位での出金するクォートトークン量 | はい |
| `--bucketIndex <integer>` | `-b` | Launch Pool bucketのインデックス（デフォルト: 0） | いいえ |

## トランジション

`mplx genesis transition`コマンドは、入金期間終了後にエンドビヘイビアを実行し、収集されたクォートトークンを宛先bucketに移動します。

```bash {% title="エンドビヘイビアのトランジション" %}
mplx genesis transition <GENESIS_ADDRESS> --bucketIndex 0
```

### オプション

| フラグ | 短縮 | 説明 | 必須 |
|--------|------|------|------|
| `--bucketIndex <integer>` | `-b` | Launch Pool bucketのインデックス | はい |

### 注意事項

- 入金期間終了後に呼び出す必要があります
- bucketにエンドビヘイビアが設定されている場合のみ必要です

## 請求

`mplx genesis claim`コマンドは、Launch Pool bucketからベーストークンを請求します。ユーザーは入金額に比例したトークンを受け取ります。

```bash {% title="Launch Poolからの請求" %}
mplx genesis claim <GENESIS_ADDRESS> --bucketIndex 0
```

### オプション

| フラグ | 短縮 | 説明 | 必須 |
|--------|------|------|------|
| `--bucketIndex <integer>` | `-b` | Launch Pool bucketのインデックス（デフォルト: 0） | いいえ |
| `--recipient <string>` | | 請求したトークンの受取アドレス（デフォルト: 署名者） | いいえ |

### 例

1. 自分のウォレットに請求:
```bash {% title="自分へ請求" %}
mplx genesis claim <GENESIS_ADDRESS> --bucketIndex 0
```

2. 別のウォレットに請求:
```bash {% title="別のウォレットへ請求" %}
mplx genesis claim <GENESIS_ADDRESS> --bucketIndex 0 --recipient <WALLET_ADDRESS>
```

## ライフサイクル全体の例

```bash {% title="Launch Poolの完全なライフサイクル" %}
# 1. Genesisアカウントの作成
mplx genesis create \
  --name "My Token" \
  --symbol "MTK" \
  --totalSupply 1000000000000000 \
  --decimals 9

# （出力からGENESIS_ADDRESSをコピー）
GENESIS=<GENESIS_ADDRESS>

# 2. タイムスタンプ
NOW=$(date +%s)
DEPOSIT_END=$((NOW + 86400))
CLAIM_START=$((DEPOSIT_END + 1))
CLAIM_END=$((NOW + 31536000))

# 3. エンドビヘイビア付きのLaunch Pool bucketを追加
mplx genesis bucket add-launch-pool $GENESIS \
  --allocation 500000000000000 \
  --depositStart $NOW \
  --depositEnd $DEPOSIT_END \
  --claimStart $CLAIM_START \
  --claimEnd $CLAIM_END \
  --endBehavior "<UNLOCKED_BUCKET_ADDRESS>:10000"

# 4. SOL受け取り用のunlocked bucketを追加
mplx genesis bucket add-unlocked $GENESIS \
  --recipient $(solana address) \
  --claimStart $CLAIM_START \
  --allocation 0

# 5. ファイナライズ
mplx genesis finalize $GENESIS

# 6. SOLをラップして入金
mplx toolbox sol wrap 10
mplx genesis deposit $GENESIS --amount 10000000000 --bucketIndex 0

# 7. 入金期間後にトランジション
mplx genesis transition $GENESIS --bucketIndex 0

# 8. トークンを請求
mplx genesis claim $GENESIS --bucketIndex 0

# 9. ミント権限を取り消し
mplx genesis revoke $GENESIS --revokeMint
```

## よくあるエラー

| エラー | 原因 | 修正方法 |
|--------|------|----------|
| Deposit period not active | 現在時刻が`depositStart`～`depositEnd`の範囲外 | `genesis bucket fetch`でタイムスタンプを確認してください |
| Claim period not active | `claimStart`前に請求しようとした | 請求開始タイムスタンプまで待ってください |
| Withdrawal period ended | 入金期間終了後に出金しようとした | 出金は入金期間中のみ可能です |
| No wrapped SOL | ラップされていないネイティブSOLを入金しようとした | 先に`mplx toolbox sol wrap <amount>`を実行してください |
| Below minimum deposit | 入金額が`minimumDeposit`未満 | 最小値を満たすよう入金額を増やしてください |
| Exceeds deposit limit | ユーザーの総入金額が`depositLimit`を超過 | 入金額を減らしてください — ユーザーごとの上限に達しています |
| End behavior not configured | エンドビヘイビアのないbucketで`transition`を実行 | transitionは`--endBehavior`が設定されたbucketでのみ必要です |
| Deposit period not ended | 入金終了前に`transition`を実行 | `depositEnd`タイムスタンプの後まで待ってください |

## FAQ

**Launch Poolではトークンはどのように配布されますか？**
トークンは比例配分されます。プール内の総クォートトークンの10%を入金した場合、bucketのベーストークン割り当ての10%を受け取ります。

**入金後に出金できますか？**
はい。ただし入金期間中のみです。入金期間終了後は出金できません。

**エンドビヘイビアとは何ですか？**
エンドビヘイビアは、入金期間終了後にLaunch Poolから収集されたクォートトークンを宛先bucket（通常はunlocked bucket）に転送します。`genesis transition`を呼び出して実行する必要があります。

**Claim scheduleとは何ですか？**
Claim scheduleはトークン請求にベスティングを追加します。すべてのトークンを一度に受け取る代わりに、設定された`period`、`cliffTime`、`cliffAmountBps`に基づいて徐々にリリースされます。

**minimumQuoteTokenThresholdが満たされない場合はどうなりますか？**
総入金額が閾値に達しない場合、bucketは成功せず、入金者は資金を取り戻すことができます。

**エンドビヘイビアを複数の宛先に分割できますか？**
はい。異なる宛先アドレスとパーセンテージ（ベーシスポイント、合計10000）で`--endBehavior`を複数回指定してください。

## 用語集

| 用語 | 定義 |
|------|------|
| **Launch Pool** | 入金シェアに基づいてトークンを比例配分するbucketタイプ |
| **End Behavior** | 入金終了後に収集されたクォートトークンを宛先bucketに転送するルール |
| **Transition** | エンドビヘイビアを実行するコマンド — 入金期間後に明示的に呼び出す必要がある |
| **Claim Schedule** | 時間をかけたトークンの段階的リリースを制御するベスティング設定 |
| **Deposit Penalty** | 入金に適用される手数料。ベーシスポイントで設定、オプションで時間ベースの傾斜あり |
| **Withdraw Penalty** | 入金期間中の出金に適用される手数料 |
| **Bonus Schedule** | 早期または特定タイミングの入金に対する追加トークン割り当て |
| **Allowlist** | 入金可能なユーザーを制限するMerkleツリーベースのアクセス制御 |
| **Basis Points (bps)** | パーセントの1/100 — 10000 bps = 100%、100 bps = 1% |
