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

## UMI w/ DAS SDK

{% totem %}

```js
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())
const assetIds = [
  publicKey('GGRbPQhwmo3dXBkJSAjMFc1QYTKGBt8qc11tTp3LkEKA'),
  publicKey('8bFQbnBrzeiYQabEJ1ghy5T7uFpqFzPjUGsVi3SzSMHB'),
]

const assets = await umi.rpc.getAssets(assetIds)
console.log(assets)
```

{% /totem %}

## Playground

{% apiRenderer method="getAssets" /%}
