---
title: Register
metaTitle: Genesis - Register Launch | REST API | Metaplex
description: Register a new Genesis launch with metadata, social links, and launch page URL. Submit launch details for aggregation.
method: POST
created: '01-15-2025'
updated: '01-31-2026'
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

Register a new Genesis launch with the API. Submit your launch page URL, website, and social links so aggregators can discover and display your launch. {% .lead %}

{% callout type="warning" title="Draft" %}
This is an example page. Parameters, request/response formats, and behavior are subject to change once the actual integration is finalized.
{% /callout %}

## Endpoint

```
POST /register
```

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `genesisAddress` | `string` | Yes | The genesis account public key |
| `launchPage` | `string` | Yes | URL where users can participate in the launch |
| `website` | `string` | No | Project website URL |
| `socials.x` | `string` | No | X (Twitter) profile URL |
| `socials.telegram` | `string` | No | Telegram group URL |
| `socials.discord` | `string` | No | Discord server invite URL |

## Example Request

```bash
curl -X POST https://api.metaplex.com/v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "genesisAddress": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN",
    "launchPage": "https://example.com/launch/mytoken",
    "website": "https://example.com",
    "socials": {
      "x": "https://x.com/mytoken",
      "telegram": "https://t.me/mytoken",
      "discord": "https://discord.gg/mytoken"
    }
  }'
```

## Response

```json
{
  "data": {
    "success": true,
    "genesisAddress": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
  }
}
```

## Request & Response Types

### TypeScript

```ts
interface RegisterRequest {
  genesisAddress: string;
  launchPage: string;
  website?: string;
  socials?: {
    x?: string;
    telegram?: string;
    discord?: string;
  };
}

interface RegisterResponse {
  data: {
    success: boolean;
    genesisAddress: string;
  };
}
```

### Rust

```rust
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RegisterRequest {
    pub genesis_address: String,
    pub launch_page: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub website: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub socials: Option<Socials>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RegisterData {
    pub success: bool,
    pub genesis_address: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RegisterResponse {
    pub data: RegisterData,
}
```

## Usage Examples

### TypeScript

```ts
const response = await fetch("https://api.metaplex.com/v1/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    genesisAddress: "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN",
    launchPage: "https://example.com/launch/mytoken",
    website: "https://example.com",
    socials: {
      x: "https://x.com/mytoken",
    },
  }),
});
const { data }: RegisterResponse = await response.json();
console.log(data.success); // true
```

### Rust

```rust
let client = reqwest::Client::new();
let response: RegisterResponse = client
    .post("https://api.metaplex.com/v1/register")
    .json(&RegisterRequest {
        genesis_address: "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN".to_string(),
        launch_page: "https://example.com/launch/mytoken".to_string(),
        website: Some("https://example.com".to_string()),
        socials: Some(Socials {
            x: Some("https://x.com/mytoken".to_string()),
            telegram: None,
            discord: None,
        }),
    })
    .send()
    .await?
    .json()
    .await?;

println!("Registered: {}", response.data.success);
```

## Errors

| Code | Description |
|------|-------------|
| `400` | Invalid request body or missing required fields |
| `409` | Launch already registered for this genesis address |
| `429` | Rate limit exceeded |
| `500` | Internal server error |

{% callout type="note" %}
The `genesisAddress` must correspond to a valid, finalized Genesis account on-chain. Registration will fail if the account does not exist.
{% /callout %}
