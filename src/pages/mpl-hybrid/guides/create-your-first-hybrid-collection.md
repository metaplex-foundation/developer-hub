---
title: Create your First Hybrid Collection
metaTitle: Create your First Hybrid Collection | Hybrid Guides
description: Learn how to create an hybrid collection, fully end-to-end!.
# remember to update dates also in /components/guides/index.js
created: '09-17-2024'
updated: '09-17-2024'
---

This guide will demonstrate how to create an **Hybrid Collection** fully end-to-end. Starting from how to create all the assets needed, to how to create the escrow and setting up all the parameters for the **capture** and **release** feature!

{% callout title="What is MPL-Hybrid?" %}

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

{% packagesUsed packages=["umi", "umiDefaults", "core", "@metaplex-foundation/mpl-hybrid", "tokenMetadata" ] type="npm" /%}

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
npm i @metaplex-foundation/mpl-hybrid
```

```js
npm i @metaplex-foundation/mpl-token-metadata
```

## Preparation

Before setting up the escrow for the MPL-Hybrid program, which facilitates the swapping of fungible tokens for non-fungible tokens (NFTs) and vice versa, you’ll need to have both a collection of Core NFTs and fungible tokens already minted.

**Note**: The escrow will need to be funded with NFTs, fungible tokens, or a combination of both. The simplest way to maintain balance in the escrow is to fill it entirely with one type of asset while distributing the other, ensuring that the escrow remains functional.

If you’re missing any of these prerequisites, don’t worry! We’ll guide you through each step from the beginning.

### Creating the NFT Collection

To utilize the metadata randomization feature in the MPL-Hybrid program, the off-chain metadata URIs need to follow a consistent, incremental structure. For this, we use the [path manifest](https://cookbook.arweave.dev/concepts/manifests.html) feature from Arweave in combination with the Turbo SDK.

Manifest allows multiple transactions to be linked under a single base transaction ID and assigned human-readable file names, like this:
- https://arweave.net/manifestID/0.json
- https://arweave.net/manifestID/1.json
...
- https://arweave.net/manifestID/9999.json

If you're unfamiliar with how to create a core digital asset collection with deterministic URIs, you can follow [this guide](create-deterministic-metadata-with-turbo) for a detailed walkthrough.

**Note**: Currently, the MPL-Hybrid program randomly picks a number between the min and max URI index provided and does not check to see if the URI is already used. As such, swapping suffers from the [Birthday Paradox](https://betterexplained.com/articles/understanding-the-birthday-paradox/). In order for projects to benefit from sufficient swap randomization, we recommend preparing and uploading a minimum of 250k asset metadata that can be randomly picked from. The more available potential assets the better.

### Creating the Fungible Tokens

The MPL-Hybrid escrow requires an associated fungible token that can be used to redeem or pay for the release of an NFT. This can be an existing token that's already minted and circulating.

If you’re unfamiliar with creating a token, you can follow [this guide](/guides/javascript/how-to-create-a-solana-token) to learn how to mint your own fungible token on Solana.

**After creating both the NFT Collection and Tokens, we're finally ready to create the Escrow and start swapping!**

## Creating the Escrow

Before jumping in the relevant information about MPL-Hybrid, it's a good idea to learn how to set up your Umi instance since we're going to do that multiple time during the guide.

### Setting up Umi

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
umi.rpc.airdrop(umi.identity.publicKey, sol(1));
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

### Setup the Parameters

After setting up your Umi instance, the next step is to configure the parameters required for the MPL-Hybrid Escrow.

We'll begin by defining the general settings for the escrow contract:

```javascript
// Escrow Settings - Change these to your needs
const name = "MPL-404 Hybrid Escrow";                       
const uri = "https://arweave.net/manifestId";               
const max = 15;                                             
const min = 0;                                              
const path = 0;                                             
```

| Parameter     | Description                                                                 |
| ------------- | --------------------------------------------------------------------------- |
| **Name**      | The name of the escrow contract (e.g., "MPL-404 Hybrid Escrow").             |
| **URI**       | The base URI of the NFT collection. This should follow the deterministic metadata structure. |
| **Max & Min** | These define the range of the deterministic URIs for the collection's metadata. |
| **Path**      | Choose between two paths: `0` to update the NFT metadata on swap, or `1` to keep the metadata unchanged after a swap. |

Next, we configure the key accounts needed for the escrow:

```javascript
// Escrow Accounts - Change these to your needs
const collection = publicKey('<YOUR-COLLECTION-ADDRESS>'); 
const token = publicKey('<YOUR-TOKEN-ADDRESS>');           
const feeLocation = publicKey('<YOUR-FEE-ADDRESS>');        
const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
    string({ size: 'variable' }).serialize('escrow'),
    publicKeySerializer().serialize(collection),
]);                                                        
```

| Account           | Description                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| **Collection**    | The collection being swapped to or from. This is the address of the NFT collection. |
| **Token**         | The token being swapped to or from. This is the address of the fungible token. |
| **Fee Location**  | The address where any fees from the swaps will be sent. |
| **Escrow**        | The derived escrow account, which is responsible for holding the NFTs and tokens during the swap process. |

Lastly, we define the token-related parameters and create a helper function, addZeros(), to adjust token amounts for decimals:

```javascript
// Token Swap Settings - Change these to your needs
const tokenDecimals = 6;                                    
const amount = addZeros(100, tokenDecimals);                
const feeAmount = addZeros(1, tokenDecimals);               
const solFeeAmount = addZeros(0, 9);                       

// Function that adds zeros to a number, needed for adding the correct amount of decimals
function addZeros(num: number, numZeros: number): number {
  return num * Math.pow(10, numZeros)
}
```

| Parameter         | Description                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| **Amount**         | The amount of tokens the user will receive during the swap, adjusted for decimals. |
| **Fee Amount**     | The amount of the token fee the user will pay when swapping to an NFT.       |
| **Sol Fee Amount** | An additional fee (in SOL) that will be charged when swapping to NFTs, adjusted for Solana's 9 decimal places. |

### Initialize the Escrow 

We can now initialize the escrow using the `initEscrowV1()` method, passing in all the parameters and variables we’ve set up. This will create your own MPL-Hybrid Escrow.

```javascript
const initEscrowTx = await initEscrowV1(umi, {
  name,
  uri,
  max,
  min,
  path,
  escrow,
  collection,
  token,
  feeLocation,
  amount,
  feeAmount,
  solFeeAmount,
}).sendAndConfirm(umi);

const signature = base58.deserialize(initEscrowTx.signature)[0]
console.log(`Escrow created! https://explorer.solana.com/tx/${signature}?cluster=devnet`)
```

**Note**: Simply creating the escrow won’t make it "ready" for swapping. You’ll need to populate the escrow with either NFTs or tokens (or both). **Here’s how**:

{% totem %}

{% totem-accordion title="Send Assets to the Escrow" %}

```javascript
import { transfer } from '@metaplex-foundation/mpl-core'

// Derive the Escrow
const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
  string({ size: 'variable' }).serialize('escrow'),
  publicKeySerializer().serialize(collection),
])[0];

// Transfer Asset to it
const transferAssetTx = await transfer(umi, {
  asset,
  collection,
  newOwner: escrow
}).sendAndConfirm(umi);
```

{% /totem-accordion %}

{% totem-accordion title="Send Fungible Tokens to the Escrow" %}

```javascript
import { transactionBuilder } from '@metaplex-foundation/umi'
import { createTokenIfMissing, transferTokens } from '@metaplex-foundation/mpl-toolbox'

// Derive the Escrow
const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
  string({ size: 'variable' }).serialize('escrow'),
  publicKeySerializer().serialize(collection),
])[0];

// Transfer Fungible Tokens to it (after creating the ATA if needed)
const transferTokenTx = await transactionBuilder().add(
  createTokenIfMissing(umi, { 
      mint: token, 
      owner: escrow 
  })
).add(
  transferTokens(umi, {
      source: findAssociatedTokenPda(umi, { mint: token, owner: umi.identity.publicKey }),
      destination: findAssociatedTokenPda(umi, { mint: token, owner: escrow }),
      amount,
  })
).sendAndConfirm(umi)
```
{% /totem-accordion %}

{% /totem %}

### Full Code Example

{% totem %}

{% totem-accordion title="Full Code Example" %}

```javascript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { publicKey, signerIdentity, generateSigner, sol } from '@metaplex-foundation/umi'
import { mplHybrid, MPL_HYBRID_PROGRAM_ID, initEscrowV1 } from '@metaplex-foundation/mpl-hybrid'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { string, base58, publicKey as publicKeySerializer } from '@metaplex-foundation/umi/serializers'

(async () => {
  /// Step 1: Setup Umi
  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplHybrid())
    .use(mplTokenMetadata())

  let signer = generateSigner(umi);

  umi.use(signerIdentity(signer)).rpc.airdrop(umi.identity.publicKey, sol(1));

  /// Step 2: Setup the Escrow

  // Escrow Settings - Change these to your needs
  const name = "MPL-404 Hybrid Escrow";                       // The name of the escrow
  const uri = "https://arweave.net/manifestId";               // The base URI of the collection
  const max = 15;                                             // The max URI
  const min = 0;                                              // The min URI
  const path = 0;                                             // 0: Update Nft on Swap, 1: Do not update Nft on Swap

  // Escrow Accounts - Change these to your needs
  const collection = publicKey('<YOUR-COLLECTION-ADDRESS>');  // The collection we are swapping to/from
  const token = publicKey('<YOUR-TOKEN-ADDRESS>');            // The token we are swapping to/from
  const feeLocation = publicKey('<YOUR-FEE-ADDRESS>');        // The address where the fees will be sent
  const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
    string({ size: 'variable' }).serialize('escrow'),
    publicKeySerializer().serialize(collection),
  ]);                                                         // The derived escrow account

  // Token Swap Settings - Change these to your needs
  const tokenDecimals = 6;                                    // The decimals of the token
  const amount = addZeros(100, tokenDecimals);                // The amount the user will receive when swapping
  const feeAmount = addZeros(1, tokenDecimals);               // The amount the user will pay as fee when swapping to NFT
  const solFeeAmount = addZeros(0, 9);                        // Additional fee to pay when swapping to NFTs (Sol has 9 decimals)

  /// Step 3: Create the Escrow
  const initEscrowTx = await initEscrowV1(umi, {
    name,
    uri,
    max,
    min,
    path,
    escrow,
    collection,
    token,
    feeLocation,
    amount,
    feeAmount,
    solFeeAmount,
  }).sendAndConfirm(umi);

  const signature = base58.deserialize(initEscrowTx.signature)[0]
  console.log(`Escrow created! https://explorer.solana.com/tx/${signature}?cluster=devnet`)
})()

// Function that adds zeros to a number, needed for adding the correct amount of decimals
function addZeros(num: number, numZeros: number): number {
  return num * Math.pow(10, numZeros)
}
```

{% /totem-accordion %}

{% /totem %}

## Capture & Release

### Setup the Accounts 

After setting up Umi (as we did in the previous section), the next step is configuring the accounts needed for the Capture & Release process. These accounts will feel familiar since they’re similar to what we used earlier and they are the same for both instructions:

```javascript
// Step 2: Escrow Accounts - Change these to your needs
const collection = publicKey('<YOUR-COLLECTION-ADDRESS>');
const token = publicKey('<YOUR-TOKEN-ADDRESS>');
const feeProjectAccount = publicKey('<YOUR-FEE-ADDRESS>');
const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
    string({ size: 'variable' }).serialize('escrow'),
    publicKeySerializer().serialize(collection),
]);
```

**Note**: The `feeProjectAccount` is the same as the `feeLocation` field from the last script.

### Choose the Asset to Capture/Release

How you choose the asset depends on the path you selected when creating the Escrow (either 0 or 1):
- **Path 0**: If the path is set to `0`, the NFT metadata will be updated during the swap, so you can just grab a random asset from the escrow since this will not matter.
- **Path 1**: If the path is `1`, the NFT metadata stays the same after the swap, so you could let the user choose which specific NFT they want to swap into.

**For Capture**

If you're capturing an NFT, here's how you can pick a random asset owned by the escrow:

```javascript
// Fetch all the assets in the collection
const assetsListByCollection = await fetchAssetsByCollection(umi, collection, {
    skipDerivePlugins: false,
})

// Find the assets owned by the escrow
const asset = assetsListByCollection.filter(
    (a) => a.owner === publicKey(escrow)
)[0].publicKey
```

**For Release**

If you're releasing an NFT, it’s generally up to the user to choose which one they want to release. But for this example, we’ll just select a random asset owned by the user:

```javascript
// Fetch all the assets in the collection
const assetsListByCollection = await fetchAssetsByCollection(umi, collection, {
    skipDerivePlugins: false,
})

// Usually the user choose what to exchange
const asset = assetsListByCollection.filter(
    (a) => a.owner === umi.identity.publicKey
)[0].publicKey
```

### Capture (Fungible to Non-Fungible)

Now, let’s finally talk about the Capture instruction. This is the process where you swap fungible tokens for an NFT (The amount of tokens needed for the swap is set at escrow creation).

```javascript
// Capture an NFT by swapping fungible tokens
const captureTx = await captureV1(umi, {
  owner: umi.identity.publicKey,
  escrow,
  asset,
  collection,
  token,
  feeProjectAccount,
  amount,
}).sendAndConfirm(umi);

const signature = base58.deserialize(captureTx.signature)[0];
console.log(`Captured! Check it out: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
```

### Release (Non-Fungible to Fungible)

Releasing is the opposite of capturing—here you swap an NFT for fungible tokens:

```javascript
// Release an NFT and receive fungible tokens
const releaseTx = await releaseV1(umi, {
  owner: umi.payer,
  escrow,
  asset,
  collection,
  token,
  feeProjectAccount,
}).sendAndConfirm(umi);

const signature = base58.deserialize(releaseTx.signature)[0];
console.log(`Released! Check it out: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
```

### Full Code Example

{% totem %}

{% totem-accordion title="Release" %}

```javascript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { generateSigner, signerIdentity, publicKey, sol } from '@metaplex-foundation/umi'
import { mplHybrid, MPL_HYBRID_PROGRAM_ID, releaseV1 } from '@metaplex-foundation/mpl-hybrid'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { base58, string, publicKey as publicKeySerializer } from '@metaplex-foundation/umi/serializers'
import { fetchAssetsByCollection } from '@metaplex-foundation/mpl-core'

import walletFile from "/Users/leo/.config/solana/id.json";

(async () => {
  /// Step 1: Setup Umi
  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplHybrid())
    .use(mplTokenMetadata())

  let signer = generateSigner(umi);

  umi.use(signerIdentity(signer)).rpc.airdrop(umi.identity.publicKey, sol(1));

  // Step 2: Escrow Accounts - Change these to your needs
  const collection = publicKey('<YOUR-COLLECTION-ADDRESS>');  // The collection we are swapping to/from
  const token = publicKey('<YOUR-TOKEN-ADDRESS>');            // The token we are swapping to/from
  const feeProjectAccount = publicKey('<YOUR-FEE-ADDRESS>');  // The address where the fees will be sent
  const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
    string({ size: 'variable' }).serialize('escrow'),
    publicKeySerializer().serialize(collection),
  ]);                  

  // Fetch all the assets in the collection
  const assetsListByCollection = await fetchAssetsByCollection(umi, collection, {
    skipDerivePlugins: false,
  })

  // Usually the user choose what to exchange
  const asset = assetsListByCollection.filter(
    (a) => a.owner === umi.identity.publicKey
  )[0].publicKey

  /// Step 3: "Capture" (Swap from Fungible to Non-Fungible) the Asset
  const releaseTx = await releaseV1(umi, {
    owner: umi.payer,
    escrow,
    asset,
    collection,
    token,
    feeProjectAccount,
  }).sendAndConfirm(umi)
  
  const signature = base58.deserialize(releaseTx.signature)[0]
  console.log(`Released! https://explorer.solana.com/tx/${signature}?cluster=devnet`)
})();
```

{% /totem-accordion %}

{% totem-accordion title="Capture" %}

```javascript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { generateSigner, signerIdentity, publicKey, sol } from '@metaplex-foundation/umi'
import { mplHybrid, MPL_HYBRID_PROGRAM_ID, captureV1 } from '@metaplex-foundation/mpl-hybrid'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { base58, string, publicKey as publicKeySerializer } from '@metaplex-foundation/umi/serializers'
import { fetchAssetsByCollection } from '@metaplex-foundation/mpl-core'

(async () => {
    /// Step 1: Setup Umi
    const umi = createUmi('https://api.devnet.solana.com')
      .use(mplHybrid())
      .use(mplTokenMetadata())

    let signer = generateSigner(umi);

    umi.use(signerIdentity(signer)).rpc.airdrop(umi.identity.publicKey, sol(1));

    // Step 2: Escrow Accounts - Change these to your needs
    const collection = publicKey('<YOUR-COLLECTION-ADDRESS>');  // The collection we are swapping to/from
    const token = publicKey('<YOUR-TOKEN-ADDRESS>');            // The token we are swapping to/from
    const feeProjectAccount = publicKey('<YOUR-FEE-ADDRESS>');  // The address where the fees will be sent
    const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
      string({ size: 'variable' }).serialize('escrow'),
      publicKeySerializer().serialize(collection),
    ]);                    

    // Fetch all the assets in the collection
    const assetsListByCollection = await fetchAssetsByCollection(umi, collection, {
      skipDerivePlugins: false,
    })

    // Find the assets owned by the escrow
    const asset = assetsListByCollection.filter(
      (a) => a.owner === publicKey(escrow)
    )[0].publicKey

    /// Step 3: "Capture" (Swap from Fungible to Non-Fungible) the Asset
    const captureTx = await captureV1(umi, {
      owner: umi.payer,
      escrow,
      asset,
      collection,
      token,
      feeProjectAccount,
    }).sendAndConfirm(umi)
  const signature = base58.deserialize(captureTx.signature)[0]
  console.log(`Captured! https://explorer.solana.com/tx/${signature}?cluster=devnet`)})();
```

{% /totem-accordion %}

{% /totem %}