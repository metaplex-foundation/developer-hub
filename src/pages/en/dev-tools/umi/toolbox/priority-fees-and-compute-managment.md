---
title: Priority Fees and Compute Management
metaTitle: Priority Fees and Compute Management | Toolbox
description: Configure compute unit limits and priority fees for Umi V1 and V0 transactions.
keywords:
  - Umi priority fees
  - Umi compute units
  - TransactionV1Config
  - Compute Budget Program
about:
  - Umi
  - Solana Transaction Fees
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '09-04-2024'
updated: '09-21-2026'
---

## Summary

Use `setTransactionConfig()` to configure compute units and priority fees on V1 transactions.

- V1 uses `computeUnitLimit` and a total `priorityFee`.
- Umi V1 transaction builders reject Compute Budget program instructions.
- V0 uses `setComputeUnitLimit` and `setComputeUnitPrice`.
- Priority fee estimates expressed in micro-lamports per compute unit must be converted to total lamports for V1.

Umi V1 transactions store compute limits and the total priority fee in the transaction message, while V0 transactions use Compute Budget program instructions.

## Configure V1 Compute Units and Priority Fees

V1 transactions configure their compute unit limit and total priority fee with `setTransactionConfig()`.

```ts {% title="V1 compute configuration" %}
import { lamports, transactionBuilder } from '@metaplex-foundation/umi'

await transactionBuilder()
  .add(myInstruction)
  .useV1()
  .setTransactionConfig({
    computeUnitLimit: 600_000,
    priorityFee: lamports(600),
  })
  .sendAndConfirm(umi)
```

The `priorityFee` is the total fee, not the price per compute unit. For a price of 1,000 micro-lamports and a limit of 600,000 units, the total is `600,000 × 1,000 ÷ 1,000,000 = 600` lamports.

{% callout type="warning" %}
Do not add `setComputeUnitLimit` or `setComputeUnitPrice` instructions to a V1 transaction builder. Umi rejects Compute Budget instructions in V1 transactions.
{% /callout %}

## Configure V0 Compute Units and Priority Fees

V0 transactions continue to use Compute Budget program instructions from `@metaplex-foundation/mpl-toolbox`.

```ts {% title="V0 compute configuration" %}
import { transactionBuilder } from '@metaplex-foundation/umi'
import {
  setComputeUnitLimit,
  setComputeUnitPrice,
} from '@metaplex-foundation/mpl-toolbox'

await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 600_000 }))
  .add(setComputeUnitPrice(umi, { microLamports: 1_000 }))
  .add(myInstruction)
  .useV0()
  .sendAndConfirm(umi)
```

Use V0 when the transaction requires an [Address Lookup Table](/dev-tools/umi/toolbox/address-lookup-table) or the connected wallet does not support V1 transactions.

## Notes

- Umi 1.6.0 or later is required for `useV1()` and `setTransactionConfig()`.
- The V1 compute unit limit cannot exceed 1,400,000.
- See [Optimal Transaction Landing](/dev-tools/umi/guides/optimal-transactions-with-compute-units-and-priority-fees) to estimate compute units and fees.
- See [Migrating from V0 to V1 Transactions](/dev-tools/umi/guides/migrate-to-transaction-v1) for all compatibility requirements.
