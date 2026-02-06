---
title: Get Launches by Token
metaTitle: Genesis - Get Launches by Token | REST API | Metaplex
description: 토큰 민트 주소와 관련된 모든 런칭을 조회합니다. 런칭 정보, 토큰 메타데이터, 소셜 링크를 반환합니다.
method: GET
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - Genesis API
  - token launches
  - token mint
  - launch data
about:
  - API endpoint
  - Token queries
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---

토큰 민트 주소와 관련된 모든 런칭을 조회합니다. 하나의 토큰에 여러 런칭 캠페인이 있을 수 있으므로 응답은 런칭 배열을 반환합니다. {% .lead %}

## 엔드포인트

```
GET /tokens/{mint}
```

## 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|-----------|------|----------|-------------|
| `mint` | `string` | Yes | 토큰 민트 공개 키 |
| `network` | `string` | No | 조회할 네트워크. 기본값: `solana-mainnet`. 데브넷의 경우 `solana-devnet`을 사용하세요. |

## 요청 예시

```bash
curl https://api.metaplex.com/v1/tokens/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
```

## 응답

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

## 응답 타입

### TypeScript

```ts
interface TokenResponse {
  data: {
    launches: Launch[];
    baseToken: BaseToken;
    website: string;
    socials: Socials;
  };
}
```

### Rust

```rust
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TokenData {
    pub launches: Vec<Launch>,
    pub base_token: BaseToken,
    pub website: String,
    pub socials: Socials,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TokenResponse {
    pub data: TokenData,
}
```

## 사용 예시

### TypeScript

```ts
const response = await fetch(
  "https://api.metaplex.com/v1/tokens/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
);
const { data }: TokenResponse = await response.json();
console.log(data.launches.length); // Number of launch campaigns
console.log(data.baseToken.symbol); // "MTK"
```

### Rust

```rust
let response: TokenResponse = reqwest::get(
    "https://api.metaplex.com/v1/tokens/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
)
.await?
.json()
.await?;

println!("{} launches found", response.data.launches.len());
```

{% callout type="note" %}
하나의 토큰은 다른 `genesisIndex` 값을 사용하여 여러 런칭을 가질 수 있습니다. 응답은 관련된 모든 런칭 캠페인을 반환합니다.
{% /callout %}
