---
title: 永久冻结委托
metaTitle: 永久冻结委托 | Metaplex Core
description: 使用永久冻结委托插件创建灵魂绑定 NFT 并冻结整个集合。不可撤销的冻结权限永久保持。
---

**永久冻结委托插件**提供跨转移持久存在的不可撤销冻结权限。用于灵魂绑定代币、集合范围冻结和永久锁定机制。 {% .lead %}

{% callout title="学习内容" %}

- 创建具有永久冻结功能的资产
- 一次性冻结整个集合
- 实现灵魂绑定（不可转移）代币
- 理解永久与普通冻结委托的区别

{% /callout %}

## 概述

**永久冻结委托**是一个只能在创建时添加的永久插件。与普通冻结委托不同，此权限永久保持，即使转移后也可以冻结/解冻。

- 只能在资产/集合创建时添加
- 权限跨转移保持（永不撤销）
- 使用 `forceApprove` - 即使有其他阻止插件也可冻结
- 集合级冻结影响集合中的所有资产

## 范围外

普通冻结委托（参见 [Freeze Delegate](/zh/smart-contracts/core/plugins/freeze-delegate)）、临时冻结和 Token Metadata 冻结权限。

## 快速开始

**跳转到：** [创建资产](#创建带有永久冻结插件的资产) · [创建集合](#创建带有永久冻结插件的集合) · [更新（解冻）](#更新资产上的永久冻结委托插件)

1. 在资产/集合创建时添加 `PermanentFreezeDelegate` 插件
2. 设置 `frozen: true` 立即冻结，或设置 `false` 稍后冻结
3. 委托方可以随时冻结/解冻，即使在转移后

{% callout type="note" title="永久与普通冻结委托" %}

| 功能 | Freeze Delegate | Permanent Freeze Delegate |
|------|-----------------|---------------------------|
| 创建后添加 | ✅ 是 | ❌ 仅创建时 |
| 转移时权限保持 | ❌ 撤销 | ✅ 保持 |
| 与集合配合 | ❌ 否 | ✅ 是 |
| forceApprove | ❌ 否 | ✅ 是 |
| 灵魂绑定代币 | ❌ 有限 | ✅ 最佳选择 |

对于临时、可撤销的冻结，**选择 [Freeze Delegate](/zh/smart-contracts/core/plugins/freeze-delegate)**。
对于永久权限或集合范围冻结，**选择 Permanent Freeze Delegate**。

{% /callout %}

## 常见用例

- **灵魂绑定代币**：创建不可转移的凭证、成就或会员资格
- **集合范围冻结**：使用一个插件冻结集合中的所有资产
- **永久抵押品**：锁定即使所有权变更也保持的抵押资产
- **游戏物品永久性**：无论交易如何都保持锁定的物品
- **合规要求**：因监管原因必须保持冻结的资产

## 适用于

|                     |     |
| ------------------- | --- |
| MPL Core 资产      | ✅  |
| MPL Core 集合 | ✅  |

### 行为
- **资产**：允许委托地址随时冻结和解冻 NFT。
- **集合**：允许集合权限一次性冻结和解冻整个集合。它**不**允许使用此委托冻结集合中的单个资产。

## 参数

| 参数    | 值 |
| ------ | ----- |
| frozen | bool  |

## 创建带有永久冻结插件的资产
以下示例展示如何创建带有永久冻结插件的资产。

{% dialect-switcher title="创建带有永久冻结插件的资产" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'

const assetSigner = generateSigner(umi)
const delegate = publicKey('33333333333333333333333333333')

await create(umi, {
  asset: assetSigner,
  name: 'My NFT',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    {
      type: 'PermanentFreezeDelegate',
      frozen: true,
      authority: { type: 'Address', address: delegate },
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use std::str::FromStr;
use mpl_core::{
    instructions::CreateV1Builder,
    types::{PermanentFreezeDelegate, Plugin, PluginAuthority, PluginAuthorityPair},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn create_asset_with_permanent_freeze_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let delegate = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_permanent_freeze_delegate_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::PermanentFreezeDelegate(PermanentFreezeDelegate { frozen: true }),
            authority: Some(PluginAuthority::Address { address: delegate }),
        }])
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_permanent_freeze_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_permanent_freeze_delegate_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_permanent_freeze_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}

{% /dialect-switcher %}

## 更新资产上的永久冻结委托插件
以下示例展示如何更新资产上的永久冻结委托插件。通过将 `frozen` 参数设置为 `true` 或 `false` 来冻结或解冻它。假设签名钱包是插件权限。

{% dialect-switcher title="更新资产上的永久冻结委托插件" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { updatePlugin } from '@metaplex-foundation/mpl-core'

const updateAssetResponse = await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: "PermanentFreezeDelegate",
    frozen: false,
  },
}).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}



## 创建带有永久冻结插件的集合
以下示例展示如何创建带有永久冻结插件的集合。

{% dialect-switcher title="创建带有永久冻结插件的集合" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createCollection } from '@metaplex-foundation/mpl-core'

const collectionSigner = generateSigner(umi)
await createCollection(umi, {
  collection: collectionSigner,
  name: "Frozen Collection",
  uri: "https://example.com/my-collection.json",
  plugins: [
      {
        type: 'PermanentFreezeDelegate',
        frozen: true,
        authority: { type: "UpdateAuthority"}, // 更新权限可以解冻它
      },
    ],
  }).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

## 更新带有永久冻结插件的集合
以下示例展示如何更新集合上的永久冻结委托插件。通过将 `frozen` 参数设置为 `true` 或 `false` 来冻结或解冻它。假设签名钱包是插件权限。

{% dialect-switcher title="更新带有永久冻结插件的集合" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { updateCollectionPlugin } from '@metaplex-foundation/mpl-core'

const updateCollectionResponse =  await updateCollectionPlugin(umi, {
  collection: collectionSigner.publicKey,
  plugin: {
      type: "PermanentFreezeDelegate",
      frozen: false,
    },
  }).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

## 常见错误

### `Cannot add permanent plugin after creation`

永久插件只能在资产/集合创建时添加。您无法向现有资产添加永久冻结委托。

### `Authority mismatch`

只有插件权限才能冻结/解冻。验证您使用的是正确的密钥对进行签名。

## 注意事项

- **仅创建时**：资产/集合存在后无法添加
- **强制批准**：即使有冲突的插件也可以冻结
- **集合行为**：一次性冻结所有资产，而不是单独冻结
- **永久保持**：权限永不撤销，即使转移后也是如此
- 通过设置 `frozen: true` 并将权限设为 `None` 来创建灵魂绑定代币

## 常见问题

### 如何创建灵魂绑定（不可转移）代币？

创建带有 `PermanentFreezeDelegate` 的资产，设置 `frozen: true`，并将权限设为 `None`。该资产将永远无法解冻或转移。

### Freeze Delegate 和 Permanent Freeze Delegate 有什么区别？

普通 Freeze Delegate 权限在转移时被撤销，只能用于资产。Permanent Freeze Delegate 永久保持，可用于集合，并使用 `forceApprove`。

### 我可以单独冻结集合中的资产吗？

不可以。当 Permanent Freeze Delegate 在集合上时，冻结会同时影响所有资产。使用资产级 Permanent Freeze Delegate 进行单独控制。

### 永久冻结的资产可以被销毁吗？

只有在同时有 Permanent Burn Delegate 的情况下才可以。普通 Burn Delegate 无法销毁冻结的资产，但 Permanent Burn Delegate 使用 `forceApprove`。

## 相关插件

- [Freeze Delegate](/zh/smart-contracts/core/plugins/freeze-delegate) - 用于临时锁定的可撤销冻结
- [Permanent Transfer Delegate](/zh/smart-contracts/core/plugins/permanent-transfer-delegate) - 永久转移权限
- [Permanent Burn Delegate](/zh/smart-contracts/core/plugins/permanent-burn-delegate) - 即使冻结也可销毁资产

## 术语表

| 术语 | 定义 |
|------|------|
| **Permanent Plugin** | 只能在创建时添加并永久保持的插件 |
| **forceApprove** | 覆盖其他插件拒绝的验证 |
| **Soulbound** | 永久冻结到钱包的不可转移代币 |
| **Collection Freeze** | 一次性冻结集合中所有资产 |

---

*由 Metaplex Foundation 维护 · 2026年1月最终验证 · 适用于 @metaplex-foundation/mpl-core*
