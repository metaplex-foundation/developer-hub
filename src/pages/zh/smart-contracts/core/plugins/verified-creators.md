---
title: 已验证创作者插件
metaTitle: 已验证创作者插件 | Core
description: 一个存储参与资产/集合创作的创作者列表数据的插件。
---

`Verified Creator` 插件是一个`权限管理`插件，允许人们向您的资产或集合添加已验证的创作者。它的工作方式类似于 Metaplex Token Metadata 使用的已验证创作者数组，不同的是在 MPL Core 中，已验证创作者不用于分配版税。

此插件的可能用例是公开验证创作者参与了资产创建过程。例如，设计师、开发者和创始人可以签名作为创作者身份的证明。

`更新权限`可以：
- 添加插件。
- 向创作者数组添加未验证的创作者。
- 可以移除未验证的创作者。要移除已验证的创作者，他们必须首先取消验证自己。
- 可以验证自己。

要验证创作者，`updatePlugin` 指令必须由更新权限添加到创作者数组中的公钥签名。

## 适用于

|                     |     |
| ------------------- | --- |
| MPL Core 资产      | ✅  |
| MPL Core 集合 | ✅  |

## 参数

`verifiedCreator` 插件在 `VerifiedCreatorsSignature` 数组中需要以下参数：

| 参数     | 值     |
| ------- | ------    |
| address | publicKey |
| message | string    |

资产从集合继承创作者数组。

## 向资产添加已验证创作者插件代码示例

{% dialect-switcher title="向 MPL Core 资产添加已验证创作者插件" %}
{% dialect title="JavaScript" id="js" %}

此代码片段假设 umi identity 是资产的更新权限。

```ts
import {
  addPlugin,
} from '@metaplex-foundation/mpl-core'

await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: [
      {
        address: umi.identity.publicKey,
        verified: true,
      },
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 向资产添加不同创作者代码示例

{% dialect-switcher title="向 MPL Core 资产添加不同创作者" %}
{% dialect title="JavaScript" id="js" %}

此代码片段假设 umi identity 是资产的更新权限以添加未验证的创作者。

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'


const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

const publicKeyToAdd = publicKey("abc...")

// 您要添加的新创作者
const newCreator = {
  address: publicKeyToAdd,
  verified: false,
}

// 将新创作者添加到现有签名数组
const updatedCreators = [...asset.verifiedCreators.signatures, newCreator]

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: updatedCreators,
  },
  authority: umi.identity,
}).sendAndConfirm(umi)
```

添加未验证的创作者后，他们可以再次使用 `updatePlugin` 函数验证自己。
此代码片段假设 umi identity 是创作者。

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'


const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

const publicKeyToVerify = publicKey("abc...")

// 您要验证的创作者
const updatedCreators = asset.verifiedCreators.signatures.map(creator => {
  if (creator.address === publicKeyToVerify) {
    return { ...creator, verified: true };
  }
  return creator;
});


await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: updatedCreators,
  },
  authority: umi.identity,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 从资产移除创作者代码示例

{% dialect-switcher title="从 MPL Core 资产移除创作者" %}
{% dialect title="JavaScript" id="js" %}

只有更新权限可以移除创作者。要移除创作者，它必须是 `verified:false` 或更新权限本身。因此更新将分两步完成。如果您能够同时使用更新权限和创作者签名，这可以在一个交易中完成，结合两个指令。

1. 设置 `verified:false`
此代码片段假设 `umi.identity` 是您要移除的创作者

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

// 您要移除的创作者的公钥
const publicKeyToRemove = publicKey("abc...")

const modifiedCreators = signatures.map(signature =>
  signature.address === creator.publicKey
    ? { ...signature, verified: false }
    : signature
);

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: modifiedCreators,
  },
  authority: umi.identity, // 应该是创作者
}).sendAndConfirm(umi)
```

2. 移除创作者
此代码片段假设 `umi.identity` 是更新权限

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

// 您要移除的创作者的公钥
const publicKeyToRemove = publicKey("abc...")


const creatorsToKeep = asset.verifiedCreators.signatures.filter(
  (creator) => creator.address !== publicKeyToRemove
);

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: creatorsToKeep,
  },
  authority: umi.identity, // 应该是更新权限
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 向集合添加已验证创作者插件代码示例

{% dialect-switcher title="向集合添加已验证创作者插件" %}
{% dialect title="JavaScript" id="js" %}
此代码片段假设 `umi.identity` 是更新权限

```ts
import { addCollectionPlugin } from '@metaplex-foundation/mpl-core'

await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'VerifiedCreators',
        signatures: [
      {
        address: umi.identity.publicKey,
        verified: true,
      },
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}
