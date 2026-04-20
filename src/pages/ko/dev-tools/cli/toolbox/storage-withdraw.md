---
# Remember to also update the date in src/components/products/guides/index.js
title: 스토리지 출금
metaTitle: 스토리지 출금 | Metaplex CLI
description: 스토리지 제공자 계정에서 지갑으로 자금을 출금합니다.
keywords:
  - mplx CLI
  - storage withdraw
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

`mplx toolbox storage withdraw` 명령어는 스토리지 제공자 계정에서 SOL을 지갑으로 다시 출금합니다.

- 특정 SOL 금액을 출금하거나 `--all`로 전체 잔액을 출금합니다.
- `amount` 또는 `--all` 중 하나만 필요합니다 — 둘 다는 아닙니다.
- 자금은 CLI 지불자로 구성된 지갑으로 반환됩니다.
- 성공 시 새로운 스토리지 잔액을 출력합니다.

## 빠른 참조

| 항목 | 값 |
|------|-------|
| 명령어 | `mplx toolbox storage withdraw [amount] [--all]` |
| 선택적 인수 | `amount` — SOL 금액 (`--all`이 설정되지 않은 경우 필수) |
| 선택적 플래그 | `--all` — 전체 잔액 출금 |
| 제공자 | 활성 스토리지 제공자 (예: Irys) |
| 역연산 | [`toolbox storage fund`](/dev-tools/cli/toolbox/storage-fund) |

## 기본 사용법

특정 금액을 출금하려면 금액을 전달하거나, 전체 잔액을 비우려면 `--all`을 사용합니다.

```bash
# Withdraw a specific amount
mplx toolbox storage withdraw <amount>

# Withdraw all funds
mplx toolbox storage withdraw --all
```

## 인수

단일 위치 인수는 `--all`이 설정되지 않은 경우 금액을 지정합니다.

- `amount` *(`--all`이 설정되지 않은 경우 필수)*: 출금할 SOL 금액.

## 플래그

선택적 플래그는 전체 잔액을 비웁니다.

- `--all`: 스토리지 계정에서 전체 잔액을 출금합니다.

## 예시

다음 예시는 고정 금액과 전체 출금을 보여줍니다.

```bash
mplx toolbox storage withdraw 0.05
mplx toolbox storage withdraw --all
```

## 출력

성공하면 명령어는 스토리지 계정의 새로운 잔액을 출력합니다.

## 참고사항

- 금액 또는 `--all` 중 하나를 제공하세요 — 둘 다는 아닙니다.
- 자금은 CLI 지불자로 구성된 지갑으로 반환됩니다.
- [`toolbox storage balance`](/dev-tools/cli/toolbox/storage-balance)로 현재 잔액을 확인하세요.
