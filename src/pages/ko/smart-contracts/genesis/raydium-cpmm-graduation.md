---
title: Raydium CPMM 졸업
metaTitle: Genesis Launch Pool을 Raydium CPMM으로 졸업시키기 | Metaplex
description: Genesis Launch Pool 또는 Presale에 Raydium CPMM 버킷을 추가하고, 종료 동작으로 자금을 공급한 뒤, Raydium CP-Swap 풀로 졸업시키고, 잠긴 LP 토큰과 수수료를 관리하는 방법을 설명합니다.
created: '10-29-2026'
updated: '11-24-2026'
keywords:
  - Raydium CPMM graduation
  - RaydiumCpmmBucketV2
  - graduateToRaydiumCpmmV2
  - addRaydiumCpmmBucketV2
  - Genesis liquidity pool
  - LP lock schedule
  - SendStartPrice
  - Raydium CP-Swap
about:
  - Raydium CPMM graduation
  - Genesis liquidity
  - LP token locking
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - 최종화 전에 시작 조건, 할당량, LP 잠금 스케줄을 지정하여 RaydiumCpmmBucketV2를 추가합니다
  - 판매 버킷의 SendQuoteTokenPercentage 및 SendStartPrice 종료 동작이 Raydium 버킷을 대상으로 하도록 설정합니다
  - 예치가 마감된 후 판매 버킷에 대해 triggerBehaviorsV2를 실행합니다
  - graduateToRaydiumCpmmV2를 호출하여 Raydium CP-Swap 풀을 생성합니다
  - 졸업 기준 조건을 트리거하고 사용되지 않은 베이스 토큰을 롤오버합니다
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: graduateToRaydiumCpmmV2는 누가 호출할 수 있나요?
    a: 어떤 지갑이든 호출할 수 있습니다. 졸업에는 수수료 지불자의 서명만 필요하며, Raydium 버킷에 backendSigner 확장이 있으면 백엔드 서명자의 서명도 필요합니다. 버킷의 시작 조건이 충족되고 판매의 종료 동작이 쿼트 토큰과 시작 가격을 전달하면 성공합니다.
  - q: Raydium 풀의 시작 가격은 어떻게 설정되나요?
    a: SendStartPrice 종료 동작이 판매의 최종 가격을 Raydium 버킷에 복사합니다. Launch Pool의 경우 가격은 Launch Pool 베이스 할당량을 총 예치금으로 나눈 값이며, 초과 청약된 경우에는 소프트 캡으로 나눈 값입니다.
  - q: 졸업 후 LP 토큰은 어떻게 되나요?
    a: LP 토큰은 Raydium 버킷 서명자 PDA가 보유합니다. lpLockSchedule이 있으면 시간에 따라 LP 청구 권한자에게 잠금 해제되고, burnLp가 있으면 졸업 시 소각되며, 둘 다 없으면 LP 청구 권한자가 즉시 청구할 수 있습니다.
  - q: Raydium 풀 생성 비용은 얼마인가요?
    a: 풀 생성 비용은 Raydium 풀 계정의 렌트와 0.15 SOL의 Raydium 풀 생성 수수료입니다. addRaydiumCpmmBucketV2의 지불자가 이를 미리 충당하며, deferPoolCreationCost가 true이면 졸업 지불자가 부담합니다.
  - q: 런칭이 시작된 후에 졸업을 지연할 수 있나요?
    a: Raydium 버킷에 postponableStart 확장이 있는 경우에만 가능합니다. 이 경우 Genesis 권한자는 설정된 연기 횟수와 지연 예산 내에서, 예정된 졸업 시점보다 최소 30분 전에 postponeStartRaydiumCpmmBucketV2를 호출할 수 있습니다.
---

Raydium CPMM 버킷은 [Genesis](/ko/smart-contracts/genesis) 판매 수익의 일부를 Raydium CP-Swap 유동성 풀로 전환하며(이 단계를 졸업이라고 합니다), 그 결과로 생긴 LP 토큰을 잠금, 소각, 또는 청구 정책에 따라 보관합니다. {% .lead %}

{% callout title="만들게 될 것" %}
이 가이드는 [Launch Pool](/ko/smart-contracts/genesis/launch-pool) 런칭에 `RaydiumCpmmBucketV2`를 추가하고, 모금된 SOL의 20%를 해당 버킷으로 보낸 뒤, Raydium 풀로 졸업시키고, LP 토큰을 분기별 잠금 해제와 함께 1년 동안 잠급니다.
{% /callout %}

## 요약 {% #summary %}

`RaydiumCpmmBucketV2`는 판매 버킷으로부터 쿼트 토큰과 시작 가격을 받으며, 이후 `graduateToRaydiumCpmmV2`가 해당 가격으로 그에 맞는 양의 베이스 토큰과 함께 Raydium CP-Swap 풀을 생성합니다.

- 판매 버킷은 `SendQuoteTokenPercentage` 및 `SendStartPrice` [종료 동작](/ko/smart-contracts/genesis/end-behaviors)으로 졸업에 필요한 자금을 공급합니다
- 졸업은 버킷의 `Graduate` 시간을 발동시키는 무허가(permissionless) 크랭크이며, 다른 버킷은 [`TimeRelative` 조건](/ko/smart-contracts/genesis/conditions)으로 이 시간을 참조할 수 있습니다
- LP 토큰은 스케줄에 따라 잠그거나, 소각하거나, 청구 가능한 상태로 둘 수 있습니다
- Genesis V2 Raydium CPMM 버킷에 적용되며, V1 `graduateToRaydiumCpmmV1` 흐름이나 Raydium CLMM 버킷에는 적용되지 않습니다

**바로 가기:** [라이프사이클](#raydium-cpmm-graduation-lifecycle) · [버킷 추가](#adding-a-raydium-cpmm-bucket) · [자금 공급](#funding-the-raydium-bucket-from-the-sale) · [졸업](#graduating-to-a-raydium-cp-swap-pool) · [LP 토큰](#managing-raydium-lp-tokens) · [수수료](#collecting-raydium-pool-fees) · [참조](#quick-reference)

## Raydium CPMM 졸업 라이프사이클 {% #raydium-cpmm-graduation-lifecycle %}

Raydium CPMM 버킷은 `Initialized`, `Funded`, `Graduated`, 또는 실패의 네 가지 상태를 거칩니다.

| 단계 | 명령어 | 실행 주체 | 결과 |
|------|-------------|-----|--------|
| 1. 버킷 추가 | `addRaydiumCpmmBucketV2` | Genesis 권한자, `finalizeV2` 전 | 버킷과 버킷 서명자 PDA 생성, 풀 생성 비용 선충당 |
| 2. 버킷에 자금 공급 | 판매 버킷에 대한 `triggerBehaviorsV2` | 누구나, 예치 마감 후 | 쿼트 토큰과 시작 가격 전달 |
| 3. 시작 조건 해결 | Raydium 버킷에 대한 `triggerConditionsV2` | 누구나. `TimeRelative` 시작인 경우에만 필요 | `startCondition` 해결 |
| 4. 졸업 | `graduateToRaydiumCpmmV2` | 누구나, 시작 조건 충족 후 | Raydium 풀 생성, `Graduate` 시간 기록 |
| 5. 후속 작업 | Raydium 버킷에 대한 `triggerBehaviorsV2`, 의존하는 버킷에 대한 `triggerConditionsV2` | 누구나 | 사용되지 않은 베이스 토큰 롤오버, 졸업 기준 청구 열림 |

{% callout type="note" %}
졸업은 Raydium CP-Swap(CPMM) 풀을 생성합니다. Raydium CLMM 졸업은 자체 명령어를 가진 별도의 `RaydiumClmmBucketV2`를 사용하며, 여기서는 다루지 않습니다.
{% /callout %}

## Raydium CPMM 버킷 추가하기 {% #adding-a-raydium-cpmm-bucket %}

`addRaydiumCpmmBucketV2`는 `finalizeV2` 전에 버킷을 생성하고, 할당량, 졸업 시작, LP 정책, 종료 동작을 고정합니다.

{% code-tabs-imported from="genesis/add_raydium_cpmm_bucket_v2" frameworks="umi" filename="addRaydiumCpmmBucketV2" /%}

### Raydium 버킷 인수 {% #raydium-bucket-arguments %}

| 인수 | 필수 | 설명 |
|----------|----------|-------------|
| `baseTokenAllocation` | 예 | 풀이 받을 수 있는 최대 베이스 토큰. 판매 할당량 × 이 버킷으로 보내는 수익 비율로 정함 |
| `startCondition` | 예 | 졸업을 실행할 수 있는 가장 이른 시점. 시작 슬롯: `TimeAbsolute`, `TimeRelative`, 또는 `Always` |
| `bucketIndex` | 아니요 | PDA 시드 `["raydium_cpmm_v2", genesisAccount, bucketIndex]`의 인덱스. 기본값 `0` |
| `lpLockSchedule` | 아니요 | 시간에 따라 LP 토큰을 잠금 해제하는 `ClaimSchedule`. `burnLp`와 함께 사용할 수 없음 |
| `burnLp` | 아니요 | `true`이면 졸업 시 모든 LP 토큰을 소각하여 유동성을 영구적으로 잠금 |
| `lpClaimAuthority` | 아니요 | LP 토큰을 청구하거나 소각할 수 있는 지갑. `null`이면 Genesis 권한자 |
| `creatorFee` | 아니요 | Raydium 창작자 수수료의 일부를 받을 `{ wallet }`. 졸업 시 사용되는 AMM 설정이 달라짐 |
| `postponableStart` | 아니요 | 최종화 후 Genesis 권한자가 졸업을 지연할 수 있게 함. `TimeAbsolute` 시작, 또는 판매의 `DepositEnd`나 `SwapEnd`에 고정된 `TimeRelative` 시작이 필요함 |
| `backendSigner` | 아니요 | 졸업과 LP 청구 또는 소각에 필요한 추가 공동 서명자. Genesis 권한자가 나중에 `setBucketBackendSignerV2`로 교체하거나 해제할 수 있음 |
| `deferPoolCreationCost` | 아니요 | `false`(기본값)이면 이 지불자가 풀 생성 비용을 미리 충당하고, `true`이면 졸업 지불자에게 부과함 |
| `endBehaviors` | 아니요 | 보통 사용되지 않은 베이스 토큰을 Unlocked 버킷으로 보내는 `BaseTokenRollover` |

{% callout type="warning" %}
`finalizeV2` 전에 모든 버킷 할당량의 합계가 Genesis 총 공급량과 일치해야 합니다. Raydium 할당량은 나중에 일부가 롤오버되더라도 이 합계에 포함됩니다.
{% /callout %}

## 판매에서 Raydium 버킷에 자금 공급하기 {% #funding-the-raydium-bucket-from-the-sale %}

판매 버킷은 두 가지 종료 동작을 통해 Raydium 버킷에 자금을 공급하며, 두 동작 모두 Raydium 버킷을 대상으로 해야 합니다. 쿼트 토큰에는 `SendQuoteTokenPercentage`를, 가격에는 `SendStartPrice`를 사용합니다.

{% totem %}

```typescript {% title="launchPoolEndBehaviors.ts" %}
endBehaviors: [
  {
    __kind: 'SendQuoteTokenPercentage',
    padding: Array(4).fill(0),
    destinationBucket: raydiumBucket,
    percentageBps: 2_000, // 20% of proceeds become pool liquidity
    processed: false,
  },
  {
    __kind: 'SendStartPrice',
    padding: Array(6).fill(0),
    destinationBucket: raydiumBucket,
    processed: false,
  },
  {
    __kind: 'SendQuoteTokenPercentage',
    padding: Array(4).fill(0),
    destinationBucket: treasuryBucket, // Unlocked bucket
    percentageBps: 8_000,
    processed: false,
  },
]
```

{% /totem %}

판매의 예치 기간이 마감되면 누구나 판매 버킷에 대해 `triggerBehaviorsV2`를 실행할 수 있습니다. 각 대상 버킷을 해당 쿼트 토큰 계정과 함께 전달하세요. Raydium 버킷의 쿼트 계정은 해당 버킷 서명자 PDA가 소유합니다.

{% code-tabs-imported from="genesis/trigger_launch_pool_graduation_v2" frameworks="umi" filename="triggerBehaviorsV2" /%}

### Raydium 풀 시작 가격 {% #raydium-pool-starting-price %}

풀은 판매의 최종 가격으로 시작하며, 이 가격은 쿼트 토큰당 베이스 토큰 수인 `priceNumerator / priceDenominator`로 저장됩니다.

| 판매 버킷 | 시작 가격 |
|-------------|-------------|
| Launch Pool | `baseTokenAllocation / min(quoteTokenDepositTotal, softCap)` |
| Presale | `baseTokenAllocation / allocationQuoteTokenCap` |
| 본딩 커브 | 매진 시점의 현재 커브 가격 |

졸업은 `quoteTokenInSigner × priceNumerator / priceDenominator`개의 베이스 토큰을 쿼트 토큰과 짝짓습니다. Launch Pool은 기본적으로 수수료 없이 수익을 전달하므로, 판매 할당량 × 이 버킷으로 보내는 비율로 정한 Raydium 할당량은 전부 짝지어집니다. 반올림 잔여분이나 판매 버킷의 수수료 재정의 효과처럼 졸업에 사용되지 않은 베이스 토큰은 [`BaseTokenRollover`](/ko/smart-contracts/genesis/end-behaviors#recovering-unused-raydium-base-tokens-with-base-token-rollover)가 옮길 때까지 Genesis에 남습니다.

## Raydium CP-Swap 풀로 졸업하기 {% #graduating-to-a-raydium-cp-swap-pool %}

`graduateToRaydiumCpmmV2`는 Raydium CP-Swap 풀을 생성하고, 짝지어진 토큰을 예치한 뒤, 버킷의 `Graduate` 시간을 기록합니다.

이 명령어는 무허가(permissionless)입니다. 버킷의 `startCondition`이 충족되고 버킷이 쿼트 토큰과 시작 가격을 보유하면 어떤 지갑이든 비용을 지불하고 실행할 수 있습니다. `deriveRaydiumPDAsV2`는 이 명령어에 필요한 모든 Raydium 계정을 도출합니다.

{% code-tabs-imported from="genesis/graduate_to_raydium_cpmm_v2" frameworks="umi" filename="graduateToRaydiumCpmmV2" /%}

{% callout type="note" %}
졸업에는 컴퓨트 유닛 한도를 약 400,000으로 높이세요. 데브넷에서는 `deriveRaydiumPDAsV2`에 `{ env: 'devnet' }`을 전달하고, 버킷에 `creatorFee` 확장이 있으면 그에 맞는 AMM 설정이 사용되도록 `{ creatorFee: true }`를 전달하세요.
{% /callout %}

### 졸업으로 온체인에서 변경되는 사항 {% #what-graduation-changes-onchain %}

졸업은 Raydium 버킷을 업데이트하고, 이에 의존하는 조건을 발동시킵니다.

- 풀 상태 계정은 Genesis가 도출한 PDA(`["raydium_pool_state", raydiumBucket]`)이므로 누구도 풀 생성을 선점(front-run)할 수 없습니다.
- `graduatedBaseTokenAmount`는 풀에 짝지어 들어간 베이스 토큰을, `lpTokenBalance`는 받은 LP 토큰을 기록합니다.
- `graduateCondition.triggeredTimestamp`가 설정되어 `TimeRelative` 조건에서 `BucketTimes.Graduate`를 사용할 수 있게 됩니다.
- `lpLockSchedule`의 `Triggered` 시작 조건이 같은 타임스탬프에 발동합니다.

### 졸업 후 청구 열기 {% #opening-claims-after-graduation %}

청구가 `BucketTimes.Graduate`를 참조하는 버킷은 각 버킷에 대해 Raydium 버킷을 remaining account로 지정하여 `triggerConditionsV2`를 실행한 후에만 열립니다.

{% code-tabs-imported from="genesis/trigger_conditions_after_graduation_v2" frameworks="umi" filename="triggerConditionsV2" /%}

전체 패턴은 [조건 및 트리거](/ko/smart-contracts/genesis/conditions#opening-claims-at-raydium-graduation)를 참조하세요.

### 졸업 연기하기 {% #postponing-graduation %}

`postponeStartRaydiumCpmmBucketV2`를 사용하면 Genesis 권한자가 졸업 시작을 뒤로 미룰 수 있지만, 버킷이 `postponableStart`로 생성된 경우에만 가능합니다.

| `postponableStart` 필드 | 의미 |
|--------------------------|---------|
| `maxPostpones` | 최대 연기 횟수 |
| `delayBudgetSeconds` | 모든 연기에 걸쳐 허용되는 최대 총 지연 시간 |
| `timesPostponed` | `0`을 전달. 프로그램이 연기 횟수를 셈 |

{% code-tabs-imported from="genesis/postpone_start_raydium_cpmm_bucket_v2" frameworks="umi" filename="postponeStartRaydiumCpmmBucketV2" /%}

연기는 현재 예정된 졸업 시점보다 최소 30분 전에 전송해야 하고(`PostponeTooLate`), 시점을 뒤로 이동해야 하며(`PostponeNotLater`), 새 졸업 시점을 최소 24시간 이후로 정해야 하고(`PostponeTooSoon`), 지연 예산을 넘지 않아야 합니다(`PostponeExceedsMaxDelay`). 버킷이 이미 졸업했거나 판매가 실패한 경우에는 실패합니다.

## Raydium LP 토큰 관리하기 {% #managing-raydium-lp-tokens %}

졸업 후 LP 토큰은 Raydium 버킷 서명자 PDA가 소유한 연관 토큰 계정에 보관되며, 버킷의 LP 정책이 누가 언제 이를 가져갈 수 있는지 결정합니다.

| 정책 | 구성 | 결과 |
|--------|---------------|--------|
| 시간 잠금 | `lpLockSchedule` | LP 토큰이 스케줄에 따라 LP 청구 권한자에게 잠금 해제됨 |
| 영구 잠금 | 시작과 클리프가 `Never`인 `lpLockSchedule` (`createNeverClaimSchedule()`) | LP 토큰을 절대 청구할 수 없음 |
| 소각 | `burnLp: true` | 졸업 시 모든 LP 토큰이 소각됨 |
| 청구 가능 | 두 옵션 모두 없음 | LP 청구 권한자가 모든 LP 토큰을 즉시 청구할 수 있음 |

{% code-tabs-imported from="genesis/claim_raydium_cpmm_lp_tokens_v2" frameworks="umi" filename="claimRaydiumCpmmLpTokensV2" /%}

`claimRaydiumCpmmLpTokensV2`는 요청된 `amount`를 스케줄이 잠금 해제한 양까지 전송하며, 잠금 해제된 양이 없으면 `InsufficientUnlockedAmount`로 실패합니다. 이 명령어는 스케줄의 `triggeredTimestamp` 값만 읽습니다. `Triggered` 시작은 졸업 시 발동하지만, `TimeAbsolute` 또는 `TimeRelative` 스케줄 조건은 먼저 Raydium 버킷에 대해 `triggerConditionsV2`를 실행해야 합니다.

LP 청구 권한자는 잠금 스케줄과 관계없이 언제든지 `burnRaydiumCpmmLpTokensV2`를 호출하여 청구되지 않은 LP 토큰을 소각할 수도 있습니다. 온체인에서 잠금을 검증하는 방법은 [Locked LP Tokens](/ko/smart-contracts/genesis/locked-lp-tokens)를 참조하세요.

## Raydium 풀 수수료 수집하기 {% #collecting-raydium-pool-fees %}

Genesis가 생성한 Raydium 풀은 창작자 수수료를 Genesis Raydium 서명자에게 누적하며, 무허가 수집 명령어가 이를 외부로 보냅니다.

| 명령어 | 사용 시점 | 결과 |
|-------------|-------------|--------|
| `collectRaydiumCpmmFeesV2` | 버킷에 `creatorFee` 확장이 없음 | 창작자 수수료가 Genesis 2차 수수료 지갑으로 이동 |
| `collectRaydiumCpmmFeesWithCreatorFeeV2` | 버킷에 `creatorFee` 확장이 있음 | 수수료가 분할되고, 창작자 몫은 버킷에 적립됨 |
| `claimRaydiumCreatorFeeV2` | 창작자 수수료와 함께 수집한 후 | 적립된 창작자 몫을 설정된 지갑으로 지급 |

{% code-tabs-imported from="genesis/collect_raydium_cpmm_fees_v2" frameworks="umi" filename="collectRaydiumCpmmFees" /%}

`creatorFee` 확장이 있으면 `collectRaydiumCpmmFeesWithCreatorFeeV2`로 수집한 다음 `claimRaydiumCreatorFeeV2`로 창작자에게 지급하세요.

{% code-tabs-imported from="genesis/collect_raydium_cpmm_fees_with_creator_fee_v2" frameworks="umi" filename="collectRaydiumCpmmFeesWithCreatorFee" /%}

두 수집 명령어 모두 누적된 수수료가 없으면 전송 없이 성공합니다.

Launch Pool 및 Presale 풀의 거래 수수료율은 [프로토콜 수수료](/ko/smart-contracts/genesis#protocol-fees)에 나와 있습니다.

## 일반적인 Raydium CPMM 오류 {% #common-raydium-cpmm-errors %}

Raydium CPMM 오류는 잘못된 시점에 시도한 졸업, 누락된 자금 공급 단계, 또는 잘못된 서명자의 LP 작업을 나타냅니다.

| 오류 | 원인 | 해결 방법 |
|-------|-------|------------|
| `GraduationNotStarted` | `startCondition`이 충족되지 않음 | 시작 시간까지 대기. `TimeRelative` 시작이면 먼저 `triggerConditionsV2` 실행 |
| `InvalidAmount` | 버킷에 쿼트 토큰이나 시작 가격이 없음 | 먼저 판매 버킷에 대해 `triggerBehaviorsV2` 실행 |
| `BucketAlreadyGraduated` | 풀이 이미 존재함 | 조치 불필요. 후속 단계 진행 |
| `BucketLaunchFailed` | 판매가 임계값에 미달하여 실패를 전달함 | 대신 Raydium 버킷의 실패 동작 실행 |
| `InsufficientFunds` | 버킷 서명자가 풀 생성 비용을 지불할 수 없음 | `deferPoolCreationCost`가 `true`이면 지불자에게 자금 충전 |
| `StartPriceAlreadySet` | 두 번째 판매가 이 버킷에 시작 가격을 보냄 | Raydium 버킷당 판매 버킷 하나 사용 |
| `BurnLpConflictsWithLpLockSchedule` | `burnLp`와 `lpLockSchedule`이 모두 설정됨 | LP 정책 하나 선택 |
| `InsufficientUnlockedAmount` | 아직 잠금 해제된 LP 토큰이 없음 | 다음 잠금 해제까지 대기. 스케줄 조건을 먼저 트리거 |
| `InvalidLpClaimAuthority` | 잘못된 지갑이 LP 청구 또는 소각에 서명함 | LP 청구 권한자로 서명. 설정되지 않았다면 Genesis 권한자로 서명 |
| `MissingBackendSigner` | 버킷에 백엔드 공동 서명자가 필요함 | 설정된 백엔드 서명자를 추가하거나, 분실한 키는 `setBucketBackendSignerV2`로 교체 |

## 빠른 참조 {% #quick-reference %}

| 항목 | 값 |
|------|-------|
| Genesis 프로그램 | `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` |
| Raydium CP-Swap (메인넷) | `CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C` |
| Raydium CP-Swap (데브넷) | `DRaycpLY18LhpbydsBWbVJtxpNv9oXPgjRSfpF2bWpYb` |
| 버킷 PDA 시드 | `"raydium_cpmm_v2"`, Genesis 계정, `bucketIndex` (`u8`) |
| 풀 상태 PDA 시드 | `"raydium_pool_state"`, Raydium 버킷 (Genesis 프로그램) |
| 풀 생성 비용 | Raydium 계정 렌트 + 0.15 SOL 풀 생성 수수료 |
| 졸업 컴퓨트 | 약 400,000 컴퓨트 유닛 |
| 테스트된 SDK | `@metaplex-foundation/genesis@0.44.0` |
| 소스 | [metaplex-foundation/genesis](https://github.com/metaplex-foundation/genesis) |

## 참고 사항 {% #notes %}

- `graduateToRaydiumCpmmV2`, `triggerBehaviorsV2`, `triggerConditionsV2`, 그리고 수수료 수집 명령어는 무허가입니다. 키퍼나 백엔드에서 실행하세요. 자동으로 일어나는 일은 없습니다.
- 졸업은 한 번만 가능합니다. 이미 졸업한 Raydium 버킷으로 보낸 쿼트 토큰은 묶이지 않고 거부됩니다.
- 각 Raydium 버킷에는 정확히 하나의 판매 버킷에서 `SendQuoteTokenPercentage` 하나와 `SendStartPrice` 하나로 자금을 공급하세요.
- `lpLockSchedule`과 `burnLp`는 함께 사용할 수 없습니다.
- 이 페이지의 모든 예제는 실제 Raydium CP-Swap 풀로의 졸업을 포함하여, 데브넷에서 `@metaplex-foundation/genesis@0.44.0`으로 배포된 Genesis 릴리스 `genesis v0.41.0`을 대상으로 실행되었습니다. 데브넷에서는 `deriveRaydiumPDAsV2`에 `{ env: 'devnet' }`을 전달하세요. 배포된 프로그램은 Token-2022 베이스 민트를 지원하지 않습니다.

## FAQ {% #faq %}

### graduateToRaydiumCpmmV2는 누가 호출할 수 있나요?

어떤 지갑이든 호출할 수 있습니다. 졸업에는 수수료 지불자의 서명만 필요하며, Raydium 버킷에 `backendSigner` 확장이 있으면 백엔드 서명자의 서명도 필요합니다. 버킷의 시작 조건이 충족되고 판매의 종료 동작이 쿼트 토큰과 시작 가격을 전달하면 성공합니다.

### Raydium 풀의 시작 가격은 어떻게 설정되나요?

`SendStartPrice` 종료 동작이 판매의 최종 가격을 Raydium 버킷에 복사합니다. Launch Pool의 경우 가격은 Launch Pool 베이스 할당량을 총 예치금으로 나눈 값이며, 초과 청약된 경우에는 소프트 캡으로 나눈 값입니다.

### 졸업 후 LP 토큰은 어떻게 되나요?

LP 토큰은 Raydium 버킷 서명자 PDA가 보유합니다. `lpLockSchedule`이 있으면 시간에 따라 LP 청구 권한자에게 잠금 해제되고, `burnLp`가 있으면 졸업 시 소각되며, 둘 다 없으면 LP 청구 권한자가 즉시 청구할 수 있습니다.

### Raydium 풀 생성 비용은 얼마인가요?

풀 생성 비용은 Raydium 풀 계정의 렌트와 0.15 SOL의 Raydium 풀 생성 수수료입니다. `addRaydiumCpmmBucketV2`의 지불자가 이를 미리 충당하며, `deferPoolCreationCost`가 `true`이면 졸업 지불자가 부담합니다.

### 런칭이 시작된 후에 졸업을 지연할 수 있나요?

Raydium 버킷에 `postponableStart` 확장이 있는 경우에만 가능합니다. 이 경우 Genesis 권한자는 설정된 연기 횟수와 지연 예산 내에서, 예정된 졸업 시점보다 최소 30분 전에 `postponeStartRaydiumCpmmBucketV2`를 호출할 수 있습니다.
