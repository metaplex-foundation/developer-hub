---
title: 概述
metaTitle: 概述 | Candy Machine
description: 提供Candy Machine的概述。
---

Metaplex协议的**Candy Machine**是Solana上用于公平NFT集合发布的领先铸造和分发程序。正如其名称所示,您可以将Candy Machine视为一个临时结构,首先由创作者加载,然后由买家卸载。它允许创作者以安全且可定制的方式将其数字资产上链。{% .lead %}

该名称来源于通过机械摇柄投币分发糖果的自动售货机。在这种情况下,糖果是NFT,付款是SOL或SPL代币。

{% figure src="/assets/candy-machine/candy-machine-photo.png" alt="一台典型糖果机的AI生成照片" caption="一台典型的糖果机" /%}

{% quick-links %}

{% quick-link title="入门指南" icon="InboxArrowDown" href="/zh/smart-contracts/candy-machine/getting-started" description="找到您选择的语言或库,开始使用Candy Machine。" /%}
{% quick-link title="API参考" icon="CodeBracketSquare" href="https://mpl-candy-machine.typedoc.metaplex.com/" target="_blank" description="正在寻找特定内容?我们为您提供。" /%}
{% /quick-links %}

{% callout %}
本文档涉及Candy Machine V3,可用于铸造Metaplex Token Metadata NFT。如果您想创建Core资产,请参阅[Core Candy Machine](/zh/smart-contracts/core-candy-machine)。
{% /callout %}

## 简介

截至2022年9月,Solana上78%的NFT都是通过Metaplex的Candy Machine铸造的。这包括Solana生态系统中大多数知名的NFT项目。

以下是它提供的一些功能。

- 接受SOL、NFT或任何Solana代币作为付款。
- 通过开始/结束日期、铸造限制、第三方签名者等限制您的发布。
- 通过可配置的机器人税和验证码等守门人保护您的发布免受机器人攻击。
- 将铸造限制为特定NFT/代币持有者或精选钱包列表。
- 创建具有不同规则集的多个铸造组。
- 在发布后揭示您的NFT,同时允许您的用户验证该信息。
- 还有更多功能!

感兴趣吗?让我们带您简单了解Candy Machine的工作原理!

## Candy Machine的生命周期

第一步是创作者创建一个新的Candy Machine并按照自己的意愿进行配置。

{% diagram %}
{% node #action label="1. 创建和配置" theme="pink" /%}
{% node parent="action" x="250" %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node label="设置" /%}
{% /node %}
{% edge from="action" to="candy-machine" path="straight" /%}
{% /diagram %}

创建的Candy Machine会跟踪其自己的设置,这有助于我们了解如何铸造其所有NFT。例如,有一个`creators`参数将分配给从此Candy Machine铸造的所有NFT。我们将在以下页面中更详细地了解如何创建和配置Candy Machine,包括一些代码示例:[Candy Machine设置](/zh/smart-contracts/candy-machine/settings)和[管理Candy Machine](/zh/smart-contracts/candy-machine/manage)。

然而,我们仍然不知道应该从该Candy Machine铸造哪些NFT。换句话说,Candy Machine尚未加载。因此,我们的下一步是向Candy Machine插入项目。

{% diagram %}
{% node #action-1 label="1. 创建和配置" theme="pink" /%}
{% node #action-2 label="2. 插入项目" parent="action-1" y="50" theme="pink" /%}
{% node parent="action-1" x="250" %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node label="设置" /%}
{% node #item-1 label="项目1" /%}
{% node #item-2 label="项目2" /%}
{% node #item-3 label="项目3" /%}
{% node #item-rest label="..." /%}
{% /node %}
{% edge from="action-1" to="candy-machine" path="straight" /%}
{% edge from="action-2" to="item-1" /%}
{% edge from="action-2" to="item-2" /%}
{% edge from="action-2" to="item-3" /%}
{% edge from="action-2" to="item-rest" /%}
{% /diagram %}

每个项目由两个参数组成:

- `name`:NFT的名称。
- `uri`:指向NFT的[JSON元数据](https://metaplex.com/docs/token-metadata/token-standard#the-non-fungible-standard)的URI。这意味着JSON元数据已经通过链上(例如Arweave、IPFS)或链下(例如AWS、您自己的服务器)存储提供商上传。

所有其他参数在所有NFT之间共享,因此直接保存在Candy Machine的设置中以避免重复。有关更多详细信息,请参阅[插入项目](/zh/smart-contracts/candy-machine/insert-items)。

请注意,此时尚未创建真正的NFT。我们只是在Candy Machine中加载所有需要的数据,以便在铸造时**按需创建NFT**。这就引出了下一步。

{% diagram %}
{% node #action-1 label="1. 创建和配置" theme="pink" /%}
{% node #action-2 label="2. 插入项目" parent="action-1" y="50" theme="pink" /%}

{% node parent="action-1" x="250" %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node label="设置" /%}
{% node #item-1 label="项目1" /%}
{% node #item-2 label="项目2" /%}
{% node #item-3 label="项目3" /%}
{% node #item-rest label="..." /%}
{% /node %}

{% node parent="candy-machine" x="180" y="20" %}
{% node #mint label="3. 铸造" theme="pink" /%}
{% node #mint-1 label="铸造 #1" theme="pink" /%}
{% node #mint-2 label="铸造 #2" theme="pink" /%}
{% node #mint-3 label="铸造 #3" theme="pink" /%}
{% /node %}

{% node #nft-1 parent="mint" x="120" label="NFT" theme="blue" /%}
{% node #nft-2 parent="nft-1" y="50" label="NFT" theme="blue" /%}
{% node #nft-3 parent="nft-2" y="50" label="NFT" theme="blue" /%}

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

一旦Candy Machine加载完成并满足所有预配置条件,用户就可以从中开始铸造NFT。只有在这个时候,NFT才会在Solana区块链上创建。请注意,在铸造之前,某些用户可能需要执行额外的验证步骤——例如完成验证码或发送Merkle证明。有关更多详细信息,请参阅[铸造](/zh/smart-contracts/candy-machine/mint)。

一旦从Candy Machine铸造了所有NFT,它就完成了使命,可以安全删除以释放区块链上的一些存储空间并收回一些租金。有关更多详细信息,请参阅[管理Candy Machine](/zh/smart-contracts/candy-machine/manage)。

{% diagram %}
{% node #action-1 label="4. 删除" theme="pink" /%}
{% node parent="action-1" x="150" %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node label="设置" /%}
{% node #item-1 label="项目1" /%}
{% node #item-2 label="项目2" /%}
{% node #item-3 label="项目3" /%}
{% node #item-rest label="..." /%}
{% /node %}
{% node #nft-1 parent="candy-machine" x="200" label="NFT" theme="blue" /%}
{% node #nft-2 parent="nft-1" y="50" label="NFT" theme="blue" /%}
{% node #nft-3 parent="nft-2" y="50" label="NFT" theme="blue" /%}
{% edge from="action-1" to="candy-machine" path="straight" /%}
{% /diagram %}

## Candy Guard

现在我们了解了Candy Machine的工作原理,让我们深入了解创作者可以保护和自定义其Candy Machine铸造过程的各种方式。

创作者可以使用我们所谓的"**Guard**"向其Candy Machine添加各种功能。Metaplex Candy Machine附带一个名为**Candy Guard**的附加Solana程序,该程序提供[**总共21个默认guard**](/zh/smart-contracts/candy-machine/guards)。通过使用附加程序,它允许高级开发人员分叉默认的Candy Guard程序以创建自己的自定义guard,同时仍然能够依赖主Candy Machine程序。

每个guard都可以根据需要启用和配置,因此创作者可以挑选他们需要的功能。禁用所有guard将等同于允许任何人随时免费铸造我们的NFT,这可能不是我们想要的。因此,让我们看一些guard来创建一个更现实的示例。

假设一个Candy Machine具有以下guard:

- **Sol Payment**:此guard确保铸造钱包必须向配置的目标钱包支付配置的SOL金额。
- **Start Date**:此guard确保只有在配置的时间之后才能进行铸造。
- **Mint Limit**:此guard确保每个钱包铸造的数量不超过配置的数量。
- **Bot Tax**:此guard有点特殊。它不阻止任何东西,但它会改变失败铸造的行为以防止机器人铸造Candy Machine。当此guard激活时,如果任何其他激活的guard未能验证铸造,它将向尝试铸造的钱包收取少量配置的SOL。

我们最终得到的是一个受机器人保护的Candy Machine,它收取SOL,在特定时间启动,并且每个钱包只允许有限数量的铸造。这是一个具体的例子。

{% diagram %}
{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node label="设置" /%}
{% node #items label="项目" /%}
{% node #guards %}
Guard:

- Sol Payment (0.1 SOL)
- Start Date (1月6日)
- Mint Limit (1)
- Bot Tax (0.01 SOL)

{% /node %}
{% /node %}

{% node parent="candy-machine" x="250" %}
{% node #mints label="铸造" theme="pink" /%}
{% node #mint-1 label="#1: 钱包A (1 SOL) 1月5日" theme="pink" /%}
{% node #mint-2 label="#2: 钱包B (3 SOL) 1月6日" theme="pink" /%}
{% node #mint-3 label="#3: 钱包B (2 SOL) 1月6日" theme="pink" /%}
{% node #mint-4 label="#4: 钱包C (0.5 SOL) 1月6日" theme="pink" /%}
{% /node %}
{% node #fail-1 parent="mints" x="250" theme="red" %}
太早 {% .text-xs %} \
已收取机器人税
{% /node %}
{% node #nft-2 parent="fail-1" y="50" label="NFT" theme="blue" /%}
{% node #fail-3 parent="nft-2" y="50" theme="red" %}
已铸造1个 {% .text-xs %} \
已收取机器人税
{% /node %}
{% node #fail-4 parent="fail-3" y="50" theme="red" %}
SOL不足 {% .text-xs %} \
已收取机器人税
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

如您所见,拥有超过21个默认guard以及创建自定义guard的能力,使创作者能够挑选对他们重要的功能并组成完美的Candy Machine。这是一个非常强大的功能,我们已经为它专门准备了许多页面。了解有关guard的更多信息的最佳起点是[Candy Guard](/zh/smart-contracts/candy-machine/guards)页面。

## 下一步

虽然这提供了Candy Machine的良好概述,但还有更多内容需要发现和学习。以下是您可以在Candy Machine文档的其他页面中期待的内容。

- [入门指南](/zh/smart-contracts/candy-machine/getting-started)。列出您可以用来管理Candy Machine的各种库和SDK。
- [Candy Machine设置](/zh/smart-contracts/candy-machine/settings)。详细解释Candy Machine设置。
- [管理Candy Machine](/zh/smart-contracts/candy-machine/manage)。解释如何管理Candy Machine。
- [插入项目](/zh/smart-contracts/candy-machine/insert-items)。解释如何将项目加载到Candy Machine中。
- [Candy Guard](/zh/smart-contracts/candy-machine/guards)。解释guard的工作原理以及如何启用它们。
- [Guard组](/zh/smart-contracts/candy-machine/guard-groups)。解释如何配置多组guard。
- [特殊Guard指令](/zh/smart-contracts/candy-machine/guard-route)。解释如何执行特定于guard的指令。
- [铸造](/zh/smart-contracts/candy-machine/mint)。解释如何从Candy Machine铸造以及如何处理预铸造要求。
- [参考](/zh/smart-contracts/candy-machine/references)。列出与Candy Machine相关的API参考。
