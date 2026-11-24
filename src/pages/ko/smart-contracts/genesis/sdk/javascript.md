---
title: JavaScript SDK
metaTitle: JavaScript SDK | Genesis | Metaplex
description: Genesis JavaScript SDK의 API 레퍼런스. Solana에서 토큰 런칭을 위한 함수 시그니처, 조건 및 종료 동작 타입, Raydium CPMM 졸업 명령어, 오류 코드를 다룹니다.
created: '01-15-2025'
updated: '11-24-2026'
keywords:
  - Genesis SDK
  - JavaScript SDK
  - TypeScript SDK
  - token launch SDK
  - Umi framework
  - Genesis API reference
  - refundLaunchPoolV2
  - soft cap
  - triggerConditionsV2
  - triggerBehaviorsV2
  - graduateToRaydiumCpmmV2
  - addRaydiumCpmmBucketV2
  - TimeRelative condition
  - EndBehavior
about:
  - SDK installation
  - API reference
  - Genesis instructions
  - Raydium CPMM graduation
  - Genesis conditions and end behaviors
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Umi란 무엇이며 왜 필요한가요?
    a: Umi는 Solana를 위한 Metaplex의 JavaScript 프레임워크입니다. 트랜잭션 구축, 서명자 관리, Metaplex 프로그램과의 상호작용을 위한 일관된 인터페이스를 제공합니다.
  - q: 브라우저에서 Genesis SDK를 사용할 수 있나요?
    a: 네. SDK는 Node.js와 브라우저 환경 모두에서 작동합니다. 브라우저에서는 키페어 파일 대신 지갑 어댑터를 사용해 서명하세요.
  - q: fetch와 safeFetch의 차이점은 무엇인가요?
    a: fetch는 계정이 존재하지 않으면 오류를 던집니다. safeFetch는 대신 null을 반환하며, 오류 처리 없이 계정 존재 여부를 확인하는 데 유용합니다.
  - q: 토큰의 런칭 타입을 어떻게 조회하나요?
    a: 토큰 민트로 fetchGenesisAccountV2FromSeeds를 호출하여 GenesisAccountV2 온체인 계정을 가져옵니다. launchType 필드는 0(Uninitialized) 또는 3(LaunchPoolV1)을 반환합니다. GPA 빌더를 사용하여 특정 타입의 모든 런칭을 조회할 수도 있습니다.
  - q: 어떤 지갑이든 호출할 수 있는 Genesis 명령어는 무엇인가요?
    a: triggerConditionsV2, triggerBehaviorsV2, graduateToRaydiumCpmmV2, collectRaydiumCpmmFeesV2, collectRaydiumCpmmFeesWithCreatorFeeV2, claimRaydiumCreatorFeeV2, claimUnlockedV2, claimClaimScheduleV2는 수수료 지불자의 서명만 필요합니다. 자금은 항상 버킷에 저장된 주소로 이동합니다. 버킷에 백엔드 서명자 확장이 있으면 해당 서명자도 졸업과 청구에 공동 서명해야 합니다.
  - q: Raydium 졸업 후에도 청구가 실패하는 이유는 무엇인가요?
    a: Raydium 버킷의 Graduate 시간에 대해 TimeRelative인 청구 조건은 졸업이나 청구 자체로는 해결되지 않습니다. 의존하는 각 버킷에 대해 triggerConditionsV2를 호출하고, Raydium CPMM 버킷을 쓰기 가능한 remaining account로 전달하세요.
  - q: 트랜잭션 오류를 어떻게 처리하나요?
    a: sendAndConfirm 호출을 try/catch 블록으로 감싸고, 오류 이름을 일반 오류 표와 대조하세요. 일반적인 오류에는 잔액 부족, 이미 최종화된 계정, 트리거되지 않은 조건, 시작되지 않은 졸업이 포함됩니다.
---

Genesis JavaScript SDK(`@metaplex-foundation/genesis`)의 API 레퍼런스입니다. 전체 튜토리얼은 [Launch Pool](/ko/smart-contracts/genesis/launch-pool) 또는 [Presale](/ko/smart-contracts/genesis/presale)을 참조하세요. {% .lead %}

## 요약 {% #summary %}

Genesis JavaScript SDK는 모든 Genesis 프로그램 명령어를 Umi 빌더로 제공하며, Solana에서 토큰 런칭을 구축하기 위한 PDA 헬퍼, 계정 조회 함수, 조건 헬퍼를 함께 제공합니다.

- 명령어 빌더는 버킷 설정, 예치 및 청구, Raydium CPMM 졸업, LP 토큰 및 풀 수수료, Unlocked 버킷, 청구 스케줄을 다룹니다
- `triggerConditionsV2`와 `triggerBehaviorsV2`는 조건을 해결하고 종료 동작을 실행하는 무허가(permissionless) 크랭크입니다
- 조건(`TimeAbsolute`, `TimeRelative`, `Triggered`, `TriggeredWithExpiry`, `Never`, `Always`)과 종료 동작(6가지 타입)의 정확한 객체 형태를 아래에서 설명합니다
- `@metaplex-foundation/genesis` 0.44.0 및 Genesis 프로그램 `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` 기준으로 검증되었습니다

**바로 가기:** [명령어](#instructions-reference) · [Raydium CPMM](#raydium-cpmm-graduation-signatures) · [조건 및 동작](#condition-and-behavior-signatures) · [TimeCondition](#time-condition) · [EndBehavior](#end-behavior) · [오류](#common-errors)

{% quick-links %}

{% quick-link title="NPM 패키지" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/genesis" description="@metaplex-foundation/genesis" /%}

{% quick-link title="TypeDoc" target="_blank" icon="JavaScript" href="https://mpl-genesis.typedoc.metaplex.com/" description="자동 생성된 API 문서" /%}

{% /quick-links %}

## 설치 {% #installation %}

Genesis SDK는 Umi 및 Metaplex toolbox 패키지와 함께 npm에서 설치합니다.

```bash
npm install @metaplex-foundation/genesis @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-toolbox \
  @metaplex-foundation/mpl-token-metadata
```

## 설정 {% #setup %}

SDK는 `.use(genesis())`로 Umi 플러그인으로 등록됩니다.

```typescript {% title="setup.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { genesis } from '@metaplex-foundation/genesis';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(genesis())
  .use(mplTokenMetadata());
```

전체 구현 예제는 [Launch Pool](/ko/smart-contracts/genesis/launch-pool) 또는 [Presale](/ko/smart-contracts/genesis/presale)을 참조하세요.

---

## 명령어 레퍼런스 {% #instructions-reference %}

아래 표는 각 Genesis 명령어 빌더를 영역별로 나열하고, 서명해야 하는 계정을 함께 보여줍니다. "지불자만"은 해당 명령어가 무허가(permissionless)라는 뜻입니다. 어떤 지갑이든 전송할 수 있으며, 자금은 항상 버킷에 저장된 주소로 이동합니다.

### 코어 명령어 {% #core-instructions %}

| 함수 | 설명 | 서명자 |
|----------|-------------|---------|
| [initializeV2()](#initialize-v2) | Genesis 계정 생성 및 토큰 발행 | 권한자, 베이스 민트 |
| [finalizeV2()](#finalize-v2) | 설정 잠금, 런칭 활성화 | 권한자 |

### 버킷 생성 명령어 {% #bucket-creation-instructions %}

| 함수 | 설명 | 서명자 |
|----------|-------------|---------|
| [addLaunchPoolBucketV2()](#add-launch-pool-bucket-v2) | 비례 배분 버킷 추가 | 권한자 |
| [addPresaleBucketV2()](#add-presale-bucket-v2) | 고정가 판매 버킷 추가 | 권한자 |
| [addUnlockedBucketV2()](#add-unlocked-bucket-v2) | 트레저리/수신자 버킷 추가 | 권한자 |
| [addRaydiumCpmmBucketV2()](#add-raydium-cpmm-bucket-v2) | Raydium CPMM 졸업 버킷 추가 | 권한자 |
| [addClaimScheduleBucketV2()](#add-claim-schedule-bucket-v2) | 청구 스케줄이 있는 베스팅 버킷 추가 | 권한자 |

### Launch Pool 명령어 {% #launch-pool-instructions %}

| 함수 | 설명 | 서명자 |
|----------|-------------|---------|
| [depositLaunchPoolV2()](#deposit-launch-pool-v2) | Launch Pool에 SOL 예치 | 예치자 |
| [withdrawLaunchPoolV2()](#withdraw-launch-pool-v2) | SOL 출금 (예치 기간 중) | 예치자 |
| [claimLaunchPoolV2()](#claim-launch-pool-v2) | 토큰 청구 (예치 기간 후) | 지불자만 |
| [refundLaunchPoolV2()](#refund-launch-pool-v2) | 예치금 환불 (최소 임계값 미달 또는 소프트 캡 초과) | 지불자만 |

### Presale 명령어 {% #presale-instructions %}

| 함수 | 설명 | 서명자 |
|----------|-------------|---------|
| [depositPresaleV2()](#deposit-presale-v2) | Presale에 SOL 예치 | 예치자 |
| [claimPresaleV2()](#claim-presale-v2) | 토큰 청구 (예치 기간 후) | 지불자만 |

### Unlocked 버킷 명령어 {% #unlocked-bucket-instructions %}

| 함수 | 설명 | 서명자 |
|----------|-------------|---------|
| [claimUnlockedV2()](#claim-unlocked-v2) | 버킷의 베이스 토큰 및 쿼트 토큰 잔액을 수신자에게 전송 | 지불자만 |

### 청구 스케줄 명령어 {% #claim-schedule-instructions %}

| 함수 | 설명 | 서명자 |
|----------|-------------|---------|
| [claimClaimScheduleV2()](#claim-claim-schedule-v2) | 베스팅된 토큰을 버킷 수신자에게 전송 | 지불자만 |
| [setClaimSchedulePausedStateV2()](#claim-schedule-runtime-controls) | 베스팅 일시 중지 또는 재개 | 권한자 |
| [cancelClaimScheduleBucketV2()](#claim-schedule-runtime-controls) | 베스팅 영구 중단 | 권한자 또는 수신자 |
| [transferRecipientClaimScheduleBucketV2()](#claim-schedule-runtime-controls) | 베스팅 수신자 변경 | 권한자 또는 수신자 |

### Raydium CPMM 졸업 명령어 {% #raydium-cpmm-graduation-instructions %}

| 함수 | 설명 | 서명자 |
|----------|-------------|---------|
| [graduateToRaydiumCpmmV2()](#graduate-to-raydium-cpmm-v2) | 버킷의 쿼트 토큰과 베이스 토큰으로 Raydium CPMM 풀 생성 | 지불자만 (설정된 경우 + 백엔드 서명자) |
| [postponeStartRaydiumCpmmBucketV2()](#postpone-start-raydium-cpmm-bucket-v2) | 연기 가능한 졸업 시작 시점을 뒤로 이동 | 권한자 |
| [claimRaydiumCpmmLpTokensV2()](#claim-raydium-cpmm-lp-tokens-v2) | 잠금 해제된 LP 토큰 청구 | LP 청구 권한자 |
| [burnRaydiumCpmmLpTokensV2()](#burn-raydium-cpmm-lp-tokens-v2) | 청구되지 않은 LP 토큰 소각 | LP 청구 권한자 |
| [collectRaydiumCpmmFeesV2()](#collect-raydium-cpmm-fees-v2) | Raydium 창작자 수수료를 Genesis 수수료 지갑으로 수집 | 지불자만 |
| [collectRaydiumCpmmFeesWithCreatorFeeV2()](#collect-raydium-cpmm-fees-with-creator-fee-v2) | 창작자 수수료를 수집하고 런칭 창작자의 몫을 적립 | 지불자만 |
| [claimRaydiumCreatorFeeV2()](#claim-raydium-creator-fee-v2) | 적립된 창작자 수수료를 창작자 지갑으로 지급 | 지불자만 |

### 조건 및 동작 명령어 {% #condition-and-behavior-instructions %}

| 함수 | 설명 | 서명자 |
|----------|-------------|---------|
| [triggerConditionsV2()](#trigger-conditions-v2) | 한 버킷의 모든 조건 해결 | 지불자만 |
| [triggerBehaviorsV2()](#trigger-behaviors-v2) | 버킷의 종료 동작 실행 | 지불자만 |
| [set*BucketV2Behaviors()](#set-bucket-v2-behaviors) | 최종화 전에 버킷의 종료 동작 교체 | 권한자 |

### 관리자 명령어 {% #admin-instructions %}

| 함수 | 설명 | 서명자 |
|----------|-------------|---------|
| [revokeV2()](#revoke-v2) | 민트 및/또는 동결 권한 영구 폐기 | 권한자 |
| [setBucketBackendSignerV2()](#set-bucket-backend-signer-v2) | 버킷의 백엔드 서명자 설정, 교체 또는 해제 | 권한자 |

---

## 함수 시그니처 {% #function-signatures %}

각 시그니처는 일반적으로 전달하는 인수를 나열합니다. 토큰 계정, 토큰 프로그램, 버킷 서명자 PDA 등 표시되지 않은 계정은 SDK가 도출합니다.

### initializeV2

```typescript
await initializeV2(umi, {
  baseMint,           // Signer - new token keypair
  quoteMint,          // PublicKey - deposit token (wSOL)
  fundingMode,        // number - use 0
  totalSupplyBaseToken, // bigint - supply with decimals
  name,               // string - token name
  symbol,             // string - token symbol
  uri,                // string - metadata URI
}).sendAndConfirm(umi);
```

### finalizeV2

```typescript
await finalizeV2(umi, {
  baseMint,           // PublicKey
  genesisAccount,     // PublicKey
}).sendAndConfirm(umi);
```

### addLaunchPoolBucketV2

```typescript
await addLaunchPoolBucketV2(umi, {
  genesisAccount,           // PublicKey
  baseMint,                 // PublicKey
  baseTokenAllocation,      // bigint - tokens for this bucket
  depositStartCondition,    // TimeCondition
  depositEndCondition,      // TimeCondition
  claimStartCondition,      // TimeCondition
  claimEndCondition,        // TimeCondition
  minimumDepositAmount,     // { amount: bigint } | null
  minimumQuoteTokenThreshold, // { amount: bigint } | null - floor, launch fails below it
  softCap,                  // { amount: bigint } | null - REQUIRED, ceiling on quote kept
  endBehaviors,             // EndBehavior[]
}).sendAndConfirm(umi);
```

{% callout type="warning" %}
`softCap`은 `@metaplex-foundation/genesis` 0.42.0부터 필수 인수입니다. 다른 Launch Pool 확장과 달리 생성된 시리얼라이저에 기본값이 없으므로, 런칭에 상한이 없을 때는 `softCap: null`을 명시적으로 전달하세요. 동작 방식은 [Launch Pool 소프트 캡](/ko/smart-contracts/genesis/launch-pool#launch-pool-soft-cap)을 참조하세요.
{% /callout %}

### addPresaleBucketV2

```typescript
await addPresaleBucketV2(umi, {
  genesisAccount,           // PublicKey
  baseMint,                 // PublicKey
  baseTokenAllocation,      // bigint
  allocationQuoteTokenCap,  // bigint - SOL cap (sets price)
  depositStartCondition,    // TimeCondition
  depositEndCondition,      // TimeCondition
  claimStartCondition,      // TimeCondition
  claimEndCondition,        // TimeCondition
  minimumDepositAmount,     // bigint | null
  depositLimit,             // bigint | null - max per user
  endBehaviors,             // EndBehavior[]
}).sendAndConfirm(umi);
```

### addUnlockedBucketV2

Unlocked 버킷은 팀 트레저리처럼 단일 수신자를 위한 토큰을 보관합니다. 자체 할당량과 롤오버 또는 재할당 동작으로부터 베이스 토큰을 받고, `SendQuoteTokenPercentage` 동작으로부터 쿼트 토큰을 받습니다.

```typescript
await addUnlockedBucketV2(umi, {
  genesisAccount,       // PublicKey
  baseMint,             // PublicKey
  baseTokenAllocation,  // bigint - optional, usually 0n
  recipient,            // PublicKey - who receives claimed tokens
  claimStartCondition,  // TimeCondition
  claimEndCondition,    // TimeCondition
  backendSigner,        // { signer: PublicKey } | null - optional co-signer for claims
}).sendAndConfirm(umi);
```

### addRaydiumCpmmBucketV2

Raydium CPMM 버킷은 베이스 토큰을 예약하고 종료 동작을 통해 판매 수익을 받은 뒤, 졸업 시 Raydium CP-Swap 풀을 생성합니다. LP 잠금 방식은 [Locked LP Tokens](/ko/smart-contracts/genesis/locked-lp-tokens)를 참조하세요.

```typescript
await addRaydiumCpmmBucketV2(umi, {
  genesisAccount,        // PublicKey
  baseMint,              // PublicKey
  baseTokenAllocation,   // bigint - base tokens reserved for the pool
  startCondition,        // TimeCondition - earliest time graduation can run
  lpLockSchedule,        // ClaimSchedule | null - LP vesting; null = Genesis authority claims all LP
  lpClaimAuthority,      // PublicKey | null - null = Genesis authority
  burnLp,                // boolean - true burns all LP at graduation
  creatorFee,            // { wallet: PublicKey } | null - share of Raydium creator fees
  postponableStart,      // PostponableStart | null - allow postponeStartRaydiumCpmmBucketV2
  backendSigner,         // { signer: PublicKey } | null - co-signer for graduation and LP actions
  deferPoolCreationCost, // boolean - false: payer pre-funds pool creation now
  endBehaviors,          // EndBehavior[] - BaseTokenRollover / ReallocateBaseTokensOnFailure
}).sendAndConfirm(umi);
```

버킷의 `graduateCondition`은 인수가 아닙니다. 프로그램이 이를 `Triggered` 조건으로 생성하고 `graduateToRaydiumCpmmV2` 내부에서 발동시키며, 이로써 다른 버킷이 `BucketTimes.Graduate`를 `TimeRelative` 기준으로 사용할 수 있게 됩니다.

{% callout type="note" %}
Raydium CPMM 버킷은 정확히 하나의 `SendQuoteTokenPercentage` 동작과 정확히 하나의 `SendStartPrice` 동작의 대상이어야 하며, 두 동작은 같은 판매 버킷에서 와야 합니다. 그렇지 않으면 `finalizeV2`가 런칭을 거부합니다(`MissingRaydiumGraduationSource`, `DuplicateRaydiumGraduationSource`, `RaydiumGraduationSourceMismatch`). `burnLp: true`는 `lpLockSchedule`과 함께 사용할 수 없습니다(`BurnLpConflictsWithLpLockSchedule`).
{% /callout %}

`PostponableStart`의 형태는 `{ maxPostpones: number, timesPostponed: 0, padding: Array(3).fill(0), delayBudgetSeconds: number }`입니다. 판매 버킷이 버킷 생성 전에 `endBehaviors`에서 이를 대상으로 지정할 수 있도록, `findRaydiumCpmmBucketV2Pda`로 버킷의 PDA를 미리 도출하세요.

### addClaimScheduleBucketV2

청구 스케줄 버킷은 시간에 걸쳐 베이스 토큰을 한 명의 수신자에게 베스팅합니다. 베스팅 계산 방식과 런타임 제어는 [Project Vesting](/ko/smart-contracts/genesis/project-vesting)을 참조하세요.

```typescript
await addClaimScheduleBucketV2(umi, {
  genesisAccount,           // PublicKey
  baseMint,                 // PublicKey
  baseTokenAllocation,      // bigint
  recipient,                // PublicKey - defaults to the authority
  claimStartCondition,      // TimeCondition - claim gate
  claimSchedule,            // ClaimSchedule - start, duration, period, cliff
  pausable,                 // boolean - optional, default false
  cancelable,               // boolean - optional, default false
  cancelableByRecipient,    // boolean - optional, default false
  transferable,             // boolean - optional, default false
  transferableByRecipient,  // boolean - optional, default false
  backendSigner,            // { signer: PublicKey } | null
  endBehaviors,             // EndBehavior[] - at most one ReallocateBaseTokensOnCancel
}).sendAndConfirm(umi);
```

`ClaimSchedule`의 형태는 `{ startCondition, duration, period, cliffCondition, cliffAmountBps, reserved: Array(126).fill(0) }`입니다. 절대 시간을 사용할 때는 `createClaimSchedule({ startTime, endTime, cliffTime, cliffAmountBps, period })`로 생성하고, 베스팅을 졸업 시점에 고정하려면 `createTimeRelativeCondition`으로 만든 시작 및 클리프 조건으로 직접 구성하세요.

### depositLaunchPoolV2

```typescript
await depositLaunchPoolV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  amountQuoteToken,   // bigint - lamports
}).sendAndConfirm(umi);
```

### depositPresaleV2

```typescript
await depositPresaleV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  amountQuoteToken,   // bigint - lamports
}).sendAndConfirm(umi);
```

### withdrawLaunchPoolV2

```typescript
await withdrawLaunchPoolV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  amountQuoteToken,   // bigint - lamports
}).sendAndConfirm(umi);
```

### claimLaunchPoolV2

```typescript
await claimLaunchPoolV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  recipient,          // PublicKey
}).sendAndConfirm(umi);
```

### refundLaunchPoolV2

예치 기간이 종료된 후 Launch Pool 예치금을 환불합니다. 프로그램이 금액을 계산하므로 amount 인수는 없습니다. `minimumQuoteTokenThreshold`에 미달하면 예치금 전액이 환불되고, `softCap`을 초과하면 초과분만 환불되며 예치자의 토큰 할당량은 그대로 유지됩니다.

```typescript
await refundLaunchPoolV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  recipient,          // PublicKey | Signer - depositor; base token account closed if they sign
}).sendAndConfirm(umi);
```

`payer`만 서명하면 되므로 예치자를 대신해 누구나 환불을 크랭크할 수 있습니다. 예치 기간이 끝나기 전에 호출하면 `LaunchPoolNotEnded`, 최소 임계값을 충족하고 소프트 캡을 초과하지 않았을 때 호출하면 `LaunchPoolThresholdMet`, 두 번 호출하면 `DepositAlreadyRefunded`가 반환됩니다.

### claimPresaleV2

```typescript
await claimPresaleV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  recipient,          // PublicKey
}).sendAndConfirm(umi);
```

### claimUnlockedV2

`claimUnlockedV2`는 Unlocked 버킷의 현재 베이스 토큰 잔액 전체와 쿼트 토큰 잔액을 버킷에 저장된 수신자에게 전송합니다. 쿼트 측에서는 프로토콜 청구 수수료가 차감됩니다.

```typescript
await claimUnlockedV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey - UnlockedBucketV2
  baseMint,           // PublicKey
  recipient,          // PublicKey - must match the bucket's recipient
  backendSigner,      // Signer - only if the bucket has a backend signer
}).sendAndConfirm(umi);
```

청구는 반복할 수 있습니다. 이전 청구 이후에도 롤오버 또는 재할당 동작이 베이스 토큰을 추가로 적립할 수 있기 때문입니다. 남은 잔액이 없을 때 청구하면 `UnlockedBucketAlreadyClaimed`가, 수신자가 버킷의 수신자와 다르면 `RecipientMismatch`가 반환됩니다.

### claimClaimScheduleV2

`claimClaimScheduleV2`는 현재 베스팅되었지만 아직 청구되지 않은 모든 토큰을 버킷에 저장된 수신자에게 전송합니다.

```typescript
await claimClaimScheduleV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey - ClaimScheduleBucketV2
  baseMint,           // PublicKey
  recipient,          // PublicKey - must match the bucket's recipient
  backendSigner,      // Signer - only if the bucket has a backend signer
}).sendAndConfirm(umi);
```

청구 게이트, 선형 베스팅 시작, 또는 클리프가 `TimeRelative`이면 먼저 청구 스케줄 버킷에 대해 [triggerConditionsV2](#trigger-conditions-v2)를 호출하세요. 베스팅된 토큰이 없을 때 청구하면 `NothingToClaim`이 반환됩니다.

### 청구 스케줄 런타임 제어 {% #claim-schedule-runtime-controls %}

청구 스케줄 런타임 제어는 최종화 후 베스팅 버킷을 일시 중지, 취소하거나 수신자를 변경하며, 각 제어는 생성 시 해당 정책 플래그가 설정된 경우에만 작동합니다.

```typescript
// Pause or resume vesting (requires pausable: true). Signer: Genesis authority.
await setClaimSchedulePausedStateV2(umi, {
  genesisAccount, bucket, signer: authority,
  paused: true, padding: Array(6).fill(0),
}).sendAndConfirm(umi);

// Stop vesting permanently (requires cancelable or cancelableByRecipient).
await cancelClaimScheduleBucketV2(umi, {
  genesisAccount, bucket, signer, // authority or recipient
  padding: Array(7).fill(0),
}).sendAndConfirm(umi);

// Change the recipient (requires transferable or transferableByRecipient).
await transferRecipientClaimScheduleBucketV2(umi, {
  genesisAccount, bucket, signer, // authority or recipient
  newRecipient,                   // PublicKey
  padding: Array(7).fill(0),
}).sendAndConfirm(umi);
```

정책이 비활성화되어 있으면 `ClaimSchedulePolicyDisabled`가, 정책이 허용하지 않는 서명자이면 `ClaimScheduleUnauthorized`가 반환됩니다. 취소 후에는 `triggerBehaviorsV2`로 실행되는 `ReallocateBaseTokensOnCancel` 동작이 베스팅되지 않은 잔여분을 이동합니다.

### revokeV2

베이스 토큰의 민트 및/또는 동결 권한을 영구적으로 폐기합니다.

```typescript
await revokeV2(umi, {
  genesisAccount,           // PublicKey
  baseMint,                 // PublicKey
  baseTokenProgram,         // PublicKey - required, e.g. SPL_TOKEN_PROGRAM_ID from mpl-toolbox
  revokeMintAuthority,      // boolean
  revokeFreezeAuthority,    // boolean
  padding: Array(5).fill(0), // required, no default
}).sendAndConfirm(umi);
```

### setBucketBackendSignerV2

`setBucketBackendSignerV2`는 백엔드 서명자를 지원하는 모든 V2 버킷에서 백엔드 서명자 확장을 설정, 교체 또는 해제합니다. 백엔드 키를 분실하면 사용자 청구를 포함해 해당 키가 필요한 모든 작업이 계속 차단되므로, 이 명령어가 복구 경로가 됩니다.

```typescript
await setBucketBackendSignerV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey - any V2 bucket with a backend signer slot
  authority,          // Signer - Genesis authority (defaults to identity)
  backendSigner,      // PublicKey - new co-signer; the default (all-zero) key clears it
}).sendAndConfirm(umi);
```

기존 백엔드 서명자의 교체 또는 해제는 `finalizeV2` 전후 모두 가능합니다. 백엔드 서명자가 없던 버킷에 새로 추가하는 것은 최종화 전에만 허용됩니다. 백엔드 서명자는 Genesis 권한자가 선택한 어떤 키든 될 수 있습니다.

---

## Raydium CPMM 졸업 시그니처 {% #raydium-cpmm-graduation-signatures %}

Raydium CPMM 졸업 명령어는 Raydium CPMM 버킷으로부터 Raydium CP-Swap 풀을 생성한 뒤, 해당 풀의 LP 토큰과 풀 수수료를 관리합니다. 이 명령어들이 받는 모든 Raydium 계정은 `deriveRaydiumPDAsV2(umi, baseMint, raydiumBucket, options)`로 도출하세요.

### deriveRaydiumPDAsV2

`deriveRaydiumPDAsV2`는 Raydium CPMM 버킷에 대한 Raydium 풀 계정들을 반환합니다. 풀 상태는 Genesis가 도출한 PDA이므로 졸업 전에는 누구도 풀을 생성할 수 없습니다.

```typescript
const raydium = deriveRaydiumPDAsV2(umi, baseMint, raydiumBucket, {
  quoteMint,   // PublicKey - optional, defaults to wSOL
  env,         // 'mainnet' | 'devnet' - optional, defaults to 'mainnet'
  creatorFee,  // boolean - optional, true selects the creator-fee AMM config
  ammConfig,   // PublicKey - optional override
});
// raydium.poolState, ammConfig, poolAuthority, lpMint, baseVault, quoteVault,
// createPoolFee, observationState, raydiumProgram, raydiumSigner, permission,
// creatorFeeShare, token0Mint, token1Mint, isProjectMintToken0
```

버킷에 `creatorFee` 확장이 있으면 `creatorFee: true`를 전달하세요. 확장 없이 창작자 수수료 AMM 설정을 사용하거나, 창작자 수수료 AMM 설정 없이 확장을 사용하면 졸업이 `InvalidCreatorFeeConfig`로 실패합니다.

### graduateToRaydiumCpmmV2

`graduateToRaydiumCpmmV2`는 Raydium 풀을 생성하고, 버킷의 쿼트 토큰과 이에 대응하는 베이스 토큰을 판매 시작 가격으로 예치한 뒤, 버킷의 `graduateCondition`을 발동시킵니다.

```typescript
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 400_000 }))
  .add(
    graduateToRaydiumCpmmV2(umi, {
      genesisAccount,     // PublicKey
      bucket,             // PublicKey - RaydiumCpmmBucketV2
      baseMint,           // PublicKey
      quoteMint,          // PublicKey - optional, defaults to wSOL
      poolState: raydium.poolState,
      ammConfig: raydium.ammConfig,
      poolAuthority: raydium.poolAuthority,
      lpMint: raydium.lpMint,
      baseVault: raydium.baseVault,
      quoteVault: raydium.quoteVault,
      createPoolFee: raydium.createPoolFee,
      observationState: raydium.observationState,
      permission: raydium.permission,
      raydiumProgram: raydium.raydiumProgram,
      backendSigner,      // Signer - only if the bucket has a backend signer
    })
  )
  .sendAndConfirm(umi);
```

졸업은 무허가(permissionless)입니다. 수수료 지불자만 서명하면 되며, 버킷에 백엔드 서명자 확장이 있는 경우 백엔드 서명자도 서명합니다. 이 명령어는 다음 세 가지를 순서대로 확인합니다.

| 확인 항목 | 오류 |
|-------|-------|
| 버킷이 아직 졸업하지 않았음 | `BucketAlreadyGraduated` |
| 자금을 공급하는 판매가 실패하지 않았음 (`TransmitFailure`를 받지 않음) | `BucketLaunchFailed` |
| 버킷의 `startCondition`이 충족됨 | `GraduationNotStarted` |

졸업 전에 판매 버킷에 대해 `triggerBehaviorsV2`를 실행하여 Raydium 버킷이 쿼트 토큰과 시작 가격을 받도록 하세요. `startCondition`이 `TimeRelative`이면, 먼저 판매 버킷을 remaining account로 지정하여 Raydium 버킷에 대해 `triggerConditionsV2`를 실행하세요.

{% callout type="warning" %}
졸업은 다른 버킷의 청구를 열어주지 않습니다. `BucketTimes.Graduate`에 대해 `TimeRelative`인 Launch Pool, Unlocked, 청구 스케줄 조건은 누군가 Raydium 버킷을 쓰기 가능한 remaining account로 지정하여 해당 버킷에 [triggerConditionsV2](#trigger-conditions-v2)를 호출할 때까지 트리거되지 않은 상태로 남습니다.
{% /callout %}

### postponeStartRaydiumCpmmBucketV2

`postponeStartRaydiumCpmmBucketV2`는 졸업 시작 시점을 뒤로 이동하며, `postponableStart` 확장으로 생성된 버킷에서만 작동합니다.

```typescript
await postponeStartRaydiumCpmmBucketV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey - RaydiumCpmmBucketV2
  authority,          // Signer - Genesis authority (defaults to identity)
  sourceBucket,       // PublicKey - sale bucket; required when startCondition is TimeRelative
  newStartValue,      // bigint - new unix time (TimeAbsolute) or new offset in seconds (TimeRelative)
  padding: Array(7).fill(0),
}).sendAndConfirm(umi);
```

연기는 `maxPostpones`와 `delayBudgetSeconds`로 제한되며, 예정된 졸업 시점보다 최소 30분 전에 이루어져야 하고, 시작 시점을 최소 24시간 이후로 이동해야 합니다. 위반 시 `PostponeLimitReached`, `PostponeNotLater`, `PostponeExceedsMaxDelay`, `PostponeTooLate`, `PostponeTooSoon`, 또는 `BucketNotPostponable`이 반환됩니다.

### claimRaydiumCpmmLpTokensV2

`claimRaydiumCpmmLpTokensV2`는 `lpLockSchedule`에 따라 베스팅된 양까지, 잠금 해제된 LP 토큰을 버킷 서명자로부터 대상 토큰 계정으로 전송합니다.

```typescript
await claimRaydiumCpmmLpTokensV2(umi, {
  genesisAccount,            // PublicKey
  bucket,                    // PublicKey - RaydiumCpmmBucketV2
  baseMint,                  // PublicKey
  lpMint: raydium.lpMint,    // PublicKey
  recipient,                 // PublicKey - owner of the destination account
  destinationLpTokenAccount, // PublicKey - recipient's LP ATA, created if missing
  lpClaimAuthority,          // Signer - lpClaimAuthority, or the Genesis authority if unset
  backendSigner,             // Signer - only if the bucket has a backend signer
  amount,                    // bigint - LP tokens to claim
}).sendAndConfirm(umi);
```

졸업 전에 청구하면 `NoLpTokensToClaim`, 잘못된 서명자이면 `InvalidLpClaimAuthority`, 아직 언락된 LP 토큰이 없는 상태에서 청구하면 `InsufficientUnlockedAmount`가 반환됩니다. 언락된 잔액을 초과하는 `amount`는 거부되지 않고 해당 잔액으로 제한됩니다. `TimeRelative` 조건이 있는 `lpLockSchedule`은 청구 전에 Raydium 버킷에 대해 [triggerConditionsV2](#trigger-conditions-v2)를 호출해야 합니다.

### burnRaydiumCpmmLpTokensV2

`burnRaydiumCpmmLpTokensV2`는 버킷 서명자가 보유한 청구되지 않은 LP 토큰을 소각하여, 해당 비율의 풀 유동성을 영구적으로 잠급니다.

```typescript
await burnRaydiumCpmmLpTokensV2(umi, {
  genesisAccount,          // PublicKey
  bucket,                  // PublicKey - RaydiumCpmmBucketV2
  baseMint,                // PublicKey
  lpMint: raydium.lpMint,  // PublicKey
  lpClaimAuthority,        // Signer
  backendSigner,           // Signer - only if the bucket has a backend signer
  amount,                  // bigint - capped to the unclaimed, unburned balance
}).sendAndConfirm(umi);
```

소각은 가치를 포기하는 것일 뿐이므로 `lpLockSchedule`을 무시합니다. 졸업 시점에 모든 LP 토큰을 소각하려면 대신 `burnLp: true`로 버킷을 생성하세요.

### collectRaydiumCpmmFeesV2

`collectRaydiumCpmmFeesV2`는 `creatorFee` 확장 없이 생성된 풀에서 누적된 Raydium 창작자 수수료를 수집하여, 쿼트 측을 Genesis 수수료 지갑으로 보냅니다.

```typescript
await collectRaydiumCpmmFeesV2(umi, {
  baseMint,                                  // PublicKey
  quoteMint,                                 // PublicKey - optional, defaults to wSOL
  poolState: raydium.poolState,
  ammConfig: raydium.ammConfig,
  poolAuthority: raydium.poolAuthority,
  baseVault: raydium.baseVault,
  quoteVault: raydium.quoteVault,
  raydiumProgram: raydium.raydiumProgram,
  creatorFeeShare: raydium.creatorFeeShare,
}).sendAndConfirm(umi);
```

누적된 수수료가 없으면 전송 없이 성공적으로 반환됩니다. 창작자 수수료 AMM 설정을 사용하는 풀은 `InvalidRaydiumAmmConfig`를 반환하므로, 해당 풀에는 `collectRaydiumCpmmFeesWithCreatorFeeV2`를 사용하세요.

### collectRaydiumCpmmFeesWithCreatorFeeV2

`collectRaydiumCpmmFeesWithCreatorFeeV2`는 버킷에 `creatorFee` 확장이 있는 풀에서 창작자 수수료를 수집하고, 런칭 창작자의 몫을 버킷에 적립한 뒤, 나머지를 Genesis 수수료 지갑으로 보냅니다.

```typescript
await collectRaydiumCpmmFeesWithCreatorFeeV2(umi, {
  baseMint,                                  // PublicKey
  genesisAccount,                            // PublicKey
  raydiumCpmmBucket,                         // PublicKey - bucket with creatorFee extension
  poolState: raydium.poolState,
  ammConfig: raydium.ammConfig,              // creator-fee AMM config
  poolAuthority: raydium.poolAuthority,
  baseVault: raydium.baseVault,
  quoteVault: raydium.quoteVault,
  raydiumProgram: raydium.raydiumProgram,
  creatorFeeShare: raydium.creatorFeeShare,
}).sendAndConfirm(umi);
```

### claimRaydiumCreatorFeeV2

`claimRaydiumCreatorFeeV2`는 Raydium 버킷에 적립되어 아직 청구되지 않은 창작자 수수료를 `creatorFee` 확장에 저장된 지갑으로 지급합니다. 전체 흐름은 [Creator Fees](/ko/smart-contracts/genesis/creator-fees)를 참조하세요.

```typescript
await claimRaydiumCreatorFeeV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey - RaydiumCpmmBucketV2
  baseMint,           // PublicKey
  creatorFeeWallet,   // PublicKey - must match the creatorFee extension wallet
}).sendAndConfirm(umi);
```

쿼트 민트가 wSOL이면 수수료는 언랩되어 네이티브 SOL로 지급됩니다. 확장의 지갑과 다른 지갑을 지정하면 `InvalidCreatorFeeWallet`이 반환됩니다.

---

## 조건 및 동작 시그니처 {% #condition-and-behavior-signatures %}

조건 및 동작 명령어는 런칭을 다음 단계로 진행시킵니다. `triggerConditionsV2`는 타이밍을 해결하고, `triggerBehaviorsV2`는 버킷 간에 자금을 이동하며, `set*BucketV2Behaviors` 계열은 최종화 전에 동작을 구성합니다.

### triggerConditionsV2

`triggerConditionsV2`는 대상 버킷 하나의 모든 조건을 해결하며, 여기에는 `claimSchedule`의 시작 및 클리프나 Raydium `lpLockSchedule` 같은 확장 조건도 포함됩니다. 무허가(permissionless) 명령어이며 수수료 지불자의 서명만 필요합니다.

```typescript
await triggerConditionsV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey - the bucket whose conditions to resolve
  baseMint,           // PublicKey
})
  .addRemainingAccounts([
    // Every bucket the target's TimeRelative conditions reference, writable
    { pubkey: raydiumBucket, isSigner: false, isWritable: true },
  ])
  .sendAndConfirm(umi);
```

| 속성 | 값 |
|----------|-------|
| 서명자 | 수수료 지불자만 |
| 대상 | 명령어당 버킷 하나 |
| Remaining accounts | 참조되는 모든 버킷, **쓰기 가능**, 순서 무관 |
| 자기 참조 | 대상 버킷을 다시 전달하지 않아도 해결됨 |
| 재실행 | 안전함. 이미 트리거된 조건은 건너뜀 |

이 명령어는 먼저 각 remaining account 버킷의 `TimeAbsolute` 조건을 해결한 다음, 대상 버킷에서 참조 버킷이 그중에 포함되어 있고 시간이 경과한 각 `TimeRelative` 조건을 해결합니다. 기록되는 `triggeredTimestamp`는 크랭크가 실행된 시간이 아니라 기준 시간에 오프셋을 더한 값입니다.

{% callout type="note" %}
`TimeRelative` 조건은 예치, 청구, 졸업에 의해 지연 해결(lazy resolution)되지 않습니다. `graduateToRaydiumCpmmV2` 이후에는 의존하는 버킷(Launch Pool, Unlocked, 청구 스케줄)마다 Raydium CPMM 버킷을 쓰기 가능한 remaining account로 지정하여 `triggerConditionsV2`를 한 번씩 호출하세요. 졸업 90일 후로 설정된 클리프는 90일이 지난 뒤 두 번째 호출이 필요합니다.
{% /callout %}

### triggerBehaviorsV2

`triggerBehaviorsV2`는 소스 버킷 하나(`primaryBucket`)에서 아직 처리되지 않은 모든 종료 동작을 실행하고, 각 동작을 처리됨으로 표시하여 두 번 실행되지 않도록 합니다. 무허가(permissionless) 명령어이며 수수료 지불자의 서명만 필요합니다.

```typescript
await triggerBehaviorsV2(umi, {
  genesisAccount,     // PublicKey
  primaryBucket,      // PublicKey - source bucket
  baseMint,           // PublicKey
})
  .addRemainingAccounts([
    // One (destination bucket, destination quote token account) pair per destination
    { pubkey: destinationBucket, isSigner: false, isWritable: true },
    { pubkey: destinationQuoteTokenAccount, isSigner: false, isWritable: true },
  ])
  .sendAndConfirm(umi);
```

대상 쿼트 토큰 계정은 대상 버킷의 쿼트 민트 ATA입니다. 대상이 Raydium CPMM이면 이 계정은 버킷 자체가 아니라 `findRaydiumBucketSignerPda(umi, { bucket })`로 얻는 버킷 서명자 PDA가 소유합니다. remaining accounts의 개수가 홀수이면 `InvalidRemainingAccountsLength`가 반환됩니다.

| 소스 버킷 | 실행 가능 시점 | 너무 이르면 발생하는 오류 |
|---------------|------------|--------------------|
| Launch Pool | `depositEndCondition`이 충족됨 | `LaunchPoolNotEnded` |
| Presale | `depositEndCondition`이 충족됨 | `PresaleBucketNotEnded` |
| Raydium CPMM | 풀이 졸업했거나 버킷이 실패로 표시됨 | `InvalidBucketState` |
| 청구 스케줄 | 베스팅이 취소, 완료 또는 실패됨 | `ClaimScheduleBucketNotEnded` |

### set*BucketV2Behaviors

`set*BucketV2Behaviors` 명령어는 기존 버킷의 `endBehaviors` 목록 전체를 교체합니다. Genesis 권한자가 필요하며, `finalizeV2` 이후에는 `GenesisAccountFinalized`로 실패합니다.

```typescript
await setLaunchPoolBucketV2Behaviors(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  authority,          // Signer - Genesis authority (defaults to identity)
  padding: Array(3).fill(0), // required, no default
  endBehaviors,       // EndBehavior[] - replaces the existing list
}).sendAndConfirm(umi);
```

| 함수 | 버킷 타입 | 허용되는 동작 |
|----------|-------------|-------------------|
| `setLaunchPoolBucketV2Behaviors` | Launch Pool | `SendQuoteTokenPercentage`, `SendStartPrice`, `ReallocateBaseTokensOnFailure`, `TransmitFailure` |
| `setPresaleBucketV2Behaviors` | Presale | Launch Pool 목록 및 `BaseTokenRollover` |
| `setRaydiumCpmmBucketV2Behaviors` | Raydium CPMM | `BaseTokenRollover`, `ReallocateBaseTokensOnFailure` |
| `setClaimScheduleBucketV2Behaviors` | 청구 스케줄 | `ReallocateBaseTokensOnCancel` (최대 하나) |
| `setUnlockedBucketV2Behaviors` | Unlocked | 없음. 빈 목록만 허용됨 |

`setBondingCurveBucketV2Behaviors`, `setVaultBucketV2Behaviors`, `setRaydiumClmmBucketV2Behaviors`에도 동일한 시그니처가 적용됩니다. 지원되지 않는 동작은 `BehaviorNotSupportedForBucketType`을 반환하며, `SendQuoteTokenPercentage`, `BaseTokenRollover`, 또는 `ReallocateBaseTokensOnFailure`의 합계가 10,000 bps를 초과하면 `BehaviorPercentageOverflow`가 반환됩니다.

---

## PDA 헬퍼 {% #pda-helpers %}

PDA 헬퍼는 시드로부터 Genesis 계정 주소를 도출하므로, 버킷이 생성되기 전에도 서로를 참조할 수 있습니다.

| 함수 | 시드 |
|----------|-------|
| findGenesisAccountV2Pda() | `baseMint`, `genesisIndex` |
| findLaunchPoolBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findPresaleBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findUnlockedBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findRaydiumCpmmBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findClaimScheduleBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findRaydiumBucketSignerPda() | `bucket` (Raydium CPMM 버킷) |
| findRaydiumSignerPda() | 없음 (프로그램당 하나) |
| findLaunchPoolDepositV2Pda() | `bucket`, `recipient` |
| findPresaleDepositV2Pda() | `bucket`, `recipient` |

```typescript
const [genesisAccountPda] = findGenesisAccountV2Pda(umi, { baseMint: mint.publicKey, genesisIndex: 0 });
const [bucketPda] = findLaunchPoolBucketV2Pda(umi, { genesisAccount: genesisAccountPda, bucketIndex: 0 });
const [depositPda] = findLaunchPoolDepositV2Pda(umi, { bucket: bucketPda, recipient: wallet });
const [raydiumBucketPda] = findRaydiumCpmmBucketV2Pda(umi, { genesisAccount: genesisAccountPda, bucketIndex: 0 });
```

버킷 인덱스는 버킷 타입별로 계산되므로, 첫 번째 Launch Pool 버킷과 첫 번째 Raydium CPMM 버킷은 모두 `bucketIndex: 0`을 사용합니다.

---

## 조회 함수 {% #fetch-functions %}

조회 함수는 Genesis 계정을 역직렬화합니다. 모든 계정 타입에는 `fetch*`(없으면 오류 발생), `safeFetch*`(`null` 반환), `fetchAll*` 변형이 있습니다.

### Genesis 계정 {% #genesis-account %}

Genesis 계정은 [런칭 타입](#launch-type)을 포함한 최상위 런칭 상태를 저장합니다. 백엔드 크랭크가 `setLaunchTypeV2` 명령어를 통해 생성 후 온체인에서 `launchType` 필드를 설정하므로, 크랭크가 처리할 때까지 값이 `Uninitialized`(0)일 수 있습니다.

| 함수 | 반환값 |
|----------|---------|
| fetchGenesisAccountV2() | Genesis 계정 상태 (없으면 오류 발생) |
| safeFetchGenesisAccountV2() | Genesis 계정 상태 또는 `null` |
| fetchGenesisAccountV2FromSeeds() | PDA 시드(`baseMint`, `genesisIndex`)로 조회 |
| safeFetchGenesisAccountV2FromSeeds() | 위와 동일, 없으면 `null` 반환 |
| fetchAllGenesisAccountV2() | 여러 Genesis 계정 일괄 조회 |

```typescript
import {
  fetchGenesisAccountV2,
  fetchGenesisAccountV2FromSeeds,
  findGenesisAccountV2Pda,
  LaunchType,
} from '@metaplex-foundation/genesis';

// Fetch by PDA address
const [genesisAccountPda] = findGenesisAccountV2Pda(umi, {
  baseMint: mintAddress,
  genesisIndex: 0,
});
const account = await fetchGenesisAccountV2(umi, genesisAccountPda);
console.log(account.data.launchType); // 0 = Uninitialized, 3 = LaunchPoolV1

// Or fetch directly from seeds
const account2 = await fetchGenesisAccountV2FromSeeds(umi, {
  baseMint: mintAddress,
  genesisIndex: 0,
});

// Check launch type
if (account2.data.launchType === LaunchType.LaunchPoolV1) {
  console.log('This is a launch pool');
}
```

**Genesis 계정 필드:** `authority`, `baseMint`, `quoteMint`, `totalSupplyBaseToken`, `totalAllocatedSupplyBaseToken`, `totalProceedsQuoteToken`, `fundingMode`, `launchType`, `bucketCount`, `finalized`

### GPA 빌더 — 런칭 타입으로 조회 {% #gpa-builder-query-by-launch-type %}

`getGenesisAccountV2GpaBuilder()`를 사용하여 온체인 필드로 필터링된 모든 Genesis 계정을 조회합니다. Solana의 `getProgramAccounts` RPC 메서드와 바이트 수준 필터를 사용하여 효율적으로 검색합니다.

```typescript
import {
  getGenesisAccountV2GpaBuilder,
  LaunchType,
} from '@metaplex-foundation/genesis';

// Get all launch pool launches
const launchpools = await getGenesisAccountV2GpaBuilder(umi)
  .whereField('launchType', LaunchType.LaunchPoolV1)
  .getDeserialized();

// Filter by multiple fields
const finalizedLaunchpools = await getGenesisAccountV2GpaBuilder(umi)
  .whereField('launchType', LaunchType.LaunchPoolV1)
  .whereField('finalized', true)
  .getDeserialized();

for (const account of launchpools) {
  console.log(account.publicKey, account.data.baseMint, account.data.launchType);
}
```

{% callout type="note" %}
`launchType`은 런칭 생성 후 백엔드 크랭크에 의해 소급적으로 설정됩니다. 최근 생성된 런칭은 크랭크가 처리할 때까지 `LaunchType.Uninitialized`(0)을 표시할 수 있습니다.
{% /callout %}

### 버킷 및 예치 {% #buckets-and-deposits %}

| 함수 | 반환값 |
|----------|---------|
| fetchLaunchPoolBucketV2() | 버킷 상태 (없으면 오류 발생) |
| safeFetchLaunchPoolBucketV2() | 버킷 상태 또는 `null` |
| fetchPresaleBucketV2() | 버킷 상태 (없으면 오류 발생) |
| safeFetchPresaleBucketV2() | 버킷 상태 또는 `null` |
| fetchUnlockedBucketV2() | Unlocked 버킷 상태 |
| fetchRaydiumCpmmBucketV2() | Raydium CPMM 버킷 상태 |
| fetchClaimScheduleBucketV2() | 청구 스케줄 버킷 상태 |
| fetchLaunchPoolDepositV2() | 예치 상태 (없으면 오류 발생) |
| safeFetchLaunchPoolDepositV2() | 예치 상태 또는 `null` |
| fetchPresaleDepositV2() | 예치 상태 (없으면 오류 발생) |
| safeFetchPresaleDepositV2() | 예치 상태 또는 `null` |

```typescript
const bucket = await fetchLaunchPoolBucketV2(umi, bucketPda);
const deposit = await safeFetchLaunchPoolDepositV2(umi, depositPda); // null if not found
const raydiumBucket = await fetchRaydiumCpmmBucketV2(umi, raydiumBucketPda);
console.log(raydiumBucket.graduateCondition.triggeredTimestamp); // Some(t) once graduated
```

**버킷 상태 필드:** `quoteTokenDepositTotal`, `weightedQuoteTokenTotal`, `depositCount`, `claimCount`, `refundCount`, `bucket.baseTokenAllocation`, `extensions`

**예치 상태 필드:** `amountQuoteToken`, `weightedQuoteToken`, `claimed`, `refunded`

---

## 타입 {% #types %}

아래 타입은 Genesis 명령어 전반에서 사용되는 인수 및 계정 형태입니다. 모든 타입은 `@metaplex-foundation/genesis`에서 export됩니다.

### LaunchPoolV2Extensions

Launch Pool 버킷의 선택적 가드이며 `bucket.extensions`에서 읽습니다. 모든 필드는 Umi `Option`이므로 값을 읽기 전에 `unwrapOption()`을 사용하거나 `.__option`을 확인하세요.

```typescript
{
  backendSigner: Option<BackendSigner>;
  depositPenalty: Option<LinearBpsScheduleV2>;
  withdrawPenalty: Option<LinearBpsScheduleV2>;
  bonusSchedule: Option<LinearBpsScheduleV2>;
  depositLimit: Option<DepositLimit>;                             // { limit: bigint }
  allowlist: Option<Allowlist>;
  claimSchedule: Option<ClaimSchedule>;
  minimumDepositAmount: Option<MinimumDepositAmount>;             // { amount: bigint }
  minimumQuoteTokenThreshold: Option<MinimumQuoteTokenThreshold>; // { amount: bigint } - floor
  softCap: Option<SoftCap>;                                       // { amount: bigint } - ceiling
}
```

확장은 `addLaunchPoolBucketV2Extensions()`와 `removeLaunchPoolBucketV2Extensions()`로 개별적으로 추가하거나 제거할 수 있으며, `LaunchPoolV2ExtensionType`으로 필드를 선택합니다. 두 명령어 모두 Genesis 계정이 최종화된 후에는 거부됩니다.

### LaunchType

백엔드 크랭크가 `setLaunchTypeV2` 명령어를 통해 소급적으로 설정하는 온체인 런칭 타입입니다. 런칭 타입은 런칭에 사용된 기반 메커니즘을 나타냅니다.

```typescript
enum LaunchType {
  Uninitialized = 0,   // Not yet set by the crank
  LaunchPoolV1 = 3,    // Launch pool (proportional distribution)
}
```

[Metaplex API](/ko/api)에서는 문자열(`'launchpool'`)로 반환되지만, 온체인 SDK에서는 위의 숫자 열거형을 사용합니다.

### GenesisAccountV2

Genesis 런칭의 최상위 온체인 계정입니다. 토큰 민트당, 런칭 인덱스당 하나의 계정이 존재합니다.

```typescript
{
  key: Key;
  bump: number;
  index: number;                          // Genesis index (usually 0)
  finalized: boolean;                     // true after finalizeV2()
  authority: PublicKey;                    // Launch creator
  baseMint: PublicKey;                     // Token being launched
  quoteMint: PublicKey;                    // Deposit token (e.g., wSOL)
  totalSupplyBaseToken: bigint;            // Total token supply
  totalAllocatedSupplyBaseToken: bigint;   // Supply allocated to buckets
  totalProceedsQuoteToken: bigint;         // Total deposits collected
  fundingMode: number;                     // Funding mode (0)
  launchType: number;                      // 0 = Uninitialized, 3 = LaunchPoolV1
  bucketCount: number;                     // Number of buckets
}
```

계정 크기: **136바이트**. PDA 시드: `["genesis_v2", baseMint, genesisIndex]`.

### TimeCondition

`TimeCondition`(SDK 타입 `ConditionArgs`)은 충족되면 `triggeredTimestamp`를 기록하는 64바이트 타이밍 규칙입니다. 변형마다 `padding` 길이가 다르므로 직접 작성하지 말고 SDK 헬퍼로 조건을 생성하세요.

| 변형 | SDK 헬퍼 | 충족 시점 | 자체 해결 여부 | `padding` |
|---------|------------|----------|-----------------|-----------|
| `TimeAbsolute` | `createTimeAbsoluteCondition(time)` | 시계가 `time`에 도달함 | 예. 명령어가 확인할 때마다 해결됨 | 47 |
| `TimeRelative` | `createTimeRelativeCondition(bucket, bucketTime, timeOffset?)` | 참조 버킷 이벤트 + `timeOffset`이 경과함 | 아니요. `triggerConditionsV2`를 통해서만 해결됨 | 14 |
| `Triggered` | `createTriggeredCondition()` | 프로그램이 발동시킴 (졸업, 본딩 커브 매진, 프리세일 매진) | 해당 이벤트를 일으킨 명령어가 발동시킴 | 55 |
| `TriggeredWithExpiry` | `createTriggeredWithExpiryCondition(expiryTime)` | 프로그램 트리거 또는 `expiryTime` 중 먼저 오는 시점 | 예. `expiryTime` 이후 해결됨 | 47 |
| `Never` | `createNeverCondition()` | 충족되지 않음 | 해당 없음 | 55 |
| `Always` | 없음. 직접 구성 | 항상 충족됨 | 해당 없음. 타임스탬프를 기록하지 않음 | 55 |

```typescript {% title="conditions.ts" %}
import {
  BucketTimes,
  createNeverCondition,
  createTimeAbsoluteCondition,
  createTimeRelativeCondition,
  createTriggeredCondition,
  createTriggeredWithExpiryCondition,
} from '@metaplex-foundation/genesis';

// TimeAbsolute: { __kind, padding: Array(47), time, triggeredTimestamp: null }
const depositStart = createTimeAbsoluteCondition(1767225600n);

// TimeRelative: { __kind, bucketTime, padding: Array(14), timeOffset, bucket, triggeredTimestamp: null }
const claimStart = createTimeRelativeCondition(raydiumBucket, BucketTimes.Graduate, 0n);

// Triggered: { __kind, padding: Array(55), triggeredTimestamp: null }
const lpLockStart = createTriggeredCondition();

// TriggeredWithExpiry: { __kind, padding: Array(47), expiryTime, triggeredTimestamp: null }
const presaleEnd = createTriggeredWithExpiryCondition(1767830400n);

// Never: { __kind, padding: Array(55), triggeredTimestamp: null }
const lockedForever = createNeverCondition();

// Always (no helper)
const always = { __kind: 'Always', padding: Array(55).fill(0), triggeredTimestamp: null };
```

#### TimeRelative 버킷 시간 {% #time-relative-bucket-times %}

`TimeRelative` 조건은 참조 버킷의 이벤트 하나에 고정되며, 이 이벤트는 `BucketTimes` 열거형으로 선택합니다.

| `BucketTimes` | 참조 버킷 타입 |
|---------------|------------------------|
| `DepositStart`, `DepositEnd` | Launch Pool, Presale |
| `ClaimStart`, `ClaimEnd` | Launch Pool, Presale, Unlocked |
| `SwapStart`, `SwapEnd` | 본딩 커브 |
| `GraduateStart` | Raydium CPMM (해당 버킷의 `startCondition`) |
| `Graduate` | Raydium CPMM (풀이 생성될 때 발동) |

`BucketTimes`는 잠금 버킷용 `LockStart`와 `LockEnd`도 정의합니다. 참조 버킷 타입에 없는 `bucketTime`을 사용하면 조건이 해결될 때 `InvalidPrimaryBucket`이 반환됩니다.

#### 조건 슬롯 {% #condition-slots %}

버킷의 각 조건 필드는 일부 변형만 허용하며, 그 외의 변형은 프로그램이 `InvalidConditionTypeForSlot`으로 거부합니다.

| 슬롯 | 허용되는 변형 |
|------|------------------|
| 예치 시작, Unlocked 청구 시작, Raydium `startCondition`, 청구 스케줄 `claimStartCondition` | `TimeAbsolute`, `TimeRelative`, `Always` |
| Launch Pool 및 Presale `claimStartCondition` | `TimeAbsolute`, `TimeRelative` |
| 예치 종료, 청구 종료 | `TimeAbsolute`, `TimeRelative`, `Never` |
| Presale `depositEndCondition` | 종료 슬롯 변형 및 `Triggered`, `TriggeredWithExpiry` |
| `ClaimSchedule` 시작 및 클리프 | `TimeAbsolute`, `TimeRelative`, `Never` |
| Raydium `lpLockSchedule` 시작 및 클리프 | `ClaimSchedule` 변형 및 `Triggered` (졸업 시 발동) |

### EndBehavior

`EndBehavior`(SDK 타입 `BehaviorArgs`)는 소스 버킷에 저장되는 동작으로, 소스 버킷이 종료된 후 쿼트 토큰, 베이스 토큰, 가격, 또는 실패 플래그를 대상 버킷으로 이동합니다. 항상 `processed: false`를 전달하세요. 이미 처리된 상태의 동작은 `BehaviorAlreadyProcessed`를 반환합니다.

| 변형 | 대상 버킷에 대한 효과 | 허용되는 소스 버킷 | `padding` |
|---------|---------------------------|------------------------|-----------|
| `SendQuoteTokenPercentage` | 소스의 쿼트 수익 중 `percentageBps`만큼 전송 | Launch Pool, Presale, 본딩 커브 | 4 |
| `SendStartPrice` | 판매의 최종 가격을 Raydium 풀 시작 가격으로 기록 | Launch Pool, Presale, 본딩 커브 | 6 |
| `BaseTokenRollover` | 남은 베이스 토큰 중 `percentageBps`만큼 전송 | Presale, Raydium CPMM, Raydium CLMM | 4 |
| `ReallocateBaseTokensOnFailure` | 실패 시에만: 남은 베이스 토큰 중 `percentageBps`만큼 전송 | Launch Pool, Presale, Raydium CPMM, Raydium CLMM | 4 |
| `TransmitFailure` | 실패 시에만: 대상 버킷을 실패로 표시 | Launch Pool, Presale | 6 |
| `ReallocateBaseTokensOnCancel` | 취소되었거나 완료된 베스팅 버킷의 베스팅되지 않은 잔여분 전송 | 청구 스케줄 | 6 |

```typescript {% title="endBehaviors.ts" %}
const endBehaviors = [
  { __kind: 'SendQuoteTokenPercentage', padding: Array(4).fill(0), destinationBucket, percentageBps: 8_000, processed: false },
  { __kind: 'SendStartPrice', padding: Array(6).fill(0), destinationBucket, processed: false },
  { __kind: 'BaseTokenRollover', padding: Array(4).fill(0), destinationBucket, percentageBps: 10_000, processed: false },
  { __kind: 'ReallocateBaseTokensOnFailure', padding: Array(4).fill(0), destinationBucket, percentageBps: 10_000, processed: false },
  { __kind: 'TransmitFailure', padding: Array(6).fill(0), destinationBucket, processed: false },
  { __kind: 'ReallocateBaseTokensOnCancel', padding: Array(6).fill(0), destinationBucket, processed: false },
];
```

`percentageBps`는 베이시스 포인트를 사용하며, `10_000`이 100%입니다. 예치가 `minimumQuoteTokenThreshold` 미만으로 종료된 Launch Pool 또는 Presale은 실패 동작(`ReallocateBaseTokensOnFailure`, `TransmitFailure`)만 실행하며, 쿼트 토큰은 환불을 위해 버킷에 남습니다. Raydium CPMM 버킷을 대상으로 하는 `TransmitFailure`는 해당 버킷의 졸업 소스에서 와야 합니다(`TransmitFailureSourceMismatch`).

### Raydium CPMM 확장 타입 {% #raydium-cpmm-extension-types %}

`RaydiumCpmmV2ExtensionType`은 `addRaydiumCpmmBucketV2Extensions()`와 `removeRaydiumCpmmBucketV2Extensions()`에서 Raydium CPMM 버킷 확장을 선택하며, 두 명령어 모두 최종화 후에는 거부됩니다.

```typescript
enum RaydiumCpmmV2ExtensionType {
  BackendSigner,     // { signer: PublicKey }
  LpLockSchedule,    // ClaimSchedule
  CreatorFee,        // { wallet: PublicKey }
  PostponableStart,  // PostponableStart
  LpClaimAuthority,  // PublicKey
  BurnLp,            // burn all LP at graduation
}
```

---

## 상수 {% #constants %}

프로그램 및 Genesis가 허용하는 Raydium 계정에 대한 상수가 `@metaplex-foundation/genesis`에서 export됩니다.

| 상수 | 값 |
|----------|-------|
| `GENESIS_PROGRAM_ID` | `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` |
| `WRAPPED_SOL_MINT` | `So11111111111111111111111111111111111111112` |
| `RAYDIUM_CP_SWAP_PROGRAM_ID_MAINNET` | `CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C` |
| `RAYDIUM_CP_SWAP_PROGRAM_ID_DEVNET` | `DRaycpLY18LhpbydsBWbVJtxpNv9oXPgjRSfpF2bWpYb` |
| `RAYDIUM_AMM_CONFIG_MAINNET` | `Bq9YmSkZ6f13L4rPsx9MxSXuyPfKCBbvrbvarKti1LdG` |
| `RAYDIUM_AMM_CONFIG_CREATOR_FEE_MAINNET` | `CRRS5ieQmBrZjWhcj99JuGrT5tyuWDaGAXLXLFjbAtjQ` |

---

## 일반 오류 {% #common-errors %}

Genesis 프로그램 오류는 트랜잭션 로그와 SDK가 던지는 `ProgramError`에서 이름(및 숫자 코드)으로 표시됩니다.

### 공통 오류 {% #general-errors %}

| 오류 | 원인 |
|-------|-------|
| `insufficient funds` | 수수료를 위한 SOL 부족 |
| `already initialized` | Genesis 계정이 이미 존재 |
| `GenesisAccountFinalized` (43) | `finalizeV2()` 이후 버킷, 확장, 또는 동작을 변경함 |
| `deposit period not active` | 예치 기간 외 |
| `ClaimNotStarted` (22) | 청구 시작 조건이 충족되지 않았거나, `TimeRelative` 청구 시작이 아직 트리거되지 않음 |
| `InvalidSoftCap` (221) | `softCap.amount`가 0입니다 — `{ amount: 0n }` 대신 `softCap: null`을 전달하세요 |
| `SoftCapBelowThreshold` (222) | `softCap.amount`가 `minimumQuoteTokenThreshold.amount`보다 작습니다 |
| `LaunchPoolNotEnded` (25) | 예치 기간이 끝나기 전에 `refundLaunchPoolV2()` 또는 `triggerBehaviorsV2()`를 호출함 |
| `LaunchPoolThresholdMet` (173) | 최소 임계값을 충족하고 소프트 캡을 초과하지 않았는데 환불을 요청함 |
| `DepositAlreadyRefunded` (177) | 같은 예치금에 대해 `refundLaunchPoolV2()`를 두 번 호출함 |
| `RecipientMismatch` (39) | 청구의 `recipient`가 버킷에 저장된 수신자와 다름 |
| `UnlockedBucketAlreadyClaimed` (51) | 남은 베이스 또는 쿼트 잔액이 없는 상태에서 `claimUnlockedV2()`를 호출함 |
| `NothingToClaim` (233) | 베스팅된 토큰이 없는 상태에서 `claimClaimScheduleV2()`를 호출함 |
| `MissingBackendSigner` (145) / `InvalidBackendSigner` (69) | 버킷에 백엔드 서명자 확장이 있는데 해당 서명자가 공동 서명하지 않음. 키를 분실했다면 `setBucketBackendSignerV2`로 교체하세요 |

### 조건 오류 {% #condition-errors %}

| 오류 | 원인 |
|-------|-------|
| `InvalidConditionTypeForSlot` (204) | 해당 슬롯에서 허용되지 않는 조건 변형. [조건 슬롯](#condition-slots)을 참조하세요 |
| `InvalidPrimaryBucket` (149) | `TimeRelative`의 `bucketTime`이 참조 버킷 타입에 존재하지 않음 |
| `UninitializedCondition` (203) | 조건이 0으로 채워진 채 남아 있음. SDK 헬퍼로 생성하세요 |
| `InvalidConditionExpiry` (232) | `TriggeredWithExpiry`의 `expiryTime`이 0이거나 범위를 벗어남 |
| `ClaimScheduleConditionNotTriggered` (241) | 취소 정리(cancel sweep)를 실행하려면 `TimeRelative` 청구 스케줄 조건이 먼저 트리거되어야 함 |

### 졸업 및 동작 오류 {% #graduation-and-behavior-errors %}

| 오류 | 원인 |
|-------|-------|
| `GraduationNotStarted` (189) | Raydium 버킷의 `startCondition`이 충족되지 않음. `TimeRelative` 시작은 먼저 트리거하세요 |
| `BucketLaunchFailed` (262) | Raydium 버킷에 자금을 공급하는 판매가 실패함 (`TransmitFailure` 수신) |
| `BucketAlreadyGraduated` (188) | 졸업 후 `graduateToRaydiumCpmmV2()` 또는 연기를 호출함 |
| `InvalidRaydiumAmmConfig` (202) | AMM 설정이 승인된 Raydium 설정이 아니거나, 수수료 수집 명령어에 맞지 않는 설정임 |
| `InvalidCreatorFeeConfig` (216) | `creatorFee` 확장과 창작자 수수료 AMM 설정이 일치하지 않음 |
| `InvalidPoolStatePda` (219) | `poolState`가 `deriveRaydiumPDAsV2`로 도출되지 않음 |
| `NoLpTokensToClaim` (200) | 졸업 전에 LP 청구 또는 소각을 시도함 |
| `InvalidLpClaimAuthority` (201) | LP 청구 또는 소각에 LP 청구 권한자가 서명하지 않음 |
| `InsufficientUnlockedAmount` (199) | 언락된 LP 토큰이 없는 상태에서 LP를 청구함 |
| `BurnLpConflictsWithLpLockSchedule` (263) | `burnLp: true`를 `lpLockSchedule`과 함께 사용함 |
| `MissingRaydiumGraduationSource` (270) | Raydium 버킷이 정확히 하나의 `SendQuoteTokenPercentage`와 하나의 `SendStartPrice`의 대상이 아님 |
| `DuplicateRaydiumGraduationSource` (271) | 둘 이상의 판매 버킷이 같은 Raydium 버킷을 대상으로 함 |
| `RaydiumGraduationSourceMismatch` (272) | 쿼트 토큰과 시작 가격이 서로 다른 소스 버킷에서 옴 |
| `StartPriceAlreadySet` (273) | `SendStartPrice`가 이미 대상 버킷의 가격을 기록함 |
| `BehaviorNotSupportedForBucketType` (175) | 소스 버킷 타입에서 허용되지 않는 동작 변형 |
| `BehaviorPercentageOverflow` (168) | `SendQuoteTokenPercentage`, `BaseTokenRollover`, 또는 `ReallocateBaseTokensOnFailure`의 합계가 10,000 bps를 초과함 |
| `ClaimScheduleMultipleCancelBehaviors` (240) | 청구 스케줄 버킷에 `ReallocateBaseTokensOnCancel`이 둘 이상 있음 |
| `BehaviorAlreadyProcessed` (247) | 동작이 `processed: true`로 작성됨 |
| `InvalidRemainingAccountsLength` (198) | `triggerBehaviorsV2`의 remaining accounts가 (버킷, 쿼트 토큰 계정) 쌍으로 구성되지 않음 |
| `InvalidBucketState` (46) | 졸업도 실패도 하지 않은 Raydium 버킷에 대해 `triggerBehaviorsV2`를 호출함 |
| `PostponeLimitReached` (225) – `BucketNotPostponable` (231) | `postponeStartRaydiumCpmmBucketV2`가 정책 한도를 벗어남 |

---

## 참고 사항 {% #notes %}

- `TimeRelative` 조건은 `triggerConditionsV2`를 통해서만 해결됩니다. 졸업은 Raydium 버킷 자신의 `graduateCondition`을 발동시키지만, 이를 참조하는 다른 버킷의 조건은 건드리지 않습니다.
- `triggerConditionsV2`, `triggerBehaviorsV2`, `graduateToRaydiumCpmmV2`는 `assert_signer(payer)`만 확인하므로, 프로젝트 백엔드, 키퍼 봇, 또는 어떤 사용자 지갑이든 런칭 라이프사이클을 실행할 수 있습니다. Raydium 버킷에 백엔드 서명자 확장이 있으면 졸업에는 백엔드 서명자도 추가로 필요합니다.
- 종료 동작, 조건, 확장은 `finalizeV2`로 고정되며, 두 가지 예외가 있습니다. `postponeStartRaydiumCpmmBucketV2`는 `postponableStart`로 생성된 버킷의 졸업 시작 시점을 이동하고, `setBucketBackendSignerV2`는 기존 백엔드 서명자를 교체하거나 해제합니다.
- Raydium CLMM 졸업(`addRaydiumClmmBucketV2`, `graduateToRaydiumClmmV2`)은 SDK에 존재하지만 이 페이지에서는 다루지 않습니다.
- `@metaplex-foundation/genesis` 0.44.0 및 배포된 Genesis 프로그램 릴리스 `genesis v0.41.0`(커밋 `86eb6121`) 기준으로 검증되었습니다. 배포된 프로그램은 Token-2022 베이스 민트를 지원하지 않습니다. 소스: [metaplex-foundation/genesis](https://github.com/metaplex-foundation/genesis). Metaplex Foundation이 관리하며, 마지막 검증일은 2026-11-24입니다.

---

## 빠른 참조 {% #quick-reference %}

| 항목 | 값 |
|------|-------|
| 프로그램 | `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` |
| JS SDK | `@metaplex-foundation/genesis` (0.44.0으로 검증) |
| 프레임워크 | Umi (`@metaplex-foundation/umi`) |
| Raydium CP-Swap (메인넷) | `CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C` |
| 무허가 크랭크 | `triggerConditionsV2`, `triggerBehaviorsV2`, `graduateToRaydiumCpmmV2` |
| 소스 | [GitHub](https://github.com/metaplex-foundation/genesis) |

---

## FAQ {% #faq %}

### Umi란 무엇이며 왜 필요한가요?
Umi는 Solana를 위한 Metaplex의 JavaScript 프레임워크입니다. 트랜잭션 구축, 서명자 관리, Metaplex 프로그램과의 상호작용을 위한 일관된 인터페이스를 제공합니다.

### 브라우저에서 Genesis SDK를 사용할 수 있나요?
네. SDK는 Node.js와 브라우저 환경 모두에서 작동합니다. 브라우저에서는 키페어 파일 대신 지갑 어댑터를 사용해 서명하세요.

### fetch와 safeFetch의 차이점은 무엇인가요?
`fetch`는 계정이 존재하지 않으면 오류를 던집니다. `safeFetch`는 대신 `null`을 반환하며, 계정 존재 여부를 확인하는 데 유용합니다.

### 토큰의 런칭 타입을 어떻게 조회하나요?
토큰의 민트 주소로 `fetchGenesisAccountV2FromSeeds()`를 호출하여 `GenesisAccountV2` 계정을 조회합니다. `launchType` 필드는 `0`(Uninitialized) 또는 `3`(LaunchPoolV1)을 반환합니다. 특정 타입의 모든 런칭을 조회하려면 [GPA 빌더](#gpa-builder-query-by-launch-type)를 사용하세요. 또는 [Metaplex API](/ko/api)가 REST 응답에서 런칭 타입을 문자열로 반환합니다.

### 어떤 지갑이든 호출할 수 있는 Genesis 명령어는 무엇인가요?
`triggerConditionsV2`, `triggerBehaviorsV2`, `graduateToRaydiumCpmmV2`, `collectRaydiumCpmmFeesV2`, `collectRaydiumCpmmFeesWithCreatorFeeV2`, `claimRaydiumCreatorFeeV2`, `claimUnlockedV2`, `claimClaimScheduleV2`는 수수료 지불자의 서명만 필요합니다. 자금은 항상 버킷에 저장된 주소로 이동합니다. 버킷에 백엔드 서명자 확장이 있으면 해당 서명자도 졸업과 청구에 공동 서명해야 합니다.

### Raydium 졸업 후에도 청구가 실패하는 이유는 무엇인가요?
Raydium 버킷의 `Graduate` 시간에 대해 `TimeRelative`인 청구 조건은 졸업이나 청구 자체로는 해결되지 않습니다. 의존하는 각 버킷에 대해 [triggerConditionsV2](#trigger-conditions-v2)를 호출하고, Raydium CPMM 버킷을 쓰기 가능한 remaining account로 전달하세요.

### 트랜잭션 오류를 어떻게 처리하나요?
`sendAndConfirm` 호출을 try/catch 블록으로 감싸고, 오류 이름을 [일반 오류](#common-errors) 표와 대조하세요. 일반적인 오류에는 잔액 부족, 이미 최종화된 계정, 트리거되지 않은 조건, 시작되지 않은 졸업이 포함됩니다.

---

## 다음 단계 {% #next-steps %}

전체 구현 튜토리얼:

- [시작하기](/ko/smart-contracts/genesis/getting-started) - 설정 및 첫 런칭
- [Launch Pool](/ko/smart-contracts/genesis/launch-pool) - 비례 배분
- [Presale](/ko/smart-contracts/genesis/presale) - 고정가 판매
- [Project Vesting](/ko/smart-contracts/genesis/project-vesting) - 청구 스케줄 버킷
- [Locked LP Tokens](/ko/smart-contracts/genesis/locked-lp-tokens) - Raydium LP 잠금 검증
- [Creator Fees](/ko/smart-contracts/genesis/creator-fees) - 창작자 수수료 수집 및 청구
