---
# Remember to also update the date in src/components/products/guides/index.js
title: SOL 언랩
metaTitle: SOL 언랩 | Metaplex CLI
description: 모든 wSOL(래핑된 SOL) 토큰을 네이티브 SOL로 언랩합니다.
keywords:
  - mplx CLI
  - wSOL
  - wrapped SOL
  - unwrap SOL
  - Solana
about:
  - Metaplex CLI
  - Wrapped SOL
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
---

## 요약

`mplx toolbox sol unwrap` 명령어는 연결된 토큰 계정을 닫아서 전체 wSOL 잔액을 언랩하고, SOL을 소유자에게 반환합니다.

- wSOL 연결된 토큰 계정을 닫고 모든 SOL을 identity로 반환합니다.
- 인수와 플래그를 받지 않습니다.
- 전부 또는 전무 — 부분 언랩은 지원되지 않습니다.
- 현재 지갑에 wSOL 토큰 계정이 없으면 실패합니다.

## 빠른 참조

| 항목 | 값 |
|------|-------|
| 명령어 | `mplx toolbox sol unwrap` |
| 인수 | 없음 |
| 플래그 | 없음 |
| 네이티브 민트 | `So11111111111111111111111111111111111111112` |
| 역연산 | [`toolbox sol wrap`](/dev-tools/cli/toolbox/sol-wrap) |

## 기본 사용법

인수 없이 명령어를 실행하여 현재 지갑의 전체 wSOL 잔액을 언랩합니다.

```bash
mplx toolbox sol unwrap
```

## 예시

이 명령어는 단일 호출 형식을 가집니다.

```bash
mplx toolbox sol unwrap
```

## 출력

성공하면 명령어는 언랩된 금액, 닫힌 토큰 계정, 트랜잭션 서명을 출력합니다.

```
--------------------------------
    Unwrapped <amount> SOL
    Token Account Closed: <associated_token_account>
    Signature: <transaction_signature>
    Explorer: <explorer_url>
--------------------------------
```

## 참고사항

- 언랩은 전부 또는 전무입니다 — 전체 wSOL 잔액이 SOL로 다시 변환되고 토큰 계정이 닫힙니다.
- 현재 지갑에 wSOL 토큰 계정이 없으면 실패합니다.
- [`toolbox sol wrap`](/dev-tools/cli/toolbox/sol-wrap)으로 래핑하세요.
