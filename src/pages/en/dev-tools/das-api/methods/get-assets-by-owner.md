---
title: Get Assets By Owner
metaTitle: Get Assets By Owner | DAS API
description: Return the list of assets given an owner address
tableOfContents: false
---

Return the list of assets given an owner address.

## Parameters

| Name               | Required | Description                                |
| ------------------ | :------: | ------------------------------------------ |
| `ownerAddress`     |    ✅    | The address of the owner of the assets.    |
| `sortBy`           |          | Sorting criteria. This is specified as an object `{ sortBy: <value>, sortDirection: <value> }`, where `sortBy` is one of `["created", "updated", "recentAction", "id", "none"]` and `sortDirection` is one of `["asc", "desc"]`     |
| `limit`            |          | The maximum number of assets to retrieve.  |
| `page`             |          | The index of the "page" to retrieve.       |
| `before`           |          | Retrieve assets before the specified ID.   |
| `after`            |          | Retrieve assets after the specified ID.    |
| `options`          |          | Display options object. See [Display Options](/dev-tools/das-api/display-options) for details. |

## Playground

{% apiRenderer method="getAssetsByOwner" /%}
