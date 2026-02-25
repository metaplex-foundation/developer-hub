---
title: Presale
metaTitle: Presale | Metaplex CLI
description: 使用 Metaplex CLI 创建 Presale bucket、存入和领取 Genesis Presale 中的代币。
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
  - q: Presale 价格如何确定？
    a: 价格计算方式为 quoteCap 除以 allocation。例如，100 SOL 的 quoteCap 和 1,000,000 代币的 allocation = 每个代币 0.0001 SOL。
  - q: 如果 Presale 没有完全售罄会怎样？
    a: 已存入的用户仍然按固定价格获得代币。未售出的代币保留在 bucket 中。
  - q: 可以在 Presale 上设置存款限制吗？
    a: 可以。使用 minimumDeposit 设置每笔交易最低额度，使用 depositLimit 设置每用户最大额度。
  - q: 如何计算我从 Presale 中的代币分配？
    a: 您的代币 = (您的存款 / quoteCap) * allocation。如果您向 100 SOL 上限、100 万代币分配的池中存入 1 SOL，您将获得 10,000 个代币。
---

{% callout title="您将执行的操作" %}
从 CLI 运行完整的 Presale 生命周期：
- 添加带固定价格代币分配的 Presale bucket
- 在销售窗口期间存入报价代币
- 按预定价格领取基础代币
{% /callout %}

## 摘要

Presale 以由 `quoteCap / allocation` 决定的固定价格出售代币。本页涵盖完整的 Presale 生命周期——从创建 bucket 到领取代币。

- **分发方式**：固定价格——`quoteCap / allocation` 决定每个代币的成本
- **命令**：`bucket add-presale`、`presale deposit`、`presale claim`
- **价格示例**：100 SOL 报价上限 / 1,000,000 代币 = 每个代币 0.0001 SOL
- **报价代币**：默认为 Wrapped SOL——存入前请先包装 SOL

## 超出范围

Launch Pool bucket、unlocked bucket、end behavior、Genesis 账户创建、finalize、前端集成。

**跳转至：** [添加 Bucket](#add-presale-bucket) · [存入](#deposit) · [领取](#claim) · [完整生命周期](#full-lifecycle-example) · [常见错误](#common-errors) · [常见问题](#faq)

*由 Metaplex Foundation 维护 · 最近验证于 2026 年 2 月 · 需要 Metaplex CLI (mplx)*

## 添加 Presale Bucket

`mplx genesis bucket add-presale` 命令向 Genesis 账户添加一个 Presale bucket。

```bash {% title="Add a presale bucket" %}
mplx genesis bucket add-presale <GENESIS_ADDRESS> \
  --allocation 1000000000000000 \
  --quoteCap 100000000000 \
  --bucketIndex 0 \
  --depositStart 1704067200 \
  --depositEnd 1704153600 \
  --claimStart 1704153601 \
  --claimEnd 1735689600
```

### 选项

| 标志 | 简写 | 描述 | 必需 |
|------|-------|-------------|----------|
| `--allocation <string>` | `-a` | 基本单位的基础代币分配额 | 是 |
| `--quoteCap <string>` | | 接受的报价代币总额——决定价格 | 是 |
| `--bucketIndex <integer>` | `-b` | Bucket 索引 | 是 |
| `--depositStart <string>` | | 存款开始的 Unix 时间戳 | 是 |
| `--depositEnd <string>` | | 存款关闭的 Unix 时间戳 | 是 |
| `--claimStart <string>` | | 领取开始的 Unix 时间戳 | 是 |
| `--claimEnd <string>` | | 领取关闭的 Unix 时间戳（默认为遥远的未来） | 否 |
| `--minimumDeposit <string>` | | 每笔交易的最低存款额（报价代币基本单位） | 否 |
| `--depositLimit <string>` | | 每用户最大存款额（报价代币基本单位） | 否 |

### 定价

价格计算公式：
```text {% title="Price formula" %}
price per token = quoteCap / allocation
```

**示例**：100 SOL 报价上限（`100000000000` lamports）/ 1,000,000 代币（`1000000000000000` 基本单位）= 每个代币 0.0001 SOL

## 存入

`mplx genesis presale deposit` 命令在存款窗口期间将报价代币存入 Presale bucket。

```bash {% title="Deposit into presale" %}
mplx genesis presale deposit <GENESIS_ADDRESS> --amount 10000000000 --bucketIndex 0
```

### 选项

| 标志 | 简写 | 描述 | 必需 |
|------|-------|-------------|----------|
| `--amount <string>` | `-a` | 基本单位的报价代币金额（例如 lamports） | 是 |
| `--bucketIndex <integer>` | `-b` | Presale bucket 的索引（默认：0） | 否 |

### 示例

1. 包装 SOL 并存入 10 SOL：
```bash {% title="Wrap and deposit" %}
mplx toolbox sol wrap 10
mplx genesis presale deposit <GENESIS_ADDRESS> --amount 10000000000 --bucketIndex 0
```

## 领取

`mplx genesis presale claim` 命令在领取期开始后从 Presale bucket 领取基础代币。

代币分配计算方式：
```text {% title="Claim formula" %}
userTokens = (userDeposit / quoteCap) * allocation
```

```bash {% title="Claim from presale" %}
mplx genesis presale claim <GENESIS_ADDRESS> --bucketIndex 0
```

### 选项

| 标志 | 简写 | 描述 | 必需 |
|------|-------|-------------|----------|
| `--bucketIndex <integer>` | `-b` | Presale bucket 的索引（默认：0） | 否 |
| `--recipient <string>` | | 领取代币的接收地址（默认：签名者） | 否 |

### 示例

1. 领取到自己的钱包：
```bash {% title="Claim to self" %}
mplx genesis presale claim <GENESIS_ADDRESS> --bucketIndex 0
```

2. 领取到其他钱包：
```bash {% title="Claim to another wallet" %}
mplx genesis presale claim <GENESIS_ADDRESS> --bucketIndex 0 --recipient <WALLET_ADDRESS>
```

## 完整生命周期示例

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

## 常见错误

| 错误 | 原因 | 修复方法 |
|-------|-------|-----|
| Deposit period not active | 当前时间在 `depositStart`–`depositEnd` 之外 | 使用 `genesis bucket fetch --type presale` 检查时间戳 |
| Claim period not active | 在 `claimStart` 之前领取 | 等待领取开始时间戳之后 |
| Presale full | 总存款已达到 `quoteCap` | Presale 已满额认购——不再接受存款 |
| No wrapped SOL | 存入原生 SOL 而不是 Wrapped SOL | 先运行 `mplx toolbox sol wrap <amount>` |
| Below minimum deposit | 存款金额低于 `minimumDeposit` | 增加存款金额以满足最低要求 |
| Exceeds deposit limit | 用户总存款超过 `depositLimit` | 减少存款金额——您已达到每用户上限 |
| Nothing to claim | 用户在此 Presale bucket 中没有存款 | 验证正确的 `--bucketIndex` 并确认您在窗口期间进行了存款 |

## 常见问题

**Presale 价格如何确定？**
价格计算方式为 `quoteCap / allocation`。例如，100 SOL 报价上限和 1,000,000 代币分配 = 每个代币 0.0001 SOL。

**如果 Presale 没有完全售罄会怎样？**
已存入的用户仍然按固定价格获得代币。未售出的代币保留在 bucket 中。

**可以在 Presale 上设置存款限制吗？**
可以。使用 `--minimumDeposit` 设置每笔交易最低额度，使用 `--depositLimit` 设置每用户最大额度。

**如何计算我从 Presale 中的代币分配？**
您的代币 = `(您的存款 / quoteCap) * allocation`。如果您向 100 SOL 上限、100 万代币分配的池中存入 1 SOL，您将获得 10,000 个代币。

**Presale 和 Launch Pool 有什么区别？**
Presale 有由 `quoteCap / allocation` 设定的固定价格。Launch Pool 有动态价格——代币根据每个用户在总存款中的份额按比例分发。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Presale** | 以由 `quoteCap / allocation` 决定的固定价格出售代币的 bucket 类型 |
| **Quote Cap** | Presale 接受的最大报价代币总额——与 allocation 一起决定代币价格 |
| **Allocation** | 此 Presale bucket 中可用的基础代币数量，以基本单位表示 |
| **Deposit Limit** | 单个用户可以存入的最大报价代币数量 |
| **Minimum Deposit** | 每笔存款交易的最低报价代币数量 |
| **Fixed Price** | 每个代币的成本，计算方式为 `quoteCap / allocation`——不随需求变化 |
