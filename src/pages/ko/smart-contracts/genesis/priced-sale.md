---
title: Priced Sale
metaTitle: Genesis - Priced Sale
description: 사용자가 SOL을 예치하고 미리 정해진 비율로 토큰을 받는 고정 가격 토큰 판매.
---

Priced Sale은 토큰이 고정된 사전 결정 가격으로 판매되는 토큰 런칭 메커니즘입니다. 최종 가격이 총 예치금에 따라 결정되는 Launch Pool과 달리, Priced Sale을 사용하면 토큰당 정확한 가격을 미리 설정할 수 있습니다.

작동 방식:

1. 특정 수량의 토큰이 Priced Sale에 할당되며, SOL 상한이 고정 가격을 결정합니다.
2. Priced Sale이 열려 있는 동안 사용자는 고정 비율로 토큰을 구매하기 위해 SOL을 예치합니다.
3. Priced Sale이 종료되면 사용자는 미리 정해진 가격으로 예치 금액에 따라 토큰을 청구합니다.

## 개요

Priced Sale 라이프사이클:

1. **예치 기간** - 사용자가 고정 가격으로 정의된 기간 동안 SOL을 예치
2. **전환** - 종료 동작 실행 (예: 수집된 SOL을 다른 버킷으로 전송)
3. **청구 기간** - 사용자가 예치금에 따라 토큰을 청구

### 가격 계산

토큰 가격은 할당된 토큰과 SOL 상한의 비율에 의해 결정됩니다:

```
price = allocationQuoteTokenCap / baseTokenAllocation
tokens = deposit / price
```

예를 들어, 100 SOL 상한으로 1,000,000 토큰을 할당하는 경우:
- 가격 = 100 SOL / 1,000,000 토큰 = 토큰당 0.0001 SOL
- 10 SOL 예치로 100,000 토큰을 받음

{% callout type="note" %}
코드 예제와 모든 구성 옵션을 포함한 전체 문서는 [영어 버전](/smart-contracts/genesis/priced-sale)을 참조하세요.
{% /callout %}

## 사용 사례

- **얼리 서포터 액세스**: 헌신적인 커뮤니티 멤버가 퍼블릭 런칭 전에 참여할 수 있도록 허용
- **펀딩 라운드**: 통제된 배포로 자금 수집
- **공정 런칭**: 먼저 모든 예치금을 수집한 다음 맞춤 기준에 따라 토큰 배포

## Priced Sale vs Launch Pool

| 기능 | Priced Sale | Launch Pool |
|------|-------------|-------------|
| 가격 | 사전 고정 | 총 예치금에 의해 결정 |
| 예치 상한 | SOL 상한 있음 | 상한 없음 |
| 초과 청약 | 불가능 | 모든 예치금 수락 |
| 가격 발견 | 없음 (사전 설정) | 유기적 |

일반적인 Genesis 개념은 [개요](/smart-contracts/genesis)를 참조하거나 대안적인 런칭 메커니즘인 [Launch Pool](/smart-contracts/genesis/launch-pool)을 살펴보세요.
