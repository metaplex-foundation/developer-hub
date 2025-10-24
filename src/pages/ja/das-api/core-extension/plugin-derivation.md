---
title: プラグイン派生
metaTitle: DAS API Core 拡張機能 - プラグイン派生
description: 手動で派生または自動派生を無効化
---

Core DAS 拡張機能は、プラグインと継承されたプラグインを自動的に派生できます。これを完全に無効化したい場合、または手動で派生したい場合は、次のコードスニペットが役立つかもしれません。

## プラグイン派生を無効化
この自動派生を無効化したい場合、すべての関数で次のように `skipDerivePlugins` を使用できます：

```js
const assetsByOwner = await das.getAssetsByOwner(umi, {
  owner: publicKey('<ownerPublicKey>'),
  skipDerivePlugins: true,
});
```

## 手動プラグイン派生
以前にコレクションを取得している場合、mpl-core JavaScript SDKを使用して、次のようにアセットのプラグインを手動で派生することもできます：

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
