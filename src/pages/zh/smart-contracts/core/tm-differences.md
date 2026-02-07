---
title: Core 与 Token Metadata 的区别
metaTitle: Core vs Token Metadata | Metaplex Core
description: 比较 Metaplex Core 和 Token Metadata NFT 标准。了解发生了什么变化、有什么新功能，以及如何将您的心智模型从 TM 迁移到 Core。
updated: '01-31-2026'
keywords:
  - Core vs Token Metadata
  - NFT standard comparison
  - migrate from Token Metadata
  - mpl-core differences
  - NFT migration
about:
  - NFT standards comparison
  - Token Metadata migration
  - Core advantages
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 新项目应该使用 Core 还是 Token Metadata？
    a: 所有新项目都使用 Core。它更便宜、更简单、功能更好。Token Metadata 用于 NFT 已是遗留标准。
  - q: 可以将现有的 TM NFT 迁移到 Core 吗？
    a: 不能自动迁移。Core Asset 是不同的链上账户。迁移需要销毁 TM NFT 并铸造新的 Core Asset。
  - q: pNFT 怎么了？
    a: Core 的版税强制通过支持允许列表/拒绝列表的 Royalties 插件内置实现。不需要单独的可编程变体。
  - q: 还需要 Associated Token Account 吗？
    a: 不需要。Core Asset 不使用 ATA。所有权直接存储在 Asset 账户中。
  - q: 如何在 Core 中验证创作者？
    a: 使用 Verified Creators 插件。它的工作方式类似于 TM 的 creator 数组，但是选择性加入的。
---
来自 **Token Metadata**？本指南解释 Core 的不同之处、为什么更好，以及如何将您的 TM 知识转化为 Core 概念。 {% .lead %}
{% callout title="主要区别" %}
- **单账户** vs 3 个以上账户（mint、metadata、token account）
- **成本降低 80%**: 每次铸造约 0.0037 SOL vs 0.022 SOL
- 用**插件**代替委托和冻结权限
- 具有收藏级操作的**一等公民 Collection**
- **不需要 Associated Token Account**
{% /callout %}
## 摘要
Core 用单账户设计取代了 Token Metadata 的多账户模型。一切都更简单：创建、冻结、委托和管理收藏。插件系统用统一的、可扩展的架构取代了 TM 分散的委托类型。
| 功能 | Token Metadata | Core |
|---------|---------------|------|
| 每个 NFT 的账户数 | 3 个以上（mint、metadata、ATA） | 1 |
| 铸造成本 | ~0.022 SOL | ~0.0037 SOL |
| 冻结机制 | 委托 + 冻结权限 | Freeze Delegate 插件 |
| 版税 | 按资产更新 | 灵活：收藏或资产级别 |
| 链上属性 | ❌ | ✅ Attributes 插件 |
## 范围外
pNFT 特定功能和同质化代币处理（使用 SPL Token）。
## 快速开始
**跳转至：** [成本比较](#difference-overview) · [Collections](#collections) · [Freeze/Lock](#freeze--lock) · [生命周期事件](#lifecycle-events-and-plugins)
如果您是新手，请使用 Core。如果正在迁移，主要的心智转变是：
1. 一个账户，而不是三个
2. 插件，而不是委托
3. 收藏级操作是原生的
## 区别概述
- **前所未有的成本效率**: Metaplex Core 提供与可用替代方案相比最低的铸造成本。例如，使用 Token Metadata 需要 0.022 SOL 的 NFT 可以用 Core 以 0.0037 SOL 铸造。
- **改进的开发者体验**: 虽然大多数数字资产继承了维护整个同质化代币程序所需的数据，但 Core 针对 NFT 进行了优化，允许所有关键数据存储在单个 Solana 账户中。这极大地降低了开发者的复杂性，同时也有助于提高 Solana 整体的网络性能。
- **增强的收藏管理**: 通过对收藏的一等支持，开发者和创作者可以轻松管理收藏级配置，如版税和插件，这些可以为单个 NFT 唯一覆盖。这可以在单个交易中完成，降低收藏管理成本和 Solana 交易费用。
- **高级插件支持**: 从内置质押到基于资产的积分系统，Metaplex Core 的插件架构开辟了广阔的实用性和定制化空间。插件允许开发者挂钩到任何资产生命周期事件（如创建、转移和销毁）以添加自定义行为。
- **兼容性和支持**: 由 Metaplex Developer Platform 完全支持，Core 将与 SDK 套件和即将推出的程序无缝集成，丰富 Metaplex 生态系统。
- **开箱即用的索引**: 扩展 Metaplex Digital Asset Standard API（DAS API），Core 资产将自动索引，并通过用于所有 Solana NFT 的通用接口提供给应用开发者。然而，一个独特的改进是，通过 Core attribute 插件，开发者可以添加链上数据，这些数据现在也会自动索引。
## 技术概述
### 创建
要创建 Core Asset，只需要一个 create 指令。不需要像 Token Metadata 那样先铸造然后附加元数据。这减少了复杂性和交易大小。
{% totem %}
{% totem-accordion title="创建" %}
以下代码片段假设您已经上传了资产数据。
```js
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'
const assetAddress = generateSigner(umi)
const result = createV1(umi, {
  asset: assetAddress,
  name: 'My Nft',
  uri: 'https://example.com/my-nft',
}).sendAndConfirm(umi)
```
{% /totem-accordion %}
{% /totem %}
### Collections
Core Collection 包含多项新功能。Collection 现在是自己的账户类型，与普通 Asset 区分开来。这是对 Token Metadata 使用相同账户和状态来表示 NFT 和 Collection 的方式的改进，那种方式使两者难以区分。
在 Core 中，Collection 是允许额外功能的**一等资产**。例如，Core 通过向 Collection 添加 Royalties Plugin 来提供收藏级版税调整。开发者和创作者现在可以一次更新收藏中的所有资产，而不是被迫单独更新每个资产。如果收藏中的某些资产需要不同的版税设置怎么办？没问题——只需将相同的插件添加到资产中，收藏级版税插件就会被覆盖。
TM 无法实现的收藏功能示例是收藏级版税——更改版税或创作者时不再需要更新每个资产，而是在收藏中定义。这可以通过向您的收藏添加 [Royalties Plugin](/zh/smart-contracts/core/plugins/royalties) 来完成。一些资产需要不同的版税设置？只需将相同的插件添加到资产中，收藏级版税插件就会被覆盖。
收藏级别的冻结也是可能的。
有关处理收藏（如创建或更新）的更多信息，请参阅 [Managing Collections](/zh/smart-contracts/core/collections) 页面。
### 生命周期事件和插件
在 Asset 的生命周期中，可以触发多个事件：
- 创建
- 转移
- 更新
- 销毁
- 添加插件
- 批准权限插件
- 移除权限插件
在 TM 中，这些生命周期事件由所有者或委托执行。所有 TM Asset（nfts/pNfts）都包含每个生命周期事件的函数。在 Core 中，这些事件由 [Plugins](/zh/smart-contracts/core/plugins) 在 Asset 或 Collection 级别处理。
附加在 Asset 级别或 Collection 级别的插件将在这些生命周期事件期间经过验证过程，以 `approve`、`reject` 或 `force approve` 事件的执行。
### Freeze / Lock
要使用 TM 冻结资产，通常首先将冻结权限委托给不同的钱包，然后该钱包冻结 NFT。在 Core 中，您必须使用两个插件之一：`Freeze Delegate` 或 `Permanent Freeze Delegate`。后者只能在 Asset 创建期间添加，而 `Freeze Delegate` 插件可以在当前所有者签署交易的情况下随时 [添加](/zh/smart-contracts/core/plugins/adding-plugins)。
Core 中的委托也更简单，因为我们取消了 Delegate Record 账户，将委托权限直接存储在插件本身上，同时可以在 Asset 创建时或通过 `addPluginV1` 函数向 Asset 添加插件时分配。
当资产还没有冻结插件时，要让所有者将冻结权限分配给不同的账户，他们需要使用该权限添加插件并冻结它。
以下是将 `Freeze Delegate` 插件添加到 Asset 同时分配给委托权限的快速示例。
{% totem %}
{% totem-accordion title="添加 Freeze 插件、分配权限和冻结" %}
```js
await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: createPlugin('FreezeDelegate', { frozen: true }),
  initAuthority: pluginAuthority('Address', { address: delegate.publicKey }),
}).sendAndConfirm(umi)
```
{% /totem-accordion %}
{% /totem %}
此外，在 Core 中可以在**收藏级别**进行冻结。可以在一个交易中冻结或解冻整个收藏。
### Asset 状态
在 TM 中，您经常需要检查多个账户来查找 Asset 的当前状态，以及它是否已被冻结、锁定或处于可转移状态。在 Core 中，此状态存储在 Asset 账户中，但也可能受 Collection 账户的影响。
为了使事情更简单，我们引入了 `canBurn`、`canTransfer`、`canUpdate` 等生命周期辅助函数，这些函数包含在 `@metaplex-foundation/mpl-core` 包中。这些辅助函数返回一个 `boolean` 值，让您知道传入的地址是否有权限执行这些生命周期事件。
```js
const burningAllowed = canBurn(authority, asset, collection)
```
## 快速参考
### TM 概念 → Core 对应物
| Token Metadata | Core 对应物 |
|----------------|-----------------|
| Mint 账户 | Asset 账户 |
| Metadata 账户 | Asset 账户（合并） |
| Associated Token Account | 不需要 |
| 冻结权限 | Freeze Delegate 插件 |
| Update authority | Update authority（相同） |
| 委托 | Transfer/Burn/Update Delegate 插件 |
| Collection verified | Collection 成员资格（自动） |
| Creators 数组 | Verified Creators 插件 |
| Uses/utility | 插件（自定义逻辑） |
### 常见操作
| 操作 | Token Metadata | Core |
|-----------|---------------|------|
| 创建 NFT | `createV1()`（多账户） | `create()`（单账户） |
| 冻结 | 先委托再冻结 | 添加 Freeze Delegate 插件 |
| 更新元数据 | `updateV1()` | `update()` |
| 转移 | SPL Token 转移 | `transfer()` |
| 销毁 | `burnV1()` | `burn()` |
## FAQ
### 新项目应该使用 Core 还是 Token Metadata？
所有新项目都使用 Core。它更便宜、更简单、功能更好。Token Metadata 用于 NFT 已是遗留标准。
### 可以将现有的 TM NFT 迁移到 Core 吗？
不能自动迁移。Core Asset 是不同的链上账户。迁移需要销毁 TM NFT 并铸造新的 Core Asset。
### pNFT 怎么了？
Core 的版税强制通过支持允许列表/拒绝列表的 Royalties 插件内置实现。不需要单独的"可编程"变体。
### 还需要 Associated Token Account 吗？
不需要。Core Asset 不使用 ATA。所有权直接存储在 Asset 账户中。
### 如何在 Core 中验证创作者？
使用 [Verified Creators 插件](/zh/smart-contracts/core/plugins/verified-creators)。它的工作方式类似于 TM 的 creator 数组，但是选择性加入的。
## 延伸阅读
上述功能只是冰山一角。其他有趣的主题包括：
- [收藏管理](/zh/smart-contracts/core/collections)
- [插件概述](/zh/smart-contracts/core/plugins)
- 使用 [Attributes Plugin](/zh/smart-contracts/core/plugins/attribute) 添加链上数据
- [创建 Asset](/zh/smart-contracts/core/create-asset)
## 术语表
| 术语 | 定义 |
|------|------------|
| **Token Metadata (TM)** | 使用多账户的遗留 Metaplex NFT 标准 |
| **Core** | 单账户设计的新 Metaplex NFT 标准 |
| **Plugin** | 添加到 Core Asset 的模块化功能 |
| **ATA** | Associated Token Account（Core 中不需要） |
| **pNFT** | TM 中的可编程 NFT（版税强制内置于 Core） |
