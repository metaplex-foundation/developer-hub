---
title: 入门指南
metaTitle: Genesis - 入门指南 | 代币发行流程
description: 了解 Genesis 代币发行流程。学习从初始化到分发的各个步骤，以及如何规划您的发行活动。
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - Genesis tutorial
  - token launch flow
  - Genesis setup
  - TGE steps
  - launch planning
about:
  - Genesis flow
  - Launch lifecycle
  - Token distribution
proficiencyLevel: Beginner
faqs:
  - q: 初始化 Genesis Account 会创建什么？
    a: 它会创建一个带有元数据的新 SPL 代币、一个主协调账户，并将总代币供应量托管以便分发。
  - q: Finalize 后还能添加更多 Bucket 吗？
    a: 不能。Finalize 是永久性的。Finalize 后您无法添加更多 Bucket 或更改配置。
  - q: inflow 和 outflow Bucket 有什么区别？
    a: Inflow Bucket 从用户处收集 SOL（Launch Pool、Presale）。Outflow Bucket 接收代币或 SOL 用于团队/国库领取。
  - q: 发行活动何时激活？
    a: Finalize 后，发行活动将根据您的 Bucket 时间条件（开始时间戳）激活。
  - q: 如何计算带小数位的代币供应量？
    a: 将您想要的供应量乘以 10^decimals。对于 100 万个带 9 位小数的代币，使用 1,000,000,000,000,000。
---

在开始构建之前，请先了解 Genesis 代币发行流程。本指南解释从初始化到分发的每个步骤，帮助您规划发行活动。 {% .lead %}

{% callout title="准备好开始构建了吗？" %}
一旦您了解了流程：
- **[JavaScript SDK](/zh/smart-contracts/genesis/sdk/javascript)** - 安装和函数参考
- **[Launch Pool](/zh/smart-contracts/genesis/launch-pool)** - 按比例分发的完整教程
- **[Presale](/zh/smart-contracts/genesis/presale)** - 固定价格销售的完整教程
{% /callout %}

## Genesis 流程

每个 Genesis 发行都遵循以下生命周期：

```
┌─────────────────────────────────────────────────────────────────┐
│  1. INITIALIZE                                                   │
│     Create Genesis Account → Mint token → Hold supply in escrow │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. ADD BUCKETS                                                  │
│     Configure distribution (Launch Pool, Presale, Treasury)     │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. FINALIZE                                                     │
│     Lock configuration → Activate time conditions               │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│  4. DEPOSIT PERIOD                                               │
│     Users deposit SOL based on bucket type                      │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│  5. TRANSITION                                                   │
│     Execute end behaviors → Route funds to treasury             │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│  6. CLAIM PERIOD                                                 │
│     Users claim tokens → Team claims raised funds               │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│  7. POST-LAUNCH (Optional)                                       │
│     Revoke mint/freeze authorities for security                 │
└─────────────────────────────────────────────────────────────────┘
```

## 第 1 步：Initialize

**发生的事情：** 您创建一个 Genesis Account，它会铸造您的代币并将全部供应量托管。

**您需要提供：**
- 代币元数据（名称、符号、URI）
- 总供应量（含小数位）
- 报价代币（通常是 wSOL）

**结果：** 一个新的 SPL 代币被创建，由 Genesis Account 控制直到分发。

### 代币供应量规划

SPL 代币默认使用 9 位小数：

| 期望供应量 | 使用 9 位小数 |
|----------------|-----------------|
| 1 个代币 | 1,000,000,000 |
| 1,000 个代币 | 1,000,000,000,000 |
| 100 万个代币 | 1,000,000,000,000,000 |
| 10 亿个代币 | 1,000,000,000,000,000,000 |

**重要提示：** 您的总供应量必须等于所有 Bucket 分配的总和。

## 第 2 步：添加 Bucket

**发生的事情：** 您通过添加 Bucket 来配置代币的分发方式。

### Bucket 类型

| Bucket | 类型 | 用途 |
|--------|------|---------|
| **Launch Pool** | Inflow | 根据存款按比例分发 |
| **Presale** | Inflow | 有上限的固定价格销售 |
| **Unlocked** | Outflow | 接收募集资金的国库 |

### 配置示例

一个典型的发行使用：

1. **Inflow Bucket**（Launch Pool 或 Presale）- 从参与者处收集 SOL
2. **Outflow Bucket**（Unlocked）- 接收收集的 SOL 用于团队/国库

```
Token Allocation Example (1 million tokens):
├── Launch Pool: 800,000 tokens (80%)
└── Unlocked:    200,000 tokens (20% team allocation)

Fund Flow:
Users deposit SOL → Launch Pool → End Behavior → Unlocked Bucket → Team claims
```

### 时间条件

每个 Bucket 有四个时间条件：

| 条件 | 控制内容 |
|-----------|----------|
| Deposit Start | 用户何时可以开始存款 |
| Deposit End | 存款何时关闭 |
| Claim Start | 用户何时可以领取代币 |
| Claim End | 领取何时关闭 |

使用 Unix 时间戳（秒，而非毫秒）。

## 第 3 步：Finalize

**发生的事情：** 配置永久锁定。发行活动根据时间条件激活。

### Finalize 前后对比

| 之前 | 之后 |
|--------|-------|
| 可以添加 Bucket | 不能再添加 Bucket |
| 可以修改设置 | 设置已锁定 |
| 发行未激活 | 发行已激活（根据时间条件） |

{% callout type="warning" %}
**Finalize 是不可逆的。** 在 Finalize 之前，请仔细检查您的 Bucket 分配、时间条件和结束行为。
{% /callout %}

## 第 4 步：存款期

**发生的事情：** 用户向您的 inflow Bucket 存入 SOL。

- **Launch Pool：** 用户存入 SOL，可以支付 {% fee product="genesis" config="launchPool" fee="withdraw" /%} 费用后提取
- **Presale：** 用户以固定价格存入 SOL，有每用户存款上限（每个用户可贡献的最大金额）

所有存款都适用 {% fee product="genesis" config="launchPool" fee="deposit" /%} 协议费。

## 第 5 步：Transition

**发生的事情：** 存款关闭后，执行结束行为以路由资金。

常见的结束行为：将 100% 收集的 SOL 发送到 Unlocked Bucket（国库）。

您可以将资金分配到多个目的地：
- 80% 到国库
- 20% 到流动性池 Bucket

## 第 6 步：领取期

**发生的事情：**
- 用户根据其存款领取代币
- 团队从 Unlocked Bucket 领取募集的 SOL

### 代币分发

**Launch Pool：** `用户代币 = (用户存款 / 总存款) × Bucket 分配`

**Presale：** `用户代币 = 用户存款 / 每代币价格`

## 第 7 步：发行后（可选）

**发生的事情：** 为安全起见撤销代币权限。

- **铸币权限** - 撤销后将无法再铸造更多代币
- **冻结权限** - 撤销后代币将永远无法被冻结

这向持有者和 rug checker 表明代币供应量是固定的。

{% callout type="warning" %}
权限撤销是不可逆的。只有在您的发行活动完成后才执行此操作。
{% /callout %}

## 常见错误

| 错误 | 原因 | 解决方案 |
|-------|-------|----------|
| `already finalized` | 尝试在 Finalize 后修改 | 创建新的 Genesis Account |
| `invalid total supply` | Bucket 分配与供应量不匹配 | 确保分配总和等于总量 |
| `time conditions overlap` | 时间戳冲突 | 使用顺序时间窗口 |
| `deposit period not active` | 在存款窗口外 | 检查时间戳 |

## 规划清单

在开始构建之前：

- [ ] 决定发行机制（Launch Pool 还是 Presale）
- [ ] 计算带小数位的总代币供应量
- [ ] 规划 Bucket 分配（必须等于总供应量）
- [ ] 设置时间窗口（存款开始/结束，领取开始/结束）
- [ ] 决定结束行为（资金流向何处？）
- [ ] 准备代币元数据（名称、符号、图片 URI）

## 常见问题

### 初始化 Genesis Account 会创建什么？
它会创建一个带有元数据的新 SPL 代币、一个主协调账户（Genesis Account PDA），并铸造总供应量托管以便分发。

### Finalize 后还能添加更多 Bucket 吗？
不能。Finalize 是永久性的。您无法添加更多 Bucket 或更改配置。在 Finalize 之前规划好您完整的 Bucket 结构。

### inflow 和 outflow Bucket 有什么区别？
**Inflow Bucket** 从用户处收集 SOL（Launch Pool、Presale）。**Outflow Bucket** 通过结束行为接收代币或 SOL——通常是用于团队/国库领取的 Unlocked Bucket。

### 发行活动何时激活？
Finalize 后，发行活动根据您的 Bucket 时间条件激活。当前时间在 Bucket 的存款窗口内时，用户可以参与。

### 如何计算带小数位的代币供应量？
将您想要的供应量乘以 10^decimals。对于 100 万个带 9 位小数的代币：1,000,000 × 1,000,000,000 = 1,000,000,000,000,000。

### 我可以使用 SOL 以外的代币进行存款吗？
可以。将 `quoteMint` 设置为任何 SPL 代币。但是，wSOL 是以 SOL 计价的发行活动的标准选择。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Genesis Account** | 协调发行并持有代币的 PDA |
| **Inflow Bucket** | 从用户处收集存款的 Bucket |
| **Outflow Bucket** | 通过结束行为接收资金的 Bucket |
| **Finalize** | 锁定配置并激活发行 |
| **Time Condition** | 控制 Bucket 阶段的 Unix 时间戳 |
| **End Behavior** | 存款期结束时的自动操作 |
| **Transition** | 执行结束行为的指令 |
| **Quote Token** | 用户存入的代币（通常是 wSOL） |

## 下一步

准备好开始构建了吗？选择您的发行类型：

1. **[JavaScript SDK](/zh/smart-contracts/genesis/sdk/javascript)** - 安装和配置
2. **[Launch Pool 教程](/zh/smart-contracts/genesis/launch-pool)** - 按比例分发
3. **[Presale 教程](/zh/smart-contracts/genesis/presale)** - 固定价格销售
