---
title: Register an Agent
metaTitle: Register an Agent on Solana | Metaplex Agent Registry
description: Register an agent identity on Solana by binding an identity record to an MPL Core asset.
created: '02-25-2026'
updated: '03-11-2026'
---

Register an agent on Solana by binding an identity record to an MPL Core asset. {% .lead %}

## What You'll Learn
This guide shows you how to register an agent with:

- An identity record linked to an MPL Core asset
- A PDA (Program Derived Address) that makes the agent discoverable on-chain
- An AgentIdentity plugin with lifecycle hooks for Transfer, Update, and Execute

## Prerequisites

You need an MPL Core asset before registering. If you don't already have one, see [Create an NFT](/nfts/create-nft). You can learn more about the identity program in the [MPL Agent Registry](/smart-contracts/mpl-agent) docs.

## Register an Agent

When you register an agent, the registry program creates a PDA derived from the asset's public key. This makes agents discoverable — anyone can derive the PDA from an asset address and check if it has a registered identity.

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

The `agentRegistrationUri` should point to a JSON document that describes the agent's identity, services, and metadata. This follows the [ERC-8004](https://eips.ethereum.org/EIPS/eip-8004) agent registration standard adapted for Solana. You need to upload the JSON and any associated image so that they are accessible from everywhere. We recommend using a web3 storage provider like Arweave. If you want to upload by code you can follow this [guide](/smart-contracts/mpl-hybrid/guides/create-deterministic-metadata-with-turbo).

```json
{
  "type": "agent-registration-v1",
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
      "agentId": "AgentAssetPublicKey111111111111111111111111111",
      "agentRegistry": "solana:mainnet:1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p"
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
| `type` | Yes | Schema identifier. Use `agent-registration-v1`. |
| `name` | Yes | Human-readable agent name |
| `description` | Yes | Natural language description of the agent — what it does, how it works, and how to interact with it |
| `image` | Yes | Avatar or logo URI |
| `services` | No | Array of service endpoints the agent exposes (see below) |
| `active` | No | Whether the agent is currently active (`true`/`false`) |
| `registrations` | No | Array of on-chain registrations linking back to this agent's identity |
| `supportedTrust` | No | Trust models the agent supports (e.g. `reputation`, `crypto-economic`, `tee-attestation`) |

### Services

Each entry in the `services` array describes a way to interact with the agent:

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Service type — e.g. `web`, `A2A`, `MCP`, `OASF`, `DID`, `email` |
| `endpoint` | Yes | URL or identifier where the service can be reached |
| `version` | No | Protocol version |
| `skills` | No | Array of skills the agent exposes through this service |
| `domains` | No | Array of domains the agent operates in |

### Registrations

Each entry in the `registrations` array links back to an on-chain identity record:

| Field | Required | Description |
|-------|----------|-------------|
| `agentId` | Yes | The agent's on-chain asset public key |
| `agentRegistry` | Yes | Registry address in `{namespace}:{chainId}:{programId}` format |

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

// 1. Create an asset (if it doesn't already exist)
const asset = generateSigner(umi);

await create(umi, {
  asset,
  name: 'My Agent',
  uri: 'https://example.com/agent.json',
  collection,
}).sendAndConfirm(umi);

// 2. Register identity
await registerIdentityV1(umi, {
  asset: asset.publicKey,
  collection: collection.publicKey,
  agentRegistrationUri: 'https://example.com/agent-registration.json',
}).sendAndConfirm(umi);
```
