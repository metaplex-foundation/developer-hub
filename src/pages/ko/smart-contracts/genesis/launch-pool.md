---
title: Launch Pool
metaTitle: Genesis Launch Pool | 솔라나 공정한 출시 & 토큰 배포 | Metaplex
description: 솔라나에서의 공정한 토큰 출시 배포. 사용자가 SOL을 예치하고 SPL 토큰을 비례적으로 받습니다 — 기존 중앙화 토큰 판매의 온체인 크라우드세일 대안으로 유기적인 가격 발견을 제공합니다.
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
  - ICO alternative
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
  - 토큰으로 Genesis Account를 초기화합니다
  - 예치 기간이 설정된 Launch Pool bucket을 추가합니다
  - 수집된 자금을 받을 Unlocked bucket을 추가합니다
  - 최종화하고 사용자가 기간 동안 예치할 수 있도록 합니다
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: Launch Pool에서 토큰 가격은 어떻게 결정되나요?
    a: 가격은 총 예치금을 기반으로 유기적으로 발견됩니다. 최종 가격은 총 예치된 SOL을 할당된 토큰으로 나눈 값입니다. 예치금이 많을수록 토큰당 암묵적 가격이 높아집니다.
  - q: 사용자가 예치금을 출금할 수 있나요?
    a: 네, 사용자는 예치 기간 동안 출금할 수 있습니다. 시스템 악용을 방지하기 위해 {% fee product="genesis" config="launchPool" fee="withdraw" /%} 출금 수수료가 적용됩니다.
  - q: 여러 번 예치하면 어떻게 되나요?
    a: 같은 지갑에서의 여러 예치금은 단일 예치 계정에 누적됩니다. 총 지분은 합산된 예치금을 기준으로 합니다.
  - q: 사용자는 언제 토큰을 청구할 수 있나요?
    a: 예치 기간이 끝나고 청구 기간이 열린 후(claimStartCondition으로 정의됨)에 가능합니다. End behavior를 처리하기 위해 먼저 Transition이 실행되어야 합니다.
  - q: Launch Pool과 Presale의 차이점은 무엇인가요?
    a: Launch Pool은 비례 배분과 함께 예치금을 기반으로 유기적으로 가격을 발견합니다. Presale은 미리 정해진 고정 가격으로 상한까지 선착순 할당합니다.
---

**Launch Pool**은 솔라나에서 공정한 토큰 출시를 위한 유기적인 가격 발견을 제공합니다. 기존 중앙화 토큰 판매와는 다른 온체인 토큰 배포 메커니즘으로 — 사용자는 일정 기간 동안 SOL을 예치하고 총 예치금에서의 지분에 비례하여 SPL 토큰을 받습니다. 스나이핑 없음, 프론트러닝 없음, 모두에게 공정한 배분. {% .lead %}

{% callout title="학습 내용" %}
이 가이드에서 다루는 내용:
- Launch Pool 가격 책정 및 배분 작동 방식
- 예치 및 청구 기간 설정
- 자금 수집을 위한 End behavior 구성
- 사용자 작업: 예치, 출금, 청구
{% /callout %}

## 요약

Launch Pool은 정해진 기간 동안 예치금을 받은 후 토큰을 비례적으로 배분하는 크라우드세일 스타일의 토큰 출시 메커니즘입니다. 최종 토큰 가격은 총 예치금을 토큰 할당량으로 나누어 결정되며, 토큰 생성 이벤트(TGE)를 위한 투명한 온체인 가격 발견을 가능하게 합니다.

- 사용자는 예치 기간 동안 SOL을 예치합니다 ({% fee product="genesis" config="launchPool" fee="deposit" /%} 수수료 적용)
- 예치 기간 동안 출금 가능 ({% fee product="genesis" config="launchPool" fee="withdraw" /%} 수수료)
- 토큰 배분은 예치 지분에 비례
- End behavior가 수집된 SOL을 Treasury bucket으로 라우팅

## 범위 외

고정 가격 판매는 [Presale](/ko/smart-contracts/genesis/presale)을, 입찰 기반 경매는 [Uniform Price Auction](/ko/smart-contracts/genesis/uniform-price-auction)을, 유동성 풀 생성은 Raydium/Orca를 참조하세요.

## 빠른 시작

{% totem %}
{% totem-accordion title="전체 설정 스크립트 보기" %}

Launch Pool을 예치 및 청구 기간과 함께 설정하는 방법을 보여줍니다. 사용자용 앱을 구축하려면 [사용자 작업](#사용자-작업)을 참조하세요.

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

## 작동 방식

1. 특정 수량의 토큰이 Launch Pool bucket에 할당됩니다
2. 사용자는 예치 기간 동안 SOL을 예치합니다 (수수료와 함께 출금 가능)
3. 기간이 종료되면 예치 지분에 따라 토큰이 비례적으로 배분됩니다

### 가격 발견

토큰 가격은 총 예치금에서 도출됩니다:

```
tokenPrice = totalDeposits / tokenAllocation
userTokens = (userDeposit / totalDeposits) * tokenAllocation
```

**예시:** 1,000,000 토큰 할당, 총 100 SOL 예치 = 토큰당 0.0001 SOL

### 라이프사이클

1. **예치 기간** - 사용자가 정해진 기간 동안 SOL을 예치
2. **Transition** - End behavior 실행 (예: 수집된 SOL을 다른 bucket으로 전송)
3. **청구 기간** - 사용자가 예치 비중에 비례한 토큰을 청구

## 수수료

{% protocol-fees program="genesis" config="launchPool" showTitle=false /%}

예치 수수료 예시: 사용자가 10 SOL을 예치하면 9.8 SOL이 사용자의 예치 계정에 적립됩니다.

## 설정 가이드

### 사전 요구 사항

{% totem %}

```bash
npm install @metaplex-foundation/genesis @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-toolbox
```

{% /totem %}

### 1. Genesis Account 초기화

Genesis Account는 토큰을 생성하고 모든 배포 bucket을 조정합니다.

{% code-tabs-imported from="genesis/initialize_v2" frameworks="umi" filename="initializeV2" /%}

{% callout type="note" %}
`totalSupplyBaseToken`은 모든 bucket 할당량의 합과 같아야 합니다.
{% /callout %}

### 2. Launch Pool Bucket 추가

Launch Pool bucket은 예치금을 수집하고 토큰을 비례적으로 배분합니다. 여기서 타이밍을 구성합니다.

{% code-tabs-imported from="genesis/add_launch_pool_bucket_v2" frameworks="umi" filename="addLaunchPoolBucket" /%}

### 3. Unlocked Bucket 추가

Unlocked bucket은 Transition 후 Launch Pool에서 SOL을 받습니다.

{% code-tabs-imported from="genesis/add_unlocked_bucket_v2" frameworks="umi" filename="addUnlockedBucket" /%}

### 4. 최종화

모든 bucket이 구성되면 최종화하여 출시를 활성화합니다. 이 작업은 되돌릴 수 없습니다.

{% code-tabs-imported from="genesis/finalize_v2" frameworks="umi" filename="finalize" /%}

## 사용자 작업

### SOL 래핑

사용자는 예치하기 전에 SOL을 wSOL로 래핑해야 합니다.

{% code-tabs-imported from="genesis/wrap_sol" frameworks="umi" filename="wrapSol" /%}

### 예치

{% code-tabs-imported from="genesis/deposit_launch_pool_v2" frameworks="umi" filename="depositLaunchPool" /%}

같은 사용자의 여러 예치금은 단일 예치 계정에 누적됩니다.

### 출금

사용자는 예치 기간 동안 출금할 수 있습니다. {% fee product="genesis" config="launchPool" fee="withdraw" /%} 수수료가 적용됩니다.

{% code-tabs-imported from="genesis/withdraw_launch_pool_v2" frameworks="umi" filename="withdrawLaunchPool" /%}

사용자가 전체 잔액을 출금하면 예치 PDA가 닫힙니다.

### 토큰 청구

예치 기간이 종료되고 청구가 열린 후:

{% code-tabs-imported from="genesis/claim_launch_pool_v2" frameworks="umi" filename="claimLaunchPool" /%}

토큰 할당: `userTokens = (userDeposit / totalDeposits) * bucketTokenAllocation`

## 관리자 작업

### Transition 실행

예치가 종료된 후 Transition을 실행하여 수집된 SOL을 Unlocked bucket으로 이동합니다.

{% code-tabs-imported from="genesis/transition_launch_pool_v2" frameworks="umi" filename="transitionLaunchPool" /%}

**이것이 중요한 이유:** Transition 없이는 수집된 SOL이 Launch Pool bucket에 잠겨 있습니다. 사용자는 여전히 토큰을 청구할 수 있지만, 팀은 모금된 자금에 접근할 수 없습니다.

## 레퍼런스

### 시간 조건

네 가지 조건이 Launch Pool 타이밍을 제어합니다:

| 조건 | 목적 |
|-----------|---------|
| `depositStartCondition` | 예치 시작 시점 |
| `depositEndCondition` | 예치 종료 시점 |
| `claimStartCondition` | 청구 시작 시점 |
| `claimEndCondition` | 청구 종료 시점 |

Unix 타임스탬프와 함께 `TimeAbsolute`을 사용합니다:

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

### End Behavior

예치 기간 후 수집된 SOL에 어떤 일이 발생하는지 정의합니다:

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

여러 bucket에 자금을 분할할 수 있습니다:

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

### 상태 조회

**Bucket 상태:**

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

**예치 상태:**

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

## 참고 사항

- {% fee product="genesis" config="launchPool" fee="deposit" /%} 프로토콜 수수료가 예치와 출금 모두에 적용됩니다
- 같은 사용자의 여러 예치금은 하나의 예치 계정에 누적됩니다
- 사용자가 전체 잔액을 출금하면 예치 PDA가 닫힙니다
- End behavior를 처리하려면 예치 종료 후 Transition이 실행되어야 합니다
- 사용자는 예치하려면 wSOL (래핑된 SOL)이 있어야 합니다

## FAQ

### Launch Pool에서 토큰 가격은 어떻게 결정되나요?
가격은 총 예치금을 기반으로 유기적으로 발견됩니다. 최종 가격은 총 예치된 SOL을 할당된 토큰으로 나눈 값입니다. 예치금이 많을수록 토큰당 암묵적 가격이 높아집니다.

### 사용자가 예치금을 출금할 수 있나요?
네, 사용자는 예치 기간 동안 출금할 수 있습니다. 시스템 악용을 방지하기 위해 {% fee product="genesis" config="launchPool" fee="withdraw" /%} 출금 수수료가 적용됩니다.

### 여러 번 예치하면 어떻게 되나요?
같은 지갑에서의 여러 예치금은 단일 예치 계정에 누적됩니다. 총 지분은 합산된 예치금을 기준으로 합니다.

### 사용자는 언제 토큰을 청구할 수 있나요?
예치 기간이 끝나고 청구 기간이 열린 후(`claimStartCondition`으로 정의됨)에 가능합니다. End behavior를 처리하기 위해 먼저 Transition이 실행되어야 합니다.

### Launch Pool과 Presale의 차이점은 무엇인가요?
Launch Pool은 비례 배분과 함께 예치금을 기반으로 유기적으로 가격을 발견합니다. Presale은 미리 정해진 고정 가격으로 상한까지 선착순 할당합니다.

## 용어집

| 용어 | 정의 |
|------|------------|
| **Launch Pool** | 종료 시 가격이 발견되는 예치 기반 배포 |
| **Deposit Window** | 사용자가 SOL을 예치하고 출금할 수 있는 기간 |
| **Claim Window** | 사용자가 비례 토큰을 청구할 수 있는 기간 |
| **End Behavior** | 예치 기간 종료 후 실행되는 자동 작업 |
| **Transition** | End behavior를 처리하고 자금을 라우팅하는 명령어 |
| **Proportional Distribution** | 총 예치금에서의 사용자 지분에 따른 토큰 할당 |
| **Quote Token** | 사용자가 예치하는 토큰 (일반적으로 wSOL) |
| **Base Token** | 배포되는 토큰 |

## 다음 단계

- [Presale](/ko/smart-contracts/genesis/presale) - 고정 가격 토큰 판매
- [Uniform Price Auction](/ko/smart-contracts/genesis/uniform-price-auction) - 입찰 기반 토큰 오퍼링
- [토큰 출시하기](/ko/tokens/launch-token) - 엔드투엔드 토큰 출시 가이드
- [Aggregation API](/ko/smart-contracts/genesis/aggregation) - API를 통한 토큰 세일 데이터 조회
