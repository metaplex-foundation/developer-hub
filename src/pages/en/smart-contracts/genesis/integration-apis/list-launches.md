---
title: Get Listings
metaTitle: Genesis - Get Listings | REST API | Metaplex
description: Get active and upcoming Genesis launch listings. Returns a paginated list of launches with metadata.
method: GET
created: '01-15-2025'
updated: '02-26-2026'
keywords:
  - Genesis API
  - listings
  - active launches
  - launch directory
about:
  - API endpoint
  - Launch listings
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---

Retrieve active and upcoming Genesis launch listings. Returns a paginated list of launches with their metadata, token info, and social links. {% .lead %}

## Endpoint

```
GET /launches
```

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `network` | `string` | No | Network to query. Default: `solana-mainnet`. Use `solana-devnet` for devnet. |
| `status` | `string` | No | Filter by status: `upcoming`, `live`, `graduated`. Default: returns all. |
| `spotlight` | `string` | No | Filter by spotlight: `true` or `false`. Default: returns all. |

## Example Request

```bash
curl "https://api.metaplex.com/v1/launches?status=live"
```

## Response

Results are sorted by `lastActivityAt` in descending order.

```json
{
  "data": [
    {
      "launch": {
        "launchPage": "https://example.com/launch/mytoken",
        "mechanic": "launchpoolV2",
        "genesisAddress": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN",
        "spotlight": false,
        "startTime": "2026-01-15T14:00:00.000Z",
        "endTime": "2026-01-15T18:00:00.000Z",
        "status": "graduated",
        "heroUrl": "launches/abc123/hero.webp",
        "graduatedAt": "2026-01-15T18:05:00.000Z",
        "lastActivityAt": "2026-01-15T17:45:00.000Z",
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

interface ListingsResponse {
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
pub struct ListingsResponse {
    pub data: Vec<LaunchData>,
}
```

## Usage Examples

### TypeScript

```ts
const response = await fetch(
  "https://api.metaplex.com/v1/launches?status=live"
);
const { data }: ListingsResponse = await response.json();
console.log(`${data.length} launches`);
data.forEach((entry) => {
  console.log(entry.baseToken.name, entry.launch.status);
});
```

### Rust

```rust
let response: ListingsResponse = reqwest::get(
    "https://api.metaplex.com/v1/launches?status=live"
)
.await?
.json()
.await?;

println!("{} launches", response.data.len());
```

