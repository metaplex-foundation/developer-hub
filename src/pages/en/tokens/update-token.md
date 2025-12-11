---
title: Update Token Metadata
metaTitle: How to Update Fungible Token Metadata on Solana | Tokens
description: Learn how to update fungible token metadata on Solana using JavaScript and Umi
created: '11-28-2025'
updated: '11-28-2025'
---

Update the metadata of your fungible token to change its name, symbol, image, or other properties. {% .lead %}

## Update Token Metadata

In the following section you can find a full code example and the parameters that you might have to change. This uses the Token Metadata program to update on-chain metadata.

{% code-tabs-imported from="token-metadata/fungibles/update" frameworks="umi,cli" /%}

## Parameters

Customize these parameters for your update:

| Parameter | Description |
|-----------|-------------|
| `mintAddress` | The token mint address |
| `name` | New token name (max 32 characters) |
| `symbol` | New token symbol (max 10 characters) |
| `uri` | New link to off-chain metadata JSON |
| `sellerFeeBasisPoints` | Royalty percentage (usually 0 for fungibles) |

## How It Works

The update process is straightforward:

1. **Connect with update authority** - Your wallet must be the update authority for the token
2. **Call updateV1** - Provide the mint address and new metadata values
3. **Confirm transaction** - The metadata is updated on-chain

## What Can Be Updated

You can update the following on-chain metadata:

- **Name** - The display name of your token
- **Symbol** - The short ticker symbol
- **URI** - Link to off-chain JSON metadata (image, description, etc.)
- **Seller fee basis points** - Royalty percentage

## Requirements

To update token metadata, you must:

- **Be the update authority** - Only the designated update authority can modify metadata
- **Have a mutable token** - The token must have been created with `isMutable: true`

## Updating Off-Chain Metadata

To update the token image or description, you need to:

1. Create a new JSON metadata file with updated information
2. Upload the new JSON to a storage provider (like Arweave)
3. Update the `uri` field to point to the new JSON file

```json
{
  "name": "Updated Token Name",
  "symbol": "UTN",
  "description": "An updated description for my token",
  "image": "https://arweave.net/new-image-hash"
}
```

## Important Notes

- Updates only affect the metadata, not the token itself or existing balances
- If your token was created as immutable, you cannot update its metadata
- Changing the `uri` allows you to update off-chain data like images and descriptions
