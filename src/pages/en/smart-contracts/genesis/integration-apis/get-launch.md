---
title: Get Launch
metaTitle: Genesis - Get Launch | REST API | Metaplex
description: Get launch data by genesis address. Returns launch info, token metadata, and social links.
method: GET
created: '01-15-2025'
updated: '02-26-2026'
keywords:
  - Genesis API
  - get launch
  - genesis address
  - launch data
about:
  - API endpoint
  - Launch queries
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---

Retrieve launch data for a specific genesis address. Returns launch info, token metadata, website, and social links. {% .lead %}

## Endpoint

```
GET /launches/{genesis_pubkey}
```

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `genesis_pubkey` | `string` | Yes | The genesis account public key |

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `network` | `string` | No | Network to query. Default: `solana-mainnet`. Use `solana-devnet` for devnet. |

## Example Request

```bash
curl https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN
```

## Response

```json
{
  "data": {
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
}
```

## Response Type

See [Shared Types](/smart-contracts/genesis/integration-apis#shared-types) for `Launch`, `BaseToken`, and `Socials` definitions.

### TypeScript

```ts
interface LaunchResponse {
  data: {
    launch: Launch;
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
pub struct LaunchData {
    pub launch: Launch,
    pub base_token: BaseToken,
    pub website: String,
    pub socials: Socials,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LaunchResponse {
    pub data: LaunchData,
}
```

## Usage Examples

### TypeScript

```ts
const response = await fetch(
  "https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
);
const { data }: LaunchResponse = await response.json();
console.log(data.baseToken.name); // "My Token"
```

### Rust

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
Finding genesis pubkeys requires indexing or `getProgramAccounts`. If you only have a token mint, use the [Get Launches by Token](/smart-contracts/genesis/integration-apis/get-launches-by-token) endpoint instead.
{% /callout %}
