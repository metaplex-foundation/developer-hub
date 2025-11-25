---
title: Create a Fungible Token
metaTitle: Create a Fungible Token | Tokens
description: Learn how to create a fungible SPL token with metadata on Solana
created: '11-25-2025'
updated: '11-25-2025'
---

Create a fungible token with metadata on Solana using the Token Metadata program. {% .lead %}


## Create a Token

The following code is a fully runnable example. Nevertheless you might want tot do some changes like adding your own Metadata and amounts.

{% code-tabs-imported from="token-metadata/fungibles/create" frameworks="umi" /%}

## Parameters

In the above code you probably want to change some parameters to align it to your needs.

| Parameter | Description |
|-----------|-------------|
| `name` | Token name (max 32 characters) |
| `symbol`| Short name of your Token (max 6 characters) |
| `uri` | Link to off-chain metadata JSON |
| `sellerFeeBasisPoints` | Royalty percentage (550 = 5.5%) |
| `decimals` | Decimal places (`some(9)` is standard) |
| `amount` | Number of tokens to mint |

## Metadata URI

The `uri` should point to a JSON file containing at least the following information. You can find more details on the [Token Metadata Standard page](token-metadata/token-standard#the-fungible-standard).

```json
{
  "name": "My Fungible Token",
  "symbol": "MFT",
  "description": "A fungible token on Solana",
  "image": "https://arweave.net/image-hash"
}
```
