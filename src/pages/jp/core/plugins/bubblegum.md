---
title: Bubblegumプラグイン
metaTitle: Bubblegumプラグイン | Core Plugins
description: Bubblegumプラグインを使って、圧縮NFT向けに使用できるコレクションを作成する方法を学びます。
---

`Bubblegum`プラグインは「権限管理型（Authority Managed）」プラグインで、圧縮NFTで利用できるコレクションを作成できます。

このプラグインは`MPL Core Collections`でのみ使用できます。

## 対応状況

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ❌  |
| MPL Core Collection | ✅  |

## 引数

`Bubblegum`プラグインに引数は不要です。

## Bubblegumプラグイン付きコレクションの作成（コード例）

{% dialect-switcher title="Bubblegumプラグイン付きコレクションの作成" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { createCollection } from '@metaplex-foundation/mpl-core'
import { generateSigner } from '@metaplex-foundation/umi'

const collectionSigner = generateSigner(umi)

await createCollection(umi, {
  collection: collectionSigner,
  name: 'My Collection',
  uri: 'https://example.com/my-nft.json',
  plugins: [
    {
      type: 'BubblegumV2',
    },
  ],
})
```

{% /dialect %}
{% /dialect-switcher %}

## 既存コレクションへBubblegumプラグインを追加（コード例）

{% dialect-switcher title="コレクションへBubblegumプラグインを追加" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { addCollectionPlugin } from '@metaplex-foundation/mpl-core'

await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'BubblegumV2',
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

