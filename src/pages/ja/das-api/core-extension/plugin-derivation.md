---
title: �鰤��
metaTitle: DAS API Core �5_� - �鰤��
description: K�g�Y�K����!�Y�
---

Core DAS �5_�o�鰤�h�U�_�鰤��Մk�gM~YS���hk!�W_�㏊kK�g�W_D4o�n��ɹ����Ly�a~Y

## �鰤��n!�
Sn����!�W_D4oYyfn�pg!n�Fk `skipDerivePlugins` �(gM~Y:

```js
const assetsByOwner = await das.getAssetsByOwner(umi, {
  owner: publicKey('<ownerPublicKey>'),
  skipDerivePlugins: true,
});
```

## K��鰤��
�Mk�쯷��֗n4mpl-core JavaScript SDK �(Wf����n�鰤�K�g�Y�Sh�gM~Y:

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
