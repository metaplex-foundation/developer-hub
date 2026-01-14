---
title: 概述
metaTitle: 概述 | Bubblegum
description: 提供压缩NFT的高级概述。
---

{% callout type="note" title="新Bubblegum版本" %}

我们建议使用[Bubblegum v2](/zh/smart-contracts/bubblegum-v2)以获得更多灵活性和功能。

{% /callout %}

{% callout %}
请注意，某些Bubblegum指令需要协议费用。请查看[协议费用](/zh/protocol-fees)页面以获取最新信息。
{% /callout %}

Bubblegum是Metaplex协议程序，用于在Solana上创建和交互压缩NFT（cNFT）。压缩NFT通过重新思考链上数据存储方式，使NFT的创建规模达到新的数量级。{% .lead %}

{% quick-links %}

{% quick-link title="入门指南" icon="InboxArrowDown" href="/zh/smart-contracts/bubblegum/sdk" description="选择您偏好的语言或库，开始使用压缩NFT。" /%}

{% quick-link title="API参考" icon="CodeBracketSquare" href="https://mpl-bubblegum.typedoc.metaplex.com/" target="_blank" description="正在寻找特定内容？查看我们的API参考找到您的答案。" /%}

{% /quick-links %}

## 介绍

随着NFT在Solana区块链上蓬勃发展，越来越需要NFT像互联网上的任何数字资产一样普及：游戏库存中的每一件物品、您最喜爱的消费者应用中的参与证明，甚至是地球上每个人的个人资料。

然而，到目前为止，这些类型的产品一直受到Solana上NFT租金成本的限制，虽然相对便宜但呈线性增长。NFT压缩大大降低了NFT链上存储的成本，使创作者能够随心所欲地使用该技术。

使用默克尔树在Solana上启动cNFT项目可以非常经济实惠，成本低至：

| cNFT数量 | 存储成本 | 交易成本 | 总成本 | 每个cNFT成本 |
| --------------- | ------------ | ---------------- | ---------- | ------------- |
| 10,000          | 0.2222       | 0.05             | 0.2722     | 0.000027222   |
| 100,000         | 0.2656       | 0.5              | 0.7656     | 0.000007656   |
| 1,000,000       | 0.3122       | 5                | 5.3122     | 0.000005312   |
| 10,000,000      | 0.4236       | 50               | 50.4236    | 0.000005042   |
| 100,000,000     | 7.2205       | 500              | 507.2205   | 0.000005072   |
| 1,000,000,000   | 7.2205       | 5,000            | 5007.2205  | 0.000005007   |

这些压缩NFT可以转移、委托，甚至可以解压为常规NFT，以便与现有智能合约互操作。

## 默克尔树、叶子和证明

压缩NFT仅存在于**默克尔树**的上下文中。我们在[专门的高级指南](/zh/smart-contracts/bubblegum-v2/concurrent-merkle-trees)中解释了什么是默克尔树，但就本概述而言，您可以将默克尔树视为我们称之为**叶子**的哈希集合。每个叶子都是通过[对压缩NFT的数据进行哈希](/zh/smart-contracts/bubblegum-v2/stored-nft-data)获得的。

对于默克尔树中的每个叶子，都可以提供一个哈希列表——称为**证明**——使任何人都能验证给定的叶子是该树的一部分。每当压缩NFT被更新或转移时，其关联的叶子将改变，其证明也会改变。

{% diagram %}

{% node #root label="根节点" theme="slate" /%}
{% node #root-hash label="哈希" parent="root" x="56" y="40" theme="transparent" /%}
{% node #node-1 label="节点1" parent="root" y="100" x="-200" theme="blue" /%}
{% node #node-1-hash label="哈希" parent="node-1" x="42" y="40" theme="transparent" /%}
{% node #node-2 label="节点2" parent="root" y="100" x="200" theme="mint" /%}

{% node #node-3 label="节点3" parent="node-1" y="100" x="-100" theme="mint" /%}
{% node #node-4 label="节点4" parent="node-1" y="100" x="100" theme="blue" /%}
{% node #node-4-hash label="哈希" parent="node-4" x="42" y="40" theme="transparent" /%}
{% node #node-5 label="节点5" parent="node-2" y="100" x="-100" /%}
{% node #node-6 label="节点6" parent="node-2" y="100" x="100" /%}

{% node #leaf-1 label="叶子1" parent="node-3" y="100" x="-45" /%}
{% node #leaf-2 label="叶子2" parent="node-3" y="100" x="55" /%}
{% node #leaf-3 label="叶子3" parent="node-4" y="100" x="-45" theme="blue" /%}
{% node #leaf-4 label="叶子4" parent="node-4" y="100" x="55" theme="mint" /%}
{% node #leaf-5 label="叶子5" parent="node-5" y="100" x="-45" /%}
{% node #leaf-6 label="叶子6" parent="node-5" y="100" x="55" /%}
{% node #leaf-7 label="叶子7" parent="node-6" y="100" x="-45" /%}
{% node #leaf-8 label="叶子8" parent="node-6" y="100" x="55" /%}
{% node #nft label="NFT数据" parent="leaf-3" y="100" x="-12" theme="blue" /%}

{% node #proof-1 label="叶子4" parent="nft" x="200" theme="mint" /%}
{% node #proof-2 label="节点3" parent="proof-1" x="90" theme="mint" /%}
{% node #proof-3 label="节点2" parent="proof-2" x="97" theme="mint" /%}
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

因此，默克尔树作为链上结构，允许任何人验证给定的压缩NFT是否存在。它们在不存储任何NFT数据的情况下做到这一点，这使它们具有如此高的可扩展性。

这就引出了一个重要的问题：NFT数据存储在哪里？

## Metaplex DAS API

当我们铸造一个新的压缩NFT时，它的数据被哈希并作为新叶子添加到默克尔树中。但还有更多。此外，整个NFT数据存储在创建压缩NFT的交易中。同样，当压缩NFT被更新时，其更新的数据再次作为变更日志保存在交易中。因此，虽然没有账户跟踪这些数据，但可以查看账本中的所有先前交易并找到该信息。

{% diagram %}

{% node #tx-1 label="交易1" /%}
{% node #tx-2 label="交易2" parent="tx-1" y="50" /%}
{% node #tx-3 label="交易3" parent="tx-2" y="50" /%}
{% node #tx-4 label="交易4" parent="tx-3" y="50" /%}
{% node #tx-5 label="交易5" parent="tx-4" y="50" /%}
{% node #tx-rest label="..." parent="tx-5" y="50" /%}

{% node #nft-1 label="初始NFT数据" parent="tx-2" x="300" theme="blue" /%}
{% node #nft-2 label="NFT数据变更日志" parent="tx-3" x="300" theme="blue" /%}
{% node #nft-3 label="NFT数据变更日志" parent="tx-5" x="300" theme="blue" /%}

{% edge from="nft-1" to="tx-2" label="存储于" /%}
{% edge from="nft-2" to="tx-3" label="存储于" /%}
{% edge from="nft-3" to="tx-5" label="存储于" /%}

{% /diagram %}

每次仅仅为了获取一个NFT的数据就需要爬取数百万笔交易，这显然不是最佳的用户体验。因此，压缩NFT依赖一些RPC实时索引这些信息，以便将此抽象化，对最终用户透明。我们将这种能够获取压缩NFT的RPC API称为**Metaplex DAS API**。

请注意，并非所有RPC都支持DAS API。因此，在应用程序中使用压缩NFT时，您可能对["Metaplex DAS API RPC"](/zh/rpc-providers)页面感兴趣，以选择合适的RPC。

我们在高级["存储和索引NFT数据"](/zh/smart-contracts/bubblegum-v2/stored-nft-data)指南中更详细地讨论了这一点。

## 功能

尽管NFT数据不存在于账户中，但仍然可以对压缩NFT执行各种操作。这是通过请求当前NFT数据并确保其哈希后的叶子在默克尔树上有效来实现的。因此，可以对压缩NFT执行以下操作：

- [铸造cNFT](/zh/smart-contracts/bubblegum/mint-cnfts)，可以关联集合或不关联。
- [转移cNFT](/zh/smart-contracts/bubblegum/transfer-cnfts)。
- [更新cNFT的数据](/zh/smart-contracts/bubblegum/update-cnfts)。
- [销毁cNFT](/zh/smart-contracts/bubblegum/burn-cnfts)。
- [将cNFT解压为常规NFT](/zh/smart-contracts/bubblegum/decompress-cnfts)。请注意，这可以与现有智能合约互操作，但会创建带有租金费用的链上账户。
- [委托cNFT](/zh/smart-contracts/bubblegum/delegate-cnfts)。
- [验证和取消验证cNFT集合](/zh/smart-contracts/bubblegum/verify-collections)。
- [验证和取消验证cNFT的创作者](/zh/smart-contracts/bubblegum/verify-creators)。

## 后续步骤

现在我们了解了压缩NFT在高层次上是如何工作的，我们建议查看我们的[入门指南](/zh/smart-contracts/bubblegum/sdk)页面，其中列举了可用于与压缩NFT交互的各种语言/框架。之后，可以使用各种[功能页面](/zh/smart-contracts/bubblegum/create-trees)了解更多关于可以在cNFT上执行的特定操作。最后，还提供了[高级指南](/zh/smart-contracts/bubblegum-v2/concurrent-merkle-trees)来加深您对cNFT和默克尔树的了解。
