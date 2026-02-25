---
title: 概述
metaTitle: 概述 | Bubblegum V2
description: 提供Bubblegum V2和压缩NFT的高级概述。
---

Bubblegum V2是Metaplex协议程序的最新迭代，用于在Solana上创建和交互压缩NFT（cNFT）。专为大规模操作而构建，Bubblegum V2保留了原始Bubblegum的所有优势，同时引入了强大的新功能。压缩NFT通过重新思考链上数据存储方式，使NFT的创建可以扩展到新的数量级。{% .lead %}

{% callout %}
请注意，某些Bubblegum V2指令将需要协议费用。请查看[协议费用](/zh/protocol-fees)页面以获取最新信息。
{% /callout %}

{% quick-links %}

{% quick-link title="快速开始" icon="InboxArrowDown" href="/zh/smart-contracts/bubblegum-v2/sdk" description="找到您选择的语言或库，开始使用压缩NFT。" /%}

{% quick-link title="API参考" icon="CodeBracketSquare" href="https://mpl-bubblegum.typedoc.metaplex.com/" target="_blank" description="寻找特定内容？查看我们的API参考并找到您的答案。" /%}

{% /quick-links %}

## Bubblegum V2的新功能

Bubblegum V2在原始Bubblegum程序的基础上构建，同时引入了几个强大的新功能：

- **冻结和解冻功能**：提供两种类型的冻结/解冻：1）cNFT所有者可以将冻结权限委托给叶子委托人，用于资产级别的控制，为各种用例提供灵活性，如在特定事件期间阻止转账或实现锁定机制。2）如果在集合创建时启用了`PermanentFreezeDelegate`插件，项目创建者可以通过永久冻结委托人对cNFT进行集合级别的冻结和解冻控制
- **MPL-Core集合集成**：Bubblegum V2 NFT现在可以添加到MPL-Core集合，而不仅限于代币元数据集合，允许更大的灵活性和与更广泛的Metaplex生态系统的集成。
- **版税强制执行**：由于Bubblegum V2使用[MPL-Core](https://docs.metaplex.com/core/overview)集合，可以使用`ProgramDenyList`等方式对cNFT强制执行版税。
- **灵魂绑定NFT**：cNFT现在可以设为灵魂绑定（不可转让），将其永久绑定到所有者的钱包。这非常适合凭证、出席证明、身份验证等。它需要在创建集合时启用`PermanentFreezeDelegate`插件。
- **允许永久转账**：如果在集合上启用了`PermanentTransferDelegate`插件，永久转账委托人现在可以在没有叶子所有者交互的情况下将cNFT转移给新所有者。
- **授权销毁**：如果集合启用了`PermanentBurnDelegate`插件，委托人可以在没有叶子所有者签名的情况下销毁NFT。
- **属性**：可以使用MPL-Core的`attributes`插件在集合级别添加属性数据。

为了使上述功能正常工作，Bubblegum V2引入了新的叶子模式（`LeafSchemaV2`）。要了解更多关于Bubblegum V2中使用的叶子，请查看以下部分。

## LeafSchemaV2

Bubblegum V2引入了新的叶子模式（LeafSchemaV2），它支持额外的功能同时保持向后兼容。这个新模式允许：

- 与MPL-Core集合集成，而不是传统的代币元数据
- 支持冻结/解冻功能
- 启用灵魂绑定功能
项目可以根据需求选择使用旧版Bubblegum的原始叶子Schema或使用Bubblegum V2的新v2模式。

要使用新的`LeafSchemaV2`，必须使用需要通过[`createTreeV2`指令](/zh/smart-contracts/bubblegum-v2/create-trees)创建的V2默克尔树。V1默克尔树不支持新的叶子模式，V2默克尔树与V1叶子不兼容。

## 默克尔树、叶子和证明

压缩NFT仅存在于**默克尔树**的上下文中。我们在[专门的高级指南](/zh/smart-contracts/bubblegum-v2/concurrent-merkle-trees)中解释了什么是默克尔树，但就本概述而言，您可以将默克尔树视为我们称为**叶子**的哈希集合。每个叶子是通过[哈希压缩NFT的数据](/zh/smart-contracts/bubblegum-v2/hashed-nft-data)获得的。

对于默克尔树中的每个叶子，可以提供一个哈希列表——称为**证明**——使任何人都能验证给定的叶子是该树的一部分。每当压缩NFT被更新或转移时，其关联的叶子将改变，其证明也会改变。

{% diagram %}

{% node #root label="根节点" theme="slate" /%}
{% node #root-hash label="哈希" parent="root" x="56" y="40" theme="transparent" /%}
{% node #node-1 label="节点 1" parent="root" y="100" x="-200" theme="blue" /%}
{% node #node-1-hash label="哈希" parent="node-1" x="42" y="40" theme="transparent" /%}
{% node #node-2 label="节点 2" parent="root" y="100" x="200" theme="mint" /%}

{% node #node-3 label="节点 3" parent="node-1" y="100" x="-100" theme="mint" /%}
{% node #node-4 label="节点 4" parent="node-1" y="100" x="100" theme="blue" /%}
{% node #node-4-hash label="哈希" parent="node-4" x="42" y="40" theme="transparent" /%}
{% node #node-5 label="节点 5" parent="node-2" y="100" x="-100" /%}
{% node #node-6 label="节点 6" parent="node-2" y="100" x="100" /%}

{% node #leaf-1 label="叶子 1" parent="node-3" y="100" x="-45" /%}
{% node #leaf-2 label="叶子 2" parent="node-3" y="100" x="55" /%}
{% node #leaf-3 label="叶子 3" parent="node-4" y="100" x="-45" theme="blue" /%}
{% node #leaf-4 label="叶子 4" parent="node-4" y="100" x="55" theme="mint" /%}
{% node #leaf-5 label="叶子 5" parent="node-5" y="100" x="-45" /%}
{% node #leaf-6 label="叶子 6" parent="node-5" y="100" x="55" /%}
{% node #leaf-7 label="叶子 7" parent="node-6" y="100" x="-45" /%}
{% node #leaf-8 label="叶子 8" parent="node-6" y="100" x="55" /%}
{% node #nft label="NFT数据" parent="leaf-3" y="100" x="-12" theme="blue" /%}

{% node #proof-1 label="叶子 4" parent="nft" x="200" theme="mint" /%}
{% node #proof-2 label="节点 3" parent="proof-1" x="90" theme="mint" /%}
{% node #proof-3 label="节点 2" parent="proof-2" x="97" theme="mint" /%}
{% node #proof-legend label="证明" parent="proof-1" x="-6" y="-20" theme="transparent" /%}

{% edge from="node-1" to="root" fromPosition="top" toPosition="bottom" theme="blue" animated=true /%}
{% edge from="node-2" to="root" fromPosition="top" toPosition="bottom" theme="mint" animated=true /%}

{% edge from="node-3" to="node-1" fromPosition="top" toPosition="bottom" theme="mint" animated=true /%}
{% edge from="node-4" to="node-1" fromPosition="top" toPosition="bottom" theme="blue" animated=true /%}
{% edge from="node-6" to="node-2" fromPosition="top" toPosition="bottom" /%}
{% edge from="node-5" to="node-2" fromPosition="top" toPosition="bottom" /%}

{% edge from="leaf-1" to="node-3" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-2" to="node-3" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-4" to="node-4" fromPosition="top" toPosition="bottom" theme="mint" animated=true /%}
{% edge from="leaf-3" to="node-4" fromPosition="top" toPosition="bottom" theme="blue" animated=true /%}
{% edge from="leaf-5" to="node-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-6" to="node-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-7" to="node-6" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-8" to="node-6" fromPosition="top" toPosition="bottom" /%}
{% edge from="nft" to="leaf-3" fromPosition="top" toPosition="bottom" theme="blue" animated=true label="哈希" /%}

{% /diagram %}

因此，默克尔树充当链上结构，允许任何人验证给定的压缩NFT是否存在。它们在不存储任何NFT数据的情况下完成这一点，这使它们具有极高的可扩展性。

这带来了一个重要的问题：NFT数据存储在哪里？

## Metaplex DAS API

当我们铸造新的压缩NFT时，其数据被哈希并作为新叶子添加到默克尔树中。但还有更多。此外，整个NFT数据存储在创建压缩NFT的交易中。类似地，当压缩NFT被更新时，其更新的数据再次作为更改日志保存在交易中。因此，虽然没有任何账户跟踪该数据，但可以查看分类账中的所有先前交易并找到该信息。

{% diagram %}

{% node #tx-1 label="交易 1" /%}
{% node #tx-2 label="交易 2" parent="tx-1" y="50" /%}
{% node #tx-3 label="交易 3" parent="tx-2" y="50" /%}
{% node #tx-4 label="交易 4" parent="tx-3" y="50" /%}
{% node #tx-5 label="交易 5" parent="tx-4" y="50" /%}
{% node #tx-rest label="..." parent="tx-5" y="50" /%}

{% node #nft-1 label="初始NFT数据" parent="tx-2" x="300" theme="blue" /%}
{% node #nft-2 label="NFT数据更改日志" parent="tx-3" x="300" theme="blue" /%}
{% node #nft-3 label="NFT数据更改日志" parent="tx-5" x="300" theme="blue" /%}

{% edge from="nft-1" to="tx-2" label="存储于" /%}
{% edge from="nft-2" to="tx-3" label="存储于" /%}
{% edge from="nft-3" to="tx-5" label="存储于" /%}

{% /diagram %}

每次仅为获取一个NFT的数据就要爬取数百万个交易，这显然不是最佳用户体验。因此，压缩NFT依赖某些RPC实时索引该信息，以将此抽象化，不让最终用户感知。我们将这个能够获取压缩NFT的RPC API称为**Metaplex DAS API**。

请注意，并非所有RPC都支持DAS API。因此，在应用程序中使用压缩NFT时，您可能对["Metaplex DAS API RPC"](/zh/solana/rpcs-and-das)页面感兴趣，以选择适当的RPC。

我们在高级["存储和索引NFT数据"](/zh/smart-contracts/bubblegum-v2/stored-nft-data)指南中更详细地讨论了这一点。

## 功能

尽管NFT数据不存储在账户中，但仍然可以对压缩NFT执行各种操作。这是通过请求当前NFT数据并确保其哈希叶子在默克尔树上有效来实现的。因此，可以对压缩NFT执行以下操作：

- [铸造cNFT](/zh/smart-contracts/bubblegum-v2/mint-cnfts)，带或不带关联集合。
- [转移cNFT](/zh/smart-contracts/bubblegum-v2/transfer-cnfts)。
- [更新cNFT的数据或集合](/zh/smart-contracts/bubblegum-v2/update-cnfts)。
- [销毁cNFT](/zh/smart-contracts/bubblegum-v2/burn-cnfts)。
- [委托cNFT](/zh/smart-contracts/bubblegum-v2/delegate-cnfts)。
- [验证和取消验证cNFT集合](/zh/smart-contracts/bubblegum-v2/collections)。
- [验证和取消验证cNFT的创作者](/zh/smart-contracts/bubblegum-v2/verify-creators)。
- [冻结和解冻cNFT](/zh/smart-contracts/bubblegum-v2/freeze-cnfts)。
- [使cNFT成为灵魂绑定](/zh/smart-contracts/bubblegum-v2/freeze-cnfts#create-a-soulbound-c-nft)。

## 下一步

现在我们从高层次了解了压缩NFT的工作原理以及Bubblegum V2的新功能，我们建议查看我们的[快速开始](/zh/smart-contracts/bubblegum-v2/sdk)页面，其中列举了可用于与压缩NFT交互的各种语言/框架。之后，可以使用各种[功能页面](/zh/smart-contracts/bubblegum-v2/create-trees)了解更多关于可在cNFT上执行的特定操作。最后，还提供[高级指南](/zh/smart-contracts/bubblegum-v2/concurrent-merkle-trees)以加深您对cNFT和默克尔树的了解。
