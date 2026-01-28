---
title: 永久转移委托
metaTitle: 永久转移委托 | Metaplex Core
description: 授予跨所有权变更持久保持的永久转移权限。用于游戏机制、订阅服务和自动化资产管理。
---

**永久转移委托插件**提供永久保持的不可撤销转移权限。与普通 Transfer Delegate 不同，此权限永不撤销，可以重复转移资产。 {% .lead %}

{% callout title="学习内容" %}

- 创建具有永久转移功能的资产
- 启用集合范围的转移权限
- 用例：游戏、订阅、自动化系统
- 理解永久与普通转移委托的区别

{% /callout %}

## 概述

**永久转移委托**是一个只能在创建时添加的永久插件。委托方无需所有者批准即可无限次转移资产。

- 只能在资产/集合创建时添加
- 权限永久保持（永不撤销）
- 使用 `forceApprove` - 即使冻结也可转移
- 集合级：允许转移集合中的任何资产

## 范围外

普通转移委托（参见 [Transfer Delegate](/zh/smart-contracts/core/plugins/transfer-delegate)）、免托管上架（使用普通委托）和 Token Metadata 转移权限。

## 快速开始

**跳转到：** [创建资产](#创建带有永久转移插件的-mpl-core-资产)

1. 在资产/集合创建时添加 `PermanentTransferDelegate` 插件
2. 将权限设置为您的程序或委托地址
3. 委托方可以随时无限次转移资产

{% callout type="note" title="永久与普通转移委托" %}

| 功能 | Transfer Delegate | Permanent Transfer Delegate |
|------|-------------------|----------------------------|
| 创建后添加 | ✅ 是 | ❌ 仅创建时 |
| 转移时权限保持 | ❌ 1次转移后撤销 | ✅ 永久保持 |
| 多次转移 | ❌ 一次性 | ✅ 无限 |
| 可转移冻结的资产 | ❌ 否 | ✅ 是 (forceApprove) |
| 与集合配合 | ❌ 否 | ✅ 是 |

对于一次性免托管销售，**选择 [Transfer Delegate](/zh/smart-contracts/core/plugins/transfer-delegate)**。
对于需要重复转移的游戏、租赁或自动化系统，**选择 Permanent Transfer Delegate**。

{% /callout %}

## 常见用例

- **游戏机制**：当游戏事件发生时转移资产（战斗失败、交易）
- **租赁归还**：自动将租用的 NFT 归还给所有者
- **订阅管理**：订阅结束或续订时转移代币
- **DAO 财库管理**：允许 DAO 管理资产分配
- **自动化系统**：需要移动资产而无需逐次转移审批的程序

## 适用于

|                     |     |
| ------------------- | --- |
| MPL Core 资产      | ✅  |
| MPL Core 集合 | ✅  |

### 行为
- **资产**：允许使用委托地址转移资产。
- **集合**：允许使用集合权限转移集合中的任何资产。它不会一次性转移所有资产。

## 参数

| 参数    | 值 |
| ------ | ----- |
| frozen | bool  |

## 创建带有永久转移插件的 MPL Core 资产

{% dialect-switcher title="创建带有永久转移插件的 MPL Core 资产" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'

const assetSigner = generateSigner(umi)
const delegate = publicKey('33333333333333333333333333333')

await create(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    {
      type: 'PermanentTransferDelegate',
      authority: { type: 'Address', address: delegate },
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::CreateV1Builder,
    types::{PermanentTransferDelegate, Plugin, PluginAuthority, PluginAuthorityPair},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn create_asset_with_permanent_transfer_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let delegate = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_permanent_transfer_delegate_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::PermanentTransferDelegate(PermanentTransferDelegate {}),
            authority: Some(PluginAuthority::Address { address: delegate }),
        }])
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_permanent_transfer_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_permanent_transfer_delegate_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_permanent_transfer_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## 常见错误

### `Cannot add permanent plugin after creation`

永久插件只能在资产/集合创建时添加。您无法向现有资产添加永久转移委托。

### `Authority mismatch`

只有插件权限才能转移。验证您使用的是正确的密钥对进行签名。

## 注意事项

- **仅创建时**：资产/集合存在后无法添加
- **强制批准**：即使冻结也可转移
- **集合行为**：可以单独转移集合中的任何资产
- **永久保持**：权限永不撤销
- **无限转移**：委托方转移次数没有限制

## 常见问题

### Transfer Delegate 和 Permanent Transfer Delegate 有什么区别？

普通 Transfer Delegate 在一次转移后被撤销。Permanent Transfer Delegate 永久保持，可以无限次转移。

### Permanent Transfer Delegate 可以转移冻结的资产吗？

可以。永久插件使用 `forceApprove`，这会覆盖冻结拒绝。

### 我可以将此添加到现有资产吗？

不可以。永久插件只能在资产创建时添加。对于现有资产，请使用普通 Transfer Delegate。

### 集合级永久转移委托如何工作？

委托方可以转移集合中的任何单个资产，但不是一次全部转移。每次转移都是单独的交易。

## 相关插件

- [Transfer Delegate](/zh/smart-contracts/core/plugins/transfer-delegate) - 一次性转移权限
- [Permanent Freeze Delegate](/zh/smart-contracts/core/plugins/permanent-freeze-delegate) - 永久冻结权限
- [Permanent Burn Delegate](/zh/smart-contracts/core/plugins/permanent-burn-delegate) - 永久销毁权限

## 术语表

| 术语 | 定义 |
|------|------|
| **Permanent Plugin** | 只能在创建时添加并永久保持的插件 |
| **forceApprove** | 覆盖其他插件拒绝的验证 |
| **Collection Transfer** | 转移集合中任何资产的能力 |

---

*由 Metaplex Foundation 维护 · 2026年1月最终验证 · 适用于 @metaplex-foundation/mpl-core*
