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

## UMI w/ DAS SDK

{% totem %}

```js
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const umi = createUmi('<ENDPOINT>').use(dasApi());
const owner = publicKey('N4f6zftYsuu4yT7icsjLwh4i6pB1zvvKbseHj2NmSQw');

const assets = await umi.rpc.getAssetsByOwner({
    owner,
    limit: 10
});
console.log(assets.items.length > 0);
```

{% /totem %}

## Playground

{% apiRenderer method="getAssetsByOwner" /%}