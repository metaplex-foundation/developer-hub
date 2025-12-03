---
title: Update an NFT
metaTitle: Update an NFT | NFTs
description: Learn how to update NFT metadata using Metaplex Core on Solana
created: '03-12-2025'
updated: '03-12-2025'
---

Update your NFT's name and metadata as the update authority. {% .lead %}

## Update an NFT

In the following section you can find a full code example and the parameters that you might need to change. You can learn more about updating NFTs in the [Core documentation](/core/update).

{% code-tabs-imported from="core/update-asset" frameworks="umi" /%}

## Parameters

Customize these parameters for your update:

| Parameter | Description |
|-----------|-------------|
| `assetAddress` | The public key of the NFT to update |
| `name` | New name for the NFT (optional) |
| `uri` | New metadata URI (optional) |

## How It Works

The update process involves three steps:

1. **Fetch the NFT** - Get the current NFT data using `fetchAsset`
2. **Prepare update** - Specify the new name or URI you want to change
3. **Send update** - Execute the update transaction

Only the update authority of the NFT can modify it. If the NFT is part of a collection and uses collection authority, you need to be the collection's update authority.
