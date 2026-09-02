---
title: Get Grouping (Core Extension)
metaTitle: Get Grouping | DAS API Core Extension
description: Return group name and indexed member count for a collection or mpl-core GroupV1.
created: '07-22-2026'
updated: '07-22-2026'
keywords:
  - das getGrouping core extension
  - mpl-core-das getGrouping
  - group size
about:
  - DAS API
  - MPL Core
  - Core Groups
---

## Summary

`das.getGrouping` returns summary metadata for a group key/value pair without listing every member.

- Returns `group_key`, `group_name`, and `group_size`
- Use `groupKey: "collection"` for collections or `groupKey: "group"` for [GroupV1](/smart-contracts/core/groups)
- To list members, use [`getAssetsByGroup`](/dev-tools/das-api/core-extension/methods/get-assets-by-group) (Core) or the [base DAS method](/dev-tools/das-api/methods/get-grouping)

## Code example

{% code-tabs-imported from="das-api/core-extension/get-grouping" frameworks="umi" /%}

## Parameters

| Name         | Required | Description |
| ------------ | :------: | ----------- |
| `groupKey`   |    ✅    | `"collection"` or `"group"`. |
| `groupValue` |    ✅    | Collection or GroupV1 address (string or public key). |

## Notes

- `group_size` reflects what the indexer has recorded, not necessarily live on-chain vector lengths.
- Requires DAS client ≥ 2.1.0 and RPC support for `getGrouping`.
