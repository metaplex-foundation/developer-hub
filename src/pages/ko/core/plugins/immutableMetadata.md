---
title: ImmutableMetadata Plugin
metaTitle: ImmutableMetadata | Core
description: 'ImmutableMetadata' 플러그인은 Core NFT Asset과 Collection의 메타데이터를 불변으로 만듭니다.
---

immutableMetadata Plugin은 메타데이터(이름과 URI)를 불변으로 만들 수 있는 `Authority Managed` 플러그인입니다. 업데이트 권한에 의해서만 추가될 수 있습니다.

이 플러그인은 `MPL Core Asset`과 `MPL Core Collection` 모두에서 사용할 수 있습니다.

[royalties](/core/plugins/royalties)와 같은 다른 플러그인과 마찬가지로 MPL Core Collection에 할당되면 Asset에서도 사용됩니다. 따라서 컬렉션에 추가되면 Asset의 메타데이터도 불변이 됩니다.

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## Arguments

immutableMetadata Plugin은 인수가 필요하지 않습니다.

## Asset에 immutableMetadata Plugin 추가 코드 예시

{% dialect-switcher title="MPL Core Asset에 Immutability Plugin 추가" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  addPlugin,
} from '@metaplex-foundation/mpl-core'

await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'ImmutableMetadata',
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Collection에 immutableMetadata Plugin 추가 코드 예시

{% dialect-switcher title="Collection에 immutableMetadata Plugin 추가" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  addCollectionPlugin,
} from '@metaplex-foundation/mpl-core'

await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'ImmutableMetadata',
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}