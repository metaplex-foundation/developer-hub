---
title: 更新委托插件
metaTitle: 更新委托插件 | Core
description: 了解如何向 Core NFT 资产或集合委托额外的更新权限。
updated: "06-19-2024"
---

更新委托是一个`权限管理`插件，允许 MPL Core 资产的权限为资产分配更新委托。

更新委托插件可以在以下情况下使用：

- 您需要第三方更新/编辑整个 MPL Core 资产。

## 适用于

|                     |     |
| ------------------- | --- |
| MPL Core 资产      | ✅  |
| MPL Core 集合 | ✅  |

## 参数

|                     |             |
| ------------------- | ----------- |
| additionalDelegates | publickey[] |

### additionalDelegates

附加委托允许您向 updateDelegate 插件添加多个委托。

附加委托可以执行更新权限可以执行的所有操作，除了：
- 添加或更改附加委托数组（除了移除自己）。
- 更改 updateAuthority 插件的插件权限。
- 更改集合的根更新权限。

## 向资产添加更新委托插件

{% dialect-switcher title="向 MPL Core 资产添加更新委托插件" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin } from '@metaplex-foundation/mpl-core'

const assetAddress = publicKey('11111111111111111111111111111111')
const delegate = publicKey('22222222222222222222222222222222')

await addPlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'UpdateDelegate',
    authority: { type: 'Address', address: delegate },
    additionalDelegates: [],
  },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```ts
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{Plugin, UpdateDelegate},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_update_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let add_update_delegate_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::UpdateDelegate(UpdateDelegate {}))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let add_update_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[add_update_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&add_update_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /dialect %}
{% /dialect-switcher %}

## 更新更新委托插件

更新委托插件可以更新以修改附加委托列表或更改插件权限。

{% dialect-switcher title="更新资产上的更新委托插件" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin } from '@metaplex-foundation/mpl-core'

const assetAddress = publicKey('11111111111111111111111111111111')
const newDelegate = publicKey('33333333333333333333333333333333')
const existingDelegate = publicKey('22222222222222222222222222222222')

await updatePlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'UpdateDelegate',
    additionalDelegates: [existingDelegate, newDelegate], // 添加或移除委托
  },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::UpdatePluginV1Builder,
    types::{Plugin, UpdateDelegate},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn update_update_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let new_delegate = Pubkey::from_str("33333333333333333333333333333333").unwrap();
    let existing_delegate = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let update_update_delegate_plugin_ix = UpdatePluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::UpdateDelegate(UpdateDelegate {
            additional_delegates: vec![existing_delegate, new_delegate], // 添加或移除委托
        }))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let update_update_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[update_update_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&update_update_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## 更新集合上的更新委托插件

{% dialect-switcher title="更新集合上的更新委托插件" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updateCollectionPlugin } from '@metaplex-foundation/mpl-core'

const collectionAddress = publicKey('11111111111111111111111111111111')
const delegate1 = publicKey('22222222222222222222222222222222')
const delegate2 = publicKey('33333333333333333333333333333333')

await updateCollectionPlugin(umi, {
  collection: collectionAddress,
  plugin: {
    type: 'UpdateDelegate',
    additionalDelegates: [delegate1, delegate2], // 更新的委托列表
  },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::UpdateCollectionPluginV1Builder,
    types::{Plugin, UpdateDelegate},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn update_collection_update_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let delegate1 = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let delegate2 = Pubkey::from_str("33333333333333333333333333333333").unwrap();

    let update_collection_update_delegate_plugin_ix = UpdateCollectionPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .plugin(Plugin::UpdateDelegate(UpdateDelegate {
            additional_delegates: vec![delegate1, delegate2], // 更新的委托列表
        }))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let update_collection_update_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[update_collection_update_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&update_collection_update_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}
