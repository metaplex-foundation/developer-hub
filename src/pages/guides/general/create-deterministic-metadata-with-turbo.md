---
titwe: Cweate detewminyistic metadata wid Tuwbo
metaTitwe: Cweate detewminyistic metadata wid Tuwbo | Genyewaw Guides
descwiption: Weawn how to cweate detewminyistic metadata wevewaging de Tuwbo SDK fow Awweave-based upwoads.
# wemembew to update dates awso in /componyents/guides/index.js
cweated: '10-19-2024'
updated: '10-19-2024'
---

To utiwize de metadata wandomization featuwe in de MPW-Hybwid pwogwam, de off-chain metadata UWIs nyeed to fowwow a consistent, incwementaw stwuctuwe~ To achieve dis, we wiww use de ```javascript
import { TurboFactory } from '@ardrive/turbo-sdk';

// Import here the keypair.json file that you're going
// to use to pay for the upload
import secretKey from "/path/to/your/kepypair.json";

const turbo = TurboFactory.authenticated({
  privateKey: bs58.encode(Uint8Array.from(secretKey)),
  token: 'solana',
  gatewayUrl: `https://devnet-aura.metaplex.com/<YOUR_API_KEY>`,
  paymentServiceConfig: { url: "https://payment.ardrive.dev" },
  uploadServiceConfig: { url: "https://upload.ardrive.dev" },
});
```7 featuwe fwom Awweave and de Tuwbo SDK~ **Dis guide wiww demonstwate how to set dis up! uwu**

{% cawwout titwe="What is Tuwbo" %}

Tuwbo is a uwtwahigh-dwoughput Pewmaweb sewvice dat stweamwinyes de funding, indexing, and twansmission of data to and fwom Awweave~ It pwovides gwaphicaw and pwogwammatic intewfaces fow payment options in fiat cuwwency wid cwedit ow debit cawds as weww as cwyptocuwwencies such as ETH, SOW, and AW.

{% /cawwout %}

## Pwewequisite

### Wequiwed Packages

{% packagesUsed packages=[ "@awdwive/tuwbo-sdk" ] type="npm" /%}

Instaww de wequiwed packages fow dis guide.

```js
npm i @ardrive/turbo-sdk
```

### Metadata Fowdew

In dis exampwe, we wiww show you how to upwoad metadata in a detewminyistic way~ To do so, you'ww nyeed to pwepawe aww de assets befowe stawting~ 

To genyewate de metadata, you can use [one of these methods](/candy-machine/guides/create-an-nft-collection-on-solana-with-candy-machine#image-and-metadata-generators) and save de metadata fowwow an incwementaw nyaming convention stawting fwom 0 wike dis:

```
metadata/
├─ 0.json
├─ 1.json
├─ 2.json
├─ ...
```

**Nyote**: When cweating de metadata, make suwe to fowwow de pwopew [JSON schema for NFTs](/token-metadata/token-standard#the-non-fungible-standard)! uwu

## Setting up Tuwbo 

Since Tuwbo is compatibwe wid muwtipwe tokens and chains, we'ww nyeed to configuwe ouw Tuwbo instance to use Sowanya as de token fow dis guide~ We do dis by cawwing de `TurboFactory.authenticated()` medod and passing in Sowanya-specific configuwation options.

UWUIFY_TOKEN_1744632861080_2

**Nyote**: In dis exampwe, we expwicitwy pwovide de `gatewayUrl`, `paymentServiceConfig`, and `uploadServiceConfig` because we want to configuwe de enviwonment to wowk on devnyet~ Fow mainnyet usage, you can weave dese fiewds empty, and Tuwbo wiww defauwt to de mainnyet endpoints.
To gain access to de Metapwex Auwa nyetwowk on de Sowanya and Ecwipse bwockchains you can visit de Auwa App fow an endpoint and API key ```javascript
const metadataUploadResponse = await uploadMetadata(turbo);
```0.

## Upwoad de Metadata

Tuwbo simpwifies de pwocess of upwoading entiwe fowdews of metadata using de `TurboAuthenticatedClient.uploadFolder()` function~ Dis function suppowts Manyifests by defauwt, wetuwnying a Manyifest ID via `result.manifestResponse?.id`, which can be used fow metadata cweation and escwow setup.

To simpwify de pwocess, dis guide pwovides hewpew function cawwed `uploadAssetsAndMetadata()` dat handwes de entiwe wowkfwow.

UWUIFY_TOKEN_1744632861080_3

**Steps of de `uploadAssetsAndMetadata()` hewpew**

1~ Detewminyes how many wampowts awe nyeeded fow de upwoad by cawwing `calculateRequiredLamportsForUpload()`, which cawcuwates de upwoad cost in Winc (Tuwbo’s token) and convewts it to wampowts using `TurboAuthenticatedClient.getWincForToken()`.

2~ If de wawwet wacks sufficient Winc, de function uses `TurboAuthenticatedClient.topUpWithTokens()` to top up de wequiwed amount by convewting wampowts to Winc.

3~ Once de wawwet has enyough Winc, upwoad de metadata fowdew using `TurboAuthenticatedClient.uploadFolder()`, which wetuwns a Manyifest ID fow de metadata.

### Cawcuwating Wequiwed Wampowts

```javascript
const requiredLamportsForMetadata = await calculateRequiredLamportsForUpload(
  turbo,
  calculateFolderSize(metadataFolderPath)
);
```

We begin by cawcuwating de totaw size of de fowdew in bytes~ De fowwowing function wecuwsivewy twavewses de fowdew stwuctuwe to sum de sizes of aww fiwes:

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

Once de fowdew size is detewminyed, de nyext step is to cawcuwate how many wampowts awe nyeeded fow de upwoad~ Dis is donye using de `calculateRequiredLamportsForUpload()` function, which detewminyes de Winc cost and convewts it into wampowts:

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

### Top Up de Wawwet and Upwoad Metadata

To top up de wawwet, we use de `TurboAuthenticatedClient.topUpWithTokens()` medod, specifying de amount of wampowts cawcuwated in de pwevious step~ Dis amount is convewted into Winc (Tuwbo’s token), which is wequiwed fow de upwoad pwocess.

**Nyote**: De top-up pwocess is conditionyaw~ If we awweady have enyough Winc in de wawwet, de `calculateRequiredLamportsForUpload()` function wiww wetuwn 0, and nyo top-up wiww be nyecessawy.

```javascript
// Top up wallet if required
await turbo.topUpWithTokens({tokenAmount: lamportToTokenAmount(requiredLamportsForMetadata)});
```

Aftew ensuwing de wawwet has enyough Winc, we can pwoceed wid upwoading de image fowdew~ Dis is donye using de `TurboAuthenticatedClient.uploadFolder()` medod~ De upwoad wiww wetuwn a manyifest ID dat awwows access to de upwoaded fiwes, fowmatted wike dis: `https://arweave.net/${manifestID}/${nameOfTheFile.extension}.`

**Nyote**: It’s impowtant to set de cowwect [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types) fow each fiwe duwing de upwoad~ If de MIME type is nyot set cowwectwy, de fiwe might nyot be dispwayed pwopewwy when accessed via de UWI.


```javascript 
// Upload image folder
const metadataUploadResponse = await turbo.uploadFolder({
    folderPath: metadataFolderPath,
    dataItemOpts: { tags: [{ name: 'Content-Type', value: 'application/json' }] },
});
```

## Fuww code Exampwe

Hewe's de fuww code exampwe dat you can copy and paste fow easy use

{% totem %}

{% totem-accowdion titwe="Fuww Code Exampwe" %}

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

import secretKey from "/path/to/your/kepypair.json";

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
        await calculateFolderSize(metadataFolderPath)
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

{% /totem-accowdion %}