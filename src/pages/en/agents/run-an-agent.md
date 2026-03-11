---
title: Run an Agent
metaTitle: Run an Agent on Solana | Metaplex Agent Registry
description: Set up an executive profile and delegate execution to run an autonomous agent on Solana.
created: '03-11-2026'
updated: '03-11-2026'
---

Set up an executive profile and delegate execution permissions to run an autonomous agent on Solana. {% .lead %}

## What You'll Learn

This guide shows you how to:

- Create an executive profile that can act on behalf of agent assets
- Delegate execution from a registered agent asset to an executive
- Verify delegation on-chain

## Why Delegation Is Needed

Every MPL Core asset has a built-in wallet — a PDA derived from the asset's public key. This wallet is **unstealable** because no private key exists for it. Only the asset can sign for its own wallet through Core's Execute lifecycle hook.

But Solana doesn't support background tasks or on-chain inference. An agent can't wake up and submit its own transactions — something off-chain has to sign and send them. At the same time, the agent owner shouldn't need to manually approve every action their agent takes.

Execution delegation solves this. The owner delegates to an **executive** — a trusted off-chain operator that signs transactions on the agent's behalf using the Execute hook. The owner stays in control of _who_ runs their agent without needing to be online for every transaction.

## What Is an Executive?

An executive is an on-chain profile that represents an entity authorized to act on behalf of agent assets. Think of it as a service account — a wallet registers itself as an executive once, and then individual agent asset owners can delegate execution to that executive.

This two-step model separates **identity** (who the agent is) from **execution** (who operates it):

1. **Executive profile** — A one-time registration for any wallet that wants to run agents. The profile is a PDA derived from the wallet's public key.
2. **Execution delegation** — An agent asset owner grants a specific executive permission to act on behalf of their agent. The delegation record is a PDA derived from the executive profile and the agent asset.

This means a single executive can run multiple agents, and an agent owner can switch executives without re-registering the agent's identity.

Because every executive profile is registered on-chain, the registry provides a verifiable directory of all executives. Anyone can enumerate executive profiles, check which agents they operate, and inspect their delegation history. This forms the foundation for a future reputation system where executives can be rated based on their on-chain behavior.

## Prerequisites

- A [registered agent](/agents/register-agent) with an identity record and AgentIdentity plugin
- The `@metaplex-foundation/mpl-agent-registry` package (v0.2.0+)

## Register an Executive Profile

Before an executive can run any agent, it needs a profile. This is a one-time setup per wallet.

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

The program creates a PDA from seeds `["executive_profile", <authority>]`. Since the PDA is derived from the authority's public key, each wallet can only have one executive profile.

## Delegate Execution

Once an executive profile exists, the agent asset owner can delegate execution to it. This creates a delegation record linking the agent asset to the executive.

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

Check whether a delegation record exists between an executive and an agent asset:

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

For technical details on accounts, PDA layouts, and error codes, see the [Agent Tools](/smart-contracts/mpl-agent/tools) smart contract reference.
