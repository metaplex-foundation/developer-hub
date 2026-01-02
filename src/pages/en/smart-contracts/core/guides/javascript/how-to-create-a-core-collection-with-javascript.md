---
title: How to Create a Core Collection with Javascript
metaTitle: How to Create a Core Collection with Javascript | Core Guides
description: Learn how to create a Core Collection on Solana with the Metaplex Core javascript package.
# remember to update dates also in /components/guides/index.js
created: '08-21-2024'
updated: '08-21-2024'
---

This guide will demonstrate the use of the  `@metaplex-foundation/mpl-core` Javascript sdk package to create a **Core Collection** using the Metaplex Core onchain program.

{% callout title="What is Core?" %}

**Core** uses a single account design, reducing minting costs and improving Solana network load compared to alternatives. It also has a flexible plugin system that allows for developers to modify the behavior and functionality of assets.

{% /callout %}

But before starting, let's talk about Collections: 

{% callout title="What are Collections?" %}

Collections are a group of Assets that belong together, part of the same series, or group. In order to group Assets together, we must first create a Collection Asset whose purpose is to store any metadata related to that collection such as collection name and collection image. The Collection Asset acts as a front cover to your collection and can also store collection wide plugins.

{% /callout %}

## Prerequisite

- Code Editor of your choice (recommended **Visual Studio Code**)
- Node **18.x.x** or above.

## Initial Setup

This guide will teach you how to create a Core Collection using Javascript based on a single file script. You may need to modify and move functions around to suit your needs.

### Initializing the Project

Start by initializing a new project (optional) with the package manager of your choice (npm, yarn, pnpm, bun) and fill in required details when prompted.

```js
npm init
```

### Required Packages

Install the required packages for this guide.

{% packagesUsed packages=["umi", "umiDefaults", "core", "@metaplex-foundation/umi-uploader-irys"] type="npm" /%}

```js
npm i @metaplex-foundation/umi
```

```js
npm i @metaplex-foundation/umi-bundle-defaults
```

```js
npm i @metaplex-foundation/mpl-core
```

```js
npm i @metaplex-foundation/umi-uploader-irys;
```

### Imports and Wrapper Function

Here we will define all needed imports for this particular guide and create a wrapper function where all our code will execute.

```ts
import { 
  createCollection, 
  mplCore 
} from '@metaplex-foundation/mpl-core'
import {
  createGenericFile,
  generateSigner,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import { base58 } from '@metaplex-foundation/umi/serializers'
import fs from 'fs'
import path from 'path'

// Create the wrapper function
const createCollection = async () => {
  ///
  ///
  ///  all our code will go in here
  ///
  ///
}

// run the wrapper function
createCollection()
```

## Setting up Umi

While setting up Umi you can use or generate keypairs/wallets from different sources. You create a new wallet for testing, import an existing wallet from the filesystem, or use `walletAdapter` if you are creating a website/dApp.  

**Note**: For this example we're going to set up Umi with a `generatedSigner()` but you can find all the possible setup down below!

{% totem %}

{% totem-accordion title="With a New Wallet" %}

```ts
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
  .use(
    irysUploader({
      // mainnet address: "https://node1.irys.xyz"
      // devnet address: "https://devnet.irys.xyz"
      address: 'https://devnet.irys.xyz',
    })
  )

const signer = generateSigner(umi)

umi.use(signerIdentity(signer))

// This will airdrop SOL on devnet only for testing.
console.log('Airdropping 1 SOL to identity')
await umi.rpc.airdrop(umi.identity.publickey)
```

{% /totem-accordion %}

{% totem-accordion title="With an Existing Wallet" %}

```ts
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
    .use(
    irysUploader({
      // mainnet address: "https://node1.irys.xyz"
      // devnet address: "https://devnet.irys.xyz"
      address: 'https://devnet.irys.xyz',
    })
  )

// Generate a new keypair signer.
const signer = generateSigner(umi)

// You will need to us fs and navigate the filesystem to
// load the wallet you wish to use via relative pathing.
const walletFile = fs.readFileSync('./keypair.json')
  

// Convert your walletFile onto a keypair.
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

// Load the keypair into umi.
umi.use(keypairIdentity(umiSigner));
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

**Note**: The `walletAdapter` section provides only the code needed to connect it to Umi, assuming you've already installed and set up the `walletAdapter`. For a comprehensive guide, refer to [this](https://github.com/anza-xyz/wallet-adapter/blob/master/APP.md)

## Creating the Metadata for the Collection

To display a recognisable image for your Collection in the Wallets or on the Explorer, we need to create the URI where we can store the Metadata!

### Uploading the Image

Umi comes with downloadable storage plugins that allow you to upload to storage solutions such `Arweave`, `NftStorage`, `AWS`, and `ShdwDrive`. For this guide we're going to use the `irysUploader()` plugin which stores content on  Arweave.

In this example we're going to use a local approach using Irys to upload to Arweave; if you wish to upload files to a different storage provider or from the browser you will need to take a different approach. Importing and using `fs` won't work in a browser scenario.

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import fs from 'fs'
import path from 'path'

// Create Umi and tell it to use Irys
const umi = createUmi('https://api.devnet.solana.com')
  .use(irysUploader())

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

Once we have a valid and working image URI we can start working on the metadata for our collection.

The standard for offchain metadata for a fungible token is as follows. This should be filled out and writen to either an object `{}` without Javascript or saved to a `metadata.json` file.
We are going to look at the JavaScript object approach.

```ts
const metadata = {
  name: 'My Collection',
  description: 'This is a Collection on Solana',
  image: imageUri[0],
  external_url: 'https://example.com',
  properties: {
    files: [
      {
        uri: imageUri[0],
        type: 'image/jpeg',
      },
    ],
    category: 'image',
  },
}
```

The fields here include:

| field         | description                                                                                                                                                                               |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name          | The name of your Collection.                                                                                                                                                              |
| description   | The description of your Collection.                                                                                                                                                       |
| image         | This will be set to the `imageUri` (or any online location of the image) that we uploaded previously.                                                                                     |
| animation_url | This will be set to the `animation_ulr` (or any online location of the video/glb) that you've uploaded.                                                                                   |
| external_url  | This would link to an external address of your choice. This is normally the projects website.                                                                                             |
| image         | This will be set to the `imageUri` (or any online location of the image) that we uploaded previously.                                                                                     |
| properties    | Contains the `files` field that takes an `[] array` of `{uri: string, type: mimeType}`. Also contains the category field which can be set to `image`, `audio`, `video`, `vfx`, and `html` |

After creating the metadata, we need to upload it as a JSON file, so we can get a URI to attach to our Collection. To do this, we'll use Umi's `uploadJson()` function:

```js
// Call upon Umi's `uploadJson()` function to upload our metadata to Arweave via Irys.
const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
  throw new Error(err)
})
```

This function automatically converts our JavaScript object to JSON before uploading.

Now we should finally have the URI of JSON file stored in the `metadataUri` providing it did not throw any errors.

### Minting the Core Collection

From here we can use the `createCollection` function from the `@metaplex-foundation/mpl-core` package to create our Core NFT Asset.

```ts
const collection = generateSigner(umi)

const tx = await createCollection(umi, {
  collection,
  name: 'My Collection',
  uri: metadataUri,
}).sendAndConfirm(umi)

const signature = base58.deserialize(tx.signature)[0]
```

And log out the detail as follow: 

```ts
// Log out the signature and the links to the transaction and the NFT.
console.log('\nCollection Created')
console.log('View Transaction on Solana Explorer')
console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`)
console.log('\n')
console.log('View Collection on Metaplex Explorer')
console.log(`https://core.metaplex.com/explorer/${collection.publicKey}?env=devnet`)
```

### Additional Actions

Before moving on, what if we want to create a collection with plugins and/or external plugins, such as the `FreezeDelegate` plugin or the `AppData` external plugin, already included? Here's how we can do it.

The `createCollection()` instruction supports adding both normal and external plugin through the `plugins` field. So we can just easily add all the required field for the specific plugins, and everything it will be handled by the instruction.

Here's an example on how to do it:

```typescript
const collection = generateSigner(umi)

const tx = await createCollection(umi, {
  collection: collection,
  name: 'My Collection',
  uri: 'https://example.com/my-collection.json',
  plugins: [
    {
      type: "PermanentFreezeDelegate",
      frozen: true,
      authority: { type: "UpdateAuthority"}
    },
    {
      type: "AppData",
      dataAuthority: { type: "UpdateAuthority"},
      schema: ExternalPluginAdapterSchema.Binary,
    }           
  ]
}).sendAndConfirm(umi)

const signature = base58.deserialize(tx.signature)[0]
```

**Note**: Refer to the [documentation](/smart-contracts/core/plugins) if you're not sure on what fields and plugin to use! 

## Full Code Example

```ts
import { 
  createCollection,
  mplCore,
} from '@metaplex-foundation/mpl-core'
import {
  createGenericFile,
  generateSigner,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers'
import fs from 'fs'
import path from 'path'

const createCollection = async () => {
  //
  // ** Setting Up Umi **
  //

  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplCore())
    .use(irysUploader({address: 'https://devnet.irys.xyz'}))

  const signer = generateSigner(umi)

  umi.use(signerIdentity(signer))

  
  console.log('Airdropping 1 SOL to identity')
  await umi.rpc.airdrop(umi.identity.publicKey, sol(1))

  //
  // ** Upload an image to Arweave **
  //

  const imageFile = fs.readFileSync(
    path.join(__dirname, '..', '/assets/my-image.jpg')
  )

  const umiImageFile = createGenericFile(imageFile, 'my-image.jpeg', {
    tags: [{ name: 'Content-Type', value: 'image/jpeg' }],
  })

  const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
    throw new Error(err)
  })

  console.log('imageUri: ' + imageUri[0])

  //
  // ** Upload Metadata to Arweave **
  //

  const metadata = {
    name: 'My Collection',
    description: 'This is a Collection on Solana',
    image: imageUri[0],
    external_url: 'https://example.com',
    properties: {
      files: [
        {
          uri: imageUri[0],
          type: 'image/jpeg',
        },
      ],
      category: 'image',
    },
  }

  console.log('Uploading Metadata...')
  const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
    throw new Error(err)
  })

  //
  // ** Creating the Collection **
  //

  const collection = generateSigner(umi)

  console.log('Creating Collection...')
  const tx = await createCollection(umi, {
    collection,
    name: 'My Collection',
    uri: metadataUri,
  }).sendAndConfirm(umi)

  const signature = base58.deserialize(tx.signature)[0]

  console.log('\Collection Created')
  console.log('View Transaction on Solana Explorer')
  console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`)
  console.log('\n')
  console.log('View NFT on Metaplex Explorer')
  console.log(`https://core.metaplex.com/explorer/${nftSigner.publicKey}?env=devnet`)
}

createCollection()
```
