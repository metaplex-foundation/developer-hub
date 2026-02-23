---
title: NFT 데이터 저장 및 인덱싱
metaTitle: NFT 데이터 저장 및 인덱싱 - Bubblegum V2
description: Bubblegum에서 NFT 데이터가 저장되는 방식에 대해 자세히 알아보세요.
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


[개요](/ko/smart-contracts/bubblegum#read-api)에서 언급했듯이 압축된 NFT(cNFT)가 생성되거나 수정될 때마다 해당 트랜잭션이 원장에 온체인으로 기록되지만 cNFT 상태 데이터는 계정 공간에 저장되지 않습니다. 이는 cNFT의 엄청난 비용 절약의 이유이지만 편의성과 유용성을 위해 cNFT 상태 데이터는 RPC 제공업체에 의해 인덱싱되고 **Metaplex DAS API**를 통해 사용할 수 있습니다.

Metaplex는 DAS API의 [참조 구현](https://github.com/metaplex-foundation/digital-asset-rpc-infrastructure)을 만들었으며, 일부 RPC 제공업체는 특정 구현을 위해 이 코드의 일부 또는 전부를 사용하는 반면 다른 RPC 제공업체는 자체적으로 작성했습니다. Metaplex DAS API를 지원하는 다른 RPC 제공업체 목록은 ["Metaplex DAS API RPC"](/ko/rpc-providers) 페이지를 참조하세요.

DAS API의 Metaplex 참조 구현에는 다음 주요 항목이 포함됩니다:
* Solana 무투표 검증자 - 이 검증자는 합의하에 검증자 원장과 계정 데이터에만 안전하게 액세스하도록 구성됩니다.
* Geyser 플러그인 - 플러그인을 "Plerkle"라고 하며 검증자에서 실행됩니다. 플러그인은 계정 업데이트, 슬롯 상태 업데이트, 트랜잭션 또는 블록 메타데이터 업데이트가 있을 때마다 알림을 받습니다. cNFT 인덱싱의 목적을 위해 플러그인의 `notify_transaction` 메서드는 Bubblegum이나 spl-account-compression 트랜잭션이 검증자에서 보일 때마다 트랜잭션 데이터를 제공하는 데 사용됩니다. 실제로 이러한 트랜잭션은 이벤트를 spl-noop 명령어 데이터로 전환하여 로그 잘림을 방지하기 위해 spl-account-compression과 Bubblegum에서 사용되는 spl-noop("작업 없음") 프로그램에서 오는 것입니다.
* Redis 클러스터 - Redis 스트림은 각 업데이트 유형(계정, 트랜잭션 등)에 대한 큐로 사용됩니다. Geyser 플러그인은 이러한 스트림에 들어가는 데이터의 생산자입니다. Geyser 플러그인은 Flatbuffers 프로토콜을 사용하는 Plerkle 직렬화 형식으로 데이터를 변환한 다음 직렬화된 레코드를 적절한 Redis 데이터 스트림에 넣습니다.
* 인제스터 프로세스 - 이는 Redis 스트림의 데이터 소비자입니다. 인제스터는 직렬화된 데이터를 파싱한 다음 Postgres 데이터베이스에 저장되는 SeaORM 데이터 객체로 변환합니다.
* Postgres 데이터베이스 - 자산을 나타내는 여러 데이터베이스 테이블과 보았던 머클 트리의 상태를 저장하는 변경 로그 테이블이 있습니다. 후자는 Bubblegum 명령어와 함께 사용할 자산 증명을 요청할 때 사용됩니다. 머클 트리 변경에 대한 시퀀스 번호는 DAS API가 트랜잭션을 순서 없이 처리할 수 있도록 하는 데도 사용됩니다.
* API 프로세스 - 최종 사용자가 RPC 제공업체에서 자산 데이터를 요청할 때 API 프로세스는 데이터베이스에서 자산 데이터를 검색하고 요청에 대해 제공할 수 있습니다.

{% diagram %}
{% node %}
{% node #validator label="검증자" theme="indigo" /%}
{% node theme="dimmed" %}
Geyser 플러그인을 실행하고 \
트랜잭션, 계정 \
업데이트 등에 대해 알림을 받습니다.
{% /node %}
{% /node %}

{% node x="200" parent="validator" %}
{% node #messenger label="메시지 버스" theme="blue" /%}
{% node theme="dimmed" %}
각 업데이트 유형에 대한 \
큐로서의 Redis 스트림.
{% /node %}
{% /node %}

{% node x="200" parent="messenger" %}
{% node #ingester label="인제스터 프로세스" theme="indigo" /%}
{% node theme="dimmed" %}
데이터를 파싱하고 \
데이터베이스에 저장합니다
{% /node %}
{% /node %}

{% node x="28" y="150" parent="ingester" %}
{% node #database label="데이터베이스" theme="blue" /%}
{% node theme="dimmed" %}
Postgres \
데이터베이스
{% /node %}
{% /node %}

{% node x="-228" parent="database" %}
{% node #api label="API 프로세스" theme="indigo" /%}
{% node theme="dimmed" %}
RPC 제공업체가 API를 실행하고\
최종 사용자에게 자산 데이터를 \
제공합니다.
{% /node %}
{% /node %}

{% node x="-200" parent="api" %}
{% node #end_user label="최종 사용자" theme="mint" /%}
{% node theme="dimmed" %}
getAsset(), \
getAssetProof() 등을 호출합니다.
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
