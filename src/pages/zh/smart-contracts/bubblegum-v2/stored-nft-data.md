---
title: 存储和索引NFT数据
metaTitle: 存储和索引NFT数据 | Bubblegum V2
description: 了解更多关于Bubblegum上NFT数据如何存储的信息。
---

如[概述](/zh/smart-contracts/bubblegum#read-api)中所述，每当创建或修改压缩NFT（cNFT）时，相应的交易会记录在分类账上，但cNFT状态数据不存储在账户空间中。这是cNFT大幅节省成本的原因，但为了方便和可用性，cNFT状态数据由RPC提供商索引，并可通过**Metaplex DAS API**获取。

Metaplex创建了DAS API的[参考实现](https://github.com/metaplex-foundation/digital-asset-rpc-infrastructure)，一些RPC提供商使用部分或全部此代码用于其特定实现，而其他RPC提供商则编写了自己的实现。请参阅["Metaplex DAS API RPC"](/zh/solana/rpcs-and-das)页面获取支持Metaplex DAS API的其他RPC提供商列表。

Metaplex DAS API参考实现包括以下关键项：
* Solana无投票验证节点 - 此验证节点配置为仅对共识下的验证节点分类账和账户数据有安全访问权限。
* Geyser插件 - 该插件称为"Plerkle"，在验证节点上运行。每当有账户更新、slot状态更新、交易或区块元数据更新时，该插件都会收到通知。对于cNFT索引的目的，当在验证节点上看到Bubblegum或spl-account-compression交易时，插件的`notify_transaction`方法用于提供交易数据。实际上，这些交易来自spl-noop（"无操作"）程序，spl-account-compression和Bubblegum使用它来避免日志截断，将事件转换为spl-noop指令数据。
* Redis集群 - Redis流用作每种更新类型（账户、交易等）的队列。Geyser插件是这些流数据的生产者。Geyser插件将数据转换为Plerkle序列化格式（使用Flatbuffers协议），然后将序列化记录放入适当的Redis数据流。
* 摄取进程 - 这是Redis流数据的消费者。摄取器解析序列化数据，然后将其转换为存储在Postgres数据库中的SeaORM数据对象。
* Postgres数据库 - 有几个数据库表来表示资产，以及一个更改日志表来存储它看到的默克尔树状态。后者在请求与Bubblegum指令一起使用的资产证明时使用。默克尔树更改的序列号也用于使DAS API能够无序处理交易。
* API进程 - 当最终用户从RPC提供商请求资产数据时，API进程可以从数据库检索资产数据并为请求提供服务。

{% diagram %}
{% node %}
{% node #validator label="验证节点" theme="indigo" /%}
{% node theme="dimmed" %}
运行Geyser插件 \
并在交易、账户 \
更新等时收到通知。
{% /node %}
{% /node %}

{% node x="200" parent="validator" %}
{% node #messenger label="消息总线" theme="blue" /%}
{% node theme="dimmed" %}
Redis流作为每种 \
更新类型的队列。
{% /node %}
{% /node %}

{% node x="200" parent="messenger" %}
{% node #ingester label="摄取进程" theme="indigo" /%}
{% node theme="dimmed" %}
解析数据并存储 \
到数据库
{% /node %}
{% /node %}

{% node x="28" y="150" parent="ingester" %}
{% node #database label="数据库" theme="blue" /%}
{% node theme="dimmed" %}
Postgres \
数据库
{% /node %}
{% /node %}

{% node x="-228" parent="database" %}
{% node #api label="API进程" theme="indigo" /%}
{% node theme="dimmed" %}
RPC提供商运行API\
并向最终用户提供 \
资产数据。
{% /node %}
{% /node %}

{% node x="-200" parent="api" %}
{% node #end_user label="最终用户" theme="mint" /%}
{% node theme="dimmed" %}
调用getAsset()、 \
getAssetProof()等。
{% /node %}
{% /node %}

{% edge from="validator" to="messenger" /%}
{% edge from="messenger" to="ingester" /%}
{% edge from="ingester" to="database" /%}
{% edge from="database" to="api" /%}
{% edge from="api" to="end_user" /%}

{% /diagram %}
