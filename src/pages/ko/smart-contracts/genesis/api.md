---
title: API
metaTitle: Genesis - API
description: genesis 주소 또는 토큰 민트로 Genesis 런칭 데이터를 조회하는 공개 API입니다.
---

Genesis API를 통해 어그리게이터와 애플리케이션은 Genesis 토큰 런칭의 데이터를 조회할 수 있습니다. 이 엔드포인트를 사용하여 애플리케이션에 런칭 정보, 토큰 메타데이터, 소셜 링크를 표시하세요.

{% callout type="note" %}
API는 레이트 리밋이 있는 공개 API입니다. 인증이 필요하지 않습니다.
{% /callout %}

## 기본 URL

```
https://api.metaplex.com/v1
```

## 사용 사례

- **`/launches/{genesis_pubkey}`** - 온체인 이벤트나 트랜잭션 로그에서 얻은 genesis 주소가 있을 때 사용합니다.
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
      "description": "예시 생태계를 위한 커뮤니티 주도 토큰입니다."
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

토큰의 모든 런칭을 반환합니다. `launches`가 배열인 것을 제외하면 응답은 동일합니다.

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
      "description": "예시 생태계를 위한 커뮤니티 주도 토큰입니다."
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
genesis pubkey를 찾으려면 인덱싱이나 `getProgramAccounts`가 필요합니다. 토큰 민트만 있다면 `/tokens` 엔드포인트를 대신 사용하세요.
{% /callout %}

## 에러

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
| `400` | 잘못된 요청 - 유효하지 않은 파라미터 |
| `404` | 런칭 또는 토큰을 찾을 수 없음 |
| `429` | 레이트 리밋 초과 |
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
