---
title: プラグインの削除
metaTitle: プラグインの削除 | Metaplex Core
description: Core NFT Asset と Collection からプラグインを削除する方法を学びます。機能を削除し、プラグインアカウントからレントを回収します。
updated: '01-31-2026'
keywords:
  - remove plugin
  - removePlugin
  - delete plugin
  - recover rent
about:
  - Removing plugins
  - Rent recovery
  - Plugin management
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: プラグインを削除した後、データを復元できますか？
    a: いいえ。プラグインを削除するとすべてのデータが完全に削除されます。削除前に重要なデータをバックアップしてください。
  - q: プラグインを削除するとレントはどうなりますか？
    a: プラグインデータの保存に使用されていたレントは回収され、支払者に返還されます。
  - q: 他の人が委任したプラグインを削除できますか？
    a: はい。そのプラグインの委任された権限者であれば削除できます。
  - q: Permanent プラグインを削除できないのはなぜですか？
    a: Permanent プラグインは作成後に削除できません。ただし、設定は引き続き調整できます。これは、プラグインの存在を保証する必要があるユースケースのための設計です。
  - q: Collection とその Asset のプラグインを一度に削除できますか？
    a: いいえ。Collection プラグインと Asset プラグインは個別に管理されます。ただし、Collection プラグインを削除すると、そこから継承している Asset に影響を与える可能性があります（例：独自の Royalties プラグインを持たない Asset はロイヤリティが適用されなくなります）。
---
このガイドでは、Core Asset と Collection から**プラグインを削除**する方法を説明します。プラグインを削除すると、そのデータと機能が削除されます。 {% .lead %}
{% callout title="学習内容" %}
- Asset からプラグインを削除
- Collection からプラグインを削除
- 削除に必要な権限要件を理解
- 削除したプラグインからレントを回収
{% /callout %}
## 概要
Asset には `removePlugin()`、Collection には `removeCollectionPlugin()` を使用してプラグインを削除します。プラグインを削除できるのはプラグイン権限者のみです。
- 削除するプラグインタイプを指定
- プラグインデータは削除される
- レントは回収される
- Permanent プラグインは削除不可
## 対象外
Permanent プラグインの削除（不可能）、プラグインの更新（[プラグインの更新](/ja/smart-contracts/core/plugins/update-plugins)を参照）、権限の変更（[プラグインの委任](/ja/smart-contracts/core/plugins/delegating-and-revoking-plugins)を参照）。
## クイックスタート
**ジャンプ先:** [Asset から削除](#mpl-core-asset-からプラグインを削除) · [Collection から削除](#collection-からプラグインを削除)
1. 削除するプラグインタイプを特定
2. Asset とプラグインタイプを指定して `removePlugin()` を呼び出す
3. プラグインは即座に削除される
プラグインは MPL Core Asset と MPL Core Collection からも削除できます。
## MPL Core Asset からプラグインを削除
{% dialect-switcher title="MPL Core Asset からプラグインを削除" %}
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
## Collection からプラグインを削除
{% dialect-switcher title="MPL Core Collection からプラグインを削除" %}
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
## よくあるエラー
### `Authority mismatch`
このプラグインを削除する権限がありません。誰がプラグインの権限を持っているか確認してください。
### `Plugin not found`
Asset/Collection にこのプラグインタイプがアタッチされていません。
### `Cannot remove permanent plugin`
Permanent プラグインは作成後に削除できません。永続的にアタッチされています。
## 注意事項
- プラグインを削除するとすべてのデータが削除される
- 削除されたプラグインのレントは回収される
- プラグイン権限者のみがプラグインを削除できる
- Permanent プラグインは削除不可
## クイックリファレンス
### 削除権限の要件
| プラグインタイプ | 削除できる人 |
|-------------|----------------|
| Owner Managed | 所有者または委任者 |
| Authority Managed | Update authority または委任者 |
| Permanent | 削除不可 |
## FAQ
### プラグインを削除した後、データを復元できますか？
いいえ。プラグインを削除するとすべてのデータが完全に削除されます。削除前に重要なデータをバックアップしてください。
### プラグインを削除するとレントはどうなりますか？
プラグインデータの保存に使用されていたレントは回収され、支払者に返還されます。
### 他の人が委任したプラグインを削除できますか？
はい。そのプラグインの委任された権限者であれば削除できます。
### Permanent プラグインを削除できないのはなぜですか？
Permanent プラグインは作成後に削除できません。ただし、設定は引き続き調整できます。これは、プラグインの存在を保証する必要があるユースケースのための設計です。
### Collection とその Asset のプラグインを一度に削除できますか？
いいえ。Collection プラグインと Asset プラグインは個別に管理されます。ただし、Collection プラグインを削除すると、そこから継承している Asset に影響を与える可能性があります（例：独自の Royalties プラグインを持たない Asset はロイヤリティが適用されなくなります）。
## 関連操作
- [プラグインの追加](/ja/smart-contracts/core/plugins/adding-plugins) - Asset/Collection にプラグインを追加
- [プラグインの委任](/ja/smart-contracts/core/plugins/delegating-and-revoking-plugins) - プラグイン権限の変更
- [プラグインの更新](/ja/smart-contracts/core/plugins/update-plugins) - プラグインデータの変更
- [プラグイン概要](/ja/smart-contracts/core/plugins) - 利用可能なプラグインの完全なリスト
## 用語集
| 用語 | 定義 |
|------|------------|
| **Plugin Authority** | プラグインを管理する権限を持つアドレス |
| **Permanent Plugin** | 作成後に削除できないプラグイン |
| **Rent** | Solana でアカウントデータを保存するために預けられる SOL |
| **Owner Managed** | 所有者が削除を制御するプラグイン |
| **Authority Managed** | Update authority が削除を制御するプラグイン |
