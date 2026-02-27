---
title: Genesis 계정 생성
metaTitle: Genesis 계정 생성 | Metaplex CLI
description: Metaplex CLI를 사용하여 새 Genesis 계정과 token mint를 생성합니다.
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
    a: Solana에서 새 Genesis 계정 PDA와 token mint를 생성합니다. 이것은 모든 Genesis 토큰 출시의 첫 번째 단계입니다.
  - q: base unit으로 totalSupply를 어떻게 계산하나요?
    a: 원하는 토큰 수에 10의 소수점 거듭제곱을 곱합니다. 소수점 9자리의 100만 토큰의 경우, totalSupply = 1000000 * 10^9 = 1000000000000000입니다.
---

{% callout title="수행할 작업" %}
Genesis 계정과 token mint를 생성합니다 — 모든 토큰 출시의 첫 번째 단계:
- 전체 출시를 관리하는 Genesis PDA 초기화
- 새 token mint 생성 (또는 기존 것 연결)
- token 이름, 심볼, 소수점, 공급량 구성
{% /callout %}

## 요약

`mplx genesis create` 명령어는 새 Genesis 계정과 token mint를 생성합니다. 이것은 모든 토큰 출시의 첫 번째 단계입니다.

- **생성 항목**: Genesis 계정 PDA와 token mint
- **필수 플래그**: `--name`, `--symbol`, `--totalSupply`
- **기본 소수점**: 9 (1 token = 1,000,000,000 base unit)

## 범위 외

Bucket 구성, 입금/청구 흐름, token 메타데이터 호스팅, 유동성 풀 설정.

**바로가기:** [기본 사용법](#기본-사용법) · [옵션](#옵션) · [예제](#예제) · [출력](#출력) · [일반적인 오류](#일반적인-오류) · [FAQ](#faq)

*Metaplex Foundation 관리 · 최종 검증 2026년 2월 · Metaplex CLI(mplx) 필요*

## 기본 사용법

```bash {% title="Genesis 계정 생성" %}
mplx genesis create --name "My Token" --symbol "MTK" --totalSupply 1000000000000000 --decimals 9
```

## 옵션

| 플래그 | 단축 | 설명 | 필수 |
|--------|------|------|------|
| `--name <string>` | `-n` | token의 이름 | 예 |
| `--symbol <string>` | `-s` | token의 심볼 | 예 |
| `--totalSupply <string>` | | base unit으로 표시된 총 공급량 | 예 |
| `--uri <string>` | `-u` | token 메타데이터 JSON의 URI | 아니요 |
| `--decimals <integer>` | `-d` | 소수점 자릿수 (기본값: 9) | 아니요 |
| `--quoteMint <string>` | | quote token mint 주소 (기본값: Wrapped SOL) | 아니요 |
| `--fundingMode <new-mint\|transfer>` | | 새 mint 생성 또는 기존 것 사용 (기본값: `new-mint`) | 아니요 |
| `--baseMint <string>` | | base token mint 주소 (`fundingMode`가 `transfer`일 때 필수) | 조건부 |
| `--genesisIndex <integer>` | | 동일 mint에 대한 다중 출시를 위한 Genesis 인덱스 (기본값: 0) | 아니요 |

## 예제

1. 소수점 9자리와 총 공급량 100만으로 token 생성:
```bash {% title="기본 생성" %}
mplx genesis create \
  --name "My Token" \
  --symbol "MTK" \
  --totalSupply 1000000000000000 \
  --decimals 9
```

2. 메타데이터 URI와 함께 token 생성:
```bash {% title="메타데이터 URI 포함" %}
mplx genesis create \
  --name "My Token" \
  --symbol "MTK" \
  --totalSupply 1000000000000000 \
  --decimals 9 \
  --uri "https://example.com/metadata.json"
```

3. 기존 token mint 사용:
```bash {% title="기존 mint" %}
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

`Genesis Account` 주소를 저장하세요 — 이후 모든 명령어에서 사용합니다.

## 일반적인 오류

| 오류 | 원인 | 해결 방법 |
|------|------|-----------|
| Missing required flag | `--name`, `--symbol`, 또는 `--totalSupply`가 제공되지 않음 | 세 가지 필수 플래그를 모두 추가하세요 |
| Invalid totalSupply | 숫자가 아니거나 0인 값 | base unit으로 양의 정수를 제공하세요 |
| baseMint required | `--fundingMode transfer`를 `--baseMint` 없이 사용 | transfer 모드 사용 시 `--baseMint <address>`를 추가하세요 |
| Insufficient SOL | 트랜잭션 수수료를 위한 SOL이 부족 | 수수료를 위해 지갑에 SOL을 충전하세요 |

## 참고사항

- `totalSupply`는 base unit으로 지정합니다. 소수점 9자리의 경우, `1000000000000000` = 1,000,000 token
- 기본 quote token은 Wrapped SOL입니다. 다른 SPL token을 지정하려면 `--quoteMint`를 사용하세요
- `--fundingMode transfer`를 사용할 때는 기존 token mint 주소와 함께 `--baseMint`도 제공해야 합니다
- 동일한 token mint에 대해 여러 Genesis 출시를 생성해야 하는 경우 `--genesisIndex`를 사용하세요

## FAQ

**mplx genesis create는 무엇을 하나요?**
Solana에서 새 Genesis 계정 PDA와 token mint를 생성합니다. 이것은 모든 Genesis 토큰 출시의 첫 번째 단계입니다 — 이후 모든 명령어는 이 단계에서 생성된 Genesis 주소를 참조합니다.

**base unit으로 totalSupply를 어떻게 계산하나요?**
원하는 토큰 수에 10의 소수점 거듭제곱을 곱합니다. 소수점 9자리의 100만 토큰의 경우: `1,000,000 × 10^9 = 1,000,000,000,000,000`.

**새로 만드는 대신 기존 token mint를 사용할 수 있나요?**
네. `--fundingMode transfer`를 설정하고 `--baseMint`로 기존 mint 주소를 제공하세요. 기존 mint의 권한이 Genesis 계정으로 이전 가능해야 합니다.

**genesisIndex는 무엇인가요?**
동일한 token mint에 대해 여러 Genesis 출시를 허용합니다. 각 출시에는 고유한 인덱스가 필요합니다. 기본값은 0입니다.

## 용어집

| 용어 | 정의 |
|------|------|
| **Genesis Account** | 이 명령어로 생성되는, 토큰 출시를 관리하는 PDA |
| **Base Units** | 최소 단위 — 소수점 9자리의 경우, 1 token = 1,000,000,000 base unit |
| **Quote Mint** | 입금 시 결제 수단으로 사용되는 token (기본값: Wrapped SOL) |
| **Genesis Index** | 동일한 token mint에 대해 여러 출시를 허용하는 숫자 인덱스 |
