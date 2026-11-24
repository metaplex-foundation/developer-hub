---
title: JavaScript SDK
metaTitle: JavaScript SDK | Genesis | Metaplex
description: Genesis JavaScript SDK 的 API 参考。涵盖 Solana 代币发行所用的函数签名、条件与结束行为类型、Raydium CPMM 毕业指令以及错误码。
created: '01-15-2025'
updated: '11-24-2026'
keywords:
  - Genesis SDK
  - JavaScript SDK
  - TypeScript SDK
  - token launch SDK
  - Umi framework
  - Genesis API reference
  - refundLaunchPoolV2
  - soft cap
  - triggerConditionsV2
  - triggerBehaviorsV2
  - graduateToRaydiumCpmmV2
  - addRaydiumCpmmBucketV2
  - TimeRelative condition
  - EndBehavior
about:
  - SDK installation
  - API reference
  - Genesis instructions
  - Raydium CPMM graduation
  - Genesis conditions and end behaviors
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 什么是 Umi，为什么需要它？
    a: Umi 是 Metaplex 的 Solana JavaScript 框架。它提供了统一的接口来构建交易、管理签名者以及与 Metaplex 程序交互。
  - q: 我可以在浏览器中使用 Genesis SDK 吗？
    a: 可以。SDK 在 Node.js 和浏览器环境中都可以使用。在浏览器中，请使用钱包适配器进行签名，而不是密钥对文件。
  - q: fetch 和 safeFetch 有什么区别？
    a: fetch 在账户不存在时会抛出错误。safeFetch 则返回 null，适用于检查账户是否存在而无需错误处理。
  - q: 如何获取代币的发行类型？
    a: 使用代币的铸币地址通过 fetchGenesisAccountV2FromSeeds 获取 GenesisAccountV2 链上账户。launchType 字段返回 0（未初始化）或 3（LaunchPoolV1）。您也可以使用 GPA 构建器查询特定类型的所有发行。
  - q: 哪些 Genesis 指令可以由任意钱包调用？
    a: triggerConditionsV2、triggerBehaviorsV2、graduateToRaydiumCpmmV2、collectRaydiumCpmmFeesV2、collectRaydiumCpmmFeesWithCreatorFeeV2、claimRaydiumCreatorFeeV2、claimUnlockedV2 和 claimClaimScheduleV2 只需要手续费支付者签名。资金始终转入 bucket 上存储的地址。如果 bucket 带有后端签名者扩展，该签名者还必须共同签署毕业和领取操作。
  - q: 为什么 Raydium 毕业后领取仍然失败？
    a: 以 Raydium bucket 的 Graduate 时间为参照的 TimeRelative 领取条件，不会被毕业操作或领取操作本身解析。请对每个依赖的 bucket 调用 triggerConditionsV2，并将 Raydium CPMM bucket 作为可写剩余账户传入。
  - q: 如何处理交易错误？
    a: 将 sendAndConfirm 调用包装在 try/catch 块中，并将错误名称与常见错误表进行对照。常见错误包括资金不足、账户已最终化、条件尚未触发以及毕业尚未开始。
---

Genesis JavaScript SDK（`@metaplex-foundation/genesis`）的 API 参考。完整教程请参阅 [Launch Pool](/zh/smart-contracts/genesis/launch-pool) 或 [Presale](/zh/smart-contracts/genesis/presale)。 {% .lead %}

## 摘要 {% #summary %}

Genesis JavaScript SDK 将每一条 Genesis 程序指令都封装为 Umi 构建器，并提供 PDA 辅助函数、账户获取函数和条件辅助函数，用于在 Solana 上构建代币发行。

- 指令构建器涵盖 bucket 设置、存款与领取、Raydium CPMM 毕业、LP 代币与池费用、Unlocked bucket 以及领取计划（claim schedule）
- `triggerConditionsV2` 和 `triggerBehaviorsV2` 是无需许可的 crank，分别用于解析条件和执行结束行为
- 下文给出了条件（`TimeAbsolute`、`TimeRelative`、`Triggered`、`TriggeredWithExpiry`、`Never`、`Always`）和结束行为（六种类型）的确切对象结构
- 已针对 `@metaplex-foundation/genesis` 0.44.0 和 Genesis 程序 `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` 验证

**跳转至：** [指令](#instructions-reference) · [Raydium CPMM](#raydium-cpmm-graduation-signatures) · [条件与行为](#condition-and-behavior-signatures) · [TimeCondition](#time-condition) · [EndBehavior](#end-behavior) · [错误](#common-errors)

{% quick-links %}

{% quick-link title="NPM Package" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/genesis" description="@metaplex-foundation/genesis" /%}

{% quick-link title="TypeDoc" target="_blank" icon="JavaScript" href="https://mpl-genesis.typedoc.metaplex.com/" description="自动生成的 API 文档" /%}

{% /quick-links %}

## 安装 {% #installation %}

Genesis SDK 通过 npm 与 Umi 及 Metaplex toolbox 包一起安装。

```bash
npm install @metaplex-foundation/genesis @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-toolbox \
  @metaplex-foundation/mpl-token-metadata
```

## 设置 {% #setup %}

SDK 通过 `.use(genesis())` 注册为 Umi 插件。

```typescript {% title="setup.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { genesis } from '@metaplex-foundation/genesis';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(genesis())
  .use(mplTokenMetadata());
```

完整的实现示例请参阅 [Launch Pool](/zh/smart-contracts/genesis/launch-pool) 或 [Presale](/zh/smart-contracts/genesis/presale)。

---

## 指令参考 {% #instructions-reference %}

下表按功能领域列出了每个 Genesis 指令构建器及其所需签名的账户。"仅支付者"表示该指令无需许可：任何钱包都可以发送，且资金始终转入 bucket 上存储的地址。

### 核心指令 {% #core-instructions %}

| 函数 | 描述 | 签名者 |
|----------|-------------|---------|
| [initializeV2()](#initialize-v2) | 创建 Genesis Account 并铸造代币 | Authority、基础代币铸币 |
| [finalizeV2()](#finalize-v2) | 锁定配置，激活发行 | Authority |

### Bucket 创建指令 {% #bucket-creation-instructions %}

| 函数 | 描述 | 签名者 |
|----------|-------------|---------|
| [addLaunchPoolBucketV2()](#add-launch-pool-bucket-v2) | 添加按比例分配的 bucket | Authority |
| [addPresaleBucketV2()](#add-presale-bucket-v2) | 添加固定价格销售 bucket | Authority |
| [addUnlockedBucketV2()](#add-unlocked-bucket-v2) | 添加资金库/接收者 bucket | Authority |
| [addRaydiumCpmmBucketV2()](#add-raydium-cpmm-bucket-v2) | 添加 Raydium CPMM 毕业 bucket | Authority |
| [addClaimScheduleBucketV2()](#add-claim-schedule-bucket-v2) | 添加带领取计划的归属 bucket | Authority |

### Launch Pool 指令 {% #launch-pool-instructions %}

| 函数 | 描述 | 签名者 |
|----------|-------------|---------|
| [depositLaunchPoolV2()](#deposit-launch-pool-v2) | 向 Launch Pool 存入 SOL | 存款人 |
| [withdrawLaunchPoolV2()](#withdraw-launch-pool-v2) | 提取 SOL（存款期间） | 存款人 |
| [claimLaunchPoolV2()](#claim-launch-pool-v2) | 领取代币（存款期结束后） | 仅支付者 |
| [refundLaunchPoolV2()](#refund-launch-pool-v2) | 退还存款（未达门槛或超过软顶） | 仅支付者 |

### Presale 指令 {% #presale-instructions %}

| 函数 | 描述 | 签名者 |
|----------|-------------|---------|
| [depositPresaleV2()](#deposit-presale-v2) | 向 Presale 存入 SOL | 存款人 |
| [claimPresaleV2()](#claim-presale-v2) | 领取代币（存款期结束后） | 仅支付者 |

### Unlocked Bucket 指令 {% #unlocked-bucket-instructions %}

| 函数 | 描述 | 签名者 |
|----------|-------------|---------|
| [claimUnlockedV2()](#claim-unlocked-v2) | 将 bucket 的基础代币和报价代币余额发送给其接收者 | 仅支付者 |

### 领取计划指令 {% #claim-schedule-instructions %}

| 函数 | 描述 | 签名者 |
|----------|-------------|---------|
| [claimClaimScheduleV2()](#claim-claim-schedule-v2) | 将已归属的代币发送给 bucket 接收者 | 仅支付者 |
| [setClaimSchedulePausedStateV2()](#claim-schedule-runtime-controls) | 暂停或恢复归属 | Authority |
| [cancelClaimScheduleBucketV2()](#claim-schedule-runtime-controls) | 永久停止归属 | Authority 或接收者 |
| [transferRecipientClaimScheduleBucketV2()](#claim-schedule-runtime-controls) | 更改归属接收者 | Authority 或接收者 |

### Raydium CPMM 毕业指令 {% #raydium-cpmm-graduation-instructions %}

| 函数 | 描述 | 签名者 |
|----------|-------------|---------|
| [graduateToRaydiumCpmmV2()](#graduate-to-raydium-cpmm-v2) | 使用 bucket 的报价代币和基础代币创建 Raydium CPMM 池 | 仅支付者（如已配置，另加后端签名者） |
| [postponeStartRaydiumCpmmBucketV2()](#postpone-start-raydium-cpmm-bucket-v2) | 推迟可延期的毕业开始时间 | Authority |
| [claimRaydiumCpmmLpTokensV2()](#claim-raydium-cpmm-lp-tokens-v2) | 领取已解锁的 LP 代币 | LP 领取权限 |
| [burnRaydiumCpmmLpTokensV2()](#burn-raydium-cpmm-lp-tokens-v2) | 销毁未领取的 LP 代币 | LP 领取权限 |
| [collectRaydiumCpmmFeesV2()](#collect-raydium-cpmm-fees-v2) | 将 Raydium 创作者费收取到 Genesis 费用钱包 | 仅支付者 |
| [collectRaydiumCpmmFeesWithCreatorFeeV2()](#collect-raydium-cpmm-fees-with-creator-fee-v2) | 收取创作者费并累计发行创建者的份额 | 仅支付者 |
| [claimRaydiumCreatorFeeV2()](#claim-raydium-creator-fee-v2) | 将累计的创作者费支付到创作者钱包 | 仅支付者 |

### 条件与行为指令 {% #condition-and-behavior-instructions %}

| 函数 | 描述 | 签名者 |
|----------|-------------|---------|
| [triggerConditionsV2()](#trigger-conditions-v2) | 解析单个 bucket 上的所有条件 | 仅支付者 |
| [triggerBehaviorsV2()](#trigger-behaviors-v2) | 执行 bucket 的结束行为 | 仅支付者 |
| [set*BucketV2Behaviors()](#set-bucket-v2-behaviors) | 在最终化前替换 bucket 的结束行为 | Authority |

### 管理员指令 {% #admin-instructions %}

| 函数 | 描述 | 签名者 |
|----------|-------------|---------|
| [revokeV2()](#revoke-v2) | 永久撤销铸造和/或冻结权限 | Authority |
| [setBucketBackendSignerV2()](#set-bucket-backend-signer-v2) | 设置、轮换或清除 bucket 的后端签名者 | Authority |

---

## 函数签名 {% #function-signatures %}

每个签名列出了通常需要传入的参数。未列出的账户（例如代币账户、代币程序和 bucket 签名者 PDA）由 SDK 自动派生。

### initializeV2

```typescript
await initializeV2(umi, {
  baseMint,           // Signer - new token keypair
  quoteMint,          // PublicKey - deposit token (wSOL)
  fundingMode,        // number - use 0
  totalSupplyBaseToken, // bigint - supply with decimals
  name,               // string - token name
  symbol,             // string - token symbol
  uri,                // string - metadata URI
}).sendAndConfirm(umi);
```

### finalizeV2

```typescript
await finalizeV2(umi, {
  baseMint,           // PublicKey
  genesisAccount,     // PublicKey
}).sendAndConfirm(umi);
```

### addLaunchPoolBucketV2

```typescript
await addLaunchPoolBucketV2(umi, {
  genesisAccount,           // PublicKey
  baseMint,                 // PublicKey
  baseTokenAllocation,      // bigint - tokens for this bucket
  depositStartCondition,    // TimeCondition
  depositEndCondition,      // TimeCondition
  claimStartCondition,      // TimeCondition
  claimEndCondition,        // TimeCondition
  minimumDepositAmount,     // { amount: bigint } | null
  minimumQuoteTokenThreshold, // { amount: bigint } | null - floor, launch fails below it
  softCap,                  // { amount: bigint } | null - REQUIRED, ceiling on quote kept
  endBehaviors,             // EndBehavior[]
}).sendAndConfirm(umi);
```

{% callout type="warning" %}
自 `@metaplex-foundation/genesis` 0.42.0 起，`softCap` 为必填参数。与其他 Launch Pool 扩展不同，它在生成的序列化器中没有默认值，因此当发行没有上限时，请显式传入 `softCap: null`。行为说明请参阅 [Launch Pool 软顶](/zh/smart-contracts/genesis/launch-pool#launch-pool-soft-cap)。
{% /callout %}

### addPresaleBucketV2

```typescript
await addPresaleBucketV2(umi, {
  genesisAccount,           // PublicKey
  baseMint,                 // PublicKey
  baseTokenAllocation,      // bigint
  allocationQuoteTokenCap,  // bigint - SOL cap (sets price)
  depositStartCondition,    // TimeCondition
  depositEndCondition,      // TimeCondition
  claimStartCondition,      // TimeCondition
  claimEndCondition,        // TimeCondition
  minimumDepositAmount,     // bigint | null
  depositLimit,             // bigint | null - max per user
  endBehaviors,             // EndBehavior[]
}).sendAndConfirm(umi);
```

### addUnlockedBucketV2

Unlocked bucket 为单个接收者（例如团队资金库）持有代币。它从自身的分配以及 rollover 或重新分配行为中接收基础代币，并从 `SendQuoteTokenPercentage` 行为中接收报价代币。

```typescript
await addUnlockedBucketV2(umi, {
  genesisAccount,       // PublicKey
  baseMint,             // PublicKey
  baseTokenAllocation,  // bigint - optional, usually 0n
  recipient,            // PublicKey - who receives claimed tokens
  claimStartCondition,  // TimeCondition
  claimEndCondition,    // TimeCondition
  backendSigner,        // { signer: PublicKey } | null - optional co-signer for claims
}).sendAndConfirm(umi);
```

### addRaydiumCpmmBucketV2

Raydium CPMM bucket 预留基础代币，并通过结束行为接收销售收益，然后在毕业时创建 Raydium CP-Swap 池。LP 锁定的工作原理请参阅 [锁定 LP 代币](/zh/smart-contracts/genesis/locked-lp-tokens)。

```typescript
await addRaydiumCpmmBucketV2(umi, {
  genesisAccount,        // PublicKey
  baseMint,              // PublicKey
  baseTokenAllocation,   // bigint - base tokens reserved for the pool
  startCondition,        // TimeCondition - earliest time graduation can run
  lpLockSchedule,        // ClaimSchedule | null - LP vesting; null = Genesis authority claims all LP
  lpClaimAuthority,      // PublicKey | null - null = Genesis authority
  burnLp,                // boolean - true burns all LP at graduation
  creatorFee,            // { wallet: PublicKey } | null - share of Raydium creator fees
  postponableStart,      // PostponableStart | null - allow postponeStartRaydiumCpmmBucketV2
  backendSigner,         // { signer: PublicKey } | null - co-signer for graduation and LP actions
  deferPoolCreationCost, // boolean - false: payer pre-funds pool creation now
  endBehaviors,          // EndBehavior[] - BaseTokenRollover / ReallocateBaseTokensOnFailure
}).sendAndConfirm(umi);
```

bucket 的 `graduateCondition` 不是参数。程序会将其创建为 `Triggered` 条件，并在 `graduateToRaydiumCpmmV2` 内部触发它，从而使 `BucketTimes.Graduate` 可以作为其他 bucket 的 `TimeRelative` 参照。

{% callout type="note" %}
Raydium CPMM bucket 必须恰好是一个 `SendQuoteTokenPercentage` 行为和恰好一个 `SendStartPrice` 行为的目标，且两者来自同一个销售 bucket。否则 `finalizeV2` 会拒绝该发行（`MissingRaydiumGraduationSource`、`DuplicateRaydiumGraduationSource`、`RaydiumGraduationSourceMismatch`）。`burnLp: true` 不能与 `lpLockSchedule` 同时使用（`BurnLpConflictsWithLpLockSchedule`）。
{% /callout %}

`PostponableStart` 的结构为 `{ maxPostpones: number, timesPostponed: 0, padding: Array(3).fill(0), delayBudgetSeconds: number }`。请预先使用 `findRaydiumCpmmBucketV2Pda` 派生 bucket 的 PDA，这样销售 bucket 就能在该 bucket 创建之前在其 `endBehaviors` 中指向它。

### addClaimScheduleBucketV2

领取计划 bucket 随时间向单个接收者归属基础代币。归属计算和运行时控制请参阅 [项目归属](/zh/smart-contracts/genesis/project-vesting)。

```typescript
await addClaimScheduleBucketV2(umi, {
  genesisAccount,           // PublicKey
  baseMint,                 // PublicKey
  baseTokenAllocation,      // bigint
  recipient,                // PublicKey - defaults to the authority
  claimStartCondition,      // TimeCondition - claim gate
  claimSchedule,            // ClaimSchedule - start, duration, period, cliff
  pausable,                 // boolean - optional, default false
  cancelable,               // boolean - optional, default false
  cancelableByRecipient,    // boolean - optional, default false
  transferable,             // boolean - optional, default false
  transferableByRecipient,  // boolean - optional, default false
  backendSigner,            // { signer: PublicKey } | null
  endBehaviors,             // EndBehavior[] - at most one ReallocateBaseTokensOnCancel
}).sendAndConfirm(umi);
```

`ClaimSchedule` 的结构为 `{ startCondition, duration, period, cliffCondition, cliffAmountBps, reserved: Array(126).fill(0) }`。对于绝对时间，可使用 `createClaimSchedule({ startTime, endTime, cliffTime, cliffAmountBps, period })` 构建；如需将归属锚定到毕业时间，可使用 `createTimeRelativeCondition` 构造开始条件和 cliff 条件。

### depositLaunchPoolV2

```typescript
await depositLaunchPoolV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  amountQuoteToken,   // bigint - lamports
}).sendAndConfirm(umi);
```

### depositPresaleV2

```typescript
await depositPresaleV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  amountQuoteToken,   // bigint - lamports
}).sendAndConfirm(umi);
```

### withdrawLaunchPoolV2

```typescript
await withdrawLaunchPoolV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  amountQuoteToken,   // bigint - lamports
}).sendAndConfirm(umi);
```

### claimLaunchPoolV2

```typescript
await claimLaunchPoolV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  recipient,          // PublicKey
}).sendAndConfirm(umi);
```

### refundLaunchPoolV2

在存款窗口关闭后退还 Launch Pool 存款。退款金额由程序计算，因此没有金额参数：未达到 `minimumQuoteTokenThreshold` 时退还全部存款，超过 `softCap` 时仅退还超出部分，并保留存款人的代币分配不变。

```typescript
await refundLaunchPoolV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  recipient,          // PublicKey | Signer - depositor; base token account closed if they sign
}).sendAndConfirm(umi);
```

只有 `payer` 需要签名，因此任何人都可以代表存款人无需许可地触发退款。在存款窗口关闭前调用会返回 `LaunchPoolNotEnded`；在门槛已达到且未超过上限时调用会返回 `LaunchPoolThresholdMet`；重复调用会返回 `DepositAlreadyRefunded`。

### claimPresaleV2

```typescript
await claimPresaleV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  recipient,          // PublicKey
}).sendAndConfirm(umi);
```

### claimUnlockedV2

`claimUnlockedV2` 将 Unlocked bucket 当前的全部基础代币余额和报价代币余额发送给 bucket 上存储的接收者，报价代币一侧会扣除协议领取费。

```typescript
await claimUnlockedV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey - UnlockedBucketV2
  baseMint,           // PublicKey
  recipient,          // PublicKey - must match the bucket's recipient
  backendSigner,      // Signer - only if the bucket has a backend signer
}).sendAndConfirm(umi);
```

领取可以重复进行：在之前的领取之后，后续的 rollover 或重新分配行为可能会再计入更多基础代币。没有剩余可领取余额时返回 `UnlockedBucketAlreadyClaimed`，接收者与 bucket 上存储的不一致时返回 `RecipientMismatch`。

### claimClaimScheduleV2

`claimClaimScheduleV2` 将当前所有已归属但尚未领取的代币转给 bucket 上存储的接收者。

```typescript
await claimClaimScheduleV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey - ClaimScheduleBucketV2
  baseMint,           // PublicKey
  recipient,          // PublicKey - must match the bucket's recipient
  backendSigner,      // Signer - only if the bucket has a backend signer
}).sendAndConfirm(umi);
```

如果领取门控、线性开始或 cliff 是 `TimeRelative` 条件，请先对领取计划 bucket 调用 [triggerConditionsV2](#trigger-conditions-v2)。没有任何已归属代币时领取会返回 `NothingToClaim`。

### 领取计划运行时控制 {% #claim-schedule-runtime-controls %}

领取计划运行时控制用于在最终化之后暂停、取消归属 bucket 或更改其接收地址，每项控制只有在创建时设置了对应的策略标志后才可用。

```typescript
// Pause or resume vesting (requires pausable: true). Signer: Genesis authority.
await setClaimSchedulePausedStateV2(umi, {
  genesisAccount, bucket, signer: authority,
  paused: true, padding: Array(6).fill(0),
}).sendAndConfirm(umi);

// Stop vesting permanently (requires cancelable or cancelableByRecipient).
await cancelClaimScheduleBucketV2(umi, {
  genesisAccount, bucket, signer, // authority or recipient
  padding: Array(7).fill(0),
}).sendAndConfirm(umi);

// Change the recipient (requires transferable or transferableByRecipient).
await transferRecipientClaimScheduleBucketV2(umi, {
  genesisAccount, bucket, signer, // authority or recipient
  newRecipient,                   // PublicKey
  padding: Array(7).fill(0),
}).sendAndConfirm(umi);
```

策略未启用时返回 `ClaimSchedulePolicyDisabled`，签名者不在策略允许范围内时返回 `ClaimScheduleUnauthorized`。取消之后，通过 `triggerBehaviorsV2` 执行的 `ReallocateBaseTokensOnCancel` 行为会转移剩余的未归属部分。

### revokeV2

永久撤销基础代币的铸币和/或冻结权限。

```typescript
await revokeV2(umi, {
  genesisAccount,           // PublicKey
  baseMint,                 // PublicKey
  baseTokenProgram,         // PublicKey - required, e.g. SPL_TOKEN_PROGRAM_ID from mpl-toolbox
  revokeMintAuthority,      // boolean
  revokeFreezeAuthority,    // boolean
  padding: Array(5).fill(0), // required, no default
}).sendAndConfirm(umi);
```

### setBucketBackendSignerV2

`setBucketBackendSignerV2` 在任何支持后端签名者扩展的 V2 bucket 上设置、轮换或清除该扩展。当后端密钥丢失时，这是恢复手段，否则所有受该密钥控制的操作（包括用户领取）都将一直被阻塞。

```typescript
await setBucketBackendSignerV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey - any V2 bucket with a backend signer slot
  authority,          // Signer - Genesis authority (defaults to identity)
  backendSigner,      // PublicKey - new co-signer; the default (all-zero) key clears it
}).sendAndConfirm(umi);
```

轮换或清除现有的后端签名者在 `finalizeV2` 之前或之后都可以进行。为从未设置过后端签名者的 bucket 添加后端签名者，只能在最终化之前进行。后端签名者可以是 Genesis authority 选择的任意密钥。

---

## Raydium CPMM 毕业签名 {% #raydium-cpmm-graduation-signatures %}

Raydium CPMM 毕业指令从 Raydium CPMM bucket 创建 Raydium CP-Swap 池，并随后管理其 LP 代币和池费用。使用 `deriveRaydiumPDAsV2(umi, baseMint, raydiumBucket, options)` 派生这些指令所需的全部 Raydium 账户。

### deriveRaydiumPDAsV2

`deriveRaydiumPDAsV2` 返回某个 Raydium CPMM bucket 对应的 Raydium 池账户。池状态是由 Genesis 派生的 PDA，因此在毕业之前任何人都无法创建该池。

```typescript
const raydium = deriveRaydiumPDAsV2(umi, baseMint, raydiumBucket, {
  quoteMint,   // PublicKey - optional, defaults to wSOL
  env,         // 'mainnet' | 'devnet' - optional, defaults to 'mainnet'
  creatorFee,  // boolean - optional, true selects the creator-fee AMM config
  ammConfig,   // PublicKey - optional override
});
// raydium.poolState, ammConfig, poolAuthority, lpMint, baseVault, quoteVault,
// createPoolFee, observationState, raydiumProgram, raydiumSigner, permission,
// creatorFeeShare, token0Mint, token1Mint, isProjectMintToken0
```

当 bucket 带有 `creatorFee` 扩展时，请传入 `creatorFee: true`。使用创作者费 AMM 配置但没有该扩展，或有该扩展但没有使用创作者费 AMM 配置，都会导致毕业失败并返回 `InvalidCreatorFeeConfig`。

### graduateToRaydiumCpmmV2

`graduateToRaydiumCpmmV2` 创建 Raydium 池，按销售的起始价格存入 bucket 的报价代币和相应数量的基础代币，并触发 bucket 的 `graduateCondition`。

```typescript
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 400_000 }))
  .add(
    graduateToRaydiumCpmmV2(umi, {
      genesisAccount,     // PublicKey
      bucket,             // PublicKey - RaydiumCpmmBucketV2
      baseMint,           // PublicKey
      quoteMint,          // PublicKey - optional, defaults to wSOL
      poolState: raydium.poolState,
      ammConfig: raydium.ammConfig,
      poolAuthority: raydium.poolAuthority,
      lpMint: raydium.lpMint,
      baseVault: raydium.baseVault,
      quoteVault: raydium.quoteVault,
      createPoolFee: raydium.createPoolFee,
      observationState: raydium.observationState,
      permission: raydium.permission,
      raydiumProgram: raydium.raydiumProgram,
      backendSigner,      // Signer - only if the bucket has a backend signer
    })
  )
  .sendAndConfirm(umi);
```

毕业无需许可：只需手续费支付者签名，如果 bucket 带有后端签名者扩展，则还需该后端签名者签名。该指令按顺序检查以下三项：

| 检查项 | 错误 |
|-------|-------|
| bucket 尚未毕业 | `BucketAlreadyGraduated` |
| 提供资金的销售未失败（未收到 `TransmitFailure`） | `BucketLaunchFailed` |
| bucket 的 `startCondition` 已满足 | `GraduationNotStarted` |

毕业之前，请先对销售 bucket 运行 `triggerBehaviorsV2`，使 Raydium bucket 收到其报价代币和起始价格。如果 `startCondition` 是 `TimeRelative` 条件，请先对 Raydium bucket 运行 `triggerConditionsV2`，并将销售 bucket 作为剩余账户传入。

{% callout type="warning" %}
毕业不会开放其他 bucket 的领取。所有以 `BucketTimes.Graduate` 为参照的 `TimeRelative` 条件（无论属于 Launch Pool、Unlocked 还是领取计划 bucket）都会保持未触发状态，直到有人对该 bucket 调用 [triggerConditionsV2](#trigger-conditions-v2) 并将 Raydium bucket 作为可写剩余账户传入。
{% /callout %}

### postponeStartRaydiumCpmmBucketV2

`postponeStartRaydiumCpmmBucketV2` 将毕业开始时间推迟，且仅适用于创建时带有 `postponableStart` 扩展的 bucket。

```typescript
await postponeStartRaydiumCpmmBucketV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey - RaydiumCpmmBucketV2
  authority,          // Signer - Genesis authority (defaults to identity)
  sourceBucket,       // PublicKey - sale bucket; required when startCondition is TimeRelative
  newStartValue,      // bigint - new unix time (TimeAbsolute) or new offset in seconds (TimeRelative)
  padding: Array(7).fill(0),
}).sendAndConfirm(umi);
```

延期受 `maxPostpones` 和 `delayBudgetSeconds` 限制，必须在预定毕业时间之前至少 30 分钟进行，且必须将开始时间至少推后 24 小时。违反这些限制会返回 `PostponeLimitReached`、`PostponeNotLater`、`PostponeExceedsMaxDelay`、`PostponeTooLate`、`PostponeTooSoon` 或 `BucketNotPostponable`。

### claimRaydiumCpmmLpTokensV2

`claimRaydiumCpmmLpTokensV2` 将已解锁的 LP 代币从 bucket 签名者转入目标代币账户，数量上限为 `lpLockSchedule` 已归属的数量。

```typescript
await claimRaydiumCpmmLpTokensV2(umi, {
  genesisAccount,            // PublicKey
  bucket,                    // PublicKey - RaydiumCpmmBucketV2
  baseMint,                  // PublicKey
  lpMint: raydium.lpMint,    // PublicKey
  recipient,                 // PublicKey - owner of the destination account
  destinationLpTokenAccount, // PublicKey - recipient's LP ATA, created if missing
  lpClaimAuthority,          // Signer - lpClaimAuthority, or the Genesis authority if unset
  backendSigner,             // Signer - only if the bucket has a backend signer
  amount,                    // bigint - LP tokens to claim
}).sendAndConfirm(umi);
```

在毕业之前领取会返回 `NoLpTokensToClaim`，签名者错误会返回 `InvalidLpClaimAuthority`，在尚无已解锁 LP 代币时领取会返回 `InsufficientUnlockedAmount`。超过已解锁余额的 `amount` 不会被拒绝，而是被截断为该余额。如果 `lpLockSchedule` 使用了 `TimeRelative` 条件，领取前需要先对 Raydium bucket 调用 [triggerConditionsV2](#trigger-conditions-v2)。

### burnRaydiumCpmmLpTokensV2

`burnRaydiumCpmmLpTokensV2` 销毁 bucket 签名者持有的未领取 LP 代币，从而永久锁定该部分池流动性。

```typescript
await burnRaydiumCpmmLpTokensV2(umi, {
  genesisAccount,          // PublicKey
  bucket,                  // PublicKey - RaydiumCpmmBucketV2
  baseMint,                // PublicKey
  lpMint: raydium.lpMint,  // PublicKey
  lpClaimAuthority,        // Signer
  backendSigner,           // Signer - only if the bucket has a backend signer
  amount,                  // bigint - capped to the unclaimed, unburned balance
}).sendAndConfirm(umi);
```

销毁会忽略 `lpLockSchedule`，因为它只会放弃价值。如果希望在毕业时销毁全部 LP 代币，请在创建 bucket 时设置 `burnLp: true`。

### collectRaydiumCpmmFeesV2

`collectRaydiumCpmmFeesV2` 收取池中累积的 Raydium 创作者费，并将报价代币一侧发送到 Genesis 费用钱包，适用于创建时没有 `creatorFee` 扩展的池。

```typescript
await collectRaydiumCpmmFeesV2(umi, {
  baseMint,                                  // PublicKey
  quoteMint,                                 // PublicKey - optional, defaults to wSOL
  poolState: raydium.poolState,
  ammConfig: raydium.ammConfig,
  poolAuthority: raydium.poolAuthority,
  baseVault: raydium.baseVault,
  quoteVault: raydium.quoteVault,
  raydiumProgram: raydium.raydiumProgram,
  creatorFeeShare: raydium.creatorFeeShare,
}).sendAndConfirm(umi);
```

没有累积费用时，该指令会成功返回但不进行转账。使用创作者费 AMM 配置的池会返回 `InvalidRaydiumAmmConfig`；这类池请使用 `collectRaydiumCpmmFeesWithCreatorFeeV2`。

### collectRaydiumCpmmFeesWithCreatorFeeV2

`collectRaydiumCpmmFeesWithCreatorFeeV2` 从其 bucket 带有 `creatorFee` 扩展的池中收取创作者费，在 bucket 上累计发行创建者的份额，并将剩余部分发送到 Genesis 费用钱包。

```typescript
await collectRaydiumCpmmFeesWithCreatorFeeV2(umi, {
  baseMint,                                  // PublicKey
  genesisAccount,                            // PublicKey
  raydiumCpmmBucket,                         // PublicKey - bucket with creatorFee extension
  poolState: raydium.poolState,
  ammConfig: raydium.ammConfig,              // creator-fee AMM config
  poolAuthority: raydium.poolAuthority,
  baseVault: raydium.baseVault,
  quoteVault: raydium.quoteVault,
  raydiumProgram: raydium.raydiumProgram,
  creatorFeeShare: raydium.creatorFeeShare,
}).sendAndConfirm(umi);
```

### claimRaydiumCreatorFeeV2

`claimRaydiumCreatorFeeV2` 将 Raydium bucket 中已累计但未领取的创作者费支付到其 `creatorFee` 扩展中存储的钱包。端到端流程请参阅 [创作者费](/zh/smart-contracts/genesis/creator-fees)。

```typescript
await claimRaydiumCreatorFeeV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey - RaydiumCpmmBucketV2
  baseMint,           // PublicKey
  creatorFeeWallet,   // PublicKey - must match the creatorFee extension wallet
}).sendAndConfirm(umi);
```

当报价代币铸币为 wSOL 时，费用会被解包并以原生 SOL 支付。钱包与扩展中存储的不一致时返回 `InvalidCreatorFeeWallet`。

---

## 条件与行为签名 {% #condition-and-behavior-signatures %}

条件与行为指令推动发行在各阶段之间推进。`triggerConditionsV2` 解析时间条件，`triggerBehaviorsV2` 在 bucket 之间转移资金，`set*BucketV2Behaviors` 系列指令则在最终化之前配置行为。

### triggerConditionsV2

`triggerConditionsV2` 解析单个目标 bucket 上的所有条件，包括扩展中的条件，例如 `claimSchedule` 的开始和 cliff，或 Raydium 的 `lpLockSchedule`。该指令无需许可，只需手续费支付者签名。

```typescript
await triggerConditionsV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey - the bucket whose conditions to resolve
  baseMint,           // PublicKey
})
  .addRemainingAccounts([
    // Every bucket the target's TimeRelative conditions reference, writable
    { pubkey: raydiumBucket, isSigner: false, isWritable: true },
  ])
  .sendAndConfirm(umi);
```

| 属性 | 值 |
|----------|-------|
| 签名者 | 仅手续费支付者 |
| 目标 | 每条指令一个 bucket |
| 剩余账户 | 所有被引用的 bucket，**可写**，顺序不限 |
| 自引用 | 无需再次传入目标 bucket 即可解析 |
| 重复运行 | 安全；已触发的条件会被跳过 |

该指令首先解析每个剩余账户 bucket 上的 `TimeAbsolute` 条件，然后解析目标 bucket 上参照对象在剩余账户之中且时间已到的每个 `TimeRelative` 条件。记录的 `triggeredTimestamp` 是参照时间加上偏移量，而不是 crank 实际运行的时间。

{% callout type="note" %}
`TimeRelative` 条件永远不会被存款、领取或毕业操作惰性解析。在 `graduateToRaydiumCpmmV2` 之后，请对每个依赖的 bucket（Launch Pool、Unlocked、领取计划）各调用一次 `triggerConditionsV2`，并将 Raydium CPMM bucket 作为可写剩余账户传入。如果 cliff 设在毕业后 90 天，则需要在这 90 天过后再调用一次。
{% /callout %}

### triggerBehaviorsV2

`triggerBehaviorsV2` 执行单个源 bucket（`primaryBucket`）上所有尚未处理的结束行为，并将每个行为标记为已处理，使其无法重复执行。该指令无需许可，只需手续费支付者签名。

```typescript
await triggerBehaviorsV2(umi, {
  genesisAccount,     // PublicKey
  primaryBucket,      // PublicKey - source bucket
  baseMint,           // PublicKey
})
  .addRemainingAccounts([
    // One (destination bucket, destination quote token account) pair per destination
    { pubkey: destinationBucket, isSigner: false, isWritable: true },
    { pubkey: destinationQuoteTokenAccount, isSigner: false, isWritable: true },
  ])
  .sendAndConfirm(umi);
```

目标报价代币账户是目标 bucket 的报价代币铸币 ATA。对于 Raydium CPMM 目标，该账户由 `findRaydiumBucketSignerPda(umi, { bucket })` 得到的 bucket 签名者 PDA 持有，而不是由 bucket 本身持有。剩余账户数量为奇数时返回 `InvalidRemainingAccountsLength`。

| 源 bucket | 就绪条件 | 过早调用时的错误 |
|---------------|------------|--------------------|
| Launch Pool | `depositEndCondition` 已满足 | `LaunchPoolNotEnded` |
| Presale | `depositEndCondition` 已满足 | `PresaleBucketNotEnded` |
| Raydium CPMM | 池已毕业，或 bucket 已被标记为失败 | `InvalidBucketState` |
| 领取计划 | 归属已取消、已完成或已失败 | `ClaimScheduleBucketNotEnded` |

### set*BucketV2Behaviors

`set*BucketV2Behaviors` 指令会替换现有 bucket 上的整个 `endBehaviors` 列表。它们需要 Genesis authority 签名，在 `finalizeV2` 之后调用会失败并返回 `GenesisAccountFinalized`。

```typescript
await setLaunchPoolBucketV2Behaviors(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  authority,          // Signer - Genesis authority (defaults to identity)
  padding: Array(3).fill(0), // required, no default
  endBehaviors,       // EndBehavior[] - replaces the existing list
}).sendAndConfirm(umi);
```

| 函数 | Bucket 类型 | 允许的行为 |
|----------|-------------|-------------------|
| `setLaunchPoolBucketV2Behaviors` | Launch Pool | `SendQuoteTokenPercentage`、`SendStartPrice`、`ReallocateBaseTokensOnFailure`、`TransmitFailure` |
| `setPresaleBucketV2Behaviors` | Presale | Launch Pool 的行为集合，另加 `BaseTokenRollover` |
| `setRaydiumCpmmBucketV2Behaviors` | Raydium CPMM | `BaseTokenRollover`、`ReallocateBaseTokensOnFailure` |
| `setClaimScheduleBucketV2Behaviors` | 领取计划 | `ReallocateBaseTokensOnCancel`（最多一个） |
| `setUnlockedBucketV2Behaviors` | Unlocked | 无。仅接受空列表 |

`setBondingCurveBucketV2Behaviors`、`setVaultBucketV2Behaviors` 和 `setRaydiumClmmBucketV2Behaviors` 使用相同的签名。不受支持的行为会返回 `BehaviorNotSupportedForBucketType`；`SendQuoteTokenPercentage`、`BaseTokenRollover` 或 `ReallocateBaseTokensOnFailure` 的合计超过 10,000 bps 时返回 `BehaviorPercentageOverflow`。

---

## PDA 辅助函数 {% #pda-helpers %}

PDA 辅助函数根据种子派生 Genesis 账户地址，因此 bucket 可以在彼此创建之前相互引用。

| 函数 | 种子 |
|----------|-------|
| findGenesisAccountV2Pda() | `baseMint`, `genesisIndex` |
| findLaunchPoolBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findPresaleBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findUnlockedBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findRaydiumCpmmBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findClaimScheduleBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findRaydiumBucketSignerPda() | `bucket`（Raydium CPMM bucket） |
| findRaydiumSignerPda() | 无（每个程序一个） |
| findLaunchPoolDepositV2Pda() | `bucket`, `recipient` |
| findPresaleDepositV2Pda() | `bucket`, `recipient` |

```typescript
const [genesisAccountPda] = findGenesisAccountV2Pda(umi, { baseMint: mint.publicKey, genesisIndex: 0 });
const [bucketPda] = findLaunchPoolBucketV2Pda(umi, { genesisAccount: genesisAccountPda, bucketIndex: 0 });
const [depositPda] = findLaunchPoolDepositV2Pda(umi, { bucket: bucketPda, recipient: wallet });
const [raydiumBucketPda] = findRaydiumCpmmBucketV2Pda(umi, { genesisAccount: genesisAccountPda, bucketIndex: 0 });
```

Bucket 索引按 bucket 类型分别计数，因此第一个 Launch Pool 和第一个 Raydium CPMM bucket 都使用 `bucketIndex: 0`。

---

## 获取函数 {% #fetch-functions %}

获取函数用于反序列化 Genesis 账户。每种账户类型都提供 `fetch*`（不存在时抛出错误）、`safeFetch*`（返回 `null`）和 `fetchAll*` 三种变体。

### Genesis 账户 {% #genesis-account %}

Genesis 账户存储包括[发行类型](#launch-type)在内的顶层发行状态。后端 crank 在创建后通过 `setLaunchTypeV2` 指令在链上设置 `launchType` 字段，因此在 crank 处理之前，该值可能为 `Uninitialized`（0）。

| 函数 | 返回值 |
|----------|---------|
| fetchGenesisAccountV2() | Genesis 账户状态（不存在时抛出错误） |
| safeFetchGenesisAccountV2() | Genesis 账户状态或 `null` |
| fetchGenesisAccountV2FromSeeds() | 通过 PDA 种子（`baseMint`、`genesisIndex`）获取 |
| safeFetchGenesisAccountV2FromSeeds() | 同上，不存在时返回 `null` |
| fetchAllGenesisAccountV2() | 批量获取多个 Genesis 账户 |

```typescript
import {
  fetchGenesisAccountV2,
  fetchGenesisAccountV2FromSeeds,
  findGenesisAccountV2Pda,
  LaunchType,
} from '@metaplex-foundation/genesis';

// Fetch by PDA address
const [genesisAccountPda] = findGenesisAccountV2Pda(umi, {
  baseMint: mintAddress,
  genesisIndex: 0,
});
const account = await fetchGenesisAccountV2(umi, genesisAccountPda);
console.log(account.data.launchType); // 0 = Uninitialized, 3 = LaunchPoolV1

// Or fetch directly from seeds
const account2 = await fetchGenesisAccountV2FromSeeds(umi, {
  baseMint: mintAddress,
  genesisIndex: 0,
});

// Check launch type
if (account2.data.launchType === LaunchType.LaunchPoolV1) {
  console.log('This is a launch pool');
}
```

**Genesis 账户字段：** `authority`、`baseMint`、`quoteMint`、`totalSupplyBaseToken`、`totalAllocatedSupplyBaseToken`、`totalProceedsQuoteToken`、`fundingMode`、`launchType`、`bucketCount`、`finalized`

### GPA 构建器 — 按发行类型查询 {% #gpa-builder-query-by-launch-type %}

使用 `getGenesisAccountV2GpaBuilder()` 查询按链上字段过滤的所有 Genesis 账户。它使用 Solana 的 `getProgramAccounts` RPC 方法配合字节级过滤器，实现高效查找。

```typescript
import {
  getGenesisAccountV2GpaBuilder,
  LaunchType,
} from '@metaplex-foundation/genesis';

// Get all launch pool launches
const launchpools = await getGenesisAccountV2GpaBuilder(umi)
  .whereField('launchType', LaunchType.LaunchPoolV1)
  .getDeserialized();

// Filter by multiple fields
const finalizedLaunchpools = await getGenesisAccountV2GpaBuilder(umi)
  .whereField('launchType', LaunchType.LaunchPoolV1)
  .whereField('finalized', true)
  .getDeserialized();

for (const account of launchpools) {
  console.log(account.publicKey, account.data.baseMint, account.data.launchType);
}
```

{% callout type="note" %}
`launchType` 在发行创建后由后端 crank 追溯设置。最近创建的发行可能会显示 `LaunchType.Uninitialized`（0），直到 crank 处理完毕。
{% /callout %}

### Bucket 和存款 {% #buckets-and-deposits %}

| 函数 | 返回值 |
|----------|---------|
| fetchLaunchPoolBucketV2() | Bucket 状态（不存在时抛出错误） |
| safeFetchLaunchPoolBucketV2() | Bucket 状态或 `null` |
| fetchPresaleBucketV2() | Bucket 状态（不存在时抛出错误） |
| safeFetchPresaleBucketV2() | Bucket 状态或 `null` |
| fetchUnlockedBucketV2() | Unlocked bucket 状态 |
| fetchRaydiumCpmmBucketV2() | Raydium CPMM bucket 状态 |
| fetchClaimScheduleBucketV2() | 领取计划 bucket 状态 |
| fetchLaunchPoolDepositV2() | 存款状态（不存在时抛出错误） |
| safeFetchLaunchPoolDepositV2() | 存款状态或 `null` |
| fetchPresaleDepositV2() | 存款状态（不存在时抛出错误） |
| safeFetchPresaleDepositV2() | 存款状态或 `null` |

```typescript
const bucket = await fetchLaunchPoolBucketV2(umi, bucketPda);
const deposit = await safeFetchLaunchPoolDepositV2(umi, depositPda); // null if not found
const raydiumBucket = await fetchRaydiumCpmmBucketV2(umi, raydiumBucketPda);
console.log(raydiumBucket.graduateCondition.triggeredTimestamp); // Some(t) once graduated
```

**Bucket 状态字段：** `quoteTokenDepositTotal`、`weightedQuoteTokenTotal`、`depositCount`、`claimCount`、`refundCount`、`bucket.baseTokenAllocation`、`extensions`

**存款状态字段：** `amountQuoteToken`、`weightedQuoteToken`、`claimed`、`refunded`

---

## 类型 {% #types %}

以下类型是各 Genesis 指令中使用的参数结构和账户结构。所有类型均从 `@metaplex-foundation/genesis` 导出。

### LaunchPoolV2Extensions

Launch Pool bucket 上的可选保护机制，从 `bucket.extensions` 读取。每个字段都是 Umi `Option`，因此读取值之前请使用 `unwrapOption()` 或检查 `.__option`。

```typescript
{
  backendSigner: Option<BackendSigner>;
  depositPenalty: Option<LinearBpsScheduleV2>;
  withdrawPenalty: Option<LinearBpsScheduleV2>;
  bonusSchedule: Option<LinearBpsScheduleV2>;
  depositLimit: Option<DepositLimit>;                             // { limit: bigint }
  allowlist: Option<Allowlist>;
  claimSchedule: Option<ClaimSchedule>;
  minimumDepositAmount: Option<MinimumDepositAmount>;             // { amount: bigint }
  minimumQuoteTokenThreshold: Option<MinimumQuoteTokenThreshold>; // { amount: bigint } - floor
  softCap: Option<SoftCap>;                                       // { amount: bigint } - ceiling
}
```

可以使用 `addLaunchPoolBucketV2Extensions()` 和 `removeLaunchPoolBucketV2Extensions()` 单独添加或移除扩展，并通过 `LaunchPoolV2ExtensionType` 选择字段。Genesis 账户最终化之后，这两个操作都会被拒绝。

### LaunchType

由后端 crank 通过 `setLaunchTypeV2` 指令追溯设置的链上发行类型。发行类型代表发行使用的底层机制。

```typescript
enum LaunchType {
  Uninitialized = 0,   // Not yet set by the crank
  LaunchPoolV1 = 3,    // Launch pool (proportional distribution)
}
```

[Metaplex API](/zh/api) 以字符串形式返回（`'launchpool'`），而链上 SDK 使用上述数字枚举。

### GenesisAccountV2

Genesis 发行的顶层链上账户。每个代币铸币地址、每个发行索引对应一个账户。

```typescript
{
  key: Key;
  bump: number;
  index: number;                          // Genesis index (usually 0)
  finalized: boolean;                     // true after finalizeV2()
  authority: PublicKey;                    // Launch creator
  baseMint: PublicKey;                     // Token being launched
  quoteMint: PublicKey;                    // Deposit token (e.g., wSOL)
  totalSupplyBaseToken: bigint;            // Total token supply
  totalAllocatedSupplyBaseToken: bigint;   // Supply allocated to buckets
  totalProceedsQuoteToken: bigint;         // Total deposits collected
  fundingMode: number;                     // Funding mode (0)
  launchType: number;                      // 0 = Uninitialized, 3 = LaunchPoolV1
  bucketCount: number;                     // Number of buckets
}
```

账户大小：**136 字节**。PDA 种子：`["genesis_v2", baseMint, genesisIndex]`。

### TimeCondition

`TimeCondition`（SDK 类型为 `ConditionArgs`）是一个 64 字节的时间规则，满足时会记录 `triggeredTimestamp`。每个变体的 `padding` 长度不同，因此请使用 SDK 辅助函数构建条件，而不要手动构造。

| 变体 | SDK 辅助函数 | 满足时机 | 是否自行解析 | `padding` |
|---------|------------|----------|-----------------|-----------|
| `TimeAbsolute` | `createTimeAbsoluteCondition(time)` | 时钟到达 `time` | 是，在任何指令检查它时解析 | 47 |
| `TimeRelative` | `createTimeRelativeCondition(bucket, bucketTime, timeOffset?)` | 参照 bucket 的事件发生且已过 `timeOffset` | 否，只能通过 `triggerConditionsV2` 解析 | 14 |
| `Triggered` | `createTriggeredCondition()` | 由程序触发（毕业、联合曲线售罄、预售售罄） | 由引发该事件的指令触发 | 55 |
| `TriggeredWithExpiry` | `createTriggeredWithExpiryCondition(expiryTime)` | 程序触发或到达 `expiryTime`，以先发生者为准 | 是，在 `expiryTime` 之后 | 47 |
| `Never` | `createNeverCondition()` | 永不满足 | 不适用 | 55 |
| `Always` | 无。需手动构造 | 始终满足 | 不适用；不记录时间戳 | 55 |

```typescript {% title="conditions.ts" %}
import {
  BucketTimes,
  createNeverCondition,
  createTimeAbsoluteCondition,
  createTimeRelativeCondition,
  createTriggeredCondition,
  createTriggeredWithExpiryCondition,
} from '@metaplex-foundation/genesis';

// TimeAbsolute: { __kind, padding: Array(47), time, triggeredTimestamp: null }
const depositStart = createTimeAbsoluteCondition(1767225600n);

// TimeRelative: { __kind, bucketTime, padding: Array(14), timeOffset, bucket, triggeredTimestamp: null }
const claimStart = createTimeRelativeCondition(raydiumBucket, BucketTimes.Graduate, 0n);

// Triggered: { __kind, padding: Array(55), triggeredTimestamp: null }
const lpLockStart = createTriggeredCondition();

// TriggeredWithExpiry: { __kind, padding: Array(47), expiryTime, triggeredTimestamp: null }
const presaleEnd = createTriggeredWithExpiryCondition(1767830400n);

// Never: { __kind, padding: Array(55), triggeredTimestamp: null }
const lockedForever = createNeverCondition();

// Always (no helper)
const always = { __kind: 'Always', padding: Array(55).fill(0), triggeredTimestamp: null };
```

#### TimeRelative Bucket 时间点 {% #time-relative-bucket-times %}

`TimeRelative` 条件锚定到参照 bucket 上的某一个事件，该事件通过 `BucketTimes` 枚举选择。

| `BucketTimes` | 参照 bucket 类型 |
|---------------|------------------------|
| `DepositStart`, `DepositEnd` | Launch Pool、Presale |
| `ClaimStart`, `ClaimEnd` | Launch Pool、Presale、Unlocked |
| `SwapStart`, `SwapEnd` | 联合曲线 |
| `GraduateStart` | Raydium CPMM（其 `startCondition`） |
| `Graduate` | Raydium CPMM（在池创建时触发） |

`BucketTimes` 还为锁定 bucket 定义了 `LockStart` 和 `LockEnd`。如果 `bucketTime` 在参照 bucket 类型中不存在，解析该条件时会返回 `InvalidPrimaryBucket`。

#### 条件槽位 {% #condition-slots %}

bucket 上的每个条件字段只接受部分变体，程序会以 `InvalidConditionTypeForSlot` 拒绝其他变体。

| 槽位 | 允许的变体 |
|------|------------------|
| 存款开始、Unlocked 领取开始、Raydium `startCondition`、领取计划 `claimStartCondition` | `TimeAbsolute`、`TimeRelative`、`Always` |
| Launch Pool 和 Presale 的 `claimStartCondition` | `TimeAbsolute`、`TimeRelative` |
| 存款结束、领取结束 | `TimeAbsolute`、`TimeRelative`、`Never` |
| Presale `depositEndCondition` | 结束槽位的变体，另加 `Triggered` 和 `TriggeredWithExpiry` |
| `ClaimSchedule` 开始和 cliff | `TimeAbsolute`、`TimeRelative`、`Never` |
| Raydium `lpLockSchedule` 开始和 cliff | `ClaimSchedule` 的变体，另加 `Triggered`（在毕业时触发） |

### EndBehavior

`EndBehavior`（SDK 类型为 `BehaviorArgs`）是存储在源 bucket 上的操作，在源 bucket 结束后将报价代币、基础代币、价格或失败标志转移到目标 bucket。请始终传入 `processed: false`；预先标记为已处理的行为会返回 `BehaviorAlreadyProcessed`。

| 变体 | 对目标的作用 | 允许的源 bucket | `padding` |
|---------|---------------------------|------------------------|-----------|
| `SendQuoteTokenPercentage` | 发送源 bucket 报价收益的 `percentageBps` | Launch Pool、Presale、联合曲线 | 4 |
| `SendStartPrice` | 将销售的最终价格写入为 Raydium 池起始价格 | Launch Pool、Presale、联合曲线 | 6 |
| `BaseTokenRollover` | 发送剩余基础代币的 `percentageBps` | Presale、Raydium CPMM、Raydium CLMM | 4 |
| `ReallocateBaseTokensOnFailure` | 仅失败时：发送剩余基础代币的 `percentageBps` | Launch Pool、Presale、Raydium CPMM、Raydium CLMM | 4 |
| `TransmitFailure` | 仅失败时：将目标标记为失败 | Launch Pool、Presale | 6 |
| `ReallocateBaseTokensOnCancel` | 发送已取消或已完成的归属 bucket 中剩余的未归属部分 | 领取计划 | 6 |

```typescript {% title="endBehaviors.ts" %}
const endBehaviors = [
  { __kind: 'SendQuoteTokenPercentage', padding: Array(4).fill(0), destinationBucket, percentageBps: 8_000, processed: false },
  { __kind: 'SendStartPrice', padding: Array(6).fill(0), destinationBucket, processed: false },
  { __kind: 'BaseTokenRollover', padding: Array(4).fill(0), destinationBucket, percentageBps: 10_000, processed: false },
  { __kind: 'ReallocateBaseTokensOnFailure', padding: Array(4).fill(0), destinationBucket, percentageBps: 10_000, processed: false },
  { __kind: 'TransmitFailure', padding: Array(6).fill(0), destinationBucket, processed: false },
  { __kind: 'ReallocateBaseTokensOnCancel', padding: Array(6).fill(0), destinationBucket, processed: false },
];
```

`percentageBps` 使用基点，`10_000` 表示 100%。存款结束时低于 `minimumQuoteTokenThreshold` 的 Launch Pool 或 Presale 只会执行其失败行为（`ReallocateBaseTokensOnFailure`、`TransmitFailure`），其报价代币留在 bucket 中用于退款。以 Raydium CPMM bucket 为目标的 `TransmitFailure` 必须来自该 bucket 的毕业资金来源（`TransmitFailureSourceMismatch`）。

### Raydium CPMM 扩展类型 {% #raydium-cpmm-extension-types %}

`RaydiumCpmmV2ExtensionType` 用于在 `addRaydiumCpmmBucketV2Extensions()` 和 `removeRaydiumCpmmBucketV2Extensions()` 中选择 Raydium CPMM bucket 扩展，这两个操作在最终化之后会被拒绝。

```typescript
enum RaydiumCpmmV2ExtensionType {
  BackendSigner,     // { signer: PublicKey }
  LpLockSchedule,    // ClaimSchedule
  CreatorFee,        // { wallet: PublicKey }
  PostponableStart,  // PostponableStart
  LpClaimAuthority,  // PublicKey
  BurnLp,            // burn all LP at graduation
}
```

---

## 常量 {% #constants %}

以下常量从 `@metaplex-foundation/genesis` 导出，涵盖 Genesis 程序以及 Genesis 接受的 Raydium 账户。

| 常量 | 值 |
|----------|-------|
| `GENESIS_PROGRAM_ID` | `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` |
| `WRAPPED_SOL_MINT` | `So11111111111111111111111111111111111111112` |
| `RAYDIUM_CP_SWAP_PROGRAM_ID_MAINNET` | `CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C` |
| `RAYDIUM_CP_SWAP_PROGRAM_ID_DEVNET` | `DRaycpLY18LhpbydsBWbVJtxpNv9oXPgjRSfpF2bWpYb` |
| `RAYDIUM_AMM_CONFIG_MAINNET` | `Bq9YmSkZ6f13L4rPsx9MxSXuyPfKCBbvrbvarKti1LdG` |
| `RAYDIUM_AMM_CONFIG_CREATOR_FEE_MAINNET` | `CRRS5ieQmBrZjWhcj99JuGrT5tyuWDaGAXLXLFjbAtjQ` |

---

## 常见错误 {% #common-errors %}

Genesis 程序错误会以名称（及数字代码）的形式出现在交易日志和 SDK 抛出的 `ProgramError` 中。

### 通用错误 {% #general-errors %}

| 错误 | 原因 |
|-------|-------|
| `insufficient funds` | SOL 不足以支付费用 |
| `already initialized` | Genesis Account 已存在 |
| `GenesisAccountFinalized` (43) | 在 `finalizeV2()` 之后修改 bucket、扩展或行为 |
| `deposit period not active` | 不在存款窗口内 |
| `ClaimNotStarted` (22) | 领取开始条件未满足，或 `TimeRelative` 领取开始条件尚未触发 |
| `InvalidSoftCap` (221) | `softCap.amount` 为零 — 请传入 `softCap: null` 而不是 `{ amount: 0n }` |
| `SoftCapBelowThreshold` (222) | `softCap.amount` 低于 `minimumQuoteTokenThreshold.amount` |
| `LaunchPoolNotEnded` (25) | 在存款窗口关闭前调用了 `refundLaunchPoolV2()` 或 `triggerBehaviorsV2()` |
| `LaunchPoolThresholdMet` (173) | 在门槛已达到且未超过软顶时请求了退款 |
| `DepositAlreadyRefunded` (177) | 对同一笔存款调用了两次 `refundLaunchPoolV2()` |
| `RecipientMismatch` (39) | 领取的 `recipient` 与 bucket 上存储的接收者不一致 |
| `UnlockedBucketAlreadyClaimed` (51) | 调用 `claimUnlockedV2()` 时已没有剩余的基础代币或报价代币余额 |
| `NothingToClaim` (233) | 调用 `claimClaimScheduleV2()` 时没有已归属的代币 |
| `MissingBackendSigner` (145) / `InvalidBackendSigner` (69) | bucket 带有后端签名者扩展，但该签名者未共同签名。如果密钥丢失，请使用 `setBucketBackendSignerV2` 轮换 |

### 条件错误 {% #condition-errors %}

| 错误 | 原因 |
|-------|-------|
| `InvalidConditionTypeForSlot` (204) | 该槽位不允许此条件变体。请参阅 [条件槽位](#condition-slots) |
| `InvalidPrimaryBucket` (149) | `TimeRelative` 的 `bucketTime` 在参照 bucket 类型中不存在 |
| `UninitializedCondition` (203) | 条件保持为全零；请使用 SDK 辅助函数构建 |
| `InvalidConditionExpiry` (232) | `TriggeredWithExpiry` 的 `expiryTime` 为零或超出范围 |
| `ClaimScheduleConditionNotTriggered` (241) | 必须先触发 `TimeRelative` 领取计划条件，才能执行取消后的清扫 |

### 毕业与行为错误 {% #graduation-and-behavior-errors %}

| 错误 | 原因 |
|-------|-------|
| `GraduationNotStarted` (189) | Raydium bucket 的 `startCondition` 未满足；请先触发 `TimeRelative` 开始条件 |
| `BucketLaunchFailed` (262) | 为 Raydium bucket 提供资金的销售失败（收到了 `TransmitFailure`） |
| `BucketAlreadyGraduated` (188) | 在毕业之后调用了 `graduateToRaydiumCpmmV2()` 或延期操作 |
| `InvalidRaydiumAmmConfig` (202) | AMM 配置不是经批准的 Raydium 配置，或与费用收取指令不匹配 |
| `InvalidCreatorFeeConfig` (216) | `creatorFee` 扩展与创作者费 AMM 配置不匹配 |
| `InvalidPoolStatePda` (219) | `poolState` 不是通过 `deriveRaydiumPDAsV2` 派生的 |
| `NoLpTokensToClaim` (200) | 在毕业之前领取或销毁 LP |
| `InvalidLpClaimAuthority` (201) | LP 领取或销毁未由 LP 领取权限签名 |
| `InsufficientUnlockedAmount` (199) | 在尚无已解锁 LP 代币时领取 LP |
| `BurnLpConflictsWithLpLockSchedule` (263) | `burnLp: true` 与 `lpLockSchedule` 同时使用 |
| `MissingRaydiumGraduationSource` (270) | Raydium bucket 没有恰好被一个 `SendQuoteTokenPercentage` 和一个 `SendStartPrice` 指向 |
| `DuplicateRaydiumGraduationSource` (271) | 有多个销售 bucket 指向同一个 Raydium bucket |
| `RaydiumGraduationSourceMismatch` (272) | 报价代币和起始价格来自不同的源 bucket |
| `StartPriceAlreadySet` (273) | `SendStartPrice` 已写入过目标的价格 |
| `BehaviorNotSupportedForBucketType` (175) | 源 bucket 类型不允许该行为变体 |
| `BehaviorPercentageOverflow` (168) | `SendQuoteTokenPercentage`、`BaseTokenRollover` 或 `ReallocateBaseTokensOnFailure` 的合计超过 10,000 bps |
| `ClaimScheduleMultipleCancelBehaviors` (240) | 领取计划 bucket 上有多个 `ReallocateBaseTokensOnCancel` |
| `BehaviorAlreadyProcessed` (247) | 写入的行为带有 `processed: true` |
| `InvalidRemainingAccountsLength` (198) | `triggerBehaviorsV2` 的剩余账户不是（bucket，报价代币账户）成对传入 |
| `InvalidBucketState` (46) | 对既未毕业也未失败的 Raydium bucket 调用了 `triggerBehaviorsV2` |
| `PostponeLimitReached` (225) – `BucketNotPostponable` (231) | `postponeStartRaydiumCpmmBucketV2` 超出其策略限制 |

---

## 注意事项 {% #notes %}

- `TimeRelative` 条件只能通过 `triggerConditionsV2` 解析。毕业会触发 Raydium bucket 自身的 `graduateCondition`，但不会影响其他引用它的 bucket 上的条件。
- `triggerConditionsV2`、`triggerBehaviorsV2` 和 `graduateToRaydiumCpmmV2` 只执行 `assert_signer(payer)`，因此项目后端、keeper 机器人或任何用户钱包都可以推进发行生命周期。当 Raydium bucket 带有后端签名者扩展时，毕业还需要该后端签名者签名。
- 结束行为、条件和扩展在 `finalizeV2` 后即固定，但有两个例外：`postponeStartRaydiumCpmmBucketV2` 可以推迟以 `postponableStart` 创建的 bucket 的毕业开始时间，`setBucketBackendSignerV2` 可以轮换或清除现有的后端签名者。
- SDK 中包含 Raydium CLMM 毕业（`addRaydiumClmmBucketV2`、`graduateToRaydiumClmmV2`），但本页未作说明。
- 已针对 `@metaplex-foundation/genesis` 0.44.0 和已部署的 Genesis 程序版本 `genesis v0.41.0`（commit `86eb6121`）验证。已部署的程序不支持 Token-2022 基础代币铸币。来源：[metaplex-foundation/genesis](https://github.com/metaplex-foundation/genesis)。由 Metaplex Foundation 维护；最后验证于 2026-11-24。

---

## 快速参考 {% #quick-reference %}

| 项目 | 值 |
|------|-------|
| 程序 | `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` |
| JS SDK | `@metaplex-foundation/genesis`（已使用 0.44.0 验证） |
| 框架 | Umi（`@metaplex-foundation/umi`） |
| Raydium CP-Swap（主网） | `CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C` |
| 无需许可的 crank | `triggerConditionsV2`、`triggerBehaviorsV2`、`graduateToRaydiumCpmmV2` |
| 源代码 | [GitHub](https://github.com/metaplex-foundation/genesis) |

---

## 常见问题 {% #faq %}

### 什么是 Umi，为什么需要它？
Umi 是 Metaplex 的 Solana JavaScript 框架。它提供了统一的接口来构建交易、管理签名者以及与 Metaplex 程序交互。

### 我可以在浏览器中使用 Genesis SDK 吗？
可以。SDK 在 Node.js 和浏览器环境中都可以使用。在浏览器中，请使用钱包适配器进行签名，而不是密钥对文件。

### fetch 和 safeFetch 有什么区别？
`fetch` 在账户不存在时会抛出错误。`safeFetch` 则返回 `null`，适用于检查账户是否存在。

### 如何获取代币的发行类型？
使用代币的铸币地址通过 `fetchGenesisAccountV2FromSeeds()` 获取 `GenesisAccountV2` 账户。`launchType` 字段返回 `0`（未初始化）或 `3`（LaunchPoolV1）。要查询特定类型的所有发行，请使用 [GPA 构建器](#gpa-builder-query-by-launch-type)。或者，[Metaplex API](/zh/api) 在 REST 响应中以字符串形式返回发行类型。

### 哪些 Genesis 指令可以由任意钱包调用？
`triggerConditionsV2`、`triggerBehaviorsV2`、`graduateToRaydiumCpmmV2`、`collectRaydiumCpmmFeesV2`、`collectRaydiumCpmmFeesWithCreatorFeeV2`、`claimRaydiumCreatorFeeV2`、`claimUnlockedV2` 和 `claimClaimScheduleV2` 只需要手续费支付者签名。资金始终转入 bucket 上存储的地址。如果 bucket 带有后端签名者扩展，该签名者还必须共同签署毕业和领取操作。

### 为什么 Raydium 毕业后领取仍然失败？
以 Raydium bucket 的 `Graduate` 时间为参照的 `TimeRelative` 领取条件，不会被毕业操作或领取操作本身解析。请对每个依赖的 bucket 调用 [triggerConditionsV2](#trigger-conditions-v2)，并将 Raydium CPMM bucket 作为可写剩余账户传入。

### 如何处理交易错误？
将 `sendAndConfirm` 调用包装在 try/catch 块中，并将错误名称与[常见错误](#common-errors)表进行对照。常见错误包括资金不足、账户已最终化、条件尚未触发以及毕业尚未开始。

---

## 下一步 {% #next-steps %}

完整的实现教程：

- [开始使用](/zh/smart-contracts/genesis/getting-started) - 设置和首次发行
- [Launch Pool](/zh/smart-contracts/genesis/launch-pool) - 按比例分配
- [Presale](/zh/smart-contracts/genesis/presale) - 固定价格销售
- [项目归属](/zh/smart-contracts/genesis/project-vesting) - 领取计划 bucket
- [锁定 LP 代币](/zh/smart-contracts/genesis/locked-lp-tokens) - Raydium LP 锁定验证
- [创作者费](/zh/smart-contracts/genesis/creator-fees) - 创作者费的收取与领取
