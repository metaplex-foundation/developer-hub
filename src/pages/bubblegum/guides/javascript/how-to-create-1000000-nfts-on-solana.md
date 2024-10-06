---
title: Create 1 Million NFTs on Solana
metaTitle: Create 1 Million NFTs on Solana | Bubblegum
description: How to Create a Compressed NFT Collection of 1 Million cNFTs on Solana using the Metaplex Bubblegum program.
---

## Prerequisite

- Code Editor of your choice (recommended Visual Studio Code).
- Node 18.x.x or above.
- Basic knowledge of Javascript and running scripts.

## Initial Setup

This guide will run through create of an NFT Core Asset with Javascript based on a single file script. You may need to modify and move functions around to suit your needs.

### Initializing

Start by initializing a new project (optional) with the package manager of your choice (npm, yarn, pnpm, bun) and fill in required details when prompted.

```js
npm init
```

### Required Packages

Install the required packages for this guide.

{% packagesUsed packages=["umi", "umiDefaults", "bubblegum", "tokenMetadata", "@metaplex-foundation/umi-uploader-irys"] type="npm" /%}

```js
npm i @metaplex-foundation/umi
```

```js
npm i @metaplex-foundation/umi-bundle-defaults
```

```js
npm i @metaplex-foundation/mpl-bubblegum
```

```js
npm i @metaplex-foundation/mpl-token-metadata
```

```js
npm i @metaplex-foundation/umi-uploader-irys;
```

### Imports and Wrapper Function

Here we will define all needed imports for this particular guide and create a wrapper function where all our code will execute.

```ts
import {
  createTree,
  findLeafAssetIdPda,
  getAssetWithProof,
  mintV1,
  mplBubblegum,
  parseLeafFromMintV1Transaction,
  verifyCollection,
} from '@metaplex-foundation/mpl-bubblegum'
import {
  createNft,
  mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata'
import {
  createGenericFile,
  generateSigner,
  percentAmount,
  publicKey,
  sol,
} from '@metaplex-foundation/umi'
import { Network, Wallet, umiInstance } from '../scripts/umi'

import fs from 'fs'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'

// Create the wrapper function
const createCnft = async () => {
  ///
  ///
  ///  all our code will go in here
  ///
  ///
}

// run the wrapper function
createCnft()
```

## Setting up Umi

This example is going to run through setting up Umi with a `generatedSigner()`. If you wish to try this example with React you'll need to setup Umi via the `React - Umi w/ Wallet Adapter` guide. Apart from the the wallet setup this guide will use fileStorage keys and wallet adapter.

### Generating a New Wallet

```ts
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplBubblegum())
  .use(mplTokenMetadata())
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
await umi.rpc.airdrop(umi.identity.publickey, sol(5))
```

### Use an Existing Wallet Locally

```ts
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplBubblegum())
  .use(mplTokenMetadata())
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
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile))

// Load the keypair into umi.
umi.use(keypairIdentity(keypair))
```

## Creating an cNFT

Creating a cNFT on Solana is fairly simple and requires a few items to get ready before we can actually perform the minting and reading operations.

- A Merkle tree to store our cNFT data to.
- A DAS ready RPC to be able to read the data from an indexer that is storing our data during creation.

#### Merkle Tree

A Merkle Tree for the most park can be thought of as a "database" of cNFT data. A Merkle Tree is created and cNFTs can be added to it until it's full.

#### DAS RPCs

Due to the nature of a Merkle Tree cNFT data isn't stored in Solana accounts and instead is stored in the ledger state. To be able to read the data back effectively we need to use an indexer which indexes all the cNFT data as its created/mutated. DAS enabled RPCs are RPCs that are running the DAS indexer service and allow us to query the RPC provider for this data on demand.

For a full list of RPC provides that support DAS you can visit the [RPC Providers Page](/rpc-providers#rp-cs-with-das-support)

You can pick up a free account for running this guide from any of these providers. Once signed up you will want to replace your RPC instance during the previous `umi` creation.

```ts
// Replace address located below.
const umi = createUmi('https://rpcAddress.com')
```

### Creating a Tree

{% callout title="Tree Cost" type="warning" %}
We are creating a Merkle Tree that holds 1,000,000 cNFTs in this guide which requires the cost of roughly 7.7 SOL. Please try this example on devnet only until you are ready as Merkle Trees can not be closed or refunded. You will need at least 7.7 devnet SOL in order to run this code, this may require multiple airdrops.
{% /callout %}

To store Compressed NFTs (cNFTs) on the Solana blockchain you need to create a **Merkle Tree** in which to store the data. The size and cost of the merkle tree is determined by the merkle tree creator and all cNFTs storage on chain is paid for in advanced which differs from Token Metadata's approach of **lazy minting** where normally the payer would pay for the necessary storage space and account creation on the solana blockchain at the time of minting the NFT itself, with bubblegum all data space needed is determined and paid for at tree creation by the tree creator.

There are some unique features regarding a **merkle tree** compared to Token Metadata that people can take advantage of:

- You can mint cNFTs to multiple collections within a Merkle Tree.

A Merkle Tree **isn't** a collection!

The Merkle Tree can house cNFTs from many collections making it incredibly powerful for projects that know they will have expanded growth in the future. If your Merkle Tree holds 1,000,000 cNFTs and you decide to release and mint a 10k project to said Merkle Tree you will still have 990,000 spaces in the tree to write and release additional cNFTs in the future.

```ts
//
// ** Create a Merkle Tree **
//

const merkleTree = generateSigner(umi)

console.log(
  'Merkle Tree Public Key:',
  merkleTree.publicKey,
  '\nStore this address as you will need it later.'
)

//   Create a tree with the following parameters.
//   This tree will cost approximately 7.7 SOL to create with a maximum
//   capacity of 1,000,000 leaves/nfts. You may have to airdrop some SOL
//   to the umi identity account before running this script.

const createTreeTx = await createTree(umi, {
  merkleTree,
  maxDepth: 20,
  maxBufferSize: 64,
  canopyDepth: 14,
})

await createTreeTx.sendAndConfirm(umi)
```

### Create a Collection NFT (Optional)

Collections for cNFTs are still maintained and manged by Token Metadata and the original Collection NFTs minted from Token Metadata. If you wish to create a collection for your cNFTs and mint them to it you will need to create a Token Metadata Collection NFT.

```ts
//
// ** Create Token Metadata Collection NFT (Optional) **
//

//
// If you wish to mint a NFT to a collection you must first create a collection NFT.
// This step is optional and you can skip it if you do not wish to mint a NFT to a collection
// or have previously created a collection NFT.
//

const collectionId = generateSigner(umi)

// Path to image file
const collectionImageFile = fs.readFileSync('./collection.png')

const genericCollectionImageFile = createGenericFile(
  collectionImageFile,
  'collection.png'
)

const collectionImageUri = await umi.uploader.upload([
  genericCollectionImageFile,
])

const collectionMetadata = {
  name: 'My cNFT Collection',
  image: collectionImageUri[0],
  externalUrl: 'https://www.example.com',
  properties: {
    files: [
      {
        uri: collectionImageUri[0],
        type: 'image/png',
      },
    ],
  },
}

const collectionMetadataUri = await umi.uploader.uploadJson(collectionMetadata)

await createNft(umi, {
  mint: collectionId,
  name: 'My cNFT Collection',
  uri: 'https://www.example.com/collection.json',
  isCollection: true,
  sellerFeeBasisPoints: percentAmount(0),
}).sendAndConfirm(umi)
```

### Upload Image and Metadata for cNFT (Optional)

Our cNFT needs data and an image. This code block shows us how to upload both an image and then add that image to a `metadata` object and final upload that object as a json file to Arweave via Irys for use to use with our cNFT.

```ts
//
//   ** Upload Image and Metadata used for the NFT (Optional) **
//

//   If you already have an image and metadata file uploaded, you can skip this step
//   and use the uri of the uploaded files in the mintV1 call.

//   Path to image file
const nftImageFile = fs.readFileSync('./nft.png')

const genericNftImageFile = createGenericFile(nftImageFile, 'nft.png')

const nftImageUri = await umi.uploader.upload([genericNftImageFile])

const nftMetadata = {
  name: 'My cNFT',
  image: nftImageUri[0],
  externalUrl: 'https://www.example.com',
  attributes: [
    {
      trait_type: 'trait1',
      value: 'value1',
    },
    {
      trait_type: 'trait2',
      value: 'value2',
    },
  ],
  properties: {
    files: [
      {
        uri: nftImageUri[0],
        type: 'image/png',
      },
    ],
  },
}

const nftMetadataUri = await umi.uploader.uploadJson(nftMetadata)
```

### Mint cNFT to the Merkle Tree

Minting a cNFT to a tree does not cost any additional account/storage costs on the Solana blockchain as the tree has already been created with enough room for all our cNFT data to be stored (1,000,000 cNFTs in fact). The only additional cost here is just the basic Solana transaction fee making cNFTs incredible efficient to mint in mass.b

```ts
//
// ** Mint a Compressed NFT to the Merkle Tree **
//

//
// If you do not wish to mint a NFT to a collection you can set the collection
// field to `none()`.
//

// The owner of the cNFT being minted.
const newOwner = publicKey('111111111111111111111111111111')

console.log('Minting Compressed NFT to Merkle Tree...')

const { signature } = await mintV1(umi, {
  leafOwner: newOwner.publicKey,
  merkleTree: merkleTree.publicKey,
  metadata: {
    name: 'My cNFT',
    uri: nftMetadataUri, // Either use `nftMetadataUri` or a previously uploaded uri.
    sellerFeeBasisPoints: 500, // 5%
    collection: { key: collectionId.publicKey, verified: false },
    creators: [{ address: umi.identity.publicKey, verified: true, share: 100 }],
  },
}).sendAndConfirm(umi, { send: { commitment: 'finalized' } })
```

### Fetch the Newly Minted cNFT

```ts
//
// ** Fetching Asset **
//

//
// Here we find the asset ID of the compressed NFT using the leaf index of the mint transaction
// and then log the asset information.
//

console.log('Finding Asset ID...')
const leaf = await parseLeafFromMintV1Transaction(umi, signature)
const assetId = findLeafAssetIdPda(umi, {
  merkleTree: merkleTree.publicKey,
  leafIndex: leaf.nonce,
})

console.log('Compressed NFT Asset ID:', assetId.toString())

// Fetch the asset using umi rpc with DAS.
const asset = await umi.rpc.getAsset(assetId[0])

console.log({ asset })
```

### Verifying the Collection

NFTs from Token Metadata and cNFTs from Bubblegum both mint assets into collections as unverified. Due to this an additional instruction is needed to verify the asset to the collection by the function of `verifyCollection()` from `mpl-bubblegum`.

To achieve the verification we need to pass some additional details from the asset which can be found by called `getAssetWithProof()` from the `assetId` we previously worked out.

Once we have the `assetWithProof` result we can spread that out into the `verifyCollection` object argument using `...assetWithProof`. This takes all the fields from `assetWithProof` and adds them to the object. Finally we just need to pass in the `collectionMint` address and the `collectionAuthority` and send off the transaction.

```ts
//
// ** Verify cNFT to Collection **
//

const assetWithProof = await getAssetWithProof(umi, assetId[0])
await verifyCollection(umi, {
  ...assetWithProof,
  collectionMint: collectionId.publicKey,
  collectionAuthority: umi.identity,
}).sendAndConfirm(umi)
```

### Minting 1,000,000 cNFTs

Now that we understand how to make a Merkle Tree that holds 1,000,000 cNFTs and can mint an NFT to that tree you can now take all the previous steps and start adjusting the code to make some loops to upload the needed data to Arweave and then mint the cNFT to a tree.

As the Merkle Tree has space for 1,000,000 cNFts you can freely loop and fill up the tree as desired for your projects needs.

Below is an example of minting cNFTs to an array of addresses that increment the data stored on the cNFT based on the loop index. This is a rough simple example/concept and would be need to be modified for production use.

```ts
  const addresses = [
    "11111111111111111111111111111111",
    "22222222222222222222222222222222",
    "33333333333333333333333333333333",
    ...
  ];

  let index = 0;

  for await (const address in addresses) {
    const newOwner = publicKey(address);

    console.log("Minting Compressed NFT to Merkle Tree...");

    const { signature } = await mintV1(umi, {
      leafOwner: newOwner,
      merkleTree: merkleTree.publicKey,
      metadata: {
        name: `My Compressed NFT #${index}`,
        uri: `https://example.com/${index}.json`, //either use metadataUri or the uri of the uploaded metadata file
        sellerFeeBasisPoints: 500, // 5%
        collection: { key: collectionId.publicKey, verified: false },
        creators: [
          { address: umi.identity.publicKey, verified: true, share: 100 },
        ],
      },
    }).sendAndConfirm(umi, { send: { commitment: "finalized" } });

    index++;
  }
```

## Full Code Example

```ts
import {
  createTree,
  findLeafAssetIdPda,
  getAssetWithProof,
  mintV1,
  mplBubblegum,
  parseLeafFromMintV1Transaction,
  verifyCollection,
} from "@metaplex-foundation/mpl-bubblegum";
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createGenericFile,
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey,
  sol,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import fs from "fs";

// Create the wrapper function
const createCnft = async () => {
  //
  // ** Set Up Umi **
  //

  // In this instance we are using a locally stored wallet. This can be replaced
  // with the code from 'generating a new wallet' if need be but make sure you
  // airdrop/send at least 7.7 SOL to the new wallet.

  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplBubblegum())
    .use(mplTokenMetadata())
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
  let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile))

  // Load the keypair into umi.
  umi.use(keypairIdentity(keypair))

  //
  // ** Create a Merkle Tree **
  //

  const merkleTree = generateSigner(umi)

  console.log(
    'Merkle Tree Public Key:',
    merkleTree.publicKey,
    '\nStore this address as you will need it later.'
  )

  //   Create a tree with the following parameters.
  //   This tree will cost approximately 7.7 SOL to create with a maximum
  //   capacity of 1,000,000 leaves/nfts. You may have to airdrop some SOL
  //   to the umi identity account before running this script.

  console.log('Creating Merkle Tree...')
  const createTreeTx = await createTree(umi, {
    merkleTree,
    maxDepth: 20,
    maxBufferSize: 64,
    canopyDepth: 14,
  })

  await createTreeTx.sendAndConfirm(umi)

  //
  // ** Create Token Metadata Collection NFT (Optional) **
  //

  //
  // If you wish to mint a NFT to a collection you must first create a collection NFT.
  // This step is optional and you can skip it if you do not wish to mint a NFT to a collection
  // or have previously created a collection NFT.
  //

  const collectionId = generateSigner(umi)

  // Path to image file
  const collectionImageFile = fs.readFileSync('./collection.png')

  const genericCollectionImageFile = createGenericFile(
    collectionImageFile,
    'collection.png'
  )

  const collectionImageUri = await umi.uploader.upload([
    genericCollectionImageFile,
  ])

  const collectionMetadata = {
    name: 'My cNFT Collection',
    image: collectionImageUri[0],
    externalUrl: 'https://www.example.com',
    properties: {
      files: [
        {
          uri: collectionImageUri[0],
          type: 'image/png',
        },
      ],
    },
  }

  console.log('Uploading Collection Metadata...')
  const collectionMetadataUri = await umi.uploader.uploadJson(
    collectionMetadata
  )

  console.log('Creating Collection NFT...')
  await createNft(umi, {
    mint: collectionId,
    name: 'My cNFT Collection',
    uri: 'https://www.example.com/collection.json',
    isCollection: true,
    sellerFeeBasisPoints: percentAmount(0),
  }).sendAndConfirm(umi)

  //
  //   ** Upload Image and Metadata used for the NFT (Optional) **
  //

  //   If you already have an image and metadata file uploaded, you can skip this step
  //   and use the uri of the uploaded files in the mintV1 call.

  //   Path to image file
  const nftImageFile = fs.readFileSync('./nft.png')

  const genericNftImageFile = createGenericFile(nftImageFile, 'nft.png')

  const nftImageUri = await umi.uploader.upload([genericNftImageFile])

  const nftMetadata = {
    name: 'My cNFT',
    image: nftImageUri[0],
    externalUrl: 'https://www.example.com',
    attributes: [
      {
        trait_type: 'trait1',
        value: 'value1',
      },
      {
        trait_type: 'trait2',
        value: 'value2',
      },
    ],
    properties: {
      files: [
        {
          uri: nftImageUri[0],
          type: 'image/png',
        },
      ],
    },
  }

  console.log('Uploading cNFT metadata...')
  const nftMetadataUri = await umi.uploader.uploadJson(nftMetadata)

  //
  // ** Mint a Compressed NFT to the Merkle Tree **
  //

  //
  // If you do not wish to mint a NFT to a collection you can set the collection
  // field to `none()`.
  //

  // The owner of the cNFT being minted.
  const newOwner = publicKey('111111111111111111111111111111')

  console.log('Minting Compressed NFT to Merkle Tree...')

  const { signature } = await mintV1(umi, {
    leafOwner: newOwner,
    merkleTree: merkleTree.publicKey,
    metadata: {
      name: 'My cNFT',
      uri: nftMetadataUri, // Either use `nftMetadataUri` or a previously uploaded uri.
      sellerFeeBasisPoints: 500, // 5%
      collection: { key: collectionId.publicKey, verified: false },
      creators: [
        { address: umi.identity.publicKey, verified: true, share: 100 },
      ],
    },
  }).sendAndConfirm(umi, { send: { commitment: 'finalized' } })

  //
  // ** Fetching Asset **
  //

  //
  // Here we find the asset ID of the compressed NFT using the leaf index of the mint transaction
  // and then log the asset information.
  //

  console.log('Finding Asset ID...')
  const leaf = await parseLeafFromMintV1Transaction(umi, signature)
  const assetId = findLeafAssetIdPda(umi, {
    merkleTree: merkleTree.publicKey,
    leafIndex: leaf.nonce,
  })

  console.log('Compressed NFT Asset ID:', assetId.toString())

  // Fetch the asset using umi rpc with DAS.
  const asset = await umi.rpc.getAsset(assetId[0])

  console.log({ asset })

  //
  // ** Verify cNFT to Collection **
  //

  console.log('verifying Collection')
  const assetWithProof = await getAssetWithProof(umi, assetId[0])
  await verifyCollection(umi, {
    ...assetWithProof,
    collectionMint: collectionId.publicKey,
    collectionAuthority: umi.identity,
  }).sendAndConfirm(umi)
}

// run the wrapper function
createCnft()
```
