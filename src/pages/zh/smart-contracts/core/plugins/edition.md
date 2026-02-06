---
title: Edition 插件
metaTitle: Edition 插件 | Metaplex Core
description: 向 Core NFT Asset 添加版本号，用于印刷品和限量发行。跟踪像 1/100 这样的版本号用于收藏系列。
updated: '01-31-2026'
keywords:
  - NFT edition
  - edition number
  - limited edition
  - print series
about:
  - Edition numbering
  - Limited runs
  - Print series
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 版本号是否强制唯一？
    a: 不是。版本号仅供参考。创作者负责确保唯一的编号。使用带有 Edition Guard 的 Candy Machine 进行自动顺序编号。
  - q: 可以向现有 Asset 添加 Edition 插件吗？
    a: 不可以。Edition 插件必须在 Asset 创建时添加。如果需要版本号，请提前规划。
  - q: 如何创建 1 of 100 风格的版本？
    a: 向 Asset 添加 Edition 插件（编号 1-100），并向 Collection 添加 maxSupply 为 100 的 Master Edition 插件。
  - q: 创建后可以更改版本号吗？
    a: 可以，如果插件权限未设置为 None。更新权限者可以使用 updatePlugin 修改编号。
  - q: Edition 和 Master Edition 有什么区别？
    a: Edition 在 Asset 上存储单个编号。Master Edition 在 Collection 上存储集合级别的数据（最大供应量、版本名称/URI）。
---
**Edition 插件**在单个 Asset 上存储版本号。用于为收藏系列和限量版创建编号的印刷品，如"1 of 100"。{% .lead %}
{% callout title="学习内容" %}

- 向 Asset 添加版本号
- 创建可变和不可变版本
- 更新版本号
- 了解 Edition 工作流程
{% /callout %}

## 摘要

**Edition** 插件是一个权限管理插件，在 Asset 上存储唯一的版本号。最好与 Collection 上的 [Master Edition 插件](/smart-contracts/core/plugins/master-edition) 一起使用，将编号的版本组合在一起。

- 权限管理（更新权限者控制）
- 必须在 Asset 创建时添加
- 如果权限可变，可以更新编号
- 使用 Candy Machine Edition Guard 进行自动编号

## 范围外

供应量强制（仅供参考）、自动编号（使用 Candy Machine）和 Collection 级别版本（对 Collection 使用 Master Edition 插件）。

## 快速开始

**跳转至：** [创建可变版本](#使用可变插件创建) · [创建不可变版本](#使用不可变插件创建) · [更新版本](#更新-editions-插件)

1. 在 Asset 创建时添加带有唯一编号的 Edition 插件
2. 可选地将权限设为 `None` 以实现不可变性
3. 如果可变，稍后更新编号
{% callout type="note" title="推荐用法" %}
我们建议

- 使用 Master Edition Plugin 对版本进行分组
- 使用带有 Edition Guard 的 Candy Machine 自动处理编号。
{% /callout %}

## 适用于

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |

## 参数

| 参数    | 值  |
| ------ | ------ |
| number | number |
编号是分配给资产的特定值。通常这个编号是唯一的，因此创作者应确保编号不会使用两次。

## 使用 editions 插件创建 Asset

Editions Plugin 必须在资产创建时添加。只要它是可变的，编号就可以更改。

### 使用可变插件创建

{% dialect-switcher title="使用 Edition Plugin 创建 MPL Core Asset" %}
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

要创建带有不可变 Edition Plugin 的 Asset，可以使用以下代码：
{% dialect-switcher title="向 MPL Core Asset 添加 Editions Plugin" %}
{% dialect title="JavaScript" id="js" %}
要使 editions Plugin 不可变，authority 必须设置为 `nonePluginAuthority()`，如下所示：

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

## 更新 Editions 插件

如果 Editions Plugin 是可变的，可以像其他插件一样更新：
{% dialect-switcher title="更新 Asset 上的 Edition Plugin" %}
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

Edition 插件必须在 Asset 创建时添加。不能添加到现有 Asset。

### `Authority mismatch`

只有更新权限者可以更新版本号（如果可变）。

### `Plugin is immutable`

Edition 插件的权限设置为 `None`。编号无法更改。

## 注意事项

- 版本号不强制唯一——创作者必须跟踪
- 插件必须在 `create()` 期间添加，而不是之后
- 将权限设置为 `None` 使版本号永久
- 与 Collection 上的 Master Edition 插件一起使用以正确分组

## 快速参考

### 权限选项

| 权限 | 可更新 | 用例 |
|-----------|------------|----------|
| `UpdateAuthority` | ✅ | 可变版本号 |
| `None` | ❌ | 永久、不可变版本 |

### 推荐设置

| 组件 | 位置 | 目的 |
|-----------|----------|---------|
| Master Edition | Collection | 分组版本，存储最大供应量 |
| Edition | Asset | 存储单个版本号 |
| Candy Machine | 铸造 | 自动顺序编号 |

## 常见问题

### 版本号是否强制唯一？

不是。版本号仅供参考。创作者负责确保唯一的编号。使用带有 Edition Guard 的 Candy Machine 进行自动顺序编号。

### 可以向现有 Asset 添加 Edition 插件吗？

不可以。Edition 插件必须在 Asset 创建时添加。如果需要版本号，请提前规划。

### 如何创建"1 of 100"风格的版本？

向 Asset 添加 Edition 插件（编号 1-100），并向 Collection 添加 `maxSupply: 100` 的 Master Edition 插件。Master Edition 分组版本并指示总供应量。

### 创建后可以更改版本号吗？

可以，如果插件权限未设置为 `None`。更新权限者可以使用 `updatePlugin` 修改编号。

### Edition 和 Master Edition 有什么区别？

Edition 在 Asset 上存储单个编号（例如 #5）。Master Edition 在 Collection 上存储集合级别的数据（最大供应量、版本名称/URI）并将版本组合在一起。

## 术语表

| 术语 | 定义 |
|------|------------|
| **版本号** | 特定印刷品的唯一标识符（例如 1、2、3） |
| **Master Edition** | 分组版本的 Collection 级别插件 |
| **Edition Guard** | 用于自动编号的 Candy Machine 守卫 |
| **权限管理** | 由更新权限者控制的插件 |
| **不可变版本** | 权限设置为 `None` 的版本 |
