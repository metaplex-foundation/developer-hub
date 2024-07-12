---
title: How to Send and Transfer SPL Tokens on Solana
metaTitle: How to Send and Transfer SPL Tokens on Solana
description: Learn how to send and transfer SPL Tokens via javascript on the Solana blockchain wih Metaplex packages.
# remember to update dates also in /components/guides/index.js
created: '06-16-2024'
updated: '06-24-2024'
---

This guide will show you how to build out a Javascript function to send and transfer SPL tokens on the Solana blockchain utilizing the Metaplex Umi client wrapper and MPL Toolbox packages.

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

```ts
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
  .use(irysUploader())

// Generate a new keypair signer.
const signer = generateSigner(umi)

// You will need to us fs and navigate the filesystem to
// load the wallet you wish to use via relative pathing.
const walletFile = const imageFile = fs.readFileSync(
    path.join(__dirname, './keypair.json')
  )
```

## Key Accounts

When transferring SPL Tokens on Solana we need to work out both the senders and recieves SPL Token Account addresses for the token we are trying to send.

Token Account addresses are unique between coins and wallets so we need to use a helper function to determine what each account address is for the both the sender and the reciever.

```ts
// The address of the Token you want to transfer.
const splToken = publicKey('111111111111111111111111111111')

// The address of the wallet you want to transfer the Token to.
const recipeientWallet = publicKey('22222222222222222222222222222222')

// Find the associated token account for the SPL Token on the senders wallet.
const sourceTokenAccount = findAssociatedTokenPda(umi, {
  mint: splToken,
  owner: umi.identity.publicKey,
})

// Find the associated token account for the SPL Token on the receivers wallet.
const destinationTokenAccount = findAssociatedTokenPda(umi, {
  mint: splToken,
  owner: recipeientWallet,
})
```

## Sending the SPL Tokens

```ts
import {
  findAssociatedTokenPda,
  mplToolbox,
  transferTokens,
} from '@metaplex-foundation/mpl-toolbox'
import {
  generateSigner,
  publicKey,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers'

const transferSplTokens = async () => {
  const umi = createUmi('https://api.devnet.solana.com').use(mplToolbox())

  const signer = generateSigner(umi)

  umi.use(signerIdentity(signer))

  // Airdrop 1 SOL to the identity
  // if you end up with a 429 too many requests error, you may have to use
  // the filesystem wallet method or change rpcs.
  await umi.rpc.airdrop(umi.identity.publicKey, sol(1))

  //
  // Key Accounts
  //

  // The address of the Token you want to transfer.
  const splToken = publicKey('111111111111111111111111111111')

  // The address of the wallet you want to transfer the Token to.
  const recipientWallet = publicKey('22222222222222222222222222222222')

  // Find the associated token account for the SPL Token on the senders wallet.
  const sourceTokenAccount = findAssociatedTokenPda(umi, {
    mint: splToken,
    owner: umi.identity.publicKey,
  })

  // Find the associated token account for the SPL Token on the receivers wallet.
  const destinationTokenAccount = findAssociatedTokenPda(umi, {
    mint: splToken,
    owner: recipientWallet,
  })

  //
  // Transfer SPL Token
  //

  const res = await transferTokens(umi, {
    source: sourceTokenAccount,
    destination: destinationTokenAccount,
    amount: 10000, // amount of tokens to transfer*
  }).sendAndConfirm(umi)

  // Log the signature of the transaction
  console.log(base58.deserialize(res.signature))
}

transferSplTokens()
```
