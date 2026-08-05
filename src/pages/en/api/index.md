---
title: Metaplex API
metaTitle: Metaplex API - Public REST API Reference | Metaplex
description: The Metaplex public REST API at api.metaplex.com — Genesis launch data, launch creation, the agent registry, and agent wallet transactions. No authentication required.
created: '01-15-2025'
updated: '08-01-2026'
keywords:
  - Metaplex API
  - Genesis API
  - agent registry API
  - launch data
  - token queries
  - REST API
about:
  - API integration
  - Data aggregation
  - Launch information
  - Agent registry
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---

The Metaplex API is the public REST API at `api.metaplex.com`. It serves Genesis launch data, builds launch-creation transactions, and exposes the Metaplex Agent Registry — browsing agents, serving A2A AgentCards, and building agent wallet transactions. {% .lead %}

## Summary

The Metaplex API provides public HTTP access to Genesis launch data, launch creation, and the agent registry — no SDK or authentication required.

- Query launches by genesis address, token mint, or browse all active launches
- Create and register new Genesis launches
- Browse and search the agent registry; fetch per-agent A2A AgentCards
- Build agent mint, fund, and withdraw transactions
- Public REST API at `https://api.metaplex.com/v1` — no authentication required
- Supports Solana mainnet (default) and devnet via `network` query parameter
- Machine-readable OpenAPI 3.1 specification: [YAML](https://api.metaplex.com/v1/openapi.yaml) (canonical) / [JSON](https://api.metaplex.com/v1/openapi.json), discoverable via the [RFC 9727 API catalog](https://api.metaplex.com/.well-known/api-catalog)

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

## Launch Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | [`/launches/{genesis_pubkey}`](/api/get-launch) | Get launch data by genesis address |
| `GET` | [`/tokens/{mint}`](/api/get-launches-by-token) | Get all launches for a token mint |
| `GET` | [`/launches`](/api/list-launches) | List launches with optional filters |
| `GET` | [`/launches?spotlight=true`](/api/get-spotlight) | Get featured spotlight launches |
| `POST` | [`/launches/create`](/api/create-launch) | Build on-chain transactions for a new launch |
| `POST` | [`/launches/register`](/api/register) | Register a confirmed launch for listing |
| `POST` | [`/twitter/verify`](/api/verify-twitter) | Verify Twitter account ownership for launch registration |
| `POST` | [`/creator-rewards/claim`](/api/claim-creator-rewards) | Build a creator rewards claim transaction |

{% callout type="note" %}
The `POST` endpoints (`/launches/create` and `/launches/register`) are used together to create new token launches. For most use cases, the [SDK API Client](/smart-contracts/genesis/sdk/api-client) provides a simpler interface that wraps both endpoints. Real-time on-chain launch state can be read directly with the SDK chain methods [`fetchBucketState`](/smart-contracts/genesis/integration-apis/fetch-bucket-state) and [`fetchDepositState`](/smart-contracts/genesis/integration-apis/fetch-deposit-state).
{% /callout %}

## Agent Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | [`/agents`](/api/list-agents) | List and search registered agents (paginated) |
| `GET` | [`/agents/{address}`](/api/get-agent) | Get a single agent with tokens and metadata |
| `GET` | [`/agents/{address}/agent-card.json`](/api/get-agent-card) | Get the hosted A2A AgentCard |
| `POST` | [`/agents/mint`](/api/mint-agent) | Build an agent mint + registration transaction |
| `POST` | [`/agents/{address}/fund`](/api/fund-agent) | Build a SOL transfer to the agent's wallet |
| `POST` | [`/agents/{address}/withdraw`](/api/withdraw-agent) | Build a withdrawal from the agent's wallet (owner only) |

For minting agents with a guided walkthrough, see [Mint an Agent](/agents/mint-agent).

## Transaction-Building Endpoints

`POST` endpoints that build transactions never hold user keys and never submit transactions. Each returns one or more base64-serialized transactions plus the blockhash they were built against; your application deserializes them, has the user's wallet sign, and submits to the network.

## Error Codes

| Code | Description |
| --- | --- |
| `400` | Bad request - invalid parameters |
| `403` | Not authorized for the operation (e.g. withdrawing from an agent you don't own) |
| `404` | Launch, token, or agent not found |
| `429` | Rate limit exceeded |
| `500` | Internal server error |

## Response Envelopes

Two envelope conventions are in use, reflecting the API's evolution:

**Launch read endpoints** (`/launches*`, `/tokens/*`, `/creator-rewards/claim`) wrap results in `data` and errors in `error.message`:

```json
{ "data": { "…": "…" } }
```

```json
{ "error": { "message": "Launch not found" } }
```

**Agent endpoints, launch write endpoints, and `/twitter/verify`** use a `success` discriminator:

```json
{ "success": true, "…": "…" }
```

```json
{ "success": false, "error": "Agent not found" }
```

The exception is [`/agents/{address}/agent-card.json`](/api/get-agent-card), which returns raw AgentCard JSON with no envelope so A2A clients can consume it directly. Each endpoint page documents its exact shape, as does the [OpenAPI specification](https://api.metaplex.com/v1/openapi.json).

## Machine-Readable Specification

The full API contract is published as an OpenAPI 3.1 document, generated directly from the API's request validators (so it cannot drift from the implementation):

| Format | URL |
|--------|-----|
| YAML (canonical) | `https://api.metaplex.com/v1/openapi.yaml` |
| JSON | `https://api.metaplex.com/v1/openapi.json` |
| Current-version aliases | `https://api.metaplex.com/openapi.json` / `openapi.yaml` |
| RFC 9727 API catalog | `https://api.metaplex.com/.well-known/api-catalog` |

Import the spec into Postman, Swagger UI, code generators, or agent frameworks to get typed clients and callable tools for every endpoint.

## Notes

- The API is rate limited. If you receive a `429` response, reduce your request frequency.
- All date fields (`startTime`, `endTime`, `graduatedAt`, `lastActivityAt`) are returned as ISO 8601 strings.
- The default network is `solana-mainnet`. Devnet data is available via `?network=solana-devnet`.
- For `POST` endpoints, the [SDK API Client](/smart-contracts/genesis/sdk/api-client) is recommended as it wraps both `/launches/create` and `/launches/register`.

## Shared Types

### TypeScript

```ts
interface Launch {
  launchPage: string;
  mechanic: string;
  genesisAddress: string;
  spotlight: boolean;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'live' | 'graduated' | 'ended';
  heroUrl: string | null;
  graduatedAt: string | null;
  lastActivityAt: string;
  type: 'launchpool' | 'presale';
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
    pub mechanic: String,
    pub genesis_address: String,
    pub spotlight: bool,
    pub start_time: String,
    pub end_time: String,
    pub status: String,
    pub hero_url: Option<String>,
    pub graduated_at: Option<String>,
    pub last_activity_at: String,
    #[serde(rename = "type")]
    pub launch_type: String,
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
reqwest = { version = "0.12", features = ["json"] }
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
```
{% /callout %}

## Glossary

| Term | Definition |
|------|------------|
| **Genesis Address** | A PDA (Program Derived Address) that uniquely identifies a specific launch campaign |
| **Base Token** | The token being launched, identified by its mint address |
| **Launch Page** | The URL where users can participate in a launch |
| **Mechanic** | The allocation mechanism used for the launch (e.g., `launchpoolV2`, `presaleV2`, `auction`) |
| **Launch Type** | The underlying mechanism of the launch: `launchpool` or `presale` |
| **Spotlight** | A platform-curated flag indicating a featured launch |
| **Status** | The current state of a launch: `upcoming`, `live`, `graduated`, or `ended` |
| **Socials** | Social media links (X/Twitter, Telegram, Discord) associated with a token |
| **LaunchData** | The response wrapper containing `launch`, `baseToken`, `website`, and `socials` |
| **TokenData** | The response wrapper for token queries, containing a `launches` array plus `baseToken`, `website`, and `socials` |
