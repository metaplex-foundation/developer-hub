---
title: 创建资产
metaTitle: 创建资产 | Core
description: 了解如何使用 Metaplex Core 包在 Solana 上创建 Core NFT 资产。
---

如[Core 概述](/zh/smart-contracts/core)中所述，Core 上的数字资产由恰好一个链上账户和描述代币的链外数据组成。在本页面中，我们将介绍铸造这些资产的过程。{% .lead %}

## 创建过程

1. **上传链外数据。** 首先，我们必须确保链外数据已准备就绪。这意味着我们必须有一个存储在某处的 JSON 文件来描述我们的资产。无论该 JSON 文件如何存储或存储在哪里都无关紧要，只要它可以通过 **URI** 访问。链外元数据可以类似于[旧的代币元数据标准](/token-metadata/token-standard#the-non-fungible-standard)。
2. **创建链上资产账户。** 然后，我们必须创建将保存我们资产数据的链上资产账户。

让我们更详细地深入研究这些步骤，同时提供具体的代码示例。

## 上传链外数据

您可以使用任何存储服务（Arweave、IPFS、AWS 等...）来上传您的链外数据，或者简单地将其存储在您自己的服务器上。为了使其中一些对用户更容易，`Umi` 有一些专用插件，包括 `Irys（上传到 Arweave）`。一旦选择了插件，这将为您提供一个统一的界面来上传数据。

{% dialect-switcher title="上传资产和 JSON 数据" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
const [imageUri] = await umi.uploader.upload([imageFile])
const uri = await umi.uploader.uploadJson({
  name: 'My NFT',
  description: 'This is my NFT',
  image: imageUri,
  // ...
})
```

{% totem-accordion title="选择上传器" %}

要使用 Umi 选择您选择的上传器，只需安装上传器提供的插件。

例如，以下是我们如何安装 Irys 插件：

```ts
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'

 umi.use(irysUploader())
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

现在我们有了 **URI**，我们可以继续下一步。

## 创建资产

要创建资产，请使用 `createV1` 指令。`createV1` 指令除了设置资产的基本元数据外，还包括将资产添加到集合和分配插件，这将在[后面](#create-an-asset-with-plugins)描述。

下面是一个简单的示例：

{% totem %}
{% totem-accordion title="技术指令详情" %}
**指令账户列表**

| 账户          | 描述                                    |
| ------------- | --------------------------------------- |
| asset         | MPL Core 资产的地址。                   |
| collection    | Core 资产所属的集合。                   |
| authority     | 新资产的权限。                          |
| payer         | 支付存储费用的账户。                    |
| new owner     | 应该接收资产的所有者。                  |
| systemProgram | 系统程序账户。                          |
| logWrapper    | SPL Noop 程序。                         |

**指令参数**

| 参数      | 描述                                            |
| --------- | ----------------------------------------------- |
| dataState | 数据是存储在账户状态还是账本状态中。            |
| name      | 您的 MPL Core 资产的名称。                      |
| uri       | 链外 JSON 元数据 URI。                          |
| plugins   | 您希望资产拥有的插件。                          |

在我们的 SDK 中，某些账户/参数可能会被抽象化和/或可选，以便于使用。
可以在 [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L18) 上查看链上指令的完整详细信息

{% /totem-accordion %}
{% /totem %}

{% seperator h="6" /%}

{% dialect-switcher title="创建资产" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'

const assetSigner = generateSigner(umi)

const result = await create(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  //owner: publicKey('11111111111111111111111111111111'), //optional to mint into a different wallet
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::instructions::CreateV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{signature::Keypair, signer::Signer, transaction::Transaction};


pub async fn create_asset() {

    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let create_asset_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_tx = Transaction::new_signed_with_payer(
        &[create_asset_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client.send_and_confirm_transaction(&create_asset_tx).await.unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}

{% dialect title="Rust (CPI)" id="rust-cpi" %}

```rust
let create_ix = CreateV1CpiBuilder::new()
        .asset(input.asset.pubkey())
        .collection(input.collection)
        .authority(input.authority)
        .payer(payer)
        .owner(input.owner)
        .update_authority(input.update_authority)
        .system_program(system_program::ID)
        .data_state(input.data_state.unwrap_or(DataState::AccountState))
        .name(input.name.unwrap_or(DEFAULT_ASSET_NAME.to_owned()))
        .uri(input.uri.unwrap_or(DEFAULT_ASSET_URI.to_owned()))
        .plugins(input.plugins)
        .invoke();
```

{% /dialect %}
{% /dialect-switcher %}

<!-- ### Create Asset in Ledger State

{% dialect-switcher title="Create Asset in Account State" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { create, DataState } from '@metaplex-foundation/mpl-core'

const assetAddress = generateSigner(umi)
const result = create(umi, {
  dataState: DataState.LedgerState,
  asset: assetAddress,
  name: 'Test Bread',
  uri: 'https://example.com/bread',
  logWrapper: publicKey('noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV'),
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}
{% totem %}

```rust
// TODO

```

{% totem-prose %}

Note that when setting the `mint` account, it is require to specify a `bool` flag to indicate whether the account will be a signer or not – it need to be a signer if the `mint` account does not exist.

{% /totem-prose %}

{% /totem %}

{% /dialect %}

{% dialect title="Rust (CPI)" id="rust-cpi" %}

```rust
// TODO

```

{% /dialect %}
{% /dialect-switcher %} -->

## 创建资产到集合

如果您的 MPL Core 集合已经存在，MPL Core 资产可以直接创建到集合中。要创建集合资产，请访问[这里](/zh/smart-contracts/core/collections)。

{% dialect-switcher title="创建资产到集合" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import {
  createCollection,
  create,
  fetchCollection,
} from '@metaplex-foundation/mpl-core'

const collectionSigner = generateSigner(umi)

// create collection
// if you are doing this in a single script you may have
// to use a sleep function or commitment level of 'finalized'
// so the collection is fully written to change before fetching it.
await createCollection(umi, {
  collection: collectionSigner,
  name: 'My Collection',
  uri: 'https://example.com/my-collection.json',
}).sendAndConfirm(umi)

// fetch the collection
const collection = await fetchCollection(umi, collectionSigner.publicKey)


// generate assetSigner and then create the asset.
const assetSigner = generateSigner(umi)

await create(umi, {
  asset: assetSigner,
  collection: collection,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  //owner: publicKey('11111111111111111111111111111111'), //optional to mint into a different wallet
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::instructions::{CreateCollectionV1Builder, CreateV1Builder};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn create_asset_with_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let signer = Keypair::new(); // Load keypair here.

    let collection = Keypair::new();

    let create_collection_ix = CreateCollectionV1Builder::new()
        .collection(collection.pubkey())
        .payer(signer.pubkey())
        .name("My Collection".into())
        .uri("https://example.com/my-collection.json".into())
        .instruction();

    let signers = vec![&collection, &signer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_collection_tx = Transaction::new_signed_with_payer(
        &[create_collection_ix],
        Some(&signer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_collection_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res);

    let asset = Keypair::new();

    let create_asset_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .collection(Some(collection.pubkey()))
        .payer(signer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .instruction();

    let signers = vec![&asset, &signer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_tx = Transaction::new_signed_with_payer(
        &[create_asset_ix],
        Some(&signer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}

{% dialect title="Rust (CPI)" id="rust-cpi" %}

```rust
let create_ix = CreateV1CpiBuilder::new(input.program)
    .asset(input.asset.pubkey())
    .collection(Some(input.collection))
    .authority(Some(input.authority))
    .payer(input.payer)
    .owner(Some(input.owner))
    .update_authority(Some(input.update_authority))
    .system_program(system_program::ID)
    .data_state(input.data_state.unwrap_or(DataState::AccountState))
    .name(input.name)
    .uri(input.uri)
    .plugins(input.plugins)
    .invoke();
```

{% /dialect %}

{% /dialect-switcher %}

## 创建带有插件的资产

MPL Core 资产支持在集合和资产级别使用插件。要创建带有插件的 Core 资产，您需要在创建期间将插件类型及其参数传递到 `plugins` 数组参数中。下面的示例创建了一个带有 `Freeze` 插件的铸造。

{% dialect-switcher title="创建带有插件的资产" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { create, ruleSet } from '@metaplex-foundation/mpl-core'

const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('22222222222222222222222222222222')

const assetSigner = generateSigner(umi)

await create(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
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

    let creator = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
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

插件列表包括但不限于：

- [销毁委托](/zh/smart-contracts/core/plugins/burn-delegate)
- [冻结委托](/zh/smart-contracts/core/plugins/freeze-delegate)
- [版税](/zh/smart-contracts/core/plugins/royalties)
- [转移委托](/zh/smart-contracts/core/plugins/transfer-delegate)
- [更新委托](/zh/smart-contracts/core/plugins/update-delegate)
