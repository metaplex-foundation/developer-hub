---
title: Update Delegate 插件
metaTitle: Update Delegate 插件 | Metaplex Core
description: 将 Core NFT Asset 和 Collection 的更新权限委托给第三方。允许其他人在不转移所有权的情况下修改元数据。
updated: '01-31-2026'
keywords:
  - update delegate
  - delegate update authority
  - metadata permissions
  - third-party updates
about:
  - Update delegation
  - Metadata permissions
  - Authority management
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 附加委托方可以做什么？
    a: 几乎所有更新权限可以做的事情 - 更新元数据、添加/删除插件等。他们不能更改根更新权限、修改附加委托方列表或更改 Update Delegate 插件权限。
  - q: 附加委托方可以添加更多委托方吗？
    a: 不可以。只有根更新权限（或插件权限）可以添加或删除附加委托方。
  - q: 如何将自己从附加委托方中移除？
    a: 附加委托方可以通过更新插件时不在 additionalDelegates 数组中包含自己的地址来将自己从列表中移除。
  - q: 附加委托方有数量限制吗？
    a: 没有硬性限制，但更多委托方会增加账户大小和租金。请保持列表合理。
  - q: Update Delegate 在 Collection 上有效吗？
    a: 是的。向 Collection 添加 Update Delegate 允许委托方更新 Collection 元数据和 Collection 级别的插件。
---
**Update Delegate 插件**允许您向附加地址授予更新权限。当第三方需要修改 Asset 元数据而不是主要更新权限时很有用。 {% .lead %}
{% callout title="您将学到" %}
- 向 Asset 和 Collection 添加 Update Delegate 插件
- 向附加地址授予更新权限
- 了解附加委托方可以和不可以做什么
- 更新和管理委托方列表
{% /callout %}
## 摘要
**Update Delegate** 是一个权限管理插件，允许更新权限向其他地址授予更新权限。附加委托方可以修改大多数 Asset 数据，但不能更改核心权限设置。
- 向第三方授予更新权限
- 添加多个附加委托方
- 适用于 Asset 和 Collection
- 委托方不能修改根更新权限
## 范围外
永久更新委托、所有者级别权限（这是权限管理的）和 Token Metadata 更新权限（不同系统）不在范围内。
## 快速开始
**跳转到：** [添加到 Asset](#向-asset-添加-update-delegate-插件) · [更新委托方](#更新-update-delegate-插件) · [Collection](#更新-collection-上的-update-delegate-插件)
1. 使用委托地址添加 Update Delegate 插件
2. 可选添加附加委托方
3. 委托方现在可以更新 Asset 元数据
{% callout type="note" title="何时使用 Update Delegate" %}
| 场景 | 解决方案 |
|----------|----------|
| 第三方需要更新元数据 | ✅ Update Delegate |
| 游戏程序需要修改属性 | ✅ Update Delegate（委托给程序） |
| 多个团队成员需要更新访问权限 | ✅ 附加委托方 |
| 永久不可撤销的更新访问权限 | ❌ 不支持（使用多签权限） |
| 所有者应控制更新 | ❌ 使用默认权限 |
**使用 Update Delegate** 当您需要向程序或第三方授予更新权限而不转移根权限时。
{% /callout %}
## 常见用例
- **第三方服务**：允许平台代您更新元数据
- **游戏程序**：授予您的游戏程序修改 Asset 属性的权限
- **团队协作**：多个团队成员可以更新而无需共享密钥
- **市场**：允许市场更新与挂单相关的元数据
- **动态内容**：自动更新 Asset 数据的服务
## 兼容性
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |
## 参数
|                     |             |
| ------------------- | ----------- |
| additionalDelegates | publickey[] |
### additionalDelegates
附加委托方允许您向 updateDelegate 插件添加多个委托方。
附加委托方可以做更新权限能做的一切，除了：
- 添加或更改附加委托方数组（除了移除自己）。
- 更改 updateAuthority 插件的插件权限。
- 更改 Collection 的根更新权限。
## 向 Asset 添加 Update Delegate 插件
{% dialect-switcher title="向 MPL Core Asset 添加 Update Delegate 插件" %}
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
## 更新 Update Delegate 插件
Update Delegate 插件可以更新以修改附加委托方列表或更改插件权限。
{% dialect-switcher title="更新 Asset 上的 Update Delegate 插件" %}
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
    additionalDelegates: [existingDelegate, newDelegate], // 添加或删除委托方
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
            additional_delegates: vec![existing_delegate, new_delegate], // 添加或删除委托方
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
## 更新 Collection 上的 Update Delegate 插件
{% dialect-switcher title="更新 Collection 上的 Update Delegate 插件" %}
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
    additionalDelegates: [delegate1, delegate2], // 更新后的委托方列表
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
            additional_delegates: vec![delegate1, delegate2], // 更新后的委托方列表
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
只有更新权限（或现有插件权限）可以添加/修改 Update Delegate 插件。
### `Cannot modify root authority`
附加委托方不能更改根更新权限或修改附加委托方列表（除了移除自己）。
## 注意事项
- 权限管理：更新权限可以在没有所有者签名的情况下添加
- 附加委托方拥有几乎完整的更新权限
- 委托方不能更改根更新权限
- 委托方不能修改附加委托方列表（除了移除自己）
- 适用于 Asset 和 Collection
## 快速参考
### 附加委托方权限
| 操作 | 允许？ |
|--------|----------|
| 更新名称/URI | ✅ |
| 添加插件 | ✅ |
| 更新插件 | ✅ |
| 删除插件 | ✅ |
| 更改根更新权限 | ❌ |
| 修改附加委托方 | ❌（除了自我移除） |
| 更改插件权限 | ❌ |
## 常见问题
### 附加委托方可以做什么？
几乎所有更新权限可以做的事情：更新元数据、添加/删除插件等。他们不能更改根更新权限、修改附加委托方列表或更改 Update Delegate 插件权限。
### 附加委托方可以添加更多委托方吗？
不可以。只有根更新权限（或插件权限）可以添加或删除附加委托方。
### 如何将自己从附加委托方中移除？
附加委托方可以通过更新插件时不在 `additionalDelegates` 数组中包含自己的地址来将自己从列表中移除。
### 附加委托方有数量限制吗？
没有硬性限制，但更多委托方会增加账户大小和租金。请保持列表合理。
### Update Delegate 在 Collection 上有效吗？
是的。向 Collection 添加 Update Delegate 允许委托方更新 Collection 元数据和 Collection 级别的插件。
## 相关插件
- [Attributes](/smart-contracts/core/plugins/attribute) - 存储委托方可以更新的链上数据
- [ImmutableMetadata](/smart-contracts/core/plugins/immutableMetadata) - 使元数据不可更改（覆盖委托方）
- [AddBlocker](/smart-contracts/core/plugins/addBlocker) - 防止委托方添加新插件
## 术语表
| 术语 | 定义 |
|------|------------|
| **Update Delegate** | 用于授予更新权限的权限管理插件 |
| **附加委托方** | 具有更新权限的额外地址 |
| **权限管理** | 由更新权限控制的插件类型 |
| **根更新权限** | Asset/Collection 的主要更新权限 |
