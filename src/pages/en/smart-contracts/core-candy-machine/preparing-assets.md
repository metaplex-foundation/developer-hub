---
title: Preparing Assets for a Core Candy Machine
metaTitle: Preparing Assets | Core Candy Machine
description: How to prepare image files, animation media, and JSON metadata for uploading into a Core Candy Machine on Solana.
keywords:
  - NFT metadata
  - JSON metadata
  - asset preparation
  - Arweave
  - IPFS
  - image upload
  - Core Candy Machine assets
  - NFT collection
  - metadata standard
  - Irys uploader
  - Solana NFT images
  - NFT animation files
  - Umi storage plugin
  - decentralized storage
about:
  - Asset preparation
  - NFT metadata
  - File uploads
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: What image format is best for Core Candy Machine assets?
    a: PNG and JPEG are the most widely supported formats across wallets and marketplaces. PNG is ideal for pixel art or images requiring transparency, while JPEG works well for photographic or high-detail artwork at smaller file sizes. Optimize images for web delivery to keep file sizes under 1 MB where possible.
  - q: What storage provider should I use for NFT metadata and images?
    a: Arweave (via Irys) is the most popular choice because it provides permanent, decentralized storage paid in SOL. IPFS is another decentralized option but requires pinning services to ensure persistence. Self-hosted solutions (AWS, Google Cloud) work but introduce centralization and ongoing maintenance costs.
  - q: Can I use IPFS for Core Candy Machine assets?
    a: Yes, IPFS URIs work with Core Candy Machine assets. However, you must use a pinning service such as Pinata, nft.storage, or a dedicated IPFS node to ensure your files remain accessible. Unpinned IPFS content may become unavailable over time.
  - q: Do I need to upload images before creating JSON metadata files?
    a: Yes. The JSON metadata files reference image URIs in their "image" field and "properties.files" array. You must upload all image and animation files first, collect their URIs, and then insert those URIs into each corresponding JSON metadata file before uploading the metadata itself.
  - q: How many files do I need to prepare for a 1,000-item collection?
    a: For a 1,000-item collection you need at minimum 1,000 image files and 1,000 JSON metadata files, plus one additional image and one JSON metadata file for the Core Collection itself. If your assets include animation files (video, audio, VR, HTML), you will also need 1,000 animation files.
---

## Summary

Preparing assets for a [Core Candy Machine](/smart-contracts/core-candy-machine) requires uploading image files and JSON metadata to a storage provider, then creating a [Core Collection](/smart-contracts/core/collections) that groups all minted assets together.

- Upload image and animation files to decentralized storage such as Arweave (via Irys) or IPFS, or to a self-hosted solution {% .lead %}
- Build JSON metadata files following the Metaplex token standard, embedding the uploaded image URIs {% .lead %}
- Upload completed JSON metadata files and record the resulting URIs for use as config lines {% .lead %}
- Create a [Core](/smart-contracts/core) Collection to serve as the parent for all assets minted from the Candy Machine {% .lead %}

## Required Asset Files

Every [Core](/smart-contracts/core) asset minted from a Core Candy Machine requires two categories of prepared files before the machine can be [created](/smart-contracts/core-candy-machine/create) and populated.
These include:

- Image and animation files.
- JSON Metadata files.

## Supported Asset Types

Core assets support five media categories that determine how wallets and marketplaces render the content:

- image
- video
- audio
- vr
- html

## Preparing Image Files

Image files serve as the primary visual representation of each asset and are displayed across all wallets and marketplaces. While there are no enforced format restrictions, it is best practice to optimize images for web delivery. Not all users have access to high-speed internet connections -- users in remote areas may struggle to load large files, so keeping images under 1 MB improves the experience for your entire audience.

Even if your asset is of the type `audio`, `video`, `html`, or `vr` it is still worth preparing images as these will be used as fallback for areas such as wallets or marketplaces that may not support the loading of the other asset types.

## Preparing Animation and Media Files

Animation and media files cover the remaining asset categories: `audio`, `video`, `vr`, and `html`. The same file-size considerations that apply to images apply here -- keep files as small as practical to minimize download times for end users.

The following file types have been tested and confirmed working in nearly all major wallets and marketplaces.

- video (.mp4)
- audio (.wav, .mp3)
- vr (.glb)
- html (.html)

## Preparing JSON Metadata Files

JSON metadata files define the on-chain attributes, name, description, and media references for each asset. These files follow the same token standard used by other Metaplex asset types including NFTs, pNFTs, and cNFTs.

{% partial file="token-standard-full.md" /%}

## Automated Image and Metadata Generators

Several open-source scripts and web applications can generate large batches of asset images and JSON metadata files from layered artwork. You supply art layers and project parameters, and the generator produces the full set of image-metadata pairs.

| Name                                                        | type   | Difficulty | Requirements | Free |
| ----------------------------------------------------------- | ------ | ---------- | ------------ | ---- |
| [nftchef](https://github.com/nftchef/art-engine)            | script | ⭐⭐⭐⭐   | JS knowledge | ✅   |
| [hashlips](https://github.com/HashLips/hashlips_art_engine) | script | ⭐⭐⭐⭐   | JS knowledge | ✅   |
| [Nft Art Generator](https://nft-generator.art/)             | web UI | ⭐⭐       |              |      |
| [bueno](https://bueno.art/generator)                        | web UI | unknown    |              |      |

## Uploading Asset Files

All image and animation files must be uploaded to a storage provider before they can be referenced in JSON metadata. The choice of storage provider affects permanence, cost, and decentralization.

### Storage Options

#### Arweave/Irys

_"The Arweave network is like Bitcoin, but for data: A permanent and decentralized web inside an open ledger." - [arweave.org](https://arweave.org)_

As Arweave is it's own blockchain we need to use a bridge in order to get our files stored on Arweave. [Irys](https://irys.xyz/) acts as a middle man between Solana and Arweave allowing you to pay for storage in SOL instead of AR while they handle the uploading of data to the Arweave chain for you.

You can either implement this manually via their own [SDK](https://docs.irys.xyz/) or use an [Umi storage plugin](/dev-tools/umi/storage) to upload to Arweave via Irys.

#### Self Hosting

Self-hosting on AWS, Google Cloud, or your own web server is a valid option for storing images and metadata. As long as the data is accessible from its stored location and is not blocked by CORS restrictions, it will work. It is advisable to create a few test [Core](/smart-contracts/core) assets or a small Core Candy Machine first to verify that self-hosted files display correctly in wallets and marketplaces.

### Uploading Files with Umi

[Umi](/dev-tools/umi) provides storage plugins that simplify the upload process. The following plugins are currently supported:

- Irys
- AWS

#### Uploading to Arweave via Irys with Umi

For a more in-depth guide on uploading files with Umi, visit [Umi Storage](/dev-tools/umi/storage).

{% dialect-switcher title="Uploading Files to Arweave Via Irys with Umi" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'

const umi = createUmi("https://api.devnet.solana.com").use(irysUploader())

const uriUploadArray = await umi.uploader.upload([myFile1, myFile2])

console.log(uriUploadArray)
```

{% /dialect %}
{% /dialect-switcher %}

### Assigning Image URIs to JSON Metadata

Once all image and animation files have been uploaded to a storage provider, the returned URIs must be inserted into each corresponding JSON metadata file. If your asset collection has 1,000 assets, you should have uploaded 1,000 images or animation files and received back a set of URIs indicating where each file is stored. You may need to manually log and store links if your upload platform does not support batch uploads.

The goal at this point is to have a complete list of URIs for all uploaded media.

```js
[
  https://example.com/1.jpg
  https://example.com/2.jpg
  ...
]

```

With the indexed URI list of uploaded media you will then need to loop through your JSON metadata files and add the URIs to the appropriate places.

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

### Uploading JSON Metadata Files

At this point you should have a folder of JSON metadata files locally built out on your machine that look similar to this:

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

## Creating a Core Collection

The final step in asset preparation is creating a [Core Collection](/smart-contracts/core/collections) that the Core Candy Machine uses to group all minted assets together. This requires the `mpl-core` package.

{% callout %}
You will need to upload an image and also prepare and upload the JSON metadata like in the previous steps to have the necessary data to create your Core Collection.
{% /callout %}

The below example creates a basic Core Collection with no plugins. To view a list of available plugins and more advanced [Core Collection](/smart-contracts/core/collections) creation you can view the documentation at [Collection Management](/smart-contracts/core/collections).

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

## Notes

- Optimize all images for web delivery. Keep file sizes under 1 MB where possible to ensure fast loading across devices and network conditions.
- When self-hosting assets, verify that CORS headers are configured correctly. Assets blocked by CORS will not render in wallets or marketplaces.
- Store all uploaded URIs securely and back them up. Losing the URI list after uploading images means you cannot link metadata to the correct files.
- Arweave storage is permanent and immutable. Double-check file contents before uploading because you cannot delete or modify files once they are stored on Arweave.
- JSON metadata files must be uploaded *after* image files because metadata references image URIs that are only available after the upload completes.

## Conclusion

At this point you should have completed all the preparations needed in order to [create a Core Candy Machine](/smart-contracts/core-candy-machine/create).

- Upload images and other media files.
- Assign image and media file URIs to JSON Metadata files.
- Upload JSON Metadata files and stored URIs.
- Created a [Core Collection](/smart-contracts/core/collections).

## FAQ

### What image format is best for Core Candy Machine assets?

PNG and JPEG are the most widely supported formats across wallets and marketplaces. PNG is ideal for pixel art or images requiring transparency, while JPEG works well for photographic or high-detail artwork at smaller file sizes. Optimize images for web delivery to keep file sizes under 1 MB where possible.

### What storage provider should I use for NFT metadata and images?

Arweave (via Irys) is the most popular choice because it provides permanent, decentralized storage paid in SOL. IPFS is another decentralized option but requires pinning services to ensure persistence. Self-hosted solutions (AWS, Google Cloud) work but introduce centralization and ongoing maintenance costs.

### Can I use IPFS for Core Candy Machine assets?

Yes, IPFS URIs work with Core Candy Machine assets. However, you must use a pinning service such as Pinata, nft.storage, or a dedicated IPFS node to ensure your files remain accessible. Unpinned IPFS content may become unavailable over time.

### Do I need to upload images before creating JSON metadata files?

Yes. The JSON metadata files reference image URIs in their `image` field and `properties.files` array. You must upload all image and animation files first, collect their URIs, and then insert those URIs into each corresponding JSON metadata file before uploading the metadata itself.

### How many files do I need to prepare for a 1,000-item collection?

For a 1,000-item collection you need at minimum 1,000 image files and 1,000 JSON metadata files, plus one additional image and one JSON metadata file for the [Core Collection](/smart-contracts/core/collections) itself. If your assets include animation files (video, audio, VR, HTML), you will also need 1,000 animation files.

## Glossary

| Term | Definition |
| --- | --- |
| JSON Metadata | A structured JSON file conforming to the Metaplex token standard that defines an asset's name, description, image URI, attributes, and associated media files. |
| URI | Uniform Resource Identifier -- the web address where an uploaded file (image, animation, or metadata) is stored and can be retrieved. |
| Arweave | A permanent, decentralized storage blockchain designed for immutable data storage. Files uploaded to Arweave persist indefinitely. |
| Irys | A bridge service (formerly Bundlr) that allows Solana users to pay for Arweave storage in SOL, handling the cross-chain upload process. |
| IPFS | InterPlanetary File System -- a peer-to-peer decentralized storage protocol. Requires pinning services to guarantee long-term file availability. |
| Config Line | A name-URI pair inserted into a Core Candy Machine that maps to a single asset's JSON metadata file on storage. |
| Core Collection | A Metaplex Core on-chain account that groups related assets together, serving as the parent collection for all assets minted from a Candy Machine. |
| Token Standard | The Metaplex-defined JSON schema specifying required and optional fields (name, description, image, attributes, properties) for NFT metadata. |

