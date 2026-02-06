---
title: 添加外部插件
metaTitle: 添加外部插件 | Metaplex Core
description: 学习如何向 Core Asset 和 Collection 添加 Oracle 和 AppData 插件。包含 JavaScript 和 Rust 代码示例。
updated: '01-31-2026'
keywords:
  - add external plugin
  - add Oracle
  - add AppData
  - external plugin setup
about:
  - External plugin setup
  - Oracle configuration
  - AppData configuration
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
faqs:
  - q: 我可以向一个 Asset 添加多个外部插件吗？
    a: 可以。您可以向单个 Asset 添加多个 Oracle 和/或 AppData 插件。
  - q: 我需要先创建 Oracle 账户吗？
    a: 是的。在添加 Oracle 插件适配器之前，Oracle 账户必须已经存在。
  - q: 创建时添加和之后添加有什么区别？
    a: 功能上没有区别。创建时添加更高效（一个交易）。之后添加需要单独的交易。
---
本指南展示如何向 Core Asset 和 Collection **添加外部插件**（Oracle、AppData）。可以在创建时添加，也可以添加到现有的 Asset/Collection。{% .lead %}
{% callout title="您将学到" %}

- 在 Asset/Collection 创建期间添加外部插件
- 向现有 Asset/Collection 添加外部插件
- 配置 Oracle 生命周期检查
- 使用数据权限设置 AppData
{% /callout %}

## 概要

使用带有 `plugins` 数组的 `create()` 添加外部插件，或使用 `addPlugin()` 添加到现有 Asset。Collection 使用 `createCollection()` 和 `addCollectionPlugin()`。

- 创建时添加：包含在 `plugins` 数组中
- 添加到现有：使用 `addPlugin()` / `addCollectionPlugin()`
- 需要更新权限签名
- 为 Oracle 插件配置生命周期检查

## 超出范围

移除外部插件（参见[移除外部插件](/smart-contracts/core/external-plugins/removing-external-plugins)）、更新插件数据和内置插件（参见[添加插件](/smart-contracts/core/plugins/adding-plugins)）。

## 快速开始

**跳转至：** [创建带插件的 Asset](#creating-a-core-asset-with-an-external-plugin) · [添加到现有 Asset](#adding-a-external-plugin-to-a-core-asset) · [创建带插件的 Collection](#creating-a-core-collection-with-an-external-plugin)

1. 准备您的 Oracle 账户或 AppData 配置
2. 在创建时添加插件或通过 `addPlugin()` 添加
3. 配置生命周期检查（Oracle）或数据权限（AppData）

## Asset

### 创建带外部插件的 Core Asset

{% dialect-switcher title="创建带外部插件的 Core Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { create, CheckResult } from '@metaplex-foundation/mpl-core'
const assetSigner = publicKey('11111111111111111111111111111111')
const oracleAccount = publicKey('22222222222222222222222222222222')
await create(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    {
      type: 'Oracle',
      resultsOffset: {
        type: 'Anchor',
      },
      lifecycleChecks: {
        update: [CheckResult.CAN_REJECT],
      },
      baseAddress: oracleAccount,
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::CreateV2Builder,
    types::{
        ExternalCheckResult, ExternalPluginAdapterInitInfo, HookableLifecycleEvent, OracleInitInfo,
        ValidationResultsOffset,
    },
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn create_asset_with_oracle_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let payer = Keypair::new();
    let asset = Keypair::new();
    let onchain_oracle_account = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let create_asset_with_oracle_plugin_ix = CreateV2Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .external_plugins_adapters(vec![ExternalPluginAdapterInitInfo::Oracle(OracleInitInfo {
            base_address: onchain_oracle_account,
            init_plugin_authority: None,
            lifecycle_checks: vec![(
                HookableLifecycleEvent::Transfer,
                ExternalCheckResult { flags: 4 },
            )],
            base_address_config: None,
            results_offset: Some(ValidationResultsOffset::Anchor),
        })])
        .instruction();
    let signers = vec![&asset, &payer];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let create_asset_with_burn_transfer_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_burn_transfer_delegate_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_burn_transfer_delegate_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

### 向 Core Asset 添加外部插件

{% dialect-switcher title="添加带有指定权限的插件" %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::AddExternalPluginAdapterV1Builder,
    types::{
        ExternalCheckResult, ExternalPluginAdapterInitInfo, HookableLifecycleEvent,
        OracleInitInfo, ValidationResultsOffset,
    },
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn add_oracle_plugin_to_asset() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let oracle_plugin = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let add_oracle_plugin_to_asset_ix = AddExternalPluginAdapterV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .init_info(ExternalPluginAdapterInitInfo::Oracle(OracleInitInfo {
            base_address: oracle_plugin,
            results_offset: Some(ValidationResultsOffset::Anchor),
            lifecycle_checks: vec![(
                HookableLifecycleEvent::Transfer,
                ExternalCheckResult { flags: 4 },
            )],
            base_address_config: None,
            init_plugin_authority: None,
        }))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let add_oracle_plugin_to_asset_tx = Transaction::new_signed_with_payer(
        &[add_oracle_plugin_to_asset_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&add_oracle_plugin_to_asset_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin, CheckResult } from '@metaplex-foundation/mpl-core'
const asset = publicKey('11111111111111111111111111111111')
const oracleAccount = publicKey('22222222222222222222222222222222')
addPlugin(umi, {
  asset,
  plugin: {
    type: 'Oracle',
    resultsOffset: {
      type: 'Anchor',
    },
    lifecycleChecks: {
      create: [CheckResult.CAN_REJECT],
    },
    baseAddress: oracleAccount,
  },
})
```

{% /dialect %}
{% /dialect-switcher %}

## Collection

### 创建带外部插件的 Core Collection

{% dialect-switcher title="向 Core Collection 添加外部插件" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import { createCollection, CheckResult } from '@metaplex-foundation/mpl-core'
const collectionSigner = generateSigner(umi)
const oracleAccount = publicKey('22222222222222222222222222222222')
await createCollection(umi, {
  collection: collectionSigner,
  name: 'My Collection',
  uri: 'https://example.com/my-collection.json',
  plugins: [
    {
      type: 'Oracle',
      resultsOffset: {
        type: 'Anchor',
      },
      lifecycleChecks: {
        update: [CheckResult.CAN_REJECT],
      },
      baseAddress: oracleAccount,
    },
    ,
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::CreateCollectionV2Builder,
    types::{
        ExternalCheckResult, ExternalPluginAdapterInitInfo, HookableLifecycleEvent, OracleInitInfo,
        ValidationResultsOffset,
    },
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn create_collection_with_oracle_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let payer = Keypair::new();
    let collection = Keypair::new();
    let onchain_oracle_plugin = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let create_collection_with_oracle_plugin_ix = CreateCollectionV2Builder::new()
        .collection(collection.pubkey())
        .payer(payer.pubkey())
        .name("My Collection".into())
        .uri("https://example.com/my-nft.json".into())
        .external_plugins_adapters(vec![ExternalPluginAdapterInitInfo::Oracle(OracleInitInfo {
            base_address: onchain_oracle_plugin,
            init_plugin_authority: None,
            lifecycle_checks: vec![(
                HookableLifecycleEvent::Transfer,
                ExternalCheckResult { flags: 4 },
            )],
            base_address_config: None,
            results_offset: Some(ValidationResultsOffset::Anchor),
        })])
        .instruction();
    let signers = vec![&collection, &payer];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let create_collection_with_oracle_plugin_tx = Transaction::new_signed_with_payer(
        &[create_collection_with_oracle_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&create_collection_with_oracle_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

### 向 Collection 添加外部插件

{% dialect-switcher title="销毁 Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addCollectionPlugin, CheckResult } from '@metaplex-foundation/mpl-core'
const collection = publicKey('11111111111111111111111111111111')
const oracleAccount = publicKey('22222222222222222222222222222222')
await addCollectionPlugin(umi, {
  collection: collection,
  plugin: {
    type: 'Oracle',
    resultsOffset: {
      type: 'Anchor',
    },
    lifecycleChecks: {
      update: [CheckResult.CAN_REJECT],
    },
    baseAddress: oracleAccount,
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::AddCollectionExternalPluginV1Builder,
    types::{
        ExternalCheckResult, ExternalPluginAdapterInitInfo, HookableLifecycleEvent,
        OracleInitInfo, ValidationResultsOffset,
    },
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn add_oracle_plugin_to_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let oracle_plugin = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let add_oracle_plugin_to_collection_ix = AddCollectionExternalPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .init_info(ExternalPluginAdapterInitInfo::Oracle(OracleInitInfo {
            base_address: oracle_plugin,
            results_offset: Some(ValidationResultsOffset::Anchor),
            lifecycle_checks: vec![(
                HookableLifecycleEvent::Transfer,
                ExternalCheckResult { flags: 4 },
            )],
            base_address_config: None,
            init_plugin_authority: None,
        }))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let add_oracle_plugin_to_collection_tx = Transaction::new_signed_with_payer(
        &[add_oracle_plugin_to_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&add_oracle_plugin_to_collection_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## 常见错误

### `Authority mismatch`

只有更新权限可以添加外部插件。请验证您使用的是正确的密钥对进行签名。

### `Plugin already exists`

具有相同键的外部插件已存在。请先移除它或改为更新它。

### `Invalid Oracle account`

Oracle 基础地址无效或账户不存在。

## 注意事项

- 外部插件是权限管理的（由更新权限控制）
- Oracle 插件需要现有的 Oracle 账户
- AppData 插件需要数据权限才能写入
- Collection 插件不会自动应用于现有 Asset

## 常见问题

### 我可以向一个 Asset 添加多个外部插件吗？

可以。您可以向单个 Asset 添加多个 Oracle 和/或 AppData 插件。

### 我需要先创建 Oracle 账户吗？

是的。在添加 Oracle 插件适配器之前，Oracle 账户必须已经存在。

### 创建时添加和之后添加有什么区别？

功能上没有区别。创建时添加更高效（一个交易）。之后添加需要单独的交易。

## 相关操作

- [移除外部插件](/smart-contracts/core/external-plugins/removing-external-plugins) - 移除外部插件
- [外部插件概述](/smart-contracts/core/external-plugins/overview) - 了解外部插件
- [Oracle 插件](/smart-contracts/core/external-plugins/oracle) - Oracle 配置详情
- [AppData 插件](/smart-contracts/core/external-plugins/app-data) - AppData 配置详情
