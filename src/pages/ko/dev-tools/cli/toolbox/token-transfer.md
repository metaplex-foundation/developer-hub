---
title: 토큰 전송
metaTitle: 토큰 전송 | Metaplex CLI
description: 대상 주소로 토큰 전송
---

지갑에서 대상 주소로 토큰을 전송합니다. 대상 지갑에 토큰 계정이 없으면 자동으로 생성됩니다.

## 기본 사용법

```bash
mplx toolbox token transfer <mintAddress> <amount> <destination>
```

## 인수

| 인수 | 설명 |
|----------|-------------|
| `mintAddress` | 전송할 토큰의 발행 주소 |
| `amount` | 베이시스 포인트로 전송할 토큰 양 |
| `destination` | 대상 지갑 주소 |

## 예시

### 대상 주소로 100 토큰 전송

```bash
mplx toolbox token transfer 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU 10000000000 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
```

## 출력

명령어는 토큰을 전송하는 동안 진행률 스피너를 표시하고 성공 시 거래 서명을 보여줍니다:

```
--------------------------------
Token Transfer         
--------------------------------
⠋ Transferring tokens...
✔ Tokens Transferred Successfully!
--------------------------------
'Tokens Transferred Successfully!'
Signature: 2xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
--------------------------------
```

## 참고사항

- 명령어는 대상 주소에 토큰 계정이 없으면 자동으로 생성합니다
- 양은 베이시스 포인트로 지정됩니다 (토큰 1개 = 베이시스 포인트 1,000,000,000개)
- 새 토큰 계정을 생성하는 경우 임대 면제를 위해 SOL이 필요합니다
- 전송하기 전에 지갑에 충분한 토큰이 있는지 확인하세요

## 오류 처리

전송이 실패하면 명령어가 오류 메시지를 표시하고 예외를 발생시킵니다. 일반적인 오류는 다음과 같습니다:

- 토큰 잔액 부족
- 유효하지 않은 발행 주소
- 유효하지 않은 대상 주소
- 네트워크 오류

## 관련 명령어

- [토큰 생성](/ko/dev-tools/cli/toolbox/token-create) - 새 토큰 생성
- [잔액 확인](/ko/dev-tools/cli/toolbox/sol-balance) - 토큰 잔액 확인
- [SOL 전송](/ko/dev-tools/cli/toolbox/sol-transfer) - 주소 간 SOL 전송