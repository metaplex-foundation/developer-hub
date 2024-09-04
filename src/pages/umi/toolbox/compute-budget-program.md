---
title: Compute Budget Program
metaTitle: Compute Budget Program | Toolbox
description: How to use the Solana Compute Budget Program with Umi.
---

## Compute Budget Program

The Compute Budget Program allows us to set a custom Compute Unit limit and price. You can read more about this program in [Solana's official documentation](https://docs.solana.com/developing/programming-model/runtime#compute-budget).

### Set Compute Unit limit

This instruction allows you to set a custom Compute Unit limit for your transaction.

```ts
import { transactionBuilder } from '@metaplex-foundation/umi'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'

await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 600_000 })) // Set the Compute Unit limit.
  .add(...) // Any instruction(s) here.
  .sendAndConfirm(umi)
```

### Set Compute Unit price

This instruction allows you to set a custom price per Compute Unit for your transaction

```ts
import { transactionBuilder } from '@metaplex-foundation/umi'
import { setComputeUnitPrice } from '@metaplex-foundation/mpl-toolbox'

await transactionBuilder()
  .add(setComputeUnitPrice(umi, { microLamports: 1 })) // Set the price per Compute Unit in micro-lamports.
  .add(...) // Any instruction(s) here.
  .sendAndConfirm(umi)
```