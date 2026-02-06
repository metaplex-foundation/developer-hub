---
title: 外部プラグインの追加
metaTitle: 外部プラグインの追加 | Metaplex Core
description: Core AssetsとCollectionsにOracleおよびAppDataプラグインを追加する方法を学びます。JavaScriptとRustのコード例。
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
  - q: 1つのAssetに複数の外部プラグインを追加できますか？
    a: はい。1つのAssetに複数のOracleおよび/またはAppDataプラグインを追加できます。
  - q: 最初にOracleアカウントを作成する必要がありますか？
    a: はい。Oracleプラグインアダプターを追加する前に、Oracleアカウントが存在している必要があります。
  - q: 作成時に追加する場合と後から追加する場合の違いは何ですか？
    a: 機能的な違いはありません。作成時に追加する方が効率的です（1つのトランザクション）。後から追加する場合は、別のトランザクションが必要です。
---
このガイドでは、Core AssetsとCollectionsに**外部プラグイン**（Oracle、AppData）を追加する方法を説明します。作成時または既存のAssets/Collectionsに追加します。 {% .lead %}
{% callout title="学べること" %}

- Asset/Collection作成時に外部プラグインを追加
- 既存のAssets/Collectionsに外部プラグインを追加
- Oracleライフサイクルチェックの設定
- data authorityを使用したAppDataの設定
{% /callout %}

## 概要

`plugins`配列を持つ`create()`を使用するか、既存のAssetsには`addPlugin()`を使用して外部プラグインを追加します。Collectionsは`createCollection()`と`addCollectionPlugin()`を使用します。

- 作成時に追加：`plugins`配列に含める
- 既存に追加：`addPlugin()` / `addCollectionPlugin()`を使用
- update authorityの署名が必要
- Oracleプラグインのライフサイクルチェックを設定

## 対象外

外部プラグインの削除（[外部プラグインの削除](/smart-contracts/core/external-plugins/removing-external-plugins)を参照）、プラグインデータの更新、および組み込みプラグイン（[プラグインの追加](/smart-contracts/core/plugins/adding-plugins)を参照）。

## クイックスタート

**ジャンプ先:** [プラグイン付きAssetの作成](#外部プラグイン付きcore-assetの作成) · [既存Assetへの追加](#core-assetへの外部プラグインの追加) · [プラグイン付きCollectionの作成](#外部プラグイン付きcore-collectionの作成)

1. OracleアカウントまたはAppData設定を準備
2. 作成時または`addPlugin()`でプラグインを追加
3. ライフサイクルチェック（Oracle）またはdata authority（AppData）を設定

## Assets

### 外部プラグイン付きCore Assetの作成

{% dialect-switcher title="外部プラグイン付きCore Assetの作成" %}
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

### Core Assetへの外部プラグインの追加

{% dialect-switcher title="割り当てられたauthorityを持つプラグインの追加" %}
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

## Collections

### 外部プラグイン付きCore Collectionの作成

{% dialect-switcher title="Core Collectionへの外部プラグインの追加" %}
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

### Collectionへの外部プラグインの追加

{% dialect-switcher title="Assetsのバーン" %}
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

## 一般的なエラー

### `Authority mismatch`

update authorityのみが外部プラグインを追加できます。正しいキーペアで署名していることを確認してください。

### `Plugin already exists`

同じキーを持つ外部プラグインが既に存在します。最初に削除するか、代わりに更新してください。

### `Invalid Oracle account`

Oracleベースアドレスが無効であるか、アカウントが存在しません。

## 注意事項

- 外部プラグインはAuthority Managed（update authorityが制御）
- Oracleプラグインには既存のOracleアカウントが必要
- AppDataプラグインには書き込み権限のためのData Authorityが必要
- Collectionプラグインは既存のAssetsには自動的に適用されない

## FAQ

### 1つのAssetに複数の外部プラグインを追加できますか？

はい。1つのAssetに複数のOracleおよび/またはAppDataプラグインを追加できます。

### 最初にOracleアカウントを作成する必要がありますか？

はい。Oracleプラグインアダプターを追加する前に、Oracleアカウントが存在している必要があります。

### 作成時に追加する場合と後から追加する場合の違いは何ですか？

機能的な違いはありません。作成時に追加する方が効率的です（1つのトランザクション）。後から追加する場合は、別のトランザクションが必要です。

## 関連操作

- [外部プラグインの削除](/smart-contracts/core/external-plugins/removing-external-plugins) - 外部プラグインの削除
- [外部プラグイン概要](/smart-contracts/core/external-plugins/overview) - 外部プラグインの理解
- [Oracleプラグイン](/smart-contracts/core/external-plugins/oracle) - Oracle設定の詳細
- [AppDataプラグイン](/smart-contracts/core/external-plugins/app-data) - AppData設定の詳細
