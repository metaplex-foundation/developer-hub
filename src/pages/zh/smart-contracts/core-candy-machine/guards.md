---
title: Candy Guards
metaTitle: Candy Guards | Core Candy Machine
description: 了解 Core Candy Machine 可用的不同类型守卫及其功能。
---

## 什么是守卫？

守卫是一段模块化代码，可以限制对 Core Candy Machine 铸造的访问，甚至为其添加新功能！

有大量的守卫可供选择，每个守卫都可以根据需要激活和配置。

我们稍后将在本文档中介绍[所有可用的守卫](/zh/smart-contracts/core-candy-machine/guards)，但让我们先通过几个例子来说明。

- 当启用 **Start Date** 守卫时，在预配置的日期之前将禁止铸造。还有一个 **End Date** 守卫可以在给定日期之后禁止铸造。
- 当启用 **Sol Payment** 守卫时，铸造钱包必须向配置的目标钱包支付配置的金额。类似的守卫存在于使用代币或特定 collection 的 NFT 支付。
- **Token Gate** 和 **NFT Gate** 守卫分别限制特定代币持有者和 NFT 持有者的铸造。
- **Allow List** 守卫只允许钱包在预定义的钱包列表中时才能铸造。有点像铸造的客人名单。

如您所见，每个守卫只负责一个职责，这使得它们可以组合。换句话说，您可以选择您需要的守卫来创建您完美的 Candy Machine。

## Core Candy Guard 账户

每个 Core Candy Machine 账户通常应该与其自己的 Core Candy Guard 账户关联，这将为其添加一层保护。

这通过创建一个 Core Candy Guard 账户并使其成为 Core Candy Machine 账户的 **Mint Authority** 来工作。这样做后，就不再可能直接从主 Core Candy Machine 程序铸造了。相反，我们必须通过 Core Candy Guard 程序铸造，如果所有守卫都成功解析，它将委托给 Core Candy Machine Core 程序来完成铸造过程。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Program" theme="dimmed" /%}
{% node label="Features" /%}
{% node label="Authority" /%}
{% node #mint-authority-1 %}

Mint Authority = Candy Guard {% .font-semibold %}

{% /node %}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" y=160 x=20 %}
{% node #candy-guard-1 label="Core Candy Guard" theme="blue" /%}
{% node label="Owner: Core Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node label="Sol Payment" /%}
{% node label="Token Payment" /%}
{% node label="Start Date" /%}
{% node label="End Date" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=350 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Core Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="Access Control" theme="transparent" /%}
{% node parent="mint-1" x=-120 y=-35 theme="transparent" %}
任何人都可以铸造，只要 \
他们符合激活的守卫。
{% /node %}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}
{% node parent="mint-2" x=215 y=-18 theme="transparent" %}
只有 Alice \
可以铸造。
{% /node %}

{% node #nft parent="mint-2" x=78 y=100 label="NFT" /%}

{% node parent="mint-2" x=280 %}
{% node #candy-machine-2 label="Candy Machine" theme="blue" /%}
{% node label="Owner: Candy Machine Core Program" theme="dimmed" /%}
{% node label="Features" /%}
{% node label="Authority" /%}
{% node #mint-authority-2 %}

Mint Authority = Alice {% .font-semibold %}

{% /node %}
{% node label="..." /%}
{% /node %}

{% edge from="candy-guard-1" to="mint-authority-1" fromPosition="left" toPosition="left" arrow=false dashed=true /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="candy-guard-1" to="mint-1" theme="pink" /%}
{% edge from="candy-machine-2" to="mint-2" theme="pink" path="straight" /%}

{% /diagram %}

注意，由于 Core Candy Machine 和 Core Candy Guard 账户紧密配合，我们的 SDK 将它们视为一个实体。当您使用我们的 SDK 创建 Core Candy Machine 时，默认情况下也会创建一个关联的 Core Candy Guard 账户。更新 Core Candy Machine 时也是如此，因为它们允许您同时更新守卫。我们将在本页看到一些具体示例。

## 为什么是另一个程序？

守卫不在主 Core Candy Machine 程序中的原因是为了将访问控制逻辑与主 Core Candy Machine 的职责（即铸造 NFT）分开。

这使得守卫不仅模块化而且可扩展。任何人都可以创建和部署自己的 Core Candy Guard 程序来创建自定义守卫，同时依赖 Core Candy Machine Core 程序处理其余部分。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Core Candy Guard" theme="blue" /%}
{% node label="Owner: Core Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node label="Sol Payment" /%}
{% node label="Token Payment" /%}
{% node label="Start Date" /%}
{% node label="End Date" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=300 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Core Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=180 %}
{% node #mint-1b label="Mint" theme="pink" /%}
{% node label="Custom Core Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1b" x=-80 y=-22 label="不同的访问控制" theme="transparent" /%}

{% node parent="mint-1" x=70 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=110 y=-20 label="相同的铸造逻辑" theme="transparent" /%}

{% node #nft parent="mint-2" x=77 y=100 label="NFT" /%}

{% node parent="mint-1b" x=250 %}
{% node #candy-machine-2 label="Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-2" y=80 x=0 %}
{% node #candy-guard-2 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Custom Core Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node label="Sol Payment" /%}
{% node label="Token Payment" /%}
{% node label="Start Date" /%}
{% node %}
My Custom Guard {% .font-semibold %}
{% /node %}
{% node label="..." /%}
{% /node %}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="candy-guard-2" to="candy-machine-2" fromPosition="right" toPosition="right" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" fromPosition="bottom" toPosition="top" /%}
{% edge from="mint-1b" to="mint-2" theme="pink" fromPosition="bottom" toPosition="top" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="candy-guard-1" to="mint-1" theme="pink" /%}
{% edge from="candy-machine-2" to="mint-1b" theme="pink" /%}
{% edge from="candy-guard-2" to="mint-1b" theme="pink" /%}

{% /diagram %}

注意，我们的 SDK 也提供了注册您自己的 Core Candy Guard 程序和自定义守卫的方法，以便您可以利用其友好的 API 并轻松与他人分享您的守卫。

## 所有可用的守卫

好的，现在我们了解了什么是守卫，让我们看看有哪些默认守卫可供我们使用。

在以下列表中，我们将提供每个守卫的简短描述，并附有指向其专用页面的链接以进行更高级的阅读。

- [**Address Gate**](/zh/smart-contracts/core-candy-machine/guards/address-gate)：将铸造限制为单个地址。
- [**Allocation**](/zh/smart-contracts/core-candy-machine/guards/allocation)：允许指定每个守卫组可以铸造的 NFT 数量限制。
- [**Allow List**](/zh/smart-contracts/core-candy-machine/guards/allow-list)：使用钱包地址列表来确定谁可以铸造。
- [**Asset Burn Multi**](/zh/smart-contracts/core-candy-machine/guards/asset-burn-multi)：将铸造限制为指定 collection 的持有者，需要销毁一个或多个 core assets。
- [**Asset Burn**](/zh/smart-contracts/core-candy-machine/guards/asset-burn)：将铸造限制为指定 collection 的持有者，需要销毁单个 core asset。
- [**Asset Gate**](/zh/smart-contracts/core-candy-machine/guards/asset-gate)：将铸造限制为指定 collection 的持有者。
- [**Asset Mint Limit**](/zh/smart-contracts/core-candy-machine/guards/asset-mint-limit)：将铸造限制为指定 collection 的持有者，并限制可以为提供的 Core Asset 执行的铸造数量。
- [**Asset Payment Multi**](/zh/smart-contracts/core-candy-machine/guards/asset-payment-multi)：将铸造价格设置为指定 collection 的多个 Core Assets。
- [**Asset Payment**](/zh/smart-contracts/core-candy-machine/guards/asset-payment)：将铸造价格设置为指定 collection 的 Core Asset。
- [**Bot Tax**](/zh/smart-contracts/core-candy-machine/guards/bot-tax)：可配置的税费，对无效交易收费。
- [**Edition**](/zh/smart-contracts/core-candy-machine/guards/edition)：将 Edition 插件添加到铸造的 Core Asset。有关更多信息，请参阅 [Print Editions](/zh/smart-contracts/core/guides/print-editions) 指南。
- [**End Date**](/zh/smart-contracts/core-candy-machine/guards/end-date)：确定结束铸造的日期。
- [**Freeze Sol Payment**](/zh/smart-contracts/core-candy-machine/guards/freeze-sol-payment)：设置带有冻结期的 SOL 铸造价格。
- [**Freeze Token Payment**](/zh/smart-contracts/core-candy-machine/guards/freeze-token-payment)：设置带有冻结期的代币数量铸造价格。
- [**Gatekeeper**](/zh/smart-contracts/core-candy-machine/guards/gatekeeper)：通过 Gatekeeper 网络限制铸造，例如验证码集成。
- [**Mint Limit**](/zh/smart-contracts/core-candy-machine/guards/mint-limit)：指定每个钱包的铸造数量限制。
- [**Nft Burn**](/zh/smart-contracts/core-candy-machine/guards/nft-burn)：将铸造限制为指定 collection 的持有者，需要销毁 NFT。
- [**Nft Gate**](/zh/smart-contracts/core-candy-machine/guards/nft-gate)：将铸造限制为指定 collection 的持有者。
- [**Nft Payment**](/zh/smart-contracts/core-candy-machine/guards/nft-payment)：将铸造价格设置为指定 collection 的 NFT。
- [**Program Gate**](/zh/smart-contracts/core-candy-machine/guards/program-gate)：限制可以在铸造交易中的程序。
- [**Redeemed Amount**](/zh/smart-contracts/core-candy-machine/guards/redeemed-amount)：根据已铸造总量确定铸造结束。
- [**Sol Fixed fee**](/zh/smart-contracts/core-candy-machine/guards/sol-fixed-fee)：设置固定价格的 SOL 铸造价格。类似于 [Sol Payment](/zh/smart-contracts/core-candy-machine/guards/sol-payment) 守卫。
- [**Sol Payment**](/zh/smart-contracts/core-candy-machine/guards/sol-payment)：设置 SOL 铸造价格。
- [**Start Date**](/zh/smart-contracts/core-candy-machine/guards/start-date)：确定铸造的开始日期。
- [**Third Party Signer**](/zh/smart-contracts/core-candy-machine/guards/third-party-signer)：需要交易上的额外签名者。
- [**Token Burn**](/zh/smart-contracts/core-candy-machine/guards/token-burn)：将铸造限制为指定代币的持有者，需要销毁代币。
- [**Token Gate**](/zh/smart-contracts/core-candy-machine/guards/token-gate)：将铸造限制为指定代币的持有者。
- [**Token Payment**](/zh/smart-contracts/core-candy-machine/guards/token-payment)：设置代币数量铸造价格。
- [**Token22 Payment**](/zh/smart-contracts/core-candy-machine/guards/token2022-payment)：设置 token22（代币扩展）数量铸造价格。
- [**Vanity Mint**](/zh/smart-contracts/core-candy-machine/guards/vanity-mint)：通过期望新的铸造地址匹配特定模式来限制铸造。

## 结论

守卫是 Core Candy Machine 的重要组成部分。它们使配置铸造过程变得容易，同时允许任何人为特定应用需求创建自己的守卫。
