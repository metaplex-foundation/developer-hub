---
title: Aggregation API
metaTitle: Genesis - Aggregation API | Launch Data | Metaplex
description: Public API for querying Genesis launch data by genesis address or token mint. Includes on-chain state fetching.
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - Genesis API
  - aggregation API
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
faqs:
  - q: What's the difference between the API and on-chain fetching?
    a: The API returns aggregated metadata (socials, images). On-chain fetching via the SDK returns real-time state like deposit totals and time conditions.
  - q: How do I get real-time deposit totals?
    a: Use fetchLaunchPoolBucketV2 or fetchPresaleBucketV2 from the Genesis SDK to read current on-chain state.
  - q: Can I query time conditions for a bucket?
    a: Yes. Fetch the bucket account and access depositStartCondition, depositEndCondition, claimStartCondition, and claimEndCondition.
  - q: How do I check if a user has deposited?
    a: Use safeFetchLaunchPoolDepositV2 or safeFetchPresaleDepositV2 with the deposit PDA. It returns null if no deposit exists.
---

The Genesis API allows aggregators and applications to query launch data from Genesis token launches. Use these endpoints to display launch information, token metadata, and social links in your application. {% .lead %}

{% callout title="What You'll Learn" %}
This reference covers:
- HTTP API endpoints for launch metadata
- On-chain state fetching with the JavaScript SDK
- TypeScript and Rust type definitions
- Real-time bucket and deposit state
{% /callout %}

## Summary

Access Genesis data through the HTTP API for metadata or the SDK for real-time on-chain state.

- HTTP API returns launch info, token metadata, socials
- SDK provides real-time state: deposits, counts, time conditions
- No authentication required for HTTP API
- On-chain fetching requires Umi and the Genesis SDK

{% callout type="note" %}
The API is public with rate limits. No authentication is required.
{% /callout %}

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

## Use Cases

- **`/launches/{genesis_pubkey}`** - Use when you have a genesis address, such as from an on-chain event or transaction log.
- **`/tokens/{mint}`** - Use when you only know the token mint address. Returns all launches associated with that token (a token can have multiple launch campaigns).

## Endpoints

### Get Launch by Genesis Address

```
GET /launches/{genesis_pubkey}
```

**Example Request:**

```bash
curl https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN
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

**Example Request:**

```bash
curl https://api.metaplex.com/v1/tokens/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
```

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

## Types & Examples

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

## Fetching On-Chain State (JavaScript SDK)

In addition to the HTTP API, you can fetch launch state directly from the blockchain using the Genesis JavaScript SDK. This is useful for getting real-time data like deposit totals and time conditions.

### Bucket State

```typescript
import { fetchLaunchPoolBucketV2 } from '@metaplex-foundation/genesis';

const bucket = await fetchLaunchPoolBucketV2(umi, launchPoolBucket);

console.log('Total deposits:', bucket.quoteTokenDepositTotal);
console.log('Deposit count:', bucket.depositCount);
console.log('Claim count:', bucket.claimCount);
console.log('Token allocation:', bucket.bucket.baseTokenAllocation);
```

### Time Conditions

Each bucket has four time conditions that control the launch phases:

```typescript
const bucket = await fetchLaunchPoolBucketV2(umi, launchPoolBucket);

// Deposit window
const depositStart = bucket.depositStartCondition.time;
const depositEnd = bucket.depositEndCondition.time;

// Claim window
const claimStart = bucket.claimStartCondition.time;
const claimEnd = bucket.claimEndCondition.time;

console.log('Deposit starts:', new Date(Number(depositStart) * 1000));
console.log('Deposit ends:', new Date(Number(depositEnd) * 1000));
console.log('Claims start:', new Date(Number(claimStart) * 1000));
console.log('Claims end:', new Date(Number(claimEnd) * 1000));
```

### Deposit State

```typescript
import {
  fetchLaunchPoolDepositV2,
  safeFetchLaunchPoolDepositV2,
} from '@metaplex-foundation/genesis';

// Throws if not found
const deposit = await fetchLaunchPoolDepositV2(umi, depositPda);

// Returns null if not found
const maybeDeposit = await safeFetchLaunchPoolDepositV2(umi, depositPda);

if (deposit) {
  console.log('Amount:', deposit.amountQuoteToken);
  console.log('Claimed:', deposit.claimed);
}
```

## FAQ

### What's the difference between the API and on-chain fetching?
The API returns aggregated metadata (socials, images). On-chain fetching via the SDK returns real-time state like deposit totals and time conditions.

### How do I get real-time deposit totals?
Use `fetchLaunchPoolBucketV2` or `fetchPresaleBucketV2` from the Genesis SDK to read current on-chain state.

### Can I query time conditions for a bucket?
Yes. Fetch the bucket account and access `depositStartCondition`, `depositEndCondition`, `claimStartCondition`, and `claimEndCondition`.

### How do I check if a user has deposited?
Use `safeFetchLaunchPoolDepositV2` or `safeFetchPresaleDepositV2` with the deposit PDA. It returns null if no deposit exists.

## Glossary

| Term | Definition |
|------|------------|
| **Aggregation** | Collecting and normalizing data from multiple sources |
| **Bucket State** | Current on-chain data including deposit totals and counts |
| **Time Condition** | Unix timestamp controlling when a phase starts or ends |
| **Deposit PDA** | Program-derived address storing a user's deposit record |
| **safeFetch** | Fetch variant that returns null instead of throwing on missing accounts |

## Next Steps

- [JavaScript SDK](/smart-contracts/genesis/sdk/javascript) - Full SDK setup and configuration
- [API Reference](/smart-contracts/genesis/api) - HTTP API endpoint details
- [Launch Pool](/smart-contracts/genesis/launch-pool) - Proportional distribution setup
