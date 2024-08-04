---
title: Passing Transaction from Backend to Frontend
metaTitle: How to Create a Core NFT Asset
description: Learn how to use the noop signer and pass partially signed transaction from the Backend to the Frontend
# remember to update dates also in /components/guides/index.js
created: '08-2-2024'
updated: '08-2-2024'
---

Sometimes, for creating NFTs for example, you might need to store an `Authority` keypair to sign for example the inclusion of the NFT in the Collection. To safely do it, without exposing the keypair on the frontend, you'll need to create partially signed transaction in the backend that can be later signed by a wallet in the frontend. 

**We're going to talk about:**
- Noop Signer
- Partially signed transactions
- Passing transactions from the Backend to the Frontend and 

## Initial Setup

### Required Packages and Imports

We're going to use the following packages: 

{% packagesUsed packages = ["umi", "umiDefaults", "mpl-core"] type="npm" /%}

To install them, use the following commands:

```
$ npm i @metaplex-foundation/umi

$ npm i @metaplex-foundation/umi-bundle-defaults

$ npm i @metaplex-foundation/mpl-core
```

This are all the import what we're going to use for this particular guide

```ts
import { generateSigner, signerIdentity, createNoopSigner } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { fetchCollection, create } from '@metaplex-foundation/mpl-core'
```

## Setting up Umi

This example is going to show you how to set up Umi with a `generatedSigner()` or an existing wallet saved in the Backend. Then it's going to show you how to use the wallet adapter to sign those instruction on the frontend.

### Generating a New Wallet

```ts
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())

// Generate a new keypair signer.
const signer = generateSigner(umi)

// Tell Umi to use the new signer.
umi.use(signerIdentity(signer))
```

### Use an Existing Wallet

```ts
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())

// Use fs to navigate the filesystem till you reach
// the wallet you wish to use via relative pathing.
const walletFile = fs.readFileSync(
  path.join(__dirname, './keypair.json')
)

// Usually Keypair are saved as Uint8Array, so you
// need to transform it into a usable keypair
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

// Before using it into Umi, you need to transform it
// into a Signer type  
const signer = createSignerFromKeypair(umi, keyair);

// Tell Umi to use the new signer.
umi.use(signerIdentity(walletFile))
```

### Use the Wallet Adaptor

/// ToDO

## Creating Partially Signed Transactions in the Backend

As we talked about in the introduction, a perfect use case for this example would be creating a new NFT. So that's what we're going to do! 

But before talking about what do we need to do in the instruction, let's introduce the `NoopSigner`

A **Noop Signer** creates a `Signer` that, when required to sign, does nothing. This can be useful when libraries require a `Signer` but we don't have one in the current environment, like for our example.

**The Instruction**
- Use the `collectionAutority` as Authority for the `create` instruction 
- Use `createNoopSigner` with the pubkey we get from the frontend 
- Use the `NoopSigner` as Payer for the `create` instruction 
- And define the `frontendPubkey` as `owner`

We start with creating the instruction in the backend, sign it with our `collectionAutority`, serialize it and pass it to the frontend. Then the frontend will then deserialize it, sign it with the `frontendPubkey`and send the transaction!

### Backend

```ts
// Use the Collection Authority Keypair
const collectionAuthority = generateSigner(umi)
umi.use(signerIdentity(collectionAuthority))

// Create a noop signer that allows you to sign later
const frontendPubkey = publickey('<Frontend Pubkey>')
const frontEndSigner = createNoopSigner(frontendPubkey)

// Create the Asset Keypair
const asset = generateSigner(umi);

// Fetch the Collection
const collection = await fetchCollection(umi, publickey(`<Collection Address>`)); 

// Create the createAssetTx and sign it with the `collectionAuthority`
let createAssetTx = await create(umi, {
  asset: asset,
  collection: collection,
  authority: collectionAuthority,
  payer: createNoopSigner(owner.publicKey),
  owner: owner.publicKey,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
}).buildAndSign(umi);

// Serialize and Return the Transaction to the Frontend
const serializedCreateAssetTx = umi.transactions.serialize(createAssetTx)

return serializedCreateAssetTx
```

### Front End

```ts
// Deserialize the Transaction returned by the Backend
const deserializedCreateAssetTx = umi.transactions.deserialize(serializedCreateAssetTx)

// Sign the Transaction with the Keypair that we got from the walletAdapter
const signedDeserializedCreateAssetTx = await umi.identity.signTransaction(deserializedCreateAssetTx)

// Send the Transaction
await umi.rpc.sendTransaction(signedDeserializedCreateAssetTx)
```

## Reproducible Code Example

Naturally, if you want to have a fully reproducible example, we need to change some stuff. Like how we handle the frontend signer and the fact that we need to create a collection too. So don't be scared if things aren't exactly the same.

```ts
import { generateSigner, createSignerFromKeypair, signerIdentity, sol, createNoopSigner, transactionBuilder } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers';
import { createCollection, create, fetchCollection } from '@metaplex-foundation/mpl-core'

const umi = createUmi("https://api.devnet.solana.com", "finalized")

const signer = generateSigner(umi);
umi.use(signerIdentity(signer));

const owner = generateSigner(umi);

await umi.rpc.airdrop(umi.identity.publicKey, sol(1));
await umi.rpc.airdrop(owner.publicKey, sol(1));

(async () => {
  // Generate the Collection KeyPair
  const collectionAddress = generateSigner(umi)
  console.log("\nCollection Address: ", collectionAddress.publicKey.toString())

  // Generate the collection
  let createCollectionTx = await createCollection(umi, {
    collection: collectionAddress,
    name: 'My Collection',
    uri: 'https://example.com/my-collection.json',
  }).sendAndConfirm(umi)

  console.log(`\nCollection Created: https://solana.fm/tx/${base58.deserialize(createCollectionTx.signature)[0]}?cluster=devnet-alpha`);

  // Generate the Asset KeyPair
  const asset = generateSigner(umi);
  console.log("\nAsset Address: ", asset.publicKey.toString());

  // Fetch the Collection
  const collection = await fetchCollection(umi, collectionAddress.publicKey); 

  // Generate the Asset
  let createAssetTx = await create(umi, {
    asset: asset,
    collection: collection,
    authority: signer,
    payer: createNoopSigner(owner.publicKey),
    owner: owner.publicKey,
    name: 'My NFT',
    uri: 'https://example.com/my-nft.json',
  }).buildAndSign(umi);

  const serializedCreateAssetTx = umi.transactions.serialize(createAssetTx)

  let deserializedCreateAssetTx = umi.transactions.deserialize(serializedCreateAssetTx)
  deserializedCreateAssetTx = await owner.signTransaction(deserializedCreateAssetTx)

  console.log(`\nCollection Created: https://solana.fm/tx/${base58.deserialize(await umi.rpc.sendTransaction(deserializedCreateAssetTx))[0]}}?cluster=devnet-alpha`);
})();
```