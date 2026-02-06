---
title: Priority Fees and Compute Management
metaTitle: Priority Fees and Compute Management | Toolbox
description: How to use Priority Fees and the Compute Budget Program with Umi.
---

The Compute Budget Program allows us to set a custom Compute Unit limit and price. You can read more about this program in [Solana's official documentation](https://docs.solana.com/developing/programming-model/runtime#compute-budget).

## Set Compute Unit limit

This instruction allows you to set a custom Compute Unit limit for your transaction.

```ts
import { transactionBuilder } from '@metaplex-foundation/umi'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'

await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 600_000 })) // Set the Compute Unit limit.
  .add(...) // Any instruction(s) here.
  .sendAndConfirm(umi)
```

## Set Compute Unit price / Priority Fees

This instruction allows you to set a custom price per Compute Unit for your transaction

```ts
import { transactionBuilder } from '@metaplex-foundation/umi'
import { setComputeUnitPrice } from '@metaplex-foundation/mpl-toolbox'

await transactionBuilder()
  .add(setComputeUnitPrice(umi, { microLamports: 1 })) // Set the price per Compute Unit in micro-lamports.
  .add(...) // Any instruction(s) here.
  .sendAndConfirm(umi)
```

{% callout title="Guide how to calculate units and microLamports" type="note" %}
To be able to choose proper numbers for `microLamports` and `units` there was a [small guide](/dev-tools/umi/guides/optimal-transactions-with-compute-units-and-priority-fees) created that walks through different RPC calls that can be used for calculation.
{% /callout %}
