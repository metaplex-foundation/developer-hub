---
title: Preparing Assets
metaTitle: Candy Machine V4 - Preparing Assets
description: How to prepare your files and assets for CMV4.
---

## Asset Files

Create an Asset requires a a few different files that will need to be prepared in advance.

- Artwork/Animation/Models/Audio
- JSON Metadata files.

## Preparing Images

While there are no inherant rules regarding images, it's in best practice to optimize you images to be as `web deliverable` as possible. You need to take into account that not all users may not have access to a super quick broadband connection. Users might be in remote areas where accesss to the internet is sparse so trying to get your user to view a 8mb image may impact their experiance with your project.

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

Explain the storage options and the pros and cons.

- Arweave
- NFT.Storage/IPFS
- ShdwDrive

### Upload Images

Use an Umi example to upload to each of these destinations.

- Arweave
- NFT.Storage/IPFS
- ShdwDrive

### Assign Image URIs JSON Metadata Files

Explain the process taking the image URIs from the previous step and inserting them into the metadata json files.

### Upload JSON Metadata Files

Use Umi example to show the process of uploading a metadata file to each of the storage providers.

Explain the storage options available for the image and metadata files.

## Create Collection Asset

Explain how to create the Collection Asset and it's role in the Candy Machine V4
