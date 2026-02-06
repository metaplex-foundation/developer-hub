---
title: Master Edition 插件
metaTitle: Master Edition 插件 | Metaplex Core
description: 使用 Master Edition 插件将版本 Asset 分组到 Collection 下。存储最大供应量和版本元数据，用于印刷品和限量版。
updated: '01-31-2026'
keywords:
  - master edition
  - max supply
  - print series
  - edition collection
about:
  - Master editions
  - Supply management
  - Edition grouping
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Master Edition 会强制执行最大供应量吗？
    a: 不会。maxSupply 仅供参考。使用带有适当守卫的 Candy Machine 在铸造期间实际强制执行供应限制。
  - q: Master Edition name/uri 和 Collection name/uri 有什么区别？
    a: Master Edition name/uri 可以提供与基础 Collection 不同的版本特定元数据。例如，Collection 可能是"Abstract Art Series"，而 Master Edition 名称可以是"Limited Print Run 2024"。
  - q: 可以创建开放版本（无限供应）吗？
    a: 可以。将 maxSupply 设置为 null 或完全省略。这表示没有定义限制的开放版本。
  - q: 需要同时使用 Master Edition 和 Edition 插件吗？
    a: 对于正确的印刷追踪，是的。Master Edition 用于 Collection，Edition 用于每个 Asset。它们协同工作。
  - q: 可以将 Master Edition 添加到现有 Collection 吗？
    a: 可以，与 Asset 上的 Edition 插件不同，Master Edition 可以使用 addCollectionPlugin 添加到现有 Collection。
---
**Master Edition 插件**将编号的版本 Asset 分组到 Collection 下。存储最大供应量、版本名称和 URI，以创建像"限量 100 份"这样的印刷系列。 {% .lead %}
{% callout title="您将学到" %}

- 向 Collection 添加 Master Edition
- 配置最大供应量和元数据
- 将 Edition Asset 组合在一起
- 了解印刷工作流程
{% /callout %}

## 摘要

**Master Edition** 插件是用于 Collection 的权限管理插件，将 [Edition](/smart-contracts/core/plugins/edition) Asset 组合在一起。存储最大供应量和可选的版本特定元数据。

- 权限管理（更新权限控制）
- 仅适用于 Collection（不适用于 Asset）
- 值仅供参考，不强制执行
- 与 Candy Machine 配合使用以自动创建版本

## 范围外

供应强制执行（使用 Candy Machine 守卫）、单个版本号（在 Asset 上使用 Edition 插件）和自动铸造不在范围内。

## 快速开始

**跳转到：** [创建 Collection](#使用-master-edition-插件创建-collection) · [更新插件](#更新-master-edition-插件)

1. 使用 Master Edition 插件和最大供应量创建 Collection
2. 使用 Edition 插件铸造 Asset（编号 1、2、3...）
3. 根据需要更新最大供应量或元数据
{% callout type="note" title="推荐用法" %}
我们建议：

- 使用 Master Edition 插件对版本进行分组
- 使用带有 Edition Guard 的 Candy Machine 自动处理编号
{% /callout %}

## 兼容性

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ❌  |
| MPL Core Collection | ✅  |

## 参数

| 参数      | 值                   | 用途                                                                           |
| --------- | -------------------- | ------------------------------------------------------------------------------- |
| maxSupply | Option<number> (u32) | 指示最大印刷数量。可选以允许开放版本 |
| name      | Option<String>       | 版本名称（如果与 Collection 名称不同）                     |
| uri       | Option<String>       | 版本 URI（如果与 Collection URI 不同）                      |
这些值可以由权限随时更改。它们纯粹是信息性的，不强制执行。

## 使用 Master Edition 插件创建 Collection

{% dialect-switcher title="使用 Master Edition 插件创建 MPL Core Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import { createCollection } from '@metaplex-foundation/core'
const collectionSigner = generateSigner(umi)
await createCollection(umi, {
  collection: collectionSigner,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  plugins: [
    {
      type: 'MasterEdition',
      maxSupply: 100,
      name: 'My Master Edition',
      uri: 'https://example.com/my-master-edition.json',
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::CreateCollectionV1Builder,
    types::{Creator, Plugin, PluginAuthority, PluginAuthorityPair},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn create_collection_with_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let payer = Keypair::new();
    let collection = Keypair::new();
    let create_collection_ix = CreateCollectionV1Builder::new()
        .collection(collection.pubkey())
        .payer(payer.pubkey())
        .name("My Collection".into())
        .uri("https://example.com/my-collection.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::MasterEdition(MasterEdition {
                max_supply: 100,
                name: "My Master Edition"
                uri: "https://example.com/my-master-edition.json",
            }),
            authority: Some(PluginAuthority::UpdateAuthority),
        }])
        .instruction();
    let signers = vec![&collection, &payer];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let create_collection_tx = Transaction::new_signed_with_payer(
        &[create_collection_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&create_collection_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## 更新 Master Edition 插件

如果 Master Edition 插件是可变的，可以像其他 Collection 插件一样更新：
{% dialect-switcher title="更新 Master Edition 插件" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePluginV1, createPlugin } from '@metaplex-foundation/mpl-core'
const asset = publicKey('11111111111111111111111111111111')
await updatePlugin(umi, {
  asset: asset,
  plugin: {
    type: 'MasterEdition',
    maxSupply: 110,
    name: 'My Master Edition',
    uri: 'https://example.com/my-master-edition',
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}
_即将推出_
{% /dialect %}
{% /dialect-switcher %}

## 常见错误

### `Cannot add to Asset`

Master Edition 仅适用于 Collection，不适用于单个 Asset。对 Asset 使用 Edition 插件。

### `Authority mismatch`

只有更新权限可以添加或更新 Master Edition 插件。

## 注意事项

- 所有值（maxSupply、name、uri）仅供参考——不强制执行
- 使用 Candy Machine 守卫强制执行实际的供应限制
- name/uri 覆盖 Collection 元数据以用于版本特定的品牌
- 权限可以随时更新

## 快速参考

### 参数

| 参数 | 类型 | 必需 | 描述 |
|----------|------|----------|-------------|
| `maxSupply` | `Option<u32>` | 否 | 最大版本数（开放版本为 null） |
| `name` | `Option<String>` | 否 | 版本特定名称 |
| `uri` | `Option<String>` | 否 | 版本特定元数据 URI |

### 版本设置模式

| 步骤 | 操作 | 插件 |
|------|--------|--------|
| 1 | 创建 Collection | Master Edition（最大供应量） |
| 2 | 铸造 Asset | Edition（编号 1、2、3...） |
| 3 | 验证 | 检查版本号和供应量 |

## 常见问题

### Master Edition 会强制执行最大供应量吗？

不会。`maxSupply` 仅供参考。使用带有适当守卫的 Candy Machine 在铸造期间实际强制执行供应限制。

### Master Edition name/uri 和 Collection name/uri 有什么区别？

Master Edition name/uri 可以提供与基础 Collection 不同的版本特定元数据。例如，Collection 可能是"Abstract Art Series"，而 Master Edition 名称可以是"Limited Print Run 2024"。

### 可以创建开放版本（无限供应）吗？

可以。将 `maxSupply` 设置为 `null` 或完全省略。这表示没有定义限制的开放版本。

### 需要同时使用 Master Edition 和 Edition 插件吗？

对于正确的印刷追踪，是的。Master Edition 用于 Collection（分组和供应信息），Edition 用于每个 Asset（单个编号）。它们协同工作。

### 可以将 Master Edition 添加到现有 Collection 吗？

可以，与 Asset 上的 Edition 插件不同，Master Edition 可以使用 `addCollectionPlugin` 添加到现有 Collection。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Master Edition** | 用于分组版本和存储供应量的 Collection 插件 |
| **Edition** | 存储单个版本号的 Asset 插件 |
| **开放版本** | 没有最大供应限制的版本系列 |
| **出处** | 来源和所有权历史的记录 |
| **maxSupply** | 最大版本数（信息性） |
