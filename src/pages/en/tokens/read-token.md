---
title: Read Token Data
metaTitle: Read Token Data | Tokens
description: Learn how to fetch fungible token data from the Solana blockchain
created: '11-28-2025'
updated: '11-28-2025'
---

Fetch fungible token information from the Solana blockchain. {% .lead %}

## Get Token Metadata

Fetch a token's metadata using its mint address. This retrieves the on-chain token information including name, symbol, decimals, and supply.

{% code-tabs-imported from="token-metadata/fungibles/read" frameworks="umi,das,curl" /%}

## Parameters

| Parameter | Description |
|-----------|-------------|
| `mintAddress` | The token mint address to fetch |

## Get Token Balance

Fetch the token balance for a specific wallet using the Associated Token Account or DAS API.

{% code-tabs-imported from="token-metadata/fungibles/read-balance" frameworks="umi,das,curl" /%}

## Get All Tokens by Owner

Retrieve all fungible tokens owned by a wallet address using the DAS API.

{% code-tabs-imported from="token-metadata/fungibles/read-all" frameworks="das,curl" /%}

## Comparing Approaches

| Feature | Direct RPC | DAS API |
|---------|-----------|---------|
| Speed | Slower for bulk queries | Optimized for bulk queries |
| Data freshness | Real-time | Near real-time (indexed) |
| Search capabilities | Limited | Advanced filtering |
| Use case | Single token lookups | Portfolio views, searches |

## Tips

- **Use DAS for portfolio views** - When displaying all tokens a user owns, DAS API is significantly faster than multiple RPC calls
- **For DAS, set showFungible** - Set `showFungible: true` otherwise some RPCs only return NFT Data

## Related Guides

- [Create a Token](/tokens/create-a-token)
- [DAS API Overview](/das-api)
- [Get Fungible Assets by Owner](/das-api/guides/get-fungible-assets)
