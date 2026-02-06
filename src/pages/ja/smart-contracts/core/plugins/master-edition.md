---
title: Master Editionプラグイン
metaTitle: Master Editionプラグイン | Metaplex Core
description: Master Editionプラグインを使用してCollection内のエディションAssetsをグループ化します。プリントと限定版の最大供給量とエディションメタデータを保存します。
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
  - q: Master Editionは最大供給量を強制しますか？
    a: いいえ。maxSupplyは情報提供のみです。ミント中の供給量制限を実際に強制するには、Candy Machineと適切なガードを使用してください。
  - q: Master Editionの名前/uriとCollectionの名前/uriの違いは何ですか？
    a: Master Editionの名前/uriは、ベースCollectionとは異なるエディション固有のメタデータを提供できます。例えば、Collectionが「Abstract Art Series」で、Master Editionの名前が「Limited Print Run 2024」になることがあります。
  - q: オープンエディション（無制限供給）を作成できますか？
    a: はい。maxSupplyをnullに設定するか、完全に省略します。これは定義された制限のないオープンエディションを示します。
  - q: Master EditionとEditionプラグインの両方が必要ですか？
    a: 適切なプリント追跡のためには、はい。Master EditionはCollectionに、Editionは各Assetに追加します。これらは連携して機能します。
  - q: 既存のCollectionにMaster Editionを追加できますか？
    a: はい、AssetsのEditionプラグインとは異なり、Master EditionはaddCollectionPluginを使用して既存のCollectionに追加できます。
---
**Master Editionプラグイン**は、番号付きエディションAssetsをCollection内でグループ化します。「100部限定」のようなプリントシリーズを作成するために、最大供給量、エディション名、URIを保存します。 {% .lead %}
{% callout title="学べること" %}

- CollectionsにMaster Editionを追加
- 最大供給量とメタデータを設定
- Edition Assetsをグループ化
- プリントワークフローを理解
{% /callout %}

## 概要

**Master Edition**プラグインは、[Edition](/smart-contracts/core/plugins/edition) Assetsをグループ化するCollections用のAuthority Managedプラグインです。最大供給量とオプションのエディション固有メタデータを保存します。

- Authority Managed（update authorityが制御）
- Collectionsでのみ動作（Assetsでは不可）
- 値は情報提供のみで、強制されない
- 自動エディション作成にはCandy Machineと一緒に使用

## 対象外

供給量の強制（Candy Machineガードを使用）、個別のエディション番号（AssetsではEditionプラグインを使用）、自動ミント。

## クイックスタート

**ジャンプ先:** [Collectionを作成](#master-editionプラグインを持つcollectionの作成) · [プラグインを更新](#master-editionプラグインの更新)

1. Master Editionプラグインと最大供給量でCollectionを作成
2. Editionプラグイン（番号1, 2, 3...）でAssetsをミント
3. 必要に応じて最大供給量やメタデータを更新
{% callout type="note" title="推奨される使用方法" %}
推奨事項：

- Master Editionプラグインを使用してエディションをグループ化
- Candy MachineとEdition Guardを使用して番号付けを自動処理
{% /callout %}

## 対応

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ❌  |
| MPL Core Collection | ✅  |

## 引数

| 引数       | 値                | ユースケース                                                                         |
| --------- | -------------------- | ------------------------------------------------------------------------------- |
| maxSupply | Option<number> (u32) | 最大プリント数を示す。オープンエディションを許可するためオプション |
| name      | Option<String>       | エディションの名前（Collection名と異なる場合）                      |
| uri       | Option<String>       | エディションのURI（Collection uriと異なる場合）                       |
これらの値はAuthorityによっていつでも変更可能です。純粋に情報提供であり、強制されません。

## Master Editionプラグインを持つCollectionの作成

{% dialect-switcher title="Master Editionプラグインを持つMPL Core Collectionの作成" %}
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

## Master Editionプラグインの更新

Master Editionプラグインが変更可能な場合、他のCollectionプラグインと同様に更新できます：
{% dialect-switcher title="Master Editionプラグインの更新" %}
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
_近日公開_
{% /dialect %}
{% /dialect-switcher %}

## 一般的なエラー

### `Cannot add to Asset`

Master EditionはCollectionsでのみ動作し、個別のAssetsでは動作しません。AssetsにはEditionプラグインを使用してください。

### `Authority mismatch`

Update authorityのみがMaster Editionプラグインを追加または更新できます。

## 注意事項

- すべての値（maxSupply、name、uri）は情報提供のみで、強制されません
- 実際の供給量制限を強制するにはCandy Machineガードを使用
- name/uriはエディション固有のブランディングのためにCollectionメタデータを上書き
- Authorityによっていつでも更新可能

## クイックリファレンス

### 引数

| 引数 | 型 | 必須 | 説明 |
|----------|------|----------|-------------|
| `maxSupply` | `Option<u32>` | いいえ | 最大エディション数（オープンエディションはnull） |
| `name` | `Option<String>` | いいえ | エディション固有の名前 |
| `uri` | `Option<String>` | いいえ | エディション固有のメタデータURI |

### エディションセットアップパターン

| ステップ | アクション | プラグイン |
|------|--------|--------|
| 1 | Collectionを作成 | Master Edition（最大供給量） |
| 2 | Assetsをミント | Edition（番号1, 2, 3...） |
| 3 | 検証 | エディション番号と供給量を確認 |

## FAQ

### Master Editionは最大供給量を強制しますか？

いいえ。`maxSupply`は情報提供のみです。ミント中の供給量制限を実際に強制するには、Candy Machineと適切なガードを使用してください。

### Master Editionの名前/uriとCollectionの名前/uriの違いは何ですか？

Master Editionの名前/uriは、ベースCollectionとは異なるエディション固有のメタデータを提供できます。例えば、Collectionが「Abstract Art Series」で、Master Editionの名前が「Limited Print Run 2024」になることがあります。

### オープンエディション（無制限供給）を作成できますか？

はい。`maxSupply`を`null`に設定するか、完全に省略します。これは定義された制限のないオープンエディションを示します。

### Master EditionとEditionプラグインの両方が必要ですか？

適切なプリント追跡のためには、はい。Master EditionはCollection（グループ化と供給情報）に、Editionは各Asset（個別の番号）に追加します。これらは連携して機能します。

### 既存のCollectionにMaster Editionを追加できますか？

はい、AssetsのEditionプラグインとは異なり、Master Editionは`addCollectionPlugin`を使用して既存のCollectionに追加できます。

## 用語集

| 用語 | 定義 |
|------|------------|
| **Master Edition** | エディションをグループ化し供給量を保存するCollectionプラグイン |
| **Edition** | 個別のエディション番号を保存するAssetプラグイン |
| **オープンエディション** | 最大供給量制限のないエディションシリーズ |
| **来歴** | 起源と所有履歴の記録 |
| **maxSupply** | 最大エディション数（情報提供） |
