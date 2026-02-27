---
title: Register an Agent
metaTitle: Register an Agent on Solana | Metaplex Agent Registry
description: Register an agent identity on Solana by binding an identity record to an MPL Core asset.
created: '02-25-2026'
updated: '02-25-2026'
---

Register an agent on Solana by binding an identity record to an MPL Core asset. {% .lead %}

## What You'll Learn
This guide shows you how to register an agent with:

- An identity record linked to an MPL Core asset
- A PDA (Program Derived Address) that makes the agent discoverable on-chain
- An AppData plugin for tamper-evident verification

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
}).sendAndConfirm(umi);
```

## Parameters

| Parameter | Description |
|-----------|-------------|
| `asset` | The MPL Core asset to register |
| `collection` | The asset's collection (optional) |
| `payer` | Pays for rent and fees (defaults to `umi.payer`) |
| `authority` | Collection authority (defaults to `payer`) |

## Verify Registration

```typescript
import { findAgentIdentityV1Pda, fetchAgentIdentityV1 } from '@metaplex-foundation/mpl-agent-registry';

const pda = findAgentIdentityV1Pda(umi, { asset: assetPublicKey });
const identity = await fetchAgentIdentityV1(umi, pda);
console.log(identity.asset); // matches assetPublicKey
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
}).sendAndConfirm(umi);
```
