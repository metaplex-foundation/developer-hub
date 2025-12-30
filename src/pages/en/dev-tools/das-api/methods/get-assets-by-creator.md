---
title: Get Assets By Creator
metaTitle: Get Assets By Creator | DAS API
description: Returns the list of assets given a creator address
tableOfContents: false
---

Return the list of assets given a creator address.

{% callout %}
We recommend to fetch data with `onlyVerified: true` to make sure the asset actually belongs to that creator.
{% /callout %}

## Parameters

| Name               | Required | Description                                |
| ------------------ | :------: | ------------------------------------------ |
| `creatorAddress`   |    ✅    | The address of the creator of the assets.  |
| `onlyVerified`     |          | Indicates whether to retrieve only verified assets or not.  |
| `sortBy`           |          | Sorting criteria. This is specified as an object `{ sortBy: <value>, sortDirection: <value> }`, where `sortBy` is one of `["created", "updated", "recentAction", "id", "none"]` and `sortDirection` is one of `["asc", "desc"]`     |
| `limit`            |          | The maximum number of assets to retrieve.  |
| `page`             |          | The index of the "page" to retrieve.       |
| `before`           |          | Retrieve assets before the specified ID.   |
| `after`            |          | Retrieve assets after the specified ID.    |
| `options`          |          | Display options object. See [Display Options](/dev-tools/das-api/display-options) for details. |

## Playground

{% apiRenderer method="getAssetsByCreator" /%}