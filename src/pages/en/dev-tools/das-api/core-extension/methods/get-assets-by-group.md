---
title: Get Core Assets by Group
metaTitle: Get Core Assets by Group | DAS API Core Extension
description: List mpl-core GroupV1 members as Core-typed assets, collections, or nested groups.
created: '07-22-2026'
updated: '07-22-2026'
keywords:
  - das getAssetsByGroup core
  - mpl-core-das getAssetsByGroup
  - core group members
  - groupKey group
about:
  - DAS API
  - MPL Core
  - Core Groups
proficiencyLevel: Intermediate
---

## Summary

`das.getAssetsByGroup` lists members of an [mpl-core GroupV1](/smart-contracts/core/groups) and returns Core-typed results.

- Calls base DAS with `groupKey: "group"`
- Members may be assets, collections, or nested groups
- Derives collection plugins on assets unless `skipDerivePlugins: true`
- For name and size only, use [`getGrouping`](/dev-tools/das-api/core-extension/methods/get-grouping)

## Code example

`das.getAssetsByGroup` takes the Umi instance and a `GroupV1` address, and returns the group's members as Core-typed results.

Replace `<ENDPOINT>` with your DAS RPC and `<PublicKey>` with the GroupV1 address.

{% code-tabs-imported from="das-api/core-extension/get-assets-by-group" frameworks="umi" /%}

## Parameters

The helper accepts the Umi instance followed by an options object.

| Name                 | Required | Description |
| -------------------- | :------: | ----------- |
| `group`              |    ✅    | The mpl-core GroupV1 public key. |
| `sortBy`             |          | Sorting criteria `{ sortBy, sortDirection }`. |
| `limit`              |          | Maximum number of items to retrieve. |
| `page`               |          | Page index to retrieve. |
| `before` / `after`   |          | Cursor-style pagination IDs. |
| `cursor`             |          | Provider cursor when supported. |
| `displayOptions`     |          | Only `showCollectionMetadata` is supported for Core. |
| `skipDerivePlugins`  |          | Skip automatic collection plugin derivation on assets. |

## Notes

- This is the Core helper for GroupV1 membership. For Token Metadata / collection grouping via base DAS, see [`getAssetsByGroup`](/dev-tools/das-api/methods/get-assets-by-group) with `groupKey: "collection"`.
- Requires `@metaplex-foundation/digital-asset-standard-api` ≥ 2.1.0 and an RPC that indexes Core groups.
