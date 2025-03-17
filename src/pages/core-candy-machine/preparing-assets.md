---
title: Preparing Assets
metaTitle: Preparing Assets | Core Candy Machine
description: How to prepare your files and assets for uploading into a Core Candy Machine.
---

## Asset Files

Creating an Asset requires a a few different files that will need to be prepared and uploaded for use in Asset data.
These include:

- Image and animation files.
- JSON Metadata files.

## Asset Types

Assets support the following categories:

- image
- video
- audio
- vr
- html

## Preparing Images

While there are no inherent rules regarding images, it's in best practice to optimize you images to be as `web deliverable` as possible. You need to take into account that not all users may not have access to a super quick broadband connection. Users might be in remote areas where access to the internet is sparse so trying to get your user to view a 8mb image may impact their experience with your project.

Even if your Asset is of the type `audio`, `video`, `html`, or `vr` it is still worth preparing images as these will be used as fallback for areas such as wallets or marketplaces that may not support the loading of the other Asset types.

## Preparing Animation Files

Animation files consist of the remaining types of Asset categories `audio`, `video`, `vr`, and `html`

The same applies here as to preparing image files. You need to take into account. You need to take into consideration the file size and expected download sizes for your users.

The following file types have been tested and confirmed working in nearly all major wallets and marketplaces.

- video (.mp4)
- audio (.wav, .mp3)
- vr (.glb)
- html (.html)

## Preparing JSON Metadata

Your json metadata files will be following the same Token Standard used by the other Metaplex standards of nfts, pNfts, and cNfts.

{% partial file="token-standard-full.md" /%}

## Image and Metadata Generators

There are several automated scripts and websites where you can supply the generator with your art layers and some basic information about your project and it will generate x number of Asset Image and JSON Metadata combos based on your paramenters given.

| Name                                                        | type   | Difficulty | Requirements | Free |
| ----------------------------------------------------------- | ------ | ---------- | ------------ | ---- |
| [nftchef](https://github.com/nftchef/art-engine)            | script | ⭐⭐⭐⭐   | JS knowledge | ✅   |
| [hashlips](https://github.com/HashLips/hashlips_art_engine) | script | ⭐⭐⭐⭐   | JS knowledge | ✅   |
| [Nft Art Generator](https://nft-generator.art/)             | web UI | ⭐⭐       |              |      |
| [bueno](https://bueno.art/generator)                        | web UI | unknown    |              |      |

## Uploading Files

### Storage Options

#### Arweave/Irys

_"The Arweave network is like Bitcoin, but for data: A permanent and decentralized web inside an open ledger." - [arweave.org](https://arweave.org)_

As Arweave is it's own blockchain we need to use a bridge in order to get our files stored on Arweave. [Irys](https://irys.xyz/) acts as a middle man between Solana and Arweave allowing you to pay for storage in SOL instead of AR while they handle the uploading of data to the Arweave chain for you.

You can either implement this manually via their own [SDK](https://docs.irys.xyz/) or use an UMI plugin to upload to Arweave via Irys.

#### nftStorage

_"Preserve your NFTs with our low-cost, easy-to-use solution. We aim to ensure verifiable long-term storage, powered by smart contracts and backed by our soon-to-be onchain endowment for ultimate transparency." - [nftStorage](https://nft.storage/)_

nftStorage uploads your files to the IPFS (InterPlanetary File System) network

To upload to nftStorage you can follow their [API](https://app.nft.storage/v1/docs/intro) documentation.

#### Self Hosting

There is also nothing wrong with self hosting your images on metadata either in AWS, Google Cloud, or even your own webserver. As long as the data is accessible from it's stored location and doesn't have something like CORS blocking it then you should be good. It would be advised to make either a few test Core Assets or small Core Candy Machine to test self hosted options to make sure the stored data is viewable.

### Uploading Files with Umi

Umi has a few plugins that can aid the upload process via plugins. At the time the following plugins are supported:

- Irys
- NFT Storage 
- AWS 

#### Uploading to Arweave via Irys with Umi

For a more indepth look at uploaded files with Umi please visit [Umi Storage.](/umi/storage)

{% dialect-switcher title="Uploading Files to Arweave Via Irys with Umi" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'

const umi = createUmi("https://devnet-aura.metaplex.com/<YOUR_API_KEY>").use(irysUploader())

const uriUploadArray = await umi.uploader.upload([myFile1, myFile2])

console.log(uriUploadArray)
```

{% /dialect %}
{% /dialect-switcher %}

### Assign Image URIs JSON Metadata Files

Once you have uploaded all your img files to a storage medium of your choice will will need to place all the image URIs in your JSON metadata files.

If your Asset collection has 1000 Assets then you should have uploaded 1000 images/animation media to a storage platform and received back a set of data/log/a way of telling where each image/animation media has been stored. You may have to manually log and store links if your upload platform of choice does not support batch uploaded and you have to single loop upload.

The goal of this point is to have a list full list of URI's of where your media is that.

```js
[
  https://example.com/1.jpg
  https://example.com/2.jpg
  ...
]

```

With the index uri list of uploaded media you will then need to loop through your JSON metadata files and add the URIs to the appropriate places.

Image URIs would be inserted into the `image:` field, and also into the `properties: files: []` array.

```json
{
  "name": "My Nft #1",
  "description": "This is My Nft Collection",
  "image": "https://example.com/1.jpg", <---- Fill here.
  ...
  "properties": {
    "files": [
      {
        "uri": "https://example.com/1.jpg",
        "type": "image/jpg"
      }, <---- Make an object entry into the files array.
    ]
  }
}
```

### Upload JSON Metadata Files

At this point you should have a folder of JSON metadata files locally built out on your machine that look like similar to this:

{% dialect-switcher title="1.json" %}
{% dialect title="Json" id="json" %}

```json
{
  "name": "My Nft #1",
  "description": "This is My Nft Collection",
  "image": "https://example.com/1.jpg",
  "external_url": "https://example.com",
  "attributes": [
    {
      "trait_type": "trait1",
      "value": "value1"
    },
    {
      "trait_type": "trait2",
      "value": "value2"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://example.com/1.jpg",
        "type": "image/jpg"
      }
    ],
    "category": "image"
  }
}
```

{% /dialect %}
{% /dialect-switcher %}

You will need to upload all your JSON metadata to a storage medium of choice and again log all the URIs for future use.

## Create Collection Asset

The final step in preparation for your Core Candy Machine creation is create a Core Collection that the Core Candy Machine can use to group all the Assets together that the users purchase from your Core Candy Machine. For this we will require the `mpl-core` package.

{% callout %}
You will need to upload an image and also prepare and upload the JSON metadata like in the previous steps to have the necessary data to create your Core Collection.
{% /callout %}

The below example creates a basic Core Collection with no plugins. To view a list of available plugins and more advanced Core Collection creation you can view the documentation over at Core's [Collection Management](/core/collections).

{% dialect-switcher title="Create a MPL Core Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, umi } from '@metaplex-foundation/umi'
import { createCollectionV1 } from '@metaplex-foundation/mpl-core'

const mainnet = 'https://api.mainnet-beta.solana.com'
const devnet = 'https://api.devnet.solana.com'

const keypair = // assign keypair

const umi = createUmi(mainnet)
.use(keypairIdentity(keypair)) // Assign identity signer of your choice.
.use(mplCore())

const collectionSigner = generateSigner(umi)

await createCollectionV1(umi, {
  collection: collectionSigner,
  name: 'My Collection',
  uri: 'https://example.com/my-collection.json',
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Conclusion

At this point you should have all completed all the preparations needed in order to create a Core Candy Machine.

- Upload images and other media files.
- Assign image and media file URIs to JSON Metadata files.
- Upload JSON Metadata files and stored URIs.
- Created a Core Collection
