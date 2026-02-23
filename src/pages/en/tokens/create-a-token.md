---
title: Create a Fungible Token
metaTitle: Create a Fungible Token | Tokens
description: Learn how to create a fungible SPL token with metadata on Solana
created: '11-25-2025'
updated: '11-25-2025'
---

Create a fungible token with metadata on Solana using the Token Metadata program. {% .lead %}

## What You'll Learn
This guide shows you how to create and mint a fungible token with:

- Custom name, symbol, and metadata
- Token image and description
- Configurable decimals (divisibility)
- Initial token supply

## Create a Token

The following code is a fully runnable example. Below the parameters that you might want to customize are shown. You can learn more about token creation details in the [Token Metadata program](/smart-contracts/token-metadata/mint#minting-tokens) pages.

{% code-tabs-imported from="token-metadata/fungibles/create" frameworks="umi,kit,cli" /%}

## Parameters

Customize these parameters for your token:

| Parameter | Description |
|-----------|-------------|
| `name` | Token name (max 32 characters) |
| `symbol`| Short name of your Token (max 6 characters) |
| `uri` | Link to off-chain metadata JSON |
| `sellerFeeBasisPoints` | Royalty percentage (550 = 5.5%) |
| `decimals` | Decimal places (`some(9)` is standard) |
| `amount` | Number of tokens to mint |

## Metadata and Images

The `uri` should point to a JSON file containing at least the following information. You can find more details on the [Token Metadata Standard page](/smart-contracts/token-metadata/token-standard#the-fungible-standard). You need to upload the JSON and the image url so that they are accessible from everywhere. We recommend to use a web3 storage provider like Arweave. If you want to do so by code you can follow this [guide on creating deterministic metadata with Turbo](/guides/general/create-deterministic-metadata-with-turbo).

```json
{
  "name": "My Fungible Token",
  "symbol": "MFT",
  "description": "A fungible token on Solana",
  "image": "https://arweave.net/tx-hash"
}
```
