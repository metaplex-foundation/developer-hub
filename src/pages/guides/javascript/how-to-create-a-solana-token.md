---
title: How to Create a Solana Token
metaTitle: How to Create a Solana Token | Guides
description: Learn how to create an SPL Token/meme coin on the Solana blockchain with Metaplex packages.
# remember to update dates also in /components/guides/index.js
created: '04-19-2024'
updated: '04-19-2025'
---

This step by step guide will assist you in creating a Solana token (SPL Token) on the Solana blockchain. You can use the Metaplex Umi client wrapper and Mpl Toolbox package with Javascript. This enables you to create a function that you can use in scripts as well as frontend and backend frameworks.

## Prerequisite

- Code Editor of your choice (recommended Visual Studio Code)
- Node 18.x.x or above.

## Initial Setup

Begin by creating a new project (optional) using a package manager like npm, yarn, pnpm, or bun. Fill in necessary information when asked.

```js
npm init
```

### Required Packages

Install the required packages for this guide.

```js
npm i @metaplex-foundation/umi
```

```js
npm i @metaplex-foundation/umi-bundle-defaults
```

```js
npm i @metaplex-foundation/mpl-token-metadata
```

```js
npm i @metaplex-foundation/umi-uploader-irys
```

```js
npm i @metaplex-foundation/mpl-toolbox
```

### Imports and Wrapper Function

In this guide, we will list all the necessary imports and create a wrapper function for our code to run.

```ts
import {
  createFungible,
  mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata'
import {
  createTokenIfMissing,
  findAssociatedTokenPda,
  getSplAssociatedTokenProgramId,
  mintTokensTo,
} from '@metaplex-foundation/mpl-toolbox'
import {
  generateSigner,
  percentAmount,
  createGenericFile,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import { base58 } from '@metaplex-foundation/umi/serializers'
import fs from 'fs'
import path from 'path'

// Create the wrapper function
const createAndMintTokens = async () => {
  ///
  ///
  ///  all our code will go in here
  ///
  ///
}

// run the wrapper function
createAndMintTokens()
```

## Setting up Umi

This example is going to run through setting up Umi with a `generatedSigner()`. If you wish to set up a wallet or signer in a different way you can check out the [**Connecting to Umi**](/umi/connecting-to-umi) guide.

You can place the umi variable and code block either inside or outside the `createAndMintTokens()` function. All that matters is that your `umi` variable is accessible from the `createAndMintTokens()` function itself.

### Generating a New Wallet

```ts
const umi = createUmi("https://devnet-aura.metaplex.com/<YOUR_API_KEY>")
  .use(mplCore())
  .use(irysUploader())

// Generate a new keypair signer.
const signer = generateSigner(umi)

// Tell umi to use the new signer.
umi.use(signerIdentity(signer))

// Airdrop 1 SOL to the identity
// if you end up with a 429 too many requests error, you may have to use
// the a different rpc other than the free default one supplied.
await umi.rpc.airdrop(umi.identity.publicKey)
```

### Use an Existing Wallet Stored Locally

```ts
const umi = createUmi("https://devnet-aura.metaplex.com/<YOUR_API_KEY>")
  .use(mplTokenMetadata())
  .use(mplToolbox())
  .use(irysUploader())

// You will need to us fs and navigate the filesystem to
// load the wallet you wish to use via relative pathing.
const walletFile = fs.readFileSync('./keypair.json', {encoding: "utf-8"})

// Convert your walletFile onto a keypair.
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(JSON.parse(walletFile)));

// Load the keypair into umi.
umi.use(keypairIdentity(umiSigner));
```

## Creating the Token

### Uploading the Image

The first thing we need to do is to an image that represents the token and makes it recognizable. This can be in the form of jpeg, png or gif.

Umi has plugins for storing files on Arweave, NftStore, AWS, and ShdwDrive. You can download these plugins to upload files. At start of this guide we had installed the irysUploader() plugin which stores content on the Arweave blockchain so we'll stick with using that.

{% callout title="Local script/Node.js" %}
This example is using a local script/node.js approach using Irys to upload to Arweave. If you wish to upload files to a different storage provider or from the browser you will need to take a different approach. Importing and using `fs` won't work in a browser scenario.
{% /callout %}

```ts
// use `fs` to read file via a string path.

const imageFile = fs.readFileSync('./image.jpg')

// Use `createGenericFile` to transform the file into a `GenericFile` type
// that Umi can understand. Make sure you set the mimetag type correctly
// otherwise Arweave will not know how to display your image.

const umiImageFile = createGenericFile(imageFile, 'image.jpeg', {
  tags: [{ name: 'contentType', value: 'image/jpeg' }],
})

// Here we upload the image to Arweave via Irys and we get returned a uri
// address where the file is located. You can log this out but as the
// uploader can takes an array of files it also returns an array of uris.
// To get the uri we want we can call index [0] in the array.

const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
  throw new Error(err)
})

console.log(imageUri[0])
```

### Uploading the Metadata

Once we have a valid and working image URI we can start working on the metadata for our SPL Token.

The standard for offchain metadata for a fungible token is as follows

```json
{
  "name": "TOKEN_NAME",
  "symbol": "TOKEN_SYMBOL",
  "description": "TOKEN_DESC",
  "image": "TOKEN_IMAGE_URL"
}
```

The fields here include

#### name

The name of your token.

#### symbol

The short hand of your token. Where Solana's shorthand would be SOL.

#### description

The description of your token.

#### image

This will be set to the imageUri (or any online location of the image) that we uploaded previously.

```js
// Example metadata
const metadata = {
  name: 'The Kitten Coin',
  symbol: 'KITTEN',
  description: 'The Kitten Coin is a token created on the Solana blockchain',
  image: imageUri, // Either use variable or paste in string of the uri.
}

// Call upon Umi's `uploadJson` function to upload our metadata to Arweave via Irys.

const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
  throw new Error(err)
})
```

If everything goes as planned, the metadataUri variable should store the URI of the uploaded JSON file.

### Creating a Token

When creating a new token on the Solana blockchain we need to create a few accounts to accommodate the new data.

#### Creating The Mint Account and Token Metadata

While the Mint account of stores initial minting details of Mint such as number of decimals, the total supply, and mint and freeze authorities, the Token Metadata account holds properties of the token such as `name`, off chain metadata `uri`, `description` of the token, and the tokens `symbol`. Together these accounts provide all the information for a SPL Token on Solana.

The `createFungible()` function below creates both the Mint account and the Token Metadata account for use.

We need to supply the function a keypair which will become the mint address. We also need to provide additional metadata from a JSON file. This metadata includes the token's name and the metadata URI address.

```ts
const mintSigner = generateSigner(umi)

const createMintIx = await createFungible(umi, {
  mint: mintSigner,
  name: 'The Kitten Coin',
  uri: metadataUri, // we use the `metadataUri` variable we created earlier that is storing our uri.
  sellerFeeBasisPoints: percentAmount(0),
  decimals: 9, // set the amount of decimals you want your token to have.
})
```

### Minting Tokens

#### Token Account

If we are minting the tokens straight away then we need a place to store the tokens in someones wallet. To do this we mathematically generate an address based on both the wallet and mint address which is called a Associated Token Account (ATA) or sometimes just referred to as just a Token Account. This Token Account (ATA) belongs to the wallet and stores our tokens for us.

#### Generating a Token Account.

The first thing we need to do is figure out what the Token Account address should be. MPL-Toolbox has a helper function we can import that does just that while also creating the Token Account for if it doesn't exist.

```ts
const createTokenIx = createTokenIfMissing(umi, {
  mint: mintSigner.publicKey,
  owner: umi.identity.publicKey,
  ataProgram: getSplAssociatedTokenProgramId(umi),
})
```

#### Mint Tokens Transaction

Now that we have a instruction to create an Token Account we can mint tokens to that account with the `mintTokenTo()` instruction.

```ts
const mintTokensIx = mintTokensTo(umi, {
  mint: mintSigner.publicKey,
  token: findAssociatedTokenPda(umi, {
    mint: mintSigner.publicKey,
    owner: umi.identity.publicKey,
  }),
  amount: BigInt(1000),
})
```

### Sending the Transaction

You can send and arrange the transactions in multiple ways but in this example we are going to chain the instructions together into one atomic transaction and send everything at one. If any of the instructions fail here then the whole transaction fails.

```ts
// chain the instructions together with .add() then send with .sendAndConfirm()

const tx = await createFungibleIx
  .add(createTokenIx)
  .add(createTokenAccountIfMissing)
  .add(mintTokensIx)
  .sendAndConfirm(umi)

// finally we can deserialize the signature that we can check on chain.
// import { base58 } from "@metaplex-foundation/umi/serializers";

console.log(base58.deserialize(tx.signature)[0])
```

Now that you know how to make a token on Solana, some basic project ideas could include:

- a solana token creator
- meme coin generator

You can now also consider creating a liquidity pool to list your token on decentralized exchanges such as Jupiter and Orca.

## Full Code Example

```ts
import {
  createFungible,
  mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata'
import {
  createTokenIfMissing,
  findAssociatedTokenPda,
  getSplAssociatedTokenProgramId,
  mintTokensTo,
} from '@metaplex-foundation/mpl-toolbox'
import {
  generateSigner,
  percentAmount,
  createGenericFile,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import { base58 } from '@metaplex-foundation/umi/serializers'
import fs from 'fs'
import path from 'path'

const createAndMintTokens = async () => {
  const umi = createUmi("https://devnet-aura.metaplex.com/<YOUR_API_KEY>")
    .use(mplTokenMetadata())
    .use(irysUploader())

  const signer = generateSigner(umi)

  umi.use(signerIdentity(signer))

// Airdrop 1 SOL to the identity
  // if you end up with a 429 too many requests error, you may have to use
  // the filesystem wallet method or change rpcs.
  console.log("AirDrop 1 SOL to the umi identity");
  await umi.rpc.airdrop(umi.identity.publicKey, sol(1));

  // use `fs` to read file via a string path.
  
  const imageFile = fs.readFileSync("./image.jpg");

  // Use `createGenericFile` to transform the file into a `GenericFile` type
  // that umi can understand. Make sure you set the mimetag type correctly
  // otherwise Arweave will not know how to display your image.

  const umiImageFile = createGenericFile(imageFile, "image.png", {
    tags: [{ name: "Content-Type", value: "image/png" }],
  });

  // Here we upload the image to Arweave via Irys and we get returned a uri
  // address where the file is located. You can log this out but as the
  // uploader can takes an array of files it also returns an array of uris.
  // To get the uri we want we can call index [0] in the array.

  console.log("Uploading image to Arweave via Irys");
  const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
    throw new Error(err);
  });

  console.log(imageUri[0]);

  // Uploading the tokens metadata to Arweave via Irys

  const metadata = {
    name: "The Kitten Coin",
    symbol: "KITTEN",
    description: "The Kitten Coin is a token created on the Solana blockchain",
    image: imageUri, // Either use variable or paste in string of the uri.
  };

  // Call upon umi's uploadJson function to upload our metadata to Arweave via Irys.

  console.log("Uploading metadata to Arweave via Irys");
  const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
    throw new Error(err);
  });

  // Creating the mintIx

  const mintSigner = generateSigner(umi);

  const createFungibleIx = createFungible(umi, {
    mint: mintSigner,
    name: "The Kitten Coin",
    uri: metadataUri, // we use the `metadataUri` variable we created earlier that is storing our uri.
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 0, // set the amount of decimals you want your token to have.
  });

  // This instruction will create a new Token Account if required, if one is found then it skips.

  const createTokenIx = createTokenIfMissing(umi, {
    mint: mintSigner.publicKey,
    owner: umi.identity.publicKey,
    ataProgram: getSplAssociatedTokenProgramId(umi),
  });

  // The final instruction (if required) is to mint the tokens to the token account in the previous ix.

  const mintTokensIx = mintTokensTo(umi, {
    mint: mintSigner.publicKey,
    token: findAssociatedTokenPda(umi, {
      mint: mintSigner.publicKey,
      owner: umi.identity.publicKey,
    }),
    amount: BigInt(1000),
  });

  // The last step is to send the ix's off in a transaction to the chain.
  // Ix's here can be omitted and added as needed during the transaction chain.
  // If for example you just want to create the Token without minting
  // any tokens then you may only want to submit the `createToken` ix.

  console.log("Sending transaction")
  const tx = await createFungibleIx
    .add(createTokenIx)
    .add(mintTokensIx)
    .sendAndConfirm(umi);

  // finally we can deserialize the signature that we can check on chain.
  const signature = base58.deserialize(tx.signature)[0];

  // Log out the signature and the links to the transaction and the NFT.
  // Explorer links are for the devnet chain, you can change the clusters to mainnet.
  console.log('\nTransaction Complete')
  console.log('View Transaction on Solana Explorer')
  console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`)
  console.log('View Token on Solana Explorer')
  console.log(`https://explorer.solana.com/address/${mintSigner.publicKey}?cluster=devnet`)
};

createAndMintTokens()
```
