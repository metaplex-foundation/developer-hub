---
title: RPC提供商
metaTitle: RPC提供商 | Developer Hub
description: Solana上可用的RPC列表。
---

## 简介

Solana使用独立节点负责验证程序和程序输出，这些节点运行在三个Solana集群之一：Devnet、Testnet和Mainnet Beta。集群由一组验证者组成，它们共同确认交易。这些节点由个人拥有和运营。这些节点还负责存储数据和交易历史，并在节点之间共享。如果节点被用于投票有效区块，并且有SOL委托给验证者身份，它就有可能成为领导节点。[这里](https://solana.com/validators)是关于如何成为验证者的信息链接。

并非所有节点都会成为领导节点或可以投票确认区块。它们提供验证节点的其他功能，但由于它们不能投票，主要用于响应区块链请求。这些就是RPC节点。RPC代表远程过程调用，这些RPC节点用于通过区块链发送交易。

Solana维护三个公共API节点（每个集群一个：Devnet、Mainnet Beta和Testnet）。这些API节点允许用户连接到集群。要连接到Devnet，用户可以使用以下地址：

```
https://api.devnet.solana.com
```

这是Devnet的节点，有速率限制。

在Mainnet Beta集群上，许多开发者选择使用自己的私有RPC节点，以利用比Solana公共API节点更高的速率限制。

![](https://i.imgur.com/1GmCbcu.png#radius")

在上面来自[Solana文档](https://docs.solana.com/cluster/rpc-endpoints)的图片中，您可以看到Mainnet Beta使用主网API节点的速率限制。主网节点目前不支持[Metaplex DAS API](#metaplex-das-api)。

我们将定义RPC节点的一些功能，然后提供一些选项。建议您根据项目需求选择合适的RPC。

## Metaplex DAS API

RPC的另一个区别特征是是否支持[Metaplex DAS API](/zh/das-api)。Metaplex数字资产标准（DAS）API代表了在Solana上与数字资产交互的统一接口，支持标准（Token Metadata）和压缩（Bubblegum）资产。API定义了一组方法，供RPC实现以提供资产数据。

对于开发者来说，DAS API对于与cNFT交互是必要的，但它也可以使与TM资产的工作更简单、更快速。在从链上读取时，强烈建议使用支持DAS的RPC节点，以尽可能提供最快的用户体验。

您可以在[专门的部分](/zh/das-api)了解更多关于DAS API的信息。

## Metaplex Aura

Aura是一个Solana网络扩展，可以为用户提供高效、分布式和全面的数字资产数据索引。主要功能包括：

- **自动同步**：允许节点在高负载时相互协助，保持网络一致性，确保数据完整性。
- **集成媒体CDN**：增强媒体交付，加快网页上显示的数字资产加载时间。
- **轻客户端支持**：允许节点运营商为特定协议或子协议建立索引，如Core资产或特定的Bubblegum树。轻客户端可以运行而无需完整的Solana节点或Geyser插件，而是从Aura网络接收更新。这可以大大降低基础设施成本，相比维护完整的Solana节点。
- **数字资产标准API**：完整实现DAS API，这是访问SVM（Solana虚拟机）上数字资产数据的主要接口。

在[专门的部分](/zh/aura/reading-solana-and-svm-data)了解更多关于Aura的索引功能。

## 归档节点和非归档节点

节点可以分为两类。首先是归档节点，它们可以存储以前区块的信息。对于这些归档节点，您可以通过多种方式利用访问所有以前区块的能力。一些优点包括能够查看地址的余额历史和查看历史中的任何状态。由于运行完整历史节点的高系统要求，拥有具有此功能的私有节点是非常有益的。

与归档节点不同，非归档节点或常规节点只能访问部分以前的区块（超过100个区块）。我们之前提到运行归档节点有密集的要求，但即使是非归档节点也可能难以管理。这就是为什么用户经常选择私有RPC提供商。在Solana上使用私有RPC的许多用途通常涉及Mainnet-beta的使用，因为真正的SOL代币涉及其中，更有可能受到速率限制。

## 可用的RPC

以下部分包含多个RPC提供商。

{% callout type="note" %}
这些列表按字母顺序排列。选择最适合您项目需求的RPC提供商。如果有遗漏的提供商，请在Discord上告诉我们或提交PR。
{% /callout %}

### 支持Aura的RPC
- [Mainnet Aura](http://aura-mainnet.metaplex.com)
- [Devnet Aura](http://aura-devnet.metaplex.com)

### 支持DAS的RPC
- [Extrnode](https://docs.extrnode.com/das_api/)
- [Helius](https://docs.helius.xyz/compression-and-das-api/digital-asset-standard-das-api)
- [Hello Moon](https://docs.hellomoon.io/reference/rpc-endpoint-for-digital-asset-standard)
- [QuickNode](https://quicknode.com/)
- [Shyft](https://docs.shyft.to/solana-rpcs-das-api/compression-das-api)
- [Triton](https://docs.triton.one/rpc-pool/metaplex-digital-assets-api)

### 不支持DAS的RPC
- [Alchemy](https://alchemy.com/?a=metaplex)
- [Ankr](https://www.ankr.com/protocol/public/solana/)
- [Blockdaemon](https://blockdaemon.com/marketplace/solana/)
- [Chainstack](https://chainstack.com/build-better-with-solana/)
- [Figment](https://figment.io/)
- [GetBlock](https://getblock.io/)
- [NOWNodes](https://nownodes.io/)
- [Syndica](https://syndica.io/)

### 更多信息
如果您对这个主题有任何问题或想要进一步理解，请加入[Metaplex Discord](https://discord.gg/metaplex)服务器随时提问。
