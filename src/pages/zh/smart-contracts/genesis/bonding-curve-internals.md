---
title: 联合曲线——高级内部原理
metaTitle: Genesis 联合曲线高级内部原理 | Metaplex
description: Genesis 联合曲线深度参考——兑换定价公式、反向计算、储备耗尽钳制、BondingCurveBucketV2 账户结构及扩展。
updated: '04-09-2026'
keywords:
  - bonding curve
  - constant product AMM
  - swap formula
  - virtual reserves
  - reserve exhaustion
  - BondingCurveBucketV2
  - genesis
  - Metaplex
about:
  - Bonding Curve
  - Constant Product AMM
  - Genesis
proficiencyLevel: Advanced
---

Genesis 联合曲线兑换定价公式、储备耗尽处理以及 `BondingCurveBucketV2` 链上账户结构的参考文档。{% .lead %}

## 摘要

本页涵盖为集成商构建兑换引擎、定价工具或基于 Genesis 联合曲线的协议工具所需的实现层细节。关于使用 SDK 执行兑换交易，请参阅[联合曲线兑换集成](/smart-contracts/genesis/bonding-curve-swaps)。关于索引程序发出的事件，请参阅[索引与事件](/smart-contracts/genesis/bonding-curve-indexing)。

- **兑换公式**——精确的 `ceil(k / x)` 买入和卖出计算
- **反向计算**——为期望输出计算所需输入
- **储备耗尽**——当供应量接近零时系统如何钳制并重新计算
- **`BondingCurveBucketV2`**——链上账户的完整字段参考

关于概念模型、手续费结构和生命周期概述，请参阅[运作原理](/smart-contracts/genesis/bonding-curve-theory)。

## 兑换定价公式

所有兑换计算使用组合储备：

```
totalSol    = virtualSol + realSol
totalTokens = virtualTokens + realTokens
k           = totalSol × totalTokens
```

### 买入（SOL 输入，代币输出）

```
inputReserve     = totalSol
outputReserve    = totalTokens

newInputReserve  = inputReserve + amountIn
newOutputReserve = ceil(k / newInputReserve)
tokensOut        = outputReserve - newOutputReserve
```

### 卖出（代币输入，SOL 输出）

```
inputReserve     = totalTokens
outputReserve    = totalSol

newInputReserve  = inputReserve + amountIn
newOutputReserve = ceil(k / newInputReserve)
solOut           = outputReserve - newOutputReserve
```

### 向上取整除法

所有兑换计算中均使用向上取整除法（`ceil(k / x)`）。这确保恒积不变量永远不被违反：

```
newInputReserve × (outputReserve − outputAmount) ≥ k
```

池只能通过交易增值，永不减值。任何舍入误差都累积到池的利益方向。

## 反向计算：期望输出所需的输入

内部用于储备耗尽时的钳制——精确计算产生特定输出所需的输入量：

```
newOutputReserve = outputReserve - desiredAmountOut
newInputReserve  = ceil(k / newOutputReserve)
requiredAmountIn = newInputReserve - inputReserve
```

这在用户指定期望代币数量且 UI 需要显示精确 SOL 成本的 UX 流程中也很有用。

## 储备耗尽与钳制

当兑换产生的输出超过曲线可用量时，系统钳制输出并重新计算输入——交易不会失败。

### 买入钳制（代币供应耗尽）

如果 `tokensOut > baseTokenBalance`：

1. 输出上限为 `baseTokenBalance`
2. 使用反向公式重新计算所需 SOL 输入
3. 买家仅为实际可用代币付费
4. 这次最终购买也触发毕业

### 卖出钳制（SOL 供应耗尽）

如果 bucket 持有的 SOL 不足以同时支付总输出和手续费：

1. 系统从可用 SOL 余额反向推算
2. 基于可用金额重新计算手续费
3. 卖方在扣除手续费后收到剩余部分
4. 通过反向公式重新计算所需代币输入以匹配

## BondingCurveBucketV2 账户结构

`BondingCurveBucketV2` 账户存储所有联合曲线状态。完整 TypeScript 类型定义请参阅 [Genesis JavaScript SDK](/smart-contracts/genesis/sdk/javascript)。

### 核心储备字段

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `baseTokenBalance` | `bigint` | 曲线上剩余代币数量。零表示已售罄。 |
| `baseTokenAllocation` | `bigint` | 创建时分配的代币总量。 |
| `quoteTokenDepositTotal` | `bigint` | 买家存入的真实 SOL（lamports）。初始为 0。 |
| `virtualSol` | `bigint` | 虚拟 SOL 储备（仅用于定价，从未存入）。 |
| `virtualTokens` | `bigint` | 虚拟代币储备（仅用于定价，从未存入）。 |

### 手续费配置字段

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `depositFee` | `number` | 买入 SOL 输入侧的协议手续费率。 |
| `withdrawFee` | `number` | 卖出 SOL 输出侧的协议手续费率。 |
| `creatorFeeAccrued` | `bigint` | 累计尚未认领的创作者费总额。 |
| `creatorFeeClaimed` | `bigint` | 累计已认领的创作者费总额。 |

### 兑换条件字段

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `swapStartCondition` | `object` | 允许交易前必须满足的条件。 |
| `swapEndCondition` | `object` | 触发时结束交易的条件。 |

### BondingCurveBucketV2 扩展

bucket 包含一个具有独立配置可选功能的扩展块：

| 扩展 | 描述 |
|-----------|-------------|
| **首次购买（First Buy）** | 为指定买家和 SOL 金额保留一次免手续费初始购买。首次购买完成后消耗。 |
| **创作者费（Creator Fee）** | 包含目标钱包地址和费率的可选创作者费。费用累积在 bucket 中（`creatorFeeAccrued`）而非按次转账。与协议费独立计算——不会与之复利。首次购买豁免两者。详见[创作者费](/smart-contracts/genesis/creator-fees)了解配置和认领方式。 |

## 注意事项

- `virtualSol` 和 `virtualTokens` 在曲线创建时设定且不可更改——它们永久定义价格曲线形状
- 所有兑换计算均使用 `ceil(k / x)` 除法以确保池永不贬值；舍入误差累积到池的利益方向
- 代币完全耗尽时毕业自动触发——无需单独指令或曲柄
- `BondingCurveBucketV2` 的判别字节每种账户类型唯一；`BondingCurveSwapEvent` 的判别字节始终为 `255`

## 快速参考

| 公式 | 表达式 |
|---------|-----------|
| 组合 SOL 储备 | `totalSol = virtualSol + realSol` |
| 组合代币储备 | `totalTokens = virtualTokens + realTokens` |
| 恒积 | `k = totalSol × totalTokens` |
| 当前价格（代币/SOL） | `totalTokens / totalSol` |
| 买入输出 | `outputReserve − ceil(k / (inputReserve + amountIn))` |
| 卖出输出 | `outputReserve − ceil(k / (inputReserve + amountIn))` |
| 期望输出所需输入 | `ceil(k / (outputReserve − desiredOut)) − inputReserve` |
