---
# Remember to also update the date in src/components/products/guides/index.js
title: 스토리지 충전
metaTitle: 스토리지 충전 | Metaplex CLI
description: SOL로 스토리지 제공자 계정에 자금을 충전합니다.
keywords:
  - mplx CLI
  - storage fund
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

`mplx toolbox storage fund` 명령어는 스토리지 제공자 계정에 SOL을 입금하여 이후 업로드에 사용 가능한 크레딧이 있도록 합니다.

- 현재 CLI 지불자로부터 스토리지 제공자에게 SOL을 이체합니다.
- 금액은 SOL로 지정됩니다(소수 허용).
- 성공 시 새로운 스토리지 잔액을 출력합니다.
- 대량 업로드 전에 실행 중 자금 조달 프롬프트를 피하기 위해 사용됩니다.

## 빠른 참조

| 항목 | 값 |
|------|-------|
| 명령어 | `mplx toolbox storage fund <amount>` |
| 필수 인수 | `amount` — 입금할 SOL 금액 |
| 플래그 | 없음 |
| 제공자 | 활성 스토리지 제공자 (예: Irys) |
| 역연산 | [`toolbox storage withdraw`](/dev-tools/cli/toolbox/storage-withdraw) |

## 기본 사용법

입금할 SOL 금액을 유일한 위치 인수로 전달합니다.

```bash
mplx toolbox storage fund <amount>
```

## 인수

이 명령어는 금액을 지정하는 단일 위치 인수를 받습니다.

- `amount` *(필수)*: 스토리지 계정에 입금할 SOL 금액.

## 예시

다음 예시는 소수 및 정수 SOL 입금을 보여줍니다.

```bash
mplx toolbox storage fund 0.1
mplx toolbox storage fund 1
```

## 출력

성공하면 명령어는 스토리지 계정의 새로운 잔액을 출력합니다.

## 참고사항

- 자금은 CLI 지불자로 구성된 지갑에서 이체됩니다.
- [`toolbox storage balance`](/dev-tools/cli/toolbox/storage-balance)로 현재 잔액을 확인하세요.
- [`toolbox storage withdraw`](/dev-tools/cli/toolbox/storage-withdraw)로 자금을 회수할 수 있습니다.
