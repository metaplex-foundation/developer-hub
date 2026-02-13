---
title: Create Launch
metaTitle: Genesis - Create Launch | REST API | Metaplex
description: Create a new Genesis token launch via the REST API. Returns unsigned transactions for the creator to sign and send on-chain.
method: POST
created: '02-13-2026'
updated: '02-13-2026'
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
  - Rust
---

Create a new Genesis token launch. The API builds all required on-chain transactions and returns them unsigned for the creator to sign and submit. {% .lead %}

{% callout type="note" %}
For a higher-level interface that handles signing, sending, and registration automatically, see the [API Client SDK](/smart-contracts/genesis/sdk/api-client).
{% /callout %}

## Endpoint

```
POST /launches/create
```

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `wallet` | `string` | Yes | Creator's wallet public key |
| `launch` | `object` | Yes | Launch configuration (see below) |

### Launch Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | `string` | Yes | Launch type. Use `"project"` |
| `name` | `string` | Yes | Token name (1–32 characters) |
| `symbol` | `string` | Yes | Token ticker symbol (1–10 characters) |
| `image` | `string` | Yes | Token image URL (Irys gateway URL) |
| `description` | `string` | No | Token description (max 250 characters) |
| `externalLinks` | `object` | No | Social links (`website`, `twitter`, `telegram`) |
| `publicKey` | `string` | Yes | Creator's wallet public key |
| `network` | `string` | No | `"solana-devnet"` for devnet (omit for mainnet) |
| `quoteMint` | `string` | No | Quote token mint address (omit for SOL) |
| `allocations` | `array` | Yes | Token allocation configuration |

### Allocations

Each allocation defines how a portion of the token supply is distributed. At minimum, one `launchpoolV2` allocation is required.

#### Launchpool Allocation

```json
{
  "type": "launchpoolV2",
  "name": "Launchpool",
  "supply": 500000000,
  "launchpoolV2": {
    "depositStartCondition": { "type": "TimeAbsolute", "timestamp": "2026-03-01T00:00:00.000Z" },
    "depositEndCondition": { "type": "TimeAbsolute", "timestamp": "2026-03-03T00:00:00.000Z" },
    "claimStartCondition": { "type": "TimeAbsolute", "timestamp": "2026-03-03T00:00:01.000Z" },
    "claimEndCondition": { "type": "TimeAbsolute", "timestamp": "9999-12-31T23:59:59.999Z" },
    "minimumQuoteTokenThreshold": 200,
    "depositBonus": {},
    "withdrawPenalty": {},
    "fundFlows": [...]
  }
}
```

#### Locked Allocation (Streamflow Vesting)

```json
{
  "type": "lockedV2",
  "name": "Team",
  "supply": 100000000,
  "lockedV2": {
    "type": "streamflow",
    "vesting": {
      "recipient": "TeamWallet...",
      "startTime": "2026-03-03T00:00:00.000Z",
      "durationValue": 2,
      "durationUnit": "YEAR",
      "unlockSchedule": "MONTH",
      "cliff": { "enabled": true, "durationValue": 6, "durationUnit": "MONTH" }
    }
  }
}
```

### Fund Flows

Fund flows define what happens to raised quote tokens after the deposit period ends.

| Type | Description |
|------|-------------|
| `MinimumQuoteTokenThreshold` | Refund flow if raise goal is not met |
| `UnlockedFunds` | Portion sent to funds recipient |
| `RaydiumLP` | Portion used to create Raydium liquidity pool |

## Example Request

```bash
curl -X POST https://api.metaplex.com/v1/launches/create \
  -H "Content-Type: application/json" \
  -d '{
    "wallet": "CreatorWallet...",
    "launch": {
      "type": "project",
      "name": "My Token",
      "symbol": "MTK",
      "image": "https://gateway.irys.xyz/...",
      "publicKey": "CreatorWallet...",
      "allocations": [
        {
          "type": "launchpoolV2",
          "name": "Launchpool",
          "supply": 500000000,
          "launchpoolV2": {
            "depositStartCondition": { "type": "TimeAbsolute", "timestamp": "2026-03-01T00:00:00.000Z" },
            "depositEndCondition": { "type": "TimeAbsolute", "timestamp": "2026-03-03T00:00:00.000Z" },
            "claimStartCondition": { "type": "TimeAbsolute", "timestamp": "2026-03-03T00:00:01.000Z" },
            "claimEndCondition": { "type": "TimeAbsolute", "timestamp": "9999-12-31T23:59:59.999Z" },
            "minimumQuoteTokenThreshold": 200,
            "depositBonus": {},
            "withdrawPenalty": {},
            "fundFlows": [
              {
                "type": "MinimumQuoteTokenThreshold",
                "recipient": "CreatorWallet...",
                "claimStartCondition": { "type": "TimeAbsolute", "timestamp": "2026-03-03T00:00:01.000Z" },
                "claimEndCondition": { "type": "TimeAbsolute", "timestamp": "9999-12-31T23:59:59.999Z" }
              },
              {
                "type": "UnlockedFunds",
                "percentageBps": 5000,
                "recipient": "RecipientWallet...",
                "claimStartCondition": { "type": "TimeAbsolute", "timestamp": "2026-03-03T00:00:01.000Z" },
                "claimEndCondition": { "type": "TimeAbsolute", "timestamp": "9999-12-31T23:59:59.999Z" }
              },
              {
                "type": "RaydiumLP",
                "percentageBps": 5000,
                "supply": 250000000,
                "startCondition": { "type": "TimeAbsolute", "timestamp": "2026-03-03T00:00:01.000Z" }
              }
            ]
          }
        }
      ]
    }
  }'
```

## Response

### Success (200)

```json
{
  "success": true,
  "transactions": ["base64-encoded-tx-1", "base64-encoded-tx-2"],
  "blockhash": {
    "blockhash": "...",
    "lastValidBlockHeight": 123456789
  },
  "mintAddress": "TokenMint...",
  "genesisAccount": "GenesisAccount..."
}
```

| Field | Type | Description |
|-------|------|-------------|
| `success` | `boolean` | Whether the request succeeded |
| `transactions` | `string[]` | Base64-encoded serialized transactions |
| `blockhash` | `object` | Blockhash for transaction confirmation |
| `mintAddress` | `string` | The created token's mint address |
| `genesisAccount` | `string` | The genesis account PDA address |

{% callout type="warning" title="Transaction Order Matters" %}
Transactions must be signed and sent **sequentially** in the order returned. Each transaction may depend on accounts created by previous ones. Confirm each transaction before sending the next.
{% /callout %}

### Error

```json
{
  "success": false,
  "error": "Description of what went wrong"
}
```

## Usage with the SDK

The [API Client](/smart-contracts/genesis/sdk/api-client) provides `createLaunch()` which calls this endpoint, deserializes the transactions into Umi `Transaction` objects, and returns them ready to sign:

```typescript
import { createLaunch } from '@metaplex-foundation/genesis';

const result = await createLaunch(umi, {}, {
  wallet: umi.identity.publicKey,
  token: { name: 'My Token', symbol: 'MTK', image: 'https://gateway.irys.xyz/...' },
  launchpool: {
    tokenAllocation: 500_000_000,
    depositStartTime: new Date('2026-03-01T00:00:00Z'),
    raiseGoal: 200,
    raydiumLiquidityBps: 5000,
    fundsRecipient: 'RecipientWallet...',
  },
});

// result.transactions are deserialized Umi Transaction objects
```

## Errors

| Code | Description |
|------|-------------|
| `400` | Invalid request body or validation failure |
| `429` | Rate limit exceeded |
| `500` | Internal server error |
