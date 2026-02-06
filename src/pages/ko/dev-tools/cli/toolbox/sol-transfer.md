---
title: SOL 전송
metaTitle: SOL 전송 | Metaplex CLI
description: 지정된 주소로 SOL 전송
---

`mplx toolbox sol transfer` 명령어를 사용하면 현재 지갑에서 모든 Solana 주소로 SOL을 전송할 수 있습니다.

## 기본 사용법

```bash
mplx toolbox sol transfer <amount> <address>
```

## 인수

- `amount`: 전송할 SOL 양 (필수)
- `address`: SOL을 전송할 Solana 주소 (필수)

## 예시

### 주소로 1 SOL 전송

```bash
mplx toolbox sol transfer 1 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa
```

## 출력

전송이 성공하면 명령어가 다음을 표시합니다:

```
--------------------------------
    Transferred <amount> SOL to <address>
    Signature: <transactionSignature>
--------------------------------
```

## 참고사항

- 전송 양은 SOL로 지정됩니다 (lamports가 아님)
- 대상 주소는 유효한 Solana 공개 키여야 합니다
- 명령어는 Solana 네트워크(mainnet/devnet/testnet)에 대한 연결이 필요합니다
- 전송을 위해 지갑에 충분한 SOL이 있는지 확인하세요
- 거래 서명은 확인 목적으로 제공됩니다
- 전송은 블록체인에서 확인되면 되돌릴 수 없습니다
