---
title: 移除外部插件
metaTitle: 移除外部插件 | Metaplex Core
description: 了解如何从 Core Assets 和 Collections 移除 Oracle 和 AppData 插件。包含 JavaScript 和 Rust 代码示例。
---

本指南展示如何从 Core Assets 和 Collections **移除外部插件**。当不再需要时移除 Oracle 或 AppData 插件。{% .lead %}

{% callout title="您将学到" %}

- 从 Assets 移除外部插件
- 从 Collections 移除外部插件
- 理解权限要求
- 从移除的插件回收租金

{% /callout %}

## 摘要

使用 `removePlugin()` 移除 Assets 的外部插件，或使用 `removeCollectionPlugin()` 移除 Collections 的外部插件。只有插件权限可以移除外部插件。

- 指定插件类型和基地址
- 插件数据被删除
- 租金被回收
- 需要插件权限签名

## 超出范围

添加外部插件（参见[添加外部插件](/zh/smart-contracts/core/external-plugins/adding-external-plugins)）、更新插件数据和移除内置插件（参见[移除插件](/zh/smart-contracts/core/plugins/removing-plugins)）。

## 快速开始

**跳转到：** [从 Asset 移除](#从-asset-移除) · [从 Collection 移除](#从-collection-移除)

1. 识别要移除的插件类型和基地址
2. 使用插件键调用 `removePlugin()`
3. 插件立即移除，租金回收

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

## 常见错误

### `Authority mismatch`

只有插件权限可以移除外部插件。验证您使用的是正确的密钥对签名。

### `Plugin not found`

此 Asset/Collection 上不存在具有指定键的外部插件。

## 注意事项

- 移除插件会删除所有数据
- 租金被回收并返回给支付者
- 只有插件权限可以移除（通常是更新权限）
- 外部 Oracle/AppData 账户不会被删除——只移除适配器

## FAQ

### 移除 Oracle 插件会删除 Oracle 账户吗？

不会。只有 Asset 上的插件适配器被移除。外部 Oracle 账户保持不变，可以重复使用。

### 移除前可以恢复 AppData 吗？

可以。如果需要保留数据，在移除插件之前使用 `fetchAsset()` 读取 AppData。

### 租金会怎样？

插件适配器的租金被回收并返回给交易支付者。

## 相关操作

- [添加外部插件](/zh/smart-contracts/core/external-plugins/adding-external-plugins) - 添加外部插件
- [外部插件概述](/zh/smart-contracts/core/external-plugins/overview) - 理解外部插件
- [移除插件](/zh/smart-contracts/core/plugins/removing-plugins) - 移除内置插件

---

*由 Metaplex Foundation 维护 · 最后验证于 2026 年 1 月 · 适用于 @metaplex-foundation/mpl-core*
