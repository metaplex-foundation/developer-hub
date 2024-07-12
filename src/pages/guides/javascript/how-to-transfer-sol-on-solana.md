---
title: How to Send and Transfer SOL on Solana
metaTitle: How to Send and Transfer SOL on Solana
description: Learn how to send and transfer SOL via javascript on the Solana blockchain.
# remember to update dates also in /components/guides/index.js
created: '06-16-2024'
updated: '06-24-2024'
---

This guide walks will show you how to build a Javascript function that transfers SOL from one wallet to another on the Solana blockchain utilizing the Metaplex Umi client wrapper and MPL Toolbox package.

## Prerequisite

- Code Editor of your choice (recommended Visual Studio Code)
- Node 18.x.x or above.

## Initial Setup

### Initializing

Start by initializing a new project (optional) with the package manager of your choice (npm, yarn, pnpm, bun) and fill in required details when prompted.

```js
npm init
```

### Required Packages

Install the required pacakges for this guide.

{% packagesUsed packages=["umi", "umiDefaults" ,"toolbox"] type="npm" /%}

```js
npm i @metaplex-foundation/umi
```

```js
npm i @metaplex-foundation/umi-bundle-defaults
```

```js
npm i @metaplex-foundation/mpl-toolbox;
```

### Imports and Wrapper Function

Here we will define all needed imports for this particular guide and create a wrapper function where all our code will execute.

```ts
import { mplToolbox, transferSol } from '@metaplex-foundation/mpl-toolbox'
import {
  generateSigner,
  publicKey,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers'

// Create the wrapper function
const transferSolana = async () => {

  ///
  ///
  ///  all our code will go in here
  ///
  ///

}

// run the wrapper function
transferSolana()
```

## Setting up Umi

This example is going to run through setting up Umi with a `generatedSigner()`. If you wish to try this example with React you'll need to setup Umi via the `React - Umi w/ Wallet Adapter` guide. Apart from the the wallet setup this guide will for fileStorage keys and wallet adapter.

### Generating a New Wallet

If you wish to generate a new wallet/private key to test with you generate a new signer with `umi`.

```ts
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
  .use(irysUploader())

// Generate a new keypair signer.
const signer = generateSigner(umi)

// Tell umit to use the new signer.
umi.use(signerIdentity(signer))

// This will airdrop SOL on devnet only for testing.
await umi.rpc.airdrop(umi.identity.publickey)
```

### Use an Existing Wallet

If you wish to use an existing wallet you can import this a few different ways. The below code assumes that the private key is stored in `.json` format on your hardrive somewhere.

```ts
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
  .use(irysUploader())

// Generate a new keypair signer.
const signer = generateSigner(umi)

// You will need to use fs and navigate the filesystem to
// load the wallet you wish to use via relative pathing.
const walletFile = const imageFile = fs.readFileSync(
    path.join(__dirname, './keypair.json')
  )
```

## Transferring Sol

The `mpl-toolbox` package provides a helper function called `transferSol` that creates the instructions needed in order to execute a transfer on the blockchain.

```ts

// Here we call the transferSol() function and send it to the chain.

const res = await transferSol(umi, {
    source: umi.identity,
    destination: publicKey('111111111111111111111111111111'),
    amount: sol(1),
  }).sendAndConfirm(umi)
```

## Full Code Example

```ts
import { mplToolbox, transferSol } from '@metaplex-foundation/mpl-toolbox'
import {
  generateSigner,
  publicKey,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers'

const transfer = async () => {
  const umi = createUmi('https://api.devnet.solana.com').use(mplToolbox())

  const signer = generateSigner(umi)

  umi.use(signerIdentity(signer))

  // Airdrop 1 SOL to the identity
  // if you end up with a 429 too many requests error, you may have to use
  // the filesystem wallet method or change rpcs.
  await umi.rpc.airdrop(umi.identity.publicKey, sol(1))

  //
  // Transfer SOL
  //

  const res = await transferSol(umi, {
    source: umi.identity,
    destination: publicKey('111111111111111111111111111111'),
    amount: sol(1),
  }).sendAndConfirm(umi)

  // Log the signature of the transaction
  console.log(base58.deserialize(res.signature))
}

transfer()
```
