---
title: 条件与触发
metaTitle: Genesis 条件、TimeRelative 时间设置与 triggerConditionsV2 | Metaplex
description: 介绍 Genesis bucket 条件的工作原理，包括 TimeAbsolute、TimeRelative、Triggered 和 Never 条件，以及何时调用无需许可的 triggerConditionsV2 crank。
created: '10-29-2026'
updated: '11-24-2026'
keywords:
  - Genesis conditions
  - TimeRelative
  - TimeAbsolute
  - triggerConditionsV2
  - BucketTimes
  - claim start relative to graduation
  - Genesis crank
  - token launch timing
about:
  - Genesis conditions
  - Launch timing
  - Condition triggering
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: TimeRelative 条件会自动触发吗？
    a: 不会。TimeAbsolute 条件会在任何指令检查它时自行更新，但 TimeRelative 条件会一直保持未触发状态，直到有人对其所属的 bucket 调用 triggerConditionsV2，并将被引用的 bucket 作为可写剩余账户传入。
  - q: 谁可以调用 triggerConditionsV2？
    a: 任何钱包。triggerConditionsV2 只需要手续费支付者签名，因此项目后端、keeper 机器人或用户钱包都可以运行它。
  - q: 如果 crank 运行较晚，TimeRelative 条件会记录什么时间戳？
    a: 条件记录的是参照时间加上偏移量，而不是 crank 实际运行的时间。较晚运行 triggerConditionsV2 会推迟条件在链上生效的时间，但不会改变归属或领取的计算结果。
  - q: 如何在 Raydium 池创建时开放领取？
    a: 将领取开始条件设为 TimeRelative，以 Raydium CPMM bucket 作为参照，并以 BucketTimes.Graduate 作为 bucket 时间点。毕业后，对每个依赖的 bucket 调用 triggerConditionsV2，并将 Raydium bucket 作为剩余账户传入。
  - q: 最终化之后还能更改 TimeRelative 条件吗？
    a: 不能。bucket 条件在 finalizeV2 时即被固定。唯一的例外是带有 postponableStart 扩展的 Raydium CPMM 毕业开始条件，Genesis authority 可以在配置的限制范围内将其推迟。
---

[Genesis](/zh/smart-contracts/genesis) 条件决定每个 bucket 阶段（例如存款、领取和毕业）何时开始和结束，而 `triggerConditionsV2` 是用于解析那些无法自行解析的条件的无需许可的 crank。 {% .lead %}

## 摘要 {% #summary %}

Genesis 条件是存储在 bucket 上的 64 字节时间规则，一旦其时间点已过即变为"已触发"，此时程序会记录 `triggeredTimestamp`。

- `TimeAbsolute` 在固定的 Unix 时间戳触发，并在任何指令检查它时自行解析
- `TimeRelative` 在另一个 bucket 的事件加上偏移量后触发，需要通过 `triggerConditionsV2` 解析
- `Triggered` 条件由程序触发，例如在 Raydium 池创建时
- `triggerConditionsV2` 只需要手续费支付者签名，因此任何钱包都可以运行它

**跳转至：** [条件类型](#genesis-condition-types) · [条件槽位](#condition-slots-by-bucket-type) · [TimeRelative](#time-relative-conditions-and-bucket-times) · [triggerConditionsV2](#resolving-conditions-with-trigger-conditions-v2) · [毕业时开放领取](#opening-claims-at-raydium-graduation)

## Genesis 条件类型 {% #genesis-condition-types %}

Genesis 支持六种条件类型，每个 bucket 槽位只接受其中一部分。

| 类型 | SDK 辅助函数 | 触发时机 | 是否自行解析 |
|------|------------|------------|-----------------|
| `TimeAbsolute` | `createTimeAbsoluteCondition(time)` | 时钟到达 `time` | 是，在任何检查它的指令中解析 |
| `TimeRelative` | `createTimeRelativeCondition(bucket, bucketTime, offset)` | 参照 bucket 的事件发生且已过 `offset` | 否，需要 `triggerConditionsV2` |
| `Triggered` | `createTriggeredCondition()` | 由程序触发，例如在毕业或预售售罄时 | 由引发该事件的指令触发 |
| `TriggeredWithExpiry` | `createTriggeredWithExpiryCondition(expiry)` | 程序触发或到达 `expiryTime`，以先发生者为准 | 是，在到期之后 |
| `Never` | `createNeverCondition()` | 永不触发 | 不适用 |
| `Always` | 构造 `{ __kind: 'Always', ... }` | 始终满足 | 不适用，不记录时间戳 |

每个条件都带有一个 `triggeredTimestamp` 选项。`None` 表示该条件尚未在链上解析；`Some(t)` 记录其触发的时刻。

{% callout type="note" %}
请使用 SDK 辅助函数，而不要手动构建条件对象。每个变体的 `padding` 长度不同，长度错误会导致序列化失败。
{% /callout %}

## 按 Bucket 类型划分的条件槽位 {% #condition-slots-by-bucket-type %}

bucket 上的每个条件字段称为一个"槽位"，程序会以 `InvalidConditionTypeForSlot` 拒绝槽位不支持的条件类型。

| 槽位 | 允许的类型 |
|------|---------------|
| 开始槽位（存款开始、Unlocked 领取开始、Raydium 毕业开始、归属领取开始） | `TimeAbsolute`、`TimeRelative`、`Always` |
| Launch Pool 和 Presale 的 `claimStartCondition` | `TimeAbsolute`、`TimeRelative` |
| 结束槽位（存款结束、领取结束） | `TimeAbsolute`、`TimeRelative`、`Never` |
| Presale `depositEndCondition` | 结束槽位的类型，另加 `Triggered` 和 `TriggeredWithExpiry` |
| 联合曲线 `swapEndCondition` | 仅 `Triggered`（售罄） |
| `ClaimSchedule` 开始和 cliff | `TimeAbsolute`、`TimeRelative`、`Never` |
| Raydium `lpLockSchedule` 开始和 cliff | 计划的类型，另加在毕业时触发的 `Triggered` |
| Raydium `graduateCondition` | 由程序管理的 `Triggered`，在池创建时设置 |

Raydium CPMM 的 `graduateCondition` 不是参数。程序在添加 bucket 时将其创建为 `Triggered`，并在 `graduateToRaydiumCpmmV2` 内部触发它，正因如此 `BucketTimes.Graduate` 才能用作参照。

## TimeRelative 条件与 Bucket 时间点 {% #time-relative-conditions-and-bucket-times %}

`TimeRelative` 条件在 `referenceBucket.<bucketTime>.triggeredTimestamp + timeOffset` 这一时间过去后，解析为该时间。

| 字段 | 类型 | 含义 |
|-------|------|---------|
| `bucket` | `PublicKey` | 参照 bucket。可以是同一 Genesis 账户下的任意 bucket，包括之后才添加的 bucket |
| `bucketTime` | `BucketTimes` | 锚定到参照 bucket 上的哪个事件 |
| `timeOffset` | `bigint`（秒） | 参照事件之后的延迟。使用 `0n` 表示"同一时刻" |

每个 `BucketTimes` 值都对应特定 bucket 类型上的一个条件：

| `BucketTimes` | 参照 bucket 类型 |
|---------------|------------------------|
| `DepositStart`, `DepositEnd` | Launch Pool、Presale |
| `ClaimStart`, `ClaimEnd` | Launch Pool、Presale、Unlocked |
| `SwapStart`, `SwapEnd` | 联合曲线 |
| `GraduateStart` | Raydium CPMM（毕业 `startCondition`） |
| `Graduate` | Raydium CPMM（在池创建时触发） |

将 `BucketTimes` 值与此表以外的 bucket 类型搭配使用时，解析该条件会失败并返回 `InvalidPrimaryBucket`。

{% totem %}

```typescript {% title="timeRelativeConditions.ts" %}
import { BucketTimes, createTimeRelativeCondition } from '@metaplex-foundation/genesis'

const DAY = 86_400n

// Opens at the moment the Raydium pool is created
const claimStart = createTimeRelativeCondition(raydiumBucket, BucketTimes.Graduate)

// Opens 90 days after the Raydium pool is created
const cliff = createTimeRelativeCondition(raydiumBucket, BucketTimes.Graduate, 90n * DAY)

// Opens 1 hour after the Launch Pool deposit window closes
const graduationStart = createTimeRelativeCondition(launchPoolBucket, BucketTimes.DepositEnd, 3_600n)
```

{% /totem %}

{% callout type="warning" %}
`TimeRelative` 条件只能在其参照事件已在链上解析之后才能解析。如果参照本身也是 `TimeRelative`，请先触发参照 bucket，再触发依赖它的 bucket。
{% /callout %}

## 使用 triggerConditionsV2 解析条件 {% #resolving-conditions-with-trigger-conditions-v2 %}

`triggerConditionsV2` 解析单个目标 bucket 上的所有条件，包括扩展中的条件，例如 `claimSchedule` 的开始和 cliff。

该指令首先解析作为剩余账户传入的每个参照 bucket 上的 `TimeAbsolute` 条件，然后解析目标 bucket 上参照对象与这些账户之一匹配且时间已到的每个 `TimeRelative` 条件。

| 属性 | 值 |
|----------|-------|
| 签名者 | 仅手续费支付者（无需许可） |
| 目标 | 每条指令一个 bucket（`bucket` 账户） |
| 剩余账户 | 每个参照 bucket，**可写**，顺序不限 |
| 自引用 | 引用自身 bucket 的条件无需再次传入该 bucket 即可解析 |
| 重复运行 | 安全；已触发的条件会被跳过 |

{% code-tabs-imported from="genesis/trigger_conditions_after_graduation_v2" frameworks="umi" filename="triggerConditionsV2" /%}

### 何时调用 triggerConditionsV2 {% #when-to-call-trigger-conditions-v2 %}

请在参照事件和偏移量都已过去之后、在任何依赖该条件的指令之前调用 `triggerConditionsV2`。

| 依赖的操作 | 触发此 bucket | 作为剩余账户传入 |
|------------------|---------------------|---------------------------|
| 在毕业时开放 Launch Pool 领取 | Launch Pool | Raydium CPMM bucket |
| 在毕业时开放 Unlocked bucket 领取 | Unlocked bucket | Raydium CPMM bucket |
| 在毕业时开放归属领取门控、线性开始或 cliff | 领取计划 bucket | Raydium CPMM bucket |
| 相对于销售结束的毕业开始 | Raydium CPMM bucket | Launch Pool 或 Presale bucket |
| 相对于毕业的存款人归属（`claimSchedule` 扩展） | Launch Pool | Raydium CPMM bucket |

每个条件只有在其自身时间已过之后才会解析。cliff 设在毕业后 90 天的归属 bucket 需要两次 crank：一次在毕业时，用于领取门控和线性开始；另一次在 90 天后，用于 cliff。

{% callout type="note" %}
记录的 `triggeredTimestamp` 始终是参照时间加上偏移量，而不是 crank 实际运行的时间。较晚的 crank 会推迟领取的开始时间，但不会改变已归属的代币数量。
{% /callout %}

## 在 Raydium 毕业时开放领取 {% #opening-claims-at-raydium-graduation %}

在流动性上线时开放领取的标准模式，是使用一个以 Raydium CPMM bucket 的 `Graduate` 时间为参照的 `TimeRelative` 领取开始条件。

1. 在添加引用 Raydium CPMM bucket 的其他 bucket 之前，先使用 `findRaydiumCpmmBucketV2Pda` 派生其 PDA。
2. 将 Launch Pool、Unlocked 和领取计划 bucket 上的 `claimStartCondition` 设为 `createTimeRelativeCondition(raydiumBucket, BucketTimes.Graduate, offset)`。
3. `graduateToRaydiumCpmmV2` 成功后，对上述每个 bucket 调用 `triggerConditionsV2`，并将 Raydium bucket 作为剩余账户传入。
4. 从此刻起即可成功领取。

[Launch Pool 生命周期指南](/zh/smart-contracts/genesis/launch-pool-lifecycle)完整展示了这一模式，[Raydium CPMM 毕业](/zh/smart-contracts/genesis/raydium-cpmm-graduation)则介绍了毕业本身。

{% callout type="warning" %}
如果毕业从未发生，引用 `Graduate` 的条件将永远不会解析。请在销售 bucket 上添加 `TransmitFailure` [结束行为](/zh/smart-contracts/genesis/end-behaviors#failure-handling-with-transmit-failure)，这样销售失败时会开放或解除依赖的 bucket，而不会让代币被困住。
{% /callout %}

## 常见条件错误 {% #common-condition-errors %}

条件错误用于指出槽位不支持的条件类型、未解析的参照，或在条件满足之前就运行的指令。

| 错误 | 原因 | 解决方法 |
|-------|-------|------------|
| `InvalidConditionTypeForSlot` | 该槽位不允许此条件类型 | 使用[槽位表](#condition-slots-by-bucket-type)中的类型 |
| `InvalidPrimaryBucket` | `bucketTime` 在参照 bucket 类型中不存在 | 使 `BucketTimes` 与参照 bucket 类型相匹配 |
| `UninitializedCondition` | 条件对象保持为全零 | 使用 SDK 辅助函数构建条件 |
| `LaunchPoolNotEnded` | `triggerBehaviorsV2` 在存款结束条件满足之前运行 | 等待存款结束时间 |
| `GraduationNotStarted` | 毕业在 Raydium `startCondition` 解析之前运行 | 等待开始时间，或先触发 `TimeRelative` 开始条件 |

## 注意事项 {% #notes %}

- `TimeRelative` 条件永远不会被其所属 bucket 上的存款、领取或其他指令解析。只有 `triggerConditionsV2` 能解析它。
- `triggerConditionsV2` 每条指令只解析一个目标 bucket。如果容量允许，多次调用可以放在同一笔交易中。
- `TimeRelative` 领取门控、线性开始或 cliff 会使 `updateClaimScheduleBucketV2` 不可用，因为程序在更新时无法验证被引用的 bucket。请参阅[项目归属](/zh/smart-contracts/genesis/project-vesting)。
- `Always` 从不记录 `triggeredTimestamp`，因此不能用作 `TimeRelative` 条件的参照，也不能用于 `ClaimSchedule`。
- 示例已在 devnet 上使用 `@metaplex-foundation/genesis@0.44.0`，针对已部署的 Genesis 程序版本 `genesis v0.41.0`（`GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`）运行。来源：[metaplex-foundation/genesis](https://github.com/metaplex-foundation/genesis)。

## 常见问题 {% #faq %}

### TimeRelative 条件会自动触发吗？

不会。`TimeAbsolute` 条件会在任何指令检查它时自行更新，但 `TimeRelative` 条件会一直保持未触发状态，直到有人对其所属的 bucket 调用 `triggerConditionsV2`，并将被引用的 bucket 作为可写剩余账户传入。

### 谁可以调用 triggerConditionsV2？

任何钱包。`triggerConditionsV2` 只需要手续费支付者签名，因此项目后端、keeper 机器人或用户钱包都可以运行它。

### 如果 crank 运行较晚，TimeRelative 条件会记录什么时间戳？

条件记录的是参照时间加上偏移量，而不是 crank 实际运行的时间。较晚运行 `triggerConditionsV2` 会推迟条件在链上生效的时间，但不会改变归属或领取的计算结果。

### 如何在 Raydium 池创建时开放领取？

将领取开始条件设为 `TimeRelative`，以 Raydium CPMM bucket 作为参照，并以 `BucketTimes.Graduate` 作为 bucket 时间点。毕业后，对每个依赖的 bucket 调用 `triggerConditionsV2`，并将 Raydium bucket 作为剩余账户传入。

### 最终化之后还能更改 TimeRelative 条件吗？

不能。bucket 条件在 `finalizeV2` 时即被固定。唯一的例外是带有 `postponableStart` 扩展的 Raydium CPMM 毕业开始条件，Genesis authority 可以在配置的限制范围内将其推迟。

## 术语表 {% #glossary %}

| 术语 | 定义 |
|------|------------|
| **条件（Condition）** | 存储在 bucket 上的时间规则，满足时记录 `triggeredTimestamp` |
| **槽位（Slot）** | bucket 上的某个具体条件字段，例如 `claimStartCondition` |
| **参照 bucket（Reference bucket）** | `TimeRelative` 条件所锚定的 bucket |
| **BucketTimes** | 指定参照 bucket 事件的枚举，例如 `DepositEnd` 或 `Graduate` |
| **Crank** | 任何人都可以发送、用于推进链上状态的无需许可指令 |
| **Graduate 时间（Graduate time）** | `graduateToRaydiumCpmmV2` 创建 Raydium 池的时刻 |
