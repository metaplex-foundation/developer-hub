---
title: 存储和索引NFT数据
metaTitle: 存储和索引NFT数据 - Bubblegum V2
description: 了解更多关于Bubblegum上NFT数据如何存储的信息。
created: '01-15-2025'
updated: '02-24-2026'
keywords:
  - NFT indexing
  - DAS
  - digital asset standard
  - off-chain data
  - RPC indexer
  - Geyser plugin
about:
  - Compressed NFTs
  - DAS API
  - NFT indexing
proficiencyLevel: Advanced
---

## Summary

**Storing and indexing NFT data** explains how compressed NFT state is persisted in transactions and made queryable through the Metaplex DAS API. This page covers the reference indexing architecture from validator to end-user API.

- cNFT data is stored in transaction logs, not in on-chain accounts
- The DAS API indexes this data in real-time for convenient retrieval
- The reference implementation uses a Geyser plugin, Redis queues, an ingester process, and a Postgres database

As mentioned in the [Overview](/smart-contracts/bubblegum#read-api), whenever compressed NFTs (cNFTs) are created or modified, the corresponding transactions are recorded onchain in the ledger, but the cNFT state data is not stored in account space.  This is the reason for the massive cost savings of cNFTs, but for convenience and usability, the cNFT state data is indexed by RPC providers and available via the **the Metaplex DAS API**.

Metaplex has created a [reference implementation](https://github.com/metaplex-foundation/digital-asset-rpc-infrastructure) of the DAS API, and some RPC providers use some or all of this code for their particular implementation, while other RPC providers have written their own.  See the ["Metaplex DAS API RPCs"](/rpc-providers) page for a list of other RPC providers that support the Metaplex DAS API.

The Metaplex reference implementation of the DAS API includes the following key items:
* A Solana no-vote validator - This validator is configured to only have secure access to the validator ledger and account data under consensus.
* A Geyser plugin - The plugin is called "Plerkle" and runs on the validator.  The plugin is notified whenever there are account updates, slot status updates, transactions, or block metadata updates.  For the purpose of cNFT indexing, the plugin's `notify_transaction` method is used to provide transaction data whenever Bubblegum or spl-account-compression transactions are seen on the validator.  In reality, these transactions are coming from the spl-noop ("no operation") program, which is used by spl-account-compression and Bubblegum to avoid log truncation by turning events into spl-noop instruction data.
* A Redis cluster - Redis streams are used as queues for the each type of update (account, transaction, etc.).  The Geyser plugin is the producer of data going into these streams.  The Geyser plugin translates the data into the Plerkle serialization format, which uses the Flatbuffers protocol, and then puts the serialized record into the appropriate Redis data stream.
* An ingester process - This is the the consumer of the data from the Redis streams.  The ingester parses the serialized data, and then transforms it into SeaORM data objects that are stored in a Postgres database.
 * Postgres database - There are several database tables to represent assets, as well as a changelog table to store the state of Merkle trees it has seen.  The latter is used when requesting an asset proof to be used with Bubblegum instructions. Sequence numbers for Merkle tree changes are also used to enable the DAS API to process transactions out of order.
* API process - When end-users request asset data from RPC providers, the API process can retrieve the asset data from the database and serve it for the request.

{% diagram %}
{% node %}
{% node #validator label="Validator" theme="indigo" /%}
{% node theme="dimmed" %}
Runs Geyser plugin \
and is notified on \
transactions, account \
updates, etc.
{% /node %}
{% /node %}

{% node x="200" parent="validator" %}
{% node #messenger label="Message bus" theme="blue" /%}
{% node theme="dimmed" %}
Redis streams as queues \
for each type of update.
{% /node %}
{% /node %}

{% node x="200" parent="messenger" %}
{% node #ingester label="Ingester process" theme="indigo" /%}
{% node theme="dimmed" %}
Parses data and stores \
to database
{% /node %}
{% /node %}

{% node x="28" y="150" parent="ingester" %}
{% node #database label="Database" theme="blue" /%}
{% node theme="dimmed" %}
Postgres \
database
{% /node %}
{% /node %}

{% node x="-228" parent="database" %}
{% node #api label="API process" theme="indigo" /%}
{% node theme="dimmed" %}
RPC provider runs the API\
and serves asset data to \
end users.
{% /node %}
{% /node %}

{% node x="-200" parent="api" %}
{% node #end_user label="End user" theme="mint" /%}
{% node theme="dimmed" %}
Calls getAsset(), \
getAssetProof(), etc.
{% /node %}
{% /node %}

{% edge from="validator" to="messenger" /%}
{% edge from="messenger" to="ingester" /%}
{% edge from="ingester" to="database" /%}
{% edge from="database" to="api" /%}
{% edge from="api" to="end_user" /%}

{% /diagram %}


如[概述](/zh/smart-contracts/bubblegum#read-api)中所述，每当创建或修改压缩NFT（cNFT）时，相应的交易会记录在分类账上，但cNFT状态数据不存储在账户空间中。这是cNFT大幅节省成本的原因，但为了方便和可用性，cNFT状态数据由RPC提供商索引，并可通过**Metaplex DAS API**获取。

Metaplex创建了DAS API的[参考实现](https://github.com/metaplex-foundation/digital-asset-rpc-infrastructure)，一些RPC提供商使用部分或全部此代码用于其特定实现，而其他RPC提供商则编写了自己的实现。请参阅["Metaplex DAS API RPC"](/zh/rpc-providers)页面获取支持Metaplex DAS API的其他RPC提供商列表。

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

## Notes

- The DAS API is not part of the Solana protocol itself — it is an indexing layer maintained by RPC providers.
- Different RPC providers may have different implementations. The Metaplex reference implementation is open source on GitHub.
- Transaction data uses the spl-noop program to avoid log truncation, turning events into instruction data.
- Sequence numbers enable the DAS API to process transactions out of order while maintaining correct state.

## Glossary

| Term | Definition |
|------|------------|
| **DAS API** | Digital Asset Standard API — the RPC extension for querying indexed cNFT data |
| **Geyser Plugin** | A Solana validator plugin that receives real-time notifications about transactions and account updates |
| **Plerkle** | The Metaplex Geyser plugin that captures Bubblegum and compression transactions for indexing |
| **spl-noop** | A Solana program used to emit events as instruction data, avoiding transaction log truncation |
| **Ingester** | A process that consumes transaction data from Redis streams and stores it in Postgres |
