---
title: 准备工作
metaTitle: 准备工作 | MPL-Hybrid
description: 在创建MPL-404混合资产之前如何准备
---

## MPL-404规划

在部署MPL-404托管和交换程序之前，您应该准备好一组NFT和同质化代币。如果您尚未准备好这些，我们建议在阅读完本页其余部分后，使用[Metaplex Core](https://metaplex.com/docs/core)创建非同质化代币，使用[Token Metadata程序](https://metaplex.com/docs/token-metadata)创建同质化代币。

要为托管账户注资，您需要添加NFT、同质化代币或两者的混合。实际上，最简单的方法是用一种类型的所有资产填充托管账户，同时分发另一种。这将确保托管账户保持平衡。

## 链下元数据URI格式

为了利用MPL-404的元数据随机化功能，链下元数据URI需要一致定义并递增。并非所有链下元数据解决方案都支持一致的基础URI。Shadow Drive是一种可能的具有递增URI的链下元数据解决方案。URI应该如下所示：

- https://shdw-drive.genesysgo.net/.../0.json
- https://shdw-drive.genesysgo.net/.../1.json

...

- https://shdw-drive.genesysgo.net/.../999999.json

## 交换随机化

目前，MPL-Hybrid程序在提供的最小和最大URI索引之间随机选择一个数字，并且不检查URI是否已被使用。因此，交换受到[生日悖论](https://betterexplained.com/articles/understanding-the-birthday-paradox/)的影响。为了使项目受益于足够的交换随机化，我们建议准备和上传至少25万个可以随机选择的资产元数据。可用的潜在资产越多越好。

## 考虑交换费用和稀有性

交换费用在填充项目金库之外发挥着重要作用。交换费用需要与特征稀有性保持平衡，以防止稀有性通胀。作为经验法则，费用越低，特征需要越稀有。总体而言，项目需要使特征比静态集合更加稀有。
