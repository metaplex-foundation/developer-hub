---
title: MPL Core中的灵魂绑定资产
metaTitle: MPL Core中的灵魂绑定资产 | Core指南
description: 本指南探讨了MPL Core中灵魂绑定资产的不同选项
updated: '01-31-2026'
keywords:
  - soulbound NFT
  - non-transferable NFT
  - bound token
  - SBT
about:
  - Soulbound tokens
  - Non-transferable NFTs
  - Identity tokens
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - 在Permanent Freeze Delegate或Oracle Plugin方法之间选择
  - 在收藏品级别创建带有灵魂绑定插件的Collection
  - 添加插件并将frozen状态设置为true，authority设置为None
  - 将Asset铸造到Collection中 - 它们继承灵魂绑定行为
howToTools:
  - Node.js
  - Umi框架
  - mpl-core SDK
---
灵魂绑定NFT是永久绑定到特定钱包地址且无法转让给其他所有者的非同质化代币。它们对于表示应与特定身份绑定的成就、凭证或会员资格很有用。 {% .lead %}
## 概述
在本指南中，我们将探讨如何使用MPL Core和Umi框架创建灵魂绑定资产。无论您是希望在TypeScript中实现灵魂绑定NFT的开发人员，还是只想了解它们的工作原理，我们都将涵盖从基本概念到实际实现的所有内容。我们将研究使资产成为灵魂绑定的不同方法，并逐步介绍如何在收藏品中创建您的第一个灵魂绑定NFT。
在MPL Core中，有两种主要方法来创建灵魂绑定NFT：
### 1. Permanent Freeze Delegate插件
- 使资产完全不可转让和不可销毁
- 可以应用于：
  - 单个资产级别
  - 收藏品级别（更节省租金）
- 收藏品级别的实现允许在单个交易中解冻所有资产
### 2. Oracle插件
- 使资产不可转让但仍可销毁
- 也可以应用于：
  - 单个资产级别
  - 收藏品级别（更节省租金）
- 收藏品级别的实现允许在单个交易中解冻所有资产
## 使用Permanent Freeze Delegate插件创建灵魂绑定NFT
Permanent Freeze Delegate插件通过冻结资产来提供使资产不可转让的功能。创建灵魂绑定资产时，您需要：
1. 在资产创建期间包含Permanent Freeze插件
2. 将初始状态设置为frozen
3. 将authority设置为None，使frozen状态永久且不可更改
这有效地创建了无法转让或解冻的永久灵魂绑定资产。以下代码片段显示了添加这三个选项的位置：
```js
  await create(umi, {
    asset: assetSigner,
    collection: collection,
    name: "My Frozen Asset",
    uri: "https://example.com/my-asset.json",
    plugins: [
      {
        type: 'PermanentFreezeDelegate', // 包含Permanent Freeze插件
        frozen: true, // 将初始状态设置为frozen
        authority: { type: "None" }, // 将authority设置为None
      },
    ],
  })
```
### 资产级实现
Permanent Freeze Delegate插件可以附加到单个资产上使其成为灵魂绑定。这提供了更细粒度的控制，但如果将来需要取消灵魂绑定，则需要更多租金和每个资产单独的解冻交易。
详细的代码示例请参阅英文文档。
### 收藏品级实现
对于所有资产都应该是灵魂绑定的收藏品，在收藏品级别应用插件更有效。这需要更少的租金，并可以在一个交易中解冻整个收藏品。
## 使用Oracle插件创建灵魂绑定NFT
Oracle插件提供了一种批准或拒绝资产不同生命周期事件的方法。要创建灵魂绑定NFT，我们可以使用Metaplex部署的特殊Oracle，该Oracle始终拒绝转让事件，同时仍允许销毁等其他操作。这与Permanent Freeze Delegate插件方法不同，因为资产虽然无法转让但仍可销毁。
使用Oracle插件创建灵魂绑定资产时，将插件附加到资产上。这可以在创建时或之后完成。在此示例中，我们使用Metaplex部署的[默认Oracle](/smart-contracts/core/external-plugins/oracle#default-oracles-deployed-by-metaplex)，它始终拒绝。
这有效地创建了无法转让但可销毁的永久灵魂绑定资产。以下代码片段显示了方法：
```js
const ORACLE_ACCOUNT = publicKey(
  "GxaWxaQVeaNeFHehFQEDeKR65MnT6Nup81AGwh2EEnuq"
);
await create(umi, {
  asset: assetSigner,
  collection: collection,
  name: "My Soulbound Asset",
  uri: "https://example.com/my-asset.json",
  plugins: [
    {
      // Oracle插件允许我们控制转让权限
      type: "Oracle",
      resultsOffset: {
        type: "Anchor",
      },
      baseAddress: ORACLE_ACCOUNT,
      lifecycleChecks: {
        // 配置Oracle拒绝所有转让尝试
        transfer: [CheckResult.CAN_REJECT],
      },
      baseAddressConfig: undefined,
    },
  ],
})
```
详细的代码示例和收藏品级实现请参阅英文文档。
