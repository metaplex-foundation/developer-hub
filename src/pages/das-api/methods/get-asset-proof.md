---
title: Get Asset Proof
metaTitle: Get Asset Proof | DAS API
description: Returns the merkle tree proof information for a compressed asset
tableOfContents: false
---

Returns the merkle tree proof information for a compressed asset.

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
const assetId = publicKey('Ez6ezCMkRaUkWS5v6WVcP7uuCWiKadr3W2dHFkoZmteW');

const proof = await umi.rpc.getAssetProof(assetId);
console.log(proof);
```

{% /totem %}


## Playground

{% apiRenderer method="getAssetProof" /%}