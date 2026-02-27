---
title: Getting Started
metaTitle: Getting Started with MPL Agent Registry | Metaplex
description: Install the MPL Agent Registry SDK and register your first agent identity on Solana.
created: '02-25-2026'
updated: '02-25-2026'
---

Install the SDK and register your first agent identity. {% .lead %}

## Installation

```shell
npm install @metaplex-foundation/mpl-agent-registry
```

## Setup

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplAgentIdentity } from '@metaplex-foundation/mpl-agent-registry';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplAgentIdentity());
```

## Register an Identity

You need an MPL Core asset. If you don't have one, create it first:

```typescript
import { generateSigner } from '@metaplex-foundation/umi';
import { create, createCollection } from '@metaplex-foundation/mpl-core';
import {
  registerIdentityV1,
  findAgentIdentityV1Pda,
  fetchAgentIdentityV1,
} from '@metaplex-foundation/mpl-agent-registry';

// Create a collection and asset
const collection = generateSigner(umi);
const asset = generateSigner(umi);

await createCollection(umi, {
  collection,
  name: 'Agent Collection',
  uri: 'https://example.com/collection.json',
}).sendAndConfirm(umi);

await create(umi, {
  asset,
  name: 'My Agent',
  uri: 'https://example.com/agent.json',
  collection,
}).sendAndConfirm(umi);

// Register the identity
await registerIdentityV1(umi, {
  asset: asset.publicKey,
  collection: collection.publicKey,
}).sendAndConfirm(umi);

// Verify
const pda = findAgentIdentityV1Pda(umi, { asset: asset.publicKey });
const identity = await fetchAgentIdentityV1(umi, pda);
console.log(identity.asset); // matches asset.publicKey
```

## Verify the AppData Plugin

After registration, the asset will have an `AppData` plugin with the PDA as its data authority:

```typescript
import { fetchAsset } from '@metaplex-foundation/mpl-core';
import { publicKey } from '@metaplex-foundation/umi';

const assetData = await fetchAsset(umi, asset.publicKey);
const pda = findAgentIdentityV1Pda(umi, { asset: asset.publicKey });

const appData = assetData.appDatas?.find(
  (ad) => ad.dataAuthority.type === 'Address'
    && ad.dataAuthority.address === publicKey(pda)
);
console.log('Identity registered:', !!appData);
```

## Next Steps

- **[Agent Identity](/smart-contracts/mpl-agent/identity)** — Full details on the identity program
