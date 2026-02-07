---
title: Bubblegum 플러그인
metaTitle: Bubblegum 플러그인 | Core Plugins
description: Bubblegum 플러그인을 사용하여 압축 NFT에 사용할 수 있는 Collection을 만드는 방법을 알아보세요.
updated: '01-31-2026'
keywords:
  - Bubblegum plugin
  - compressed NFT
  - cNFT collection
  - merkle tree
about:
  - Compressed NFTs
  - Bubblegum integration
  - Collection setup
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
---
`Bubblegum` 플러그인은 압축 NFT에 사용할 수 있는 Collection을 만들 수 있는 `Authority Managed` 플러그인입니다. {% .lead %}
이 플러그인은 `MPL Core Collection`에서만 사용할 수 있습니다.
## 호환성
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ❌  |
| MPL Core Collection | ✅  |
## 인자
`Bubblegum` 플러그인은 인자가 필요하지 않습니다.
## Bubblegum 플러그인을 사용한 Collection 생성 코드 예제
{% dialect-switcher title="Bubblegum 플러그인을 사용한 Collection 생성" %}
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
## Collection에 Bubblegum 플러그인 추가 코드 예제
{% dialect-switcher title="Collection에 Bubblegum 플러그인 추가" %}
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
