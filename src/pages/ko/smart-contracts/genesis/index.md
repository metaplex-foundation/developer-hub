---
title: Genesis - 솔라나 토큰 런치패드 & 출시 플랫폼
metaTitle: Genesis | 솔라나 토큰 런치패드 | Presale & 공정한 출시 토큰 런치패드 플랫폼 | Metaplex
description: Genesis는 프리세일, 공정한 출시 및 토큰 생성 이벤트(TGE)를 위한 솔라나 토큰 런치패드입니다. 온체인 SPL 토큰 생성, 크라우드세일, 토큰 배포 플랫폼.
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - token launch
  - token launchpad
  - TGE
  - token generation event
  - fair launch
  - token offering
  - token sale
  - crowdsale
  - launch pool
  - presale
  - token sale platform
  - Solana token
  - SPL token
  - token distribution
  - token offering
about:
  - Token launches
  - Genesis protocol
  - Fair distribution
proficiencyLevel: Beginner
faqs:
  - q: Genesis란 무엇인가요?
    a: Genesis는 솔라나에서 토큰 생성 이벤트(TGE)를 위한 Metaplex 스마트 컨트랙트입니다. Presale, Launch Pool, 경매를 위한 온체인 인프라를 제공합니다.
  - q: Genesis는 어떤 출시 메커니즘을 지원하나요?
    a: Genesis는 세 가지 메커니즘을 지원합니다 - Presale(고정 가격), Launch Pool(가격 발견을 통한 비례 배분), Uniform Price Auction(클리어링 가격을 사용한 입찰 기반).
  - q: Genesis를 사용하는 데 비용이 얼마나 드나요?
    a: Genesis는 예치금에 대해 {% fee product="genesis" config="launchPool" fee="deposit" /%} 프로토콜 수수료를 부과합니다. 초기 비용은 없습니다 - 솔라나 트랜잭션 수수료와 모금된 자금에 대한 프로토콜 수수료만 지불하면 됩니다.
  - q: 출시 후 토큰 권한을 취소할 수 있나요?
    a: 네. Genesis는 민트 및 동결 권한을 취소하는 명령어를 제공하여, 추가 토큰을 발행할 수 없음을 보유자에게 알릴 수 있습니다.
  - q: Launch Pool과 Presale의 차이점은 무엇인가요?
    a: Presale은 사전에 설정된 고정 가격을 가집니다. Launch Pool은 총 예치금을 기반으로 유기적으로 가격을 발견합니다 - 더 많은 예치금은 토큰당 더 높은 내재 가격을 의미합니다.
---

**Genesis**는 **토큰 생성 이벤트(TGE)**를 위한 솔라나 토큰 런치패드이자 스마트 컨트랙트입니다. SPL 토큰 생성, 토큰 배포, 자금 수집을 위한 온체인 조정으로 프리세일, 공정한 출시, 크라우드세일을 실행하세요. {% .lead %}

{% callout title="경로를 선택하세요" %}
- **노코드로 출시하고 싶으신가요?** [Metaplex 토큰 런치패드](https://www.metaplex.com)를 사용하여 코딩 없이 토큰을 출시하세요
- **나만의 런치패드를 구축하고 싶으신가요?** Genesis SDK를 사용하여 맞춤형 토큰 출시 플랫폼을 구축하거나 자체 웹사이트에서 토큰 세일을 호스팅하세요
- **Genesis가 처음이신가요?** [시작하기](/ko/smart-contracts/genesis/getting-started)에서 흐름을 이해하세요
- **구축할 준비가 되셨나요?** [Launch Pool](/ko/smart-contracts/genesis/launch-pool) 또는 [Presale](/ko/smart-contracts/genesis/presale)로 바로 이동하세요
{% /callout %}

## Genesis란 무엇인가요?

Genesis는 솔라나에서 SPL 토큰을 출시하기 위한 온체인 인프라를 제공하는 탈중앙화 토큰 출시 플랫폼입니다. 토큰 프리세일, 공정한 출시 등 어떤 방식이 필요하든, Genesis가 다음을 처리합니다:

- **토큰 생성** 메타데이터 포함 (이름, 심볼, 이미지)
- **자금 수집** 참가자로부터 (SOL 예치)
- **배포** 선택한 메커니즘에 따라
- **시간 조정** 예치 및 청구 기간

Genesis를 출시자(여러분)와 참가자 사이에 위치하여 공정하고 투명하며 자동화된 토큰 배포를 보장하는 토큰 런치패드 스마트 컨트랙트로 생각하세요 — 기존 중앙화 토큰 판매 플랫폼의 현대적인 온체인 대안입니다.

## 출시 메커니즘

Genesis는 조합할 수 있는 세 가지 메커니즘을 지원합니다:

| 메커니즘 | 가격 | 배포 | 최적 용도 |
|-----------|-------|--------------|----------|
| **[Launch Pool](/ko/smart-contracts/genesis/launch-pool)** | 마감 시 발견 | 예치금에 비례 | 공정한 출시, 커뮤니티 토큰, 크라우드세일 |
| **[Presale](/ko/smart-contracts/genesis/presale)** | 사전 고정 | 선착순 | 토큰 세일, 알려진 밸류에이션 |
| **[Uniform Price Auction](/ko/smart-contracts/genesis/uniform-price-auction)** | 클리어링 가격 | 최고 입찰자 우선 | 대규모 모금, 기관 참가자 관심 |

### 어떤 것을 사용해야 하나요?

**Launch Pool** - 유기적인 가격 발견과 공정한 토큰 배포를 원할 때. 크라우드세일과 유사하게, 예치한 모든 사람이 자신의 지분에 비례하여 토큰을 받습니다. 누구도 선점당하지 않습니다.

**Presale** - 밸류에이션을 알고 있고 예측 가능한 가격 책정을 원할 때. 가격을 설정하고 참가자들이 한도에 도달할 때까지 구매하도록 합니다. Genesis에서 "Presale"이란 초기 거래 직전에 토큰이 판매되는 것을 의미합니다. 구매자는 토큰을 직접 받으며, 미래에 토큰을 받을 권리가 아닙니다.

**Auction** - 대규모 참가자들의 경쟁 입찰을 원할 때. 기관 참가자의 관심이 있는 기존 프로젝트에 가장 적합한 구조화된 경매 접근 방식입니다.

## 핵심 개념

### Genesis Account

출시를 위한 중앙 조정자입니다. Genesis Account를 초기화하면:

- 메타데이터가 포함된 SPL token을 생성합니다
- 총 공급량을 에스크로에 민트합니다
- 배포 Bucket을 추가하기 위한 기반을 제공합니다

### Buckets

토큰과 자금이 어떻게 흐르는지 정의하는 모듈식 구성 요소입니다:

| 타입 | 목적 | 예시 |
|------|---------|----------|
| **Inflow** | 사용자로부터 SOL 수집 | Launch Pool, Presale |
| **Outflow** | 팀/트레저리를 위한 자금 수령 | Unlocked Bucket |

### 시간 조건

모든 Bucket에는 작업이 허용되는 시기를 제어하는 시간 창이 있습니다:

- **예치 기간** - 사용자가 SOL을 예치할 수 있는 시기
- **청구 기간** - 사용자가 토큰을 청구할 수 있는 시기

## 프로토콜 수수료

| 작업 | 수수료 |
|--------|-----|
| 예치 | 예치 금액의 {% fee product="genesis" config="launchPool" fee="deposit" /%} |
| 출금 | 출금 금액의 {% fee product="genesis" config="launchPool" fee="withdraw" /%} |
| 청구 | 트랜잭션 수수료만 |

초기 비용이 없습니다. 모금된 자금에 대한 수수료만 지불합니다.

## 프로그램 정보

| 네트워크 | Program ID |
|---------|------------|
| Mainnet | `GENSkbxvLc7iBQvEAJv3Y5wVMHGD3RjfCNwWgU8Tqgkc` |
| Devnet | `GENSkbxvLc7iBQvEAJv3Y5wVMHGD3RjfCNwWgU8Tqgkc` |

## 보안

출시가 완료된 후, 추가 토큰을 발행할 수 없음을 알리기 위해 토큰 권한을 취소하세요:

- **민트 권한** - 새 토큰 민팅 방지를 위해 취소
- **동결 권한** - 토큰 동결 방지를 위해 취소

권한 관리에 대한 자세한 내용은 [시작하기](/ko/smart-contracts/genesis/getting-started)를 참조하세요.

## FAQ

### Genesis란 무엇인가요?
Genesis는 솔라나에서 토큰 생성 이벤트(TGE)를 위한 Metaplex 스마트 컨트랙트입니다. 조정된 토큰 생성 및 배포와 함께 Presale, Launch Pool, 경매를 위한 온체인 인프라를 제공합니다.

### Genesis는 어떤 출시 메커니즘을 지원하나요?
Genesis는 세 가지 메커니즘을 지원합니다: **Launch Pool**(가격 발견을 통한 비례 배분), **Presale**(고정 가격), **Uniform Price Auction**(클리어링 가격을 사용한 입찰 기반).

### Genesis를 사용하는 데 비용이 얼마나 드나요?
Genesis는 예치금에 대해 {% fee product="genesis" config="launchPool" fee="deposit" /%} 프로토콜 수수료를 부과합니다. 초기 비용은 없습니다—솔라나 트랜잭션 수수료와 모금된 자금에 대한 프로토콜 수수료만 지불하면 됩니다.

### 출시 후 토큰 권한을 취소할 수 있나요?
네. Genesis는 권한을 영구적으로 취소하기 위한 `revokeMintAuthorityV2` 및 `revokeFreezeAuthorityV2` 명령어를 제공합니다.

### Launch Pool과 Presale의 차이점은 무엇인가요?
**Presale**은 사전에 설정된 고정 가격을 가집니다. **Launch Pool**은 유기적으로 가격을 발견합니다—더 많은 예치금은 토큰당 더 높은 내재 가격을 의미하며, 모든 참가자에게 비례 배분됩니다.

### 여러 출시 메커니즘을 조합할 수 있나요?
네. Genesis는 여러 Inflow Bucket을 추가하고 트레저리 또는 베스팅을 위한 Outflow Bucket을 구성할 수 있는 Bucket 시스템을 사용합니다.

## 용어집

| 용어 | 정의 |
|------|------------|
| **Genesis Account** | 토큰을 생성하고 모든 Bucket을 관리하는 중앙 조정자 |
| **Bucket** | 토큰/SOL 흐름을 정의하는 모듈식 구성 요소 |
| **Inflow Bucket** | 사용자로부터 SOL을 수집하는 Bucket |
| **Outflow Bucket** | 종료 동작을 통해 자금을 받는 Bucket |
| **Launch Pool** | 마감 시 가격이 발견되는 예치 기반 배포 |
| **Presale** | 미리 정해진 가격으로 진행되는 고정 가격 판매 |
| **Quote Token** | 사용자가 예치하는 토큰 (보통 wSOL) |
| **Base Token** | 출시되고 배포되는 토큰 |

## 다음 단계

1. **[시작하기](/ko/smart-contracts/genesis/getting-started)** - Genesis 흐름 이해하기
2. **[JavaScript SDK](/ko/smart-contracts/genesis/sdk/javascript)** - 설치 및 설정
3. **[Launch Pool](/ko/smart-contracts/genesis/launch-pool)** - 비례 배분 출시 구축하기
4. **[Presale](/ko/smart-contracts/genesis/presale)** - 고정 가격 판매 구축하기
