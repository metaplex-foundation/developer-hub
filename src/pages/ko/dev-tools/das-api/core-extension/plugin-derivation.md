---
title: 플러그인 파생
metaTitle: DAS API Core 확장 - 플러그인 파생
description: 수동 파생 또는 자동 파생 비활성화
---

Core DAS 확장은 플러그인과 상속된 플러그인을 자동으로 파생할 수 있습니다. 이를 완전히 비활성화하거나 대신 수동으로 파생하려는 경우 다음 코드 스니펫이 도움이 될 수 있습니다.

## 플러그인 파생 비활성화

자동 파생을 비활성화하려면 다음과 같이 모든 함수에서 `skipDerivePlugins`를 사용할 수 있습니다:

```js
const assetsByOwner = await das.getAssetsByOwner(umi, {
  owner: publicKey('<ownerPublicKey>'),
  skipDerivePlugins: true,
});
```

## 수동 플러그인 파생

이전에 mpl-core JavaScript SDK를 사용하여 컬렉션을 이미 페칭한 경우 다음과 같이 자산의 플러그인을 수동으로 파생할 수도 있습니다:

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
