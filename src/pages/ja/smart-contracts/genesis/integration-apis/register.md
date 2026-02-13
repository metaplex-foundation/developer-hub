---
title: Register
metaTitle: Genesis - Register Launch | REST API | Metaplex
description: Register a confirmed Genesis launch in the database. Call this after on-chain transactions are confirmed to make the launch discoverable.
method: POST
created: '01-15-2025'
updated: '02-13-2026'
keywords:
  - Genesis API
  - register launch
  - submit launch
  - launch metadata
about:
  - API endpoint
  - Launch registration
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---

Register a confirmed Genesis launch in the database. Call this after the [create launch](/smart-contracts/genesis/integration-apis/create-launch) transactions have been signed and confirmed on-chain. Registration makes the launch discoverable via the listings and spotlight APIs. {% .lead %}

{% callout type="note" %}
For a higher-level interface that handles create, sign, send, and register in one call, see `createAndRegisterLaunch` in the [API Client SDK](/smart-contracts/genesis/sdk/api-client).
{% /callout %}

## Endpoint

```
POST /launches/register
```

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | `string` | Yes | Launch type. Use `"project"` |
| `genesisAccount` | `string` | Yes | The genesis account public key (from `createLaunch` response) |
| `network` | `string` | No | `"solana-devnet"` for devnet (omit for mainnet) |

## Example Request

```bash
curl -X POST https://api.metaplex.com/v1/launches/register \
  -H "Content-Type: application/json" \
  -d '{
    "type": "project",
    "genesisAccount": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
  }'
```

**Devnet example:**

```bash
curl -X POST https://api.metaplex.com/v1/launches/register \
  -H "Content-Type: application/json" \
  -d '{
    "type": "project",
    "genesisAccount": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN",
    "network": "solana-devnet"
  }'
```

## Response

### Success (200)

```json
{
  "success": true,
  "existing": false,
  "launch": {
    "id": "launch_abc123",
    "link": "https://www.metaplex.com/launch/mytoken"
  },
  "token": {
    "id": "token_xyz789",
    "mintAddress": "TokenMint..."
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `success` | `boolean` | Whether the request succeeded |
| `existing` | `boolean` | `true` if this launch was already registered |
| `launch.id` | `string` | Unique launch identifier |
| `launch.link` | `string` | Public launch page URL |
| `token.id` | `string` | Unique token identifier |
| `token.mintAddress` | `string` | Token mint address |

### Error

```json
{
  "success": false,
  "error": "Description of what went wrong"
}
```

## Request & Response Types

### TypeScript

```ts
interface RegisterRequest {
  type: 'project';
  genesisAccount: string;
  network?: 'solana-devnet';
}

interface RegisterResponse {
  success: boolean;
  existing?: boolean;
  launch: {
    id: string;
    link: string;
  };
  token: {
    id: string;
    mintAddress: string;
  };
}
```

### Rust

```rust
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RegisterRequest {
    #[serde(rename = "type")]
    pub launch_type: String,
    pub genesis_account: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub network: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RegisterResponse {
    pub success: bool,
    pub existing: Option<bool>,
    pub launch: LaunchInfo,
    pub token: TokenInfo,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LaunchInfo {
    pub id: String,
    pub link: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TokenInfo {
    pub id: String,
    pub mint_address: String,
}
```

## Usage Examples

### TypeScript

```ts
const response = await fetch('https://api.metaplex.com/v1/launches/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'project',
    genesisAccount: '7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN',
  }),
});
const data: RegisterResponse = await response.json();
console.log(`Launch page: ${data.launch.link}`);
```

### Using the SDK

```ts
import { registerLaunch } from '@metaplex-foundation/genesis';

const result = await registerLaunch(umi, {}, {
  genesisAccount: createResult.genesisAccount,
});
console.log(`Launch page: ${result.launch.link}`);
```

### Rust

```rust
let client = reqwest::Client::new();
let response: RegisterResponse = client
    .post("https://api.metaplex.com/v1/launches/register")
    .json(&RegisterRequest {
        launch_type: "project".to_string(),
        genesis_account: "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN".to_string(),
        network: None,
    })
    .send()
    .await?
    .json()
    .await?;

println!("Launch page: {}", response.launch.link);
```

## Errors

| Code | Description |
|------|-------------|
| `400` | Invalid request body or genesis account not found on-chain |
| `409` | Launch already registered for this genesis account |
| `429` | Rate limit exceeded |
| `500` | Internal server error |

{% callout type="note" %}
The `genesisAccount` must correspond to a valid, confirmed genesis account on-chain. Registration will fail if the account does not exist or the create transactions have not been confirmed.
{% /callout %}
