---
title: 转移委托插件
metaTitle: 转移委托插件 | Metaplex Core
description: 允许委托转移 Core NFT 资产。使用转移委托插件进行无托管销售、游戏机制和市场挂单。
---

**转移委托插件**允许指定的权限代表所有者转移 Core 资产。对于无托管市场销售、游戏机制和订阅服务至关重要。{% .lead %}

{% callout title="您将学到" %}

- 向资产添加转移委托插件
- 将转移权限委托给市场或程序
- 作为委托执行转移
- 转移时的权限行为

{% /callout %}

## 摘要

**转移委托**是一个所有者管理插件，允许委托转移资产。委托后，权限可以无需所有者批准将资产转移到任何地址。

- 启用无托管市场挂单
- 权限**在转移后被撤销**（一次性使用）
- 使用[永久转移委托](/zh/smart-contracts/core/plugins/permanent-transfer-delegate)获取持久权限
- 无需额外参数

## 范围外

永久转移权限（见永久转移委托）、集合级别转移和 Token Metadata 转移权限（不同系统）。

## 快速开始

**跳转到:** [添加插件](#向资产添加转移委托插件) · [委托权限](#委托转移权限) · [作为委托转移](#作为委托转移资产)

1. 添加转移委托插件并指定委托地址
2. 委托现在可以转移资产一次
3. 转移后权限自动撤销

## 概述

`转移委托`插件是一个`所有者管理`插件，允许转移委托插件的权限在任何时候转移资产。

转移插件适用于以下领域：

- 无托管资产销售：直接将 NFT 转移给买家，无需托管账户
- 用户根据事件交换/丢失资产的游戏场景：游戏事件发生时自动转移资产
- 订阅服务：作为订阅服务的一部分转移 NFT

{% callout type="note" title="何时使用转移委托 vs 永久转移委托" %}

| 用例 | 转移委托 | 永久转移委托 |
|------|---------|-------------|
| 市场挂单 | ✅ 最佳选择 | ❌ 风险太大 |
| 一次性转移 | ✅ 最佳选择 | ❌ 过度 |
| 租赁返还 | ❌ 一次性使用 | ✅ 最佳选择 |
| 游戏资产交换 | ✅ 最佳选择 | ✅ 也可以 |
| 转移时权限保持 | ❌ 撤销 | ✅ 保持 |

对于一次性无托管销售选择**转移委托**（转移后权限撤销）。
当权限必须永久保持时选择**[永久转移委托](/zh/smart-contracts/core/plugins/permanent-transfer-delegate)**。

{% /callout %}

{% callout title="警告！" %}
转移委托权限是临时的，在资产转移后将被重置。
{% /callout %}

## 适用于

|                     |     |
| ------------------- | --- |
| MPL Core 资产      | ✅  |
| MPL Core 集合 | ❌  |

## 参数

转移插件不包含任何需要传入的参数。

## 函数

### 向资产添加转移委托插件

`addPlugin` 命令向资产添加转移委托插件。此插件允许委托在任何时候转移资产。

{% dialect-switcher title="向 MPL Core 资产添加转移插件" %}
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

`approvePluginAuthority` 命令将转移权限委托给不同的地址。这允许另一个地址在保持所有权的同时转移资产。

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
        // 如果资产是集合的一部分，必须传入集合
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

### 作为委托转移资产

`transfer` 指令使用转移委托权限将资产转移到另一个地址。

{% dialect-switcher title="转移 MPL Core 资产" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  fetchAsset,
  fetchCollection,
  transfer,
} from "@metaplex-foundation/mpl-core";
import { publicKey } from "@metaplex-foundation/umi";

// 您要转移的资产 ID
const assetId = publicKey("11111111111111111111111111111111");

// 获取资产
const assetItem = await fetchAsset(umi, assetId);

// 如果资产是集合的一部分，获取集合
const collectionItem =
    assetItem.updateAuthority.type == "Collection" &&
    assetItem.updateAuthority.address
      ? await fetchCollection(umi, assetItem.updateAuthority.address)
      : undefined;

// 转移 Core NFT 资产
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

## 更新转移委托权限

由于转移委托插件不包含要更新的插件数据（它是一个空对象 `{}`），主要的"更新"操作是更改插件权限。这允许您将转移权限委托给不同的地址。

### 更改转移委托权限

您可以使用 `approvePluginAuthority` 函数更改谁拥有转移权限：

{% dialect-switcher title="更新转移委托权限" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { approvePluginAuthority } from '@metaplex-foundation/mpl-core'

(async () => {
    const assetAddress = publicKey('11111111111111111111111111111111')
    const newDelegate = publicKey('44444444444444444444444444444444')

    // 将转移委托更改为新地址
    await approvePluginAuthority(umi, {
    asset: assetAddress,
    plugin: { type: 'TransferDelegate' },
    newAuthority: { type: 'Address', address: newDelegate },
    }).sendAndConfirm(umi)
})();
```

{% /dialect %}
{% /dialect-switcher %}

### 撤销转移委托权限

可以使用 `revokePluginAuthority` 函数撤销转移权限，将转移控制权返还给资产所有者。

{% dialect-switcher title="撤销转移委托权限" %}
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

只有转移委托权限可以转移资产。验证您使用正确的密钥对签名。

### `Asset is frozen`

冻结的资产无法转移。冻结权限必须先解冻资产。

### `Transfer delegate not found`

资产没有转移委托插件，或者权限在之前的转移后已被撤销。

## 注意事项

- 所有者管理：需要所有者签名才能添加
- 权限**在转移后自动撤销**
- 每次转移都需要新所有者重新委托
- 冻结的资产无法被委托转移
- 使用永久转移委托获取持久权限

## 快速参考

### 权限生命周期

| 事件 | 权限状态 |
|------|----------|
| 添加插件 | 活跃 |
| 资产转移 | **撤销** |
| 新所有者添加插件 | 活跃（新委托） |

### 谁可以转移？

| 权限 | 可以转移？ |
|------|----------|
| 资产所有者 | 是（始终） |
| 转移委托 | 是（一次） |
| 永久转移委托 | 是（始终） |
| 更新权限 | 否 |

## 常见问题

### 为什么我的转移权限被撤销了？

转移委托权限在任何转移后自动撤销。这是为市场安全设计的 - 委托只能转移一次。

### 如何实现无托管挂单？

1. 卖家添加转移委托，将市场设为权限
2. 买家付款时，市场将资产转移给买家
3. 权限被撤销；卖家无法重复挂单

### 转移委托和永久转移委托有什么区别？

转移委托在一次转移后被撤销。永久转移委托永久保持，只能在资产创建时添加。

### 作为委托可以转移冻结的资产吗？

不可以。冻结的资产阻止所有转移，包括委托转移。对于复杂的托管场景，请结合使用永久转移委托和永久冻结委托。

### 每次转移都需要所有者批准吗？

不需要。一旦设置了转移委托，委托可以无需所有者批准进行转移。但是，权限撤销前只能转移一次。

## 相关插件

- [永久转移委托](/zh/smart-contracts/core/plugins/permanent-transfer-delegate) - 不可撤销的转移权限
- [冻结委托](/zh/smart-contracts/core/plugins/freeze-delegate) - 临时阻止转移
- [销毁委托](/zh/smart-contracts/core/plugins/burn-delegate) - 允许委托销毁资产

## 术语表

| 术语 | 定义 |
|------|------|
| **转移委托** | 允许一次性转移权限的所有者管理插件 |
| **所有者管理** | 需要所有者签名才能添加的插件类型 |
| **无托管** | 无需转移到托管账户的销售 |
| **永久转移委托** | 创建时添加的不可撤销版本 |

---

*由 Metaplex Foundation 维护 · 2026年1月最后验证 · 适用于 @metaplex-foundation/mpl-core*
