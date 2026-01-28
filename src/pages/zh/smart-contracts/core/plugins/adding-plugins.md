---
title: 添加 Plugin
metaTitle: 向 Core Asset 添加 Plugin | Metaplex Core
description: 了解如何向 Core NFT Asset 和 Collection 添加 Plugin。在创建时或之后设置 Plugin 权限和配置 Plugin 数据。
---

本指南展示如何向 Core Asset 和 Collection **添加 Plugin**。Plugin 添加版税、冻结、属性和委托权限等功能。 {% .lead %}

{% callout title="您将学到" %}

- 向现有 Asset 和 Collection 添加 Plugin
- 设置默认与自定义 Plugin 权限
- 在添加时配置 Plugin 数据
- 理解权限类型的差异

{% /callout %}

## 概要

使用 `addPlugin()` 向 Asset 添加 Plugin，或使用 `addCollectionPlugin()` 向 Collection 添加。每个 Plugin 都有默认权限类型，但您可以覆盖它。

- **Owner Managed** Plugin 默认为 `Owner` 权限
- **Authority Managed** Plugin 默认为 `UpdateAuthority`
- **Permanent** Plugin 只能在创建时添加
- 可以使用 `authority` 参数设置自定义权限

## 不在范围内

Permanent Plugin（必须在创建时添加）、Plugin 移除（参见[移除 Plugin](/zh/smart-contracts/core/plugins/removing-plugins)）和 Plugin 更新（参见[更新 Plugin](/zh/smart-contracts/core/plugins/update-plugins)）。

## 快速开始

**跳转至：** [添加到 Asset](#向-core-资产添加插件) · [添加到 Collection](#向集合添加插件) · [自定义权限](#使用指定权限添加插件)

1. 从[Plugin 概述](/zh/smart-contracts/core/plugins)选择一个 Plugin
2. 使用 Asset 地址和 Plugin 配置调用 `addPlugin()`
3. Plugin 立即生效

Plugin 可以分配给 MPL Core Asset 和 MPL Core Collection。MPL Core Asset 和 MPL Core Collection 共享相似的可用 Plugin 列表。要了解每个 Plugin 可以在哪里使用，请访问[Plugin 概述](/zh/smart-contracts/core/plugins)区域。

## 向 Core 资产添加插件

Plugin 支持为 Plugin 分配权限的功能。如果提供了 `initAuthority` 参数，这将把权限设置为所需的 Plugin 权限类型。如果未分配，将分配 Plugin 的默认权限类型（下一节）。

**创建 Plugin 辅助函数**

`createPlugin()` 辅助函数为您提供了一个类型化的方法，允许您在 `addPlugin()` 过程中分配 Plugin。
有关 Plugin 及其参数的完整列表，请参阅[Plugin 概述](/zh/smart-contracts/core/plugins)页面。

### 使用默认权限添加 Plugin

如果您在不指定 Plugin 权限的情况下向 Asset 或 Collection 添加 Plugin，权限将设置为该 Plugin 的默认权限类型。

- Owner Managed Plugin 将默认为 `Owner` Plugin 权限类型。
- Authority Managed Plugin 将默认为 `UpdateAuthority` Plugin 权限类型。
- Permanent Plugin 将默认为 `UpdateAuthority` Plugin 权限类型。

{% dialect-switcher title="使用默认权限添加 Plugin" %}
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

### 使用指定权限添加插件

有一些权限辅助函数可以帮助您设置 Plugin 的权限。

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

这将 Plugin 的权限设置为特定地址。

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

这将 Plugin 的权限设置为 `Owner` 类型。
Asset 的当前所有者将有权访问此 Plugin。

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

这将 Plugin 的权限设置为 `UpdateAuthority` 类型。
Asset 的当前更新权限将有权访问此 Plugin。

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

这将 Plugin 的权限设置为 `None` 类型。
此时 Plugin 的数据（如果有）将变为不可变。

{% dialect-switcher title="使用指定权限添加 Plugin" %}
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

## 向集合添加插件

向 Core Collection 添加 Plugin 与向 Core Asset 添加 Plugin 类似。您可以在创建时添加 Plugin，也可以使用 `addCollectionV1` 指令添加。Collection 只能访问 `Authority Plugin` 和 `Permanent Plugin`。

### 使用默认权限添加 Collection Plugin

{% dialect-switcher title="使用默认权限添加 Collection Plugin" %}
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

### 使用指定权限添加 Collection Plugin

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

您没有权限添加此 Plugin。Owner Managed Plugin 需要所有者签名；Authority Managed Plugin 需要更新权限。

### `Plugin already exists`

Asset/Collection 已经有此 Plugin 类型。使用 `updatePlugin` 来修改它。

### `Cannot add permanent plugin`

Permanent Plugin 只能在创建时添加。它们不能添加到现有的 Asset/Collection。

## 注意事项

- Owner Managed Plugin 需要**所有者签名**才能添加
- Authority Managed Plugin 需要**更新权限签名**
- Permanent Plugin 只能在**创建时**添加
- 添加 Plugin 会增加账户大小和租金

## 快速参考

### 默认权限类型

| Plugin 类型 | 默认权限 |
|-------------|-------------------|
| Owner Managed | `Owner` |
| Authority Managed | `UpdateAuthority` |
| Permanent | `UpdateAuthority` |

### 权限选项

| 权限类型 | 描述 |
|----------------|-------------|
| `Owner` | 当前 Asset 所有者 |
| `UpdateAuthority` | 当前更新权限 |
| `Address` | 特定公钥 |
| `None` | 不可变（无人可更新） |

## 常见问题

### 可以在一个交易中添加多个 Plugin 吗？

可以，在创建 Asset 时。对于现有 Asset，每个 `addPlugin` 调用是单独的交易。

### 如果将权限设置为 None 会发生什么？

Plugin 变为不可变。没有人可以更新或移除它。

### 可以作为更新权限添加 Owner Managed Plugin 吗？

不可以。Owner Managed Plugin 始终需要所有者签名才能添加，无论谁签名。

### 为什么我不能添加 Permanent Plugin？

Permanent Plugin 只能在 Asset/Collection 创建时添加。它们不能添加到现有账户。

## 相关操作

- [移除 Plugin](/zh/smart-contracts/core/plugins/removing-plugins) - 从 Asset/Collection 删除 Plugin
- [委托 Plugin](/zh/smart-contracts/core/plugins/delegating-and-revoking-plugins) - 更改 Plugin 权限
- [更新 Plugin](/zh/smart-contracts/core/plugins/update-plugins) - 修改 Plugin 数据
- [Plugin 概述](/zh/smart-contracts/core/plugins) - 可用 Plugin 的完整列表

## 术语表

| 术语 | 定义 |
|------|------------|
| **Owner Managed** | 需要所有者签名才能添加的 Plugin |
| **Authority Managed** | 更新权限可以添加的 Plugin |
| **Permanent** | 只能在创建时添加的 Plugin |
| **initAuthority** | 设置自定义 Plugin 权限的参数 |

---

*由 Metaplex Foundation 维护 · 最后验证于 2026 年 1 月 · 适用于 @metaplex-foundation/mpl-core*
