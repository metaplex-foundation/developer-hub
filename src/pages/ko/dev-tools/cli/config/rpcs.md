---
title: RPC
metaTitle: RPC | Metaplex CLI
description: 구성에서 RPC 엔드포인트 관리
---

구성에서 RPC 엔드포인트를 관리합니다. 다양한 네트워크에 대해 RPC를 추가, 나열, 제거 및 활성화할 수 있습니다.

## 기본 사용법

```bash
# 새 RPC 엔드포인트 추가
mplx config rpcs add <name> <endpoint>

# 모든 RPC 엔드포인트 나열
mplx config rpcs list

# RPC 엔드포인트 제거
mplx config rpcs remove <name>

# 활성 RPC 엔드포인트 설정
mplx config rpcs set <name>
```

## 명령어

### RPC 추가

구성에 새 RPC 엔드포인트를 추가합니다.

```bash
mplx config rpcs add <name> <endpoint>
```

#### 인수

| 인수 | 설명 |
|----------|-------------|
| `name` | RPC 엔드포인트의 고유한 이름 (예: 'mainnet', 'devnet') |
| `endpoint` | RPC 엔드포인트 URL |

#### 예시

```bash
mplx config rpcs add mainnet https://api.mainnet-beta.solana.com
```

### RPC 나열

구성된 모든 RPC 엔드포인트를 표시합니다.

```bash
mplx config rpcs list
```

#### 출력

```
--------------------------------
RPC Endpoints
--------------------------------
Name: mainnet
Endpoint: https://api.mainnet-beta.solana.com
Active: true

Name: devnet
Endpoint: https://api.devnet.solana.com
Active: false
--------------------------------
```

### RPC 제거

구성에서 RPC 엔드포인트를 제거합니다.

```bash
mplx config rpcs remove <name>
```

#### 인수

| 인수 | 설명 |
|----------|-------------|
| `name` | 제거할 RPC 엔드포인트의 이름 |

#### 예시

```bash
mplx config rpcs remove devnet
```

### 활성 RPC 설정

구성에서 활성 RPC 엔드포인트를 설정합니다.

```bash
mplx config rpcs set <name>
```

#### 인수

| 인수 | 설명 |
|----------|-------------|
| `name` | 활성으로 설정할 RPC 엔드포인트의 이름 |

#### 예시

```bash
mplx config rpcs set mainnet
```

## 구성 파일

RPC는 `~/.mplx/config.json`의 구성 파일에 저장됩니다:

```json
{
  "rpcs": {
    "mainnet": {
      "endpoint": "https://api.mainnet-beta.solana.com",
      "active": true
    },
    "devnet": {
      "endpoint": "https://api.devnet.solana.com",
      "active": false
    }
  }
}
```

## 참고사항

- RPC 이름은 대소문자를 구분합니다
- 한 번에 하나의 RPC만 활성화할 수 있습니다
- 활성 RPC는 모든 네트워크 작업에 사용됩니다
- 다양한 네트워크에 대해 여러 RPC를 추가할 수 있습니다
- 활성 RPC를 제거하면 사용 가능한 경우 다른 RPC가 자동으로 활성으로 설정됩니다

## 관련 명령어

- [지갑](/ko/dev-tools/cli/config/wallets) - 지갑 구성 관리
- [탐색기](/ko/dev-tools/cli/config/explorer) - 선호하는 블록체인 탐색기 설정
