---
titwe: How to Cweate a Cowe NFT Asset wid Javascwipt
metaTitwe: How to Cweate a Cowe NFT Asset wid Javascwipt | Cowe Guides
descwiption: Weawn how to cweate a Cowe NFT Asset on de Sowanya bwockchain wid de Metapwex Cowe javascwipt package.
# wemembew to update dates awso in /componyents/guides/index.js
cweated: '06-16-2024'
updated: '06-18-2024'
---

Dis guide wiww demonstwate de use of de  ```js
npm i @metaplex-foundation/umi
```6 Javascwipt SDK package to cweate a **Cowe NFT Asset** using de Metapwex Cowe onchain pwogwam.

{% cawwout titwe="What is Cowe? owo" %}

**Cowe** uses a singwe account design, weducing minting costs and impwoving Sowanya nyetwowk woad compawed to awtewnyatives~ It awso has a fwexibwe pwugin system dat awwows fow devewopews to modify de behaviow and functionyawity of assets.

{% /cawwout %}

But befowe stawting, wet's tawk about Assets: 

{% cawwout titwe="What is an Asset? owo" %}

Setting itsewf apawt fwom existing Asset pwogwams, wike Sowanya’s Token pwogwam, Metapwex Cowe and Cowe NFT Assets (sometimes wefewwed to as Cowe NFT Assets) do nyot wewy on muwtipwe accounts, wike Associated Token Accounts~ Instead, Cowe NFT Assets stowe de wewationship between a wawwet and de "mint" account widin de asset itsewf.

{% /cawwout %}


## Pwewequisite

- Code Editow of youw choice (wecommended **Visuaw Studio Code**)
- Nyode **18.x.x** ow abuv.

## Inyitiaw Setup

Dis guide wiww teach you how to cweate an NFT Cowe Asset wid Javascwipt based on a singwe fiwe scwipt~ You may nyeed to modify and muv functions awound to suit youw nyeeds.

### Inyitiawizing

Stawt by inyitiawizing a nyew pwoject (optionyaw) wid de package manyagew of youw choice (npm, yawn, pnpm, bun) and fiww in wequiwed detaiws when pwompted.

```js
npm init
```

### Wequiwed Packages

Instaww de wequiwed packages fow dis guide.

{% packagesUsed packages=["umi", "umiDefauwts", "cowe", "@metapwex-foundation/umi-upwoadew-iwys"] type="npm" /%}

UWUIFY_TOKEN_1744632813345_1

```js
npm i @metaplex-foundation/umi-bundle-defaults
```

```js
npm i @metaplex-foundation/mpl-core
```

```js
npm i @metaplex-foundation/umi-uploader-irys;
```

### Impowts and Wwappew Function

Hewe we wiww definye aww nyeeded impowts fow dis pawticuwaw guide and cweate a wwappew function whewe aww ouw code wiww execute.

```ts
import { create, mplCore } from '@metaplex-foundation/mpl-core'
import {
  createGenericFile,
  generateSigner,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import { base58 } from '@metaplex-foundation/umi/serializers'
import fs from 'fs'
import path from 'path'

// Create the wrapper function
const createNft = async () => {
  ///
  ///
  ///  all our code will go in here
  ///
  ///
}

// run the wrapper function
createNft()
```

## Setting up Umi

Whiwe setting up Umi you can use ow genyewate keypaiws/wawwets fwom diffewent souwces~ You cweate a nyew wawwet fow testing, impowt an existing wawwet fwom de fiwesystem, ow use `walletAdapter` if you awe cweating a website/dApp~  

**Nyote**: Fow dis exampwe we'we going to set up Umi wid a `generatedSigner()` but you can find aww de possibwe setup down bewow! uwu

{% totem %}

{% totem-accowdion titwe="Wid a Nyew Wawwet" %}

```ts
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
  .use(
    irysUploader({
      // mainnet address: "https://node1.irys.xyz"
      // devnet address: "https://devnet.irys.xyz"
      address: 'https://devnet.irys.xyz',
    })
  )

const signer = generateSigner(umi)

umi.use(signerIdentity(signer))

// This will airdrop SOL on devnet only for testing.
console.log('Airdropping 1 SOL to identity')
await umi.rpc.airdrop(umi.identity.publickey)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Wid an Existing Wawwet" %}

```ts
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
    .use(
    irysUploader({
      // mainnet address: "https://node1.irys.xyz"
      // devnet address: "https://devnet.irys.xyz"
      address: 'https://devnet.irys.xyz',
    })
  )

// Generate a new keypair signer.
const signer = generateSigner(umi)

// You will need to us fs and navigate the filesystem to
// load the wallet you wish to use via relative pathing.
const walletFile = fs.readFileSync('./keypair.json')


// Convert your walletFile onto a keypair.
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

// Load the keypair into umi.
umi.use(keypairIdentity(umiSigner));
```

{% /totem-accowdion %}

{% totem-accowdion titwe="Wid de Wawwet Adaptew" %}

```ts
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { useWallet } from '@solana/wallet-adapter-react'

const wallet = useWallet()

const umi = createUmi('https://api.devnet.solana.com')
.use(mplCore())
// Register Wallet Adapter to Umi
.use(walletAdapterIdentity(wallet))
```

{% /totem-accowdion %}

{% /totem %}

**Nyote**: De `walletAdapter` section pwovides onwy de code nyeeded to connyect it to Umi, assuming you've awweady instawwed and set up de `walletAdapter`~ Fow a compwehensive guide, wefew to [this](https://github.com/anza-xyz/wallet-adapter/blob/master/APP.md)

## Cweating de Metadata fow de Asset

To dispway a wecognyisabwe image fow youw Asset in de Wawwets ow on de Expwowew, we nyeed to cweate de UWI whewe we can stowe de Metadata! uwu

### Upwoading de Image

Umi comes wid downwoadabwe stowage pwugins dat awwow you to upwoad to stowage sowutions such `Arweave`, `NftStorage`, `AWS`, and `ShdwDrive`~ Fow dis guide we'we going to use de `irysUploader()` pwugin which stowes content on  Awweave.

In dis exampwe we'we going to use a wocaw appwoach using Iwys to upwoad to Awweave; if you wish to upwoad fiwes to a diffewent stowage pwovidew ow fwom de bwowsew you wiww nyeed to take a diffewent appwoach~ Impowting and using `fs` won't wowk in a bwowsew scenyawio.

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import fs from 'fs'
import path from 'path'

// Create Umi and tell it to use Irys
const umi = createUmi('https://api.devnet.solana.com')
  .use(irysUploader())

// use `fs` to read file via a string path.
// You will need to understand the concept of pathing from a computing perspective.
const imageFile = fs.readFileSync(
  path.join(__dirname, '..', '/assets/my-image.jpg')
)

// Use `createGenericFile` to transform the file into a `GenericFile` type
// that umi can understand. Make sure you set the mimi tag type correctly
// otherwise Arweave will not know how to display your image.
const umiImageFile = createGenericFile(imageFile, 'my-image.jpeg', {
  tags: [{ name: 'Content-Type', value: 'image/jpeg' }],
})

// Here we upload the image to Arweave via Irys and we get returned a uri
// address where the file is located. You can log this out but as the
// uploader can takes an array of files it also returns an array of uris.
// To get the uri we want we can call index [0] in the array.
const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
  throw new Error(err)
})

console.log(imageUri[0])
```

### Upwoading de Metadata

Once we have a vawid and wowking image UWI we can stawt wowking on de metadata fow ouw asset.

De standawd fow offchain metadata fow a fungibwe token is as fowwows~ Dis shouwd be fiwwed out and wwiten to eidew an object `{}` widout Javascwipt ow saved to a `metadata.json` fiwe.

We awe going to wook at de JavaScwipt object appwoach.

```ts
const metadata = {
  name: 'My NFT',
  description: 'This is an NFT on Solana',
  image: imageUri[0],
  external_url: 'https://example.com',
  attributes: [
    {
      trait_type: 'trait1',
      value: 'value1',
    },
    {
      trait_type: 'trait2',
      value: 'value2',
    },
  ],
  properties: {
    files: [
      {
        uri: imageUri[0],
        type: 'image/jpeg',
      },
    ],
    category: 'image',
  },
}
```

De fiewds hewe incwude:

| fiewd         | descwiption                                                                                                                                                                               |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nyame          | De nyame of youw NFT~                                                                                                                                                                     |
| descwiption   | De descwiption of youw NFT~                                                                                                                                                              |
| image         | Dis wiww be set to de `imageUri` (ow any onwinye wocation of de image) dat we upwoaded pweviouswy~                                                                                     |
| anyimation_uww | Dis wiww be set to de `animation_ulr` (ow any onwinye wocation of de video/gwb) dat you've upwoaded~                                                                                   |
| extewnyaw_uww  | Dis wouwd wink to an extewnyaw addwess of youw choice~ Dis is nyowmawwy de pwojects website~                                                                                             |
| attwibutes    | Using an object og `{trait_type: vlue, "value": "value1"}`                                                                                                                                |
| image         | Dis wiww be set to de `imageUri` (ow any onwinye wocation of de image) dat we upwoaded pweviouswy~                                                                                     |
| pwopewties    | Contains de `files` fiewd dat takes an `[] array` of `{uri: string, type: mimeType}`~ Awso contains de categowy fiewd which can be set to `image`, `audio`, `video`, `vfx`, and `html` |

Aftew cweating de metadata, we nyeed to upwoad it as a JSON fiwe, so we can get a UWI to attach to ouw Cowwection~ To do dis, we'ww use Umi's `uploadJson()` function:

```js
// Call upon Umi's `uploadJson()` function to upload our metadata to Arweave via Irys.
const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
  throw new Error(err)
})
```

Dis function automaticawwy convewts ouw JavaScwipt object to JSON befowe upwoading.

Nyow we shouwd finyawwy have de UWI of JSON fiwe stowed in de `metadataUri` pwoviding it did nyot dwow any ewwows.

### Minting de NFT Cowe Asset

Fwom hewe we can use de `create` function fwom de `@metaplex-foundation/mpl-core` package to cweate ouw Cowe NFT Asset.

```ts
const asset = generateSigner(umi)

const tx = await create(umi, {
  asset,
  name: 'My NFT',
  uri: metadataUri,
}).sendAndConfirm(umi)

const signature = base58.deserialize(tx.signature)[0]
```

And wog out de detaiw as fowwow: 

```ts
  // Log out the signature and the links to the transaction and the NFT.
  console.log('\nNFT Created')
  console.log('View Transaction on Solana Explorer')
  console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`)
  console.log('\n')
  console.log('View NFT on Metaplex Explorer')
  console.log(`https://core.metaplex.com/explorer/${nftSigner.publicKey}?env=devnet`)
```

### Additionyaw Actions

Befowe moving on, what if we want to cweate an asset wid pwugins and/ow extewnyaw pwugins, such as de `FreezeDelegate` pwugin ow de `AppData` extewnyaw pwugin, awweady incwuded? owo Hewe's how we can do it.

De `create()` instwuction suppowts adding bod nyowmaw and extewnyaw pwugin dwough de `plugins` fiewd~ So we can just easiwy add aww de wequiwed fiewd fow de specific pwugins, and evewyding it wiww be handwed by de instwuction.

Hewe's an exampwe on how to do it:

```typescript
const asset = generateSigner(umi)

const tx = await create(umi, {
  asset,
  name: 'My NFT',
  uri: metadataUri,
  plugins: [
    {
      type: "PermanentFreezeDelegate",
      frozen: true,
      authority: { type: "UpdateAuthority"}
    },
    {
      type: "AppData",
      dataAuthority: { type: "UpdateAuthority"},
      schema: ExternalPluginAdapterSchema.Binary,
    }           
  ]
}).sendAndConfirm(umi)

const signature = base58.deserialize(tx.signature)[0]
```

**Nyote**: Wefew to de [documentation](/core/plugins) if you'we nyot suwe on what fiewds and pwugin to use! uwu 

## Fuww Code Exampwe

```ts
import { create } from '@metaplex-foundation/mpl-core'
import {
  createGenericFile,
  generateSigner,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers'
import fs from 'fs'
import path from 'path'

const createNft = async () => {
  //
  // ** Setting Up Umi **
  //

  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplCore())
    .use(
      irysUploader({
        // mainnet address: "https://node1.irys.xyz"
        // devnet address: "https://devnet.irys.xyz"
        address: 'https://devnet.irys.xyz',
      })
    )

  const signer = generateSigner(umi)

  umi.use(signerIdentity(signer))

  // Airdrop 1 SOL to the identity
  // if you end up with a 429 too many requests error, you may have to use
  // the filesystem wallet method or change rpcs.
  console.log('Airdropping 1 SOL to identity')
  await umi.rpc.airdrop(umi.identity.publicKey, sol(1))

  //
  // ** Upload an image to Arweave **
  //

  // use `fs` to read file via a string path.
  // You will need to understand the concept of pathing from a computing perspective.

  const imageFile = fs.readFileSync(
    path.join('./image.png')
  )

  // Use `createGenericFile` to transform the file into a `GenericFile` type
  // that umi can understand. Make sure you set the mimi tag type correctly
  // otherwise Arweave will not know how to display your image.

  const umiImageFile = createGenericFile(imageFile, 'image.png', {
    tags: [{ name: 'Content-Type', value: 'image/png' }],
  })

  // Here we upload the image to Arweave via Irys and we get returned a uri
  // address where the file is located. You can log this out but as the
  // uploader can takes an array of files it also returns an array of uris.
  // To get the uri we want we can call index [0] in the array.
  console.log('Uploading Image...')
  const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
    throw new Error(err)
  })

  console.log('imageUri: ' + imageUri[0])

  //
  // ** Upload Metadata to Arweave **
  //

  const metadata = {
    name: 'My NFT',
    description: 'This is an NFT on Solana',
    image: imageUri[0],
    external_url: 'https://example.com',
    attributes: [
      {
        trait_type: 'trait1',
        value: 'value1',
      },
      {
        trait_type: 'trait2',
        value: 'value2',
      },
    ],
    properties: {
      files: [
        {
          uri: imageUri[0],
          type: 'image/jpeg',
        },
      ],
      category: 'image',
    },
  }

  // Call upon umi's `uploadJson` function to upload our metadata to Arweave via Irys.

  console.log('Uploading Metadata...')
  const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
    throw new Error(err)
  })

  //
  // ** Creating the NFT **
  //

  // We generate a signer for the NFT
  const asset = generateSigner(umi)

  console.log('Creating NFT...')
  const tx = await create(umi, {
    asset,
    name: 'My NFT',
    uri: metadataUri,
  }).sendAndConfirm(umi)

  // Finally we can deserialize the signature that we can check on chain.
  const signature = base58.deserialize(tx.signature)[0]

  // Log out the signature and the links to the transaction and the NFT.
  console.log('\nNFT Created')
  console.log('View Transaction on Solana Explorer')
  console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`)
  console.log('\n')
  console.log('View NFT on Metaplex Explorer')
  console.log(`https://core.metaplex.com/explorer/${nftSigner.publicKey}?env=devnet`)
}

createNft()
```
