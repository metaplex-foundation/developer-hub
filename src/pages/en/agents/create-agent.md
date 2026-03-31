---
title: Create an Agent
metaTitle: Create an Agent on Solana | Metaplex Agent Registry
description: Create and register an agent on Solana — use the Metaplex Agent API for a single-call flow, or register an existing MPL Core asset manually.
keywords:
  - create agent
  - mint agent
  - register agent
  - Agent API
  - agent identity
  - MPL Core
  - AgentIdentity plugin
  - ERC-8004
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Agent Creation
  - Agent Registration
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '03-30-2026'
updated: '03-30-2026'
---

Create and register an agent on Solana — use the Metaplex Agent API for a single-call flow, or register an existing [MPL Core](/smart-contracts/core) asset manually with `registerIdentityV1`. {% .lead %}

## Summary

Creating an agent means minting an MPL Core asset and binding an on-chain identity record to it. The Metaplex Agent API does both in a single transaction. If you already have a Core asset, you can register identity directly with the on-chain instruction instead.

- **API path (recommended)** — `mintAndSubmitAgent` creates the asset and registers identity in one call
- **Manual path** — `registerIdentityV1` binds identity to an existing Core asset
- **Identity record** — a PDA derived from the asset's public key, with an `AgentIdentity` plugin and lifecycle hooks
- **Registration document** — off-chain JSON following [ERC-8004](https://eips.ethereum.org/EIPS/eip-8004) describing the agent's services and metadata
- **Requires** the `@metaplex-foundation/mpl-agent-registry` SDK

## Quick Start

1. [Install the SDK](#install-the-sdk) — Add the agent registry package
2. [Mint with the API](#mint-an-agent-with-the-api) — Fastest path to a registered agent (recommended)
3. [Register an existing asset](#register-an-existing-asset) — For users who already have an MPL Core asset
4. [Agent Registration Document](#agent-registration-document) — Structure of the off-chain metadata
5. [Verify Registration](#verify-registration) — Confirm the identity was attached

## Install the SDK

```shell
npm install @metaplex-foundation/mpl-agent-registry @metaplex-foundation/umi-bundle-defaults
```

## Mint an Agent with the API

The Metaplex Agent API creates an MPL Core asset and registers its identity in a single transaction. This is the recommended path for new agents.

### Mint and Submit in One Call

The `mintAndSubmitAgent` function calls the API, signs the returned transaction, and sends it to the network:

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mintAndSubmitAgent } from '@metaplex-foundation/mpl-agent-registry';

const umi = createUmi('https://api.mainnet-beta.solana.com');

const result = await mintAndSubmitAgent(umi, {}, {
  wallet: umi.identity.publicKey,
  name: 'My AI Agent',
  uri: 'https://example.com/agent-metadata.json',
  agentMetadata: {
    type: 'agent',
    name: 'My AI Agent',
    description: 'An autonomous agent that executes DeFi strategies on Solana.',
    services: [
      { name: 'web', endpoint: 'https://myagent.ai' },
      { name: 'A2A', endpoint: 'https://myagent.ai/agent-card.json' },
    ],
    registrations: [],
    supportedTrust: ['reputation'],
  },
});

console.log('Agent minted! Asset:', result.assetAddress);
console.log('Signature:', result.signature);
```

#### mintAndSubmitAgent Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `wallet` | Yes | The agent owner's wallet public key (signs the transaction) |
| `name` | Yes | Display name for the Core asset |
| `uri` | Yes | Metadata URI for the Core asset |
| `agentMetadata` | Yes | On-chain agent metadata (see [Agent Registration Document](#agent-registration-document)) |
| `network` | No | Target network (defaults to `solana-mainnet`) |

#### mintAndSubmitAgent Return Value

| Field | Type | Description |
|-------|------|-------------|
| `signature` | `Uint8Array` | The transaction signature |
| `assetAddress` | `string` | The Core asset address of the minted agent |

### Mint with a Separate Signing Step

The `mintAgent` function returns an unsigned transaction for custom signing flows — useful when you need additional signers or a hardware wallet:

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mintAgent, signAndSendAgentTransaction } from '@metaplex-foundation/mpl-agent-registry';

const umi = createUmi('https://api.mainnet-beta.solana.com');

// Step 1: Get the unsigned transaction from the API
const mintResult = await mintAgent(umi, {}, {
  wallet: umi.identity.publicKey,
  name: 'My AI Agent',
  uri: 'https://example.com/agent-metadata.json',
  agentMetadata: {
    type: 'agent',
    name: 'My AI Agent',
    description: 'An autonomous agent.',
    services: [],
    registrations: [],
    supportedTrust: [],
  },
});

console.log('Asset address:', mintResult.assetAddress);

// Step 2: Sign and send
const signature = await signAndSendAgentTransaction(umi, mintResult);
```

#### mintAgent Return Value

| Field | Type | Description |
|-------|------|-------------|
| `transaction` | `Transaction` | Deserialized Umi transaction ready to be signed |
| `blockhash` | `BlockhashWithExpiryBlockHeight` | Blockhash for transaction validity |
| `assetAddress` | `string` | The Core asset address |

### API Configuration

Pass an `AgentApiConfig` object as the second argument to customize the API endpoint or fetch implementation:

| Option | Default | Description |
|--------|---------|-------------|
| `baseUrl` | `https://api.metaplex.com` | Base URL of the Metaplex API |
| `fetch` | `globalThis.fetch` | Custom fetch implementation (useful for Node.js or testing) |

```typescript
const result = await mintAndSubmitAgent(
  umi,
  { baseUrl: 'https://api.metaplex.com' },
  input
);
```

### Supported Networks

The `network` parameter controls which SVM network the agent is minted on:

| Network ID | Description |
|------------|-------------|
| `solana-mainnet` | Solana Mainnet (default) |
| `solana-devnet` | Solana Devnet |
| `localnet` | Local validator |
| `eclipse-mainnet` | Eclipse Mainnet |
| `sonic-mainnet` | Sonic Mainnet |
| `sonic-devnet` | Sonic Devnet |
| `fogo-mainnet` | Fogo Mainnet |
| `fogo-testnet` | Fogo Testnet |

### API Error Handling

The API client throws typed errors you can catch and inspect:

| Error Type | Description |
|------------|-------------|
| `AgentApiError` | HTTP response error — includes `statusCode` and `responseBody` |
| `AgentApiNetworkError` | Network connectivity issue — includes the underlying `cause` |
| `AgentValidationError` | Client-side validation failure — includes the `field` that failed |

```typescript
import {
  isAgentApiError,
  isAgentApiNetworkError,
} from '@metaplex-foundation/mpl-agent-registry';

try {
  const result = await mintAndSubmitAgent(umi, {}, input);
} catch (err) {
  if (isAgentApiError(err)) {
    console.error('API error:', err.statusCode, err.responseBody);
  } else if (isAgentApiNetworkError(err)) {
    console.error('Network error:', err.cause.message);
  }
}
```

## Register an Existing Asset

If you already have an MPL Core asset, use the `registerIdentityV1` instruction to bind an identity record directly — without the API.

{% callout type="note" %}
If you don't have an asset yet, use the [API path above](#mint-an-agent-with-the-api) instead. It creates the asset and registers identity in a single transaction.
{% /callout %}

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplAgentIdentity } from '@metaplex-foundation/mpl-agent-registry';
import { registerIdentityV1 } from '@metaplex-foundation/mpl-agent-registry';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplAgentIdentity());

await registerIdentityV1(umi, {
  asset: assetPublicKey,
  collection: collectionPublicKey,
  agentRegistrationUri: 'https://example.com/agent-registration.json',
}).sendAndConfirm(umi);
```

### registerIdentityV1 Parameters

| Parameter | Description |
|-----------|-------------|
| `asset` | The MPL Core asset to register |
| `collection` | The asset's collection (optional) |
| `agentRegistrationUri` | URI pointing to off-chain agent registration metadata |
| `payer` | Pays for rent and fees (defaults to `umi.payer`) |
| `authority` | Collection authority (defaults to `payer`) |

### Full Manual Example

```typescript
import { generateSigner } from '@metaplex-foundation/umi';
import { create, createCollection } from '@metaplex-foundation/mpl-core';
import { registerIdentityV1 } from '@metaplex-foundation/mpl-agent-registry';

// 1. Create a collection
const collection = generateSigner(umi);
await createCollection(umi, {
  collection,
  name: 'Agent Collection',
  uri: 'https://example.com/collection.json',
}).sendAndConfirm(umi);

// 2. Create an asset
const asset = generateSigner(umi);
await create(umi, {
  asset,
  name: 'My Agent',
  uri: 'https://example.com/agent.json',
  collection,
}).sendAndConfirm(umi);

// 3. Register identity
await registerIdentityV1(umi, {
  asset: asset.publicKey,
  collection: collection.publicKey,
  agentRegistrationUri: 'https://example.com/agent-registration.json',
}).sendAndConfirm(umi);
```

## Agent Registration Document

The `agentRegistrationUri` (manual path) or `agentMetadata` (API path) describes the agent's identity, services, and metadata. The format follows [ERC-8004](https://eips.ethereum.org/EIPS/eip-8004) adapted for Solana. Upload the JSON (and any associated image) to a permanent storage provider like Arweave so it's publicly accessible.

```json
{
  "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  "name": "Plexpert",
  "description": "An informational agent providing help related to Metaplex protocols and tools.",
  "image": "https://arweave.net/agent-avatar-tx-hash",
  "services": [
    {
      "name": "web",
      "endpoint": "https://metaplex.com/agent/<ASSET_PUBKEY>"
    },
    {
      "name": "A2A",
      "endpoint": "https://metaplex.com/agent/<ASSET_PUBKEY>/agent-card.json",
      "version": "0.3.0"
    },
    {
      "name": "MCP",
      "endpoint": "https://metaplex.com/agent/<ASSET_PUBKEY>/mcp",
      "version": "2025-06-18"
    }
  ],
  "active": true,
  "registrations": [
    {
      "agentId": "<MINT_ADDRESS>",
      "agentRegistry": "solana:101:metaplex"
    }
  ],
  "supportedTrust": [
    "reputation",
    "crypto-economic"
  ]
}
```

### Fields

| Field | Required | Description |
|-------|----------|-------------|
| `type` | Yes | Schema identifier. Use `https://eips.ethereum.org/EIPS/eip-8004#registration-v1`. |
| `name` | Yes | Human-readable agent name |
| `description` | Yes | Natural language description of the agent — what it does, how it works, and how to interact with it |
| `image` | Yes | Avatar or logo URI |
| `services` | No | Array of service endpoints the agent exposes (see below) |
| `active` | No | Whether the agent is currently active (`true`/`false`) |
| `registrations` | No | Array of on-chain registrations linking back to this agent's identity |
| `supportedTrust` | No | Trust models the agent supports (e.g. `reputation`, `crypto-economic`, `tee-attestation`) |

### Services

Each service entry describes a way to interact with the agent:

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Service type — e.g. `web`, `A2A`, `MCP`, `OASF`, `DID`, `email` |
| `endpoint` | Yes | URL or identifier where the service can be reached |
| `version` | No | Protocol version |
| `skills` | No | Array of skills the agent exposes through this service |
| `domains` | No | Array of domains the agent operates in |

### Registrations

Each registration entry links back to an on-chain identity record:

| Field | Required | Description |
|-------|----------|-------------|
| `agentId` | Yes | The agent's mint address |
| `agentRegistry` | Yes | Constant registry identifier — use `solana:101:metaplex` |

## Verify Registration

```typescript
import { fetchAsset } from '@metaplex-foundation/mpl-core';

const assetData = await fetchAsset(umi, assetPublicKey);

// Check the AgentIdentity plugin
const agentIdentity = assetData.agentIdentities?.[0];
console.log(agentIdentity?.uri);               // your registration URI
console.log(agentIdentity?.lifecycleChecks?.transfer);  // truthy
console.log(agentIdentity?.lifecycleChecks?.update);    // truthy
console.log(agentIdentity?.lifecycleChecks?.execute);   // truthy
```

## Link a Genesis Token

After registering an identity, you can optionally link a [Genesis](/smart-contracts/genesis) token to the agent using `setAgentTokenV1`. This associates a token launch with the agent's on-chain identity. The Genesis account must use the `Mint` funding mode.

```typescript
import { setAgentTokenV1 } from '@metaplex-foundation/mpl-agent-registry';

await setAgentTokenV1(umi, {
  asset: asset.publicKey,
  genesisAccount: genesisAccountPublicKey,
}).sendAndConfirm(umi);
```

{% callout type="note" %}
The agent token can only be set once per identity. The `authority` for this instruction must be the asset's [Asset Signer](/smart-contracts/core/execute-asset-signing) PDA. See the [Agent Identity](/smart-contracts/mpl-agent/identity#instruction-setagenttokenv1) reference for full account details.
{% /callout %}

## Notes

- The Metaplex API creates the Core asset and registers the identity in a single transaction. You do not need to call `registerIdentityV1` separately when using the API.
- The `uri` parameter (API path) points to the Core asset's metadata (name, image, etc.), while `agentMetadata` contains the agent-specific registration data (services, trust mechanisms).
- Transactions returned by `mintAgent` include a blockhash and must be signed and submitted before the blockhash expires (roughly 60–90 seconds).
- Registration via `registerIdentityV1` is a one-time operation per asset. Calling it on an already-registered asset will fail.
- The `agentRegistrationUri` should point to permanently hosted JSON (e.g. Arweave). If the URI becomes unreachable, the on-chain identity still exists but clients won't be able to fetch the agent's metadata.
- The `collection` parameter is optional but recommended — it enables collection-level authority checks during registration.
- Lifecycle hooks for Transfer, Update, and Execute are automatically attached. These hooks allow the identity plugin to participate in approving or rejecting operations on the asset.
- Linking a Genesis token via `setAgentTokenV1` is optional and can be done at any time after registration.

*Maintained by [Metaplex](https://github.com/metaplex-foundation) · Last verified March 2026*
