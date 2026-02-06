---
title: 委托和撤销插件
metaTitle: 委托和撤销插件权限 | Metaplex Core
description: 了解如何在 Core Asset 上委托和撤销插件权限。更改谁控制插件并使插件数据不可变。
updated: '01-31-2026'
keywords:
  - delegate plugin
  - revoke plugin
  - plugin authority
  - immutable plugin
about:
  - Authority delegation
  - Plugin revocation
  - Immutability
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 撤销和删除插件有什么区别？
    a: 撤销只改变谁控制插件——插件及其数据保持不变。删除会完全移除插件。
  - q: 可以委托给多个地址吗？
    a: 不可以。每个插件一次只有一个权限者。委托给新地址会替换之前的权限者。
  - q: 转移 Asset 时委托的插件会怎样？
    a: 所有者管理的插件会自动撤销回 Owner 权限。权限管理的插件保持不变。
  - q: 设置权限为 None 后可以撤销吗？
    a: 不可以。设置权限为 None 会使插件永久不可变。这无法逆转。
  - q: 委托人可以撤销自己吗？
    a: 可以。被委托的权限者可以撤销自己的访问权限，这会将控制权返回给默认的权限类型。
---
本指南展示如何在 Core Asset 上**委托和撤销插件权限**。将插件控制权转移给其他地址或使插件数据永久不可变。{% .lead %}
{% callout title="学习内容" %}

- 将插件权限委托给另一个地址
- 撤销已委托的权限
- 了解不同插件类型的撤销行为
- 使插件数据不可变
{% /callout %}

## 摘要

使用 `approvePluginAuthority()` 委托插件权限，使用 `revokePluginAuthority()` 撤销。不同的插件类型有不同的撤销行为。

- **所有者管理**：撤销回 `Owner` 权限
- **权限管理**：撤销回 `UpdateAuthority`
- 设置权限为 `None` 使插件不可变
- 所有者管理的插件在 Asset 转移时自动撤销

## 范围外

插件删除（见[删除插件](/smart-contracts/core/plugins/removing-plugins)）、添加插件（见[添加插件](/smart-contracts/core/plugins/adding-plugins)）和永久插件权限更改。

## 快速开始

**跳转至：** [委托权限](#委托权限) · [撤销权限](#撤销权限) · [设为不可变](#使插件数据不可变)

1. 使用新权限地址调用 `approvePluginAuthority()`
2. 要撤销：调用 `revokePluginAuthority()`
3. 要设为不可变：将权限设为 `None`

## 委托权限

插件可以通过委托权限指令更新委托给另一个地址。委托的插件允许主要权限者以外的地址控制该插件的功能。
{% dialect-switcher title="委托插件权限" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { approvePluginAuthority } from '@metaplex-foundation/mpl-core'
const assetAddress = publicKey('11111111111111111111111111111111')
const delegate = publicKey('33333333333333333333333333333')
await approvePluginAuthority(umi, {
  asset: assetAddress,
  plugin: { type: 'Attributes' },
  newAuthority: { type: 'Address', address: delegate },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::ApprovePluginAuthorityV1Builder,
    types::{PluginAuthority, PluginType},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn delegate_plugin_authority() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let delegate_authority = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let delegate_plugin_authority_ix = ApprovePluginAuthorityV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .new_authority(PluginAuthority::Address {
            address: delegate_authority,
        })
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let delegate_plugin_authority_tx = Transaction::new_signed_with_payer(
        &[delegate_plugin_authority_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&delegate_plugin_authority_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## 撤销权限

撤销插件权限会根据被撤销的插件类型产生不同的行为。

- **所有者管理的插件**：如果从`所有者管理的插件`撤销一个地址，那么插件将默认返回 `Owner` 权限类型。
- **权限管理的插件**：如果从`权限管理的插件`撤销一个地址，那么插件将默认返回 `UpdateAuthority` 权限类型。

### 谁可以撤销插件？

#### 所有者管理的插件

- 所有者可以撤销所有者管理的插件，这会撤销委托并将 pluginAuthority 类型设置为 `Owner`。
- 插件的被委托权限者可以撤销自己，这会将插件权限类型设置为 `Owner`。
- 在转移时，所有者管理插件的被委托权限者会自动撤销回 `Owner Authority` 类型。

#### 权限管理的插件

- Asset 的更新权限者可以撤销委托，这会将 pluginAuthority 类型设置为 `UpdateAuthority`。
- 插件的被委托权限者可以撤销自己，这会将插件权限类型设置为 `UpdateAuthority`。
插件及其类型的列表可以在[插件概述](/smart-contracts/core/plugins)页面查看。
{% dialect-switcher title="撤销插件权限" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { revokePluginAuthority } from '@metaplex-foundation/mpl-core'
await revokePluginAuthority(umi, {
  asset: asset.publicKey,
  plugin: { type: 'Attributes' },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{instructions::RevokePluginAuthorityV1Builder, types::PluginType};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn revoke_plugin_authority() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let revoke_plugin_authority_ix = RevokePluginAuthorityV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let revoke_plugin_authority_tx = Transaction::new_signed_with_payer(
        &[revoke_plugin_authority_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&revoke_plugin_authority_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

### Asset 转移时委托重置

所有所有者管理的插件在 Asset 转移时，其被委托的权限者会被撤销并设置回 `Owner` 权限类型。
这包括：

- Freeze Delegate
- Transfer Delegate
- Burn Delegate

## 使插件数据不可变

通过将插件权限更新为 `None` 值，将有效地使插件数据不可变。
{% callout type="warning" %}
**警告** - 这样做会使您的插件数据不可变。请谨慎操作！
{% /callout %}
{% dialect-switcher title="使插件不可变" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  approvePluginAuthority
} from '@metaplex-foundation/mpl-core'
await approvePluginAuthority(umi, {
  asset: asset.publicKey,
  plugin: { type: 'FreezeDelegate' },
  newAuthority: { type: 'None' },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::ApprovePluginAuthorityV1Builder,
    types::{PluginAuthority, PluginType},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn make_plugin_data_immutable() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let make_plugin_data_immutable_ix = ApprovePluginAuthorityV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .new_authority(PluginAuthority::None)
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let make_plugin_data_immutable_tx = Transaction::new_signed_with_payer(
        &[make_plugin_data_immutable_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&make_plugin_data_immutable_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## 常见错误

### `Authority mismatch`

您没有委托或撤销此插件的权限。只有当前权限者可以委托；只有所有者/权限者可以撤销。

### `Plugin not found`

Asset/Collection 没有附加此插件类型。

### `Cannot revoke None authority`

权限为 `None` 的插件是不可变的。没有权限可以撤销。

## 注意事项

- 委托转移控制权但不移除原权限者撤销的能力
- 设置权限为 `None` 是永久且不可逆的
- 所有者管理的插件在 Asset 转移给新所有者时自动撤销
- 撤销将权限返回给默认类型（Owner 或 UpdateAuthority）

## 快速参考

### 按插件类型的撤销行为

| 插件类型 | 撤销到 |
|-------------|------------|
| 所有者管理 | `Owner` 权限 |
| 权限管理 | `UpdateAuthority` |

### 谁可以委托/撤销

| 操作 | 所有者管理 | 权限管理 |
|--------|---------------|-------------------|
| 委托 | 所有者 | 更新权限者 |
| 撤销 | 所有者或委托人 | 更新权限者或委托人 |

## 常见问题

### 撤销和删除插件有什么区别？

撤销只改变谁控制插件——插件及其数据保持不变。删除会完全移除插件。

### 可以委托给多个地址吗？

不可以。每个插件一次只有一个权限者。委托给新地址会替换之前的权限者。

### 转移 Asset 时委托的插件会怎样？

所有者管理的插件会自动撤销回 `Owner` 权限。权限管理的插件保持不变。

### 设置权限为 None 后可以撤销吗？

不可以。设置权限为 `None` 会使插件永久不可变。这无法逆转。

### 委托人可以撤销自己吗？

可以。被委托的权限者可以撤销自己的访问权限，这会将控制权返回给默认的权限类型。

## 相关操作

- [添加插件](/smart-contracts/core/plugins/adding-plugins) - 向 Asset/Collection 添加插件
- [删除插件](/smart-contracts/core/plugins/removing-plugins) - 完全删除插件
- [更新插件](/smart-contracts/core/plugins/update-plugins) - 修改插件数据
- [插件概述](/smart-contracts/core/plugins) - 可用插件的完整列表

## 术语表

| 术语 | 定义 |
|------|------------|
| **委托人** | 被授予插件临时控制权的地址 |
| **撤销** | 移除被委托的权限，返回默认值 |
| **None 权限** | 使插件不可变的特殊权限类型 |
| **自动撤销** | 转移时所有者管理插件的自动撤销 |
| **插件权限** | 当前控制插件的地址 |
