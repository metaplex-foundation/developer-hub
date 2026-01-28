---
title: Verified Creator插件
metaTitle: Verified Creator插件 | Metaplex Core
description: 向Core NFT资产和集合添加已验证的创作者签名。在不影响版税分配的情况下证明创作者身份。
---

**Verified Creators插件**在资产或集合上存储已验证创作者签名的列表。在不影响版税分配的情况下公开证明创作者身份。 {% .lead %}

{% callout title="学习内容" %}

- 向资产和集合添加已验证创作者
- 验证创作者签名
- 从列表中移除创作者
- 了解验证工作流程

{% /callout %}

## 概述

**Verified Creators**插件是一个权限管理插件，存储带有验证状态的创作者地址。与Token Metadata不同，这些创作者不用于版税分配（请使用Royalties插件）。

- 更新权限添加未验证的创作者
- 创作者通过签名自我验证
- 已验证的创作者在移除前必须取消验证
- 资产从集合继承创作者

## 范围外

版税分配（使用[Royalties插件](/zh/smart-contracts/core/plugins/royalties)）、Token Metadata创作者数组和自动验证。

## 快速开始

**跳转到：** [添加到资产](#adding-the-autograph-plugin-to-an-asset-code-example) · [添加创作者](#adding-a-different-creator-to-an-asset-code-example) · [移除创作者](#removing-a-creator-from-an-asset-code-example)

1. 添加带有初始创作者的Verified Creators插件
2. 创作者使用`updatePlugin`自我验证
3. 要移除：创作者取消验证，然后更新权限移除

{% callout type="note" title="Verified Creators vs Autograph" %}

| 功能 | Verified Creators | Autograph |
|---------|-------------------|-----------|
| 谁可以添加 | 仅更新权限 | 任何人（启用后） |
| 目的 | 证明创作者身份 | 收藏签名 |
| 验证 | 创作者自我验证 | 无需验证 |
| 移除 | 必须先取消验证 | 所有者可随时移除 |
| 用于版税 | ❌ 否 | ❌ 否 |

**使用Verified Creators** - 证明真实的创作者身份。
**使用[Autograph](/zh/smart-contracts/core/plugins/autograph)** - 粉丝/名人的收藏签名。

{% /callout %}

## 常见用例

- **团队归属**：设计师、开发者和创始人各自验证其参与
- **共同创作者证明**：多位艺术家验证对作品的协作
- **品牌验证**：官方品牌账户验证合作关系
- **真实性证明**：原创作者验证其创建了资产
- **历史记录**：记录谁参与了集合的创建

`更新权限`可以：
- 添加插件
- 向创作者数组添加未验证的创作者
- 可以移除未验证的创作者。要移除已验证的创作者，他们必须先取消自我验证
- 可以验证自己

要验证创作者，`updatePlugin`指令必须由更新权限添加到创作者数组中的公钥签名。

## 适用于

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## 参数

`verifiedCreator`插件在`VerifiedCreatorsSignature`数组中需要以下参数：

| 参数    | 值        |
| ------- | --------- |
| address | publicKey |
| message | string    |

资产从集合继承Creators数组。

## 向资产添加Autograph插件代码示例

{% dialect-switcher title="向MPL Core资产添加Verified Creators插件" %}
{% dialect title="JavaScript" id="js" %}

此代码片段假设umi identity是资产的更新权限。

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

{% dialect-switcher title="向MPL Core资产添加不同创作者" %}
{% dialect title="JavaScript" id="js" %}

此代码片段假设umi identity是资产的更新权限，用于添加未验证的创作者。

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'


const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

const publicKeyToAdd = publicKey("abc...")

// 您要添加的新Autograph
const newCreator = {
  address: publicKeyToAdd,
  verified: false,
}

// 将新Autograph添加到现有签名数组
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

添加未验证的创作者后，他们可以再次使用`updatePlugin`函数验证自己。
此代码片段假设umi identity是创作者。

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

{% dialect-switcher title="从MPL Core资产移除创作者" %}
{% dialect title="JavaScript" id="js" %}

只有更新权限可以移除创作者。要移除创作者，它必须是`verified:false`或更新权限本身。因此更新将分两步完成。如果您能够同时使用更新权限和创作者签名，这可以在一个交易中完成，结合两个指令。

1. 设置`verified:false`
此代码片段假设`umi.identity`是您要移除的创作者

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
此代码片段假设`umi.identity`是更新权限

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

## 向集合添加Verified Creators插件代码示例

{% dialect-switcher title="向集合添加Verified Creators插件" %}
{% dialect title="JavaScript" id="js" %}
此代码片段假设`umi.identity`是更新权限

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

## 常见错误

### `Authority mismatch`

只有更新权限可以添加插件或添加新创作者。只有创作者自己可以验证自己的签名。

### `Creator already verified`

创作者已经自我验证。无需操作。

### `Cannot remove verified creator`

已验证的创作者必须先取消自我验证，然后更新权限才能移除他们。

## 注意事项

- Verified Creators不用于版税分配（使用Royalties插件）
- 创作者必须自我验证—更新权限不能代表他们验证
- 创作者必须在被移除之前取消验证
- 资产从其集合继承创作者数组

## 快速参考

### 验证工作流程

| 步骤 | 操作 | 执行者 |
|------|--------|-----|
| 1 | 添加未验证创作者 | 更新权限 |
| 2 | 验证创作者 | 创作者签名 |
| 3 | 取消验证（可选） | 创作者签名 |
| 4 | 移除（可选） | 更新权限 |

### 权限矩阵

| 操作 | 更新权限 | 创作者 |
|--------|------------------|---------|
| 添加插件 | ✅ | ❌ |
| 添加未验证创作者 | ✅ | ❌ |
| 验证创作者 | ❌ | ✅（仅自己） |
| 取消验证创作者 | ❌ | ✅（仅自己） |
| 移除未验证创作者 | ✅ | ❌ |

## 常见问题

### 这与Token Metadata创作者数组有什么不同？

在Token Metadata中，创作者数组用于版税分配。在Core中，Verified Creators纯粹用于证明创作者身份—使用Royalties插件进行版税分配。

### 更新权限可以验证创作者吗？

不可以。每个创作者必须通过签署交易来自我验证。这确保了真实的创作者身份证明。

### 为什么我不能移除已验证的创作者？

要移除已验证的创作者，他们必须先取消自我验证。这防止了对已验证创作者的未授权移除。

### 资产会自动获得集合的已验证创作者吗？

是的。资产从其集合继承创作者数组。单个资产也可以有自己的Verified Creators插件，其中包含不同的创作者。

### 我可以将其用于共同创作者归属吗？

是的。这是一个常见的用例—多个创作者（设计师、开发者、艺术家）都可以验证他们参与了资产或集合的创建。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Verified Creator** | 已签名确认其参与的创作者 |
| **Unverified Creator** | 由更新权限添加但尚未确认的创作者 |
| **Verification** | 创作者签名以证明真实的创作者身份 |
| **Royalties Plugin** | 用于版税分配的单独插件（不是这个） |
| **Creator Array** | 与资产/集合关联的地址列表 |

## 相关插件

- [Autograph](/zh/smart-contracts/core/plugins/autograph) - 任何人（粉丝、名人）的收藏签名
- [Royalties](/zh/smart-contracts/core/plugins/royalties) - 设置版税分配（与已验证创作者分开）
- [ImmutableMetadata](/zh/smart-contracts/core/plugins/immutableMetadata) - 永久锁定元数据

---

*由Metaplex Foundation维护 · 2026年1月最后验证 · 适用于@metaplex-foundation/mpl-core*
