---
# Remember to also update the date in src/components/products/guides/index.js
title: 토큰 발행
metaTitle: 토큰 발행 | Metaplex CLI
description: 기존 SPL 민트에서 수신자 지갑으로 추가 토큰을 발행합니다.
keywords:
  - mplx CLI
  - mint tokens
  - SPL token
  - mint authority
  - Solana
about:
  - Metaplex CLI
  - SPL Token
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
programmingLanguage:
  - Bash
---

## 요약

`mplx toolbox token mint` 명령어는 기존 SPL 토큰의 추가 단위를 수신자 지갑으로 발행합니다.

- 현재 identity가 지정된 민트에 대한 민트 authority를 보유해야 합니다.
- 수신자의 연결된 토큰 계정이 존재하지 않으면 즉시 생성합니다.
- `--recipient`가 전달되지 않으면 수신자는 현재 identity로 기본 설정됩니다.
- 금액은 원시 토큰 단위로 표현됩니다 — 표시 단위로 변환하려면 `10^decimals`로 나누세요.

## 빠른 참조

아래 표는 명령어의 입력값과 단위 의미를 요약합니다.

| 항목 | 값 |
|------|-------|
| 명령어 | `mplx toolbox token mint <mint> <amount>` |
| 필수 인수 | `mint`, `amount` (정수 > 0) |
| 선택적 플래그 | `--recipient <pubkey>` |
| 금액 단위 | 원시 토큰 단위 (표시 단위 아님) |
| 관련 | [`toolbox token create`](/dev-tools/cli/toolbox/token-create) |

## 기본 사용법

민트 주소와 금액을 위치 인수로 전달합니다.

```bash
mplx toolbox token mint <mint> <amount>
```

## 인수

이 명령어는 두 개의 위치 인수를 받습니다.

- `mint` *(필수)*: 토큰의 민트 주소.
- `amount` *(필수)*: 발행할 토큰 수. `0`보다 커야 합니다.

## 플래그

선택적 플래그는 기본 수신자를 재정의합니다.

- `--recipient <pubkey>`: 발행된 토큰을 받을 지갑. 기본값은 현재 identity입니다.

## 예시

다음 예시는 현재 identity와 특정 수신자에게 발행하는 것을 보여줍니다.

```bash
mplx toolbox token mint 7EYnhQoR9YM3c7UoaKRoA4q6YQ2Jx4VvQqKjB5x8XqWs 1000
mplx toolbox token mint 7EYnhQoR9YM3c7UoaKRoA4q6YQ2Jx4VvQqKjB5x8XqWs 1000 --recipient 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
```

## 출력

성공하면 명령어는 민트 주소, 수신자, 발행된 금액, 트랜잭션 서명을 출력합니다.

```
--------------------------------
Tokens minted successfully!

Mint Details:
Mint Address: <mint>
Recipient: <recipient>
Amount Minted: <amount>

Transaction Signature: <signature>
Explorer: <explorer_url>
--------------------------------
```

## 참고사항

- `amount`는 원시 토큰 단위로 표현됩니다. 표시 단위로 표현하려면 `10^decimals`로 나누세요.
- 수신자의 연결된 토큰 계정이 존재하지 않으면 즉시 생성됩니다.
- 민트에 대한 민트 authority를 보유해야 합니다 — 그렇지 않으면 트랜잭션이 실패합니다.
- [`toolbox token create`](/dev-tools/cli/toolbox/token-create)로 새 토큰을 생성하세요.
