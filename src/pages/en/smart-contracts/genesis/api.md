---
title: API
metaTitle: Genesis - API | Launch Data API | Metaplex
description: Public API for querying Genesis launch data by genesis address or token mint. No authentication required.
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
  - q: Is authentication required?
    a: No. The Genesis API is public with rate limits. No API key or authentication is needed.
  - q: Which endpoint should I use if I only have a token mint?
    a: Use /tokens/{mint} to get all launches for a token. Use /launches/{genesis_pubkey} if you have the genesis address.
  - q: What are the rate limits?
    a: Rate limits apply to prevent abuse. If you receive a 429 response, reduce your request frequency.
  - q: Can a token have multiple launches?
    a: Yes. The /tokens endpoint returns an array of launches because tokens can have multiple campaigns.
---

The Genesis API allows aggregators and applications to query launch data from Genesis token launches. Use these endpoints to display launch information, token metadata, and social links in your application. {% .lead %}

{% callout title="What You'll Learn" %}
This reference covers:

- Available endpoints and their use cases
- Request/response formats with examples
- TypeScript and Rust type definitions
- Error handling
{% /callout %}

## Summary

The Genesis API provides read-only access to launch data. Query by genesis address or token mint.

- Public API with rate limits (no authentication)
- Returns launch info, token metadata, and social links
- TypeScript and Rust types provided
- Standard REST error codes

{% callout type="note" %}
The API is public with rate limits. No authentication is required.
{% /callout %}

## Base URL

```
https://api.metaplex.com/v1
```

## Use Cases

- **`/launches/{genesis_pubkey}`** - Use when you have a genesis address, such as from an on-chain event or transaction log.
- **`/tokens/{mint}`** - Use when you only know the token mint address. Returns all launches associated with that token (a token can have multiple launch campaigns).

## Endpoints

### Get Launch by Genesis Address

```
GET /launches/{genesis_pubkey}
```

**Example Request:**

```
GET https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN
```

**Response:**

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

### Get Launches by Token Mint

```
GET /tokens/{mint}
```

Returns all launches for a token. The response is identical except `launches` is an array.

**Response:**

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
Finding genesis pubkeys requires indexing or `getProgramAccounts`. If you only have a token mint, use the `/tokens` endpoint instead.
{% /callout %}

## Errors

```json
{
  "error": {
    "code": 404,
    "message": "Launch not found"
  }
}
```

| Code | Description |
| --- | --- |
| `400` | Bad request - invalid parameters |
| `404` | Launch or token not found |
| `429` | Rate limit exceeded |
| `500` | Internal server error |

## TypeScript Types

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

**Example:**

```ts
const response = await fetch(
  "https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
);
const { data }: LaunchResponse = await response.json();
console.log(data.baseToken.name); // "My Token"
```

## Rust Types

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

**Example:**

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
Add these dependencies to your `Cargo.toml`:

```toml
[dependencies]
reqwest = { version = "0.11", features = ["json"] }
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
```

{% /callout %}

## FAQ

### Is authentication required?

No. The Genesis API is public with rate limits. No API key or authentication is needed.

### Which endpoint should I use if I only have a token mint?

Use `/tokens/{mint}` to get all launches for a token. Use `/launches/{genesis_pubkey}` if you have the genesis address.

### What are the rate limits?

Rate limits apply to prevent abuse. If you receive a 429 response, reduce your request frequency.

### Can a token have multiple launches?

Yes. The `/tokens` endpoint returns an array of launches because tokens can have multiple campaigns (using different `genesisIndex` values).

## Glossary

| Term | Definition |
|------|------------|
| **Genesis Address** | The PDA identifying a specific launch campaign |
| **Base Token** | The token being launched |
| **Launch Page** | The URL where users can participate in the launch |
| **Launch Type** | The mechanism used (launchpool, presale, auction) |
| **Socials** | Social media links associated with the token |

## Next Steps

- [JavaScript SDK](/smart-contracts/genesis/sdk/javascript) - Programmatic access to Genesis
- [Aggregation API](/smart-contracts/genesis/aggregation) - Additional API details and on-chain fetching
- [Getting Started](/smart-contracts/genesis/getting-started) - Launch your own token
