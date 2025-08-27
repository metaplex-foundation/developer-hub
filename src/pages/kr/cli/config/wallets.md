---
title: 지갑
description: 지갑 구성 관리
---

CLI에서 지갑 구성을 관리합니다. 다양한 용도로 지갑을 추가, 나열, 제거 및 활성화할 수 있습니다.

## 기본 사용법

```bash
# 새 지갑 생성
mplx config wallets new --name <name>

# 기존 지갑 추가
mplx config wallets add <name> <keypairPath>

# 모든 지갑 나열
mplx config wallets list

# 지갑 제거
mplx config wallets remove <name>

# 활성 지갑 설정
mplx config wallets set <name>
```

## 명령어

### 새 지갑

새 지갑을 생성하고 구성에 추가합니다.

```bash
mplx config wallets new --name <name>
```

#### 인수

| 인수 | 설명 |
|----------|-------------|
| `--name` | 지갑의 고유한 이름 |

#### 예시

```bash
mplx config wallets new --name dev1
```

### 지갑 추가

기존 지갑을 구성에 추가합니다.

```bash
mplx config wallets add <name> <keypairPath>
```

#### 인수

| 인수 | 설명 |
|----------|-------------|
| `name` | 지갑의 고유한 이름 |
| `keypairPath` | 키페어 파일 경로 |

#### 예시

```bash
mplx config wallets add dev1 ~/.config/solana/devnet/dev1.json
```

### 지갑 나열

구성된 모든 지갑을 표시합니다.

```bash
mplx config wallets list
```

#### 출력

```
--------------------------------
Wallets
--------------------------------
Name: dev1
Public Key: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
Active: true

Name: dev2
Public Key: 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
Active: false
--------------------------------
```

### 지갑 제거

구성에서 지갑을 제거합니다.

```bash
mplx config wallets remove <name>
```

#### 인수

| 인수 | 설명 |
|----------|-------------|
| `name` | 제거할 지갑의 이름 |

#### 예시

```bash
mplx config wallets remove dev2
```

### 활성 지갑 설정

구성에서 활성 지갑을 설정합니다.

```bash
mplx config wallets set <name>
```

#### 인수

| 인수 | 설명 |
|----------|-------------|
| `name` | 활성으로 설정할 지갑의 이름 |

#### 예시

```bash
mplx config wallets set dev1
```

## 구성 파일

지갑은 `~/.mplx/config.json`의 구성 파일에 저장됩니다:

```json
{
  "wallets": {
    "dev1": {
      "publicKey": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      "keypairPath": "~/.config/solana/devnet/dev1.json",
      "active": true
    },
    "dev2": {
      "publicKey": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
      "keypairPath": "~/.config/solana/devnet/dev2.json",
      "active": false
    }
  }
}
```

## 참고사항

- 지갑 이름은 대소문자를 구분합니다
- 한 번에 하나의 지갑만 활성화할 수 있습니다
- 활성 지갑은 모든 거래에 사용됩니다
- 다양한 용도로 여러 지갑을 추가할 수 있습니다
- 활성 지갑을 제거하면 사용 가능한 경우 다른 지갑이 자동으로 활성으로 설정됩니다
- 키페어 파일을 안전하게 보관하고 절대 공유하지 마세요

## 관련 명령어

- [RPC](/cli/config/rpcs) - RPC 엔드포인트 관리
- [탐색기](/cli/config/explorer) - 선호하는 블록체인 탐색기 설정