---
title: 프로젝트 베스팅
metaTitle: ClaimScheduleBucketV2로 프로젝트 토큰 베스팅 | Genesis | Metaplex
description: Genesis ClaimScheduleBucketV2로 온체인 프로젝트 토큰 베스팅 스케줄을 만듭니다. 클리프, 주기적 언록, 클레임, 일시정지, 취소, 수신자 이전을 포함합니다.
created: '08-24-2026'
updated: '08-24-2026'
keywords:
  - Genesis project vesting
  - ClaimScheduleBucketV2
  - ClaimSchedule
  - token vesting
  - team token vesting
  - token cliff
  - Solana vesting
  - on-chain vesting
about:
  - Genesis project vesting
  - ClaimScheduleBucketV2
  - Token claim schedules
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - 클리프와 주기적 선형 언록이 있는 ClaimSchedule을 구성합니다.
  - Genesis 계정을 Finalize하기 전에 ClaimScheduleBucketV2를 추가합니다.
  - 베스트된 토큰을 현재 저장된 수신자에게 클레임합니다.
  - 선택적 일시정지, 취소, 수신자 이전 정책을 구성합니다.
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: ClaimScheduleBucketV2와 ClaimSchedule의 차이는 무엇인가요?
    a: ClaimScheduleBucketV2는 한 수신자의 할당과 런타임 상태를 담는 Genesis 아웃플로우 버킷입니다. ClaimSchedule은 그 버킷 안에 저장된 재사용 가능한 클리프와 선형 언록 곡선입니다.
  - q: 베스팅 수신자가 매번 클레임을 제출해야 하나요?
    a: 아니요. ClaimClaimScheduleV2는 Permissionless이지만, 프로그램은 항상 버킷에 저장된 수신자에게 토큰을 전송합니다. 백엔드 서명자 확장이 구성되어 있으면 그 서명자도 각 클레임을 승인해야 합니다.
  - q: 베스팅이 시작된 뒤 프로젝트가 스케줄을 바꿀 수 있나요?
    a: 아니요. UpdateClaimScheduleBucketV2는 Finalize 전, 클레임 게이트 또는 스케줄 조건이 충족되기 전, 그리고 클레임이 한 번도 없을 때만 동작합니다. TimeRelative 클레임 게이트, 선형 시작, 또는 클리프도 업데이트를 즉시 비활성화합니다.
  - q: 베스팅 버킷이 취소되면 미베스트 토큰은 어떻게 되나요?
    a: 취소는 베스팅을 동결하고 베스트된 양은 수신자를 위해 보존합니다. 버킷에 ReallocateBaseTokensOnCancel 동작이 있으면 누구나 그 동작을 트리거해 미베스트 나머지를 UnlockedBucketV2로 옮길 수 있습니다.
  - q: 하나의 ClaimScheduleBucketV2가 여러 수신자에게 베스트할 수 있나요?
    a: 아니요. 각 버킷의 수신자는 한 명입니다. 독립 회계 또는 정책 제어가 필요한 수신자나 할당마다 ClaimScheduleBucketV2를 만드세요.
---

[Genesis](/ko/smart-contracts/genesis) 프로젝트 베스팅은 `ClaimScheduleBucketV2`를 사용해 온체인 클리프와 주기적 선형 스케줄에 따라 하나의 토큰 할당을 한 수신자에게 해제합니다. {% .lead %}

{% callout title="만들게 될 것" %}
이 가이드는 10% 클리프, 월간 선형 언록, 선택적 권한자 제어가 있는 1년 프로젝트 토큰 베스팅 할당을 만듭니다.
{% /callout %}

## 요약

`ClaimScheduleBucketV2`는 프로젝트, 팀, 어드바이저, 또는 재무 토큰 베스팅을 위한 일급 [Genesis](/ko/smart-contracts/genesis) 아웃플로우 버킷입니다. 수신자, 할당, 클레임 이력, 베스팅 커브, 일시정지 상태, 정책 제어, 선택적 취소 동작을 온체인에 저장합니다.

- 하나의 버킷은 하나의 토큰 할당을 한 명의 현재 수신자에게 베스트합니다
- `ClaimSchedule`은 독립 클리프와 기간 기반 선형 언록을 결합합니다
- 클레임은 Permissionless이지만 항상 버킷의 수신자에게 지급합니다
- 선택 정책으로 권한자 일시정지, 취소, 수신자 취소, 수신자 이전을 지원합니다

**바로가기:** [빠른 시작](#빠른-시작) · [베스팅 메커니즘](#클레임-스케줄-베스팅-메커니즘) · [런타임 제어](#프로젝트-베스팅-런타임-제어) · [취소](#취소-후-미베스트-토큰-재할당) · [참조](#빠른-참조)

## ClaimScheduleBucketV2와 ClaimSchedule

`ClaimScheduleBucketV2`는 프로젝트 할당을 소유하는 계정이고, `ClaimSchedule`은 그 계정에 임베드된 재사용 가능한 베스팅 커브입니다.

| 타입 | 목적 |
|------|---------|
| `ClaimScheduleBucketV2` | 한 수신자, 할당, 클레임된 양, 스케줄, 클레임 게이트, 일시정지 상태, 정책, 종료 동작을 저장합니다 |
| `ClaimSchedule` | 클리프 양, 클리프 조건, 선형 시작 조건, duration, 언록 period를 정의합니다 |
| `ClaimScheduleV2Extensions` | 런타임 정책 플래그와 선택적 백엔드 클레임 서명자를 저장합니다 |

{% callout type="note" %}
Genesis에는 `ClaimScheduleBucketV1`이 없습니다. 프로젝트 베스팅에는 `V2` 계정과 명령 이름을 사용하세요. `ClaimSchedule`은 다른 버킷 확장에서도 쓰이므로 스케줄 타입만으로는 프로젝트 베스팅 버킷을 식별할 수 없습니다.
{% /callout %}

## 빠른 시작

빠른 시작은 초기화되었지만 아직 Finalize되지 않은 Genesis V2 계정에 10% 클리프와 월간 선형 언록이 있는 1년 베스팅 버킷을 추가합니다.

먼저 [Genesis 설정](/ko/smart-contracts/genesis/getting-started)을 완료하고 베이스 토큰 공급에서 베스팅 할당을 확보하세요. 모든 버킷 할당의 합은 Genesis 계정의 총 공급량 안에 맞아야 합니다.

### 프로젝트 베스팅 버킷 생성

`addClaimScheduleBucketV2`는 Genesis 계정이 Finalize되기 전에 버킷을 만듭니다.

{% code-tabs-imported from="genesis/add_claim_schedule_bucket_v2" frameworks="umi" filename="addClaimScheduleBucketV2" /%}

다른 배포 버킷을 모두 추가한 뒤 [Genesis 설정](/ko/smart-contracts/genesis/getting-started)대로 `finalizeV2`를 호출하세요. Finalize는 되돌릴 수 없습니다.

### 베스트된 프로젝트 토큰 클레임

`claimClaimScheduleV2`는 현재 베스트되어 아직 클레임되지 않은 모든 토큰을 버킷에 저장된 수신자에게 전송합니다.

{% code-tabs-imported from="genesis/claim_claim_schedule_v2" frameworks="umi" filename="claimClaimScheduleV2" /%}

지불자가 수신자일 필요는 없습니다. 명령은 필요하면 수신자의 [associated token account](/ko/solana/understanding-solana-accounts#associated-token-accounts-atas)를 만들고, 토큰을 지불자에게 돌릴 수 없습니다.

{% callout type="note" %}
이전 클레임 이후 완전한 베스팅 주기가 지나지 않으면 클레임이 `NothingToClaim`을 반환할 수 있습니다. 다음 주기를 기다리거나 트랜잭션을 보내기 전에 가져온 버킷 상태를 확인하세요.
{% /callout %}

## 클레임 스케줄 베스팅 메커니즘

클레임 스케줄은 클리프 할당을 나머지 선형 할당과 독립적으로 언록합니다.

| 필드 | 제약 | 효과 |
|-------|------------|--------|
| `startCondition` | `TimeAbsolute`, `TimeRelative`, 또는 `Never` | 선형 베스팅 타임라인을 고정합니다 |
| `duration` | 0보다 크고 10년 이하 | 선형 할당이 완전히 베스트되는 시점을 정의합니다 |
| `period` | 0보다 크고 `duration` 이하 | 선형 베스팅을 이산 단계로 진행합니다 |
| `cliffCondition` | `TimeAbsolute`, `TimeRelative`, 또는 `Never` | 선형 스케줄과 독립적으로 클리프를 언록합니다 |
| `cliffAmountBps` | `0`부터 `10_000` | 할당의 0%에서 100%를 클리프에 할당합니다 |

할당 `A`와 클리프 basis points `C`에 대해 클리프 양은 `A × C / 10,000`입니다. 나머지 `A - cliffAmount`는 `duration`에 걸쳐 완전한 `period` 단계로 선형 베스트됩니다.

{% callout type="note" %}
클리프는 선형 스케줄을 자동으로 지연하지 않습니다. `startCondition`과 `cliffCondition`을 의도한 타임스탬프에 명시적으로 설정하세요. 어느 조건이든 다른 쪽의 전, 중, 후에 발화할 수 있습니다.
{% /callout %}

{% callout type="warning" %}
클리프를 `startCondition + duration`보다 늦추지 마세요. 선형 완료 후 성공 클레임은 버킷의 종료 조건을 발화합니다. 더 늦은 클리프는 동결된 실효 시각을 넘어 클레임 가능해지지 않을 수 있습니다.
{% /callout %}

### 클레임 게이트와 베스팅 커브

`claimStartCondition`은 토큰 출금을 게이트하고, `claimSchedule.startCondition`은 선형 할당이 언제 적립되는지를 제어합니다.

이 분리는 클레임이 열리기 전에 적립되는 스케줄을 지원합니다. 예를 들어 고용일에 베스팅을 시작하고 `claimStartCondition`으로 토큰 생성 이벤트까지 출금을 막을 수 있습니다.

`TimeAbsolute` 조건은 클레임이 확인할 때 자신을 업데이트합니다. `TimeRelative` 조건은 수동적이며, 참조되는 각 버킷을 writable remaining account로 전달하는 `triggerConditionsV2`가 필요합니다.

{% code-tabs-imported from="genesis/trigger_claim_schedule_conditions_v2" frameworks="umi" filename="triggerConditionsV2" /%}

참조 조건이 충족된 뒤, 클레임하거나 베스팅 상태를 평가하기 전에 이 Permissionless 크랭크를 실행하세요.

### 주기적 선형 언록

`period` 필드는 선형 할당을 연속이 아니라 단계로 언록합니다.

365일 duration과 30일 period에서는 선형 할당이 완전한 30일 주기마다 증가합니다. 반올림 나머지는 전체 duration이 끝날 때 클레임 가능해집니다.

### 일시정지 조정 베스팅 시간

버킷을 일시정지하면 베스팅 시간이 멈추고, 재개하면 실효 타임라인이 일시정지 합계만큼 이동합니다.

버킷은 `pausedAt`과 `totalSecondsPaused`를 기록합니다. 일시정지 중 취소는 스케줄을 `pausedAt`에서 동결하므로, 일시정지에 쓴 시간은 베스트 양을 늘리지 않습니다.

## 프로젝트 베스팅 런타임 제어

런타임 제어는 기본으로 꺼져 있으며 버킷 생성 시 정책 플래그로 켜야 합니다.

| 정책 플래그 | 인가된 역할 | 명령 | 결과 |
|-------------|-----------------|-------------|--------|
| `pausable` | Genesis 권한자 | `setClaimSchedulePausedStateV2` | 베스팅 적립을 일시정지하거나 재개합니다 |
| `cancelable` | Genesis 권한자 | `cancelClaimScheduleBucketV2` | 취소 시각에 베스팅을 동결합니다 |
| `cancelableByRecipient` | 수신자 | `cancelClaimScheduleBucketV2` | 수신자가 베스팅을 동결할 수 있습니다 |
| `transferable` | Genesis 권한자 | `transferRecipientClaimScheduleBucketV2` | 베스팅 수신자를 바꿉니다 |
| `transferableByRecipient` | 수신자 | `transferRecipientClaimScheduleBucketV2` | 현재 수신자가 할당을 이전할 수 있습니다 |

{% callout type="warning" %}
프로젝트 베스팅 계약에 필요한 제어만 켜세요. 권한자 취소 또는 수신자 이전 권한은 수신자에게 제공하는 보장을 실질적으로 바꿉니다.
{% /callout %}

### 프로젝트 베스팅 일시정지와 재개

생성 시 `pausable`이 켜져 있으면 `setClaimSchedulePausedStateV2`가 버킷을 일시정지하거나 재개합니다.

{% code-tabs-imported from="genesis/pause_claim_schedule_bucket_v2" frameworks="umi" filename="pauseClaimScheduleBucketV2" /%}

재개하려면 `paused: false`를 설정하세요. 이 제어는 Genesis 권한자만 사용할 수 있습니다.

### 프로젝트 베스팅 취소

`cancelClaimScheduleBucketV2`는 베스팅을 동결하지만 이미 베스트된 토큰은 제거하지 않습니다.

{% code-tabs-imported from="genesis/cancel_claim_schedule_bucket_v2" frameworks="umi" filename="cancelClaimScheduleBucketV2" /%}

수신자는 베스트된 나머지를 계속 클레임할 수 있습니다. 미베스트 토큰은 `ReallocateBaseTokensOnCancel` 종료 동작이 구성되어 트리거되지 않으면 Genesis 회계에 남습니다.

### 프로젝트 베스팅 수신자 변경

`transferRecipientClaimScheduleBucketV2`는 이후 모든 클레임을 받는 지갑을 바꿉니다.

{% code-tabs-imported from="genesis/transfer_claim_schedule_recipient_v2" frameworks="umi" filename="transferClaimScheduleRecipientV2" /%}

인가된 서명자는 `transferable`과 `transferableByRecipient` 중 무엇이 켜졌는지에 따라 달라집니다.

## 취소 후 미베스트 토큰 재할당

`ReallocateBaseTokensOnCancel`은 취소된 버킷의 미베스트 나머지 100%를 `UnlockedBucketV2`로 옮깁니다.

`finalizeV2`를 호출하기 전에 동작을 구성하세요. `addClaimScheduleBucketV2.endBehaviors` 또는 `setClaimScheduleBucketV2Behaviors`로 설정합니다. Genesis 프로그램은 Finalize 이후 동작 구성을 거부합니다.

{% code-tabs-imported from="genesis/reallocate_claim_schedule_on_cancel_v2" frameworks="umi" filename="reallocateClaimScheduleOnCancelV2" /%}

동작은 원래 할당 값이 아니라 버킷 잔액을 바꿉니다. 클레임 스케줄 버킷이 종료된 뒤에만 실행할 수 있으며, 각 클레임 스케줄 버킷의 취소 재할당 동작은 최대 하나입니다.

{% callout type="note" %}
`TimeRelative` 시작 또는 클리프 조건을 쓰는 스케줄은 취소 재할당이 베스트 양을 계산하기 전에 그 조건이 트리거되어야 합니다. 먼저 필요한 참조 계정과 함께 `triggerConditionsV2`를 실행하세요.
{% /callout %}

## 런치 전 프로젝트 베스팅 업데이트

`updateClaimScheduleBucketV2`는 Finalize 전이고 베스팅이 시작되기 전에만 할당, 스케줄, 또는 클레임 시작 조건을 교체할 수 있습니다.

버킷은 토큰이 클레임된 뒤, `claimStartCondition`이 충족된 뒤, 또는 선형 시작이나 클리프 조건이 충족된 뒤에 `ClaimScheduleUpdateForbidden`으로 업데이트를 거부합니다. 그 세 슬롯 중 하나의 `TimeRelative` 조건도 업데이트 중 참조 버킷을 검증할 수 없어 즉시 업데이트를 비활성화합니다. 런타임 일시정지, 취소, 이전 제어는 업데이트 명령이 아니라 전용 명령을 사용합니다.

## 프로젝트 베스팅 상태 조회

`fetchClaimScheduleBucketV2`는 할당, 클레임 진행, 실효 일시정지 상태, 정책, 종료 동작을 반환합니다.

{% code-tabs-imported from="genesis/fetch_claim_schedule_bucket_v2" frameworks="umi" filename="fetchClaimScheduleBucketV2" /%}

회계 불변식은 종료 동작이 미베스트 잔액을 재할당할 때까지 `baseTokenBalance = baseTokenAllocation - amountClaimed`입니다.

## ClaimScheduleBucketV2 계정 필드

`ClaimScheduleBucketV2` 계정은 고정 베스팅 상태 뒤에 가변 길이 종료 동작 목록을 저장합니다.

| 필드 | 설명 |
|-------|-------------|
| `bucket` | 할당, 남은 잔액, mint, index, 수수료 데이터를 담은 공유 버킷 헤더 |
| `recipient` | 모든 베스트 토큰 클레임을 받는 지갑 |
| `amountClaimed` | 수신자에게 전송된 누적 토큰 |
| `claimSchedule` | 클리프와 기간 기반 선형 베스팅 커브 |
| `claimStartCondition` | 클레임 전에 열려야 하는 독립 게이트 |
| `claimEndCondition` | 취소 또는 자연 완료로 발화하는 프로그램 소유 종료 조건 |
| `paused` | 베스팅 시간이 현재 멈췄는지 |
| `pausedAt` | 현재 일시정지가 시작된 타임스탬프 |
| `totalSecondsPaused` | 베스팅에서 제외된 누적 일시정지 시간 |
| `extensions` | 런타임 정책과 선택적 백엔드 서명자 |
| `endBehaviors` | 버킷 종료 후 사용 가능한 동작 |

## 일반적인 프로젝트 베스팅 오류

클레임 스케줄 오류는 잘못된 스케줄 구성, 무단 제어, 또는 잘못된 라이프사이클 단계의 작업을 식별합니다.

| 오류 | 원인 | 해결 |
|-------|-------|------------|
| `InvalidClaimSchedulePeriod` | `period`가 0 | 양수 period를 사용하세요 |
| `InvalidClaimScheduleDuration` | `duration`이 0이거나 10년 초과 | 1초부터 315,360,000초의 duration을 사용하세요 |
| `ClaimScheduleDurationTooShort` | `period`가 `duration`을 초과 | period를 줄이거나 duration을 늘리세요 |
| `InvalidClaimScheduleCliffAmount` | `cliffAmountBps`가 `10_000`을 초과 | 0부터 10,000 basis points를 사용하세요 |
| `NothingToClaim` | 새 클리프 또는 완전한 선형 주기가 베스트되지 않음 | 다음 언록을 기다리거나 버킷 상태를 확인하세요 |
| `ClaimScheduleUpdateForbidden` | 클레임 게이트 또는 스케줄이 시작됨, 토큰이 클레임됨, 또는 관련 조건이 `TimeRelative` | 발화 전에 절대 시각 필드를 구성하세요. 상대 스케줄은 업데이트할 수 없습니다 |
| `ClaimScheduleUnauthorized` | 서명자가 해당 제어를 쓸 수 없음 | 켜진 정책이 요구하는 Genesis 권한자 또는 수신자를 사용하세요 |
| `ClaimSchedulePolicyDisabled` | 요청한 일시정지, 취소, 또는 이전 정책이 꺼짐 | 버킷 생성 시 정책을 켜세요 |
| `InvalidBackendSigner` | 구성된 백엔드 서명자가 클레임을 승인하지 않음 | 구성된 백엔드 서명자를 포함하세요 |
| `ClaimScheduleConditionNotTriggered` | 취소 재할당이 미해결 상대 조건에 의존 | 먼저 상대 스케줄 조건을 트리거하세요 |

## 빠른 참조

프로젝트 베스팅은 Genesis V2와 `@metaplex-foundation/genesis`에서 사용할 수 있습니다.

| 항목 | 값 |
|------|-------|
| Program | `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` |
| Tested SDK | `@metaplex-foundation/genesis@0.41.1` |
| Tested Umi compatibility | `@metaplex-foundation/umi@^1.4.1` |
| Bucket PDA seeds | `"claim_schedule_v2"`, Genesis 계정, `u8`인 `bucketIndex` |
| Maximum vesting duration | 315,360,000초(10년) |
| Cliff range | 0부터 10,000 basis points |
| Recipients per bucket | 1 |
| Bucket creation fee | 0 |
| Devnet validation | 추가, Finalize, 일시정지, 이전, 클레임, 취소, 재할당 전체 흐름이 2026-08-24에 통과([테스트 계정](https://explorer.solana.com/address/3jjvwp9QnUfU2RJGzhJNJZPXH4HT6TrbaUcemku4ZYhT?cluster=devnet)) |
| Source | [metaplex-foundation/genesis](https://github.com/metaplex-foundation/genesis) |

## 참고사항

프로젝트 베스팅에는 토큰 배포 설계에 포함해야 할 라이프사이클과 인가 제약이 있습니다.

- `finalizeV2`를 호출하기 전에 `ClaimScheduleBucketV2` 계정을 추가하고 구성하세요.
- 수신자 또는 독립 관리 할당마다 버킷 하나를 만드세요.
- 선택적 백엔드 서명자 확장이 구성되어 있지 않으면 클레임은 Permissionless입니다.
- 백엔드 서명자는 클레임 인가를 추가하지만 현재 저장된 수신자에서 클레임을 돌릴 수 없습니다.
- 취소는 베스트된 토큰을 보존합니다. 미베스트 토큰을 회수하려면 `ReallocateBaseTokensOnCancel`이 필요합니다.
- `Never` 스케줄은 토큰을 영구 잠그며 주로 [잠긴 LP 토큰](/ko/smart-contracts/genesis/locked-lp-tokens)에 쓰입니다.

## FAQ

### ClaimScheduleBucketV2와 ClaimSchedule의 차이는 무엇인가요?

`ClaimScheduleBucketV2`는 한 수신자의 할당과 런타임 상태를 담는 Genesis 아웃플로우 버킷입니다. `ClaimSchedule`은 그 버킷 안에 저장된 재사용 가능한 클리프와 선형 언록 곡선입니다.

### 베스팅 수신자가 매번 클레임을 제출해야 하나요?

아니요. `claimClaimScheduleV2`는 Permissionless이지만, 프로그램은 항상 버킷에 저장된 수신자에게 토큰을 전송합니다. 백엔드 서명자 확장이 구성되어 있으면 그 서명자도 각 클레임을 승인해야 합니다.

### 베스팅이 시작된 뒤 프로젝트가 스케줄을 바꿀 수 있나요?

아니요. `updateClaimScheduleBucketV2`는 Finalize 전, 클레임 게이트 또는 스케줄 조건이 충족되기 전, 그리고 클레임이 한 번도 없을 때만 동작합니다. `TimeRelative` 클레임 게이트, 선형 시작, 또는 클리프도 업데이트를 즉시 비활성화합니다.

### 베스팅 버킷이 취소되면 미베스트 토큰은 어떻게 되나요?

취소는 베스팅을 동결하고 베스트된 양은 수신자를 위해 보존합니다. 버킷에 `ReallocateBaseTokensOnCancel` 동작이 있으면 누구나 그 동작을 트리거해 미베스트 나머지를 `UnlockedBucketV2`로 옮길 수 있습니다.

### 하나의 ClaimScheduleBucketV2가 여러 수신자에게 베스트할 수 있나요?

아니요. 각 버킷의 수신자는 한 명입니다. 독립 회계 또는 정책 제어가 필요한 수신자나 할당마다 `ClaimScheduleBucketV2`를 만드세요.

## 용어집

프로젝트 베스팅 용어는 버킷 계정, 임베드된 스케줄, 라이프사이클 제어를 구분합니다.

| 용어 | 정의 |
|------|------------|
| **ClaimScheduleBucketV2** | 하나의 베이스 토큰 할당을 한 수신자에게 베스트하는 Genesis 아웃플로우 버킷 |
| **ClaimSchedule** | 재사용 가능한 클리프와 기간 기반 선형 토큰 언록 곡선 |
| **Claim gate** | 출금 시작을 제어하는 버킷 수준 `claimStartCondition` |
| **Cliff** | 독립 조건이 발화할 때 언록되는 총 할당의 비율 |
| **Period** | 선형 베스팅을 이산 단계로 진행하는 간격 |
| **Effective time** | 버킷의 일시정지 시간을 제외한 벽시계 시간 |
| **Cancellation reallocation** | 취소된 버킷의 미베스트 나머지를 잠금 해제 버킷으로 옮기는 종료 동작 |
