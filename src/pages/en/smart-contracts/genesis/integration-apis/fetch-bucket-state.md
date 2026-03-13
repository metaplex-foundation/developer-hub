---
title: Fetch Bucket State
metaTitle: Genesis - Fetch Bucket State | On-Chain SDK | Metaplex
description: Fetch real-time bucket state from the blockchain using the Genesis JavaScript SDK. Includes deposit totals, counts, and time conditions.
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

Fetch real-time bucket state directly from the blockchain using the Genesis JavaScript SDK. This returns deposit totals, counts, token allocation, and time conditions. {% .lead %}

{% callout type="note" %}
On-chain fetching requires [Umi](https://umi.typedoc.metaplex.com/) and the [Genesis SDK](/smart-contracts/genesis/sdk/javascript).
{% /callout %}

## Methods

| Method | Launch Type | Description |
|--------|-------------|-------------|
| `fetchLaunchPoolBucketV2` | Launch Pool | Fetch launch pool bucket state |
| `fetchPresaleBucketV2` | Presale | Fetch presale bucket state |

## Launch Pool Bucket

```typescript
import { fetchLaunchPoolBucketV2 } from '@metaplex-foundation/genesis';

const bucket = await fetchLaunchPoolBucketV2(umi, launchPoolBucket);

console.log('Total deposits:', bucket.quoteTokenDepositTotal);
console.log('Deposit count:', bucket.depositCount);
console.log('Claim count:', bucket.claimCount);
console.log('Token allocation:', bucket.bucket.baseTokenAllocation);
```

## Presale Bucket

```typescript
import { fetchPresaleBucketV2 } from '@metaplex-foundation/genesis';

const bucket = await fetchPresaleBucketV2(umi, presaleBucket);

console.log('Total deposits:', bucket.quoteTokenDepositTotal);
console.log('Deposit count:', bucket.depositCount);
console.log('Token allocation:', bucket.bucket.baseTokenAllocation);
console.log('SOL cap:', bucket.allocationQuoteTokenCap);
```

## Time Conditions

Each bucket has four time conditions that control the launch phases:

| Condition | Purpose |
|-----------|---------|
| `depositStartCondition` | When deposits open |
| `depositEndCondition` | When deposits close |
| `claimStartCondition` | When claims open |
| `claimEndCondition` | When claims close |

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
