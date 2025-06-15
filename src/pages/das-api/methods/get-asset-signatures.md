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

## UMI w/ DAS SDK

{% totem %}

```js
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const umi = createUmi('<ENDPOINT>').use(dasApi());

const assets = await umi.rpc.getAssetSignatures({
  assetId: publicKey('GGRbPQhwmo3dXBkJSAjMFc1QYTKGBt8qc11tTp3LkEKA'),
  // Optional parameters
  // limit: 10,
  // page: 1,
  // sortDirection: 'desc',
});
console.log(assets);
```

{% /totem %}

## Playground

{% apiRenderer method="getAssetSignatures" /%}