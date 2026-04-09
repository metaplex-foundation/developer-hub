---
title: 联结曲线 — 运作原理
metaTitle: Genesis 联结曲线 — 工作原理 | Metaplex
description: Genesis 联结曲线的工作原理 — 恒定乘积定价、虚拟储备、费用结构、首次购买机制和生命周期阶段。
updated: '04-08-2026'
keywords:
  - bonding curve
  - constant product AMM
  - virtual reserves
  - token launch
  - Genesis
  - Metaplex
  - graduation
  - Raydium CPMM
  - swap fee
  - creator fee
about:
  - Bonding Curve
  - Constant Product AMM
  - Token Launch
  - Genesis
proficiencyLevel: Intermediate
faqs:
  - q: 联结曲线发行和启动池有什么区别？
    a: 启动池有固定的存款窗口和固定价格发现——用户在窗口期内存款，按比例获得代币。联结曲线没有固定窗口——互换窗口开放后，用户可以随时买卖，随着更多 SOL 流入价格上涨，随着代币被卖回价格下降。价格是连续且确定性的，而非批量结算。
  - q: 为什么 Genesis 联结曲线使用虚拟储备而不是标准 AMM？
    a: 标准恒定乘积 AMM（x * y = k）并非设计为完全售罄——最后几个代币的价格趋近无穷大。虚拟储备（初始化时添加的虚拟 SOL 和虚拟代币）设定了实际起始价格并塑造曲线，使所有真实代币能在有限的价格内售罄。
  - q: 什么触发毕业，积累的 SOL 会怎样？
    a: 当曲线上所有代币售罄时，毕业自动触发——无需手动操作。积累的真实 SOL 将迁移到 Raydium CPMM 池中，用于持续的二级交易。
  - q: 协议费用和创作者费用会复利计算吗？
    a: 不会。两种费用都是独立地按每次互换的总 SOL 金额计算并分别扣除。进出曲线的净额是总额减去协议费用再减去创作者费用——不会复利计算。
  - q: 首次购买者需要支付费用吗？
    a: 不需要。当配置了首次购买机制时，指定购买者的初始购买将免除所有费用（协议互换费用和创作者费用）。之后的所有互换——包括同一钱包的进一步购买——均按正常费用收取。
---

Genesis 联结曲线使用带虚拟储备的 `x × y = k` 恒定乘积定价模型，在 Solana 上实现确定性、持续可用的代币发行。{% .lead %}

## Summary

Genesis 联结曲线使用带虚拟储备的恒定乘积 AMM，以有限、可预测的价格为完整的代币售罄定价。

- **恒定乘积 AMM** — 遵循 `x × y = k`，随着 SOL 流入价格上涨，随着代币被卖回价格下降
- **虚拟储备** — 初始化时设置的 SOL 和代币储备，仅存在于定价计算中，设定实际起始价格并使曲线能够完全售罄
- **三个生命周期阶段** — 已创建 → 活跃 → 已毕业；所有代币售罄时毕业自动触发，流动性迁移到 Raydium CPMM 池
- **两种费用类型** — 每次交易的协议互换费用加上可选的创作者费用；两者均适用于 SOL 侧且不复利计算

关于原始互换公式、反向计算数学和完整账户字段参考，请参阅[高级内部规格](/smart-contracts/genesis/bonding-curve-internals)。

## 恒定乘积 AMM 定价

Genesis 联结曲线使用与 Uniswap V2 和 Raydium 相同的 `x × y = k` 公式。任意时刻的价格由代币储备与 SOL 储备的比率决定——购买代币会减少代币供应并提高价格；出售代币会增加供应并降低价格。

### 联结曲线为何需要虚拟储备

普通的 `x × y = k` 曲线在两端都有渐近线，使其不适合售罄式发行。标准 AMM 通过在两侧注入真实流动性并从不打算完全售罄来避免这一问题——滑点使极端附近的交易变得不切实际。联结曲线发行则不同：它们设计为**完全售罄**。

- **下限渐近线** — 发行时池中没有 SOL，购买者可以用任意非零 SOL 量耗尽所有代币
- **上限渐近线** — 最后几个代币的价格趋近无穷大，使在实际价格下完全售罄变得不可能

Genesis 联结曲线通过用**虚拟储备**（虚拟 SOL 和虚拟代币）填充曲线来解决这一问题——这些储备仅存在于定价计算中。虚拟储备设定了有限的起始价格并塑造曲线，使所有真实代币能以实际、有限的价格售罄。

### 储备核算

曲线维护两组储备，这两组储备在 AMM 公式中合并使用：

| 储备 | 字段 | 描述 |
|------|------|------|
| **虚拟 SOL** | `virtualSol` | 初始化时添加。设定起始价格。实际上从未存入——仅存在于计算中。 |
| **虚拟代币** | `virtualTokens` | 初始化时添加，与虚拟 SOL 配对以锚定曲线。 |
| **真实 SOL** | `quoteTokenDepositTotal` | 购买者实际存入的 SOL。从 0 开始，随每次购买增加。 |
| **真实代币** | `bucket.baseTokenBalance` | 实际剩余代币。从完整分配开始，随每次购买减少。 |

AMM 公式中使用的有效储备为：

```
totalSol    = virtualSol + realSol
totalTokens = virtualTokens + realTokens
k           = totalSol × totalTokens
```

相对于 `virtualTokens`，`virtualSol` 越高，起始价格越高。以每 SOL 对应代币数量表示的当前价格为：

```
price = (virtualTokens + realTokens) / (virtualSol + realSol)
```

## 费用结构

费用适用于每次互换的 **SOL 侧**，与方向无关——购买时从 SOL 输入中扣除，出售时从 SOL 输出中扣除。

### 协议互换费用和创作者费用

每次互换都须缴纳协议互换费用。创作者可以选择性地在此基础上添加创作者费用：

| 费用 | 设置者 | 目的地 |
|------|--------|--------|
| **协议互换费用** | 协议（创作者不可配置） | Metaplex 费用钱包（`feeQuoteTokenAccount`）——每次互换时转账 |
| **创作者费用** | 创作者或代理（可选） | 累积在桶中（`creatorFeeAccrued`）——通过无权限 `claimBondingCurveCreatorFeeV2` 领取 |

两种费用都**独立地**按总 SOL 金额计算，不复利计算。进出曲线的净额为：

```
net = gross − protocolFee − creatorFee
```

{% callout type="note" %}
协议互换费用在每次互换时转账到 Metaplex 费用钱包。创作者费用**累积**在桶中（`creatorFeeAccrued`），而非立即转账——调用无权限 `claimBondingCurveCreatorFeeV2` 指令来收取。毕业后，创作者费用继续从 Raydium LP 交易中累积，通过 `claimRaydiumCreatorFeeV2` 领取。关于配置和完整领取说明，请参阅[创作者费用](/smart-contracts/genesis/creator-fees)。
{% /callout %}

关于当前协议费用表，请参阅[协议费用](/protocol-fees)页面。

### 按交易方向的费用应用

**购买（SOL → 代币）：**
1. 按总 SOL 输入计算费用
2. 扣除费用：`amountInAfterFees = amountIn − fees`
3. 用 `amountInAfterFees` 运行 AMM 公式
4. 购买者收到全额代币输出——输出侧无费用

**出售（代币 → SOL）：**
1. 代币输入无费用——全额代币量进入 AMM
2. AMM 公式产生总 SOL 输出
3. 按总 SOL 输出计算费用
4. 出售者收到：`netSolOut = grossSolOut − fees`

### 毕业费用

毕业时会收取额外费用以覆盖初始化 Raydium CPMM 流动性池的成本。请参阅[协议费用](/protocol-fees)了解当前费率。

## 首次购买机制

首次购买机制允许指定购买者在曲线创建时进行一次无费用的初始购买。

配置后，以下规则适用：

1. **需要联署** — 指定购买者的钱包必须联署曲线创建交易
2. **免除费用** — 仅针对此初始购买免除所有费用（协议互换费用和创作者费用）
3. **一次性使用** — 首次购买完成后，该机制即被消耗；任何钱包（包括同一购买者）的所有后续互换均按正常费用收取

## 联结曲线生命周期

Genesis 联结曲线发行经历三个顺序阶段：

### 阶段一：已创建

曲线以代币分配、虚拟储备参数、费用配置、互换窗口开始时间以及任何扩展（首次购买、创作者费用）进行初始化。尚无法进行交易。

### 阶段二：活跃

一旦达到配置的开始时间，用户可以自由买卖代币。随着 SOL 流入（购买）和流出（出售），价格根据恒定乘积公式持续变动。没有存款窗口——曲线活跃期间始终开放交易。

### 阶段三：已毕业

当曲线上所有代币售罄时，毕业**自动**触发——无需手动操作。积累的真实 SOL 迁移到 Raydium CPMM 池中，用于持续的二级交易。联结曲线本身关闭。

{% callout type="note" %}
与[启动池](/smart-contracts/genesis/launch-pool)不同，联结曲线没有固定的结束时间。毕业由供应耗尽触发，而非计时器。
{% /callout %}

## Notes

- 虚拟储备仅存在于定价计算中——它们不会作为真实资产链上存入
- 创作者费用累积在桶中（`creatorFeeAccrued`），而非每次互换时转账；关于配置和领取（`claimBondingCurveCreatorFeeV2` / `claimRaydiumCreatorFeeV2`），请参阅[创作者费用](/smart-contracts/genesis/creator-fees)
- 毕业在代币完全耗尽时自动触发——无需单独的指令
- 协议互换费率由 Metaplex 设定，创作者无法配置；请参阅[协议费用](/protocol-fees)了解当前费率
- 首次购买机制在曲线创建时配置，之后无法添加
- 关于原始互换公式、反向计算和储备耗尽处理，请参阅[高级内部规格](/smart-contracts/genesis/bonding-curve-internals)

## FAQ

### 联结曲线发行和启动池有什么区别？
[启动池](/smart-contracts/genesis/launch-pool)有固定的存款窗口和批量价格发现——用户在窗口期内存款，在单一清算价格下按比例获得代币。联结曲线没有固定窗口：互换窗口开放后用户可以随时买卖，每次交易后价格持续更新。

### 为什么 Genesis 联结曲线使用虚拟储备而不是标准 AMM？
标准 `x × y = k` 曲线在两端趋近无穷大，使在实际价格下完全售罄变得不可能。虚拟储备（初始化时添加的虚拟 SOL 和虚拟代币）以有限的起始价格锚定曲线，并将其塑造为使所有真实代币能以有限、可预测的价格售罄。

### 什么触发毕业，积累的 SOL 会怎样？
当曲线上所有代币售罄时，毕业自动触发——无需单独的指令。积累的真实 SOL 迁移到 Raydium CPMM 池中，用于持续的二级交易，联结曲线账户随即关闭。

### 协议费用和创作者费用会复利计算吗？
不会。两种费用都是独立地按每次互换的总 SOL 金额计算。净额为 `gross − protocolFee − creatorFee`。不复利计算。

### 首次购买者需要支付费用吗？
不需要。当配置了首次购买机制时，该初始购买的所有费用均被免除。之后的所有互换——包括同一钱包的进一步购买——均按正常协议和创作者费用收取。

## Glossary

| 术语 | 定义 |
|------|------|
| **恒定乘积 AMM** | 使用 `x × y = k` 的自动做市商，其中储备乘积保持恒定 |
| **虚拟储备** | 曲线初始化时添加的 SOL 和代币数量，仅存在于定价计算中；设定起始价格并使完全售罄成为可能 |
| **真实储备** | 购买者实际存入的 SOL（`quoteTokenDepositTotal`）和实际剩余代币（`baseTokenBalance`） |
| **`k` 不变量** | 常数 `k = totalSol × totalTokens`；向上取整除法确保互换只能增加 `k`，绝不减少 |
| **毕业** | 所有曲线代币售罄时自动触发的事件；将积累的 SOL 迁移到 Raydium CPMM 池 |
| **Raydium CPMM** | 毕业时接收联结曲线流动性的 Raydium 恒定乘积做市商池 |
| **首次购买** | 可选扩展，在曲线创建时指定钱包和 SOL 金额，用于一次性无费用初始购买 |
| **创作者费用** | 创作者配置的可选每次互换费用；累积在桶中，通过 `claimBondingCurveCreatorFeeV2` 收取；详见[创作者费用](/smart-contracts/genesis/creator-fees) |
| **协议互换费用** | Metaplex 设定的每次互换费用；对每次买卖收取；创作者不可配置 |
| **毕业费用** | 毕业时收取的一次性费用，用于覆盖初始化 Raydium CPMM 池的成本 |
