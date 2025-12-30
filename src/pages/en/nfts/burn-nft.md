---
title: Burn an NFT
metaTitle: Burn an NFT | NFTs
description: Learn how to burn NFTs using Metaplex Core on Solana
created: '03-12-2025'
updated: '03-12-2025'
---

Permanently destroy an NFT and reclaim rent fees. {% .lead %}

## Burn an NFT

In the following section you can find a full code example and the parameters that you might need to change. You can learn more about burning NFTs in the [Core documentation](/smart-contracts/core/burn).

{% code-tabs-imported from="core/burn-asset" frameworks="umi,cli" /%}

## Parameters

Customize these parameters for your burn:

| Parameter | Description |
|-----------|-------------|
| `assetAddress` | The public key of the NFT to burn |

## How It Works

The burn process involves three steps:

1. **Fetch the NFT** - Get the NFT data using `fetchAsset`
2. **Execute burn** - Destroy the NFT permanently
3. **Reclaim rent** - Most SOL is returned to you (except ~0.00089784 SOL)

**Warning**: Burning is permanent and cannot be reversed. Make sure you want to destroy the NFT before proceeding.

## Rent Reclamation

When you burn an NFT:

- Most of the rent SOL is returned to the NFT owner
- A small amount (~0.00089784 SOL) remains to prevent the account from being reopened
- You must be the NFT owner to burn it
