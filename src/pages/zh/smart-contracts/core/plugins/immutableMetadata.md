---
title: ImmutableMetadata 插件
metaTitle: ImmutableMetadata | Core
description: "'ImmutableMetadata' 插件使 Core NFT 资产和集合上的元数据不可变。"
---

immutableMetadata 插件是一个`权限管理`插件，允许使元数据（名称和 URI）不可变。它只能由更新权限添加。

此插件可以用于 `MPL Core 资产`和 `MPL Core 集合`。

与其他插件一样，如[版税](/zh/smart-contracts/core/plugins/royalties)，当它被分配给 MPL Core 集合时，MPL Core 资产也会使用它。因此，如果将其添加到集合，资产的元数据也会变得不可变。

## 适用于

|                     |     |
| ------------------- | --- |
| MPL Core 资产      | ✅  |
| MPL Core 集合 | ✅  |

## 参数

immutableMetadata 插件不需要任何参数。

## 向资产添加 immutableMetadata 插件代码示例

{% dialect-switcher title="向 MPL Core 资产添加不可变性插件" %}
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

## 向集合添加 immutableMetadata 插件代码示例

{% dialect-switcher title="向集合添加 immutableMetadata 插件" %}
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
