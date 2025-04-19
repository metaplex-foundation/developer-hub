---
title: Create deterministic metadata with Turbo
metaTitle: Create deterministic metadata with Turbo | General Guides
description: Learn how to create deterministic metadata leveraging the Turbo SDK for Arweave-based uploads.
# remember to update dates also in /components/guides/index.js
created: '10-19-2024'
updated: '10-19-2024'
---

To utilize the metadata randomization feature in the MPL-Hybrid program, the off-chain metadata URIs need to follow a consistent, incremental structure. To achieve this, we will use the [path manifest](https://cookbook.arweave.dev/concepts/manifests.html) feature from Arweave and the Turbo SDK. **This guide will demonstrate how to set this up!**

{% callout title="What is Turbo" %}

Turbo is an ultrahigh-throughput Permaweb service that streamlines the funding, indexing, and transmission of data to and from Arweave. It provides graphical and programmatic interfaces for payment options in fiat currency with credit or debit cards as well as cryptocurrencies such as ETH, SOL, and AR.

{% /callout %}

## Prerequisite

### Required Packages

{% packagesUsed packages=[ "@ardrive/turbo-sdk" ] type="npm" /%}

Install the required packages for this guide.

```js
npm i @ardrive/turbo-sdk
```

### Metadata Folder

In this example, we will show you how to upload metadata in a deterministic way. To do so, you'll need to prepare all the assets before starting. 

To generate the metadata, you can use [one of these methods](/candy-machine/guides/create-an-nft-collection-on-solana-with-candy-machine#image-and-metadata-generators) and save the metadata following an incremental naming convention starting from 0 like this:

```
metadata/
├─ 0.json
├─ 1.json
├─ 2.json
├─ ...
```

**Note**: When creating the metadata, make sure to follow the proper [JSON schema for NFTs](/token-metadata/token-standard#the-non-fungible-standard)!

## Setting up Turbo 

Since Turbo is compatible with multiple tokens and chains, we'll need to configure our Turbo instance to use Solana as the token for this guide. We do this by calling the `TurboFactory.authenticated()` method and passing in Solana-specific configuration options.

```javascript
import { TurboFactory } from '@ardrive/turbo-sdk';

// Import here the keypair.json file that you're going
// to use to pay for the upload
import secretKey from "/path/to/your/keypair.json";

const turbo = TurboFactory.authenticated({
  privateKey: bs58.encode(Uint8Array.from(secretKey)),
  token: 'solana',
  gatewayUrl: `https://api.devnet.solana.com`,
  paymentServiceConfig: { url: "https://payment.ardrive.dev" },
  uploadServiceConfig: { url: "https://upload.ardrive.dev" },
});
```

**Note**: In this example, we explicitly provide the `gatewayUrl`, `paymentServiceConfig`, and `uploadServiceConfig` because we want to configure the environment to work on devnet. For mainnet usage, you can leave these fields empty, and Turbo will default to the mainnet endpoints.
To gain access to the Metaplex Aura network on the Solana and Eclipse blockchains you can visit the Aura App for an endpoint and API key [here](https://aura-app.metaplex.com/).

## Upload the Metadata

Turbo simplifies the process of uploading entire folders of metadata using the `TurboAuthenticatedClient.uploadFolder()` function. This function supports Manifests by default, returning a Manifest ID via `metadataUploadResponse.manifestResponse?.id`, which can be used for metadata creation and escrow setup.

To simplify the process, this guide provides a helper function called `uploadMetadata()` that handles the entire workflow.

```javascript
const metadataUploadResponse = await uploadMetadata(turbo);
```

**Steps of the `uploadMetadata()` helper**

1. Determines how many lamports are needed for the upload by calling `calculateRequiredLamportsForUpload()`, which calculates the upload cost in Winc (Turbo’s token) and converts it to lamports using `TurboAuthenticatedClient.getWincForToken()`.

2. If the wallet lacks sufficient Winc, the function uses `TurboAuthenticatedClient.topUpWithTokens()` to top up the required amount by converting lamports to Winc.

3. Once the wallet has enough Winc, upload the metadata folder using `TurboAuthenticatedClient.uploadFolder()`, which returns a Manifest ID for the metadata.

### Calculating Required Lamports

```javascript
const requiredLamportsForMetadata = await calculateRequiredLamportsForUpload(
  turbo,
  calculateFolderSize(metadataFolderPath)
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

### Top Up the Wallet and Upload Metadata

To top up the wallet, we use the `TurboAuthenticatedClient.topUpWithTokens()` method, specifying the amount of lamports calculated in the previous step. This amount is converted into Winc (Turbo’s token), which is required for the upload process.

**Note**: The top-up process is conditional. If we already have enough Winc in the wallet, the `calculateRequiredLamportsForUpload()` function will return 0, and no top-up will be necessary.

```javascript
// Top up wallet if required
await turbo.topUpWithTokens({tokenAmount: lamportToTokenAmount(requiredLamportsForMetadata)});
```

After ensuring the wallet has enough Winc, we can proceed with uploading the image folder. This is done using the `TurboAuthenticatedClient.uploadFolder()` method. The upload will return a manifest ID that allows access to the uploaded files, formatted like this: `https://arweave.net/${manifestID}/${nameOfTheFile.extension}.`

**Note**: It’s important to set the correct [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types) for each file during the upload. If the MIME type is not set correctly, the file might not be displayed properly when accessed via the URI.


```javascript 
// Upload image folder
const metadataUploadResponse = await turbo.uploadFolder({
    folderPath: metadataFolderPath,
    dataItemOpts: { tags: [{ name: 'Content-Type', value: 'application/json' }] },
});
```

## Full code Example

Here's the full code example that you can copy and paste for easy use

{% totem %}

{% totem-accordion title="Full Code Example" %}

```javascript
import { 
    TurboFactory, 
    TurboAuthenticatedClient, 
    lamportToTokenAmount, 
    TurboUploadFolderResponse 
} from '@ardrive/turbo-sdk';

import bs58 from 'bs58';
import path from 'path';
import fs from 'fs';
import BigNumber from 'bignumber.js';

import secretKey from "/path/to/your/keypair.json";

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

        /// Step 2: Upload Metadata
        const metadataUploadResponse = await uploadMetadata(turbo);
    } catch (error) {
        console.error("Error during execution:", error);
    }
})();

async function uploadMetadata(turbo: TurboAuthenticatedClient): Promise<TurboUploadFolderResponse> {
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