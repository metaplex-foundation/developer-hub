---
title: Get NFT Editions
metaTitle: Get NFT Editions | DAS API
description: Get all printable editions of a master edition NFT mint
---

Returns all printable editions for a master edition NFT mint, including edition numbers, addresses, and supply information.

## Parameters

| Name          | Required | Description                                        |
| ------------- | :------: | -------------------------------------------------- |
| `mintAddress` |    ✅    | The mint address of the master edition NFT.       |
| `cursor`      |         | Cursor for pagination.                             |
| `page`        |         | Page number for pagination.                        |
| `limit`       |         | Maximum number of editions to return.              |
| `before`      |         | Return editions before this cursor.                |
| `after`       |         | Return editions after this cursor.                 |

## Response

The response includes:

- `editions` - Array of edition objects containing:
  - `edition_address` - The address of the [edition account](/smart-contracts/token-metadata#printing-editions)
  - `edition_number` - The edition number (1, 2, 3, etc.)
  - `mint_address` - The mint address of the edition
- `master_edition_address` - Address of the master edition account
- `supply` - Total number of editions minted for this master edition
- `max_supply` - Maximum number of editions that can be minted (`null` for unlimited)
- `total` - Number of editions returned in the current page. Use `supply` for the overall minted count.
- Pagination fields: `cursor`, `page`, `limit`, `before`, `after`

If the mint does not have a master edition account, the RPC returns an error.

## Playground

{% apiRenderer method="getNftEditions" /%}
