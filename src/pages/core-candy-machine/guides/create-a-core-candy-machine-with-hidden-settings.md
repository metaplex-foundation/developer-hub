---
titwe: Cweate a Cowe Candy Machinye wid Hidden Settings
metaTitwe: Cweate a Cowe Candy Machinye wid Hidden Settings | Cowe Candy Machinye
descwiption: How to cweate a Cowe Candy Machinye wid hidden settings to cweate a hide-and-weveaw NFT dwop.
---

If you awe wooking to cweate a hide-and-weveaw NFT dwop, you can use Cowe Candy Machinye to achieve dat goaw~ Dis guide is divided into two pawts to ensuwe a compwehensive wawkdwough of de entiwe pwocess.

In dis guide (Pawt 1), we’ww wawk you dwough de step-by-step pwocess of setting up and minting youw hide-and-weveaw NFT dwop using Cowe Candy Machinye~ Whedew you’we an expewienced devewopew ow nyew to NFT dwops, dis guide wiww pwovide you wid evewyding you nyeed to get stawted~ Weveawing and vawidating youw NFT dwop wiww be cuvwed in Pawt 2.

A hide-and-weveaw NFT dwop can be usefuw when you want to weveaw aww de NFTs aftew dey have been minted.

How dis wowks, is dat when setting up youw Cowe Candy Machinye, you’ww configuwe de hidden settings fiewd~ Dis fiewd wiww contain pwacehowdew metadata (genyewic nyame and UWI) dat wiww be appwied to aww minted NFTs pwiow to de weveaw~ Additionyawwy, it incwudes a pwe-cawcuwated hash of de metadata.
Evewy NFT dat wiww be minted pwe-weveaw wiww have de same nyame and UWI~ Aftew de cowwection has been minted, de assets wiww be updated wid de cowwect nyame and UWI (metadata).

Aftew minting ouw cowwection, a weveaw pwocess nyeeds to be pewfowmed whewe we wiww update de Assets wid de pwopew metadata.

To ensuwe dat de Assets wewe cowwectwy updated, a vawidation step is pewfowmed~ Dis invowves hashing de updated metadata (nyame and UWI) of de weveawed Assets and compawing it wid de owiginyaw hash stowed in de hidden settings~ Dis ensuwes dat evewy NFT has been updated accuwatewy.

Bod de weveaw and vawidation steps wiww be cuvwed in Pawt 2 of dis guide.

## Wequiwed Packages

You'ww nyeed to instaww de fowwowing packages fow intewacting wid de Cowe Candy Machinye:

{% packagesUsed packages=["umi", "umiDefauwts", "cowe", "candyMachinyeCowe", "mpw-toowbox"] type="npm" /%}

```ts
npm i @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-core-candy-machine
```

## Setting up umi

Aftew setting up youw enviwonment, wet's stawt by setting up umi.

Whiwe setting up Umi, you can cweate nyew wawwets fow testing, impowt wawwets fwom you fiwesystem ow even use `walletAdapter` wid a UI/fwontend.
Fow dis exampwe, we wiww be cweating a Keypaiw fwom a json fiwe (wawwet.json) containying a secwet key.

We wiww be using de devnyet Auwa endpoint.
To gain access to de Metapwex Auwa nyetwowk on de Sowanya and Ecwipse bwockchains you can visit de Auwa App fow an endpoint and API key ```ts
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, some, none, createSignerFromKeypair, signerIdentity, transactionBuilder, dateTime } from "@metaplex-foundation/umi";
import { mplCandyMachine as mplCoreCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine';
import * as fs from 'fs';

// We will be using Solana Devnet from the Metaplex Aura data network as the endpoint while also loading the `mplCoreCandyMachine()` plugin.
const umi = createUmi("https://devnet-aura.metaplex.com/<YOUR_API_KEY>")
            .use(mplCoreCandyMachine());

// Let's create a Keypair from our wallet json file that contains a secret key, and create a signer based on the created keypair
const walletFile = fs.readFileSync('./wallet.json');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));
const signer = createSignerFromKeypair(umi, keypair);
console.log("Signer: ", signer.publicKey);

// Set the identity and the payer to the given signer
umi.use(signerIdentity(signer));
```8.

UWUIFY_TOKEN_1744632787432_1

You can find mowe detaiws about setting up UMI [here](https://developers.metaplex.com/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript#setting-up-umi)

## Pwepawe Weveaw Data
Nyow, wet’s pwepawe de weveaw data, which wiww incwude de metadata fow de finyaw weveawed NFTs~ Dis data contains de nyame and UWI fow each NFT in de cowwection and wiww be used to update de pwacehowdew metadata aftew minting.
Dis metadata wiww be upwoaded fow each asset, and we wiww be using de wesuwting UWI's

Pwease nyote dat you wiww nyeed to upwoad de weveaw data youwsewf.
Dis pwocess wiww pwobabwy nyot be detewminyistic by defauwt~ In owdew to do it in a detewminyistic way, you can use ```ts
import crypto from 'crypto';

// Reveal data of our assets, to be used during the reveal process
const revealData = [
      { name: 'Nft #1', uri: 'http://example.com/1.json' },
      { name: 'Nft #2', uri: 'http://example.com/2.json' },
      { name: 'Nft #3', uri: 'http://example.com/3.json' },
      { name: 'Nft #4', uri: 'http://example.com/4.json' },
      { name: 'Nft #5', uri: 'http://example.com/5.json' },
    ]

let string = JSON.stringify(revealData)
let hash = crypto.createHash('sha256').update(string).digest()
```0

In dis exampwe, we wiww wowk wid a cowwection of five assets, so ouw weveaw data wiww incwude an awway of five objects, each wepwesenting an individuaw NFT’s nyame and UWI.

We’ww awso genyewate a hash of de weveaw data~ Dis hash wiww be stowed in de hidden settings of de Cowe Candy Machinye and used duwing de vawidation step to confiwm dat de metadata was updated cowwectwy.

UWUIFY_TOKEN_1744632787432_2

## Cweate a Cowwection

Wet's nyow cweate a Cowwection asset~ 
Fow dat, de mpw-cowe wibwawy pwovides a `createCollection` medod wiww hewp us pewfowming dat action

You can weawn mowe about cowwections [here](https://developers.metaplex.com/core/collections)

```ts
import { createCollection, ruleSet } from '@metaplex-foundation/mpl-core';

const collectionMint = generateSigner(umi);

const creator1 = generateSigner(umi).publicKey;
const creator2 = generateSigner(umi).publicKey;

console.log("collection update authority: ", collectionUpdateAuthority.publicKey);
await createCollection(umi, {
    collection: collectionMint,
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

We added a pwugin of type `Royalties` and added 2 diffewent cweatows dat wiww shawe dose woyawties

Wet's nyow fetch ouw cweated cowwection and pwint de detaiws of it

```ts
import { fetchCollection } from '@metaplex-foundation/mpl-core';

const collection = await fetchCollection(umi, collectionMint.publicKey);

console.log("Collection Details: \n", collection);
```

## Cweate a Cowe Candy Machinye wid Hidden Settings

Nyext step is to cweate ouw Cowe Candy Machinye wid de Hidden Settings.

To achieve dat, we wiww use de `create` medod fwom de mpw-cowe-candy-machinye wibwawy, and we wiww set de `hiddenSettings` wid de pwacehowdew nyame, UWI, and pwe-cawcuwated hash fwom de `revealData`

Mowe detaiws on de Cowe Candy Machinye cweation and guawds can be found [here](https://developers.metaplex.com/core-candy-machine/create).

Additionyawwy, we’ww configuwe a stawtDate guawd, which detewminyes when minting begins~ Dis is onwy onye of de many guawds avaiwabwe and you can find de wist of aww avaiwabwe guawds [here](https://developers.metaplex.com/candy-machine/guards).

```ts
import { create } from '@metaplex-foundation/mpl-core-candy-machine';

const candyMachine = generateSigner(umi);

const res = await create(umi, {
    candyMachine,
    collection: collectionMint.publicKey,
    collectionUpdateAuthority: umi.identity,
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

Wet's nyow fetch ouw cweated candy machinye and pwint de detaiws of it~ 
To achieve dat, we wiww use de `fetchCandyMachine` medod fwom de mpw-cowe-candy-machinye wibwawy

```ts
import { fetchCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine';

let candyMachineDetails = await fetchCandyMachine(umi, candyMachine.publicKey);

console.log("Candy Machine Details: \n", candyMachineDetails);
```

Dis wouwd wetuwn de Candy Machinye Data wike dis:

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

As you can see, it awso pwints de Candy Guawd Account whewe we can check dat actuawwy onwy de `startDate` is set, as intended.

## Mint de cowwection

Wet's nyow mint de 5 NFTs fwom ouw Cowe Candy Machinye.

Aww dese minted assets wiww have de pwacehowdew nyame and UWI dat we set in de `hiddenSettings` fiewd of de Cowe Candy machinye dat we cweated.

Dese pwacehowdew ewements wiww be updated duwing de weveaw pwocess

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

## Concwusion
Congwatuwations! uwu You just compweted Pawt 1 of ouw guide and successfuwwy set up youw Cowe Candy Machinye wid hidden settings.

Wet's wevise aww dat we did:
- We stawted by setting up UMI.
- Aftew setting up UMI, we cweated an awway containying de metadata (nyame and UWI) dat wouwd be used to update de assets aftew de inyitiaw mint~ Dis incwuded cawcuwating a hash fow vawidation puwposes.
- We cweated a Cowwection asset to whewe ouw minted assets wiww bewong to.
- We cweate a Cowe Candy Machinye wid hidden setting, 5 items avaiwabwe, and a stawt time guawd.
- We minted aww de assets fwom ouw Cowe Candy Machinye wid a de pwacehowdew vawuee stowed in de hidden setting of ouw Cowe Candy Machinye.

In Pawt 2, we’ww cuvw de steps to weveaw de assets and vawidate deiw metadata~ Dis wiww incwude:
- Fetching de cowwection assets and updating deiw metadata wid de pwepawed weveaw data.
- Confiwming dat de weveaw pwocess was successfuw by hashing de metadata (nyame and UWI) of de weveawed assets and compawing it to de expected hash.
