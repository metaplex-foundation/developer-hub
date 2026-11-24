---
title: Raydium CPMM 毕业
metaTitle: 将 Genesis Launch Pool 毕业到 Raydium CPMM | Metaplex
description: 为 Genesis Launch Pool 或 Presale 添加 Raydium CPMM bucket，通过结束行为为其注资，将其毕业为 Raydium CP-Swap 池，并管理锁定的 LP 代币和费用。
created: '10-29-2026'
updated: '11-24-2026'
keywords:
  - Raydium CPMM graduation
  - RaydiumCpmmBucketV2
  - graduateToRaydiumCpmmV2
  - addRaydiumCpmmBucketV2
  - Genesis liquidity pool
  - LP lock schedule
  - SendStartPrice
  - Raydium CP-Swap
about:
  - Raydium CPMM graduation
  - Genesis liquidity
  - LP token locking
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - 在最终化之前添加带有开始条件、分配量和 LP 锁定计划的 RaydiumCpmmBucketV2
  - 将销售 bucket 上的 SendQuoteTokenPercentage 和 SendStartPrice 结束行为指向 Raydium bucket
  - 存款结束后，对销售 bucket 运行 triggerBehaviorsV2
  - 调用 graduateToRaydiumCpmmV2 创建 Raydium CP-Swap 池
  - 触发相对于毕业的条件，并将未使用的基础代币 rollover
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: 谁可以调用 graduateToRaydiumCpmmV2？
    a: 任何钱包。毕业只需要手续费支付者签名；如果 Raydium bucket 带有 backendSigner 扩展，还需要该后端签名者签名。当 bucket 的开始条件已满足，且销售的结束行为已送达报价代币和起始价格后，毕业即可成功。
  - q: Raydium 池的起始价格是如何设定的？
    a: SendStartPrice 结束行为会将销售的最终价格复制到 Raydium bucket。对于 Launch Pool，价格为 Launch Pool 基础代币分配量除以存款总额；超额认购时则除以软顶。
  - q: 毕业后 LP 代币会怎样？
    a: LP 代币由 Raydium bucket 签名者 PDA 持有。使用 lpLockSchedule 时，LP 代币会随时间解锁给 LP 领取权限；使用 burnLp 时，LP 代币会在毕业时被销毁；两者都不使用时，LP 领取权限可以立即领取全部 LP 代币。
  - q: 创建 Raydium 池需要多少费用？
    a: 创建池的费用为 Raydium 池账户的租金加上 0.15 SOL 的 Raydium 池创建费。由 addRaydiumCpmmBucketV2 的支付者预先支付；当 deferPoolCreationCost 为 true 时，则由毕业的支付者承担。
  - q: 发行上线后还能推迟毕业吗？
    a: 仅当 Raydium bucket 带有 postponableStart 扩展时才可以。此时 Genesis authority 可以在配置的延期次数和延迟额度内，在预定毕业时间至少 30 分钟之前调用 postponeStartRaydiumCpmmBucketV2。
---

Raydium CPMM bucket 将 [Genesis](/zh/smart-contracts/genesis) 销售的一部分收益转化为 Raydium CP-Swap 流动性池（这一步骤称为毕业），并按锁定、销毁或领取策略持有由此产生的 LP 代币。 {% .lead %}

{% callout title="你将构建的内容" %}
本指南为一次 [Launch Pool](/zh/smart-contracts/genesis/launch-pool) 发行添加 `RaydiumCpmmBucketV2`，将 20% 的募集 SOL 转入其中，将其毕业为 Raydium 池，并将 LP 代币锁定一年、按季度解锁。
{% /callout %}

## 摘要 {% #summary %}

`RaydiumCpmmBucketV2` 从销售 bucket 接收报价代币和起始价格，随后 `graduateToRaydiumCpmmV2` 以该价格和相应数量的基础代币创建 Raydium CP-Swap 池。

- 销售 bucket 通过 `SendQuoteTokenPercentage` 和 `SendStartPrice` [结束行为](/zh/smart-contracts/genesis/end-behaviors)为毕业提供资金
- 毕业是一个无需许可的 crank，它会触发 bucket 的 `Graduate` 时间，其他 bucket 可以通过 [`TimeRelative` 条件](/zh/smart-contracts/genesis/conditions)引用该时间
- LP 代币可以按计划锁定、销毁或保持可领取
- 适用于 Genesis V2 Raydium CPMM bucket，不适用于 V1 `graduateToRaydiumCpmmV1` 流程或 Raydium CLMM bucket

**跳转至：** [生命周期](#raydium-cpmm-graduation-lifecycle) · [添加 Bucket](#adding-a-raydium-cpmm-bucket) · [注资](#funding-the-raydium-bucket-from-the-sale) · [毕业](#graduating-to-a-raydium-cp-swap-pool) · [LP 代币](#managing-raydium-lp-tokens) · [费用](#collecting-raydium-pool-fees) · [参考](#quick-reference)

## Raydium CPMM 毕业生命周期 {% #raydium-cpmm-graduation-lifecycle %}

Raydium CPMM bucket 会经历四种状态：`Initialized`、`Funded`、`Graduated` 或失败。

| 步骤 | 指令 | 执行者 | 结果 |
|------|-------------|-----|--------|
| 1. 添加 bucket | `addRaydiumCpmmBucketV2` | Genesis authority，在 `finalizeV2` 之前 | 创建 bucket 和 bucket 签名者 PDA；预先支付池创建费用 |
| 2. 为 bucket 注资 | 对销售 bucket 运行 `triggerBehaviorsV2` | 任何人，在存款结束后 | 送达报价代币和起始价格 |
| 3. 解析开始条件 | 对 Raydium bucket 运行 `triggerConditionsV2` | 任何人；仅 `TimeRelative` 开始条件需要 | `startCondition` 已解析 |
| 4. 毕业 | `graduateToRaydiumCpmmV2` | 任何人，在开始条件满足后 | 创建 Raydium 池；记录 `Graduate` 时间 |
| 5. 后续操作 | 对 Raydium bucket 运行 `triggerBehaviorsV2`，对依赖的 bucket 运行 `triggerConditionsV2` | 任何人 | 未使用的基础代币完成 rollover；相对于毕业的领取已开放 |

{% callout type="note" %}
毕业会创建 Raydium CP-Swap（CPMM）池。Raydium CLMM 毕业使用单独的 `RaydiumClmmBucketV2` 及其自身的指令，本文不作介绍。
{% /callout %}

## 添加 Raydium CPMM Bucket {% #adding-a-raydium-cpmm-bucket %}

`addRaydiumCpmmBucketV2` 在 `finalizeV2` 之前创建 bucket，并确定其分配量、毕业开始时间、LP 策略和结束行为。

{% code-tabs-imported from="genesis/add_raydium_cpmm_bucket_v2" frameworks="umi" filename="addRaydiumCpmmBucketV2" /%}

### Raydium Bucket 参数 {% #raydium-bucket-arguments %}

| 参数 | 必填 | 描述 |
|----------|----------|-------------|
| `baseTokenAllocation` | 是 | 池可接收的最大基础代币数量。将其设为销售分配量 × 发送到此处的收益百分比 |
| `startCondition` | 是 | 毕业最早可以运行的时间。属于开始槽位：`TimeAbsolute`、`TimeRelative` 或 `Always` |
| `bucketIndex` | 否 | PDA 种子 `["raydium_cpmm_v2", genesisAccount, bucketIndex]` 中的索引。默认为 `0` |
| `lpLockSchedule` | 否 | 随时间解锁 LP 代币的 `ClaimSchedule`。不能与 `burnLp` 同时使用 |
| `burnLp` | 否 | 设为 `true` 时会在毕业时销毁全部 LP 代币，从而永久锁定流动性 |
| `lpClaimAuthority` | 否 | 允许领取或销毁 LP 代币的钱包。`null` 表示 Genesis authority |
| `creatorFee` | 否 | `{ wallet }`，用于接收 Raydium 创作者费的一部分。会改变毕业时使用的 AMM 配置 |
| `postponableStart` | 否 | 允许 Genesis authority 在最终化之后推迟毕业。要求开始条件为 `TimeAbsolute`，或锚定到销售的 `DepositEnd` 或 `SwapEnd` 的 `TimeRelative` |
| `backendSigner` | 否 | 毕业以及 LP 领取或销毁时必须共同签名的额外签名者。Genesis authority 之后可以通过 `setBucketBackendSignerV2` 轮换或清除它 |
| `deferPoolCreationCost` | 否 | `false`（默认）由此支付者预先支付池创建费用；`true` 则由毕业的支付者承担 |
| `endBehaviors` | 否 | 通常是一个 `BaseTokenRollover`，用于将未使用的基础代币发送到 Unlocked bucket |

{% callout type="warning" %}
在 `finalizeV2` 之前，所有 bucket 的分配量之和必须等于 Genesis 总供应量。Raydium 分配量计入该总量，即使其中一部分之后可能会被 rollover。
{% /callout %}

## 从销售为 Raydium Bucket 注资 {% #funding-the-raydium-bucket-from-the-sale %}

销售 bucket 通过两个都必须指向 Raydium bucket 的结束行为为其注资：`SendQuoteTokenPercentage` 提供报价代币，`SendStartPrice` 提供价格。

{% totem %}

```typescript {% title="launchPoolEndBehaviors.ts" %}
endBehaviors: [
  {
    __kind: 'SendQuoteTokenPercentage',
    padding: Array(4).fill(0),
    destinationBucket: raydiumBucket,
    percentageBps: 2_000, // 20% of proceeds become pool liquidity
    processed: false,
  },
  {
    __kind: 'SendStartPrice',
    padding: Array(6).fill(0),
    destinationBucket: raydiumBucket,
    processed: false,
  },
  {
    __kind: 'SendQuoteTokenPercentage',
    padding: Array(4).fill(0),
    destinationBucket: treasuryBucket, // Unlocked bucket
    percentageBps: 8_000,
    processed: false,
  },
]
```

{% /totem %}

销售的存款窗口关闭后，任何人都可以对销售 bucket 运行 `triggerBehaviorsV2`。请将每个目标 bucket 与其报价代币账户一起传入；Raydium bucket 的报价代币账户由其 bucket 签名者 PDA 持有。

{% code-tabs-imported from="genesis/trigger_launch_pool_graduation_v2" frameworks="umi" filename="triggerBehaviorsV2" /%}

### Raydium 池起始价格 {% #raydium-pool-starting-price %}

池以销售的最终价格开盘，该价格以 `priceNumerator / priceDenominator`（每个报价代币对应的基础代币数量）存储。

| 销售 bucket | 起始价格 |
|-------------|-------------|
| Launch Pool | `baseTokenAllocation / min(quoteTokenDepositTotal, softCap)` |
| Presale | `baseTokenAllocation / allocationQuoteTokenCap` |
| 联合曲线 | 售罄时的当前曲线价格 |

毕业会将 `quoteTokenInSigner × priceNumerator / priceDenominator` 个基础代币与报价代币配对。Launch Pool 默认转发收益时不收取费用，因此按销售分配量 × 发送到此处的百分比确定的 Raydium 分配量会被全部配对。毕业未使用的任何基础代币（例如舍入产生的零头，或销售 bucket 上费用覆盖造成的差额）会留在 Genesis 中，直到 [`BaseTokenRollover`](/zh/smart-contracts/genesis/end-behaviors#recovering-unused-raydium-base-tokens-with-base-token-rollover) 将其转移。

## 毕业为 Raydium CP-Swap 池 {% #graduating-to-a-raydium-cp-swap-pool %}

`graduateToRaydiumCpmmV2` 创建 Raydium CP-Swap 池，存入配对的代币，并记录 bucket 的 `Graduate` 时间。

该指令无需许可：一旦 bucket 的 `startCondition` 已满足，且 bucket 持有报价代币和起始价格，任何钱包都可以支付并发送它。`deriveRaydiumPDAsV2` 会派生该指令所需的全部 Raydium 账户。

{% code-tabs-imported from="genesis/graduate_to_raydium_cpmm_v2" frameworks="umi" filename="graduateToRaydiumCpmmV2" /%}

{% callout type="note" %}
毕业时请将计算单元上限提高到约 400,000。在 devnet 上，请向 `deriveRaydiumPDAsV2` 传入 `{ env: 'devnet' }`；当 bucket 带有 `creatorFee` 扩展时，请传入 `{ creatorFee: true }`，以使用对应的 AMM 配置。
{% /callout %}

### 毕业对链上状态的更改 {% #what-graduation-changes-onchain %}

毕业会更新 Raydium bucket，并触发依赖它的条件。

- 池状态账户是由 Genesis 派生的 PDA（`["raydium_pool_state", raydiumBucket]`），因此任何人都无法抢先创建该池。
- `graduatedBaseTokenAmount` 记录配对存入池中的基础代币数量，`lpTokenBalance` 记录收到的 LP 代币数量。
- `graduateCondition.triggeredTimestamp` 被设置，从而使 `BucketTimes.Graduate` 可供 `TimeRelative` 条件使用。
- `lpLockSchedule` 上的 `Triggered` 开始条件会在同一时间戳触发。

### 毕业后开放领取 {% #opening-claims-after-graduation %}

领取条件引用 `BucketTimes.Graduate` 的 bucket，只有在对每个 bucket 运行 `triggerConditionsV2` 并将 Raydium bucket 作为剩余账户传入之后才会开放。

{% code-tabs-imported from="genesis/trigger_conditions_after_graduation_v2" frameworks="umi" filename="triggerConditionsV2" /%}

完整模式请参阅[条件与触发](/zh/smart-contracts/genesis/conditions#opening-claims-at-raydium-graduation)。

### 推迟毕业 {% #postponing-graduation %}

`postponeStartRaydiumCpmmBucketV2` 允许 Genesis authority 将毕业开始时间推后，但仅适用于创建时带有 `postponableStart` 的 bucket。

| `postponableStart` 字段 | 含义 |
|--------------------------|---------|
| `maxPostpones` | 最大延期次数 |
| `delayBudgetSeconds` | 所有延期累计允许的最大延迟时间 |
| `timesPostponed` | 传入 `0`；由程序统计延期次数 |

{% code-tabs-imported from="genesis/postpone_start_raydium_cpmm_bucket_v2" frameworks="umi" filename="postponeStartRaydiumCpmmBucketV2" /%}

延期必须在当前预定毕业时间至少 30 分钟之前发送（`PostponeTooLate`），必须将毕业时间推后（`PostponeNotLater`），新的毕业时间必须距当前至少 24 小时（`PostponeTooSoon`），且必须在延迟额度之内（`PostponeExceedsMaxDelay`）。一旦 bucket 已毕业或其销售已失败，延期就会失败。

## 管理 Raydium LP 代币 {% #managing-raydium-lp-tokens %}

毕业后，LP 代币存放在由 Raydium bucket 签名者 PDA 持有的关联代币账户中，由 bucket 的 LP 策略决定谁可以在何时取用。

| 策略 | 配置 | 结果 |
|--------|---------------|--------|
| 定时锁定 | `lpLockSchedule` | LP 代币按计划解锁给 LP 领取权限 |
| 永久锁定 | 开始和 cliff 均为 `Never` 的 `lpLockSchedule`（`createNeverClaimSchedule()`） | LP 代币永远无法领取 |
| 销毁 | `burnLp: true` | 毕业时销毁全部 LP 代币 |
| 可领取 | 两者都不设置 | LP 领取权限可以立即领取全部 LP 代币 |

{% code-tabs-imported from="genesis/claim_raydium_cpmm_lp_tokens_v2" frameworks="umi" filename="claimRaydiumCpmmLpTokensV2" /%}

`claimRaydiumCpmmLpTokensV2` 转移请求的 `amount`，上限为计划已解锁的数量；尚无任何解锁时会失败并返回 `InsufficientUnlockedAmount`。该指令只读取计划的 `triggeredTimestamp` 值：`Triggered` 开始条件会在毕业时触发，但 `TimeAbsolute` 或 `TimeRelative` 计划条件需要先对 Raydium bucket 运行 `triggerConditionsV2`。

LP 领取权限也可以随时调用 `burnRaydiumCpmmLpTokensV2` 销毁未领取的 LP 代币，不受锁定计划限制。[锁定 LP 代币](/zh/smart-contracts/genesis/locked-lp-tokens)介绍了如何在链上验证锁定。

## 收取 Raydium 池费用 {% #collecting-raydium-pool-fees %}

由 Genesis 创建的 Raydium 池会将创作者费累积到 Genesis Raydium 签名者，并由无需许可的收取指令将其转出。

| 指令 | 使用场景 | 结果 |
|-------------|-------------|--------|
| `collectRaydiumCpmmFeesV2` | bucket 没有 `creatorFee` 扩展 | 创作者费转入 Genesis 二级费用钱包 |
| `collectRaydiumCpmmFeesWithCreatorFeeV2` | bucket 带有 `creatorFee` 扩展 | 费用被拆分；创作者份额累计在 bucket 上 |
| `claimRaydiumCreatorFeeV2` | 在带创作者费的收取之后 | 将累计的创作者份额支付到配置的钱包 |

{% code-tabs-imported from="genesis/collect_raydium_cpmm_fees_v2" frameworks="umi" filename="collectRaydiumCpmmFees" /%}

带有 `creatorFee` 扩展时，请使用 `collectRaydiumCpmmFeesWithCreatorFeeV2` 收取，然后使用 `claimRaydiumCreatorFeeV2` 向创作者支付：

{% code-tabs-imported from="genesis/collect_raydium_cpmm_fees_with_creator_fee_v2" frameworks="umi" filename="collectRaydiumCpmmFeesWithCreatorFee" /%}

没有累积费用时，两条收取指令都会成功执行但不进行转账。

Launch Pool 和 Presale 池的交易费率列于[协议费用](/zh/smart-contracts/genesis#protocol-fees)。

## 常见 Raydium CPMM 错误 {% #common-raydium-cpmm-errors %}

Raydium CPMM 错误用于指出在错误时间尝试的毕业、缺失的注资步骤，或由错误签名者执行的 LP 操作。

| 错误 | 原因 | 解决方法 |
|-------|-------|------------|
| `GraduationNotStarted` | `startCondition` 未满足 | 等待开始时间；对于 `TimeRelative` 开始条件，先运行 `triggerConditionsV2` |
| `InvalidAmount` | bucket 上没有报价代币或没有起始价格 | 先对销售 bucket 运行 `triggerBehaviorsV2` |
| `BucketAlreadyGraduated` | 池已经存在 | 无需处理；继续执行后续步骤 |
| `BucketLaunchFailed` | 销售未达到门槛并传递了失败 | 改为运行 Raydium bucket 的失败行为 |
| `InsufficientFunds` | bucket 签名者无法支付池创建费用 | 当 `deferPoolCreationCost` 为 `true` 时，为支付者充值 |
| `StartPriceAlreadySet` | 第二个销售向此 bucket 发送了起始价格 | 每个 Raydium bucket 只使用一个销售 bucket |
| `BurnLpConflictsWithLpLockSchedule` | 同时设置了 `burnLp` 和 `lpLockSchedule` | 只选择一种 LP 策略 |
| `InsufficientUnlockedAmount` | 尚无已解锁的 LP 代币 | 等待下一次解锁；先触发计划条件 |
| `InvalidLpClaimAuthority` | LP 领取或销毁由错误的钱包签名 | 使用 LP 领取权限签名；未设置时使用 Genesis authority |
| `MissingBackendSigner` | bucket 要求后端共同签名者 | 添加已配置的后端签名者，或使用 `setBucketBackendSignerV2` 轮换丢失的密钥 |

## 快速参考 {% #quick-reference %}

| 项目 | 值 |
|------|-------|
| Genesis 程序 | `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` |
| Raydium CP-Swap（主网） | `CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C` |
| Raydium CP-Swap（devnet） | `DRaycpLY18LhpbydsBWbVJtxpNv9oXPgjRSfpF2bWpYb` |
| Bucket PDA 种子 | `"raydium_cpmm_v2"`、Genesis 账户、`bucketIndex`（`u8`） |
| 池状态 PDA 种子 | `"raydium_pool_state"`、Raydium bucket（Genesis 程序） |
| 池创建费用 | Raydium 账户租金 + 0.15 SOL 池创建费 |
| 毕业计算量 | 约 400,000 计算单元 |
| 已测试 SDK | `@metaplex-foundation/genesis@0.44.0` |
| 来源 | [metaplex-foundation/genesis](https://github.com/metaplex-foundation/genesis) |

## 注意事项 {% #notes %}

- `graduateToRaydiumCpmmV2`、`triggerBehaviorsV2`、`triggerConditionsV2` 以及费用收取指令都无需许可。请从 keeper 或后端运行它们；不会有任何操作自动发生。
- 毕业只能执行一次。发送到已毕业 Raydium bucket 的报价代币会被拒绝，而不会被困住。
- 每个 Raydium bucket 只能由恰好一个销售 bucket 注资，并且只有一个 `SendQuoteTokenPercentage` 和一个 `SendStartPrice`。
- `lpLockSchedule` 和 `burnLp` 互斥。
- 本页每个示例都已在 devnet 上使用 `@metaplex-foundation/genesis@0.44.0`，针对已部署的 Genesis 版本 `genesis v0.41.0` 运行，包括毕业到真实的 Raydium CP-Swap 池。在 devnet 上，请向 `deriveRaydiumPDAsV2` 传入 `{ env: 'devnet' }`。已部署的程序不支持 Token-2022 基础代币铸币。

## 常见问题 {% #faq %}

### 谁可以调用 graduateToRaydiumCpmmV2？

任何钱包。毕业只需要手续费支付者签名；如果 Raydium bucket 带有 `backendSigner` 扩展，还需要该后端签名者签名。当 bucket 的开始条件已满足，且销售的结束行为已送达报价代币和起始价格后，毕业即可成功。

### Raydium 池的起始价格是如何设定的？

`SendStartPrice` 结束行为会将销售的最终价格复制到 Raydium bucket。对于 Launch Pool，价格为 Launch Pool 基础代币分配量除以存款总额；超额认购时则除以软顶。

### 毕业后 LP 代币会怎样？

LP 代币由 Raydium bucket 签名者 PDA 持有。使用 `lpLockSchedule` 时，LP 代币会随时间解锁给 LP 领取权限；使用 `burnLp` 时，LP 代币会在毕业时被销毁；两者都不使用时，LP 领取权限可以立即领取全部 LP 代币。

### 创建 Raydium 池需要多少费用？

创建池的费用为 Raydium 池账户的租金加上 0.15 SOL 的 Raydium 池创建费。由 `addRaydiumCpmmBucketV2` 的支付者预先支付；当 `deferPoolCreationCost` 为 `true` 时，则由毕业的支付者承担。

### 发行上线后还能推迟毕业吗？

仅当 Raydium bucket 带有 `postponableStart` 扩展时才可以。此时 Genesis authority 可以在配置的延期次数和延迟额度内，在预定毕业时间至少 30 分钟之前调用 `postponeStartRaydiumCpmmBucketV2`。
