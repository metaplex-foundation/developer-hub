---
title: 冻结委托
metaTitle: 冻结委托插件 | Metaplex Core
description: 了解如何冻结 Core NFT 资产以阻止转移和销毁。使用冻结委托插件进行无托管质押、市场挂单和游戏物品锁定。
---

**冻结委托插件**允许您冻结 Core 资产，在资产保留在所有者钱包中的同时阻止转移和销毁。非常适合无托管质押、市场挂单和游戏机制。{% .lead %}

{% callout title="您将学到" %}

- 向资产添加冻结委托插件
- 冻结和解冻资产
- 将冻结权限委托给另一个地址
- 用例：质押、挂单、游戏锁定

{% /callout %}

## 摘要

**冻结委托**是一个所有者管理插件，可以原地冻结资产。冻结后，资产在冻结权限解冻前无法转移或销毁。

- 无需转移到托管即可冻结资产
- 将冻结权限委托给程序或其他钱包
- 转移时权限被撤销（非永久版本）
- 使用[永久冻结委托](/zh/smart-contracts/core/plugins/permanent-freeze-delegate)进行不可撤销的冻结

## 范围外

集合级别冻结（仅使用资产级别）、永久冻结（见永久冻结委托）和 Token Metadata 冻结权限（不同系统）。

## 快速开始

**跳转到:** [添加插件](#向资产添加冻结委托插件) · [委托权限](#委托冻结权限) · [冻结](#冻结资产) · [解冻](#解冻已冻结资产)

1. 添加冻结委托插件: `addPlugin(umi, { asset, plugin: { type: 'FreezeDelegate', data: { frozen: true } } })`
2. 资产现在已冻结，无法转移
3. 准备好时解冻：使用 `frozen: false` 更新插件
4. 转移时权限被撤销

{% callout type="note" title="何时使用冻结委托 vs 永久冻结委托" %}

| 用例 | 冻结委托 | 永久冻结委托 |
|------|---------|-------------|
| 市场挂单 | ✅ 最佳选择 | ❌ 过度 |
| 无托管质押 | ✅ 最佳选择 | ✅ 也可以 |
| 灵魂绑定代币 | ❌ 转移时撤销 | ✅ 最佳选择 |
| 集合级别冻结 | ❌ 仅资产 | ✅ 支持集合 |
| 租赁协议 | ✅ 最佳选择 | ✅ 也可以 |

当权限应在所有权变更时重置时选择**冻结委托**。
当权限必须永久保持时选择**[永久冻结委托](/zh/smart-contracts/core/plugins/permanent-freeze-delegate)**。

{% /callout %}

## 常见用例

- **无托管质押**: 质押时冻结 NFT，无需转移到托管
- **市场挂单**: 无需托管账户即可锁定待售 NFT
- **游戏物品锁定**: 游戏过程中临时锁定物品
- **租赁协议**: 租借期间锁定 NFT
- **治理**: 投票期间锁定代币
- **抵押品**: 锁定用作借贷抵押品的 NFT
- **锦标赛**: 参赛期间锁定 NFT

## 适用于

|                     |     |
| ------------------- | --- |
| MPL Core 资产      | ✅  |
| MPL Core 集合 | ❌  |

对于集合级别冻结，请使用[永久冻结委托](/zh/smart-contracts/core/plugins/permanent-freeze-delegate)代替。

## 参数

| 参数    | 值 |
| ------ | ----- |
| frozen | bool  |

## 函数

### 向资产添加冻结委托插件

`addPlugin` 命令向资产添加冻结委托插件。此插件允许资产被冻结，防止转移和销毁。

{% dialect-switcher title="向 MPL Core 资产添加冻结插件" %}
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

### 委托冻结权限

`approvePluginAuthority` 命令将冻结权限委托给不同的地址。这允许另一个地址在保持所有权的同时冻结和解冻资产。

{% dialect-switcher title="委托冻结权限" %}
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
        // 如果资产是集合的一部分，必须传入集合
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

冻结委托插件可以更新以更改资产的冻结状态。这与使用下面显示的[冻结资产](#冻结资产)和[解冻已冻结资产](#解冻已冻结资产)函数相同。

### 冻结资产

`freezeAsset` 命令冻结资产，防止其被转移或销毁。这对于无托管质押或市场挂单很有用。

{% dialect-switcher title="冻结 MPL Core 资产" %}
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
    // 将 FreezeDelegate 插件设置为 `frozen: true`
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
        // 如果资产是集合的一部分，传入集合
        .collection(Some(collection))
        .payer(authority.pubkey())
        // 将 FreezeDelegate 插件设置为 `frozen: true`
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

### 解冻已冻结资产

`thawAsset` 命令解冻已冻结的资产，恢复其转移和销毁的能力。

{% dialect-switcher title="解冻 MPL Core 资产" %}
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
    // 将 FreezeDelegate 插件设置为 `frozen: false`
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
        // 如果资产是集合的一部分，传入集合
        .collection(Some(collection))
        .payer(authority.pubkey())
        // 将 FreezeDelegate 插件设置为 `frozen: false`
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

您尝试转移或销毁已冻结的资产。冻结权限必须先解冻它。

### `Authority mismatch`

只有冻结委托权限可以冻结/解冻资产。检查谁拥有插件权限。

### `Plugin not found`

资产没有冻结委托插件。首先使用 `addPlugin` 添加它。

## 注意事项

- 所有者管理：需要所有者签名才能添加
- 资产转移时权限自动撤销
- 冻结的资产仍可更新（允许元数据更改）
- 如果需要权限在转移后保持，使用永久冻结委托
- 冻结立即生效 - 没有确认期

## 快速参考

### 冻结状态

| 状态 | 可转移 | 可销毁 | 可更新 |
|------|--------|--------|--------|
| 解冻 | 是 | 是 | 是 |
| 冻结 | 否 | 否 | 是 |

### 权限行为

| 事件 | 权限结果 |
|------|----------|
| 资产转移 | 权限撤销 |
| 移除插件 | 权限消失 |
| 解冻 | 权限保留 |

## 常见问题

### 我可以冻结不属于我的资产吗？

不可以。冻结委托是所有者管理的，所以只有所有者可以添加它。添加后，您可以将权限委托给另一个地址。

### 冻结委托和永久冻结委托有什么区别？

冻结委托权限在转移时被撤销。永久冻结委托权限永久保持，只能在创建时添加。

### 冻结的资产可以销毁吗？

不可以。冻结的资产阻止转移和销毁。如果要销毁，请先解冻资产。

### 我可以一次冻结整个集合吗？

使用常规冻结委托不可以（仅限资产）。请在集合上使用[永久冻结委托](/zh/smart-contracts/core/plugins/permanent-freeze-delegate) - 它支持集合级别冻结，将一次性冻结该集合中的所有资产。注意永久冻结委托只能在集合创建时添加。

### 冻结会影响元数据更新吗？

不会。资产所有者或更新权限仍然可以在冻结时更新元数据（名称、URI）。只有转移和销毁被阻止。

### 如何实现无托管质押？

1. 添加冻结委托插件，将您的质押程序设为权限
2. 用户质押时：冻结资产
3. 用户取消质押时：解冻资产
4. NFT 永远不会离开用户的钱包

## 相关插件

- [永久冻结委托](/zh/smart-contracts/core/plugins/permanent-freeze-delegate) - 不可撤销的冻结权限，支持集合
- [转移委托](/zh/smart-contracts/core/plugins/transfer-delegate) - 允许委托转移资产
- [销毁委托](/zh/smart-contracts/core/plugins/burn-delegate) - 允许委托销毁资产

## 术语表

| 术语 | 定义 |
|------|------|
| **冻结委托** | 阻止转移和销毁的所有者管理插件 |
| **冻结** | 转移和销毁被阻止的资产状态 |
| **解冻** | 解冻资产以允许再次转移 |
| **委托权限** | 被授权冻结/解冻资产的账户 |
| **无托管** | 无需转移到托管账户的质押/挂单 |
| **所有者管理** | 需要所有者签名才能添加的插件类型 |

---

*由 Metaplex Foundation 维护 · 2026年1月最后验证 · 适用于 @metaplex-foundation/mpl-core*
