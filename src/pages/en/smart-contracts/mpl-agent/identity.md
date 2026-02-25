---
title: Agent Identity
metaTitle: Agent Identity Program | MPL Agent Registry | Metaplex
description: Technical reference for the MPL Agent Identity program — instruction accounts, PDA derivation, account structure, and error codes.
created: '02-25-2026'
updated: '02-25-2026'
---

The Agent Identity program registers an on-chain identity record for an MPL Core asset. {% .lead %}

## Program ID

| Network | Address |
|---------|---------|
| Mainnet | `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p` |
| Devnet | `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p` |

## Instruction: RegisterIdentityV1

Registers an agent identity by creating a PDA and attaching an `AppData` plugin to the MPL Core asset.

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

### What It Does

1. Derives a PDA from seeds `["agent_identity", <asset>]`
2. Creates and initializes the `AgentIdentityV1` account (40 bytes)
3. CPIs into MPL Core to attach an `AppData` external plugin to the asset, with the PDA as the `data_authority`
4. If the AppData plugin already exists, the instruction succeeds without creating a duplicate

## PDA Derivation

**Seeds:** `["agent_identity", <asset_pubkey>]`

```typescript
import { findAgentIdentityV1Pda } from '@metaplex-foundation/mpl-agent-registry';

const pda = findAgentIdentityV1Pda(umi, { asset: assetPublicKey });
// Returns [publicKey, bump]
```

## Account: AgentIdentityV1

40 bytes, 8-byte aligned, zero-copy via bytemuck.

| Offset | Field | Type | Size | Description |
|--------|-------|------|------|-------------|
| 0 | `key` | `u8` | 1 | Account discriminator (`1` = AgentIdentityV1) |
| 1 | `bump` | `u8` | 1 | PDA bump seed |
| 2 | `_padding` | `[u8; 6]` | 6 | Alignment padding |
| 8 | `asset` | `Pubkey` | 32 | The MPL Core asset this identity is bound to |

## Fetching Accounts

```typescript
import {
  fetchAgentIdentityV1,
  safeFetchAgentIdentityV1,
  fetchAgentIdentityV1FromSeeds,
  fetchAllAgentIdentityV1,
  getAgentIdentityV1GpaBuilder,
} from '@metaplex-foundation/mpl-agent-registry';

// By PDA address (throws if not found)
const identity = await fetchAgentIdentityV1(umi, pda);

// Safe fetch (returns null if not found)
const identity = await safeFetchAgentIdentityV1(umi, pda);

// By seeds (derives PDA internally)
const identity = await fetchAgentIdentityV1FromSeeds(umi, { asset });

// Batch fetch
const identities = await fetchAllAgentIdentityV1(umi, [pda1, pda2]);

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
