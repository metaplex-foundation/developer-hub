---
title: Get Spotlight
metaTitle: Genesis - Get Spotlight | REST API | Metaplex
description: "Genesis의 주요 스포트라이트 런칭을 조회합니다. 플랫폼에서 큐레이팅된 런칭을 반환합니다."
method: GET
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - Genesis API
  - spotlight
  - featured launches
  - curated launches
about:
  - API endpoint
  - Featured launches
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---

플랫폼에서 큐레이팅된 주요 스포트라이트 런칭을 조회합니다. 애플리케이션에서 선택된 런칭을 하이라이트하는 데 사용합니다. {% .lead %}

{% callout type="warning" title="초안" %}
이 페이지는 예시입니다. 파라미터, 요청/응답 형식 및 동작은 실제 통합이 확정되면 변경될 수 있습니다.
{% /callout %}

## 엔드포인트

```
GET /spotlight
```

## 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|-----------|------|----------|-------------|
| `network` | `string` | 아니요 | Network to query. Default: `solana-mainnet`. Use `solana-devnet` for devnet. |
| `limit` | `number` | 아니요 | Number of results to return. Default: `5`. Max: `20`. |

## 요청 예시

```bash
curl "https://api.metaplex.com/v1/spotlight?limit=3"
```

## 응답

```json
{
  "data": {
    "spotlight": [
      {
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
    ]
  }
}
```

## 응답 타입

### TypeScript

```ts
interface SpotlightEntry {
  launch: Launch;
  baseToken: BaseToken;
  website: string;
  socials: Socials;
}

interface SpotlightResponse {
  data: {
    spotlight: SpotlightEntry[];
  };
}
```

### Rust

```rust
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SpotlightEntry {
    pub launch: Launch,
    pub base_token: BaseToken,
    pub website: String,
    pub socials: Socials,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SpotlightData {
    pub spotlight: Vec<SpotlightEntry>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SpotlightResponse {
    pub data: SpotlightData,
}
```

## 사용 예시

### TypeScript

```ts
const response = await fetch(
  "https://api.metaplex.com/v1/spotlight?limit=3"
);
const { data }: SpotlightResponse = await response.json();
data.spotlight.forEach((entry) => {
  console.log(entry.baseToken.name, entry.launch.type);
});
```

### Rust

```rust
let response: SpotlightResponse = reqwest::get(
    "https://api.metaplex.com/v1/spotlight?limit=3"
)
.await?
.json()
.await?;

for entry in &response.data.spotlight {
    println!("{}", entry.base_token.name);
}
```
