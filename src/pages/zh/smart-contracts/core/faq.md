---
title: 常见问题
metaTitle: 常见问题 | Core
description: 关于 Metaplex Core 协议的常见问题解答。
---

## 为什么 Core Asset 和 Collection 账户同时拥有链上和链下数据？

Core Asset 和 Collection 账户都包含链上数据，但同时也包含一个指向链下 JSON 文件的 `URI` 属性，该文件提供额外的数据。这是为什么呢？我们不能把所有东西都存储在链上吗？实际上，在链上存储数据存在几个问题：

- 在链上存储数据需要支付租金。如果我们必须将所有内容都存储在 Asset 或 Collection 账户中，这可能包括资产描述等长文本，那将需要更多的字节，创建一个 Asset 的成本会突然变得更加昂贵，因为存储更多字节意味着需要支付更多租金。
- 链上数据灵活性较低。一旦使用某种字节结构创建了账户状态，就不容易更改，否则可能导致反序列化问题。因此，如果我们必须将所有内容都存储在链上，该标准将更难以随生态系统的需求而演进。

因此，将数据分为链上和链下数据允许用户两全其美：链上数据可被程序用于**为用户创建保证和预期**，而链下数据可用于**提供标准化但灵活的信息**。但别担心，如果您想要完全在链上的数据，Metaplex 还提供了 [Inscriptions](/zh/smart-contracts/inscription) 来实现这一目的。

## 使用 Core 有任何费用吗？

Core 目前对每次 Asset 铸造向调用者收取 0.0015 SOL 的极小费用。更多详情可以在[协议费用](/zh/protocol-fees)页面找到。

## 如何创建灵魂绑定（Soulbound）Asset？

Core 标准允许您创建灵魂绑定 Asset。要实现这一点，可以使用 [Permanent Freeze Delegate](/zh/smart-contracts/core/plugins/permanent-freeze-delegate) 插件或 [Oracle 插件](/zh/smart-contracts/core/external-plugins/oracle)。

要了解更多，请查看[灵魂绑定 Asset 指南](/zh/smart-contracts/core/guides/create-soulbound-nft-asset)！

## 如何将 Asset 设置为不可变？

Core 中有多个级别的"不可变性"。您可以在[这个指南](/zh/smart-contracts/core/guides/immutability)中找到更多信息以及如何实现它。

## Metaplex Token Metadata 和 Core 之间有什么区别？

Core 是一个专门为 NFT 设计的全新标准，因此存在几个显著差异。例如，Core 更便宜，需要更少的计算单元，并且从开发者的角度来看应该更容易使用。查看[差异](/zh/smart-contracts/core/tm-differences)页面了解详情。

## Core 支持版本（Editions）吗？

是的！使用 [Edition](/zh/smart-contracts/core/plugins/edition) 和 [Master Edition](/zh/smart-contracts/core/plugins/master-edition) 插件即可。您可以在["如何打印版本"指南](/zh/smart-contracts/core/guides/print-editions)中找到更多信息。
