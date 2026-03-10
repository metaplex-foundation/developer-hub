---
title: Candy 守卫
metaTitle: Candy 守卫 | Core Candy Machine
description: Candy 守卫是模块化的访问控制组件，用于限制和自定义 Core Candy Machine 上的铸造。了解守卫类型、Candy Guard 账户、可用守卫以及如何组合使用它们。
keywords:
  - candy guard
  - guard
  - access control
  - sol payment
  - start date
  - mint limit
  - bot tax
  - allow list
  - NFT gate
  - token gate
  - custom guard
  - minting restrictions
  - Core Candy Machine guards
  - Solana NFT mint
  - guard groups
  - freeze payment
about:
  - Candy Guards
  - Access control
  - NFT minting
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: 我可以创建自定义 Candy 守卫吗？
    a: 可以。由于守卫位于单独的 Candy Guard 程序中，任何人都可以分叉并部署自己的 Candy Guard 程序以实现自定义守卫逻辑，同时仍然依赖 Core Candy Machine Core 程序进行铸造。Metaplex SDK 还允许您注册自定义 Candy Guard 程序，以便使用其标准 API。
  - q: 一个 Core Candy Machine 上可以同时使用多少个守卫？
    a: 您可以同时启用任意组合的可用守卫。守卫是可组合的，因此您只需激活所需的守卫。对于更复杂的场景，您还可以使用守卫组在单台机器上定义多组守卫。
  - q: 所有守卫都需要铸造设置或路由指令吗？
    a: 不需要。只有某些守卫需要额外的链上账户（铸造设置）或专用路由指令。大多数守卫是自包含的。请查看各个守卫的页面以了解是否需要铸造设置或路由指令。
  - q: 如果铸造者未通过守卫检查会发生什么？
    a: 交易将被拒绝。如果启用了 Bot Tax 守卫，失败的钱包将被收取可配置的 SOL 罚金，而不是收到直接错误，这可以阻止机器人发送无效的铸造尝试。
  - q: 更新 Core Candy Machine 上的守卫会替换所有现有守卫设置吗？
    a: 是的。守卫更新会覆盖整个守卫配置。您必须重新指定所有想要保持活动的守卫，而不仅仅是您正在更改的守卫。
  - q: Candy Guard 和守卫组有什么区别？
    a: Candy Guard 是存储一组默认守卫的链上账户。守卫组允许您在同一个 Candy Guard 账户中定义多个命名的守卫集，以便不同的钱包或阶段可以遵循不同的规则。
---

## 概述

Candy 守卫是模块化、可组合的访问控制组件，附加到 [Core Candy Machine](/zh/smart-contracts/core-candy-machine) 上，用于限制和自定义 Solana 上的[铸造](/zh/smart-contracts/core-candy-machine/mint)过程。 {% .lead %}

- 每个守卫负责单一职责，如支付、调度或钱包门控。 {% .lead %}
- 守卫定义在单独的链上 Core Candy Guard 账户中，该账户成为 Candy Machine 的铸造权限。 {% .lead %}
- 默认 Candy Guard 程序提供超过 25 个内置守卫，涵盖 SOL/代币支付、允许列表、时间窗口、机器人保护等。 {% .lead %}
- 可以通过分叉和部署您自己的 Candy Guard 程序来创建自定义守卫。 {% .lead %}

## 什么是 Candy 守卫？

Candy 守卫是一个模块化的链上组件，在 [Core Candy Machine](/zh/smart-contracts/core-candy-machine) 的[铸造](/zh/smart-contracts/core-candy-machine/mint)过程中执行单一访问控制规则。每个守卫独立激活，可以与其他守卫组合使用，以构建您所需的精确铸造体验。

有大量的守卫可供选择，每个守卫都可以根据需要激活和配置。

我们稍后将在本文档中介绍[所有可用的守卫](#可用守卫)，但让我们先通过几个例子来说明。

- 当启用 **Start Date** 守卫时，在预配置的日期之前将禁止铸造。还有一个 **End Date** 守卫可以在给定日期之后禁止铸造。
- 当启用 **Sol Payment** 守卫时，铸造钱包必须向配置的目标钱包支付配置的金额。类似的守卫存在于使用代币或特定 collection 的 NFT 支付。
- **Token Gate** 和 **NFT Gate** 守卫分别限制特定代币持有者和 NFT 持有者的铸造。
- **Allow List** 守卫只允许钱包在预定义的钱包列表中时才能铸造。有点像铸造的客人名单。

如您所见，每个守卫只负责一个职责，这使得它们可以组合。换句话说，您可以选择您需要的守卫来创建您完美的 Candy Machine。

## Core Candy Guard 账户

Core Candy Guard 账户是链上账户，存储给定 [Core Candy Machine](/zh/smart-contracts/core-candy-machine) 的每个已激活守卫及其配置。每个 Core Candy Machine 账户通常应该与其自己的 Core Candy Guard 账户关联，这将为其添加一层保护。

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

## 为什么守卫使用单独的程序

守卫位于专用的 Candy Guard 程序中——与 Core Candy Machine Core 程序分开——以便将访问控制逻辑与铸造逻辑完全解耦。守卫不在主 Core Candy Machine 程序中的原因是为了将访问控制逻辑与主 Core Candy Machine 的职责（即铸造 NFT）分开。

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

## 可用守卫

默认 Core Candy Guard 程序提供超过 25 个内置守卫，涵盖支付、调度、门控和机器人保护。在以下列表中，我们将提供每个守卫的简短描述，并附有指向其专用页面的链接以进行更高级的阅读。

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

## 注意事项

- 守卫是完全可组合的。您可以在单个 Core Candy Machine 上激活任意组合的内置守卫，以创建您所需的精确铸造体验。
- 创建自定义守卫需要分叉和部署您自己的 Candy Guard 程序。[Core](/zh/smart-contracts/core) Candy Machine Core 程序本身不需要更改。
- 更新 Core Candy Machine 上的守卫会覆盖整个守卫配置。请始终重新指定所有想要保持活动的守卫，而不仅仅是您正在修改的守卫。
- 某些守卫（如 [Allow List](/zh/smart-contracts/core-candy-machine/guards/allow-list)）需要在铸造前调用[路由指令](/zh/smart-contracts/core-candy-machine/guard-route)来验证先决条件。
- 您可以使用[守卫组](/zh/smart-contracts/core-candy-machine/guard-groups)将守卫组织为多个命名集，从而为不同的铸造阶段或钱包层级启用不同的规则。

## FAQ

### 我可以创建自定义 Candy 守卫吗？

可以。由于守卫位于单独的 Candy Guard 程序中，任何人都可以分叉并部署自己的 Candy Guard 程序以实现自定义守卫逻辑，同时仍然依赖 Core Candy Machine Core 程序进行铸造。Metaplex SDK 还允许您注册自定义 Candy Guard 程序，以便使用其标准 API。

### 一个 Core Candy Machine 上可以同时使用多少个守卫？

您可以同时启用任意组合的可用守卫。守卫是可组合的，因此您只需激活所需的守卫。对于更复杂的场景，您还可以使用[守卫组](/zh/smart-contracts/core-candy-machine/guard-groups)在单台机器上定义多组守卫。

### 所有守卫都需要铸造设置或路由指令吗？

不需要。只有某些守卫需要额外的链上账户（铸造设置）或专用[路由指令](/zh/smart-contracts/core-candy-machine/guard-route)。大多数守卫是自包含的。请查看各个守卫的页面以了解是否需要铸造设置或路由指令。

### 如果铸造者未通过守卫检查会发生什么？

交易将被拒绝。如果启用了 [Bot Tax](/zh/smart-contracts/core-candy-machine/guards/bot-tax) 守卫，失败的钱包将被收取可配置的 SOL 罚金，而不是收到直接错误，这可以阻止机器人发送无效的铸造尝试。

### 更新 Core Candy Machine 上的守卫会替换所有现有守卫设置吗？

是的。守卫更新会覆盖整个守卫配置。您必须重新指定所有想要保持活动的守卫，而不仅仅是您正在更改的守卫。

### Candy Guard 和守卫组有什么区别？

Candy Guard 是存储一组默认守卫的链上账户。[守卫组](/zh/smart-contracts/core-candy-machine/guard-groups)允许您在同一个 Candy Guard 账户中定义多个命名的守卫集，以便不同的钱包或阶段可以遵循不同的规则。

## 术语表

| 术语 | 定义 |
|------|------|
| Guard（守卫） | 在铸造过程中执行单一访问控制规则的模块化链上组件。 |
| Candy Guard | 存储 Core Candy Machine 完整已激活守卫集的链上账户。 |
| Candy Guard Program | 拥有 Candy Guard 账户并在委托给 Core Candy Machine Core 程序之前评估所有守卫条件的 Solana 程序。 |
| Mint Authority（铸造权限） | 被授权调用 Core Candy Machine 铸造操作的公钥；当守卫处于活动状态时，设置为 Candy Guard 账户。 |
| Sol Payment | 要求铸造钱包向目标钱包支付指定数量 SOL 的守卫。 |
| Bot Tax（机器人税） | 对失败的铸造交易收取可配置 SOL 罚金以阻止机器人的守卫。 |
| Allow List（允许列表） | 将铸造限制为存在于预定义 Merkle 树列表中的钱包的守卫。 |
| Guard Groups（守卫组） | 单个 Candy Guard 账户中的命名守卫集，为不同的铸造阶段或钱包层级启用不同的规则。 |
| Route Instruction（路由指令） | 某些守卫要求在铸造前调用的专用指令，用于验证或设置先决条件。请参阅[守卫路由](/zh/smart-contracts/core-candy-machine/guard-route)。 |
| Mint Settings（铸造设置） | 某些守卫在铸造过程中创建或需要的额外链上账户数据。 |

