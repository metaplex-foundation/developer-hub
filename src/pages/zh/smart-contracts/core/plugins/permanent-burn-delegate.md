---
title: 永久销毁委托
metaTitle: 永久销毁委托 | Metaplex Core
description: 授予永久销毁权限，即使资产被冻结也可以销毁。用于游戏机制、订阅到期和自动化资产生命周期管理。
---

**永久销毁委托插件**提供永久保持的不可撤销销毁权限。委托方即使在资产被冻结时也可以销毁资产，非常适合游戏和订阅服务。 {% .lead %}

{% callout title="学习内容" %}

- 创建具有永久销毁功能的资产
- 启用集合范围的销毁权限
- 销毁冻结的资产（forceApprove 行为）
- 用例：游戏、订阅、自动化清理

{% /callout %}

## 概述

**永久销毁委托**是一个只能在创建时添加的永久插件。委托方可以随时销毁资产，即使资产被冻结。

- 只能在资产/集合创建时添加
- 权限永久保持（永不撤销）
- 使用 `forceApprove` - 即使冻结也可销毁
- 集合级：允许销毁集合中的任何资产

## 范围外

普通销毁委托（参见 [Burn Delegate](/zh/smart-contracts/core/plugins/burn-delegate)）、条件销毁和 Token Metadata 销毁权限。

## 快速开始

**跳转到：** [创建资产](#创建带有永久销毁插件的资产)

1. 在资产/集合创建时添加 `PermanentBurnDelegate` 插件
2. 将权限设置为您的程序或委托地址
3. 委托方可以随时销毁资产，即使被冻结

{% callout type="note" title="永久与普通销毁委托" %}

| 功能 | Burn Delegate | Permanent Burn Delegate |
|------|---------------|-------------------------|
| 创建后添加 | ✅ 是 | ❌ 仅创建时 |
| 转移时权限保持 | ❌ 撤销 | ✅ 永久保持 |
| 可销毁冻结的资产 | ❌ 否 | ✅ 是 (forceApprove) |
| 与集合配合 | ❌ 否 | ✅ 是 |
| 紧急销毁 | ❌ 有限 | ✅ 最佳选择 |

对于用户可撤销的销毁权限，**选择 [Burn Delegate](/zh/smart-contracts/core/plugins/burn-delegate)**。
对于游戏、紧急销毁或自动化清理，**选择 Permanent Burn Delegate**。

{% /callout %}

## 常见用例

- **游戏机制**：当物品在游戏中被消耗、丢失或销毁时销毁资产
- **订阅到期**：即使冻结也自动销毁过期的订阅代币
- **紧急销毁**：无论状态如何都可以移除损坏或不需要的资产
- **合成系统**：制作时销毁原料 NFT（即使被锁定）
- **限时资产**：自动销毁过期内容
- **合规性**：移除违反条款的资产，即使所有者试图冻结它们

## 适用于

|                     |     |
| ------------------- | --- |
| MPL Core 资产      | ✅  |
| MPL Core 集合 | ✅  |

### 行为
- **资产**：允许使用委托地址销毁资产。
- **集合**：允许使用集合权限销毁集合中的任何资产。它不会一次性销毁所有资产。

## 参数

永久销毁插件不包含任何需要传入的参数。

## 创建带有永久销毁插件的资产

{% dialect-switcher title="创建带有永久销毁插件的资产" %}
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
      type: 'PermanentBurnDelegate',
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
    types::{PermanentBurnDelegate, Plugin, PluginAuthority, PluginAuthorityPair},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn create_asset_with_permanent_burn_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let create_asset_with_permanent_burn_delegate_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::PermanentBurnDelegate(PermanentBurnDelegate {}),
            authority: Some(PluginAuthority::None),
        }])
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_permanent_burn_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_permanent_burn_delegate_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_permanent_burn_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}

{% /dialect-switcher %}

## 常见错误

### `Cannot add permanent plugin after creation`

永久插件只能在资产/集合创建时添加。您无法向现有资产添加永久销毁委托。

### `Authority mismatch`

只有插件权限才能销毁。验证您使用的是正确的密钥对进行签名。

## 注意事项

- **仅创建时**：资产/集合存在后无法添加
- **强制批准**：即使冻结也可以销毁
- **集合行为**：可以单独销毁集合中的任何资产
- **永久保持**：权限永不撤销
- **不可逆**：销毁的资产无法恢复

## 常见问题

### Burn Delegate 和 Permanent Burn Delegate 有什么区别？

普通 Burn Delegate 无法销毁冻结的资产，并在转移时被撤销。Permanent Burn Delegate 可以销毁冻结的资产（forceApprove）并永久保持。

### Permanent Burn Delegate 可以销毁冻结的资产吗？

可以。永久插件使用 `forceApprove`，这会覆盖冻结拒绝。这对于物品必须可销毁的游戏机制很有用。

### 我可以将此添加到现有资产吗？

不可以。永久插件只能在资产创建时添加。对于现有资产，请使用普通 Burn Delegate。

### 集合级永久销毁委托如何工作？

委托方可以销毁集合中的任何单个资产，但不是一次全部销毁。每次销毁都是单独的交易。

### 使用安全吗？

请谨慎使用。委托方可以随时销毁资产而无需所有者批准。只分配给受信任的程序或地址。

## 相关插件

- [Burn Delegate](/zh/smart-contracts/core/plugins/burn-delegate) - 可撤销的销毁权限
- [Permanent Freeze Delegate](/zh/smart-contracts/core/plugins/permanent-freeze-delegate) - 永久冻结权限
- [Permanent Transfer Delegate](/zh/smart-contracts/core/plugins/permanent-transfer-delegate) - 永久转移权限

## 术语表

| 术语 | 定义 |
|------|------|
| **Permanent Plugin** | 只能在创建时添加并永久保持的插件 |
| **forceApprove** | 覆盖其他插件拒绝的验证 |
| **Collection Burn** | 销毁集合中任何资产的能力 |

---

*由 Metaplex Foundation 维护 · 2026年1月最终验证 · 适用于 @metaplex-foundation/mpl-core*
