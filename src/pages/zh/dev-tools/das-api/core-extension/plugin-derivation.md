---
title: 插件派生
metaTitle: DAS API Core 扩展 - 插件派生
description: 手动派生或停用自动派生
---

Core DAS 扩展允许自动派生插件和继承的插件。如果您想完全停用它或改为手动派生，以下代码片段可能会有所帮助。

## 禁用插件派生

如果您想禁用此自动派生，可以在所有函数中使用 `skipDerivePlugins`，如下所示：

```js
const assetsByOwner = await das.getAssetsByOwner(umi, {
  owner: publicKey('<ownerPublicKey>'),
  skipDerivePlugins: true,
});
```

## 手动插件派生

如果您之前已经获取了集合，也可以使用 mpl-core JavaScript SDK 手动为资产派生插件，如下所示：

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
