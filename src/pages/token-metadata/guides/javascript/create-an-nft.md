---
title: How to Create a NFT On Solana
metaTitle: How to Create a NFT On Solana | Token Metadata Guides
description: Learn how to create an NFT on the Solana blockchain with the Metaplex.
# remember to update dates also in /components/guides/index.js
created: '06-16-2024'
updated: '06-18-2024'
---

This is an intial guide on how to create an NFT on the Solana blockchain with the Metaplex Token Metadata protocol.

## Prerequisite

- Code Editor of your choice (recommended Visual Studio Code)
- Node 18.x.x or above.

## Initial Setup

This guide will run through creation of an NFT with Javascript based on a single file script. You may need to modify and move functions around to suit your needs.

### Initializing

Start by initializing a new project (optional) with the package manager of your choice (npm, yarn, pnpm, bun) and fill in required details when prompted.

```js
npm init
```

### Required Packages

Install the required packages for this guide.

{% packagesUsed packages=["umi", "umiDefaults" ,"tokenMetadata", "core", "@solana/spl-token"] type="npm" /%}

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

### Imports and Wrapper Function

Here we will define all needed imports for this particular guide and create a wrapper function where all our code will execute.

```ts
import { createProgrammableNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import {
  createGenericFile,
  generateSigner,
  percentAmount,
  signerIdentity,
  sol,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { base58 } from "@metaplex-foundation/umi/serializers";
import fs from "fs";
import path from "path";

// Create the wrapper function
const createNft = async () => {
  ///
  ///
  ///  all our code will go in here
  ///
  ///
}

// run the wrapper function
createNft()
```

## Setting up Umi

This example is going to run through setting up Umi with a `generatedSigner()`. If you wish to try this example with React you'll need to setup Umi via the `React - Umi w/ Wallet Adapter` guide. Apart from the the wallet setup this guide will for fileStorage keys and wallet adapter.

### Generating a New Wallet

```ts
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplTokenMetadata())
  .use(
    irysUploader({
      // mainnet address: "https://node1.irys.xyz"
      // devnet address: "https://devnet.irys.xyz"
      address: "https://devnet.irys.xyz",
    })
  );

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
  .use(mplTokenMetadata())
  .use(
    irysUploader({
      // mainnet address: "https://node1.irys.xyz"
      // devnet address: "https://devnet.irys.xyz"
      address: "https://devnet.irys.xyz",
    })
  );

// Generate a new keypair signer.
const signer = generateSigner(umi)

// You will need to us fs and navigate the filesystem to
// load the wallet you wish to use via relative pathing.
const walletFile = const imageFile = fs.readFileSync(
    path.join(__dirname, './keypair.json')
  )
```

## Creating the NFT

### Uploading the Image

The first thing we need to do is to an image that represents the NFT and makes it recognisable. This can be in the form of jpeg, png or gif.

Umi comes with downloadable storage plugins that allow you to upload to storage solutions such Arweave, NftStorage, AWS, and ShdwDrive. At start of this guide we had installed the `irsyUploader()` plugin which stores content on the Arweave blockchain so we'll stick with using that.

{% callout title="Local script/Node.js" %}
This example is using a localscript/node.js approach using Irys to upload to Arweave. If you wish to upload files to a different storage provider or from the browser you will need to take a different approach. Importing and using `fs` won't work in a browser scenario.
{% /callout %}

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

Once we have a valid and working image URI we can start working on the metadata for our NFT.

The standard for offchain metadata for a fungilbe token is as follows;

```json
{
  "name": "My NFT",
  "description": "This is an NFT on Solana",
  "image": "https://arweave.net/my-image",
  "external_url": "https://example.com/my-nft.json",
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
      }
    ],
    "category": "image"
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


const metadata = {
  "name": "My NFT",
  "description": "This is an NFT on Solana",
  "image": imageUri[0],
  "external_url": "https://example.com/my-nft.json",
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
        "uri": imageUri[0],
        "type": "image/png"
      }
    ],
    "category": "image"
  }
}

const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
  throw new Error(err)
})
```

Now if all has gone to play we should have the URI of json file stored in the `metadataUri` providing it did not throw any errors.

### NFT vs pNFT

The Token Metadata program can mint 2 kinds of NFTs, a normal NFT, and a pNFT (programmable Non-Fungible Asset).
The main difference between the two types of NFTs here are one is royalty enforced (pNFT) and the other is not (NFT).

#### NFT

- No royatly enforcement
- Simpler in initial setup and to work with in future.

#### pNFT

- More accounts to deal with when it comes to future development.
- Royalty enforcement
- Programable in which we have rulesets which can block programs from making a transfer.

### Minting the Nft

From here you can pick the type of NFT mint instruction you wish to use, either `NFT` or `pNFT`.

#### NFT

```ts
// We generate a signer for the Nft
const nftSigner = generateSigner(umi)

const tx = await createNft(umi, {
  mint: nftSigner,
  sellerFeeBasisPoints: percentAmount(5.5),
  name: 'My NFT',
  uri: metadataUri,
}).sendAndConfirm(umi)

// finally we can deserialize the signature that we can check on chain.
// import { base58 } from "@metaplex-foundation/umi/serializers";

console.log(base58.deserialize(tx.signature)[0])
```

#### pNFT

```ts
// We generate a signer for the NFT
const nftSigner = generateSigner(umi)

// Decide on a ruleset for the Nft.
// Metaplex ruleset - publicKey("eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9")
// Compatability ruleset - publicKey("AdH2Utn6Fus15ZhtenW4hZBQnvtLgM1YCW2MfVp7pYS5")
const ruleset = null // or set a publicKey from above

const tx = await createProgrammableNft(umi, {
  mint: nftSigner,
  sellerFeeBasisPoints: percentAmount(5.5),
  name: 'My NFT',
  uri: metadataUri,
  ruleSet: ruleset,
}).sendAndConfirm(umi)

// finally we can deserialize the signature that we can check on chain.
// import { base58 } from "@metaplex-foundation/umi/serializers";

console.log(base58.deserialize(tx.signature)[0])
```

## Full Code Example

```js
import { createProgrammableNft } from '@metaplex-foundation/mpl-token-metadata'
import {
  createGenericFile,
  generateSigner,
  percentAmount,
  publicKey,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers'
import fs from 'fs'
import path from 'path'

const createNft = async () => {
  //
  // ** Setting Up Umi **
  //

  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplTokenMetadata())
  .use(
    irysUploader({
      // mainnet address: "https://node1.irys.xyz"
      // devnet address: "https://devnet.irys.xyz"
      address: "https://devnet.irys.xyz",
    })
  );

  const signer = generateSigner(umi);

  umi.use(signerIdentity(signer));

  // Airdrop 1 SOL to the identity
  // if you end up with a 429 too many requests error, you may have to use
  // the filesystem wallet method or change rpcs.
  console.log("Airdropping 1 SOL to identity");
  await umi.rpc.airdrop(umi.identity.publicKey, sol(1));

  //
  // ** Upload an image to Arweave **
  //

  // use `fs` to read file via a string path.
  // You will need to understand the concept of pathing from a computing perspective.

  const imageFile = fs.readFileSync(
    path.join(__dirname, "../assets/images/0.png")
  );

  // Use `createGenericFile` to transform the file into a `GenericFile` type
  // that umi can understand. Make sure you set the mimi tag type correctly
  // otherwise Arweave will not know how to display your image.

  const umiImageFile = createGenericFile(imageFile, "0.png", {
    tags: [{ name: "Content-Type", value: "image/png" }],
  });

  // Here we upload the image to Arweave via Irys and we get returned a uri
  // address where the file is located. You can log this out but as the
  // uploader can takes an array of files it also returns an array of uris.
  // To get the uri we want we can call index [0] in the array.

  console.log("Uploading image...");
  const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
    throw new Error(err);
  });

  //
  // ** Upload Metadata to Arweave **
  //

  const metadata = {
    name: "My Nft",
    description: "This is an Nft on Solana",
    image: imageUri[0],
    external_url: "https://example.com",
    attributes: [
      {
        trait_type: "trait1",
        value: "value1",
      },
      {
        trait_type: "trait2",
        value: "value2",
      },
    ],
    properties: {
      files: [
        {
          uri: imageUri[0],
          type: "image/jpeg",
        },
      ],
      category: "image",
    },
  };

  // Call upon umi's uploadJson function to upload our metadata to Arweave via Irys.
  console.log("Uploading metadata...");
  const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
    throw new Error(err);
  });

  //
  // ** Creating the Nft **
  //

  // We generate a signer for the Nft
  const nftSigner = generateSigner(umi);

  // Decide on a ruleset for the Nft.
  // Metaplex ruleset - publicKey("eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9")
  // Compatability ruleset - publicKey("AdH2Utn6Fus15ZhtenW4hZBQnvtLgM1YCW2MfVp7pYS5")
  const ruleset = null // or set a publicKey from above

  console.log("Creating Nft...");
  const tx = await createProgrammableNft(umi, {
    mint: nftSigner,
    sellerFeeBasisPoints: percentAmount(5.5),
    name: metadata.name,
    uri: metadataUri,
    ruleSet: ruleset,
  }).sendAndConfirm(umi);

  // Finally we can deserialize the signature that we can check on chain.
  const signature = base58.deserialize(tx.signature)[0];

  // Log out the signature and the links to the transaction and the NFT.
  console.log("\npNFT Created")
  console.log("View Transaction on Solana Explorer");
  console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);
  console.log("\n");
  console.log("View NFT on Metaplex Explorer");
  console.log(`https://explorer.solana.com/address/${nftSigner.publicKey}?cluster=devnet`);
}

createNft()
```

## What's Next?

This guide helped you to create a basic NFT, from here you can head over to the [Token Metadata Program](/token-metadata) and check out things like creating a collection and adding your new NFT into a collection and the various other interactions you can perform with your NFT.
