---
title: 更新资产
metaTitle: 更新资产 | Core
description: 了解如何使用 Metaplex 包更新 Core NFT 资产。
---

Core 资产的更新权限或委托有能力更改资产的某些数据。

{% totem %}
{% totem-accordion title="技术指令详情" %}

**指令账户列表**

| 账户               | 描述                                |
| ------------------ | ----------------------------------- |
| asset              | MPL Core 资产的地址。               |
| collection         | Core 资产所属的集合。               |
| payer              | 支付存储费用的账户。                |
| authority          | 资产的所有者或委托。                |
| newUpdateAuthority | 资产的新更新权限。                  |
| systemProgram      | 系统程序账户。                      |
| logWrapper         | SPL Noop 程序。                     |

**指令参数**

| 参数    | 描述                                |
| ------- | ----------------------------------- |
| newName | 您的 Core 资产的新名称。            |
| newUri  | 新的链外元数据 URI。                |

在我们的 SDK 中，某些账户/参数可能会被抽象化和/或可选，以便于使用。
可以在此处查看链上指令的完整详细信息。[Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/clients/rust/src/generated/instructions/update_v1.rs#L126)

{% /totem-accordion %}
{% /totem %}

## 更新 Core 资产

以下是如何使用我们的 SDK 更新 MPL Core 资产。

{% dialect-switcher title="更新资产" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { update, fetchAsset } from '@metaplex-foundation/mpl-core'

const assetId = publicKey('11111111111111111111111111111111')
const asset = await fetchAsset(umi, assetId)

// 可选：如果资产在集合中，请获取集合
const collectionId = publicKey('2222222222222222222222222222222')
const collection = await fetchCollection(umi, collectionId)

await update(umi, {
  asset,
  // 可选：仅当资产是集合的一部分时才需要集合
  collection,
  name: 'New Nft Name',
  uri: 'https://example.com/new-uri',
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```ts
use mpl_core::instructions::UpdateV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn update_asset() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    // 可选：如果资产在集合中，请获取集合
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let update_asset_ix = UpdateV1Builder::new()
        .asset(asset)
        // 可选：仅当资产是集合的一部分时才需要集合
        .collection(collection)
        .payer(authority.pubkey())
        .new_name("My asset".into())
        .new_uri("https://example.com/my-asset.json".into())
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let update_asset_tx = Transaction::new_signed_with_payer(
        &[update_asset_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&update_asset_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## 更改 Core 资产的集合

以下是如何使用我们的 SDK 更改 Core 资产的集合。

{% dialect-switcher title="更改 Core 资产的集合" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from "@metaplex-foundation/umi";
import {
  update,
  fetchAsset,
  fetchCollection,
  collectionAddress,
  updateAuthority
} from "@metaplex-foundation/mpl-core";

const assetId = publicKey("11111111111111111111111111111111");

const asset = await fetchAsset(umi, assetId);

const collectionId = collectionAddress(asset)

if (!collectionId) {
  console.log("Collection not found");
  return;
}

const collection = await fetchCollection(umi, collectionId);

const newCollectionId = publicKey("22222222222222222222222222222222")

const updateTx = await update(umi, {
  asset,
  collection,
  newCollection: newCollectionId,
  newUpdateAuthority: updateAuthority('Collection', [newCollectionId]),
}).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

## 使 Core 资产数据不可变

以下是如何使用我们的 SDK 使 Core 资产完全不可变。请注意，[不可变性指南](/zh/smart-contracts/core/guides/immutability)中描述了不同级别的不可变性。

{% callout type="warning" title="重要" %}

这是一个破坏性操作，将删除更新资产的能力。

它还将从资产所在的任何集合中删除该资产。要使集合资产不可变，您需要更改集合的更新权限。

{% /callout %}

{% dialect-switcher title="使 Core 资产不可变" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { update, fetchAsset } from '@metaplex-foundation/mpl-core'

const assetId = publicKey('11111111111111111111111111111111')
const asset = await fetchAsset(umi, asset)

await update(umi, {
  asset: asset,
  newUpdateAuthority: updateAuthority('None'),
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{instructions::UpdateV1Builder, types::UpdateAuthority};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn update_asset_data_to_immutable() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let update_asset_ix = UpdateV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .new_update_authority(UpdateAuthority::None)
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let update_asset_tx = Transaction::new_signed_with_payer(
        &[update_asset_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&update_asset_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /dialect %}
{% /dialect-switcher %}
