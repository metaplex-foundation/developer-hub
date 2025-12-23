---
title: Core 与 Token Metadata 的区别
metaTitle: Core 与 Token Metadata 的区别 | Core
description: Solana 区块链上 Core 和 Token Metadata NFT 协议之间的区别。
---

本页首先探讨 Core 相比 TM 的一般性改进，然后提供关于如何在 Core 中使用 TM 功能等效项的更多技术信息。

## 差异概述

- **前所未有的成本效率**：与现有替代方案相比，Metaplex Core 提供了最低的铸造成本。例如，使用 Token Metadata 铸造一个需要 0.022 SOL 的 NFT，使用 Core 只需 0.0037 SOL。
- **改善的开发者体验**：虽然大多数数字资产继承了维护整个同质化代币程序所需的数据，但 Core 是针对 NFT 优化的，允许将所有关键数据存储在单个 Solana 账户中。这极大地降低了开发者的复杂性，同时也有助于更广泛地改善 Solana 的网络性能。
- **增强的集合管理**：通过对集合的一流支持，开发者和创作者可以轻松管理集合级别的配置，如版税和插件，这些可以针对单个 NFT 进行独特的覆盖。这可以在单个交易中完成，降低了集合管理成本和 Solana 交易费用。
- **高级插件支持**：从内置质押到基于资产的积分系统，Metaplex Core 的插件架构开辟了广阔的实用性和定制化前景。插件允许开发者挂钩到任何资产生命周期事件（如创建、转移和销毁）以添加自定义行为。
- **兼容性和支持**：Core 完全由 Metaplex 开发者平台支持，将与一套 SDK 和即将推出的程序无缝集成，丰富 Metaplex 生态系统。
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

Core Collections 包含多项新功能。集合现在是它们自己的账户类型，与常规 Assets 区分开来。相比 Token Metadata 使用相同账户和状态来表示 NFT 和集合的方式，这是一个受欢迎的补充，使两者难以区分。

在 Core 中，集合是**一流资产**，允许额外的功能。例如，Core 通过向集合添加 Royalties 插件来提供集合级别的版税调整。开发者和创作者现在可以一次性更新集合中的所有资产，而不是被迫单独更新每个资产。但如果集合中的某些资产应该有不同的版税设置怎么办？没问题——只需将相同的插件添加到资产上，集合级别的版税插件就会被覆盖。

TM 无法实现的集合功能例如集合级别版税——更改版税或创作者时不再需要更新每个资产，而是在集合中定义。这可以通过向您的集合添加 [Royalties 插件](/zh/smart-contracts/core/plugins/royalties)来完成。某些资产应该有不同的版税设置？只需将相同的插件添加到资产上，集合级别的版税插件就会被覆盖。

冻结也可以在集合级别进行。

您可以在[管理集合](/zh/smart-contracts/core/collections)页面找到更多关于处理集合的信息，如创建或更新它们。

### 生命周期事件和插件

在 Asset 的生命周期中，可以触发多个事件，例如：

- 创建
- 转移
- 更新
- 销毁
- 添加插件
- 批准权限插件
- 移除权限插件

在 TM 中，这些生命周期事件要么由所有者执行，要么由委托人执行。所有 TM Assets（nfts/pNfts）都包含每个生命周期事件的函数。在 Core 中，这些事件由 [Plugins](/zh/smart-contracts/core/plugins) 在 Asset 级别或 Collection 级别处理。

在 Asset 级别或 Collection 级别附加的插件将在这些生命周期事件期间经历验证过程，以 `approve`（批准）、`reject`（拒绝）或 `force approve`（强制批准）事件的执行。

### 冻结/锁定

使用 TM 冻结资产时，您通常首先将冻结权限委托给另一个钱包，然后该钱包冻结 NFT。在 Core 中，您必须使用两个插件之一：`Freeze Delegate` 或 `Permanent Freeze Delegate`。后者只能在 Asset 创建期间添加，而 `Freeze Delegate` 插件可以在任何时候[添加](/zh/smart-contracts/core/plugins/adding-plugins)，前提是当前所有者签署交易。

Core 的委托也更容易，因为我们取消了 Delegate Record 账户，直接将委托权限存储在插件本身上，同时也可以在将插件添加到 Asset 时分配，无论是在 Asset 创建期间还是通过 `addPluginV1` 函数。

要让所有者将冻结权限分配给另一个账户，当资产还没有冻结插件时，他们需要添加具有该权限的插件并冻结它。

这是一个向 Asset 添加 `Freeze Delegate` 插件同时将其分配给委托权限的快速示例。

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

### Asset 状态

在 TM 中，您经常需要检查多个账户来找到 Asset 的当前状态，以及它是否已被冻结、锁定，甚至处于可转移状态。在 Core 中，此状态存储在 Asset 账户中，但也可能受到 Collection 账户的影响。

为了使事情更简单，我们引入了生命周期帮助函数，如 `canBurn`、`canTransfer`、`canUpdate`，这些包含在 `@metaplex-foundation/mpl-core` 包中。这些帮助函数返回一个 `boolean` 值，让您知道传入的地址是否有权限执行这些生命周期事件。

```js
const burningAllowed = canBurn(authority, asset, collection)
```

## 延伸阅读

上述功能只是冰山一角。其他有趣的主题包括：

- 集合管理
- 插件概述
- 使用 [Attributes 插件](/zh/smart-contracts/core/plugins/attribute)添加链上数据
