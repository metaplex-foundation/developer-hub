---
title: Fetch Bucket State
metaTitle: Genesis - Fetch Bucket State | オンチェーン SDK | Metaplex
description: Genesis JavaScript SDKを使用してブロックチェーンからリアルタイムのバケット状態を取得します。デポジット合計、カウント、時間条件を含みます。
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

Genesis JavaScript SDK を使用してブロックチェーンからリアルタイムのバケット状態を直接取得します。デポジット合計、カウント、トークン割り当て、時間条件を返します。 {% .lead %}

{% callout type="note" %}
オンチェーンフェッチには [Umi](https://umi.typedoc.metaplex.com/) と [Genesis SDK](/smart-contracts/genesis/sdk/javascript) が必要です。
{% /callout %}

## メソッド

| メソッド | ローンチタイプ | 説明 |
|--------|-------------|-------------|
| `fetchLaunchPoolBucketV2` | Launch Pool | Launch Pool バケット状態を取得 |
| `fetchPresaleBucketV2` | Presale | Presale バケット状態を取得 |

## Launch Pool バケット

```typescript
import { fetchLaunchPoolBucketV2 } from '@metaplex-foundation/genesis';

const bucket = await fetchLaunchPoolBucketV2(umi, launchPoolBucket);

console.log('Total deposits:', bucket.quoteTokenDepositTotal);
console.log('Deposit count:', bucket.depositCount);
console.log('Claim count:', bucket.claimCount);
console.log('Token allocation:', bucket.bucket.baseTokenAllocation);
```

## Presale バケット

```typescript
import { fetchPresaleBucketV2 } from '@metaplex-foundation/genesis';

const bucket = await fetchPresaleBucketV2(umi, presaleBucket);

console.log('Total deposits:', bucket.quoteTokenDepositTotal);
console.log('Deposit count:', bucket.depositCount);
console.log('Token allocation:', bucket.bucket.baseTokenAllocation);
console.log('SOL cap:', bucket.allocationQuoteTokenCap);
```

## 時間条件

各バケットにはローンチフェーズを制御する4つの時間条件があります：

| 条件 | 目的 |
|-----------|---------|
| `depositStartCondition` | デポジット受付開始時刻 |
| `depositEndCondition` | デポジット受付終了時刻 |
| `claimStartCondition` | クレーム受付開始時刻 |
| `claimEndCondition` | クレーム受付終了時刻 |

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
