---
title: 종료 동작
metaTitle: Genesis 종료 동작과 triggerBehaviorsV2 | Metaplex
description: Genesis 종료 동작(SendQuoteTokenPercentage, SendStartPrice, BaseTokenRollover, TransmitFailure, 재할당)에 대한 레퍼런스와 무허가(permissionless) 크랭크인 triggerBehaviorsV2를 실행해야 하는 시점을 설명합니다.
created: '10-29-2026'
updated: '11-24-2026'
keywords:
  - Genesis end behaviors
  - triggerBehaviorsV2
  - SendQuoteTokenPercentage
  - SendStartPrice
  - BaseTokenRollover
  - TransmitFailure
  - ReallocateBaseTokensOnFailure
  - token launch proceeds routing
about:
  - Genesis end behaviors
  - Launch proceeds routing
  - Launch failure handling
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Genesis에서 종료 동작이란 무엇인가요?
    a: 종료 동작은 버킷에 저장되는 작업으로, 소스 버킷이 종료된 후 판매 수익을 트레저리나 Raydium 졸업 버킷으로 보내는 것처럼 토큰이나 데이터를 다른 버킷으로 이동합니다. 동작은 누군가 triggerBehaviorsV2를 호출할 때 실행됩니다.
  - q: triggerBehaviorsV2는 누가 호출할 수 있나요?
    a: 어떤 지갑이든 호출할 수 있습니다. triggerBehaviorsV2는 수수료 지불자의 서명만 필요합니다. 프로그램이 각 동작을 처리됨으로 표시하므로 각 동작은 최대 한 번만 실행됩니다.
  - q: Launch Pool이 최소 임계값에 미달하면 종료 동작은 어떻게 되나요?
    a: Launch Pool이 실패 모드에 들어갑니다. ReallocateBaseTokensOnFailure와 TransmitFailure 동작만 실행되므로, 예치된 SOL은 예치자 환불을 위해 버킷에 남습니다.
  - q: 최종화 후에 종료 동작을 변경할 수 있나요?
    a: 아니요. 버킷을 추가할 때 또는 finalizeV2 전에 해당하는 set*BucketV2Behaviors 명령어로 동작을 구성하세요. 프로그램은 최종화 후의 동작 변경을 거부합니다.
  - q: Raydium 졸업 후에 베이스 토큰이 남는 이유는 무엇인가요?
    a: 졸업은 시작 가격에서 쿼트 토큰과 짝을 이루는 데 필요한 베이스 토큰만 이동합니다. Raydium 버킷 할당량의 나머지는 Raydium 버킷의 BaseTokenRollover 동작이 다른 버킷으로 옮길 때까지 Genesis에 남습니다.
---

[Genesis](/ko/smart-contracts/genesis) 종료 동작은 판매 수익을 트레저리나 Raydium 풀로 보내는 것처럼 버킷에 저장되는 단계 이후 작업이며, `triggerBehaviorsV2`는 이를 실행하는 무허가(permissionless) 크랭크입니다. {% .lead %}

## 요약 {% #summary %}

종료 동작은 소스 버킷이 종료되면 쿼트 토큰, 베이스 토큰, 가격, 또는 실패 플래그를 소스 버킷에서 대상 버킷으로 이동합니다.

- 여섯 가지 동작 타입이 수익 라우팅, 졸업 가격 설정, 남은 토큰 처리, 실패 처리를 담당합니다
- 동작은 `finalizeV2` 전에 구성하며, 이후에는 변경할 수 없습니다
- `triggerBehaviorsV2`는 소스 버킷 하나에서 처리되지 않은 모든 동작을 실행하며, 수수료 지불자만 있으면 됩니다
- 최소 임계값에 미달한 판매는 실패 동작만 실행합니다

**바로 가기:** [동작 타입](#genesis-end-behavior-types) · [구성](#configuring-end-behaviors) · [triggerBehaviorsV2](#running-end-behaviors-with-trigger-behaviors-v2) · [졸업 라우팅](#routing-proceeds-to-raydium-graduation) · [실패 처리](#failure-handling-with-transmit-failure)

## Genesis 종료 동작 타입 {% #genesis-end-behavior-types %}

Genesis에는 여섯 가지 종료 동작 타입이 있으며, 각 타입은 특정 소스 버킷 타입에서만 허용됩니다.

| 동작 | 기능 | 허용되는 소스 버킷 |
|----------|--------------|------------------------|
| `SendQuoteTokenPercentage` | 수집된 쿼트 토큰(SOL 등) 중 `percentageBps`만큼 대상으로 전송 | Launch Pool, Presale, 본딩 커브 |
| `SendStartPrice` | 판매의 최종 가격을 Raydium 버킷에 풀 시작 가격으로 기록 | Launch Pool, Presale, 본딩 커브 |
| `BaseTokenRollover` | 남은 베이스 토큰 중 `percentageBps`만큼 대상으로 전송 | Presale, Raydium CPMM, Raydium CLMM |
| `ReallocateBaseTokensOnFailure` | 실패 모드에서만: 남은 베이스 토큰 중 `percentageBps`만큼 대상으로 전송 | Launch Pool, Presale, Raydium CPMM, Raydium CLMM |
| `TransmitFailure` | 실패 모드에서만: 후속 버킷을 실패로 표시 | Launch Pool, Presale |
| `ReallocateBaseTokensOnCancel` | 취소되었거나 완료된 베스팅 버킷의 베스팅되지 않은 잔여분을 대상으로 전송 | 청구 스케줄 |

프로그램은 지원되지 않는 소스 버킷의 동작을 `BehaviorNotSupportedForBucketType`으로 거부합니다.

### 동작 객체 형태 {% #behavior-object-shapes %}

각 동작은 고정된 `padding` 길이를 가진 태그 객체입니다. 구성할 때는 `processed: false`를 전달하세요.

{% totem %}

```typescript {% title="endBehaviors.ts" %}
const endBehaviors = [
  { __kind: 'SendQuoteTokenPercentage', padding: Array(4).fill(0), destinationBucket, percentageBps: 8_000, processed: false },
  { __kind: 'SendStartPrice', padding: Array(6).fill(0), destinationBucket, processed: false },
  { __kind: 'BaseTokenRollover', padding: Array(4).fill(0), destinationBucket, percentageBps: 10_000, processed: false },
  { __kind: 'ReallocateBaseTokensOnFailure', padding: Array(4).fill(0), destinationBucket, percentageBps: 10_000, processed: false },
  { __kind: 'TransmitFailure', padding: Array(6).fill(0), destinationBucket, processed: false },
  { __kind: 'ReallocateBaseTokensOnCancel', padding: Array(6).fill(0), destinationBucket, processed: false },
]
```

{% /totem %}

`percentageBps`는 베이시스 포인트를 사용하며, `10_000`이 100%입니다. 각 `SendQuoteTokenPercentage`는 판매의 총 수익(예치금, 소프트 캡이 설정된 경우 소프트 캡으로 제한)을 기준으로 계산되고, 각 `BaseTokenRollover`는 같은 스냅샷 잔액을 기준으로 계산됩니다. 따라서 `2_000`과 `8_000`인 두 동작은 같은 금액의 20%와 80%를 보냅니다.

## 종료 동작 구성 {% #configuring-end-behaviors %}

종료 동작은 소스 버킷에 해당하는 `set*BucketV2Behaviors` 명령어로 설정하며, Raydium CPMM과 청구 스케줄 버킷은 `add*BucketV2` 명령어에서도 설정할 수 있습니다. 어느 경우든 `finalizeV2` 전에 이루어져야 합니다.

| 소스 버킷 | 생성 시 설정 | 최종화 전 교체 |
|---------------|-----------------|-------------------------|
| Launch Pool | `addLaunchPoolBucketV2Base` 후 `setLaunchPoolBucketV2Behaviors` | `setLaunchPoolBucketV2Behaviors` |
| Presale | `addPresaleBucketV2Base` 후 `setPresaleBucketV2Behaviors` | `setPresaleBucketV2Behaviors` |
| Raydium CPMM | `addRaydiumCpmmBucketV2({ endBehaviors })` | `setRaydiumCpmmBucketV2Behaviors` |
| 청구 스케줄 | `addClaimScheduleBucketV2({ endBehaviors })` | `setClaimScheduleBucketV2Behaviors` |

결합된 `addLaunchPoolBucketV2` 및 `addPresaleBucketV2` 명령어는 Solana의 1,232바이트 트랜잭션 크기 한도를 초과하므로, Launch Pool과 Presale 버킷은 `Base` 명령어로 생성합니다. 대상은 아직 생성되지 않은 버킷이어도 됩니다. 버킷들이 순서에 관계없이 서로를 참조할 수 있도록 `findRaydiumCpmmBucketV2Pda`나 `findUnlockedBucketV2Pda` 등으로 대상의 PDA를 먼저 도출하세요.

{% callout type="warning" %}
동작은 `finalizeV2` 이후 영구적으로 고정됩니다. 최종화 전에 모든 대상 주소와 비율을 확인하세요.
{% /callout %}

## triggerBehaviorsV2로 종료 동작 실행하기 {% #running-end-behaviors-with-trigger-behaviors-v2 %}

`triggerBehaviorsV2`는 소스 버킷 하나(`primaryBucket`)에서 처리되지 않은 모든 동작을 실행하고, 각 동작을 처리됨으로 표시하여 두 번 실행되지 않도록 합니다.

| 속성 | 값 |
|----------|-------|
| 서명자 | 수수료 지불자만 (무허가) |
| 소스 | 명령어당 버킷 하나 (`primaryBucket`) |
| Remaining accounts | 서로 다른 대상마다 `(destination bucket, destination quote token account)` 쌍 하나, 모두 쓰기 가능 |
| 재실행 | 안전함. 처리된 동작은 건너뜀 |

대상 쿼트 토큰 계정은 쿼트 민트의 [연관 토큰 계정(associated token account)](/ko/solana/understanding-solana-accounts#associated-token-accounts-atas)입니다. 이 계정은 대상 버킷 자체가 소유하지만, Raydium 버킷의 경우에는 Raydium 버킷 서명자 PDA(`findRaydiumBucketSignerPda`)가 소유합니다.

{% code-tabs-imported from="genesis/trigger_launch_pool_graduation_v2" frameworks="umi" filename="triggerBehaviorsV2" /%}

### 소스 버킷별 동작 실행 가능 시점 {% #when-each-source-bucket-can-run-behaviors %}

각 소스 버킷 타입은 종료된 후에만 `triggerBehaviorsV2`를 허용합니다.

| 소스 버킷 | 실행 가능 시점 | 너무 이르면 발생하는 오류 |
|---------------|------------|--------------------|
| Launch Pool | `depositEndCondition`이 충족됨 | `LaunchPoolNotEnded` |
| Presale | `depositEndCondition`이 충족됨 | `PresaleBucketNotEnded` |
| 본딩 커브 | `swapEndCondition`이 충족됨 (매진) | `BondingCurveNotEnded` |
| Raydium CPMM | 풀이 졸업했거나 버킷이 실패로 표시됨 | `InvalidBucketState` |
| 청구 스케줄 | `claimEndCondition`이 충족됨 (취소, 베스팅 완료, 또는 전달된 실패) | `ClaimScheduleBucketNotEnded` |

{% callout type="note" %}
팀이 수익을 청구하기 전에 판매 버킷에 대해 `triggerBehaviorsV2`를 실행하세요. 모금된 SOL은 `SendQuoteTokenPercentage` 동작이 실행될 때까지 판매 버킷에 남아 있으며, 그동안에도 예치자는 베이스 토큰을 청구할 수 있습니다.
{% /callout %}

## Raydium 졸업으로 수익 라우팅하기 {% #routing-proceeds-to-raydium-graduation %}

Raydium CPMM 버킷은 자신을 대상으로 하는 `SendQuoteTokenPercentage` 동작과 `SendStartPrice` 동작이 정확히 하나씩 필요하며, 두 동작은 같은 소스 버킷에서 와야 합니다.

`SendQuoteTokenPercentage`는 풀의 쿼트 측을 공급하고, `SendStartPrice`는 베이스 측의 양을 정하는 데 사용되는 비율을 공급합니다. Launch Pool의 시작 가격은 `baseTokenAllocation / quoteTokenDepositTotal`이며, 풀이 초과 청약된 경우에는 예치 총액 대신 소프트 캡 금액을 사용합니다.

졸업 시 풀에 짝지어 들어가는 베이스 토큰은 `quoteTokenInSigner × priceNumerator / priceDenominator`이며, 여기서 `quoteTokenInSigner`는 Raydium 버킷이 실제로 받은 쿼트 금액입니다. Raydium 버킷의 `baseTokenAllocation`은 Launch Pool 할당량에 풀로 보내는 비율을 곱한 값으로 정하세요. 수익의 20%가 풀로 간다면 Launch Pool 할당량의 20%를 사용합니다. Launch Pool은 기본적으로 수수료 없이 수익을 전달하므로(런칭 수수료는 창작자가 수익을 청구할 때 부과됩니다. [프로토콜 수수료](/ko/smart-contracts/genesis#protocol-fees) 참조), 졸업 시 할당량 전체가 짝지어집니다. 그래도 반올림 잔여분이나 판매 버킷의 수수료 재정의로 인해 베이스 토큰이 묶이지 않도록 `BaseTokenRollover` 동작을 추가하세요.

{% callout type="warning" %}
두 개의 판매 버킷이 같은 Raydium 버킷을 대상으로 하지 않도록 하세요. `SendStartPrice`는 대상당 한 번만 기록할 수 있으며, 졸업에는 쿼트 토큰과 가격의 일관된 단일 소스가 필요합니다.
{% /callout %}

### BaseTokenRollover로 사용되지 않은 Raydium 베이스 토큰 회수하기 {% #recovering-unused-raydium-base-tokens-with-base-token-rollover %}

졸업에 사용되지 않은 Raydium 버킷 할당량의 베이스 토큰은 Raydium 버킷의 `BaseTokenRollover` 동작이 이를 옮길 때까지 Genesis에 남습니다.

Raydium 버킷을 생성할 때 이 동작을 추가하고, 졸업 후 Raydium 버킷을 `primaryBucket`으로 지정하여 `triggerBehaviorsV2`를 실행하세요.

{% code-tabs-imported from="genesis/rollover_raydium_cpmm_base_tokens_v2" frameworks="umi" filename="baseTokenRollover" /%}

## TransmitFailure를 사용한 실패 처리 {% #failure-handling-with-transmit-failure %}

`minimumQuoteTokenThreshold`가 있는 Launch Pool 또는 Presale은 총 예치금이 임계값 미만으로 종료되면 실패 모드에 들어가며, 실패 동작만 실행됩니다.

실패 모드에서는 예치자가 `refundLaunchPoolV2`를 호출할 수 있도록 쿼트 토큰이 판매 버킷에 남습니다. 두 가지 실패 동작이 그 이후의 모든 처리를 담당합니다.

| 동작 | 대상에 대한 효과 |
|----------|---------------------------|
| `ReallocateBaseTokensOnFailure` | 판매되지 않은 베이스 토큰을 판매 버킷에서 대상(보통 Unlocked 버킷)으로 이동 |
| `TransmitFailure` → Raydium CPMM | Raydium 버킷을 실패로 표시하여 졸업을 막고(`BucketLaunchFailed`), 해당 버킷의 `ReallocateBaseTokensOnFailure`가 실행될 수 있게 함 |
| `TransmitFailure` → 청구 스케줄 | 베스팅 버킷을 실패로 종료하여, 해당 버킷의 `ReallocateBaseTokensOnCancel`이 남은 잔액 전체를 반환하게 함. 이미 종료된 스케줄은 변경되지 않음 |
| `TransmitFailure` → Unlocked | 청구 시작 조건을 무시하고 Unlocked 버킷의 청구를 즉시 엶 |

{% code-tabs-imported from="genesis/launch_pool_failure_handling_v2" frameworks="umi" filename="launchPoolFailureHandling" /%}

{% callout type="note" %}
늦게 도착하는 롤오버나 실패 적립분을 받는 Unlocked 버킷은 `claimEndCondition`으로 `createNeverCondition()`을 사용해야 합니다. 청구 기간이 닫힌 후에 적립된 베이스 토큰은 절대 청구할 수 없습니다.
{% /callout %}

## 일반적인 종료 동작 오류 {% #common-end-behavior-errors %}

종료 동작 오류는 지원되지 않는 동작, 맞지 않는 remaining account 목록, 또는 아직 종료되지 않은 소스 버킷을 나타냅니다.

| 오류 | 원인 | 해결 방법 |
|-------|-------|------------|
| `BehaviorNotSupportedForBucketType` | 해당 소스 버킷에서 허용되지 않는 동작 | [동작 표](#genesis-end-behavior-types)에 있는 소스 사용 |
| `InvalidRemainingAccountsLength` | Remaining accounts가 `(bucket, quote token account)` 쌍으로 구성되지 않음 | 대상마다 정확히 한 쌍 전달 |
| `InvalidSecondaryBucket` | Remaining account가 유효한 대상 버킷이 아님 | 동작에 지정된 대상 버킷 PDA 전달 |
| `InvalidAtaDerivation` | 대상 쿼트 토큰 계정이 정규 ATA가 아님 | 올바른 소유자로 `findAssociatedTokenPda`를 사용해 도출 |
| `LaunchPoolNotEnded` | Launch Pool 예치 기간이 아직 열려 있음 | `depositEndCondition`까지 대기 |
| `StartPriceAlreadySet` | 두 번째 `SendStartPrice`가 같은 Raydium 버킷을 대상으로 함 | Raydium 버킷당 판매 버킷 하나 사용 |

## 참고 사항 {% #notes %}

- `SendQuoteTokenPercentage`, `BaseTokenRollover`, `ReallocateBaseTokensOnCancel`은 토큰 잔액만 이동합니다. `ReallocateBaseTokensOnFailure`는 할당량도 이동합니다. 즉, 소스 버킷의 `baseTokenAllocation`에서 차감하고 대상의 할당량에 더합니다.
- 수익을 나누는 경우처럼, 버킷은 대상이 서로 다른 같은 타입의 동작을 여러 개 가질 수 있습니다. 단, 두 가지 예외가 있습니다. Raydium 버킷은 `SendQuoteTokenPercentage`와 `SendStartPrice`를 정확히 하나씩만 받으며, 청구 스케줄 버킷은 `ReallocateBaseTokensOnCancel`을 최대 하나만 허용합니다.
- 쿼트 민트가 래핑된 SOL이면 Unlocked 버킷을 청구할 때 해당 버킷의 쿼트 토큰 계정이 닫힙니다. 쿼트 토큰을 다시 보내는 동작을 실행하기 전에 ATA를 다시 생성하세요.
- 판매 버킷에서 수익이 빠져나갈 때 적용되는 수수료는 [프로토콜 수수료](/ko/smart-contracts/genesis#protocol-fees)에 나와 있습니다.
- 예제는 데브넷에서 `@metaplex-foundation/genesis@0.44.0`으로 배포된 Genesis 프로그램 릴리스 `genesis v0.41.0`(`GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`)을 대상으로 실행되었습니다. 소스: [metaplex-foundation/genesis](https://github.com/metaplex-foundation/genesis).

## FAQ {% #faq %}

### Genesis에서 종료 동작이란 무엇인가요?

종료 동작은 버킷에 저장되는 작업으로, 소스 버킷이 종료된 후 판매 수익을 트레저리나 Raydium 졸업 버킷으로 보내는 것처럼 토큰이나 데이터를 다른 버킷으로 이동합니다. 동작은 누군가 `triggerBehaviorsV2`를 호출할 때 실행됩니다.

### triggerBehaviorsV2는 누가 호출할 수 있나요?

어떤 지갑이든 호출할 수 있습니다. `triggerBehaviorsV2`는 수수료 지불자의 서명만 필요합니다. 프로그램이 각 동작을 처리됨으로 표시하므로 각 동작은 최대 한 번만 실행됩니다.

### Launch Pool이 최소 임계값에 미달하면 종료 동작은 어떻게 되나요?

Launch Pool이 실패 모드에 들어갑니다. `ReallocateBaseTokensOnFailure`와 `TransmitFailure` 동작만 실행되므로, 예치된 SOL은 예치자 환불을 위해 버킷에 남습니다.

### 최종화 후에 종료 동작을 변경할 수 있나요?

아니요. 버킷을 추가할 때 또는 `finalizeV2` 전에 해당하는 `set*BucketV2Behaviors` 명령어로 동작을 구성하세요. 프로그램은 최종화 후의 동작 변경을 거부합니다.

### Raydium 졸업 후에 베이스 토큰이 남는 이유는 무엇인가요?

졸업은 시작 가격에서 쿼트 토큰과 짝을 이루는 데 필요한 베이스 토큰만 이동합니다. Raydium 버킷 할당량의 나머지는 Raydium 버킷의 `BaseTokenRollover` 동작이 다른 버킷으로 옮길 때까지 Genesis에 남습니다.

## 용어집 {% #glossary %}

| 용어 | 정의 |
|------|------------|
| **종료 동작(End behavior)** | 소스 버킷에 저장되며, 버킷이 종료된 후 실행되는 작업 |
| **소스 버킷(Source bucket)** | 동작이 실행되는 버킷으로, `primaryBucket`으로 전달됨 |
| **대상 버킷(Destination bucket)** | 토큰, 가격, 또는 실패 플래그를 받는 버킷 |
| **실패 모드(Failure mode)** | `minimumQuoteTokenThreshold` 미만으로 종료된 판매의 상태 |
| **시작 가격(Start price)** | Raydium 버킷이 풀 규모를 정하는 데 사용하는 `priceNumerator / priceDenominator` 비율 |
| **처리됨 플래그(Processed flag)** | 동작이 두 번 실행되지 않도록 하는 동작별 표시 |
