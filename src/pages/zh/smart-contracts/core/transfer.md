---
title: 转移资产
metaTitle: 转移资产 | Metaplex Core
description: 了解如何在 Solana 上在钱包之间转移 Core NFT 资产。向其他用户发送 NFT，处理集合转移，使用 Transfer Delegate。
---

本指南展示如何使用 Metaplex Core SDK 在 Solana 上**在钱包之间转移 Core 资产**。通过单个指令即可将 NFT 发送给其他用户。 {% .lead %}

{% callout title="您将学到" %}

- 将资产转移给新所有者
- 处理集合中资产的转移
- 使用 Transfer Delegate 进行授权转移
- 理解转移权限要求

{% /callout %}

## 摘要

使用 `transfer` 指令将 Core Asset 转移给新所有者。只有当前所有者（或授权的 Transfer Delegate）可以发起转移。

- 使用接收者地址调用 `transfer(umi, { asset, newOwner })`
- 对于集合资产，需要包含 `collection` 参数
- Transfer Delegate 可以代表所有者进行转移
- 转移是免费的（仅需支付交易费用）

## 范围外

Token Metadata 转移（使用 mpl-token-metadata）、批量转移（遍历资产）、市场销售（使用托管程序）。

## 快速开始

**跳转至：** [基本转移](#转移-core-asset) · [集合转移](#转移集合中的-core-asset) · [Delegate 转移](#如果我是资产的-transfer-delegate-怎么办)

1. 安装：`npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. 获取资产以验证所有权和集合成员身份
3. 调用 `transfer(umi, { asset, newOwner })`
4. 使用 `fetchAsset()` 验证所有权已更改

## 前提条件

- 配置了拥有该资产（或是其 Transfer Delegate）的签名者的 **Umi**
- 要转移资产的**资产地址**
- 新所有者的**接收者地址**（公钥）

Core Asset 的所有者可以使用 MPL Core 程序的 `transfer` 指令将所有权转移给另一个账户。

{% totem %}
{% totem-accordion title="技术指令详情" %}
**指令账户列表**

| 账户          | 描述                                          |
| ------------- | --------------------------------------------- |
| asset         | MPL Core Asset 的地址                         |
| collection    | Core Asset 所属的集合                         |
| authority     | 资产的所有者或委托人                          |
| payer         | 支付存储费用的账户                            |
| newOwner      | 接收资产的新所有者                            |
| systemProgram | System Program 账户                           |
| logWrapper    | SPL Noop 程序                                 |

部分账户可能在 SDK 中被抽象化或设为可选以便于使用。
有关链上指令的详细说明，请参阅 [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L139)。
{% /totem-accordion %}
{% /totem %}

## 转移 Core Asset

{% code-tabs-imported from="core/transfer-asset" frameworks="umi" /%}

## 转移集合中的 Core Asset

如果您要转移的资产属于某个集合，您需要传入集合地址。
[如何判断资产是否在集合中？]()

{% dialect-switcher title="转移集合中的资产" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { transferV1 } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')

await transferV1(umi, {
  asset: asset.publicKey,
  newOwner: newOwner.publicKey,
  collection: colleciton.publicKey,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::instructions::TransferV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn transfer_asset_in_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let collection = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let new_owner = Pubkey::from_str("33333333333333333333333333333333").unwrap();

    let transfer_asset_in_collection_ix = TransferV1Builder::new()
        .asset(asset)
        .collection(Some(collection))
        .payer(authority.pubkey())
        .new_owner(new_owner)
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let transfer_asset_in_collection_tx = Transaction::new_signed_with_payer(
        &[transfer_asset_in_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&transfer_asset_in_collection_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /dialect %}
{% /dialect-switcher %}

## 如果我是资产的 Transfer Delegate 怎么办？

如果您通过 [Transfer Delegate](/zh/smart-contracts/core/plugins/transfer-delegate) 插件成为资产的 Transfer Delegate，您可以像资产所有者一样调用 `transferV1` 函数。

## 常见错误

### `Authority mismatch`

您不是资产的所有者或 Transfer Delegate。检查所有权：

```ts
const asset = await fetchAsset(umi, assetAddress)
console.log(asset.owner) // 必须与您的签名者匹配
```

### `Asset is frozen`

资产有 Freeze Delegate 插件且当前处于冻结状态。冻结权限者必须在转移前解冻。

### `Missing collection parameter`

对于集合中的资产，您必须传递 `collection` 地址。检查资产是否有集合：

```ts
const asset = await fetchAsset(umi, assetAddress)
if (asset.updateAuthority.type === 'Collection') {
  console.log('Collection:', asset.updateAuthority.address)
}
```

## 注意事项

- 转移是**免费的** - 无租金成本，仅需交易费用（约 0.000005 SOL）
- 新所有者获得资产的完全控制权
- 转移成功后 Transfer Delegate 会被撤销
- 冻结的资产在解冻前无法转移
- 始终先获取资产以检查集合成员身份

## 快速参考

### 转移参数

| 参数 | 必需 | 描述 |
|-----------|----------|-------------|
| `asset` | 是 | 资产地址或获取的对象 |
| `newOwner` | 是 | 接收者的公钥 |
| `collection` | 如在集合中 | 集合地址 |
| `authority` | 否 | 默认为签名者（用于 delegate） |

### 谁可以转移？

| 权限 | 可以转移？ |
|-----------|---------------|
| 资产所有者 | 是 |
| Transfer Delegate | 是（之后撤销） |
| Update Authority | 否 |
| Collection Authority | 否 |

## 常见问题

### 如何知道资产是否在集合中？

获取资产并检查其 `updateAuthority`：

```ts
const asset = await fetchAsset(umi, assetAddress)
if (asset.updateAuthority.type === 'Collection') {
  // 将 asset.updateAuthority.address 作为 collection 参数传递
}
```

### 可以转移给自己吗？

可以。转移到自己的地址是有效的（对于整合钱包或测试很有用）。

### 转移后 Transfer Delegate 会怎样？

Transfer Delegate 插件在转移完成后会自动撤销。新所有者需要在需要时分配新的 delegate。

### 可以取消转移吗？

不可以。转移是原子性的 - 一旦交易确认，所有权就已更改。没有待处理状态可供取消。

### 可以一次转移多个资产吗？

不能在单个指令中完成。您可以在一个交易中批处理多个转移指令（受交易大小限制），但每个资产需要单独的转移调用。

### 转移会更改 Update Authority 吗？

不会。转移仅更改所有权。Update Authority 保持不变，除非通过 `update` 指令明确更改。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Owner** | 当前拥有资产的钱包 |
| **Transfer Delegate** | 被授权代表所有者转移的账户 |
| **Frozen** | 转移被阻止的资产状态 |
| **New Owner** | 接收资产的接收者钱包 |
| **Collection** | 资产所属的集合（影响转移要求） |

---

*由 Metaplex Foundation 维护 · 2026年1月最后验证 · 适用于 @metaplex-foundation/mpl-core*
