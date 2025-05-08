---
title: Get Asset Proofs
metaTitle: Get Asset Proofs | DAS API
description: Returns the merkle tree proof information for multiple compressed assets
tableOfContents: false
---

Returns the merkle tree proof information for multiple compressed assets. This method is used to verify the authenticity of compressed NFTs by retrieving their merkle proofs.

## Parameters

| Name            | Required | Description                                |
| --------------- | :------: | ------------------------------------------ |
| `ids`           |    ✅    | An array of asset ids to get proofs for.   |

## UMI w/ DAS SDK

{% totem %}

```js
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const umi = createUmi('<ENDPOINT>').use(dasApi());
const assetIds = [
  publicKey('GGRbPQhwmo3dXBkJSAjMFc1QYTKGBt8qc11tTp3LkEKA'),
  publicKey('ELDjRRs5Wb478K4h3B5bMPEhqFD8FvoET5ctHku5uiYi')
];

const assets = await umi.rpc.getAssetProofs(assetIds);
console.log(assets);
```

{% /totem %}


## Playground

{% apiRenderer method="getAssetProofs" /%}