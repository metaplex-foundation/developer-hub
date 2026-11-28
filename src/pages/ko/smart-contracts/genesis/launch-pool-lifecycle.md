---
title: SDK로 실행하는 Launch Pool 라이프사이클
metaTitle: Raydium 졸업을 포함한 Genesis Launch Pool 전체 라이프사이클 | Metaplex
description: JavaScript SDK로 Genesis Launch Pool을 처음부터 끝까지 실행하는 가이드 — 버킷, Raydium CPMM 졸업, 졸업 기준 청구, 팀 베스팅, 트레저리, 운영자 크랭크, 판매 페이지를 다룹니다.
created: '10-29-2026'
updated: '11-25-2026'
keywords:
  - Genesis launch pool lifecycle
  - token launch SDK
  - Raydium graduation
  - triggerBehaviorsV2
  - triggerConditionsV2
  - launch crank
  - token sale page
  - claim after graduation
about:
  - Genesis Launch Pool
  - Raydium CPMM graduation
  - Launch operations
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - Genesis 계정을 초기화하고 Launch Pool, Raydium CPMM, Unlocked, 청구 스케줄 버킷을 추가합니다
  - 종료 동작과 졸업 기준 청구 조건을 연결한 뒤 최종화합니다
  - 예치 기간 동안 버킷 및 예치 상태를 읽는 판매 페이지를 제공합니다
  - 크랭크를 실행하여 동작을 트리거하고, Raydium으로 졸업시키고, 토큰을 롤오버하고, 청구 조건을 트리거합니다
  - 예치자, 트레저리, 팀이 청구하도록 한 뒤 LP 토큰과 수수료를 관리합니다
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: SDK로 만든 런칭에는 자체 크랭크를 실행해야 하나요?
    a: 네. SDK로 직접 생성한 런칭에는 자체 크랭크를 실행할 계획을 세우세요. 모든 크랭크 단계(triggerBehaviorsV2, graduateToRaydiumCpmmV2, triggerConditionsV2)는 무허가이며 자금이 있는 수수료 지불자만 있으면 됩니다.
  - q: 예치 마감 후 아무도 크랭크를 실행하지 않으면 어떻게 되나요?
    a: 아무것도 이동하지 않습니다. 모금된 SOL은 Launch Pool에 남고, Raydium 풀은 생성되지 않으며, 졸업을 기준으로 하는 청구는 열리지 않습니다. 예치자의 자금은 안전하게 유지되지만, 누군가 크랭크 트랜잭션을 보낼 때까지 런칭이 멈춥니다.
  - q: 예치 마감 후 사용자는 언제부터 청구할 수 있나요?
    a: 크랭크가 세 단계(Launch Pool에 대한 triggerBehaviorsV2, graduateToRaydiumCpmmV2, Launch Pool에 대한 triggerConditionsV2)를 실행하는 즉시 가능합니다. 1분마다 폴링하는 크랭크는 보통 졸업 시작 시간으로부터 몇 분 내에 이를 완료합니다.
  - q: 버킷 할당량의 합계가 총 공급량과 같아야 하나요?
    a: 네. finalizeV2는 모든 버킷의 baseTokenAllocation 합계가 Genesis 계정의 총 공급량과 같아야 합니다.
  - q: 예치자의 토큰을 청구 시 잠금 해제하는 대신 베스팅할 수 있나요?
    a: 네. Launch Pool 버킷에 claimSchedule 확장을 추가하세요. 그 시작 및 클리프 조건도 Raydium Graduate 시간을 기준으로 하는 TimeRelative로 설정할 수 있습니다.
---

이 가이드는 JavaScript SDK로 [Genesis](/ko/smart-contracts/genesis) [Launch Pool](/ko/smart-contracts/genesis/launch-pool)을 처음부터 끝까지 실행합니다. 버킷 설정부터 Raydium 졸업, 졸업 기준 청구, 팀 베스팅, 그리고 각 단계를 진행시키는 운영자 크랭크까지 다룹니다. {% .lead %}

{% callout title="만들게 될 것" %}
공급량의 60%를 3일간의 Launch Pool에서 판매하고, 모금된 SOL의 20%를 Raydium CPMM 풀로, 80%를 트레저리로 보내며, 풀이 활성화되는 순간 모든 청구를 열고, 졸업 후 1년 동안 팀 토큰을 베스팅하는 런칭입니다.
{% /callout %}

{% callout title="노코드 옵션" %}
코드를 작성하지 않고 토큰을 런칭하려면 [Metaplex 토큰 런치패드](https://www.metaplex.com)를 사용하세요. Raydium 유동성과 베스팅을 갖춘 런치 풀을 코드에서 한 번의 호출로 만들려면 [Genesis API 클라이언트](/ko/smart-contracts/genesis/sdk/api-client)의 `createAndRegisterLaunch`를 사용하세요. 이 가이드는 모든 버킷과 설정을 완전히 제어해야 하는 런칭을 위한 것입니다.
{% /callout %}

## 요약 {% #summary %}

SDK로 구성하는 전체 런칭은 `finalizeV2` 전에 서로 연결된 네 가지 버킷 타입과, 예치 기간이 마감된 후 무허가 트랜잭션을 보내는 크랭크로 이루어집니다.

- Launch Pool은 토큰을 판매하고, Raydium CPMM은 유동성을 만들고, Unlocked는 트레저리를 보관하며, 청구 스케줄은 팀 토큰을 베스팅합니다
- 모든 청구는 Raydium `Graduate` 시간에 고정된 `TimeRelative` 조건을 사용합니다
- 크랭크는 `triggerBehaviorsV2`, `graduateToRaydiumCpmmV2`, `triggerConditionsV2`를 실행합니다. 자동으로 일어나는 일은 없습니다
- 데브넷에서 `@metaplex-foundation/genesis@0.44.0`으로 배포된 Genesis 릴리스 `genesis v0.41.0`을 대상으로 처음부터 끝까지 실행했습니다

## 이 가이드를 사용해야 하는 경우 {% #when-to-use-this-guide %}

Metaplex 런치패드와 API가 제공하지 않는 설정이 런칭에 필요할 때 이 가이드를 사용하세요. 그 외의 경우에는 [Metaplex 토큰 런치패드](https://www.metaplex.com)나 [Genesis API 클라이언트](/ko/smart-contracts/genesis/sdk/api-client)로 훨씬 적은 코드로 비슷한 런치 풀을 만들 수 있습니다.

| | Metaplex 런치패드 / Genesis API 클라이언트 | 이 가이드 (Genesis SDK) |
|---|---|---|
| 설정 | 양식 또는 `createAndRegisterLaunch` 한 번 호출 | 직접 만들고 보내는 약 8개의 트랜잭션 |
| metaplex.com 게시 | 예. 런칭이 `registerLaunch`로 등록됩니다 | 아니요. 런칭이 Metaplex API에 등록되지 않습니다 |
| 공급량과 소수 자릿수 | 새 토큰은 기본적으로 10억 토큰, 소수 6자리 | 임의의 공급량과 자릿수 |
| Raydium 유동성 | 모금액의 20–100%. LP 토큰은 1년간 잠기고 분기마다 언락 | 임의의 비율, 시작 조건, LP 정책 |
| 버킷 | Launch Pool, Unlocked 버킷, 선택적 청구 스케줄 | Genesis 버킷과 종료 동작의 임의 조합 |
| 예치 종료 후 | Metaplex가 크랭크를 실행합니다: 종료 동작, Raydium 졸업, 청구 조건 | 종료 동작, 졸업, 청구를 실행하는 크랭크를 직접 운영합니다 |

## 빠른 시작 {% #quick-start %}

런칭은 4단계로 진행되며, 각 단계는 코드가 있는 섹션으로 연결됩니다.

1. [런칭 구성 및 최종화](#step-1-configure-and-finalize-the-launch): 토큰을 초기화하고, 종료 동작과 졸업 기준 조건을 가진 4개의 버킷을 추가한 뒤 최종화합니다.
2. [세일 페이지 구축](#step-2-build-the-sale-page): 예치 기간 동안 버킷과 예치 상태를 읽어 단계, 합계, 지갑의 포지션을 표시합니다.
3. [런칭 크랭크 실행](#step-3-run-the-launch-crank): 예치가 끝나면 종료 동작을 실행하고, Raydium으로 졸업하고, 사용되지 않은 토큰을 롤오버하고, 청구를 엽니다. 모든 트랜잭션은 [런북](#operator-crank-runbook)에 나와 있습니다.
4. [청구 및 런칭 완료](#step-4-claims-and-post-launch-operations): 예치자, 트레저리, 팀이 청구하고, 권한자가 민트 권한과 동결 권한을 취소합니다.

**바로 가기:** [아키텍처](#launch-architecture) · [설정](#step-1-configure-and-finalize-the-launch) · [판매 페이지](#step-2-build-the-sale-page) · [크랭크](#step-3-run-the-launch-crank) · [런북](#operator-crank-runbook) · [청구](#step-4-claims-and-post-launch-operations)

## 사전 요구 사항 {% #prerequisites %}

- Node.js 18+ 및 `@metaplex-foundation/genesis`, `@metaplex-foundation/umi`, `@metaplex-foundation/umi-bundle-defaults`, `@metaplex-foundation/mpl-toolbox` 패키지
- 설정용으로 자금이 있는 권한자 지갑과 자금이 있는 크랭크 지갑 (같은 지갑이어도 됨)
- [Genesis 설정](/ko/smart-contracts/genesis/getting-started)에 대한 이해

| 도구 | 테스트된 버전 |
|------|----------------|
| `@metaplex-foundation/genesis` | 0.44.0 |
| `@metaplex-foundation/mpl-toolbox` | 0.12.x |
| `@metaplex-foundation/umi` | 1.x |
| Genesis 프로그램 | `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` |

## 런칭 아키텍처 {% #launch-architecture %}

이 런칭은 할당량 합계가 총 공급량 1,000,000 토큰이 되는 네 개의 버킷을 사용합니다.

| 버킷 | 타입 | 할당량 | 받는 것 | 청구 시작 |
|--------|------|------------|----------|-------------|
| Launch Pool | `LaunchPoolBucketV2` | 600,000 | SOL 예치금 | Graduate 시간 |
| Raydium CPMM | `RaydiumCpmmBucketV2` | 120,000 | SOL의 20% + 시작 가격 | — (풀 유동성) |
| 트레저리 | `UnlockedBucketV2` | 80,000 | SOL의 80% + 사용되지 않은 Raydium 토큰 | Graduate 시간 |
| 팀 베스팅 | `ClaimScheduleBucketV2` | 200,000 | — | Graduate 시간. +90일에 10% 클리프, 1년 동안 매월 잠금 해제 |

```
Launch Pool ──SendQuoteTokenPercentage 20% + SendStartPrice──▶ Raydium CPMM ──graduate──▶ Raydium pool
     │                                                              │
     └──SendQuoteTokenPercentage 80%──▶ Treasury ◀──BaseTokenRollover┘

Claim starts (Launch Pool, Treasury, Team) = TimeRelative(Raydium CPMM, Graduate, offset)
```

*다이어그램: Launch Pool의 종료 동작이 모금된 SOL의 20%와 시작 가격을 Raydium CPMM 버킷으로, 80%를 트레저리 Unlocked 버킷으로 보냅니다. 졸업 후 Raydium 버킷은 사용되지 않은 베이스 토큰을 트레저리로 롤오버하며, 모든 청구 시작 조건은 Raydium Graduate 시간을 참조합니다.*

Raydium 할당량은 Launch Pool 할당량 × 20%로, 풀로 보내는 수익 비율과 일치합니다. 규모 계산은 [Raydium CPMM 졸업](/ko/smart-contracts/genesis/raydium-cpmm-graduation#raydium-pool-starting-price)을 참조하세요.

## 1단계: 런칭 구성 및 최종화 {% #step-1-configure-and-finalize-the-launch %}

설정 스크립트는 토큰을 초기화하고, 버킷들이 서로를 참조할 수 있도록 네 개의 버킷 주소를 먼저 모두 도출한 뒤, 버킷을 추가하고, 모든 버킷을 remaining account로 전달하여 최종화합니다.

{% code-tabs-imported from="genesis/launch_pool_lifecycle_setup" frameworks="umi" filename="setupLaunch" /%}

### 설정 스크립트의 주요 구성 선택 {% #key-configuration-choices-in-the-setup-script %}

아래의 각 선택은 런칭을 안전하게 크랭크하고 모든 할당량을 청구 가능하게 유지하기 위한 것입니다.

| 선택 | 이유 |
|--------|--------|
| 모든 `add*` 호출 전에 PDA 도출 | 버킷이 동작과 조건에서 나중에 추가되는 버킷을 참조함 |
| 세 버킷에 `claimStartCondition: atGraduation()` | 유동성이 생기기 전에는 누구도 청구하거나 판매할 수 없음 |
| Raydium `startCondition` = 예치 종료 | 동작이 SOL과 가격을 전달하는 즉시 졸업을 실행할 수 있음 |
| `Triggered` LP 잠금 시작 | 추가 크랭크 없이 정확히 졸업 시점에 잠금 시계가 시작됨 |
| 트레저리 `claimEndCondition: Never` | 졸업 후에 도착하는 롤오버 토큰이 청구 가능한 상태로 유지됨 |
| Raydium 버킷의 `BaseTokenRollover` | 반올림 잔여분처럼 졸업에서 짝지어지지 않은 베이스 토큰을 회수함 |

{% callout type="warning" %}
`finalizeV2`는 되돌릴 수 없습니다. 이후에는 버킷 할당량, 조건, 종료 동작을 변경할 수 없습니다. 모든 주소, 비율, 타임스탬프를 먼저 검토하세요. 가능하면 데브넷에서 전체 라이프사이클을 실행해 보는 것이 좋습니다.
{% /callout %}

실패할 수 있는 런칭이라면 Launch Pool에 `minimumQuoteTokenThreshold`와 함께 `ReallocateBaseTokensOnFailure` 및 `TransmitFailure` 동작을 추가하여, 판매가 실패했을 때 토큰을 반환하고 졸업 기준 버킷의 차단을 해제하도록 하세요. [실패 처리](/ko/smart-contracts/genesis/end-behaviors#failure-handling-with-transmit-failure)를 참조하세요.

## 2단계: 판매 페이지 만들기 {% #step-2-build-the-sale-page %}

판매 페이지는 Launch Pool, Raydium, 예치 계정을 읽어 현재 단계, 합계, 연결된 지갑의 포지션을 표시합니다.

{% code-tabs-imported from="genesis/launch_pool_sale_page_state" frameworks="umi" filename="salePageState" /%}

| 판매 페이지 작업 | 명령어 | 문서 |
|------------------|-------------|------|
| 예치 전 SOL 래핑 | `wrapSol` 헬퍼 | [SOL 래핑](/ko/smart-contracts/genesis/launch-pool#wrapping-sol) |
| 예치 | `depositLaunchPoolV2` | [예치](/ko/smart-contracts/genesis/launch-pool#depositing) |
| 예치 기간 중 출금 | `withdrawLaunchPoolV2` | [출금](/ko/smart-contracts/genesis/launch-pool#withdrawing) |
| 토큰 청구 | `claimLaunchPoolV2` | [토큰 청구](/ko/smart-contracts/genesis/launch-pool#claiming-tokens) |
| 초과 청약 또는 실패 시 환불 | `refundLaunchPoolV2` | [환불](/ko/smart-contracts/genesis/launch-pool#refunding-a-deposit) |

선택적인 Launch Pool 확장은 누가 예치할 수 있는지와 예치자가 토큰을 받는 방식을 제어합니다. 제한된 판매에는 `allowlist`, 서버 공동 서명이 필요한 경우(예: KYC 후)에는 `backendSigner`, 지갑별 한도에는 `depositLimit`과 `minimumDepositAmount`, 예치자 토큰 베스팅에는 `claimSchedule`을 사용합니다. [Launch Pool 확장](/ko/smart-contracts/genesis/launch-pool#launch-pool-extensions)을 참조하세요.

{% callout type="note" %}
"청구 크랭크 대기 중"을 별도의 단계로 표시하세요. 졸업과 `triggerConditionsV2` 호출 사이에는 풀이 Raydium에서 활성화되어 있지만 `claimLaunchPoolV2`는 여전히 실패하며, 사용자는 이를 버그로 오해하기 쉽습니다.
{% /callout %}

## 3단계: 런칭 크랭크 실행 {% #step-3-run-the-launch-crank %}

크랭크는 온체인 상태를 확인하고 다음 무허가 트랜잭션을 보내는 멱등(idempotent) 스크립트이므로, 모든 단계가 완료될 때까지 타이머로 실행할 수 있습니다.

{% code-tabs-imported from="genesis/launch_pool_lifecycle_crank" frameworks="umi" filename="crank" /%}

서버, 예약 작업, 또는 키퍼 봇에서 1분마다 실행하세요. 자금이 있는 지갑이면 어떤 지갑이든 비용을 지불할 수 있으며, Genesis 권한자 키는 필요하지 않습니다. 크랭크는 버킷의 조건 중 하나가 도래했을 때만 해당 버킷에 대해 `triggerConditionsV2`를 보내므로, 팀 클리프 전 90일 동안은 매분 수수료를 내지 않고 대기합니다.

## 운영자 크랭크 런북 {% #operator-crank-runbook %}

런북은 `finalizeV2` 이후 런칭에 필요한 모든 트랜잭션을 순서대로 나열하고, 각 단계를 건너뛰면 무엇이 문제가 되는지 보여줍니다.

| # | 시점 | 명령어 | 서명자 | 건너뛰면 |
|---|------|-------------|--------|-----------|
| 1 | `depositEnd` 이후 | Raydium 및 트레저리 쌍을 지정하여 Launch Pool에 대한 `triggerBehaviorsV2` | 모든 지불자 | SOL과 가격이 Raydium에 전달되지 않음. 졸업이 `InvalidAmount`로 실패함. 트레저리에 SOL이 없음 |
| 2 | 1단계 및 Raydium `startCondition` 이후 | `graduateToRaydiumCpmmV2` | 모든 지불자 (설정된 경우 + 백엔드 서명자) | 풀이 없음. 졸업 기준 청구가 모두 닫힌 상태로 남음 |
| 3 | 2단계 이후 | 트레저리 쌍을 지정하여 Raydium 버킷에 대한 `triggerBehaviorsV2` | 모든 지불자 | 사용되지 않은 Raydium 베이스 토큰이 Genesis에 묶여 있음 |
| 4 | 2단계 이후 | Launch Pool, 트레저리, 팀 버킷 각각에 대해 Raydium 버킷을 remaining account로 지정한 `triggerConditionsV2` | 모든 지불자 | 풀이 활성화되었는데도 **청구가 열리지 않음** |
| 5 | Graduate + 90일 | 팀 버킷에 대한 `triggerConditionsV2` 재실행 | 모든 지불자 | 팀 클리프가 잠긴 상태로 남음 |
| 6 | 상시 | `collectRaydiumCpmmFeesV2` 또는 `collectRaydiumCpmmFeesWithCreatorFeeV2` | 모든 지불자 | Raydium 창작자 수수료가 수집되지 않고 누적됨 |

{% callout type="warning" %}
4단계는 팀이 가장 자주 놓치는 단계입니다. 졸업은 Raydium 버킷에만 `Graduate` 시간을 기록하므로, `TimeRelative` 조건이 있는 각 버킷은 별도로 트리거해야 합니다. [조건 및 트리거](/ko/smart-contracts/genesis/conditions#when-to-call-trigger-conditions-v2)를 참조하세요.
{% /callout %}

## 4단계: 청구 및 런칭 후 운영 {% #step-4-claims-and-post-launch-operations %}

크랭크가 완료되면 각 당사자는 자신의 명령어로 청구하고, Genesis 권한자는 나머지 관리 작업을 처리합니다.

| 주체 | 작업 | 명령어 | 문서 |
|-----|--------|-------------|------|
| 예치자 | 구매한 토큰 청구 | `claimLaunchPoolV2` | [Launch Pool](/ko/smart-contracts/genesis/launch-pool#claiming-tokens) |
| 트레저리 | SOL의 80%, 베이스 할당량, 롤오버분 청구 | `claimUnlockedV2` | [Unlocked 버킷](/ko/smart-contracts/genesis/unlocked-bucket#claiming-from-an-unlocked-bucket) |
| 팀 | 베스팅된 토큰 청구 | `claimClaimScheduleV2` | [Project Vesting](/ko/smart-contracts/genesis/project-vesting#claim-vested-project-tokens) |
| LP 청구 권한자 | 분기마다 잠금 해제된 LP 토큰 청구 | `claimRaydiumCpmmLpTokensV2` | [Raydium LP 토큰](/ko/smart-contracts/genesis/raydium-cpmm-graduation#managing-raydium-lp-tokens) |
| Genesis 권한자 | 민트 및 동결 권한 폐기 | `revokeV2` | [JavaScript SDK](/ko/smart-contracts/genesis/sdk/javascript#revoke-v2) |

## 일반적인 라이프사이클 오류 {% #common-lifecycle-errors %}

라이프사이클 오류는 보통 크랭크 단계가 순서에 맞지 않게 실행되었거나 버킷 구성의 합계가 맞지 않는다는 뜻입니다.

| 오류 | 원인 | 해결 방법 |
|-------|-------|------------|
| `LaunchPoolNotEnded` | `depositEnd` 전에 동작을 트리거함 | 예치 기간이 마감될 때까지 대기 |
| 졸업 시 `InvalidAmount` | Launch Pool 동작이 실행되지 않음 | 먼저 런북 1단계 실행 |
| `GraduationNotStarted` | Raydium `startCondition`이 충족되지 않음 | 대기하거나, `TimeRelative` 시작을 트리거 |
| `ClaimNotStarted` | 졸업 후 `triggerConditionsV2`를 실행하지 않음 | 런북 4단계 실행 |
| `RecipientMismatch` | 저장된 수신자 없이 `claimUnlockedV2`를 전송함 | `recipient: bucket.recipient` 전달 |
| `TotalSupplyNotFullyAllocated` | 버킷 할당량의 합계가 총 공급량과 맞지 않음 | `finalizeV2` 전에 할당량 재계산 |
| `MissingFinalizeBucketAccounts` | `finalizeV2`에 모든 버킷을 remaining account로 전달하지 않음 | 모든 버킷 PDA를 읽기 전용으로 전달 |

## 참고 사항 {% #notes %}

- SDK로 직접 생성한 런칭의 크랭크를 Metaplex 인프라에 의존하지 마세요. 자체 크랭크를 실행하고 모니터링하세요.
- 모든 크랭크 명령어는 멱등적입니다. 반복되거나 동시에 전송된 트랜잭션은 자금을 두 번 이동하지 않고 실패하거나 아무 작업도 하지 않습니다.
- Launch Pool은 기본적으로 수수료 없이 Raydium과 트레저리로 수익을 전달하며, 트레저리가 청구할 때 청구 수수료를 지불합니다. [프로토콜 수수료](/ko/smart-contracts/genesis#protocol-fees)를 참조하세요.
- 이 가이드는 Raydium CPMM을 다룹니다. Raydium CLMM 졸업은 다른 버킷과 명령어를 사용합니다.
- 설정, 판매 페이지, 크랭크 예제는 예치 기간을 단축하여 데브넷에서 `@metaplex-foundation/genesis@0.44.0`으로 배포된 Genesis 릴리스 `genesis v0.41.0`을 대상으로 처음부터 끝까지 실행되었습니다. 데브넷에서는 `deriveRaydiumPDAsV2`에 `{ env: 'devnet' }`을 전달하세요. 배포된 프로그램은 Token-2022 베이스 민트를 지원하지 않습니다. 소스: [metaplex-foundation/genesis](https://github.com/metaplex-foundation/genesis).

## FAQ {% #faq %}

### SDK로 만든 런칭에는 자체 크랭크를 실행해야 하나요?

네. SDK로 직접 생성한 런칭에는 자체 크랭크를 실행할 계획을 세우세요. 모든 크랭크 단계(`triggerBehaviorsV2`, `graduateToRaydiumCpmmV2`, `triggerConditionsV2`)는 무허가이며 자금이 있는 수수료 지불자만 있으면 됩니다.

### 예치 마감 후 아무도 크랭크를 실행하지 않으면 어떻게 되나요?

아무것도 이동하지 않습니다. 모금된 SOL은 Launch Pool에 남고, Raydium 풀은 생성되지 않으며, 졸업을 기준으로 하는 청구는 열리지 않습니다. 예치자의 자금은 안전하게 유지되지만, 누군가 크랭크 트랜잭션을 보낼 때까지 런칭이 멈춥니다.

### 예치 마감 후 사용자는 언제부터 청구할 수 있나요?

크랭크가 세 단계(Launch Pool에 대한 `triggerBehaviorsV2`, `graduateToRaydiumCpmmV2`, Launch Pool에 대한 `triggerConditionsV2`)를 실행하는 즉시 가능합니다. 1분마다 폴링하는 크랭크는 보통 졸업 시작 시간으로부터 몇 분 내에 이를 완료합니다.

### 버킷 할당량의 합계가 총 공급량과 같아야 하나요?

네. `finalizeV2`는 모든 버킷의 `baseTokenAllocation` 합계가 Genesis 계정의 총 공급량과 같아야 합니다.

### 예치자의 토큰을 청구 시 잠금 해제하는 대신 베스팅할 수 있나요?

네. Launch Pool 버킷에 `claimSchedule` 확장을 추가하세요. 그 시작 및 클리프 조건도 Raydium `Graduate` 시간을 기준으로 하는 `TimeRelative`로 설정할 수 있습니다.

## 다음 단계 {% #next-steps %}

- [조건 및 트리거](/ko/smart-contracts/genesis/conditions) - `TimeRelative` 조건과 `triggerConditionsV2`의 작동 방식
- [종료 동작](/ko/smart-contracts/genesis/end-behaviors) - 수익 라우팅, 롤오버, 실패 처리
- [Raydium CPMM 졸업](/ko/smart-contracts/genesis/raydium-cpmm-graduation) - 졸업 버킷, LP 토큰, 수수료
- [Genesis API 클라이언트](/ko/smart-contracts/genesis/sdk/api-client) - 한 번의 호출로 런치 풀을 만들고 metaplex.com에 게시
