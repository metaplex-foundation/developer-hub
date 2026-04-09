---
title: 본딩 커브
metaTitle: 본딩 커브 | Metaplex CLI
description: Metaplex CLI를 사용하여 본딩 커브 토큰 런칭을 생성하고, 토큰을 매수 및 매도하고, 커브 상태를 확인하고, 본딩 커브 버킷을 검사합니다.
keywords:
  - genesis bonding curve
  - genesis swap
  - bonding curve
  - mplx genesis swap
  - token swap
  - buy tokens
  - sell tokens
  - Metaplex CLI
about:
  - Genesis bonding curve
  - token swap
  - constant product AMM
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '04-09-2026'
updated: '04-09-2026'
howToSteps:
  - Create a bonding curve launch with genesis launch create --launchType bonding-curve
  - Buy tokens with genesis swap --buyAmount or sell with --sellAmount
  - Use genesis swap --info to check curve status and get price quotes
  - Inspect the bucket with genesis bucket fetch --type bonding-curve
howToTools:
  - Metaplex CLI (mplx)
faqs:
  - q: 본딩 커브는 어떤 가격 모델을 사용하나요?
    a: 본딩 커브는 상수 곱(constant-product) 공식을 사용합니다. 더 많은 토큰을 매수할수록 가격이 오르고, 토큰을 매도하면 가격이 내려갑니다.
  - q: 매수 전에 SOL을 래핑해야 하나요?
    a: 아니요. SOL로 매수할 때, swap 명령어가 필요하면 SOL을 WSOL로 자동으로 래핑합니다.
  - q: 스왑 전에 가격을 확인하는 방법은 무엇인가요?
    a: --info 플래그를 사용하여 커브 상태를 표시하세요. --info를 --buyAmount 또는 --sellAmount와 함께 사용하면 스왑을 실행하지 않고 견적을 얻을 수 있습니다.
  - q: 커브가 완전히 채워지면 어떻게 되나요?
    a: 모든 토큰이 매도되면 본딩 커브가 Raydium CPMM 풀로 자동 졸업합니다. 졸업 후에는 Raydium에서 거래가 계속됩니다.
  - q: 수동 흐름으로 본딩 커브를 생성할 수 있나요?
    a: 아니요. 본딩 커브 런칭은 genesis launch create --launchType bonding-curve를 통해 Genesis API로만 사용할 수 있습니다.
---

{% callout title="수행할 작업" %}
CLI에서 전체 본딩 커브 라이프사이클을 실행합니다:
- Genesis API를 통해 본딩 커브 토큰 런칭 생성
- 커브에서 토큰 매수 및 매도
- 커브 상태 확인 및 가격 견적 얻기
- 본딩 커브 버킷 검사
{% /callout %}

## 요약

본딩 커브 런칭은 즉시 거래가 시작되는 상수 곱 AMM을 생성합니다 — 예치 창이 없습니다. SOL이 유입되면 가격이 오르고, 모든 토큰이 매도되면 커브가 Raydium CPMM 풀로 자동 졸업합니다. 이 페이지는 전체 본딩 커브 라이프사이클을 다룹니다.

- **생성**: [`genesis launch create --launchType bonding-curve`](/dev-tools/cli/genesis/launch#bonding-curve)를 통해 (API 전용, 수동 흐름 없음)
- **거래**: `genesis swap --buyAmount`로 매수하거나 `--sellAmount`로 매도
- **정보**: `genesis swap --info`로 가격, 리저브, 채우기 비율 확인
- **검사**: `genesis bucket fetch --type bonding-curve`로 버킷 구성 확인
- **졸업**: 완전히 채워지면 Raydium CPMM으로 자동 졸업

**바로 가기:** [본딩 커브 생성](#본딩-커브-생성) · [스왑 (매수 및 매도)](#스왑-매수-및-매도) · [커브 상태 확인](#커브-상태-확인) · [본딩 커브 버킷 검사](#본딩-커브-버킷-검사) · [전체 라이프사이클 예시](#전체-라이프사이클-예시) · [일반적인 오류](#일반적인-오류) · [FAQ](#faq)

## 본딩 커브 생성

본딩 커브 런칭은 [Genesis API](/dev-tools/cli/genesis/launch#bonding-curve)를 통해 생성됩니다. `--name`, `--symbol`, `--image`만 필수입니다:

```bash {% title="본딩 커브 런칭 생성" %}
mplx genesis launch create --launchType bonding-curve \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123"
```

선택적으로 창작자 수수료, 첫 번째 구매, 또는 [에이전트](/agents)에 연결을 구성할 수 있습니다:

```bash {% title="창작자 수수료 및 첫 번째 구매 포함" %}
mplx genesis launch create --launchType bonding-curve \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --creatorFeeWallet <FEE_WALLET_ADDRESS> \
  --firstBuyAmount 0.1
```

```bash {% title="에이전트 포함" %}
mplx genesis launch create --launchType bonding-curve \
  --name "Agent Token" \
  --symbol "AGT" \
  --image "https://gateway.irys.xyz/abc123" \
  --agentMint <AGENT_CORE_ASSET_ADDRESS> \
  --agentSetToken
```

모든 플래그 및 세부 사항은 [런칭 (API)](/dev-tools/cli/genesis/launch)를 참조하세요.

{% callout type="note" %}
본딩 커브는 Genesis API를 통해서만 사용할 수 있습니다. 수동 `bucket add-bonding-curve` 명령어는 없습니다.
{% /callout %}

## 스왑 (매수 및 매도)

`mplx genesis swap` 명령어는 본딩 커브에서 토큰을 매수하거나 매도합니다.

```bash {% title="토큰 매수 (0.05 SOL 사용)" %}
mplx genesis swap <GENESIS_ACCOUNT> --buyAmount 50000000
```

```bash {% title="토큰 매도" %}
mplx genesis swap <GENESIS_ACCOUNT> --sellAmount 500000000000
```

### 스왑 옵션

| 플래그 | 단축 | 설명 | 필수 여부 | 기본값 |
|--------|------|------|-----------|--------|
| `--buyAmount <string>` | | 사용할 견적 토큰 수량 (예: SOL의 경우 lamports) | 아니요 | |
| `--sellAmount <string>` | | 매도할 기본 토큰 수량 | 아니요 | |
| `--slippage <integer>` | | 슬리피지 허용 범위 (기준점 단위) | 아니요 | `200` (2%) |
| `--bucketIndex <integer>` | `-b` | 본딩 커브 버킷의 인덱스 | 아니요 | `0` |
| `--info` | | 스왑 없이 커브 상태 및 가격 견적 표시 | 아니요 | `false` |

{% callout type="note" title="정확히 하나의 수량 필요" %}
스왑 시 `--buyAmount` 또는 `--sellAmount` 중 정확히 하나를 제공하세요. `--info`를 사용하면 스왑 없이 커브 상태를 확인할 수 있습니다.
{% /callout %}

### 스왑 예시

커스텀 슬리피지로 매수 (1%):

```bash {% title="1% 슬리피지로 매수" %}
mplx genesis swap <GENESIS_ACCOUNT> --buyAmount 50000000 --slippage 100
```

### 스왑 출력

```text {% title="예상 스왑 출력" %}
--------------------------------
  Direction: Buy
  Amount In: 50000000 (quote tokens)
  Amount Out: <base_tokens_received>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
--------------------------------
```

## 커브 상태 확인

`--info` 플래그는 스왑 없이 현재 커브 상태를 표시합니다:

```bash {% title="커브 상태만 확인" %}
mplx genesis swap <GENESIS_ACCOUNT> --info
```

`--info`를 수량과 함께 사용하면 가격 견적을 얻을 수 있습니다:

```bash {% title="매수 견적 (0.1 SOL로 토큰 수량?)" %}
mplx genesis swap <GENESIS_ACCOUNT> --info --buyAmount 100000000
```

```bash {% title="매도 견적 (토큰 매도 시 SOL 수량?)" %}
mplx genesis swap <GENESIS_ACCOUNT> --info --sellAmount 1000000000
```

정보 출력에 포함되는 내용:
- 토큰당 현재 가격
- 리저브 잔액 (기본 및 견적)
- 채우기 비율
- 커브가 현재 스왑 가능한지 여부
- 수수료 및 최소 출력이 포함된 가격 견적 (수량이 제공된 경우)

## 본딩 커브 버킷 검사

`--type bonding-curve`와 함께 [`genesis bucket fetch`](/dev-tools/cli/genesis/manage#fetch-bucket) 명령어는 전체 버킷 구성을 가져옵니다:

```bash {% title="본딩 커브 버킷 가져오기" %}
mplx genesis bucket fetch <GENESIS_ACCOUNT> --type bonding-curve
```

또는 CLI가 버킷 유형을 자동으로 감지하게 합니다:

```bash {% title="버킷 유형 자동 감지" %}
mplx genesis bucket fetch <GENESIS_ACCOUNT>
```

## 전체 라이프사이클 예시

```bash {% title="전체 본딩 커브 라이프사이클" %}
# 1. 본딩 커브 런칭 생성
mplx genesis launch create --launchType bonding-curve \
  --name "My Token" --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123"

# (출력에서 GENESIS_ACCOUNT 복사)

# 2. 커브 상태 확인
mplx genesis swap <GENESIS_ACCOUNT> --info

# 3. 토큰 매수 (0.1 SOL)
mplx genesis swap <GENESIS_ACCOUNT> --buyAmount 100000000

# 4. 매수 후 가격 확인
mplx genesis swap <GENESIS_ACCOUNT> --info

# 5. 일부 토큰 매도
mplx genesis swap <GENESIS_ACCOUNT> --sellAmount 500000000000

# 6. 버킷 상태 검사
mplx genesis bucket fetch <GENESIS_ACCOUNT> --type bonding-curve
```

## 일반적인 오류

| 오류 | 원인 | 해결 방법 |
|------|------|-----------|
| Either --buyAmount or --sellAmount is required | 수량 미지정 및 `--info` 미사용 | `--buyAmount`, `--sellAmount`, 또는 `--info`를 추가하세요 |
| Cannot specify both --buyAmount and --sellAmount | 두 수량 모두 제공됨 | 스왑당 정확히 하나의 수량만 사용하세요 |
| Curve is not swappable | 커브가 시작되지 않았거나 매진 (졸업) | `--info`로 상태를 확인하세요 — 커브가 Raydium으로 졸업했을 수 있습니다 |
| Slippage exceeded | 가격이 허용 범위를 초과하여 변동됨 | `--slippage`를 늘리거나 더 작은 수량으로 재시도하세요 |
| Insufficient funds | 지갑에 SOL 또는 토큰이 부족함 | `mplx toolbox sol balance`로 잔액을 확인하세요 |

## 참고 사항

- 모든 수량은 기본 단위로 표시됩니다 — SOL의 경우 1 SOL = 1,000,000,000 lamports
- SOL을 견적 토큰으로 매수할 때, swap 명령어가 자동으로 SOL을 WSOL로 래핑합니다
- 기본 슬리피지 200 bps (2%)는 견적과 실행 사이의 가격 변동으로부터 보호합니다
- 창작자 수수료는 항상 본딩 커브에서 활성화됩니다 — 기본값은 런칭 지갑이며 거래 중 버킷에 누적됩니다
- 커브가 Raydium으로 졸업한 후에는 Raydium CPMM 풀에서 거래가 계속됩니다

## FAQ

**본딩 커브는 어떤 가격 모델을 사용하나요?**
본딩 커브는 상수 곱(constant-product) 공식을 사용합니다. 더 많은 토큰을 매수할수록 가격이 오르고, 토큰을 매도하면 가격이 내려갑니다.

**매수 전에 SOL을 래핑해야 하나요?**
아니요. SOL로 매수할 때, swap 명령어가 필요하면 SOL을 WSOL로 자동으로 래핑합니다.

**스왑 전에 가격을 확인하는 방법은 무엇인가요?**
`--info` 플래그를 사용하여 커브 상태를 표시하세요. `--info`를 `--buyAmount` 또는 `--sellAmount`와 함께 사용하면 스왑을 실행하지 않고 견적을 얻을 수 있습니다.

**커브가 완전히 채워지면 어떻게 되나요?**
모든 토큰이 매도되면 본딩 커브가 Raydium CPMM 풀로 자동 졸업합니다. 졸업 후에는 Raydium에서 거래가 계속됩니다.

**수동 흐름으로 본딩 커브를 생성할 수 있나요?**
아니요. 본딩 커브 런칭은 `genesis launch create --launchType bonding-curve`를 통해 Genesis API로만 사용할 수 있습니다.

## 용어 설명

| 용어 | 정의 |
|------|------|
| **본딩 커브 (Bonding Curve)** | 공급에 따라 토큰 가격을 책정하는 상수 곱 AMM — 토큰을 매수하면 가격이 오르고 매도하면 가격이 내려갑니다 |
| **졸업 (Graduation)** | 커브의 모든 토큰이 매도되면 유동성이 Raydium CPMM 풀로 자동 이전됩니다 |
| **견적 토큰 (Quote Token)** | 매수 시 사용하는 토큰 (보통 SOL) — 수량은 기본 단위 (lamports)로 표시됩니다 |
| **기본 토큰 (Base Token)** | 커브에서 런칭되고 거래되는 토큰 |
| **슬리피지 (Slippage)** | 견적과 실행 사이의 최대 허용 가격 편차 (기준점 단위) |
| **채우기 비율 (Fill Percentage)** | 커브의 전체 용량 중 채워진 비율 (100% = 졸업) |
| **창작자 수수료 (Creator Fee)** | 창작자 지갑으로 지향되는 스왑 수수료로, 버킷에 누적되다 졸업 후 청구됩니다 |
