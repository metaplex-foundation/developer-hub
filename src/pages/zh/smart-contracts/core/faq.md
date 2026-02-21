---
title: 常见问题
metaTitle: 常见问题 | Core
description: 关于 Metaplex Core 协议的常见问题。
updated: '01-31-2026'
keywords:
  - Core FAQ
  - Metaplex Core questions
  - NFT FAQ
  - mpl-core help
about:
  - Metaplex Core
  - NFT development
proficiencyLevel: Beginner
faqs:
  - q: 为什么 Core 同时有链上和链下数据？
    a: 将所有内容存储在链上会很昂贵（租金成本）且不灵活。拆分数据允许链上保证，同时链下提供灵活的元数据。使用 Inscriptions 可以实现完全链上数据。
  - q: 使用 Core 有任何费用吗？
    a: Core 每个 Asset 铸造收取 0.0015 SOL。详情请参阅协议费用页面。
  - q: 如何创建灵魂绑定 Asset？
    a: 使用 Permanent Freeze Delegate 插件或 Oracle 插件。详情请参阅灵魂绑定 Asset 指南。
  - q: 如何将 Asset 设置为不可变？
    a: Core 中有多个不可变性级别。使用 ImmutableMetadata 插件或移除更新权限。详情请参阅不可变性指南。
  - q: Token Metadata 和 Core 有什么区别？
    a: Core 更便宜（成本降低约 80%），需要更少的账户（1 个 vs 3+ 个），使用更少的计算单元，并且有灵活的插件系统，而不是分散的代理。
  - q: Core 支持版本吗？
    a: 是的，使用 Edition 和 Master Edition 插件。详情请参阅打印版本指南。
---
## 为什么 Core Asset 和 Collection 账户同时有链上和链下数据？
Core Asset 和 Collection 账户都包含链上数据，但两者也包含一个 `URI` 属性，指向提供额外数据的链下 JSON 文件。为什么是这样？我们不能把所有东西都存储在链上吗？好吧，将数据存储在链上存在几个问题：
- 在链上存储数据需要支付租金。如果我们必须将所有内容存储在 Asset 或 Collection 账户中（可能包括诸如资产描述之类的长文本），这将需要更多的字节，创建 Asset 会突然变得更加昂贵，因为存储更多字节意味着必须支付更多租金
- 链上数据不太灵活。一旦使用某种字节结构创建了账户状态，就不能轻易更改，否则可能会导致反序列化问题。因此，如果我们必须将所有内容存储在链上，标准将更难以随着生态系统的需求而发展。
因此，将数据拆分为链上和链下数据允许用户获得两全其美的效果，其中链上数据可以被程序用于**为用户创建保证和期望**，链下数据可以用于**提供标准化但灵活的信息**。但不用担心，如果您希望数据完全在链上，Metaplex 也为此目的提供了 [Inscriptions](/zh/smart-contracts/inscription)。
## 使用 Core 有任何费用吗？
Core 目前向调用者收取非常小的费用，每个 Asset 铸造 0.0015 SOL。更多详情可以在[协议费用](/protocol-fees)页面找到。
## 如何创建灵魂绑定 Asset？
Core 标准允许您创建灵魂绑定 Asset。要实现这一点，可以使用 [Permanent Freeze Delegate](/smart-contracts/core/plugins/permanent-freeze-delegate) 插件或 [Oracle 插件](/smart-contracts/core/external-plugins/oracle)。
要了解更多，请查看[灵魂绑定 Asset 指南](/smart-contracts/core/guides/create-soulbound-nft-asset)！
## 如何将 Asset 设置为不可变？
Core 中有多个"不可变性"级别。您可以在[此指南](/smart-contracts/core/guides/immutability)中找到更多信息和实现方法。
## Metaplex Token Metadata 和 Core 有什么区别？
Core 是一个专为 NFT 设计的全新标准，因此有几个显著的区别。例如，Core 更便宜，需要更少的计算单元，从开发者的角度来看应该更容易使用。有关详情，请查看[差异](/smart-contracts/core/tm-differences)页面。
## Core 支持版本吗？
是的！使用 [Edition](/smart-contracts/core/plugins/edition) 和 [Master Edition](/smart-contracts/core/plugins/master-edition) 插件。您可以在["如何打印版本"指南](/smart-contracts/core/guides/print-editions)中找到更多信息。
