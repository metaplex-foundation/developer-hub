---
title: Master Edition插件
metaTitle: Master Edition插件 | Metaplex Core
description: 使用Master Edition插件将版本资产分组到集合中。存储印刷系列和限量版的最大供应量和版本元数据。
---

**Master Edition插件**将编号的版本资产分组到集合中。存储最大供应量、版本名称和URI，以创建"限量100份"等印刷系列。 {% .lead %}

{% callout title="学习内容" %}

- 向集合添加Master Edition
- 配置最大供应量和元数据
- 将Edition资产组合在一起
- 了解印刷工作流程

{% /callout %}

## 概述

**Master Edition**插件是一个用于集合的权限管理插件，用于将[Edition](/zh/smart-contracts/core/plugins/edition)资产分组在一起。存储最大供应量和可选的版本特定元数据。

- 权限管理（更新权限控制）
- 仅适用于集合（不适用于资产）
- 值仅供参考，不强制执行
- 与Candy Machine一起使用以自动创建版本

## 范围外

供应量强制执行（使用Candy Machine守卫）、单个版本号（在资产上使用Edition插件）和自动铸造。

## 快速开始

**跳转到：** [创建集合](#creating-a-collection-with-the-master-edition-plugin) · [更新插件](#update-the-master-edition-plugin)

1. 创建带有Master Edition插件和最大供应量的集合
2. 铸造带有Edition插件的资产（编号1、2、3...）
3. 根据需要更新最大供应量或元数据

{% callout type="note" title="推荐用法" %}

建议：

- 使用Master Edition插件对版本进行分组
- 使用带有Edition Guard的Candy Machine自动处理编号

{% /callout %}

## 适用于

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ❌  |
| MPL Core Collection | ✅  |

## 参数

| 参数      | 值                   | 用途                                                         |
| --------- | -------------------- | ----------------------------------------------------------- |
| maxSupply | Option<number> (u32) | 指示最大印刷数量。可选以允许开放版本 |
| name      | Option<String>       | 版本名称（如果与集合名称不同）                   |
| uri       | Option<String>       | 版本的URI（如果与集合URI不同）                   |

这些值可以由权限者随时更改。它们纯粹是信息性的，不强制执行。

## 创建带有Master Edition插件的集合

{% dialect-switcher title="创建带有Master Edition插件的MPL Core集合" %}
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

## 更新Master Edition插件

如果Master Edition插件是可变的，可以像其他集合插件一样进行更新：

{% dialect-switcher title="更新Master Edition插件" %}
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

Master Edition仅适用于集合，不适用于单个资产。对于资产，请使用Edition插件。

### `Authority mismatch`

只有更新权限才能添加或更新Master Edition插件。

## 注意事项

- 所有值（maxSupply、name、uri）仅供参考，不强制执行
- 使用Candy Machine守卫来强制执行实际供应量限制
- name/uri为版本特定品牌覆盖集合元数据
- 权限者可随时更新

## 快速参考

### 参数

| 参数 | 类型 | 必需 | 描述 |
|----------|------|----------|-------------|
| `maxSupply` | `Option<u32>` | 否 | 最大版本数（开放版本为null） |
| `name` | `Option<String>` | 否 | 版本特定名称 |
| `uri` | `Option<String>` | 否 | 版本特定元数据URI |

### 版本设置模式

| 步骤 | 操作 | 插件 |
|------|--------|--------|
| 1 | 创建集合 | Master Edition（最大供应量） |
| 2 | 铸造资产 | Edition（编号1、2、3...） |
| 3 | 验证 | 检查版本号和供应量 |

## 常见问题

### Master Edition是否强制执行最大供应量？

否。`maxSupply`仅供参考。要在铸造时实际强制供应量限制，请使用带有适当守卫的Candy Machine。

### Master Edition的name/uri与集合的name/uri有什么区别？

Master Edition的name/uri可以提供与基础集合不同的版本特定元数据。例如，集合可能是"抽象艺术系列"，而Master Edition名称可以是"2024年限量印刷版"。

### 我可以创建开放版本（无限供应）吗？

可以。将`maxSupply`设置为`null`或完全省略。这表示没有定义限制的开放版本。

### 我需要同时使用Master Edition和Edition插件吗？

为了正确的印刷跟踪，是的。Master Edition应用于集合（分组和供应信息），Edition应用于每个资产（单个编号）。它们协同工作。

### 我可以将Master Edition添加到现有集合吗？

可以，与资产上的Edition插件不同，Master Edition可以使用`addCollectionPlugin`添加到现有集合。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Master Edition** | 对版本进行分组并存储供应量的集合插件 |
| **Edition** | 存储单个版本号的资产插件 |
| **Open Edition** | 没有最大供应量限制的版本系列 |
| **Provenance** | 来源和所有权历史记录 |
| **maxSupply** | 最大版本数（信息性） |

---

*由Metaplex Foundation维护 · 2026年1月最后验证 · 适用于@metaplex-foundation/mpl-core*
