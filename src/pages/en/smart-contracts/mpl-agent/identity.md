---
title: Agent Identity
metaTitle: Agent Identity Program | MPL Agent Registry | Metaplex
description: Technical reference for the MPL Agent Identity program — RegisterIdentityV1, SetAgentTokenV1, AgentIdentityV2 account structure, PDA derivation, and error codes.
keywords:
  - Agent Identity program
  - RegisterIdentityV1
  - SetAgentTokenV1
  - AgentIdentityV2
  - AgentIdentityV1
  - PDA derivation
  - lifecycle hooks
  - Genesis token
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Smart Contracts
  - Solana
  - Metaplex
proficiencyLevel: Advanced
created: '02-25-2026'
updated: '03-30-2026'
---

The Agent Identity program registers an on-chain identity record for an MPL Core asset and optionally links a [Genesis](/smart-contracts/genesis) token to it. {% .lead %}

## Summary

The Agent Identity program (`1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p`) creates a PDA-based identity record for an [MPL Core](/smart-contracts/core) asset and attaches an `AgentIdentity` plugin with lifecycle hooks for Transfer, Update, and Execute.

- **Two instructions** — `RegisterIdentityV1` creates the identity record; `SetAgentTokenV1` links a [Genesis](/smart-contracts/genesis) token to an existing identity
- **104-byte account** — the `AgentIdentityV2` PDA stores the discriminator, bump, asset public key, an optional agent token address, and reserved space
- **Lifecycle hooks** — the plugin registers approve, listen, and reject checks on Transfer, Update, and Execute events
- **Deterministic PDA** — derived from seeds `["agent_identity", <asset_pubkey>]` for easy on-chain lookups

## Program ID

| Network | Address |
|---------|---------|
| Mainnet | `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p` |
| Devnet | `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p` |

## Instruction: RegisterIdentityV1

Registers an agent identity by creating a PDA and attaching an `AgentIdentity` plugin to the MPL Core asset with lifecycle hooks for Transfer, Update, and Execute.

### Accounts

| Account | Writable | Signer | Optional | Description |
|---------|----------|--------|----------|-------------|
| `agentIdentity` | Yes | No | No | PDA to be created (auto-derived from asset) |
| `asset` | Yes | No | No | The MPL Core asset to register |
| `collection` | Yes | No | Yes | The asset's collection |
| `payer` | Yes | Yes | No | Pays for account rent and fees |
| `authority` | No | Yes | Yes | Collection authority (defaults to `payer`) |
| `mplCoreProgram` | No | No | No | MPL Core program |
| `systemProgram` | No | No | No | System program |

### Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `agentRegistrationUri` | `string` | URI pointing to off-chain agent registration metadata |

### What RegisterIdentityV1 Does

1. Derives a PDA from seeds `["agent_identity", <asset>]`
2. Creates and initializes the `AgentIdentityV2` account (104 bytes)
3. CPIs into MPL Core to attach an `AgentIdentity` plugin to the asset with the provided URI
4. Registers lifecycle checks for **Transfer**, **Update**, and **Execute** events (approve, listen, and reject)

### Lifecycle Checks

The `AgentIdentity` plugin registers hooks on three lifecycle events:

| Event | Approve | Listen | Reject |
|-------|---------|--------|--------|
| Transfer | Yes | Yes | Yes |
| Update | Yes | Yes | Yes |
| Execute | Yes | Yes | Yes |

This means the identity plugin can participate in approving, observing, or rejecting transfers, updates, and executions on the asset.

## Instruction: SetAgentTokenV1

Associates a [Genesis](/smart-contracts/genesis) token with an existing agent identity. The Genesis account must use the `Mint` funding mode. If the identity is still an `AgentIdentityV1` (40 bytes), the program automatically upgrades it to `AgentIdentityV2` (104 bytes).

### Accounts

| Account | Writable | Signer | Optional | Description |
|---------|----------|--------|----------|-------------|
| `agentIdentity` | Yes | No | No | The agent identity PDA (V1 or V2) — auto-derived from asset |
| `asset` | No | No | No | The MPL Core asset |
| `genesisAccount` | No | No | No | The Genesis account for the agent's token launch |
| `payer` | Yes | Yes | No | Pays for additional rent (if upgrading from V1 to V2) |
| `authority` | No | Yes | Yes | Must be the [Asset Signer](/smart-contracts/core/execute-asset-signing) PDA (defaults to `payer`) |
| `systemProgram` | No | No | No | System program |

### What SetAgentTokenV1 Does

1. Validates the agent identity PDA exists and is either V1 or V2
2. Validates the Genesis account is owned by the Genesis program (`GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`) and uses `Mint` funding mode
3. If the identity is V1, resizes the account to 104 bytes and upgrades the discriminator to V2
4. Reads the `base_mint` public key from the Genesis account data
5. Stores the `base_mint` as the `agent_token` field on the identity

{% callout type="warning" %}
The agent token can only be set once. Calling `SetAgentTokenV1` on an identity that already has an `agent_token` set will fail with error `AgentTokenAlreadySet`.
{% /callout %}

{% callout type="note" %}
The `authority` must be the asset's [Asset Signer](/smart-contracts/core/execute-asset-signing) PDA. This is the Core asset's built-in wallet — a PDA derived from the asset's public key with no private key.
{% /callout %}

```typescript
import { setAgentTokenV1 } from '@metaplex-foundation/mpl-agent-registry';

await setAgentTokenV1(umi, {
  asset: assetPublicKey,
  genesisAccount: genesisAccountPublicKey,
}).sendAndConfirm(umi);
```

## PDA Derivation

**Seeds:** `["agent_identity", <asset_pubkey>]`

Both V1 and V2 accounts use the same PDA derivation. The SDK provides finders for both versions:

```typescript
import {
  findAgentIdentityV2Pda,
} from '@metaplex-foundation/mpl-agent-registry';

const pda = findAgentIdentityV2Pda(umi, { asset: assetPublicKey });
// Returns [publicKey, bump]
```

## Account: AgentIdentityV2

104 bytes, 8-byte aligned, zero-copy via bytemuck. This is the current account version created by `RegisterIdentityV1` and used by `SetAgentTokenV1`.

| Offset | Field | Type | Size | Description |
|--------|-------|------|------|-------------|
| 0 | `key` | `u8` | 1 | Account discriminator (`AgentIdentityV2`) |
| 1 | `bump` | `u8` | 1 | PDA bump seed |
| 2 | `_padding` | `[u8; 6]` | 6 | Alignment padding |
| 8 | `asset` | `Pubkey` | 32 | The MPL Core asset this identity is bound to |
| 40 | `agentToken` | `OptionalPubkey` | 33 | The Genesis token mint address (if set) |
| 73 | `_reserved` | `[u8; 31]` | 31 | Reserved for future use |

## Account: AgentIdentityV1 (Legacy)

40 bytes, 8-byte aligned. This is the legacy account format. Existing V1 accounts are automatically upgraded to V2 when `SetAgentTokenV1` is called.

| Offset | Field | Type | Size | Description |
|--------|-------|------|------|-------------|
| 0 | `key` | `u8` | 1 | Account discriminator (`AgentIdentityV1`) |
| 1 | `bump` | `u8` | 1 | PDA bump seed |
| 2 | `_padding` | `[u8; 6]` | 6 | Alignment padding |
| 8 | `asset` | `Pubkey` | 32 | The MPL Core asset this identity is bound to |

## Fetching Accounts

```typescript
import {
  fetchAgentIdentityV2,
  safeFetchAgentIdentityV2,
  fetchAllAgentIdentityV2,
  getAgentIdentityV2GpaBuilder,
} from '@metaplex-foundation/mpl-agent-registry';

// By PDA address (throws if not found)
const identity = await fetchAgentIdentityV2(umi, pda);

// Safe fetch (returns null if not found)
const identity = await safeFetchAgentIdentityV2(umi, pda);

// Batch fetch
const identities = await fetchAllAgentIdentityV2(umi, [pda1, pda2]);

// GPA query
const results = await getAgentIdentityV2GpaBuilder(umi)
  .whereField('asset', assetPublicKey)
  .get();
```

### Legacy V1 Fetchers

The V1 fetch functions still work for accounts that have not been upgraded to V2. New integrations should use the V2 fetchers above.

```typescript
import {
  fetchAgentIdentityV1,
  safeFetchAgentIdentityV1,
  findAgentIdentityV1Pda,
  fetchAgentIdentityV1FromSeeds,
  getAgentIdentityV1GpaBuilder,
} from '@metaplex-foundation/mpl-agent-registry';

const v1Pda = findAgentIdentityV1Pda(umi, { asset: assetPublicKey });

// Safe fetch (returns null if not found)
const identity = await safeFetchAgentIdentityV1(umi, v1Pda);

// By seeds
const identity = await fetchAgentIdentityV1FromSeeds(umi, { asset: assetPublicKey });

// GPA query
const results = await getAgentIdentityV1GpaBuilder(umi)
  .whereField('asset', assetPublicKey)
  .get();
```

## Errors

| Code | Name | Description |
|------|------|-------------|
| 0 | `InvalidSystemProgram` | System program account is incorrect |
| 1 | `InvalidInstructionData` | Instruction data is malformed |
| 2 | `InvalidAccountData` | PDA derivation does not match the asset |
| 3 | `InvalidMplCoreProgram` | MPL Core program account is incorrect |
| 4 | `InvalidCoreAsset` | Asset is not a valid MPL Core asset |
| 5 | `InvalidAgentToken` | Agent token account is invalid |
| 6 | `OnlyAssetSignerCanSetAgentToken` | The authority must be the Asset Signer PDA to call `SetAgentTokenV1` |
| 7 | `AgentTokenAlreadySet` | The agent token has already been set on this identity |
| 8 | `InvalidAgentIdentity` | The agent identity account is invalid or not owned by this program |
| 9 | `AgentIdentityAlreadyRegistered` | This asset already has a registered identity |
| 10 | `InvalidGenesisAccount` | The Genesis account is invalid (wrong owner, wrong discriminator, or too small) |
| 11 | `GenesisNotMintFunded` | The Genesis account does not use `Mint` funding mode |

## Notes

- `RegisterIdentityV1` now creates `AgentIdentityV2` accounts (104 bytes). Legacy V1 accounts (40 bytes) are automatically upgraded to V2 by `SetAgentTokenV1`.
- The `agentToken` field on V2 is an `OptionalPubkey`. It is empty (`None`) until `SetAgentTokenV1` is called.
- The `_reserved` field (31 bytes) is zeroed and reserved for future extensions.
- Both V1 and V2 accounts share the same PDA derivation seeds: `["agent_identity", <asset_pubkey>]`.
