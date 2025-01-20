---
title: Execute Asset Signing
metaTitle: Execute and Asset Signer | Core
description: Learn how MPL Core Assets can use the Execute instruction and sign instructions and transcations.
---

The MPL Core Execute instruction introduces the concept of **Asset Signers** to MPL Core Assets.

These **Asset Signers** act as Signers on behalf of the Asset itself which unlocks the ability for MPL Core Assets

- to transfer out Solana and SPL Tokens.
- to become the authority of other accounts.
- to perform other actions and validations that have been assigned to the `assetSignerPda` that require transaction/instruciton/cpi signing.

MPL Core Assets have the ability to sign and submit transactions/cpis to the blockchain. This effecitvely gives the Core Asset it's own wallet in the form of an `assetSigner`.

## Asset Signer PDA

Assets are now able to access the `assetSignerPda` account/address which allows the `execute` instruction on the MPL Core program to pass through additional instructions sent to it to sign the cpi instructions with the `assetSignerPda`.

This allows the `assetSignerPda` account to effectively own and execute account instructions on behalf of the current asset owner.

You can think of the `assetSignerPda` as a wallet attatched to a Core Asset.

### findAssetSignerPda()

```ts
const assetId = publickey('11111111111111111111111111111111')

const assetSignerPda = findAssetSignerPda(umi, { asset: assetId })
```

## Execute Instruction

### Overview

The `execute` instruction allows users to pass in the Core Asset and also some pass through instructions that will get signed by the AssetSigner when it hits the MPL Core programs `execute` instruction on chain.

An overview of the `execute` instruction and it's args.

```ts
const executeTx = await execute(umi, {
    {
        // The asset via `fetchAsset()` that is signing the transaction.
        asset: AssetV1,
        // The collection via `fetchCollection()`
        collection?: CollectionV1,
        // Either a TransactionBuilder | Instruction[]
        instructions: ExecuteInput,
        // Additional Signers that will be required for the transaction/instructions.
        signers?: Signer[]
    }
})
```

### Validation

{% callout title="assetSignerPda Validation" %}
The MPL Core Execute instruction will validate that the **current Asset owner** has also signed the transaction. This insures only the current Asset Owner can execute transactions while using the `assetSignerPda` with the `execute` instruction.
{% /callout %}

## Examples

### Transfering SOL From the Asset Signer

In the following example we transfer SOL that had been sent to the `assetSignerPda` to a destination of our choice.

```js
import {
  execute,
  findAssetSignerPda,
  fetchAsset,
  fetchCollection,
} from '@metaplex-foundation/mpl-core'
import { transferSol } from '@metaplex-foundation/mpl-toolbox'
import { publickey, createNoopSigner, sol } from '@metaplex-foundation/umi'

const assetId = publickey('11111111111111111111111111111111')

const asset = await fetchAsset(umi, assetId)

// Optional - If Asset is part of collection fetch the collection object
const collection =
  asset.updateAuthority.type == 'Collection' && asset.updateAuthority.address
    ? await fetchCollection(umi, asset.updateAuthority.address)
    : undefined

// Asset signer has a balance of 1 SOL in the account.
const assetSignerPda = findAssetSignerPda(umi, { asset: assetId })

// Destination account we wish to transfer the SOL to.
const destination = publickey('2222222222222222222222222222222222')

// A standard `transferSol()` transactionBuilder.
const transferSolTx = transferSol(umi, {
  // Create a noopSigner as the assetSigner will sign later during CPI
  source: createNoopSigner(publicKey(assetSigner)),
  // Destination address
  destination,
  // Amount you wish to transfer
  amount: sol(0.5),
})

// Call the `execute` transaction and send to the chain.
const res = await execute(umi, {
  // Execute transaction/instruction(s) with this asset
  asset,
  // If Asset is part of collection pass in collection object via `fetchCollection()`
  collection,
  // The transactionBuilder/instruction[] to execute
  instructions: transferSolTx,
}).sendAndConfirm(umi)

console.log({ res })
```

### Transfering SPL Tokens From the Asset Signer

In the following example we transfer some of our SPL Token balance from the `assetSignerPda` account to a destination.

This example is based on the best practices in regards to derived tokens accounts for a base wallet address. If tokens are not in their correctly derived token account based on the `assetSignerPda` address then this example will need adjusting.

```js
import {
  execute,
  findAssetSignerPda,
  fetchAsset,
  fetchCollection,
} from '@metaplex-foundation/mpl-core'
import {
  transferTokens,
  findAssociatedTokenPda,
} from '@metaplex-foundation/mpl-toolbox'
import { publickey } from '@metaplex-foundation/umi'

const assetId = publickey('11111111111111111111111111111111')

const asset = await fetchAsset(umi, assetId)

// Optional - If Asset is part of collection fetch the collection object
const collection =
  asset.updateAuthority.type == 'Collection' && asset.updateAuthority.address
    ? await fetchCollection(umi, asset.updateAuthority.address)
    : undefined

const splTokenMint = publickey('2222222222222222222222222222222222')

// Asset signer has a balance of tokens.
const assetSignerPda = findAssetSignerPda(umi, { asset: assetId })

// Destination wallet we wish to transfer the SOL to.
const destinationWallet = publickey('3333333333333333333333333333333')

// A standard `transferTokens()` transactionBuilder.
const transferTokensTx = transferTokens(umi, {
  // Source is the `assetSignerPda` derived Token Account
  source: findAssociatedTokenPda(umi, {
    mint: splTokenMint,
    owner: assetSignerPda,
  }),
  // Destination is the `destinationWallet` derived Token Account
  destination: findAssociatedTokenPda(umi, {
    mint: splTokenMint,
    owner: destinationWallet,
  }),
  // Amount to send in lamports.
  amount: 5000,
})

// Call the `execute` transaction and send to the chain.
const res = await execute(umi, {
  // Execute transaction/instruction(s) with this asset
  asset,
  // If Asset is part of collection pass in collection object via `fetchCollection()`
  collection,
  // The transactionBuilder/instruction[] to execute
  instructions: transferTokensTx,
}).sendAndConfirm(umi)

console.log({ res })
```

### Transfering Ownership of an Asset to Another Asset

In the following example we transfer a Core Asset that is owned by another Core Asset, to another.

```js
import {
  execute,
  fetchAsset,
  fetchCollection,
  findAssetSignerPda,
  transfer,
} from '@metaplex-foundation/mpl-core'
import { publickey } from '@metaplex-foundation/umi'

// Asset we wish to transfer.
const assetId = publickey('11111111111111111111111111111111')
const asset = await fetchAsset(assetId)

// Optional - If Asset is part of collection fetch the collection object
const collection =
  asset.updateAuthority.type == 'Collection' && asset.updateAuthority.address
    ? await fetchCollection(umi, asset.updateAuthority.address)
    : undefined

// Asset ID that owns the Asset we wish to transfer.
const sourceAssetId = publickey('2222222222222222222222222222222222')
// The source Asset object.
const sourceAsset = fetchAsset(umi, sourceAssetId)
// Asset signer has a balance of 1 SOL in the account.
const sourceAssetSignerPda = findAssetSignerPda(umi, { asset: assetId })

// Destination account we wish to transfer the SOL to.
const destinationAssetId = publickey('33333333333333333333333333333333')
// Destination Asset signer we wish to transfer the Asset to.
const destinationAssetSignerPda = findAssetSignerPda(umi, {
  asset: destinationAssetId,
})

const transferAssetTx = transfer(umi, {
  // Asset object via `fetchAsset()`.
  asset,
  // Optional - Collection object via `fetchCollection()`
  collection,
  // New Owner of the Asset.
  newOwner: destinationAssetSignerPda,
}).sendAndConfirm(umi)

const res = await execute(umi, {
  // Execute transaction/instruction(s) with this asset
  asset,
  // If Asset is part of collection pass in collection object via `fetchCollection()`
  collection,
  // The transactionBuilder/instruction[] to execute
  instructions: transferAssetTx,
}).sendAndConfirm(umi)

console.log({ res })
```
