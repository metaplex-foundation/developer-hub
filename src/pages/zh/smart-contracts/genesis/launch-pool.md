---
title: Launch Pool
metaTitle: Genesis Launch Pool | 公平发射与 Solana 代币分发 | Metaplex
description: Solana 上的公平发射代币分发。用户存入 SOL 并按比例获得 SPL 代币——链上众筹替代方案，具有有机价格发现机制。
created: '01-15-2025'
updated: '01-31-2026'
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
about:
  - Launch pools
  - Price discovery
  - Token distribution
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
    a: 在存款期结束且领取窗口开启后（由 claimStartCondition 定义）。必须先执行 Transition 来处理结束行为。
  - q: Launch Pool 和 Presale 有什么区别？
    a: Launch Pool 根据存款有机发现价格，按比例分配。Presale 则是预先设定固定价格，按先到先得的方式分配，直到达到上限。
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
- 结束行为将收集的 SOL 路由到资金库 bucket

## 不在范围内

固定价格销售（参见 [Presale](/zh/smart-contracts/genesis/presale)）、基于出价的拍卖（参见 [Uniform Price Auction](/zh/smart-contracts/genesis/uniform-price-auction)）以及流动性池创建（使用 Raydium/Orca）。

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

### 生命周期

1. **存款期** - 用户在定义的窗口期间存入 SOL
2. **Transition** - 执行结束行为（例如，将收集的 SOL 发送到另一个 bucket）
3. **领取期** - 用户根据其存款权重按比例领取代币

## 费用

{% protocol-fees program="genesis" config="launchPool" showTitle=false /%}

存款费用示例：用户存入 10 SOL，实际记入用户存款账户的是 9.8 SOL。

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

Unlocked bucket 在 Transition 后接收来自 Launch Pool 的 SOL。

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

## 管理员操作

### 执行 Transition

存款结束后，执行 Transition 将收集的 SOL 转移到 Unlocked bucket。

{% code-tabs-imported from="genesis/transition_launch_pool_v2" frameworks="umi" filename="transitionLaunchPool" /%}

**为什么这很重要：** 如果不执行 Transition，收集的 SOL 将保持锁定在 Launch Pool bucket 中。用户仍然可以领取代币，但团队无法获取募集的资金。

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
}
```

{% /totem %}

## 注意事项

- {% fee product="genesis" config="launchPool" fee="deposit" /%} 协议费用适用于存款和提款
- 同一用户的多次存款会累积在一个存款账户中
- 如果用户提取全部余额，存款 PDA 将被关闭
- 存款结束后必须执行 Transition 以处理结束行为
- 用户必须拥有 wSOL（包装的 SOL）才能存款

## 常见问题

### Launch Pool 中的代币价格是如何确定的？
价格是根据总存款有机发现的。最终价格等于存入的总 SOL 除以分配的代币数量。存款越多意味着每个代币的隐含价格越高。

### 用户可以提取他们的存款吗？
可以，用户可以在存款期间提取。需要支付 {% fee product="genesis" config="launchPool" fee="withdraw" /%} 的提款费用，以防止系统被利用。

### 如果我多次存款会怎样？
同一钱包的多次存款会累积到一个存款账户中。您的总份额基于您的累计存款。

### 用户何时可以领取他们的代币？
在存款期结束且领取窗口开启后（由 `claimStartCondition` 定义）。必须先执行 Transition 来处理结束行为。

### Launch Pool 和 Presale 有什么区别？
Launch Pool 根据存款有机发现价格，按比例分配。Presale 则是预先设定固定价格，按先到先得的方式分配，直到达到上限。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Launch Pool** | 基于存款的分发方式，价格在结束时发现 |
| **存款窗口** | 用户可以存入和提取 SOL 的时间段 |
| **领取窗口** | 用户可以领取其按比例分配代币的时间段 |
| **End Behavior** | 存款期结束后执行的自动化操作 |
| **Transition** | 处理结束行为并路由资金的指令 |
| **按比例分配** | 基于用户在总存款中的份额进行代币分配 |
| **Quote Token** | 用户存入的代币（通常是 wSOL） |
| **Base Token** | 正在分发的代币 |

## 后续步骤

- [Presale](/zh/smart-contracts/genesis/presale) - 固定价格代币销售
- [Uniform Price Auction](/zh/smart-contracts/genesis/uniform-price-auction) - 基于出价的代币发售
- [发行代币](/zh/tokens/launch-token) - 端到端代币发行指南
- [Aggregation API](/zh/smart-contracts/genesis/aggregation) - 通过 API 查询代币销售数据
