---
title: Integration API
metaTitle: Genesis - Integration API | 런칭 데이터 | Metaplex
description: HTTP REST 엔드포인트와 온체인 SDK 메서드를 통해 Genesis 런칭 데이터에 접근하세요. 인증이 필요 없는 공개 API입니다.
created: '01-15-2025'
updated: '02-26-2026'
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

Genesis Integration API를 사용하면 애그리게이터와 애플리케이션이 Genesis 토큰 런칭의 런칭 데이터를 조회할 수 있습니다. REST 엔드포인트를 통해 메타데이터에 접근하거나 SDK로 실시간 온체인 상태를 가져올 수 있습니다. {% .lead %}

## Summary

Genesis 통합 API는 Solana의 Genesis 토큰 런치 데이터에 대한 읽기 전용 액세스를 제공합니다.

- Genesis 주소, 토큰 민트 또는 모든 활성 런치를 검색 가능
- `https://api.metaplex.com/v1`의 공개 REST API — 인증 불필요
- 런치 메타데이터, 토큰 정보, 웹사이트, 소셜 링크 반환
- `network` 쿼리 파라미터를 통해 Solana 메인넷(기본값) 및 데브넷 지원

## 기본 URL

```
https://api.metaplex.com/v1
```

## 네트워크 선택

기본적으로 API는 Solana 메인넷의 데이터를 반환합니다. 데브넷 런칭을 조회하려면 `network` 쿼리 파라미터를 추가하세요:

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

인증이 필요하지 않습니다. API는 속도 제한이 있는 공개 API입니다.

## 사용 가능한 엔드포인트

| 메서드 | 엔드포인트 | 설명 |
|--------|------------|------|
| `GET` | [`/launches/{genesis_pubkey}`](/smart-contracts/genesis/integration-apis/get-launch) | Genesis 주소로 런칭 데이터 조회 |
| `GET` | [`/tokens/{mint}`](/smart-contracts/genesis/integration-apis/get-launches-by-token) | 토큰 민트의 모든 런칭 조회 |
| `GET` | [`/launches`](/smart-contracts/genesis/integration-apis/list-launches) | 필터를 사용하여 런칭 목록 조회 |
| `GET` | [`/launches?spotlight=true`](/smart-contracts/genesis/integration-apis/get-spotlight) | 추천 스포트라이트 런칭 조회 |
| `POST` | [`/launches/create`](/smart-contracts/genesis/integration-apis/create-launch) | 새 런칭을 위한 온체인 트랜잭션 빌드 |
| `POST` | [`/launches/register`](/smart-contracts/genesis/integration-apis/register) | 확인된 런칭을 목록에 등록 |
| `CHAIN` | [`fetchBucketState`](/smart-contracts/genesis/integration-apis/fetch-bucket-state) | 온체인에서 버킷 상태 가져오기 |
| `CHAIN` | [`fetchDepositState`](/smart-contracts/genesis/integration-apis/fetch-deposit-state) | 온체인에서 예치 상태 가져오기 |

{% callout type="note" %}
`POST` 엔드포인트(`/launches/create` 및 `/launches/register`)는 새 토큰 런칭을 생성하기 위해 함께 사용됩니다. 대부분의 사용 사례에서는 두 엔드포인트를 래핑하는 [SDK API 클라이언트](/smart-contracts/genesis/sdk/api-client)가 더 간단한 인터페이스를 제공합니다.
{% /callout %}

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

## Notes

- API에는 속도 제한이 있습니다. `429` 응답을 받으면 요청 빈도를 줄이세요.
- 모든 날짜 필드(`startTime`, `endTime`, `graduatedAt`, `lastActivityAt`)는 ISO 8601 문자열로 반환됩니다.
- 기본 네트워크는 `solana-mainnet`입니다. 데브넷 데이터는 `?network=solana-devnet`으로 이용 가능합니다.
- `POST` 엔드포인트는 대부분의 사용 사례에서 [SDK API 클라이언트](/smart-contracts/genesis/sdk/api-client)를 사용하세요.

## 공유 타입

### TypeScript

```ts
interface Launch {
  launchPage: string;
  mechanic: string;
  genesisAddress: string;
  spotlight: boolean;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'live' | 'graduated' | 'ended';
  heroUrl: string | null;
  graduatedAt: string | null;
  lastActivityAt: string;
  type: 'project' | 'memecoin' | 'custom';
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
    pub mechanic: String,
    pub genesis_address: String,
    pub spotlight: bool,
    pub start_time: String,
    pub end_time: String,
    pub status: String,
    pub hero_url: Option<String>,
    pub graduated_at: Option<String>,
    pub last_activity_at: String,
    #[serde(rename = "type")]
    pub launch_type: String,
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
reqwest = { version = "0.12", features = ["json"] }
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
```
{% /callout %}
