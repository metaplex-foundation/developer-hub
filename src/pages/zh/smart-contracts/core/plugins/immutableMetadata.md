---
title: ImmutableMetadata 插件
metaTitle: ImmutableMetadata 插件 | Metaplex Core
description: 使 Core NFT Asset 和 Collection 元数据永久不可变。锁定名称和 URI 以防止任何未来更改。
updated: '01-31-2026'
keywords:
  - immutable metadata
  - lock metadata
  - permanent NFT
  - provenance
about:
  - Metadata immutability
  - Provenance protection
  - Data locking
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 可以撤销添加 ImmutableMetadata 吗？
    a: 不可以。一旦添加，ImmutableMetadata 插件就无法移除。元数据将永久锁定。这是为了出处保证而设计的。
  - q: 具体什么变得不可变？
    a: Asset 或 Collection 的 name 和 uri 字段。其他插件数据不受影响 - 使用权限 None 来使各个插件的数据不可变。
  - q: 如果我将其添加到 Collection，现有 Asset 会受影响吗？
    a: 是的。当 ImmutableMetadata 在 Collection 上时，该 Collection 中的所有 Asset 都会继承不可变性。它们的元数据无法更改。
  - q: 可以在 Asset 创建时添加吗？
    a: 可以。您可以在 create() 时添加 ImmutableMetadata，以确保元数据从一开始就被锁定。
  - q: 为什么需要不可变元数据？
    a: 不可变元数据提供永久出处 - 收藏家知道 NFT 的名称和相关元数据 URI 永远不会改变，从而防止抽地毯骗局。
---
**ImmutableMetadata 插件**永久锁定 Asset 或 Collection 的名称和 URI。一旦添加，任何人都无法更改元数据，确保永久出处。 {% .lead %}
{% callout title="您将学到" %}
- 使 Asset 元数据不可变
- 使 Collection 元数据不可变
- 理解从 Collection 到 Asset 的继承
- 永久保护 NFT 出处
{% /callout %}
## 摘要
**ImmutableMetadata** 插件是一个权限管理插件，可防止对 Asset 或 Collection 的名称和 URI 进行任何更改。一旦添加，此保护是永久的。
- 权限管理（只有更新权限可以添加）
- 使名称和 URI 永久不可更改
- 添加后无法移除
- Collection 插件影响该 Collection 中的所有 Asset
## 范围外
使其他插件数据不可变（对这些插件使用权限 `None`）、选择性字段不可变性和临时锁定不在范围内。
## 快速开始
**跳转到：** [添加到 Asset](#asset-添加-immutablemetadata-插件代码示例) · [添加到 Collection](#collection-添加-immutablemetadata-插件代码示例)
1. 确保元数据（名称、URI）已最终确定
2. 以更新权限添加 ImmutableMetadata 插件
3. 元数据现已永久锁定
{% callout type="note" title="何时使用 ImmutableMetadata" %}
| 场景 | 使用 ImmutableMetadata？ |
|----------|------------------------|
| 具有永久艺术品的艺术 NFT | ✅ 是 |
| 具有演变属性的游戏物品 | ❌ 否（需要更新属性） |
| 防止抽地毯骗局 | ✅ 是 |
| 动态/演变 NFT | ❌ 否 |
| 证书/凭证 | ✅ 是 |
**使用 ImmutableMetadata** 用于艺术品、收藏品和证书，这些地方永久性很重要。
**不要使用** 用于需要更新的游戏物品或动态 NFT。
{% /callout %}
## 常见用例
- **艺术收藏品**：保证艺术品和元数据永不改变
- **证书**：发行无法更改的凭证
- **出处保护**：通过锁定元数据防止抽地毯骗局
- **历史记录**：永久保存 NFT 数据
- **品牌保证**：向收藏家保证 NFT 的身份是固定的
## 兼容性
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |
## 参数
ImmutableMetadata 插件不需要参数。
## Asset 添加 immutableMetadata 插件代码示例
{% dialect-switcher title="向 MPL Core Asset 添加 Immutability 插件" %}
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
## Collection 添加 immutableMetadata 插件代码示例
{% dialect-switcher title="向 Collection 添加 immutableMetadata 插件" %}
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
只有更新权限可以添加 ImmutableMetadata 插件。
### `Cannot update metadata`
ImmutableMetadata 插件已激活。名称和 URI 无法更改。
## 注意事项
- 此操作是**永久且不可逆的**
- 添加此插件前请仔细检查名称和 URI
- 添加到 Collection 会使该 Collection 中的所有 Asset 不可变
- 插件没有参数——只需添加即可锁定元数据
## 快速参考
### 受影响的字段
| 字段 | 已锁定 |
|-------|--------|
| `name` | ✅ |
| `uri` | ✅ |
| 其他元数据 | ❌（使用其他方法） |
### 继承行为
| 添加到 | 效果 |
|----------|--------|
| Asset | 仅该 Asset 的元数据被锁定 |
| Collection | Collection 和所有 Asset 的元数据被锁定 |
## 常见问题
### 可以撤销添加 ImmutableMetadata 吗？
不可以。一旦添加，ImmutableMetadata 插件就无法移除。元数据将永久锁定。这是为了出处保证而设计的。
### 具体什么变得不可变？
Asset 或 Collection 的 `name` 和 `uri` 字段。其他插件数据不受影响——使用权限 `None` 来使各个插件的数据不可变。
### 如果我将其添加到 Collection，现有 Asset 会受影响吗？
是的。当 ImmutableMetadata 在 Collection 上时，该 Collection 中的所有 Asset 都会继承不可变性。它们的元数据无法更改。
### 可以在 Asset 创建时添加吗？
可以。您可以在 `create()` 时添加 ImmutableMetadata，以确保元数据从一开始就被锁定。
### 为什么需要不可变元数据？
不可变元数据提供永久出处——收藏家知道 NFT 的名称和相关元数据 URI 永远不会改变，从而防止创作者替换艺术品或描述的抽地毯骗局。
## 相关插件
- [AddBlocker](/smart-contracts/core/plugins/addBlocker) - 防止添加新插件（与 ImmutableMetadata 互补）
- [Attributes](/smart-contracts/core/plugins/attribute) - 链上数据（不被 ImmutableMetadata 锁定）
- [Royalties](/smart-contracts/core/plugins/royalties) - 在设为不可变之前设置版税
## 术语表
| 术语 | 定义 |
|------|------------|
| **不可变** | 无法更改或修改 |
| **元数据** | 与 Asset/Collection 关联的名称和 URI |
| **出处** | 可验证的真实性和所有权记录 |
| **URI** | 链下 JSON 元数据的链接 |
| **继承** | Asset 自动获得 Collection 级别的插件效果 |
