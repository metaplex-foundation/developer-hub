---
# Remember to also update the date in src/components/products/guides/index.js
title: SOL 래핑
metaTitle: SOL 래핑 | Metaplex CLI
description: 네이티브 SOL을 wSOL(래핑된 SOL) 토큰으로 래핑합니다.
keywords:
  - mplx CLI
  - wrap SOL
  - wSOL
  - wrapped SOL
  - Solana
about:
  - Metaplex CLI
  - Wrapped SOL
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
---

## 요약

`mplx toolbox sol wrap` 명령어는 SOL을 네이티브 민트 연결 토큰 계정으로 이체하고 잔액을 동기화하여 네이티브 SOL을 wSOL로 래핑합니다.

- wSOL 연결된 토큰 계정이 아직 존재하지 않으면 생성합니다.
- 현재 identity의 wSOL 잔액에 지정된 금액을 추가합니다.
- 금액은 SOL로 표시된 양수여야 합니다(소수 허용).
- [`toolbox sol unwrap`](/dev-tools/cli/toolbox/sol-unwrap)의 역연산입니다.

## 빠른 참조

| 항목 | 값 |
|------|-------|
| 명령어 | `mplx toolbox sol wrap <amount>` |
| 필수 인수 | `amount` — SOL 금액 (예: `1`, `0.5`) |
| 플래그 | 없음 |
| 네이티브 민트 | `So11111111111111111111111111111111111111112` |
| 역연산 | [`toolbox sol unwrap`](/dev-tools/cli/toolbox/sol-unwrap) |

## 기본 사용법

래핑할 SOL 금액을 유일한 위치 인수로 전달합니다.

```bash
mplx toolbox sol wrap <amount>
```

## 인수

이 명령어는 금액을 지정하는 단일 위치 인수를 받습니다.

- `amount` *(필수)*: 래핑할 SOL의 금액 (예: `1` 또는 `0.5`). `0`보다 커야 합니다.

## 예시

다음 예시는 정수 및 소수 금액을 보여줍니다.

```bash
mplx toolbox sol wrap 1
mplx toolbox sol wrap 0.5
```

## 출력

성공하면 명령어는 래핑된 금액, wSOL 토큰 계정, 트랜잭션 서명을 출력합니다.

```
--------------------------------
    Wrapped <amount> SOL to wSOL
    Token Account: <associated_token_account>
    Signature: <transaction_signature>
    Explorer: <explorer_url>
--------------------------------
```

## 참고사항

- 연결된 wSOL 토큰 계정이 아직 존재하지 않으면 동일한 트랜잭션의 일부로 생성됩니다.
- 네이티브 민트 주소는 `So11111111111111111111111111111111111111112`입니다.
- [`toolbox sol unwrap`](/dev-tools/cli/toolbox/sol-unwrap)으로 언랩하세요.
