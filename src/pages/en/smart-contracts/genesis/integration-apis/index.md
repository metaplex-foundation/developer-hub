---
title: Integration APIs
metaTitle: Genesis - Integration APIs | Launch Data | Metaplex
description: Access Genesis launch data through HTTP REST endpoints and on-chain SDK methods. Public API with no authentication required.
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - Genesis API
  - integration API
  - launch data
  - token queries
  - on-chain state
about:
  - API integration
  - Data aggregation
  - Launch information
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---

The Genesis Integration APIs allow aggregators and applications to query launch data from Genesis token launches. Access metadata through REST endpoints or fetch real-time on-chain state with the SDK. {% .lead %}

## Base URL

```
https://api.metaplex.com/v1
```

## Network Selection

By default, the API returns data from Solana mainnet. To query devnet launches instead, add the `network` query parameter:

```
?network=solana-devnet
```

**Example:**

```bash
# Mainnet (default)
curl https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN

# Devnet
curl "https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN?network=solana-devnet"
```

## Authentication

No authentication is required. The API is public with rate limits.

{% callout type="note" %}
For a higher-level SDK interface that wraps the create and register endpoints, see the [API Client](/smart-contracts/genesis/sdk/api-client).
{% /callout %}

## Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | [`/launches/{genesis_pubkey}`](/smart-contracts/genesis/integration-apis/get-launch) | Get launch data by genesis address |
| `GET` | [`/tokens/{mint}`](/smart-contracts/genesis/integration-apis/get-launches-by-token) | Get all launches for a token mint |
| `GET` | [`/listings`](/smart-contracts/genesis/integration-apis/get-listings) | Get active and upcoming launch listings |
| `GET` | [`/spotlight`](/smart-contracts/genesis/integration-apis/get-spotlight) | Get featured spotlight launches |
| `POST` | [`/launches/create`](/smart-contracts/genesis/integration-apis/create-launch) | Create a new launch (returns unsigned transactions) |
| `POST` | [`/launches/register`](/smart-contracts/genesis/integration-apis/register) | Register a confirmed launch |
| `CHAIN` | [`fetchBucketState`](/smart-contracts/genesis/integration-apis/fetch-bucket-state) | Fetch bucket state from on-chain |
| `CHAIN` | [`fetchDepositState`](/smart-contracts/genesis/integration-apis/fetch-deposit-state) | Fetch deposit state from on-chain |

## Error Codes

| Code | Description |
| --- | --- |
| `400` | Bad request - invalid parameters |
| `404` | Launch or token not found |
| `429` | Rate limit exceeded |
| `500` | Internal server error |

Error response format:

```json
{
  "error": {
    "message": "Launch not found"
  }
}
```

## Shared Types

### TypeScript

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
  x?: string;
  telegram?: string;
  discord?: string;
}

interface ErrorResponse {
  error: {
    message: string;
  };
}
```

### Rust

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
    pub x: Option<String>,
    pub telegram: Option<String>,
    pub discord: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiError {
    pub message: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ErrorResponse {
    pub error: ApiError,
}
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
