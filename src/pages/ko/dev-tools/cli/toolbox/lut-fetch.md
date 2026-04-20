---
# Remember to also update the date in src/components/products/guides/index.js
title: 주소 조회 테이블 가져오기
metaTitle: 주소 조회 테이블 가져오기 | Metaplex CLI
description: Solana 주소 조회 테이블(LUT)의 내용을 가져와서 표시합니다.
keywords:
  - mplx CLI
  - Address Lookup Table
  - LUT
  - fetch LUT
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

`mplx toolbox lut fetch` 명령어는 네트워크에서 주소 조회 테이블을 읽고 authority와 포함된 주소를 출력합니다.

- LUT 계정을 해석하고 보유한 모든 주소를 나열합니다.
- authority를 출력하며, 고정된 LUT의 경우 `None`을 출력합니다.
- verbose 모드에서는 비활성화 슬롯과 마지막 확장 슬롯을 추가로 표시합니다.
- `--json`을 통해 기계가 읽을 수 있는 JSON 출력을 지원합니다.

## 빠른 참조

| 항목 | 값 |
|------|-------|
| 명령어 | `mplx toolbox lut fetch <address>` |
| 필수 인수 | `address` — LUT의 공개키 |
| 선택적 플래그 | `--verbose`, `--json` |
| 읽기 전용 | 예 — 트랜잭션이 전송되지 않음 |

## 기본 사용법

LUT의 주소를 유일한 위치 인수로 전달하여 가져옵니다.

```bash
mplx toolbox lut fetch <address>
```

## 인수

이 명령어는 LUT를 식별하는 단일 위치 인수를 받습니다.

- `address` *(필수)*: 가져올 LUT의 공개키.

## 플래그

선택적 플래그는 출력을 확장합니다.

- `--verbose`: 추가 세부 정보(비활성화 슬롯, 마지막 확장 슬롯)를 표시합니다.
- `--json`: 형식화된 텍스트 대신 구조화된 JSON을 출력합니다.

## 예시

다음 예시는 기본, verbose, JSON 출력 모드를 보여줍니다.

```bash
mplx toolbox lut fetch <address>
mplx toolbox lut fetch <address> --verbose
mplx toolbox lut fetch <address> --json
```

## 출력

기본 출력은 authority, 총 주소 수, 테이블의 각 주소를 나열합니다.

```
--------------------------------
Address Lookup Table Details
LUT Address: <lut_address>
Authority: <authority_pubkey>
Total Addresses: <count>

Addresses in Table:
    1. <address1>
    2. <address2>
--------------------------------
```

## 참고사항

- `deactivationSlot`이 `0`이면 LUT가 여전히 활성 상태임을 의미합니다.
- LUT를 생성하려면 [`toolbox lut create`](/dev-tools/cli/toolbox/lut-create)를 사용하세요.
