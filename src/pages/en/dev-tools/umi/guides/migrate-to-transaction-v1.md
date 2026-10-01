---
title: Migrating from V0 to V1 Transactions
metaTitle: Migrating from V0 to V1 Transactions | Umi
description: Migrate Umi transaction builders and direct transaction creation from Solana V0 transactions to V1 transactions, including compute budgets, priority fees, and wallet compatibility.
keywords:
  - Umi transaction v1
  - Solana transaction v1
  - Umi v0 migration
  - TransactionV1Config
  - useV1
  - setTransactionConfig
  - SIMD-0385
about:
  - Umi
  - Solana Transaction V1
  - Transaction Migration
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '09-21-2026'
updated: '09-21-2026'
howToSteps:
  - Upgrade Umi packages to version 1.6.0 or later and web3.js to version 1.99.0 or later
  - Select V1 per transaction builder or as the application default
  - Replace Compute Budget instructions with a TransactionV1Config
  - Keep transactions that require Address Lookup Tables on V0
  - Verify that every connected wallet supports V1 transactions before signing
howToTools:
  - Umi 1.6.0 or later
  - web3.js 1.99.0 or later
  - Solana RPC
faqs:
  - q: Does Umi use V1 transactions by default?
    a: No. Umi 1.6.0 keeps V0 as the default for backward compatibility. Call useV1 on a transaction builder or set defaultTransactionVersion to 1 when creating Umi.
  - q: Can a Umi V1 transaction use an Address Lookup Table?
    a: No. V1 transactions do not support Address Lookup Tables. Keep any transaction that requires an Address Lookup Table on V0.
  - q: Can a V1 transaction contain Compute Budget program instructions?
    a: No. Umi rejects V1 transaction builders that contain Compute Budget instructions. Use setTransactionConfig to set the compute unit limit, total priority fee, loaded accounts data size limit, or heap size.
  - q: Is the V1 transaction priority fee a price per compute unit?
    a: No. TransactionV1Config.priorityFee is the total priority fee as a SolAmount. Convert a micro-lamport price by multiplying it by the compute unit limit, dividing by 1,000,000, and rounding up to lamports.
  - q: Do all Solana wallets support V1 transactions?
    a: No. Umi can serialize V1 transactions for wallet adapters, but the connected wallet must accept and sign transaction version 1. Check wallet support before making V1 the application-wide default.
---

Migrate Umi applications from V0 to [V1 transactions](https://github.com/solana-foundation/solana-improvement-documents/blob/main/proposals/0385-transaction-v1.md) to use larger transactions and configure the compute budget directly on the transaction message. {% .lead %}

{% callout title="What You'll Migrate" %}
This guide converts a Umi V0 transaction builder to V1, replaces Compute Budget instructions with `TransactionV1Config`, configures V1 globally, and identifies transactions that must remain on V0.
{% /callout %}

## Summary

Umi 1.6.0 adds opt-in support for V1 transactions through `useV1()`, `defaultTransactionVersion: 1`, and `version: 1` on direct transaction inputs.

- V1 raises the serialized transaction limit from 1,232 to 4,096 bytes.
- V1 stores compute limits and the total priority fee in `TransactionV1Config`.
- V1 does not support Address Lookup Tables or Compute Budget instructions.
- Umi still defaults to V0, and connected wallets must support V1.

## Quick Start

Select V1 on the transaction builder and replace Compute Budget instructions with `setTransactionConfig`.

1. Upgrade to Umi 1.6.0 or later and `@solana/web3.js` 1.99.0 or later.
2. Add `.useV1()` to the transaction builder.
3. Remove `setComputeUnitLimit` and `setComputeUnitPrice` instructions.
4. Add `.setTransactionConfig({ computeUnitLimit, priorityFee })`.
5. Test V1 signing with every wallet supported by the application.

**Jump to:** [Prerequisites](#prerequisites) · [V0 and V1 Differences](#differences-between-v0-and-v1-transactions) · [Builder Migration](#migrating-a-transaction-builder-to-v1) · [Application Default](#setting-v1-as-the-application-default) · [Direct Creation](#migrating-direct-transaction-creation-to-v1) · [Address Lookup Tables](#keeping-address-lookup-table-transactions-on-v0) · [Common Errors](#common-v1-migration-errors) · [FAQ](#faq)

## Prerequisites

V1 migration requires compatible Umi, Web3.js, RPC, and wallet versions.

| Component | Requirement |
|-----------|-------------|
| Umi packages | 1.6.0 or later |
| `@solana/web3.js` | 1.99.0 or later |
| Solana clusters | V1 active on mainnet-beta, devnet, and testnet |
| Wallet | Must accept and sign transaction version `1` |

{% callout type="warning" %}
Do not enable V1 globally until every connected wallet path supports transaction version `1`. Umi serializes the transaction for wallet adapters but cannot make an incompatible wallet sign it.
{% /callout %}

## Differences Between V0 and V1 Transactions

V1 increases the transaction size limit but does not support V0 Address Lookup Tables or Compute Budget instructions.

| Capability | V0 | V1 |
|------------|----------------|----------------|
| Serialized size limit | 1,232 bytes | 4,096 bytes |
| Address lookup tables | Supported | Not supported |
| Compute unit limit | Compute Budget instruction | `transactionConfig.computeUnitLimit` |
| Priority fee | Micro-lamports per compute unit | Total `SolAmount` in `transactionConfig.priorityFee` |
| Default in Umi 1.6.0 | Yes | No, you must opt in |
| Builder selector | `useV0()` | `useV1()` |

V1 is most useful when a transaction exceeds the V0 size limit without relying on an Address Lookup Table.

## Migrating a Transaction Builder to V1

A V0 transaction builder migrates to V1 by replacing Compute Budget instructions with `useV1()` and `setTransactionConfig()`.

### V0 Transaction Builder Before Migration

The V0 transaction builder expresses the compute unit limit and price as instructions.

```typescript {% title="transaction-v0.ts" %}
import { transactionBuilder } from '@metaplex-foundation/umi'
import {
  setComputeUnitLimit,
  setComputeUnitPrice,
  transferSol,
} from '@metaplex-foundation/mpl-toolbox'

await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 600_000 }))
  .add(setComputeUnitPrice(umi, { microLamports: 1_000 }))
  .add(transferSol(umi, transferArgs))
  .sendAndConfirm(umi)
```

### V1 Transaction Builder After Migration

The V1 transaction builder expresses the compute unit limit and total priority fee in the transaction message.

```typescript {% title="transaction-v1.ts" %}
import { lamports, transactionBuilder } from '@metaplex-foundation/umi'
import { transferSol } from '@metaplex-foundation/mpl-toolbox'

await transactionBuilder()
  .add(transferSol(umi, transferArgs))
  .useV1()
  .setTransactionConfig({
    computeUnitLimit: 600_000,
    priorityFee: lamports(600),
  })
  .sendAndConfirm(umi)
```

The `600` lamport total fee equals `600,000 × 1,000 ÷ 1,000,000`. Round up when the conversion does not produce a whole lamport.

{% callout type="note" %}
`setTransactionConfig()` replaces the complete config. Include every custom v1 setting in the same call instead of calling it repeatedly with individual fields.
{% /callout %}

## Setting V1 as the Application Default

Setting `defaultTransactionVersion: 1` makes all transaction builders use V1 unless a builder explicitly selects another version.

```typescript {% title="umi.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'

const umi = createUmi('https://api.mainnet-beta.solana.com', {
  defaultTransactionVersion: 1,
})
```

This option also affects builders returned by Metaplex program libraries. A builder that calls `useV0()` still overrides the application default.

Applications that install the transaction factory directly can configure the plugin instead:

```typescript {% title="umi-with-custom-plugins.ts" %}
import { web3JsTransactionFactory } from '@metaplex-foundation/umi-transaction-factory-web3js'

umi.use(web3JsTransactionFactory({ defaultTransactionVersion: 1 }))
```

## Migrating Direct Transaction Creation to V1

Direct `umi.transactions.create()` calls must set `version: 1` and provide explicit nonzero runtime limits.

```typescript {% title="create-transaction-v1.ts" %}
const transaction = umi.transactions.create({
  version: 1,
  blockhash: (await umi.rpc.getLatestBlockhash()).blockhash,
  instructions: [myInstruction],
  payer: umi.payer.publicKey,
  transactionConfig: {
    computeUnitLimit: 200_000,
    loadedAccountsDataSizeLimit: 64 * 1024 * 1024,
  },
})
```

`TransactionBuilder` supplies legacy-equivalent defaults for omitted compute and loaded-account limits. The low-level `create()` method does not; an omitted limit is treated as zero by the runtime.

## Configuring V1 Transaction Limits

`TransactionV1Config` controls compute, account data, heap size, and the total priority fee.

| Field | Meaning | Valid range or behavior |
|-------|---------|-------------------------|
| `computeUnitLimit` | Maximum compute units | Integer from `0` through `1,400,000` |
| `priorityFee` | Total priority fee | `SolAmount`, usually created with `lamports(...)` |
| `loadedAccountsDataSizeLimit` | Maximum loaded account data | Up to 64 MiB |
| `heapSize` | Program heap frame size | 32,768 through 262,144 bytes in 1,024-byte increments |

The builder defaults `computeUnitLimit` to `min(200,000 × instruction count, 1,400,000)` and `loadedAccountsDataSizeLimit` to 64 MiB when those fields are omitted.

## Keeping Address Lookup Table Transactions on V0

Transactions that require [Address Lookup Tables](/dev-tools/umi/toolbox/address-lookup-table) must remain on V0.

```typescript {% title="transaction-v0-with-lookup-table.ts" %}
const builder = transactionBuilder()
  .add(myInstruction)
  .useV0()
  .setAddressLookupTables([myLookupTable])
```

Do not remove an Address Lookup Table merely to force a transaction onto V1. Compare the compiled account list and serialized size, then use the format that satisfies the transaction's requirements.

## Updating Custom Umi Integrations

Custom transaction factories and exhaustive version handling must add V1 support when upgrading to Umi 1.6.0.

- Implement `getDefaultVersion()` on custom `TransactionFactoryInterface` implementations.
- Add a `1` case to code that exhaustively switches over `TransactionVersion`.
- Add `version: 0` to direct V0 `TransactionInput` objects because the V0 version field is now required.
- Inspect `transaction.message.version` when reading transactions; V1 messages include `transactionConfig`.

Umi's RPC integration requests `maxSupportedTransactionVersion: 1`, so `umi.rpc.getTransaction()` can fetch V1 transactions.

## Common V1 Migration Errors

Umi rejects incompatible builder combinations before sending the transaction.

| Error | Cause | Fix |
|-------|-------|-----|
| `V1 transactions ignore ComputeBudget instructions. Set the compute budget with setTransactionConfig instead.` | A V1 transaction builder contains `setComputeUnitLimit`, `setComputeUnitPrice`, or another Compute Budget instruction | Remove the instruction and use `setTransactionConfig()` |
| `Address lookup tables are not supported by V1 transactions.` | A V1 transaction builder has one or more Address Lookup Tables | Keep the builder on V0 or remove the lookup-table requirement |
| `Transaction configs are only supported by V1 transactions.` | A legacy or V0 transaction builder calls `setTransactionConfig()` | Call `useV1()` or use Compute Budget instructions on V0 |
| Wallet rejects or cannot deserialize the transaction | The wallet does not support transaction version `1` | Keep that wallet flow on V0 until the wallet adds V1 support |
| Transaction fails with an insufficient compute budget after direct creation | `create()` received no `computeUnitLimit` | Set a nonzero `transactionConfig.computeUnitLimit` |

## Notes

- V1 is opt-in in Umi 1.6.0; the default remains V0 for backward compatibility.
- V1 became active on Solana mainnet-beta in epoch 1035 on September 15, 2026.
- Sending and simulation use base64 encoding, which supports V1 transactions larger than 1,232 bytes.
- Umi validates the compute unit limit and heap size before serialization.
- The implementation and compatibility details are documented in [metaplex-foundation/umi#216](https://github.com/metaplex-foundation/umi/pull/216).

## FAQ

### Does Umi Use V1 Transactions by Default?

Umi 1.6.0 keeps V0 as the default for backward compatibility. Call `useV1()` on a transaction builder or set `defaultTransactionVersion: 1` when creating Umi.

### Can a Umi V1 Transaction Use an Address Lookup Table?

V1 transactions do not support Address Lookup Tables. Keep any transaction that requires an Address Lookup Table on V0.

### Can a V1 Transaction Contain Compute Budget Program Instructions?

Umi rejects V1 transaction builders that contain Compute Budget instructions. Use `setTransactionConfig()` to set the compute unit limit, total priority fee, loaded accounts data size limit, or heap size.

### Is the V1 Transaction Priority Fee a Price per Compute Unit?

`TransactionV1Config.priorityFee` is the total priority fee as a `SolAmount`, not a price per compute unit. Convert a micro-lamport price by multiplying it by the compute unit limit, dividing by 1,000,000, and rounding up to lamports.

### Do All Solana Wallets Support V1 Transactions?

Wallet support for transaction version `1` is not universal. Umi can serialize V1 transactions for wallet adapters, but the connected wallet must accept and sign the transaction.
