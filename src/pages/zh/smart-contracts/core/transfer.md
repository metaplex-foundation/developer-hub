---
title: 转移 Asset
metaTitle: 转移 Asset | Metaplex Core
description: 了解如何在 Solana 上在钱包之间转移 Core NFT Asset。向其他用户发送 NFT，处理收藏转移，并使用转移委托。
updated: '01-31-2026'
keywords:
  - transfer NFT
  - send NFT
  - NFT ownership
  - mpl-core transfer
  - transfer delegate
about:
  - NFT transfers
  - Ownership change
  - Transfer delegates
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
howToSteps:
  - 使用 npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi 安装 SDK
  - 获取 Asset 以验证所有权和收藏成员资格
  - 使用收件人地址调用 transfer(umi, { asset, newOwner })
  - 使用 fetchAsset() 验证所有权已更改
howToTools:
  - Node.js
  - Umi framework
  - mpl-core SDK
faqs:
  - q: 如何知道 Asset 是否在 Collection 中？
    a: 获取 Asset 并检查其 updateAuthority。如果类型是 'Collection'，则将该地址作为 collection 参数传递。
  - q: 我可以转移给自己吗？
    a: 可以。转移到自己的地址是有效的，对于整合钱包或测试很有用。
  - q: 转移后 Transfer Delegate 会怎样？
    a: Transfer Delegate 插件在转移完成时自动撤销。新所有者需要根据需要分配新的委托。
  - q: 我可以取消转移吗？
    a: 不可以。转移是原子性的 - 一旦交易确认，所有权就已更改。没有待处理状态可以取消。
  - q: 我可以一次转移多个 Asset 吗？
    a: 单个指令不行。您可以在一个交易中批量处理多个转移指令，但每个 Asset 需要自己的转移调用。
  - q: 转移会更改 update authority 吗？
    a: 不会。转移只更改所有权。update authority 保持不变，除非通过 update 指令明确更改。
---
本指南展示如何使用 Metaplex Core SDK 在 Solana 上在钱包之间**转移 Core Asset**。通过单个指令向其他用户发送 NFT。 {% .lead %}
{% callout title="您将学到" %}
- 将 Asset 转移给新所有者
- 处理 Collection 中 Asset 的转移
- 使用 Transfer Delegate 进行授权转移
- 理解转移权限要求
{% /callout %}
## 摘要
使用 `transfer` 指令将 Core Asset 转移给新所有者。只有当前所有者（或授权的 Transfer Delegate）可以发起转移。
- 使用收件人地址调用 `transfer(umi, { asset, newOwner })`
- 对于 Collection Asset，包含 `collection` 参数
- Transfer Delegate 可以代表所有者转移
- 转移是免费的（只收取交易费用）
## 范围外
Token Metadata 转移（使用 mpl-token-metadata）、批量转移（遍历 Asset）、市场销售（使用托管程序）。
## 快速开始
**跳转至：** [基本转移](#transferring-a-core-asset) · [收藏转移](#transferring-a-core-asset-in-a-collection) · [委托转移](#what-if-i-am-the-transfer-delegate-of-an-asset)
1. 安装：`npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. 获取 Asset 以验证所有权和收藏成员资格
3. 调用 `transfer(umi, { asset, newOwner })`
4. 使用 `fetchAsset()` 验证所有权已更改
## 前提条件
- 配置了拥有 Asset（或是其 Transfer Delegate）的签名者的 **Umi**
- 要转移的 Asset 的 **Asset 地址**
- 新所有者的 **收件人地址**（公钥）
Core Asset 的所有者可以通过使用 `transfer` 指令到 MPL Core 程序来将所有权转移给另一个账户。
{% totem %}
{% totem-accordion title="技术指令详情" %}
**指令账户列表**
| 账户 | 描述 |
| ------------- | ----------------------------------------------- |
| asset         | MPL Core Asset 的地址 |
| collection    | Core Asset 所属的收藏 |
| authority     | 资产的所有者或委托人 |
| payer         | 支付存储费用的账户 |
| newOwner      | 资产转移到的新所有者 |
| systemProgram | System Program 账户 |
| logWrapper    | SPL Noop Program |
为了便于使用，某些账户可能在 SDK 中被抽象化和/或设为可选。
链上指令的完整详细信息可在 [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L139) 上查看。
{% /totem-accordion %}
{% /totem %}
## 转移 Core Asset
{% code-tabs-imported from="core/transfer-asset" frameworks="umi" /%}
## 转移 Collection 中的 Core Asset
如果您要转移具有收藏的 Asset，需要传递收藏地址。
[如何判断 Asset 是否在 Collection 中？]()
{% dialect-switcher title="转移属于 Collection 的 Asset" %}
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
## 如果我是 Asset 的 Transfer Delegate？
如果您通过 [Transfer Delegate](/zh/smart-contracts/core/plugins/transfer-delegate) 插件成为 Asset 的 Transfer Delegate，您可以像 Asset 所有者一样调用 `transferV1` 函数。
## 常见错误
### `Authority mismatch`
您不是 Asset 的所有者或 Transfer Delegate。检查所有权：
```ts
const asset = await fetchAsset(umi, assetAddress)
console.log(asset.owner) // 必须与您的签名者匹配
```
### `Asset is frozen`
Asset 有 Freeze Delegate 插件且当前已冻结。冻结权限必须在转移前解冻它。
### `Missing collection parameter`
对于 Collection 中的 Asset，您必须传递 `collection` 地址。检查 Asset 是否有收藏：
```ts
const asset = await fetchAsset(umi, assetAddress)
if (asset.updateAuthority.type === 'Collection') {
  console.log('Collection:', asset.updateAuthority.address)
}
```
## 注意事项
- 转移是**免费的** - 无租金成本，只有交易费用（~0.000005 SOL）
- 新所有者获得 Asset 的完全控制权
- Transfer、Burn 和 Freeze Delegate 在转移成功后被撤销
- 冻结的 Asset 在解冻前无法转移
- 始终先获取 Asset 以检查收藏成员资格
## 快速参考
### 转移参数
| 参数 | 必需 | 描述 |
|-----------|----------|-------------|
| `asset` | 是 | Asset 地址或获取的对象 |
| `newOwner` | 是 | 收件人的公钥 |
| `collection` | 如果在收藏中 | Collection 地址 |
| `authority` | 否 | 默认为签名者（用于委托） |
### 谁可以转移？
| 权限 | 可以转移？ |
|-----------|---------------|
| Asset 所有者 | 是 |
| Transfer Delegate | 是（转移后撤销） |
| Update Authority | 否 |
| Collection Authority | 否 |
## FAQ
### 如何知道 Asset 是否在 Collection 中？
获取 Asset 并检查其 `updateAuthority`：
```ts
const asset = await fetchAsset(umi, assetAddress)
if (asset.updateAuthority.type === 'Collection') {
  // 将 asset.updateAuthority.address 作为 collection 参数传递
}
```
### 我可以转移给自己吗？
可以。转移到自己的地址是有效的（对于整合钱包或测试很有用）。
### 转移后 Transfer Delegate 会怎样？
Transfer Delegate 插件在转移完成时自动撤销。新所有者需要根据需要分配新的委托。
### 我可以取消转移吗？
不可以。转移是原子性的 - 一旦交易确认，所有权就已更改。没有待处理状态可以取消。
### 我可以一次转移多个 Asset 吗？
单个指令不行。您可以在一个交易中批量处理多个转移指令（受交易大小限制），但每个 Asset 需要自己的转移调用。
### 转移会更改 update authority 吗？
不会。转移只更改所有权。update authority 保持不变，除非通过 `update` 指令明确更改。
## 术语表
| 术语 | 定义 |
|------|------------|
| **所有者** | 当前拥有 Asset 的钱包 |
| **Transfer Delegate** | 被授权代表所有者转移的账户 |
| **冻结** | 转移被阻止的 Asset 状态 |
| **新所有者** | 接收 Asset 的收件人钱包 |
| **Collection** | Asset 所属的 Collection（影响转移要求） |
