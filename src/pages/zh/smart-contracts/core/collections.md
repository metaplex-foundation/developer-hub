---
title: 管理集合
metaTitle: 已验证的集合 | Core
description: 了解如何使用 Metaplex Core 包管理 Core 资产集合，例如添加和删除集合中的资产。
---

## 什么是集合？

集合是一组属于同一系列或组的资产。为了将资产组合在一起，我们必须首先创建一个集合资产，其目的是存储与该集合相关的任何元数据，例如集合名称和集合图片。集合资产充当集合的封面，还可以存储集合范围的插件。

集合资产中存储和可访问的数据如下：

| 账户            | 描述                                |
| --------------- | ----------------------------------- |
| key             | 账户密钥鉴别器                      |
| updateAuthority | 新资产的权限。                      |
| name            | 集合名称。                          |
| uri             | 指向集合链外元数据的 uri。          |
| num minted      | 集合中铸造的资产数量。              |
| current size    | 集合中当前的资产数量。              |

## 创建集合

要创建 Core 集合，您可以像这样使用 `CreateCollection` 指令：

{% totem %}
{% totem-accordion title="技术指令详情 - CreateCollectionV1" %}

**指令账户列表**

| 账户            | 描述                                |
| --------------- | ----------------------------------- |
| collection      | Core 资产所属的集合。               |
| updateAuthority | 新资产的权限。                      |
| payer           | 支付存储费用的账户。                |
| systemProgram   | 系统程序账户。                      |

**指令参数**

| 参数    | 描述                                |
| ------- | ----------------------------------- |
| name    | Core 资产所属的集合。               |
| uri     | 新资产的权限。                      |
| plugins | 您希望集合拥有的插件。              |

在我们的 SDK 中，某些账户和参数可能会被抽象化和/或可选，以便于使用。
可以在 [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L30) 上查看链上指令的完整详细信息。

{% /totem-accordion %}
{% /totem %}

### 创建简单集合

以下代码片段创建了一个没有插件或任何特殊内容的简单集合。

{% dialect-switcher title="创建 MPL Core 集合" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createCollection } from '@metaplex-foundation/mpl-core'

const collectionSigner = generateSigner(umi)

await createCollection(umi, {
  collection: collectionSigner,
  name: 'My Collection',
  uri: 'https://example.com/my-collection.json',
})
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::instructions::CreateCollectionV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn create_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let collection = Keypair::new();

    let create_collection_ix = CreateCollectionV1Builder::new()
        .collection(collection.pubkey())
        .payer(payer.pubkey())
        .name("My Collection".into())
        .uri("https://example.com/my-collection.json".into())
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

### 创建带有插件的集合

以下代码片段创建了一个附加了[版税插件](/zh/smart-contracts/core/plugins/royalties)的集合。您可以按照[此处](/zh/smart-contracts/core/plugins)所述附加其他插件。

{% dialect-switcher title="创建带有插件的 MPL Core 集合" %}
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
      ruleSet: ruleSet('None'), // Compatibility rule set
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

要获取集合，可以使用以下函数：

{% dialect-switcher title="获取集合" %}
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

要更新 Core 集合的数据，请使用 `UpdateCollection` 指令。例如，您可以使用此指令更改集合的名称。

{% totem %}
{% totem-accordion title="技术指令详情 - UpdateCollectionV1" %}

**指令账户列表**

| 账户               | 描述                                |
| ------------------ | ----------------------------------- |
| collection         | Core 资产所属的集合。               |
| payer              | 支付存储费用的账户。                |
| authority          | 新资产的权限。                      |
| newUpdateAuthority | 集合的新更新权限。                  |
| systemProgram      | 系统程序账户。                      |
| logWrapper         | SPL Noop 程序。                     |

**指令参数**

| 参数 | 描述                                |
| ---- | ----------------------------------- |
| name | 您的 MPL Core 资产的名称。          |
| uri  | 链外 json 元数据 uri。              |

在我们的 SDK 中，某些账户和参数可能会被抽象化和/或可选，以便于使用。
可以在 [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L167C4-L167C23) 上查看链上指令的完整详细信息。

{% /totem-accordion %}
{% /totem %}

{% seperator h="6" /%}

{% dialect-switcher title="更新集合" %}
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

如果您想更改附加到 Core 集合的插件的行为，您可能需要使用 `updateCollectionPlugin` 指令。

{% totem %}
{% totem-accordion title="技术指令详情 - UpdateCollectionPluginV1" %}

**指令账户列表**

| 账户          | 描述                                |
| ------------- | ----------------------------------- |
| collection    | Core 资产所属的集合。               |
| payer         | 支付存储费用的账户。                |
| authority     | 新资产的权限。                      |
| systemProgram | 系统程序账户。                      |
| logWrapper    | SPL Noop 程序。                     |

**指令参数**

| 参数   | 描述                                |
| ------ | ----------------------------------- |
| plugin | 您希望更新的插件。                  |

在我们的 SDK 中，某些账户可能会被抽象化和/或可选，以便于使用。
可以在 [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L81) 上查看链上指令的完整详细信息。

{% /totem-accordion %}
{% /totem %}

{% seperator h="6" /%}

{% dialect-switcher title="更新集合插件" %}
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
