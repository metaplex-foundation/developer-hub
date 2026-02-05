---
title: Transfer Delegate 插件
metaTitle: Transfer Delegate 插件 | Metaplex Core
description: 允许委托方转移 Core NFT Asset。使用 Transfer Delegate 插件进行无托管销售、游戏机制和市场挂单。
updated: '01-31-2026'
keywords:
  - transfer delegate
  - delegate transfer
  - escrowless sale
  - NFT marketplace
about:
  - Transfer delegation
  - Escrowless mechanics
  - Marketplace integration
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 为什么我的转移权限被撤销了？
    a: Transfer Delegate 权限在任何转移后会自动撤销。这是为市场安全而设计的 - 委托方只能转移一次。
  - q: 如何实现无托管挂单？
    a: 卖家添加 Transfer Delegate 并将市场作为权限方。当买家付款时，市场将 Asset 转移给买家。权限被撤销，卖家无法重复挂单。
  - q: Transfer Delegate 和 Permanent Transfer Delegate 有什么区别？
    a: Transfer Delegate 在一次转移后被撤销。Permanent Transfer Delegate 永久保持，只能在 Asset 创建时添加。
  - q: 作为委托方可以转移冻结的 Asset 吗？
    a: 不可以。冻结的 Asset 会阻止所有转移，包括委托转移。对于复杂的托管场景，请将 Permanent Transfer Delegate 与 Permanent Freeze Delegate 配合使用。
  - q: 所有者需要批准每次转移吗？
    a: 不需要。一旦设置了 Transfer Delegate，委托方无需所有者批准即可转移。但是，他们只能在权限撤销前进行一次转移。
---
**Transfer Delegate 插件**允许指定的权限方代表所有者转移 Core Asset。对于无托管市场销售、游戏机制和订阅服务至关重要。 {% .lead %}
{% callout title="您将学到" %}
- 向 Asset 添加 Transfer Delegate 插件
- 将转移权限委托给市场或程序
- 作为委托方执行转移
- 转移时的权限行为
{% /callout %}
## 摘要
**Transfer Delegate** 是一个所有者管理的插件，允许委托方转移 Asset。一旦委托，权限方可以在无需所有者批准的情况下将 Asset 转移到任何地址。
- 启用无托管市场挂单
- **转移后权限被撤销**（一次性使用）
- 使用 [Permanent Transfer Delegate](/smart-contracts/core/plugins/permanent-transfer-delegate) 获得持久权限
- 无需额外参数
## 范围外
永久转移权限（参见 Permanent Transfer Delegate）、Collection 级别转移和 Token Metadata 转移权限（不同系统）不在范围内。
## 快速开始
**跳转到：** [添加插件](#向-asset-添加-transfer-delegate-插件) · [委托权限](#委托转移权限) · [作为委托方转移](#作为委托方转移-asset)
1. 使用委托地址添加 Transfer Delegate 插件
2. 委托方现在可以转移 Asset 一次
3. 转移后，权限自动撤销
## 概述
`Transfer Delegate` 插件是一个`所有者管理`的插件，允许 Transfer Delegate 插件的权限方随时转移 Asset。
Transfer 插件适用于以下领域：
- Asset 的无托管销售：无需托管账户直接将 NFT 转移给买家
- 用户根据事件交换/失去资产的游戏场景：游戏事件发生时自动转移资产
- 订阅服务：作为订阅服务的一部分转移 NFT
{% callout type="note" title="何时使用 Transfer vs Permanent Transfer Delegate" %}
| 用例 | Transfer Delegate | Permanent Transfer Delegate |
|----------|-------------------|----------------------------|
| 市场挂单 | ✅ 最佳选择 | ❌ 风险太大 |
| 一次性转移 | ✅ 最佳选择 | ❌ 过度 |
| 租赁归还 | ❌ 一次性 | ✅ 最佳选择 |
| 游戏资产交换 | ✅ 最佳选择 | ✅ 也可以 |
| 转移时权限保持 | ❌ 撤销 | ✅ 保持 |
**选择 Transfer Delegate** 用于一次性无托管销售（转移后权限撤销）。
**选择 [Permanent Transfer Delegate](/smart-contracts/core/plugins/permanent-transfer-delegate)** 当权限必须永久保持时。
{% /callout %}
{% callout title="警告！" %}
Transfer delegate 权限是临时的，在资产转移时会被重置。
{% /callout %}
## 兼容性
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |
## 参数
Transfer 插件不包含任何参数。
## 函数
### 向 Asset 添加 Transfer Delegate 插件
`addPlugin` 命令将 Transfer Delegate 插件添加到 Asset。此插件允许委托方随时转移 Asset。
{% dialect-switcher title="向 MPL Core Asset 添加 Transfer 插件" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin } from '@metaplex-foundation/mpl-core'
const assetAddress = publicKey('11111111111111111111111111111111')
const delegate = publicKey('22222222222222222222222222222222')
await addPlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'TransferDelegate',
    authority: { type: 'Address', address: delegate },
  },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust CPI" id="rust-cpi" %}
```rust
AddPluginV1CpiBuilder::new(ctx.accounts.mpl_core_program)
    .asset(ctx.accounts.asset)
    .collection(Some(ctx.accounts.collection))
    .authority(Some(ctx.accounts.authority))
    .payer(ctx.accounts.payer)
    .plugin(Plugin::TransferDelegate(TransferDelegate {}))
    .invoke();
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{Plugin, TransferDelegate},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn add_transfer_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let add_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::TransferDelegate(TransferDelegate {}))
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
### 委托转移权限
`approvePluginAuthority` 命令将转移权限委托给不同的地址。这允许另一个地址在保持所有权的同时转移 Asset。
{% dialect-switcher title="委托转移权限" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { approvePluginAuthority } from '@metaplex-foundation/mpl-core'
const asset = publicKey("11111111111111111111111111111111");
const collection = publicKey("22222222222222222222222222222222");
const delegateAddress = publicKey("33333333333333333333333333333333");
await approvePluginAuthority(umi, {
  asset: asset,
  collection: collection,
  plugin: { type: "TransferDelegate" },
  newAuthority: { type: "Address", address: delegateAddress },
}).sendAndConfirm(umi);
```
{% /dialect %}
{% dialect title="Rust CPI" id="rust-cpi" %}
```rust
ApprovePluginAuthorityV1CpiBuilder::new(ctx.accounts.mpl_core_program)
    .asset(ctx.accounts.asset)
    .collection(Some(ctx.accounts.collection))
    .authority(Some(ctx.accounts.authority))
    .payer(ctx.accounts.payer)
    .plugin_type(PluginType::TransferDelegate)
    .new_authority(PluginAuthority::Address { address: ctx.accounts.new_authority.key() })
    .invoke()?;
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{
    instructions::ApprovePluginAuthorityV1Builder,
    types::{PluginAuthority, PluginType},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn approve_plugin_authority() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let new_authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let collection = Pubkey::from_str("2222222222222222222222222222222").unwrap();
    let approve_plugin_authority_ix = ApprovePluginAuthorityV1Builder::new()
        .asset(asset)
        // 如果 Asset 是 Collection 的一部分，必须传入 Collection
        .collection(Some(collection))
        .authority(Some(authority.pubkey()))
        .payer(authority.pubkey())
        .plugin_type(PluginType::TransferDelegate)
        .new_authority(PluginAuthority::Address { address: new_authority.pubkey() })
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let approve_plugin_authority_tx = Transaction::new_signed_with_payer(
        &[approve_plugin_authority_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&approve_plugin_authority_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res);
}
```
{% /dialect %}
{% /dialect-switcher %}
### 作为委托方转移 Asset
`transfer` 指令使用 transfer delegate 权限将 Asset 转移到另一个地址。
{% dialect-switcher title="转移 MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}
```ts
import {
  fetchAsset,
  fetchCollection,
  transfer,
} from "@metaplex-foundation/mpl-core";
import { publicKey } from "@metaplex-foundation/umi";
// 要转移的 Asset ID
const assetId = publicKey("11111111111111111111111111111111");
// 获取 Asset
const assetItem = await fetchAsset(umi, assetId);
// 如果 Asset 是 Collection 的一部分，获取 Collection
const collectionItem =
    assetItem.updateAuthority.type == "Collection" &&
    assetItem.updateAuthority.address
      ? await fetchCollection(umi, assetItem.updateAuthority.address)
      : undefined;
// 转移 Core NFT Asset
const { signature } = await transfer(umi, {
    asset: assetItem,
    newOwner: publicKey("22222222222222222222222222222222"),
    collection: collectionItem,
  })
  .sendAndConfirm(umi);
```
{% /dialect %}
{% dialect title="Rust CPI" id="rust-cpi" %}
```rust
TransferV1CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .new_owner(&ctx.accounts.new_owner.to_account_info())
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.delegate_authority.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .invoke()?;
```
{% /dialect %}
{% /dialect-switcher %}
## 更新 Transfer Delegate 权限
由于 Transfer Delegate 插件不包含要更新的插件数据（它是一个空对象 `{}`），主要的"更新"操作是更改插件权限。这允许您将转移权限委托给不同的地址。
### 更改 Transfer Delegate 权限
您可以使用 `approvePluginAuthority` 函数更改谁拥有转移权限：
{% dialect-switcher title="更新 Transfer Delegate 权限" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { approvePluginAuthority } from '@metaplex-foundation/mpl-core'
(async () => {
    const assetAddress = publicKey('11111111111111111111111111111111')
    const newDelegate = publicKey('44444444444444444444444444444444')
    // 将 transfer delegate 更改为新地址
    await approvePluginAuthority(umi, {
    asset: assetAddress,
    plugin: { type: 'TransferDelegate' },
    newAuthority: { type: 'Address', address: newDelegate },
    }).sendAndConfirm(umi)
})();
```
{% /dialect %}
{% /dialect-switcher %}
### 撤销 Transfer Delegate 权限
可以使用 `revokePluginAuthority` 函数撤销转移权限，将转移控制权返还给资产所有者。
{% dialect-switcher title="撤销 Transfer Delegate 权限" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { revokePluginAuthority } from '@metaplex-foundation/mpl-core'
const assetAddress = publicKey('11111111111111111111111111111111')
await revokePluginAuthority(umi, {
  asset: assetAddress,
  plugin: { type: 'TransferDelegate' },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% /dialect-switcher %}
## 常见错误
### `Authority mismatch`
只有 transfer delegate 权限可以转移 Asset。请验证您使用正确的密钥对进行签名。
### `Asset is frozen`
冻结的 Asset 无法转移。冻结权限必须先解冻 Asset。
### `Transfer delegate not found`
Asset 没有 Transfer Delegate 插件，或者权限在之前的转移后已被撤销。
## 注意事项
- 所有者管理：需要所有者签名才能添加
- **转移后权限自动撤销**
- 每次转移都需要新所有者重新委托
- 冻结的 Asset 无法被委托方转移
- 对于持久权限使用 Permanent Transfer Delegate
## 快速参考
### 权限生命周期
| 事件 | 权限状态 |
|-------|------------------|
| 插件添加 | 活跃 |
| Asset 已转移 | **已撤销** |
| 新所有者添加插件 | 活跃（新委托方） |
### 谁可以转移？
| 权限 | 可以转移？ |
|-----------|---------------|
| Asset 所有者 | 是（始终） |
| Transfer Delegate | 是（一次） |
| Permanent Transfer Delegate | 是（始终） |
| 更新权限 | 否 |
## 常见问题
### 为什么我的转移权限被撤销了？
Transfer Delegate 权限在任何转移后会自动撤销。这是为市场安全而设计的 - 委托方只能转移一次。
### 如何实现无托管挂单？
1. 卖家添加 Transfer Delegate 并将市场作为权限方
2. 当买家付款时，市场将 Asset 转移给买家
3. 权限被撤销；卖家无法重复挂单
### Transfer Delegate 和 Permanent Transfer Delegate 有什么区别？
Transfer Delegate 在一次转移后被撤销。Permanent Transfer Delegate 永久保持，只能在 Asset 创建时添加。
### 作为委托方可以转移冻结的 Asset 吗？
不可以。冻结的 Asset 会阻止所有转移，包括委托转移。对于复杂的托管场景，请将 Permanent Transfer Delegate 与 Permanent Freeze Delegate 配合使用。
### 所有者需要批准每次转移吗？
不需要。一旦设置了 Transfer Delegate，委托方无需所有者批准即可转移。但是，他们只能在权限撤销前进行一次转移。
## 相关插件
- [Permanent Transfer Delegate](/smart-contracts/core/plugins/permanent-transfer-delegate) - 不可撤销的转移权限
- [Freeze Delegate](/smart-contracts/core/plugins/freeze-delegate) - 临时阻止转移
- [Burn Delegate](/smart-contracts/core/plugins/burn-delegate) - 允许委托方销毁 Asset
## 术语表
| 术语 | 定义 |
|------|------------|
| **Transfer Delegate** | 允许一次性转移权限的所有者管理插件 |
| **所有者管理** | 需要所有者签名才能添加的插件类型 |
| **无托管** | 不转移到持有账户即可销售 |
| **Permanent Transfer Delegate** | 在创建时添加的不可撤销版本 |
