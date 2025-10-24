---
title: Bubblegum 플러그인
metaTitle: Bubblegum 플러그인 | Core 플러그인
description: Bubblegum 플러그인을 사용하여 압축 NFT에 사용할 수 있는 컬렉션을 생성하는 방법을 알아보세요.
---

`Bubblegum` 플러그인은 압축 NFT에 사용할 수 있는 컬렉션을 생성할 수 있도록 하는 `권한 관리` 플러그인입니다.

이 플러그인은 `MPL Core 컬렉션`에서만 사용할 수 있습니다.

## 호환성

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ❌  |
| MPL Core Collection | ✅  |

## 인수

`Bubblegum` 플러그인은 인수가 필요하지 않습니다.

## Bubblegum 플러그인으로 컬렉션 생성하기 코드 예제

{% dialect-switcher title="Bubblegum 플러그인으로 컬렉션 생성하기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  createCollection,
} from '@metaplex-foundation/mpl-core';
import {
  generateSigner,
} from '@metaplex-foundation/umi';

const collectionSigner = generateSigner(umi);

await createCollection(umi, {
    collection: collectionSigner,
    name: "My Collection",
    uri: "https://example.com/my-nft.json",
    plugins: [
      {
        type: "BubblegumV2",
      },
    ],
  })
```

{% /dialect %}
{% /dialect-switcher %}


## 컬렉션에 Bubblegum 플러그인 추가하기 코드 예제

{% dialect-switcher title="컬렉션에 Bubblegum 플러그인 추가하기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  addCollectionPlugin,
} from '@metaplex-foundation/mpl-core';

await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: "BubblegumV2",
  },
}).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}