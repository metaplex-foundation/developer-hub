---
title: 본딩 커브 — 프로토콜 파라미터
metaTitle: Genesis 본딩 커브 프로토콜 파라미터 | Metaplex
description: Genesis 본딩 커브의 구체적인 프로토콜 파라미터 — 토큰 공급량 기본값, 가상 리저브, 수수료 일정, 졸업 목표.
created: '08-03-2026'
updated: '08-05-2026'
keywords:
  - bonding curve
  - protocol parameters
  - virtual reserves
  - fee schedule
  - graduation
  - genesis
  - Metaplex
  - token supply
  - program ID
about:
  - Bonding Curve
  - Genesis
  - Protocol Parameters
proficiencyLevel: Intermediate
faqs:
  - q: Genesis 본딩 커브 토큰의 시작 가격은 얼마인가요?
    a: 시작 가격(SOL당 토큰 수) = (virtualTokens / 10^decimals) / (virtualSol / 10^9)입니다. virtualTokens는 원시 단위, virtualSol은 램포트 단위이므로 SOL당 토큰 수로 가격을 표시하기 전에 두 값을 모두 변환해야 합니다. 프로토콜 기본값을 사용하면 커브가 언제 열리든 고정된 시작 가격이 적용됩니다.
  - q: 커브가 졸업할 때까지 얼마의 SOL이 모이나요?
    a: 졸업 시점에 축적된 실제 램포트는 (k / virtualTokens) − virtualSol이며, 여기서 k = virtualSol × (virtualTokens + baseTokenAllocation)입니다. SOL로 표시하려면 10^9로 나눕니다. 실제로 이는 프로토콜 파라미터 표에 나열된 졸업 목표 SOL과 같습니다.
  - q: 크리에이터가 가상 리저브나 토큰 공급량을 변경할 수 있나요?
    a: 아니요. 가상 리저브, 토큰 공급량, 소수점 자릿수는 프로토콜 기본값으로 설정되며 API를 통해 런칭별로 재정의할 수 없습니다.
  - q: 크리에이터 수수료는 0.50% 프로토콜 수수료에 포함되나요?
    a: 아니요. 크리에이터 수수료는 별도이며 추가로 부과됩니다. 두 수수료 모두 각 스왑의 총 SOL 금액에 대해 독립적으로 계산되며 복리로 계산되지 않습니다. 스왑당 최대 총 수수료는 프로토콜 수수료 + 크리에이터 수수료입니다.
  - q: 졸업 후에도 본딩 커브 수수료가 적용되나요?
    a: 아니요. 졸업 후 거래는 Raydium CPMM 풀로 이동합니다. 대신 졸업 후 거래 수수료 일정이 적용됩니다 — 프로토콜 수수료 0.40%, 크리에이터 수익 0.60%, LP 수수료 0.21%, Raydium 수수료 0.04%.
---

Genesis 본딩 커브의 구체적인 프로토콜 파라미터 — Metaplex API를 통해 생성되는 모든 런칭을 정의하는 고정 수치입니다. {% .lead %}

## Summary

모든 Genesis 본딩 커브 런칭은 동일한 프로토콜 수준 파라미터를 공유합니다. 이 값들은 Metaplex API에 의해 설정되며 런칭별로 재정의할 수 없습니다.

- **고정된 공급량 및 소수점 자릿수** — 모든 커브는 소수점 6자리의 1,000,000,000개 토큰으로 시작합니다
- **불변의 가상 리저브** — `virtualSol`과 `virtualTokens`는 커브 생성 시 설정되며 첫 거래부터 졸업까지의 전체 가격 궤적을 정의합니다
- **2단계 수수료 구조** — 모든 스왑에 0.50% 프로토콜 수수료와 선택적 크리에이터 수수료가 부과되며, 졸업 후에는 Raydium CPMM 풀에 별도의 수수료 일정이 적용됩니다
- **자동 졸업** — `baseTokenBalance`가 0에 도달하면 실행되며, 수동 트리거가 필요 없습니다

이 파라미터를 사용하는 AMM 가격 책정 모델은 [동작 원리](/smart-contracts/genesis/bonding-curve-theory)를 참조하세요. 원시 스왑 공식은 [고급 내부 사양](/smart-contracts/genesis/bonding-curve-internals)을 참조하세요.

## 프로토콜 파라미터

모든 Genesis 본딩 커브 런칭은 다음의 고정된 프로토콜 값으로 생성됩니다.

| 파라미터 | 값 | 참고 |
|-----------|-------|-------|
| **프로그램 ID** | `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` | Solana 메인넷 |
| **토큰 공급량** | 1,000,000,000 | 소수점 적용 전 원시 단위 |
| **소수점 자릿수** | 6 | SPL 토큰 소수점 자릿수 |
| **토큰 공급량 (소수점 포함)** | 1,000,000,000,000,000 | `supply × 10^decimals` |
| **`virtualSol`** | [TBD] lamports | 가상 SOL 리저브 — 시작 가격 설정 |
| **`virtualTokens`** | [TBD] 원시 단위 | 가상 토큰 리저브 — `virtualSol`과 페어링 |
| **졸업 목표** | [TBD] SOL | 완전 매진 시 축적되는 실제 SOL |
| **`baseTokenAllocation`** | 1,000,000,000,000,000 | 모든 토큰이 커브에 할당됨 |

{% callout type="note" %}
`virtualSol`과 `virtualTokens`는 커브 생성 후 불변입니다. 프로그램이 발행하는 모든 이벤트에 두 값이 포함되므로 오프체인 가격 계산 시 별도의 계정 조회가 필요하지 않습니다. [인덱싱 및 이벤트](/smart-contracts/genesis/bonding-curve-indexing)를 참조하세요.
{% /callout %}

## 수수료 일정

토큰의 수명 동안 두 가지 별도의 수수료 일정이 적용됩니다. 본딩 커브가 활성 상태일 때의 일정과 Raydium으로 졸업한 후의 일정입니다.

### 본딩 커브 (활성 단계)

수수료는 모든 스왑의 **SOL 측**에 적용됩니다. 두 수수료 모두 총 SOL 금액에 대해 독립적으로 계산되며 복리로 계산되지 않습니다. 순 SOL 입출금액 = 총액 − 프로토콜 수수료 − 크리에이터 수수료.

| 수수료 | 요율 | 수령자 |
|-----|------|-----------|
| **프로토콜 수수료** | 0.50% | Metaplex 수수료 지갑 — 모든 스왑마다 전송됨 |
| **크리에이터 수수료** | 0.60% (최대) | 설정된 `creatorFeeWallet` — 버킷에 누적되며 `claimBondingCurveCreatorFeeV2`로 청구 |

{% callout type="note" %}
크리에이터 수수료는 선택 사항입니다. `creatorFeeWallet`이 설정되지 않으면 크리에이터 수수료가 부과되지 않습니다. 설정된 경우 0.60%가 프로토콜에서 정의한 최대치입니다. 첫 구매 메커니즘이 사용되는 경우 첫 구매는 두 수수료 모두 면제됩니다. [크리에이터 수수료](/smart-contracts/genesis/creator-fees)를 참조하세요.
{% /callout %}

### 졸업 후 (Raydium CPMM 풀) {% #post-graduation-raydium-cpmm-pool %}

커브가 졸업하면 거래는 Raydium CPMM 풀로 이동합니다. 다른 수수료 일정이 적용됩니다:

| 수수료 | 요율 | 수령자 |
|-----|------|-----------|
| **프로토콜 수수료** | 0.40% | Metaplex |
| **크리에이터 수익** | 0.60% | 크리에이터 수수료 지갑 — `claimRaydiumCreatorFeeV2`로 청구 |
| **LP 수수료** | 0.21% | 유동성 공급자 |
| **Raydium 수수료** | 0.04% | Raydium 프로토콜 |

## 가격 및 졸업 계산

프로토콜 기본값을 사용하면 다음 값들은 커브 생성 시점에 완전히 결정됩니다.

### 시작 가격

시작 가격은 가상 리저브의 비율을 온체인 단위(원시 토큰 단위와 램포트)에서 사람이 읽는 단위(토큰과 SOL)로 변환한 값입니다.

```
startingPrice (tokens per SOL) = (virtualTokens / 10^decimals) / (virtualSol / 10^9)
```

`virtualTokens`는 원시 단위로, `virtualSol`은 램포트로 저장되므로 SOL당 토큰 수로 가격을 표시하기 전에 각각 `10^decimals`(프로토콜 기본값 기준 10^6)와 `10^9`로 나눕니다. 이는 (실제 SOL이 풀에 들어오기 전) 최초 스왑에서 구매자가 보게 되는 가격입니다.

### 졸업 시 시가총액

졸업 시점에는 `baseTokenBalance = 0`이며 모든 실제 토큰이 판매된 상태입니다. 축적된 실제 SOL은 졸업 목표와 같습니다. 졸업 시 완전 희석 시가총액(FDV):

```
graduationLamports = (k / virtualTokens) − virtualSol
  where k = virtualSol × (virtualTokens + baseTokenAllocation)
graduationSOL = graduationLamports / 10^9

priceAtGraduation (lamports per raw unit) = k / virtualTokens^2
fdvAtGraduation (SOL) = totalSupply (raw units) × priceAtGraduation / 10^9
```

### 상수 곱 불변량

불변량 `k`는 커브 생성 시 고정되며 커브가 활성 상태인 동안 변하지 않습니다.

```
k = virtualSol × (virtualTokens + baseTokenAllocation)
```

`k`는 커브의 수명 동안 일정하게 유지됩니다(모든 스왑마다 올림 처리됨).

## Notes

- 가상 리저브는 모든 `BondingCurveSwapEvent`에 포함됩니다. 오프체인 가격 계산 시 버킷 계정을 조회하기 위한 별도의 RPC 호출이 필요하지 않습니다
- 프로토콜 수수료율과 가상 리저브 값은 Metaplex가 설정하며 `createAndRegisterLaunch` API를 통해 런칭별로 재정의할 수 없습니다
- 졸업은 `baseTokenBalance`를 소진시키는 스왑에서 자동으로 실행됩니다. 마지막 토큰을 소진하는 동일한 트랜잭션이 Raydium으로의 마이그레이션도 트리거합니다
- 크리에이터 수수료는 `creatorFeeAccrued`에 누적되며(스왑마다 전송되지 않음), `creatorFeeClaimed`는 누적 청구액을 추적합니다. 두 값 모두 각 `claimBondingCurveCreatorFeeV2` 호출 시 누적 기준으로 재조정됩니다

## Quick Reference

| 항목 | 값 |
|------|-------|
| 프로그램 ID | `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` |
| 기본 공급량 | `1,000,000,000` (10억 토큰, 소수점 6자리) |
| `baseTokenAllocation` | `1,000,000,000,000,000` |
| 프로토콜 스왑 수수료 | `0.50%` |
| 크리에이터 수수료 (최대) | `0.60%` |
| 졸업 후 프로토콜 수수료 | `0.40%` |
| 졸업 후 LP 수수료 | `0.21%` |
| 졸업 후 Raydium 수수료 | `0.04%` |
| `virtualSol` | `[TBD]` |
| `virtualTokens` | `[TBD]` |
| 졸업 목표 | `[TBD] SOL` |
| JS SDK | `@metaplex-foundation/genesis` |
| 소스 | [GitHub](https://github.com/metaplex-foundation/mpl-genesis) |

## FAQ

### Genesis 본딩 커브 토큰의 시작 가격은 얼마인가요?

SOL당 토큰 수로 나타낸 시작 가격 = `(virtualTokens / 10^decimals) / (virtualSol / 10^9)`입니다. `virtualTokens`는 원시 단위, `virtualSol`은 램포트 단위이므로 가격을 표시하기 전에 두 값을 모두 변환합니다. 이 값은 전적으로 프로토콜 기본값에 의해 결정되며, 크리에이터가 사용자 지정 시작 가격을 설정할 수 없습니다.

### 커브가 졸업할 때까지 얼마의 SOL이 모이나요?

완전 매진 시점에 축적된 실제 SOL은 위의 프로토콜 파라미터 표에 나열된 졸업 목표와 같습니다. 이는 상수 곱 공식에서 직접 도출됩니다: `graduationLamports = (k / virtualTokens) − virtualSol` (SOL로 표시하려면 `10^9`로 나눕니다).

### 크리에이터가 가상 리저브나 토큰 공급량을 변경할 수 있나요?

아니요. `virtualSol`, `virtualTokens`, 토큰 공급량, 소수점 자릿수는 Metaplex API가 설정하는 프로토콜 기본값입니다. 런칭별로 이를 재정의할 수 있는 API 파라미터는 없습니다.

### 크리에이터 수수료는 0.50% 프로토콜 수수료에 포함되나요?

아니요. 프로토콜 수수료(0.50%)와 크리에이터 수수료(최대 0.60%)는 독립적입니다. 두 수수료 모두 스왑의 총 SOL 금액에 대해 계산되어 별도로 차감되며, 복리로 계산되지 않습니다.

### 졸업 후에도 본딩 커브 수수료가 적용되나요?

아니요. 졸업 후에는 본딩 커브 계정이 닫히고 거래가 Raydium CPMM 풀로 이동합니다. 졸업 후 거래 수수료 일정이 적용됩니다 — 위의 [졸업 후 수수료 일정](#post-graduation-raydium-cpmm-pool) 표를 참조하세요.
