---
title: Get Grouping
metaTitle: Get Grouping | DAS API
description: Return grouping metadata for a group key/value pair, including the group name and indexed member count.
created: '07-02-2026'
updated: '07-06-2026'
keywords:
  - das api getGrouping
  - get grouping metadata
  - group key group value
  - mpl-core groups
  - collection metadata
about:
  - DAS API
  - Group metadata
  - mpl-core GroupV1
proficiencyLevel: Beginner
tableOfContents: false
---

## Summary

The `getGrouping` DAS API method returns metadata for a group key/value pair without listing every member.

- Returns `group_key`, `group_name`, and `group_size` for the queried group
- Use `groupKey: "collection"` for Token Metadata and mpl-core collections
- Use `groupKey: "group"` for [mpl-core GroupV1](/smart-contracts/core) accounts that group collections, assets, and nested groups
- To list individual members, use [`getAssetsByGroup`](/dev-tools/das-api/methods/get-assets-by-group)

## Parameters

| Name         | Required | Description                                                                                    |
| ------------ | :------: | ---------------------------------------------------------------------------------------------- |
| `groupKey`   |    ✅    | The key of the group (e.g., `"collection"` or `"group"` for mpl-core groups).                |
| `groupValue` |    ✅    | The value of the group (e.g., collection or mpl-core group address).                           |

## Response

The response includes:

- `group_key` - The group key that was queried
- `group_name` - Display name for the group when available
- `group_size` - Number of indexed members in the group

## Playground

{% apiRenderer method="getGrouping" /%}

## Notes

- `getGrouping` returns summary metadata only — use [`getAssetsByGroup`](/dev-tools/das-api/methods/get-assets-by-group) to paginate through group members
- `group_size` reflects the number of members indexed by DAS for the given `groupKey`/`groupValue` pair
- For mpl-core GroupV1 groups, indexed members may include collections, assets, and nested groups depending on what the indexer has recorded
