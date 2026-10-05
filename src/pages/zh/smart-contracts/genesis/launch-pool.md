---
title: Launch Pool
metaTitle: Genesis Launch Pool | 公平发射与 Solana 代币分发 | Metaplex
description: Solana 上的公平发射代币分发。用户存入 SOL 并按比例获得 SPL 代币——链上众筹替代方案，具有有机价格发现机制。
created: '01-15-2025'
updated: '09-18-2026'
keywords:
  - launch pool
  - token distribution
  - fair launch
  - fair launch crypto
  - proportional distribution
  - deposit window
  - price discovery
  - token launchpad
  - crowdsale
  - token sale alternative
  - SPL token launch
  - on-chain token launch
  - soft cap
  - oversubscription
  - pro-rata refund
  - minimum quote token threshold
about:
  - Launch pools
  - Price discovery
  - Token distribution
  - Soft caps
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - 使用您的代币初始化 Genesis Account
  - 添加配置了存款窗口的 Launch Pool bucket
  - 添加 Unlocked bucket 用于接收募集的资金
  - 完成最终化设置，让用户在窗口期内存款
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: Launch Pool 中的代币价格是如何确定的？
    a: 价格是根据总存款有机发现的。最终价格等于存入的总 SOL 除以分配的代币数量。存款越多意味着每个代币的隐含价格越高。
  - q: 用户可以提取他们的存款吗？
    a: 可以，用户可以在存款期间提取。需要支付 {% fee product="genesis" config="launchPool" fee="withdraw" /%} 的提款费用，以防止系统被利用。
  - q: 如果我多次存款会怎样？
    a: 同一钱包的多次存款会累积到一个存款账户中。您的总份额基于您的累计存款。
  - q: 用户何时可以领取他们的代币？
    a: 在存款期结束且领取窗口开启后（由 claimStartCondition 定义）。必须先执行 triggerBehaviorsV2 来处理结束行为。
  - q: Launch Pool 和 Presale 有什么区别？
    a: Launch Pool 根据存款有机发现价格，按比例分配。Presale 则是预先设定固定价格，按先到先得的方式分配，直到达到上限。
  - q: 什么是 Launch Pool 软顶？
    a: 软顶是 Launch Pool 所保留的 quote token 的上限，通过 softCap 扩展设置。超过上限的存款仍会被接受，发行仍然成功，超出部分会在存款窗口关闭后按比例退还。
  - q: 软顶与最低 quote token 门槛有什么区别？
    a: 软顶是募集资金的上限，永远不会导致发行失败。最低 quote token 门槛（minimumQuoteTokenThreshold）是下限——如果总存款低于该下限，发行失败，每位存款人都可以领取全额退款。它们是相互独立的扩展，可以同时使用。
  - q: Launch Pool 超额认购时，存款人获得的代币会减少吗？
    a: 不会。完整的 base token 分配量仍然按比例分配给所有存款。超额认购时退还的是多余的 quote token，而不是削减代币分配，因此有效价格上限为 softCap 除以 baseTokenAllocation。
  - q: 软顶会改变 Raydium 毕业起始价格吗？
    a: 会。当 Launch Pool 超额认购时，毕业起始价格基于被限制后的募集金额而非原始存款总额计算，因此与 SendQuoteTokenPercentage 实际转出的金额一致。
---

**Launch Pool** 为 Solana 上的公平代币发射提供有机价格发现机制。用户在窗口期内存入 SOL，并根据其在总存款中的份额按比例获得 SPL 代币。没有抢跑，没有抢先交易，每个人都能获得公平分配。 {% .lead %}

{% callout title="您将学到什么" %}
本指南涵盖：
- Launch Pool 定价和分配的工作原理
- 设置存款和领取窗口
- 配置资金收集的结束行为
- 用户操作：存款、提款和领取
{% /callout %}

## 概要

Launch Pool 是一种众筹风格的代币发行机制，在定义的窗口期内接受存款，然后按比例分配代币。最终代币价格由总存款除以代币分配量确定——为您的代币生成事件 (TGE) 实现透明的链上价格发现。

- 用户在存款窗口期间存入 SOL（收取 {% fee product="genesis" config="launchPool" fee="deposit" /%} 费用）
- 存款期间允许提款（收取 {% fee product="genesis" config="launchPool" fee="withdraw" /%} 费用）
- 代币分配与存款份额成比例
- 可选的[软顶](#launch-pool-soft-cap)限制发行保留的资金额度，并按比例退还超出部分
- 结束行为将收集的 SOL 路由到资金库 bucket

{% callout type="note" %}
Launch Pool 通过存款发现价格。如需预先设定固定价格，请使用 [Presale](/zh/smart-contracts/genesis/presale)；如需基于出价的清算，请使用 [Uniform Price Auction](/zh/smart-contracts/genesis/uniform-price-auction)。流动性池的创建由 Raydium 毕业 bucket 负责，而不是由 Launch Pool bucket 本身负责。
{% /callout %}

## 快速开始

{% totem %}
{% totem-accordion title="查看完整设置脚本" %}

这展示了如何设置带有存款和领取窗口的 Launch Pool。要构建面向用户的应用，请参阅[用户操作](#用户操作)。

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox';
import {
  genesis,
  initializeV2,
  findGenesisAccountV2Pda,
  addLaunchPoolBucketV2,
  findLaunchPoolBucketV2Pda,
  addUnlockedBucketV2,
  findUnlockedBucketV2Pda,
  finalizeV2,
} from '@metaplex-foundation/genesis';
import { generateSigner, publicKey } from '@metaplex-foundation/umi';

async function setupLaunchPool() {
  const umi = createUmi('https://api.mainnet-beta.solana.com')
    .use(mplToolbox())
    .use(genesis());

  // umi.use(keypairIdentity(yourKeypair));

  const baseMint = generateSigner(umi);
  const TOTAL_SUPPLY = 1_000_000_000_000_000n; // 1 million tokens (9 decimals)

  // 1. Initialize
  const [genesisAccount] = findGenesisAccountV2Pda(umi, {
    baseMint: baseMint.publicKey,
    genesisIndex: 0,
  });

  await initializeV2(umi, {
    baseMint,
    fundingMode: 0,
    totalSupplyBaseToken: TOTAL_SUPPLY,
    name: 'My Token',
    symbol: 'MTK',
    uri: 'https://example.com/metadata.json',
  }).sendAndConfirm(umi);

  // 2. Define timing
  const now = BigInt(Math.floor(Date.now() / 1000));
  const depositStart = now + 60n;
  const depositEnd = now + 86400n; // 24 hours
  const claimStart = depositEnd + 1n;
  const claimEnd = claimStart + 604800n; // 1 week

  // 3. Derive bucket PDAs
  const [launchPoolBucket] = findLaunchPoolBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });
  const [unlockedBucket] = findUnlockedBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });

  // 4. Add Launch Pool bucket
  await addLaunchPoolBucketV2(umi, {
    genesisAccount,
    baseMint: baseMint.publicKey,
    baseTokenAllocation: TOTAL_SUPPLY,
    depositStartCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: depositStart,
      triggeredTimestamp: null,
    },
    depositEndCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: depositEnd,
      triggeredTimestamp: null,
    },
    claimStartCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: claimStart,
      triggeredTimestamp: null,
    },
    claimEndCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: claimEnd,
      triggeredTimestamp: null,
    },
    minimumDepositAmount: null,
    endBehaviors: [
      {
        __kind: 'SendQuoteTokenPercentage',
        padding: Array(4).fill(0),
        destinationBucket: publicKey(unlockedBucket),
        percentageBps: 10000, // 100%
        processed: false,
      },
    ],
  }).sendAndConfirm(umi);

  // 5. Add Unlocked bucket (receives SOL after transition)
  await addUnlockedBucketV2(umi, {
    genesisAccount,
    baseMint: baseMint.publicKey,
    baseTokenAllocation: 0n,
    recipient: umi.identity.publicKey,
    claimStartCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: claimStart,
      triggeredTimestamp: null,
    },
    claimEndCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: claimEnd,
      triggeredTimestamp: null,
    },
  }).sendAndConfirm(umi);

  // 6. Finalize
  await finalizeV2(umi, {
    baseMint: baseMint.publicKey,
    genesisAccount,
  }).sendAndConfirm(umi);

  console.log('Launch Pool active!');
  console.log('Token:', baseMint.publicKey);
  console.log('Genesis:', genesisAccount);
}

setupLaunchPool().catch(console.error);
```

{% /totem-accordion %}
{% /totem %}

## 工作原理

1. 特定数量的代币被分配到 Launch Pool bucket
2. 用户在存款窗口期间存入 SOL（允许带费用提款）
3. 窗口关闭后，根据存款份额按比例分配代币

### 价格发现

代币价格从总存款中产生：

```
tokenPrice = totalDeposits / tokenAllocation
userTokens = (userDeposit / totalDeposits) * tokenAllocation
```

**示例：** 分配 1,000,000 个代币，总存款 100 SOL = 每个代币 0.0001 SOL

价格发现默认没有上限——认购越多，隐含价格越高。设置[软顶](#launch-pool-soft-cap)可为其设定上限。

### 生命周期

1. **存款期** - 用户在定义的窗口期间存入 SOL
2. **`triggerBehaviorsV2`** - 执行结束行为（例如，将收集的 SOL 发送到另一个 bucket）
3. **领取期** - 用户根据其存款权重按比例领取代币
4. **退款期**（视情况而定）- 如果超过了[软顶](#launch-pool-soft-cap)或未达到[最低 quote token 门槛](#soft-cap-and-minimum-quote-token-threshold-together)，存款人需调用 `refundLaunchPoolV2`

## Launch Pool 软顶 {% #launch-pool-soft-cap %}

**软顶**是 Launch Pool 所保留的 quote token 的上限，通过 `addLaunchPoolBucketV2` 上的 `softCap` 扩展配置。超过上限的存款在存款窗口期间仍会被接受，发行仍然成功，超出的 quote token 会在窗口关闭后按比例退还。

没有软顶时，价格发现没有上限：所有存款都被保留，隐含代币价格随认购量上升。软顶固定了发行募集的最大金额，因此无论存款超出多少，有效价格都是 `softCap / baseTokenAllocation`。

| 属性 | 配置软顶后的行为 |
|----------|------------------------------------------|
| 超过上限的存款 | 在存款窗口期间被接受——存款不会因达到上限而被拒绝 |
| 发行结果 | 成功——软顶是上限，绝不是失败条件 |
| Base token 分配 | 完整的 `baseTokenAllocation` 按比例分配给所有存款 |
| 超出的 quote token | 存款窗口结束后通过 `refundLaunchPoolV2` 按比例退还 |
| 结束行为所看到的募集金额 | 被限制为软顶，因此 `SendQuoteTokenPercentage` 最多转出 `softCap` |
| Raydium 毕业起始价格 | 基于被限制后的募集金额计算，而非原始存款总额 |

{% callout type="note" %}
软顶是募集资金的上限，而不是下限。下限是一个单独的扩展 `minimumQuoteTokenThreshold`——参见[同时使用软顶和最低 Quote Token 门槛](#soft-cap-and-minimum-quote-token-threshold-together)。
{% /callout %}

### 在 Launch Pool Bucket 上配置软顶 {% #configuring-a-soft-cap-on-a-launch-pool-bucket %}

添加 bucket 时，向 `addLaunchPoolBucketV2` 传入 `softCap` 值。金额以 quote token 的最小单位计价（wSOL 为 lamports）。

{% totem %}

```typescript {% title="Add a Launch Pool bucket with a 100 SOL soft cap" %}
import { sol } from '@metaplex-foundation/umi';

await addLaunchPoolBucketV2(umi, {
  genesisAccount,
  baseMint: baseMint.publicKey,
  baseTokenAllocation: TOTAL_SUPPLY,
  // ...time conditions and end behaviors...

  // Floor: the launch fails below this and everyone can take a full refund.
  minimumQuoteTokenThreshold: { amount: sol(10).basisPoints },

  // Ceiling: the launch keeps at most this much; the rest is refunded pro-rata.
  softCap: { amount: sol(100).basisPoints },
}).sendAndConfirm(umi);
```

{% /totem %}

{% callout type="warning" %}
在 `@metaplex-foundation/genesis` 0.42.0 中，`softCap` 是 `addLaunchPoolBucketV2` 的**必填**参数。与其他 Launch Pool 扩展不同，它没有默认值，因此不需要上限时请显式传入 `softCap: null`。
{% /callout %}

软顶会在设置扩展时以及 `finalizeV2` 时进行验证：

| 规则 | 违反时的错误 |
|------|-------------------|
| `softCap.amount` 必须大于零 | `InvalidSoftCap` (221) |
| `softCap.amount` 必须大于或等于 `minimumQuoteTokenThreshold.amount` | `SoftCapBelowThreshold` (222) |
| 扩展只能在 `finalizeV2` 之前添加或移除 | 账户因已最终化而被拒绝 |

也可以使用 `LaunchPoolV2ExtensionType` 的 `SoftCap` 成员，通过 `addLaunchPoolBucketV2Extensions` 和 `removeLaunchPoolBucketV2Extensions` 在现有 bucket 上设置或清除软顶——但仅限 Genesis Account 尚未最终化时。

### 超额认购与按比例退款的计算 {% #oversubscription-and-pro-rata-refund-math %}

当 `quoteTokenDepositTotal` 严格大于 `softCap.amount` 时，Launch Pool 处于**超额认购**状态。此时每笔存款会被拆分为计入上限的*已成交*部分和可退还的*超出*部分：

{% totem %}

```text {% title="Per-depositor split in an oversubscribed Launch Pool" %}
filled_i = ceil(deposit_i * softCap / totalDeposits)
excess_i = deposit_i - filled_i
tokens_i = (weighted_i / weightedQuoteTokenTotal) * baseTokenAllocation
```

{% /totem %}

`filled` 向**上**取整，使所有已成交部分之和始终不小于软顶。这样无论先执行退款还是先执行毕业，bucket 都能满足被限制的毕业转账；每位存款人的取整误差都小于一个最小单位，因此 bucket 中剩余的尾差总计最多为 `depositCount - 1` 个最小单位。

代币分配不受上限影响。退还超出部分不会移除存款人的加权贡献，因此每个人仍按其**全部**存款获得相应比例的代币。

**示例**——分配 1,000,000 个代币，软顶为 100 SOL，实际存入 150 SOL：

| 存款人 | 存入 | 已成交（保留） | 退还 | 获得的代币 |
|-----------|-----------|---------------|----------|-----------------|
| Alice | 50 SOL | ~33.33 SOL | ~16.67 SOL | 333,333 (1/3) |
| Bob | 100 SOL | ~66.67 SOL | ~33.33 SOL | 666,667 (2/3) |
| **合计** | **150 SOL** | **100 SOL** | **50 SOL** | **1,000,000** |

有效价格为每个代币 0.0001 SOL（100 SOL / 1,000,000），而不是未设上限时由存款总额得出的每个代币 0.00015 SOL。链上数值以 lamports 计算，且 `filled` 向上取整，因此实际数字与上面取整后的 SOL 金额相差几个 lamports。

### 使用 refundLaunchPoolV2 退还超出的存款 {% #refunding-excess-deposits-with-refund-launch-pool-v2 %}

`refundLaunchPoolV2` 在超额认购的存款窗口关闭后，退还存款人超出的 quote token。它没有金额参数——程序根据存款、软顶和 bucket 的存款总额计算可退还的金额。

{% code-tabs-imported from="genesis/refund_launch_pool_v2" frameworks="umi" filename="refundLaunchPool" /%}

退款路径的关键特性：

- **触发退款无需许可。** 只有 `payer` 必须签名。如果存款人也签名，其空的 base token 账户会被代为关闭。
- **退款不收取任何费用和罚金**；存款和提款罚金计划不会影响退款。
- **领取顺序无关紧要。** 超出部分的退款可以在 `claimLaunchPoolV2` 之前或之后进行；两种顺序最终都会得到相同的状态。
- **每笔存款只能退款一次。** 第二次调用会返回 `DepositAlreadyRefunded`。
- **退款需要存款窗口已结束。** 更早调用会返回 `LaunchPoolNotEnded`。
- **退款要求未达到下限或超过上限。** 如果两者都不适用，调用会返回 `LaunchPoolThresholdMet`。

### 同时使用软顶和最低 Quote Token 门槛 {% #soft-cap-and-minimum-quote-token-threshold-together %}

`softCap` 与 `minimumQuoteTokenThreshold` 是从相反方向约束 Launch Pool 的独立扩展，`refundLaunchPoolV2` 同时服务于两者。当下限未达到时，该情形优先，退款为全额退款。

| 配置 | 存款低于下限 | 存款介于下限和上限之间 | 存款高于上限 |
|---------------|--------------------------|--------------------------------|------------------------|
| 均未设置 | 发行成功，无退款 | 发行成功，无退款 | 发行成功，无退款 |
| 仅设下限 | 发行失败，全额退款 | 发行成功，无退款 | 发行成功，无退款 |
| 仅设上限 | 发行成功，无退款 | 发行成功，无退款 | 发行成功，超出部分按比例退还 |
| 同时设下限和上限 | 发行失败，全额退款 | 发行成功，无退款 | 发行成功，超出部分按比例退还 |

{% callout type="note" %}
全额退款会移除存款人在 bucket 中的加权贡献，且不能在领取之后进行——下限未达到意味着无法领取。超出部分的退款会保留加权贡献，以确保按比例领取的公式保持正确。
{% /callout %}

## 费用

{% protocol-fees program="genesis" config="launchPool" showTitle=false /%}

每笔存款：扣除 {% fee product="genesis" config="launchPool" fee="deposit" /%} 用户存款费后的 SOL 净额才会记入存款账户余额。

## 设置指南

### 前置条件

{% totem %}

```bash
npm install @metaplex-foundation/genesis @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-toolbox
```

{% /totem %}

### 1. 初始化 Genesis Account

Genesis Account 创建您的代币并协调所有分发 bucket。

{% code-tabs-imported from="genesis/initialize_v2" frameworks="umi" filename="initializeV2" /%}

{% callout type="note" %}
`totalSupplyBaseToken` 应等于所有 bucket 分配的总和。
{% /callout %}

### 2. 添加 Launch Pool Bucket

Launch Pool bucket 收集存款并按比例分配代币。在此处配置时间。

{% code-tabs-imported from="genesis/add_launch_pool_bucket_v2" frameworks="umi" filename="addLaunchPoolBucket" /%}

### 3. 添加 Unlocked Bucket

Unlocked bucket 在 `triggerBehaviorsV2` 执行后接收来自 Launch Pool 的 SOL。

{% code-tabs-imported from="genesis/add_unlocked_bucket_v2" frameworks="umi" filename="addUnlockedBucket" /%}

### 4. 最终化

配置完所有 bucket 后，进行最终化以激活发行。此操作不可逆。

{% code-tabs-imported from="genesis/finalize_v2" frameworks="umi" filename="finalize" /%}

## 用户操作

### 包装 SOL

用户必须在存款前将 SOL 包装为 wSOL。

{% code-tabs-imported from="genesis/wrap_sol" frameworks="umi" filename="wrapSol" /%}

### 存款

{% code-tabs-imported from="genesis/deposit_launch_pool_v2" frameworks="umi" filename="depositLaunchPool" /%}

同一用户的多次存款会累积到一个存款账户中。

### 提款

用户可以在存款期间提款。需要支付 {% fee product="genesis" config="launchPool" fee="withdraw" /%} 费用。

{% code-tabs-imported from="genesis/withdraw_launch_pool_v2" frameworks="umi" filename="withdrawLaunchPool" /%}

如果用户提取全部余额，存款 PDA 将被关闭。

### 领取代币

在存款期结束且领取开放后：

{% code-tabs-imported from="genesis/claim_launch_pool_v2" frameworks="umi" filename="claimLaunchPool" /%}

代币分配：`userTokens = (userDeposit / totalDeposits) * bucketTokenAllocation`

### 退还存款 {% #refunding-a-deposit %}

退款适用于两种情况：发行未达到其 `minimumQuoteTokenThreshold`（全额退款），或超过了其 `softCap`（仅退还超出部分）。两者使用同一条指令——参见[使用 refundLaunchPoolV2 退还超出的存款](#refunding-excess-deposits-with-refund-launch-pool-v2)。

## 管理员操作

### 执行 `triggerBehaviorsV2`

存款结束后，运行 `triggerBehaviorsV2` 将收集的 SOL 转移到 Unlocked bucket。

{% code-tabs-imported from="genesis/trigger_launch_pool_v2" frameworks="umi" filename="triggerBehaviors" /%}

**为什么这很重要：** 如果不执行 `triggerBehaviorsV2`，收集的 SOL 将保持锁定在 Launch Pool bucket 中。用户仍然可以领取代币，但团队无法获取募集的资金。

## 参考

### 时间条件

四个条件控制 Launch Pool 的时间：

| 条件 | 用途 |
|-----------|---------|
| `depositStartCondition` | 存款开放时间 |
| `depositEndCondition` | 存款关闭时间 |
| `claimStartCondition` | 领取开放时间 |
| `claimEndCondition` | 领取关闭时间 |

使用带有 Unix 时间戳的 `TimeAbsolute`：

{% totem %}

```typescript
const condition = {
  __kind: 'TimeAbsolute',
  padding: Array(47).fill(0),
  time: BigInt(Math.floor(Date.now() / 1000) + 3600), // 1 hour from now
  triggeredTimestamp: null,
};
```

{% /totem %}

### 结束行为

定义存款期结束后收集的 SOL 会发生什么：

{% totem %}

```typescript
endBehaviors: [
  {
    __kind: 'SendQuoteTokenPercentage',
    padding: Array(4).fill(0),
    destinationBucket: publicKey(unlockedBucket),
    percentageBps: 10000, // 100% = 10000 basis points
    processed: false,
  },
]
```

{% /totem %}

您可以将资金分配到多个 bucket：

{% totem %}

```typescript
endBehaviors: [
  {
    __kind: 'SendQuoteTokenPercentage',
    padding: Array(4).fill(0),
    destinationBucket: publicKey(treasuryBucket),
    percentageBps: 2000, // 20%
    processed: false,
  },
  {
    __kind: 'SendQuoteTokenPercentage',
    padding: Array(4).fill(0),
    destinationBucket: publicKey(liquidityBucket),
    percentageBps: 8000, // 80%
    processed: false,
  },
]
```

{% /totem %}

### Launch Pool 扩展 {% #launch-pool-extensions %}

扩展是在 Launch Pool bucket 上配置的可选保护机制。所有扩展都通过 `addLaunchPoolBucketV2` 设置，或在 `finalizeV2` 之前通过 `addLaunchPoolBucketV2Extensions` 和 `removeLaunchPoolBucketV2Extensions` 单独添加和移除。

| 扩展 | 类型 | 用途 |
|-----------|------|---------|
| `softCap` | `{ amount: bigint }` | 所保留 quote token 的上限；超出部分按比例退还 |
| `minimumQuoteTokenThreshold` | `{ amount: bigint }` | 下限，低于此值发行失败并开放全额退款 |
| `minimumDepositAmount` | `{ amount: bigint }` | 每笔存款的最低 quote token 数量 |
| `depositLimit` | `{ limit: bigint }` | 每个账户的最大 quote token 数量 |
| `allowlist` | `Allowlist` | 将存款限制为允许名单中的钱包 |
| `claimSchedule` | `ClaimSchedule` | 对已领取的 base token 进行线性归属 |
| `bonusSchedule` | `LinearBpsScheduleV2` | 随时间加权的存款奖励 |
| `depositPenalty` | `LinearBpsScheduleV2` | 随时间加权的存款罚金 |
| `withdrawPenalty` | `LinearBpsScheduleV2` | 随时间加权的提款罚金 |
| `backendSigner` | `BackendSigner` | 要求用户操作由后端共同签名 |

### 常见错误 {% #common-errors %}

下表涵盖无效的软顶配置，以及 `refundLaunchPoolV2` 拒绝退款请求的 Launch Pool 状态。

| 错误 | 代码 | 原因 |
|-------|------|-------|
| `InvalidSoftCap` | 221 | `softCap.amount` 为零——请省略该扩展，而不是将其设置为 `0` |
| `SoftCapBelowThreshold` | 222 | `softCap.amount` 低于 `minimumQuoteTokenThreshold.amount` |
| `LaunchPoolNotEnded` | — | 在存款窗口关闭前调用了 `refundLaunchPoolV2` |
| `LaunchPoolThresholdMet` | 173 | 在下限已达到且未超过上限时请求了退款 |
| `DepositAlreadyRefunded` | — | 对同一笔存款调用了两次 `refundLaunchPoolV2` |
| `DepositAlreadyClaimed` | — | 存款人已领取代币后请求了全额退款 |

### 获取状态

**Bucket 状态：**

{% totem %}

```typescript
import { fetchLaunchPoolBucketV2 } from '@metaplex-foundation/genesis';

const bucket = await fetchLaunchPoolBucketV2(umi, launchPoolBucket);
console.log('Total deposits:', bucket.quoteTokenDepositTotal);
console.log('Deposit count:', bucket.depositCount);
console.log('Claim count:', bucket.claimCount);
console.log('Token allocation:', bucket.bucket.baseTokenAllocation);

// Soft cap state (Option<SoftCap>)
console.log('Soft cap:', bucket.extensions.softCap);
console.log('Floor:', bucket.extensions.minimumQuoteTokenThreshold);
```

{% /totem %}

**存款状态：**

{% totem %}

```typescript
import { fetchLaunchPoolDepositV2, safeFetchLaunchPoolDepositV2 } from '@metaplex-foundation/genesis';

const deposit = await fetchLaunchPoolDepositV2(umi, depositPda); // throws if not found
const maybeDeposit = await safeFetchLaunchPoolDepositV2(umi, depositPda); // returns null

if (deposit) {
  console.log('Amount deposited:', deposit.amountQuoteToken);
  console.log('Claimed:', deposit.claimed);
  console.log('Refunded:', deposit.refunded);
}
```

{% /totem %}

## 注意事项

- Launch Pool 的用户存款费与提款费见上文 [费用](#费用)。
- 同一用户的多次存款会累积在一个存款账户中
- 如果用户提取全部余额，存款 PDA 将被关闭
- 存款结束后必须执行 `triggerBehaviorsV2` 以处理结束行为
- 用户必须拥有 wSOL（包装的 SOL）才能存款
- 在 `@metaplex-foundation/genesis` 0.42.0 中，`softCap` 是 `addLaunchPoolBucketV2` 的必填参数——不需要上限时请传入 `softCap: null`
- 包括 `softCap` 在内的 Launch Pool 扩展只能在 `finalizeV2` 之前添加或移除
- Genesis 程序和 JavaScript SDK 支持软顶；[`mplx` CLI](/zh/dev-tools/cli/genesis/launch-pool) 暂未提供软顶参数
- 超额认购的 Launch Pool 会在 bucket 中留下最多 `depositCount - 1` 个最小单位的取整尾差，因为每位存款人的已成交部分都向上取整
- 退款之后，`quoteTokenDepositTotal` 和 `depositCount` 会作为历史记录保留；`refundCount` 记录已处理的退款数量

## 常见问题

### Launch Pool 中的代币价格是如何确定的？
价格是根据总存款有机发现的。最终价格等于存入的总 SOL 除以分配的代币数量。存款越多意味着每个代币的隐含价格越高。

### 用户可以提取他们的存款吗？
可以，用户可以在存款期间提取。需要支付 {% fee product="genesis" config="launchPool" fee="withdraw" /%} 的提款费用，以防止系统被利用。

### 如果我多次存款会怎样？
同一钱包的多次存款会累积到一个存款账户中。您的总份额基于您的累计存款。

### 用户何时可以领取他们的代币？
在存款期结束且领取窗口开启后（由 `claimStartCondition` 定义）。必须先执行 `triggerBehaviorsV2` 来处理结束行为。

### Launch Pool 和 Presale 有什么区别？
Launch Pool 根据存款有机发现价格，按比例分配。Presale 则是预先设定固定价格，按先到先得的方式分配，直到达到上限。

### 什么是 Launch Pool 软顶？
软顶是 Launch Pool 所保留的 quote token 的上限，通过 `softCap` 扩展设置。超过上限的存款仍会被接受，发行仍然成功，超出部分会在存款窗口关闭后按比例退还。

### 软顶与最低 quote token 门槛有什么区别？
软顶是募集资金的上限，永远不会导致发行失败。`minimumQuoteTokenThreshold` 是下限——如果总存款低于该下限，发行失败，每位存款人都可以领取全额退款。它们是相互独立的扩展，可以同时使用。

### Launch Pool 超额认购时，存款人获得的代币会减少吗？
不会。完整的 base token 分配量仍然按比例分配给所有存款。超额认购时退还的是多余的 quote token，而不是削减代币分配，因此有效价格上限为 `softCap / baseTokenAllocation`。

### 软顶会改变 Raydium 毕业起始价格吗？
会。当 Launch Pool 超额认购时，毕业起始价格基于被限制后的募集金额而非原始存款总额计算，因此与 `SendQuoteTokenPercentage` 实际转出的金额一致。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Launch Pool** | 基于存款的分发方式，价格在结束时发现 |
| **存款窗口** | 用户可以存入和提取 SOL 的时间段 |
| **领取窗口** | 用户可以领取其按比例分配代币的时间段 |
| **End Behavior** | 存款期结束后执行的自动化操作 |
| **`triggerBehaviorsV2`** | 处理结束行为并路由资金的指令 |
| **按比例分配** | 基于用户在总存款中的份额进行代币分配 |
| **Quote Token** | 用户存入的代币（通常是 wSOL） |
| **Base Token** | 正在分发的代币 |
| **软顶（Soft Cap）** | Launch Pool 所保留 quote token 的上限；超出部分按比例退还 |
| **最低 Quote Token 门槛（Minimum Quote Token Threshold）** | 下限，低于此值 Launch Pool 失败并开放全额退款 |
| **超额认购（Oversubscription）** | 总存款超过所配置软顶的状态 |
| **已成交部分（Filled Portion）** | 存款中计入软顶并由发行保留的部分 |
| **超出部分退款（Excess Refund）** | 退还存款中超出软顶的部分，同时保持代币分配不变 |

## 后续步骤

- [Presale](/zh/smart-contracts/genesis/presale) - 固定价格代币销售
- [Uniform Price Auction](/zh/smart-contracts/genesis/uniform-price-auction) - 基于出价的代币发售
- [发行代币](/zh/tokens/launch-token) - 端到端代币发行指南
- [Metaplex API](/zh/api) - 通过 API 查询发射和代币销售数据
