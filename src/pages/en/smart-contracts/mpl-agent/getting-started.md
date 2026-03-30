---
title: Getting Started
metaTitle: Getting Started with MPL Agent Registry | Metaplex
description: Install the MPL Agent Registry SDK and register your first agent identity on Solana.
keywords:
  - MPL Agent Registry
  - getting started
  - agent identity SDK
  - Umi
  - Solana
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Smart Contracts
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '02-25-2026'
updated: '03-12-2026'
---

Install the SDK and register your first agent identity. {% .lead %}

## Summary

Install the `@metaplex-foundation/mpl-agent-registry` package, configure Umi with the identity and tools plugins, and register your first agent identity on an MPL Core asset.

- **Install** the SDK via npm and configure Umi with `mplAgentIdentity()` and `mplAgentTools()`
- **Create** an MPL Core collection and asset if you don't already have one
- **Register** an identity with `registerIdentityV1` and verify the attached `AgentIdentity` plugin
- **Requires** `@metaplex-foundation/umi-bundle-defaults` and `@metaplex-foundation/mpl-core`

{% callout title="Prefer a single API call?" %}
The [Mint Agent API](/agents/mint-agent) creates a Core asset and registers the identity in one step — no manual asset creation or SDK setup required. Use this page if you need fine-grained control over the registration process.
{% /callout %}

## Installation

```shell
npm install @metaplex-foundation/mpl-agent-registry
```

## Setup

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCore } from '@metaplex-foundation/mpl-core';
import { mplAgentIdentity, mplAgentTools } from '@metaplex-foundation/mpl-agent-registry';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplCore())
  .use(mplAgentIdentity())
  .use(mplAgentTools());
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

// Register the identity with a URI pointing to agent metadata
await registerIdentityV1(umi, {
  asset: asset.publicKey,
  collection: collection.publicKey,
  agentRegistrationUri: 'https://example.com/agent-registration.json',
}).sendAndConfirm(umi);

// Verify
const pda = findAgentIdentityV1Pda(umi, { asset: asset.publicKey });
const identity = await fetchAgentIdentityV1(umi, pda);
console.log(identity.asset); // matches asset.publicKey
```

## Verify the AgentIdentity Plugin

After registration, the asset will have an `AgentIdentity` plugin with the URI and lifecycle checks:

```typescript
import { fetchAsset } from '@metaplex-foundation/mpl-core';

const assetData = await fetchAsset(umi, asset.publicKey);

// Check the AgentIdentity plugin
const agentIdentity = assetData.agentIdentities?.[0];
console.log(agentIdentity?.uri);               // 'https://example.com/agent-registration.json'
console.log(agentIdentity?.lifecycleChecks?.transfer);  // truthy
console.log(agentIdentity?.lifecycleChecks?.update);    // truthy
console.log(agentIdentity?.lifecycleChecks?.execute);   // truthy
```

## Next Steps

- **[Agent Identity](/smart-contracts/mpl-agent/identity)** — Full details on the identity program
- **[Agent Tools](/smart-contracts/mpl-agent/tools)** — Executive profiles and execution delegation