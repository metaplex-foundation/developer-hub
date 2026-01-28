---
title: ImmutableMetadata 插件
metaTitle: ImmutableMetadata 插件 | Metaplex Core
description: 使 Core NFT 资产和集合的元数据永久不可变。锁定 name 和 URI 以防止任何未来的更改。
---

**ImmutableMetadata 插件**永久锁定资产或集合的 name 和 URI。一旦添加，任何人都无法更改元数据，确保永久的来源证明。 {% .lead %}

{% callout title="您将学到" %}

- 使资产元数据不可变
- 使集合元数据不可变
- 了解从集合到资产的继承
- 永久保护 NFT 来源

{% /callout %}

## 概述

**ImmutableMetadata** 插件是一个权限管理插件，可防止对资产或集合的 name 和 URI 进行任何更改。一旦添加，此保护是永久的。

- 权限管理型（只有 update authority 可以添加）
- 使 name 和 URI 永久不可更改
- 添加后无法移除
- 集合插件影响该集合中的所有资产

## 范围之外

使其他插件数据不可变（在这些插件上使用权限 `None`）、选择性字段不可变性和临时锁定。

## 快速开始

**跳转到：** [添加到资产](#向资产添加-immutablemetadata-插件代码示例) · [添加到集合](#向集合添加-immutablemetadata-插件代码示例)

1. 确保元数据（name、URI）已最终确定
2. 作为 update authority 添加 ImmutableMetadata 插件
3. 元数据现在永久锁定

{% callout type="note" title="何时使用 ImmutableMetadata" %}

| 场景 | 使用 ImmutableMetadata？ |
|------|--------------------------|
| 具有永久艺术作品的艺术 NFT | ✅ 是 |
| 具有进化属性的游戏物品 | ❌ 否（需要更新属性） |
| 防止跑路 | ✅ 是 |
| 动态/进化 NFT | ❌ 否 |
| 证书/凭证 | ✅ 是 |

**使用 ImmutableMetadata**：用于重视永久性的艺术品、收藏品和证书。
**不使用**：用于需要更新的游戏物品或动态 NFT。

{% /callout %}

## 常见用例

- **艺术收藏品**：保证艺术作品和元数据永远不会改变
- **证书**：发行不可更改的凭证
- **来源保护**：锁定元数据防止跑路
- **历史记录**：永久保存 NFT 数据
- **品牌保证**：向收藏者保证 NFT 的身份是固定的

## 适用于

|                     |     |
| ------------------- | --- |
| MPL Core 资产       | ✅  |
| MPL Core 集合       | ✅  |

## 参数

ImmutableMetadata 插件不需要任何参数。

## 向资产添加 immutableMetadata 插件代码示例

{% dialect-switcher title="向 MPL Core 资产添加 Immutability 插件" %}
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

## 常见错误

### `Authority mismatch`

只有 update authority 可以添加 ImmutableMetadata 插件。

### `Cannot update metadata`

ImmutableMetadata 插件已激活。无法更改 name 和 URI。

## 注意事项

- 此操作是**永久且不可逆的**
- 在添加此插件之前请仔细检查 name 和 URI
- 添加到集合会使该集合中的所有资产变得不可变
- 插件没有参数 — 只需添加它即可锁定元数据

## 快速参考

### 受影响的字段

| 字段 | 锁定 |
|------|------|
| `name` | ✅ |
| `uri` | ✅ |
| 其他元数据 | ❌（使用其他方法） |

### 继承行为

| 添加到 | 效果 |
|--------|------|
| 资产 | 只有该资产的元数据被锁定 |
| 集合 | 集合和所有资产的元数据被锁定 |

## 常见问题

### 我可以撤销添加 ImmutableMetadata 吗？

不可以。一旦添加，ImmutableMetadata 插件无法移除。元数据被永久锁定。这是为了来源保证而设计的。

### 具体什么变得不可变？

资产或集合的 `name` 和 `uri` 字段。其他插件数据不受影响 — 使用权限 `None` 在单个插件上使其数据不可变。

### 如果我将此添加到集合，现有资产会受影响吗？

是的。当 ImmutableMetadata 在集合上时，该集合中的所有资产都继承不可变性。它们的元数据无法更改。

### 我可以在资产创建时添加这个吗？

可以。您可以在 `create()` 期间添加 ImmutableMetadata 以确保元数据从一开始就被锁定。

### 为什么我想要不可变的元数据？

不可变元数据提供永久的来源证明 — 收藏者知道 NFT 的名称和相关元数据 URI 永远不会改变，防止创作者更换艺术作品或描述的跑路行为。

## 相关插件

- [AddBlocker](/zh/smart-contracts/core/plugins/addBlocker) - 防止添加新插件（与 ImmutableMetadata 互补）
- [Attributes](/zh/smart-contracts/core/plugins/attribute) - 链上数据（不被 ImmutableMetadata 锁定）
- [Royalties](/zh/smart-contracts/core/plugins/royalties) - 在使其不可变之前设置版税

## 术语表

| 术语 | 定义 |
|------|------|
| **Immutable** | 不能被更改或修改 |
| **Metadata** | 与资产/集合关联的 name 和 URI |
| **Provenance** | 可验证的真实性和所有权记录 |
| **URI** | 指向链下 JSON 元数据的链接 |
| **Inheritance** | 资产自动获取集合级插件效果 |

---

*由 Metaplex Foundation 维护 · 最后验证于 2026 年 1 月 · 适用于 @metaplex-foundation/mpl-core*
