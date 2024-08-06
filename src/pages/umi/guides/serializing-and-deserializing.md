---
title: Serializing, Deserializing, and sending Transactions
metaTitle: Serializing, Deserializing, and sending Transactions
description: Learn how to use the Noop signer to pass partially signed transaction from the Backend to the Frontend (and viceversa)
created: '08-2-2024'
updated: '08-2-2024'
---

**In this guide we're going to talk about:**
- Serializing and Deserializing Transaction
- Noop Signer
- Partially signed transactions
- Passing transactions from different environments

## Introduction

Transaction are usually serialized to facilitate movement across different environments. But the reasons could be different:
- Requiring signatures from different authorities stored in separate environments.
- Validating the transaction before it is entered or stored in a database.

For example, when creating NFTs, you might need to store an `Authority` keypair to sign the NFT's inclusion in the Collection. To safely sign it, without exposing your keypair, you'll need to create partially signed transaction in a secure environment, serialize it and broadcast it to another environoment that can be deserialized and signed by another wallet. 

## Initial Setup

### Required Packages and Imports

We're going to use the following packages: 

{% packagesUsed packages=["umi", "umiDefaults", "core"] type="npm" /%}

To install them, use the following commands:

```
npm i @metaplex-foundation/umi 
```

```
npm i @metaplex-foundation/umi-bundle-defaults 
```

```
npm i @metaplex-foundation/mpl-core
```

This are all the import what we're going to use for this particular guide

```ts
import { generateSigner, signerIdentity, createNoopSigner } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { fetchCollection, create } from '@metaplex-foundation/mpl-core'
import { base64 } from '@metaplex-foundation/umi/serializers';
```

## Setting up Umi

To set up Umi you can use wallets from different sources. You could create it with a new wallet, an existing wallet, or with the wallet adapter


{% totem %}

{% totem-accordion title="With a New Wallet" %}

```ts
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())

// Generate a new keypair signer.
const signer = generateSigner(umi)

// Tell Umi to use the new signer.
umi.use(signerIdentity(signer))
```

{% /totem-accordion %}

{% totem-accordion title="With an Existing Wallet" %}

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

// Before Umi can use this Keypair you need to generate 
// a Signer type with it
const signer = createSignerFromKeypair(umi, keyair);

// Tell Umi to use the new signer.
umi.use(signerIdentity(walletFile))
```

{% /totem-accordion %}

{% totem-accordion title="With the Wallet Adapter" %}

/// ToDO

{% /totem-accordion %}

{% /totem %}

## Serialization

In the serialization example we're going to:
- Use the `NoopSigner` to add the `Payer` as `Signer` in the instruction
- Create a Versioned Transaction and sign it with the `collectionAutority` and the `asset`
- Serialize it so all the details are preserved and can be accurately reconstructed by the frontend
- And send it as a String, instead of a u8, so it can be passed through a request

### Noop Signer

Partially signing transactions to then serialize them, is only possible because of the `NoopSigner`. 

The **Noop Signer** creates a `Signer` from a simple `Publickey` to be passed in instruction that requires it, even if we don't currently have access to the actual `Signer`. Once we have the possibility of using that `Signer`, we need to sing the transaction with it, or it will fail.

The way to use it is: 
```ts
createNoopSigner(publicKey)
```

### Using Strings instead of Binary data

The decision to turn Serialized Transactions into Strings before passing them between environment is rooted in: 
- Formats like Base64 are universally recognized and can be safely transmitted over HTTP without the risk of data corruption or misinterpretation.
- Using strings aligns with standard practices for web communication. Most APIs and web services expect data in JSON or other string-based formats

The way to do it is to use the `base64` function present in the `@metaplex-foundation/umi/serializers` package and use:

```ts 
// Using the base64.deserialize and passing in a serializedTx 
const serializedTxAsString = base64.deserialize(serializedTx)[0];

// Using the base64.serialize and passing in the serializedTxAsString
const deserializedTxAsU8 = base64.serialize(serializedTxAsString);
```

### Code Example

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

// Create the createAssetIx
let createAssetIx = create(umi, {
  asset: asset,
  collection: collection,
  authority: collectionAuthority,
  payer: frontEndSigner,
  owner: frontendPubkey,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
}).getInstructions()

// Get the latest blockhash
const blockhash = await umi.rpc.getLatestBlockhash()

// Create a Versioned Transaction
let createAssetTx = umi.transactions.create({
  version: 0,
  payer: frontendPubkey,
  instructions: createAssetIx,
  blockhash: blockhash.blockhash,
});

// Sign it with both the CollectionAuthority and the Asset
let signedCreateAssetTx = await umi.identity.signTransaction(createAssetTx);
signedCreateAssetTx = await asset.signTransaction(createAssetTx);

// Serialize the Transaction
const serializedCreateAssetTx = umi.transactions.serialize(createAssetTx)

// Encode Uint8Array to String and Return the Transaction to the Frontend
const serializedCreateAssetTxAsString = base64.deserialize(serializedCreateAssetTx)[0];

return serializedCreateAssetTxAsString
```

### Deserialization

In the deserialization example we're going to:
- Transform the Transaction that we received through the request back to a Uint8Array
- Deserialize it so we can operate on it from the point we left
- Sign it with the `Payer` keypair since we used it through the `NoopSigner` in the other environment
- Send it

### Code Example

```ts
// Decode the String to Uint8Array to make it usable
const deserializedCreateAssetTxAsU8 = base64.serialize(serializedCreateAssetTxAsString);

// Deserialize the Transaction returned by the Backend
const deserializedCreateAssetTx = umi.transactions.deserialize(deserializedCreateAssetTxAsU8)

// Sign the Transaction with the Keypair that we got from the walletAdapter
const signedDeserializedCreateAssetTx = await umi.identity.signTransaction(deserializedCreateAssetTx)

// Send the Transaction
await umi.rpc.sendTransaction(signedDeserializedCreateAssetTx)
```

## Full Code Example

Naturally, to have a fully reproducible example of the instructions in action, we need to include additional steps, such as handling the frontend signer and creating a collection. 

Don't worry if everything isn't identical; the backend and frontend portions remain consistent.

```ts
import { generateSigner, createSignerFromKeypair, signerIdentity, sol, createNoopSigner, transactionBuilder } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers';
import { createCollection, create, fetchCollection } from '@metaplex-foundation/mpl-core'

const umi = createUmi("https://api.devnet.solana.com", "finalized")

const collectionAuthority = generateSigner(umi);
umi.use(signerIdentity(collectionAuthority));

const frontEndSigner = generateSigner(umi);

await umi.rpc.airdrop(umi.identity.publicKey, sol(1));
await umi.rpc.airdrop(frontEndSigner.publicKey, sol(1));

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

  // Serialize
  
  const asset = generateSigner(umi);
  console.log("\nAsset Address: ", asset.publicKey.toString());

  const collection = await fetchCollection(umi, collectionAddress.publicKey); 

  let createAssetIx = create(umi, {
    asset: asset,
    collection: collection,
    authority: collectionAuthority,
    payer: createNoopSigner(frontEndSigner.publicKey),
    owner: frontEndSigner.publicKey,
    name: 'My NFT',
    uri: 'https://example.com/my-nft.json',
  }).getInstructions()

  const blockhash = await umi.rpc.getLatestBlockhash()
  let createAssetTx = umi.transactions.create({
    version: 0,
    payer: frontEndSigner.publicKey,
    instructions: createAssetIx,
    blockhash: blockhash.blockhash,
  });
  let signedCreateAssetTx = await umi.identity.signTransaction(createAssetTx);
  signedCreateAssetTx = await asset.signTransaction(createAssetTx);

  const serializedCreateAssetTx = umi.transactions.serialize(createAssetTx)
  const serializedCreateAssetTxAsString = base64.deserialize(serializedCreateAssetTx)[0];

  // Deserialize

  const deserializedCreateAssetTxAsU8 = base64.serialize(serializedCreateAssetTxAsString);
  const deserializedCreateAssetTx = umi.transactions.deserialize(deserializedCreateAssetTxAsU8)
  const signedDeserializedCreateAssetTx = await frontEndSigner.signTransaction(deserializedCreateAssetTx)

  console.log(`\nAsset Created: https://solana.fm/tx/${base58.deserialize(await umi.rpc.sendTransaction(signedDeserializedCreateAssetTx))[0]}}?cluster=devnet-alpha`);
})();
```