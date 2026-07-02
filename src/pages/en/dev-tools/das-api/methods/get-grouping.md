---
title: Get Grouping
metaTitle: Get Grouping | DAS API
description: Return grouping metadata for a group key/value pair
tableOfContents: false
---

Return grouping metadata for a group key/value pair, including the group name and the number of indexed members.

Use `groupKey: "collection"` for Token Metadata and mpl-core collections. Use `groupKey: "group"` for [mpl-core GroupV1](/smart-contracts/core) accounts that group collections, assets, and nested groups together.

## Parameters

| Name         | Required | Description                                                                                    |
| ------------ | :------: | ---------------------------------------------------------------------------------------------- |
| `groupKey`   |    ✅    | The key of the group (e.g., `"collection"` or `"group"` for mpl-core groups).                |
| `groupValue` |    ✅    | The value of the group (e.g., collection or mpl-core group address).                           |

## Response

The response includes:

- `group_key` - The group key that was queried
- `group_name` - Display name for the group when available
- `group_size` - Number of indexed assets in the group

## Playground

{% apiRenderer method="getGrouping" /%}
