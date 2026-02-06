---
title: Fetch Bucket State
metaTitle: Genesis - Fetch Bucket State | 链上 SDK | Metaplex
description: 使用Genesis JavaScript SDK从区块链获取实时桶状态。包括存款总额、计数和时间条件。
method: CHAIN
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - Genesis SDK
  - bucket state
  - on-chain fetching
  - deposit totals
  - time conditions
about:
  - On-chain data
  - Bucket state
  - SDK methods
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

使用 Genesis JavaScript SDK 直接从区块链获取实时桶状态。返回存款总额、计数、代币分配和时间条件。 {% .lead %}

{% callout type="note" %}
链上获取需要 [Umi](https://umi.typedoc.metaplex.com/) 和 [Genesis SDK](/smart-contracts/genesis/sdk/javascript)。
{% /callout %}

## 方法

| 方法 | 发行类型 | 描述 |
|--------|-------------|-------------|
| `fetchLaunchPoolBucketV2` | Launch Pool | 获取 launch pool 桶状态 |
| `fetchPresaleBucketV2` | Presale | 获取 presale 桶状态 |

## Launch Pool 桶

```typescript
import { fetchLaunchPoolBucketV2 } from '@metaplex-foundation/genesis';

const bucket = await fetchLaunchPoolBucketV2(umi, launchPoolBucket);

console.log('Total deposits:', bucket.quoteTokenDepositTotal);
console.log('Deposit count:', bucket.depositCount);
console.log('Claim count:', bucket.claimCount);
console.log('Token allocation:', bucket.bucket.baseTokenAllocation);
```

## Presale 桶

```typescript
import { fetchPresaleBucketV2 } from '@metaplex-foundation/genesis';

const bucket = await fetchPresaleBucketV2(umi, presaleBucket);

console.log('Total deposits:', bucket.quoteTokenDepositTotal);
console.log('Deposit count:', bucket.depositCount);
console.log('Token allocation:', bucket.bucket.baseTokenAllocation);
console.log('SOL cap:', bucket.allocationQuoteTokenCap);
```

## 时间条件

每个桶有四个时间条件来控制发行阶段：

| 条件 | 用途 |
|-----------|---------|
| `depositStartCondition` | 存款开始时间 |
| `depositEndCondition` | 存款结束时间 |
| `claimStartCondition` | 领取开始时间 |
| `claimEndCondition` | 领取结束时间 |

```typescript
const bucket = await fetchLaunchPoolBucketV2(umi, launchPoolBucket);

// Deposit window
const depositStart = bucket.depositStartCondition.time;
const depositEnd = bucket.depositEndCondition.time;

// Claim window
const claimStart = bucket.claimStartCondition.time;
const claimEnd = bucket.claimEndCondition.time;

console.log('Deposit starts:', new Date(Number(depositStart) * 1000));
console.log('Deposit ends:', new Date(Number(depositEnd) * 1000));
console.log('Claims start:', new Date(Number(claimStart) * 1000));
console.log('Claims end:', new Date(Number(claimEnd) * 1000));
```
