---
title: Transfer an NFT
metaTitle: Transfer an NFT | NFTs
description: Learn how to transfer NFTs between wallets using Metaplex Core on Solana
created: '03-12-2025'
updated: '03-12-2025'
---

Transfer NFT ownership between wallets on Solana. {% .lead %}

## Transfer an NFT

In the following section you can find a full code example and the parameters that you might need to change. You can learn more about transferring NFTs in the [Core documentation](/core/transfer).

{% code-tabs-imported from="core/transfer-asset" frameworks="umi" /%}

## Parameters

Customize these parameters for your transfer:

| Parameter | Description |
|-----------|-------------|
| `assetAddress` | The public key of the NFT to transfer |
| `newOwner` | The wallet address of the recipient |

## How It Works

The transfer process involves three steps:

1. **Verify ownership** - You must be the current owner of the NFT
2. **Specify recipient** - Provide the new owner's wallet address
3. **Execute transfer** - The NFT ownership is transferred immediately

## NFT Transfers

Unlike SPL/fungible tokens, Core NFTs don't require the recipient to create a token account first. The ownership is recorded directly in the NFT, making transfers simpler and cheaper.
