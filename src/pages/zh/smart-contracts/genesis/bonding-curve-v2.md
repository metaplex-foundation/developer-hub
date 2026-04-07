---
title: 绑定曲线 V2 — 工作原理
metaTitle: Genesis 绑定曲线 V2 — 工作方式 | Metaplex
description: Genesis 绑定曲线 V2 的工作原理 — 恒定乘积定价、虚拟储备金、费用结构、首次购买机制、生命周期阶段以及向 Raydium 流动性池的毕业。
keywords:
  - bonding curve
  - bonding curve v2
  - constant product AMM
  - virtual reserves
  - token launch
  - Genesis
  - Metaplex
  - graduation
  - Raydium CPMM
  - AMM pricing
  - swap fee
  - creator fee
about:
  - Bonding Curve
  - Constant Product AMM
  - Token Launch
  - Genesis
proficiencyLevel: Intermediate
created: '03-30-2026'
updated: '03-30-2026'
faqs:
  - q: 绑定曲线发行和发行池有什么区别？
    a: 发行池有固定的存款窗口和批量价格发现机制——用户在窗口期存款，按比例获得代币。绑定曲线没有固定窗口，交换窗口开放后任何时候都可以买卖，SOL 流入时价格上涨，代币被卖回时价格下跌。
  - q: Genesis 绑定曲线 V2 为什么使用虚拟储备金？
    a: 在标准的 x × y = k 曲线中，最后几个代币的价格趋近无穷大，使得完全售罄变得不可能。虚拟储备金（初始化时添加的虚拟 SOL 和虚拟代币）设定了实用的起始价格，并塑造曲线使所有真实代币能以合理价格售罄。
  - q: 是什么触发了毕业，累积的 SOL 会怎样？
    a: 当曲线上的所有代币都售出时，毕业会自动发生，无需手动触发。累积的真实 SOL 会迁移到 Raydium CPMM 池中，用于持续的二级交易。
  - q: 协议费和创作者费会复合计算吗？
    a: 不会。两种费用都针对每次交换的总 SOL 金额独立计算。流入或流出曲线的净金额为总金额减去协议费再减去创作者费。
  - q: 第一个购买者需要支付费用吗？
    a: 不需要。当首次购买机制被配置时，指定购买者的初次购买免除所有费用（协议交换费和创作者费）。之后的所有交换均按正常费用收取。
  - q: 如果买单购买量超过曲线剩余代币数量会怎样？
    a: 系统会将输出钳制为剩余代币余额，并使用反向公式重新计算所需的 SOL 输入。交易不会失败，而是针对实际可用代币完成。
---

Genesis 绑定曲线 V2 是一种恒定乘积自动做市商，旨在完全售罄其代币供应并毕业进入 Raydium CPMM 池。 {% .lead %}

## Summary

Genesis 绑定曲线 V2 使用 `x × y = k` 恒定乘积定价模型和虚拟储备金，在 Solana 上实现确定性且持续可用的代币发行。

- **恒定乘积 AMM** — 遵循 `x × y = k`，SOL 流入时价格上涨，代币被卖回时价格下跌
- **虚拟储备金** — 初始化时设置的 SOL 和代币储备金，用于设定实用起始价格并使曲线能够完全售罄
- **三阶段生命周期** — Created（已创建）→ Active（活跃）→ Graduated（已毕业）。所有代币售出时自动毕业，将流动性迁移至 Raydium CPMM 池
- **两种费用类型** — 所有交易的协议交换费加上可选的创作者费。均应用于 SOL 侧且不复合计算

## 恒定乘积 AMM 定价

Genesis 绑定曲线 V2 使用与 Uniswap V2 和 Raydium 相同的 `x × y = k` 公式。任意时刻的价格由代币储备金与 SOL 储备金的比率决定。

### 绑定曲线需要虚拟储备金的原因

标准的 `x × y = k` 曲线在两端都有渐近线，不适合完全售罄的发行场景。

- **下限渐近线** — 发行时池中没有 SOL，购买者可以用极少量 SOL 耗尽所有代币
- **上限渐近线** — 最后几个代币的价格趋近无穷大，以实用价格完全售罄变得不可能

Genesis 绑定曲线 V2 通过用**虚拟储备金**（仅存在于定价数学中的虚拟 SOL 和虚拟代币）为曲线播种来解决这个问题。

### Genesis 绑定曲线 V2 的储备金记账

曲线维护两组储备金，组合用于 AMM 公式：

| 储备金 | 字段 | 描述 |
|--------|------|------|
| **虚拟 SOL** | `virtualSol` | 初始化时添加。设定起始价格。从未实际存入——仅存在于数学中。 |
| **虚拟代币** | `virtualTokens` | 初始化时添加。与虚拟 SOL 配对以锚定曲线。 |
| **真实 SOL** | `quoteTokenDepositTotal` | 购买者实际存入的 SOL。从 0 开始，每次购买时增加。 |
| **真实代币** | `bucket.baseTokenBalance` | 桶中剩余的真实代币。从全部分配开始，每次购买时减少。 |

AMM 公式使用的有效储备金：

```
totalSol    = virtualSol + realSol
totalTokens = virtualTokens + realTokens
k           = totalSol × totalTokens
```

以 SOL 为单位的当前代币价格：

```
price = (virtualTokens + realTokens) / (virtualSol + realSol)
```

### 交换价格公式

**买入（SOL 输入，代币输出）：**

```
inputReserve     = totalSol
outputReserve    = totalTokens

newInputReserve  = inputReserve + amountIn
newOutputReserve = ceil(k / newInputReserve)
tokensOut        = outputReserve - newOutputReserve
```

**卖出（代币输入，SOL 输出）：**

```
inputReserve     = totalTokens
outputReserve    = totalSol

newInputReserve  = inputReserve + amountIn
newOutputReserve = ceil(k / newInputReserve)
solOut           = outputReserve - newOutputReserve
```

向上取整除法（`ceil(k / x)`）确保恒定乘积不变式 `newInputReserve × (outputReserve − outputAmount) ≥ k` 永远不被违反。池只能增值，不会贬值。

### 反向计算：期望输出所需的输入

计算特定期望输出所需的输入量（在储备金耗尽时内部用于钳制处理）：

```
newOutputReserve = outputReserve - desiredAmountOut
newInputReserve  = ceil(k / newOutputReserve)
requiredAmountIn = newInputReserve - inputReserve
```

## 费用结构

无论方向如何，费用均应用于每次交换的 **SOL 侧**——买入时从 SOL 输入中扣除，卖出时从 SOL 输出中扣除。

### 协议交换费和创作者费

每次交换都需缴纳协议交换费。创作者可以选择在此基础上添加创作者费：

| 费用 | 设定者 | 接收方 |
|------|--------|--------|
| **协议交换费** | 协议（创作者不可配置） | Metaplex 费用钱包（`feeQuoteTokenAccount`） |
| **创作者费** | 创作者或 Agent（可选） | 累积在桶中（`creatorFeeAccrued`）；通过无权限的 `claimBondingCurveCreatorFeeV2` 领取 |

两种费用都针对总 SOL 金额**独立**计算，不复合。净金额：

```
net = gross − protocolFee − creatorFee
```

{% callout type="note" %}
协议交换费在每次兑换时转入 Metaplex 费用钱包。创作者费不会立即转账，而是**累积**在桶中（`creatorFeeAccrued`）——调用无权限的 `claimBondingCurveCreatorFeeV2` 指令来收取。毕业后，创作者费继续从 Raydium LP 交易中累积，通过 `claimRaydiumCreatorFeeV2` 领取。
{% /callout %}

有关当前协议费用计划，请参阅[协议费用](/protocol-fees)页面。

### 按交易方向的费用应用

**买入（SOL → 代币）：**
1. 针对总 SOL 输入计算费用
2. 扣除费用：`amountInAfterFees = amountIn − fees`
3. AMM 公式在 `amountInAfterFees` 上运行
4. 购买者获得全部代币输出（输出侧无费用）

**卖出（代币 → SOL）：**
1. 代币输入无费用——全部代币金额进入 AMM
2. AMM 公式产生总 SOL 输出
3. 针对总 SOL 输出计算费用
4. 卖出者收到：`netSolOut = grossSolOut − fees`

### 毕业费用

毕业时会收取额外费用以覆盖初始化 Raydium CPMM 流动性池的成本。当前费率请参阅[协议费用](/protocol-fees)。

## 首次购买机制

首次购买机制允许指定的购买者在创建曲线时进行免费的初次购买。

配置后，以下规则适用：

1. **需要共同签名** — 指定购买者的钱包必须共同签署曲线创建交易
2. **免除费用** — 仅此初次购买免除所有费用（协议交换费和创作者费）
3. **一次性** — 首次购买完成后，该机制即被消耗。包括同一钱包在内的后续所有交换均按正常费用收取

## 绑定曲线生命周期

Genesis 绑定曲线 V2 发行经历三个顺序阶段：

### 阶段 1：Created（已创建）

曲线使用代币分配、虚拟储备金参数、费用配置、交换窗口开始时间以及任何扩展功能（首次购买、创作者费）进行初始化。此时尚不能交易。

### 阶段 2：Active（活跃）

达到配置的开始时间后，用户可以自由买卖代币。随着 SOL 流入（买入）和流出（卖出），价格根据恒定乘积公式持续变动。活跃期间交易始终开放，没有存款窗口。

### 阶段 3：Graduated（已毕业）

当曲线上的所有代币售出时，毕业**自动**发生——无需手动触发。累积的真实 SOL 迁移到 Raydium CPMM 池中用于持续的二级交易，绑定曲线本身关闭。

{% callout type="note" %}
与[发行池](/smart-contracts/genesis/launch-pool)不同，绑定曲线没有固定的结束时间。毕业由供应耗尽触发，而非计时器。
{% /callout %}

## 储备金耗尽处理

当交换产生的输出超过曲线可用储备金时，系统会钳制输出并使用反向公式重新计算输入——交易不会失败。

**买入钳制（代币供应耗尽）：** 如果 `tokensOut > baseTokenBalance`，输出被限制为 `baseTokenBalance`，并重新计算所需的 SOL 输入。购买者只需支付购买剩余代币所需的金额。这也会触发毕业。

**卖出钳制（SOL 供应耗尽）：** 如果桶中没有足够的 SOL 来覆盖总输出和费用，系统从可用 SOL 余额反向计算。针对可用金额重新计算费用，卖出者收到扣除费用后的剩余金额，并重新计算所需代币输入以匹配。

## 链上账户结构

`BondingCurveBucketV2` 账户存储所有曲线状态：费用配置、储备金余额、交换条件、扩展功能、结束行为和恒定乘积曲线参数。完整类型定义请参阅 [Genesis JavaScript SDK](/smart-contracts/genesis/sdk/javascript) 中的 `BondingCurveBucketV2`。

### BondingCurveBucketV2 扩展功能

桶包含一个扩展功能块，具有独立可配置的可选功能：

| 扩展功能 | 描述 |
|----------|------|
| **首次购买** | 为免费初次购买指定购买者和 SOL 金额。首次购买完成后被消耗。 |
| **创作者费** | 具有目标钱包地址和费率的可选创作者费。费用累积在桶中（`creatorFeeAccrued`）而非每次兑换时转账——通过无权限的 `claimBondingCurveCreatorFeeV2` 指令收取。与协议费独立计算，不复合。首次购买时免除。 |

## Notes

- 虚拟储备金仅存在于定价数学中——它们从未作为真实资产存入链上
- 创作者费累积在桶中（`creatorFeeAccrued`），不会每次兑换时转账；通过无权限的 `claimBondingCurveCreatorFeeV2` 指令收取；毕业后的 Raydium 费用通过 `claimRaydiumCreatorFeeV2` 领取
- `ceil(k / x)` 除法用于所有交换计算，确保池不会贬值
- 毕业在代币完全耗尽时自动发生，无需单独的指令
- 协议交换费率由 Metaplex 设定，创作者不可配置。当前费率请参阅[协议费用](/protocol-fees)
- 首次购买机制在曲线创建时配置，之后无法添加
- 绑定曲线 V2 与[发行池](/smart-contracts/genesis/launch-pool)和[预售](/smart-contracts/genesis/presale)是不同的发行类型

## FAQ

### 绑定曲线发行和发行池有什么区别？
[发行池](/smart-contracts/genesis/launch-pool)有固定的存款窗口和批量价格发现机制——用户在窗口期存款，以单一清算价格按比例获得代币。绑定曲线没有固定窗口：交换窗口开放后任何时候都可以买卖，每次交易后价格持续更新。

### Genesis 绑定曲线 V2 为什么使用虚拟储备金而不是标准 AMM？
标准 `x × y = k` 曲线在两端趋近无穷大，使实用价格下的完全售罄不可能实现。虚拟储备金（初始化时添加的虚拟 SOL 和虚拟代币）以有限的起始价格锚定曲线，并使所有真实代币能以有界、可预测的价格售罄。

### 是什么触发了毕业，累积的 SOL 会怎样？
当曲线上的所有代币售出时，毕业自动发生——无需单独的指令。累积的真实 SOL 迁移到 Raydium CPMM 池中用于持续的二级交易，绑定曲线账户关闭。

### 协议费和创作者费会复合计算吗？
不会。两种费用都针对每次交换的总 SOL 金额独立计算。净金额为 `gross − protocolFee − creatorFee`，不复合。

### 第一个购买者需要支付费用吗？
不需要。当首次购买机制被配置时，该初次购买免除所有费用。同一钱包的后续购买在内的所有交换均按正常协议费和创作者费收取。

### 如果买单购买量超过曲线剩余代币数量会怎样？
系统将代币输出钳制为余额，并使用反向公式重新计算所需的 SOL 输入。购买者只需为实际可用代币支付，交易正常完成。这笔最终购买也会触发毕业。

## Glossary

| 术语 | 定义 |
|------|------|
| **恒定乘积 AMM** | 使用 `x × y = k` 保持储备金乘积不变的自动做市商。Uniswap V2、Raydium 和 Genesis 绑定曲线 V2 均使用 |
| **虚拟储备金** | 曲线初始化时添加的 SOL 和代币数量，仅存在于定价数学中，不作为存入资产存在。设定起始价格并使完全售罄成为可能 |
| **真实储备金** | 购买者实际存入的 SOL（`quoteTokenDepositTotal`）和桶中剩余的真实代币（`baseTokenBalance`） |
| **k 不变式** | 常数 `k = totalSol × totalTokens`。向上取整除法确保交换只能增加 k，不能减少 |
| **毕业** | 所有曲线代币售出时自动触发的事件；将累积的 SOL 迁移至 Raydium CPMM 池 |
| **Raydium CPMM** | 毕业时接收绑定曲线流动性的 Raydium 恒定乘积做市商池，用于持续的二级交易 |
| **首次购买** | 曲线创建时指定钱包和 SOL 金额以进行一次性免费初次购买的可选扩展功能 |
| **创作者费** | 由创作者设定的每次交换可选费用；累积在桶中（`creatorFeeAccrued`），通过无权限的 `claimBondingCurveCreatorFeeV2` 指令收取；与协议费独立计算 |
| **协议交换费** | 由 Metaplex 设定并对每次买入和卖出收取的每次交换费用。创作者不可配置 |
| **毕业费用** | 毕业时收取的一次性费用，用于覆盖初始化 Raydium CPMM 池的成本 |
| **储备金耗尽/钳制** | 当交换超过可用储备金时，系统限制输出并用反向公式重新计算输入。交易不会失败 |
| **`BondingCurveBucketV2`** | 存储所有绑定曲线状态（储备金、费用配置、扩展功能、恒定乘积参数）的链上账户 |
