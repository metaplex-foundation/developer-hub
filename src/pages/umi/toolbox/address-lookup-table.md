---
title: Address Lookup Table
metaTitle: Address Lookup Table | Toolbox
description: How to use Address Lookup Tables with Umi.
---

The SPL Address Lookup Table program can be used to reduce the size of transactions by creating custom lookup tables — a.k.a **LUTs** or **ALTs** — before using them in transactions. This program allows you to create and extend LUTs. You can learn more about this program in [Solana's official documentation](https://docs.solana.com/developing/lookup-tables).

## Create empty LUTs

This instruction allows you to create an empty Address Lookup Table (LUT) account.

```ts
import { createEmptyLut } from '@metaplex-foundation/mpl-toolbox'

const recentSlot = await umi.rpc.getSlot({ commitment: 'finalized' })
await createEmptyLut(umi, {
  recentSlot,
  authority,
}).sendAndConfirm(umi)
```

## Extend a LUT

This instruction enables you to add new addresses to an existing LUT account.

```ts
import {
  findAddressLookupTablePda,
  extendLut,
} from '@metaplex-foundation/mpl-toolbox'

// The authority and slot used to create the LUT.
const lutAddress = findAddressLookupTablePda(umi, { authority, recentSlot })

await extendLut(umi, {
  authority,
  address: lutAddress, // The address of the LUT.
  addresses: [addressA, addressB], // The addresses to add to the LUT.
}).sendAndConfirm(umi)
```

## Create LUT with addresses 

This helper method simplifies the process of creating a LUT with initial addresses by combining the creation of an empty LUT and extending it with the given addresses into a single transaction.

```ts
import { createLut } from '@metaplex-foundation/mpl-toolbox'

const recentSlot = await umi.rpc.getSlot({ commitment: 'finalized' })
await createLut(umi, {
  authority,
  recentSlot,
  addresses: [addressA, addressB],
}).sendAndConfirm(umi)
```

## Create LUT for a transaction builder

This helper method is designed to create LUTs specifically for a given transaction builder.

```ts
import { createLutForTransactionBuilder } from '@metaplex-foundation/mpl-toolbox'

// 1. Get the LUT builders and the LUT accounts for a given transaction builder.
const recentSlot = await umi.rpc.getSlot({ commitment: 'finalized' })
const [createLutBuilders, lutAccounts] = createLutForTransactionBuilder(
  umi,
  baseBuilder,
  recentSlot
)

// 2. Create the LUTs.
for (const createLutBuilder of createLutBuilders) {
  await createLutBuilder.sendAndConfirm(umi)
}

// 3. Use the LUTs in the base transaction builder.
await baseBuilder.setAddressLookupTables(lutAccounts).sendAndConfirm(umi)
```

## Freeze a LUT

This instruction allows you to freeze a LUT, making it immutable.

```ts
import {
  findAddressLookupTablePda,
  freezeLut,
} from '@metaplex-foundation/mpl-toolbox'

// The authority and slot used to create the LUT.
const lutAddress = findAddressLookupTablePda(umi, { authority, recentSlot })

await freezeLut(umi, {
  authority,
  address: lutAddress,
}).sendAndConfirm(umi)
```

## Deactivate a LUT

This instruction puts a LUT in a “deactivation” period before it can be closed. 

**Note**: Deactivating a LUT can't be used in new transactions but still maintains its data.

```ts
import {
  findAddressLookupTablePda,
  deactivateLut,
} from '@metaplex-foundation/mpl-toolbox'

// The authority and slot used to create the LUT.
const lutAddress = findAddressLookupTablePda(umi, { authority, recentSlot })

await deactivateLut(umi, {
  authority,
  address: lutAddress,
}).sendAndConfirm(umi)
```

## Close a LUT

This instruction permanently closes an LUT account after it has been deactivated for a certain period.

```ts
import {
  findAddressLookupTablePda,
  closeLut,
} from '@metaplex-foundation/mpl-toolbox'

// The authority and slot used to create the LUT.
const lutAddress = findAddressLookupTablePda(umi, { authority, recentSlot })

await closeLut(umi, {
  authority,
  address: lutAddress,
}).sendAndConfirm(umi)
```