---
title: How to Create a NFT On Solana
metaTitle: How to Create a NFT On Solana | Token Metadata Guides
description: Learn how to create an NFT on the Solana blockchain with the Metaplex.
# remember to update dates also in /components/products/guides/index.js
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

{% code-tabs-imported from="token-metadata/getting-started" frameworks="umi,kit" /%}

## Setting up the SDK

{% code-tabs-imported from="token-metadata/getting-started" frameworks="umi,kit" /%}

## Creating the NFT

### Uploading the Image

The first thing we need to do is to an image that represents the NFT and makes it recognisable. This can be in the form of jpeg, png or gif.

Umi comes with downloadable storage plugins that allow you to upload to storage solutions such Arweave, NftStorage, AWS, and ShdwDrive. At start of this guide we had installed the `irsyUploader()` plugin which stores content on the Arweave blockchain so we'll stick with using that.

{% callout title="Local script/Node.js" %}
This example is using a localscript/node.js approach using Irys to upload to Arweave. If you wish to upload files to a different storage provider or from the browser you will need to take a different approach. Importing and using `fs` won't work in a browser scenario.
{% /callout %}

{% code-tabs-imported from="token-metadata/upload-assets" frameworks="umi" /%}

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

{% code-tabs-imported from="token-metadata/create-nft" frameworks="umi,kit" /%}

#### pNFT

{% code-tabs-imported from="token-metadata/create-pnft" frameworks="umi,kit" /%}

## What's Next?

This guide helped you to create a basic NFT, from here you can head over to the [Token Metadata Program](/smart-contracts/token-metadata) and check out things like creating a collection and adding your new NFT into a collection and the various other interactions you can perform with your NFT.
