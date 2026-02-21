---
title: 程序概述
metaTitle: 程序概述 | Core Candy Machine
description: Core Candy Machine 程序及其功能集概述,帮助您创建铸造体验。
---

## 介绍

到 2022 年 9 月,Solana 上 78% 的 NFT 都是通过 Metaplex 的 Candy Machine 铸造的。这包括 Solana 生态系统中大多数知名的 NFT 项目。到 2024 年,Metaplex 推出了 `Core` 协议,重新定义了 Solana 上的 NFT,并为 `Core` 标准提供了一个新的 Candy Machine,以适应用户喜爱的相同铸造机制。

以下是它提供的一些功能。

- 接受 SOL、NFT 或任何 Solana 代币的支付。
- 通过开始/结束日期、铸造限制、第三方签名者等限制您的发布。
- 通过可配置的机器人税和验证码等守门人保护您的发布免受机器人攻击。
- 限制特定资产/NFT/代币持有者或精选钱包列表的铸造。
- 使用不同的规则集创建多个铸造组。
- 在发布后揭示您的资产,同时允许用户验证该信息。
- 还有更多!

感兴趣吗?让我们为您简要介绍一下 `Core Candy Machine` 的工作原理!

## Core Candy Machine 的生命周期

第一步是创作者创建一个新的 Core Candy Machine 并根据自己的需要进行配置。

{% diagram %}
{% node #action label="1. 创建和配置" theme="pink" /%}
{% node parent="action" x="250" %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node label="设置" /%}
{% /node %}
{% edge from="action" to="candy-machine" path="straight" /%}
{% /diagram %}

创建的 Core Candy Machine 会跟踪自己的设置,这帮助我们了解如何创建所有 NFT。例如,有一个 `collection` 参数将分配给从此 Core Candy Machine 创建的所有资产。我们将在菜单的**功能**部分更详细地了解如何创建和配置 Core Candy Machine。

但是,我们仍然不知道应该从该 Core Candy Machine 铸造哪些资产。换句话说,Core Candy Machine 目前尚未加载。我们的下一步是插入物品。

{% diagram %}
{% node #action-1 label="1. 创建和配置" theme="pink" /%}
{% node #action-2 label="2. 插入物品" parent="action-1" y="50" theme="pink" /%}
{% node parent="action-1" x="250" %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node label="设置" /%}
{% node #item-1 label="物品 1" /%}
{% node #item-2 label="物品 2" /%}
{% node #item-3 label="物品 3" /%}
{% node #item-rest label="..." /%}
{% /node %}
{% edge from="action-1" to="candy-machine" path="straight" /%}
{% edge from="action-2" to="item-1" /%}
{% edge from="action-2" to="item-2" /%}
{% edge from="action-2" to="item-3" /%}
{% edge from="action-2" to="item-rest" /%}
{% /diagram %}

每个物品由两个参数组成:

- `name`: 资产的名称。
- `uri`: 指向资产 [JSON 元数据](/zh/smart-contracts/token-metadata/token-standard#the-non-fungible-standard) 的 URI。这意味着 JSON 元数据已经通过链上(例如 Arweave、IPFS)或链下(例如 AWS、您自己的服务器)存储提供商上传。您可以使用的工具来创建 Candy Machine,如 Sugar 或 JS SDK 提供了帮助程序来完成此操作。

所有其他参数在资产之间共享,因此直接保存在 Candy Machine 的设置中以避免重复。有关更多详细信息,请参阅[插入物品](/zh/smart-contracts/core-candy-machine/insert-items)。

请注意,此时还没有创建真正的资产。我们只是将 Candy Machine 加载了它在铸造时**按需创建资产**所需的所有数据。这就引出了下一步。

{% diagram %}
{% node #action-1 label="1. 创建和配置" theme="pink" /%}
{% node #action-2 label="2. 插入物品" parent="action-1" y="50" theme="pink" /%}

{% node parent="action-1" x="250" %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node label="设置" /%}
{% node #item-1 label="物品 1" /%}
{% node #item-2 label="物品 2" /%}
{% node #item-3 label="物品 3" /%}
{% node #item-rest label="..." /%}
{% /node %}

{% node parent="candy-machine" x="180" y="20" %}
{% node #mint label="3. 铸造" theme="pink" /%}
{% node #mint-1 label="铸造 #1" theme="pink" /%}
{% node #mint-2 label="铸造 #2" theme="pink" /%}
{% node #mint-3 label="铸造 #3" theme="pink" /%}
{% /node %}

{% node #nft-1 parent="mint" x="120" label="资产" theme="blue" /%}
{% node #nft-2 parent="nft-1" y="50" label="资产" theme="blue" /%}
{% node #nft-3 parent="nft-2" y="50" label="资产" theme="blue" /%}

{% edge from="action-1" to="candy-machine" path="straight" /%}
{% edge from="action-2" to="item-1" /%}
{% edge from="action-2" to="item-2" /%}
{% edge from="action-2" to="item-3" /%}
{% edge from="action-2" to="item-rest" /%}
{% edge from="item-1" to="mint-1" /%}
{% edge from="item-2" to="mint-2" /%}
{% edge from="item-3" to="mint-3" /%}
{% edge from="mint-1" to="nft-1" path="bezier" /%}
{% edge from="mint-2" to="nft-2" path="bezier" /%}
{% edge from="mint-3" to="nft-3" path="bezier" /%}
{% /diagram %}

一旦 Candy Machine 被加载并且所有预配置的条件都满足,用户就可以开始从中铸造资产。只有在这个时候,资产才会在 Solana 区块链上创建。请注意,在铸造之前,一些用户可能需要执行额外的验证步骤 — 例如完成验证码或发送 Merkle 证明。有关更多详细信息,请参阅[铸造](/zh/smart-contracts/core-candy-machine/mint)。

一旦所有资产都从 Candy Machine 铸造完毕,它就完成了它的使命,可以安全地删除以释放区块链上的一些存储空间并收回一些租金。有关更多详细信息,请参阅[提取 Candy Machine](/zh/smart-contracts/core-candy-machine/withdrawing-a-candy-machine)。

{% diagram %}
{% node #action-1 label="4. 删除" theme="pink" /%}
{% node parent="action-1" x="150" %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node label="设置" /%}
{% node #item-1 label="物品 1" /%}
{% node #item-2 label="物品 2" /%}
{% node #item-3 label="物品 3" /%}
{% node #item-rest label="..." /%}
{% /node %}
{% node #nft-1 parent="candy-machine" x="200" label="资产" theme="blue" /%}
{% node #nft-2 parent="nft-1" y="50" label="资产" theme="blue" /%}
{% node #nft-3 parent="nft-2" y="50" label="资产" theme="blue" /%}
{% edge from="action-1" to="candy-machine" path="straight" /%}
{% /diagram %}

## Core Candy Machine 账户结构

解释存储的数据及其对用户的作用。

{% totem %}
{% totem-accordion title="链上 Core Candy Machine 数据结构" %}

MPL Core 资产的链上账户结构。[查看源代码](https://github.com/metaplex-foundation/mpl-core/blob/ce5d16f2de3c0038caae81a8c6496420b1a0462a/programs/mpl-core/src/state/asset.rs#L19)

| 名称           | 类型    | 大小 | 描述                                              |     |
| -------------- | ------- | ---- | ------------------------------------------------ | --- |
| version        | u8      | 1    | Candy Machine 的版本                              |     |
| features       | [u8; 6] | 6    | Candy Machine 启用了哪些功能标志                   |     |
| authority      | Pubkey  | 32   | Candy Machine 的权限                              |     |
| mint_authority | Pubkey  | 32   | Candy Machine 的铸造权限                          |     |
| collection     | Pubkey  | 32   | 分配给 Candy Machine 的集合地址                   |     |
| items_redeemed | u64     |      | 从 Candy Machine 兑换了多少物品                   |     |

{% /totem-accordion %}
{% /totem %}

## Candy 守卫

现在我们了解了 Core Candy Machine 的工作原理,让我们深入了解创作者可以保护和定制其 Core Candy Machine 铸造流程的各种方式。

创作者可以使用我们所谓的"**守卫**"来为其 Core Candy Machine 添加各种功能。Metaplex Core Candy Machine 附带一个名为 **Candy Guard** 的额外 Solana 程序,该程序附带[**总共 23 个默认守卫**](/zh/smart-contracts/core-candy-machine/guards)。通过使用额外的程序,它允许高级开发人员分叉默认的 Candy Guard 程序以创建自己的自定义守卫,同时仍然能够依赖主 Candy Machine 程序。

每个守卫都可以根据需要启用和配置,因此创作者可以挑选他们需要的功能。禁用所有守卫将等同于允许任何人随时免费铸造我们的 NFT,这可能不是我们想要的。所以让我们看一些守卫来创建一个更现实的例子。

假设 Core Candy Machine 有以下守卫:

- **Sol 支付**: 此守卫确保铸造钱包必须向配置的目标钱包支付配置的 SOL 金额。
- **开始日期**: 此守卫确保只能在配置的时间之后开始铸造。
- **铸造限制**: 此守卫确保每个钱包的铸造数量不能超过配置的数量。
- **机器人税**: 此守卫有点特殊。它不会阻止任何东西,但它会改变失败铸造的行为以防止机器人铸造 Candy Machine。当此守卫被激活时,如果任何其他激活的守卫无法验证铸造,它将向尝试铸造的钱包收取少量配置的 SOL。

我们最终得到的是一个受机器人保护的 Candy Machine,它收取 SOL,在特定时间启动,并且每个钱包只允许有限数量的铸造。这是一个具体的例子。

{% diagram %}
{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node label="设置" /%}
{% node #items label="物品" /%}
{% node #guards %}
守卫:

- Sol 支付 (0.1 SOL)
- 开始日期 (1月6日)
- 铸造限制 (1)
- 机器人税 (0.01 SOL)

{% /node %}
{% /node %}

{% node parent="candy-machine" x="250" %}
{% node #mints label="资产" theme="pink" /%}
{% node #mint-1 label="#1: 钱包 A (1 SOL) 在 1月5日" theme="pink" /%}
{% node #mint-2 label="#2: 钱包 B (3 SOL) 在 1月6日" theme="pink" /%}
{% node #mint-3 label="#3: 钱包 B (2 SOL) 在 1月6日" theme="pink" /%}
{% node #mint-4 label="#4: 钱包 C (0.5 SOL) 在 1月6日" theme="pink" /%}
{% /node %}
{% node #fail-1 parent="mints" x="250" theme="red" %}
太早了 {% .text-xs %} \
收取机器人税
{% /node %}
{% node #nft-2 parent="fail-1" y="50" label="资产" theme="blue" /%}
{% node #fail-3 parent="nft-2" y="50" theme="red" %}
已经铸造了 1 个 {% .text-xs %} \
收取机器人税
{% /node %}
{% node #fail-4 parent="fail-3" y="50" theme="red" %}
SOL 不足 {% .text-xs %} \
收取机器人税
{% /node %}

{% edge from="candy-machine" to="mint-1" /%}
{% edge from="candy-machine" to="mint-2" /%}
{% edge from="candy-machine" to="mint-3" /%}
{% edge from="candy-machine" to="mint-4" /%}
{% edge from="mint-1" to="fail-1" path="bezier" /%}
{% edge from="mint-2" to="nft-2" path="bezier" /%}
{% edge from="mint-3" to="fail-3" path="bezier" /%}
{% edge from="mint-4" to="fail-4" path="bezier" /%}
{% /diagram %}

如您所见,有超过 23 个默认守卫和创建自定义守卫的能力,它使创作者能够挑选对他们重要的功能并组合他们完美的 Candy Machine。这是一个如此强大的功能,我们已经为此专门撰写了许多页面。了解守卫的最佳起点是 [Candy 守卫](/zh/smart-contracts/core-candy-machine/guards)页面。
记录最新的变化。
