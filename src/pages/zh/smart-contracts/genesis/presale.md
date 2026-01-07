---
title: 预售
metaTitle: Genesis - 预售
description: 固定价格代币销售，用户存入SOL并以预定汇率获得代币。
---

预售是一种代币发行机制，代币以固定的预定价格出售。与发行池的最终价格取决于总存款不同，预售让您可以预先设定每个代币的确切价格。{% .lead %}

## 工作原理

1. 您将代币分配到预售，并设置SOL上限来确定固定价格
2. 用户在存款窗口期间以固定汇率存入SOL
3. 存款期结束后，您执行转换以转移资金
4. 用户根据其存款金额领取代币

### 价格计算

代币价格由分配代币与SOL上限的比率决定：

```
价格 = allocationQuoteTokenCap / baseTokenAllocation
代币数量 = 存款 / 价格
```

例如，如果您分配1,000,000个代币，SOL上限为100：
- 价格 = 100 SOL / 1,000,000 代币 = 0.0001 SOL每代币
- 10 SOL存款获得100,000个代币

### 费用

用户存款会收取费用。详情请参见[协议费用](/protocol-fees)。

## 快速开始

{% totem %}
{% totem-accordion title="查看完整设置脚本" %}

这展示了如何设置带有开始和结束日期的预售。您还可以添加最小存款金额、最大存款金额或后端签名者。要构建面向用户的应用，请参见[用户操作](#用户操作)。

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

  // 3. 派生桶PDA
  const [presaleBucket] = findPresaleBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });
  const [unlockedBucket] = findUnlockedBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });

  // 4. 添加预售桶
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

  // 5. 添加解锁桶（转换后接收SOL）
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

  // 6. 最终确定
  await finalizeV2(umi, {
    baseMint: baseMint.publicKey,
    genesisAccount,
  }).sendAndConfirm(umi);

  console.log('预售已激活！');
  console.log('代币:', baseMint.publicKey);
  console.log('Genesis:', genesisAccount);
}

setupPresale().catch(console.error);
```

{% /totem-accordion %}
{% /totem %}

## 设置指南

### 前置条件

{% totem %}

```bash
npm install @metaplex-foundation/genesis @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-toolbox
```

{% /totem %}

### 1. 初始化Genesis账户

Genesis账户创建您的代币并协调所有分配桶。

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
`totalSupplyBaseToken`应等于所有桶分配的总和。
{% /callout %}

### 2. 添加预售桶

预售桶收集存款并分配代币。在此处配置时间和可选限制。

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
  allocationQuoteTokenCap: 100_000_000_000n, // 100 SOL上限（设定价格）

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

  // 转换后收集的SOL去向
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

### 3. 添加解锁桶

解锁桶在转换后接收来自预售的SOL。

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

### 4. 最终确定

配置完所有桶后，最终确定以激活预售。这是不可逆的。

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
console.log('已存入（扣除费用后）:', deposit.amountQuoteToken);
```

{% /totem %}

同一用户的多次存款会累积到单个存款账户中。

### 领取代币

存款期结束且领取开放后：

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

代币分配公式：`用户代币 = (用户存款 / allocationQuoteTokenCap) * baseTokenAllocation`

## 管理员操作

### 执行转换

存款关闭后，执行转换以将收集的SOL移至解锁桶。

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

**重要性：** 如果不执行转换，收集的SOL将保留在预售桶中。用户仍然可以领取代币，但团队无法访问筹集的资金。

## 参考

### 配置选项

这些选项在创建预售桶时设置：

| 选项 | 描述 | 示例 |
|--------|-------------|---------|
| `minimumDepositAmount` | 每笔交易的最低存款 | `{ amount: sol(0.1).basisPoints }` |
| `depositLimit` | 每用户最大总存款 | `{ limit: sol(10).basisPoints }` |
| `depositCooldown` | 存款间隔时间 | `{ seconds: 60n }` |
| `perCooldownDepositLimit` | 每个冷却期的最大存款 | `{ amount: sol(1).basisPoints }` |
| `backendSigner` | 要求后端授权 | `{ signer: publicKey }` |

### 时间条件

四个条件控制预售时间：

| 条件 | 用途 |
|-----------|---------|
| `depositStartCondition` | 存款开始时间 |
| `depositEndCondition` | 存款关闭时间 |
| `claimStartCondition` | 领取开始时间 |
| `claimEndCondition` | 领取关闭时间 |

使用带有Unix时间戳的`TimeAbsolute`：

{% totem %}

```typescript
import { NOT_TRIGGERED_TIMESTAMP } from '@metaplex-foundation/genesis';

const condition = {
  __kind: 'TimeAbsolute',
  padding: Array(47).fill(0),
  time: BigInt(Math.floor(Date.now() / 1000) + 3600), // 从现在起1小时
  triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
};
```

{% /totem %}

### 结束行为

定义存款期后收集的SOL会发生什么：

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

**桶状态：**

{% totem %}

```typescript
import { fetchPresaleBucketV2 } from '@metaplex-foundation/genesis';

const bucket = await fetchPresaleBucketV2(umi, presaleBucket);
console.log('总存款:', bucket.quoteTokenDepositTotal);
console.log('存款数量:', bucket.depositCount);
console.log('代币分配:', bucket.bucket.baseTokenAllocation);
console.log('SOL上限:', bucket.allocationQuoteTokenCap);
```

{% /totem %}

**存款状态：**

{% totem %}

```typescript
import { fetchPresaleDepositV2, safeFetchPresaleDepositV2 } from '@metaplex-foundation/genesis';

const deposit = await fetchPresaleDepositV2(umi, depositPda); // 未找到则抛出异常
const maybeDeposit = await safeFetchPresaleDepositV2(umi, depositPda); // 返回null

if (deposit) {
  console.log('已存入金额:', deposit.amountQuoteToken);
  console.log('已领取金额:', deposit.amountClaimed);
  console.log('完全领取:', deposit.claimed);
}
```

{% /totem %}

## 后续步骤

- [发行池](/zh/smart-contracts/genesis/launch-pool) - 具有有机价格发现的替代方案
- [聚合API](/zh/smart-contracts/genesis/aggregation) - 通过API查询发行数据
- [快速开始](/zh/smart-contracts/genesis/getting-started) - Genesis基础知识
