---
title: Create your First Hybrid Collection
metaTitle: Create your First Hybrid Collection | Hybrid Guides
description: Learn how to create an hybrid collection, fully end-to-end!.
# remember to update dates also in /components/guides/index.js
created: '09-17-2024'
updated: '09-17-2024'
---

This guide will demonstrate how to create an **Hybrid Collection** fully end-to-end. Starting from how to create all the assets needed, to how to create the escrow and setting up all the parameters for the **capture** and **release** feature!

{% callout title="What is Mpl-Hybrid?" %}

...

{% /callout %}

## Prerequisite

- Code Editor of your choice (recommended **Visual Studio Code**)
- Node **18.x.x** or above.

## Initial Setup

This guide will teach you how to create an Hybrid Collection using Javascript, we're going to use different scripts throughout the example based on the function we want to use! You may need to modify and move functions around to suit your needs.

### Initializing the Project

Start by initializing a new project (optional) with the package manager of your choice (npm, yarn, pnpm, bun) and fill in required details when prompted.

```js
npm init
```

### Required Packages

Install the required packages for this guide.

{% packagesUsed packages=["umi", "umiDefaults", "@metaplex-foundation/umi-uploader-irys", "core", "@metaplex-foundation/mpl-hybrid", "tokenMetadata", "toolbox", "@ardrive/turbo-sdk" ] type="npm" /%}

```js
npm i @metaplex-foundation/umi
```

```js
npm i @metaplex-foundation/umi-bundle-defaults
```

```js
npm i @metaplex-foundation/umi-uploader-irys;
```

```js
npm i @metaplex-foundation/mpl-core
```

```js
npm i @metaplex-foundation/mpl-hybrid
```

```js
npm i @metaplex-foundation/mpl-token-metadata
```

```js
npm i @metaplex-foundation/mpl-toolbox;
```

## Setting up Umi

Before jumping in the relevant information about MPL-Hybrid, it's a good idea to learn how to set up your Umi instance since we're going to do that multiple time during the guide. If you already know how to do it, [skip this part!](#preparation)

While setting up Umi you can use or generate keypairs/wallets from different sources. You create a new wallet for testing, import an existing wallet from the filesystem, or use `walletAdapter` if you are creating a website/dApp.  

**Note**: For this example we're going to set up Umi with a `generatedSigner()` but you can find all the possible setup down below!

{% totem %}

{% totem-accordion title="With a New Wallet" %}

```ts
const umi = createUmi('https://api.devnet.solana.com')

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
// Register Wallet Adapter to Umi
.use(walletAdapterIdentity(wallet))
```

{% /totem-accordion %}

{% /totem %}

**Note**: The `walletAdapter` section provides only the code needed to connect it to Umi, assuming you've already installed and set up the `walletAdapter`. For a comprehensive guide, refer to [this](https://github.com/anza-xyz/wallet-adapter/blob/master/APP.md)


## Preparation

Before setting up the escrow for the MPL-Hybrid program to facilitate the swap between fungible tokens and non-fungible tokens (and vice versa), you’ll need to have both a collection of digital assets and fungible tokens already minted.

**Note**: The escrow will need to be funded with NFTs, fungible tokens, or a combination of both. The simplest way to balance the escrow is to fill it entirely with one type of asset while distributing the other ensuring that the escrow remains balanced and functional.

If you’re missing any of these prerequisites, don’t worry! We’ll walk you through each step of the process from the beginning.

## Creating the NFT Collection

To utilize the metadata randomization feature in the MPL-Hybrid program, the off-chain metadata URIs need to follow a consistent, incremental structure. To achieve this, we will use the [path manifest](https://cookbook.arweave.dev/concepts/manifests.html) feature from Arweave and the Turbo SDK. 

Manifests allows multiple transactions to be linked under a single base transaction ID and assigned human-readable file names like this:
- https://arweave.net/manifestID/0.json
- https://arweave.net/manifestID/1.json
...
- https://arweave.net/manifestID/9999.json

If don't know how to create a core digital asset collection with deterministic URIs, you can [use this guide](create-deterministic-metadata-with-turbo)!

### Creating the Fungible Tokens

## ...

- [I already have a NFT Collection](): In order to take advantage of the metadata randomization feature, the off-chain metadata URIs need to be consistently defined, if that's not the case for your collection then follow [this paragraph](). 
- [I already have a Fungible Token]()

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

**Note**: Refer to the [documentation](/core/plugins) if you're not sure on what fields and plugin to use! 

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
