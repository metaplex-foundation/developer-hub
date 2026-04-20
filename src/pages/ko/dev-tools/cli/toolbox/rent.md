---
# Remember to also update the date in src/components/products/guides/index.js
title: 임대료
metaTitle: 임대료 | Metaplex CLI
description: 주어진 크기의 계정에 대한 Solana 임대료 비용을 계산합니다.
keywords:
  - mplx CLI
  - Solana rent
  - rent exemption
  - account size
  - lamports
about:
  - Metaplex CLI
  - Solana Rent
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
---

## 요약

`mplx toolbox rent` 명령어는 주어진 크기의 Solana 계정에 필요한 임대료 면제 잔액을 반환합니다.

- 구성된 RPC에서 현재 임대료율을 직접 읽어옵니다.
- 기본적으로 SOL을 출력하며, `--lamports`로 원시 lamports를 출력합니다.
- `--noHeader`가 전달되면 128바이트 계정 헤더를 제외합니다.
- 읽기 전용 — 트랜잭션이 전송되지 않습니다.

## 빠른 참조

아래 표는 명령어의 입력값, 플래그, 일반적인 계정 크기를 요약합니다.

| 항목 | 값 |
|------|-------|
| 명령어 | `mplx toolbox rent <bytes>` |
| 필수 인수 | `bytes` — 바이트 수의 정수 |
| 선택적 플래그 | `--lamports`, `--noHeader` |
| 읽기 전용 | 예 — 트랜잭션이 전송되지 않음 |
| 일반적인 크기 | SPL mint = 82 bytes · SPL token account = 165 bytes |

## 기본 사용법

계정 크기를 바이트 단위로 유일한 위치 인수로 전달합니다.

```bash
mplx toolbox rent <bytes>
```

## 인수

이 명령어는 단일 위치 정수를 받습니다.

- `bytes` *(필수)*: 계정이 차지할 바이트 수.

## 플래그

선택적 플래그는 단위와 계정 헤더 포함 여부를 조정합니다.

- `--noHeader`: 임대료 계산 시 128바이트 계정 헤더를 무시합니다.
- `--lamports`: SOL 대신 lamports로 임대료 비용을 표시합니다.

## 예시

다음 예시는 일반적인 임대료 계산 시나리오를 다룹니다.

```bash
# Rent for a 165-byte SPL token account
mplx toolbox rent 165

# Rent in lamports
mplx toolbox rent 165 --lamports

# Exclude the 128-byte account header
mplx toolbox rent 165 --noHeader
```

## 출력

기본 출력은 주어진 바이트 크기에 대한 임대료 면제 잔액을 SOL 단위로 출력합니다.

```
--------------------------------
    Rent cost for <bytes> bytes is <amount> SOL
--------------------------------
```

## 참고사항

- Solana 계정은 삭제되지 않도록 최소한의 임대료 면제 잔액을 보유해야 합니다.
- 일반적인 크기: SPL 토큰 계정 = `165` 바이트, SPL mint = `82` 바이트.
