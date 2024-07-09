---
title: How to Create an Spl Token On Solana
metaTitle: How to Create an Spl Token On Solana
description: Learn how to create an Spl Token on the Solana blockchain with Metaplex packages.
# remember to update dates also in /components/guides/index.js
created: '06-16-2024'
updated: '06-21-2024'
---

This guide walks you through setting up and minting your very own token on the Solana blockchain using the Metaplex Umi client wrapper and the Mpl Toolbox package with Javascript.

## Prerequisite

- Code Editor of your choice (recomended Visual Studio Code)
- Node 18.x.x or above.

## Initial Setup

### Initializing

Start by initializing a new project (optional) with the package manager of your choice (npm, yarn, pnpm, bun) and fill in required details when prompted.

```js
npm init
```

### Required Packages

Install the required pacakges for this guide.

{% packagesUsed packages=["umi", "umiDefaults" ,"tokenMetadata", "@metaplex-foundation/umi-uploader-irys", "toolbox"] type="npm" /%}

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
npm i @metaplex-foundation/umi-uploader-irys;
```

```js
npm i @metaplex-foundation/mpl-toolbox;
```

### Imports and Wrapper Function

Here we will define all needed imports for this particular guide and create a wrapper function where all our code will execute.

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

This example is going to run through setting up Umi with a `generatedSigner()`. If you wish to try this example with React you'll need to setup Umi via the `React - Umi w/ Wallet Adapter` guide. Apart from the the wallet setup this guide will for fileStorage keys and wallet adapter.

```ts
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { generateSigner, signerIdentity } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'

const umi = createUmi('https://api.devnet.solana.com')
  .use(mplTokenMetadata())
  .use(irysUploader())

const signer = generateSigner(umi)

umi.use(signerIdentity(signer))
```

The first 3 lines we are importing packages that required to create an SPL Token.

```ts
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { generateSigner, signerIdentity } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
```

The following lines we generate a new signer (private key) and we assign it umi.

```ts
const signer = generateSigner(umi)

umi.use(signerIdentity(signer))
```

## Creating the Token

### Uploading the Image

The first thing we need to do is to an image that represents the token and makes it recognisable. This can be in the form of jpeg, png or gif.

Umi comes with downloadable storage plugins that allow you to upload to storage solutions such Arweave, NftStore, AWS, and ShdwDrive. At start of this guide we had installed the `irsyUploader()` plugin which stores content on the Arweave blockchain so we'll stick with using that.

{% callout title="Local script/Node.js" %}
This example is using a localscript/node.js approach using Irys to upload to Arweave. If you wish to upload files to a different storage provider or from the browser you will need to take a different approach. Importing and using `fs` won't work in a browser scenario.
{% /callout %}

#### New Imports

```ts
// import fs and path by adding it under the rest of the imports at the start of your file.
import fs from 'fs'
import path from 'path'

// we also add the `createGenericFile` import to the original list of umi imports.
import {
  generateSigner,
  signerIdentity,
  createGenericFile,
} from '@metaplex-foundation/umi'
```

```ts
// use `fs` to read file via a string path.
// You will need to understand the concept of pathing from a computing perspective.

const imageFile = fs.readFileSync(
  path.join(__dirname, '..', '/assets/islandDao.jpg')
)

// Use `createGenericFile` to transform the file into a `GenericFile` type
// that umi can understand. Make sure you set the mimi tag type correctly
// otherwise Arweave will not know how to display your image.

const umiImageFile = createGenericFile(imageFile, 'island-dao.jpeg', {
  tags: [{ name: 'Content-Type', value: 'image/jpeg' }],
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

Once we have a valid and working image URI we can start working on the metadata for our token.

the standard for offchain metadata for a funigble token is as follows

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

The short hand of your token. Where Solana's shorthand would be `SOL`.

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

// Call upon umi's uploadJson function to upload our metadata to Arweave via Irys.

const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
  throw new Error(err)
})
```

Now if all has gone to play we should have the uri of json file stored in the `metadataUri` providing it did not throw any errors.

### Creating the Token

There are a few things we need to take into account when creating and minting a new token on the Solana blockchain in that we need to create some accounts and instructions.

- Creating the mint account.
- If we are minting the Tokens then we need a Token Account (holds the minted tokens in a persons wallet)
- Mint the token.

#### Mint Account

To create the mint account and store the mint data we call the `createFungible` helper method which abstracts a lot of the account creating process for you. Here we need to provide the function a keypair that will be the mint address (this is grindable) and then some other metadata we supplied the JSON file such as name of the token.

```ts
const mintSigner = generateSigner(umi)

const createMintIx = await createFungible(umi, {
  mint: mintSigner,
  name: 'The Kitten Coin',
  uri: metadataUri, // we use the `metedataUri` variable we created earlier that is storing our uri.
  sellerFeeBasisPoints: percentAmount(0),
  decimals: 9, // set the amount of decimals you want your token to have.
})
```

### Minting Tokens.

#### Token Account

If we are minting the tokens straight away then we need a place to store the tokens in someones wallet. To do this we mathmatically generate an address based on both the wallet and mint address which is called a **Associated Token Account** (ATA) or sometimes just reffered to as just a **Token Account**.

#### Generating the Token Account Address.

The first thing we need to do is figure out what the Token Account address should be. `mpl-toolbox` has a helper fuction we can import that does just that.

#### New Import

Add this import to the rest of your imports at the top of the page.

```ts
import {
  createTokenIfMissing,
  getSplAssociatedTokenProgramId,
} from '@metaplex-foundation/mpl-toolbox'
```

```ts
const createTokenIx = createTokenIfMissing(umi, {
  mint: mintSigner.publicley,
  owner: umi.identity.publicKey,
  ataProgram: getSplAssociatedTokenProgramId(umi),
})
```

Now that we have a instruction to create an Token Account we can mint tokens to that account.

#### New Import

Add this import to the rest of your imports at the top of the page. You may be added to the existing `@metaplex-foundation/mpl-toolbox` import if there is one.

```ts
import {
  mintTokensTo,
  findAssociatedTokenPda,
} from '@metaplex-foundation/mpl-toolbox'
```

Now we can proceed to create the mintTokenTo instruction

```ts
const mintTokensIx = mintTokensTo(umi, {
  mint: mintSigner.publicley,
  token: findAssociatedTokenPda(umi, {
    mint: mintSigner.publicley,
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
  .add(mintTokensIx)
  .sendAndConfirm(umi)

// finally we can deserialize the signature that we can check on chain.
// import { base58 } from "@metaplex-foundation/umi/serializers";

console.log(base58.deserialize(tx.signature)[0])
```

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
  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplTokenMetadata())
    .use(irysUploader())

  const signer = generateSigner(umi)

  umi.use(signerIdentity(signer))

  // Airdrop 1 SOL to the identity
  // if you end up with a 429 too many requests error, you may have to use
  // the filesystem wallet method or change rpcs.
  await umi.rpc.airdrop(umi.identity.publicKey, sol(1))

  // use `fs` to read file via a string path.
  // You will need to understand the concept of pathing from a computing perspective.

  const imageFile = fs.readFileSync(path.join(__dirname, '/assets/image.png'))

  // Use `createGenericFile` to transform the file into a `GenericFile` type
  // that umi can understand. Make sure you set the mimi tag type correctly
  // otherwise Arweave will not know how to display your image.

  const umiImageFile = createGenericFile(imageFile, 'image.png', {
    tags: [{ name: 'Content-Type', value: 'image/png' }],
  })

  // Here we upload the image to Arweave via Irys and we get returned a uri
  // address where the file is located. You can log this out but as the
  // uploader can takes an array of files it also returns an array of uris.
  // To get the uri we want we can call index [0] in the array.

  const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
    throw new Error(err)
  })

  console.log(imageUri[0])

  // Uploading the tokens metadata to Arweave via Irys

  const metadata = {
    name: 'The Kitten Coin',
    symbol: 'KITTEN',
    description: 'The Kitten Coin is a token created on the Solana blockchain',
    image: imageUri, // Either use variable or paste in string of the uri.
  }

  // Call upon umi's uploadJson function to upload our metadata to Arweave via Irys.

  const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
    throw new Error(err)
  })

  // Creating the mintIx

  const mintSigner = generateSigner(umi)

  const createFungibleIx = createFungible(umi, {
    mint: mintSigner,
    name: 'The Kitten Coin',
    uri: metadataUri, // we use the `metedataUri` variable we created earlier that is storing our uri.
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 9, // set the amount of decimals you want your token to have.
  })

  // This instruction will create a new Token Account if required, if one is found then it skips.

  const createTokenIx = createTokenIfMissing(umi, {
    mint: mintSigner.publicKey,
    owner: umi.identity.publicKey,
    ataProgram: getSplAssociatedTokenProgramId(umi),
  })

  // The final instruction (if required) is to mint the tokens to the token account in the previous ix.

  const mintTokensIx = mintTokensTo(umi, {
    mint: mintSigner.publicKey,
    token: findAssociatedTokenPda(umi, {
      mint: mintSigner.publicKey,
      owner: umi.identity.publicKey,
    }),
    amount: BigInt(1000),
  })

  // The last step is to send the ix's off in a transaction to the chain.
  // Ix's here can be ommited and added as needed during the chain.
  // If for example you just want to create the Token without minting
  // any tokens then you can only submit the `createToken` ix.

  // If you want to mint tokens to a different wallet then you can
  // just pull out the `createTokenIx` ix and `mintTokensIx` ix and send
  // them as another tx.

  const tx = await createFungibleIx
    .add(createTokenIx)
    .add(mintTokensIx)
    .sendAndConfirm(umi)

  // finally we can deserialize the signature that we can check on chain.
  console.log(base58.deserialize(tx.signature)[0])
}

createAndMintTokens()
```
