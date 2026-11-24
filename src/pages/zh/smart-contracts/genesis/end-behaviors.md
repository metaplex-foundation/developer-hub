---
title: 结束行为
metaTitle: Genesis 结束行为与 triggerBehaviorsV2 | Metaplex
description: Genesis 结束行为参考——SendQuoteTokenPercentage、SendStartPrice、BaseTokenRollover、TransmitFailure 和重新分配——以及何时运行无需许可的 triggerBehaviorsV2 crank。
created: '10-29-2026'
updated: '11-24-2026'
keywords:
  - Genesis end behaviors
  - triggerBehaviorsV2
  - SendQuoteTokenPercentage
  - SendStartPrice
  - BaseTokenRollover
  - TransmitFailure
  - ReallocateBaseTokensOnFailure
  - token launch proceeds routing
about:
  - Genesis end behaviors
  - Launch proceeds routing
  - Launch failure handling
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Genesis 中的结束行为是什么？
    a: 结束行为是存储在 bucket 上的操作，在源 bucket 结束后将代币或数据转移到另一个 bucket，例如将销售收益发送到资金库或 Raydium 毕业 bucket。行为在有人调用 triggerBehaviorsV2 时执行。
  - q: 谁可以调用 triggerBehaviorsV2？
    a: 任何钱包。triggerBehaviorsV2 只需要手续费支付者签名。由于程序会将每个行为标记为已处理，因此每个行为最多执行一次。
  - q: 如果 Launch Pool 未达到最低门槛，结束行为会怎样？
    a: Launch Pool 进入失败模式。只有 ReallocateBaseTokensOnFailure 和 TransmitFailure 行为会执行，因此存入的 SOL 会留在 bucket 中，供存款人退款。
  - q: 最终化之后还能更改结束行为吗？
    a: 不能。请在添加 bucket 时，或在 finalizeV2 之前使用对应的 set*BucketV2Behaviors 指令配置行为。最终化之后，程序会拒绝对行为的更改。
  - q: 为什么 Raydium 毕业后会有剩余的基础代币？
    a: 毕业只会转移按起始价格与报价代币配对所需的基础代币。Raydium bucket 分配中的剩余部分会留在 Genesis 中，直到 Raydium bucket 上的 BaseTokenRollover 行为将其转移到另一个 bucket。
---

[Genesis](/zh/smart-contracts/genesis) 结束行为是存储在 bucket 上的阶段后操作，例如将销售收益转入资金库或 Raydium 池，而 `triggerBehaviorsV2` 是执行这些行为的无需许可的 crank。 {% .lead %}

## 摘要 {% #summary %}

结束行为会在源 bucket 结束后，将报价代币、基础代币、价格或失败标志从源 bucket 转移到目标 bucket。

- 六种行为类型涵盖收益分配、毕业定价、剩余代币和失败处理
- 行为在 `finalizeV2` 之前配置，之后无法更改
- `triggerBehaviorsV2` 执行单个源 bucket 上所有尚未处理的行为，只需要手续费支付者
- 未达到最低门槛的销售只会执行其失败行为

**跳转至：** [行为类型](#genesis-end-behavior-types) · [配置](#configuring-end-behaviors) · [triggerBehaviorsV2](#running-end-behaviors-with-trigger-behaviors-v2) · [毕业资金分配](#routing-proceeds-to-raydium-graduation) · [失败处理](#failure-handling-with-transmit-failure)

## Genesis 结束行为类型 {% #genesis-end-behavior-types %}

Genesis 有六种结束行为类型，每种只允许用于特定的源 bucket 类型。

| 行为 | 作用 | 允许的源 bucket |
|----------|--------------|------------------------|
| `SendQuoteTokenPercentage` | 将已募集报价代币（例如 SOL）的 `percentageBps` 发送到目标 | Launch Pool、Presale、联合曲线 |
| `SendStartPrice` | 将销售的最终价格写入 Raydium bucket，作为其池起始价格 | Launch Pool、Presale、联合曲线 |
| `BaseTokenRollover` | 将剩余基础代币的 `percentageBps` 发送到目标 | Presale、Raydium CPMM、Raydium CLMM |
| `ReallocateBaseTokensOnFailure` | 仅失败模式：将剩余基础代币的 `percentageBps` 发送到目标 | Launch Pool、Presale、Raydium CPMM、Raydium CLMM |
| `TransmitFailure` | 仅失败模式：将后续 bucket 标记为失败 | Launch Pool、Presale |
| `ReallocateBaseTokensOnCancel` | 将已取消或已完成的归属 bucket 中剩余的未归属部分发送到目标 | 领取计划 |

程序会以 `BehaviorNotSupportedForBucketType` 拒绝不受支持的源 bucket 上的行为。

### 行为对象结构 {% #behavior-object-shapes %}

每个行为都是一个带标签的对象，`padding` 长度固定。配置时请传入 `processed: false`。

{% totem %}

```typescript {% title="endBehaviors.ts" %}
const endBehaviors = [
  { __kind: 'SendQuoteTokenPercentage', padding: Array(4).fill(0), destinationBucket, percentageBps: 8_000, processed: false },
  { __kind: 'SendStartPrice', padding: Array(6).fill(0), destinationBucket, processed: false },
  { __kind: 'BaseTokenRollover', padding: Array(4).fill(0), destinationBucket, percentageBps: 10_000, processed: false },
  { __kind: 'ReallocateBaseTokensOnFailure', padding: Array(4).fill(0), destinationBucket, percentageBps: 10_000, processed: false },
  { __kind: 'TransmitFailure', padding: Array(6).fill(0), destinationBucket, processed: false },
  { __kind: 'ReallocateBaseTokensOnCancel', padding: Array(6).fill(0), destinationBucket, processed: false },
]
```

{% /totem %}

`percentageBps` 使用基点，`10_000` 表示 100%。每个 `SendQuoteTokenPercentage` 都基于销售的总收益计算（即存款总额，设置了软顶时以软顶为上限），每个 `BaseTokenRollover` 也基于同一个快照余额计算，因此 `2_000` 和 `8_000` 两个行为会分别发送同一金额的 20% 和 80%。

## 配置结束行为 {% #configuring-end-behaviors %}

结束行为通过对应的 `set*BucketV2Behaviors` 指令在源 bucket 上设置；对于 Raydium CPMM 和领取计划 bucket，也可以在其 `add*BucketV2` 指令中设置。两种方式都必须在 `finalizeV2` 之前完成。

| 源 bucket | 创建时设置 | 最终化前替换 |
|---------------|-----------------|-------------------------|
| Launch Pool | 在 `addLaunchPoolBucketV2Base` 之后调用 `setLaunchPoolBucketV2Behaviors` | `setLaunchPoolBucketV2Behaviors` |
| Presale | 在 `addPresaleBucketV2Base` 之后调用 `setPresaleBucketV2Behaviors` | `setPresaleBucketV2Behaviors` |
| Raydium CPMM | `addRaydiumCpmmBucketV2({ endBehaviors })` | `setRaydiumCpmmBucketV2Behaviors` |
| 领取计划 | `addClaimScheduleBucketV2({ endBehaviors })` | `setClaimScheduleBucketV2Behaviors` |

Launch Pool 和 Presale bucket 使用其 `Base` 指令创建，因为合并的 `addLaunchPoolBucketV2` 和 `addPresaleBucketV2` 指令超过 Solana 1,232 字节的交易大小上限。目标可以是尚未创建的 bucket。请先派生其 PDA，例如使用 `findRaydiumCpmmBucketV2Pda` 或 `findUnlockedBucketV2Pda`，这样各 bucket 就能以任意顺序相互引用。

{% callout type="warning" %}
`finalizeV2` 之后行为即永久固定。请在最终化之前检查每个目标地址和百分比。
{% /callout %}

## 使用 triggerBehaviorsV2 执行结束行为 {% #running-end-behaviors-with-trigger-behaviors-v2 %}

`triggerBehaviorsV2` 执行单个源 bucket（`primaryBucket`）上所有尚未处理的行为，并将每个行为标记为已处理，使其永远不会执行两次。

| 属性 | 值 |
|----------|-------|
| 签名者 | 仅手续费支付者（无需许可） |
| 源 | 每条指令一个 bucket（`primaryBucket`） |
| 剩余账户 | 每个不同的目标对应一对 `(destination bucket, destination quote token account)`，均为可写 |
| 重复运行 | 安全；已处理的行为会被跳过 |

目标报价代币账户是报价代币铸币的[关联代币账户](/zh/solana/understanding-solana-accounts#associated-token-accounts-atas)。它由目标 bucket 本身持有，但 Raydium bucket 除外，其报价代币账户由 Raydium bucket 签名者 PDA（`findRaydiumBucketSignerPda`）持有。

{% code-tabs-imported from="genesis/trigger_launch_pool_graduation_v2" frameworks="umi" filename="triggerBehaviorsV2" /%}

### 各源 Bucket 何时可以执行行为 {% #when-each-source-bucket-can-run-behaviors %}

每种源 bucket 类型只有在结束之后才接受 `triggerBehaviorsV2`。

| 源 bucket | 就绪条件 | 过早调用时的错误 |
|---------------|------------|--------------------|
| Launch Pool | `depositEndCondition` 已满足 | `LaunchPoolNotEnded` |
| Presale | `depositEndCondition` 已满足 | `PresaleBucketNotEnded` |
| 联合曲线 | `swapEndCondition` 已满足（售罄） | `BondingCurveNotEnded` |
| Raydium CPMM | 池已毕业，或 bucket 已被标记为失败 | `InvalidBucketState` |
| 领取计划 | `claimEndCondition` 已满足（取消、归属完成或收到传递的失败） | `ClaimScheduleBucketNotEnded` |

{% callout type="note" %}
请在团队领取收益之前对销售 bucket 运行 `triggerBehaviorsV2`。在其 `SendQuoteTokenPercentage` 行为执行之前，募集的 SOL 会一直留在销售 bucket 中，不过存款人仍然可以领取其基础代币。
{% /callout %}

## 将收益分配到 Raydium 毕业 {% #routing-proceeds-to-raydium-graduation %}

Raydium CPMM bucket 需要恰好一个 `SendQuoteTokenPercentage` 行为和恰好一个 `SendStartPrice` 行为指向它，且两者来自同一个源 bucket。

`SendQuoteTokenPercentage` 提供池的报价代币一侧，`SendStartPrice` 提供用于确定基础代币一侧数量的比例。对于 Launch Pool，起始价格为 `baseTokenAllocation / quoteTokenDepositTotal`；当池超额认购时，使用软顶金额代替存款总额。

毕业时，配对存入池中的基础代币数量为 `quoteTokenInSigner × priceNumerator / priceDenominator`，其中 `quoteTokenInSigner` 是 Raydium bucket 实际收到的报价代币数量。请将 Raydium bucket 的 `baseTokenAllocation` 设为 Launch Pool 分配量乘以发送到池中的百分比：当 20% 的收益进入池中时，使用 Launch Pool 分配量的 20%。Launch Pool 默认转发收益时不收取费用（发行费用在创建者领取收益时收取，参见[协议费用](/zh/smart-contracts/genesis#protocol-fees)），因此毕业时会配对全部分配量。尽管如此，仍请添加 `BaseTokenRollover` 行为，以免舍入产生的零头或销售 bucket 上的费用覆盖导致基础代币被困住。

{% callout type="warning" %}
切勿让两个销售 bucket 指向同一个 Raydium bucket。`SendStartPrice` 对每个目标只能写入一次，且毕业需要报价代币和价格来自单一、一致的来源。
{% /callout %}

### 使用 BaseTokenRollover 回收未使用的 Raydium 基础代币 {% #recovering-unused-raydium-base-tokens-with-base-token-rollover %}

Raydium bucket 分配中未被毕业使用的基础代币会留在 Genesis 中，直到 Raydium bucket 上的 `BaseTokenRollover` 行为将其转移。

请在创建 Raydium bucket 时添加该行为，然后在毕业后以 Raydium bucket 作为 `primaryBucket` 运行 `triggerBehaviorsV2`。

{% code-tabs-imported from="genesis/rollover_raydium_cpmm_base_tokens_v2" frameworks="umi" filename="baseTokenRollover" /%}

## 使用 TransmitFailure 处理失败 {% #failure-handling-with-transmit-failure %}

设置了 `minimumQuoteTokenThreshold` 的 Launch Pool 或 Presale，在存款总额最终低于该门槛时进入失败模式，此时只会执行其失败行为。

在失败模式下，报价代币留在销售 bucket 中，以便存款人调用 `refundLaunchPoolV2`。两种失败行为负责处理所有下游事项：

| 行为 | 对目标的作用 |
|----------|---------------------------|
| `ReallocateBaseTokensOnFailure` | 将未售出的基础代币从销售 bucket 转移到目标，通常是 Unlocked bucket |
| `TransmitFailure` → Raydium CPMM | 将 Raydium bucket 标记为失败，从而关闭毕业（`BucketLaunchFailed`），并使其自身的 `ReallocateBaseTokensOnFailure` 可以执行 |
| `TransmitFailure` → 领取计划 | 以失败状态结束归属 bucket，使其 `ReallocateBaseTokensOnCancel` 返还全部剩余余额。已经结束的计划保持不变 |
| `TransmitFailure` → Unlocked | 立即开放 Unlocked bucket 的领取，绕过其领取开始条件 |

{% code-tabs-imported from="genesis/launch_pool_failure_handling_v2" frameworks="umi" filename="launchPoolFailureHandling" /%}

{% callout type="note" %}
会收到延迟到账的 rollover 或失败转入的 Unlocked bucket，应使用 `createNeverCondition()` 作为其 `claimEndCondition`。在领取窗口关闭后才计入的基础代币将永远无法领取。
{% /callout %}

## 常见结束行为错误 {% #common-end-behavior-errors %}

结束行为错误用于指出不受支持的行为、不匹配的剩余账户列表，或尚未结束的源 bucket。

| 错误 | 原因 | 解决方法 |
|-------|-------|------------|
| `BehaviorNotSupportedForBucketType` | 该源 bucket 不允许此行为 | 使用[行为表](#genesis-end-behavior-types)中允许的源 |
| `InvalidRemainingAccountsLength` | 剩余账户不是 `(bucket, quote token account)` 成对传入 | 每个目标恰好传入一对 |
| `InvalidSecondaryBucket` | 某个剩余账户不是有效的目标 bucket | 传入行为中的目标 bucket PDA |
| `InvalidAtaDerivation` | 目标报价代币账户不是规范的 ATA | 使用正确的所有者通过 `findAssociatedTokenPda` 派生 |
| `LaunchPoolNotEnded` | Launch Pool 存款窗口仍然开放 | 等待 `depositEndCondition` |
| `StartPriceAlreadySet` | 第二个 `SendStartPrice` 指向了同一个 Raydium bucket | 每个 Raydium bucket 只使用一个销售 bucket |

## 注意事项 {% #notes %}

- `SendQuoteTokenPercentage`、`BaseTokenRollover` 和 `ReallocateBaseTokensOnCancel` 只转移代币余额。`ReallocateBaseTokensOnFailure` 还会转移分配量：它从源 bucket 的 `baseTokenAllocation` 中扣减，并计入目标的分配量。
- 一个 bucket 可以带有多个同类型、目标不同的行为，例如用于拆分收益。有两个例外：Raydium bucket 只接受恰好一个 `SendQuoteTokenPercentage` 和一个 `SendStartPrice`，领取计划 bucket 最多只允许一个 `ReallocateBaseTokensOnCancel`。
- 当报价代币铸币为 wrapped SOL 时，领取 Unlocked bucket 会关闭其报价代币账户。在再次运行向其发送报价代币的行为之前，请重新创建该 ATA。
- 收益离开销售 bucket 时适用的费用列于[协议费用](/zh/smart-contracts/genesis#protocol-fees)。
- 示例已在 devnet 上使用 `@metaplex-foundation/genesis@0.44.0`，针对已部署的 Genesis 程序版本 `genesis v0.41.0`（`GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`）运行。来源：[metaplex-foundation/genesis](https://github.com/metaplex-foundation/genesis)。

## 常见问题 {% #faq %}

### Genesis 中的结束行为是什么？

结束行为是存储在 bucket 上的操作，在源 bucket 结束后将代币或数据转移到另一个 bucket，例如将销售收益发送到资金库或 Raydium 毕业 bucket。行为在有人调用 `triggerBehaviorsV2` 时执行。

### 谁可以调用 triggerBehaviorsV2？

任何钱包。`triggerBehaviorsV2` 只需要手续费支付者签名。由于程序会将每个行为标记为已处理，因此每个行为最多执行一次。

### 如果 Launch Pool 未达到最低门槛，结束行为会怎样？

Launch Pool 进入失败模式。只有 `ReallocateBaseTokensOnFailure` 和 `TransmitFailure` 行为会执行，因此存入的 SOL 会留在 bucket 中，供存款人退款。

### 最终化之后还能更改结束行为吗？

不能。请在添加 bucket 时，或在 `finalizeV2` 之前使用对应的 `set*BucketV2Behaviors` 指令配置行为。最终化之后，程序会拒绝对行为的更改。

### 为什么 Raydium 毕业后会有剩余的基础代币？

毕业只会转移按起始价格与报价代币配对所需的基础代币。Raydium bucket 分配中的剩余部分会留在 Genesis 中，直到 Raydium bucket 上的 `BaseTokenRollover` 行为将其转移到另一个 bucket。

## 术语表 {% #glossary %}

| 术语 | 定义 |
|------|------------|
| **结束行为（End behavior）** | 存储在源 bucket 上、在该 bucket 结束后执行的操作 |
| **源 bucket（Source bucket）** | 其行为被执行的 bucket，作为 `primaryBucket` 传入 |
| **目标 bucket（Destination bucket）** | 接收代币、价格或失败标志的 bucket |
| **失败模式（Failure mode）** | 销售结束时低于其 `minimumQuoteTokenThreshold` 的状态 |
| **起始价格（Start price）** | Raydium bucket 用来确定池规模的 `priceNumerator / priceDenominator` 比例 |
| **已处理标志（Processed flag）** | 每个行为上的标记，防止行为执行两次 |
