---
title: Create Launch
metaTitle: Genesis - Create Launch | REST API | Metaplex
description: Build on-chain transactions for a new Genesis token launch. Returns unsigned transactions ready for signing and sending.
method: POST
created: '02-19-2026'
updated: '02-19-2026'
keywords:
  - Genesis API
  - create launch
  - token launch
  - launch transactions
about:
  - API endpoint
  - Launch creation
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

Build the on-chain transactions for a new Genesis token launch. Returns unsigned transactions that must be signed and sent before calling [Register Launch](/smart-contracts/genesis/integration-apis/register). {% .lead %}

{% callout type="warning" title="Use the SDK instead" %}
Most integrators should use [`createAndRegisterLaunch`](/smart-contracts/genesis/sdk/api-client) from the SDK, which handles creating transactions, signing, sending, and registering the launch in a single call. This endpoint is only needed if you require direct HTTP access without the SDK.
{% /callout %}

{% callout type="note" %}
We recommend using the Create API to build launches programmatically, as [metaplex.com](https://www.metaplex.com) does not yet support the full feature set of the Genesis program. Mainnet launches created through the API will appear on metaplex.com once [registered](/smart-contracts/genesis/integration-apis/register).
{% /callout %}

## Endpoint

```
POST /v1/launches/create
```

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `wallet` | `string` | Yes | Creator's wallet public key |
| `launch` | `object` | Yes | Full launch configuration (see below) |

### Launch Configuration

The `launch` object describes the full token and launch setup:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | Yes | Token name, 1–32 characters |
| `symbol` | `string` | Yes | Token symbol, 1–10 characters |
| `image` | `string` | Yes | Token image URL (Irys gateway) |
| `description` | `string` | No | Token description, max 250 characters |
| `decimals` | `number` | No | Token decimals (defaults to 6) |
| `supply` | `number` | No | Total token supply (defaults to 1,000,000,000) |
| `network` | `string` | No | `'solana-mainnet'` (default) or `'solana-devnet'` |
| `quoteMint` | `string` | No | Quote token mint address (defaults to wrapped SOL) |
| `type` | `string` | Yes | `'project'` |
| `finalize` | `boolean` | No | Whether to finalize the launch (defaults to `true`) |
| `allocations` | `array` | Yes | Array of allocation configurations |
| `externalLinks` | `object` | No | Website, Twitter, Telegram links |
| `publicKey` | `string` | Yes | Creator's wallet public key (must match the top-level `wallet` field) |

### Allocation Types

Each allocation in the `allocations` array has a `type` field:

- **`launchpoolV2`** — Proportional distribution pool
- **`raydiumV2`** — Raydium LP allocation
- **`unlockedV2`** — Unlocked tokens to a recipient
- **`lockedV2`** — Locked tokens via Streamflow
- **`presaleV2`** — Fixed-price presale

{% callout type="note" %}
The SDK's `buildCreateLaunchPayload` function handles converting the simplified `CreateLaunchInput` into this full payload format. See the [API Client](/smart-contracts/genesis/sdk/api-client) docs.
{% /callout %}

## Example Request

```bash
curl -X POST https://api.metaplex.com/v1/launches/create \
  -H "Content-Type: application/json" \
  -d '{
    "wallet": "YourWalletPublicKey...",
    "launch": {
      "name": "My Token",
      "symbol": "MTK",
      "image": "https://gateway.irys.xyz/...",
      "decimals": 6,
      "supply": 1000000000,
      "network": "solana-devnet",
      "quoteMint": "So11111111111111111111111111111111111111112",
      "type": "project",
      "finalize": true,
      "publicKey": "YourWalletPublicKey...",
      "allocations": [...]
    }
  }'
```

## Success Response

```json
{
  "success": true,
  "transactions": [
    "base64-encoded-transaction-1...",
    "base64-encoded-transaction-2..."
  ],
  "blockhash": {
    "blockhash": "...",
    "lastValidBlockHeight": 123456789
  },
  "mintAddress": "MintPublicKey...",
  "genesisAccount": "GenesisAccountPDA..."
}
```

| Field | Type | Description |
|-------|------|-------------|
| `success` | `boolean` | `true` on success |
| `transactions` | `string[]` | Base64-encoded serialized transactions |
| `blockhash` | `object` | Blockhash for transaction confirmation |
| `mintAddress` | `string` | The token mint public key |
| `genesisAccount` | `string` | The genesis account PDA public key |

## Error Response

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [...]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `success` | `boolean` | `false` on error |
| `error` | `string` | Error message |
| `details` | `array?` | Validation error details (when applicable) |

## Error Codes

| Code | Description |
|------|-------------|
| `400` | Invalid input or validation failure |
| `500` | Internal server error |

## Recommended: Use the SDK

Instead of calling this endpoint directly, use [`createAndRegisterLaunch`](/smart-contracts/genesis/sdk/api-client) which handles the entire flow — creating transactions, signing, sending, and registering — in one call:

{% code-tabs-imported from="genesis/api_easy_mode" frameworks="umi" filename="createAndRegisterLaunch" /%}

See [API Client](/smart-contracts/genesis/sdk/api-client) for the full SDK documentation including all three integration modes.
