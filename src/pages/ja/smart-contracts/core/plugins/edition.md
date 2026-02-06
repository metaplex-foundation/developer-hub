---
title: Editionプラグイン
metaTitle: Editionプラグイン | Metaplex Core
description: Core NFT Assetsにエディション番号を追加してプリントと限定版を作成します。コレクティブルシリーズの1/100のようなエディション番号を追跡します。
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
  - q: エディション番号は一意であることが強制されますか？
    a: いいえ。エディション番号は情報提供のみです。クリエイターは一意の番号を確保する責任があります。自動連番にはCandy MachineとEdition Guardを使用してください。
  - q: 既存のAssetにEditionプラグインを追加できますか？
    a: いいえ。Editionプラグインは Asset作成時に追加する必要があります。エディション番号が必要な場合は事前に計画してください。
  - q: 1/100スタイルのエディションを作成するにはどうすればよいですか？
    a: 番号1-100のAssetsにEditionプラグインを追加し、Collectionにmax Supply 100のMaster Editionプラグインを追加します。
  - q: 作成後にエディション番号を変更できますか？
    a: はい、プラグインauthorityがNoneに設定されていなければ可能です。Update authorityはupdatePluginを使用して番号を変更できます。
  - q: EditionとMaster Editionの違いは何ですか？
    a: EditionはAssetに個別の番号を保存します。Master EditionはCollection上にコレクションレベルのデータ（最大供給量、エディション名/URI）を保存します。
---
**Editionプラグイン**は、個々のAssetsにエディション番号を保存します。コレクティブルシリーズや限定版の「1 of 100」のような番号付きプリントを作成するために使用します。 {% .lead %}
{% callout title="学べること" %}
- Assetsにエディション番号を追加
- 変更可能および不変のエディションを作成
- エディション番号を更新
- Editionワークフローを理解
{% /callout %}
## 概要
**Edition**プラグインは、Assetに固有のエディション番号を保存するAuthority Managedプラグインです。番号付きエディションをグループ化するために、Collectionsの[Master Editionプラグイン](/smart-contracts/core/plugins/master-edition)と一緒に使用するのが最適です。
- Authority Managed（update authorityが制御）
- Asset作成時に追加する必要がある
- authorityが変更可能なら番号を更新可能
- 自動番号付けにはCandy Machine Edition Guardを使用
## 対象外
供給量の強制（情報提供のみ）、自動番号付け（Candy Machineを使用）、コレクションレベルのエディション（CollectionsにはMaster Editionプラグインを使用）。
## クイックスタート
**ジャンプ先:** [変更可能なエディションを作成](#変更可能なプラグインで作成) · [不変のエディションを作成](#不変のプラグインで作成) · [エディションを更新](#editionsプラグインの更新)
1. Asset作成時に固有の番号でEditionプラグインを追加
2. オプションで不変性のためにauthorityを`None`に設定
3. 変更可能なら後で番号を更新
{% callout type="note" title="推奨される使用方法" %}
推奨事項：
- Master Editionプラグインを使用してエディションをグループ化
- Candy MachineとEdition Guardを使用して番号付けを自動処理
{% /callout %}
## 対応
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |
## 引数
| 引数    | 値  |
| ------ | ------ |
| number | number |
numberは、Assetに割り当てられる特定の値です。通常この番号は一意であるため、クリエイターは番号が重複して使用されないように注意する必要があります。
## Editionsプラグインを持つAssetの作成
EditionsプラグインはAssetの作成時に追加する必要があります。変更可能である限り、番号は変更できます。
### 変更可能なプラグインで作成
{% dialect-switcher title="Editionプラグインを持つMPL Core Assetの作成" %}
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
### 不変のプラグインで作成
不変のEditionプラグインでAssetを作成するには、以下のコードを使用できます：
{% dialect-switcher title="MPL Core AssetへのEditionsプラグインの追加" %}
{% dialect title="JavaScript" id="js" %}
editionsプラグインを不変にするには、次のようにauthorityを`nonePluginAuthority()`に設定する必要があります：
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
## Editionsプラグインの更新
Editionsプラグインが変更可能な場合、他のプラグインと同様に更新できます：
{% dialect-switcher title="AssetのEditionプラグインの更新" %}
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
_近日公開_
{% /dialect %}
{% /dialect-switcher %}
## 一般的なエラー
### `Cannot add Edition plugin after creation`
Editionプラグインは Asset作成時に追加する必要があります。既存のAssetsには追加できません。
### `Authority mismatch`
（変更可能な場合）update authorityのみがエディション番号を更新できます。
### `Plugin is immutable`
Editionプラグインのauthorityが`None`に設定されています。番号は変更できません。
## 注意事項
- エディション番号は一意であることが強制されません—クリエイターがこれを追跡する必要があります
- プラグインは`create()`中に追加する必要があり、作成後はできません
- authorityを`None`に設定すると、エディション番号は永続的になります
- 適切なグループ化のためにCollectionsのMaster Editionプラグインと一緒に使用
## クイックリファレンス
### Authorityオプション
| Authority | 更新可能 | ユースケース |
|-----------|------------|----------|
| `UpdateAuthority` | ✅ | 変更可能なエディション番号 |
| `None` | ❌ | 永続的で不変のエディション |
### 推奨セットアップ
| コンポーネント | 配置場所 | 目的 |
|-----------|----------|---------|
| Master Edition | Collection | エディションをグループ化、最大供給量を保存 |
| Edition | Asset | 個別のエディション番号を保存 |
| Candy Machine | ミント | 自動連番 |
## FAQ
### エディション番号は一意であることが強制されますか？
いいえ。エディション番号は情報提供のみです。クリエイターは一意の番号を確保する責任があります。自動連番にはCandy MachineとEdition Guardを使用してください。
### 既存のAssetにEditionプラグインを追加できますか？
いいえ。Editionプラグインは Asset作成時に追加する必要があります。エディション番号が必要な場合は事前に計画してください。
### 「1 of 100」スタイルのエディションを作成するにはどうすればよいですか？
Assetsに（番号1-100で）Editionプラグインを追加し、Collectionに`maxSupply: 100`でMaster Editionプラグインを追加します。Master Editionはエディションをグループ化し、総供給量を示します。
### 作成後にエディション番号を変更できますか？
はい、プラグインauthorityが`None`に設定されていなければ可能です。Update authorityは`updatePlugin`を使用して番号を変更できます。
### EditionとMaster Editionの違いは何ですか？
EditionはAssetに個別の番号（例：#5）を保存します。Master EditionはCollection上にコレクションレベルのデータ（最大供給量、エディション名/URI）を保存し、エディションをグループ化します。
## 用語集
| 用語 | 定義 |
|------|------------|
| **エディション番号** | 特定のプリントの固有識別子（例：1, 2, 3） |
| **Master Edition** | エディションをグループ化するCollectionレベルのプラグイン |
| **Edition Guard** | 自動番号付けのためのCandy Machineガード |
| **Authority Managed** | Update authorityによって制御されるプラグイン |
| **不変エディション** | authorityが`None`に設定されたエディション |
