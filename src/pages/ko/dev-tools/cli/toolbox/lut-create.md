---
# Remember to also update the date in src/components/products/guides/index.js
title: 주소 조회 테이블 생성
metaTitle: 주소 조회 테이블 생성 | Metaplex CLI
description: 선택적 초기 주소와 함께 새로운 Solana 주소 조회 테이블(LUT)을 생성합니다.
keywords:
  - mplx CLI
  - Address Lookup Table
  - LUT
  - create LUT
  - Solana
about:
  - Metaplex CLI
  - Address Lookup Tables
  - Solana
proficiencyLevel: Intermediate
created: '04-20-2026'
updated: '04-20-2026'
---

## 요약

`mplx toolbox lut create` 명령어는 새로운 Solana 주소 조회 테이블(LUT)을 생성하며, 주소가 제공된 경우 동일한 트랜잭션에서 확장합니다.

- authority와 최근 슬롯으로부터 LUT 주소를 파생합니다.
- 초기 항목으로 쉼표로 구분된 공개키 목록을 선택적으로 받습니다.
- `--authority`가 전달되지 않으면 authority는 현재 identity로 기본 설정됩니다.
- 성공 시 LUT 주소와 트랜잭션 서명을 반환합니다.

## 빠른 참조

| 항목 | 값 |
|------|-------|
| 명령어 | `mplx toolbox lut create [addresses]` |
| 선택적 인수 | `addresses` — 쉼표로 구분된 공개키 목록 |
| 선택적 플래그 | `--recentSlot <number>`, `--authority <pubkey>` |
| LUT 주소 | `authority` + `recentSlot`에서 파생된 PDA |
| 후속 작업 | [`toolbox lut fetch`](/dev-tools/cli/toolbox/lut-fetch), [`toolbox lut deactivate`](/dev-tools/cli/toolbox/lut-deactivate), [`toolbox lut close`](/dev-tools/cli/toolbox/lut-close) |

## 기본 사용법

인수 없이 실행하여 빈 LUT를 생성하거나, 쉼표로 구분된 공개키 목록을 전달하여 초기화합니다.

```bash
# Create an empty LUT
mplx toolbox lut create

# Create a LUT with initial addresses
mplx toolbox lut create "<pubkey1>,<pubkey2>"
```

## 인수

단일 위치 인수는 쉼표로 구분된 선택적 공개키 목록입니다.

- `addresses` *(선택)*: LUT에 포함할 쉼표로 구분된 공개키 목록.

## 플래그

선택적 플래그는 최근 슬롯과 authority 기본값을 재정의합니다.

- `--recentSlot <number>`: LUT PDA를 파생하는 데 사용되는 최근 슬롯. 기본값은 최신 슬롯입니다.
- `--authority <pubkey>`: LUT의 authority 공개키. 기본값은 현재 identity입니다.

## 예시

다음 예시는 빈 LUT 생성, 초기 주소가 포함된 LUT 생성, 사용자 지정 authority가 포함된 LUT 생성을 보여줍니다.

```bash
mplx toolbox lut create
mplx toolbox lut create "11111111111111111111111111111111,TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
mplx toolbox lut create "11111111111111111111111111111111" --authority <authority-pubkey>
```

## 출력

성공하면 명령어는 새 LUT 주소와 트랜잭션 서명을 출력합니다.

```
--------------------------------
Address Lookup Table Created
LUT Address: <lut_address>
Signature: <transaction_signature>
--------------------------------
```

## 참고사항

- LUT 주소는 authority와 최근 슬롯에서 파생된 PDA입니다.
- [`toolbox lut fetch`](/dev-tools/cli/toolbox/lut-fetch)를 사용하여 내용을 다시 읽어올 수 있습니다.
- LUT를 제거하려면 먼저 [`toolbox lut deactivate`](/dev-tools/cli/toolbox/lut-deactivate)로 비활성화한 다음 [`toolbox lut close`](/dev-tools/cli/toolbox/lut-close)로 닫으세요.
