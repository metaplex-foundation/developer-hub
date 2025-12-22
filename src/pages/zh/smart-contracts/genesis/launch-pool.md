---
title: 发行池
metaTitle: Genesis - 发行池
description: 用户在窗口期间存款并按比例获得代币的代币分配机制。
---

发行池是一种专为有机价格发现设计的代币发行机制，限制了抢购或抢跑。用户在指定窗口期间存款，并在窗口关闭时根据其在总存款中的份额比例获得代币。

工作原理：

1. 特定数量的代币被分配到发行池合约。发行池在设定的时间段内保持开放。
2. 发行池开放期间，用户可以存入SOL或提取其SOL（需支付提取费用）。
3. 发行池结束时，代币根据每个用户在总存款中的份额按比例分配。

## 概述

发行池生命周期：

1. **存款期** - 用户在定义的窗口内存入SOL
2. **转换** - 结束行为执行（例如将收集的SOL发送到另一个桶）
3. **领取期** - 用户按其存款权重比例领取代币

## 费用

- **用户存款费**：存款金额的2%
- **用户提取费**：提取金额的2%
- **毕业费**：存款期结束时总存款的5%

存款费示例：用户存入10 SOL，结果是9.8 SOL计入用户的存款账户。

## 设置发行池

本指南假设您已经初始化了Genesis账户。有关初始化步骤，请参见[快速开始](/zh/smart-contracts/genesis/getting-started)。

### 1. 添加发行池桶

```typescript
import {
  addLaunchPoolBucketV2,
  findLaunchPoolBucketV2Pda,
  findUnlockedBucketV2Pda,
  NOT_TRIGGERED_TIMESTAMP,
} from '@metaplex-foundation/genesis';
import { publicKey } from '@metaplex-foundation/umi';

// 派生桶PDA
const [launchPoolBucket] = findLaunchPoolBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

// 可选：发行后接收报价代币的解锁桶
const [unlockedBucket] = findUnlockedBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

// 定义时间
const now = BigInt(Math.floor(Date.now() / 1000));
const depositStart = now;
const depositEnd = now + 86400n; // 24小时
const claimStart = depositEnd + 1n;
const claimEnd = claimStart + 604800n; // 1周领取窗口

await addLaunchPoolBucketV2(umi, {
  genesisAccount,
  baseMint: baseMint.publicKey,
  baseTokenAllocation: 1_000_000_000_000n, // 此桶的代币
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
  // 存款结束后将100%收集的SOL发送到解锁桶
  endBehaviors: [
    {
      __kind: 'SendQuoteTokenPercentage',
      padding: Array(4).fill(0),
      destinationBucket: publicKey(unlockedBucket),
      percentageBps: 10000, // 100%（以基点表示）
      processed: false,
    },
  ],
}).sendAndConfirm(umi);
```

### 2. 添加解锁桶（可选）

如果您的发行池使用`SendQuoteTokenPercentage`转发收集的SOL，您需要一个目标桶：

```typescript
import { addUnlockedBucketV2 } from '@metaplex-foundation/genesis';

await addUnlockedBucketV2(umi, {
  genesisAccount,
  baseMint: baseMint.publicKey,
  baseTokenAllocation: 0n, // 无基础代币，仅接收报价代币
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

### 3. 最终确定Genesis账户

配置所有桶后，最终确定发行配置：

```typescript
import { finalizeV2 } from '@metaplex-foundation/genesis';

await finalizeV2(umi, {
  baseMint: baseMint.publicKey,
  genesisAccount,
}).sendAndConfirm(umi);
```

## 用户操作

### 存款

用户在存款窗口期间存入wSOL。存款收取2%的费用。

```typescript
import {
  depositLaunchPoolV2,
  findLaunchPoolDepositV2Pda,
} from '@metaplex-foundation/genesis';

const depositAmount = 10_000_000_000n; // 10 SOL（以lamports为单位）

await depositLaunchPoolV2(umi, {
  genesisAccount,
  bucket: launchPoolBucket,
  baseMint: baseMint.publicKey,
  amountQuoteToken: depositAmount,
}).sendAndConfirm(umi);

// 验证存款
const [depositPda] = findLaunchPoolDepositV2Pda(umi, {
  bucket: launchPoolBucket,
  recipient: umi.identity.publicKey,
});

const deposit = await fetchLaunchPoolDepositV2(umi, depositPda);
console.log('已存入（扣除2%费用后）:', deposit.amountQuoteToken);
```

同一用户的多次存款会累积到单个存款账户中。

### 提取

用户可以在存款期间提取。提取收取2%的费用。

```typescript
import { withdrawLaunchPoolV2 } from '@metaplex-foundation/genesis';

// 部分提取
await withdrawLaunchPoolV2(umi, {
  genesisAccount,
  bucket: launchPoolBucket,
  baseMint: baseMint.publicKey,
  amountQuoteToken: 3_000_000_000n, // 3 SOL
}).sendAndConfirm(umi);
```

如果用户提取全部余额，存款PDA将被关闭。

### 领取代币

存款期结束且领取开放后，用户按其存款权重比例领取代币：

```typescript
import { claimLaunchPoolV2 } from '@metaplex-foundation/genesis';

await claimLaunchPoolV2(umi, {
  genesisAccount,
  bucket: launchPoolBucket,
  baseMint: baseMint.publicKey,
  recipient: umi.identity.publicKey,
}).sendAndConfirm(umi);
```

代币分配公式：
```
userTokens = (userDeposit / totalDeposits) * bucketTokenAllocation
```

## 执行转换

存款期结束后，执行转换以处理结束行为：

```typescript
import { transitionV2, WRAPPED_SOL_MINT } from '@metaplex-foundation/genesis';
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox';

// 获取目标桶的报价代币账户
const unlockedBucketQuoteTokenAccount = findAssociatedTokenPda(umi, {
  owner: unlockedBucket,
  mint: WRAPPED_SOL_MINT,
});

await transitionV2(umi, {
  genesisAccount,
  primaryBucket: launchPoolBucket,
  baseMint: baseMint.publicKey,
})
  .addRemainingAccounts([
    {
      pubkey: unlockedBucket,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: publicKey(unlockedBucketQuoteTokenAccount),
      isSigner: false,
      isWritable: true,
    },
  ])
  .sendAndConfirm(umi);
```

## 结束行为

结束行为定义存款期后收集的报价代币会发生什么：

### SendQuoteTokenPercentage

将一定百分比的收集SOL发送到另一个桶：

```typescript
endBehaviors: [
  {
    __kind: 'SendQuoteTokenPercentage',
    padding: Array(4).fill(0),
    destinationBucket: publicKey(unlockedBucket),
    percentageBps: 10000, // 100% = 10000 bps
    processed: false,
  },
]
```

您可以将资金分配到多个桶：

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

## 时间条件

发行池时间由四个条件控制：

| 条件 | 描述 |
|-----------|-------------|
| `depositStartCondition` | 用户何时可以开始存款 |
| `depositEndCondition` | 存款何时关闭 |
| `claimStartCondition` | 用户何时可以开始领取代币 |
| `claimEndCondition` | 领取何时关闭 |

对于特定时间戳使用`TimeAbsolute`：

```typescript
{
  __kind: 'TimeAbsolute',
  padding: Array(47).fill(0),
  time: BigInt(Math.floor(Date.now() / 1000) + 3600), // 从现在起1小时
  triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
}
```

## 获取状态

### 桶状态

```typescript
import { fetchLaunchPoolBucketV2 } from '@metaplex-foundation/genesis';

const bucket = await fetchLaunchPoolBucketV2(umi, launchPoolBucket);

console.log('总存款:', bucket.quoteTokenDepositTotal);
console.log('存款数量:', bucket.depositCount);
console.log('领取数量:', bucket.claimCount);
console.log('代币分配:', bucket.bucket.baseTokenAllocation);
```

### 存款状态

```typescript
import {
  fetchLaunchPoolDepositV2,
  safeFetchLaunchPoolDepositV2,
} from '@metaplex-foundation/genesis';

// 如果未找到则抛出异常
const deposit = await fetchLaunchPoolDepositV2(umi, depositPda);

// 如果未找到则返回null
const maybeDeposit = await safeFetchLaunchPoolDepositV2(umi, depositPda);

if (deposit) {
  console.log('金额:', deposit.amountQuoteToken);
  console.log('已领取:', deposit.claimed);
}
```

## 后续步骤

- [定价销售](/zh/smart-contracts/genesis/priced-sale) - 交易前的预存款收集
- [聚合API](/zh/smart-contracts/genesis/aggregation) - 通过API查询发行数据
- [发行池](https://github.com/metaplex-foundation/mpl-genesis/tree/main/clients/js/examples/launch-pool) - GitHub上的示例实现
