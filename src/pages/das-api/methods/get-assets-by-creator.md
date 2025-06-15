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


## UMI w/ DAS SDK

{% totem %}

```js
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const umi = createUmi('<ENDPOINT>').use(dasApi());
const creator = publicKey('D3XrkNZz6wx6cofot7Zohsf2KSsu2ArngNk8VqU9cTY3');

const assets = await umi.rpc.getAssetsByCreator({
    creator,
    onlyVerified: true,
    limit: 10,
});
console.log(assets.items.length > 0);
```

{% /totem %}

## Playground

{% apiRenderer method="getAssetsByCreator" /%}