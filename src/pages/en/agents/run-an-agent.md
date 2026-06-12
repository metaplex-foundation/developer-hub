---
title: Run an Agent
metaTitle: Run an Agent on Solana | Metaplex Agent Registry
description: Set up an executive profile, delegate execution, and understand the security model for running an autonomous agent on Solana.
keywords:
  - run agent
  - executive profile
  - execution delegation
  - revoke execution
  - Agent Tools
  - autonomous agent
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Execution Delegation
  - Solana
  - Metaplex
proficiencyLevel: Intermediate
created: '03-11-2026'
updated: '06-02-2026'
faqs:
  - q: What exactly does RevokeExecutionV1 stop?
    a: It closes the ExecutionDelegateRecordV1 so that executive can no longer trigger Execute through the AgentIdentity path. It does not modify SPL Token approvals or other downstream state created by previous executions — see the security model for details.
  - q: Who can sign RevokeExecutionV1?
    a: Either the asset owner or the executive authority recorded on the delegation. The asset owner can revoke without executive cooperation, and the executive can step down without owner involvement.
  - q: How do I clean up an SPL token approval that was granted during a previous execution?
    a: Call SPL Token's Revoke instruction on the affected token account through Core's Execute path. The asset owner can drive this directly without an active executive, because Core Execute validates the owner as a signer.
---

Set up an executive profile, delegate execution, and revoke delegates to run an agent on Solana. {% .lead %}

## Summary

Execution delegation allows an off-chain executive to sign transactions on behalf of an agent asset, bridging the gap between on-chain identity and off-chain operation.

- **Register an executive profile** — a one-time on-chain setup per wallet that creates a verifiable operator identity
- **Delegate execution** — the asset owner links their agent to a specific executive via an on-chain delegation record
- **Verify delegation** — derive the delegation record PDA and check whether the account exists
- **Revoke execution** — close the delegation record to stop future Execute calls from that executive
- **Requires** a [registered agent](/agents/register-agent) and the `@metaplex-foundation/mpl-agent-registry` package (v0.2.0+)

For the lifecycle and security semantics of delegation — including what an executive can do, what revocation covers, and what survives asset transfer — see the [Security model](/smart-contracts/mpl-agent/tools#security-model) on the Agent Tools reference.

## Quick Start

1. [Why Delegation Is Needed](#why-delegation-is-needed) — Understand the problem delegation solves
2. [Register an Executive Profile](#register-an-executive-profile) — One-time setup per wallet
3. [Delegate Execution](#delegate-execution) — Link agent to executive
4. [Verify Delegation](#verify-delegation) — Confirm the delegation record exists
5. [Revoke Execution](#revoke-execution) — Close a delegation record
6. [Clean Up an SPL Approval](#example-clean-up-an-spl-approval) — Owner cleanup of downstream state
7. [Full Example](#full-example) — End-to-end code sample

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

{% callout title="Operational authority" %}
An execution delegate may cause the agent's Asset Signer PDA to sign any instruction passed through Core's Execute hook. Delegate only to operators you trust to run the agent, and review the [Security model](/smart-contracts/mpl-agent/tools#security-model) on the Agent Tools reference for the full lifecycle semantics.
{% /callout %}

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

## Revoke Execution

`RevokeExecutionV1` closes the delegation record so the executive can no longer trigger Execute through the AgentIdentity path. Either the asset owner or the executive authority recorded on the delegation can sign.

```typescript
import {
  revokeExecutionV1,
  findExecutiveProfileV1Pda,
  findExecutionDelegateRecordV1Pda,
} from '@metaplex-foundation/mpl-agent-registry';

const executiveProfile = findExecutiveProfileV1Pda(umi, {
  authority: executiveAuthorityPublicKey,
});

const executionDelegateRecord = findExecutionDelegateRecordV1Pda(umi, {
  executiveProfile,
  agentAsset: agentAssetPublicKey,
});

await revokeExecutionV1(umi, {
  executionDelegateRecord,
  agentAsset: agentAssetPublicKey,
  destination: umi.payer.publicKey, // refunded rent recipient
}).sendAndConfirm(umi);
```

The program validates that the signer is the asset owner or the executive authority on the record, then closes the `ExecutionDelegateRecordV1` account and refunds its rent to `destination`. Revocation stops future executions through the AgentIdentity path; it does not unwind state created by previous executions. To clean up an SPL approval granted during a previous execution, see [Clean Up an SPL Approval](#example-clean-up-an-spl-approval) below. For the full lifecycle, see the [Security model](/smart-contracts/mpl-agent/tools#security-model).

## Example: Clean Up an SPL Approval

If a previous execution granted an SPL Token approval on a token account owned by the Asset Signer PDA, the approval persists after `RevokeExecutionV1` and must be revoked through the SPL Token program. The asset owner can drive this directly via Core's Execute path — no active executive is required, because Core Execute validates the asset owner as a signer.

```typescript {% title="clean-up-spl-approval.ts" %}
import { execute, findAssetSignerPda, fetchAsset, fetchCollection } from '@metaplex-foundation/mpl-core';
import { revokeTokenDelegate, findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox';
import { createNoopSigner, publicKey } from '@metaplex-foundation/umi';

const asset = await fetchAsset(umi, agentAssetPublicKey);
const collection = asset.updateAuthority.type === 'Collection' && asset.updateAuthority.address
  ? await fetchCollection(umi, asset.updateAuthority.address)
  : undefined;

const assetSignerPda = findAssetSignerPda(umi, { asset: agentAssetPublicKey });
const tokenAccount = findAssociatedTokenPda(umi, {
  mint: splTokenMint,
  owner: publicKey(assetSignerPda),
});

const splRevokeIx = revokeTokenDelegate(umi, {
  source: tokenAccount,
  owner: createNoopSigner(publicKey(assetSignerPda)),
});

await execute(umi, {
  asset,
  collection,
  instructions: splRevokeIx,
}).sendAndConfirm(umi);
```

The same pattern applies to other downstream state — escrow positions, delegated authorities, or program-specific permissions all need to be undone in the program that owns them.

## Full Example

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { generateSigner } from '@metaplex-foundation/umi';
import { create, createCollection } from '@metaplex-foundation/mpl-core';
import { mplAgentIdentity, mplAgentTools } from '@metaplex-foundation/mpl-agent-registry';
import {
  registerIdentityV1,
  registerExecutiveV1,
  delegateExecutionV1,
  revokeExecutionV1,
  findAgentIdentityV1Pda,
  findExecutiveProfileV1Pda,
  findExecutionDelegateRecordV1Pda,
} from '@metaplex-foundation/mpl-agent-registry';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplAgentIdentity())
  .use(mplAgentTools());

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

// 4. Register executive profile
await registerExecutiveV1(umi, {
  payer: umi.payer,
}).sendAndConfirm(umi);

// 5. Delegate execution
const agentIdentity = findAgentIdentityV1Pda(umi, { asset: asset.publicKey });
const executiveProfile = findExecutiveProfileV1Pda(umi, { authority: umi.payer.publicKey });

await delegateExecutionV1(umi, {
  agentAsset: asset.publicKey,
  agentIdentity,
  executiveProfile,
}).sendAndConfirm(umi);

// 6. (Later) Revoke the execution delegate. Either the asset owner or the executive
//    authority on the record can revoke. This stops future Execute calls from this
//    executive through the AgentIdentity path. Downstream state created during
//    delegation must be cleaned up separately.
const executionDelegateRecord = findExecutionDelegateRecordV1Pda(umi, {
  executiveProfile,
  agentAsset: asset.publicKey,
});

await revokeExecutionV1(umi, {
  executionDelegateRecord,
  agentAsset: asset.publicKey,
  destination: umi.payer.publicKey,
}).sendAndConfirm(umi);
```

## Notes

- Each wallet can only have one executive profile. The PDA is derived from `["executive_profile", <authority>]`, so calling `registerExecutiveV1` again with the same wallet will fail.
- Delegation is per-asset — an owner must create a separate delegation record for each agent they want the executive to operate.
- Only the asset owner can delegate execution. Revocation can be signed by either the asset owner or the executive authority recorded on the delegation.
- An owner can switch executives by revoking the existing delegation record and creating a new one with a different executive profile, or by adding a second delegate without revoking the first.
- See the [Security model](/smart-contracts/mpl-agent/tools#security-model) for what an executive can do, what revocation covers, and how delegates behave across asset transfer.

## FAQ

### What exactly does RevokeExecutionV1 stop?

It closes the `ExecutionDelegateRecordV1` so that executive can no longer trigger Execute through the AgentIdentity path. It does not modify SPL Token approvals or other downstream state created by previous executions — see the [Security model](/smart-contracts/mpl-agent/tools#security-model) for the full scope.

### Who can sign RevokeExecutionV1?

Either the asset owner or the executive authority recorded on the delegation. The asset owner can revoke without executive cooperation, and the executive can step down without owner involvement.

### How do I clean up an SPL token approval that was granted during a previous execution?

Call SPL Token's `Revoke` instruction on the affected token account through Core's [Execute path](/smart-contracts/core/execute-asset-signing). The asset owner can drive this directly without an active executive, because Core Execute validates the owner as a signer. See [Example: Clean Up an SPL Approval](#example-clean-up-an-spl-approval) for the worked code.

See the [Agent Tools](/smart-contracts/mpl-agent/tools) smart contract reference for account layouts, PDA derivation details, error codes, and the full lifecycle and security model.

*Maintained by [Metaplex](https://github.com/metaplex-foundation) · Last verified June 2026 · [View source on GitHub](https://github.com/metaplex-foundation/mpl-agent)*
