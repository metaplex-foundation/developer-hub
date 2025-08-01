---
title: Get Assets
metaTitle: Get Assets | DAS API
description: Returns the information of multiple compressed/standard assets
tableOfContents: false
---

Returns the information of multiple compressed/standard assets including their metadata and owners.

## Parameters

| Name  | Required | Description            |
| ----- | :------: | ---------------------- |
| `ids` |    ✅    | An array of asset ids. |
| `options` |          | Display options object. See [Display Options](/das-api/display-options) for details. |

## Playground

{% apiRenderer method="getAssets" /%}
