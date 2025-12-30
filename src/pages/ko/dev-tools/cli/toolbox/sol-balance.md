---
title: SOL 잔액
metaTitle: SOL 잔액 | Metaplex CLI
description: 지갑 주소의 SOL 잔액 확인
---

지갑 주소의 SOL 잔액을 확인합니다. 이 명령어를 사용하면 네트워크에 있는 모든 지갑의 SOL 잔액을 빠르게 확인할 수 있습니다.

## 기본 사용법

```bash
mplx toolbox sol-balance <address>
```

## 인수

| 인수 | 설명 |
|----------|-------------|
| `address` | 확인할 지갑 주소 (선택적, 기본값은 활성 지갑) |

## 예시

### 활성 지갑 잔액 확인

```bash
mplx toolbox sol-balance
```

### 특정 지갑 잔액 확인

```bash
mplx toolbox sol-balance 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
```

## 출력

명령어는 SOL 잔액을 형식화된 출력으로 표시합니다:

```
--------------------------------
SOL Balance
--------------------------------
Address: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
Balance: 1.5 SOL
--------------------------------
```

## 참고사항

- 주소가 제공되지 않으면 명령어는 활성 지갑의 잔액을 확인합니다
- 잔액은 SOL로 표시됩니다 (lamports가 아님)
- 명령어는 활성 RPC 엔드포인트를 사용합니다
- 거래에 충분한 SOL이 있는지 확인하세요
- 잔액은 실시간이며 블록체인의 현재 상태를 반영합니다

## 관련 명령어

- [SOL 전송](/ko/dev-tools/cli/toolbox/sol-transfer) - 주소 간 SOL 전송
- [토큰 전송](/ko/dev-tools/cli/toolbox/token-transfer) - 토큰 전송
- [에어드롭](/ko/dev-tools/cli/toolbox/sol-airdrop) - SOL 에어드롭 요청 (devnet만)