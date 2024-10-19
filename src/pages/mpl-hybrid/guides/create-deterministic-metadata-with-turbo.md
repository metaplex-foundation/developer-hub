---
title: Create deterministic metadata with Turbo
metaTitle: Create deterministic metadata with Turbo | Hybrid Guides
description: Learn how to create deterministic metadata leveraging the Turbo SDK for Arweave-based uploads.
# remember to update dates also in /components/guides/index.js
created: '10-19-2024'
updated: '10-19-2024'
---

To utilize the metadata randomization feature in the MPL-Hybrid program, the off-chain metadata URIs need to follow a consistent, incremental structure. To achieve this, we will use the [path manifest](https://cookbook.arweave.dev/concepts/manifests.html) feature from Arweave and the Turbo SDK. **This guide will demonstrate how to set this up!**

{% callout title="What is Turbo" %}

Turbo is a ultrahigh-throughput Permaweb service that streamlines the funding, indexing, and transmission of data to and from Arweave. It provides graphical and programmatic interfaces for payment options in fiat currency with credit or debit cards as well as cryptocurrencies such as ETH, SOL, and AR.

{% /callout %}

## Prerequisite

### Required Packages

{% packagesUsed packages=[ "@ardrive/turbo-sdk" ] type="npm" /%}

Install the required packages for this guide.

```js
npm i @ardrive/turbo-sdk
```

### Assets Folder

In this example, we will create the metadata from scratch, so you’ll just need to prepare all the images in the assets folder for the script to work.

Images (and metadata JSON files) should follow an incremental naming convention starting from 0.

```
assets/
├─ 0.png
├─ 1.png
├─ 2.png
├─ ...
```

### Metadata Folder

Since we’re building the metadata from scratch in this example, you’ll just need to create a metadata folder to store the newly generated metadata files.

However, the workflow we're presenting in this guide will still work even if you use other methods to upload images or prepare the metadata. Just remember to use Turbo to upload the metadata files and obtain the correct Manifest ID, which is required for setting up the Hybrid Escrow.

To generate assets and metadata, you can use [one of these methods](/candy-machine/guides/create-an-nft-collection-on-solana-with-candy-machine#image-and-metadata-generators) and save the metadata in the metadata folder. If you do this, skip ahead to [this part of the tutorial](#create-and-upload-the-metadata-files)

## Setting up Turbo 

Since Turbo is compatible with multiple tokens and chains, we'll need to configure our Turbo instance to use Solana as the token for this guide. We do this by calling the `TurboFactory.authenticated()` method and passing in Solana-specific configuration options.

```javascript
import { TurboFactory } from '@ardrive/turbo-sdk';

const turbo = TurboFactory.authenticated({
  privateKey: bs58.encode(Uint8Array.from(secretKey)),
  token: 'solana',
  gatewayUrl: `https://api.devnet.solana.com`,
  paymentServiceConfig: { url: "https://payment.ardrive.dev" },
  uploadServiceConfig: { url: "https://upload.ardrive.dev" },
});
```

**Note**: In this example, we explicitly provide the `gatewayUrl`, `paymentServiceConfig`, and `uploadServiceConfig` because we want to configure the environment to work on devnet. For mainnet usage, you can leave these fields empty, and Turbo will default to the mainnet endpoints.

## Upload Images and Metadata with Turbo

Turbo simplifies the process of uploading entire folders of images and metadata using the `TurboAuthenticatedClient.uploadFolder()` function. This function supports Manifests by default, returning a Manifest ID via `result.manifestResponse?.id`, which can be used for metadata creation and escrow setup.

To simplify the process, I've created a helper function called `uploadAssetsAndMetadata()` that handles the entire workflow.

```javascript
const metadataUploadResponse = await uploadAssetsAndMetadata(turbo);
```

**Steps of the `uploadAssetsAndMetadata()` helper**

1. Determines how many lamports are needed for the upload by calling `calculateRequiredLamportsForUpload()`, which calculates the upload cost in Winc (Turbo’s token) and converts it to lamports using `TurboAuthenticatedClient.getWincForToken()`.

2. If the wallet lacks sufficient Winc, the function uses `TurboAuthenticatedClient.topUpWithTokens()` to top up the required amount by converting lamports to Winc.

3. Once the wallet has enough Winc, the image folder is uploaded using `TurboAuthenticatedClient.uploadFolder()`, which returns a Manifest ID for the images.

4. Using the image folder’s Manifest ID, metadata is generated for each image and saved to a folder. The metadata folder is then uploaded using `TurboAuthenticatedClient.uploadFolder()`, returning a Manifest ID that can be used for the escrow process.

### Calculating Required Lamports

```javascript
const requiredLamportsForAssets = await calculateRequiredLamportsForUpload(
  turbo,
  calculateFolderSize(imageFolderPath)
);
```

We begin by calculating the total size of the folder in bytes. The following function recursively traverses the folder structure to sum the sizes of all files:

```javascript
function calculateFolderSize(folderPath: string): number {
  return fs.readdirSync(folderPath).reduce((totalSize, item) => {
    const fullPath = path.join(folderPath, item);
    
    const stats = fs.statSync(fullPath);

    return stats.isFile() 
        ? totalSize + stats.size 
        : totalSize + calculateFolderSize(fullPath);
  }, 0);
}
```

Once the folder size is determined, the next step is to calculate how many lamports are needed for the upload. This is done using the `calculateRequiredLamportsForUpload()` function, which determines the Winc cost and converts it into lamports:

```javascript
async function calculateRequiredLamportsForUpload(turbo: TurboAuthenticatedClient, fileSize: number): Promise<number> {
    /// If the file size is less than 105 KiB, then we don't need to pay for it
    if (fileSize < 107_520) { return 0; }

    /// Check how many winc does it cost to upload the file
    const uploadPrice = new BigNumber((await turbo.getUploadCosts({ bytes: [fileSize]}))[0].winc);

    /// Check the current Winc balance
    const currentBalance = new BigNumber((await turbo.getBalance()).winc);

    /// Calculate how much Winc is required to upload the file
    const requiredWinc = uploadPrice.isGreaterThan(currentBalance)
        ? uploadPrice.minus(currentBalance)
        : new BigNumber(0); // If balance is enough, no Winc is required

    /// If the required Winc is 0, we already have enough to upload the file
    if (requiredWinc.isEqualTo(0)) { return 0; }

    /// Calculate how much Winc 1 SOL is worth (1 SOL = 1_000_000_000 Lamports)
    const wincForOneSol = new BigNumber((await turbo.getWincForToken({ tokenAmount: 1_000_000_000 })).winc);

    /// Calculate how much SOL is required to upload the file (return in SOL)
    const requiredSol = requiredWinc.dividedBy(wincForOneSol).toNumber();

    /// Return the amount of SOL required in Lamports
    return Math.floor(requiredSol * 1_000_000_000)
}
```

### Top Up the Wallet and Upload Images

To top up the wallet, we use the `TurboAuthenticatedClient.topUpWithTokens()` method, specifying the amount of lamports calculated in the previous step. This amount is converted into Winc (Turbo’s token), which is required for the upload process.

**Note**: The top-up process is conditional. If we already have enough Winc in the wallet, the `calculateRequiredLamportsForUpload()` function will return 0, and no top-up will be necessary.

```javascript
// Top up wallet if required
await turbo.topUpWithTokens({tokenAmount: lamportToTokenAmount(requiredLamportsForAssets)});
```

After ensuring the wallet has enough Winc, we can proceed with uploading the image folder. This is done using the `TurboAuthenticatedClient.uploadFolder()` method. The upload will return a manifest ID that allows access to the uploaded files, formatted like this: `https://arweave.net/${manifestID}/${nameOfTheFile.extension}.`

**Note**: It’s important to set the correct [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types) for each file during the upload. If the MIME type is not set correctly, the file might not be displayed properly when accessed via the URI.


```javascript 
// Upload image folder
const imageUploadResponse = await turbo.uploadFolder({
    folderPath: imageFolderPath,
    dataItemOpts: { tags: [{ name: 'Content-Type', value: 'image/jpeg' }] },
});
```

### Create and Upload the Metadata Files

Once the images have been uploaded and the manifest ID is returned, the next step is to generate the metadata for both the assets and the collection. We'll use the `createMetadataFiles()` helper function to handle this efficiently.

```javascript
// Create metadata files concurrently
await createMetadataFiles(imageUploadResponse);
```

The `createMetadataFiles()` function uses `createMetadata()` to generate metadata for each individual asset and `createCollectionMetadata()` to generate metadata for the collection asset.

**Note**: The metadata files are generated concurrently using `Promise.all`, improving performance by creating all metadata files in parallel.

```javascript
async function createMetadataFiles(imageUploadResponse: TurboUploadFolderResponse) {
    const files = fs.readdirSync(imageFolderPath).filter(file => file.endsWith('.png') && file !== 'collection.png');

    // Generate metadata files concurrently using Promise.all
    await Promise.all(
        files.map((file, i) => {
            const metadata = createMetadata(i, imageUploadResponse);
            const jsonFilePath = path.join(metadataFolderPath, `${i}.json`);
            return fs.promises.writeFile(jsonFilePath, JSON.stringify(metadata, null, 2));
        })
    );

    // Create metadata for collection
    const collectionMetadata = createCollectionMetadata(imageUploadResponse);
    const jsonFilePath = path.join(metadataFolderPath, `collection.json`);
    await fs.promises.writeFile(jsonFilePath, JSON.stringify(collectionMetadata, null, 2));
}

function createMetadata(i: number, imageUploadResponse: TurboUploadFolderResponse) {
    return {
        name: `Hybrid Asset  #${i}`,
        symbol: "HYB",
        image: `arweave.net/${imageUploadResponse.manifestResponse?.id}/${i}.png`,
        external_url: 'https://example.com',
        attributes: [
            { trait_type: 'trait1', value: 'value1' },
            { trait_type: 'trait2', value: 'value2' },
        ],
        properties: {
            files: [{ uri: `arweave.net/${imageUploadResponse.manifestResponse?.id}/${i}.png`, type: 'image/png' }],
            category: 'image',
        },
    };
}

function createCollectionMetadata(imageUploadResponse: TurboUploadFolderResponse) {
    return {
        name: `Hybrid Collection`,
        symbol: "HYB",
        image: `arweave.net/${imageUploadResponse.manifestResponse?.id}/collection.png`,
        external_url: 'https://example.com',
        attributes: [
            { trait_type: 'trait1', value: 'value1' },
            { trait_type: 'trait2', value: 'value2' },
        ],
        properties: {
            files: [{ uri: `arweave.net/${imageUploadResponse.manifestResponse?.id}/collection.png`, type: 'image/png' }],
            category: 'image',
        },
    };
}
```

**Note**: Depending on your specific use case, you may need to modify certain fields in the metadata to fit your requirements. However, make sure to follow the proper [JSON schema for NFTs](/token-metadata/token-standard#the-non-fungible-standard) when creating the metadata.

Once the metadata for all assets and the collection has been created, the files are saved into the designated metadata folder and prepared for upload. The next step follows the same preparation process as before:

```javascript
// Calculate and upload metadata folder
const requiredLamportsForMetadata = await calculateRequiredLamportsForUpload(
    turbo,
    calculateFolderSize(metadataFolderPath)
);

// Top up wallet if required
await turbo.topUpWithTokens({tokenAmount: lamportToTokenAmount(requiredLamportsForMetadata)});

// Upload metadata folder
const metadataUploadResponse = await turbo.uploadFolder({
    folderPath: metadataFolderPath,
    dataItemOpts: { tags: [{ name: 'Content-Type', value: 'application/json' }] },
});

console.log('Metadata Manifest ID:', metadataUploadResponse.manifestResponse?.id);
return metadataUploadResponse;
```

## Create the Collection and all the Assets onchain

In this final step, we set up Umi and create the on-chain collection along with its associated assets.

### Setting up Umi

While setting up Umi you can use or generate keypairs/wallets from different sources. You create a new wallet for testing, import an existing wallet from the filesystem, or use `walletAdapter` if you are creating a website/dApp.  

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

// You will need to us fs and navigate the filesystem to
// load the wallet you wish to use via relative pathing.
const walletFile = fs.readFileSync('./keypair.json')
  

// Convert your walletFile onto a keypair.
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

// Load the keypair into umi.
umi.use(keypairIdentity(keypair));
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

### Creates Collection and Assets

We now can finally use the umi instance we just created to call the `createHybridCollection()` helper to handle the creation of all the necessary on-chain accounts.

```javascript
await createHybridCollection(umi, metadataUploadResponse);
```

We first create a collection, which is linked to the manifest ID of the metadata uploaded earlier (e.g., collection.json).

After the collection is created, we mint each asset and link it to the collection. Each asset will point to its respective metadata (e.g., 0.json, 1.json), ensuring they are correctly organized under the collection.

**Note**: Since this guide focuses on creating metadata for MPL-Hybrid, the owner of the assets will be an escrow account, which we set up using the program. If you intend to distribute the NFTs and lock tokens in the escrow, you may need to modify the owner field accordingly for each asset.

```javascript
async function createHybridCollection(umi: Umi, metadataUploadResponse: TurboUploadFolderResponse) {
    // Create collection
    const collection = generateSigner(umi);
    console.log("Collection Address: ", collection.publicKey);

    const createCollectionTx = await createCollection(umi, {
        collection,
        name: 'Hybrid Collection',
        uri: `arweave.net/${metadataUploadResponse.manifestResponse?.id}/collection.json`,
    }).sendAndConfirm(umi);
    console.log(`Collection created! https://explorer.solana.com/tx/${base58.deserialize(createCollectionTx.signature)[0]}?cluster=devnet`);

    // Create assets concurrently using Promise.all
    const collectionSize = 10;

    const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
        string({ size: 'variable' }).serialize('escrow'),
        publicKeySerializer().serialize(collection),
    ]);

    await Promise.all(
        Array.from({ length: collectionSize }, async (_, i) => {
            const asset = generateSigner(umi);
            const createAssetTx = await create(umi, {
                asset,
                collection,
                owner: escrow,
                name: `Hybrid Asset #${i}`,
                uri: `arweave.net/${metadataUploadResponse.manifestResponse?.id}/${i}.json`,
            }).sendAndConfirm(umi);
            console.log(`Asset #${i} created! https://explorer.solana.com/tx/${base58.deserialize(createAssetTx.signature)[0]}?cluster=devnet`);
        })
    );
}
```

## Full Code Example

Here's the full code example that you can copy and paste for easy use

{% totem %}

{% totem-accordion title="Full Code Example" %}

```javascript
import { TurboFactory, TurboAuthenticatedClient, lamportToTokenAmount, TurboUploadFolderResponse } from '@ardrive/turbo-sdk';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { generateSigner, createSignerFromKeypair, signerIdentity, Umi } from '@metaplex-foundation/umi';
import { string, base58, publicKey as publicKeySerializer } from '@metaplex-foundation/umi/serializers';
import { mplCore, create, createCollection } from '@metaplex-foundation/mpl-core';
import { MPL_HYBRID_PROGRAM_ID } from '@metaplex-foundation/mpl-hybrid';

import bs58 from 'bs58';
import path from 'path';
import fs from 'fs';
import BigNumber from 'bignumber.js';

import secretKey from "/Users/leo/.config/solana/id.json";

const imageFolderPath = path.join(__dirname, './assets');
const metadataFolderPath = path.join(__dirname, './metadata');

(async () => {
    try {
        /// Step 1: Setup Turbo
        const turbo = TurboFactory.authenticated({
            privateKey: bs58.encode(Uint8Array.from(secretKey)),
            token: 'solana',
            gatewayUrl: `https://api.devnet.solana.com`,
            paymentServiceConfig: { url: "https://payment.ardrive.dev" },
            uploadServiceConfig: { url: "https://upload.ardrive.dev" },
        });

        /// Step 2: Upload Images
        const metadataUploadResponse = await uploadAssetsAndMetadata(turbo);

        /// Step 3: Setup Umi and Create Collection & Assets
        const umi = createUmi('https://api.devnet.solana.com')
            .use(mplCore());

        const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
        umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

        await createHybridCollection(umi, metadataUploadResponse);
    } catch (error) {
        console.error("Error during execution:", error);
    }
})();

async function uploadAssetsAndMetadata(turbo: TurboAuthenticatedClient): Promise<TurboUploadFolderResponse> {
    // Calculate and upload image folder
    const requiredLamportsForAssets = await calculateRequiredLamportsForUpload(
        turbo,
        calculateFolderSize(imageFolderPath)
    );

    // Top up wallet if required
    // await turbo.topUpWithTokens({tokenAmount: lamportToTokenAmount(requiredLamportsForAssets)});

    // Upload image folder
    const imageUploadResponse = await turbo.uploadFolder({
        folderPath: imageFolderPath,
        dataItemOpts: { tags: [{ name: 'Content-Type', value: 'image/jpeg' }] },
    });

    // Create metadata files concurrently
    await createMetadataFiles(imageUploadResponse);

    // Calculate and upload metadata folder
    const requiredLamportsForMetadata = await calculateRequiredLamportsForUpload(
        turbo,
        calculateFolderSize(metadataFolderPath)
    );

    // Top up wallet if required
    // await turbo.topUpWithTokens({tokenAmount: lamportToTokenAmount(requiredLamportsForMetadata)});

    // Upload metadata folder
    const metadataUploadResponse = await turbo.uploadFolder({
        folderPath: metadataFolderPath,
        dataItemOpts: { tags: [{ name: 'Content-Type', value: 'application/json' }] },
    });

    console.log('Metadata Manifest ID:', metadataUploadResponse.manifestResponse?.id);
    return metadataUploadResponse;
}

async function createMetadataFiles(imageUploadResponse: TurboUploadFolderResponse) {
    const files = fs.readdirSync(imageFolderPath).filter(file => file.endsWith('.png') && file !== 'collection.png');

    // Generate metadata files concurrently using Promise.all
    await Promise.all(
        files.map((file, i) => {
            const metadata = createMetadata(i, imageUploadResponse);
            const jsonFilePath = path.join(metadataFolderPath, `${i}.json`);
            return fs.promises.writeFile(jsonFilePath, JSON.stringify(metadata, null, 2));
        })
    );

    // Create metadata for collection
    const collectionMetadata = createCollectionMetadata(imageUploadResponse);
    const jsonFilePath = path.join(metadataFolderPath, `collection.json`);
    await fs.promises.writeFile(jsonFilePath, JSON.stringify(collectionMetadata, null, 2));
}

function createMetadata(i: number, imageUploadResponse: TurboUploadFolderResponse) {
    return {
        name: `Hybrid Asset  #${i}`,
        symbol: "HYB",
        image: `arweave.net/${imageUploadResponse.manifestResponse?.id}/${i}.png`,
        external_url: 'https://example.com',
        attributes: [
            { trait_type: 'trait1', value: 'value1' },
            { trait_type: 'trait2', value: 'value2' },
        ],
        properties: {
            files: [{ uri: `arweave.net/${imageUploadResponse.manifestResponse?.id}/${i}.png`, type: 'image/png' }],
            category: 'image',
        },
    };
}

function createCollectionMetadata(imageUploadResponse: TurboUploadFolderResponse) {
    return {
        name: `Hybrid Collection`,
        symbol: "HYB",
        image: `arweave.net/${imageUploadResponse.manifestResponse?.id}/collection.png`,
        external_url: 'https://example.com',
        attributes: [
            { trait_type: 'trait1', value: 'value1' },
            { trait_type: 'trait2', value: 'value2' },
        ],
        properties: {
            files: [{ uri: `arweave.net/${imageUploadResponse.manifestResponse?.id}/collection.png`, type: 'image/png' }],
            category: 'image',
        },
    };
}

async function createHybridCollection(umi: Umi, metadataUploadResponse: TurboUploadFolderResponse) {
    // Create collection
    const collection = generateSigner(umi);
    console.log("Collection Address: ", collection.publicKey);

    const createCollectionTx = await createCollection(umi, {
        collection,
        name: 'Hybrid Collection',
        uri: `arweave.net/${metadataUploadResponse.manifestResponse?.id}/collection.json`,
    }).sendAndConfirm(umi);
    console.log(`Collection created! https://explorer.solana.com/tx/${base58.deserialize(createCollectionTx.signature)[0]}?cluster=devnet`);

    // Create assets concurrently using Promise.all
    const collectionSize = 10;
    const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
        string({ size: 'variable' }).serialize('escrow'),
        publicKeySerializer().serialize(collection),
    ]);

    await Promise.all(
        Array.from({ length: collectionSize }, async (_, i) => {
            const asset = generateSigner(umi);
            const createAssetTx = await create(umi, {
                asset,
                collection,
                owner: escrow,
                name: `Hybrid Asset #${i}`,
                uri: `arweave.net/${metadataUploadResponse.manifestResponse?.id}/${i}.json`,
            }).sendAndConfirm(umi);
            console.log(`Asset #${i} created! https://explorer.solana.com/tx/${base58.deserialize(createAssetTx.signature)[0]}?cluster=devnet`);
        })
    );
}

function calculateFolderSize(folderPath: string): number {
    return fs.readdirSync(folderPath).reduce((totalSize, item) => {
        const fullPath = path.join(folderPath, item);
        
        const stats = fs.statSync(fullPath);

        return stats.isFile() 
            ? totalSize + stats.size 
            : totalSize + calculateFolderSize(fullPath);
    }, 0);
}

async function calculateRequiredLamportsForUpload(turbo: TurboAuthenticatedClient, fileSize: number): Promise<number> {
    /// If the file size is less than 105 KiB, then we don't need to pay for it
    if (fileSize < 107_520) { return 0; }

    /// Check how many winc does it cost to upload the file
    const uploadPrice = new BigNumber((await turbo.getUploadCosts({ bytes: [fileSize]}))[0].winc);

    /// Check the current Winc balance
    const currentBalance = new BigNumber((await turbo.getBalance()).winc);

    /// Calculate how much Winc is required to upload the file
    const requiredWinc = uploadPrice.isGreaterThan(currentBalance)
        ? uploadPrice.minus(currentBalance)
        : new BigNumber(0); // If balance is enough, no Winc is required

    /// If the required Winc is 0, we already have enough to upload the file
    if (requiredWinc.isEqualTo(0)) { return 0; }

    /// Calculate how much Winc 1 SOL is worth (1 SOL = 1_000_000_000 Lamports)
    const wincForOneSol = new BigNumber((await turbo.getWincForToken({ tokenAmount: 1_000_000_000 })).winc);

    /// Calculate how much SOL is required to upload the file (return in SOL)
    const requiredSol = requiredWinc.dividedBy(wincForOneSol).toNumber();

    /// Return the amount of SOL required in Lamports
    return Math.floor(requiredSol * 1_000_000_000)
}
```

{% /totem %}

{% /totem-accordion %}