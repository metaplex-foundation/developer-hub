---
title: Core 与 Token Metadata 的区别
metaTitle: Core vs Token Metadata | Metaplex Core
description: 比较 Metaplex Core 和 Token Metadata NFT 标准。了解有什么变化、有什么新功能，以及如何将您的思维模式从 TM 迁移到 Core。
---

来自 **Token Metadata**？本指南解释了 Core 有什么不同、为什么更好，以及如何将您的 TM 知识转换为 Core 概念。 {% .lead %}

{% callout title="主要区别" %}

- **单一账户** vs 3 个以上账户（铸造、元数据、代币账户）
- **成本降低 80%**：每次铸造约 0.0037 SOL vs 0.022 SOL
- **插件**取代了委托人和冻结权限
- **集合是一等公民**，具有集合级操作
- **不需要 Associated Token Account**

{% /callout %}

## 摘要

Core 用单账户设计取代了 Token Metadata 的多账户模型。一切都更简单：创建、冻结、委托和管理集合。插件系统用统一、可扩展的架构取代了 TM 分散的委托类型。

| 功能 | Token Metadata | Core |
|---------|---------------|------|
| 每个 NFT 的账户数 | 3 个以上（铸造、元数据、ATA） | 1 个 |
| 铸造成本 | 约 0.022 SOL | 约 0.0037 SOL |
| 冻结机制 | 委托 + 冻结权限 | Freeze Delegate 插件 |
| 集合版税 | 逐资产更新 | 集合级插件 |
| 链上属性 | 无 | Attributes 插件支持 |

## 范围外

迁移脚本（即将推出）、pNFT 特定功能、可替代代币处理（使用 SPL Token）。

## 快速开始

**跳转至：** [成本比较](#区别概述) · [集合](#集合) · [冻结/锁定](#冻结--锁定) · [生命周期事件](#生命周期事件和插件)

如果您是新手，请使用 Core。如果要迁移，关键的思维转变是：
1. 一个账户，而不是三个
2. 插件，而不是委托
3. 集合级操作是原生的

## 区别概述

- **前所未有的成本效率**：Metaplex Core 提供与现有替代方案相比最低的铸造成本。例如，使用 Token Metadata 需要 0.022 SOL 的 NFT，使用 Core 只需 0.0037 SOL 即可铸造。
- **改进的开发者体验**：虽然大多数数字资产继承了维护整个可替代代币程序所需的数据，但 Core 针对 NFT 进行了优化，允许将所有关键数据存储在单个 Solana 账户中。这大大降低了开发者的复杂性，同时也有助于更广泛地改善 Solana 的网络性能。
- **增强的集合管理**：通过对集合的一等支持，开发者和创作者可以轻松管理版税和插件等集合级配置，这些可以针对单个 NFT 进行独特覆盖。这可以在单个交易中完成，降低了集合管理成本和 Solana 交易费用。
- **高级插件支持**：从内置质押到基于资产的积分系统，Metaplex Core 的插件架构开辟了广阔的实用性和定制化领域。插件允许开发者挂钩到任何资产生命周期事件（如创建、转移和销毁）以添加自定义行为。
- **兼容性和支持**：由 Metaplex 开发者平台完全支持，Core 将与一套 SDK 和即将推出的程序无缝集成，丰富 Metaplex 生态系统。
- **开箱即用的索引**：在 Metaplex 数字资产标准 API（DAS API）的基础上扩展，Core 资产将自动索引，并通过用于所有 Solana NFT 的通用接口提供给应用开发者。然而，一个独特的改进是，通过 Core 属性插件，开发者将能够添加现在也会自动索引的链上数据。

## 技术概述

### 创建

要创建 Core Asset，只需要一条创建指令。不需要像 Token Metadata 那样先铸造然后再附加元数据。这降低了复杂性和交易大小。

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

### 集合

Core 集合包含多项新功能。集合现在是它们自己的账户类型，与常规资产区分开来。这是对 Token Metadata 使用相同账户和状态来表示 NFT 和集合的方式的欢迎补充，使两者难以区分。

在 Core 中，集合是**一等资产**，允许额外的功能。例如，Core 通过向集合添加版税插件来提供集合级别的版税调整。开发者和创作者现在可以一次性更新集合中的所有资产，而不是被迫单独更新每个资产。但如果集合中的某些资产应该有不同的版税设置怎么办？没问题——只需将相同的插件添加到资产上，集合级别的版税插件就会被覆盖。

TM 无法实现的集合功能例如集合级别版税——更改版税或创作者时不再需要更新每个资产，而是在集合中定义。这可以通过向您的集合添加[版税插件](/zh/smart-contracts/core/plugins/royalties)来完成。某些资产应该有不同的版税设置？只需将相同的插件添加到资产上，集合级别的版税插件就会被覆盖。

冻结也可以在集合级别进行。

您可以在[管理集合](/zh/smart-contracts/core/collections)页面找到更多关于处理集合的信息，如创建或更新它们。

### 生命周期事件和插件

在资产的生命周期中，可以触发多个事件，例如：

- 创建
- 转移
- 更新
- 销毁
- 添加插件
- 批准权限插件
- 移除权限插件

在 TM 中，这些生命周期事件由所有者或委托人执行。所有 TM 资产（nfts/pNfts）都包含每个生命周期事件的函数。在 Core 中，这些事件由资产级别或集合级别的[插件](/zh/smart-contracts/core/plugins)处理。

在资产级别或集合级别附加的插件将在这些生命周期事件期间经历验证过程，以`批准`、`拒绝`或`强制批准`事件的执行。

### 冻结 / 锁定

使用 TM 冻结资产时，您通常首先将冻结权限委托给另一个钱包，然后该钱包冻结 NFT。在 Core 中，您必须使用两个插件之一：`Freeze Delegate` 或 `Permanent Freeze Delegate`。后者只能在资产创建期间添加，而 `Freeze Delegate` 插件可以在任何时候[添加](/zh/smart-contracts/core/plugins/adding-plugins)，前提是当前所有者签署交易。

Core 的委托也更容易，因为我们取消了 Delegate Record 账户，直接将委托权限存储在插件本身上，同时也可以在将插件添加到资产时分配，无论是在资产创建期间还是通过 `addPluginV1` 函数。

要让所有者将冻结权限分配给另一个账户，当资产还没有冻结插件时，他们需要添加具有该权限的插件并冻结它。

这是一个向资产添加 `Freeze Delegate` 插件同时将其分配给委托权限的快速示例。

{% totem %}
{% totem-accordion title="添加冻结插件、分配权限并冻结" %}

```js
await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: createPlugin('FreezeDelegate', { frozen: true }),
  initAuthority: pluginAuthority('Address', { address: delegate.publicKey }),
}).sendAndConfirm(umi)
```

{% /totem-accordion %}
{% /totem %}

此外，在 Core 中冻结可以在**集合级别**完成。可以在一个交易中冻结或解冻整个集合。

### 资产状态

在 TM 中，您经常需要检查多个账户来找到资产的当前状态，以及它是否已被冻结、锁定，甚至处于可转移状态。在 Core 中，此状态存储在资产账户中，但也可能受到集合账户的影响。

为了使事情更简单，我们引入了生命周期帮助函数，如 `canBurn`、`canTransfer`、`canUpdate`，这些包含在 `@metaplex-foundation/mpl-core` 包中。这些帮助函数返回一个 `boolean` 值，让您知道传入的地址是否有权限执行这些生命周期事件。

```js
const burningAllowed = canBurn(authority, asset, collection)
```

## 快速参考

### TM 概念 → Core 等效物

| Token Metadata | Core 等效物 |
|----------------|-----------------|
| Mint 账户 | Asset 账户 |
| Metadata 账户 | Asset 账户（合并） |
| Associated Token Account | 不需要 |
| 冻结权限 | Freeze Delegate 插件 |
| Update Authority | Update Authority（相同） |
| 委托 | Transfer/Burn/Update Delegate 插件 |
| 集合已验证 | 集合成员身份（自动） |
| 创作者数组 | Verified Creators 插件 |
| Uses/实用性 | 插件（自定义逻辑） |

### 常见操作

| 操作 | Token Metadata | Core |
|-----------|---------------|------|
| 创建 NFT | `createV1()`（多账户） | `create()`（单账户） |
| 冻结 | 委托然后冻结 | 添加 Freeze Delegate 插件 |
| 更新元数据 | `updateV1()` | `update()` |
| 转移 | SPL Token 转移 | `transfer()` |
| 销毁 | `burnV1()` | `burn()` |

## 常见问题

### 新项目应该使用 Core 还是 Token Metadata？

所有新项目都应使用 Core。它更便宜、更简单、功能更好。Token Metadata 是遗留的。

### 可以将现有的 TM NFT 迁移到 Core 吗？

不能自动迁移。Core 资产是不同的链上账户。迁移需要销毁 TM NFT 并铸造新的 Core 资产。

### pNFT 怎么了？

Core 的版税强制通过带有允许列表/拒绝列表支持的 Royalties 插件内置。不需要单独的"可编程"变体。

### 还需要 Associated Token Account 吗？

不需要。Core 资产不使用 ATA。所有权直接存储在资产账户中。

### 如何在 Core 中验证创作者？

使用 [Verified Creators 插件](/zh/smart-contracts/core/plugins/verified-creators)。它的工作方式类似于 TM 的创作者数组，但是可选的。

## 延伸阅读

上述功能只是冰山一角。其他有趣的主题包括：

- [集合管理](/zh/smart-contracts/core/collections)
- [插件概述](/zh/smart-contracts/core/plugins)
- 使用[属性插件](/zh/smart-contracts/core/plugins/attribute)添加链上数据
- [创建资产](/zh/smart-contracts/core/create-asset)

## 术语表

| 术语 | 定义 |
|------|------------|
| **Token Metadata (TM)** | 使用多账户的遗留 Metaplex NFT 标准 |
| **Core** | 采用单账户设计的新 Metaplex NFT 标准 |
| **插件** | 添加到 Core 资产的模块化功能 |
| **ATA** | Associated Token Account（Core 中不需要） |
| **pNFT** | TM 中的可编程 NFT（版税强制已内置于 Core） |

---

*由 Metaplex Foundation 维护 · 2026年1月最后验证 · 适用于 @metaplex-foundation/mpl-core*
