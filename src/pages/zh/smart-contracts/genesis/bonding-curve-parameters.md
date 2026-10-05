---
title: 绑定曲线 — 协议参数
metaTitle: Genesis 绑定曲线协议参数 | Metaplex
description: Genesis 绑定曲线的具体协议参数 — 代币供应量默认值、虚拟储备金、费用计划和毕业目标。
created: '08-03-2026'
updated: '08-05-2026'
keywords:
  - bonding curve
  - protocol parameters
  - virtual reserves
  - fee schedule
  - graduation
  - genesis
  - Metaplex
  - token supply
  - program ID
about:
  - Bonding Curve
  - Genesis
  - Protocol Parameters
proficiencyLevel: Intermediate
faqs:
  - q: Genesis 绑定曲线代币的起始价格是多少？
    a: 起始价格（每 SOL 兑换的代币数）= (virtualTokens / 10^decimals) / (virtualSol / 10^9)。virtualTokens 以原始单位计价，virtualSol 以 lamports 计价，因此在以每 SOL 兑换代币数报价之前必须先转换两者。使用协议默认值时，无论曲线何时开放，起始价格都是固定的。
  - q: 曲线毕业时会筹集多少 SOL？
    a: 毕业时累积的真实 lamports 等于 (k / virtualTokens) − virtualSol，其中 k = virtualSol × (virtualTokens + baseTokenAllocation)；除以 10^9 即可换算为 SOL。实际上这等于协议参数表中列出的毕业目标 SOL。
  - q: 创作者可以更改虚拟储备金或代币供应量吗？
    a: 不可以。虚拟储备金、代币供应量和小数位数由协议默认值设定，无法通过 API 按发行覆盖。
  - q: 创作者费包含在 0.50% 的协议费中吗？
    a: 不包含。创作者费是独立且额外的。两者均针对每次交换的总 SOL 金额独立计算，不复合。每次交换的最大总费用为协议费 + 创作者费。
  - q: 毕业后绑定曲线费用还适用吗？
    a: 不适用。毕业后，交易转移到 Raydium CPMM 池。改为适用毕业后交易费用计划 — 0.40% 协议费、0.60% 创作者收益、0.21% LP 费用和 0.04% Raydium 费用。
---

Genesis 绑定曲线的具体协议参数 — 定义通过 Metaplex API 创建的每个发行的固定数值。 {% .lead %}

## Summary

所有 Genesis 绑定曲线发行共享相同的协议级参数。这些值由 Metaplex API 设定，无法按发行覆盖。

- **固定的供应量和小数位数** — 每条曲线都以 1,000,000,000 个代币、6 位小数起始
- **不可变的虚拟储备金** — `virtualSol` 和 `virtualTokens` 在曲线创建时设定，定义了从首次交易到毕业的完整价格轨迹
- **两层费用结构** — 每次交换收取 0.50% 协议费加可选的创作者费；毕业后 Raydium CPMM 池适用单独的费用计划
- **自动毕业** — 当 `baseTokenBalance` 降为零时触发；无需手动触发

有关使用这些参数的 AMM 定价模型，请参阅[工作原理](/smart-contracts/genesis/bonding-curve-theory)。有关原始交换公式，请参阅[高级内部机制](/smart-contracts/genesis/bonding-curve-internals)。

## 协议参数

每个 Genesis 绑定曲线发行都使用以下固定的协议值创建。

| 参数 | 值 | 备注 |
|-----------|-------|-------|
| **程序 ID** | `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` | Solana 主网 |
| **代币供应量** | 1,000,000,000 | 小数位换算前的原始单位 |
| **小数位数** | 6 | SPL 代币小数位 |
| **代币供应量（含小数位）** | 1,000,000,000,000,000 | `supply × 10^decimals` |
| **`virtualSol`** | [TBD] lamports | 虚拟 SOL 储备金 — 设定起始价格 |
| **`virtualTokens`** | [TBD] 原始单位 | 虚拟代币储备金 — 与 `virtualSol` 配对 |
| **毕业目标** | [TBD] SOL | 完全售罄时累积的真实 SOL |
| **`baseTokenAllocation`** | 1,000,000,000,000,000 | 所有代币均分配给曲线 |

{% callout type="note" %}
`virtualSol` 和 `virtualTokens` 在曲线创建后不可变。程序发出的每个事件都包含这两个值，因此链下价格计算永远不需要单独获取账户。请参阅[索引与事件](/smart-contracts/genesis/bonding-curve-indexing)。
{% /callout %}

## 费用计划

代币生命周期内适用两种不同的费用计划：绑定曲线活跃期间的计划，以及毕业到 Raydium 之后的计划。

### 绑定曲线（活跃阶段）

费用适用于每次交换的 **SOL 侧**。两种费用均针对总 SOL 金额独立计算，不复合。净流入或流出的 SOL = 总额 − 协议费 − 创作者费。

| 费用 | 费率 | 接收方 |
|-----|------|-----------|
| **协议费** | 0.50% | Metaplex 费用钱包 — 每次交换时转账 |
| **创作者费** | 0.60%（上限） | 配置的 `creatorFeeWallet` — 在桶中累积，通过 `claimBondingCurveCreatorFeeV2` 领取 |

{% callout type="note" %}
创作者费是可选的。如果未配置 `creatorFeeWallet`，则不收取创作者费。配置后，0.60% 是协议定义的上限。使用首次购买机制时，首次购买免除两种费用。请参阅[创作者费用](/smart-contracts/genesis/creator-fees)。
{% /callout %}

### 毕业后（Raydium CPMM 池） {% #post-graduation-raydium-cpmm-pool %}

曲线毕业后，交易转移到 Raydium CPMM 池。适用不同的费用计划：

| 费用 | 费率 | 接收方 |
|-----|------|-----------|
| **协议费** | 0.40% | Metaplex |
| **创作者收益** | 0.60% | 创作者费用钱包 — 通过 `claimRaydiumCreatorFeeV2` 领取 |
| **LP 费用** | 0.21% | 流动性提供者 |
| **Raydium 费用** | 0.04% | Raydium 协议 |

## 价格与毕业计算

使用协议默认值时，以下数值在曲线创建时即完全确定。

### 起始价格

起始价格是虚拟储备金的比率，从链上单位（原始代币单位和 lamports）换算为人类可读单位（代币和 SOL）。

```
startingPrice (tokens per SOL) = (virtualTokens / 10^decimals) / (virtualSol / 10^9)
```

`virtualTokens` 以原始单位存储，`virtualSol` 以 lamports 存储，因此在以每 SOL 兑换代币数报价之前，需分别除以 `10^decimals`（协议默认值下为 10^6）和 `10^9`。这是买家在第一笔交换时（任何真实 SOL 进入池之前）看到的价格。

### 毕业时的市值

毕业时 `baseTokenBalance = 0`，所有真实代币均已售出。累积的真实 SOL 等于毕业目标。毕业时的完全稀释市值：

```
graduationLamports = (k / virtualTokens) − virtualSol
  where k = virtualSol × (virtualTokens + baseTokenAllocation)
graduationSOL = graduationLamports / 10^9

priceAtGraduation (lamports per raw unit) = k / virtualTokens^2
fdvAtGraduation (SOL) = totalSupply (raw units) × priceAtGraduation / 10^9
```

### 恒定乘积不变量

不变量 `k` 在曲线创建时固定，并在曲线活跃期间保持不变。

```
k = virtualSol × (virtualTokens + baseTokenAllocation)
```

`k` 在曲线的整个生命周期中保持恒定（每次交换时向上取整）。

## Notes

- 虚拟储备金包含在每个 `BondingCurveSwapEvent` 中 — 链下价格计算不需要单独的 RPC 调用来获取桶账户
- 协议费率和虚拟储备金值由 Metaplex 设定，无法通过 `createAndRegisterLaunch` API 按发行覆盖
- 毕业在耗尽 `baseTokenBalance` 的那笔交换中自动触发 — 清空最后一个代币的同一笔交易也会触发向 Raydium 的迁移
- 创作者费在 `creatorFeeAccrued` 中累积（不会按交换转账）；`creatorFeeClaimed` 跟踪累计领取额；两者在每次调用 `claimBondingCurveCreatorFeeV2` 时相对于累积额重置

## Quick Reference

| 项目 | 值 |
|------|-------|
| 程序 ID | `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` |
| 默认供应量 | `1,000,000,000`（10 亿代币，6 位小数） |
| `baseTokenAllocation` | `1,000,000,000,000,000` |
| 协议交换费 | `0.50%` |
| 创作者费（上限） | `0.60%` |
| 毕业后协议费 | `0.40%` |
| 毕业后 LP 费用 | `0.21%` |
| 毕业后 Raydium 费用 | `0.04%` |
| `virtualSol` | `[TBD]` |
| `virtualTokens` | `[TBD]` |
| 毕业目标 | `[TBD] SOL` |
| JS SDK | `@metaplex-foundation/genesis` |
| 源代码 | [GitHub](https://github.com/metaplex-foundation/mpl-genesis) |

## FAQ

### Genesis 绑定曲线代币的起始价格是多少？

以每 SOL 兑换代币数表示的起始价格 = `(virtualTokens / 10^decimals) / (virtualSol / 10^9)` — `virtualTokens` 以原始单位计价，`virtualSol` 以 lamports 计价，报价前需先转换。它完全由协议默认值决定 — 创作者无法设置自定义起始价格。

### 曲线毕业时会筹集多少 SOL？

售罄时累积的真实 SOL 等于上方协议参数表中列出的毕业目标。这直接由恒定乘积公式得出：`graduationLamports = (k / virtualTokens) − virtualSol`，除以 `10^9` 即为 SOL。

### 创作者可以更改虚拟储备金或代币供应量吗？

不可以。`virtualSol`、`virtualTokens`、代币供应量和小数位数是由 Metaplex API 设定的协议默认值。没有任何 API 参数可以按发行覆盖它们。

### 创作者费包含在 0.50% 的协议费中吗？

不包含。协议费（0.50%）和创作者费（最高 0.60%）是相互独立的。两者均针对交换的总 SOL 金额计算并分别扣除。它们不复合。

### 毕业后绑定曲线费用还适用吗？

不适用。毕业后，绑定曲线账户被关闭，交易转移到 Raydium CPMM 池。改为适用毕业后交易费用计划 — 请参阅上方的[毕业后费用计划](#post-graduation-raydium-cpmm-pool)表。
