---
title: Create Launch
metaTitle: Metaplex API - Create Launch | REST API | Metaplex
description: Build on-chain transactions for a new Genesis token launch. Returns unsigned transactions ready for signing and sending.
method: POST
created: '02-19-2026'
updated: '10-21-2026'
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

Build the on-chain transactions for a new Genesis token launch. Returns unsigned transactions that must be signed and sent before calling [Register Launch](/api/register). {% .lead %}

{% callout type="warning" title="Use the SDK instead" %}
Most integrators should use [`createAndRegisterLaunch`](/smart-contracts/genesis/sdk/api-client) from the SDK, which handles creating transactions, signing, sending, and registering the launch in a single call. This endpoint is only needed if you require direct HTTP access without the SDK.
{% /callout %}

{% callout type="note" %}
We recommend using the Create API to build launches programmatically, as [metaplex.com](https://www.metaplex.com) does not yet support the full feature set of the Genesis program. Mainnet launches created through the API will appear on metaplex.com once [registered](/api/register).
{% /callout %}

## Summary

`POST /v1/launches/create` builds the unsigned transactions for a new Genesis token launch, which the creator signs and sends before calling [Register Launch](/api/register).

- Supports the `launchpool`, `presale`, and `bondingCurve` launch types
- A `launchpool` or `presale` takes its allocations in a fixed order: the sale, the `Unlocked Tokens` allocation, then at most 8 unlock schedules
- A `launchpool` or `presale` that ends below its minimum raise returns its tokens to the `Unlocked Tokens` allocation's recipient
- Most integrators call [`createAndRegisterLaunch`](/smart-contracts/genesis/sdk/api-client) from the SDK instead of this endpoint

## Quick Reference

| Item | Value |
|------|-------|
| **Method** | `POST` |
| **Path** | `/v1/launches/create` |
| **Launch types** | `launchpool`, `presale`, `bondingCurve` |
| **Response** | Unsigned base64 transactions, `mintAddress`, `genesisAccount` |
| **Next step** | [Register Launch](/api/register) |
| **Contract** | [OpenAPI spec](https://api.metaplex.com/v1/openapi.yaml) |

## Endpoint

```
POST /v1/launches/create
```

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `wallet` | `string` | Yes | Creator's wallet public key |
| `launch` | `object` | Yes | Full launch configuration (see below) |
| `agent` | `object` | No | Launch on behalf of a registered [agent](/agents/) (see [Agent Launches](#agent-launches)) |

The request body also accepts `includeBackendSigner`, `derivedSignerPublicKey`, `nonce`, and `buildAllTxs`. These drive the signing flow used by [metaplex.com](https://www.metaplex.com) itself; leave them unset when calling the API directly.

### Launch Configuration

The `launch` object describes the full token and launch setup:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | Yes | Token name, 1–32 characters |
| `symbol` | `string` | Yes | Token symbol, 1–10 characters |
| `image` | `string` | Yes | Token image URL (Irys gateway) |
| `description` | `string` | No | Token description, max 250 characters |
| `decimals` | `number` | No | Token decimals, 1–9 (defaults to 6). A new `launchpool` token must use 6, and an existing token must match its on-chain mint |
| `supply` | `number` | No | Total token supply (defaults to 1,000,000,000) |
| `network` | `string` | No | `'solana-mainnet'` (default) or `'solana-devnet'` |
| `quoteMint` | `string` | No | Quote token mint address (defaults to wrapped SOL) |
| `type` | `string` | Yes | Launch type (see [Launch Types](#launch-types)) |
| `finalize` | `boolean` | No | Whether to finalize the launch (defaults to `true`) |
| `allocations` | `array` | Yes | Array of allocation configurations |
| `externalLinks` | `object` | No | Website, Twitter, Telegram links |
| `publicKey` | `string` | Yes | Creator's wallet public key (must match the top-level `wallet` field) |
| `useExistingToken` | `boolean` | No | Launch an existing SPL token instead of minting a new one (see [Existing Tokens](#existing-tokens)) |
| `mintAddress` | `string` | No | Mint of the existing token. Required when `useExistingToken` is `true` |
| `isMutable` | `boolean` | No | Whether the token metadata stays mutable (defaults to `true`) |

For a new token, the allocation supplies must add up to exactly `supply`. A new token with a `supply` other than the 1,000,000,000 default returns `403` unless custom supply is enabled for your account.

### Launch Types

| `type` | Description |
|--------|-------------|
| `launchpool` | Proportional distribution pool. Allocations, in order: a `launchpoolV2`, an `unlockedV2`, then any `claimScheduleV2` allocations |
| `presale` | Fixed-price presale. Allocations, in order: a `presaleV2`, an `unlockedV2`, then any `claimScheduleV2` allocations |
| `bondingCurve` | Bonding curve launch. Allocations: a `bondingCurveV2`. Fixed at 1,000,000,000 supply, 6 decimals, and a SOL quote |

The schema also defines `auction` and `custom`. `auction` is a placeholder that is not implemented yet, and `custom` is rejected by the public API with `400`.

### Launch Pool and Presale Allocation Order

A `launchpool` or `presale` lists its allocations in this order, and any other order returns `400`:

| Position | Allocation `type` | Rules |
|----------|-------------------|-------|
| 1 | `launchpoolV2` or `presaleV2` | The sale. `supply` is at least 1, and `minimumQuoteTokenThreshold` is required |
| 2 | `unlockedV2` | The `Unlocked Tokens` allocation, claimed by `unlockedV2.recipient`. `name` must be `Unlocked Tokens`, the default when omitted, and `supply` may be 0 |
| 3 and later | `claimScheduleV2` | Unlock schedules, at most 8 |

The `Unlocked Tokens` allocation is required even when no supply remains for it, because a sale that fails returns its tokens there (see [Sales That End Below Their Minimum](#sales-that-end-below-their-minimum)). A second `unlockedV2` allocation returns `400`.

{% callout type="note" title="At most 8 unlock schedules" %}
When a sale fails, one transaction marks every unlock schedule failed, so a `launchpool` or `presale` takes at most 8 `claimScheduleV2` allocations. A launch with 9 returns `400` at `allocations` with: `A sale with a graduation minimum can fail at most 8 unlock schedules and other unlocked allocations with tokens, and this launch has 9. Remove some of them.`
{% /callout %}

### Sales That End Below Their Minimum

A `launchpool` or `presale` that ends below its `minimumQuoteTokenThreshold` fails, and its tokens return to the `Unlocked Tokens` allocation:

- Depositors claim refunds of their deposits.
- No Raydium pool is created, and no unlock schedule releases tokens.
- The sale's tokens, the tokens reserved for the Raydium pool, and the tokens of every unlock schedule move to the `Unlocked Tokens` allocation.
- Metaplex claims the `Unlocked Tokens` allocation to its `recipient` when the sale ends.

### Allocation Types

Each allocation in the `allocations` array has a `type` field, a `name`, a `supply`, and a configuration object keyed by the same type name:

- **`launchpoolV2`** — Proportional distribution pool
- **`presaleV2`** — Fixed-price presale
- **`bondingCurveV2`** — Bonding curve sale
- **`unlockedV2`** — Unlocked tokens to a recipient
- **`claimScheduleV2`** — Tokens released to a recipient on a vesting schedule, with an optional cliff

Raydium liquidity is configured as a fund flow on the sale allocation, not as its own allocation: a `RaydiumLP` flow creates a Raydium CPMM pool, and a `RaydiumClmmLP` flow creates a Raydium CLMM (concentrated liquidity) position. CLMM launches return `403` unless they are enabled for your account.

{% callout type="warning" title="Streamflow allocations are retired" %}
The earlier `lockedV2` (Streamflow) allocation type is no longer accepted. Use `claimScheduleV2` for locked and vesting allocations.
{% /callout %}

### Existing Tokens

Set `useExistingToken: true` and pass the token's `mintAddress` to launch a token you already minted. `decimals` must match the on-chain mint. Unlike a new token, the allocations may fund only part of the supply: their total must be greater than 0 and no more than `supply`, and the rest stays in the creator's wallet. Existing-token launches return `403` unless they are enabled for your account, and are not available for the `bondingCurve` type.

### Agent Launches

Pass `agent` to create the launch with a registered [agent](/agents/) as its creator:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `agent.mint` | `string` | Yes | The agent's Core asset address. It must be owned by `wallet` |
| `agent.setToken` | `boolean` | Yes | Whether to set the launched token as the agent's token |

The agent's asset signer wallet becomes the launch creator. Pass the same `agent.mint` to [Register Launch](/api/register).

{% callout type="note" %}
The SDK's `buildCreateLaunchPayload` function handles converting the simplified `CreateLaunchInput` into this full payload format. See the [API Client](/smart-contracts/genesis/sdk/api-client) docs.
{% /callout %}

## Example Request — Launch Pool Type

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
      "type": "launchpool",
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
| `403` | A feature that is not enabled for your account: custom supply, existing tokens, or CLMM |
| `500` | Internal server error |

## Recommended: Use the SDK

Instead of calling this endpoint directly, use [`createAndRegisterLaunch`](/smart-contracts/genesis/sdk/api-client) which handles the entire flow — creating transactions, signing, sending, and registering — in one call:

{% code-tabs-imported from="genesis/api_easy_mode" frameworks="umi" filename="createAndRegisterLaunch" /%}

See [API Client](/smart-contracts/genesis/sdk/api-client) for the full SDK documentation including all three integration modes.

## Notes

- The [OpenAPI spec](https://api.metaplex.com/v1/openapi.yaml) is the machine-readable contract for this endpoint.
- Use `@metaplex-foundation/genesis` 0.41.1 or later. Earlier versions send allocation names that return `400`. Through 0.43.5, a `launchpool` payload built with unlock schedules, or with no supply left for `Unlocked Tokens`, also returns `400`.
- Launches created before October 22, 2026 keep the earlier failure behavior: the tokens of their Raydium pool and unlock schedules are not returned to `Unlocked Tokens`.
