---
title: 更新委托插件
metaTitle: 更新委托插件 | Metaplex Core
description: 为 Core NFT 资产和集合向第三方委托更新权限。允许他人在不转移所有权的情况下修改元数据。
---

**更新委托插件**允许您向额外的地址授予更新权限。当第三方需要修改资产元数据而不成为主要更新权限时很有用。{% .lead %}

{% callout title="您将学到" %}

- 向资产和集合添加更新委托插件
- 向额外地址授予更新权限
- 了解额外委托可以做什么和不能做什么
- 更新和管理委托列表

{% /callout %}

## 摘要

**更新委托**是一个权限管理插件，允许更新权限向其他地址授予更新权限。额外委托可以修改大多数资产数据，但不能更改核心权限设置。

- 向第三方授予更新权限
- 添加多个额外委托
- 适用于资产和集合
- 委托不能修改根更新权限

## 范围外

永久更新委托、所有者级别权限（这是权限管理的）和 Token Metadata 更新权限（不同系统）。

## 快速开始

**跳转到:** [添加到资产](#向资产添加更新委托插件) · [更新委托](#更新更新委托插件) · [集合](#更新集合上的更新委托插件)

1. 添加更新委托插件并指定委托地址
2. 可选择添加额外委托
3. 委托现在可以更新资产元数据

{% callout type="note" title="何时使用更新委托" %}

| 场景 | 解决方案 |
|------|----------|
| 第三方需要更新元数据 | ✅ 更新委托 |
| 游戏程序需要修改属性 | ✅ 更新委托（委托给程序） |
| 多个团队成员需要更新访问权限 | ✅ 额外委托 |
| 永久不可撤销的更新访问权限 | ❌ 不支持（使用多签权限） |
| 所有者应控制更新 | ❌ 使用默认权限 |

当您需要向程序或第三方授予更新权限而不转移根权限时，使用**更新委托**。

{% /callout %}

## 常见用例

- **第三方服务**: 允许平台代表您更新元数据
- **游戏程序**: 授予游戏程序修改资产属性的权限
- **团队协作**: 多个团队成员无需共享密钥即可更新
- **市场**: 允许市场更新挂单相关元数据
- **动态内容**: 自动更新资产数据的服务

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

额外委托允许您向 updateDelegate 插件添加多个委托。

额外委托可以执行更新权限可以执行的所有操作，除了：
- 添加或更改额外委托数组（除了移除自己）
- 更改 updateAuthority 插件的插件权限
- 更改集合的根更新权限

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

更新委托插件可以更新以修改额外委托列表或更改插件权限。

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

## 常见错误

### `Authority mismatch`

只有更新权限（或现有插件权限）可以添加/修改更新委托插件。

### `Cannot modify root authority`

额外委托不能更改根更新权限或修改额外委托列表（除了移除自己）。

## 注意事项

- 权限管理：更新权限可以无需所有者签名即可添加
- 额外委托拥有几乎完整的更新权限
- 委托不能更改根更新权限
- 委托不能修改额外委托列表（除了移除自己）
- 适用于资产和集合

## 快速参考

### 额外委托权限

| 操作 | 允许？ |
|------|--------|
| 更新名称/URI | ✅ |
| 添加插件 | ✅ |
| 更新插件 | ✅ |
| 移除插件 | ✅ |
| 更改根更新权限 | ❌ |
| 修改额外委托 | ❌（除了自我移除） |
| 更改插件权限 | ❌ |

## 常见问题

### 额外委托可以做什么？

几乎更新权限可以做的所有事情：更新元数据、添加/移除插件等。他们不能更改根更新权限、修改额外委托列表或更改更新委托插件权限。

### 额外委托可以添加更多委托吗？

不可以。只有根更新权限（或插件权限）可以添加或移除额外委托。

### 如何将自己从额外委托中移除？

额外委托可以通过更新插件时不在 `additionalDelegates` 数组中包含自己的地址来将自己从列表中移除。

### 额外委托有数量限制吗？

没有硬性限制，但更多委托会增加账户大小和租金。保持列表合理。

### 更新委托对集合有效吗？

是的。向集合添加更新委托允许委托更新集合元数据和集合级别插件。

## 相关插件

- [属性](/zh/smart-contracts/core/plugins/attribute) - 存储委托可以更新的链上数据
- [不可变元数据](/zh/smart-contracts/core/plugins/immutableMetadata) - 使元数据不可更改（覆盖委托）
- [添加阻止器](/zh/smart-contracts/core/plugins/addBlocker) - 阻止委托添加新插件

## 术语表

| 术语 | 定义 |
|------|------|
| **更新委托** | 用于授予更新权限的权限管理插件 |
| **额外委托** | 拥有更新权限的额外地址 |
| **权限管理** | 由更新权限控制的插件类型 |
| **根更新权限** | 资产/集合的主要更新权限 |

---

*由 Metaplex Foundation 维护 · 2026年1月最后验证 · 适用于 @metaplex-foundation/mpl-core*
