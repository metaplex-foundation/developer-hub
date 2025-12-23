---
title: 签名插件
metaTitle: 签名插件 | Core
description: 了解如何向 Core NFT 资产或集合添加您的签名和消息。
---

`autograph` 插件是一个`所有者管理`插件，允许人们向资产或集合添加签名和消息。

`更新权限`可以在铸造时添加插件。之后只有所有者可以添加它。任何签名都可以由所有者或签名委托再次移除。签名者不能移除自己的签名，除非他们同时是所有者或签名委托。

要添加签名，必须满足一些条件：

- 签名插件必须已经添加。
- 签名者只能添加自己的地址。
- 必须使用 `updatePlugin` 函数传递现有列表以及添加的签名。
- 该签名者尚未有现有的签名。

{% callout type="note" %}
一旦所有者添加了签名插件，每个人都可以添加他们的签名。所有者可以随时将其移除。
{% /callout %}

## 适用于

|                     |     |
| ------------------- | --- |
| MPL Core 资产      | ✅  |
| MPL Core 集合 | ✅  |

资产从集合继承签名。

## 参数

`autograph` 插件在 `signatures` 数组中需要以下参数：

| 参数     | 值     |
| ------- | ------    |
| address | publicKey |
| message | string    |

## 向资产添加签名插件代码示例

{% dialect-switcher title="作为所有者向 MPL Core 资产添加签名插件" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  addPlugin,
} from '@metaplex-foundation/mpl-core'

await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    signatures: [
      {
        address: umi.identity.publicKey,
        message: 'Your Message',
      },
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 向资产添加签名代码示例

{% dialect-switcher title="向 MPL Core 资产添加签名" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

// 您要添加的新签名
const newAutograph = {
  address: umi.identity.publicKey,
  message: "your message"
}

// 将新签名添加到现有签名数组
const updatedAutographs = [...asset.autograph.signatures, newAutograph]

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    // 这应该包含您不想移除的所有签名
    signatures: updatedAutographs,
  },
  authority: umi.identity,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 从资产移除签名代码示例

{% dialect-switcher title="从 MPL Core 资产移除签名" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

// 您要移除的签名的公钥
const publicKeyToRemove = publicKey("abc...")

const autographsToKeep = asset.autograph.signatures.filter(
  (autograph) => autograph.address !== publicKeyToRemove
);

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    // 这应该包含您不想移除的所有签名
    signatures: autographsToKeep,
  },
  authority: umi.identity, // 应该是资产的所有者
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 向集合添加签名插件代码示例

{% dialect-switcher title="向集合添加签名插件" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { addCollectionPlugin } from '@metaplex-foundation/mpl-core'

await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'Autograph',
        signatures: [
      {
        address: umi.identity.publicKey,
        message: 'Your Message',
      },
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}
