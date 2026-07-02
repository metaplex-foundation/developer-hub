---
title: Get Token Accounts
metaTitle: Get Token Accounts | DAS API
description: Get a list of token accounts by owner or mint
tableOfContents: false
---

Returns a list of token accounts filtered by owner address, mint address, or both. Useful for finding all token accounts associated with a wallet or all accounts holding a specific token.

At least one of `ownerAddress` or `mintAddress` must be provided.

## Parameters

| Name           | Required | Description                                          |
| -------------- | :------: | ---------------------------------------------------- |
| `ownerAddress` |    (only required if `mintAddress` is not provided)    | Filter by owner address.                             |
| `mintAddress`  |    (only required if `ownerAddress` is not provided)    | Filter by mint address.                              |
| `cursor`       |         | Cursor for pagination.                               |
| `page`         |         | Page number for pagination.                          |
| `limit`        |         | Maximum number of token accounts to return.          |
| `before`       |         | Return accounts before this cursor.                  |
| `after`        |         | Return accounts after this cursor.                   |
| `options`      |         | Display options for the query. Also accepted as `displayOptions`. |
| `options.showZeroBalance` | | Whether to include zero-balance accounts in results. |
| `options.showFungible` | | Accepted by the API; reserved for future use on this method. |
| `options.showCollectionMetadata` | | Accepted by the API; reserved for future use on this method. |
| `options.showUnverifiedCollections` | | Accepted by the API; reserved for future use on this method. |
| `options.showInscription` | | Accepted by the API; reserved for future use on this method. |

## Response

The response includes:

- `token_accounts` - Array of token account objects containing:
  - `address` - The token account address
  - `amount` - Token balance in the account
  - `mint` - The mint address of the token
  - `owner` - The owner address of the account
  - `delegate` - Delegate address (if any)
  - `delegated_amount` - Amount delegated to the delegate
  - `frozen` - Whether the account is frozen
  - `close_authority` - Close authority address (if any)
  - `extensions` - Token extensions data
- `errors` - Array of any errors encountered during processing
- `total` - Number of token accounts returned in the current page
- Pagination fields: `cursor`, `page`, `limit`, `before`, `after`

An owner or mint with no matching accounts returns an empty `token_accounts` array rather than an error.

## Playground

{% apiRenderer method="getTokenAccounts" /%}
