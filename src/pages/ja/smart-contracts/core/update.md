---
title: Assetの更新
metaTitle: Assetの更新 | Metaplex Core
description: SolanaでCore NFT Assetのメタデータを更新する方法を学びましょう。Metaplex Core SDKを使用して、名前、URI、コレクションメンバーシップの変更、Assetの不変化を行います。
updated: '01-31-2026'
keywords:
  - update NFT
  - change metadata
  - NFT metadata
  - mpl-core update
  - immutable NFT
about:
  - NFT metadata
  - Update authority
  - Asset immutability
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
howToSteps:
  - Install SDK with npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi
  - Fetch the Asset to get current state
  - Call update(umi, { asset, name, uri }) with new values
  - Verify changes with fetchAsset()
howToTools:
  - Node.js
  - Umi framework
  - mpl-core SDK
faqs:
  - q: Assetを不変にした後、元に戻せますか？
    a: いいえ。Update AuthorityをNoneに設定することは永続的です。Assetの名前、URI、コレクションメンバーシップは永久に固定されます。
  - q: URIを変更せずに名前だけを更新するにはどうすればよいですか？
    a: 変更したいフィールドのみを渡します。現在の値を維持するにはuriを省略してください。
  - q: 更新と転送の違いは何ですか？
    a: 更新はAssetのメタデータ（名前、URI）を変更します。転送は所有権を変更します。それぞれ異なる権限要件を持つ別々の操作です。
  - q: デリゲートはAssetを更新できますか？
    a: はい、Update Delegateプラグインを通じてUpdate Delegateとして割り当てられている場合は可能です。
  - q: 更新にSOLはかかりますか？
    a: 新しいデータが現在のアカウントサイズより大きい場合を除き、更新は無料です。トランザクション手数料（約0.000005 SOL）は引き続き適用されます。
---
このガイドでは、Metaplex Core SDKを使用してSolanaで**Core Assetメタデータを更新**する方法を説明します。管理するAssetの名前、URI、またはコレクションメンバーシップを変更できます。 {% .lead %}
{% callout title="学習内容" %}
- Asset名とメタデータURIの更新
- Assetを別のCollectionに移動
- Assetを不変（永続的）にする
- Update Authority要件の理解
{% /callout %}
## 概要
`update`命令を使用してCore Assetのメタデータを更新します。Update Authority（または承認されたデリゲート）のみがAssetを変更できます。
- `name`と`uri`を変更してメタデータを更新
- `newCollection`を使用してCollection間でAssetを移動
- `updateAuthority`を`None`に設定して不変にする
- アカウントサイズを変更しない限り、更新は無料（レントコストなし）
## スコープ外
Token Metadata NFTの更新（mpl-token-metadataを使用）、プラグインの変更（[プラグイン](/ja/smart-contracts/core/plugins)を参照）、所有権の転送（[Assetの転送](/ja/smart-contracts/core/transfer)を参照）。
## クイックスタート
**ジャンプ先:** [Asset更新](#core-assetの更新) · [Collection変更](#core-assetのcollection変更) · [不変化](#core-assetデータの不変化)
1. インストール: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. 現在の状態を取得するためにAssetをフェッチ
3. 新しい値で`update(umi, { asset, name, uri })`を呼び出す
4. `fetchAsset()`で変更を確認
## 前提条件
- AssetのUpdate Authorityである署名者が設定された**Umi**
- 更新する**Assetアドレス**
- Arweave/IPFSにアップロードされた**新しいメタデータ**（URIを変更する場合）
Core AssetのUpdate Authorityまたはデリゲートは、Assetのデータの一部を変更する権限を持っています。
{% totem %}
{% totem-accordion title="技術的な命令の詳細" %}
**命令アカウントリスト**
| アカウント            | 説明                                     |
| ------------------ | ---------------------------------------- |
| asset              | MPL Core Assetのアドレス                  |
| collection         | Core Assetが属するCollection              |
| payer              | ストレージ手数料を支払うアカウント         |
| authority          | Assetの所有者またはデリゲート             |
| newUpdateAuthority | Assetの新しいUpdate Authority             |
| systemProgram      | System Programアカウント                  |
| logWrapper         | SPL Noop Program                         |
**命令引数**
| 引数     | 説明                       |
| ------- | ------------------------- |
| newName | Core Assetの新しい名前      |
| newUri  | 新しいオフチェーンメタデータURI |
一部のアカウント/引数は、SDKで使いやすくするために抽象化されているか、オプションになっている場合があります。
オンチェーン命令の詳細は[Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/clients/rust/src/generated/instructions/update_v1.rs#L126)で確認できます。
{% /totem-accordion %}
{% /totem %}
## Core Assetの更新
SDKを使用してMPL Core Assetを更新する方法は以下の通りです。
{% code-tabs-imported from="core/update-asset" frameworks="umi" /%}
## Core AssetのCollection変更
SDKを使用してCore AssetのCollectionを変更する方法は以下の通りです。
{% dialect-switcher title="Core AssetのCollection変更" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from "@metaplex-foundation/umi";
import {
  update,
  fetchAsset,
  fetchCollection,
  collectionAddress,
  updateAuthority
} from "@metaplex-foundation/mpl-core";
const assetId = publicKey("11111111111111111111111111111111");
const asset = await fetchAsset(umi, assetId);
const collectionId = collectionAddress(asset)
if (!collectionId) {
  console.log("Collection not found");
  return;
}
const collection = await fetchCollection(umi, collectionId);
const newCollectionId = publicKey("22222222222222222222222222222222")
const updateTx = await update(umi, {
  asset,
  collection,
  newCollection: newCollectionId,
  newUpdateAuthority: updateAuthority('Collection', [newCollectionId]),
}).sendAndConfirm(umi);
```
{% /dialect %}
{% /dialect-switcher %}
## Core Assetデータの不変化
SDKを使用してCore Assetを完全に不変にする方法は以下の通りです。[不変性ガイド](/ja/smart-contracts/core/guides/immutability)で説明されている異なるレベルの不変性があることに注意してください。
{% callout type="warning" title="重要" %}
これは破壊的なアクションであり、Assetを更新する機能が削除されます。
また、Assetが属していたすべてのCollectionからも削除されます。Collection Assetを不変にするには、CollectionのUpdate Authorityを変更する必要があります。
{% /callout %}
{% dialect-switcher title="Core Assetを不変にする" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { update, fetchAsset } from '@metaplex-foundation/mpl-core'
const assetId = publicKey('11111111111111111111111111111111')
const asset = await fetchAsset(umi, asset)
await update(umi, {
  asset: asset,
  newUpdateAuthority: updateAuthority('None'),
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{instructions::UpdateV1Builder, types::UpdateAuthority};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn update_asset_data_to_immutable() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let update_asset_ix = UpdateV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .new_update_authority(UpdateAuthority::None)
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let update_asset_tx = Transaction::new_signed_with_payer(
        &[update_asset_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&update_asset_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## よくあるエラー
### `Authority mismatch`
あなたはAssetのUpdate Authorityではありません。確認してください：
```ts
const asset = await fetchAsset(umi, assetAddress)
console.log(asset.updateAuthority) // 署名者と一致する必要があります
```
### `Collection authority required`
Collectionを変更する場合、AssetとターゲットのCollection両方で権限が必要です。
### `Asset is immutable`
AssetのUpdate Authorityが`None`に設定されています。これは元に戻せません。
## 注意事項
- 更新前にAssetをフェッチして現在の状態を確認する
- Update Authority（またはデリゲート）のみがAssetを更新できる
- Assetを不変にすることは**永続的で元に戻せない**
- Collectionを変更すると継承されたプラグイン（ロイヤリティなど）に影響する可能性がある
- 更新によってAssetの所有者は変わらない
## クイックリファレンス
### 更新パラメータ
| パラメータ | 説明 |
|-----------|-------------|
| `asset` | 更新するAsset（アドレスまたはフェッチされたオブジェクト） |
| `name` | Assetの新しい名前 |
| `uri` | 新しいメタデータURI |
| `newCollection` | ターゲットCollectionアドレス |
| `newUpdateAuthority` | 新しいAuthority（または不変の場合は`None`） |
### Authorityタイプ
| タイプ | 説明 |
|------|-------------|
| `Address` | 特定の公開鍵 |
| `Collection` | CollectionのUpdate Authority |
| `None` | 不変 - 更新不可 |
## FAQ
### Assetを不変にした後、元に戻せますか？
いいえ。Update Authorityを`None`に設定することは永続的です。Assetの名前、URI、コレクションメンバーシップは永久に固定されます。確実な場合のみ行ってください。
### URIを変更せずに名前だけを更新するにはどうすればよいですか？
変更したいフィールドのみを渡します。現在の値を維持するには`uri`を省略してください：
```ts
await update(umi, { asset, name: 'New Name' }).sendAndConfirm(umi)
```
### 更新と転送の違いは何ですか？
更新はAssetのメタデータ（名前、URI）を変更します。転送は所有権を変更します。それぞれ異なる権限要件を持つ別々の操作です。
### デリゲートはAssetを更新できますか？
はい、[Update Delegateプラグイン](/ja/smart-contracts/core/plugins/update-delegate)を通じてUpdate Delegateとして割り当てられている場合は可能です。
### 更新にSOLはかかりますか？
新しいデータが現在のアカウントサイズより大きい場合（まれ）を除き、更新は無料です。トランザクション手数料（約0.000005 SOL）は引き続き適用されます。
## 用語集
| 用語 | 定義 |
|------|------------|
| **Update Authority** | Assetのメタデータを変更する権限を持つアカウント |
| **不変（Immutable）** | 更新できないAsset（Update AuthorityがNone） |
| **URI** | オフチェーンメタデータJSONを指すURL |
| **デリゲート** | プラグインを通じて特定の権限を付与されたアカウント |
| **コレクションメンバーシップ** | Assetが属するCollection |
