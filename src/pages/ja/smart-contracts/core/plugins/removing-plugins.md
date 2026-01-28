---
title: Pluginの削除
metaTitle: Pluginの削除 | Metaplex Core
description: Core NFT AssetとCollectionからPluginを削除する方法を学びます。機能を削除し、Pluginアカウントからレントを回収します。
---

このガイドでは、Core AssetとCollectionから**Pluginを削除する**方法を説明します。Pluginを削除すると、そのデータと機能が削除されます。 {% .lead %}

{% callout title="学習内容" %}

- AssetからPluginを削除
- CollectionからPluginを削除
- 削除の権限要件を理解
- 削除されたPluginからレントを回収

{% /callout %}

## 概要

Assetには`removePlugin()`を、Collectionには`removeCollectionPlugin()`を使用してPluginを削除します。Plugin権限のみがPluginを削除できます。

- 削除するPluginタイプを指定
- Pluginデータが削除される
- レントが回収される
- 永続Pluginは削除不可

## 対象外

永続Pluginの削除（不可能）、Pluginの更新（[Pluginの更新](/ja/smart-contracts/core/plugins/update-plugins)を参照）、権限の変更（[Pluginの委任](/ja/smart-contracts/core/plugins/delegating-and-revoking-plugins)を参照）は対象外です。

## クイックスタート

**ジャンプ：** [Assetから削除](#mpl-core-assetからpluginを削除) · [Collectionから削除](#collectionからpluginを削除)

1. 削除するPluginタイプを特定
2. AssetとPluginタイプで`removePlugin()`を呼び出す
3. Pluginは即座に削除

PluginはMPL Core AssetとMPL Core Collectionからも削除できます。

## MPL Core AssetからPluginを削除

{% dialect-switcher title="MPL Core AssetからPluginを削除" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { removePlugin } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')

await removePlugin(umi, {
  asset: asset.publicKey,
  plugin: { type: 'Attributes' },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{instructions::RemovePluginV1Builder, types::PluginType};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn remove_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let remove_plugin_ix = RemovePluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let remove_plugin_tx = Transaction::new_signed_with_payer(
        &[remove_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&remove_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## CollectionからPluginを削除

{% dialect-switcher title="MPL Core CollectionからPluginを削除" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  removeCollectionPluginV1,
  PluginType,
} from '@metaplex-foundation/mpl-core'

const collectionAddress = publicKey('11111111111111111111111111111111')

await removeCollectionPlugin(umi, {
  collection: collectionAddress,
  pluginType: { type: 'Royalties' },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{instructions::RemoveCollectionPluginV1Builder, types::PluginType};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn remove_collection_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let remove_collection_plugin_ix = RemoveCollectionPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let remove_collection_plugin_tx = Transaction::new_signed_with_payer(
        &[remove_collection_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&remove_collection_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## 一般的なエラー

### `Authority mismatch`

このPluginを削除する権限がありません。誰がPluginの権限を持っているか確認してください。

### `Plugin not found`

Asset/CollectionにはこのPluginタイプがアタッチされていません。

### `Cannot remove permanent plugin`

永続Pluginは作成後に削除できません。永久にアタッチされています。

## 注意事項

- Pluginを削除するとすべてのデータが削除される
- 削除されたPluginからのレントは回収される
- Plugin権限のみがPluginを削除可能
- 永続Pluginは削除不可

## クイックリファレンス

### 削除権限の要件

| Pluginタイプ | 削除可能者 |
|-------------|----------------|
| 所有者管理 | 所有者または委任者 |
| 権限管理 | 更新権限または委任者 |
| 永続 | 削除不可 |

## FAQ

### Pluginを削除した後にデータを回復できますか？

いいえ。Pluginを削除するとすべてのデータが永久に削除されます。削除前に重要なデータをバックアップしてください。

### Pluginを削除するとレントはどうなりますか？

Pluginデータの保存に使用されていたレントは回収され、支払者に返還されます。

### 他の人が委任したPluginを削除できますか？

はい、そのPluginの委任権限であれば、削除できます。

### 永続Pluginを削除できないのはなぜですか？

永続Pluginは不変で、作成後は削除できないように設計されています。これは、永続性が必要なユースケースのための設計です。

### CollectionとそのAssetからPluginを一度に削除できますか？

いいえ。Collection PluginとAsset Pluginは別々に管理されます。Collection Pluginを削除してもCollectionにのみ影響し、そのAssetには影響しません。

## 関連操作

- [Pluginの追加](/ja/smart-contracts/core/plugins/adding-plugins) - Asset/CollectionにPluginを追加
- [Pluginの委任](/ja/smart-contracts/core/plugins/delegating-and-revoking-plugins) - Plugin権限の変更
- [Pluginの更新](/ja/smart-contracts/core/plugins/update-plugins) - Pluginデータの変更
- [Plugin概要](/ja/smart-contracts/core/plugins) - 利用可能なPluginの完全なリスト

## 用語集

| 用語 | 定義 |
|------|------------|
| **Plugin権限** | Pluginを管理する権限を持つアドレス |
| **永続Plugin** | 作成後に削除できないPlugin |
| **レント** | Solanaでアカウントデータを保存するために預けられるSOL |
| **所有者管理** | 所有者が削除を制御するPlugin |
| **権限管理** | 更新権限が削除を制御するPlugin |

---

*Metaplex Foundationによって管理 · 最終確認2026年1月 · @metaplex-foundation/mpl-coreに適用*
