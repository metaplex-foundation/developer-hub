---
# Remember to also update the date in src/components/products/guides/index.js
title: 주소 조회 테이블 비활성화
metaTitle: 주소 조회 테이블 비활성화 | Metaplex CLI
description: 주소 조회 테이블(LUT)을 닫기 전 첫 단계로 비활성화합니다.
keywords:
  - mplx CLI
  - Address Lookup Table
  - LUT
  - deactivate LUT
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

`mplx toolbox lut deactivate` 명령어는 주소 조회 테이블을 비활성화하여 나중에 닫고 임대료를 회수할 수 있도록 합니다.

- LUT에 새로운 주소가 추가되는 것을 방지합니다.
- `toolbox lut close`가 임대료를 회수하기 전에 필요합니다.
- 닫기가 가능하기 전에 약 512 슬롯(메인넷에서 약 5분)을 대기합니다.
- LUT authority만 테이블을 비활성화할 수 있습니다.

## 빠른 참조

| 항목 | 값 |
|------|-------|
| 명령어 | `mplx toolbox lut deactivate <address>` |
| 필수 인수 | `address` — LUT의 공개키 |
| 선택적 플래그 | `--authority <pubkey>` |
| 대기 시간 | LUT를 닫을 수 있기 전 512 슬롯 |
| 다음 단계 | [`toolbox lut close`](/dev-tools/cli/toolbox/lut-close) |

## 기본 사용법

LUT의 주소를 유일한 위치 인수로 전달하여 비활성화합니다.

```bash
mplx toolbox lut deactivate <address>
```

## 인수

이 명령어는 LUT를 식별하는 단일 위치 인수를 받습니다.

- `address` *(필수)*: 비활성화할 LUT의 공개키.

## 플래그

선택적 플래그는 기본 authority를 재정의합니다.

- `--authority <pubkey>`: LUT의 authority 공개키. 기본값은 현재 identity입니다.

## 예시

다음 예시는 기본 및 사용자 지정 authority 비활성화 흐름을 보여줍니다.

```bash
mplx toolbox lut deactivate <address>
mplx toolbox lut deactivate <address> --authority <authority-pubkey>
```

## 출력

성공하면 명령어는 비활성화된 LUT 주소와 트랜잭션 서명을 출력합니다.

```
--------------------------------
Address Lookup Table Deactivated
LUT Address: <lut_address>
Signature: <transaction_signature>
--------------------------------
```

## 참고사항

- 비활성화는 추가 주소가 추가되는 것을 방지합니다.
- LUT를 닫을 수 있기 전에 비활성화 후 약 512 슬롯(메인넷에서 약 5분)을 기다려야 합니다.
- LUT authority만 비활성화할 수 있습니다.
- 대기 시간이 지난 후 [`toolbox lut close`](/dev-tools/cli/toolbox/lut-close)로 LUT를 닫으세요.
