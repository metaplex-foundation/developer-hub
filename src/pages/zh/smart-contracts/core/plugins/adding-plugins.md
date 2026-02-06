---
title: 添加插件
metaTitle: 向 Core Asset 添加插件 | Metaplex Core
description: 了解如何向 Core NFT Asset 和 Collection 添加插件。设置插件权限并在创建时或之后配置插件数据。
updated: '01-31-2026'
keywords:
  - add plugin
  - addPlugin
  - plugin authority
  - configure plugin
about:
  - Adding plugins
  - Plugin configuration
  - Authority management
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 可以在一个交易中添加多个插件吗？
    a: 可以，在创建 Asset 时。对于现有 Asset，每个 addPlugin 调用是单独的交易。
  - q: 如果将权限设置为 None 会怎样？
    a: 插件变为不可变。没有人可以更新或删除它。
  - q: 可以作为 update authority 添加 Owner Managed 插件吗？
    a: 不可以。Owner Managed 插件始终需要所有者的签名，无论谁签名。
  - q: 为什么无法添加 Permanent 插件？
    a: Permanent 插件只能在 Asset/Collection 创建时添加。无法添加到现有账户。
---
本指南展示如何向 Core Asset 和 Collection **添加插件**。插件添加版税、冻结、属性和委托权限等功能。 {% .lead %}
{% callout title="您将学到" %}
- 向现有 Asset 和 Collection 添加插件
- 设置默认和自定义插件权限
- 在添加时配置插件数据
- 了解权限类型差异
{% /callout %}
## 摘要
使用 `addPlugin()` 向 Asset 添加插件，或使用 `addCollectionPlugin()` 向 Collection 添加。每个插件都有默认权限类型，但您可以覆盖它。
- **Owner Managed** 插件默认为 `Owner` 权限
- **Authority Managed** 插件默认为 `UpdateAuthority`
- **Permanent** 插件只能在创建时添加
- 可以使用 `authority` 参数设置自定义权限
## 范围外
Permanent 插件（必须在创建时添加）、插件删除（参见[移除插件](/zh/smart-contracts/core/plugins/removing-plugins)）和插件更新（参见[更新插件](/zh/smart-contracts/core/plugins/update-plugins)）。
## 快速开始
**跳转至：** [添加到 Asset](#向-core-asset-添加插件) · [添加到 Collection](#向-collection-添加插件) · [自定义权限](#指定权限添加插件)
1. 从[插件概述](/zh/smart-contracts/core/plugins)选择插件
2. 使用 Asset 地址和插件配置调用 `addPlugin()`
3. 发送交易
4. 交易确认后插件激活
插件可以分配给 MPL Core Asset 和 MPL Core Collection。MPL Core Asset 和 MPL Core Collection 共享类似的可用插件列表。要了解每个插件可以在哪里使用，请访问[插件概述](/zh/smart-contracts/core/plugins)区域。
## 向 Core Asset 添加插件
插件支持为插件分配权限的功能。如果提供了 `initAuthority` 参数，这将把权限设置为所需的插件权限类型。如果未指定，将分配插件的默认权限类型（下一节）。
**createPlugin 助手**
`createPlugin()` 助手提供了一个类型化方法，允许您在 `addPlugin()` 过程中分配插件。
有关插件及其参数的完整列表，请参阅[插件概述](/zh/smart-contracts/core/plugins)页面。
### 使用默认权限添加插件
如果您在不指定插件权限的情况下向 Asset 或 Collection 添加插件，权限将设置为该插件的默认权限类型。
- Owner Managed 插件默认为 `Owner` 类型的插件权限。
- Authority Managed 插件默认为 `UpdateAuthority` 类型的插件权限。
- Permanent 插件默认为 `UpdateAuthority` 类型的插件权限。
{% dialect-switcher title="使用默认权限添加插件" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin } from '@metaplex-foundation/mpl-core'
const assetId = publicKey('11111111111111111111111111111111')
await addPlugin(umi, {
  asset: assetId,
  plugin: {
    type: 'Attributes',
    attributeList: [{ key: 'key', value: 'value' }],
  },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{FreezeDelegate, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn add_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let add_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let add_plugin_tx = Transaction::new_signed_with_payer(
        &[add_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&add_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
### 指定权限添加插件
有几个权限助手可帮助您设置插件权限。
**Address**
```js
await addPlugin(umi, {
    ...
    plugin: {
      ...
      authority: {
        type: 'Address',
        address: publicKey('22222222222222222222222222222222'),
      },
    },
  }).sendAndConfirm(umi);
```
这将插件的权限设置为特定地址。
**Owner**
```js
await addPlugin(umi, {
    ...
    plugin: {
      ...
      authority: {
        type: 'Owner'
      },
    },
  }).sendAndConfirm(umi);
```
这将插件的权限设置为 `Owner` 类型。
Asset 的当前所有者将可以访问此插件。
**UpdateAuthority**
```js
await addPlugin(umi, {
    ...
    plugin: {
      ...
      authority: {
        type: "UpdateAuthority",
      },
    },
  }).sendAndConfirm(umi);
```
这将插件的权限设置为 `UpdateAuthority` 类型。
Asset 的当前 update authority 将可以访问此插件。
**None**
```js
await addPlugin(umi, {
    ...
    plugin: {
      ...
      authority: {
        type: "None",
      },
    },
  }).sendAndConfirm(umi);
```
这将插件的权限设置为 `None` 类型。
如果插件有数据，此时将变为不可变。
{% dialect-switcher title="指定权限添加插件" %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{FreezeDelegate, Plugin, PluginAuthority},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn add_plugin_with_authority() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let plugin_authority = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let add_plugin_with_authority_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
        .init_authority(PluginAuthority::Address {
            address: plugin_authority,
        })
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let add_plugin_with_authority_tx = Transaction::new_signed_with_payer(
        &[add_plugin_with_authority_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&add_plugin_with_authority_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  addPlugin,
} from '@metaplex-foundation/mpl-core'
const asset = publicKey("11111111111111111111111111111111")
const delegate = publicKey('222222222222222222222222222222')
await addPlugin(umi, {
    asset: asset.publicKey,
    plugin: {
      type: 'Attributes',
      attributeList: [{ key: 'key', value: 'value' }],
      authority: {
        type: 'Address',
        address: delegate,
      },
    },
  }).sendAndConfirm(umi);
```
{% /dialect %}
{% /dialect-switcher %}
## 向 Collection 添加插件
向 Core Collection 添加插件与向 Core Asset 添加类似。您可以在创建期间添加插件，也可以使用 `addCollectionV1` 指令添加。Collection 只能访问 `Authority Plugins` 和 `Permanent Plugins`。
### 使用默认权限添加 Collection 插件
{% dialect-switcher title="使用默认权限添加 Collection 插件" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addCollectionPlugin, ruleSet } from '@metaplex-foundation/mpl-core'
const collection = publicKey('11111111111111111111111111111111')
const creator = publicKey('22222222222222222222222222222222')
await addCollectionPlugin(umi, {
  collection: collection,
  plugin: {
    type: 'Royalties',
    data: {
      basisPoints: 5000,
      creators: [
        {
          address: creator,
          percentage: 100,
        },
      ],
      ruleSet: ruleSet('None'),
    },
  },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{
    instructions::AddCollectionPluginV1Builder,
    types::{FreezeDelegate, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn add_plugin_to_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let add_plugin_to_collection_ix = AddCollectionPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let add_plugin_to_collection_tx = Transaction::new_signed_with_payer(
        &[add_plugin_to_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&add_plugin_to_collection_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
### 指定权限添加 Collection 插件
{% dialect-switcher title="销毁 Asset" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  addCollectionPlugin,
  ruleSet,
} from '@metaplex-foundation/mpl-core'
const collection = publicKey('11111111111111111111111111111111')
const delegate = publicKey('22222222222222222222222222222222')
await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'Attributes',
    attributeList: [{ key: 'key', value: 'value' }],
    authority: {
      type: 'Address',
      address: delegate,
    },
  },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{
    instructions::AddCollectionPluginV1Builder,
    types::{FreezeDelegate, Plugin, PluginAuthority},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn add_plugin_to_collection_with_authority() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let plugin_authority = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let add_plugin_to_collection_with_authority_ix = AddCollectionPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
        .init_authority(PluginAuthority::Address {
            address: plugin_authority,
        })
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let add_plugin_to_collection_with_authority_tx = Transaction::new_signed_with_payer(
        &[add_plugin_to_collection_with_authority_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&add_plugin_to_collection_with_authority_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## 常见错误
### `Authority mismatch`
您没有权限添加此插件。Owner Managed 插件需要所有者签名；Authority Managed 插件需要 update authority。
### `Plugin already exists`
Asset/Collection 已有此插件类型。请改用 `updatePlugin` 进行修改。
### `Cannot add permanent plugin`
Permanent 插件只能在创建时添加。无法添加到现有 Asset/Collection。
## 注意事项
- Owner Managed 插件需要**所有者签名**才能添加
- Authority Managed 插件需要 **update authority 签名**
- Permanent 插件只能在**创建时**添加
- 添加插件会增加账户大小和租金
## 快速参考
### 默认权限类型
| 插件类型 | 默认权限 |
|-------------|-------------------|
| Owner Managed | `Owner` |
| Authority Managed | `UpdateAuthority` |
| Permanent | `UpdateAuthority` |
### 权限选项
| 权限类型 | 描述 |
|----------------|-------------|
| `Owner` | 当前 Asset 所有者 |
| `UpdateAuthority` | 当前 update authority |
| `Address` | 特定公钥 |
| `None` | 不可变（无人可更新） |
## FAQ
### 可以在一个交易中添加多个插件吗？
可以，在创建 Asset 时。对于现有 Asset，每个 `addPlugin` 调用是单独的指令。可以将多个指令组合到一个交易中。
### 如果将权限设置为 None 会怎样？
插件变为不可变。没有人可以更新或删除它。
### 可以作为 update authority 添加 Owner Managed 插件吗？
不可以。Owner Managed 插件始终需要所有者的签名，无论谁签名。
### 为什么无法添加 Permanent 插件？
Permanent 插件只能在 Asset/Collection 创建时添加。无法添加到现有账户。
## 相关操作
- [移除插件](/zh/smart-contracts/core/plugins/removing-plugins) - 从 Asset/Collection 删除插件
- [委托插件](/zh/smart-contracts/core/plugins/delegating-and-revoking-plugins) - 更改插件权限
- [更新插件](/zh/smart-contracts/core/plugins/update-plugins) - 修改插件数据
- [插件概述](/zh/smart-contracts/core/plugins) - 可用插件的完整列表
## 术语表
| 术语 | 定义 |
|------|------------|
| **Owner Managed** | 需要所有者签名才能添加的插件 |
| **Authority Managed** | update authority 可以添加的插件 |
| **Permanent** | 只能在创建时添加的插件 |
| **initAuthority** | 用于设置自定义插件权限的参数 |
