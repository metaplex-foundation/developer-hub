---
title: addBlocker 插件
metaTitle: addBlocker 插件 | Core 插件
description: 了解如何使用 Metaplex Core 包阻止向 Core NFT 资产和集合添加额外的插件。
---

`addBlocker` 插件是一个`权限管理`插件，允许禁止添加额外的权限管理插件。这意味着作为权限方，您必须确保在此之前已添加所有您将来可能需要的插件。即使是作为新功能的插件也无法添加。它只能由更新权限添加。

**例外**情况是资产的用户管理插件，如转移和冻结委托插件。这些始终可以添加，即使在添加 `addBlocker` 之后也是如此。

此插件可以用于 `MPL Core 资产`和 `MPL Core 集合`。

与其他插件一样，如[版税](/zh/smart-contracts/core/plugins/royalties)，当它被分配给 MPL Core 集合时，MPL Core 资产也会使用它。因此，如果将其添加到集合，则也无法再向资产添加插件。

## 适用于

|                     |     |
| ------------------- | --- |
| MPL Core 资产      | ✅  |
| MPL Core 集合 | ✅  |

## 参数

`addBlocker` 插件不需要任何参数。

## 向资产添加 addBlocker 插件代码示例

{% dialect-switcher title="向 MPL Core 资产添加 addBlocker 插件" %}
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

## 向集合添加 addBlocker 插件代码示例

{% dialect-switcher title="向集合添加 addBlocker 插件" %}
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
