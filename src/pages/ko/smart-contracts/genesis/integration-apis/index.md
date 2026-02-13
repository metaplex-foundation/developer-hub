---
title: Integration APIs
metaTitle: Genesis - Integration APIs | 런칭 데이터 | Metaplex
description: HTTP REST 엔드포인트와 온체인 SDK 메서드를 통해 Genesis 런칭 데이터에 접근합니다. 인증 불필요 공개 API.
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - Genesis API
  - integration API
  - launch data
  - token queries
  - on-chain state
about:
  - API integration
  - Data aggregation
  - Launch information
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---

Genesis Integration APIs를 사용하면 애그리게이터와 애플리케이션이 Genesis 토큰 런칭에서 런칭 데이터를 조회할 수 있습니다. REST 엔드포인트에서 메타데이터에 접근하거나 SDK로 실시간 온체인 상태를 가져올 수 있습니다. {% .lead %}

## 기본 URL

```
https://api.metaplex.com/v1
```

## 네트워크 선택

기본적으로 API는 솔라나 메인넷 데이터를 반환합니다. 데브넷 런칭을 조회하려면 `network` 쿼리 파라미터를 추가하세요:

```
?network=solana-devnet
```

**예시:**

```bash
# Mainnet (default)
curl https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN

# Devnet
curl "https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN?network=solana-devnet"
```

## 인증

인증은 필요하지 않습니다. API는 속도 제한이 있는 공개 API입니다.

{% callout type="note" %}
생성 및 등록 엔드포인트를 래핑하는 상위 레벨 SDK 인터페이스는 [API 클라이언트](/smart-contracts/genesis/sdk/api-client)를 참조하세요.
{% /callout %}

## 사용 가능한 엔드포인트

| 메소드 | 엔드포인트 | 설명 |
|--------|----------|-------------|
| `GET` | [`/launches/{genesis_pubkey}`](/smart-contracts/genesis/integration-apis/get-launch) | genesis 주소로 런칭 데이터 조회 |
| `GET` | [`/tokens/{mint}`](/smart-contracts/genesis/integration-apis/get-launches-by-token) | 토큰 민트의 모든 런칭 조회 |
| `GET` | [`/listings`](/smart-contracts/genesis/integration-apis/get-listings) | 활성 및 예정된 런칭 리스팅 조회 |
| `GET` | [`/spotlight`](/smart-contracts/genesis/integration-apis/get-spotlight) | 주요 스포트라이트 런칭 조회 |
| `POST` | [`/launches/create`](/smart-contracts/genesis/integration-apis/create-launch) | 새로운 런칭 생성 (미서명 트랜잭션 반환) |
| `POST` | [`/launches/register`](/smart-contracts/genesis/integration-apis/register) | 확인된 런칭 등록 |
| `CHAIN` | [`fetchBucketState`](/smart-contracts/genesis/integration-apis/fetch-bucket-state) | 온체인에서 버킷 상태 조회 |
| `CHAIN` | [`fetchDepositState`](/smart-contracts/genesis/integration-apis/fetch-deposit-state) | 온체인에서 예치 상태 조회 |

## 오류 코드

| 코드 | 설명 |
| --- | --- |
| `400` | 잘못된 요청 - 유효하지 않은 파라미터 |
| `404` | 런칭 또는 토큰을 찾을 수 없음 |
| `429` | 속도 제한 초과 |
| `500` | 내부 서버 오류 |

오류 응답 형식:

```json
{
  "error": {
    "message": "Launch not found"
  }
}
```

## 공통 타입

### TypeScript

```ts
interface Launch {
  launchPage: string;
  type: string;
  genesisAddress: string;
}

interface BaseToken {
  address: string;
  name: string;
  symbol: string;
  image: string;
  description: string;
}

interface Socials {
  x?: string;
  telegram?: string;
  discord?: string;
}

interface ErrorResponse {
  error: {
    message: string;
  };
}
```

### Rust

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Launch {
    pub launch_page: String,
    #[serde(rename = "type")]
    pub launch_type: String,
    pub genesis_address: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BaseToken {
    pub address: String,
    pub name: String,
    pub symbol: String,
    pub image: String,
    pub description: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Socials {
    pub x: Option<String>,
    pub telegram: Option<String>,
    pub discord: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiError {
    pub message: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ErrorResponse {
    pub error: ApiError,
}
```

{% callout type="note" %}
`Cargo.toml`에 다음 의존성을 추가하세요:
```toml
[dependencies]
reqwest = { version = "0.11", features = ["json"] }
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
```
{% /callout %}
