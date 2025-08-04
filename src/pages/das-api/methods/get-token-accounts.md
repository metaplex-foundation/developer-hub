---
title: Get Token Accounts
metaTitle: Get Token Accounts | DAS API
description: Get a list of token accounts by owner or mint
tableOfContents: false
---

Returns a list of token accounts filtered by owner address, mint address, or both. Useful for finding all token accounts associated with a wallet or all accounts holding a specific token.

## Parameters

| Name           | Required | Description                                          |
| -------------- | :------: | ---------------------------------------------------- |
| `ownerAddress` |    (only required if `mintAddress` is not provided)    | Filter by owner address.                             |
| `mintAddress`  |    (only required if `ownerAddress` is not provided)    | Filter by mint address.                              |
| `cursor`       |    ❌    | Cursor for pagination.                               |
| `page`         |    ❌    | Page number for pagination.                          |
| `limit`        |    ❌    | Maximum number of token accounts to return.          |
| `before`       |    ❌    | Return accounts before this cursor.                  |
| `after`        |    ❌    | Return accounts after this cursor.                   |
| `options`      |    ❌    | Additional display options (see below).              |

## Options

| Name                       | Default | Description                                    |
| -------------------------- | :-----: | ---------------------------------------------- |
| `showCollectionMetadata`   | `false` | Include collection metadata in response.       |
| `showFungible`             | `false` | Include fungible tokens in results.           |
| `showInscription`          | `false` | Include inscription data.                      |
| `showUnverifiedCollections`| `false` | Include unverified collections.                |
| `showZeroBalance`          | `false` | Include accounts with zero balance.            |

## UMI w/ DAS SDK

{% totem %}

```js
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const umi = createUmi('<ENDPOINT>').use(dasApi());

// Get all token accounts for a specific owner
const ownerAddress = publicKey('8TrvJBRa6Pzb9BDadqroHhWTHxaxK8Ws8r91oZ2jxaVV');
const accountsByOwner = await umi.rpc.getTokenAccounts({
  ownerAddress: ownerAddress,
});

// Get all token accounts for a specific mint
const mintAddress = publicKey('So11111111111111111111111111111111111111112');
const accountsByMint = await umi.rpc.getTokenAccounts({
  mintAddress: mintAddress,
});

// Get with additional options
const accountsWithOptions = await umi.rpc.getTokenAccounts({
  ownerAddress: ownerAddress,
  options: {
    showZeroBalance: true,
    showFungible: true,
  },
});

console.log(accountsByOwner);
```

{% /totem %}

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
- Pagination fields: `cursor`, `page`, `limit`, `before`, `after`, `total`

## Playground

{% apiRenderer method="getTokenAccounts" /%}