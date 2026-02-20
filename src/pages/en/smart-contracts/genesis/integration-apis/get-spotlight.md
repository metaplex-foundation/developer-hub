---
title: Get Spotlight
metaTitle: Genesis - Get Spotlight | REST API | Metaplex
description: Get featured spotlight launches from Genesis. Returns curated launches highlighted by the platform.
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

Retrieve featured spotlight launches curated by the platform. Use this endpoint to highlight selected launches in your application. {% .lead %}

## Endpoint

```
GET /spotlight
```

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `network` | `string` | No | Network to query. Default: `solana-mainnet`. Use `solana-devnet` for devnet. |
| `limit` | `number` | No | Number of results to return. Default: `5`. Max: `20`. |

## Example Request

```bash
curl "https://api.metaplex.com/v1/spotlight?limit=3"
```

## Response

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

## Response Type

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

## Usage Examples

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
