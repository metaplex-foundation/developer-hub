---
title: 更新 Asset
metaTitle: 更新 Asset | Metaplex Core
description: 学习如何在 Solana 上更新 Core NFT Asset 元数据。更改名称、URI、集合成员资格，并使用 Metaplex Core SDK 使资产不可变。
updated: '01-31-2026'
keywords:
  - update NFT
  - change metadata
  - NFT metadata
  - mpl-core update
  - immutable NFT
about:
  - NFT metadata
  - Update authority
  - Asset immutability
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
howToSteps:
  - 使用 npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi 安装 SDK
  - 获取 Asset 以获取当前状态
  - 使用新值调用 update(umi, { asset, name, uri })
  - 使用 fetchAsset() 验证更改
howToTools:
  - Node.js
  - Umi framework
  - mpl-core SDK
faqs:
  - q: 我可以撤销使 Asset 不可变吗？
    a: 不可以。将更新权限设置为 None 是永久性的。Asset 的名称、URI 和集合成员资格将永久冻结。
  - q: 如何只更新名称而不更改 URI？
    a: 只传递您想要更改的字段。省略 uri 以保持当前值。
  - q: 更新和转移有什么区别？
    a: 更新更改 Asset 的元数据（名称、URI）。转移更改所有权。它们是具有不同权限要求的独立操作。
  - q: 代理可以更新 Asset 吗？
    a: 可以，如果他们已通过 Update Delegate 插件被指定为 Update Delegate。
  - q: 更新需要花费 SOL 吗？
    a: 更新是免费的，除非新数据大于当前账户大小。交易费用（约 0.000005 SOL）仍然适用。
---
本指南展示如何使用 Metaplex Core SDK 在 Solana 上**更新 Core Asset 元数据**。修改您控制的 Asset 的名称、URI 或集合成员资格。{% .lead %}
{% callout title="您将学到" %}
- 更新 Asset 名称和元数据 URI
- 将 Asset 移动到不同的 Collection
- 使 Asset 不可变（永久）
- 了解更新权限要求
{% /callout %}
## 概要
使用 `update` 指令更新 Core Asset 的元数据。只有更新权限（或授权的代理）可以修改 Asset。
- 更改 `name` 和 `uri` 以更新元数据
- 使用 `newCollection` 在 Collection 之间移动 Asset
- 将 `updateAuthority` 设置为 `None` 以使其不可变
- 更新是免费的（无租金成本），除非更改账户大小
## 超出范围
更新 Token Metadata NFT（使用 mpl-token-metadata）、插件修改（参见[插件](/smart-contracts/core/plugins)）和所有权转移（参见[转移 Asset](/smart-contracts/core/transfer)）。
## 快速开始
**跳转至：** [更新 Asset](#updating-a-core-asset) · [更改 Collection](#change-the-collection-of-a-core-asset) · [使其不可变](#making-a-core-asset-data-immutable)
1. 安装：`npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. 获取 Asset 以获取当前状态
3. 使用新值调用 `update(umi, { asset, name, uri })`
4. 使用 `fetchAsset()` 验证更改
## 前置条件
- 配置了作为 Asset 更新权限的签名者的 **Umi**
- 要更新的 Asset 的 **Asset 地址**
- 上传到 Arweave/IPFS 的**新元数据**（如果更改 URI）
Core Asset 的更新权限或代理有能力更改 Asset 的某些数据。
{% totem %}
{% totem-accordion title="技术指令详情" %}
**指令账户列表**
| 账户               | 描述                                  |
| ------------------ | ------------------------------------- |
| asset              | MPL Core Asset 的地址。              |
| collection         | Core Asset 所属的集合。              |
| payer              | 支付存储费用的账户。                  |
| authority          | Asset 的所有者或代理。               |
| newUpdateAuthority | Asset 的新更新权限。                 |
| systemProgram      | System Program 账户。                |
| logWrapper         | SPL Noop Program。                   |
**指令参数**
| 参数    | 描述                           |
| ------- | ------------------------------ |
| newName | Core Asset 的新名称。          |
| newUri  | 新的链下元数据 URI。           |
在我们的 SDK 中，某些账户/参数可能会被抽象或为可选，以便于使用。
有关链上指令的完整详细信息，可以在此处查看。[Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/clients/rust/src/generated/instructions/update_v1.rs#L126)
{% /totem-accordion %}
{% /totem %}
## 更新 Core Asset
以下是如何使用我们的 SDK 更新 MPL Core Asset。
{% code-tabs-imported from="core/update-asset" frameworks="umi" /%}
## 更改 Core Asset 的 Collection
以下是如何使用我们的 SDK 更改 Core Asset 的集合。
{% dialect-switcher title="更改 Core Asset 的集合" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from "@metaplex-foundation/umi";
import {
  update,
  fetchAsset,
  fetchCollection,
  collectionAddress,
  updateAuthority
} from "@metaplex-foundation/mpl-core";
const assetId = publicKey("11111111111111111111111111111111");
const asset = await fetchAsset(umi, assetId);
const collectionId = collectionAddress(asset)
if (!collectionId) {
  console.log("Collection not found");
  return;
}
const collection = await fetchCollection(umi, collectionId);
const newCollectionId = publicKey("22222222222222222222222222222222")
const updateTx = await update(umi, {
  asset,
  collection,
  newCollection: newCollectionId,
  newUpdateAuthority: updateAuthority('Collection', [newCollectionId]),
}).sendAndConfirm(umi);
```
{% /dialect %}
{% /dialect-switcher %}
## 使 Core Asset 数据不可变
以下是如何使用我们的 SDK 使 Core Asset 完全不可变。请注意，[不可变性指南](/smart-contracts/core/guides/immutability)中描述了不同级别的不可变性。
{% callout type="warning" title="重要" %}
这是一个破坏性操作，将移除更新资产的能力。
它还将从任何集合中移除资产。要使集合资产不可变，您需要更改集合的更新权限。
{% /callout %}
{% dialect-switcher title="使 Core Asset 不可变" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { update, fetchAsset } from '@metaplex-foundation/mpl-core'
const assetId = publicKey('11111111111111111111111111111111')
const asset = await fetchAsset(umi, asset)
await update(umi, {
  asset: asset,
  newUpdateAuthority: updateAuthority('None'),
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{instructions::UpdateV1Builder, types::UpdateAuthority};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn update_asset_data_to_immutable() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let update_asset_ix = UpdateV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .new_update_authority(UpdateAuthority::None)
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let update_asset_tx = Transaction::new_signed_with_payer(
        &[update_asset_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&update_asset_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## 常见错误
### `Authority mismatch`
您不是 Asset 的更新权限。检查：
```ts
const asset = await fetchAsset(umi, assetAddress)
console.log(asset.updateAuthority) // 必须与您的签名者匹配
```
### `Collection authority required`
更改 Collection 时，您需要同时拥有 Asset 和目标 Collection 的权限。
### `Asset is immutable`
Asset 的更新权限设置为 `None`。这无法撤销。
## 注意事项
- 更新前获取 Asset 以确保您拥有当前状态
- 只有更新权限（或代理）可以更新 Asset
- 使 Asset 不可变是**永久且不可逆的**
- 更改 Collection 可能会影响继承的插件（版税等）
- 更新不会更改 Asset 的所有者
## 快速参考
### 更新参数
| 参数 | 描述 |
|------|------|
| `asset` | 要更新的 Asset（地址或获取的对象） |
| `name` | Asset 的新名称 |
| `uri` | 新的元数据 URI |
| `newCollection` | 目标 Collection 地址 |
| `newUpdateAuthority` | 新权限（或 `None` 表示不可变） |
### 权限类型
| 类型 | 描述 |
|------|------|
| `Address` | 特定的公钥 |
| `Collection` | Collection 的更新权限 |
| `None` | 不可变 - 不允许更新 |
## 常见问题
### 我可以撤销使 Asset 不可变吗？
不可以。将更新权限设置为 `None` 是永久性的。Asset 的名称、URI 和集合成员资格将永久冻结。只有在您确定时才这样做。
### 如何只更新名称而不更改 URI？
只传递您想要更改的字段。省略 `uri` 以保持当前值：
```ts
await update(umi, { asset, name: 'New Name' }).sendAndConfirm(umi)
```
### 更新和转移有什么区别？
更新更改 Asset 的元数据（名称、URI）。转移更改所有权。它们是具有不同权限要求的独立操作。
### 代理可以更新 Asset 吗？
可以，如果他们已通过 [Update Delegate 插件](/smart-contracts/core/plugins/update-delegate)被指定为 Update Delegate。
### 更新需要花费 SOL 吗？
更新是免费的，除非新数据大于当前账户大小（罕见）。交易费用（约 0.000005 SOL）仍然适用。
## 术语表
| 术语 | 定义 |
|------|------|
| **Update Authority** | 被授权修改 Asset 元数据的账户 |
| **Immutable** | 无法更新的 Asset（更新权限为 None） |
| **URI** | 指向链下元数据 JSON 的 URL |
| **Delegate** | 通过插件被授予特定权限的账户 |
| **Collection Membership** | Asset 所属的 Collection |
