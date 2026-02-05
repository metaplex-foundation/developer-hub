---
title: API
metaTitle: Genesis - API | Launch Data API | Metaplex
description: Genesis 주소 또는 토큰 민트로 Genesis 런칭 데이터를 조회하기 위한 공개 API. 인증 불필요.
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - Genesis API
  - launch data API
  - token metadata API
  - aggregator API
  - REST API
about:
  - API reference
  - Data aggregation
  - Launch queries
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
faqs:
  - q: 인증이 필요한가요?
    a: 아니요. Genesis API는 요청 제한이 있는 공개 API입니다. API 키나 인증이 필요하지 않습니다.
  - q: 토큰 민트만 있으면 어떤 엔드포인트를 사용해야 하나요?
    a: /tokens/{mint}를 사용하여 토큰의 모든 런칭을 가져오세요. genesis 주소가 있으면 /launches/{genesis_pubkey}를 사용하세요.
  - q: 요청 제한은 어떻게 되나요?
    a: 남용 방지를 위해 요청 제한이 적용됩니다. 429 응답을 받으면 요청 빈도를 줄이세요.
  - q: 토큰이 여러 런칭을 가질 수 있나요?
    a: 예. /tokens 엔드포인트는 토큰이 여러 캠페인을 가질 수 있으므로 런칭 배열을 반환합니다.
---

Genesis API를 사용하면 애그리게이터와 애플리케이션이 Genesis 토큰 런칭에서 런칭 데이터를 조회할 수 있습니다. 이 엔드포인트를 사용하여 애플리케이션에 런칭 정보, 토큰 메타데이터 및 소셜 링크를 표시하세요. {% .lead %}

{% callout title="배우게 될 내용" %}
이 레퍼런스에서 다루는 내용:
- 사용 가능한 엔드포인트와 사용 사례
- 예제가 포함된 요청/응답 형식
- TypeScript 및 Rust 타입 정의
- 오류 처리
{% /callout %}

## 요약

Genesis API는 런칭 데이터에 대한 읽기 전용 접근을 제공합니다. genesis 주소 또는 토큰 민트로 조회하세요.

- 요청 제한이 있는 공개 API (인증 불필요)
- 런칭 정보, 토큰 메타데이터 및 소셜 링크 반환
- TypeScript 및 Rust 타입 제공
- 표준 REST 오류 코드

{% callout type="note" %}
이 API는 요청 제한이 있는 공개 API입니다. 인증이 필요하지 않습니다.
{% /callout %}

## 기본 URL

```
https://api.metaplex.com/v1
```

## 사용 사례

- **`/launches/{genesis_pubkey}`** - 온체인 이벤트나 트랜잭션 로그에서 genesis 주소를 가지고 있을 때 사용합니다.
- **`/tokens/{mint}`** - 토큰 민트 주소만 알고 있을 때 사용합니다. 해당 토큰과 관련된 모든 런칭을 반환합니다 (토큰은 여러 런칭 캠페인을 가질 수 있습니다).

## 엔드포인트

### Genesis 주소로 런칭 조회

```
GET /launches/{genesis_pubkey}
```

**요청 예시:**

```
GET https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN
```

**응답:**

```json
{
  "data": {
    "launch": {
      "launchPage": "https://example.com/launch/mytoken",
      "type": "launchpool",
      "genesisAddress": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
    },
    "baseToken": {
      "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "name": "My Token",
      "symbol": "MTK",
      "image": "https://example.com/token-image.png",
      "description": "A community-driven token for the example ecosystem."
    },
    "website": "https://example.com",
    "socials": {
      "x": "https://x.com/mytoken",
      "telegram": "https://t.me/mytoken",
      "discord": "https://discord.gg/mytoken"
    }
  }
}
```

### 토큰 민트로 런칭 조회

```
GET /tokens/{mint}
```

토큰의 모든 런칭을 반환합니다. 응답은 `launches`가 배열이라는 점을 제외하면 동일합니다.

**응답:**

```json
{
  "data": {
    "launches": [
      {
        "launchPage": "https://example.com/launch/mytoken",
        "type": "launchpool",
        "genesisAddress": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
      }
    ],
    "baseToken": {
      "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "name": "My Token",
      "symbol": "MTK",
      "image": "https://example.com/token-image.png",
      "description": "A community-driven token for the example ecosystem."
    },
    "website": "https://example.com",
    "socials": {
      "x": "https://x.com/mytoken",
      "telegram": "https://t.me/mytoken",
      "discord": "https://discord.gg/mytoken"
    }
  }
}
```

{% callout type="note" %}
genesis 공개키를 찾으려면 인덱싱 또는 `getProgramAccounts`가 필요합니다. 토큰 민트만 가지고 있다면 `/tokens` 엔드포인트를 대신 사용하세요.
{% /callout %}

## 오류

```json
{
  "error": {
    "code": 404,
    "message": "Launch not found"
  }
}
```

| 코드 | 설명 |
| --- | --- |
| `400` | 잘못된 요청 - 유효하지 않은 매개변수 |
| `404` | 런칭 또는 토큰을 찾을 수 없음 |
| `429` | 요청 제한 초과 |
| `500` | 내부 서버 오류 |

## TypeScript 타입

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
  x: string;
  telegram: string;
  discord: string;
}

interface LaunchResponse {
  data: {
    launch: Launch;
    baseToken: BaseToken;
    website: string;
    socials: Socials;
  };
}

interface TokenResponse {
  data: {
    launches: Launch[];
    baseToken: BaseToken;
    website: string;
    socials: Socials;
  };
}

interface ErrorResponse {
  error: {
    code: number;
    message: string;
  };
}
```

**예시:**

```ts
const response = await fetch(
  "https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
);
const { data }: LaunchResponse = await response.json();
console.log(data.baseToken.name); // "My Token"
```

## Rust 타입

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
    pub x: String,
    pub telegram: String,
    pub discord: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LaunchData {
    pub launch: Launch,
    pub base_token: BaseToken,
    pub website: String,
    pub socials: Socials,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TokenData {
    pub launches: Vec<Launch>,
    pub base_token: BaseToken,
    pub website: String,
    pub socials: Socials,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LaunchResponse {
    pub data: LaunchData,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TokenResponse {
    pub data: TokenData,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiError {
    pub code: u16,
    pub message: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ErrorResponse {
    pub error: ApiError,
}
```

**예시:**

```rust
let response: LaunchResponse = reqwest::get(
    "https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
)
.await?
.json()
.await?;

println!("{}", response.data.base_token.name); // "My Token"
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

## FAQ

### 인증이 필요한가요?
아니요. Genesis API는 요청 제한이 있는 공개 API입니다. API 키나 인증이 필요하지 않습니다.

### 토큰 민트만 있으면 어떤 엔드포인트를 사용해야 하나요?
`/tokens/{mint}`를 사용하여 토큰의 모든 런칭을 가져오세요. genesis 주소가 있으면 `/launches/{genesis_pubkey}`를 사용하세요.

### 요청 제한은 어떻게 되나요?
남용 방지를 위해 요청 제한이 적용됩니다. 429 응답을 받으면 요청 빈도를 줄이세요.

### 토큰이 여러 런칭을 가질 수 있나요?
예. `/tokens` 엔드포인트는 토큰이 여러 캠페인을 가질 수 있으므로 (다른 `genesisIndex` 값을 사용하여) 런칭 배열을 반환합니다.

## 용어집

| 용어 | 정의 |
|------|------|
| **Genesis Address** | 특정 런칭 캠페인을 식별하는 PDA |
| **Base Token** | 런칭되는 토큰 |
| **Launch Page** | 사용자가 런칭에 참여할 수 있는 URL |
| **Launch Type** | 사용된 메커니즘 (launchpool, presale, auction) |
| **Socials** | 토큰과 관련된 소셜 미디어 링크 |

## 다음 단계

- [JavaScript SDK](/smart-contracts/genesis/sdk/javascript) - Genesis에 대한 프로그래밍 방식 접근
- [Aggregation API](/smart-contracts/genesis/aggregation) - 추가 API 세부사항 및 온체인 조회
- [Getting Started](/smart-contracts/genesis/getting-started) - 자신의 토큰 런칭하기
