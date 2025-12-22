---
title: 获取压缩NFT
metaTitle: 获取压缩NFT | Bubblegum V2
description: 了解如何在Bubblegum上获取压缩NFT。
---

如[概述](/zh/bubblegum#read-api)页面所述，压缩NFT不像普通NFT那样存储在链上账户中，而是记录在创建和更新它们的交易中。{% .lead %}

因此，创建了一个特殊的索引器来便于检索压缩NFT。这些索引数据通过Solana RPC方法的扩展提供，我们称之为**Metaplex DAS API**。实际上，DAS API允许我们获取任何**数字资产**。这可以是压缩NFT、普通NFT，甚至是同质化资产。

由于并非所有RPC都支持DAS API，如果您计划使用压缩NFT，则需要仔细选择RPC提供商。请注意，我们在[专门页面](/zh/rpc-providers)中维护了所有支持Metaplex DAS API的RPC列表。

在本页中，我们将学习如何使用Metaplex DAS API获取压缩NFT。

## 安装Metaplex DAS API SDK

选择支持Metaplex DAS API的RPC提供商后，您可以简单地发送特殊的RPC方法来获取压缩NFT。但是，我们的SDK通过提供辅助方法，提供了更方便的方式来开始使用DAS API。按照以下说明使用我们的SDK开始使用Metaplex DAS API。

{% totem %}

{% dialect-switcher title="开始使用Metaplex DAS API" %}
{% dialect title="JavaScript" id="js" %}

{% totem-prose %}
使用Umi时，Metaplex DAS API插件会自动安装在`mplBubblegum`插件中。所以您已经准备好了！

如果您想在_不_导入整个`mplBubblegum`插件的情况下使用DAS API插件，可以直接安装Metaplex DAS API插件：

```sh
npm install @metaplex-foundation/digital-asset-standard-api
```

之后，将库注册到您的Umi实例：

```ts
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

umi.use(dasApi());
```
{% /totem-prose %}
{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

{% totem-prose %}

您可以在其[代码库](https://github.com/metaplex-foundation/digital-asset-standard-api)中找到有关Metaplex DAS API可用方法的更多信息。

{% /totem-prose %}
{% /totem %}

## 资产ID {% #asset-ids %}

为了获取NFT（无论是否压缩），我们需要访问唯一标识NFT的ID。我们称这个唯一标识符为**资产ID**。

- 对于普通NFT，我们使用**NFT的铸造地址**，因为所有其他账户都只是从该地址派生。
- 对于压缩NFT，我们使用从**默克尔树地址**和压缩NFT在默克尔树中的**叶子索引**派生的特殊**PDA**（程序派生地址）。我们称这个特殊的PDA为**叶子资产ID**。

通常您不需要自己派生**叶子资产ID**，因为DAS API方法在批量获取压缩NFT时会为您提供它——例如，获取给定地址拥有的所有NFT。但是，如果您有默克尔树地址和cNFT的叶子索引，以下是如何使用我们的SDK派生叶子资产ID。

{% dialect-switcher title="查找叶子资产ID PDA" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { findLeafAssetIdPda } from '@metaplex-foundation/mpl-bubblegum'

const [assetId, bump] = await findLeafAssetIdPda(umi, {
  merkleTree,
  leafIndex,
})
```

{% /dialect %}
{% /dialect-switcher %}

## 获取压缩NFT

获取压缩NFT就像调用DAS API的`getAsset`方法一样简单。此方法将返回一个**Rpc Asset**对象，包含以下信息：

- **Id**：如上所述的资产ID。
- **Interface**：定义我们正在处理的资产类型的特殊值。例如`V1_NFT`或`ProgrammableNFT`。
- **Ownership**：告诉我们谁拥有资产的对象。这包括可能已设置的任何委托人以及资产是否被标记为冻结。
- **Mutable**：表示资产数据是否可更新的布尔值。
- **Authorities**：权限数组，每个包含一个范围数组，指示该权限允许对资产执行的操作。
- **Content**：包含资产数据的对象。即，它包括其URI和解析的`metadata`对象。
- **Royalty**：定义资产版税模型的对象。目前只支持一种版税模型，将一定百分比的收益发送给资产的创作者。
- **Supply**：处理可打印资产时，此对象提供打印版本的当前和最大供应量。
- **Creators**：资产创作者列表。每个包含一个`verified`布尔值，指示创作者是否已验证，以及一个`share`数字，指示应发送给创作者的版税百分比。
- **Grouping**：可帮助批量索引和检索资产的键/值分组机制数组。目前只支持一种分组机制——`collection`——允许我们按集合对资产进行分组。
- **Compression**：处理压缩NFT时，此对象提供有关Bubblegum树叶子的各种信息。例如，它提供叶子的完整哈希，以及用于验证资产真实性的部分哈希，如**创作者哈希**和**数据哈希**。它还提供默克尔树地址、其根、序列等。

以下是如何使用我们的SDK从给定的资产ID获取资产。

{% dialect-switcher title="获取压缩NFT" %}
{% dialect title="JavaScript" id="js" %}

```ts
const rpcAsset = await umi.rpc.getAsset(assetId)
```

{% /dialect %}
{% /dialect-switcher %}

## 获取压缩NFT的证明

虽然`getAsset` RPC方法返回了大量关于资产的信息，但它不返回资产的**证明**。如[概述](/zh/bubblegum#merkle-trees-leaves-and-proofs)页面所述，压缩NFT的证明是一个哈希列表，允许我们验证资产的真实性。没有它，任何人都可以假装他们在树中拥有具有任何给定数据的压缩NFT。

因此，对压缩NFT的许多操作——例如销毁、转移、更新等——在允许我们执行之前需要资产的证明。计算资产的证明是可能的，但需要某人知道给定树中存在的所有压缩NFT的哈希。这就是为什么DAS API也跟踪所有压缩NFT的证明。

为了访问压缩NFT的证明，我们可以使用`getAssetProof` RPC方法。此方法将返回一个**Rpc Asset Proof**对象，包含以下信息：

- **Proof**：如约定的压缩NFT的证明。
- **Root**：资产所属默克尔树的根。使用提供的证明验证资产时，我们应该得到这个根作为最终哈希。
- **Node Index**：如果我们从左到右、从上到下计算树中的每个节点，资产在默克尔树中的索引。一个更有用的索引称为**叶子索引**，可以通过以下公式从这个值推断：`leaf_index = node_index - 2^max_depth`，其中`max_depth`是默克尔树的最大深度。**叶子索引**是如果我们只计算树的叶子——即最低行——从左到右时资产在默克尔树中的索引。这个索引被许多指令请求，并用于派生资产的**叶子资产ID**。
- **Leaf**：压缩NFT的完整哈希。
- **Tree ID**：资产所属默克尔树的地址。

如您所见，这里的一些信息与`getAsset` RPC调用重复，但为方便起见在这里提供。然而，资产的**证明**和**节点索引**只能通过此方法获取。

以下是如何使用我们的SDK获取资产的证明。

{% dialect-switcher title="获取压缩NFT的证明" %}
{% dialect title="JavaScript" id="js" %}

```ts
const rpcAssetProof = await umi.rpc.getAssetProof(assetId)
```

{% /dialect %}
{% /dialect-switcher %}

## 获取多个压缩NFT

DAS API还允许我们使用`getAssetsByOwner`和`getAssetsByGroup` RPC方法一次获取多个资产。这些方法将返回分页的**Rpc Asset List**对象，包含以下信息：

- **Items**：如上所述的**Rpc Asset**数组。
- **Total**：基于提供的标准可用的资产总数。
- **Limit**：我们在一页上检索的最大资产数。
- **Page**：使用编号分页时，告诉我们当前在哪一页。
- **Before**和**After**：使用游标分页时，告诉我们当前在哪个资产之后和/或之前浏览资产。这些游标可用于导航到上一页和下一页。
- **Errors**：RPC返回的潜在错误列表。

以下是如何使用我们的SDK使用这两个RPC方法。

### 按所有者

{% dialect-switcher title="按所有者获取压缩NFT" %}
{% dialect title="JavaScript" id="js" %}

```ts
const rpcAssetList = await umi.rpc.getAssetsByOwner({ owner })
```

{% /dialect %}
{% /dialect-switcher %}

### 按集合

{% dialect-switcher title="按集合获取压缩NFT" %}
{% dialect title="JavaScript" id="js" %}

```ts
const rpcAssetList = await umi.rpc.getAssetsByGroup({
  groupKey: 'collection',
  groupValue: collectionMint,
})
```

{% /dialect %}
{% /dialect-switcher %}
