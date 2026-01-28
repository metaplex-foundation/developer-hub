---
title: 销毁资产
metaTitle: 销毁资产 | Metaplex Core
description: 了解如何在 Solana 上销毁 Core NFT 资产。使用 Metaplex Core SDK 永久销毁资产并回收租金。
---

本指南展示如何使用 Metaplex Core SDK 在 Solana 上**销毁 Core 资产**。永久销毁资产并回收大部分租金押金。 {% .lead %}

{% callout title="您将学到" %}

- 销毁资产并回收租金
- 处理集合内资产的销毁
- 理解销毁委托权限
- 了解销毁后账户的状态

{% /callout %}

## 摘要

销毁 Core 资产以永久销毁它并回收租金。只有所有者（或销毁委托）可以销毁资产。

- 调用 `burn(umi, { asset })` 销毁资产
- 大部分租金（约 0.0028 SOL）返还给付款人
- 少量（约 0.0009 SOL）保留以防止账户重用
- 销毁是**永久且不可逆的**

## 不涉及的内容

Token Metadata 销毁（使用 mpl-token-metadata）、压缩 NFT 销毁（使用 Bubblegum）和集合销毁（集合有自己的销毁流程）。

## 快速入门

**跳转到：** [销毁资产](#代码示例) · [集合内销毁](#销毁属于集合的资产)

1. 安装：`npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. 获取资产以验证所有权
3. 作为所有者调用 `burn(umi, { asset })`
4. 租金自动返还到您的钱包

## 前提条件

- 配置了拥有资产（或是其销毁委托）的签名者的 **Umi**
- 要销毁的资产的**资产地址**
- **集合地址**（如果资产在集合中）

可以使用 `burn` 指令销毁资产。这将把租金豁免费用返还给所有者。只有极少量的 SOL（0.00089784）会留在账户中，以防止其被重新打开。

{% totem %}
{% totem-accordion title="技术指令详情" %}
**指令账户列表**

| 账户 | 描述 |
| ------------- | ----------------------------------------------- |
| asset | MPL Core 资产的地址 |
| collection | Core 资产所属的集合 |
| payer | 支付存储费用的账户 |
| authority | 资产的所有者或委托 |
| systemProgram | System Program 账户 |
| logWrapper | SPL Noop Program |

某些账户可能在我们的 SDK 中被抽象化以便于使用。
有关链上指令的完整详细信息，请参阅 [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L123)。
{% /totem-accordion %}
{% /totem %}

## 代码示例

以下是如何使用我们的 SDK 销毁 Core 资产。此代码片段假设您是资产的所有者。

{% code-tabs-imported from="core/burn-asset" frameworks="umi" /%}

## 销毁属于集合的资产

以下是如何使用我们的 SDK 销毁属于集合的 Core 资产。此代码片段假设您是资产的所有者。

{% dialect-switcher title="销毁属于集合的资产" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { burnV1, fetchAsset } from '@metaplex-foundation/mpl-core'

import { publicKey } from '@metaplex-foundation/umi'
import {
  burn,
  fetchAsset,
  collectionAddress,
  fetchCollection,
} from '@metaplex-foundation/mpl-core'

const assetId = publicKey('11111111111111111111111111111111')
const asset = await fetchAsset(umi, assetId)

const collectionId = collectionAddress(asset)

let collection = undefined

if (collectionId) {
  collection = await fetchCollection(umi, collection)
}

await burn(umi, {
  asset: asset,
  collection: collection,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::instructions::BurnV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn burn_asset_in_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let collection = Pubkey::from_str("2222222222222222222222222222222").unwrap();

    let burn_asset_in_collection_ix = BurnV1Builder::new()
        .asset(asset)
        .collection(Some(collection))
        .payer(authority.pubkey())
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let burn_asset_in_collection_tx = Transaction::new_signed_with_payer(
        &[burn_asset_in_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&burn_asset_in_collection_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## 常见错误

### `Authority mismatch`

您不是资产的所有者或销毁委托。检查所有权：

```ts
const asset = await fetchAsset(umi, assetAddress)
console.log(asset.owner) // 必须与您的签名者匹配
```

### `Asset is frozen`

资产有冻结委托插件且当前被冻结。冻结权限者必须在销毁前解冻它。

### `Missing collection parameter`

对于集合中的资产，您必须传递 `collection` 地址。先获取资产以获得集合：

```ts
const asset = await fetchAsset(umi, assetAddress)
const collectionId = collectionAddress(asset)
```

## 注意事项

- 销毁是**永久且不可逆的** - 资产无法恢复
- 约 0.0028 SOL 从租金中返还，但约 0.0009 SOL 保留在账户中
- 剩余的 SOL 防止账户地址被重用
- 销毁委托可以代表所有者销毁（通过销毁委托插件）
- 冻结的资产必须在销毁前解冻

## 快速参考

### 销毁参数

| 参数 | 必需 | 描述 |
|-----------|----------|-------------|
| `asset` | 是 | 资产地址或获取的对象 |
| `collection` | 如果在集合中 | 集合地址 |
| `authority` | 否 | 默认为签名者（用于委托） |

### 谁可以销毁？

| 权限 | 可以销毁？ |
|-----------|-----------|
| 资产所有者 | 是 |
| 销毁委托 | 是 |
| 转移委托 | 否 |
| 更新权限者 | 否 |

### 租金回收

| 项目 | 金额 |
|------|--------|
| 返还给付款人 | 约 0.0028 SOL |
| 保留在账户中 | 约 0.0009 SOL |
| **原始租金总计** | **约 0.0029 SOL** |

## 常见问题

### 我能回收账户中剩余的约 0.0009 SOL 吗？

不能。这笔小额资金是故意留下的，用于将账户标记为"已销毁"并防止其地址被用于新资产。

### 销毁后资产的元数据会怎样？

链上账户被清空（归零）。链下元数据（在 Arweave/IPFS 上）仍可通过原始 URI 访问，但没有链上记录与之关联。

### 销毁委托可以在没有所有者批准的情况下销毁吗？

可以。一旦所有者通过插件分配了销毁委托，委托可以随时销毁资产。所有者应该只将受信任的地址分配为销毁委托。

### 销毁会影响集合的计数吗？

会。当资产被销毁时，集合的 `currentSize` 会递减。`numMinted` 计数器保持不变（它追踪总铸造量）。

### 我可以一次销毁多个资产吗？

不能在单个指令中完成。您可以在一个交易中批量处理多个销毁指令（在交易大小限制内）。

## 术语表

| 术语 | 定义 |
|------|------------|
| **销毁** | 永久销毁资产并回收租金 |
| **销毁委托** | 被授权代表所有者销毁的账户 |
| **租金** | 在 Solana 上保持账户活跃所需存入的 SOL |
| **冻结** | 资产状态，销毁和转移被阻止 |
| **集合** | 资产可能属于的组账户 |

---

*由 Metaplex Foundation 维护 · 最后验证：2026 年 1 月 · 适用于 @metaplex-foundation/mpl-core*
