---
title: 冻结委托
metaTitle: 冻结委托插件 | Metaplex Core
description: 学习如何冻结Core NFT Asset以阻止转移和销毁。使用冻结委托插件实现无托管质押、市场上架和游戏物品锁定。
updated: '01-31-2026'
keywords:
  - freeze NFT
  - freeze delegate
  - escrowless staking
  - lock NFT
  - freeze plugin
about:
  - Asset freezing
  - Escrowless mechanics
  - Staking
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
faqs:
  - q: 我可以冻结不属于我的Asset吗？
    a: 不可以。冻结委托是Owner管理的，只有所有者才能添加它。添加后，您可以将authority委托给另一个地址。
  - q: 冻结委托和永久冻结委托有什么区别？
    a: 冻结委托的authority在转移时会被撤销。永久冻结委托的authority永久存在，且只能在创建时添加。
  - q: 冻结的Asset可以被销毁吗？
    a: 不可以。冻结的Asset会阻止转移和销毁。如果您想销毁它，请先解冻Asset。
  - q: 我可以一次冻结整个Collection吗？
    a: 使用普通冻结委托不可以。请改用Collection上的永久冻结委托，它支持Collection级别的冻结。请注意，它只能在Collection创建时添加。
  - q: 冻结会影响元数据更新吗？
    a: 不会。Asset所有者或update authority仍然可以在冻结状态下更新元数据。只有转移和销毁会被阻止。
  - q: 如何实现无托管质押？
    a: 将冻结委托添加为您的质押程序作为authority。当用户质押时，冻结Asset。当用户取消质押时，解冻Asset。NFT永远不会离开用户的钱包。
---
**冻结委托插件**允许您冻结Core Asset，在Asset保留在所有者钱包中的同时阻止转移和销毁。适用于无托管质押、市场上架和游戏机制。{% .lead %}
{% callout title="您将学到什么" %}
- 向Asset添加冻结委托插件
- 冻结和解冻Asset
- 将冻结权限委托给另一个地址
- 用例：质押、上架、游戏锁定
{% /callout %}
## 摘要
**冻结委托**是一个Owner管理的插件，可以将Asset冻结在原位。冻结后，Asset在冻结authority解冻之前无法被转移或销毁。
- 无需将Asset转移到托管即可冻结
- 将冻结authority委托给程序或其他钱包
- Authority在转移时被撤销（非永久版本）
- 使用[永久冻结委托](/smart-contracts/core/plugins/permanent-freeze-delegate)进行不可撤销的冻结
## 范围外
Collection级别的冻结（仅限Asset级别）、永久冻结（参见永久冻结委托）以及Token Metadata冻结权限（不同的系统）。
## 快速入门
**跳转到：** [添加插件](#向asset添加冻结委托插件) · [委托Authority](#委托冻结authority) · [冻结](#冻结asset) · [解冻](#解冻已冻结的asset)
1. 添加冻结委托插件：`addPlugin(umi, { asset, plugin: { type: 'FreezeDelegate', data: { frozen: true } } })`
2. Asset现在已冻结，无法被转移
3. 准备好时解冻：将插件更新为`frozen: false`
4. Authority在转移时被撤销
{% callout type="note" title="何时使用冻结 vs 永久冻结" %}
| 用例 | 冻结委托 | 永久冻结委托 |
|----------|-----------------|---------------------------|
| 市场上架 | ✅ 最佳选择 | ❌ 过度使用 |
| 无托管质押 | ✅ 最佳选择 | ✅ 也可以 |
| 灵魂绑定代币 | ❌ 转移时撤销 | ✅ 最佳选择 |
| Collection范围冻结 | ❌ 仅限Asset | ✅ 支持Collection |
| 租赁协议 | ✅ 最佳选择 | ✅ 也可以 |
**选择冻结委托**当authority应在所有权变更时重置。
**选择[永久冻结委托](/smart-contracts/core/plugins/permanent-freeze-delegate)**当authority必须永久保持。
{% /callout %}
## 常见用例
- **无托管质押**：在不转移到托管的情况下冻结质押的NFT
- **市场上架**：在没有托管账户的情况下锁定待售NFT
- **游戏物品锁定**：在游戏过程中临时锁定物品
- **租赁协议**：在租出期间锁定NFT
- **治理**：在投票期间锁定代币
- **抵押品**：锁定用作贷款抵押品的NFT
- **锦标赛**：在比赛参与期间锁定NFT
## 适用范围
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |
如需Collection级别的冻结，请改用[永久冻结委托](/smart-contracts/core/plugins/permanent-freeze-delegate)。
## 参数
| 参数    | 值 |
| ------ | ----- |
| frozen | bool  |
## 函数
### 向Asset添加冻结委托插件
`addPlugin`命令向Asset添加冻结委托插件。此插件允许冻结Asset，防止转移和销毁。
{% dialect-switcher title="向MPL Core Asset添加冻结插件" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin } from '@metaplex-foundation/mpl-core'
const assetAddress = publicKey('11111111111111111111111111111111')
await addPlugin(umi, {
  asset: assetAddress,
  plugin: { type: 'FreezeDelegate', data: { frozen: true } },
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
    .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
    .invoke();
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
pub async fn add_freeze_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let add_freeze_delegate_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::FreezeDelegate(FreezeDelegate {frozen: true}))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let add_freeze_delegate_plugin_ix_tx = Transaction::new_signed_with_payer(
        &[add_freeze_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&add_freeze_delegate_plugin_ix_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
### 委托冻结Authority
`approvePluginAuthority`命令将冻结authority委托给不同的地址。这允许另一个地址在保持所有权的同时冻结和解冻Asset。
{% dialect-switcher title="委托冻结Authority" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { approvePluginAuthority } from '@metaplex-foundation/mpl-core'
const asset = publicKey('11111111111111111111111111111111')
const delegateAddress = publicKey('22222222222222222222222222222222')
await approvePluginAuthority(umi, {
  asset: asset.publicKey,
  plugin: { type: 'FreezeDelegate' },
  newAuthority: { type: 'Address', address: delegateAddress },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust CPI" id="rust-cpi" %}
```rust
ApprovePluginAuthorityV1CpiBuilder::new(ctx.accounts.mpl_core_program)
    .asset(ctx.accounts.asset)
    .collection(Some(ctx.accounts.collection))
    .authority(Some(ctx.accounts.authority))
    .payer(ctx.accounts.payer)
    .plugin_type(PluginType::FreezeDelegate)
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
    let approve_plugin_authority_plugin_ix = ApprovePluginAuthorityV1Builder::new()
        .asset(asset)
        // 如果Asset是Collection的一部分，必须传入collection
        .collection(Some(collection))
        .authority(Some(authority.pubkey()))
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .new_authority(PluginAuthority::Address { address: new_authority.pubkey() })
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let update_attributes_plugin_tx = Transaction::new_signed_with_payer(
        &[approve_plugin_authority_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&update_attributes_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res);
}
```
{% /dialect %}
{% /dialect-switcher %}
## 更新冻结委托插件
冻结委托插件可以更新以更改Asset的冻结状态。这与下面显示的[冻结Asset](#冻结asset)和[解冻已冻结的Asset](#解冻已冻结的asset)函数相同。
### 冻结Asset
`freezeAsset`命令冻结Asset，防止其被转移或销毁。这对于无托管质押或市场上架很有用。
{% dialect-switcher title="冻结MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { freezeAsset, fetchAsset } from '@metaplex-foundation/mpl-core'
const assetAddress = publicKey('11111111111111111111111111111111')
const assetAccount = await fetchAsset(umi, assetAddress)
const delegateSigner = generateSigner(umi)
await freezeAsset(umi, {
    asset: assetAccount,
    delegate: delegateSigner.publicKey,
    authority: delegateSigner,
  }).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust CPI" id="rust-cpi" %}
```rust
UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.update_authority.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    // 将FreezeDelegate插件设置为`frozen: true`
    .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: true }))
    .invoke()?;
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{
    instructions::UpdatePluginV1Builder,
    types::{FreezeDelegate, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn update_freeze_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let collection = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let update_freeze_delegate_plugin_ix = UpdatePluginV1Builder::new()
        .asset(asset)
        // 如果Asset是Collection的一部分，传入Collection
        .collection(Some(collection))
        .payer(authority.pubkey())
        // 将FreezeDelegate插件设置为`frozen: true`
        .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: true }))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let update_freeze_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[update_freeze_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&update_freeze_delegate_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res);
}
```
{% /dialect %}
{% /dialect-switcher %}
### 解冻已冻结的Asset
`thawAsset`命令解冻已冻结的Asset，恢复其转移和销毁的能力。
{% dialect-switcher title="解冻MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { thawAsset, fetchAsset } from '@metaplex-foundation/mpl-core'
const assetAddress = publicKey('11111111111111111111111111111111')
const assetAccount = await fetchAsset(umi, assetAddress)
const delegateSigner = generateSigner(umi)
await thawAsset(umi, {
  asset: assetAccount,
  delegate: delegateSigner,
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust CPI" id="rust-cpi" %}
```rust
UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.update_authority.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    // 将FreezeDelegate插件设置为`frozen: false`
    .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
    .invoke()?;
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{
    instructions::UpdatePluginV1Builder,
    types::{FreezeDelegate, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn thaw_freeze_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let collection = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let thaw_freeze_delegate_plugin_ix = UpdatePluginV1Builder::new()
        .asset(asset)
        // 如果Asset是Collection的一部分，传入Collection
        .collection(Some(collection))
        .payer(authority.pubkey())
        // 将FreezeDelegate插件设置为`frozen: false`
        .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let thaw_freeze_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[thaw_freeze_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&thaw_freeze_delegate_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res);
}
```
{% /dialect %}
{% /dialect-switcher %}
## 常见错误
### `Asset is frozen`
您尝试转移或销毁已冻结的Asset。冻结authority必须先解冻它。
### `Authority mismatch`
只有冻结委托authority才能冻结/解冻Asset。检查谁拥有插件authority。
### `Plugin not found`
Asset没有冻结委托插件。请先使用`addPlugin`添加它。
## 注意事项
- Owner管理：需要所有者签名才能添加
- Authority在Asset转移时自动撤销
- 冻结的Asset仍然可以更新（允许元数据更改）
- 如果您需要authority在转移后仍然保持，请使用永久冻结委托
- 冻结是即时的 - 没有确认期
## 快速参考
### 冻结状态
| 状态 | 可以转移 | 可以销毁 | 可以更新 |
|-------|--------------|----------|------------|
| 未冻结 | 是 | 是 | 是 |
| 已冻结 | 否 | 否 | 是 |
### Authority行为
| 事件 | Authority结果 |
|-------|------------------|
| Asset转移 | Authority被撤销 |
| 插件被移除 | Authority消失 |
| 解冻 | Authority保留 |
## 常见问题
### 我可以冻结不属于我的Asset吗？
不可以。冻结委托是Owner管理的，只有所有者才能添加它。添加后，您可以将authority委托给另一个地址。
### 冻结委托和永久冻结委托有什么区别？
冻结委托的authority在转移时会被撤销。永久冻结委托的authority永久存在，且只能在创建时添加。
### 冻结的Asset可以被销毁吗？
不可以。冻结的Asset会阻止转移和销毁。如果您想销毁它，请先解冻Asset。
### 我可以一次冻结整个Collection吗？
使用普通冻结委托不可以（仅限Asset）。请改用Collection上的[永久冻结委托](/smart-contracts/core/plugins/permanent-freeze-delegate) - 它支持Collection级别的冻结，可以一次冻结该Collection中的所有Asset。请注意，永久冻结委托只能在Collection创建时添加。
### 冻结会影响元数据更新吗？
不会。Asset所有者或update authority仍然可以在冻结状态下更新元数据（名称、URI）。只有转移和销毁会被阻止。
### 如何实现无托管质押？
1. 将冻结委托插件添加为您的质押程序作为authority
2. 当用户质押时：冻结Asset
3. 当用户取消质押时：解冻Asset
4. NFT永远不会离开用户的钱包
## 相关插件
- [永久冻结委托](/smart-contracts/core/plugins/permanent-freeze-delegate) - 不可撤销的冻结authority，支持Collection
- [转移委托](/smart-contracts/core/plugins/transfer-delegate) - 允许委托转移Asset
- [销毁委托](/smart-contracts/core/plugins/burn-delegate) - 允许委托销毁Asset
## 术语表
| 术语 | 定义 |
|------|------------|
| **冻结委托** | Owner管理的插件，阻止转移和销毁 |
| **已冻结** | 转移和销毁被阻止的Asset状态 |
| **解冻** | 取消冻结Asset以允许再次转移 |
| **委托Authority** | 被授权冻结/解冻Asset的账户 |
| **无托管** | 无需转移到持有账户即可质押/上架 |
| **Owner管理** | 需要所有者签名才能添加的插件类型 |
