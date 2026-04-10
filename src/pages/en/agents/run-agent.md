---
title: Read Agent Data
metaTitle: Read Agent Data on Solana | Metaplex Agent Registry
description: Verify agent registration and read agent identity data on Solana.
agentSkill: /agents/run-agent.md
keywords:
  - read agent data
  - agent identity
  - AgentIdentity plugin
  - Asset Signer
  - agent wallet
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Agent Data
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '02-25-2026'
updated: '03-12-2026'
---

Read and verify agent identity data on-chain after [registration](/agents/register-agent). {% .lead %}

## Summary

Read agent identity data, verify registration status, inspect the AgentIdentity plugin, fetch the off-chain registration document, and derive the agent's built-in wallet address.

- **Check registration** using `safeFetchAgentIdentityV1` which returns `null` for unregistered assets
- **Inspect the AgentIdentity plugin** directly on the fetched Core asset for URI and lifecycle hooks
- **Fetch the registration document** from the on-chain URI to read agent metadata and service endpoints
- **Derive the agent's wallet** using `findAssetSignerPda` — a PDA with no private key that holds the agent's funds

## Check Registration

The safe fetch method returns `null` instead of throwing if the identity doesn't exist, which is useful for checking whether an asset has been registered:

```typescript
import { safeFetchAgentIdentityV1, findAgentIdentityV1Pda } from '@metaplex-foundation/mpl-agent-registry';

const pda = findAgentIdentityV1Pda(umi, { asset: assetPublicKey });
const identity = await safeFetchAgentIdentityV1(umi, pda);

console.log('Registered:', identity !== null);
```

## Fetch from Seeds

You can also fetch the identity directly from the asset's public key without manually deriving the PDA:

```typescript
import { fetchAgentIdentityV1FromSeeds } from '@metaplex-foundation/mpl-agent-registry';

const identity = await fetchAgentIdentityV1FromSeeds(umi, {
  asset: assetPublicKey,
});
```

## Verify the AgentIdentity Plugin

Registration attaches an `AgentIdentity` plugin to the Core asset. You can read it directly off the fetched asset to inspect the registration URI and lifecycle hooks:

```typescript
import { fetchAsset } from '@metaplex-foundation/mpl-core';

const assetData = await fetchAsset(umi, assetPublicKey);

const agentIdentity = assetData.agentIdentities?.[0];
console.log(agentIdentity?.uri);               // registration URI
console.log(agentIdentity?.lifecycleChecks?.transfer);  // truthy
console.log(agentIdentity?.lifecycleChecks?.update);    // truthy
console.log(agentIdentity?.lifecycleChecks?.execute);   // truthy
```

## Read the Registration Document

The `uri` on the `AgentIdentity` plugin points to an off-chain JSON document with the agent's full profile — name, description, service endpoints, and more. Fetch it like any other URI:

```typescript
import { fetchAsset } from '@metaplex-foundation/mpl-core';

const assetData = await fetchAsset(umi, assetPublicKey);
const agentIdentity = assetData.agentIdentities?.[0];

if (agentIdentity?.uri) {
  const response = await fetch(agentIdentity.uri);
  const registration = await response.json();

  console.log(registration.name);          // "Plexpert"
  console.log(registration.description);   // "An informational agent..."
  console.log(registration.active);        // true

  for (const service of registration.services) {
    console.log(service.name);             // "web", "A2A", "MCP", etc.
    console.log(service.endpoint);         // service URL
    console.log(service.version);          // protocol version (if set)
  }
}
```

The document follows the [ERC-8004](https://eips.ethereum.org/EIPS/eip-8004) agent registration standard. A typical one looks like this:

```json
{
  "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  "name": "An informational agent providing help related to Metaplex protocols and tools.",
  "description": "An autonomous agent that executes DeFi strategies on Solana.",
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
    }
  ],
  "active": true,
  "registrations": [
    {
      "agentId": "<MINT_ADDRESS>",
      "agentRegistry": "solana:101:metaplex"
    }
  ],
  "supportedTrust": ["reputation", "crypto-economic"]
}
```

See [Register an Agent](/agents/register-agent#agent-registration-document) for the full field reference.

## Fetch the Agent's Wallet

Every Core asset has a built-in wallet called the **Asset Signer** — a PDA derived from the asset's public key. No private key exists, so it can't be stolen. The wallet can hold SOL, tokens, or any other asset. Derive the address with `findAssetSignerPda`:

```typescript
import { findAssetSignerPda } from '@metaplex-foundation/mpl-core';

const assetSignerPda = findAssetSignerPda(umi, { asset: assetPublicKey });

const balance = await umi.rpc.getBalance(assetSignerPda);
console.log('Agent wallet:', assetSignerPda);
console.log('Balance:', balance.basisPoints.toString(), 'lamports');
```

The address is deterministic, so anyone can derive it from the asset's public key to send funds or check balances. Only the asset itself can sign for this wallet, through Core's [Execute](/smart-contracts/core/execute-asset-signing) instruction via a delegated [executive](/agents/run-an-agent).

See the [MPL Agent Registry](/smart-contracts/mpl-agent) smart contract docs for account layouts, PDA derivation details, and error codes.

## Notes

- The Asset Signer is a PDA — no private key exists for it. It can receive funds from any source, but only the asset itself can sign outgoing transactions through Core's [Execute](/smart-contracts/core/execute-asset-signing) instruction.
- `safeFetchAgentIdentityV1` returns `null` for unregistered assets rather than throwing, making it safe for existence checks without try/catch.
- `findAssetSignerPda` derives the wallet address deterministically. The same address is returned regardless of network, so you can use it on devnet and mainnet with the same asset key.

*Maintained by [Metaplex](https://github.com/metaplex-foundation) · Last verified March 2026 · [View source on GitHub](https://github.com/metaplex-foundation/mpl-agent)*
