---
title: Unlocked 버킷
metaTitle: Genesis Unlocked 버킷 — 트레저리 및 비베스팅 할당량 | Metaplex
description: Genesis UnlockedBucketV2로 모금된 SOL을 받고 베스팅이 없는 토큰 할당량을 보관한 뒤, 청구 기간이 열리면 claimUnlockedV2로 청구하는 방법을 설명합니다.
created: '10-29-2026'
updated: '11-24-2026'
keywords:
  - Genesis unlocked bucket
  - UnlockedBucketV2
  - claimUnlockedV2
  - addUnlockedBucketV2
  - launch treasury
  - raised SOL withdrawal
  - team token allocation
about:
  - Genesis unlocked buckets
  - Treasury allocations
  - Token claims
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - 최종화 전에 수신자, 할당량, 청구 기간을 지정하여 UnlockedBucketV2를 추가합니다
  - 판매 버킷의 SendQuoteTokenPercentage 종료 동작이 Unlocked 버킷을 대상으로 하도록 설정합니다
  - 예치가 마감된 후 triggerBehaviorsV2를 실행하여 모금된 SOL을 이동합니다
  - 청구 기간이 열리면 claimUnlockedV2를 호출합니다
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: Genesis에서 Unlocked 버킷이란 무엇인가요?
    a: UnlockedBucketV2는 청구 기간이 열리면 베이스 토큰과 쿼트 토큰 잔액 전체를 한 명의 수신자에게 지급하는 유출(outflow) 버킷입니다. 예치나 베스팅이 없습니다.
  - q: 청구 스케줄 버킷 대신 Unlocked 버킷을 사용해야 하는 경우는 언제인가요?
    a: 트레저리용 모금 SOL이나 마켓 메이커 할당량처럼 수신자가 한 번에 받아야 하는 자금에는 Unlocked 버킷을 사용하세요. 시간에 따라 잠금 해제되어야 하는 팀 또는 투자자 토큰에는 ClaimScheduleBucketV2를 사용하세요.
  - q: 수신자가 claimUnlockedV2에 서명해야 하나요?
    a: 아니요. 어떤 지불자든 claimUnlockedV2를 전송할 수 있지만, 토큰은 항상 버킷에 저장된 수신자에게 갑니다. SDK는 수신자의 기본값을 지불자로 설정하므로 수신자를 명시적으로 전달하세요.
  - q: Unlocked 버킷을 두 번 이상 청구할 수 있나요?
    a: 네. 각 청구는 현재 잔액을 전부 가져가므로, 청구 기간이 열려 있는 동안에는 롤오버나 재할당 동작으로 나중에 적립된 금액을 다시 청구할 수 있습니다.
  - q: Unlocked 버킷에서 모금된 SOL을 청구할 때 수수료가 있나요?
    a: 쿼트 토큰을 청구할 때 버킷의 청구 수수료가 차감됩니다. 현재 수수료율은 Genesis 개요 페이지의 프로토콜 수수료에 나와 있습니다.
---

`UnlockedBucketV2`는 청구 기간이 열리는 즉시 베이스 토큰과 모금된 쿼트 토큰을 포함한 잔액 전체를 한 명의 수신자에게 지급하는 [Genesis](/ko/smart-contracts/genesis) 버킷입니다. {% .lead %}

## 요약 {% #summary %}

Unlocked 버킷은 선택적인 베이스 토큰 할당량을 보관하고, 종료 동작을 통해 모금된 SOL 같은 쿼트 토큰을 받으며, 청구 기간 동안 누구나 두 잔액을 수신자에게 전부 보낼 수 있게 합니다.

- 버킷 하나에는 수신자 하나가 있으며 베스팅 커브가 없습니다
- 판매 수익, 롤오버된 Raydium 토큰, 실패한 판매에서 재할당된 토큰의 일반적인 대상입니다
- `claimUnlockedV2`는 무허가(permissionless)이며 반복 실행할 수 있지만, 항상 저장된 수신자에게 지급합니다
- 토큰이 베스팅되어야 한다면 대신 [청구 스케줄 버킷](/ko/smart-contracts/genesis/project-vesting)을 사용하세요

**바로 가기:** [사용 시점](#when-to-use-an-unlocked-bucket) · [추가](#adding-an-unlocked-bucket) · [자금 공급](#funding-an-unlocked-bucket) · [청구](#claiming-from-an-unlocked-bucket) · [오류](#common-unlocked-bucket-errors)

## Unlocked 버킷을 사용해야 하는 경우 {% #when-to-use-an-unlocked-bucket %}

Unlocked 버킷은 수신자가 시간에 걸쳐서가 아니라 한 시점에 전부 받아야 하는 모든 할당량에 적합합니다.

| 사용 사례 | 버킷 | 이유 |
|----------|--------|-----|
| 프로젝트 트레저리용 모금 SOL | `UnlockedBucketV2` | `SendQuoteTokenPercentage` 수익을 받아 한 번의 청구로 지급 |
| 마켓 메이커 또는 거래소 재고 | `UnlockedBucketV2` | 클리프 없이 상장 시점에 토큰이 필요함 |
| 사용되지 않은 Raydium 베이스 토큰의 대상 | `UnlockedBucketV2` | 졸업 후 `BaseTokenRollover` 적립분을 받음 |
| 실패한 판매의 미판매 토큰 대상 | `UnlockedBucketV2` | `ReallocateBaseTokensOnFailure` 적립분을 받음 |
| 팀, 어드바이저, 또는 투자자 토큰 | [`ClaimScheduleBucketV2`](/ko/smart-contracts/genesis/project-vesting) | 클리프와 선형 잠금 해제가 필요함 |
| Launch Pool의 예치자 베스팅 | Launch Pool `claimSchedule` 확장 | 각 예치자 자신의 토큰을 베스팅함 |

## Unlocked 버킷 추가하기 {% #adding-an-unlocked-bucket %}

`addUnlockedBucketV2`는 `finalizeV2` 전에 수신자, 베이스 토큰 할당량, 청구 기간을 지정하여 버킷을 생성합니다.

{% code-tabs-imported from="genesis/add_unlocked_treasury_bucket_v2" frameworks="umi" filename="addUnlockedBucket" /%}

| 인수 | 설명 |
|----------|-------------|
| `recipient` | 모든 청구를 받는 지갑 |
| `baseTokenAllocation` | 총 공급량에서 예약되는 베이스 토큰. 쿼트 토큰만 받는 버킷이면 `0n` |
| `claimStartCondition` | 청구가 열리는 시점. 시작 슬롯: `TimeAbsolute`, `TimeRelative`, 또는 `Always` |
| `claimEndCondition` | 청구가 닫히는 시점. `TimeAbsolute`, `TimeRelative`, 또는 `Never` |
| `backendSigner` | 모든 청구에 필요한 선택적 공동 서명자. Genesis 권한자가 나중에 `setBucketBackendSignerV2`로 교체하거나 해제할 수 있음 |
| `bucketIndex` | PDA 시드 `["unlocked_v2", genesisAccount, bucketIndex]`. 기본값 `0` |

{% callout type="warning" %}
`BaseTokenRollover`나 실패 재할당을 받는 모든 Unlocked 버킷은 청구 종료로 `createNeverCondition()`을 사용하세요. 청구 기간이 닫힌 후에 적립된 토큰은 절대 청구할 수 없습니다.
{% /callout %}

`updateUnlockedBucketV2`는 `finalizeV2` 전에 할당량과 청구 조건을 변경할 수 있습니다. Unlocked 버킷은 자체 종료 동작을 실행하지 않으며, 항상 대상으로만 사용됩니다.

## Unlocked 버킷에 자금 공급하기 {% #funding-an-unlocked-bucket %}

Unlocked 버킷은 베이스 토큰 할당량으로 시작하며, 나머지는 모두 다른 버킷의 [종료 동작](/ko/smart-contracts/genesis/end-behaviors)으로부터 받습니다.

| 적립 항목 | 소스 버킷 동작 | 일반적인 시점 |
|--------|------------------------|----------------|
| 모금된 쿼트 토큰 | Launch Pool, Presale, 또는 본딩 커브의 `SendQuoteTokenPercentage` | 예치 마감 후 |
| 사용되지 않은 Raydium 베이스 토큰 | Raydium CPMM 버킷의 `BaseTokenRollover` | 졸업 후 |
| 실패 시 미판매 베이스 토큰 | 판매 버킷 또는 Raydium 버킷의 `ReallocateBaseTokensOnFailure` | 판매 실패 후 |
| 베스팅되지 않은 토큰 | 청구 스케줄 버킷의 `ReallocateBaseTokensOnCancel` | 취소 후 |

Unlocked 버킷과 그 쿼트 토큰 계정을 remaining account 쌍으로 `triggerBehaviorsV2`에 전달하세요. 쿼트 토큰 계정은 버킷이 소유한 쿼트 민트의 [연관 토큰 계정(associated token account)](/ko/solana/understanding-solana-accounts#associated-token-accounts-atas)입니다.

{% code-tabs-imported from="genesis/trigger_launch_pool_graduation_v2" frameworks="umi" filename="triggerBehaviorsV2" /%}

## Unlocked 버킷에서 청구하기 {% #claiming-from-an-unlocked-bucket %}

`claimUnlockedV2`는 버킷의 베이스 토큰 잔액 전체와, 청구 수수료를 뺀 쿼트 토큰 잔액을 저장된 수신자에게 보냅니다.

{% code-tabs-imported from="genesis/claim_unlocked_v2" frameworks="umi" filename="claimUnlockedV2" /%}

| 규칙 | 세부 사항 |
|------|--------|
| 서명자 | 어떤 수수료 지불자든 가능. 수신자는 서명할 필요 없음 |
| 대상 | 항상 저장된 `recipient`. 일치하지 않으면 `RecipientMismatch`로 실패 |
| SDK 기본값 | `recipient`의 기본값이 지불자이므로, 크랭크가 청구할 때는 명시적으로 전달 |
| 기간 | 청구 시작이 충족되고 청구 종료가 충족되지 않아야 함 |
| 반복 청구 | 새로 가져갈 잔액이 있으면 언제든 허용 |
| 백엔드 서명자 | 설정된 경우 공동 서명해야 함 |

{% callout type="note" %}
청구하기 전에 판매 버킷에 대해 `triggerBehaviorsV2`를 실행하세요. 그 전까지 모금된 SOL은 판매 버킷에 남아 있으며, 청구는 베이스 토큰만 지급합니다.
{% /callout %}

### Raydium 졸업 시점에 청구하기 {% #claiming-at-raydium-graduation %}

`BucketTimes.Graduate`를 참조하는 `TimeRelative` 청구 시작은 Raydium 버킷을 remaining account로 지정하여 Unlocked 버킷에 대해 `triggerConditionsV2`를 실행한 후에만 열립니다. [조건 및 트리거](/ko/smart-contracts/genesis/conditions#opening-claims-at-raydium-graduation)를 참조하세요.

### 판매 실패 후 청구하기 {% #claiming-after-a-failed-sale %}

Unlocked 버킷을 대상으로 하는 `TransmitFailure` 동작이 있는 판매는, 판매가 실패하면 청구 시작 조건을 무시하고 즉시 청구를 엽니다. 청구 종료 조건은 그대로 적용됩니다.

## 일반적인 Unlocked 버킷 오류 {% #common-unlocked-bucket-errors %}

Unlocked 버킷 오류는 청구 기간 외의 청구, 잘못된 수신자, 또는 가져갈 잔액이 남아 있지 않은 버킷을 나타냅니다.

| 오류 | 원인 | 해결 방법 |
|-------|-------|------------|
| `RecipientMismatch` | `recipient`가 버킷에 저장된 수신자와 다름 | 버킷을 조회하여 `bucket.recipient` 전달 |
| `UnlockedBucketAlreadyClaimed` | 베이스 잔액과 쿼트 잔액이 모두 0임 | 새 적립을 기다리거나, 남은 잔액이 없음 |
| `InvalidBackendSigner` | 설정된 백엔드 서명자가 공동 서명하지 않음 | 백엔드 서명자를 추가하거나, 분실한 키는 `setBucketBackendSignerV2`로 교체 |
| `ClaimNotStarted` | 청구 시작 조건이 충족되지 않음 | 대기하거나, `TimeRelative` 시작이면 먼저 `triggerConditionsV2` 실행 |
| `UnlockedBucketClaimEnded` | 청구 종료 조건이 지남 | 늦은 적립을 받는 버킷에는 `Never` 청구 종료 사용 |

## 참고 사항 {% #notes %}

- 쿼트 민트가 래핑된 SOL이면 청구 시 버킷의 쿼트 토큰 계정이 닫힙니다. 버킷으로 쿼트 토큰을 보내는 다른 동작을 실행하기 전에 ATA를 다시 생성하세요.
- 어떤 판매에서 온 `TransmitFailure`든 버킷을 열기 때문에, 버킷이 기다리는 졸업과 연결된 판매에만 이 동작을 연결하세요.
- 청구 수수료는 [프로토콜 수수료](/ko/smart-contracts/genesis#protocol-fees)에 나와 있습니다.
- 예제는 데브넷에서 `@metaplex-foundation/genesis@0.44.0`으로 배포된 Genesis 프로그램 릴리스 `genesis v0.41.0`(`GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`)을 대상으로 실행되었습니다. 소스: [metaplex-foundation/genesis](https://github.com/metaplex-foundation/genesis).

## FAQ {% #faq %}

### Genesis에서 Unlocked 버킷이란 무엇인가요?

`UnlockedBucketV2`는 청구 기간이 열리면 베이스 토큰과 쿼트 토큰 잔액 전체를 한 명의 수신자에게 지급하는 유출(outflow) 버킷입니다. 예치나 베스팅이 없습니다.

### 청구 스케줄 버킷 대신 Unlocked 버킷을 사용해야 하는 경우는 언제인가요?

트레저리용 모금 SOL이나 마켓 메이커 할당량처럼 수신자가 한 번에 받아야 하는 자금에는 Unlocked 버킷을 사용하세요. 시간에 따라 잠금 해제되어야 하는 팀 또는 투자자 토큰에는 `ClaimScheduleBucketV2`를 사용하세요.

### 수신자가 claimUnlockedV2에 서명해야 하나요?

아니요. 어떤 지불자든 `claimUnlockedV2`를 전송할 수 있지만, 토큰은 항상 버킷에 저장된 수신자에게 갑니다. SDK는 수신자의 기본값을 지불자로 설정하므로 수신자를 명시적으로 전달하세요.

### Unlocked 버킷을 두 번 이상 청구할 수 있나요?

네. 각 청구는 현재 잔액을 전부 가져가므로, 청구 기간이 열려 있는 동안에는 롤오버나 재할당 동작으로 나중에 적립된 금액을 다시 청구할 수 있습니다.

### Unlocked 버킷에서 모금된 SOL을 청구할 때 수수료가 있나요?

쿼트 토큰을 청구할 때 버킷의 청구 수수료가 차감됩니다. 현재 수수료율은 Genesis 개요 페이지의 [프로토콜 수수료](/ko/smart-contracts/genesis#protocol-fees)에 나와 있습니다.

## 용어집 {% #glossary %}

| 용어 | 정의 |
|------|------------|
| **UnlockedBucketV2** | 청구 기간 동안 잔액 전체를 한 명의 수신자에게 지급하는 Genesis 유출 버킷 |
| **수신자(Recipient)** | 버킷에 저장되어 모든 청구를 받는 지갑 |
| **청구 기간(Claim window)** | 청구 시작 조건과 청구 종료 조건 사이의 기간 |
| **스윕(Sweep)** | 버킷의 현재 잔액 전체를 전송하는 청구 |
| **쿼트 토큰(Quote tokens)** | 예치자가 지불하는 토큰. 보통 래핑된 SOL |
