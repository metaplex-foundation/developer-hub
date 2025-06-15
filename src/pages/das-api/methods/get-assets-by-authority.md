---
title: Get Assets By Authority
metaTitle: Get Assets By Authority | DAS API
description: Returns the list of assets given an authority address
tableOfContents: false
---

Returns the list of assets given an authority address.

## Parameters

| Name               | Required | Description                                |
| ------------------ | :------: | ------------------------------------------ |
| `authorityAddress` |    ✅    | The address of the authority of the assets.|
| `sortBy`           |          | Sorting criteria. This is specified as an object `{ sortBy: <value>, sortDirection: <value> }`, where `sortBy` is one of `["created", "updated", "recentAction", "none"]` and `sortDirection` is one of `["asc", "desc"]`     |
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
const authority = publicKey('mRdta4rc2RtsxEUDYuvKLamMZAdW6qHcwuq866Skxxv');

const assets = await umi.rpc.getAssetsByAuthority(
  { 
    authority,
    sortBy, // optional
    limit, // optional
    page, // optional
    before, // optional
    after, // optional
  }
);
console.log(assets.items.length > 0);
```

{% /totem %}

## Playground

{% apiRenderer method="getAssetsByAuthority" /%}