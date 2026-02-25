---
title: Genesis 계정 생성
metaTitle: Genesis 계정 생성 | Metaplex CLI
description: Metaplex CLI를 사용하여 새로운 Genesis 계정과 토큰 민트를 생성합니다.
keywords:
  - genesis create
  - create token launch
  - mplx genesis create
  - token mint CLI
  - Solana token creation
about:
  - Genesis account creation
  - token mint setup
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
howToSteps:
  - Run mplx genesis create with name, symbol, totalSupply, and decimals
  - Optionally provide a metadata URI and custom quote mint
  - Save the Genesis Account address from the output for subsequent commands
howToTools:
  - Metaplex CLI (mplx)
  - Solana CLI
faqs:
  - q: mplx genesis create는 무엇을 하나요?
    a: Solana에서 새로운 Genesis 계정 PDA와 토큰 민트를 생성합니다. 이것은 모든 Genesis 토큰 출시의 첫 번째 단계입니다.
  - q: totalSupply를 기본 단위로 어떻게 계산하나요?
    a: 원하는 토큰 수에 10의 소수점 자릿수 제곱을 곱합니다. 소수점 9자리로 100만 토큰의 경우, totalSupply = 1000000 * 10^9 = 1000000000000000.
---

{% callout title="수행할 작업" %}
Genesis 계정과 토큰 민트 생성 — 모든 토큰 출시의 첫 번째 단계:
- 전체 출시를 관리하는 Genesis PDA 초기화
- 새 토큰 민트 생성 (또는 기존 민트 연결)
- 토큰 이름, 심볼, 소수점 자릿수 및 공급량 구성
{% /callout %}

## 요약

`mplx genesis create` 명령어는 새로운 Genesis 계정과 토큰 민트를 생성합니다. 이것은 모든 토큰 출시의 첫 번째 단계입니다.

- **생성 항목**: Genesis 계정 PDA와 토큰 민트
- **필수 플래그**: `--name`, `--symbol`, `--totalSupply`
- **기본 소수점 자릿수**: 9 (1 토큰 = 1,000,000,000 기본 단위)

## 범위 외

Bucket 구성, 예치/청구 플로우, 토큰 메타데이터 호스팅, 유동성 풀 설정.

**바로 이동:** [기본 사용법](#basic-usage) · [옵션](#options) · [예시](#examples) · [출력](#output) · [일반적인 오류](#common-errors) · [FAQ](#faq)

*Metaplex Foundation 관리 · 2026년 2월 최종 확인 · Metaplex CLI (mplx) 필요*

## 기본 사용법

```bash {% title="Genesis 계정 생성" %}
mplx genesis create --name "My Token" --symbol "MTK" --totalSupply 1000000000000000 --decimals 9
```

## 옵션

| 플래그 | 약어 | 설명 | 필수 |
|--------|------|------|------|
| `--name <string>` | `-n` | 토큰 이름 | 예 |
| `--symbol <string>` | `-s` | 토큰 심볼 | 예 |
| `--totalSupply <string>` | | 기본 단위의 총 공급량 | 예 |
| `--uri <string>` | `-u` | 토큰 메타데이터 JSON의 URI | 아니요 |
| `--decimals <integer>` | `-d` | 소수점 자릿수 (기본값: 9) | 아니요 |
| `--quoteMint <string>` | | Quote 토큰 민트 주소 (기본값: Wrapped SOL) | 아니요 |
| `--fundingMode <new-mint\|transfer>` | | 새 민트 생성 또는 기존 민트 사용 (기본값: `new-mint`) | 아니요 |
| `--baseMint <string>` | | 기본 토큰 민트 주소 (`fundingMode`가 `transfer`일 때 필수) | 조건부 |
| `--genesisIndex <integer>` | | 같은 민트에서 여러 출시를 위한 Genesis 인덱스 (기본값: 0) | 아니요 |

## 예시

1. 소수점 9자리와 100만 총 공급량으로 토큰 생성:
```bash {% title="기본 생성" %}
mplx genesis create \
  --name "My Token" \
  --symbol "MTK" \
  --totalSupply 1000000000000000 \
  --decimals 9
```

2. 메타데이터 URI를 포함한 토큰 생성:
```bash {% title="메타데이터 URI 포함" %}
mplx genesis create \
  --name "My Token" \
  --symbol "MTK" \
  --totalSupply 1000000000000000 \
  --decimals 9 \
  --uri "https://example.com/metadata.json"
```

3. 기존 토큰 민트 사용:
```bash {% title="기존 민트" %}
mplx genesis create \
  --name "Existing Token" \
  --symbol "EXT" \
  --totalSupply 1000000000000000 \
  --fundingMode transfer \
  --baseMint <EXISTING_MINT_ADDRESS>
```

## 출력

```text {% title="예상 출력" %}
--------------------------------
  Genesis Account: <genesis_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
--------------------------------
```

`Genesis Account` 주소를 저장하세요 — 이후 모든 명령어에서 사용됩니다.

## 일반적인 오류

| 오류 | 원인 | 해결 방법 |
|------|------|-----------|
| Missing required flag | `--name`, `--symbol` 또는 `--totalSupply`가 제공되지 않음 | 세 가지 필수 플래그를 모두 추가하세요 |
| Invalid totalSupply | 숫자가 아니거나 0인 값 | 기본 단위의 양의 정수를 제공하세요 |
| baseMint required | `--baseMint` 없이 `--fundingMode transfer` 사용 | transfer 모드 사용 시 `--baseMint <address>`를 추가하세요 |
| Insufficient SOL | 트랜잭션 수수료를 위한 SOL 부족 | 수수료를 위해 지갑에 SOL을 충전하세요 |

## 참고 사항

- `totalSupply`는 기본 단위입니다. 소수점 9자리의 경우, `1000000000000000` = 1,000,000 토큰
- 기본 Quote 토큰은 Wrapped SOL입니다. 다른 SPL 토큰을 지정하려면 `--quoteMint`를 사용하세요
- `--fundingMode transfer` 사용 시, 기존 토큰 민트 주소와 함께 `--baseMint`도 제공해야 합니다
- 같은 토큰 민트에 대해 여러 Genesis 출시를 생성해야 하는 경우 `--genesisIndex`를 사용하세요

## FAQ

**mplx genesis create는 무엇을 하나요?**
Solana에서 새로운 Genesis 계정 PDA와 토큰 민트를 생성합니다. 이것은 모든 Genesis 토큰 출시의 첫 번째 단계입니다 — 이후 모든 명령어는 이 단계에서 생성된 Genesis 주소를 참조합니다.

**totalSupply를 기본 단위로 어떻게 계산하나요?**
원하는 토큰 수에 10의 소수점 자릿수 제곱을 곱합니다. 소수점 9자리로 100만 토큰의 경우: `1,000,000 x 10^9 = 1,000,000,000,000,000`.

**새 민트를 생성하는 대신 기존 토큰 민트를 사용할 수 있나요?**
네. `--fundingMode transfer`를 설정하고 `--baseMint`로 기존 민트 주소를 제공하세요. 기존 민트의 권한이 Genesis 계정으로 이전 가능해야 합니다.

**genesisIndex는 무엇을 위한 것인가요?**
같은 토큰 민트에 대해 여러 Genesis 출시를 허용합니다. 각 출시에는 고유한 인덱스가 필요합니다. 기본값은 0입니다.

## 용어집

| 용어 | 정의 |
|------|------|
| **Genesis Account** | 이 명령어로 생성되는, 토큰 출시를 관리하는 PDA |
| **Base Units** | 최소 단위 — 소수점 9자리의 경우, 1 토큰 = 1,000,000,000 기본 단위 |
| **Quote Mint** | 예치 시 결제 수단으로 수락되는 토큰 (기본값: Wrapped SOL) |
| **Genesis Index** | 같은 토큰 민트에 대해 여러 출시를 허용하는 숫자 인덱스 |
