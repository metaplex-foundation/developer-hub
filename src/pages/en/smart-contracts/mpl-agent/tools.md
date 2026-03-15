---
title: Agent Tools
metaTitle: Agent Tools Program | MPL Agent Registry | Metaplex
description: Technical reference for the MPL Agent Tools program — executive profiles, execution delegation, accounts, and PDA derivation.
keywords:
  - Agent Tools program
  - executive profile
  - execution delegation
  - RegisterExecutiveV1
  - DelegateExecutionV1
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Smart Contracts
  - Solana
  - Metaplex
proficiencyLevel: Advanced
created: '03-11-2026'
updated: '03-12-2026'
---

The Agent Tools program manages executive delegation for agent assets, allowing asset owners to delegate execution permissions to executive profiles. {% .lead %}

## Summary

The Agent Tools program (`TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S`) provides two instructions for managing execution delegation: `RegisterExecutiveV1` creates an executive profile, and `DelegateExecutionV1` grants that profile permission to execute on behalf of an agent asset.

- **Two instructions** — `RegisterExecutiveV1` (one-time profile setup) and `DelegateExecutionV1` (per-asset delegation)
- **ExecutiveProfileV1** — 40-byte PDA derived from `["executive_profile", <authority>]`, one per wallet
- **ExecutionDelegateRecordV1** — 104-byte PDA linking an executive profile to a specific agent asset
- **Owner-only delegation** — only the asset owner can create delegation records; the program validates ownership on-chain

## Program ID

The same program address is deployed on both Mainnet and Devnet.

| Network | Address |
|---------|---------|
| Mainnet | `TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S` |
| Devnet | `TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S` |

## Overview

The tools program provides two instructions:

1. **RegisterExecutiveV1** — Create an executive profile that can act as an executor for agent assets
2. **DelegateExecutionV1** — Grant an executive profile permission to execute on behalf of an agent asset

An executive profile is registered once per authority. Delegation is per asset — an asset owner creates a delegation record linking their agent asset to a specific executive profile.

## Instruction: RegisterExecutiveV1

Creates an executive profile PDA for the given authority.

### Accounts

Four accounts are required: the profile PDA to create, a payer, an optional authority, and the system program.

| Account | Writable | Signer | Optional | Description |
|---------|----------|--------|----------|-------------|
| `executiveProfile` | Yes | No | No | PDA to be created (auto-derived from authority) |
| `payer` | Yes | Yes | No | Pays for account rent and fees |
| `authority` | No | Yes | Yes | The authority for this executive profile (defaults to `payer`) |
| `systemProgram` | No | No | No | System program |

### What It Does

1. Derives a PDA from seeds `["executive_profile", <authority>]`
2. Validates the account is uninitialized
3. Creates and initializes the `ExecutiveProfileV1` account (40 bytes) storing the authority

## Instruction: DelegateExecutionV1

Delegates execution permission for an agent asset to an executive profile.

### Accounts

Seven accounts are required, including the executive profile, the agent asset, its identity PDA, and the delegation record PDA to create.

| Account | Writable | Signer | Optional | Description |
|---------|----------|--------|----------|-------------|
| `executiveProfile` | No | No | No | The registered executive profile |
| `agentAsset` | No | No | No | The MPL Core asset to delegate |
| `agentIdentity` | No | No | No | The agent identity PDA for the asset |
| `executionDelegateRecord` | Yes | No | No | PDA to be created (auto-derived) |
| `payer` | Yes | Yes | No | Pays for account rent and fees |
| `authority` | No | Yes | Yes | Must be the asset owner (defaults to `payer`) |
| `systemProgram` | No | No | No | System program |

### What It Does

1. Validates the executive profile exists and is initialized
2. Validates the agent asset is a valid MPL Core asset
3. Validates the agent identity is registered for the asset
4. Validates the signer is the asset owner
5. Derives a PDA from seeds `["execution_delegate_record", <executive_profile>, <agent_asset>]`
6. Creates and initializes the `ExecutionDelegateRecordV1` account (104 bytes)

## PDA Derivation

Both account types are PDAs derived from deterministic seeds. Use the SDK helpers to compute them.

| Account | Seeds | Size |
|---------|-------|------|
| `ExecutiveProfileV1` | `["executive_profile", <authority>]` | 40 bytes |
| `ExecutionDelegateRecordV1` | `["execution_delegate_record", <executive_profile>, <agent_asset>]` | 104 bytes |

```typescript
import {
  findExecutiveProfileV1Pda,
  findExecutionDelegateRecordV1Pda,
} from '@metaplex-foundation/mpl-agent-registry';

const profilePda = findExecutiveProfileV1Pda(umi, {
  authority: authorityPublicKey,
});

const delegatePda = findExecutionDelegateRecordV1Pda(umi, {
  executiveProfile: profilePda,
  agentAsset: assetPublicKey,
});
```

## Account: ExecutiveProfileV1

Stores the authority that owns this executive profile. 40 bytes, 8-byte aligned.

| Offset | Field | Type | Size | Description |
|--------|-------|------|------|-------------|
| 0 | `key` | `u8` | 1 | Account discriminator (`1` = ExecutiveProfileV1) |
| 1 | `_padding` | `[u8; 7]` | 7 | Alignment padding |
| 8 | `authority` | `Pubkey` | 32 | The authority for this executive profile |

## Account: ExecutionDelegateRecordV1

Links an executive profile to an agent asset, recording who is authorized to execute on its behalf. 104 bytes, 8-byte aligned.

| Offset | Field | Type | Size | Description |
|--------|-------|------|------|-------------|
| 0 | `key` | `u8` | 1 | Account discriminator (`2` = ExecutionDelegateRecordV1) |
| 1 | `bump` | `u8` | 1 | PDA bump seed |
| 2 | `_padding` | `[u8; 6]` | 6 | Alignment padding |
| 8 | `executiveProfile` | `Pubkey` | 32 | The executive profile address |
| 40 | `authority` | `Pubkey` | 32 | The executive authority |
| 72 | `agentAsset` | `Pubkey` | 32 | The agent asset address |

## Errors

The program returns these errors when validation fails during registration or delegation.

| Code | Name | Description |
|------|------|-------------|
| 0 | `InvalidSystemProgram` | System program account is incorrect |
| 1 | `InvalidInstructionData` | Instruction data is malformed |
| 2 | `InvalidAccountData` | Invalid account data |
| 3 | `InvalidMplCoreProgram` | MPL Core program account is incorrect |
| 4 | `InvalidCoreAsset` | Asset is not a valid MPL Core asset |
| 5 | `ExecutiveProfileMustBeUninitialized` | Executive profile already exists |
| 6 | `InvalidExecutionDelegateRecordDerivation` | Delegation record PDA derivation mismatch |
| 7 | `ExecutionDelegateRecordMustBeUninitialized` | Delegation record already exists |
| 8 | `InvalidAgentIdentity` | Agent identity account is invalid |
| 9 | `AgentIdentityNotRegistered` | Asset does not have a registered identity |
| 10 | `AssetOwnerMustBeTheOneToDelegateExecution` | Only the asset owner can delegate execution |
| 11 | `InvalidExecutiveProfileDerivation` | Executive profile PDA derivation mismatch |

*Maintained by [Metaplex](https://github.com/metaplex-foundation) · Last verified March 2026 · [View source on GitHub](https://github.com/metaplex-foundation/mpl-agent)*
