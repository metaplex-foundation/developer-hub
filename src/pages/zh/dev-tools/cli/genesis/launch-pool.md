---
title: Launch Pool
metaTitle: Launch Pool | Metaplex CLI
description: 使用 Metaplex CLI 创建 Launch Pool bucket、存入、提取、转换和领取代币。
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
  - q: Launch Pool 中的代币如何分发？
    a: 代币按比例分发。如果您存入了池中总报价代币的 10%，您将获得该 bucket 基础代币分配的 10%。
  - q: 存入后可以提取吗？
    a: 可以，但仅在存款期间有效。存款窗口关闭后，将无法再提取。
  - q: 什么是 end behavior？
    a: End behavior 在存款期结束后将收集的报价代币从 Launch Pool 转发到目标 bucket（通常是 unlocked bucket）。使用 transition 命令执行它们。
  - q: 什么是 claim schedule？
    a: Claim schedule 为代币领取添加归属机制——代币随时间逐步释放，而不是一次性全部发放，可选设置 cliff 期。
---

{% callout title="您将执行的操作" %}
从 CLI 运行完整的 Launch Pool 生命周期：
- 添加带分配额和时间窗口的 Launch Pool bucket
- 配置可选的罚金、归属和白名单
- 存入、提取、转换和领取代币
{% /callout %}

## 摘要

Launch Pool 在窗口期收集存款并按比例分发代币。本页涵盖完整的 Launch Pool 生命周期——从创建 bucket 到领取代币。

- **分发方式**：按比例——您的存款份额决定您的代币份额
- **命令**：`bucket add-launch-pool`、`deposit`、`withdraw`、`transition`、`claim`
- **可选功能**：End behavior、存款/提取罚金、奖励计划、领取归属、白名单
- **报价代币**：默认为 Wrapped SOL——存入前请先包装 SOL

## 超出范围

Presale bucket、unlocked bucket、Genesis 账户创建、finalize、前端集成、代币经济建模。

**跳转至：** [添加 Bucket](#add-launch-pool-bucket) · [存入](#deposit) · [提取](#withdraw) · [转换](#transition) · [领取](#claim) · [完整生命周期](#full-lifecycle-example) · [常见错误](#common-errors) · [常见问题](#faq)

## 添加 Launch Pool Bucket

`mplx genesis bucket add-launch-pool` 命令向 Genesis 账户添加一个 Launch Pool bucket。

```bash {% title="Add a launch pool bucket" %}
mplx genesis bucket add-launch-pool <GENESIS_ADDRESS> \
  --allocation 500000000000000 \
  --depositStart 1704067200 \
  --depositEnd 1704153600 \
  --claimStart 1704153601 \
  --claimEnd 1735689600
```

### 选项

| 标志 | 简写 | 描述 | 必需 |
|------|-------|-------------|----------|
| `--allocation <string>` | `-a` | 基本单位的基础代币分配额 | 是 |
| `--depositStart <string>` | | 存款开始的 Unix 时间戳 | 是 |
| `--depositEnd <string>` | | 存款关闭的 Unix 时间戳 | 是 |
| `--claimStart <string>` | | 领取开始的 Unix 时间戳 | 是 |
| `--claimEnd <string>` | | 领取关闭的 Unix 时间戳 | 是 |
| `--bucketIndex <integer>` | `-b` | Bucket 索引（默认：0） | 否 |
| `--endBehavior <string>` | | 格式：`<destinationBucketAddress>:<percentageBps>`，其中 `10000` = 100%。可多次指定 | 否 |
| `--minimumDeposit <string>` | | 每笔交易的最低存款额（基本单位） | 否 |
| `--depositLimit <string>` | | 每用户最大存款额（基本单位） | 否 |
| `--minimumQuoteTokenThreshold <string>` | | bucket 成功所需的最低报价代币总额 | 否 |
| `--depositPenalty <json>` | | 罚金计划 JSON | 否 |
| `--withdrawPenalty <json>` | | 提取罚金计划 JSON（与 depositPenalty 格式相同） | 否 |
| `--bonusSchedule <json>` | | 奖励计划 JSON | 否 |
| `--claimSchedule <json>` | | 领取归属计划 JSON | 否 |
| `--allowlist <json>` | | 白名单配置 JSON | 否 |

### JSON 选项格式

**罚金计划**（存款或提取）：
```json {% title="Penalty schedule format" %}
{"slopeBps":0,"interceptBps":200,"maxBps":200,"startTime":0,"endTime":0}
```

**奖励计划**：
```json {% title="Bonus schedule format" %}
{"slopeBps":0,"interceptBps":0,"maxBps":0,"startTime":0,"endTime":0}
```

**领取归属计划**：
```json {% title="Claim schedule format" %}
{"startTime":0,"endTime":0,"period":0,"cliffTime":0,"cliffAmountBps":0}
```

**白名单**：
```json {% title="Allowlist format" %}
{"merkleTreeHeight":10,"merkleRoot":"<hex>","endTime":0,"quoteCap":0}
```

### 示例

1. 基本 Launch Pool：
```bash {% title="Basic launch pool" %}
mplx genesis bucket add-launch-pool <GENESIS_ADDRESS> \
  --allocation 500000000000000 \
  --depositStart 1704067200 \
  --depositEnd 1704153600 \
  --claimStart 1704153601 \
  --claimEnd 1735689600
```

2. 带 end behavior 和最低存款额：
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

3. 带领取归属：
```bash {% title="With claim vesting" %}
mplx genesis bucket add-launch-pool <GENESIS_ADDRESS> \
  --allocation 500000000000000 \
  --depositStart 1704067200 \
  --depositEnd 1704153600 \
  --claimStart 1704153601 \
  --claimEnd 1735689600 \
  --claimSchedule '{"startTime":1704153601,"endTime":1735689600,"period":86400,"cliffTime":1704240000,"cliffAmountBps":1000}'
```

## 存入

`mplx genesis deposit` 命令在存款窗口期间将报价代币存入 Launch Pool bucket。如果使用 SOL 作为报价代币，请先包装。

```bash {% title="Deposit into launch pool" %}
mplx genesis deposit <GENESIS_ADDRESS> --amount 10000000000 --bucketIndex 0
```

### 选项

| 标志 | 简写 | 描述 | 必需 |
|------|-------|-------------|----------|
| `--amount <string>` | `-a` | 基本单位的报价代币金额（例如 lamports） | 是 |
| `--bucketIndex <integer>` | `-b` | Launch Pool bucket 的索引（默认：0） | 否 |

### 示例

1. 包装 SOL 并存入 10 SOL：
```bash {% title="Wrap and deposit" %}
mplx toolbox sol wrap 10
mplx genesis deposit <GENESIS_ADDRESS> --amount 10000000000 --bucketIndex 0
```

## 提取

`mplx genesis withdraw` 命令从 Launch Pool bucket 提取报价代币。仅在存款期间可用。

```bash {% title="Withdraw from launch pool" %}
mplx genesis withdraw <GENESIS_ADDRESS> --amount 5000000000 --bucketIndex 0
```

### 选项

| 标志 | 简写 | 描述 | 必需 |
|------|-------|-------------|----------|
| `--amount <string>` | `-a` | 要提取的报价代币金额（基本单位） | 是 |
| `--bucketIndex <integer>` | `-b` | Launch Pool bucket 的索引（默认：0） | 否 |

## 转换

`mplx genesis transition` 命令在存款期结束后执行 end behavior，将收集的报价代币转移到目标 bucket。

```bash {% title="Transition end behaviors" %}
mplx genesis transition <GENESIS_ADDRESS> --bucketIndex 0
```

### 选项

| 标志 | 简写 | 描述 | 必需 |
|------|-------|-------------|----------|
| `--bucketIndex <integer>` | `-b` | Launch Pool bucket 的索引 | 是 |

### 注意事项

- 必须在存款期结束后调用
- 仅在 bucket 配置了 end behavior 时才需要

## 领取

`mplx genesis claim` 命令从 Launch Pool bucket 领取基础代币。用户按其存款比例获得代币。

```bash {% title="Claim from launch pool" %}
mplx genesis claim <GENESIS_ADDRESS> --bucketIndex 0
```

### 选项

| 标志 | 简写 | 描述 | 必需 |
|------|-------|-------------|----------|
| `--bucketIndex <integer>` | `-b` | Launch Pool bucket 的索引（默认：0） | 否 |
| `--recipient <string>` | | 领取代币的接收地址（默认：签名者） | 否 |

### 示例

1. 领取到自己的钱包：
```bash {% title="Claim to self" %}
mplx genesis claim <GENESIS_ADDRESS> --bucketIndex 0
```

2. 领取到其他钱包：
```bash {% title="Claim to another wallet" %}
mplx genesis claim <GENESIS_ADDRESS> --bucketIndex 0 --recipient <WALLET_ADDRESS>
```

## 完整生命周期示例

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

## 常见错误

| 错误 | 原因 | 修复方法 |
|-------|-------|-----|
| Deposit period not active | 当前时间在 `depositStart`–`depositEnd` 之外 | 使用 `genesis bucket fetch` 检查时间戳 |
| Claim period not active | 在 `claimStart` 之前领取 | 等待领取开始时间戳之后 |
| Withdrawal period ended | 存款窗口关闭后尝试提取 | 提取仅在存款期间可用 |
| No wrapped SOL | 存入原生 SOL 而不是 Wrapped SOL | 先运行 `mplx toolbox sol wrap <amount>` |
| Below minimum deposit | 存款金额低于 `minimumDeposit` | 增加存款金额以满足最低要求 |
| Exceeds deposit limit | 用户总存款超过 `depositLimit` | 减少存款金额——您已达到每用户上限 |
| End behavior not configured | 在未配置 end behavior 的 bucket 上运行 `transition` | Transition 仅在配置了 `--endBehavior` 的 bucket 上需要 |
| Deposit period not ended | 在存款关闭前运行 `transition` | 等待 `depositEnd` 时间戳之后 |

## 常见问题

**Launch Pool 中的代币如何分发？**
代币按比例分发。如果您存入了池中总报价代币的 10%，您将获得该 bucket 基础代币分配的 10%。

**存入后可以提取吗？**
可以，但仅在存款期间有效。存款窗口关闭后，将无法再提取。

**什么是 end behavior？**
End behavior 在存款期结束后将收集的报价代币从 Launch Pool 转发到目标 bucket（通常是 unlocked bucket）。您必须调用 `genesis transition` 来执行它们。

**什么是 claim schedule？**
Claim schedule 为代币领取添加归属机制。代币不是一次性全部发放，而是根据配置的 `period`、`cliffTime` 和 `cliffAmountBps` 逐步释放。

**如果 minimumQuoteTokenThreshold 未达到会怎样？**
如果总存款未达到阈值，该 bucket 不会成功，存款人可以收回其资金。

**可以将 end behavior 拆分到多个目标吗？**
可以。多次指定 `--endBehavior`，使用不同的目标地址和百分比（以基点为单位，总计 10000）。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Launch Pool** | 根据存款份额按比例分发代币的 bucket 类型 |
| **End Behavior** | 在存款关闭后将收集的报价代币转发到目标 bucket 的规则 |
| **Transition** | 执行 end behavior 的命令——必须在存款期后显式调用 |
| **Claim Schedule** | 控制代币随时间逐步释放的归属配置 |
| **Deposit Penalty** | 对存款收取的费用，以基点配置，可选基于时间的斜率 |
| **Withdraw Penalty** | 在存款期间对提取收取的费用 |
| **Bonus Schedule** | 对早期或特定时间存款的额外代币分配 |
| **Allowlist** | 基于 Merkle 树的访问控制，限制谁可以存入 |
| **Basis Points (bps)** | 百分之一的百分比——10000 bps = 100%，100 bps = 1% |
