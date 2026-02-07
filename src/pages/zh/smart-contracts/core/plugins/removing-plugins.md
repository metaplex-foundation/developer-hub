---
title: 移除插件
metaTitle: 移除插件 | Metaplex Core
description: 了解如何从 Core NFT Asset 和 Collection 中移除插件。移除功能并从插件账户中回收租金。
updated: '01-31-2026'
keywords:
  - remove plugin
  - removePlugin
  - delete plugin
  - recover rent
about:
  - Removing plugins
  - Rent recovery
  - Plugin management
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 移除插件后可以恢复数据吗？
    a: 不可以。移除插件会永久删除所有数据。请在移除前备份重要数据。
  - q: 移除插件时租金会怎样？
    a: 用于存储插件数据的租金会被回收并返还给支付者。
  - q: 我可以移除别人委托给我的插件吗？
    a: 可以，如果您是该插件的委托权限者，就可以移除它。
  - q: 为什么不能移除 Permanent 插件？
    a: Permanent 插件在创建后无法移除，但其设置仍可调整。这是为需要保证插件存在的用例而设计的。
  - q: 可以同时移除 Collection 及其 Asset 的插件吗？
    a: 不可以。Collection 插件和 Asset 插件是分开管理的。但是，移除 Collection 插件可能会影响从其继承的 Asset（例如，没有自己 Royalties 插件的 Asset 将不再执行版税）。
---
本指南展示如何从 Core Asset 和 Collection 中**移除插件**。移除插件会删除其数据和功能。 {% .lead %}
{% callout title="您将学到" %}
- 从 Asset 移除插件
- 从 Collection 移除插件
- 理解移除所需的权限要求
- 从已移除的插件回收租金
{% /callout %}
## 摘要
使用 `removePlugin()` 从 Asset 移除插件，使用 `removeCollectionPlugin()` 从 Collection 移除。只有插件权限者可以移除插件。
- 指定要移除的插件类型
- 插件数据被删除
- 租金被回收
- Permanent 插件无法移除
## 范围外
Permanent 插件移除（不可能）、插件更新（参见[更新插件](/zh/smart-contracts/core/plugins/update-plugins)）和权限变更（参见[委托插件](/zh/smart-contracts/core/plugins/delegating-and-revoking-plugins)）。
## 快速开始
**跳转至：** [从 Asset 移除](#从-mpl-core-asset-移除插件) · [从 Collection 移除](#从-collection-移除插件)
1. 确定要移除的插件类型
2. 使用 Asset 和插件类型调用 `removePlugin()`
3. 插件立即被移除
也可以从 MPL Core Asset 和 MPL Core Collection 中移除插件。
## 从 MPL Core Asset 移除插件
{% dialect-switcher title="从 MPL Core Asset 移除插件" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { removePlugin } from '@metaplex-foundation/mpl-core'
const asset = publicKey('11111111111111111111111111111111')
await removePlugin(umi, {
  asset: asset.publicKey,
  plugin: { type: 'Attributes' },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{instructions::RemovePluginV1Builder, types::PluginType};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn remove_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let remove_plugin_ix = RemovePluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let remove_plugin_tx = Transaction::new_signed_with_payer(
        &[remove_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&remove_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## 从 Collection 移除插件
{% dialect-switcher title="从 MPL Core Collection 移除插件" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  removeCollectionPluginV1,
  PluginType,
} from '@metaplex-foundation/mpl-core'
const collectionAddress = publicKey('11111111111111111111111111111111')
await removeCollectionPlugin(umi, {
  collection: collectionAddress,
  pluginType: { type: 'Royalties' },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{instructions::RemoveCollectionPluginV1Builder, types::PluginType};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn remove_collection_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let remove_collection_plugin_ix = RemoveCollectionPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let remove_collection_plugin_tx = Transaction::new_signed_with_payer(
        &[remove_collection_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&remove_collection_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## 常见错误
### `Authority mismatch`
您没有权限移除此插件。检查谁拥有该插件的权限。
### `Plugin not found`
Asset/Collection 没有附加此插件类型。
### `Cannot remove permanent plugin`
Permanent 插件在创建后无法移除。它们是永久附加的。
## 注意事项
- 移除插件会删除所有数据
- 已移除插件的租金会被回收
- 只有插件权限者可以移除插件
- Permanent 插件永远无法移除
## 快速参考
### 移除权限要求
| 插件类型 | 可移除者 |
|-------------|----------------|
| Owner Managed | 所有者或委托者 |
| Authority Managed | Update authority 或委托者 |
| Permanent | 无法移除 |
## FAQ
### 移除插件后可以恢复数据吗？
不可以。移除插件会永久删除所有数据。请在移除前备份重要数据。
### 移除插件时租金会怎样？
用于存储插件数据的租金会被回收并返还给支付者。
### 我可以移除别人委托给我的插件吗？
可以，如果您是该插件的委托权限者，就可以移除它。
### 为什么不能移除 Permanent 插件？
Permanent 插件在创建后无法移除，但其设置仍可调整。这是为需要保证插件存在的用例而设计的。
### 可以同时移除 Collection 及其 Asset 的插件吗？
不可以。Collection 插件和 Asset 插件是分开管理的。但是，移除 Collection 插件可能会影响从其继承的 Asset（例如，没有自己 Royalties 插件的 Asset 将不再执行版税）。
## 相关操作
- [添加插件](/zh/smart-contracts/core/plugins/adding-plugins) - 向 Asset/Collection 添加插件
- [委托插件](/zh/smart-contracts/core/plugins/delegating-and-revoking-plugins) - 更改插件权限
- [更新插件](/zh/smart-contracts/core/plugins/update-plugins) - 修改插件数据
- [插件概述](/zh/smart-contracts/core/plugins) - 可用插件完整列表
## 术语表
| 术语 | 定义 |
|------|------------|
| **Plugin Authority** | 有权管理插件的地址 |
| **Permanent Plugin** | 创建后无法移除的插件 |
| **Rent** | 在 Solana 上存储账户数据所需存入的 SOL |
| **Owner Managed** | 由所有者控制移除的插件 |
| **Authority Managed** | 由 update authority 控制移除的插件 |
