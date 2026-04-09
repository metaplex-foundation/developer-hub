---
title: 본딩 커브 — 고급 내부 구조
metaTitle: Genesis 본딩 커브 고급 내부 구조 | Metaplex
description: Genesis 본딩 커브의 심층 참조 — 스왑 가격 공식, 역방향 계산, 리저브 소진 클램핑, BondingCurveBucketV2 계정 구조, 확장.
updated: '04-09-2026'
keywords:
  - bonding curve
  - constant product AMM
  - swap formula
  - virtual reserves
  - reserve exhaustion
  - BondingCurveBucketV2
  - genesis
  - Metaplex
about:
  - Bonding Curve
  - Constant Product AMM
  - Genesis
proficiencyLevel: Advanced
---

Genesis 본딩 커브 스왑 가격 공식, 리저브 소진 처리, `BondingCurveBucketV2` 온체인 계정 구조에 대한 참조입니다. {% .lead %}

## 요약

이 페이지는 Genesis 본딩 커브 위에 스왑 엔진, 가격 책정 도구, 또는 프로토콜 툴링을 구축하는 통합자를 위한 구현 수준의 세부 정보를 다룹니다. SDK를 사용하여 스왑 트랜잭션을 실행하는 방법은 [본딩 커브 스왑 통합](/smart-contracts/genesis/bonding-curve-swaps)을 참조하세요. 프로그램에서 발생하는 이벤트 인덱싱에 대해서는 [인덱싱 및 이벤트](/smart-contracts/genesis/bonding-curve-indexing)를 참조하세요.

- **스왑 공식** — 정확한 `ceil(k / x)` 매수 및 매도 계산
- **역방향 계산** — 원하는 출력에 대한 필요 입력 계산
- **리저브 소진** — 공급이 거의 0에 가까울 때 시스템이 클램핑하고 재계산하는 방법
- **`BondingCurveBucketV2`** — 온체인 계정의 전체 필드 참조

개념적 모델, 수수료 구조, 라이프사이클 개요는 [운영 이론](/smart-contracts/genesis/bonding-curve-theory)을 참조하세요.

## 스왑 가격 공식

모든 스왑 계산은 결합된 리저브를 사용합니다:

```
totalSol    = virtualSol + realSol
totalTokens = virtualTokens + realTokens
k           = totalSol × totalTokens
```

### 매수 (SOL 입력, 토큰 출력)

```
inputReserve     = totalSol
outputReserve    = totalTokens

newInputReserve  = inputReserve + amountIn
newOutputReserve = ceil(k / newInputReserve)
tokensOut        = outputReserve - newOutputReserve
```

### 매도 (토큰 입력, SOL 출력)

```
inputReserve     = totalTokens
outputReserve    = totalSol

newInputReserve  = inputReserve + amountIn
newOutputReserve = ceil(k / newInputReserve)
solOut           = outputReserve - newOutputReserve
```

### 올림 나눗셈

올림 나눗셈(`ceil(k / x)`)은 모든 스왑 계산에 사용됩니다. 이를 통해 상수 곱 불변량이 절대 위반되지 않습니다:

```
newInputReserve × (outputReserve − outputAmount) ≥ k
```

풀은 거래를 통해서만 가치를 얻을 수 있으며 잃지 않습니다. 반올림 오류는 풀에 유리하게 누적됩니다.

## 역방향 계산: 원하는 출력에 대한 필요 입력

소진 시 리저브를 클램핑할 때 내부적으로 사용됩니다 — 특정 출력을 생성하는 데 필요한 정확한 입력을 계산합니다:

```
newOutputReserve = outputReserve - desiredAmountOut
newInputReserve  = ceil(k / newOutputReserve)
requiredAmountIn = newInputReserve - inputReserve
```

이는 사용자가 원하는 토큰 금액을 지정하고 UI가 정확한 SOL 비용을 표시해야 하는 UX 흐름에도 유용합니다.

## 리저브 소진 및 클램핑

스왑이 커브가 가진 것보다 더 많은 출력을 생성할 경우, 시스템은 출력을 클램핑하고 입력을 재계산합니다 — 트랜잭션은 실패하지 않습니다.

### 매수 클램핑 (토큰 공급 소진)

`tokensOut > baseTokenBalance`인 경우:

1. 출력이 `baseTokenBalance`로 제한됩니다
2. 역방향 공식을 사용하여 필요한 SOL 입력이 재계산됩니다
3. 구매자는 실제로 사용 가능한 토큰에 대해서만 지불합니다
4. 이 최종 구매로 졸업이 트리거됩니다

### 매도 클램핑 (SOL 공급 소진)

버킷이 총 출력과 수수료 모두를 충당할 SOL이 충분하지 않은 경우:

1. 시스템이 사용 가능한 SOL 잔액에서 역방향으로 계산합니다
2. 사용 가능한 금액에서 수수료가 재계산됩니다
3. 판매자는 수수료 후 남은 금액을 받습니다
4. 역방향 공식을 통해 일치하도록 필요한 토큰 입력이 재계산됩니다

## BondingCurveBucketV2 계정 구조

`BondingCurveBucketV2` 계정은 모든 본딩 커브 상태를 저장합니다. 전체 TypeScript 유형 정의는 [Genesis JavaScript SDK](/smart-contracts/genesis/sdk/javascript)를 참조하세요.

### 핵심 리저브 필드

| 필드 | 유형 | 설명 |
|------|------|------|
| `baseTokenBalance` | `bigint` | 커브에 남아 있는 토큰. 0이면 소진됨. |
| `baseTokenAllocation` | `bigint` | 생성 시 할당된 총 토큰. |
| `quoteTokenDepositTotal` | `bigint` | 구매자가 예치한 실제 SOL (lamports). 0에서 시작. |
| `virtualSol` | `bigint` | 가상 SOL 리저브 (가격 책정 전용, 예치되지 않음). |
| `virtualTokens` | `bigint` | 가상 토큰 리저브 (가격 책정 전용, 예치되지 않음). |

### 수수료 구성 필드

| 필드 | 유형 | 설명 |
|------|------|------|
| `depositFee` | `number` | 매수의 SOL 입력 측에 대한 프로토콜 수수료율. |
| `withdrawFee` | `number` | 매도의 SOL 출력 측에 대한 프로토콜 수수료율. |
| `creatorFeeAccrued` | `bigint` | 아직 청구되지 않은 누적 창작자 수수료. |
| `creatorFeeClaimed` | `bigint` | 현재까지 청구된 누적 창작자 수수료. |

### 스왑 조건 필드

| 필드 | 유형 | 설명 |
|------|------|------|
| `swapStartCondition` | `object` | 거래가 허용되기 전에 충족되어야 하는 조건. |
| `swapEndCondition` | `object` | 트리거될 때 거래를 종료하는 조건. |

### BondingCurveBucketV2 확장

버킷에는 독립적으로 구성 가능한 선택적 기능이 포함된 확장 블록이 있습니다:

| 확장 | 설명 |
|------|------|
| **첫 번째 구매 (First Buy)** | 수수료 없는 초기 구매를 위한 구매자와 SOL 금액을 지정합니다. 첫 번째 구매 완료 후 소비됩니다. |
| **창작자 수수료 (Creator Fee)** | 목적지 지갑 주소와 수수료율이 있는 선택적 창작자 수수료입니다. 수수료는 스왑당 전송되지 않고 버킷(`creatorFeeAccrued`)에 누적됩니다. 프로토콜 수수료와 독립적으로 계산되며 복합되지 않습니다. 첫 번째 구매는 두 가지 모두 면제됩니다. 구성 및 청구는 [창작자 수수료](/smart-contracts/genesis/creator-fees)를 참조하세요. |

## 참고 사항

- `virtualSol`과 `virtualTokens`는 커브 생성 시 설정되며 불변입니다 — 가격 커브 모양을 영구적으로 정의합니다
- `ceil(k / x)` 나눗셈은 모든 스왑 계산에 사용되어 풀이 절대 가치를 잃지 않도록 합니다; 반올림은 풀에 유리하게 누적됩니다
- 졸업은 토큰이 완전히 소진되면 자동으로 발생합니다 — 별도의 명령어나 크랭크가 필요하지 않습니다
- `BondingCurveBucketV2` 판별자는 계정 유형별로 고유합니다; `BondingCurveSwapEvent` 판별자는 항상 바이트 `255`입니다

## 빠른 참조

| 공식 | 표현식 |
|------|--------|
| 결합된 SOL 리저브 | `totalSol = virtualSol + realSol` |
| 결합된 토큰 리저브 | `totalTokens = virtualTokens + realTokens` |
| 상수 곱 | `k = totalSol × totalTokens` |
| 현재 가격 (토큰/SOL) | `totalTokens / totalSol` |
| 매수 출력 | `outputReserve − ceil(k / (inputReserve + amountIn))` |
| 매도 출력 | `outputReserve − ceil(k / (inputReserve + amountIn))` |
| 원하는 출력에 대한 필요 입력 | `ceil(k / (outputReserve − desiredOut)) − inputReserve` |
