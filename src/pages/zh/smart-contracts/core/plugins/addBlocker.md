---
title: AddBlocker 插件
metaTitle: AddBlocker 插件 | Metaplex Core
description: 防止向 Core NFT 资产和集合添加新的权限管理插件。永久锁定插件配置。
---

**AddBlocker 插件**防止向资产或集合添加任何新的权限管理插件。在仍然允许所有者管理插件的同时锁定您的 NFT 配置。 {% .lead %}

{% callout title="您将学到" %}

- 阻止新的权限管理插件
- 了解哪些插件仍然允许
- 应用于资产和集合
- 在锁定前规划您的插件配置

{% /callout %}

## 概述

**AddBlocker** 插件是一个权限管理插件，用于防止添加新的权限管理插件。所有者管理插件（如 Freeze Delegate、Transfer Delegate）仍然可以添加。

- 权限管理型（只有更新权限可以添加）
- 永久阻止新的权限管理插件
- 所有者管理插件不会被阻止
- 集合插件影响该集合中的所有资产

## 范围外

阻止所有者管理插件（始终允许）、删除现有插件、以及阻止对现有插件的更新。

## 快速开始

**跳转到：** [添加到资产](#向资产添加-addblocker-插件代码示例) · [添加到集合](#向集合添加-addblocker-插件代码示例)

1. 添加所有您需要的权限管理插件
2. 以更新权限身份添加 AddBlocker 插件
3. 无法再添加新的权限管理插件

{% callout type="note" title="何时使用 AddBlocker" %}

| 场景 | 使用 AddBlocker? |
|----------|-----------------|
| 保证版税不能更改 | ✅ 是（先添加 Royalties，然后添加 AddBlocker） |
| 防止未来添加插件 | ✅ 是 |
| 永久锁定属性 | ❌ 否（在 Attributes 上使用权限 `None`） |
| 允许市场上架 | ✅ 仍然有效（所有者管理型允许） |
| 未来需要新插件 | ❌ 不要使用 AddBlocker |

**使用 AddBlocker** 让收藏者确信 NFT 的配置是最终的。

{% /callout %}

## 常见用例

- **版税保护**：通过阻止新的 Royalties 插件确保版税不能更改
- **配置最终性**：向收藏者保证 NFT 的插件不会更改
- **建立信任**：向买家证明关键设置已锁定
- **集合标准**：在整个集合中强制执行一致的插件配置

## 适用于

|                     |     |
| ------------------- | --- |
| MPL Core 资产      | ✅  |
| MPL Core 集合 | ✅  |

## 参数

`AddBlocker` 插件不需要任何参数。

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
    type: 'AddBlocker',
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 常见错误

### `Authority mismatch`

只有更新权限可以添加 AddBlocker 插件。

### `Cannot add plugin - AddBlocker active`

AddBlocker 插件正在阻止新的权限管理插件。这是预期的行为。

## 注意事项

- 在添加 AddBlocker 之前仔细规划您的插件配置
- 阻止后，未来的 Metaplex 插件功能无法添加
- 所有者管理插件（Freeze、Transfer、Burn Delegates）始终允许
- 添加到集合会同时阻止所有资产的插件

## 快速参考

### 被阻止的内容

| 插件类型 | 阻止 |
|-------------|---------|
| 权限管理型 | ✅ 被阻止 |
| 所有者管理型 | ❌ 仍然允许 |
| 永久型 | ✅ 被阻止（必须在创建时添加） |

### 常见权限管理插件（被阻止）

- Royalties
- Attributes
- Verified Creators
- ImmutableMetadata
- AddBlocker（本身）

### 所有者管理插件（仍然允许）

- Freeze Delegate
- Transfer Delegate
- Burn Delegate

## FAQ

### AddBlocker 后还能添加 Freeze Delegate 吗？

可以。像 Freeze Delegate、Transfer Delegate 和 Burn Delegate 这样的所有者管理插件即使在 AddBlocker 激活后也可以添加。

### 添加 AddBlocker 后可以删除吗？

可以，如果它没有被设为不可变。权限者可以删除插件。但是，这违背了使用 AddBlocker 的目的。

### 如果我向集合添加 AddBlocker，还能向单个资产添加插件吗？

不能。集合级别的 AddBlocker 会阻止向集合及其所有资产添加权限管理插件。

### 如果 Metaplex 发布了我想使用的新插件怎么办？

如果 AddBlocker 处于激活状态，您无法添加新的权限管理插件，即使是将来发布的新插件。请相应地进行规划。

### 为什么要使用 AddBlocker？

为了保证 NFT 的权限管理插件配置是最终的。这向收藏者保证版税、属性和其他关键设置不能通过添加新插件来修改。

## 相关插件

- [ImmutableMetadata](/zh/smart-contracts/core/plugins/immutableMetadata) - 永久锁定名称和 URI
- [Royalties](/zh/smart-contracts/core/plugins/royalties) - 在使用 AddBlocker 之前设置版税
- [Attributes](/zh/smart-contracts/core/plugins/attribute) - 在使用 AddBlocker 之前添加属性

## 术语表

| 术语 | 定义 |
|------|------------|
| **AddBlocker** | 防止新的权限管理插件的插件 |
| **权限管理型** | 由更新权限控制的插件 |
| **所有者管理型** | 由资产所有者控制的插件 |
| **插件配置** | 附加到资产/集合的插件集 |
| **继承** | 资产获得集合级别限制 |

---

*由 Metaplex Foundation 维护 · 最后验证于 2026 年 1 月 · 适用于 @metaplex-foundation/mpl-core*
