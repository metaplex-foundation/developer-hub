---
title: JavaScript SDK
metaTitle: MPL-Distro JavaScript SDK Reference
description: Install and use the MPL-Distro Umi client, instruction builders, account fetchers, Merkle helpers, and PDA utilities.
keywords:
  - MPL-Distro SDK
  - '@metaplex-foundation/mpl-distro'
  - Umi token distribution
  - MPL-Distro API
about:
  - MPL-Distro
  - JavaScript SDK
  - Umi
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '08-25-2026'
updated: '08-27-2026'
---

The `@metaplex-foundation/mpl-distro` package provides Umi instruction builders, account serializers, [PDA](/solana/understanding-pdas) helpers, and compatible Merkle tree utilities. {% .lead %}

## Summary

The MPL-Distro JavaScript SDK is the supported TypeScript interface for creating, funding, claiming, updating, and inspecting distributions.

- Register `mplDistro()` on a Umi client before building instructions.
- Generate roots and proofs with `prepareDistribution`.
- Use generated builders for the operational program instructions.
- Fetch deterministic distribution and claim-receipt accounts through exported helpers.

## Install the MPL-Distro JavaScript SDK

Install MPL-Distro 0.4.x with its Umi and Toolbox peer dependencies.

```shell {% title="Terminal" %}
npm install @metaplex-foundation/mpl-distro@^0.4 \
  @metaplex-foundation/mpl-core@^1.3 \
  @metaplex-foundation/umi@^1.1 \
  @metaplex-foundation/umi-bundle-defaults \
  @metaplex-foundation/mpl-toolbox@^0.10
```

`@metaplex-foundation/mpl-core` is a declared peer dependency and supports the [Core asset-signer helper flow](/smart-contracts/core/execute-asset-signing).

## Register the MPL-Distro Umi Plugin

Register `mplDistro()` once on the application's [Umi](/dev-tools/umi) instance.

{% code-tabs-imported from="mpl-distro/setup_umi" frameworks="umi" filename="setupUmi" /%}

The plugin registers program name `mplDistro` at `D1STRoZTUiEa6r8TLg2aAbG4nSRT5cDBmgG7jDqCZvU8`.

## MPL-Distro Instruction Builders

The SDK exposes a transaction builder for each operational program instruction.

| Builder | Purpose | Primary arguments |
|---|---|---|
| `createDistribution` | Create a distribution PDA | Root, height, time window, claimant count, name, type, access mode |
| `updateDistribution` | Change optional configuration fields | Distribution plus fields to replace |
| `deposit` | Fund the distribution token vault | Distribution, mint, amount |
| `withdraw` | Recover tokens while inactive | Distribution, mint, amount |
| `distribute` | Claim a wallet allocation | Distribution, mint, recipient, amount, proof, nonce |
| `distributeToLegacyNft` | Claim an NFT-mint allocation | Distribution, reward mint, NFT mint, owner, amount, proof, nonce |
| `withdrawSubsidy` | Recover unused receipt subsidy | Distribution, recipient, amount in lamports |

Every builder returns a Umi `TransactionBuilder` and can be composed or submitted with `.sendAndConfirm(umi)`.

## MPL-Distro Merkle Helpers

The SDK generates allocation-compatible roots and proofs from recipient records.

| Export | Purpose |
|---|---|
| `prepareDistribution(recipients)` | Return `root`, `proofs`, and `treeHeight` |
| `hashDistroLeaf(recipient)` | Serialize one address, amount, and nonce for hashing |
| `computeTreeHeight(leavesCount)` | Return the minimum internal height for a leaf count |
| `distributeToAssetAndClaim` | Claim to a Core [asset signer](/smart-contracts/core/execute-asset-signing) and transfer the tokens through Core Execute |
| `Recipient` | Type containing `address`, `amount`, and optional `nonce` |
| `LegacyNft` | Alias of `Recipient` used when addresses are NFT mints |

{% code-tabs-imported from="mpl-distro/prepare_distribution" frameworks="umi" filename="prepareDistribution" /%}

Use the proof at the same array index as its allocation. Preserve the amount and nonce with that proof.

## MPL-Distro Account Fetchers

Account helpers deserialize distribution state and individual claim receipts.

| Export | Result |
|---|---|
| `fetchDistribution(umi, address)` | One decoded distribution |
| `safeFetchDistribution(umi, address)` | Distribution or `null` |
| `fetchAllDistribution(umi, addresses)` | Multiple decoded distributions |
| `fetchClaimReceipt(umi, address)` | One decoded receipt |
| `safeFetchClaimReceipt(umi, address)` | Receipt or `null` |
| `fetchAllClaimReceipt(umi, addresses)` | Multiple decoded receipts |
| `getDistributionSize()` | Current distribution account size |
| `getClaimReceiptSize()` | Claim receipt account size |

The SDK does not provide an indexer query for every distribution by authority or mint. Applications need known PDA inputs, indexed transaction data, or an external account index.

## MPL-Distro Distribution Account

The distribution account stores configuration and aggregate bookkeeping for one mint and Merkle root.

| Field | Type | Meaning |
|---|---|---|
| `distributionType` | `DistributionType` | `Wallet` or `LegacyNft` |
| `subsidizeReceipts` | boolean | Whether claims require receipt-rent reimbursement |
| `allowedDistributor` | `AllowedDistributor` | Submission authorization mode |
| `treeHeight` | number | Maximum accepted proof length |
| `authority` | public key | Administrative signer |
| `mint` | public key | Distributed SPL token mint |
| `merkleRoot` | 32 bytes | Allocation commitment |
| `startTime`, `endTime` | bigint | Inclusive Unix claim window |
| `totalClaimants` | bigint | Declared allocation count metadata |
| `totalAmount` | bigint | Deposits minus withdrawals; claims do not decrement this field |
| `claimCount` | bigint | Number of recorded claims |
| `claimAmount` | bigint | Sum of claimed token base units |
| `seed` | public key | Seed signer used by the distribution PDA |
| `name` | 32 bytes | Padded UTF-8 distribution name |
| `permissionedDistributor` | public key | Required signer for permissioned mode |

## MPL-Distro Enum Values

Distribution and authorization enums select the claim identity and signer rules.

| Enum | Value | Meaning |
|---|---:|---|
| `DistributionType.Wallet` | 0 | Allocation identity is a wallet or public key |
| `DistributionType.LegacyNft` | 1 | Allocation identity is a legacy NFT mint |
| `AllowedDistributor.Permissionless` | 0 | Any payer can submit |
| `AllowedDistributor.Recipient` | 1 | Recipient or NFT owner must sign |
| `AllowedDistributor.Permissioned` | 2 | Configured distributor must sign |

## MPL-Distro PDA Helpers

PDA helpers derive the program's deterministic distribution and receipt addresses.

{% code-tabs-imported from="mpl-distro/derive_distro_pdas" frameworks="umi" filename="deriveDistroPdas" /%}

| PDA | Seeds |
|---|---|
| Distribution | `["distribution", mint, seed]` |
| Claim receipt | `["claim_receipt", distribution, recipient, amount_le, nonce_le]` |

For `LegacyNft`, pass the NFT mint as `recipient` when deriving the receipt.

## MPL-Distro Error Helpers

The registered Umi program maps custom error codes to generated JavaScript error classes.

| Error | Typical cause |
|---|---|
| `DistributionNotStarted` | Claim submitted before the start timestamp |
| `DistributionEnded` | Claim submitted after the end timestamp |
| `InvalidClaimProof` | Allocation fields or proof do not match the root |
| `AlreadyClaimed` | Receipt already exists |
| `CannotWithdrawDuringActiveDistribution` | Token recovery attempted while active |
| `CannotWithdrawWhileActive` | Receipt-subsidy recovery attempted while active |
| `InsufficientFunds` | Recorded token balance is below the claim |
| `InsufficientFundsToSubsidizeReceipts` | Distribution SOL cannot reimburse receipt rent |
| `RecipientMustSign` | Recipient mode omitted the recipient signer |
| `InvalidDistributionType` | Claim builder does not match the configured type |
| `InvalidDistributor` | Permissioned claim used the wrong signer |

Use `getMplDistroErrorFromCode` or the registered program's error mapping when decoding simulation and confirmation failures.

## MPL-Distro JavaScript Quick Reference

The JavaScript client and deployed program use the following stable identifiers.

| Item | Value |
|---|---|
| Package | `@metaplex-foundation/mpl-distro` |
| Tested package range | 0.4.x |
| Umi peer dependency | 1.1.1 or newer |
| Program ID | `D1STRoZTUiEa6r8TLg2aAbG4nSRT5cDBmgG7jDqCZvU8` |
| Fee wallet | `9kFjQsxtpBsaw8s7aUyiY3wazYDNgFP4Lj5rsBVVF8tb` |
| Source | [metaplex-foundation/mpl-distro](https://github.com/metaplex-foundation/mpl-distro) |

## Notes

The generated client exposes low-level instruction builders and does not manage off-chain proof delivery.

- `prepareDistribution` uses a memory-optimized implementation for 1,000 or more leaves.
- `nonce` defaults to zero in both claim builders.
- Optional account defaults depend on the Umi payer and should be supplied explicitly in sponsored flows.
- SDK package version, Rust crate version, and internal program crate version are released independently.
- Authority create, deposit, fetch, and withdraw can also run from the [Metaplex CLI](/dev-tools/cli/distro). Claims stay in the SDK.
