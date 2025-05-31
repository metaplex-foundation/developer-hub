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

## UMI w/ DAS SDK

{% totem %}

```js
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const umi = createUmi('<ENDPOINT>').use(dasApi());
const assetId = publicKey('8TrvJBRa6Pzb9BDadqroHhWTHxaxK8Ws8r91oZ2jxaVV');

const asset = await umi.rpc.getAsset(assetId);
console.log(asset);
```

{% /totem %}

## Playground

{% apiRenderer method="getAsset" /%}