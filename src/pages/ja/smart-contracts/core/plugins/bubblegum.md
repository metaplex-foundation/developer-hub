---
title: Bubblegum プラグイン
metaTitle: Bubblegum プラグイン | Core Plugins
description: Bubblegum プラグインを使用して圧縮 NFT に対応した Collection を作成する方法を学びます。
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
`Bubblegum` プラグインは、圧縮 NFT に使用できる Collection を作成できる `Authority Managed` プラグインです。 {% .lead %}
このプラグインは `MPL Core Collection` でのみ使用できます。

## 対応状況

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ❌  |
| MPL Core Collection | ✅  |

## 引数

`Bubblegum` プラグインは引数を必要としません。

## Bubblegum プラグインを使用した Collection の作成コード例

{% dialect-switcher title="Bubblegum プラグインを使用した Collection の作成" %}
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

## Collection に Bubblegum プラグインを追加するコード例

{% dialect-switcher title="Collection に Bubblegum プラグインを追加" %}
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
