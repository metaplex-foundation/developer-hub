---
title: Edition 插件
metaTitle: Edition 插件 | Metaplex Core
description: 向 Core NFT 资产添加版本号。为可收藏系列和限量版追踪如 1/100 的版本号。
---

**Edition 插件**在单个资产上存储版本号。用于创建如"100 个中的第 1 个"这样的编号印刷品，适用于可收藏系列和限量版。 {% .lead %}

{% callout title="您将学到" %}

- 向资产添加版本号
- 创建可变和不可变版本
- 更新版本号
- 了解 Edition 工作流程

{% /callout %}

## 概述

**Edition** 插件是一个权限管理插件，在资产上存储唯一的版本号。最好与集合上的 [Master Edition 插件](/zh/smart-contracts/core/plugins/master-edition)一起使用，以将编号版本组合在一起。

- 权限管理型（update authority 控制）
- 必须在资产创建时添加
- 如果权限可变则可以更新号码
- 使用 Candy Machine Edition Guard 进行自动编号

## 范围之外

供应量强制（仅供参考）、自动编号（使用 Candy Machine）以及集合级版本（集合使用 Master Edition 插件）。

## 快速开始

**跳转到：** [创建可变版本](#使用可变插件创建) · [创建不可变版本](#使用不可变插件创建) · [更新版本](#更新版本插件)

1. 在资产创建时使用唯一编号添加 Edition 插件
2. 可选择将权限设置为 `None` 以实现不可变性
3. 如果可变，稍后可以更新编号

{% callout type="note" title="预期用途" %}

我们建议：

- 使用 Master Edition 插件对版本进行分组
- 使用带有 Edition Guard 的 Candy Machine 自动处理编号

{% /callout %}

## 适用于

|                     |     |
| ------------------- | --- |
| MPL Core 资产       | ✅  |
| MPL Core 集合       | ❌  |

## 参数

| 参数   | 值     |
| ------ | ------ |
| number | number |

该数字是分配给资产的特定值。通常此数字是唯一的，因此创作者应确保一个数字不会被使用两次。

## 使用 editions 插件创建资产

Editions 插件必须在创建资产时添加。只要它是可变的，数字就可以更改。

### 使用可变插件创建

{% dialect-switcher title="使用 Edition 插件创建 MPL Core 资产" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'

const assetSigner = generateSigner(umi)

const result = create(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    {
      type: 'Edition',
      number: 1
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
    types::{Creator, Plugin, PluginAuthority, PluginAuthorityPair, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn create_asset_with_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();
    let authority = Keypair::new();

    let creator = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Asset".into())
        .uri("https://example.com/my-asset.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::Edition(Edition {
                number: 1,
            })
        }])
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /dialect %}

{% /dialect-switcher %}

### 使用不可变插件创建

要创建带有不可变 Edition 插件的资产，可以使用以下代码：

{% dialect-switcher title="向 MPL Core 资产添加 Editions 插件" %}
{% dialect title="JavaScript" id="js" %}

要使 editions 插件不可变，权限必须设置为 `nonePluginAuthority()`：

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'

const asset = generateSigner(umi)

const result = create(umi, {
  asset: asset,
  name: 'My Nft',
  uri: 'https://example.com/my-nft',
  plugins: [
    {
      type: 'Edition',
      number: 1,
      authority: { type: 'None' },
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
    types::{Creator, Plugin, PluginAuthority, PluginAuthorityPair, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn create_asset_with_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();
    let authority = Keypair::new();

    let creator = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::Edition(Edition {
                number: 1,
            }),
            authority: None,
        }])
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /dialect %}

{% /dialect-switcher %}

## 更新版本插件

如果 Editions 插件是可变的，它可以像其他插件一样更新：

{% dialect-switcher title="更新资产上的 Edition 插件" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')

  await updatePlugin(umi, {
    asset: assetAccount.publicKey,
    plugin: { type: 'Edition', number: 2 },
  }).sendAndConfirm(umi);
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}
_即将推出_

{% /dialect %}
{% /dialect-switcher %}

## 常见错误

### `Cannot add Edition plugin after creation`

Edition 插件必须在资产创建期间添加。无法添加到现有资产。

### `Authority mismatch`

只有 update authority 可以更新版本号（如果可变）。

### `Plugin is immutable`

Edition 插件的权限设置为 `None`。无法更改编号。

## 注意事项

- 版本号不强制唯一性 — 创作者必须追踪
- 插件必须在 `create()` 期间添加，不能之后添加
- 将权限设置为 `None` 使版本号永久化
- 与集合上的 Master Edition 插件一起使用以进行正确的分组

## 快速参考

### 权限选项

| 权限 | 可更新 | 用例 |
|------|--------|------|
| `UpdateAuthority` | ✅ | 可变版本号 |
| `None` | ❌ | 永久、不可变版本 |

### 推荐设置

| 组件 | 位置 | 目的 |
|------|------|------|
| Master Edition | 集合 | 版本分组，存储最大供应量 |
| Edition | 资产 | 存储单个版本号 |
| Candy Machine | 铸造 | 自动顺序编号 |

## 常见问题

### 版本号是否强制唯一？

否。版本号仅供参考。创作者负责确保唯一编号。使用带有 Edition Guard 的 Candy Machine 进行自动顺序编号。

### 我可以向现有资产添加 Edition 插件吗？

否。Edition 插件必须在资产创建期间添加。如果您需要版本号，请提前计划。

### 如何创建"100 个中的第 1 个"风格的版本？

向资产添加 Edition 插件（编号 1-100），并向集合添加 `maxSupply: 100` 的 Master Edition 插件。Master Edition 对版本进行分组并指示总供应量。

### 创建后可以更改版本号吗？

可以，如果插件权限未设置为 `None`。update authority 可以使用 `updatePlugin` 修改编号。

### Edition 和 Master Edition 有什么区别？

Edition 在资产上存储单个编号（例如 #5）。Master Edition 在集合上存储集合级数据（最大供应量、版本名称/URI）并将版本组合在一起。

## 术语表

| 术语 | 定义 |
|------|------|
| **Edition Number** | 特定印刷品的唯一标识符（例如 1、2、3） |
| **Master Edition** | 分组版本的集合级插件 |
| **Edition Guard** | 用于自动编号的 Candy Machine 守卫 |
| **Authority Managed** | 由 update authority 控制的插件 |
| **Immutable Edition** | 权限设置为 `None` 的版本 |

---

*由 Metaplex Foundation 维护 · 最后验证于 2026 年 1 月 · 适用于 @metaplex-foundation/mpl-core*
