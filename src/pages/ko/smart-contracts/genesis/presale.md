---
title: Presale
metaTitle: Genesis Presale | 솔라나 ICO & 고정가 토큰 판매 | Metaplex
description: 솔라나에서 토큰 프리세일 또는 ICO를 실행하세요. 사용자가 SOL을 예치하고 미리 정해진 비율로 SPL 토큰을 받는 고정가 토큰 판매. Genesis 런치패드를 통한 온체인 토큰 오퍼링.
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - presale
  - token presale
  - crypto presale
  - fixed price sale
  - ICO
  - ICO on Solana
  - token sale
  - token offering
  - initial coin offering
  - SPL token sale
  - fixed pricing
  - token launchpad
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
  - q: Presale에서 토큰 가격은 어떻게 계산되나요?
    a: 가격은 SOL 상한을 토큰 할당량으로 나눈 값입니다. 100 SOL 상한에 1,000,000 토큰의 경우, 가격은 토큰당 0.0001 SOL입니다.
  - q: SOL 상한에 도달하지 못하면 어떻게 되나요?
    a: 사용자는 예치금에 비례하여 토큰을 받습니다. 100 SOL 상한에 대해 50 SOL만 예치되면, 예치자는 할당된 토큰의 50%를 받습니다.
  - q: 사용자별 예치 한도를 설정할 수 있나요?
    a: 네. 거래당 최소 한도에는 minimumDepositAmount를, 사용자당 최대 총 예치금에는 depositLimit을 사용합니다.
  - q: Presale과 Launch Pool의 차이점은 무엇인가요?
    a: Presale은 토큰 할당량과 SOL 상한에 의해 결정되는 고정 가격입니다. Launch Pool은 총 예치금을 기반으로 자연스럽게 가격이 결정됩니다.
  - q: Presale과 Launch Pool은 언제 사용해야 하나요?
    a: 예측 가능한 가격 책정이 필요하고 모금 목표가 명확할 때 Presale을 사용합니다. 자연스러운 가격 발견에는 Launch Pool을 사용합니다.
---

**Presale**은 솔라나에서 고정가 토큰 배포를 제공합니다 — 기존 ICO 또는 초기 코인 공개의 온체인 등가물입니다. 할당량과 SOL 상한을 기반으로 SPL 토큰 가격을 미리 설정합니다. 사용자는 받을 수량을 정확히 알고, 여러분은 모금액을 정확히 파악할 수 있습니다. {% .lead %}

{% callout title="학습 내용" %}
이 가이드에서 다루는 내용:
- Presale 가격 책정 방식 (할당량 + 상한 = 가격)
- 예치 기간과 청구 기간 설정
- 예치 한도와 쿨다운 설정
- 사용자 작업: SOL 래핑, 예치, 청구
{% /callout %}

## 요약

Presale은 기존 ICO나 토큰 오퍼링과 유사하게 미리 정해진 가격으로 토큰을 판매합니다. 가격은 설정한 토큰 할당량과 SOL 상한에서 계산되며, 알려진 밸류에이션으로 암호화폐 자금 조달에 이상적입니다.

- 고정 가격 = SOL 상한 / 토큰 할당량
- 사용자는 예치 기간 동안 SOL을 예치합니다 ({% fee product="genesis" config="presale" fee="deposit" /%} 수수료 적용)
- SOL 상한까지 선착순
- 옵션: 최소/최대 예치 한도, 쿨다운, 백엔드 인증

## 범위 외

자연스러운 가격 발견([Launch Pool](/ko/smart-contracts/genesis/launch-pool) 참조), 입찰 기반 경매([Uniform Price Auction](/ko/smart-contracts/genesis/uniform-price-auction) 참조), 베스팅 스케줄.

## 작동 방식

1. SOL 상한을 설정하여 고정 가격을 결정하고, 토큰을 Presale에 할당합니다
2. 사용자는 예치 기간 동안 고정 비율로 SOL을 예치합니다
3. 예치 기간 종료 후, 트랜지션을 실행하여 자금을 이동합니다
4. 사용자는 예치금에 따라 토큰을 청구합니다

### 가격 계산

토큰 가격은 할당 토큰과 SOL 상한의 비율로 결정됩니다:

```
price = allocationQuoteTokenCap / baseTokenAllocation
tokens = deposit / price
```

예를 들어, 100 SOL 상한으로 1,000,000 토큰을 할당한 경우:
- 가격 = 100 SOL / 1,000,000 토큰 = 토큰당 0.0001 SOL
- 10 SOL 예치로 100,000 토큰을 받습니다

### 수수료

{% protocol-fees program="genesis" config="presale" showTitle=false /%}

## 빠른 시작

{% totem %}
{% totem-accordion title="전체 설정 스크립트 보기" %}

이것은 시작 및 종료 날짜가 있는 Presale 설정 방법을 보여줍니다. 최소 예치 금액, 최대 예치 금액 또는 백엔드 서명자를 추가할 수도 있습니다. 사용자 대상 앱을 빌드하려면 [사용자 작업](#사용자-작업)을 참조하세요.

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
} from '@metaplex-foundation/genesis';
import { generateSigner, publicKey, sol } from '@metaplex-foundation/umi';

async function setupPresale() {
  const umi = createUmi('https://api.mainnet-beta.solana.com')
    .use(mplToolbox())
    .use(genesis());

  // umi.use(keypairIdentity(yourKeypair));

  const baseMint = generateSigner(umi);
  const TOTAL_SUPPLY = 1_000_000_000_000_000n; // 100만 토큰 (소수점 9자리)

  // 1. 초기화
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

  // 2. 타이밍 정의
  const now = BigInt(Math.floor(Date.now() / 1000));
  const depositStart = now + 60n;
  const depositEnd = now + 86400n;
  const claimStart = depositEnd + 1n;
  const claimEnd = claimStart + 604800n;

  // 3. Bucket PDA 도출
  const [presaleBucket] = findPresaleBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });
  const [unlockedBucket] = findUnlockedBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });

  // 4. Presale Bucket 추가
  await addPresaleBucketV2(umi, {
    genesisAccount,
    baseMint: baseMint.publicKey,
    baseTokenAllocation: TOTAL_SUPPLY,
    allocationQuoteTokenCap: sol(100).basisPoints, // 100 SOL 상한
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
        percentageBps: 10000,
        processed: false,
      },
    ],
  }).sendAndConfirm(umi);

  // 5. Unlocked Bucket 추가 (트랜지션 후 SOL 수령)
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

  console.log('Presale active!');
  console.log('Token:', baseMint.publicKey);
  console.log('Genesis:', genesisAccount);
}

setupPresale().catch(console.error);
```

{% /totem-accordion %}
{% /totem %}

## 설정 가이드

### 사전 요구 사항

{% totem %}

```bash
npm install @metaplex-foundation/genesis @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-toolbox
```

{% /totem %}

### 1. Genesis Account 초기화

Genesis Account는 토큰을 생성하고 모든 배포 Bucket을 조정합니다.

{% code-tabs-imported from="genesis/initialize_v2" frameworks="umi" filename="initializeV2" /%}

{% callout type="note" %}
`totalSupplyBaseToken`은 모든 Bucket 할당량의 합계와 같아야 합니다.
{% /callout %}

### 2. Presale Bucket 추가

Presale Bucket은 예치금을 수집하고 토큰을 배포합니다. 여기서 타이밍과 선택적 제한을 설정합니다.

{% code-tabs-imported from="genesis/add_presale_bucket_v2" frameworks="umi" filename="addPresaleBucket" /%}

### 3. Unlocked Bucket 추가

Unlocked Bucket은 트랜지션 후 Presale에서 SOL을 받습니다.

{% code-tabs-imported from="genesis/add_unlocked_bucket_v2" frameworks="umi" filename="addUnlockedBucket" /%}

### 4. Finalize

모든 Bucket이 설정되면 Finalize하여 Presale을 활성화합니다. 이는 되돌릴 수 없습니다.

{% code-tabs-imported from="genesis/finalize_v2" frameworks="umi" filename="finalize" /%}

## 사용자 작업

### SOL 래핑

사용자는 예치 전에 SOL을 wSOL로 래핑해야 합니다.

{% code-tabs-imported from="genesis/wrap_sol" frameworks="umi" filename="wrapSol" /%}

### 예치

{% code-tabs-imported from="genesis/deposit_presale_v2" frameworks="umi" filename="depositPresale" /%}

동일한 사용자의 여러 예치는 단일 예치 계정에 누적됩니다.

### 토큰 청구

예치 기간 종료 후 청구가 시작되면:

{% code-tabs-imported from="genesis/claim_presale_v2" frameworks="umi" filename="claimPresale" /%}

토큰 할당: `userTokens = (userDeposit / allocationQuoteTokenCap) * baseTokenAllocation`

## 관리자 작업

### 트랜지션 실행

예치 종료 후, 트랜지션을 실행하여 수집된 SOL을 Unlocked Bucket으로 이동합니다.

{% code-tabs-imported from="genesis/transition_presale_v2" frameworks="umi" filename="transitionPresale" /%}

**이것이 중요한 이유:** 트랜지션이 없으면 수집된 SOL은 Presale Bucket에 잠긴 상태로 유지됩니다. 사용자는 토큰을 청구할 수 있지만 팀은 모금한 자금에 접근할 수 없습니다.

## 참조

### 설정 옵션

이 옵션들은 Presale Bucket 생성 시 설정됩니다:

| 옵션 | 설명 | 예시 |
|--------|-------------|---------|
| `minimumDepositAmount` | 거래당 최소 예치 | `{ amount: sol(0.1).basisPoints }` |
| `depositLimit` | 사용자당 최대 총 예치 | `{ limit: sol(10).basisPoints }` |
| `depositCooldown` | 예치 간 대기 시간 | `{ seconds: 60n }` |
| `perCooldownDepositLimit` | 쿨다운 기간당 최대 예치 | `{ amount: sol(1).basisPoints }` |

### 시간 조건

4가지 조건이 Presale 타이밍을 제어합니다:

| 조건 | 목적 |
|-----------|---------|
| `depositStartCondition` | 예치 시작 시점 |
| `depositEndCondition` | 예치 종료 시점 |
| `claimStartCondition` | 청구 시작 시점 |
| `claimEndCondition` | 청구 종료 시점 |

Unix 타임스탬프와 함께 `TimeAbsolute`를 사용합니다:

{% totem %}

```typescript
const condition = {
  __kind: 'TimeAbsolute',
  padding: Array(47).fill(0),
  time: BigInt(Math.floor(Date.now() / 1000) + 3600), // 1시간 후
  triggeredTimestamp: null,
};
```

{% /totem %}

### 종료 동작

예치 기간 후 수집된 SOL의 처리를 정의합니다:

{% totem %}

```typescript
endBehaviors: [
  {
    __kind: 'SendQuoteTokenPercentage',
    padding: Array(4).fill(0),
    destinationBucket: publicKey(unlockedBucket),
    percentageBps: 10000, // 100% = 10000 베이시스 포인트
    processed: false,
  },
]
```

{% /totem %}

### 상태 조회

**Bucket 상태:**

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

**예치 상태:**

{% totem %}

```typescript
import { fetchPresaleDepositV2, safeFetchPresaleDepositV2 } from '@metaplex-foundation/genesis';

const deposit = await fetchPresaleDepositV2(umi, depositPda); // 찾을 수 없으면 에러 발생
const maybeDeposit = await safeFetchPresaleDepositV2(umi, depositPda); // null 반환

if (deposit) {
  console.log('Amount deposited:', deposit.amountQuoteToken);
  console.log('Amount claimed:', deposit.amountClaimed);
  console.log('Fully claimed:', deposit.claimed);
}
```

{% /totem %}

## 참고 사항

- 예치에는 {% fee product="genesis" config="presale" fee="deposit" /%} 프로토콜 수수료가 적용됩니다
- 사용자는 예치 전에 SOL을 wSOL로 래핑해야 합니다
- 동일한 사용자의 여러 예치는 하나의 예치 계정에 누적됩니다
- 팀이 자금에 접근하려면 예치 종료 후 트랜지션을 실행해야 합니다
- Finalize는 영구적입니다—`finalizeV2`를 호출하기 전에 모든 설정을 다시 확인하세요

## FAQ

### Presale에서 토큰 가격은 어떻게 계산되나요?
가격은 SOL 상한을 토큰 할당량으로 나눈 값입니다. 100 SOL 상한에 1,000,000 토큰의 경우, 가격은 토큰당 0.0001 SOL입니다.

### SOL 상한에 도달하지 못하면 어떻게 되나요?
사용자는 예치금에 비례하여 토큰을 받습니다. 100 SOL 상한에 대해 50 SOL만 예치되면, 예치자는 할당된 토큰의 50%를 받습니다.

### 사용자별 예치 한도를 설정할 수 있나요?
네. 거래당 최소 한도에는 `minimumDepositAmount`를, 사용자당 최대 총 예치금에는 `depositLimit`을 사용합니다.

### Presale과 Launch Pool의 차이점은 무엇인가요?
Presale은 토큰 할당량과 SOL 상한에 의해 결정되는 고정 가격입니다. Launch Pool은 총 예치금을 기반으로 자연스럽게 가격이 결정됩니다.

### Presale과 Launch Pool은 언제 사용해야 하나요?
예측 가능한 가격 책정이 필요하고 모금 목표가 명확할 때 Presale을 사용합니다. 자연스러운 가격 발견에는 Launch Pool을 사용합니다.

## 용어집

| 용어 | 정의 |
|------|------------|
| **Presale** | 미리 정해진 비율의 고정가 토큰 판매 |
| **SOL Cap** | Presale이 수락하는 최대 SOL (가격 결정) |
| **Token Allocation** | Presale에서 사용 가능한 토큰 수 |
| **Deposit Limit** | 사용자당 허용되는 최대 총 예치금 |
| **Minimum Deposit** | 예치 거래당 필요한 최소 금액 |
| **Cooldown** | 사용자가 예치 사이에 기다려야 하는 시간 |
| **End Behavior** | 예치 기간 종료 후 자동화된 동작 |
| **Transition** | 종료 동작을 처리하는 명령 |

## 다음 단계

- [Launch Pool](/ko/smart-contracts/genesis/launch-pool) - 유기적 가격 발견을 통한 공정한 출시
- [Uniform Price Auction](/ko/smart-contracts/genesis/uniform-price-auction) - IDO 스타일 입찰 기반 할당
- [토큰 출시하기](/ko/tokens/launch-token) - 엔드투엔드 토큰 출시 가이드
- [시작하기](/ko/smart-contracts/genesis/getting-started) - Genesis 런치패드 기초
