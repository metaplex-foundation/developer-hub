---
title: 销毁 Asset
metaTitle: 销毁 Asset | Metaplex Core
description: 了解如何在 Solana 上销毁 Core NFT Asset。使用 Metaplex Core SDK 永久销毁 Asset 并回收租金。
created: '06-15-2024'
updated: '01-31-2026'
keywords:
  - burn NFT
  - destroy asset
  - recover rent
  - Solana NFT
  - mpl-core burn
about:
  - NFT burning
  - Rent recovery
  - Asset destruction
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
howToSteps:
  - 使用 npm install @metaplex-foundation/mpl-core 安装 SDK
  - 获取 Asset 以验证所有权
  - 作为所有者调用 burn(umi, { asset })
  - 租金会自动返还到您的钱包
howToTools:
  - Node.js
  - Umi framework
  - mpl-core SDK
faqs:
  - q: 我可以回收账户中剩余的约 0.0009 SOL 吗？
    a: 不可以。这笔小额资金是故意留下的，用于标记账户已被销毁并防止地址被重用。
  - q: 销毁后 Asset 的元数据会怎样？
    a: 链上账户会被清除。Arweave/IPFS 上的链下元数据仍可访问，但没有链上链接。
  - q: Burn Delegate 可以在没有所有者批准的情况下销毁吗？
    a: 可以。一旦被分配，Burn Delegate 可以随时销毁 Asset。只分配可信任的地址。
  - q: 销毁会影响 Collection 的计数吗？
    a: 会。Collection 的 currentSize 会减少。numMinted 计数器保持不变。
  - q: 我可以一次销毁多个 Asset 吗？
    a: 单个指令不行。您可以在一个交易中批量处理多个销毁指令，但有大小限制。
---
本指南展示如何使用 Metaplex Core SDK 在 Solana 上**销毁 Core Asset**。永久销毁 Asset 并回收大部分租金押金。 {% .lead %}
{% callout title="您将学到" %}
- 销毁 Asset 并回收租金
- 处理 Collection 中 Asset 的销毁
- 理解 Burn Delegate 权限
- 了解销毁后账户会发生什么
{% /callout %}
## 摘要
销毁 Core Asset 以永久销毁它并回收租金。只有所有者（或 Burn Delegate）可以销毁 Asset。
- 调用 `burn(umi, { asset })` 销毁 Asset
- 大部分租金（约 0.0028 SOL）返还给付款人
- 少量（约 0.0009 SOL）保留以防止账户重用
- 销毁是**永久且不可逆的**
## 范围外
Token Metadata 销毁（使用 mpl-token-metadata）、压缩 NFT 销毁（使用 Bubblegum）、Collection 销毁（Collection 有自己的销毁流程）。
## 快速开始
**跳转至：** [销毁 Asset](#code-example) · [Collection 内销毁](#burning-an-asset-that-is-part-of-a-collection)
1. 安装：`npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. 获取 Asset 以验证所有权
3. 作为所有者调用 `burn(umi, { asset })`
4. 租金会自动返还到您的钱包
## 前提条件
- 配置了拥有 Asset（或是其 Burn Delegate）的签名者的 **Umi**
- 要销毁的 Asset 的 **Asset 地址**
- **Collection 地址**（如果 Asset 在 Collection 中）
可以使用 `burn` 指令销毁 Asset。这将把租金豁免费用返还给所有者。只有很少量的 SOL（0.00089784）会留在账户中以防止其被重新打开。
{% totem %}
{% totem-accordion title="技术指令详情" %}
**指令账户列表**
| 账户 | 描述 |
| ------------- | ----------------------------------------------- |
| asset         | MPL Core Asset 的地址 |
| collection    | Core Asset 所属的收藏 |
| payer         | 支付存储费用的账户 |
| authority     | 资产的所有者或委托人 |
| systemProgram | System Program 账户 |
| logWrapper    | SPL Noop Program |
为了便于使用，某些账户可能在 SDK 中被抽象化和/或设为可选。
链上指令的完整详细信息可在 [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L123) 上查看。
{% /totem-accordion %}
{% /totem %}
## 代码示例
以下是如何使用我们的 SDK 销毁 Core asset。该代码片段假设您是资产的所有者。
{% code-tabs-imported from="core/burn-asset" frameworks="umi" /%}
## 销毁属于 Collection 的 Asset
以下是如何使用我们的 SDK 销毁属于 collection 的 Core asset。该代码片段假设您是资产的所有者。
{% dialect-switcher title="销毁属于 Collection 的 Asset" %}
{% dialect title="JavaScript" id="js" %}
```ts
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
  collection = await fetchCollection(umi, collectionId)
}

await burn(umi, {
  asset,
  collection,
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
您不是 Asset 的所有者或 Burn Delegate。检查所有权：
```ts
const asset = await fetchAsset(umi, assetAddress)
console.log(asset.owner) // 必须与您的签名者匹配
```
### `Asset is frozen`
Asset 有 Freeze Delegate 插件且当前已冻结。冻结权限必须在销毁前解冻它。
### `Missing collection parameter`
对于 Collection 中的 Asset，您必须传递 `collection` 地址。首先获取 Asset 以获取 collection：
```ts
const asset = await fetchAsset(umi, assetAddress)
const collectionId = collectionAddress(asset)
```
## 注意事项
- 销毁是**永久且不可逆的** - Asset 无法恢复
- 租金返还给所有者（金额取决于资产大小和插件）
- 剩余的 SOL 防止账户地址被重用
- Burn Delegate 可以代表所有者销毁（通过 Burn Delegate 插件）
- 冻结的 Asset 必须在销毁前解冻
## 快速参考
### 销毁参数
| 参数 | 必需 | 描述 |
|-----------|----------|-------------|
| `asset` | 是 | Asset 地址或获取的对象 |
| `collection` | 如果在收藏中 | Collection 地址 |
| `authority` | 否 | 默认为签名者（用于委托） |
### 谁可以销毁？
| 权限 | 可以销毁？ |
|-----------|-----------|
| Asset 所有者 | 是 |
| Burn Delegate | 是 |
| Transfer Delegate | 否 |
| Update Authority | 否 |
### 租金回收
| 项目 | 金额 |
|------|--------|
| 返还给付款人 | 基础 + 插件存储租金 |
| 留在账户中 | ~0.0009 SOL |
## FAQ
### 我可以回收账户中剩余的约 0.0009 SOL 吗？
不可以。这笔小额资金是故意留下的，用于标记账户为"已销毁"并防止其地址被新 Asset 重用。
### 销毁后 Asset 的元数据会怎样？
链上账户被清除（归零）。链下元数据通过原始 URI 仍可访问，但没有链上记录链接到它。
### Burn Delegate 可以在没有所有者批准的情况下销毁吗？
可以。一旦所有者通过插件分配了 Burn Delegate，委托人可以随时销毁 Asset。所有者应只分配可信任的地址作为 Burn Delegate。
### 销毁会影响 Collection 的计数吗？
会。当 Asset 被销毁时，Collection 的 `currentSize` 会减少。`numMinted` 计数器保持不变（它跟踪历史铸造总数）。
### 我可以一次销毁多个 Asset 吗？
单个指令不行。您可以在一个交易中批量处理多个销毁指令（受交易大小限制）。
## 术语表
| 术语 | 定义 |
|------|------------|
| **销毁** | 永久销毁 Asset 并回收租金 |
| **Burn Delegate** | 被授权代表所有者销毁的账户 |
| **租金** | 在 Solana 上保持账户活跃所需存入的 SOL |
| **冻结** | 销毁和转移被阻止的 Asset 状态 |
| **Collection** | Asset 可能属于的组账户 |
