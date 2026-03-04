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

## Summary

Fetch launches that have been curated as spotlights by the platform. This is a convenience filter on the `/launches` endpoint with `spotlight=true` pre-applied.

- Returns an array of `LaunchData` objects where `spotlight` is `true`
- Can be further filtered by `status` (`upcoming`, `live`, `graduated`)
- Each entry includes launch details, base token metadata, and social links
- Supports mainnet (default) and devnet via `network` query parameter

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

## Notes

- Spotlight status is curated by the platform and cannot be set via the API.
- This endpoint uses the same `/launches` route with `spotlight=true` as a query parameter — it is not a separate endpoint.
- The `mechanic` field indicates the allocation mechanism (e.g., `launchpoolV2`, `presaleV2`). The `type` field indicates the launch category (`project`, `memecoin`, or `custom`).
