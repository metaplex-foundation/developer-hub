---
title: Create a Core Candy Machine Reveal System
metaTitle: Create a Core Candy Machine Reveal System | Core Candy Machine
description: How to create a Core Candy Machine Reveal System for your Core Candy Machine with hidden settings.
---
After you create you Core Candy Machine with hidden setting, you need to have a reveal mechanism to in order to reveal your assets
If you are looking to create a hide-and-reveal NFT drop, you can use Core Candy Machine to achieve that goal. This guide is divided into two parts to ensure a comprehensive walkthrough of the entire process.

In this guide (Part 2), we’ll walk you through the step-by-step process of setting up a Reveal System for your Core Candy Machine. Whether you’re an experienced developer or new to NFT drops, this guide will provide you with everything you need to get started. Revealing and validating your NFT drop will be covered in Part 2.

How this works, is that after setting up your Core Candy Machine and minting your collection, a reveal process needs to be performed where we will update the Assets with the proper metadata.

To ensure that the Assets were correctly updated, a validation step is performed. This involves hashing the updated metadata (name and URI) of the revealed Assets and comparing it with the original hash stored in the hidden settings. This ensures that every NFT has been updated accurately.


## Required Packages

You'll need to install the following packages for interacting with the Core Candy Machine:

{% packagesUsed packages=["umi", "umiDefaults", "core", "candyMachineCore", "mpl-toolbox"] type="npm" /%}

```ts
npm i @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-core-candy-machine
```

## Setting up umi

After setting up your environment, let's start by setting up umi.

While setting up Umi, you can create new wallets for testing, import wallets from you filesystem or even use `walletAdapter` with a UI/frontend.
For this example, we will be creating a Keypair from a json file (wallet.json) containing a secret key.

We will be using the devnet public API node, which is rate-limited. For large-scale use, you can find more information about RPC nodes [here](https://developers.metaplex.com/rpc-providers).

```ts
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, some, none, createSignerFromKeypair, signerIdentity, transactionBuilder, dateTime } from "@metaplex-foundation/umi";
import { mplCandyMachine as mplCoreCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine';
import * as fs from 'fs';

// We will be using Solana Devnet as endpoint, and loading the mplCoreCandyMachine plugin
const umi = createUmi("https://api.devnet.solana.com")
            .use(mplCoreCandyMachine());

// Let's create a Keypair from our wallet json file that contains a secret key, and create a signer based on the created keypair
const walletFile = fs.readFileSync('./wallet.json');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));
const signer = createSignerFromKeypair(umi, keypair);
console.log("Signer: ", signer.publicKey);

// Set the identity and the payer to the given signer
umi.use(signerIdentity(signer));
```

You can find more details about setting up UMI [here](https://developers.metaplex.com/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript#setting-up-umi)

## Prepare Reveal System
Let's now reveal the collection.

To reveal the collection, we will fetch the collection assets using the fetchAssetsByCollection method and will update those same minted assets by invoking the method update with the revealData that we prepared in the beggining of this guide.

As we only want to reveal our assets after all items have been minted, we will validate the mint completion by fetching the Core Candy Machine details using the fetchCandyMachine method and making sure that the items available are the same as the items redeemed. This unsures us that all assets have been minted

```ts
import { update, fetchAssetsByCollection } from '@metaplex-foundation/mpl-core';

candyMachineDetails = await fetchCandyMachine(umi, candyMachine.publicKey);
assert(candyMachineDetails.data.itemsAvailable == candyMachineDetails.itemsRedeemed);

let collectionDetails = await fetchCollection(umi, collectionMint.publicKey);
let collectionAssets = await fetchAssetsByCollection(umi,collectionMint.publicKey);

for(let i = 0; i < candyMachineDetails.itemsRedeemed; i++) {
    await update(umi, {
        asset: collectionAssets[i],
        collection: collectionDetails,
        authority: collectionUpdateAuthority,
        name: revealData[i].name,
        uri: revealData[i].uri,
    }).sendAndConfirm(umi);

    console.log("NFT revealed");
}
```

## Validation of the revealed assets

Now that the we revealed our assets, it is time to confirm that the assets integrity.

For that, we will again fetch the assets of our collection using the fetchAssetsByCollection method and, for each asset, we will extract the name and URI and store them in a new array.

After that, we will log both arrays (revealData and fetchedAssets) to help visualize and verify that the metadata has been updated as expected and will also hash the fetchedAssets data and compare to the initial hash (from the part 1 of this tutorial)

```ts
let fetchedAssets = [];

collectionAssets = await fetchAssetsByCollection(umi,collectionMint.publicKey);
for(let i = 0; i < collectionAssets.length; i++) {
    fetchedAssets[i] = {name: collectionAssets[i].name, uri: collectionAssets[i].uri};
}

console.log(revealData);
console.log(fetchedAssets);

let string2 = JSON.stringify(fetchedAssets);
let hash2 = crypto.createHash('sha256').update(string2).digest();
assert(hash == hash2);
```

## Conclusion
Congratulations! You just completed Part 2 of our guide and successfully Revealed and Validated the assets of our Core Candy Machine with Hidden Settingd.

Let's revise all that we did:
- We fetched the collection assets and updated their metadata with the prepared reveal data.
- We confirmed that the reveal process was successful by hashing the metadata (name and URI) of the revealed assets and comparing it to the expected hash.
