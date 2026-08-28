---
title: 项目归属
metaTitle: 使用 ClaimScheduleBucketV2 进行项目代币归属 | Genesis | Metaplex
description: 使用 Genesis ClaimScheduleBucketV2 创建链上项目代币归属计划，包括悬崖、周期性解锁、领取、暂停、取消和接收方转移。
created: '08-24-2026'
updated: '08-24-2026'
keywords:
  - Genesis project vesting
  - ClaimScheduleBucketV2
  - ClaimSchedule
  - token vesting
  - team token vesting
  - token cliff
  - Solana vesting
  - on-chain vesting
about:
  - Genesis project vesting
  - ClaimScheduleBucketV2
  - Token claim schedules
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - 配置带有悬崖和周期性线性解锁的 ClaimSchedule
  - 在 Finalize Genesis 账户之前添加 ClaimScheduleBucketV2
  - 将已归属代币领取到当前存储的接收方
  - 配置可选的暂停、取消和接收方转移策略
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: ClaimScheduleBucketV2 与 ClaimSchedule 有什么区别？
    a: ClaimScheduleBucketV2 是持有一名接收方分配和运行时状态的 Genesis 流出 Bucket。ClaimSchedule 是存储在该 Bucket 内的可复用悬崖与线性解锁曲线。
  - q: 归属接收方必须提交每一次领取吗？
    a: 不必。ClaimClaimScheduleV2 是 Permissionless 的，但程序始终将代币转到 Bucket 上存储的接收方。若配置了后端签名者扩展，该签名者也必须授权每一次领取。
  - q: 归属开始后项目还能更改归属计划吗？
    a: 不能。UpdateClaimScheduleBucketV2 仅在 Finalize 之前、领取门控或任一计划条件满足之前、以及尚未发生任何领取时有效。TimeRelative 领取门控、线性开始或悬崖也会立即禁用更新。
  - q: 归属 Bucket 被取消时，未归属代币会怎样？
    a: 取消会冻结归属，并保留已归属数量给接收方。若 Bucket 有 ReallocateBaseTokensOnCancel 行为，任何人都可以触发该行为，将未归属剩余转到 UnlockedBucketV2。
  - q: 一个 ClaimScheduleBucketV2 可以向多名接收方归属代币吗？
    a: 不可以。每个 Bucket 只有一名接收方。为需要独立记账或策略控制的每位接收方或每笔分配创建一个 ClaimScheduleBucketV2。
---

[Genesis](/zh/smart-contracts/genesis) 项目归属使用 `ClaimScheduleBucketV2`，按链上悬崖和周期性线性计划将一笔代币分配释放给一名接收方。 {% .lead %}

{% callout title="你将构建的内容" %}
本指南创建一份为期一年的项目代币归属分配，包含 10% 悬崖、按月线性解锁，以及可选的权限方控制。
{% /callout %}

## 摘要

`ClaimScheduleBucketV2` 是用于项目、团队、顾问或国库代币归属的一等 [Genesis](/zh/smart-contracts/genesis) 流出 Bucket。它在链上存储接收方、分配、领取历史、归属曲线、暂停状态、策略控制以及可选的取消行为。

- 一个 Bucket 将一笔代币分配归属给一名当前接收方
- `ClaimSchedule` 将独立悬崖与基于周期的线性解锁组合在一起
- 领取是 Permissionless 的，但始终支付给 Bucket 的接收方
- 可选策略支持权限方暂停、取消、接收方取消和接收方转移

**跳转至：** [快速开始](#快速开始) · [归属机制](#claim-schedule-归属机制) · [运行时控制](#项目归属运行时控制) · [取消](#取消后重新分配未归属代币) · [参考](#快速参考)

## ClaimScheduleBucketV2 与 ClaimSchedule

`ClaimScheduleBucketV2` 是拥有项目分配的账户，而 `ClaimSchedule` 是嵌入该账户的可复用归属曲线。

| 类型 | 用途 |
|------|---------|
| `ClaimScheduleBucketV2` | 存储一名接收方、分配、已领取数量、计划、领取门控、暂停状态、策略和结束行为 |
| `ClaimSchedule` | 定义悬崖数量、悬崖条件、线性开始条件、持续时间和解锁周期 |
| `ClaimScheduleV2Extensions` | 存储运行时策略标志和可选的后端领取签名者 |

{% callout type="note" %}
Genesis 没有 `ClaimScheduleBucketV1`。项目归属请使用 `V2` 账户和指令名称。`ClaimSchedule` 也被其他 Bucket 扩展使用，因此仅凭计划类型无法识别项目归属 Bucket。
{% /callout %}

## 快速开始

快速开始向已初始化但尚未 Finalize 的 Genesis V2 账户添加一个为期一年、带 10% 悬崖和按月线性解锁的归属 Bucket。

请先完成 [Genesis 设置](/zh/smart-contracts/genesis/getting-started)，并从基础代币供应量中预留归属分配。所有 Bucket 分配之和必须落在 Genesis 账户的总供应量之内。

### 创建项目归属 Bucket

`addClaimScheduleBucketV2` 在 Genesis 账户 Finalize 之前创建 Bucket。

{% code-tabs-imported from="genesis/add_claim_schedule_bucket_v2" frameworks="umi" filename="addClaimScheduleBucketV2" /%}

添加所有其他分发 Bucket，然后按 [Genesis 设置](/zh/smart-contracts/genesis/getting-started) 调用 `finalizeV2`。Finalize 不可逆。

### 领取已归属的项目代币

`claimClaimScheduleV2` 将当前已归属且尚未领取的全部代币转到 Bucket 存储的接收方。

{% code-tabs-imported from="genesis/claim_claim_schedule_v2" frameworks="umi" filename="claimClaimScheduleV2" /%}

支付方不必是接收方。该指令会在需要时创建接收方的 [associated token account](/zh/solana/understanding-solana-accounts#associated-token-accounts-atas)，并且永远不能将代币重定向到支付方。

{% callout type="note" %}
若自上次领取以来尚未经过一个完整归属周期，领取可能返回 `NothingToClaim`。请等待下一个周期，或在发送交易前检查获取到的 Bucket 状态。
{% /callout %}

## Claim Schedule 归属机制

领取计划将悬崖分配与剩余线性分配独立解锁。

| 字段 | 约束 | 效果 |
|-------|------------|--------|
| `startCondition` | `TimeAbsolute`、`TimeRelative` 或 `Never` | 锚定线性归属时间线 |
| `duration` | 大于零，不超过 10 年 | 定义线性分配何时完全归属 |
| `period` | 大于零且不超过 `duration` | 使线性归属按离散步骤推进 |
| `cliffCondition` | `TimeAbsolute`、`TimeRelative` 或 `Never` | 独立于线性计划解锁悬崖 |
| `cliffAmountBps` | `0` 到 `10_000` | 将分配的 0% 到 100% 分配给悬崖 |

对于分配 `A` 和悬崖基点 `C`，悬崖数量为 `A × C / 10,000`。剩余 `A - cliffAmount` 在 `duration` 内按完整 `period` 步骤线性归属。

{% callout type="note" %}
悬崖不会自动延迟线性计划。请将 `startCondition` 和 `cliffCondition` 显式设置为预期时间戳；任一条件都可能在另一条件之前、期间或之后触发。
{% /callout %}

{% callout type="warning" %}
悬崖不得晚于 `startCondition + duration`。线性完成后的成功领取会触发 Bucket 的结束条件；更晚的悬崖将超出冻结的有效时间，可能永远无法变为可领取。
{% /callout %}

### 领取门控与归属曲线

`claimStartCondition` 门控代币提取，而 `claimSchedule.startCondition` 控制线性分配何时累积。

这种分离支持在领取开放之前就开始累积的计划。例如，归属可以从入职日期开始，而 `claimStartCondition` 在代币生成事件之前阻止提取。

`TimeAbsolute` 条件在领取检查它们时会自我更新。`TimeRelative` 条件是被动的，需要 `triggerConditionsV2`，并将每个被引用的 Bucket 作为可写 remaining account 传入。

{% code-tabs-imported from="genesis/trigger_claim_schedule_conditions_v2" frameworks="umi" filename="triggerConditionsV2" /%}

在引用条件满足之后、领取或评估归属状态之前，运行此 Permissionless crank。

### 周期性线性解锁

`period` 字段使线性分配按步骤而不是连续解锁。

在 365 天 duration 和 30 天 period 下，线性分配在每个完整的 30 天周期后增加。任何舍入余数在完整 duration 结束时可领取。

### 暂停调整后的归属时间

暂停 Bucket 会停止归属时间，恢复时将有效时间线按总暂停时长平移。

Bucket 记录 `pausedAt` 和 `totalSecondsPaused`。在暂停期间取消会将计划冻结在 `pausedAt`，因此暂停所耗时间不会增加已归属数量。

## 项目归属运行时控制

运行时控制默认关闭，必须在创建 Bucket 时用策略标志启用。

| 策略标志 | 授权角色 | 指令 | 结果 |
|-------------|-----------------|-------------|--------|
| `pausable` | Genesis 权限方 | `setClaimSchedulePausedStateV2` | 暂停或恢复归属累积 |
| `cancelable` | Genesis 权限方 | `cancelClaimScheduleBucketV2` | 在取消时刻冻结归属 |
| `cancelableByRecipient` | 接收方 | `cancelClaimScheduleBucketV2` | 允许接收方冻结归属 |
| `transferable` | Genesis 权限方 | `transferRecipientClaimScheduleBucketV2` | 更改归属接收方 |
| `transferableByRecipient` | 接收方 | `transferRecipientClaimScheduleBucketV2` | 允许当前接收方转移分配 |

{% callout type="warning" %}
仅启用项目归属协议所需的控制。权限方取消或接收方转移权会实质改变向接收方提供的保证。
{% /callout %}

### 暂停和恢复项目归属

当创建时启用了 `pausable` 时，`setClaimSchedulePausedStateV2` 会暂停或恢复 Bucket。

{% code-tabs-imported from="genesis/pause_claim_schedule_bucket_v2" frameworks="umi" filename="pauseClaimScheduleBucketV2" /%}

设置 `paused: false` 以恢复。只有 Genesis 权限方可以使用此控制。

### 取消项目归属

`cancelClaimScheduleBucketV2` 冻结归属，但不会移除已经归属的代币。

{% code-tabs-imported from="genesis/cancel_claim_schedule_bucket_v2" frameworks="umi" filename="cancelClaimScheduleBucketV2" /%}

接收方可以继续领取已归属剩余。除非配置并触发 `ReallocateBaseTokensOnCancel` 结束行为，未归属代币仍留在 Genesis 账本中。

### 转移项目归属接收方

`transferRecipientClaimScheduleBucketV2` 更改接收所有未来领取的钱包。

{% code-tabs-imported from="genesis/transfer_claim_schedule_recipient_v2" frameworks="umi" filename="transferClaimScheduleRecipientV2" /%}

授权签名者取决于启用的是 `transferable` 还是 `transferableByRecipient`。

## 取消后重新分配未归属代币

`ReallocateBaseTokensOnCancel` 将已取消 Bucket 的未归属剩余的 100% 转到 `UnlockedBucketV2`。

在调用 `finalizeV2` 之前配置该行为，可通过 `addClaimScheduleBucketV2.endBehaviors` 或 `setClaimScheduleBucketV2Behaviors`。Genesis 程序在 Finalize 之后拒绝行为配置。

{% code-tabs-imported from="genesis/reallocate_claim_schedule_on_cancel_v2" frameworks="umi" filename="reallocateClaimScheduleOnCancelV2" /%}

该行为更改 Bucket 余额，而不是原始分配值。它只能在领取计划 Bucket 结束后运行，并且每个领取计划 Bucket 最多只能有一个取消再分配行为。

{% callout type="note" %}
使用 `TimeRelative` 开始或悬崖条件的计划必须先触发这些条件，取消再分配才能计算已归属数量。请先对所需引用账户运行 `triggerConditionsV2`。
{% /callout %}

## 发行前更新项目归属

`updateClaimScheduleBucketV2` 仅能在 Finalize 之前且归属尚未开始时替换分配、计划或领取开始条件。

在任何代币已被领取、`claimStartCondition` 已满足，或线性开始或悬崖条件已满足之后，Bucket 会以 `ClaimScheduleUpdateForbidden` 拒绝更新。这三个槽位中的任一 `TimeRelative` 条件也会立即禁用更新，因为程序在更新期间无法验证其引用 Bucket。运行时暂停、取消和转移控制使用专用指令，而不是更新指令。

## 获取项目归属状态

`fetchClaimScheduleBucketV2` 返回分配、领取进度、有效暂停状态、策略和结束行为。

{% code-tabs-imported from="genesis/fetch_claim_schedule_bucket_v2" frameworks="umi" filename="fetchClaimScheduleBucketV2" /%}

会计不变量是 `baseTokenBalance = baseTokenAllocation - amountClaimed`，直到结束行为重新分配未归属余额。

## ClaimScheduleBucketV2 账户字段

`ClaimScheduleBucketV2` 账户在固定归属状态之后存储可变长度的结束行为列表。

| 字段 | 说明 |
|-------|-------------|
| `bucket` | 包含分配、剩余余额、mint、index 和费用数据的共享 Bucket 头 |
| `recipient` | 接收每笔已归属代币领取的钱包 |
| `amountClaimed` | 已转到接收方的累计代币 |
| `claimSchedule` | 悬崖与基于周期的线性归属曲线 |
| `claimStartCondition` | 领取开始前必须打开的独立门控 |
| `claimEndCondition` | 由取消或自然完成触发的程序拥有结束条件 |
| `paused` | 归属时间当前是否停止 |
| `pausedAt` | 当前暂停开始的时间戳 |
| `totalSecondsPaused` | 从归属中排除的累计暂停时长 |
| `extensions` | 运行时策略和可选后端签名者 |
| `endBehaviors` | Bucket 结束后可用的操作 |

## 常见项目归属错误

领取计划错误标识无效的计划配置、未授权控制，或在错误生命周期阶段尝试的操作。

| 错误 | 原因 | 解决方法 |
|-------|-------|------------|
| `InvalidClaimSchedulePeriod` | `period` 为零 | 使用正数 period |
| `InvalidClaimScheduleDuration` | `duration` 为零或超过 10 年 | 使用 1 秒到 315,360,000 秒的 duration |
| `ClaimScheduleDurationTooShort` | `period` 超过 `duration` | 减小 period 或增加 duration |
| `InvalidClaimScheduleCliffAmount` | `cliffAmountBps` 超过 `10_000` | 使用 0 到 10,000 基点 |
| `NothingToClaim` | 没有新的悬崖或完整线性周期已归属 | 等待下一次解锁或检查 Bucket 状态 |
| `ClaimScheduleUpdateForbidden` | 领取门控或计划已开始、代币已被领取，或相关条件为 `TimeRelative` | 在触发前配置绝对时间字段；相对计划无法更新 |
| `ClaimScheduleUnauthorized` | 签名者不允许使用该控制 | 使用已启用策略所要求的 Genesis 权限方或接收方 |
| `ClaimSchedulePolicyDisabled` | 请求的暂停、取消或转移策略已关闭 | 创建 Bucket 时启用该策略 |
| `InvalidBackendSigner` | 配置的后端签名者未授权领取 | 包含配置的后端签名者 |
| `ClaimScheduleConditionNotTriggered` | 取消再分配依赖于未解析的相对条件 | 先触发相对计划条件 |

## 快速参考

项目归属可通过 Genesis V2 和 `@metaplex-foundation/genesis` 使用。

| 项目 | 值 |
|------|-------|
| Program | `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` |
| Tested SDK | `@metaplex-foundation/genesis@0.41.1` |
| Tested Umi compatibility | `@metaplex-foundation/umi@^1.4.1` |
| Bucket PDA seeds | `"claim_schedule_v2"`、Genesis 账户、作为 `u8` 的 `bucketIndex` |
| Maximum vesting duration | 315,360,000 秒（10 年） |
| Cliff range | 0 到 10,000 基点 |
| Recipients per bucket | 一名 |
| Bucket creation fee | 0 |
| Devnet validation | 添加、Finalize、暂停、转移、领取、取消和再分配的完整流程于 2026-08-24 通过（[测试账户](https://explorer.solana.com/address/3jjvwp9QnUfU2RJGzhJNJZPXH4HT6TrbaUcemku4ZYhT?cluster=devnet)） |
| Source | [metaplex-foundation/genesis](https://github.com/metaplex-foundation/genesis) |

## 注意事项

项目归属具有应纳入项目代币分发设计的生命周期和授权约束。

- 在调用 `finalizeV2` 之前添加并配置 `ClaimScheduleBucketV2` 账户。
- 为每位接收方或独立管理的分配创建一个 Bucket。
- 除非配置了可选后端签名者扩展，否则领取是 Permissionless 的。
- 后端签名者增加领取授权，但不能将领取从当前存储的接收方重定向走。
- 取消保留已归属代币；收回未归属代币需要 `ReallocateBaseTokensOnCancel`。
- `Never` 计划会永久锁定代币，主要用于 [锁定的 LP 代币](/zh/smart-contracts/genesis/locked-lp-tokens)。

## 常见问题

### ClaimScheduleBucketV2 与 ClaimSchedule 有什么区别？

`ClaimScheduleBucketV2` 是持有一名接收方分配和运行时状态的 Genesis 流出 Bucket。`ClaimSchedule` 是存储在该 Bucket 内的可复用悬崖与线性解锁曲线。

### 归属接收方必须提交每一次领取吗？

不必。`claimClaimScheduleV2` 是 Permissionless 的，但程序始终将代币转到 Bucket 上存储的接收方。若配置了后端签名者扩展，该签名者也必须授权每一次领取。

### 归属开始后项目还能更改归属计划吗？

不能。`updateClaimScheduleBucketV2` 仅在 Finalize 之前、领取门控或任一计划条件满足之前、以及尚未发生任何领取时有效。`TimeRelative` 领取门控、线性开始或悬崖也会立即禁用更新。

### 归属 Bucket 被取消时，未归属代币会怎样？

取消会冻结归属，并保留已归属数量给接收方。若 Bucket 有 `ReallocateBaseTokensOnCancel` 行为，任何人都可以触发该行为，将未归属剩余转到 `UnlockedBucketV2`。

### 一个 ClaimScheduleBucketV2 可以向多名接收方归属代币吗？

不可以。每个 Bucket 只有一名接收方。为需要独立记账或策略控制的每位接收方或每笔分配创建一个 `ClaimScheduleBucketV2`。

## 术语表

项目归属术语区分 Bucket 账户、其嵌入计划和生命周期控制。

| 术语 | 定义 |
|------|------------|
| **ClaimScheduleBucketV2** | 将一笔基础代币分配归属给一名接收方的 Genesis 流出 Bucket |
| **ClaimSchedule** | 可复用的悬崖与基于周期的线性代币解锁曲线 |
| **Claim gate** | 控制提取何时可以开始的 Bucket 级 `claimStartCondition` |
| **Cliff** | 独立条件触发时解锁的总分配百分比 |
| **Period** | 用于按离散步骤推进线性归属的间隔 |
| **Effective time** | 排除 Bucket 暂停时长后的挂钟时间 |
| **Cancellation reallocation** | 将已取消 Bucket 的未归属剩余转到未锁定 Bucket 的结束行为 |
