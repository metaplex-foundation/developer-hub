---
title: Metaplex API
metaTitle: Metaplex API - 공개 REST API 레퍼런스 | Metaplex
description: api.metaplex.com의 Metaplex 공개 REST API — Genesis 런칭 데이터, 런칭 생성, 에이전트 레지스트리, 에이전트 지갑 트랜잭션을 제공합니다. 인증이 필요 없습니다.
created: '01-15-2025'
updated: '08-01-2026'
keywords:
  - Metaplex API
  - Genesis API
  - agent registry API
  - launch data
  - token queries
  - REST API
about:
  - API integration
  - Data aggregation
  - Launch information
  - Agent registry
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---

Metaplex API는 `api.metaplex.com`의 공개 REST API입니다. Genesis 런칭 데이터를 제공하고, 런칭 생성 트랜잭션을 빌드하며, Metaplex Agent Registry를 노출합니다 — 에이전트 탐색, A2A AgentCard 제공, 에이전트 지갑 트랜잭션 빌드가 가능합니다. {% .lead %}

## Summary

Metaplex API는 Genesis 런칭 데이터, 런칭 생성, 에이전트 레지스트리에 대한 공개 HTTP 액세스를 제공합니다 — SDK나 인증이 필요 없습니다.

- Genesis 주소, 토큰 민트로 런칭을 조회하거나 모든 활성 런칭 탐색
- 새 Genesis 런칭 생성 및 등록
- 에이전트 레지스트리 탐색 및 검색, 에이전트별 A2A AgentCard 조회
- 에이전트 민팅, 자금 지원(fund), 출금(withdraw) 트랜잭션 빌드
- `https://api.metaplex.com/v1`의 공개 REST API — 인증 불필요
- `network` 쿼리 파라미터를 통해 Solana 메인넷(기본값) 및 데브넷 지원
- 기계 판독 가능한 OpenAPI 3.1 명세: [YAML](https://api.metaplex.com/v1/openapi.yaml)(표준) / [JSON](https://api.metaplex.com/v1/openapi.json), [RFC 9727 API 카탈로그](https://api.metaplex.com/.well-known/api-catalog)를 통해 검색 가능

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

## 런칭 엔드포인트

| 메서드 | 엔드포인트 | 설명 |
|--------|----------|-------------|
| `GET` | [`/launches/{genesis_pubkey}`](/ko/api/get-launch) | Genesis 주소로 런칭 데이터 조회 |
| `GET` | [`/tokens/{mint}`](/ko/api/get-launches-by-token) | 토큰 민트의 모든 런칭 조회 |
| `GET` | [`/launches`](/ko/api/list-launches) | 필터를 사용하여 런칭 목록 조회 |
| `GET` | [`/launches?spotlight=true`](/ko/api/get-spotlight) | 추천 스포트라이트 런칭 조회 |
| `POST` | [`/launches/create`](/ko/api/create-launch) | 새 런칭을 위한 온체인 트랜잭션 빌드 |
| `POST` | [`/launches/register`](/ko/api/register) | 확인된 런칭을 목록에 등록 |
| `POST` | [`/twitter/verify`](/ko/api/verify-twitter) | 런칭 등록을 위한 Twitter 계정 소유권 인증 |
| `POST` | [`/creator-rewards/claim`](/ko/api/claim-creator-rewards) | 크리에이터 보상 청구 트랜잭션 빌드 |

{% callout type="note" %}
`POST` 엔드포인트(`/launches/create` 및 `/launches/register`)는 새 토큰 런칭을 생성하기 위해 함께 사용됩니다. 대부분의 사용 사례에서는 두 엔드포인트를 래핑하는 [SDK API 클라이언트](/smart-contracts/genesis/sdk/api-client)가 더 간단한 인터페이스를 제공합니다. 실시간 온체인 런칭 상태는 SDK 체인 메서드 [`fetchBucketState`](/smart-contracts/genesis/integration-apis/fetch-bucket-state) 및 [`fetchDepositState`](/smart-contracts/genesis/integration-apis/fetch-deposit-state)로 직접 읽을 수 있습니다.
{% /callout %}

## 에이전트 엔드포인트

| 메서드 | 엔드포인트 | 설명 |
|--------|----------|-------------|
| `GET` | [`/agents`](/ko/api/list-agents) | 등록된 에이전트 목록 및 검색 (페이지네이션) |
| `GET` | [`/agents/{address}`](/ko/api/get-agent) | 토큰 및 메타데이터를 포함한 단일 에이전트 조회 |
| `GET` | [`/agents/{address}/agent-card.json`](/ko/api/get-agent-card) | 호스팅된 A2A AgentCard 조회 |
| `POST` | [`/agents/mint`](/ko/api/mint-agent) | 에이전트 민팅 + 등록 트랜잭션 빌드 |
| `POST` | [`/agents/{address}/fund`](/ko/api/fund-agent) | 에이전트 지갑으로의 SOL 전송 빌드 |
| `POST` | [`/agents/{address}/withdraw`](/ko/api/withdraw-agent) | 에이전트 지갑에서 출금 빌드 (소유자 전용) |

단계별 안내와 함께 에이전트를 민팅하려면 [에이전트 민팅하기](/agents/mint-agent)를 참조하세요.

## 트랜잭션 빌드 엔드포인트

트랜잭션을 빌드하는 `POST` 엔드포인트는 사용자 키를 보관하지 않으며 트랜잭션을 제출하지도 않습니다. 각 엔드포인트는 base64로 직렬화된 하나 이상의 트랜잭션과 빌드에 사용된 블록해시를 반환합니다. 애플리케이션이 이를 역직렬화하고, 사용자의 지갑으로 서명한 후 네트워크에 제출합니다.

## 오류 코드

| 코드 | 설명 |
| --- | --- |
| `400` | 잘못된 요청 - 유효하지 않은 파라미터 |
| `403` | 해당 작업에 대한 권한 없음 (예: 소유하지 않은 에이전트에서 출금 시도) |
| `404` | 런칭, 토큰 또는 에이전트를 찾을 수 없음 |
| `429` | 속도 제한 초과 |
| `500` | 내부 서버 오류 |

## 응답 엔벨로프

API의 발전 과정을 반영하여 두 가지 엔벨로프 규약이 사용됩니다:

**런칭 읽기 엔드포인트** (`/launches*`, `/tokens/*`, `/creator-rewards/claim`)는 결과를 `data`로, 오류를 `error.message`로 래핑합니다:

```json
{ "data": { "…": "…" } }
```

```json
{ "error": { "message": "Launch not found" } }
```

**에이전트 엔드포인트, 런칭 쓰기 엔드포인트, `/twitter/verify`**는 `success` 판별자(discriminator)를 사용합니다:

```json
{ "success": true, "…": "…" }
```

```json
{ "success": false, "error": "Agent not found" }
```

예외는 [`/agents/{address}/agent-card.json`](/ko/api/get-agent-card)입니다. A2A 클라이언트가 직접 사용할 수 있도록 엔벨로프 없이 원시 AgentCard JSON을 반환합니다. 각 엔드포인트 페이지와 [OpenAPI 명세](https://api.metaplex.com/v1/openapi.json)에 정확한 형태가 문서화되어 있습니다.

## 기계 판독 가능한 명세

전체 API 계약은 OpenAPI 3.1 문서로 게시되며, API의 요청 유효성 검사기(request validator)로부터 직접 생성되므로 구현과 어긋날 수 없습니다:

| 형식 | URL |
|--------|-----|
| YAML (표준) | `https://api.metaplex.com/v1/openapi.yaml` |
| JSON | `https://api.metaplex.com/v1/openapi.json` |
| 현재 버전 별칭 | `https://api.metaplex.com/openapi.json` / `openapi.yaml` |
| RFC 9727 API 카탈로그 | `https://api.metaplex.com/.well-known/api-catalog` |

명세를 Postman, Swagger UI, 코드 생성기 또는 에이전트 프레임워크로 가져오면 모든 엔드포인트에 대한 타입이 지정된 클라이언트와 호출 가능한 도구를 얻을 수 있습니다.

## Notes

- API에는 속도 제한이 있습니다. `429` 응답을 받으면 요청 빈도를 줄이세요.
- 모든 날짜 필드(`startTime`, `endTime`, `graduatedAt`, `lastActivityAt`)는 ISO 8601 문자열로 반환됩니다.
- 기본 네트워크는 `solana-mainnet`입니다. 데브넷 데이터는 `?network=solana-devnet`으로 이용 가능합니다.
- `POST` 엔드포인트의 경우 [SDK API 클라이언트](/smart-contracts/genesis/sdk/api-client)를 사용하는 것이 권장됩니다. `/launches/create`와 `/launches/register`를 래핑합니다.

## 공유 타입 {% #shared-types %}

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
  type: 'launchpool' | 'presale';
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

## Glossary

| 용어 | 정의 |
|------|------------|
| **Genesis Address** | 특정 런칭 캠페인을 고유하게 식별하는 PDA (Program Derived Address) |
| **Base Token** | 민트 주소로 식별되는 런칭 대상 토큰 |
| **Launch Page** | 사용자가 런칭에 참여할 수 있는 URL |
| **Mechanic** | 런칭에 사용되는 할당 메커니즘 (예: `launchpoolV2`, `presaleV2`, `auction`) |
| **Launch Type** | 런칭의 기본 메커니즘: `launchpool` 또는 `presale` |
| **Spotlight** | 플랫폼에서 큐레이팅한 주요 런칭을 나타내는 플래그 |
| **Status** | 런칭의 현재 상태: `upcoming`, `live`, `graduated`, `ended` |
| **Socials** | 토큰과 관련된 소셜 미디어 링크 (X/Twitter, Telegram, Discord) |
| **LaunchData** | `launch`, `baseToken`, `website`, `socials`를 포함하는 응답 래퍼 |
| **TokenData** | 토큰 쿼리용 응답 래퍼. `launches` 배열과 `baseToken`, `website`, `socials` 포함 |
