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

For a full website implementation, including UI elements and wallet integration, you may want to start with a template like the [`metaplex-nextjs-tailwind-template`](https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-template). This template includes many setup steps for components like the Wallet Adapter.

If you're looking for guidance on general web development practices or how to use specific frameworks, tools like Visual Studio Code offer extensive documentation and community resources.

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

It can also make sense to fetch additional data that is not shown to the user but used in background calculations. For example, when using the [Redeemed Amount](/core-candy-machine/guards/redeemed-amount) Guard, you would want to fetch the already redeemed amount to see if the user is allowed to mint more.

### Prepare Reveal Data
Let's now prepare the reveal data, that will contain the metadata that will be updated to the NFT upon reveal.  

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

Here, we just created an array with 5 different attributes that will be updated into our revealed NFTs

### Create a collection

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

Let's now fetch our created collection and print the details of it

```ts
import { fetchCollection } from '@metaplex-foundation/mpl-core';

const collection = await fetchCollection(umi, collectionMint.publicKey);

console.log("Collection Details: \n", collection);
```

### Create a Core Candy Machine with Hidden Settings

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
        startDate: some({ date: dateTime('2023-04-04T16:00:00Z') }),
    }
});
let tx = await res.sendAndConfirm(umi);
```

Let's now fetch our created candy machine and print the details of it

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
Candy Guard Account: 
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

Let's now reveal the collection

```ts
import { fetchAssetsByCollection } from '@metaplex-foundation/mpl-core';

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
