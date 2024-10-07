---
title: Serializing, Deserializing, and sending Transactions
metaTitle: Umi - Serializing, Deserializing, and sending Transactions
description: Learn how to Serialize and Deserialize Transactions to move them across different environments while using the Metaplex Umi client.
created: '08-15-2024'
updated: '08-15-2024'
---

**In this guide we're going to talk about:**
- Serializing and Deserializing Transaction
- Noop Signer
- Partially signed transactions
- Passing transactions from different environments

## Introduction

Transactions are usually serialized to facilitate movement across different environments. But the reasons could be different:
- You may require signatures from different authorities stored in separate environments.
- You may wish to create a transaction on the frontend, but then send and validate it on the backend before storing it to a database.

For example, when creating NFTs, you may need to sign the transaction with the `collectionAuthority` keypair to authorize the NFT into the Collection. To safely sign it, without exposing your keypair, you could first create the transaction in the backend, partially sign the transaction with the `collectionAuthority` without having to expose the keypair in a non secure environment, serialize the transaction and then send it. You can then safely deserialize the transactions and sign it with the `Buyer` wallet.

**Note**: When using the Candy Machine, you don't need the `collectionAuthority` signature 

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

These are all the imports that we're going to use for this guide.  

```ts
import { generateSigner, signerIdentity, createNoopSigner } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { fetchCollection, create, mplCore } from '@metaplex-foundation/mpl-core'
import { base64 } from '@metaplex-foundation/umi/serializers';
```

## Setting up Umi

While setting up Umi you can use or generate keypairs/wallets from different sources. You create a new wallet for testing, import an existing wallet from the filesystem, or use `walletAdapter` if you are creating a website/dApp.  

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
import * as fs from "fs";
import * as path from "path";

const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())

// Use fs to navigate the filesystem till you reach
// the wallet you wish to use via relative pathing.
const walletFile = fs.readFileSync(
  path.join(__dirname, './keypair.json')
)

// Usually Keypairs are saved as Uint8Array, so you  
// need to transform it into a usable keypair.  
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

// Before Umi can use this Keypair you need to generate 
// a Signer type with it.  
const signer = createSignerFromKeypair(umi, keyair);

// Tell Umi to use the new signer.
umi.use(signerIdentity(walletFile))
```

{% /totem-accordion %}

{% totem-accordion title="With the Wallet Adapter" %}

```ts
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { useWallet } from '@solana/wallet-adapter-react'

const wallet = useWallet()

const umi = createUmi('https://api.devnet.solana.com')
.use(mplCore())
// Register Wallet Adapter to Umi
.use(walletAdapterIdentity(wallet))
```

{% /totem-accordion %}

{% /totem %}

## Serialization

Serialization of a transaction is the process of converting the transaction object into a series of bytes or string that saves the state of the transaction in an easily transmittable form. This allows it to be passed through the likes of a http request.  

Within the serialization example we're going to:  
- Use the `NoopSigner` to add the `Payer` as `Signer` in the instruction
- Create a Versioned Transaction and sign it with the `collectionAuthority` and the `Asset`
- Serialize it so all the details are preserved and can be accurately reconstructed by the frontend
- And send it as a String, instead of a u8, so it can be passed through a request

### Noop Signer

Partially signing transactions to then serialize them, is only possible because of the `NoopSigner`. 

Umi instructions can take `Signer` types by default that are often generated from local keypair files or `walletAdapter` signers. Sometimes you may not have access to a certain signer yet and will need to sign with said signer at a later point in time. This is where the Noop Signer comes into play.

The **Noop Signer** takes a publicKey and generates a special `Signer` type which allows Umi to build instructions without needing the Noop Signer to be present or to sign the transaction at the current point in time.

Instructions and transactions built with  *Noop Signers* will be expecting them to sign at some point before sending off the transaction to the chain and will cause a "missing signature" error if not present.

The way to use it is: 
```ts
createNoopSigner(publickey('11111111111111111111111111111111'))
```

### Using Strings instead of Binary data

The decision to turn Serialized Transactions into Strings before passing them between environment is rooted in: 
- Formats like Base64 are universally recognized and can be safely transmitted over HTTP without the risk of data corruption or misinterpretation.
- Using strings aligns with standard practices for web communication. Most APIs and web services expect data in JSON or other string-based formats

The way to do it is to use the `base64` function present in the `@metaplex-foundation/umi/serializers` package.

**Note**: you don't need to install the package since it's included in the `@metaplex-foundation/umi` package

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
const frontendPubkey = publickey('11111111111111111111111111111111')
const frontEndSigner = createNoopSigner(frontendPubkey)

// Create the Asset Keypair
const asset = generateSigner(umi);

// Fetch the Collection
const collection = await fetchCollection(umi, publickey(`11111111111111111111111111111111`)); 

// Create the createAssetIx
const createAssetTx = await create(umi, {
  asset: asset,
  collection: collection,
  authority: collectionAuthority,
  payer: frontEndSigner,
  owner: frontendPubkey,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
})
  .useV0()
  .setBlockhash(await umi.rpc.getLatestBlockhash())
  .buildAndSign(umi);

// Serialize the Transaction
const serializedCreateAssetTx = umi.transactions.serialize(createAssetTx)

// Encode Uint8Array to String and Return the Transaction to the Frontend
const serializedCreateAssetTxAsString = base64.deserialize(serializedCreateAssetTx)[0];

return serializedCreateAssetTxAsString
```

## Deserialization

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

(async () => {
  
  // Airdrop Tokens inside of the wallets
  await umi.rpc.airdrop(umi.identity.publicKey, sol(1));
  await umi.rpc.airdrop(frontEndSigner.publicKey, sol(1));

  // Generate the Collection KeyPair
  const collectionAddress = generateSigner(umi)
  console.log("\nCollection Address: ", collectionAddress.publicKey.toString())

  // Generate the collection
  let createCollectionTx = await createCollection(umi, {
    collection: collectionAddress,
    name: 'My Collection',
    uri: 'https://example.com/my-collection.json',
  }).sendAndConfirm(umi)

  const createCollectionSignature = base58.deserialize(createCollectionTx.signature)[0]
  console.log(`\nCollection Created: https://solana.fm/tx/${createCollectionSignature}?cluster=devnet-alpha`);

  // Serialize
  
  const asset = generateSigner(umi);
  console.log("\nAsset Address: ", asset.publicKey.toString());

  const collection = await fetchCollection(umi, collectionAddress.publicKey); 

  let createAssetIx = await create(umi, {
    asset: asset,
    collection: collection,
    authority: collectionAuthority,
    payer: createNoopSigner(frontEndSigner.publicKey),
    owner: frontEndSigner.publicKey,
    name: 'My NFT',
    uri: 'https://example.com/my-nft.json',
  })
    .useV0()
    .setBlockhash(await umi.rpc.getLatestBlockhash())
    .buildAndSign(umi);


  const serializedCreateAssetTx = umi.transactions.serialize(createAssetTx)
  const serializedCreateAssetTxAsString = base64.deserialize(serializedCreateAssetTx)[0];

  // Deserialize

  const deserializedCreateAssetTxAsU8 = base64.serialize(serializedCreateAssetTxAsString);
  const deserializedCreateAssetTx = umi.transactions.deserialize(deserializedCreateAssetTxAsU8)
  const signedDeserializedCreateAssetTx = await frontEndSigner.signTransaction(deserializedCreateAssetTx)

  const createAssetSignature = base58.deserialize(await umi.rpc.sendTransaction(signedDeserializedCreateAssetTx))[0]
  console.log(`\nAsset Created: https://solana.fm/tx/${createAssetSignature}}?cluster=devnet-alpha`);
})();
```