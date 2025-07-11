---
title: Get Assets By Group
metaTitle: Get Assets By Group | DAS API
description: Return the list of assets given a group (key, value) pair
tableOfContents: false
---

Return the list of assets given a group (key, value) pair. For example this can be used to get all assets in a collection.

## Parameters

| Name               | Required | Description                                |
| ------------------ | :------: | ------------------------------------------ |
| `groupKey`         |    ✅    | The key of the group (e.g., `"collection"`).  |
| `groupValue`       |    ✅    | The value of the group.  |
| `sortBy`           |          | Sorting criteria. This is specified as an object `{ sortBy: <value>, sortDirection: <value> }`, where `sortBy` is one of `["created", "updated", "recentAction", "id", "none"]` and `sortDirection` is one of `["asc", "desc"]`     |
| `limit`            |          | The maximum number of assets to retrieve.  |
| `page`             |          | The index of the "page" to retrieve.       |
| `before`           |          | Retrieve assets before the specified ID.   |
| `after`            |          | Retrieve assets after the specified ID.    |
| `options`          |          | Display options object. See [Display Options](/das-api/display-options) for details. |

## Playground

{% apiRenderer method="getAssetsByGroup" /%}