---
title: 外部プラグインの削除
metaTitle: 外部プラグインの削除 | Metaplex Core
description: Core AssetsとCollectionsからOracleおよびAppDataプラグインを削除する方法を学びます。JavaScriptとRustのコード例。
updated: '01-31-2026'
keywords:
  - remove external plugin
  - remove Oracle
  - remove AppData
  - delete plugin
about:
  - External plugin removal
  - Cleanup procedures
  - Authority requirements
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Oracleプラグインを削除するとOracleアカウントも削除されますか？
    a: いいえ。Asset上のプラグインアダプターのみが削除されます。外部Oracleアカウントは残り、再利用できます。
  - q: 削除前にAppDataを復元できますか？
    a: はい。データを保存する必要がある場合は、プラグインを削除する前にfetchAsset()を使用してAppDataを読み取ってください。
  - q: レントはどうなりますか？
    a: プラグインアダプターからのレントは回収され、トランザクションの支払者に返されます。
---
このガイドでは、Core AssetsとCollectionsから**外部プラグイン**を削除する方法を説明します。不要になったOracleまたはAppDataプラグインを削除します。 {% .lead %}
{% callout title="学べること" %}

- Assetsから外部プラグインを削除
- Collectionsから外部プラグインを削除
- authority要件の理解
- 削除されたプラグインからのレントの回収
{% /callout %}

## 概要

Assetsには`removePlugin()`を、Collectionsには`removeCollectionPlugin()`を使用して外部プラグインを削除します。プラグインauthorityのみが外部プラグインを削除できます。

- プラグインタイプとベースアドレスを指定
- プラグインデータは削除される
- レントは回収される
- プラグインauthorityの署名が必要

## 対象外

外部プラグインの追加（[外部プラグインの追加](/smart-contracts/core/external-plugins/adding-external-plugins)を参照）、プラグインデータの更新、および組み込みプラグインの削除（[プラグインの削除](/smart-contracts/core/plugins/removing-plugins)を参照）。

## クイックスタート

**ジャンプ先:** [Assetから削除](#assetから削除) · [Collectionから削除](#collectionから削除)

1. 削除するプラグインタイプとベースアドレスを特定
2. プラグインキーを指定して`removePlugin()`を呼び出し
3. プラグインは即座に削除され、レントは回収される

## Assetから削除

{% dialect-switcher title="Assetから外部プラグインを削除" %}
{% dialect title="JavaScript" id="js" %}
Assetから外部プラグインアダプターを削除するには、`removePlugin()`関数を使用する必要があります。

```ts
import {publicKey } from '@metaplex-foundation/umi'
import { removePlugin, CheckResult } from '@metaplex-foundation/mpl-core'
const asset = publicKey('1111111111111111111111111111111')
const oracleAccount = publicKey('2222222222222222222222222222222')
await removePlugin(umi, {
  asset,
  plugin: {
    type: 'Oracle',
    baseAddress: oracleAccount,
  },
})
```

{% /dialect  %}
{% dialect title="Rust" id="rust" %}
Assetから外部プラグインアダプターを削除するには、`RemoveExternalPluginAdapterV1Builder()`関数を使用する必要があります。

```rust
use mpl_core::{instructions::RemoveExternalPluginAdapterV1Builder, types::ExternalPluginAdapterKey};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn remove_external_plugin_adapter_from_asset() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let oracle_account = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let remove_external_plugin_adapter_from_asset_ix = RemoveExternalPluginAdapterV1Builder::new()
        .asset(asset)
        .key(ExternalPluginAdapterKey::Oracle(oracle_account))
        .payer(authority.pubkey())
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let remove_external_plugin_adapter_from_asset_tx = Transaction::new_signed_with_payer(
        &[remove_external_plugin_adapter_from_asset_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&remove_external_plugin_adapter_from_asset_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect  %}
{% /dialect-switcher %}

## Collectionから削除

{% dialect-switcher title="Collectionから外部プラグインを削除" %}
{% dialect title="JavaScript" id="js" %}
Collectionから外部プラグインアダプターを削除するには、`removeCollectionPlugin()`関数を使用する必要があります。

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { removeCollectionPlugin, CheckResult } from '@metaplex-foundation/mpl-core'
const collection = publicKey('1111111111111111111111111111111')
const oracleAccount = publicKey('2222222222222222222222222222222')
removeCollectionPlugin(umi, {
  collection,
  plugin: {
    type: 'Oracle',
    baseAddress: publicKey(oracleAccount),
  },
})
```

{% /dialect  %}
{% dialect title="Rust" id="rust" %}
Collectionから外部プラグインアダプターを削除するには、`RemoveCollectionExternalPluginAdapterV1Builder()`関数を使用する必要があります。

```rust
use mpl_core::{instructions::RemoveCollectionExternalPluginAdapterV1Builder, types::ExternalPluginAdapterKey};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn remove_external_plugin_adapter_from_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let oracle_account = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let remove_external_plugin_adapter_from_collection_ix = RemoveCollectionExternalPluginAdapterV1Builder::new()
        .collection(collection)
        .key(ExternalPluginAdapterKey::Oracle(oracle_account))
        .payer(authority.pubkey())
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let remove_external_plugin_adapter_from_collection_tx = Transaction::new_signed_with_payer(
        &[remove_external_plugin_adapter_from_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&remove_external_plugin_adapter_from_collection_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect  %}
{% /dialect-switcher %}

## 一般的なエラー

### `Authority mismatch`

プラグインauthorityのみが外部プラグインを削除できます。正しいキーペアで署名していることを確認してください。

### `Plugin not found`

指定されたキーを持つ外部プラグインがこのAsset/Collectionに存在しません。

## 注意事項

- プラグインを削除するとすべてのデータが削除される
- レントは回収され、支払者に返される
- プラグインauthorityのみが削除可能（通常はupdate authority）
- 外部Oracle/AppDataアカウントは削除されない—アダプターのみ

## FAQ

### Oracleプラグインを削除するとOracleアカウントも削除されますか？

いいえ。Asset上のプラグインアダプターのみが削除されます。外部Oracleアカウントは残り、再利用できます。

### 削除前にAppDataを復元できますか？

はい。データを保存する必要がある場合は、プラグインを削除する前に`fetchAsset()`を使用してAppDataを読み取ってください。

### レントはどうなりますか？

プラグインアダプターからのレントは回収され、トランザクションの支払者に返されます。

## 関連操作

- [外部プラグインの追加](/smart-contracts/core/external-plugins/adding-external-plugins) - 外部プラグインの追加
- [外部プラグイン概要](/smart-contracts/core/external-plugins/overview) - 外部プラグインの理解
- [プラグインの削除](/smart-contracts/core/plugins/removing-plugins) - 組み込みプラグインの削除
