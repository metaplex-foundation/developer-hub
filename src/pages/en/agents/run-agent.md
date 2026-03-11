---
title: Read Agent Data
metaTitle: Read Agent Data on Solana | Metaplex Agent Registry
description: Verify agent registration and read agent identity data on Solana.
created: '02-25-2026'
updated: '03-11-2026'
---

Read and verify agent identity data on-chain after an agent has been [registered](/agents/register-agent). {% .lead %}

## Check Registration

Use the safe fetch method to check whether an asset has a registered identity:

```typescript
import { safeFetchAgentIdentityV1, findAgentIdentityV1Pda } from '@metaplex-foundation/mpl-agent-registry';

const pda = findAgentIdentityV1Pda(umi, { asset: assetPublicKey });
const identity = await safeFetchAgentIdentityV1(umi, pda);

console.log('Registered:', identity !== null);
```

## Fetch from Seeds

If you only have the asset's public key:

```typescript
import { fetchAgentIdentityV1FromSeeds } from '@metaplex-foundation/mpl-agent-registry';

const identity = await fetchAgentIdentityV1FromSeeds(umi, {
  asset: assetPublicKey,
});
```

## Verify the AgentIdentity Plugin

Registration attaches an `AgentIdentity` plugin to the MPL Core asset with the registration URI and lifecycle hooks:

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

The `uri` field on the `AgentIdentity` plugin points to an off-chain JSON document that describes the agent's capabilities and metadata. Fetch it to get the full agent profile:

```typescript
import { fetchAsset } from '@metaplex-foundation/mpl-core';

const assetData = await fetchAsset(umi, assetPublicKey);
const agentIdentity = assetData.agentIdentities?.[0];

if (agentIdentity?.uri) {
  const response = await fetch(agentIdentity.uri);
  const registration = await response.json();

  console.log(registration.name);          // "My Trading Agent"
  console.log(registration.description);   // "An autonomous agent that..."
  console.log(registration.capabilities);  // ["swap", "stake", "rebalance"]
  console.log(registration.endpoint);      // "https://api.example.com/agent"
}
```

A typical registration document follows the [ERC-8004](https://eips.ethereum.org/EIPS/eip-8004) agent registration standard:

```json
{
  "type": "agent-registration-v1",
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
    },
  ],
  "active": true,
  "registrations": [
    {
      "agentId": "AgentAssetPublicKey111111111111111111111111111",
      "agentRegistry": "solana:mainnet:1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p"
    }
  ],
  "supportedTrust": ["reputation", "crypto-economic"]
}
```

See [Register an Agent](/agents/register-agent#agent-registration-document) for the full field reference.

## Fetch the Agent's Wallet

Every MPL Core asset has a built-in wallet called the **Asset Signer** — a PDA derived from the asset's public key. Because it's a PDA, no private key exists for it, making it unstealable. The agent's wallet can hold SOL, tokens, and other assets.

Use the `findAssetSignerPda` helper from `@metaplex-foundation/mpl-core` to derive the wallet address and check its balance:

```typescript
import { findAssetSignerPda } from '@metaplex-foundation/mpl-core';

const assetSignerPda = findAssetSignerPda(umi, { asset: assetPublicKey });

const balance = await umi.rpc.getBalance(assetSignerPda);
console.log('Agent wallet:', assetSignerPda);
console.log('Balance:', balance.basisPoints.toString(), 'lamports');
```

The wallet address is deterministic — anyone can derive it from the asset's public key to send funds or check balances. Only the asset can sign for this wallet through MPL Core's [Execute](/smart-contracts/core/execute-asset-signing) instruction via a delegated [executive](/agents/run-an-agent).

For more details on accounts, PDAs, and error codes, see the [MPL Agent Registry](/smart-contracts/mpl-agent) smart contract docs.
