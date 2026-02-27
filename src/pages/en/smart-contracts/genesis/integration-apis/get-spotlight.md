---
title: Get Spotlight
metaTitle: Genesis - Get Spotlight | REST API | Metaplex
description: Get featured spotlight launches from Genesis. Returns curated launches highlighted by the platform.
method: GET
created: '01-15-2025'
updated: '02-26-2026'
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
GET /launches?spotlight=true
```

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `network` | `string` | No | Network to query. Default: `solana-mainnet`. Use `solana-devnet` for devnet. |
| `status` | `string` | No | Filter by status: `upcoming`, `live`, `graduated`. Default: returns all. |

## Example Request

```bash
curl "https://api.metaplex.com/v1/launches?spotlight=true"
```

## Response

```json
{
  "data": [
    {
        "launch": {
          "launchPage": "https://example.com/launch/mytoken",
          "mechanic": "launchpoolV2",
          "genesisAddress": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN",
          "spotlight": true,
          "startTime": "2026-01-15T14:00:00.000Z",
          "endTime": "2026-01-15T18:00:00.000Z",
          "status": "live",
          "heroUrl": "launches/abc123/hero.webp",
          "graduatedAt": null,
          "lastActivityAt": "2026-01-15T16:30:00.000Z",
          "type": "project"
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
```

## Response Type

See [Shared Types](/smart-contracts/genesis/integration-apis#shared-types) for `Launch`, `BaseToken`, and `Socials` definitions.

### TypeScript

```ts
interface LaunchData {
  launch: Launch;
  baseToken: BaseToken;
  website: string;
  socials: Socials;
}

interface SpotlightResponse {
  data: LaunchData[];
}
```

### Rust

```rust
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LaunchData {
    pub launch: Launch,
    pub base_token: BaseToken,
    pub website: String,
    pub socials: Socials,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SpotlightResponse {
    pub data: Vec<LaunchData>,
}
```

## Usage Examples

### TypeScript

```ts
const response = await fetch(
  "https://api.metaplex.com/v1/launches?spotlight=true"
);
const { data }: SpotlightResponse = await response.json();
data.forEach((entry) => {
  console.log(entry.baseToken.name, entry.launch.type);
});
```

### Rust

```rust
let response: SpotlightResponse = reqwest::get(
    "https://api.metaplex.com/v1/launches?spotlight=true"
)
.await?
.json()
.await?;

for entry in &response.data {
    println!("{}", entry.base_token.name);
}
```
