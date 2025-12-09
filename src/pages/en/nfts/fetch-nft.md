---
title: Fetch an NFT
metaTitle: Fetch an NFT | NFTs
description: Learn how to fetch NFTs using Metaplex Core on Solana
created: '03-12-2025'
updated: '03-12-2025'
---

Fetch NFT data from the Solana blockchain. {% .lead %}

## Fetch an NFT or a Collection

In the following section you can find a full code example and the parameters that you might need to change. You can learn more about fetching NFTs and collections in the [Core documentation](/core/fetch).

{% code-tabs-imported from="core/fetch-asset" frameworks="umi,cli,das,curl" /%}

## Parameters

Customize these parameters for your fetch:

| Parameter | Description |
|-----------|-------------|
| `assetAddress` | The public key of the NFT asset |
| `collectionAddress` | The public key of the collection (optional) |

## How It Works

The fetch process involves these steps:

1. **Get the address** - You need the public key of the NFT asset or collection you want to fetch
2. **Fetch asset data** - Use `fetchAsset` to retrieve NFT information including name, URI, owner, and plugins
3. **Fetch collection data** - Use `fetchCollection` to retrieve collection information (optional)

## NFT and Collection Data

When you fetch an asset, you get back all its data:

- **Name** - The NFT's name
- **URI** - Link to the metadata JSON
- **Owner** - The wallet that owns the NFT
- **Update Authority** - Who can modify the NFT
- **Plugins** - Any attached plugins like royalties or attributes

When you fetch a collection, you get:

- **Name** - The collection's name
- **URI** - Link to the collection metadata JSON
- **Update Authority** - Who can modify the collection
- **Num Minted** - Number of assets in the collection
- **Plugins** - Any attached plugins like royalties or attributes

