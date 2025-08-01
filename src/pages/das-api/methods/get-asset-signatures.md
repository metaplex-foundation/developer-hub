---
title: Get Asset Signatures
metaTitle: Get Asset Signatures | DAS API
description: Returns the transaction signatures for compressed assets
tableOfContents: false
---

Returns the transaction signatures associated with a compressed asset. You can identify the asset either by its ID or by its tree and leaf index.

## Parameters

| Name            | Required | Description                                |
| --------------- | :------: | ------------------------------------------ |
| `assetId`       |    ✅ (or tree + leafIndex)   | The id of the asset.                       |
| `tree`          |    ✅ (or assetId)    | The tree corresponding to the leaf.        |
| `leafIndex`     |    ✅ (or assetId)    | The leaf index of the asset.               |
| `limit`         |          | The maximum number of signatures to retrieve. |
| `page`          |          | The index of the "page" to retrieve.        |
| `before`        |          | Retrieve signatures before the specified signature. |
| `after`         |          | Retrieve signatures after the specified signature. |
| `cursor`        |          | The cursor of the signatures.               |
| `sortDirection` |          | Sort direction. Can be either "asc" or "desc". |

## Playground

{% apiRenderer method="getAssetSignatures" /%}