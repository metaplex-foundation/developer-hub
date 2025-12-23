---
title: 移除外部插件适配器
metaTitle: 移除外部插件适配器 | Core
description: 了解如何从 Core Assets 和 Collections 移除外部插件适配器。
---

## 从 Asset 移除

{% dialect-switcher title="从 Asset 移除外部插件" %}
{% dialect title="JavaScript" id="js" %}

要从 Asset 移除外部插件适配器，您需要使用 `removePlugin()` 函数。

```ts
import {publicKey } from '@metaplex-foundation/umi'
import { removePlugin, CheckResult } from '@metaplex-foundation/mpl-core'

const asset = publicKey('1111111111111111111111111111111')
const oracleAccount = publicKey('2222222222222222222222222222222')

await removePlugin(umi, {
  asset,
  plugin: {
    type: 'Oracle',
    baseAddress: oracleAccount,
  },
})
```

{% /dialect  %}

{% dialect title="Rust" id="rust" %}

要从 Asset 移除外部插件适配器，您需要使用 `RemoveExternalPluginAdapterV1Builder()` 函数。

```rust
use mpl_core::{instructions::RemoveExternalPluginAdapterV1Builder, types::ExternalPluginAdapterKey};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn remove_external_plugin_adapter_from_asset() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let oracle_account = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let remove_external_plugin_adapter_from_asset_ix = RemoveExternalPluginAdapterV1Builder::new()
        .asset(asset)
        .key(ExternalPluginAdapterKey::Oracle(oracle_account))
        .payer(authority.pubkey())
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let remove_external_plugin_adapter_from_asset_tx = Transaction::new_signed_with_payer(
        &[remove_external_plugin_adapter_from_asset_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&remove_external_plugin_adapter_from_asset_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect  %}

{% /dialect-switcher %}

## 从 Collection 移除

{% dialect-switcher title="从 Collection 移除外部插件" %}
{% dialect title="JavaScript" id="js" %}

要从 Collection 移除外部插件适配器，您需要使用 `removeCollectionPlugin()` 函数。

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { removeCollectionPlugin, CheckResult } from '@metaplex-foundation/mpl-core'

const collection = publicKey('1111111111111111111111111111111')
const oracleAccount = publicKey('2222222222222222222222222222222')

removeCollectionPlugin(umi, {
  collection,
  plugin: {
    type: 'Oracle',
    baseAddress: publicKey(oracleAccount),
  },
})
```

{% /dialect  %}

{% dialect title="Rust" id="rust" %}

要从 Collection 移除外部插件适配器，您需要使用 `RemoveCollectionExternalPluginAdapterV1Builder()` 函数。

```rust

use mpl_core::{instructions::RemoveCollectionExternalPluginAdapterV1Builder, types::ExternalPluginAdapterKey};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn remove_external_plugin_adapter_from_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let oracle_account = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let remove_external_plugin_adapter_from_collection_ix = RemoveCollectionExternalPluginAdapterV1Builder::new()
        .collection(collection)
        .key(ExternalPluginAdapterKey::Oracle(oracle_account))
        .payer(authority.pubkey())
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let remove_external_plugin_adapter_from_collection_tx = Transaction::new_signed_with_payer(
        &[remove_external_plugin_adapter_from_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&remove_external_plugin_adapter_from_collection_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /dialect  %}

{% /dialect-switcher %}
