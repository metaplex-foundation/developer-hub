---
title: Create a Core Candy Machine with Hidden Settings
metaTitle: Create a Core Candy Machine with Hidden Settings | Core Candy Machine
description: How to create a Core Candy Machine with hidden settings to create a hide-and-reveal NFT drop.
---

If you are looking to create a hide-and-reveal NFT drop, you can use Core Candy Machine to achieve that goal.
A hide-and-reveal NFT drop can be useful when you want to reveal all the NFTs after they have been minted.

How this works, is that you Core Candy Machine will have a hidden settings field, that will contain a hash of the metadata of the revealed NFTs
Every NFT that will be minted pre-reveal will have the same name and URI. After the collection has been minted, the assets will be updated with the correct name and URI

This guide focuses on the core Candy Machine functionality and interactions, rather than providing a complete website implementation. It will not cover aspects like adding buttons to a website or integrating with a wallet adapter. Instead, it provides essential information on working with the Core Candy Machine.


## Prerequisites

- Basic familiarity with web development and your chosen framework. We recommend Next JS for easiest compatibility to umi.

## Required Packages

Regardless of your chosen template or implementation, you'll need to install the following packages for interacting with the Core Candy Machine:

{% packagesUsed packages=["umi", "umiDefaults", "core", "candyMachineCore", "mpl-toolbox"] type="npm" /%}

```ts
npm i @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-core-candy-machine
```

## Setting up umi

After setting up your environment, let's start by setting up umi:

```ts
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, some, none, createSignerFromKeypair, signerIdentity, transactionBuilder, dateTime } from "@metaplex-foundation/umi";
import { mplCandyMachine as mplCoreCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine';
import wallet from "../wallet.json";

const umi = createUmi("https://api.devnet.solana.com")
            .use(mplCoreCandyMachine());

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
console.log("Signer: ", signer.publicKey);

umi.use(signerIdentity(signer));
```

### Prepare Reveal Data
Let's now prepare the reveal data. This will basically contain the name and the URI, that will be used to update our collection assets once they are minted.  

```ts
import crypto from 'crypto';

const revealData = [
      { name: 'Nft #1', uri: 'http://example.com/1.json' },
      { name: 'Nft #2', uri: 'http://example.com/2.json' },
      { name: 'Nft #3', uri: 'http://example.com/3.json' },
      { name: 'Nft #4', uri: 'http://example.com/4.json' },
      { name: 'Nft #5', uri: 'http://example.com/5.json' },
    ]

let string = JSON.stringify(revealData)
let hash = crypto.createHash('sha256').update(string).digest()
```

Here, we just created an array with 5 different elements since our Core Candy Machine will have 5 assets available.

We also created an hash of all the elements, that will be used to configure our Core Candy Machine.

### Create a Collection

Let's now create a Collection asset. For that, the mpl-core library provides a `createCollection` method will help us performing that action

```ts
import { createCollection, ruleSet } from '@metaplex-foundation/mpl-core';

const collectionMint = generateSigner(umi);
const collectionUpdateAuthority = generateSigner(umi);

const creator1 = generateSigner(umi).publicKey;
const creator2 = generateSigner(umi).publicKey;

console.log("collection update authority: ", collectionUpdateAuthority.publicKey);
await createCollection(umi, {
    collection: collectionMint,
    updateAuthority: collectionUpdateAuthority.publicKey,
    name: 'My NFT',
    uri: 'https://example.com/my-nft.json',
    plugins: [
        {
            type: 'Royalties',
            basisPoints: 500,
            creators: [
            {
                address: creator1,
                percentage: 20,
            },
            {
                address: creator2,
                percentage: 80,
            },
        ],
        ruleSet: ruleSet('None'),
        },
    ],
}).sendAndConfirm(umi)
```

We added a plugin of type `Royalties` and added 2 different creators that will share those royalties

Let's now fetch our created collection and print the details of it

```ts
import { fetchCollection } from '@metaplex-foundation/mpl-core';

const collection = await fetchCollection(umi, collectionMint.publicKey);

console.log("Collection Details: \n", collection);
```

### Create a Core Candy Machine with Hidden Settings

Next step is to create our Core Candy Machine with the Hidden Settings.

To achieve that, we will use the `create` method from the mpl-core-candy-machine library, and we will set the `hiddenSettings` with the name and URI that all the assets will be minted with. We also pass the hash that was previously calculated from the `revealData`

We will also add a `startDate` guard. You can find the list of all available guards here.

```ts
import { create } from '@metaplex-foundation/mpl-core-candy-machine';

const candyMachine = generateSigner(umi);

const res = await create(umi, {
    candyMachine,
    collection: collectionMint.publicKey,
    collectionUpdateAuthority: collectionUpdateAuthority,
    authority: umi.identity.publicKey,
    itemsAvailable: 5,
    configLineSettings: none(),
    hiddenSettings: some({
        name: 'My Hidden NFT Project',
        uri: 'https://example.com/path/to/teaser.json',
        hash: hash,
    }),
    guards: {
        startDate: some({ date: dateTime('2024-01-01T16:00:00Z') }),
    }
});
let tx = await res.sendAndConfirm(umi);
```

Let's now fetch our created candy machine and print the details of it. To achieve that, we will use the `fetchCandyMachine` method from the mpl-core-candy-machine library

```ts
import { fetchCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine';

let candyMachineDetails = await fetchCandyMachine(umi, candyMachine.publicKey);

console.log("Candy Machine Details: \n", candyMachineDetails);
```

This would return the Candy Machine Data like this:

```json
{
  "publicKey": "FVQYpQxtT4ZqCmq3MNiWY1mZcEJsVA6DaaW6bMhERoVY",
  "header": {
    "executable": false,
    "owner": "CMACYFENjoBMHzapRXyo1JZkVS6EtaDDzkjMrmQLvr4J",
    "lamports": { "basisPoints": 5428800, "identifier": "SOL", "decimals": 9 },
    "rentEpoch": 18446744073709551616,
    "exists": true
  },
  "discriminator": [
    51, 173, 177, 113,
    25, 241, 109, 189
  ],
  "authority": "Cce2qGViiD1SqAiJMDJVJQrGfxcb3DMyLgyhaqYB8uZr",
  "mintAuthority": "4P6VhHmNi9Qt5eRuQsE9SaE5bYWoLxpdPwmfNZeiU2mv",
  "collectionMint": "3RLCk7G2ckGHt7XPNfzUYKLriME2BmMoumF8N4H5LvsS",
  "itemsRedeemed": 0,
  "data": {
    "itemsAvailable": 5,
    "maxEditionSupply": 0,
    "isMutable": true,
    "configLineSettings": { "__option": "None" },
    "hiddenSettings": { "__option": "Some", "value": "[Object]" }
  },
  "items": [],
  "itemsLoaded": 0
}
"Candy Guard Account": 
 {
  "publicKey": "4P6VhHmNi9Qt5eRuQsE9SaE5bYWoLxpdPwmfNZeiU2mv",
  "header": {
    "executable": false,
    "owner": "CMAGAKJ67e9hRZgfC5SFTbZH8MgEmtqazKXjmkaJjWTJ",
    "lamports": { "basisPoints": 1538160, "identifier": "SOL", "decimals": 9 },
    "rentEpoch": 18446744073709551616,
    "exists": true
  },
  "discriminator": [
     44, 207, 199, 184,
    112, 103,  34, 181
  ],
  "base": "FVQYpQxtT4ZqCmq3MNiWY1mZcEJsVA6DaaW6bMhERoVY",
  "bump": 251,
  "authority": "Cce2qGViiD1SqAiJMDJVJQrGfxcb3DMyLgyhaqYB8uZr",
  "guards": {
    "botTax": { "__option": "None" },
    "solPayment": { "__option": "None" },
    "tokenPayment": { "__option": "None" },
    "startDate": { "__option": "Some", "value": "[Object]" },
    "thirdPartySigner": { "__option": "None" },
    "tokenGate": { "__option": "None" },
    "gatekeeper": { "__option": "None" },
    "endDate": { "__option": "None" },
    "allowList": { "__option": "None" },
    "mintLimit": { "__option": "None" },
    "nftPayment": { "__option": "None" },
    "redeemedAmount": { "__option": "None" },
    "addressGate": { "__option": "None" },
    "nftGate": { "__option": "None" },
    "nftBurn": { "__option": "None" },
    "tokenBurn": { "__option": "None" },
    "freezeSolPayment": { "__option": "None" },
    "freezeTokenPayment": { "__option": "None" },
    "programGate": { "__option": "None" },
    "allocation": { "__option": "None" },
    "token2022Payment": { "__option": "None" },
    "solFixedFee": { "__option": "None" },
    "nftMintLimit": { "__option": "None" },
    "edition": { "__option": "None" },
    "assetPayment": { "__option": "None" },
    "assetBurn": { "__option": "None" },
    "assetMintLimit": { "__option": "None" },
    "assetBurnMulti": { "__option": "None" },
    "assetPaymentMulti": { "__option": "None" },
    "assetGate": { "__option": "None" },
    "vanityMint": { "__option": "None" },
  },
  "groups": []
}
```

As you can see, it also prints the Candy Guard Account where we can check that actually only the `startDate` is set, as intended.

### Mint the collection

Let's now mint the 5 NFTs from our Core Candy Machine

```ts
import { mintV1 } from '@metaplex-foundation/mpl-core-candy-machine';

const nftMint = [
    generateSigner(umi),
    generateSigner(umi),
    generateSigner(umi),
    generateSigner(umi),
    generateSigner(umi),
];

for(let i = 0; i < nftMint.length; i++) {
    let mintNFT = await transactionBuilder()
    .add(setComputeUnitLimit(umi, { units: 800_000 }))
    .add(
        mintV1(umi, {
            candyMachine: candyMachine.publicKey,
            asset: nftMint[i],
            collection: collectionMint.publicKey,
        })
    ).sendAndConfirm(umi);

    console.log("NFT minted!");
};
```

### Reveal the Collection

Let's now reveal the collection.

To reveal the collection, we will fetch the collection assets using the `fetchAssetsByCollection` method and will update those assets by invoking the method `update` with the `revealData` that we prepared in the beggining of this guide.

As we only want to reveal our assets after all items have been minted, we will fetch the Core Candy Machine details and make sure that the items available are the same as the items redeemed. This unsures us that all assets have been minted

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

### Confirm the hidden settings

Now that the we revealed our assets, it is time to confirm that the assets are indeed the intended ones.

For that, we will again fetch the assets of our collections, but this time we will save the name and the URI of every single one of them.

After that, we will log both arrays (`revealData` and `fetchedAssets`) and will also hash the `fetchedAssets` data and compare to the initial hash

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

### And that is it
Congrats! You just created your Core Candy Machine with hiddens settings.

Let's revise all that we did:
- We started by setting up UMI
- After setting up UMI, we create an array with the data that will be used to update our assets after the initial mint
- We created a Collection asset to where our minted assets will beling to
- We create a Core Candy Machine with hidden setting, 5 items available, and a start time guard
- We minted all the assets from out Core Candy Machine
- We fetched all the assets of our collection and updated those assets with our reveal data
- We confirmed that the reveal of our collection was correct