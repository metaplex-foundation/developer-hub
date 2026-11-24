---
title: 조건 및 트리거
metaTitle: Genesis 조건, TimeRelative 타이밍, triggerConditionsV2 | Metaplex
description: TimeAbsolute, TimeRelative, Triggered, Never 조건을 포함한 Genesis 버킷 조건의 작동 방식과 무허가(permissionless) 크랭크인 triggerConditionsV2를 호출해야 하는 시점을 설명합니다.
created: '10-29-2026'
updated: '11-24-2026'
keywords:
  - Genesis conditions
  - TimeRelative
  - TimeAbsolute
  - triggerConditionsV2
  - BucketTimes
  - claim start relative to graduation
  - Genesis crank
  - token launch timing
about:
  - Genesis conditions
  - Launch timing
  - Condition triggering
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: TimeRelative 조건은 자동으로 트리거되나요?
    a: 아니요. TimeAbsolute 조건은 명령어가 확인할 때마다 스스로 갱신되지만, TimeRelative 조건은 누군가 해당 조건을 가진 버킷에 대해 triggerConditionsV2를 호출하고 참조 버킷을 쓰기 가능한 remaining account로 전달할 때까지 트리거되지 않은 상태로 남습니다.
  - q: triggerConditionsV2는 누가 호출할 수 있나요?
    a: 어떤 지갑이든 호출할 수 있습니다. triggerConditionsV2는 수수료 지불자의 서명만 필요하므로 프로젝트 백엔드, 키퍼 봇, 사용자 지갑 모두 실행할 수 있습니다.
  - q: 크랭크가 늦게 실행되면 TimeRelative 조건에는 어떤 타임스탬프가 기록되나요?
    a: 조건에는 크랭크가 실행된 시간이 아니라 기준 시간에 오프셋을 더한 값이 기록됩니다. triggerConditionsV2를 늦게 실행하면 조건이 온체인에 반영되는 시점은 늦어지지만 베스팅이나 청구 계산은 달라지지 않습니다.
  - q: Raydium 풀이 생성될 때 청구를 열려면 어떻게 하나요?
    a: 청구 시작 조건을 Raydium CPMM 버킷을 참조하고 BucketTimes.Graduate를 버킷 시간으로 사용하는 TimeRelative로 설정하세요. 졸업 후에는 의존하는 각 버킷에 대해 Raydium 버킷을 remaining account로 지정하여 triggerConditionsV2를 호출하세요.
  - q: 최종화 후에 TimeRelative 조건을 변경할 수 있나요?
    a: 아니요. 버킷 조건은 finalizeV2로 고정됩니다. 유일한 예외는 postponableStart 확장이 있는 Raydium CPMM 졸업 시작으로, Genesis 권한자가 설정된 한도 내에서 이를 뒤로 미룰 수 있습니다.
---

[Genesis](/ko/smart-contracts/genesis) 조건은 예치, 청구, 졸업처럼 각 버킷 단계가 열리고 닫히는 시점을 결정하며, `triggerConditionsV2`는 스스로 해결될 수 없는 조건을 해결하는 무허가(permissionless) 크랭크입니다. {% .lead %}

## 요약 {% #summary %}

Genesis 조건은 버킷에 저장되는 64바이트 타이밍 규칙으로, 해당 시점이 지나면 "트리거"되며 그때 프로그램이 `triggeredTimestamp`를 기록합니다.

- `TimeAbsolute`는 고정된 Unix 타임스탬프에 발동하며, 명령어가 확인할 때마다 스스로 해결됩니다
- `TimeRelative`는 다른 버킷의 이벤트에 오프셋을 더한 시점에 발동하며, 해결하려면 `triggerConditionsV2`가 필요합니다
- `Triggered` 조건은 Raydium 풀이 생성될 때처럼 프로그램이 발동시킵니다
- `triggerConditionsV2`는 수수료 지불자의 서명만 필요하므로 어떤 지갑이든 실행할 수 있습니다

**바로 가기:** [조건 타입](#genesis-condition-types) · [조건 슬롯](#condition-slots-by-bucket-type) · [TimeRelative](#time-relative-conditions-and-bucket-times) · [triggerConditionsV2](#resolving-conditions-with-trigger-conditions-v2) · [졸업 시 청구](#opening-claims-at-raydium-graduation)

## Genesis 조건 타입 {% #genesis-condition-types %}

Genesis는 여섯 가지 조건 타입을 지원하며, 각 버킷 슬롯은 그중 일부만 허용합니다.

| 타입 | SDK 헬퍼 | 발동 시점 | 자체 해결 여부 |
|------|------------|------------|-----------------|
| `TimeAbsolute` | `createTimeAbsoluteCondition(time)` | 시계가 `time`에 도달함 | 예. 이를 확인하는 모든 명령어에서 해결됨 |
| `TimeRelative` | `createTimeRelativeCondition(bucket, bucketTime, offset)` | 참조 버킷 이벤트 + `offset`이 경과함 | 아니요. `triggerConditionsV2`가 필요함 |
| `Triggered` | `createTriggeredCondition()` | 졸업이나 프리세일 매진처럼 프로그램이 발동시킴 | 해당 이벤트를 일으킨 명령어가 발동시킴 |
| `TriggeredWithExpiry` | `createTriggeredWithExpiryCondition(expiry)` | 프로그램 트리거 또는 `expiryTime` 중 먼저 오는 시점 | 예. 만료 이후 해결됨 |
| `Never` | `createNeverCondition()` | 발동하지 않음 | 해당 없음 |
| `Always` | `{ __kind: 'Always', ... }`를 직접 구성 | 항상 충족됨 | 해당 없음. 타임스탬프를 기록하지 않음 |

모든 조건은 `triggeredTimestamp` 옵션을 가집니다. `None`은 조건이 아직 온체인에서 해결되지 않았음을 뜻하고, `Some(t)`는 조건이 발동한 시점을 기록합니다.

{% callout type="note" %}
조건 객체를 직접 작성하지 말고 SDK 헬퍼를 사용하세요. 변형마다 `padding` 길이가 다르며, 길이가 틀리면 직렬화가 실패합니다.
{% /callout %}

## 버킷 타입별 조건 슬롯 {% #condition-slots-by-bucket-type %}

버킷의 각 조건 필드를 "슬롯"이라고 하며, 프로그램은 슬롯이 지원하지 않는 조건 타입을 `InvalidConditionTypeForSlot`으로 거부합니다.

| 슬롯 | 허용되는 타입 |
|------|---------------|
| 시작 슬롯 (예치 시작, Unlocked 청구 시작, Raydium 졸업 시작, 베스팅 청구 시작) | `TimeAbsolute`, `TimeRelative`, `Always` |
| Launch Pool 및 Presale `claimStartCondition` | `TimeAbsolute`, `TimeRelative` |
| 종료 슬롯 (예치 종료, 청구 종료) | `TimeAbsolute`, `TimeRelative`, `Never` |
| Presale `depositEndCondition` | 종료 슬롯 타입 및 `Triggered`, `TriggeredWithExpiry` |
| 본딩 커브 `swapEndCondition` | `Triggered`만 허용 (매진) |
| `ClaimSchedule` 시작 및 클리프 | `TimeAbsolute`, `TimeRelative`, `Never` |
| Raydium `lpLockSchedule` 시작 및 클리프 | 스케줄 타입 및 졸업 시 발동하는 `Triggered` |
| Raydium `graduateCondition` | 프로그램이 관리하는 `Triggered`. 풀이 생성될 때 설정됨 |

Raydium CPMM의 `graduateCondition`은 인수가 아닙니다. 프로그램이 버킷을 추가할 때 이를 `Triggered`로 생성하고 `graduateToRaydiumCpmmV2` 내부에서 발동시키며, 이로써 `BucketTimes.Graduate`를 참조로 사용할 수 있게 됩니다.

## TimeRelative 조건과 버킷 시간 {% #time-relative-conditions-and-bucket-times %}

`TimeRelative` 조건은 해당 시간이 지나면 `referenceBucket.<bucketTime>.triggeredTimestamp + timeOffset`으로 해결됩니다.

| 필드 | 타입 | 의미 |
|-------|------|---------|
| `bucket` | `PublicKey` | 참조 버킷. 나중에 추가되는 버킷을 포함해 같은 Genesis 계정의 어떤 버킷이든 될 수 있음 |
| `bucketTime` | `BucketTimes` | 참조 버킷에서 기준으로 삼을 이벤트 |
| `timeOffset` | `bigint` (초) | 참조 이벤트 이후의 지연 시간. "같은 시점"이면 `0n` 사용 |

각 `BucketTimes` 값은 특정 버킷 타입의 조건 하나에 대응합니다.

| `BucketTimes` | 참조 버킷 타입 |
|---------------|------------------------|
| `DepositStart`, `DepositEnd` | Launch Pool, Presale |
| `ClaimStart`, `ClaimEnd` | Launch Pool, Presale, Unlocked |
| `SwapStart`, `SwapEnd` | 본딩 커브 |
| `GraduateStart` | Raydium CPMM (졸업 `startCondition`) |
| `Graduate` | Raydium CPMM (풀이 생성될 때 발동) |

이 표에 없는 버킷 타입과 `BucketTimes` 값을 조합하면 조건이 해결될 때 `InvalidPrimaryBucket`으로 실패합니다.

{% totem %}

```typescript {% title="timeRelativeConditions.ts" %}
import { BucketTimes, createTimeRelativeCondition } from '@metaplex-foundation/genesis'

const DAY = 86_400n

// Opens at the moment the Raydium pool is created
const claimStart = createTimeRelativeCondition(raydiumBucket, BucketTimes.Graduate)

// Opens 90 days after the Raydium pool is created
const cliff = createTimeRelativeCondition(raydiumBucket, BucketTimes.Graduate, 90n * DAY)

// Opens 1 hour after the Launch Pool deposit window closes
const graduationStart = createTimeRelativeCondition(launchPoolBucket, BucketTimes.DepositEnd, 3_600n)
```

{% /totem %}

{% callout type="warning" %}
`TimeRelative` 조건은 참조 이벤트가 온체인에서 해결된 후에만 해결될 수 있습니다. 참조 자체가 `TimeRelative`이면 참조 버킷을 먼저 트리거한 다음 의존하는 버킷을 트리거하세요.
{% /callout %}

## triggerConditionsV2로 조건 해결하기 {% #resolving-conditions-with-trigger-conditions-v2 %}

`triggerConditionsV2`는 대상 버킷 하나의 모든 조건을 해결하며, 여기에는 `claimSchedule`의 시작 및 클리프 같은 확장 조건도 포함됩니다.

이 명령어는 먼저 remaining account로 전달된 각 참조 버킷의 `TimeAbsolute` 조건을 해결한 다음, 대상 버킷에서 참조가 그 계정 중 하나와 일치하고 시간이 경과한 각 `TimeRelative` 조건을 해결합니다.

| 속성 | 값 |
|----------|-------|
| 서명자 | 수수료 지불자만 (무허가) |
| 대상 | 명령어당 버킷 하나 (`bucket` 계정) |
| Remaining accounts | 모든 참조 버킷, **쓰기 가능**, 순서 무관 |
| 자기 참조 | 자신의 버킷을 참조하는 조건은 버킷을 다시 전달하지 않아도 해결됨 |
| 재실행 | 안전함. 이미 트리거된 조건은 건너뜀 |

{% code-tabs-imported from="genesis/trigger_conditions_after_graduation_v2" frameworks="umi" filename="triggerConditionsV2" /%}

### triggerConditionsV2를 호출해야 하는 시점 {% #when-to-call-trigger-conditions-v2 %}

`triggerConditionsV2`는 참조 이벤트와 오프셋이 모두 지난 후, 그리고 해당 조건에 의존하는 명령어보다 먼저 호출하세요.

| 의존하는 작업 | 트리거할 버킷 | Remaining account로 전달할 버킷 |
|------------------|---------------------|---------------------------|
| 졸업 시점의 Launch Pool 청구 시작 | Launch Pool | Raydium CPMM 버킷 |
| 졸업 시점의 Unlocked 버킷 청구 시작 | Unlocked 버킷 | Raydium CPMM 버킷 |
| 졸업 시점의 베스팅 청구 게이트, 선형 베스팅 시작, 또는 클리프 | 청구 스케줄 버킷 | Raydium CPMM 버킷 |
| 판매 종료를 기준으로 한 졸업 시작 | Raydium CPMM 버킷 | Launch Pool 또는 Presale 버킷 |
| 졸업을 기준으로 한 예치자 베스팅 (`claimSchedule` 확장) | Launch Pool | Raydium CPMM 버킷 |

각 조건은 자신의 시간이 지난 후에만 해결됩니다. 졸업 90일 후에 클리프가 있는 베스팅 버킷은 청구 게이트와 선형 베스팅 시작을 위해 졸업 시점에 크랭크를 한 번 실행하고, 클리프를 위해 90일 후에 두 번째로 실행해야 합니다.

{% callout type="note" %}
기록되는 `triggeredTimestamp`는 크랭크가 실행된 시간이 아니라 항상 기준 시간에 오프셋을 더한 값입니다. 크랭크가 늦게 실행되면 청구를 시작할 수 있는 시점은 늦어지지만, 베스팅된 토큰의 양은 달라지지 않습니다.
{% /callout %}

## Raydium 졸업 시점에 청구 열기 {% #opening-claims-at-raydium-graduation %}

유동성이 활성화될 때 청구를 여는 표준 패턴은 Raydium CPMM 버킷의 `Graduate` 시간을 참조하는 `TimeRelative` 청구 시작 조건입니다.

1. Raydium CPMM 버킷을 참조하는 버킷을 추가하기 전에 `findRaydiumCpmmBucketV2Pda`로 해당 버킷의 PDA를 도출합니다.
2. Launch Pool, Unlocked, 청구 스케줄 버킷의 `claimStartCondition`을 `createTimeRelativeCondition(raydiumBucket, BucketTimes.Graduate, offset)`으로 설정합니다.
3. `graduateToRaydiumCpmmV2`가 성공하면 각 버킷에 대해 Raydium 버킷을 remaining account로 지정하여 `triggerConditionsV2`를 호출합니다.
4. 그 시점부터 청구가 성공합니다.

[Launch Pool 라이프사이클 가이드](/ko/smart-contracts/genesis/launch-pool-lifecycle)는 이 패턴을 처음부터 끝까지 보여주며, [Raydium CPMM 졸업](/ko/smart-contracts/genesis/raydium-cpmm-graduation)은 졸업 자체를 다룹니다.

{% callout type="warning" %}
졸업이 일어나지 않으면 `Graduate`를 참조하는 조건은 절대 해결되지 않습니다. 판매 버킷에 `TransmitFailure` [종료 동작](/ko/smart-contracts/genesis/end-behaviors#failure-handling-with-transmit-failure)을 추가하여, 판매가 실패했을 때 토큰이 묶여 있지 않고 의존하는 버킷이 열리거나 정리되도록 하세요.
{% /callout %}

## 일반적인 조건 오류 {% #common-condition-errors %}

조건 오류는 슬롯에서 지원하지 않는 조건 타입, 해결되지 않은 참조, 또는 조건이 충족되기 전에 실행된 명령어를 나타냅니다.

| 오류 | 원인 | 해결 방법 |
|-------|-------|------------|
| `InvalidConditionTypeForSlot` | 해당 슬롯에서 허용되지 않는 조건 타입 | [슬롯 표](#condition-slots-by-bucket-type)에 있는 타입 사용 |
| `InvalidPrimaryBucket` | 참조 버킷 타입에 해당 `bucketTime`이 존재하지 않음 | `BucketTimes`를 참조 버킷 타입에 맞추기 |
| `UninitializedCondition` | 조건 객체가 0으로 채워진 채 남아 있음 | SDK 헬퍼로 조건 생성 |
| `LaunchPoolNotEnded` | 예치 종료 조건보다 먼저 `triggerBehaviorsV2`를 실행함 | 예치 종료 시간까지 대기 |
| `GraduationNotStarted` | Raydium `startCondition`이 해결되기 전에 졸업을 실행함 | 시작 시간까지 대기하거나, `TimeRelative` 시작을 먼저 트리거 |

## 참고 사항 {% #notes %}

- `TimeRelative` 조건은 자신의 버킷에서 실행되는 예치, 청구 또는 기타 명령어로는 절대 해결되지 않습니다. `triggerConditionsV2`만 이를 해결합니다.
- `triggerConditionsV2`는 명령어당 대상 버킷 하나를 해결합니다. 크기가 허용하면 여러 호출을 하나의 트랜잭션에 담을 수 있습니다.
- `TimeRelative` 청구 게이트, 선형 베스팅 시작, 또는 클리프가 있으면 `updateClaimScheduleBucketV2`를 사용할 수 없습니다. 업데이트 중에는 프로그램이 참조 버킷을 검증할 수 없기 때문입니다. [Project Vesting](/ko/smart-contracts/genesis/project-vesting)을 참조하세요.
- `Always`는 `triggeredTimestamp`를 기록하지 않으므로 `TimeRelative` 조건의 참조나 `ClaimSchedule`에 사용할 수 없습니다.
- 예제는 데브넷에서 `@metaplex-foundation/genesis@0.44.0`으로 배포된 Genesis 프로그램 릴리스 `genesis v0.41.0`(`GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`)을 대상으로 실행되었습니다. 소스: [metaplex-foundation/genesis](https://github.com/metaplex-foundation/genesis).

## FAQ {% #faq %}

### TimeRelative 조건은 자동으로 트리거되나요?

아니요. `TimeAbsolute` 조건은 명령어가 확인할 때마다 스스로 갱신되지만, `TimeRelative` 조건은 누군가 해당 조건을 가진 버킷에 대해 `triggerConditionsV2`를 호출하고 참조 버킷을 쓰기 가능한 remaining account로 전달할 때까지 트리거되지 않은 상태로 남습니다.

### triggerConditionsV2는 누가 호출할 수 있나요?

어떤 지갑이든 호출할 수 있습니다. `triggerConditionsV2`는 수수료 지불자의 서명만 필요하므로 프로젝트 백엔드, 키퍼 봇, 사용자 지갑 모두 실행할 수 있습니다.

### 크랭크가 늦게 실행되면 TimeRelative 조건에는 어떤 타임스탬프가 기록되나요?

조건에는 크랭크가 실행된 시간이 아니라 기준 시간에 오프셋을 더한 값이 기록됩니다. `triggerConditionsV2`를 늦게 실행하면 조건이 온체인에 반영되는 시점은 늦어지지만 베스팅이나 청구 계산은 달라지지 않습니다.

### Raydium 풀이 생성될 때 청구를 열려면 어떻게 하나요?

청구 시작 조건을 Raydium CPMM 버킷을 참조하고 `BucketTimes.Graduate`를 버킷 시간으로 사용하는 `TimeRelative`로 설정하세요. 졸업 후에는 의존하는 각 버킷에 대해 Raydium 버킷을 remaining account로 지정하여 `triggerConditionsV2`를 호출하세요.

### 최종화 후에 TimeRelative 조건을 변경할 수 있나요?

아니요. 버킷 조건은 `finalizeV2`로 고정됩니다. 유일한 예외는 `postponableStart` 확장이 있는 Raydium CPMM 졸업 시작으로, Genesis 권한자가 설정된 한도 내에서 이를 뒤로 미룰 수 있습니다.

## 용어집 {% #glossary %}

| 용어 | 정의 |
|------|------------|
| **조건(Condition)** | 버킷에 저장되며, 충족되면 `triggeredTimestamp`를 기록하는 타이밍 규칙 |
| **슬롯(Slot)** | `claimStartCondition`처럼 버킷에 있는 특정 조건 필드 |
| **참조 버킷(Reference bucket)** | `TimeRelative` 조건이 기준으로 삼는 버킷 |
| **BucketTimes** | `DepositEnd`나 `Graduate`처럼 참조 버킷의 이벤트를 지정하는 열거형 |
| **크랭크(Crank)** | 온체인 상태를 진행시키기 위해 누구나 전송할 수 있는 무허가 명령어 |
| **Graduate 시간** | `graduateToRaydiumCpmmV2`가 Raydium 풀을 생성한 시점 |
