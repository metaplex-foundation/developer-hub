---
title: Bubblegum 插件
metaTitle: Bubblegum 插件 | Core Plugins
description: 了解如何使用 Bubblegum 插件创建可用于压缩 NFT 的 Collection。
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
`Bubblegum` 插件是一个 `Authority Managed` 插件，允许您创建可用于压缩 NFT 的 Collection。 {% .lead %}
此插件只能在 `MPL Core Collection` 上使用。
## 兼容性
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ❌  |
| MPL Core Collection | ✅  |
## 参数
`Bubblegum` 插件不需要任何参数。
## 使用 Bubblegum 插件创建 Collection 代码示例
{% dialect-switcher title="使用 Bubblegum 插件创建 Collection" %}
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
## 向 Collection 添加 Bubblegum 插件代码示例
{% dialect-switcher title="向 Collection 添加 Bubblegum 插件" %}
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
