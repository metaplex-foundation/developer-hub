---
title: Plugin Derivation
metaTitle: DAS API Core Extension - Plugin Derivation
description: Manually Derive or deactivate automatic derivation
---

The Core DAS Extension allows to automatically derive plugins and inherited plugins. If you want to completely deactivate it or derive manually instead the following code snippets might be helpful.

## Disable Plugin Derivation
If you want to disable this automatic derivation you can use `skipDerivePlugins` in all functions like this:

```js
const assetsByOwner = await das.getAssetsByOwner(umi, {
  owner: publicKey('<ownerPublicKey>'),
  skipDerivePlugins: true,
});
```

## Manual Plugin derivation
You can also manually derive the plugins for the asset if you have already fetched the collection at a prior time using the mpl-core JavaScript SDK like:

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
