---
title: Collection 管理
metaTitle: Core Collection | Metaplex Core
description: 学习如何在 Solana 上创建和管理 Core Collection。将 NFT Asset 分组，设置集合级别的版税，并管理集合元数据。
updated: '01-31-2026'
keywords:
  - NFT collection
  - create collection
  - collection metadata
  - mpl-core collection
  - group NFTs
about:
  - NFT collections
  - Collection management
  - Collection plugins
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
howToSteps:
  - Install SDK with npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi
  - Upload collection metadata JSON to get a URI
  - Call createCollection(umi, { collection, name, uri })
  - Pass collection address when creating Assets
howToTools:
  - Node.js
  - Umi framework
  - mpl-core SDK
faqs:
  - q: Collection 和 Asset 有什么区别？
    a: Collection 是将 Asset 分组的容器。它有自己的元数据，但不能像 Asset 那样被拥有或转移。Asset 是用户实际拥有的 NFT。
  - q: 我可以将现有的 Asset 添加到 Collection 吗？
    a: 可以，使用带有 newCollection 参数的 update 指令。Asset 的 Update Authority 必须有权限将其添加到目标 Collection。
  - q: 我的 NFT 需要 Collection 吗？
    a: 不需要。Asset 可以独立存在而不需要 Collection。但是，Collection 可以实现集合级别的版税、更容易的发现性和批量操作。
  - q: 我可以从 Collection 中移除 Asset 吗？
    a: 可以，使用 update 指令来更改 Asset 的 Collection。您需要在 Asset 和 Collection 上都有适当的权限。
  - q: 如果删除 Collection 会发生什么？
    a: Collection 在包含 Asset 时不能被删除。首先移除所有 Asset，然后才能关闭 Collection 账户。
---
本指南展示如何使用 Metaplex Core SDK 在 Solana 上**创建和管理 Core Collection**。Collection 将相关的 Asset 以共享身份和集合级别的元数据和插件组合在一起。 {% .lead %}
{% callout title="学习内容" %}
- 创建带有名称、URI 和可选插件的 Collection
- 在创建时将 Asset 添加到 Collection
- 获取和更新 Collection 元数据
- 管理集合级别的插件（版税等）
{% /callout %}
## 概要
**Collection** 是将相关 Asset 分组的 Core 账户。它存储集合元数据（名称、图片、描述），并可以持有适用于集合中所有 Asset 的插件。
- Collection 作为 Asset 组的"封面"
- Asset 通过 `collection` 字段引用其 Collection
- Collection 插件（如 Royalties）可以应用于所有成员 Asset
- 创建 Collection 大约需要 0.0015 SOL
## 范围外
Token Metadata Collection（使用 mpl-token-metadata）、压缩 NFT 集合（使用 Bubblegum）以及将现有集合迁移到 Core。
## 快速开始
**跳转到：** [创建 Collection](#创建简单的-collection) · [带插件](#创建带插件的-collection) · [获取](#获取-collection) · [更新](#更新-collection)
1. 安装：`npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. 上传集合元数据 JSON 以获取 URI
3. 调用 `createCollection(umi, { collection, name, uri })`
4. 在创建 Asset 时传递 Collection 地址
## 前提条件
- 配置了签名者和 RPC 连接的 **Umi**
- 用于交易费用的 **SOL**（每个集合约 0.002 SOL）
- 上传到 Arweave/IPFS 的包含集合图片的**元数据 JSON**
## 什么是 Collection？
Collection 是属于同一系列或组的 Asset 组。为了将 Asset 分组，我们必须首先创建一个 Collection Asset，其目的是存储与该集合相关的任何元数据，如集合名称和集合图片。Collection Asset 作为您集合的封面，也可以存储集合范围的插件。
可以从 Collection Asset 存储和访问的数据如下：
| 账户            | 描述                                       |
| --------------- | ------------------------------------------ |
| key             | 账户密钥标识符                              |
| updateAuthority | 新 Asset 的权限                            |
| name            | 集合名称                                    |
| uri             | 集合链下元数据的 URI                        |
| num minted      | 集合中铸造的 Asset 数量                     |
| current size    | 当前集合中的 Asset 数量                     |
## 创建 Collection
要创建 Core Collection，您可以像这样使用 `CreateCollection` 指令：
{% totem %}
{% totem-accordion title="技术指令详情 - CreateCollectionV1" %}
**指令账户列表**
| 账户            | 描述                                        |
| --------------- | ------------------------------------------ |
| collection      | Core Asset 所属的 Collection               |
| updateAuthority | 新 Asset 的权限                            |
| payer           | 支付存储费用的账户                          |
| systemProgram   | System Program 账户                        |
**指令参数**
| 参数     | 描述                                        |
| ------- | ------------------------------------------ |
| name    | Core Asset 所属的 Collection               |
| uri     | 新 Asset 的权限                            |
| plugins | 您希望 Collection 拥有的插件               |
某些账户和参数可能在我们的 SDK 中被抽象或设为可选以便于使用。
链上指令的完整详细信息可以在 [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L30) 查看。
{% /totem-accordion %}
{% /totem %}
### 创建简单的 Collection
以下代码片段创建一个没有插件或任何特殊功能的简单 Collection。
{% code-tabs-imported from="core/create-collection" frameworks="umi" /%}
### 创建带插件的 Collection
以下代码片段创建一个附加了 [Royalties 插件](/zh/smart-contracts/core/plugins/royalties) 的 Collection。您可以按照[此处](/zh/smart-contracts/core/plugins)的说明附加其他插件。
{% dialect-switcher title="创建带插件的 MPL Core Collection" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import { createCollection, ruleSet } from '@metaplex-foundation/mpl-core'
const collectionSigner = generateSigner(umi)
const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('22222222222222222222222222222222')
await createCollection(umi, {
  collection: collectionSigner,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  plugins: [
    {
      type: 'Royalties',
      basisPoints: 500,
      creators: [
        {
          address: creator1,
          percentage: 20,
        },
        {
          address: creator2,
          percentage: 80,
        },
      ],
      ruleSet: ruleSet('None'), // 兼容性规则集
    },
  ],
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{
    instructions::CreateCollectionV1Builder,
    types::{Creator, Plugin, PluginAuthority, PluginAuthorityPair, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn create_collection_with_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let payer = Keypair::new();
    let collection = Keypair::new();
    let creator = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let create_collection_ix = CreateCollectionV1Builder::new()
        .collection(collection.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::Royalties(Royalties {
                basis_points: 500,
                creators: vec![Creator {
                    address: creator,
                    percentage: 100,
                }],
                rule_set: RuleSet::None,
            }),
            authority: Some(PluginAuthority::None),
        }])
        .instruction();
    let signers = vec![&collection, &payer];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let create_collection_tx = Transaction::new_signed_with_payer(
        &[create_collection_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&create_collection_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## 获取 Collection
要获取 Collection，可以使用以下函数：
{% dialect-switcher title="获取 Collection" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { fetchCollectionV1 } from '@metaplex-foundation/mpl-core'
import { publicKey } from '@metaplex-foundation/umi'
const collectionId = publicKey('11111111111111111111111111111111')
const collection = await fetchCollection(umi, collectionId)
console.log(collection)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use std::str::FromStr;
use mpl_core::Collection;
use solana_client::nonblocking::rpc_client;
use solana_sdk::pubkey::Pubkey;
pub async fn fetch_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let collection_id = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let rpc_data = rpc_client.get_account_data(&collection_id).await.unwrap();
    let collection = Collection::from_bytes(&rpc_data).unwrap();
    print!("{:?}", collection)
}
```
{% /dialect %}
{% /dialect-switcher %}
## 更新 Collection
要更新 Core Collection 的数据，使用 `UpdateCollection` 指令。例如，您可以使用此指令更改集合的名称。
{% totem %}
{% totem-accordion title="技术指令详情 - UpdateCollectionV1" %}
**指令账户列表**
| 账户               | 描述                                        |
| ------------------ | ------------------------------------------ |
| collection         | Core Asset 所属的 Collection               |
| payer              | 支付存储费用的账户                          |
| authority          | 新 Asset 的权限                            |
| newUpdateAuthority | Collection 的新 Update Authority           |
| systemProgram      | System Program 账户                        |
| logWrapper         | SPL Noop Program                           |
**指令参数**
| 参数  | 描述                       |
| ---- | ------------------------- |
| name | MPL Core Asset 的名称      |
| uri  | 链下 JSON 元数据 URI       |
某些账户和参数可能在我们的 SDK 中被抽象或设为可选以便于使用。
链上指令的完整详细信息可以在 [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L167C4-L167C23) 查看。
{% /totem-accordion %}
{% /totem %}
{% seperator h="6" /%}
{% dialect-switcher title="更新 Collection" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updateCollection } from '@metaplex-foundation/mpl-core'
const collectionAddress = publicKey('1111111111111111111111111111111')
await updateCollection(umi, {
  collection: collectionAddress,
  name: 'my-nft',
  uri: 'https://exmaple.com/new-uri',
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use std::str::FromStr;
use mpl_core::instructions::UpdateCollectionV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
pub async fn update_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let update_collection_ix = UpdateCollectionV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .new_name("My Collection".into())
        .new_uri("https://example.com/my-collection.json".into())
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let update_collection_tx = Transaction::new_signed_with_payer(
        &[update_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&update_collection_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## 更新 Collection 插件
如果您想更改附加到 Core Collection 的插件的行为，可以使用 `updateCollectionPlugin` 指令。
{% totem %}
{% totem-accordion title="技术指令详情 - UpdateCollectionPluginV1" %}
**指令账户列表**
| 账户          | 描述                                        |
| ------------- | ------------------------------------------ |
| collection    | Core Asset 所属的 Collection               |
| payer         | 支付存储费用的账户                          |
| authority     | 新 Asset 的权限                            |
| systemProgram | System Program 账户                        |
| logWrapper    | SPL Noop Program                           |
**指令参数**
| 参数    | 描述                    |
| ------ | ----------------------- |
| plugin | 您要更新的插件          |
某些账户可能在我们的 SDK 中被抽象或设为可选以便于使用。
链上指令的完整详细信息可以在 [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L81) 查看。
{% /totem-accordion %}
{% /totem %}
{% seperator h="6" /%}
{% dialect-switcher title="更新 Collection 插件" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updateCollectionPlugin, ruleSet } from '@metaplex-foundation/mpl-core'
const collectionAddress = publicKey('1111111111111111111111111111111')
const newCreator = publicKey('5555555555555555555555555555555')
await updateCollectionPlugin(umi, {
  collection: collectionAddress,
  plugin: {
    type: 'Royalties',
    basisPoints: 400,
    creators: [{ address: newCreator, percentage: 100 }],
    ruleSet: ruleSet('None'),
  },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use std::str::FromStr;
use mpl_core::{
    instructions::UpdateCollectionPluginV1Builder,
    types::{Creator, Plugin, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
pub async fn update_collection_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let new_creator = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let update_collection_plugin_ix = UpdateCollectionPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .plugin(Plugin::Royalties(Royalties {
            basis_points: 500,
            creators: vec![Creator {
                address: new_creator,
                percentage: 100,
            }],
            rule_set: RuleSet::None,
        }))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let update_collection_plugin_tx = Transaction::new_signed_with_payer(
        &[update_collection_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&update_collection_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## 常见错误
### `Collection account already exists`
Collection 密钥对已被使用。生成一个新的签名者：
```ts
const collectionSigner = generateSigner(umi) // 必须是唯一的
```
### `Authority mismatch`
您不是 Collection 的 Update Authority。检查 Collection 的 `updateAuthority` 字段是否与您的签名者匹配。
### `Insufficient funds`
您的支付钱包需要约 0.002 SOL。使用以下方式添加资金：
```bash
solana airdrop 1 <WALLET_ADDRESS> --url devnet
```
## 注意事项
- 创建时 `collection` 参数必须是**新的密钥对**
- Collection 插件会被 Asset 继承，除非在 Asset 级别被覆盖
- 使用 `fetchCollection` 在创建后验证 Collection 状态
- `numMinted` 计数器跟踪曾经创建的 Asset 总数（不是当前大小）
## 快速参考
### 程序 ID
| 网络 | 地址 |
|---------|---------|
| Mainnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
| Devnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
### 最小代码
```ts {% title="minimal-collection.ts" %}
import { generateSigner } from '@metaplex-foundation/umi'
import { createCollection } from '@metaplex-foundation/mpl-core'
const collection = generateSigner(umi)
await createCollection(umi, { collection, name: 'My Collection', uri: 'https://...' }).sendAndConfirm(umi)
```
### 成本明细
| 项目 | 成本 |
|------|------|
| Collection 账户租金 | 约 0.0015 SOL |
| 交易费用 | 约 0.000005 SOL |
| **总计** | **约 0.002 SOL** |
## 常见问题
### Collection 和 Asset 有什么区别？
Collection 是将 Asset 分组的容器。它有自己的元数据（名称、图片），但不能像 Asset 那样被拥有或转移。Asset 是用户实际拥有的 NFT。
### 我可以将现有的 Asset 添加到 Collection 吗？
可以，使用带有 `newCollection` 参数的 `update` 指令。Asset 的 Update Authority 必须有权限将其添加到目标 Collection。
### 我的 NFT 需要 Collection 吗？
不需要。Asset 可以独立存在而不需要 Collection。但是，Collection 可以实现集合级别的版税、更容易的发现性和批量操作。
### 我可以从 Collection 中移除 Asset 吗？
可以，使用 `update` 指令来更改 Asset 的 Collection。您需要在 Asset 和 Collection 上都有适当的权限。
### 如果删除 Collection 会发生什么？
Collection 在包含 Asset 时不能被删除。首先移除所有 Asset，然后才能关闭 Collection 账户。
## 术语表
| 术语 | 定义 |
|------|------------|
| **Collection** | 在共享元数据下分组相关 Asset 的 Core 账户 |
| **Update Authority** | 可以修改 Collection 元数据和插件的账户 |
| **numMinted** | 跟踪 Collection 中曾经创建的 Asset 总数的计数器 |
| **currentSize** | 当前 Collection 中的 Asset 数量 |
| **Collection 插件** | 附加到 Collection 的插件（例如 Royalties） |
| **URI** | 指向 Collection 链下 JSON 元数据的 URL |
