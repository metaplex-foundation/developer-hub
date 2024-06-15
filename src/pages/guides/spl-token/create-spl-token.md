---
title: Create Fungible Spl Token
metaTitle: Create Spl Token
description: Learn how to create an Spl Token on the Solana blockchain.
---

To create a Fungible SPL Token on Solana using Metaplex packages you'll need to install the following via your package manager of choice.

```js
npm i @metaplex-foundation/umi
```

```js
npm i @metaplex-foundation/umi-bundle-defaults
```

```js
npm i @metaplex-foundation/mpl-token-metadata
```

```js
npm i "@metaplex-foundation/umi-uploader-irys";
```

## Setting up Umi

This example is going to run through setting up Umi with a `generatedSigner()`. If you wish to try this example with React you'll need to setup Umi via the `React - Umi w/ Wallet Adapter` guide. Apart from the the wallet setup this guide will for fileStorage keys and wallet adapter.

```ts
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { generateSigner, signerIdentity } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'

const umi = createUmi('https://api.devnet.solana.com')
  .use(mplTokenMetadata())
  .use(irysUploader())

const signer = generateSigner(umi)

umi.use(signerIdentity(signer))
```

The first 3 lines we are importing packages that required to create an SPL Token.

```ts
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { generateSigner, signerIdentity } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
```

The following lines we generate a new signer (private key) and we assign it umi.

```ts
const signer = generateSigner(umi)

umi.use(signerIdentity(signer))
```

## Creating the Token

### Uploading the Image

The first thing we need to do is to an image that represents the token and makes it recognisable. This can be in the form of jpeg, png or gif.

Umi comes with downloadable storage plugins that allow you to upload to storage solutions such Arweave, NftStore, AWS, and ShdwDrive. At start of this guide we had installed the `irsyUploader()` plugin which stores content on the Arweave blockchain so we'll stick with using that.

```ts
// import fs by adding it under the rest of the imports at the start of your file.
import fs from "fs";
```

```ts
const imageFile = fs.readFileSync(
  path.join(__dirname, '..', '/assets/islandDao.jpg')
)

const umiImageFile = createGenericFile(imageFile, 'island-dao.jpeg', {
  tags: [{ name: 'Content-Type', value: 'image/jpeg' }],
})

const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
  throw new Error(err)
})
```

{% installPackages packages=["umi", "mpl-token-metadata", "mpl-core"] /%}
