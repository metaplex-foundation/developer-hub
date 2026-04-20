---
# Remember to also update the date in src/components/products/guides/index.js
title: 스토리지 잔액
metaTitle: 스토리지 잔액 | Metaplex CLI
description: 스토리지 제공자 계정의 현재 잔액을 표시합니다.
keywords:
  - mplx CLI
  - storage balance
  - Irys
  - Arweave
  - storage provider
about:
  - Metaplex CLI
  - Storage Providers
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
---

## 요약

`mplx toolbox storage balance` 명령어는 구성된 스토리지 제공자에 보유된 현재 선불 잔액을 출력합니다.

- 활성 스토리지 제공자(예: Irys)에서 잔액을 읽어옵니다.
- 인수와 플래그를 받지 않습니다.
- `basisPoints`(lamports)와 SOL 단위 금액을 포함하는 JSON 객체를 출력합니다.
- 지갑 SOL 잔액과 별개입니다 — 스토리지 크레딧만 반영합니다.

## 빠른 참조

| 항목 | 값 |
|------|-------|
| 명령어 | `mplx toolbox storage balance` |
| 인수 | 없음 |
| 플래그 | 없음 |
| 출력 형식 | JSON |
| 충전 | [`toolbox storage fund`](/dev-tools/cli/toolbox/storage-fund) |
| 출금 | [`toolbox storage withdraw`](/dev-tools/cli/toolbox/storage-withdraw) |

## 기본 사용법

인수 없이 명령어를 실행합니다.

```bash
mplx toolbox storage balance
```

## 예시

이 명령어는 단일 호출 형식을 가집니다.

```bash
mplx toolbox storage balance
```

## 출력

명령어는 `basisPoints`(lamports)와 SOL 단위 금액을 포함한 JSON 형식으로 잔액을 출력합니다.

## 참고사항

- 스토리지 잔액은 스토리지 제공자(예: Irys)에 보유된 선불 크레딧입니다. 지갑 SOL 잔액과 별개입니다.
- [`toolbox storage fund`](/dev-tools/cli/toolbox/storage-fund)로 충전하거나 [`toolbox storage withdraw`](/dev-tools/cli/toolbox/storage-withdraw)로 출금하세요.
