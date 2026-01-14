---
title: 使用 MPL Core 打印版本
metaTitle: 打印版本 | Core 指南
description: 本指南展示如何组合插件以使用 Metaplex Core 协议创建版本。
---

## 简介

### 什么是版本（Edition）？

版本是同一"主版本（Master Edition）"的副本。要理解这个概念，可以将其想象成实体绘画：主版本是最初的绘画，版本（也称为打印品）是该绘画的副本。

### Core 中的版本

MPL Core 版本支持在主网发布后不久就添加了。与 Token Metadata 版本不同，版本编号和供应量不是强制性的，而是信息性的。

为了在 Core 中实现版本概念，使用了两个[插件](/zh/smart-contracts/core/plugins)：Collection 中的 [Master Edition](/zh/smart-contracts/core/plugins/master-edition) 和 Asset（即打印品）中的 [Edition](/zh/smart-contracts/core/plugins/edition)。层次结构如下：

{% diagram %}
{% node %}
{% node #master label="Master Edition" theme="indigo" /%}
{% /node %}
{% node y="50" parent="master" theme="transparent" %}
带有

Master Edition 插件的 Collection
{% /node %}

{% node x="200" y="-70" parent="master" %}
{% node #asset1 label="Edition" theme="blue" /%}
{% /node %}
{% node y="70" parent="asset1" %}
{% node #asset2 label="Edition" theme="blue" /%}
{% /node %}
{% node y="70" parent="asset2" %}
{% node #asset3 label="Edition" theme="blue" /%}
{% /node %}

{% node y="50" parent="asset3" theme="transparent" %}
带有

Edition 插件的 Assets
{% /node %}

{% edge from="master" to="asset1" /%}
{% edge from="master" to="asset2" /%}
{% edge from="master" to="asset3" /%}

{% /diagram %}

## 使用 Candy Machine 创建版本

创建和销售版本的最简单方法是利用 Core Candy Machine。

以下代码创建一个 Master Edition Collection 和为您打印版本的 Candy Machine。

{% dialect-switcher title="创建带有 Edition Guard 和 Master Edition Collection 的 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

首先导入所有必需的函数，并使用您的 RPC 和钱包设置 Umi：

```ts
import {
  create,
  mplCandyMachine,
} from "@metaplex-foundation/mpl-core-candy-machine";
import {
    createCollection,
    ruleSet
} from "@metaplex-foundation/mpl-core";
import crypto from "crypto";
import {
  generateSigner,
  keypairIdentity,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

// 使用您选择的 RPC 端点。
const umi = createUmi("http://127.0.0.1:8899").use(mplCandyMachine());

// 在这里使用您的密钥对或 Wallet Adapter。
const keypair = generateSigner(umi);
umi.use(keypairIdentity(keypair));
```

设置完成后，我们可以使用 [Master Edition 插件](/zh/smart-contracts/core/plugins/master-edition)创建 Collection。`maxSupply` 字段确定您想要打印多少版本。插件中的 `name` 和 `uri` 字段可以在 Collection Name 和 uri 之外额外使用。

为了便于使用，我们还添加了 [Royalty 插件](/zh/smart-contracts/core/plugins/royalties)。

```ts
const collectionSigner = generateSigner(umi);
await createCollection(umi, {
  collection: collectionSigner,
  name: "Master Edition",
  uri: "https://example.com/master-edition.json",
  plugins: [
    {
      type: "MasterEdition",
        maxSupply: 100,
        // 如果您希望它们与父集合相似，则不需要 name 和 uri
        name: undefined,
        uri: undefined,
    },
    {
      type: "Royalties",
      basisPoints: 500,
      creators: [{ address: umi.identity.publicKey, percentage: 100 }],
      ruleSet: ruleSet("None"),
    }
    ]
  }).sendAndConfirm(umi);
```

创建 Collection 后，我们可以使用 `hiddenSettings` 和 `edition` guard 创建 candy machine。

- `hiddenSettings` 用于为所有铸造的 Assets 分配相同或类似的名称和元数据。您可以使用 `$ID$` 变量，它将在铸造时替换为铸造 Asset 的索引。
- `edition` Guard 用于将 [Edition 插件](/zh/smart-contracts/core/plugins/edition)添加到 Assets。版本号从 `editionStartOffset` 中的数字开始，对于每个铸造的 Asset 递增。

```ts
// 您的版本的名称和链下元数据
const editionData = {
  name: "Edition Name",
  uri: "https://example.com/edition-asset.json",
};

// 这创建一个哈希，版本不使用但 Candy Machine 需要
const string = JSON.stringify(editionData);
const hash = crypto.createHash("sha256").update(string).digest();

const candyMachine = generateSigner(umi);
const createIx = await create(umi, {
  candyMachine,
  collection: collectionSigner.publicKey,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 100,
  hiddenSettings: {
    name: editionData.name,
    uri: editionData.uri,
    hash,
  },
  guards: {
    edition: { editionStartOffset: 0 },
    // ... 额外的 Guards
  },
})

await createIx.sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

就是这样！

现在用户可以从您的 candy machine 铸造版本。

## 不使用 Core Candy Machine 创建版本

{% callout type="note" %}
我们强烈建议使用 Core Candy Machine 来创建 MPL Core 版本。Candy Machine 为您处理创建以及版本的正确编号。
{% /callout %}

要在不使用 Core Candy Machine 的情况下创建版本，您需要：

1. 使用 [Master Edition](/zh/smart-contracts/core/plugins/master-edition) 插件创建 Collection

{% dialect-switcher title="创建带有 Master Edition 插件的 MPL Core Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import {
  createCollection,
  ruleSet,
} from '@metaplex-foundation/core'

const collectionSigner = generateSigner(umi)

const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('22222222222222222222222222222222')

await createCollection(umi, {
  collection: collectionSigner,
  name: "Master Edition",
  uri: "https://example.com/master-edition.json",
  plugins: [
    {
      type: "MasterEdition",
        maxSupply: 100,
        // 如果您希望它们与父集合相似，则不需要 name 和 uri
        name: undefined,
        uri: undefined,
    },
    {
      type: "Royalties",
      basisPoints: 500,
      creators: [
        { address: creator1, percentage: 50 },
        { address: creator2, percentage: 50 }
      ],
      ruleSet: ruleSet("None"),
    }
    ]
  }).sendAndConfirm(umi);
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
            plugin: Plugin::MasterEdition(MasterEdition {
                max_supply: 100,
                name: "My Master Edition"
                uri: "https://example.com/my-master-edition",
            }),
            authority: Some(PluginAuthority::UpdateAuthority),
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

2. 使用 [Edition](/zh/smart-contracts/core/plugins/edition) 插件创建 Assets。记住在插件中增加编号。

{% dialect-switcher title="使用 Edition 插件创建 MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
    create,
} from '@metaplex-foundation/mpl-core'

const asset = generateSigner(umi)

const result = create(umi, {
  asset: asset,
  name: 'My Nft',
  uri: 'https://example.com/my-nft',
  collection: collectionSigner.publicKey,
  plugins: [
    {
      type: 'Edition',
      number: 1,
    }
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use std::str::FromStr;
use mpl_core::{
    instructions::CreateV1Builder,
    types::{Creator, Plugin, PluginAuthority, PluginAuthorityPair, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn create_asset_with_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();
    let authority = Keypair::new();

    let creator = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::Edition(Edition {
                number: 1,
            })
        }])
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /dialect %}

{% /dialect-switcher %}

## 延伸阅读
- [从 Candy Machine 铸造](/zh/smart-contracts/core-candy-machine/mint)
- [Master Edition 插件](/zh/smart-contracts/core/plugins/master-edition)
- [Edition 插件](/zh/smart-contracts/core/plugins/edition)
