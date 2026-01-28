---
title: 外部プラグインの削除
metaTitle: 外部プラグインの削除 | Metaplex Core
description: Core Assets と Collections から Oracle や AppData プラグインを削除する方法を学びます。JavaScript と Rust のコード例を掲載。
---

このガイドでは、Core Assets と Collections から**外部プラグイン**を削除する方法を説明します。不要になった Oracle や AppData プラグインを削除できます。{% .lead %}

{% callout title="学習内容" %}

- Assets から外部プラグインを削除する
- Collections から外部プラグインを削除する
- 権限要件を理解する
- 削除されたプラグインからレントを回収する

{% /callout %}

## 概要

外部プラグインは Assets には `removePlugin()` を、Collections には `removeCollectionPlugin()` を使用して削除します。プラグイン権限のみが外部プラグインを削除できます。

- プラグインタイプとベースアドレスを指定
- プラグインデータは削除される
- レントが回収される
- プラグイン権限の署名が必要

## 対象外

外部プラグインの追加（[外部プラグインの追加](/ja/smart-contracts/core/external-plugins/adding-external-plugins)を参照）、プラグインデータの更新、ビルトインプラグインの削除（[プラグインの削除](/ja/smart-contracts/core/plugins/removing-plugins)を参照）。

## クイックスタート

**ジャンプ先:** [Asset から削除](#remove-from-asset) · [Collection から削除](#remove-from-collection)

1. 削除するプラグインタイプとベースアドレスを特定
2. プラグインキーで `removePlugin()` を呼び出す
3. プラグインは即座に削除され、レントが回収される

## Remove from Asset

{% dialect-switcher title="Asset から外部プラグインを削除" %}
{% dialect title="JavaScript" id="js" %}

Asset から外部プラグインアダプターを削除するには、`removePlugin()` 関数を使用します。

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

Asset から外部プラグインアダプターを削除するには、`RemoveExternalPluginAdapterV1Builder()` 関数を使用します。

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

## Remove from Collection

{% dialect-switcher title="Collection から外部プラグインを削除" %}
{% dialect title="JavaScript" id="js" %}

Collection から外部プラグインアダプターを削除するには、`removeCollectionPlugin()` 関数を使用します。

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

Collection から外部プラグインアダプターを削除するには、`RemoveCollectionExternalPluginAdapterV1Builder()` 関数を使用します。

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

## よくあるエラー

### `Authority mismatch`

外部プラグインを削除できるのはプラグイン権限のみです。正しいキーペアで署名していることを確認してください。

### `Plugin not found`

指定されたキーを持つ外部プラグインがこの Asset/Collection に存在しません。

## 注意事項

- プラグインを削除するとすべてのデータが削除される
- レントが回収され、支払者に返却される
- 削除できるのはプラグイン権限のみ（通常は更新権限）
- 外部の Oracle/AppData アカウントは削除されない - アダプターのみ

## FAQ

### Oracle プラグインを削除すると Oracle アカウントも削除されますか？

いいえ。Asset 上のプラグインアダプターのみが削除されます。外部の Oracle アカウントは残り、再利用できます。

### 削除前に AppData を回収できますか？

はい。データを保存する必要がある場合は、プラグインを削除する前に `fetchAsset()` で AppData を読み取ってください。

### レントはどうなりますか？

プラグインアダプターからのレントは回収され、トランザクションの支払者に返却されます。

## 関連操作

- [外部プラグインの追加](/ja/smart-contracts/core/external-plugins/adding-external-plugins) - 外部プラグインを追加
- [外部プラグイン概要](/ja/smart-contracts/core/external-plugins/overview) - 外部プラグインの理解
- [プラグインの削除](/ja/smart-contracts/core/plugins/removing-plugins) - ビルトインプラグインを削除

---

*Metaplex Foundation によって管理 - 最終確認 2026年1月 - @metaplex-foundation/mpl-core に適用*
