---
title: Create an NFT
metaTitle: Create an NFT | NFTs
description: Learn how to create an NFT using Metaplex Core on Solana
created: '03-12-2025'
updated: '03-12-2025'
---

Create an NFT using Metaplex Core on Solana. {% .lead %}

## What You'll Learn
This guide shows you how to create an NFT with:

- Custom name and metadata
- Image and description
- Optional attributes

## Create an NFT

The following code is a fully runnable example. Below the parameters that you might want to customize are shown. You can learn more about NFT creation details in the [Core documentation](/smart-contracts/core).

{% code-tabs-imported from="core/create-asset" frameworks="umi,cli" /%}

## On-Chain Parameters

Customize these parameters for your NFT:

| Parameter | Description |
|-----------|-------------|
| `name` | NFT name (max 32 characters) |
| `uri` | Link to off-chain metadata JSON |

## Metadata and Images

Below you can find the minimum metadata that you need to upload. Additional fields like `external_url`, `attributes`, and `properties` are optional and can be found with further description and examples in the [JSON schema](/smart-contracts/core/json-schema). You need to upload the JSON and the image so that they are accessible from everywhere. We recommend to use a web3 storage provider like Arweave. If you want to do so by code you can follow this [guide](/guides/general/create-deterministic-metadata-with-turbo).

```json
{
  "name": "My NFT",
  "description": "An NFT on Solana",
  "image": "https://arweave.net/tx-hash",
  "attributes": []
}
```

## Plugins
MPL Core Assets support the use of plugins at both the Collection and Asset levels. To create a Core Asset with a plugin you pass in the plugin type and its parameters into the `plugins` array arg during creation. You can find more information about plugins in the [Plugins Overview](/smart-contracts/core/plugins) page. In the context of NFTs like Profile Pictures the [Royalties plugin](/smart-contracts/core/plugins/royalties) is a common use case.