---
title: Initialize Inscriptions
metaTitle: Inscriptions - Initialize Inscriptions
description: Learn how to create Metaplex Inscriptions
---

The `initialize` instruction creates the inscription accounts for you where the data will be stored. There are three types of initializations:

1. `initialize` - for Inscriptions as a storage provider
2. `initializeFromMint` - for Inscriptions attached to NFTs
3. `initializeAssociatedInscription` - Additional Data Accounts

After the initialization has been done you can [write Data](write) to the inscriptions.

## `Initialize`

An Inscription has to be initialized before data can written to it. It can be done like so:

```js
const umi = await createUmi()
const inscriptionAccount = generateSigner(umi)

const inscriptionMetadataAccount = await findInscriptionMetadataPda(umi, {
  inscriptionAccount: inscriptionAccount.publicKey,
})
const inscriptionShardAccount = await findInscriptionShardPda(umi, {
  shardNumber: 0, //random number between 0 and 31
})

await initialize(umi, {
  inscriptionAccount,
  inscriptionShardAccount,
}).sendAndConfirm(umi)
```

## `initializeFromMint`

If you want to inscribe a NFT a different initialization function has to be used since the account seeds are different. When using this function you have to be the update authority of the NFT.

It can be done like this:

```js
const umi = await createUmi()

const inscriptionShardAccount = await findInscriptionShardPda(umi, {
  shardNumber: 0, //random number between 0 and 31
})
await initializeFromMint(umi, {
  mintAccount: mint.publicKey,
  inscriptionShardAccount,
}).sendAndConfirm(umi)
```

## `initializeAssociatedInscription`

One Inscription account can have multiple Associated Inscription Accounts. They are derived based on the `associationTag`. For example the tag can be the datatype of the file, e.g. `image/png`.

Pointers to the associated inscriptions are stored in an array in the `inscriptionMetadata` Account in the field `associatedInscriptions`.

To initialize a new Associated Inscription you can use the following function:

```js
const umi = await createUmi()

const inscriptionMetadataAccount = await findInscriptionMetadataPda(umi, {
  inscriptionAccount: inscriptionAccount.publicKey,
})

await initializeAssociatedInscription(umi, {
  inscriptionMetadataAccount,
  associationTag: 'image/png',
}).sendAndConfirm(umi)
```
