---
title: 移除 Plugin
metaTitle: 移除 Plugin | Metaplex Core
description: 了解如何从 Core NFT Asset 和 Collection 移除 Plugin。移除功能并从 Plugin 账户回收租金。
---

本指南展示如何从 Core Asset 和 Collection **移除 Plugin**。移除 Plugin 会删除其数据和功能。 {% .lead %}

{% callout title="您将学到" %}

- 从 Asset 移除 Plugin
- 从 Collection 移除 Plugin
- 理解移除的权限要求
- 从已移除的 Plugin 回收租金

{% /callout %}

## 概要

使用 `removePlugin()` 从 Asset 移除 Plugin，或使用 `removeCollectionPlugin()` 从 Collection 移除。只有 Plugin 权限可以移除 Plugin。

- 指定要移除的 Plugin 类型
- Plugin 数据被删除
- 租金被回收
- Permanent Plugin 不能被移除

## 不在范围内

Permanent Plugin 移除（不可能）、Plugin 更新（参见[更新 Plugin](/zh/smart-contracts/core/plugins/update-plugins)）和权限更改（参见[委托 Plugin](/zh/smart-contracts/core/plugins/delegating-and-revoking-plugins)）。

## 快速开始

**跳转至：** [从 Asset 移除](#从-mpl-core-资产中移除插件) · [从 Collection 移除](#从集合中移除插件)

1. 确定要移除的 Plugin 类型
2. 使用 Asset 和 Plugin 类型调用 `removePlugin()`
3. Plugin 立即被移除

Plugin 也可以从 MPL Core Asset 和 MPL Core Collection 中移除。

## 从 MPL Core 资产中移除插件

{% dialect-switcher title="从 MPL Core Asset 移除 Plugin" %}
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

## 从集合中移除插件

{% dialect-switcher title="从 MPL Core Collection 移除 Plugin" %}
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

您没有权限移除此 Plugin。检查谁拥有该 Plugin 的权限。

### `Plugin not found`

Asset/Collection 没有附加此 Plugin 类型。

### `Cannot remove permanent plugin`

Permanent Plugin 创建后不能被移除。它们是永久附加的。

## 注意事项

- 移除 Plugin 会删除其所有数据
- 已移除 Plugin 的租金会被回收
- 只有 Plugin 权限可以移除 Plugin
- Permanent Plugin 永远不能被移除

## 快速参考

### 移除权限要求

| Plugin 类型 | 谁可以移除 |
|-------------|----------------|
| Owner Managed | 所有者或委托人 |
| Authority Managed | 更新权限或委托人 |
| Permanent | 不能被移除 |

## 常见问题

### 移除 Plugin 后可以恢复数据吗？

不可以。移除 Plugin 会永久删除其所有数据。确保在移除前备份任何重要数据。

### 移除 Plugin 时租金会怎样？

用于存储 Plugin 数据的租金会被回收并返还给支付者。

### 可以移除别人委托给我的 Plugin 吗？

可以，如果您是该 Plugin 的委托权限，您可以移除它。

### 为什么我不能移除 Permanent Plugin？

Permanent Plugin 被设计为不可变的，创建后不能被移除。这是为需要保证永久性的用例而设计的。

### 可以同时从 Collection 及其 Asset 移除 Plugin 吗？

不可以。Collection Plugin 和 Asset Plugin 是分开管理的。移除 Collection Plugin 只影响 Collection，不影响其 Asset。

## 相关操作

- [添加 Plugin](/zh/smart-contracts/core/plugins/adding-plugins) - 向 Asset/Collection 添加 Plugin
- [委托 Plugin](/zh/smart-contracts/core/plugins/delegating-and-revoking-plugins) - 更改 Plugin 权限
- [更新 Plugin](/zh/smart-contracts/core/plugins/update-plugins) - 修改 Plugin 数据
- [Plugin 概述](/zh/smart-contracts/core/plugins) - 可用 Plugin 的完整列表

## 术语表

| 术语 | 定义 |
|------|------------|
| **Plugin 权限** | 有权管理 Plugin 的地址 |
| **Permanent Plugin** | 创建后不能被移除的 Plugin |
| **租金** | 存入用于在 Solana 上存储账户数据的 SOL |
| **Owner Managed** | 所有者控制移除的 Plugin |
| **Authority Managed** | 更新权限控制移除的 Plugin |

---

*由 Metaplex Foundation 维护 · 最后验证于 2026 年 1 月 · 适用于 @metaplex-foundation/mpl-core*
