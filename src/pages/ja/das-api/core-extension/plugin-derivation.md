---
title: ×é°¤óú
metaTitle: DAS API Core á5_ı - ×é°¤óú
description: KÕgúY‹KêÕú’!¹Y‹
---

Core DAS á5_ıo×é°¤óh™UŒ_×é°¤ó’êÕ„kúgM~YSŒ’Œhk!¹W_ŠãŠkKÕgúW_D4oån³üÉ¹ËÚÃÈLyËa~Y

## ×é°¤óún!¹
SnêÕú’!¹W_D4oYyfn¢pg!nˆFk `skipDerivePlugins` ’(gM~Y:

```js
const assetsByOwner = await das.getAssetsByOwner(umi, {
  owner: publicKey('<ownerPublicKey>'),
  skipDerivePlugins: true,
});
```

## KÕ×é°¤óú
åMk³ì¯·çó’Ö—n4mpl-core JavaScript SDK ’(Wf¢»ÃÈn×é°¤ó’KÕgúY‹Sh‚gM~Y:

```js
import { deriveAssetPlugins } from '@metaplex-foundation/mpl-core'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import { das }  from '@metaplex-foundation/mpl-core-das';
import { publicKey } from '@metaplex-foundation/umi';

const umi = createUmi('<ENDPOINT>').use(dasApi());
const collectionId = publicKey('<PublicKey>');
//...

const collection = await das.getCollection(umi, collectionId);
const assetsByCollection = await das.getAssetsByCollection(umi, {
  collection: collection.publicKey,
  skipDerivePlugins: true,
});

const derivedAssets = assetsByCollection.map((asset) => deriveAssetPlugins(asset, collection))
```
