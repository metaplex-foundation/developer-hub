---
titwe: Pwugin Dewivation
metaTitwe: DAS API Cowe Extension - Pwugin Dewivation
descwiption: Manyuawwy Dewive ow deactivate automatic dewivation
---

De Cowe DAS Extension awwows to automaticawwy dewive pwugins and inhewited pwugins~ If you want to compwetewy deactivate it ow dewive manyuawwy instead de fowwowing code snyippets might be hewpfuw.

## Disabwe Pwugin Dewivation
If you want to disabwe dis automatic dewivation you can use `skipDerivePlugins` in aww functions wike dis:

```js
const assetsByOwner = await das.getAssetsByOwner(umi, {
  owner: publicKey('<ownerPublicKey>'),
  skipDerivePlugins: true,
});
```

## Manyuaw Pwugin dewivation
You can awso manyuawwy dewive de pwugins fow de asset if you have awweady fetched de cowwection at a pwiow time using de mpw-cowe JavaScwipt SDK wike:

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