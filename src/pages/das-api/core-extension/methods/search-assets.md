---
title: Search Core Assets
metaTitle: DAS API Core Extension - Search Core Assets
description: Return the list of MPL Core assets given a search criteria
---

Return the list of Core assets given a search criteria. 

## Code example

In this example two filters are applied:
1. The Public Key of the Owner
2. The Metadata uri `jsonUri`

Like this only the NFTs with the given URI owned by that wallet are returned.

Additional possible Parameters can be found [below](#parameters).

```js
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const umi = createUmi('<ENDPOINT>').use(dasApi());

const asset = await das.searchAssets(umi, {
    owner: publicKey('AUtnbwWJQfYZjJ5Mc6go9UancufcAuyqUZzR1jSe4esx'),
    jsonUri: 'https://arweave.net/TkklLLQKiO9t9_JPmt-eH_S-VBLMcRjFcgyvIrENBzA',
});

console.log(asset);
```

## Example Response
```json
[
  {
    publicKey: '8VrqN8b8Y7rqWsUXqUw7dxQw9J5UAoVyb6YDJs1mBCCz',
    header: {
      executable: false,
      owner: 'CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d',
      lamports: [Object],
      rentEpoch: 18446744073709551616n,
      exists: true
    },
    pluginHeader: { key: 3, pluginRegistryOffset: 179n },
    royalties: {
      authority: [Object],
      offset: 138n,
      basisPoints: 500,
      creators: [Array],
      ruleSet: [Object]
    },
    key: 1,
    updateAuthority: {
      type: 'Collection',
      address: 'FgEKkVTSfLQ7a7BFuApypy4KaTLh65oeNRn2jZ6fiBav'
    },
    name: 'Number 1',
    uri: 'https://arweave.net/TkklLLQKiO9t9_JPmt-eH_S-VBLMcRjFcgyvIrENBzA',
    content: {
      '$schema': 'https://schema.metaplex.com/nft1.0.json',
      json_uri: 'https://arweave.net/TkklLLQKiO9t9_JPmt-eH_S-VBLMcRjFcgyvIrENBzA',
      files: [Array],
      metadata: [Object],
      links: [Object]
    },
    owner: 'AUtnbwWJQfYZjJ5Mc6go9UancufcAuyqUZzR1jSe4esx',
    seq: { __option: 'None' }
  }
]
```

## Parameters

| Name                | Required | Description                                |
| ------------------- | :------: | ------------------------------------------ |
| `negate`            |          | Indicates whether the search criteria should be inverted or not.  |
| `conditionType`     |          | Indicates whether to retrieve all (`"all"`) or any (`"any"`) asset that matches the search criteria.  |
| `interface`         |          | The interface value (one of `["V1_NFT", "V1_PRINT" "LEGACY_NFT", "V2_NFT", "FungibleAsset", "Custom", "Identity", "Executable"]`).  |
| `ownerAddress`      |          | The address of the owner.  |
| `ownerType`         |          | Type of ownership `["single", "token"]`.  |
| `creatorAddress`    |          | The address of the creator.  |
| `creatorVerified`   |          | Indicates whether the creator must be verified or not.  |
| `authorityAddress`  |          | The address of the authority.  |
| `grouping`          |          | The grouping `["key", "value"]` pair.  |
| `delegateAddress`   |          | The address of the delegate.  |
| `frozen`            |          | Indicates whether the asset is frozen or not.  |
| `supply`            |          | The supply of the asset.  |
| `supplyMint`        |          | The address of the supply mint.  |
| `compressed`        |          | Indicates whether the asset is compressed or not.  |
| `compressible`      |          | Indicates whether the asset is compressible or not.  |
| `royaltyTargetType` |          | Type of royalty `["creators", "fanout", "single"]`.  |
| `royaltyTarget`     |          | The target address for royalties.  |
| `royaltyAmount`     |          | The royalties amount.  |
| `burnt`             |          | Indicates whether the asset is burnt or not.  |
| `sortBy`            |          | Sorting criteria. This is specified as an object `{ sortBy: <value>, sortDirection: <value> }`, where `sortBy` is one of `["created", "updated", "recentAction", "none"]` and `sortDirection` is one of `["asc", "desc"]`.     |
| `limit`             |          | The maximum number of assets to retrieve.  |
| `page`              |          | The index of the "page" to retrieve.       |
| `before`            |          | Retrieve assets before the specified ID.   |
| `after`             |          | Retrieve assets after the specified ID.    |
| `jsonUri`           |          | The value for the JSON URI.  |

Technically the function accepts all the above parameters since they are inherited from the standard DAS package. Some of them are not recommended to use though, e.g. the package filters the `interface` for MPL Core either way. 
