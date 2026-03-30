---
title: Register an Agent
metaTitle: Register an Agent on Solana | Metaplex 014 Agent Registry
description: Register an agent identity on the Metaplex 014 agent registry by binding an identity record to an MPL Core asset.
keywords:
  - register agent
  - agent identity
  - MPL Core
  - AgentIdentity plugin
  - ERC-8004
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Agent Registration
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '02-25-2026'
updated: '03-30-2026'
---

Register an agent on the Metaplex 014 agent registry by binding an identity record to an MPL Core asset. {% .lead %}

## Summary

The `registerIdentityV1` instruction binds an on-chain identity record to an MPL Core asset, creating a discoverable PDA and attaching lifecycle hooks for Transfer, Update, and Execute.

- **Creates** a PDA derived from the asset's public key for on-chain discoverability
- **Attaches** an `AgentIdentity` plugin with lifecycle hooks to the Core asset
- **Links** to an off-chain registration document following [ERC-8004](https://eips.ethereum.org/EIPS/eip-8004) for agent metadata
- **Requires** an existing MPL Core asset and the `@metaplex-foundation/mpl-agent-registry` SDK

## Quick Start

1. [Prerequisites](#prerequisites) — Get an MPL Core asset and install the SDK
2. [Register an Agent](#register-an-agent) — Call `registerIdentityV1` to bind identity
3. [Agent Registration Document](#agent-registration-document) — Create the off-chain metadata JSON
4. [Verify Registration](#verify-registration) — Confirm the identity was attached
5. [Full Example](#full-example) — End-to-end code sample

## What You'll Learn
This guide shows you how to register an agent with:

- An identity record linked to an MPL Core asset
- A PDA (Program Derived Address) that makes the agent discoverable on-chain
- An AgentIdentity plugin with lifecycle hooks for Transfer, Update, and Execute

## Prerequisites

You need an MPL Core asset before registering. If you don't have one yet, see [Create an NFT](/nfts/create-nft). For more on the identity program itself, see the [MPL Agent Registry](/smart-contracts/mpl-agent) docs.

## Register an Agent

Registration creates a PDA derived from the asset's public key and attaches an `AgentIdentity` plugin with lifecycle hooks for Transfer, Update, and Execute. The PDA makes agents discoverable — anyone can derive it from an asset address and check whether it has a registered identity.

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

## Parameters

| Parameter | Description |
|-----------|-------------|
| `asset` | The MPL Core asset to register |
| `collection` | The asset's collection (optional) |
| `agentRegistrationUri` | URI pointing to off-chain agent registration metadata |
| `payer` | Pays for rent and fees (defaults to `umi.payer`) |
| `authority` | Collection authority (defaults to `payer`) |

## Agent Registration Document

The `agentRegistrationUri` points to a JSON document describing the agent's identity, services, and metadata. The format follows [ERC-8004](https://eips.ethereum.org/EIPS/eip-8004) adapted for Solana. Upload the JSON (and any associated image) to a permanent storage provider like Arweave so it's publicly accessible. For programmatic uploads, see this [guide](/smart-contracts/mpl-hybrid/guides/create-deterministic-metadata-with-turbo).

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

## Full Example

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

- Registration is a one-time operation per asset. Calling `registerIdentityV1` on an already-registered asset will fail.
- The `agentRegistrationUri` should point to permanently hosted JSON (e.g. Arweave). If the URI becomes unreachable, the on-chain identity still exists but clients won't be able to fetch the agent's metadata.
- The `collection` parameter is optional but recommended — it enables collection-level authority checks during registration.
- Lifecycle hooks for Transfer, Update, and Execute are automatically attached. These hooks allow the identity plugin to participate in approving or rejecting operations on the asset.
- Linking a Genesis token via `setAgentTokenV1` is optional and can be done at any time after registration.
