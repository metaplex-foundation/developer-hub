---
title: AddBlocker 插件
metaTitle: AddBlocker 插件 | Metaplex Core
description: 防止向 Core Asset 和 Collection 添加新的权限管理插件。永久锁定插件配置。
updated: '01-31-2026'
keywords:
  - add blocker
  - lock plugins
  - prevent plugins
  - plugin restriction
about:
  - Plugin restriction
  - Configuration locking
  - Authority management
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 在添加 AddBlocker 后还能添加 Freeze Delegate 吗？
    a: 可以。像 Freeze Delegate、Transfer Delegate 和 Burn Delegate 这样的所有者管理插件即使在 AddBlocker 激活后也可以随时添加。
  - q: 添加 AddBlocker 后还能删除它吗？
    a: 可以，如果它没有被设置为不可变。权限者可以删除该插件。但是，这违背了使用 AddBlocker 的目的。
  - q: 如果我向 Collection 添加 AddBlocker，还能向单个 Asset 添加插件吗？
    a: 不能。Collection 级别的 AddBlocker 会阻止向 Collection 及其所有 Asset 添加权限管理插件。
  - q: 如果 Metaplex 发布了我想使用的新插件怎么办？
    a: 如果 AddBlocker 已激活，您将无法添加新的权限管理插件，即使是将来发布的新插件。请提前规划。
  - q: 为什么要使用 AddBlocker？
    a: 为了保证 NFT 的权限管理插件配置是最终的。这向收藏家保证版税、属性和其他关键设置不能被修改。
---
**AddBlocker 插件**防止向 Asset 或 Collection 添加任何新的权限管理插件。在仍然允许所有者管理插件的同时锁定您的 NFT 配置。{% .lead %}
{% callout title="学习内容" %}
- 阻止新的权限管理插件
- 了解哪些插件仍然被允许
- 应用于 Asset 和 Collection
- 在锁定前规划您的插件配置
{% /callout %}
## 摘要
**AddBlocker** 插件是一个权限管理插件，可以防止添加新的权限管理插件。所有者管理的插件（如 Freeze Delegate、Transfer Delegate）仍然可以添加。
- 权限管理（只有更新权限者可以添加）
- 永久阻止新的权限管理插件
- 所有者管理的插件不会被阻止
- Collection 插件会影响该 Collection 中的所有 Asset
## 范围外
阻止所有者管理的插件（始终允许）、删除现有插件以及阻止更新现有插件。
## 快速开始
**跳转至：** [添加到 Asset](#向-asset-添加-addblocker-插件代码示例) · [添加到 Collection](#向-collection-添加-addblocker-插件代码示例)
1. 添加您需要的所有权限管理插件
2. 以更新权限者身份添加 AddBlocker 插件
3. 无法再添加新的权限管理插件
{% callout type="note" title="何时使用 AddBlocker" %}
| 场景 | 使用 AddBlocker？ |
|----------|-----------------|
| 保证版税不能更改 | ✅ 是（先添加 Royalties，然后添加 AddBlocker） |
| 防止未来添加插件 | ✅ 是 |
| 永久锁定属性 | ❌ 否（对 Attributes 使用 authority `None`） |
| 允许市场上架 | ✅ 仍然有效（允许所有者管理） |
| 未来需要新插件 | ❌ 不要使用 AddBlocker |
**使用 AddBlocker** 让收藏家确信 NFT 的配置是最终的。
{% /callout %}
## 常见用例
- **版税保护**：通过阻止新的 Royalties 插件确保版税不能更改
- **配置最终性**：向收藏家保证 NFT 的插件不会改变
- **建立信任**：向买家证明关键设置已锁定
- **Collection 标准**：在整个 Collection 中强制执行一致的插件配置
## 适用于
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |
## 参数
`AddBlocker` 插件不需要任何参数。
## 向 Asset 添加 addBlocker 插件代码示例
{% dialect-switcher title="向 MPL Core Asset 添加 addBlocker 插件" %}
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
## 向 Collection 添加 addBlocker 插件代码示例
{% dialect-switcher title="向 Collection 添加 addBlocker 插件" %}
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
只有更新权限者可以添加 AddBlocker 插件。
### `Cannot add plugin - AddBlocker active`
AddBlocker 插件正在阻止新的权限管理插件。这是预期的行为。
## 注意事项
- 在添加 AddBlocker 之前仔细规划您的插件配置
- 一旦阻止，将无法添加未来的 Metaplex 插件功能
- 所有者管理的插件（Freeze、Transfer、Burn Delegates）始终被允许
- 添加到 Collection 也会阻止所有 Asset 的插件
## 快速参考
### 被阻止的内容
| 插件类型 | 被阻止 |
|-------------|---------|
| 权限管理 | ✅ 被阻止 |
| 所有者管理 | ❌ 仍然允许 |
| 永久性 | ✅ 被阻止（必须在创建时添加） |
### 常见的权限管理插件（被阻止）
- Royalties
- Attributes
- Verified Creators
- ImmutableMetadata
- AddBlocker（自身）
### 所有者管理的插件（仍然允许）
- Freeze Delegate
- Transfer Delegate
- Burn Delegate
## 常见问题
### 在添加 AddBlocker 后还能添加 Freeze Delegate 吗？
可以。像 Freeze Delegate、Transfer Delegate 和 Burn Delegate 这样的所有者管理插件即使在 AddBlocker 激活后也可以随时添加。
### 添加 AddBlocker 后还能删除它吗？
可以，如果它没有被设置为不可变。权限者可以删除该插件。但是，这违背了使用 AddBlocker 的目的。
### 如果我向 Collection 添加 AddBlocker，还能向单个 Asset 添加插件吗？
不能。Collection 级别的 AddBlocker 会阻止向 Collection 及其所有 Asset 添加权限管理插件。
### 如果 Metaplex 发布了我想使用的新插件怎么办？
如果 AddBlocker 已激活，您将无法添加新的权限管理插件，即使是将来发布的新插件。请提前规划。
### 为什么要使用 AddBlocker？
为了保证 NFT 的权限管理插件配置是最终的。这向收藏家保证版税、属性和其他关键设置不能通过添加新插件来修改。
## 相关插件
- [ImmutableMetadata](/smart-contracts/core/plugins/immutableMetadata) - 永久锁定名称和 URI
- [Royalties](/smart-contracts/core/plugins/royalties) - 在使用 AddBlocker 之前设置版税
- [Attributes](/smart-contracts/core/plugins/attribute) - 在使用 AddBlocker 之前添加属性
## 术语表
| 术语 | 定义 |
|------|------------|
| **AddBlocker** | 防止添加新权限管理插件的插件 |
| **权限管理** | 由更新权限者控制的插件 |
| **所有者管理** | 由 Asset 所有者控制的插件 |
| **插件配置** | 附加到 Asset/Collection 的插件集合 |
| **继承** | Asset 获得 Collection 级别的限制 |
