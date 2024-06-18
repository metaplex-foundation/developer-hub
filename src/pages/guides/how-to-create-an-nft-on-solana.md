---
title: How to Create an Nft On Solana
metaTitle: How to Create an Nft On Solana
description: Learn how to create an Nft on the Solana blockchain with Metaplex packages.
# remember to update dates also in /components/guides/index.js
created: '06-16-2024'
updated: '06-18-2024'
---

To create a Fungible SPL Token on Solana using Metaplex packages you'll need to install the following via your package manager of choice.

## Initial Setup

### Initializing

Start by initializing a new project (optional) with the package manager of your choice (npm, yarn, pnpm, bun) and fill in required details when prompted.

```js
npm init
```

### Required Packages

Install the required pacakges for this guide.

```js
npm i @metaplex-foundation/umi
```

```js
npm i @metaplex-foundation/umi-bundle-defaults
```

```js
npm i @metaplex-foundation/mplcore
```

```js
npm i @metaplex-foundation/umi-uploader-irys;
```

## Setting up Umi

This example is going to run through setting up Umi with a `generatedSigner()`. If you wish to try this example with React you'll need to setup Umi via the `React - Umi w/ Wallet Adapter` guide. Apart from the the wallet setup this guide will for fileStorage keys and wallet adapter.

```ts
import { mplCore } from '@metaplex-foundation/mpl-token-metadata'
import { generateSigner, signerIdentity } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'

const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
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

## Creating the Nft

### Uploading the Image

The first thing we need to do is to an image that represents the Nft and makes it recognisable. This can be in the form of jpeg, png or gif.

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
  path.join(__dirname, '..', '/assets/my-image.jpg')
)

// Use `createGenericFile` to transform the file into a `GenericFile` type
// that umi can understand. Make sure you set the mimi tag type correctly
// otherwise Arweave will not know how to display your image.

const umiImageFile = createGenericFile(imageFile, 'my-image.jpeg', {
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
  "name": "My Nft",
  "description": "This is an Nft on Solana",
  "image": "https://arweave.net/my-image",
  "animation_url": "https://arweave.net/my-animation",
  "external_url": "https://example.com",
  "attributes": [
    {
      "trait_type": "trait1",
      "value": "value1"
    },
    {
      "trait_type": "trait2",
      "value": "value2"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://arweave.net/my-image",
        "type": "image/png"
      },
      {
        "uri": "https://arweave.net/my-animation",
        "type": "video/mp4"
      }
    ],
    "category": "video"
  }
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
// Call upon umi's uploadJson function to upload our metadata to Arweave via Irys.

const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
  throw new Error(err)
})
```

Now if all has gone to play we should have the uri of json file stored in the `metadataUri` providing it did not throw any errors.

### Minting the Nft

There are a few things we need to take into account when creating and minting a new token on the Solana blockchain in that we need to create some accounts and instructions.

- Creating the mint account.
- If we are minting the Tokens then we need a Token Account (holds the minted tokens in a persons wallet)
- Mint the token.

#### New Import

Add this import to the rest of your imports at the top of the page. You may be added to the existing `@metaplex-foundation/mpl-toolbox` import if there is one.

```ts
import {
  create
} from '@metaplex-foundation/mpl-core'
```

Now we can proceed to create the mintTokenTo instruction

```ts
const assetSigner = generateSigner(umi);

const createTx = await create(umi, {
    asset: assetSigner,
    collection: collection,
    name: "My Asset",
    uri: "https://example.com/my-asset.json",
  }).sendAndConfirm(umi);

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

  // Uploading the tokens metadata to Arweave via Irys

  const metadata = {
  "name": "My Nft",
  "description": "This is an Nft on Solana",
  "image": imageUri,
  "external_url": "https://example.com",
  "attributes": [
    {
      "trait_type": "trait1",
      "value": "value1"
    },
    {
      "trait_type": "trait2",
      "value": "value2"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://arweave.net/my-image",
        "type": "image/png"
      },
    ],
    "category": "image"
  }
}

// Call upon umi's uploadJson function to upload our metadata to Arweave via Irys.

const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
throw new Error(err)
})

// Creating the mintIx

const assetSigner = generateSigner(umi);

const createTx = await create(umi, {
    asset: assetSigner,
    collection: collection,
    name: "My Asset",
    uri: "https://example.com/my-asset.json",
  }).sendAndConfirm(umi);

  // finally we can deserialize the signature that we can check on chain.
// import { base58 } from "@metaplex-foundation/umi/serializers";

console.log(base58.deserialize(tx.signature)[0])
}

createAndMintTokens()
```
