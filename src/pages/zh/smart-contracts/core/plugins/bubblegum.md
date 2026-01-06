---
title: Bubblegum 插件
metaTitle: Bubblegum 插件 | Core 插件
description: 了解如何使用 Bubblegum 插件创建可用于压缩 NFT 的集合。
---

`Bubblegum` 插件是一个`权限管理`插件，允许您创建可用于压缩 NFT 的集合。


此插件只能用于 `MPL Core 集合`。

## 适用于

|                     |     |
| ------------------- | --- |
| MPL Core 资产      | ❌  |
| MPL Core 集合 | ✅  |

## 参数

`Bubblegum` 插件不需要任何参数。

## 使用 Bubblegum 插件创建集合代码示例

{% dialect-switcher title="使用 Bubblegum 插件创建集合" %}
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


## 向集合添加 Bubblegum 插件代码示例

{% dialect-switcher title="向集合添加 Bubblegum 插件" %}
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
