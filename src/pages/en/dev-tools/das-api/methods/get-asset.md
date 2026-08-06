---
title: Get Asset
metaTitle: Get Asset | DAS API
description: Returns the information of a compressed/standard asset
tableOfContents: false
---

Returns the information of a compressed/standard asset including metadata and owner.

For Bubblegum V2 cNFTs that inherit seller fees from an MPL-Core collection, collection-resolved display values are on `royalty.basis_points` / `creators`, and leaf values are on `royalty.basis_points_raw` / `creators_raw` (with `royalty.sfbp_inherited: true`). See [Reading Inherited Royalties](/smart-contracts/bubblegum-v2/reading-inherited-royalties).

## Parameters

| Name            | Required | Description                                |
| --------------- | :------: | ------------------------------------------ |
| `id`            |    ✅    | The id of the asset.                       |
| `options`       |          | Display options object. See [Display Options](/dev-tools/das-api/display-options) for details. |

## Playground

{% apiRenderer method="getAsset" /%}
