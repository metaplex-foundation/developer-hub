---
title: Fetch Bucket State
metaTitle: Genesis - Fetch Bucket State | 온체인 SDK | Metaplex
description: Genesis JavaScript SDK를 사용하여 블록체인에서 실시간 버킷 상태를 조회합니다. 예치 총액, 수량, 시간 조건을 포함합니다.
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

Genesis JavaScript SDK를 사용하여 블록체인에서 직접 실시간 버킷 상태를 조회합니다. 예치 총액, 수량, 토큰 할당량, 시간 조건을 반환합니다. {% .lead %}

{% callout type="note" %}
온체인 조회에는 [Umi](https://umi.typedoc.metaplex.com/)와 [Genesis SDK](/smart-contracts/genesis/sdk/javascript)가 필요합니다.
{% /callout %}

## 메서드

| 메서드 | 런치 유형 | 설명 |
|--------|-------------|-------------|
| `fetchLaunchPoolBucketV2` | Launch Pool | Launch Pool 버킷 상태 조회 |
| `fetchPresaleBucketV2` | Presale | Presale 버킷 상태 조회 |

## Launch Pool 버킷

```typescript
import { fetchLaunchPoolBucketV2 } from '@metaplex-foundation/genesis';

const bucket = await fetchLaunchPoolBucketV2(umi, launchPoolBucket);

console.log('Total deposits:', bucket.quoteTokenDepositTotal);
console.log('Deposit count:', bucket.depositCount);
console.log('Claim count:', bucket.claimCount);
console.log('Token allocation:', bucket.bucket.baseTokenAllocation);
```

## Presale 버킷

```typescript
import { fetchPresaleBucketV2 } from '@metaplex-foundation/genesis';

const bucket = await fetchPresaleBucketV2(umi, presaleBucket);

console.log('Total deposits:', bucket.quoteTokenDepositTotal);
console.log('Deposit count:', bucket.depositCount);
console.log('Token allocation:', bucket.bucket.baseTokenAllocation);
console.log('SOL cap:', bucket.allocationQuoteTokenCap);
```

## 시간 조건

각 버킷에는 런칭 단계를 제어하는 네 가지 시간 조건이 있습니다:

| 조건 | 목적 |
|-----------|---------|
| `depositStartCondition` | 예치 시작 시점 |
| `depositEndCondition` | 예치 종료 시점 |
| `claimStartCondition` | 클레임 시작 시점 |
| `claimEndCondition` | 클레임 종료 시점 |

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
