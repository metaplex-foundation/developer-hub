---
title: 更新资产
metaTitle: 更新资产 | Metaplex Core
description: 了解如何在 Solana 上更新 Core NFT 资产元数据。使用 Metaplex Core SDK 更改名称、URI、集合成员身份，并使资产不可变。
---

本指南展示如何使用 Metaplex Core SDK 在 Solana 上**更新 Core Asset 元数据**。修改您控制的资产的名称、URI 或集合成员身份。 {% .lead %}

{% callout title="您将学到" %}

- 更新资产名称和元数据 URI
- 将资产移动到不同的集合
- 使资产不可变（永久）
- 理解 Update Authority 要求

{% /callout %}

## 摘要

使用 `update` 指令更新 Core Asset 的元数据。只有 Update Authority（或授权的 delegate）可以修改资产。

- 更改 `name` 和 `uri` 以更新元数据
- 使用 `newCollection` 在集合之间移动资产
- 将 `updateAuthority` 设置为 `None` 使其不可变
- 更新是免费的（除非更改账户大小，否则无租金成本）

## 范围外

更新 Token Metadata NFT（使用 mpl-token-metadata）、插件修改（参见[插件](/zh/smart-contracts/core/plugins)）、所有权转移（参见[转移资产](/zh/smart-contracts/core/transfer)）。

## 快速开始

**跳转至：** [更新资产](#更新-core-asset) · [更改集合](#更改-core-asset-的集合) · [设为不可变](#使-core-asset-数据不可变)

1. 安装：`npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. 获取资产以获得当前状态
3. 使用新值调用 `update(umi, { asset, name, uri })`
4. 使用 `fetchAsset()` 验证更改

## 前提条件

- 配置了作为资产 Update Authority 的签名者的 **Umi**
- 要更新资产的**资产地址**
- 上传到 Arweave/IPFS 的**新元数据**（如果更改 URI）

Core Asset 的更新权限者或委托人有能力更改资产的部分数据。

{% totem %}
{% totem-accordion title="技术指令详情" %}

**指令账户列表**

| 账户               | 描述                                          |
| ------------------ | --------------------------------------------- |
| asset              | MPL Core Asset 的地址                         |
| collection         | Core Asset 所属的集合                         |
| payer              | 支付存储费用的账户                            |
| authority          | 资产的所有者或委托人                          |
| newUpdateAuthority | 资产的新 Update Authority                     |
| systemProgram      | System Program 账户                           |
| logWrapper         | SPL Noop 程序                                 |

**指令参数**

| 参数    | 描述                          |
| ------- | ----------------------------- |
| newName | Core Asset 的新名称           |
| newUri  | 新的链外元数据 URI            |

部分账户/参数可能在 SDK 中被抽象化或设为可选以便于使用。
有关链上指令的详细说明，请参阅 [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/clients/rust/src/generated/instructions/update_v1.rs#L126)

{% /totem-accordion %}
{% /totem %}

## 更新 Core Asset

以下是如何使用 SDK 更新 MPL Core Asset。

{% code-tabs-imported from="core/update-asset" frameworks="umi" /%}

## 更改 Core Asset 的集合

以下是如何使用 SDK 更改 Core Asset 的集合。

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

以下是如何使用 SDK 使 Core Asset 完全不可变。请注意，在[不可变性指南](/zh/smart-contracts/core/guides/immutability)中描述了不同级别的不可变性。

{% callout type="warning" title="重要" %}

这是一个破坏性操作，将移除更新资产的能力。

它还会将资产从其所属的任何集合中移除。要使集合资产不可变，您需要更改集合的 Update Authority。

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

您不是资产的 Update Authority。检查：

```ts
const asset = await fetchAsset(umi, assetAddress)
console.log(asset.updateAuthority) // 必须与您的签名者匹配
```

### `Collection authority required`

更改集合时，您需要同时拥有资产和目标集合的权限。

### `Asset is immutable`

资产的 Update Authority 已设置为 `None`。这无法撤销。

## 注意事项

- 更新前获取资产以确保您拥有当前状态
- 只有 Update Authority（或 delegate）可以更新资产
- 使资产不可变是**永久且不可逆的**
- 更改集合可能会影响继承的插件（版税等）
- 更新不会更改资产的所有者

## 快速参考

### 更新参数

| 参数 | 描述 |
|-----------|-------------|
| `asset` | 要更新的资产（地址或获取的对象） |
| `name` | 资产的新名称 |
| `uri` | 新的元数据 URI |
| `newCollection` | 目标集合地址 |
| `newUpdateAuthority` | 新权限（不可变则为 `None`） |

### 权限类型

| 类型 | 描述 |
|------|-------------|
| `Address` | 特定的公钥 |
| `Collection` | 集合的 Update Authority |
| `None` | 不可变 - 不允许更新 |

## 常见问题

### 可以撤销使资产不可变吗？

不可以。将 Update Authority 设置为 `None` 是永久的。资产的名称、URI 和集合成员身份将永久冻结。只有在确定时才执行此操作。

### 如何只更新名称而不更改 URI？

只传递您想更改的字段。省略 `uri` 以保持当前值：

```ts
await update(umi, { asset, name: 'New Name' }).sendAndConfirm(umi)
```

### 更新和转移有什么区别？

更新更改资产的元数据（名称、URI）。转移更改所有权。它们是具有不同权限要求的独立操作。

### delegate 可以更新资产吗？

可以，如果他们通过 [Update Delegate 插件](/zh/smart-contracts/core/plugins/update-delegate)被分配为 Update Delegate。

### 更新需要花费 SOL 吗？

除非新数据大于当前账户大小（罕见），否则更新是免费的。交易费用（约 0.000005 SOL）仍然适用。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Update Authority** | 被授权修改资产元数据的账户 |
| **Immutable** | 无法更新的资产（Update Authority 为 None） |
| **URI** | 指向链外元数据 JSON 的 URL |
| **Delegate** | 通过插件被授予特定权限的账户 |
| **Collection Membership** | 资产所属的集合 |

---

*由 Metaplex Foundation 维护 · 2026年1月最后验证 · 适用于 @metaplex-foundation/mpl-core*
