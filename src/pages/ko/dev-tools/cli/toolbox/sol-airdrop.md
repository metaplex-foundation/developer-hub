---
title: SOL 에어드롭
description: 지정된 주소로 SOL 에어드롭
---

`mplx toolbox sol airdrop` 명령어를 사용하면 지정된 주소로 SOL을 에어드롭할 수 있습니다. 이는 테스트 및 개발 목적으로 유용합니다.

## 기본 사용법

### 현재 지갑으로 에어드롭
```bash
mplx toolbox sol airdrop <amount>
```

### 특정 주소로 에어드롭
```bash
mplx toolbox sol airdrop <amount> <address>
```

## 인수

- `amount`: 에어드롭할 SOL 양 (필수)
- `address`: SOL을 에어드롭할 주소 (선택적, 기본값은 현재 지갑)

## 예시

### 현재 지갑으로 1 SOL 에어드롭
```bash
mplx toolbox sol airdrop 1
```

### 특정 주소로 2 SOL 에어드롭
```bash
mplx toolbox sol airdrop 2 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa
```

## 출력

에어드롭이 성공하면 명령어가 다음을 표시합니다:
```
--------------------------------
    Airdropped <amount> SOL to <address>
--------------------------------
```

## 참고사항

- 이 명령어는 주로 테스트 및 개발 목적으로 사용됩니다
- 에어드롭 양은 SOL로 지정됩니다 (lamports가 아님)
- 주소가 제공되지 않으면 SOL은 현재 지갑 주소로 에어드롭됩니다
- 명령어는 개발 네트워크(devnet/testnet) 연결이 필요합니다
- 에어드롭 작업을 위해 지갑에 충분한 SOL이 있는지 확인하세요