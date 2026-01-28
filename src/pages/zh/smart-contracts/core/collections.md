---
title: 管理集合
metaTitle: Core Collections | Metaplex Core
description: 了解如何在 Solana 上创建和管理 Core Collections。将 NFT Asset 分组，设置集合级版税，并管理集合元数据。
---

本指南展示如何使用 Metaplex Core SDK 在 Solana 上**创建和管理 Core Collections**。Collections 将相关 Asset 分组在共享标识下，具有集合级元数据和插件。 {% .lead %}

{% callout title="学习内容" %}

- 创建带有名称、URI 和可选插件的 Collection
- 在创建时将 Asset 添加到 Collections
- 获取和更新 Collection 元数据
- 管理集合级插件（版税等）

{% /callout %}

## 摘要

**Collection** 是一个将相关 Asset 分组在一起的 Core 账户。它存储集合元数据（名称、图片、描述），并可以持有适用于集合中所有 Asset 的插件。

- Collections 充当相关 Asset 组的"封面"
- Asset 通过 `collection` 字段引用其 Collection
- Collection 插件（如 Royalties）可应用于所有成员 Asset
- 创建 Collection 大约需要 0.0015 SOL

## 范围外

Token Metadata Collections（使用 mpl-token-metadata）、压缩 NFT 集合（使用 Bubblegum）、以及将现有集合迁移到 Core。

## 快速开始

**跳转到：** [创建 Collection](#创建简单集合) · [带插件](#创建带有插件的集合) · [获取](#获取集合) · [更新](#更新集合)

1. 安装：`npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. 上传集合元数据 JSON 以获取 URI
3. 调用 `createCollection(umi, { collection, name, uri })`
4. 创建 Asset 时传递集合地址

## 前提条件

- **Umi** - 配置了 signer 和 RPC 连接
- **SOL** - 用于交易费用（每个集合约 0.002 SOL）
- **元数据 JSON** - 已上传到 Arweave/IPFS，包含集合图片

## 什么是集合？

Collections 是属于同一系列或组的 Asset 的组合。为了将 Asset 分组在一起，我们必须首先创建一个 Collection Asset，其目的是存储与该集合相关的任何元数据，例如集合名称和集合图片。Collection Asset 充当集合的封面，还可以存储集合范围的插件。

Collection Asset 中存储和可访问的数据如下：

| 账户            | 描述                                |
| --------------- | ----------------------------------- |
| key             | 账户密钥鉴别器                      |
| updateAuthority | 新 Asset 的权限                     |
| name            | 集合名称                            |
| uri             | 指向集合链外元数据的 URI            |
| num minted      | 集合中铸造的 Asset 数量             |
| current size    | 集合中当前的 Asset 数量             |

## 创建集合

要创建 Core Collection，您可以像这样使用 `CreateCollection` 指令：

{% totem %}
{% totem-accordion title="技术指令详情 - CreateCollectionV1" %}

**指令账户列表**

| 账户            | 描述                                |
| --------------- | ----------------------------------- |
| collection      | Core Asset 所属的 Collection        |
| updateAuthority | 新 Asset 的权限                     |
| payer           | 支付存储费用的账户                  |
| systemProgram   | System Program 账户                 |

**指令参数**

| 参数    | 描述                                |
| ------- | ----------------------------------- |
| name    | Core Asset 所属的 Collection        |
| uri     | 新 Asset 的权限                     |
| plugins | 您希望 Collection 拥有的插件        |

在我们的 SDK 中，某些账户和参数可能会被抽象化和/或可选，以便于使用。
可以在 [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L30) 上查看链上指令的完整详细信息。

{% /totem-accordion %}
{% /totem %}

### 创建简单集合

以下代码片段创建了一个没有插件或任何特殊内容的简单 Collection。

{% code-tabs-imported from="core/create-collection" frameworks="umi" /%}

### 创建带有插件的集合

以下代码片段创建了一个附加了 [Royalties 插件](/zh/smart-contracts/core/plugins/royalties) 的 Collection。您可以按照[此处](/zh/smart-contracts/core/plugins)所述附加其他插件。

{% dialect-switcher title="创建带有插件的 MPL Core Collection" %}
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

## 获取集合

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

## 更新集合

要更新 Core Collection 的数据，请使用 `UpdateCollection` 指令。例如，您可以使用此指令更改 Collection 的名称。

{% totem %}
{% totem-accordion title="技术指令详情 - UpdateCollectionV1" %}

**指令账户列表**

| 账户               | 描述                                |
| ------------------ | ----------------------------------- |
| collection         | Core Asset 所属的 Collection        |
| payer              | 支付存储费用的账户                  |
| authority          | 新 Asset 的权限                     |
| newUpdateAuthority | Collection 的新更新权限             |
| systemProgram      | System Program 账户                 |
| logWrapper         | SPL Noop Program                    |

**指令参数**

| 参数 | 描述                                |
| ---- | ----------------------------------- |
| name | 您的 MPL Core Asset 的名称          |
| uri  | 链外 JSON 元数据 URI                |

在我们的 SDK 中，某些账户和参数可能会被抽象化和/或可选，以便于使用。
可以在 [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L167C4-L167C23) 上查看链上指令的完整详细信息。

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

## 更新集合插件

如果您想更改附加到 Core Collection 的插件的行为，您可能需要使用 `updateCollectionPlugin` 指令。

{% totem %}
{% totem-accordion title="技术指令详情 - UpdateCollectionPluginV1" %}

**指令账户列表**

| 账户          | 描述                                |
| ------------- | ----------------------------------- |
| collection    | Core Asset 所属的 Collection        |
| payer         | 支付存储费用的账户                  |
| authority     | 新 Asset 的权限                     |
| systemProgram | System Program 账户                 |
| logWrapper    | SPL Noop Program                    |

**指令参数**

| 参数   | 描述                                |
| ------ | ----------------------------------- |
| plugin | 您希望更新的插件                    |

在我们的 SDK 中，某些账户可能会被抽象化和/或可选，以便于使用。
可以在 [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L81) 上查看链上指令的完整详细信息。

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

Collection 密钥对已被使用。生成新的 signer：

```ts
const collectionSigner = generateSigner(umi) // 必须唯一
```

### `Authority mismatch`

您不是 Collection 的更新权限。检查 Collection 的 `updateAuthority` 字段是否与您的 signer 匹配。

### `Insufficient funds`

您的付款钱包需要约 0.002 SOL。使用以下命令充值：

```bash
solana airdrop 1 <WALLET_ADDRESS> --url devnet
```

## 注意事项

- 创建时 `collection` 参数必须是**新密钥对**
- Collection 插件会被 Asset 继承，除非在 Asset 级别被覆盖
- 使用 `fetchCollection` 在创建后验证 Collection 状态
- `numMinted` 计数器跟踪曾经创建的 Asset 总数（不是当前大小）

## 快速参考

### Program ID

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

## FAQ

### Collection 和 Asset 有什么区别？

Collection 是将 Asset 分组的容器。它有自己的元数据（名称、图片），但不能像 Asset 那样被拥有或转移。Asset 是用户拥有的实际 NFT。

### 我可以将现有 Asset 添加到 Collection 吗？

是的，使用带有 `newCollection` 参数的 `update` 指令。Asset 的更新权限必须有权将其添加到目标 Collection。

### 我的 NFT 需要 Collection 吗？

不需要。Asset 可以独立存在而没有 Collection。但是，Collections 可以启用集合级版税、更容易的可发现性和批量操作。

### 我可以从 Collection 中删除 Asset 吗？

是的，使用 `update` 指令更改 Asset 的 Collection。您需要对 Asset 和 Collection 都有适当的权限。

### 如果我删除 Collection 会怎样？

Collection 在包含 Asset 时无法删除。先删除所有 Asset，然后可以关闭 Collection 账户。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Collection** | 将相关 Asset 分组在共享元数据下的 Core 账户 |
| **Update Authority** | 可以修改 Collection 元数据和插件的账户 |
| **numMinted** | 跟踪 Collection 中曾经创建的 Asset 总数的计数器 |
| **currentSize** | Collection 中当前的 Asset 数量 |
| **Collection Plugin** | 附加到 Collection 的插件（例如 Royalties） |
| **URI** | 指向 Collection 链外元数据的 URL |

---

*由 Metaplex Foundation 维护 · 最后验证于 2026 年 1 月 · 适用于 @metaplex-foundation/mpl-core*
