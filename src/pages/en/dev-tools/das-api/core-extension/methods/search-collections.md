---
title: Search Core Collections
metaTitle: Search Core Collections | DAS API Core Extension
description: Return the list of MPL Core Collections given a search criteria
---

## Summary

`das.searchCollections` returns [MPL Core](/smart-contracts/core) collections that match DAS search filters as `CollectionResult` values.

- Filters to `MplCoreCollection` automatically
- Accepts the same search criteria as Core asset search where applicable
- Includes a convenience helper for listing by update authority

## Code example

In this example two filters are applied:
1. The Public Key of the Owner
2. The Metadata uri `jsonUri`

Like this only the Core collections with the given URI owned by that wallet are returned.

Additional possible Parameters can be found [below](#parameters).

{% code-tabs-imported from="das-api/core-extension/search-collections" frameworks="umi" /%}

## By update authority {% #by-update-authority %}

[`das.getCollectionsByUpdateAuthority`](#by-update-authority) is a convenience wrapper around collection search for a given update authority. It returns [`CollectionResult`](/dev-tools/das-api/core-extension/methods/get-collection) values.

{% code-tabs-imported from="das-api/core-extension/get-collections-by-update-authority" frameworks="umi" /%}

| Name                | Required | Description |
| ------------------- | :------: | ----------- |
| `updateAuthority`   |    ✅    | Collection update authority public key. |
| `limit` / `page`    |          | Pagination controls. |
| `displayOptions`    |          | Only `showCollectionMetadata` is supported for Core. |
| `skipDerivePlugins` |          | Accepted for API consistency; collections are not plugin-derived. |

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
