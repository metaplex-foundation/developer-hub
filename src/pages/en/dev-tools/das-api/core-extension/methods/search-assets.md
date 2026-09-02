---
title: Search Core Assets
metaTitle: Search Core Assets | DAS API Core Extension
description: Search MPL Core assets via DAS, including agent discovery filters.
created: '07-22-2026'
updated: '07-22-2026'
keywords:
  - das searchAssets core
  - mpl-core-das searchAssets
  - isAgent agentToken assetSigner
about:
  - DAS API
  - MPL Core
  - Agent Registry
---

## Summary

`das.searchAssets` returns Core [assets](/smart-contracts/core/what-is-an-asset) matching search criteria and maps them to [`AssetResult`](/dev-tools/das-api/core-extension/methods/get-asset) (Core asset type plus DAS `content`).

- Defaults to `interface: "MplCoreAsset"` and `burnt: false`
- Derives collection plugins unless `skipDerivePlugins: true`
- Supports [agent](/agents/) filters (`isAgent`, `agentToken`, `assetSigner`) when using DAS ≥ 2.1.0

## Code example

In this example two filters are applied:
1. The Public Key of the Owner
2. The Metadata URI `jsonUri`

{% code-tabs-imported from="das-api/core-extension/search-assets" frameworks="umi" /%}

### Discover registered agents

`das.searchAssets({ isAgent: true })` finds Core assets with a registered [agent](/agents/) identity and may populate `is_agent`, `agent_token`, and `asset_signer` when indexed.

{% code-tabs-imported from="das-api/core-extension/search-assets-agents" frameworks="umi" /%}

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
| `interface`         |          | Defaults to `MplCoreAsset`. Also accepts `MplCoreCollection` / `MplCoreGroup` via dedicated helpers.  |
| `owner`             |          | The address of the owner.  |
| `ownerType`         |          | Type of ownership `["single", "token"]`.  |
| `creator`           |          | The address of the creator.  |
| `creatorVerified`   |          | Indicates whether the creator must be verified or not.  |
| `authority`         |          | The address of the authority.  |
| `grouping`          |          | The grouping `["key", "value"]` pair (e.g. `["collection", "<pubkey>"]` or `["group", "<pubkey>"]`).  |
| `delegate`          |          | The address of the delegate.  |
| `frozen`            |          | Indicates whether the asset is frozen or not.  |
| `supply`            |          | The supply of the asset.  |
| `supplyMint`        |          | The address of the supply mint.  |
| `compressed`        |          | Indicates whether the asset is compressed or not.  |
| `compressible`      |          | Indicates whether the asset is compressible or not.  |
| `royaltyModel`      |          | Type of royalty `["creators", "fanout", "single"]`.  |
| `royaltyTarget`     |          | The target address for royalties.  |
| `royaltyAmount`     |          | The royalties amount.  |
| `burnt`             |          | Forced to `false` by the Core helper.  |
| `sortBy`            |          | Sorting criteria `{ sortBy, sortDirection }`. |
| `limit`             |          | The maximum number of assets to retrieve.  |
| `page`              |          | The index of the "page" to retrieve.       |
| `before`            |          | Retrieve assets before the specified ID.   |
| `after`             |          | Retrieve assets after the specified ID.    |
| `jsonUri`           |          | The value for the JSON URI.  |
| `name`              |          | Asset name filter when supported by the RPC. |
| `isAgent`           |          | Filter by registered agent status (MPL Core only). |
| `agentToken`        |          | Filter by the agent's canonical token mint (MPL Core only). |
| `assetSigner`       |          | Filter by the Core Asset Signer PDA (MPL Core only). |
| `skipDerivePlugins` |          | Skip automatic collection plugin derivation. |
| `displayOptions`    |          | Only `showCollectionMetadata` is supported for Core. |

## Notes

- Technically the helper forwards standard DAS search parameters; some are rarely useful for Core (the package already constrains `interface` / `burnt`).
- Agent filters and response fields require DAS ≥ 2.1.0 and an indexer that populates agent metadata.
