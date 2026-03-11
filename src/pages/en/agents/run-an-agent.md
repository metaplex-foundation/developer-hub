---
title: Run an Agent
metaTitle: Run an Agent on Solana | Metaplex Agent Registry
description: Set up an executive profile and delegate execution to run an autonomous agent on Solana.
keywords:
  - run agent
  - executive profile
  - execution delegation
  - Agent Tools
  - autonomous agent
about:
  - Execution Delegation
  - Solana
  - Metaplex
proficiencyLevel: Intermediate
created: '03-11-2026'
updated: '03-11-2026'
---

Set up an executive profile and delegate execution to run an agent on Solana. {% .lead %}

## Why Delegation Is Needed

Every Core asset has a built-in wallet (the [Asset Signer](/smart-contracts/core/execute-asset-signing)) — a PDA with no private key, which means it can't be stolen. Only the asset itself can sign for that wallet through Core's Execute lifecycle hook.

The problem is that Solana doesn't support background tasks or on-chain inference. An agent can't wake up and submit its own transactions. Something off-chain has to do it. But the agent owner also shouldn't have to sit at their computer approving every action.

Execution delegation bridges this gap. The owner delegates to an **executive** — a trusted off-chain operator that signs transactions on the agent's behalf using the Execute hook. The owner controls _who_ runs their agent without needing to be online for every transaction.

## What Is an Executive?

An executive is an on-chain profile representing a wallet authorized to operate agent assets. Think of it as a service account: you register a wallet as an executive once, and then individual agent owners can delegate execution to it.

This separates **identity** (who the agent is) from **execution** (who operates it). An executive profile is a PDA derived from the wallet's public key — one per wallet. Delegation is per-asset: the agent owner creates a delegation record linking their agent to a specific executive. A single executive can run many agents, and an owner can switch executives without touching the agent's identity.

Every executive profile lives on-chain, so the registry acts as a verifiable directory. Anyone can enumerate profiles, see which agents an executive operates, and inspect delegation history. This lays the groundwork for a reputation layer where executives are rated based on their on-chain track record.

## Prerequisites

You need a [registered agent](/agents/register-agent) with an identity record and AgentIdentity plugin, and the `@metaplex-foundation/mpl-agent-registry` package (v0.2.0+).

## Register an Executive Profile

Before an executive can run any agent, it needs a profile. This is a one-time setup per wallet:

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplAgentTools } from '@metaplex-foundation/mpl-agent-registry';
import { registerExecutiveV1 } from '@metaplex-foundation/mpl-agent-registry';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplAgentTools());

await registerExecutiveV1(umi, {
  payer: umi.payer,
}).sendAndConfirm(umi);
```

The profile PDA is derived from seeds `["executive_profile", <authority>]`, so each wallet can only have one.

## Delegate Execution

With the executive profile in place, the agent asset owner can delegate execution to it. This creates a delegation record on-chain linking the agent to the executive:

```typescript
import { delegateExecutionV1 } from '@metaplex-foundation/mpl-agent-registry';
import { findAgentIdentityV1Pda, findExecutiveProfileV1Pda } from '@metaplex-foundation/mpl-agent-registry';

const agentIdentity = findAgentIdentityV1Pda(umi, { asset: agentAssetPublicKey });
const executiveProfile = findExecutiveProfileV1Pda(umi, { authority: executiveAuthorityPublicKey });

await delegateExecutionV1(umi, {
  agentAsset: agentAssetPublicKey,
  agentIdentity,
  executiveProfile,
}).sendAndConfirm(umi);
```

Only the asset owner can delegate execution. The program validates that:

- The executive profile exists
- The agent asset is a valid MPL Core asset
- The agent has a registered identity
- The signer is the asset owner

## Parameters

### RegisterExecutiveV1

| Parameter | Description |
|-----------|-------------|
| `payer` | Pays for rent and fees (also used as the authority) |
| `authority` | The wallet that owns this executive profile (defaults to `payer`) |

### DelegateExecutionV1

| Parameter | Description |
|-----------|-------------|
| `agentAsset` | The registered agent's MPL Core asset |
| `agentIdentity` | The agent identity PDA for the asset |
| `executiveProfile` | The executive profile PDA to delegate to |
| `payer` | Pays for rent and fees (defaults to `umi.payer`) |
| `authority` | Must be the asset owner (defaults to `payer`) |

## Verify Delegation

To check whether a delegation exists, derive the delegation record PDA and see if the account exists:

```typescript
import {
  findExecutiveProfileV1Pda,
  findExecutionDelegateRecordV1Pda,
} from '@metaplex-foundation/mpl-agent-registry';

const executiveProfile = findExecutiveProfileV1Pda(umi, {
  authority: executiveAuthorityPublicKey,
});

const delegateRecord = findExecutionDelegateRecordV1Pda(umi, {
  executiveProfile,
  agentAsset: agentAssetPublicKey,
});

const account = await umi.rpc.getAccount(delegateRecord);
console.log('Delegated:', account.exists);
```

## Full Example

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplAgentIdentity, mplAgentTools } from '@metaplex-foundation/mpl-agent-registry';
import {
  registerIdentityV1,
  registerExecutiveV1,
  delegateExecutionV1,
  findAgentIdentityV1Pda,
  findExecutiveProfileV1Pda,
} from '@metaplex-foundation/mpl-agent-registry';
import { generateSigner, create } from '@metaplex-foundation/mpl-core';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplAgentIdentity())
  .use(mplAgentTools());

// 1. Create an asset
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

// 3. Register executive profile
await registerExecutiveV1(umi, {
  payer: umi.payer,
}).sendAndConfirm(umi);

// 4. Delegate execution
const agentIdentity = findAgentIdentityV1Pda(umi, { asset: asset.publicKey });
const executiveProfile = findExecutiveProfileV1Pda(umi, { authority: umi.payer.publicKey });

await delegateExecutionV1(umi, {
  agentAsset: asset.publicKey,
  agentIdentity,
  executiveProfile,
}).sendAndConfirm(umi);
```

See the [Agent Tools](/smart-contracts/mpl-agent/tools) smart contract reference for account layouts, PDA derivation details, and error codes.
