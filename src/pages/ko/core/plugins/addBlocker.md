---
title: addBlocker 플러그인
metaTitle: addBlocker 플러그인 | Core 플러그인
description: Metaplex Core 패키지를 사용하여 Core NFT 애셋 및 컬렉션에 추가 플러그인 추가를 차단하는 방법을 알아보세요.
---

`addBlocker` 플러그인은 추가 권한 관리 플러그인의 추가를 금지할 수 있는 `권한 관리` 플러그인입니다. 이는 권한으로서 미래에 필요할 수 있는 모든 플러그인이 미리 추가되었는지 확실히 해야 함을 의미합니다. 새로운 기능인 플러그인도 추가할 수 없습니다. 이는 업데이트 권한에 의해서만 추가할 수 있습니다.

이에 대한 **예외**는 전송 및 동결 위임 플러그인과 같은 애셋의 사용자 관리 플러그인입니다. 이들은 `addBlocker`가 추가된 후에도 항상 추가할 수 있습니다.

이 플러그인은 `MPL Core 애셋`과 `MPL Core 컬렉션` 모두에서 사용할 수 있습니다.

[royalties](/core/plugins/royalties)와 같은 다른 플러그인과 마찬가지로, MPL Core 컬렉션에 할당되면 MPL Core 애셋에서도 사용됩니다. 따라서 컬렉션에 추가되면 애셋에도 더 이상 플러그인을 추가할 수 없습니다.

## 호환성

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## 인수

`addBlocker` 플러그인은 인수가 필요하지 않습니다.

## 애셋에 addBlocker 플러그인 추가하기 코드 예제

{% dialect-switcher title="MPL Core 애셋에 addBlocker 플러그인 추가하기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  addPlugin,
} from '@metaplex-foundation/mpl-core'

await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'addBlocker',
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 컬렉션에 addBlocker 플러그인 추가하기 코드 예제

{% dialect-switcher title="컬렉션에 addBlocker 플러그인 추가하기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  addCollectionPlugin,
} from '@metaplex-foundation/mpl-core'

await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'addBlocker',
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}