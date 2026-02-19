---
title: Register Launch
metaTitle: Genesis - Register Launch | REST API | Metaplex
description: Register a Genesis launch after on-chain transactions are confirmed. Validates the on-chain state and creates the launch listing.
method: POST
created: '01-15-2025'
updated: '02-19-2026'
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
---

Register a Genesis launch after the on-chain transactions from [Create Launch](/smart-contracts/genesis/integration-apis/create-launch) have been confirmed. The endpoint validates the on-chain state, creates the launch listing, and returns a launch page URL. {% .lead %}

{% callout type="warning" title="Use the SDK instead" %}
Most integrators should use [`createAndRegisterLaunch`](/smart-contracts/genesis/sdk/api-client) from the SDK, which handles creating transactions, signing, sending, and registering the launch in a single call. This endpoint is only needed if you require direct HTTP access without the SDK.
{% /callout %}

## Endpoint

```
POST /v1/launches/register
```

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `genesisAccount` | `string` | Yes | The genesis account public key (from Create Launch response) |
| `network` | `string` | No | `'solana-mainnet'` (default) or `'solana-devnet'` |
| `launch` | `object` | Yes | The same launch configuration used in Create Launch |

The `launch` object must match what was sent to the Create Launch endpoint so the API can verify the on-chain state matches the expected configuration.

## Example Request

```bash
curl -X POST https://api.metaplex.com/v1/launches/register \
  -H "Content-Type: application/json" \
  -d '{
    "genesisAccount": "GenesisAccountPDA...",
    "network": "solana-devnet",
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
  "existing": false,
  "launch": {
    "id": "uuid-launch-id",
    "link": "https://www.metaplex.com/token/MintPublicKey..."
  },
  "token": {
    "id": "uuid-token-id",
    "mintAddress": "MintPublicKey..."
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `success` | `boolean` | `true` on success |
| `existing` | `boolean?` | `true` if launch was already registered (idempotent) |
| `launch.id` | `string` | Unique launch ID |
| `launch.link` | `string` | Public launch page URL |
| `token.id` | `string` | Unique token ID |
| `token.mintAddress` | `string` | Token mint public key |

{% callout type="note" %}
If the launch has already been registered, the endpoint returns the existing record with `existing: true` rather than creating a duplicate.
{% /callout %}

{% callout type="note" %}
Mainnet launches will appear on [metaplex.com](https://www.metaplex.com) after registration. The returned `launch.link` points to the public launch page.
{% /callout %}

## Error Response

```json
{
  "success": false,
  "error": "Genesis account not found on-chain",
  "details": [...]
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `400` | Invalid input, on-chain state mismatch, or genesis account not found |
| `500` | Internal server error |

## Validation

The register endpoint performs extensive on-chain validation:

- Fetches the Genesis V2 account and verifies it exists
- Validates all bucket accounts match the expected allocations
- Verifies token metadata (name, symbol, image) matches the input
- Checks mint properties (supply, decimals, authorities)

## Recommended: Use the SDK

Instead of calling this endpoint directly, use [`createAndRegisterLaunch`](/smart-contracts/genesis/sdk/api-client) which handles the entire flow — creating transactions, signing, sending, and registering — in one call:

{% code-tabs-imported from="genesis/api_easy_mode" frameworks="umi" filename="createAndRegisterLaunch" /%}

See [API Client](/smart-contracts/genesis/sdk/api-client) for the full SDK documentation including all three integration modes.
