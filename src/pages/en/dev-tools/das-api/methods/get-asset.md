---
title: Get Asset
metaTitle: Get Asset | DAS API
description: Returns the information of a compressed/standard asset
tableOfContents: false
---

Returns the information of a compressed/standard asset including metadata and owner.

## Parameters

| Name            | Required | Description                                |
| --------------- | :------: | ------------------------------------------ |
| `id`            |    ✅    | The id of the asset.                       |
| `options`       |          | Display options object. See [Display Options](/dev-tools/das-api/display-options) for details. |

## Playground

{% apiRenderer method="getAsset" /%}