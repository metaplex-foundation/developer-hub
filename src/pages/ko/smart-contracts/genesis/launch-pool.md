---
title: Launch Pool
metaTitle: Genesis - Launch Pool
description: 사용자가 기간 동안 예치하고 비례적으로 토큰을 받는 토큰 배포 방식입니다.
---

Launch Pool은 자연스러운 가격 발견과 제한된 스나이핑 또는 프론트러닝을 위해 설계된 토큰 런칭 메커니즘입니다. 사용자는 지정된 기간 동안 예치하고, 기간이 종료되면 총 예치금에서 자신의 비율에 비례하여 토큰을 받습니다.

작동 방식:

1. 특정 수량의 토큰이 Launch Pool 컨트랙트에 할당됩니다. Launch Pool은 정해진 기간 동안 열려 있습니다.
2. Launch Pool이 열려 있는 동안 사용자는 SOL을 예치하거나 출금할 수 있습니다 (출금 수수료 적용).
3. Launch Pool이 종료되면 각 사용자의 총 예치금 대비 비율에 따라 토큰이 배포됩니다.

## 개요

Launch Pool 생명주기:

1. **예치 기간** - 사용자가 정해진 기간 동안 SOL 예치
2. **전환** - 종료 동작 실행 (예: 수집된 SOL을 다른 버킷으로 전송)
3. **청구 기간** - 사용자가 예치 비중에 비례하여 토큰 청구

## 수수료

{% protocol-fees program="genesis" config="launchPool" showTitle=false /%}

예치 수수료 예시: 10 SOL 예치 시 9.8 SOL이 사용자의 예치 계정에 적립됩니다.

## Launch Pool 설정

이 가이드는 이미 Genesis 계정을 초기화했다고 가정합니다. 초기화 단계는 [시작하기](/ko/smart-contracts/genesis/getting-started)를 참조하세요.

### 1. Launch Pool 버킷 추가

```typescript
import {
  addLaunchPoolBucketV2,
  findLaunchPoolBucketV2Pda,
  findUnlockedBucketV2Pda,
  NOT_TRIGGERED_TIMESTAMP,
} from '@metaplex-foundation/genesis';
import { publicKey } from '@metaplex-foundation/umi';

// 버킷 PDA 유도
const [launchPoolBucket] = findLaunchPoolBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

// 선택사항: 런칭 후 기준 토큰을 받을 잠금 해제 버킷
const [unlockedBucket] = findUnlockedBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

// 타이밍 정의
const now = BigInt(Math.floor(Date.now() / 1000));
const depositStart = now;
const depositEnd = now + 86400n; // 24시간
const claimStart = depositEnd + 1n;
const claimEnd = claimStart + 604800n; // 1주일 청구 기간

// 기본 스케줄 (페널티/보너스 없음)
const defaultSchedule = {
  slopeBps: 0n,
  interceptBps: 0n,
  maxBps: 0n,
  startTime: 0n,
  endTime: 0n,
};

await addLaunchPoolBucketV2(umi, {
  genesisAccount,
  baseMint: baseMint.publicKey,
  baseTokenAllocation: 1_000_000_000_000n, // 이 버킷용 토큰
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
  depositPenalty: defaultSchedule,
  withdrawPenalty: defaultSchedule,
  bonusSchedule: defaultSchedule,
  minimumDepositAmount: null,
  // 예치 종료 후 수집된 SOL의 100%를 잠금 해제 버킷으로 전송
  endBehaviors: [
    {
      __kind: 'SendQuoteTokenPercentage',
      padding: Array(4).fill(0),
      destinationBucket: publicKey(unlockedBucket),
      percentageBps: 10000, // 베이시스 포인트로 100%
      processed: false,
    },
  ],
}).sendAndConfirm(umi);
```

### 2. 잠금 해제 버킷 추가 (선택사항)

Launch Pool이 `SendQuoteTokenPercentage`를 사용하여 수집된 SOL을 전달하는 경우 목적지 버킷이 필요합니다:

```typescript
import { addUnlockedBucketV2 } from '@metaplex-foundation/genesis';

await addUnlockedBucketV2(umi, {
  genesisAccount,
  baseMint: baseMint.publicKey,
  baseTokenAllocation: 0n, // 기본 토큰 없음, 기준 토큰만 수령
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

### 3. Genesis 계정 확정

모든 버킷이 구성되면 런칭 구성을 확정합니다:

```typescript
import { finalizeV2 } from '@metaplex-foundation/genesis';

await finalizeV2(umi, {
  baseMint: baseMint.publicKey,
  genesisAccount,
}).sendAndConfirm(umi);
```

## 사용자 작업

### 예치

사용자는 예치 기간 동안 wSOL을 예치합니다. 예치에는 2% 수수료가 적용됩니다.

```typescript
import {
  depositLaunchPoolV2,
  findLaunchPoolDepositV2Pda,
} from '@metaplex-foundation/genesis';

const depositAmount = 10_000_000_000n; // 램포트 단위로 10 SOL

await depositLaunchPoolV2(umi, {
  genesisAccount,
  bucket: launchPoolBucket,
  baseMint: baseMint.publicKey,
  amountQuoteToken: depositAmount,
}).sendAndConfirm(umi);

// 예치 확인
const [depositPda] = findLaunchPoolDepositV2Pda(umi, {
  bucket: launchPoolBucket,
  recipient: umi.identity.publicKey,
});

const deposit = await fetchLaunchPoolDepositV2(umi, depositPda);
console.log('예치됨 (2% 수수료 후):', deposit.amountQuoteToken);
```

동일 사용자의 여러 예치는 단일 예치 계정에 누적됩니다.

### 출금

사용자는 예치 기간 동안 출금할 수 있습니다. 출금에는 2% 수수료가 적용됩니다.

```typescript
import { withdrawLaunchPoolV2 } from '@metaplex-foundation/genesis';

// 부분 출금
await withdrawLaunchPoolV2(umi, {
  genesisAccount,
  bucket: launchPoolBucket,
  baseMint: baseMint.publicKey,
  amountQuoteToken: 3_000_000_000n, // 3 SOL
}).sendAndConfirm(umi);
```

사용자가 전체 잔액을 출금하면 예치 PDA가 닫힙니다.

### 토큰 청구

예치 기간이 종료되고 청구가 시작되면 사용자는 예치 비중에 비례하여 토큰을 청구합니다:

```typescript
import { claimLaunchPoolV2 } from '@metaplex-foundation/genesis';

await claimLaunchPoolV2(umi, {
  genesisAccount,
  bucket: launchPoolBucket,
  baseMint: baseMint.publicKey,
  recipient: umi.identity.publicKey,
}).sendAndConfirm(umi);
```

토큰 할당 공식:
```
userTokens = (userDeposit / totalDeposits) * bucketTokenAllocation
```

## 전환 실행

예치 기간 종료 후 전환을 실행하여 종료 동작을 처리합니다:

```typescript
import { transitionV2, WRAPPED_SOL_MINT } from '@metaplex-foundation/genesis';
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox';

// 목적지 버킷의 기준 토큰 계정 가져오기
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

## 종료 동작

종료 동작은 예치 기간 후 수집된 기준 토큰에 어떤 일이 일어나는지 정의합니다:

### SendQuoteTokenPercentage

수집된 SOL의 일정 비율을 다른 버킷으로 전송:

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

여러 버킷으로 자금을 분할할 수 있습니다:

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

## 시간 조건

Launch Pool 타이밍은 4가지 조건으로 제어됩니다:

| 조건 | 설명 |
|-----------|-------------|
| `depositStartCondition` | 사용자가 예치를 시작할 수 있는 시점 |
| `depositEndCondition` | 예치가 종료되는 시점 |
| `claimStartCondition` | 사용자가 토큰 청구를 시작할 수 있는 시점 |
| `claimEndCondition` | 청구가 종료되는 시점 |

특정 타임스탬프에 `TimeAbsolute` 사용:

```typescript
{
  __kind: 'TimeAbsolute',
  padding: Array(47).fill(0),
  time: BigInt(Math.floor(Date.now() / 1000) + 3600), // 지금부터 1시간 후
  triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
}
```

## 상태 조회

### 버킷 상태

```typescript
import { fetchLaunchPoolBucketV2 } from '@metaplex-foundation/genesis';

const bucket = await fetchLaunchPoolBucketV2(umi, launchPoolBucket);

console.log('총 예치금:', bucket.quoteTokenDepositTotal);
console.log('예치 횟수:', bucket.depositCount);
console.log('청구 횟수:', bucket.claimCount);
console.log('토큰 할당량:', bucket.bucket.baseTokenAllocation);
```

### 예치 상태

```typescript
import {
  fetchLaunchPoolDepositV2,
  safeFetchLaunchPoolDepositV2,
} from '@metaplex-foundation/genesis';

// 찾지 못하면 에러 발생
const deposit = await fetchLaunchPoolDepositV2(umi, depositPda);

// 찾지 못하면 null 반환
const maybeDeposit = await safeFetchLaunchPoolDepositV2(umi, depositPda);

if (deposit) {
  console.log('금액:', deposit.amountQuoteToken);
  console.log('청구됨:', deposit.claimed);
}
```

## 다음 단계

- [Presale](/ko/smart-contracts/genesis/presale) - 고정 가격 토큰 판매
- [어그리게이션 API](/ko/smart-contracts/genesis/aggregation) - API를 통한 런칭 데이터 조회
- [Launch Pool](https://github.com/metaplex-foundation/genesis/tree/main/clients/js/examples/launch-pool) - GitHub의 예제 구현
