---
title: 委托和撤销 Plugin
metaTitle: 委托和撤销 Plugin 权限 | Metaplex Core
description: 了解如何在 Core Asset 上委托和撤销 Plugin 权限。更改谁控制 Plugin 并使 Plugin 数据不可变。
---

本指南展示如何在 Core Asset 上**委托和撤销 Plugin 权限**。将 Plugin 的控制权转移给其他地址或使 Plugin 数据永久不可变。 {% .lead %}

{% callout title="您将学到" %}

- 将 Plugin 权限委托给另一个地址
- 撤销已委托的权限
- 理解不同 Plugin 类型的撤销行为
- 使 Plugin 数据不可变

{% /callout %}

## 概要

使用 `approvePluginAuthority()` 委托 Plugin 权限，使用 `revokePluginAuthority()` 撤销。不同的 Plugin 类型有不同的撤销行为。

- **Owner Managed**：撤销后恢复为 `Owner` 权限
- **Authority Managed**：撤销后恢复为 `UpdateAuthority`
- 将权限设置为 `None` 使 Plugin 不可变
- Owner Managed Plugin 在 Asset 转移时自动撤销

## 不在范围内

Plugin 移除（参见[移除 Plugin](/zh/smart-contracts/core/plugins/removing-plugins)）、添加 Plugin（参见[添加 Plugin](/zh/smart-contracts/core/plugins/adding-plugins)）和永久 Plugin 权限更改。

## 快速开始

**跳转至：** [委托权限](#委托权限) · [撤销权限](#撤销权限) · [设为不可变](#使插件数据不可变)

1. 使用新权限地址调用 `approvePluginAuthority()`
2. 要撤销：调用 `revokePluginAuthority()`
3. 要设为不可变：将权限设置为 `None`

## 委托权限

Plugin 可以通过委托权限指令更新委托给另一个地址。委托的 Plugin 允许主权限以外的地址控制该 Plugin 的功能。

{% dialect-switcher title="委托 Plugin 权限" %}
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

撤销 Plugin 权限会根据被撤销的 Plugin 类型产生不同的行为。

- **Owner Managed Plugin：** 如果从 `Owner Managed Plugin` 撤销地址，则 Plugin 将默认回到 `Owner` 权限类型。

- **Authority Managed Plugin：** 如果从 `Authority Managed Plugin` 撤销地址，则 Plugin 将默认回到 `UpdateAuthority` 权限类型。

### 谁可以撤销 Plugin？

#### Owner Managed Plugin

- Owner Managed Plugin 可以由所有者撤销，这将撤销委托并将 pluginAuthority 类型设置为 `Owner`。
- Plugin 的委托权限可以撤销自己，然后将 Plugin 权限类型设置为 `Owner`。
- 在转移时，Owner Managed Plugin 的委托权限会自动撤销并恢复为 `Owner Authority` 类型。

#### Authority Managed Plugin

- Asset 的更新权限可以撤销委托，然后将 pluginAuthority 类型设置为 `UpdateAuthority`。
- Plugin 的委托权限可以撤销自己，然后将 Plugin 权限类型设置为 `UpdateAuthority`。

可以在[Plugin 概述](/zh/smart-contracts/core/plugins)页面查看 Plugin 及其类型的列表。

{% dialect-switcher title="撤销 Plugin 权限" %}
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

所有 Owner Managed Plugin 在 Asset 转移时，其委托权限将被撤销并设置回 `Owner` 权限类型。

这包括：

- Freeze Delegate
- Transfer Delegate
- Burn Delegate

## 使插件数据不可变

通过将 Plugin 的权限更新为 `None` 值，可以有效地使 Plugin 数据不可变。

{% callout type="warning" %}

**警告** - 这样做将使您的 Plugin 数据不可变。请谨慎操作！

{% /callout %}

{% dialect-switcher title="使 Plugin 不可变" %}
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

您没有权限委托或撤销此 Plugin。只有当前权限可以委托；只有所有者/权限可以撤销。

### `Plugin not found`

Asset/Collection 没有附加此 Plugin 类型。

### `Cannot revoke None authority`

具有 `None` 权限的 Plugin 是不可变的。没有权限可以撤销。

## 注意事项

- 委托转移控制权但不移除原始权限的撤销能力
- 将权限设置为 `None` 是永久且不可逆的
- Owner Managed Plugin 在 Asset 转移到新所有者时自动撤销
- 撤销将权限返回到默认类型（Owner 或 UpdateAuthority）

## 快速参考

### 按 Plugin 类型的撤销行为

| Plugin 类型 | 撤销后变为 |
|-------------|------------|
| Owner Managed | `Owner` 权限 |
| Authority Managed | `UpdateAuthority` |

### 谁可以委托/撤销

| 操作 | Owner Managed | Authority Managed |
|--------|---------------|-------------------|
| 委托 | 所有者 | 更新权限 |
| 撤销 | 所有者或委托人 | 更新权限或委托人 |

## 常见问题

### 撤销和移除 Plugin 有什么区别？

撤销只是更改谁控制 Plugin——Plugin 及其数据保持不变。移除会完全删除 Plugin。

### 可以委托给多个地址吗？

不可以。每个 Plugin 一次只有一个权限。委托给新地址会替换之前的权限。

### 转移 Asset 时委托的 Plugin 会发生什么？

Owner Managed Plugin 自动撤销回 `Owner` 权限。Authority Managed Plugin 保持不变。

### 可以撤销将权限设置为 None 吗？

不可以。将权限设置为 `None` 使 Plugin 永久不可变。这不能被撤销。

### 委托人可以撤销自己吗？

可以。委托权限可以撤销自己的访问权限，这将控制权返回给默认权限类型。

## 相关操作

- [添加 Plugin](/zh/smart-contracts/core/plugins/adding-plugins) - 向 Asset/Collection 添加 Plugin
- [移除 Plugin](/zh/smart-contracts/core/plugins/removing-plugins) - 完全删除 Plugin
- [更新 Plugin](/zh/smart-contracts/core/plugins/update-plugins) - 修改 Plugin 数据
- [Plugin 概述](/zh/smart-contracts/core/plugins) - 可用 Plugin 的完整列表

## 术语表

| 术语 | 定义 |
|------|------------|
| **委托人** | 被授予 Plugin 临时控制权的地址 |
| **撤销** | 移除委托权限，返回默认值 |
| **None 权限** | 使 Plugin 不可变的特殊权限类型 |
| **自动撤销** | 转移时 Owner Managed Plugin 的自动撤销 |
| **Plugin 权限** | 当前拥有 Plugin 控制权的地址 |

---

*由 Metaplex Foundation 维护 · 最后验证于 2026 年 1 月 · 适用于 @metaplex-foundation/mpl-core*
