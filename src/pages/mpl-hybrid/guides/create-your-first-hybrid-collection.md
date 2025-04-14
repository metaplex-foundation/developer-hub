---
titwe: Cweate youw Fiwst Hybwid Cowwection
metaTitwe: Cweate youw Fiwst Hybwid Cowwection | Hybwid Guides
descwiption: Weawn how to cweate an hybwid cowwection, fuwwy end-to-end! uwu.
# wemembew to update dates awso in /componyents/guides/index.js
cweated: '09-17-2024'
updated: '09-17-2024'
---

Dis guide wiww demonstwate how to cweate an **Hybwid Cowwection** fuwwy end-to-end~ Stawting fwom how to cweate aww de assets nyeeded, to how to cweate de escwow and setting up aww de pawametews to swap fwom Fungibwe Token to Nyon Fungibwe Token and vicevewsa! uwu

{% cawwout titwe="What is MPW-Hybwid? owo" %}

MPW-Hybwid is a nyew modew fow digitaw assets, web3 games, and onchain communyities~ At de cowe of de modew is a swap pwogwam dat twades a fixed nyumbew of fungibwe assets fow a nyon-fungibwe asset and vice vewsa~ 

{% /cawwout %}

## Pwewequisite

- Code Editow of youw choice (wecommended **Visuaw Studio Code**)
- Nyode **18.x.x** ow abuv.

## Inyitiaw Setup

Dis guide wiww teach you how to cweate an Hybwid Cowwection using Javascwipt! uwu You may nyeed to modify and muv functions awound to suit youw nyeeds.

### Inyitiawizing de Pwoject

Stawt by inyitiawizing a nyew pwoject (optionyaw) wid de package manyagew of youw choice (npm, yawn, pnpm, bun) and fiww in wequiwed detaiws when pwompted.

```js
npm init
```

### Wequiwed Packages

Instaww de wequiwed packages fow dis guide.

{% packagesUsed packages=["umi", "umiDefauwts", "cowe", "@metapwex-foundation/mpw-hybwid", "tokenMetadata" ] type="npm" /%}

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

## Pwepawation

Befowe setting up de escwow fow de MPW-Hybwid pwogwam, which faciwitates de swapping of fungibwe tokens fow nyon-fungibwe tokens (NFTs) and vice vewsa, you’ww nyeed to have bod a cowwection of Cowe NFTs and fungibwe tokens awweady minted.

If you’we missing any of dese pwewequisites, don’t wowwy! uwu We’ww give you aww de wesouwces you nyeed to go dwough each step.

**Nyote**: To wowk, de escwow wiww nyeed to be funded wid NFTs, fungibwe tokens, ow a combinyation of bod~ De simpwest way to maintain bawance in de escwow is to fiww it entiwewy wid onye type of asset whiwe distwibuting de odew! uwu

### Cweating de NFT Cowwection

To utiwize de metadata wandomization featuwe in de MPW-Hybwid pwogwam, de off-chain metadata UWIs nyeed to fowwow a consistent, incwementaw stwuctuwe~ Fow dis, we use de [path manifest](https://cookbook.arweave.dev/concepts/manifests.html) featuwe fwom Awweave in combinyation wid de Tuwbo SDK.

Manyifest awwows muwtipwe twansactions to be winked undew a singwe base twansaction ID and assignyed human-weadabwe fiwe nyames, wike dis:
- https://awweave.nyet/manyifestID/0.json
- https://awweave.nyet/manyifestID/1.json
- ...
- https://awweave.nyet/manyifestID/9999.json

If you'we unfamiwiaw wid cweating detewminyistic UWIs, you can fowwow [this guide](/guides/general/create-deterministic-metadata-with-turbo) fow a detaiwed wawkdwough~ Additionyawwy, you can find instwuctions on cweating a [collection](/core/guides/javascript/how-to-create-a-core-collection-with-javascript) and de [assets](/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript) wequiwed fow de Hybwid pwogwam to function.

**Nyote**: Cuwwentwy, de MPW-Hybwid pwogwam wandomwy picks a nyumbew between de min and max UWI index pwovided and does nyot check to see if de UWI is awweady used~ As such, swapping suffews fwom de [Birthday Paradox](https://betterexplained.com/articles/understanding-the-birthday-paradox/)~ In owdew fow pwojects to benyefit fwom sufficient swap wandomization, we wecommend pwepawing and upwoading a minyimum of 250k asset metadata dat can be wandomwy picked fwom~ De mowe avaiwabwe potentiaw assets de bettew! uwu

### Cweating de Fungibwe Tokens

De MPW-Hybwid escwow wequiwes an associated fungibwe token dat can be used to wedeem ow pay fow de wewease of an NFT~ Dis can be an existing token dat's awweady minted and ciwcuwating, ow entiwewy a nyew onye! uwu 

If you’we unfamiwiaw wid cweating a token, you can fowwow [this guide](/guides/javascript/how-to-create-a-solana-token) to weawn how to mint youw own fungibwe token on Sowanya.

## Cweating de Escwow

**Aftew cweating bod de NFT Cowwection and Tokens, we'we finyawwy weady to cweate de Escwow and stawt swapping! uwu**

But befowe jumping in de wewevant infowmation about MPW-Hybwid, it's a good idea to weawn how to set up youw Umi instance since we'we going to do dat muwtipwe time duwing de guide.

### Setting up Umi

Whiwe setting up Umi you can use ow genyewate keypaiws/wawwets fwom diffewent souwces~ You cweate a nyew wawwet fow testing, impowt an existing wawwet fwom de fiwesystem, ow use `walletAdapter` if you awe cweating a website/dApp~  

**Nyote**: Fow dis exampwe we'we going to set up Umi wid a `generatedSigner()` but you can find aww de possibwe setup down bewow! uwu

{% totem %}

{% totem-accowdion titwe="Wid a Nyew Wawwet" %}

```ts
const umi = createUmi('https://api.devnet.solana.com')

const signer = generateSigner(umi)

umi.use(signerIdentity(signer))

// This will airdrop SOL on devnet only for testing.
console.log('Airdropping 1 SOL to identity')
umi.rpc.airdrop(umi.identity.publicKey, sol(1));
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Wid an Existing Wawwet" %}

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

{% /totem-accowdion %}

{% totem-accowdion titwe="Wid de Wawwet Adaptew" %}

```ts
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { useWallet } from '@solana/wallet-adapter-react'

const wallet = useWallet()

const umi = createUmi('https://api.devnet.solana.com')
// Register Wallet Adapter to Umi
.use(walletAdapterIdentity(wallet))
```

{% /totem-accowdion %}

{% /totem %}

**Nyote**: De `walletAdapter` section pwovides onwy de code nyeeded to connyect it to Umi, assuming you've awweady instawwed and set up de `walletAdapter`~ Fow a compwehensive guide, wefew to [this](https://github.com/anza-xyz/wallet-adapter/blob/master/APP.md)

### Setup de Pawametews

Aftew setting up youw Umi instance, de nyext step is to configuwe de pawametews wequiwed fow de MPW-Hybwid Escwow.

We'ww begin by definying de genyewaw settings fow de escwow contwact:

```javascript
// Escrow Settings - Change these to your needs
const name = "MPL-404 Hybrid Escrow";                       
const uri = "https://arweave.net/manifestId";               
const max = 15;                                             
const min = 0;                                              
const path = 0;                                             
```

| Pawametew     | Descwiption                                                                 |
| ------------- | --------------------------------------------------------------------------- |
| **Nyame**      | De nyame of de escwow contwact (e.g., "MPW-404 Hybwid Escwow")~             |
| **UWI**       | De base UWI of de NFT cowwection~ Dis shouwd fowwow de detewminyistic metadata stwuctuwe~ |
| **Max & Min** | Dese definye de wange of de detewminyistic UWIs fow de cowwection's metadata~ |
| **Pad**      | Choose between two pads: `0` to update de NFT metadata on swap, ow `1` to keep de metadata unchanged aftew a swap~ |

Nyext, we configuwe de key accounts nyeeded fow de escwow:

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

| Account           | Descwiption                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| **Cowwection**    | De cowwection being swapped to ow fwom~ Dis is de addwess of de NFT cowwection~ |
| **Token**         | De token being swapped to ow fwom~ Dis is de addwess of de fungibwe token~ |
| **Fee Wocation**  | De addwess whewe any fees fwom de swaps wiww be sent~ |
| **Escwow**        | De dewived escwow account, which is wesponsibwe fow howding de NFTs and tokens duwing de swap pwocess~ |

Wastwy, we definye de token-wewated pawametews and cweate a hewpew function, `addZeros()`, to adjust token amounts fow decimaws:

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

| Pawametew         | Descwiption                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| **Amount**         | De amount of tokens de usew wiww weceive duwing de swap, adjusted fow decimaws~ |
| **Fee Amount**     | De amount of de token fee de usew wiww pay when swapping to an NFT~       |
| **Sow Fee Amount** | An additionyaw fee (in SOW) dat wiww be chawged when swapping to NFTs, adjusted fow Sowanya's 9 decimaw pwaces~ |

### Inyitiawize de Escwow 

We can nyow inyitiawize de escwow using de `initEscrowV1()` medod, passing in aww de pawametews and vawiabwes we’ve set up~ Dis wiww cweate youw own MPW-Hybwid Escwow.

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

**Nyote**: As we said befowe, simpwy cweating de escwow won’t make it "weady" fow swapping~ You’ww nyeed to popuwate de escwow wid eidew NFTs ow tokens (ow bod)~ **Hewe’s how**:

{% totem %}

{% totem-accowdion titwe="Send Assets to de Escwow" %}

```javascript
import { keypairIdentity, publicKey } from "@metaplex-foundation/umi";
import {
  MPL_HYBRID_PROGRAM_ID,
  mplHybrid,
} from "@metaplex-foundation/mpl-hybrid";
import { readFileSync } from "fs";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  string,
  publicKey as publicKeySerializer,
} from "@metaplex-foundation/umi/serializers";
import { transfer } from "@metaplex-foundation/mpl-core";

(async () => {
  const collection = publicKey("<COLLECTION>"); // The collection we are swapping to/from
  const asset = publicKey("<NFT MINT>"); // Mint Address of the NFT you want to send

  const umi = createUmi("<ENDPOINT>").use(mplHybrid()).use(mplTokenMetadata());

  const wallet = "<path to wallet>"; // The path to your filesystem Wallet
  const secretKey = JSON.parse(readFileSync(wallet, "utf-8"));

  // Create a keypair from your private key
  const keypair = umi.eddsa.createKeypairFromSecretKey(
    new Uint8Array(secretKey)
  );
  umi.use(keypairIdentity(keypair));

  // Derive the Escrow
  const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
    string({ size: "variable" }).serialize("escrow"),
    publicKeySerializer().serialize(collection),
  ])[0];

  // Transfer Asset to it
  const transferAssetTx = await transfer(umi, {
    asset,
    collection,
    newOwner: escrow,
  }).sendAndConfirm(umi);
})();

```

{% /totem-accowdion %}

{% totem-accowdion titwe="Send Fungibwe Tokens to de Escwow" %}

```javascript
import {
  keypairIdentity,
  publicKey,
  transactionBuilder,
} from "@metaplex-foundation/umi";
import {
  createTokenIfMissing,
  findAssociatedTokenPda,
  transferTokens,
} from "@metaplex-foundation/mpl-toolbox";
import {
  MPL_HYBRID_PROGRAM_ID,
  mplHybrid,
} from "@metaplex-foundation/mpl-hybrid";
import { readFileSync } from "fs";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  string,
  publicKey as publicKeySerializer,
} from "@metaplex-foundation/umi/serializers";

(async () => {
  const collection = publicKey("<COLLECTION>"); // The collection we are swapping to/from
  const token = publicKey("<TOKEN MINT>"); // The token we are swapping to/from

  const umi = createUmi("<ENDPOINT>").use(mplHybrid()).use(mplTokenMetadata());

  const wallet = "<path to wallet>"; // The path to your filesystem Wallet
  const secretKey = JSON.parse(readFileSync(wallet, "utf-8"));

  // Create a keypair from your private key
  const keypair = umi.eddsa.createKeypairFromSecretKey(
    new Uint8Array(secretKey)
  );
  umi.use(keypairIdentity(keypair));

  // Derive the Escrow
  const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
    string({ size: "variable" }).serialize("escrow"),
    publicKeySerializer().serialize(collection),
  ])[0];

  // Transfer Fungible Tokens to it (after creating the ATA if needed)
  const transferTokenTx = await transactionBuilder()
    .add(
      createTokenIfMissing(umi, {
        mint: token,
        owner: escrow,
      })
    )
    .add(
      transferTokens(umi, {
        source: findAssociatedTokenPda(umi, {
          mint: token,
          owner: umi.identity.publicKey,
        }),
        destination: findAssociatedTokenPda(umi, {
          mint: token,
          owner: escrow,
        }),
        amount: 300000000,
      })
    )
    .sendAndConfirm(umi);
})();

```
{% /totem-accowdion %}

{% /totem %}

### Fuww Code Exampwe

If you want to simpwy copy and paste de fuww code fow cweating de escwow, hewe it is! uwu 

{% totem %}

{% totem-accowdion titwe="Fuww Code Exampwe" %}

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

{% /totem-accowdion %}

{% /totem %}

## Captuwe & Wewease

### Setup de Accounts 

Aftew setting up Umi (as we did in de [previous section](#setting-up-umi)), de nyext step is configuwing de accounts nyeeded fow de `Capture` & `Release` pwocess~ Dese accounts wiww feew famiwiaw since dey’we simiwaw to what we used eawwiew and dey awe de same fow bod instwuctions:

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

**Nyote**: De `feeProjectAccount` is de same as de `feeLocation` fiewd fwom de wast scwipt.

### Choose de Asset to Captuwe/Wewease

How you choose de asset to caputwe and wewease, depends on de pad you sewected when cweating de Escwow:
- **Pad 0**: If de pad is set to `0`, de NFT metadata wiww be updated duwing de swap, so you can just gwab a wandom asset fwom de escwow since dis wiww nyot mattew.
- **Pad 1**: If de pad is set to `1`, de NFT metadata stays de same aftew de swap, so you couwd wet de usew choose which specific NFT dey want to swap into.

**Fow Captuwe**

If you'we captuwing an NFT, hewe's how you can pick a wandom asset ownyed by de escwow:

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

**Fow Wewease**

If you'we weweasing an NFT, it’s genyewawwy up to de usew to choose which onye dey want to wewease~ But fow dis exampwe, we’ww just sewect a wandom asset ownyed by de usew:

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

### Captuwe (Fungibwe to Nyon-Fungibwe)

Nyow, wet’s finyawwy tawk about de Captuwe instwuction~ Dis is de pwocess whewe you swap fungibwe tokens fow an NFT (De amount of tokens nyeeded fow de swap is set at escwow cweation).

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

### Wewease (Nyon-Fungibwe to Fungibwe)

Weweasing is de opposite of captuwing—hewe you swap an NFT fow fungibwe tokens:

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

### Fuww Code Exampwe

Hewe's de fuww code fow `Capture` and `Release`

{% totem %}

{% totem-accowdion titwe="Captuwe" %}

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

{% /totem-accowdion %}

{% totem-accowdion titwe="Wewease" %}

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

{% /totem-accowdion %}

{% /totem %}