---
title: Uniform Price Auction
metaTitle: Genesis Auction | 솔라나 IDO & 토큰 경매 | Metaplex
description: 균일 청산 가격을 가진 솔라나 IDO 스타일 토큰 경매. SPL 토큰 출시를 위한 경쟁 입찰 — 기관 및 대규모 온체인 자금 조달을 위한 토큰 오퍼링.
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - uniform price auction
  - token auction
  - IDO
  - initial DEX offering
  - clearing price
  - price discovery
  - sealed bid
  - competitive bidding
  - token offering
  - SPL token auction
  - crypto fundraising
about:
  - Auction mechanics
  - Price discovery
  - Competitive bidding
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Uniform Price Auction이란 무엇인가요?
    a: 모든 낙찰자가 개별 입찰 금액에 관계없이 동일한 청산 가격을 지불하는 경매입니다. 청산 가격은 가장 낮은 낙찰가입니다.
  - q: 청산 가격은 어떻게 결정되나요?
    a: 입찰은 가격순으로 순위가 매겨집니다. 청산 가격은 총 입찰 수량이 사용 가능한 토큰과 같아지는 지점에서 설정되며, 모든 낙찰자가 이 균일 가격을 지불합니다.
  - q: 입찰을 비공개로 할 수 있나요?
    a: 네. Uniform Price Auction은 구성에 따라 공개 및 비공개(봉인) 입찰을 모두 지원합니다.
  - q: Uniform Price Auction을 언제 사용해야 하나요?
    a: 예치 기반 출시보다 구조화된 경매 형식을 선호하는 대규모 참가자(고래, 펀드)와의 가격 발견에 사용하세요.
---

**Uniform Price Auction**은 솔라나에서 IDO 스타일의 경쟁 입찰을 통한 토큰 출시를 가능하게 합니다. 모든 낙찰자가 동일한 청산 가격 — 가장 낮은 낙찰가 — 을 지불하여, 구조화된 토큰 오퍼링과 온체인 자금 조달을 위한 공정한 가격 발견을 보장합니다. {% .lead %}

{% callout title="학습 내용" %}
이 개요에서 다루는 내용:
- Uniform Price Auction의 작동 방식
- 경매와 다른 출시 메커니즘의 비교
- 핵심 개념: 입찰, 청산 가격, 할당
{% /callout %}

## 요약

Uniform Price Auction은 경매 기간 동안 입찰을 수집한 후 단일 청산 가격으로 토큰을 할당합니다.

- 사용자가 선택한 가격으로 토큰 수량에 입찰
- 가격순으로 입찰 순위 매김; 최고 입찰자에게 토큰 할당
- 모든 낙찰자가 동일한 청산 가격(가장 낮은 낙찰가) 지불
- 공개 또는 봉인(비공개) 입찰 지원

## 범위 외

고정가 판매([Presale](/ko/smart-contracts/genesis/presale) 참조), 비례 배분([Launch Pool](/ko/smart-contracts/genesis/launch-pool) 참조), 경매 후 유동성 설정.

## 사용 사례

| 사용 사례 | 설명 |
|----------|------|
| **가격 발견** | 경쟁 입찰을 통해 시장이 공정한 토큰 가격을 결정 |
| **대규모 투자자/펀드 참여** | 구조화된 경매 형식이 대규모 기관 참여자에게 어필 |
| **통제된 접근** | 요구 사항에 따라 게이트 또는 비게이트 가능 |

## 작동 방식

1. **경매 시작** - 사용자가 수량과 가격을 명시한 입찰 제출
2. **입찰 기간** - 입찰 누적 (공개 또는 봉인)
3. **경매 종료** - 입찰이 가격 높은 순으로 순위 매김
4. **청산 가격 설정** - 총 입찰 수량이 사용 가능한 토큰과 같아지는 가격
5. **할당** - 낙찰자가 토큰 수령, 모두 청산 가격 지불

### 청산 가격 예시

```
사용 가능한 토큰: 1,000,000
받은 입찰:
  - 입찰자 A: 500,000 토큰 @ 0.001 SOL
  - 입찰자 B: 300,000 토큰 @ 0.0008 SOL
  - 입찰자 C: 400,000 토큰 @ 0.0006 SOL

순위 (최고가 우선):
  1. 입찰자 A: 500,000 @ 0.001 SOL    (누적: 500,000)
  2. 입찰자 B: 300,000 @ 0.0008 SOL   (누적: 800,000)
  3. 입찰자 C: 400,000 @ 0.0006 SOL   (누적: 1,200,000)

청산 가격: 0.0006 SOL (입찰자 C의 가격이 경매를 채움)
입찰자 C는 부분 충족: 200,000 토큰
모든 낙찰자가 토큰당 0.0006 SOL 지불
```

## 비교

| 특성 | Launch Pool | Presale | Uniform Price Auction |
|------|-------------|---------|----------------------|
| 가격 | 마감 시 발견 | 사전 고정 | 청산 가격 |
| 배분 | 비례 | 선착순 | 최고 입찰자 |
| 사용자 행동 | 예치 | 예치 | 입찰 (가격 + 수량) |
| 최적 용도 | 공정한 배분 | 예측 가능한 결과 | 대규모 참여자 |

## 참고 사항

- Uniform Price Auction은 기관 투자자 관심이 있는 대규모 토큰 출시에 적합합니다
- 청산 가격 메커니즘은 모든 낙찰자가 동일한 조건을 받도록 보장합니다
- 봉인 입찰은 다른 입찰자의 입찰을 기반으로 한 조작을 방지합니다

{% callout type="note" %}
Uniform Price Auction의 상세한 설정 문서가 곧 제공될 예정입니다. 대안적인 출시 메커니즘은 [Launch Pool](/ko/smart-contracts/genesis/launch-pool) 또는 [Presale](/ko/smart-contracts/genesis/presale)을 참조하세요.
{% /callout %}

## FAQ

### Uniform Price Auction이란 무엇인가요?
모든 낙찰자가 개별 입찰 금액에 관계없이 동일한 청산 가격을 지불하는 경매입니다. 청산 가격은 가장 낮은 낙찰가입니다.

### 청산 가격은 어떻게 결정되나요?
입찰은 최고가부터 최저가 순으로 순위가 매겨집니다. 청산 가격은 총 입찰 수량이 사용 가능한 토큰과 같아지는 지점에서 설정되며, 모든 낙찰자가 이 균일 가격을 지불합니다.

### 입찰을 비공개로 할 수 있나요?
네. Uniform Price Auction은 구성에 따라 공개 및 비공개(봉인) 입찰을 모두 지원합니다.

### Uniform Price Auction을 언제 사용해야 하나요?
예치 기반 출시보다 구조화된 경매 형식을 선호하는 대규모 참가자(고래, 펀드)와의 가격 발견에 사용하세요.

## 용어집

| 용어 | 정의 |
|------|------|
| **Uniform Price Auction** | 모든 낙찰자가 동일한 청산 가격을 지불하는 경매 |
| **청산 가격** | 가장 낮은 낙찰가; 모든 낙찰자가 지불 |
| **입찰** | 토큰 수량과 토큰당 가격을 명시한 사용자의 제안 |
| **봉인 입찰** | 다른 참가자에게 보이지 않는 비공개 입찰 |
| **부분 충족** | 제한된 공급으로 입찰이 부분적으로만 충족되는 경우 |
| **가격 발견** | 입찰을 통해 시장 가치를 결정하는 과정 |

## 다음 단계

- [Launch Pool](/ko/smart-contracts/genesis/launch-pool) - 비례 토큰 배분을 통한 공정한 출시
- [Presale](/ko/smart-contracts/genesis/presale) - ICO 스타일 고정가 토큰 판매
- [토큰 출시하기](/ko/tokens/launch-token) - 엔드투엔드 토큰 출시 가이드
- [Genesis 개요](/ko/smart-contracts/genesis) - 토큰 런치패드 개념 및 아키텍처
