---
title: 移除外部插件
metaTitle: 移除外部插件 | Metaplex Core
description: 学习如何从 Core Asset 和 Collection 移除 Oracle 和 AppData 插件。包含 JavaScript 和 Rust 代码示例。
updated: '01-31-2026'
keywords:
  - remove external plugin
  - remove Oracle
  - remove AppData
  - delete plugin
about:
  - External plugin removal
  - Cleanup procedures
  - Authority requirements
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 移除 Oracle 插件会删除 Oracle 账户吗？
    a: 不会。只有 Asset 上的插件适配器被移除。外部 Oracle 账户保留，可以重新使用。
  - q: 移除前可以恢复 AppData 吗？
    a: 可以。如果需要保留数据，请在移除插件之前使用 fetchAsset() 读取 AppData。
  - q: 租金会怎样？
    a: 插件适配器的租金会被回收并返还给交易支付者。
---
本指南展示如何从 Core Asset 和 Collection **移除外部插件**。当不再需要 Oracle 或 AppData 插件时移除它们。{% .lead %}
{% callout title="您将学到" %}

- 从 Asset 移除外部插件
- 从 Collection 移除外部插件
- 了解权限要求
- 从移除的插件中回收租金
{% /callout %}

## 概要

使用 `removePlugin()` 移除 Asset 的外部插件，或使用 `removeCollectionPlugin()` 移除 Collection 的外部插件。只有插件权限可以移除外部插件。

- 指定插件类型和基础地址
- 插件数据被删除
- 租金被回收
- 需要插件权限签名

## 超出范围

添加外部插件（参见[添加外部插件](/smart-contracts/core/external-plugins/adding-external-plugins)）、更新插件数据和移除内置插件（参见[移除插件](/smart-contracts/core/plugins/removing-plugins)）。

## 快速开始

**跳转至：** [从 Asset 移除](#remove-from-asset) · [从 Collection 移除](#remove-from-collection)

1. 确定要移除的插件类型和基础地址
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

只有插件权限可以移除外部插件。请验证您使用的是正确的密钥对进行签名。

### `Plugin not found`

此 Asset/Collection 上不存在具有指定键的外部插件。

## 注意事项

- 移除插件会删除其所有数据
- 租金被回收并返还给支付者
- 只有插件权限可以移除（通常是更新权限）
- 外部 Oracle/AppData 账户不会被删除——只有适配器被删除

## 常见问题

### 移除 Oracle 插件会删除 Oracle 账户吗？

不会。只有 Asset 上的插件适配器被移除。外部 Oracle 账户保留，可以重新使用。

### 移除前可以恢复 AppData 吗？

可以。如果需要保留数据，请在移除插件之前使用 `fetchAsset()` 读取 AppData。

### 租金会怎样？

插件适配器的租金会被回收并返还给交易支付者。

## 相关操作

- [添加外部插件](/smart-contracts/core/external-plugins/adding-external-plugins) - 添加外部插件
- [外部插件概述](/smart-contracts/core/external-plugins/overview) - 了解外部插件
- [移除插件](/smart-contracts/core/plugins/removing-plugins) - 移除内置插件
