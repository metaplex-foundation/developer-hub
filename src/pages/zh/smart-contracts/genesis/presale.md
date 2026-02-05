---
title: Presale
metaTitle: Genesis - Presale | 固定价格代币销售 | Metaplex
description: 用户存入SOL并以预定汇率获得代币的固定价格代币销售。预先设定价格，实现受控分配。
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - presale
  - fixed price sale
  - token presale
  - ICO
  - token sale
  - fixed pricing
about:
  - Presale mechanics
  - Fixed pricing
  - Token sales
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - Initialize a Genesis Account with your token allocation
  - Add a Presale bucket with price and cap configuration
  - Add an Unlocked bucket for collected funds
  - Finalize and open the presale for deposits
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: Presale中代币价格如何计算？
    a: 价格等于SOL上限除以代币分配量。对于100 SOL上限和1,000,000代币，价格为每代币0.0001 SOL。
  - q: 如果没有达到SOL上限会怎样？
    a: 用户仍按存款比例获得代币。如果对100 SOL上限只存入了50 SOL，存款人将获得分配代币的50%。
  - q: 可以设置每用户存款限额吗？
    a: 可以。使用minimumDepositAmount设置每笔交易的最低限额，使用depositLimit设置每用户的最大存款总额。
  - q: Presale和Launch Pool有什么区别？
    a: Presale的价格由代币分配量和SOL上限固定。Launch Pool根据总存款量自然发现价格。
  - q: 什么时候应该使用Presale vs Launch Pool？
    a: 当您需要可预测的定价并明确知道要筹集多少时使用Presale。使用Launch Pool进行自然价格发现。
---

**Presale**提供固定价格的代币分配。根据分配量和SOL上限预先设定代币价格——用户确切知道会得到什么，您也确切知道会筹集多少。 {% .lead %}

{% callout title="学习内容" %}
本指南涵盖：
- Presale定价如何运作（分配量 + 上限 = 价格）
- 设置存款窗口和领取期间
- 配置存款限额和冷却时间
- 用户操作：包装SOL、存款和领取
{% /callout %}

## 概述

Presale以预定价格出售代币。价格根据您配置的代币分配量和SOL上限计算。

- 固定价格 = SOL上限 / 代币分配量
- 用户在存款窗口期间存入SOL（收取{% fee product="genesis" config="presale" fee="deposit" /%}费用）
- 先到先得，直到SOL上限
- 可选：最小/最大存款限额、冷却时间、后端授权

## 超出范围

自然价格发现（参见[Launch Pool](/zh/smart-contracts/genesis/launch-pool)）、基于出价的拍卖（参见[Uniform Price Auction](/zh/smart-contracts/genesis/uniform-price-auction)）和归属计划。

## 工作原理

1. 您将代币分配到Presale，设置SOL上限来决定固定价格
2. 用户在存款窗口期间以固定汇率存入SOL
3. 存款期结束后，您执行过渡以转移资金
4. 用户根据存款金额领取代币

### 价格计算

代币价格由分配代币与SOL上限的比率决定：

```
price = allocationQuoteTokenCap / baseTokenAllocation
tokens = deposit / price
```

例如，如果您分配1,000,000代币，SOL上限为100：
- 价格 = 100 SOL / 1,000,000代币 = 每代币0.0001 SOL
- 存入10 SOL可获得100,000代币

### 费用

{% protocol-fees program="genesis" config="presale" showTitle=false /%}

## 快速开始

{% totem %}
{% totem-accordion title="查看完整设置脚本" %}

这展示了如何设置带有开始和结束日期的Presale。您还可以添加最小存款金额、最大存款金额或后端签名者。要构建面向用户的应用，请参见[用户操作](#用户操作)。

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox';
import {
  genesis,
  initializeV2,
  findGenesisAccountV2Pda,
  addPresaleBucketV2,
  findPresaleBucketV2Pda,
  addUnlockedBucketV2,
  findUnlockedBucketV2Pda,
  finalizeV2,
  NOT_TRIGGERED_TIMESTAMP,
} from '@metaplex-foundation/genesis';
import { generateSigner, publicKey, sol } from '@metaplex-foundation/umi';

async function setupPresale() {
  const umi = createUmi('https://api.mainnet-beta.solana.com')
    .use(mplToolbox())
    .use(genesis());

  // umi.use(keypairIdentity(yourKeypair));

  const baseMint = generateSigner(umi);
  const backendSigner = generateSigner(umi);
  const TOTAL_SUPPLY = 1_000_000_000_000_000n; // 100万代币（9位小数）

  // 1. 初始化
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

  // 2. 定义时间
  const now = BigInt(Math.floor(Date.now() / 1000));
  const depositStart = now + 60n;
  const depositEnd = now + 86400n;
  const claimStart = depositEnd + 1n;
  const claimEnd = claimStart + 604800n;

  // 3. 推导Bucket PDA
  const [presaleBucket] = findPresaleBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });
  const [unlockedBucket] = findUnlockedBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });

  // 4. 添加Presale Bucket
  await addPresaleBucketV2(umi, {
    genesisAccount,
    baseMint: baseMint.publicKey,
    baseTokenAllocation: TOTAL_SUPPLY,
    allocationQuoteTokenCap: sol(100).basisPoints, // 100 SOL上限
    depositStartCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: depositStart,
      triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
    },
    depositEndCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: depositEnd,
      triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
    },
    claimStartCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: claimStart,
      triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
    },
    claimEndCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: claimEnd,
      triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
    },
    minimumDepositAmount: null,
    endBehaviors: [
      {
        __kind: 'SendQuoteTokenPercentage',
        padding: Array(4).fill(0),
        destinationBucket: publicKey(unlockedBucket),
        percentageBps: 10000,
        processed: false,
      },
    ],
  }).sendAndConfirm(umi);

  // 5. 添加Unlocked Bucket（过渡后接收SOL）
  await addUnlockedBucketV2(umi, {
    genesisAccount,
    baseMint: baseMint.publicKey,
    baseTokenAllocation: 0n,
    recipient: umi.identity.publicKey,
    claimStartCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: claimStart,
      triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
    },
    claimEndCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: claimEnd,
      triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
    },
    backendSigner: { signer: backendSigner.publicKey },
  }).sendAndConfirm(umi);

  // 6. Finalize
  await finalizeV2(umi, {
    baseMint: baseMint.publicKey,
    genesisAccount,
  }).sendAndConfirm(umi);

  console.log('Presale active!');
  console.log('Token:', baseMint.publicKey);
  console.log('Genesis:', genesisAccount);
}

setupPresale().catch(console.error);
```

{% /totem-accordion %}
{% /totem %}

## 设置指南

### 前提条件

{% totem %}

```bash
npm install @metaplex-foundation/genesis @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-toolbox
```

{% /totem %}

### 1. 初始化Genesis Account

Genesis Account创建您的代币并协调所有分配Bucket。

{% totem %}

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox';
import {
  genesis,
  initializeV2,
  findGenesisAccountV2Pda,
} from '@metaplex-foundation/genesis';
import { generateSigner, keypairIdentity } from '@metaplex-foundation/umi';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplToolbox())
  .use(genesis());

// umi.use(keypairIdentity(yourKeypair));

const baseMint = generateSigner(umi);
const TOTAL_SUPPLY = 1_000_000_000_000_000n; // 100万代币（9位小数）

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
```

{% /totem %}

{% callout type="note" %}
`totalSupplyBaseToken`应该等于所有Bucket分配的总和。
{% /callout %}

### 2. 添加Presale Bucket

Presale Bucket收集存款并分配代币。在此配置时间和可选限制。

{% totem %}

```typescript
import {
  addPresaleBucketV2,
  findPresaleBucketV2Pda,
  findUnlockedBucketV2Pda,
  NOT_TRIGGERED_TIMESTAMP,
} from '@metaplex-foundation/genesis';
import { publicKey, sol } from '@metaplex-foundation/umi';

const [presaleBucket] = findPresaleBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });
const [unlockedBucket] = findUnlockedBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });

const now = BigInt(Math.floor(Date.now() / 1000));
const depositStart = now;
const depositEnd = now + 86400n; // 24小时
const claimStart = depositEnd + 1n;
const claimEnd = claimStart + 604800n; // 1周

await addPresaleBucketV2(umi, {
  genesisAccount,
  baseMint: baseMint.publicKey,
  baseTokenAllocation: TOTAL_SUPPLY,
  allocationQuoteTokenCap: 100_000_000_000n, // 100 SOL上限（设置价格）

  // 时间
  depositStartCondition: {
    __kind: 'TimeAbsolute',
    padding: Array(47).fill(0),
    time: depositStart,
    triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
  },
  depositEndCondition: {
    __kind: 'TimeAbsolute',
    padding: Array(47).fill(0),
    time: depositEnd,
    triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
  },
  claimStartCondition: {
    __kind: 'TimeAbsolute',
    padding: Array(47).fill(0),
    time: claimStart,
    triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
  },
  claimEndCondition: {
    __kind: 'TimeAbsolute',
    padding: Array(47).fill(0),
    time: claimEnd,
    triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
  },

  // 可选：存款限制
  minimumDepositAmount: null, // 或 { amount: sol(0.1).basisPoints }
  depositLimit: null, // 或 { limit: sol(10).basisPoints }

  // 过渡后收集的SOL去向
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
```

{% /totem %}

### 3. 添加Unlocked Bucket

Unlocked Bucket在过渡后从Presale接收SOL。

{% totem %}

```typescript
import { addUnlockedBucketV2 } from '@metaplex-foundation/genesis';
import { generateSigner } from '@metaplex-foundation/umi';

const backendSigner = generateSigner(umi);

await addUnlockedBucketV2(umi, {
  genesisAccount,
  baseMint: baseMint.publicKey,
  baseTokenAllocation: 0n,
  recipient: umi.identity.publicKey,
  claimStartCondition: {
    __kind: 'TimeAbsolute',
    padding: Array(47).fill(0),
    time: claimStart,
    triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
  },
  claimEndCondition: {
    __kind: 'TimeAbsolute',
    padding: Array(47).fill(0),
    time: claimEnd,
    triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
  },
  backendSigner: { signer: backendSigner.publicKey },
}).sendAndConfirm(umi);
```

{% /totem %}

### 4. Finalize

所有Bucket配置完成后，Finalize以激活预售。这是不可逆的。

{% totem %}

```typescript
import { finalizeV2 } from '@metaplex-foundation/genesis';

await finalizeV2(umi, {
  baseMint: baseMint.publicKey,
  genesisAccount,
}).sendAndConfirm(umi);
```

{% /totem %}

## 用户操作

### 包装SOL

用户必须在存款前将SOL包装为wSOL。

{% totem %}

```typescript
import {
  findAssociatedTokenPda,
  createTokenIfMissing,
  transferSol,
  syncNative,
} from '@metaplex-foundation/mpl-toolbox';
import { WRAPPED_SOL_MINT } from '@metaplex-foundation/genesis';
import { publicKey, sol } from '@metaplex-foundation/umi';

const userWsolAccount = findAssociatedTokenPda(umi, {
  owner: umi.identity.publicKey,
  mint: WRAPPED_SOL_MINT,
});

await createTokenIfMissing(umi, {
  mint: WRAPPED_SOL_MINT,
  owner: umi.identity.publicKey,
  token: userWsolAccount,
})
  .add(
    transferSol(umi, {
      destination: publicKey(userWsolAccount),
      amount: sol(1),
    })
  )
  .add(syncNative(umi, { account: userWsolAccount }))
  .sendAndConfirm(umi);
```

{% /totem %}

### 存款

{% totem %}

```typescript
import {
  depositPresaleV2,
  findPresaleDepositV2Pda,
  fetchPresaleDepositV2,
} from '@metaplex-foundation/genesis';
import { sol } from '@metaplex-foundation/umi';

await depositPresaleV2(umi, {
  genesisAccount,
  bucket: presaleBucket,
  baseMint: baseMint.publicKey,
  amountQuoteToken: sol(1).basisPoints,
}).sendAndConfirm(umi);

// 验证
const [depositPda] = findPresaleDepositV2Pda(umi, {
  bucket: presaleBucket,
  recipient: umi.identity.publicKey,
});
const deposit = await fetchPresaleDepositV2(umi, depositPda);
console.log('Deposited (after fee):', deposit.amountQuoteToken);
```

{% /totem %}

同一用户的多次存款会累积到单个存款账户中。

### 领取代币

存款期结束并开始领取后：

{% totem %}

```typescript
import { claimPresaleV2 } from '@metaplex-foundation/genesis';

await claimPresaleV2(umi, {
  genesisAccount,
  bucket: presaleBucket,
  baseMint: baseMint.publicKey,
  recipient: umi.identity.publicKey,
}).sendAndConfirm(umi);
```

{% /totem %}

代币分配：`userTokens = (userDeposit / allocationQuoteTokenCap) * baseTokenAllocation`

## 管理员操作

### 执行过渡

存款结束后，执行过渡将收集的SOL转移到Unlocked Bucket。

{% totem %}

```typescript
import { transitionV2, WRAPPED_SOL_MINT } from '@metaplex-foundation/genesis';
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox';
import { publicKey } from '@metaplex-foundation/umi';

const unlockedBucketQuoteTokenAccount = findAssociatedTokenPda(umi, {
  owner: unlockedBucket,
  mint: WRAPPED_SOL_MINT,
});

await transitionV2(umi, {
  genesisAccount,
  primaryBucket: presaleBucket,
  baseMint: baseMint.publicKey,
})
  .addRemainingAccounts([
    { pubkey: unlockedBucket, isSigner: false, isWritable: true },
    { pubkey: publicKey(unlockedBucketQuoteTokenAccount), isSigner: false, isWritable: true },
  ])
  .sendAndConfirm(umi);
```

{% /totem %}

**为什么这很重要：** 没有过渡，收集的SOL将保持锁定在Presale Bucket中。用户仍然可以领取代币，但团队无法访问筹集的资金。

## 参考

### 配置选项

这些选项在创建Presale Bucket时设置：

| 选项 | 描述 | 示例 |
|--------|-------------|---------|
| `minimumDepositAmount` | 每笔交易最小存款 | `{ amount: sol(0.1).basisPoints }` |
| `depositLimit` | 每用户最大总存款 | `{ limit: sol(10).basisPoints }` |
| `depositCooldown` | 存款之间的等待时间 | `{ seconds: 60n }` |
| `perCooldownDepositLimit` | 每个冷却期最大存款 | `{ amount: sol(1).basisPoints }` |
| `backendSigner` | 要求后端授权 | `{ signer: publicKey }` |

### 时间条件

四个条件控制Presale时间：

| 条件 | 用途 |
|-----------|---------|
| `depositStartCondition` | 存款开始时间 |
| `depositEndCondition` | 存款结束时间 |
| `claimStartCondition` | 领取开始时间 |
| `claimEndCondition` | 领取结束时间 |

使用Unix时间戳的`TimeAbsolute`：

{% totem %}

```typescript
import { NOT_TRIGGERED_TIMESTAMP } from '@metaplex-foundation/genesis';

const condition = {
  __kind: 'TimeAbsolute',
  padding: Array(47).fill(0),
  time: BigInt(Math.floor(Date.now() / 1000) + 3600), // 1小时后
  triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
};
```

{% /totem %}

### 结束行为

定义存款期后收集的SOL如何处理：

{% totem %}

```typescript
endBehaviors: [
  {
    __kind: 'SendQuoteTokenPercentage',
    padding: Array(4).fill(0),
    destinationBucket: publicKey(unlockedBucket),
    percentageBps: 10000, // 100% = 10000基点
    processed: false,
  },
]
```

{% /totem %}

### 获取状态

**Bucket状态：**

{% totem %}

```typescript
import { fetchPresaleBucketV2 } from '@metaplex-foundation/genesis';

const bucket = await fetchPresaleBucketV2(umi, presaleBucket);
console.log('Total deposits:', bucket.quoteTokenDepositTotal);
console.log('Deposit count:', bucket.depositCount);
console.log('Token allocation:', bucket.bucket.baseTokenAllocation);
console.log('SOL cap:', bucket.allocationQuoteTokenCap);
```

{% /totem %}

**存款状态：**

{% totem %}

```typescript
import { fetchPresaleDepositV2, safeFetchPresaleDepositV2 } from '@metaplex-foundation/genesis';

const deposit = await fetchPresaleDepositV2(umi, depositPda); // 未找到则抛出错误
const maybeDeposit = await safeFetchPresaleDepositV2(umi, depositPda); // 返回null

if (deposit) {
  console.log('Amount deposited:', deposit.amountQuoteToken);
  console.log('Amount claimed:', deposit.amountClaimed);
  console.log('Fully claimed:', deposit.claimed);
}
```

{% /totem %}

## 注意事项

- 存款需支付{% fee product="genesis" config="presale" fee="deposit" /%}协议费
- 用户必须在存款前将SOL包装为wSOL
- 同一用户的多次存款累积在一个存款账户中
- 存款结束后必须执行过渡，团队才能访问资金
- Finalize是永久性的——在调用`finalizeV2`之前请仔细检查所有配置

## 常见问题

### Presale中代币价格如何计算？
价格等于SOL上限除以代币分配量。对于100 SOL上限和1,000,000代币，价格为每代币0.0001 SOL。

### 如果没有达到SOL上限会怎样？
用户仍按存款比例获得代币。如果对100 SOL上限只存入了50 SOL，存款人将获得分配代币的50%。

### 可以设置每用户存款限额吗？
可以。使用`minimumDepositAmount`设置每笔交易的最低限额，使用`depositLimit`设置每用户的最大存款总额。

### Presale和Launch Pool有什么区别？
Presale的价格由代币分配量和SOL上限固定。Launch Pool根据总存款量自然发现价格。

### 什么时候应该使用Presale vs Launch Pool？
当您需要可预测的定价并明确知道要筹集多少时使用Presale。使用Launch Pool进行自然价格发现。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Presale** | 预定汇率的固定价格代币销售 |
| **SOL Cap** | Presale接受的最大SOL（决定价格） |
| **Token Allocation** | Presale中可用的代币数量 |
| **Deposit Limit** | 每用户允许的最大总存款 |
| **Minimum Deposit** | 每笔存款交易所需的最小金额 |
| **Cooldown** | 用户在存款之间必须等待的时间 |
| **End Behavior** | 存款期结束后的自动化操作 |
| **Transition** | 处理结束行为的指令 |

## 下一步

- [Launch Pool](/zh/smart-contracts/genesis/launch-pool) - 自然价格发现
- [Uniform Price Auction](/zh/smart-contracts/genesis/uniform-price-auction) - 基于出价的分配
- [开始使用](/zh/smart-contracts/genesis/getting-started) - Genesis基础
