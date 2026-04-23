---
# Remember to also update the date in src/components/products/guides/index.js
title: 주소 조회 테이블 닫기
metaTitle: 주소 조회 테이블 닫기 | Metaplex CLI
description: 비활성화된 주소 조회 테이블(LUT)을 닫고 임대료를 회수합니다.
keywords:
  - mplx CLI
  - Address Lookup Table
  - LUT
  - close LUT
  - reclaim rent
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

`mplx toolbox lut close` 명령어는 이전에 비활성화된 주소 조회 테이블을 닫고 임대료를 수신자 지갑으로 반환합니다.

- LUT 계정과 그 안에 저장된 모든 주소를 영구적으로 제거합니다.
- LUT가 최소 512 슬롯(메인넷에서 약 5분) 동안 비활성화되어 있어야 합니다.
- 기본적으로 현재 identity로 임대료를 회수하거나 `--recipient`로 지정할 수 있습니다.
- 현재 identity(또는 `--authority`)가 LUT authority와 일치할 때만 성공합니다.

## 빠른 참조

아래 표는 명령어의 구문, 전제 조건, 기본값을 요약합니다.

| 항목 | 값 |
|------|-------|
| 명령어 | `mplx toolbox lut close <address>` |
| 필수 인수 | `address` — LUT의 공개키 |
| 선택적 플래그 | `--recipient <pubkey>`, `--authority <pubkey>` |
| 전제 조건 | [`toolbox lut deactivate`](/dev-tools/cli/toolbox/lut-deactivate)로 LUT 비활성화 |
| 최소 대기 시간 | 비활성화 후 512 슬롯 |
| 되돌리기 가능 | 아니오 |

## 기본 사용법

비활성화된 LUT의 주소를 유일한 위치 인수로 전달하여 닫습니다.

```bash
mplx toolbox lut close <address>
```

## 인수

이 명령어는 닫을 LUT를 식별하는 단일 위치 인수를 받습니다.

- `address` *(필수)*: 닫을 LUT의 공개키.

## 플래그

선택적 플래그는 기본 수신자 및 authority를 재정의합니다.

- `--recipient <pubkey>`: 회수된 임대료의 수신자. 기본값은 현재 identity입니다.
- `--authority <pubkey>`: LUT의 authority 공개키. 기본값은 현재 identity입니다.

## 예시

다음 예시는 일반적인 닫기 시나리오를 다룹니다.

```bash
mplx toolbox lut close <address>
mplx toolbox lut close <address> --recipient <recipient-pubkey>
mplx toolbox lut close <address> --authority <authority-pubkey>
```

## 출력

성공하면 명령어는 닫힌 LUT 주소와 트랜잭션 서명을 출력합니다.

```
--------------------------------
Address Lookup Table Closed
LUT Address: <lut_address>
Signature: <transaction_signature>
--------------------------------
```

## 참고사항

- LUT는 먼저 [`toolbox lut deactivate`](/dev-tools/cli/toolbox/lut-deactivate)로 비활성화해야 합니다.
- 비활성화와 닫기 사이에 최소 512 슬롯(메인넷에서 약 5분)이 경과해야 합니다.
- 닫기는 되돌릴 수 없습니다 — LUT와 포함된 주소는 영구적으로 제거됩니다.
- LUT authority만 닫을 수 있습니다.
