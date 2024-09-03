---
title: How to Send and Transfer SPL Tokens on Solana
metaTitle: How to Send and Transfer SPL Tokens on Solana| Guides
description: Learn how to send and transfer SPL Tokens via javascript on the Solana blockchain wih Metaplex packages.
# remember to update dates also in /components/guides/index.js
created: '06-16-2024'
updated: '06-24-2024'
---

This guide will show you how to build out a Javascript function to send and transfer SPL tokens on the Solana blockchain utilizing the Metaplex Umi client wrapper and MPL Toolbox packages.

For this guide you will need to have some SPL Tokens in your wallet to transfer so if you not have any in your wallet you will need to get someone to transfer some to you or you can follow our other [how to create an SPL Token guide](/guides/javascript/how-to-create-an-spl-token-on-solana).

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

Install the required packages for this guide.

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
import {
  findAssociatedTokenPda,
  mplToolbox,
  transferTokens,
} from '@metaplex-foundation/mpl-toolbox'
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers'
import fs from 'fs'
import path from 'path'

const transferSplTokens = async () => {
  const umi = createUmi('https://api.devnet.solana.com').use(mplToolbox())

  // import a wallet that has the SPL Token you want to transfer
  const walletFile = fs.readFileSync('./keypair.json')

  // Convert your walletFile onto a keypair.
  let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile))

  // Load the keypair into umi.
  umi.use(keypairIdentity(keypair))

//
  // Key Accounts
  //

  // The address of the Token you want to transfer.
  const splToken = publicKey("111111111111111111111111111111");

  // The address of the wallet you want to transfer the Token to.
  const destinationWallet = publicKey("22222222222222222222222222222222");

  // Find the associated token account for the SPL Token on the senders wallet.
  const sourceTokenAccount = findAssociatedTokenPda(umi, {
    mint: splToken,
    owner: umi.identity.publicKey,
  });

  // Find the associated token account for the SPL Token on the receivers wallet.
  const destinationTokenAccount = findAssociatedTokenPda(umi, {
    mint: splToken,
    owner: destinationWallet,
  });

  //
  // Transfer SPL Token
  //

  const res = await transferTokens(umi, {
    source: sourceTokenAccount,
    destination: destinationTokenAccount,
    amount: 10000, // amount of tokens to transfer*
  }).sendAndConfirm(umi);

  // Finally we can deserialize the signature that we can check on chain.
  const signature = base58.deserialize(res.signature)[0];

  // Log out the signature and the links to the transaction and the NFT.
  console.log("\nTransfer Complete")
  console.log("View Transaction on SolanaFM");
  console.log(`https://solana.fm/tx/${signature}?cluster=devnet-alpha`);
}

transferSplTokens()
```
