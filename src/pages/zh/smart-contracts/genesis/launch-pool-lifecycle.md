---
title: 使用 SDK 完成 Launch Pool 生命周期
metaTitle: 包含 Raydium 毕业的完整 Genesis Launch Pool 生命周期 | Metaplex
description: 使用 JavaScript SDK 运行 Genesis Launch Pool 的端到端指南——bucket、Raydium CPMM 毕业、相对于毕业的领取、团队归属、资金库、运营 crank 以及销售页面。
created: '10-29-2026'
updated: '11-25-2026'
keywords:
  - Genesis launch pool lifecycle
  - token launch SDK
  - Raydium graduation
  - triggerBehaviorsV2
  - triggerConditionsV2
  - launch crank
  - token sale page
  - claim after graduation
about:
  - Genesis Launch Pool
  - Raydium CPMM graduation
  - Launch operations
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - 初始化 Genesis 账户，并添加 Launch Pool、Raydium CPMM、Unlocked 和领取计划 bucket
  - 配置结束行为和相对于毕业的领取条件，然后最终化
  - 在存款开放期间提供读取 bucket 和存款状态的销售页面
  - 运行 crank 以触发行为、毕业到 Raydium、rollover 代币并触发领取条件
  - 让存款人、资金库和团队领取，然后管理 LP 代币和费用
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: 使用 SDK 构建的发行需要自己运行 crank 吗？
    a: 需要。对于直接使用 SDK 创建的发行，请计划自行运行 crank。每个 crank 步骤（triggerBehaviorsV2、graduateToRaydiumCpmmV2 和 triggerConditionsV2）都无需许可，只需要一个有余额的手续费支付者。
  - q: 如果存款结束后没有人运行 crank 会怎样？
    a: 一切都不会推进。募集的 SOL 留在 Launch Pool 中，Raydium 池不会被创建，相对于毕业的领取也永远不会开放。存款人的资金仍然安全，但发行会停滞，直到有人发送 crank 交易。
  - q: 存款结束后多久用户可以领取？
    a: 只要 crank 运行完三个步骤即可：对 Launch Pool 运行 triggerBehaviorsV2、运行 graduateToRaydiumCpmmV2，以及对 Launch Pool 运行 triggerConditionsV2。每分钟轮询一次的 crank 通常会在毕业开始时间后的几分钟内完成这些步骤。
  - q: bucket 分配量之和必须等于总供应量吗？
    a: 是的。finalizeV2 要求所有 bucket 的 baseTokenAllocation 之和等于 Genesis 账户的总供应量。
  - q: 存款人的代币可以归属，而不是在领取时直接解锁吗？
    a: 可以。为 Launch Pool bucket 添加 claimSchedule 扩展。其开始和 cliff 条件也可以是相对于 Raydium Graduate 时间的 TimeRelative 条件。
---

本指南使用 JavaScript SDK 运行一个完整的 [Genesis](/zh/smart-contracts/genesis) [Launch Pool](/zh/smart-contracts/genesis/launch-pool)，涵盖从 bucket 设置到 Raydium 毕业、相对于毕业的领取、团队归属，以及推动每个阶段前进的运营 crank。 {% .lead %}

{% callout title="你将构建的内容" %}
一次发行：在为期 3 天的 Launch Pool 中出售 60% 的供应量，将 20% 的募集 SOL 发送到 Raydium CPMM 池、80% 发送到资金库，在池上线的那一刻开放所有领取，并在毕业后将团队代币归属一年。
{% /callout %}

{% callout title="无代码选项" %}
如需在不编写代码的情况下发行代币，请使用 [Metaplex 代币发行平台](https://www.metaplex.com)。如需通过代码一次调用创建带有 Raydium 流动性和归属的发行池，请使用 [Genesis API 客户端](/zh/smart-contracts/genesis/sdk/api-client) 的 `createAndRegisterLaunch`。本指南适用于需要完全控制每个 bucket 和设置的发行。
{% /callout %}

## 摘要 {% #summary %}

完整的 SDK 发行由四种在 `finalizeV2` 之前相互关联的 bucket 类型，加上一个在存款窗口关闭后发送无需许可交易的 crank 组成。

- Launch Pool 出售代币；Raydium CPMM 创建流动性；Unlocked 持有资金库；领取计划为团队归属代币
- 每个领取都使用锚定到 Raydium `Graduate` 时间的 `TimeRelative` 条件
- crank 运行 `triggerBehaviorsV2`、`graduateToRaydiumCpmmV2` 和 `triggerConditionsV2`——不会有任何操作自动发生
- 已在 devnet 上使用 `@metaplex-foundation/genesis@0.44.0`，针对已部署的 Genesis 版本 `genesis v0.41.0` 端到端运行

## 何时使用本指南 {% #when-to-use-this-guide %}

当发行需要 Metaplex 发行平台和 API 不提供的设置时，请使用本指南。否则，[Metaplex 代币发行平台](https://www.metaplex.com) 或 [Genesis API 客户端](/zh/smart-contracts/genesis/sdk/api-client) 可以用少得多的代码创建类似的发行池。

| | Metaplex 发行平台 / Genesis API 客户端 | 本指南（Genesis SDK） |
|---|---|---|
| 设置 | 一个表单，或一次 `createAndRegisterLaunch` 调用 | 约八笔需要自行构建和发送的交易 |
| 在 metaplex.com 上展示 | 是，发行通过 `registerLaunch` 注册 | 否，发行不会注册到 Metaplex API |
| 供应量和小数位 | 新代币默认 10 亿代币、6 位小数 | 任意供应量和小数位 |
| Raydium 流动性 | 募集资金的 20–100%；LP 代币锁定 1 年，按季度解锁 | 任意比例、开始条件和 LP 策略 |
| Bucket | 一个 Launch Pool、一个 Unlocked bucket，以及可选的领取计划 | Genesis bucket 和结束行为的任意组合 |
| 存款结束后 | 由 Metaplex 运行 crank：结束行为、Raydium 毕业和领取条件 | 由你运行执行结束行为、毕业和领取的 crank |

## 快速开始 {% #quick-start %}

发行分为四个步骤，每个步骤都链接到包含代码的章节。

1. [配置并最终化发行](#step-1-configure-and-finalize-the-launch)：初始化代币，添加带有结束行为和以毕业为基准的条件的四个 bucket，然后最终化。
2. [构建销售页面](#step-2-build-the-sale-page)：在存款期间读取 bucket 和存款状态，显示阶段、总额和钱包的头寸。
3. [运行发行 crank](#step-3-run-the-launch-crank)：存款结束后，执行结束行为、毕业到 Raydium、滚转未使用的代币并开放领取。[运行手册](#operator-crank-runbook)列出了所有交易。
4. [领取并完成发行](#step-4-claims-and-post-launch-operations)：存款人、资金库和团队进行领取；authority 撤销铸造权限和冻结权限。

**跳转至：** [架构](#launch-architecture) · [设置](#step-1-configure-and-finalize-the-launch) · [销售页面](#step-2-build-the-sale-page) · [Crank](#step-3-run-the-launch-crank) · [运行手册](#operator-crank-runbook) · [领取](#step-4-claims-and-post-launch-operations)

## 前置条件 {% #prerequisites %}

- Node.js 18+ 以及 `@metaplex-foundation/genesis`、`@metaplex-foundation/umi`、`@metaplex-foundation/umi-bundle-defaults` 和 `@metaplex-foundation/mpl-toolbox` 包
- 一个用于设置的有余额的 authority 钱包，以及一个有余额的 crank 钱包（两者可以是同一个）
- 熟悉 [Genesis 设置](/zh/smart-contracts/genesis/getting-started)

| 工具 | 已测试版本 |
|------|----------------|
| `@metaplex-foundation/genesis` | 0.44.0 |
| `@metaplex-foundation/mpl-toolbox` | 0.12.x |
| `@metaplex-foundation/umi` | 1.x |
| Genesis 程序 | `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` |

## 发行架构 {% #launch-architecture %}

该发行使用四个 bucket，其分配量之和为 1,000,000 枚代币的总供应量。

| Bucket | 类型 | 分配量 | 接收 | 领取开放时间 |
|--------|------|------------|----------|-------------|
| Launch Pool | `LaunchPoolBucketV2` | 600,000 | SOL 存款 | Graduate 时间 |
| Raydium CPMM | `RaydiumCpmmBucketV2` | 120,000 | 20% 的 SOL + 起始价格 | —（池流动性） |
| 资金库 | `UnlockedBucketV2` | 80,000 | 80% 的 SOL + 未使用的 Raydium 代币 | Graduate 时间 |
| 团队归属 | `ClaimScheduleBucketV2` | 200,000 | — | Graduate 时间；+90 天时 10% cliff，之后 1 年内按月解锁 |

```
Launch Pool ──SendQuoteTokenPercentage 20% + SendStartPrice──▶ Raydium CPMM ──graduate──▶ Raydium pool
     │                                                              │
     └──SendQuoteTokenPercentage 80%──▶ Treasury ◀──BaseTokenRollover┘

Claim starts (Launch Pool, Treasury, Team) = TimeRelative(Raydium CPMM, Graduate, offset)
```

*图示：Launch Pool 的结束行为将 20% 的募集 SOL 和起始价格发送到 Raydium CPMM bucket，并将 80% 发送到资金库 Unlocked bucket；毕业后，Raydium bucket 将未使用的基础代币 rollover 到资金库，所有领取开始条件都引用 Raydium 的 Graduate 时间。*

Raydium 分配量等于 Launch Pool 分配量 × 20%，与发送到池中的收益份额一致。分配量的计算方式请参阅 [Raydium CPMM 毕业](/zh/smart-contracts/genesis/raydium-cpmm-graduation#raydium-pool-starting-price)。

## 步骤 1：配置并最终化发行 {% #step-1-configure-and-finalize-the-launch %}

设置脚本初始化代币，先派生全部四个 bucket 地址以便它们相互引用，然后添加 bucket，最后将每个 bucket 作为剩余账户传入并进行最终化。

{% code-tabs-imported from="genesis/launch_pool_lifecycle_setup" frameworks="umi" filename="setupLaunch" /%}

### 设置脚本中的关键配置选择 {% #key-configuration-choices-in-the-setup-script %}

以下每项选择都是为了确保发行可以安全地被 crank 推进，并且每笔分配都可以领取。

| 选择 | 原因 |
|--------|--------|
| 在任何 `add*` 调用之前派生 PDA | bucket 会在行为和条件中引用之后才创建的 bucket |
| 三个 bucket 上的 `claimStartCondition: atGraduation()` | 在流动性存在之前，任何人都无法领取或出售 |
| Raydium `startCondition` = 存款结束 | 只要行为送达 SOL 和价格，毕业即可运行 |
| `Triggered` LP 锁定开始条件 | 锁定计时恰好在毕业时开始，无需额外的 crank |
| 资金库 `claimEndCondition: Never` | 毕业后才到账的 rollover 代币仍可领取 |
| Raydium bucket 上的 `BaseTokenRollover` | 回收毕业未配对的任何基础代币，例如舍入产生的零头 |

{% callout type="warning" %}
`finalizeV2` 不可撤销。之后 bucket 分配量、条件和结束行为都无法更改。请先检查每个地址、百分比和时间戳——最好在 devnet 上完整运行一遍整个生命周期。
{% /callout %}

对于可能失败的发行，请为 Launch Pool 添加 `minimumQuoteTokenThreshold`，并同时添加 `ReallocateBaseTokensOnFailure` 和 `TransmitFailure` 行为，这样销售失败时会返还代币，并解除相对于毕业的 bucket 的阻塞。请参阅[失败处理](/zh/smart-contracts/genesis/end-behaviors#failure-handling-with-transmit-failure)。

## 步骤 2：构建销售页面 {% #step-2-build-the-sale-page %}

销售页面读取 Launch Pool、Raydium 和存款账户，以显示当前阶段、总额以及已连接钱包的持仓。

{% code-tabs-imported from="genesis/launch_pool_sale_page_state" frameworks="umi" filename="salePageState" /%}

| 销售页面操作 | 指令 | 文档 |
|------------------|-------------|------|
| 存款前包装 SOL | `wrapSol` 辅助函数 | [包装 SOL](/zh/smart-contracts/genesis/launch-pool#wrapping-sol) |
| 存款 | `depositLaunchPoolV2` | [存款](/zh/smart-contracts/genesis/launch-pool#depositing) |
| 在窗口期间提款 | `withdrawLaunchPoolV2` | [提款](/zh/smart-contracts/genesis/launch-pool#withdrawing) |
| 领取代币 | `claimLaunchPoolV2` | [领取代币](/zh/smart-contracts/genesis/launch-pool#claiming-tokens) |
| 超额认购或失败时退款 | `refundLaunchPoolV2` | [退款](/zh/smart-contracts/genesis/launch-pool#refunding-a-deposit) |

可选的 Launch Pool 扩展用于控制谁可以存款以及存款人如何获得代币：`allowlist` 用于设有门槛的销售，`backendSigner` 用于要求服务器共同签名（例如在 KYC 之后），`depositLimit` 和 `minimumDepositAmount` 用于设置每个钱包的上下限，`claimSchedule` 用于对存款人代币进行归属。请参阅 [Launch Pool 扩展](/zh/smart-contracts/genesis/launch-pool#launch-pool-extensions)。

{% callout type="note" %}
请将"等待领取 crank"显示为一个独立的阶段。在毕业与 `triggerConditionsV2` 调用之间，池已在 Raydium 上线，但 `claimLaunchPoolV2` 仍会失败，否则用户会将其误认为是 bug。
{% /callout %}

## 步骤 3：运行发行 Crank {% #step-3-run-the-launch-crank %}

crank 是一个幂等脚本，它检查链上状态并发送下一笔无需许可的交易，因此可以按定时器运行，直到所有步骤完成。

{% code-tabs-imported from="genesis/launch_pool_lifecycle_crank" frameworks="umi" filename="crank" /%}

请从服务器、定时任务或 keeper 机器人每分钟运行一次。任何有余额的钱包都可以支付；它不需要 Genesis authority 密钥。crank 只会在某个 bucket 的条件到期时才为其发送 `triggerConditionsV2`，因此在团队 cliff 之前的 90 天内它会保持空闲，而不是每分钟都支付一次费用。

## 运营 Crank 运行手册 {% #operator-crank-runbook %}

运行手册按顺序列出发行在 `finalizeV2` 之后需要的每笔交易，以及跳过时会出现什么问题。

| # | 时间 | 指令 | 签名者 | 如果跳过 |
|---|------|-------------|--------|-----------|
| 1 | `depositEnd` 之后 | 对 Launch Pool 运行 `triggerBehaviorsV2`，传入 Raydium 和资金库的账户对 | 任何支付者 | SOL 和价格都不会到达 Raydium；毕业失败并返回 `InvalidAmount`；资金库没有 SOL |
| 2 | 步骤 1 之后且 Raydium `startCondition` 满足后 | `graduateToRaydiumCpmmV2` | 任何支付者（如已配置，另加后端签名者） | 没有池；所有相对于毕业的领取保持关闭 |
| 3 | 步骤 2 之后 | 对 Raydium bucket 运行 `triggerBehaviorsV2`，传入资金库的账户对 | 任何支付者 | 未使用的 Raydium 基础代币仍锁定在 Genesis 中 |
| 4 | 步骤 2 之后 | 对 Launch Pool、资金库和团队 bucket 运行 `triggerConditionsV2`，每次都将 Raydium bucket 作为剩余账户传入 | 任何支付者 | 即使池已上线，**领取也永远不会开放** |
| 5 | Graduate + 90 天 | 再次对团队 bucket 运行 `triggerConditionsV2` | 任何支付者 | 团队 cliff 保持锁定 |
| 6 | 持续进行 | `collectRaydiumCpmmFeesV2` 或 `collectRaydiumCpmmFeesWithCreatorFeeV2` | 任何支付者 | Raydium 创作者费持续累积而未被收取 |

{% callout type="warning" %}
步骤 4 是团队最常遗漏的步骤。毕业只会在 Raydium bucket 上记录 `Graduate` 时间；每个带有 `TimeRelative` 条件的 bucket 都必须单独触发。请参阅[条件与触发](/zh/smart-contracts/genesis/conditions#when-to-call-trigger-conditions-v2)。
{% /callout %}

## 步骤 4：领取与发行后操作 {% #step-4-claims-and-post-launch-operations %}

crank 完成后，各方使用各自的指令领取，Genesis authority 则负责其余的管理操作。

| 角色 | 操作 | 指令 | 文档 |
|-----|--------|-------------|------|
| 存款人 | 领取购买的代币 | `claimLaunchPoolV2` | [Launch Pool](/zh/smart-contracts/genesis/launch-pool#claiming-tokens) |
| 资金库 | 领取 80% 的 SOL、基础代币分配和 rollover | `claimUnlockedV2` | [Unlocked Bucket](/zh/smart-contracts/genesis/unlocked-bucket#claiming-from-an-unlocked-bucket) |
| 团队 | 领取已归属的代币 | `claimClaimScheduleV2` | [项目归属](/zh/smart-contracts/genesis/project-vesting#claim-vested-project-tokens) |
| LP 领取权限 | 每季度领取已解锁的 LP 代币 | `claimRaydiumCpmmLpTokensV2` | [Raydium LP 代币](/zh/smart-contracts/genesis/raydium-cpmm-graduation#managing-raydium-lp-tokens) |
| Genesis authority | 撤销铸币权限和冻结权限 | `revokeV2` | [JavaScript SDK](/zh/smart-contracts/genesis/sdk/javascript#revoke-v2) |

## 常见生命周期错误 {% #common-lifecycle-errors %}

生命周期错误通常意味着某个 crank 步骤的执行顺序有误，或 bucket 配置的数量对不上。

| 错误 | 原因 | 解决方法 |
|-------|-------|------------|
| `LaunchPoolNotEnded` | 在 `depositEnd` 之前触发了行为 | 等待存款窗口关闭 |
| 毕业时的 `InvalidAmount` | Launch Pool 行为尚未运行 | 先运行运行手册的步骤 1 |
| `GraduationNotStarted` | Raydium `startCondition` 未满足 | 等待，或触发 `TimeRelative` 开始条件 |
| `ClaimNotStarted` | 毕业后未运行 `triggerConditionsV2` | 运行运行手册的步骤 4 |
| `RecipientMismatch` | 发送 `claimUnlockedV2` 时未传入存储的接收者 | 传入 `recipient: bucket.recipient` |
| `TotalSupplyNotFullyAllocated` | bucket 分配量之和不等于总供应量 | 在 `finalizeV2` 之前重新计算分配量 |
| `MissingFinalizeBucketAccounts` | 调用 `finalizeV2` 时未将每个 bucket 作为剩余账户传入 | 以只读方式传入所有 bucket PDA |

## 注意事项 {% #notes %}

- 对于直接使用 SDK 创建的发行，不要依赖 Metaplex 基础设施来运行 crank。请自行运行 crank 并对其进行监控。
- 所有 crank 指令都是幂等的：重复或并发的交易会失败或不执行任何操作，而不会重复转移资金。
- Launch Pool 默认向 Raydium 和资金库转发收益时不收取费用；资金库在领取时支付领取费。请参阅[协议费用](/zh/smart-contracts/genesis#protocol-fees)。
- 本指南介绍 Raydium CPMM。Raydium CLMM 毕业使用不同的 bucket 和指令。
- 设置、销售页面和 crank 示例已在 devnet 上使用 `@metaplex-foundation/genesis@0.44.0`，针对已部署的 Genesis 版本 `genesis v0.41.0` 端到端运行，并缩短了存款窗口。在 devnet 上，请向 `deriveRaydiumPDAsV2` 传入 `{ env: 'devnet' }`。已部署的程序不支持 Token-2022 基础代币铸币。来源：[metaplex-foundation/genesis](https://github.com/metaplex-foundation/genesis)。

## 常见问题 {% #faq %}

### 使用 SDK 构建的发行需要自己运行 crank 吗？

需要。对于直接使用 SDK 创建的发行，请计划自行运行 crank。每个 crank 步骤（`triggerBehaviorsV2`、`graduateToRaydiumCpmmV2` 和 `triggerConditionsV2`）都无需许可，只需要一个有余额的手续费支付者。

### 如果存款结束后没有人运行 crank 会怎样？

一切都不会推进。募集的 SOL 留在 Launch Pool 中，Raydium 池不会被创建，相对于毕业的领取也永远不会开放。存款人的资金仍然安全，但发行会停滞，直到有人发送 crank 交易。

### 存款结束后多久用户可以领取？

只要 crank 运行完三个步骤即可：对 Launch Pool 运行 `triggerBehaviorsV2`、运行 `graduateToRaydiumCpmmV2`，以及对 Launch Pool 运行 `triggerConditionsV2`。每分钟轮询一次的 crank 通常会在毕业开始时间后的几分钟内完成这些步骤。

### bucket 分配量之和必须等于总供应量吗？

是的。`finalizeV2` 要求所有 bucket 的 `baseTokenAllocation` 之和等于 Genesis 账户的总供应量。

### 存款人的代币可以归属，而不是在领取时直接解锁吗？

可以。为 Launch Pool bucket 添加 `claimSchedule` 扩展。其开始和 cliff 条件也可以是相对于 Raydium `Graduate` 时间的 `TimeRelative` 条件。

## 后续步骤 {% #next-steps %}

- [条件与触发器](/zh/smart-contracts/genesis/conditions) - `TimeRelative` 条件和 `triggerConditionsV2` 的工作方式
- [结束行为](/zh/smart-contracts/genesis/end-behaviors) - 收益路由、滚转和失败处理
- [Raydium CPMM 毕业](/zh/smart-contracts/genesis/raydium-cpmm-graduation) - 毕业 bucket、LP 代币和手续费
- [Genesis API 客户端](/zh/smart-contracts/genesis/sdk/api-client) - 一次调用创建发行池并在 metaplex.com 上展示
