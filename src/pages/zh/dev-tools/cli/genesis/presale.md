---
title: Presale
metaTitle: Presale | Metaplex CLI
description: 使用 Metaplex CLI 创建 Presale bucket、存入和领取 Genesis Presale 代币。
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
  - q: How is the presale price determined?
    a: 价格按 quoteCap 除以 allocation 计算。例如，100 SOL 的 quoteCap 和 1,000,000 代币分配 = 每个代币 0.0001 SOL。
  - q: What happens if the presale doesn't fill completely?
    a: 已存入的用户仍然按固定价格获得代币。未售出的代币留在 bucket 中。
  - q: Can I set deposit limits on a presale?
    a: 可以。使用 minimumDeposit 设置每笔交易最低额度，使用 depositLimit 设置每用户最高额度。
  - q: How do I calculate my token allocation from a presale?
    a: 您的代币 = (您的存入额 / quoteCap) * allocation。如果您在 100 SOL 上限、100 万代币分配的 Presale 中存入了 1 SOL，您将获得 10,000 个代币。
---

{% callout title="您将完成的操作" %}
从 CLI 运行完整的 Presale 生命周期：
- 添加带有固定价格代币分配的 Presale bucket
- 在销售窗口期间存入报价代币
- 在预定价格下领取基础代币
{% /callout %}

## 概要

Presale 以由 `quoteCap / allocation` 确定的固定价格出售代币。本页涵盖完整的 Presale 生命周期——从创建 bucket 到领取代币。

- **分配方式**：固定价格——`quoteCap / allocation` 确定每个代币的成本
- **命令**：`bucket add-presale`、`presale deposit`、`presale claim`
- **价格示例**：100 SOL 报价上限 / 1,000,000 个代币 = 每个代币 0.0001 SOL
- **报价代币**：默认为 Wrapped SOL——存入前请先包装 SOL

## 不在范围内

Launch Pool bucket、unlocked bucket、end behavior、Genesis 账户创建、finalize、前端集成。

**跳转到：** [添加 Bucket](#add-presale-bucket) · [存入](#deposit) · [领取](#claim) · [完整生命周期](#full-lifecycle-example) · [常见错误](#common-errors) · [常见问题](#faq)

*由 Metaplex Foundation 维护 · 最后验证于 2026 年 2 月 · 需要 Metaplex CLI (mplx)*

## 添加 Presale Bucket

`mplx genesis bucket add-presale` 命令向 Genesis 账户添加 Presale bucket。

```bash {% title="添加 Presale bucket" %}
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

| 参数 | 缩写 | 描述 | 必需 |
|------|-------|-------------|----------|
| `--allocation <string>` | `-a` | 基本单位的基础代币分配量 | 是 |
| `--quoteCap <string>` | | 接受的报价代币总量——决定价格 | 是 |
| `--bucketIndex <integer>` | `-b` | Bucket 索引 | 是 |
| `--depositStart <string>` | | 存款开放的 Unix 时间戳 | 是 |
| `--depositEnd <string>` | | 存款关闭的 Unix 时间戳 | 是 |
| `--claimStart <string>` | | 领取开放的 Unix 时间戳 | 是 |
| `--claimEnd <string>` | | 领取关闭的 Unix 时间戳（默认为遥远的未来） | 否 |
| `--minimumDeposit <string>` | | 每笔交易的最低存入额（报价代币基本单位） | 否 |
| `--depositLimit <string>` | | 每用户最高存入额（报价代币基本单位） | 否 |

### 定价

价格计算方式：
```text {% title="价格公式" %}
price per token = quoteCap / allocation
```

**示例**：100 SOL 报价上限（`100000000000` lamports）/ 1,000,000 个代币（`1000000000000000` 基本单位）= 每个代币 0.0001 SOL

## 存入

`mplx genesis presale deposit` 命令在存款窗口期间将报价代币存入 Presale bucket。

```bash {% title="存入 Presale" %}
mplx genesis presale deposit <GENESIS_ADDRESS> --amount 10000000000 --bucketIndex 0
```

### 选项

| 参数 | 缩写 | 描述 | 必需 |
|------|-------|-------------|----------|
| `--amount <string>` | `-a` | 基本单位的报价代币数量（例如 lamports） | 是 |
| `--bucketIndex <integer>` | `-b` | Presale bucket 的索引（默认：0） | 否 |

### 示例

1. 包装 SOL 并存入 10 SOL：
```bash {% title="包装并存入" %}
mplx toolbox sol wrap 10
mplx genesis presale deposit <GENESIS_ADDRESS> --amount 10000000000 --bucketIndex 0
```

## 领取

`mplx genesis presale claim` 命令在领取期开始后从 Presale bucket 领取基础代币。

代币分配计算方式：
```text {% title="领取公式" %}
userTokens = (userDeposit / quoteCap) * allocation
```

```bash {% title="从 Presale 领取" %}
mplx genesis presale claim <GENESIS_ADDRESS> --bucketIndex 0
```

### 选项

| 参数 | 缩写 | 描述 | 必需 |
|------|-------|-------------|----------|
| `--bucketIndex <integer>` | `-b` | Presale bucket 的索引（默认：0） | 否 |
| `--recipient <string>` | | 领取代币的接收地址（默认：签名者） | 否 |

### 示例

1. 领取到自己的钱包：
```bash {% title="领取到自己" %}
mplx genesis presale claim <GENESIS_ADDRESS> --bucketIndex 0
```

2. 领取到其他钱包：
```bash {% title="领取到其他钱包" %}
mplx genesis presale claim <GENESIS_ADDRESS> --bucketIndex 0 --recipient <WALLET_ADDRESS>
```

## 完整生命周期示例

```bash {% title="完整 Presale 生命周期" %}
# 1. 创建代币
mplx genesis create \
  --name "Example Token" \
  --symbol "EXM" \
  --totalSupply 1000000000000000 \
  --decimals 9

GENESIS=<GENESIS_ADDRESS>

# 2. 时间戳
NOW=$(date +%s)
DEPOSIT_END=$((NOW + 86400))
CLAIM_START=$((DEPOSIT_END + 1))
CLAIM_END=$((NOW + 31536000))

# 3. 添加 Presale bucket：100 万个代币，100 SOL 上限
mplx genesis bucket add-presale $GENESIS \
  --allocation 1000000000000000 \
  --quoteCap 100000000000 \
  --bucketIndex 0 \
  --depositStart $NOW \
  --depositEnd $DEPOSIT_END \
  --claimStart $CLAIM_START \
  --claimEnd $CLAIM_END

# 4. 添加 unlocked bucket 以便团队接收 SOL
mplx genesis bucket add-unlocked $GENESIS \
  --recipient $(solana address) \
  --claimStart $CLAIM_START \
  --allocation 0

# 5. Finalize
mplx genesis finalize $GENESIS

# 6. 验证
mplx genesis fetch $GENESIS
mplx genesis bucket fetch $GENESIS --bucketIndex 0 --type presale

# 7. 包装 SOL 并存入
mplx toolbox sol wrap 1
mplx genesis presale deposit $GENESIS --amount 1000000000 --bucketIndex 0

# 8. 存款期结束后，领取
mplx genesis presale claim $GENESIS --bucketIndex 0
```

## 常见错误

| 错误 | 原因 | 修复方法 |
|-------|-------|-----|
| Deposit period not active | 当前时间在 `depositStart`–`depositEnd` 之外 | 使用 `genesis bucket fetch --type presale` 检查时间戳 |
| Claim period not active | 在 `claimStart` 之前领取 | 等待领取开始时间戳之后 |
| Presale full | 总存入额已达到 `quoteCap` | Presale 已满额——不再接受存款 |
| No wrapped SOL | 存入原生 SOL 而非包装 SOL | 先运行 `mplx toolbox sol wrap <amount>` |
| Below minimum deposit | 存入金额低于 `minimumDeposit` | 增加存入金额以满足最低要求 |
| Exceeds deposit limit | 用户总存入额超过 `depositLimit` | 减少存入金额——您已达到每用户上限 |
| Nothing to claim | 用户在此 Presale bucket 中没有存款 | 验证正确的 `--bucketIndex` 并确认您在窗口期间已存入 |

## 常见问题

**Presale 价格如何确定？**
价格按 `quoteCap / allocation` 计算。例如，100 SOL 报价上限和 1,000,000 代币分配 = 每个代币 0.0001 SOL。

**如果 Presale 没有完全售罄会怎样？**
已存入的用户仍然按固定价格获得代币。未售出的代币留在 bucket 中。

**可以在 Presale 上设置存入限额吗？**
可以。使用 `--minimumDeposit` 设置每笔交易最低额度，使用 `--depositLimit` 设置每用户最高额度。

**如何计算我在 Presale 中的代币分配？**
您的代币 = `(您的存入额 / quoteCap) * allocation`。如果您在 100 SOL 上限、100 万代币分配的 Presale 中存入了 1 SOL，您将获得 10,000 个代币。

**Presale 和 Launch Pool 有什么区别？**
Presale 有由 `quoteCap / allocation` 设定的固定价格。Launch Pool 有动态价格——代币根据每个用户在总存款中的份额按比例分配。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Presale** | 以由 `quoteCap / allocation` 确定的固定价格出售代币的 bucket 类型 |
| **Quote Cap** | Presale 接受的最大报价代币总量——与 allocation 一起决定代币价格 |
| **Allocation** | 此 Presale bucket 中可用的基础代币数量，以基本单位表示 |
| **Deposit Limit** | 单个用户可以存入的最大报价代币数量 |
| **Minimum Deposit** | 每笔存入交易的最低报价代币数量 |
| **Fixed Price** | 每个代币的成本，按 `quoteCap / allocation` 计算——不随需求变化 |
