---
title: 시작하기
metaTitle: Genesis 시작하기 | 솔라나에서 토큰 출시하는 방법 | Metaplex
description: 솔라나에서 SPL 토큰을 출시하는 방법을 단계별로 배우세요. Genesis 토큰 런치패드를 사용하여 프리세일, 공정한 출시, 토큰 세일을 계획하세요.
created: '01-15-2025'
updated: '02-17-2026'
keywords:
  - Genesis tutorial
  - token launch flow
  - Genesis setup
  - TGE steps
  - launch planning
  - how to launch a token
  - SPL token launch
  - token launchpad
  - token launch guide
  - token sale guide
about:
  - Genesis flow
  - Launch lifecycle
  - Token distribution
proficiencyLevel: Beginner
faqs:
  - q: Genesis Account 초기화 시 무엇이 생성되나요?
    a: 메타데이터가 포함된 새로운 SPL 토큰, 마스터 조정 계정, 그리고 배포를 위해 에스크로에 보관되는 전체 토큰 공급량이 생성됩니다.
  - q: Finalize 후에 Bucket을 더 추가할 수 있나요?
    a: 아니요. Finalize는 영구적입니다. Finalize 후에는 Bucket을 더 추가하거나 구성을 변경할 수 없습니다.
  - q: Inflow와 Outflow Bucket의 차이점은 무엇인가요?
    a: Inflow Bucket은 사용자로부터 SOL을 수집합니다 (Launch Pool, Presale). Outflow Bucket은 팀/재무 청구를 위해 토큰 또는 SOL을 받습니다.
  - q: 출시는 언제 활성화되나요?
    a: Finalize 후, Bucket 시간 조건(시작 타임스탬프)에 따라 출시가 활성화됩니다.
  - q: 소수점이 있는 토큰 공급량은 어떻게 계산하나요?
    a: 원하는 공급량에 10^소수점을 곱합니다. 소수점 9자리의 100만 토큰의 경우 1,000,000,000,000,000을 사용합니다.
---

빌드하기 전에 Genesis 토큰 출시 흐름을 이해하세요. 솔라나에서 프리세일, 공정한 출시, 토큰 세일을 계획하고 있다면, 이 가이드가 SPL 토큰 생성부터 배포까지 각 단계를 설명합니다. {% .lead %}

{% callout title="노코드 옵션" %}
코드 작성 없이 토큰을 출시하고 싶다면 [Metaplex 토큰 런치패드](https://www.metaplex.com)를 사용하세요. 아래 가이드는 맞춤형 런치패드 플랫폼을 구축하거나 자체 웹사이트에서 토큰 세일을 호스팅하려는 개발자를 위한 것입니다.
{% /callout %}

{% callout title="빌드할 준비가 되셨나요?" %}
흐름을 이해했다면:
- **[JavaScript SDK](/ko/smart-contracts/genesis/sdk/javascript)** - 설치 및 함수 참조
- **[Launch Pool](/ko/smart-contracts/genesis/launch-pool)** - 비례 배분을 위한 전체 튜토리얼
- **[Presale](/ko/smart-contracts/genesis/presale)** - 고정 가격 판매를 위한 전체 튜토리얼
{% /callout %}

## Genesis 흐름

모든 Genesis 출시는 다음 생명주기를 따릅니다:

```
┌─────────────────────────────────────────────────────────────────┐
│  1. INITIALIZE                                                   │
│     Create Genesis Account → Mint token → Hold supply in escrow │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. ADD BUCKETS                                                  │
│     Configure distribution (Launch Pool, Presale, Treasury)     │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. FINALIZE                                                     │
│     Lock configuration → Activate time conditions               │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│  4. DEPOSIT PERIOD                                               │
│     Users deposit SOL based on bucket type                      │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│  5. TRANSITION                                                   │
│     Execute end behaviors → Route funds to treasury             │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│  6. CLAIM PERIOD                                                 │
│     Users claim tokens → Team claims raised funds               │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│  7. POST-LAUNCH (Optional)                                       │
│     Revoke mint/freeze authorities for security                 │
└─────────────────────────────────────────────────────────────────┘
```

## 1단계: 초기화

**진행 사항:** 토큰을 발행하고 전체 공급량을 에스크로에 보관하는 Genesis Account를 생성합니다.

**제공해야 할 것:**
- 토큰 메타데이터 (이름, 심볼, URI)
- 총 공급량 (소수점 포함)
- Quote 토큰 (일반적으로 wSOL)

**결과:** 새로운 SPL 토큰이 생성되어 배포 시까지 Genesis Account가 관리합니다.

### 토큰 공급량 계획

SPL 토큰은 기본적으로 9자리 소수점을 사용합니다:

| 원하는 공급량 | 9자리 소수점 적용 시 |
|----------------|-----------------|
| 1 토큰 | 1,000,000,000 |
| 1,000 토큰 | 1,000,000,000,000 |
| 100만 토큰 | 1,000,000,000,000,000 |
| 10억 토큰 | 1,000,000,000,000,000,000 |

**중요:** 총 공급량은 모든 Bucket 할당량의 합과 같아야 합니다.

## 2단계: Bucket 추가

**진행 사항:** Bucket을 추가하여 토큰 배포 방식을 구성합니다.

### Bucket 유형

| Bucket | 유형 | 목적 |
|--------|------|---------|
| **Launch Pool** | Inflow | 예치금에 따른 비례 배분 |
| **Presale** | Inflow | 상한까지의 고정 가격 판매 |
| **Unlocked** | Outflow | 모금된 자금을 받는 재무 |

### 구성 예시

일반적인 출시는 다음을 사용합니다:

1. **Inflow Bucket** (Launch Pool 또는 Presale) - 참가자로부터 SOL 수집
2. **Outflow Bucket** (Unlocked) - 팀/재무를 위해 수집된 SOL 수령

```
Token Allocation Example (1 million tokens):
├── Launch Pool: 800,000 tokens (80%)
└── Unlocked:    200,000 tokens (20% team allocation)

Fund Flow:
Users deposit SOL → Launch Pool → End Behavior → Unlocked Bucket → Team claims
```

### 시간 조건

각 Bucket에는 네 가지 시간 조건이 있습니다:

| 조건 | 제어 내용 |
|-----------|----------|
| Deposit Start | 사용자가 예치를 시작할 수 있는 시점 |
| Deposit End | 예치가 마감되는 시점 |
| Claim Start | 사용자가 토큰을 청구할 수 있는 시점 |
| Claim End | 청구가 마감되는 시점 |

Unix 타임스탬프를 사용합니다 (밀리초가 아닌 초 단위).

## 3단계: Finalize

**진행 사항:** 구성이 영구적으로 잠깁니다. 시간 조건에 따라 출시가 활성화됩니다.

### Finalize 전후 비교

| 전 | 후 |
|--------|-------|
| Bucket 추가 가능 | 더 이상 Bucket 추가 불가 |
| 설정 수정 가능 | 설정 잠김 |
| 출시 비활성 | 출시 활성 (시간 조건에 따름) |

{% callout type="warning" %}
**Finalize는 되돌릴 수 없습니다.** Finalize 전에 Bucket 할당, 시간 조건, 종료 동작을 세 번 확인하세요.
{% /callout %}

## 4단계: 예치 기간

**진행 사항:** 사용자가 Inflow Bucket에 SOL을 예치합니다.

- **Launch Pool:** 사용자가 SOL을 예치하고, {% fee product="genesis" config="launchPool" fee="withdraw" /%} 수수료로 출금 가능
- **Presale:** 사용자가 고정 가격으로 SOL을 예치하며, 사용자당 예치 상한(각 사용자가 기여할 수 있는 최대 금액)까지 가능

모든 예치에 {% fee product="genesis" config="launchPool" fee="deposit" /%} 프로토콜 수수료가 적용됩니다.

## 5단계: Transition

**진행 사항:** 예치가 마감된 후, 종료 동작을 실행하여 자금을 라우팅합니다.

일반적인 종료 동작: 수집된 SOL의 100%를 Unlocked Bucket (재무)으로 전송합니다.

여러 목적지로 자금을 분할할 수 있습니다:
- 80%는 재무로
- 20%는 유동성 풀 Bucket으로

## 6단계: 청구 기간

**진행 사항:**
- 사용자가 예치금에 따라 토큰을 청구합니다
- 팀이 Unlocked Bucket에서 모금된 SOL을 청구합니다

### 토큰 배분

**Launch Pool:** `사용자 토큰 = (사용자 예치금 / 총 예치금) × Bucket 할당량`

**Presale:** `사용자 토큰 = 사용자 예치금 / 토큰당 가격`

## 7단계: 출시 후 (선택 사항)

**진행 사항:** 보안을 위해 토큰 권한을 폐기합니다.

- **Mint authority** - 더 이상 토큰을 발행할 수 없도록 폐기
- **Freeze authority** - 토큰을 동결할 수 없도록 폐기

이는 보유자와 러그 체커에게 토큰 공급량이 고정되었음을 알려줍니다.

{% callout type="warning" %}
권한 폐기는 되돌릴 수 없습니다. 출시가 완료되었을 때만 이 작업을 수행하세요.
{% /callout %}

## 일반적인 오류

| 오류 | 원인 | 해결 방법 |
|-------|-------|----------|
| `already finalized` | Finalize 후 수정 시도 | 새 Genesis Account 생성 |
| `invalid total supply` | Bucket 할당량이 공급량과 불일치 | 할당량 합계가 총량과 일치하는지 확인 |
| `time conditions overlap` | 타임스탬프 충돌 | 순차적인 시간 창 사용 |
| `deposit period not active` | 예치 창 외부 | 타임스탬프 확인 |

## 계획 체크리스트

빌드를 시작하기 전에:

- [ ] 출시 메커니즘 결정 (공정한 출시/크라우드세일을 위한 Launch Pool, 고정 가격 판매를 위한 Presale)
- [ ] 소수점이 포함된 총 토큰 공급량 계산
- [ ] Bucket 할당 계획 (총 공급량과 합이 일치해야 함)
- [ ] 시간 창 설정 (예치 시작/종료, 청구 시작/종료)
- [ ] 종료 동작 결정 (자금은 어디로 가는가?)
- [ ] 토큰 메타데이터 준비 (이름, 심볼, 이미지 URI)

## FAQ

### Genesis Account 초기화 시 무엇이 생성되나요?
메타데이터가 포함된 새로운 SPL 토큰, 마스터 조정 계정 (Genesis Account PDA), 그리고 배포를 위해 에스크로에 보관되는 총 공급량이 발행됩니다.

### Finalize 후에 Bucket을 더 추가할 수 있나요?
아니요. Finalize는 영구적입니다. Bucket을 더 추가하거나 구성을 변경할 수 없습니다. Finalize 전에 완전한 Bucket 구조를 계획하세요.

### Inflow와 Outflow Bucket의 차이점은 무엇인가요?
**Inflow Bucket**은 사용자로부터 SOL을 수집합니다 (Launch Pool, Presale). **Outflow Bucket**은 종료 동작을 통해 토큰 또는 SOL을 받습니다—일반적으로 팀/재무 청구를 위한 Unlocked Bucket입니다.

### 출시는 언제 활성화되나요?
Finalize 후, Bucket 시간 조건에 따라 출시가 활성화됩니다. 현재 시간이 Bucket의 예치 창 내에 있을 때 사용자가 참여할 수 있습니다.

### 소수점이 있는 토큰 공급량은 어떻게 계산하나요?
원하는 공급량에 10^소수점을 곱합니다. 소수점 9자리의 100만 토큰의 경우: 1,000,000 × 1,000,000,000 = 1,000,000,000,000,000.

### SOL 이외의 토큰을 예치에 사용할 수 있나요?
예. `quoteMint`를 아무 SPL 토큰으로 설정할 수 있습니다. 그러나 SOL 단위 출시에는 wSOL이 표준입니다.

## 용어집

| 용어 | 정의 |
|------|------------|
| **Genesis Account** | 출시를 조정하고 토큰을 보관하는 PDA |
| **Inflow Bucket** | 사용자로부터 예치금을 수집하는 Bucket |
| **Outflow Bucket** | 종료 동작을 통해 자금을 받는 Bucket |
| **Finalize** | 구성을 잠그고 출시를 활성화 |
| **Time Condition** | Bucket 단계를 제어하는 Unix 타임스탬프 |
| **End Behavior** | 예치 기간 종료 시 자동화된 동작 |
| **Transition** | 종료 동작을 실행하는 명령 |
| **Quote Token** | 사용자가 예치하는 토큰 (일반적으로 wSOL) |

## 다음 단계

빌드할 준비가 되셨나요? 토큰 출시 유형을 선택하세요:

1. **[토큰 출시하기](/ko/tokens/launch-token)** - 엔드투엔드 토큰 출시 가이드
2. **[JavaScript SDK](/ko/smart-contracts/genesis/sdk/javascript)** - 설치 및 구성
3. **[Launch Pool 튜토리얼](/ko/smart-contracts/genesis/launch-pool)** - 비례 배분을 통한 공정한 출시
4. **[Presale 튜토리얼](/ko/smart-contracts/genesis/presale)** - 고정 가격 토큰 판매
