---
title: Assetの転送
metaTitle: Assetの転送 | Metaplex Core
description: Solanaでウォレット間でCore NFT Assetを転送する方法を学びます。他のユーザーにNFTを送信し、コレクション転送を処理し、転送デリゲートを使用します。
updated: '01-31-2026'
keywords:
  - transfer NFT
  - send NFT
  - NFT ownership
  - mpl-core transfer
  - transfer delegate
about:
  - NFT transfers
  - Ownership change
  - Transfer delegates
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
howToSteps:
  - npm install @metaplex-foundation/mpl-core @metaplex-foundation/umiでSDKをインストール
  - Assetを取得して所有権とコレクションメンバーシップを確認
  - 受取人のアドレスでtransfer(umi, { asset, newOwner })を呼び出す
  - fetchAsset()で所有権が変更されたことを確認
howToTools:
  - Node.js
  - Umi framework
  - mpl-core SDK
faqs:
  - q: AssetがCollection内にあるかどうかはどうやってわかりますか？
    a: Assetを取得してupdateAuthorityを確認します。タイプが'Collection'の場合、そのアドレスをcollectionパラメータとして渡します。
  - q: 自分自身に転送できますか？
    a: はい。自分のアドレスへの転送は有効で、ウォレットの統合やテストに便利です。
  - q: 転送後、Transfer Delegateはどうなりますか？
    a: Transfer Delegateプラグインは転送が完了すると自動的に取り消されます。新しい所有者は必要に応じて新しいデリゲートを割り当てる必要があります。
  - q: 転送をキャンセルできますか？
    a: いいえ。転送はアトミックです - トランザクションが確認されると、所有権は変更されています。キャンセルする保留状態はありません。
  - q: 複数のAssetを一度に転送できますか？
    a: 単一の命令ではできません。1つのトランザクションに複数の転送命令をバッチ処理できますが、各Assetには独自の転送呼び出しが必要です。
  - q: 転送するとupdate authorityは変更されますか？
    a: いいえ。転送は所有権のみを変更します。update authorityはupdate命令で明示的に変更されない限り同じままです。
---
このガイドでは、Metaplex Core SDKを使用してSolana上でウォレット間で**Core Assetを転送**する方法を説明します。単一の命令で他のユーザーにNFTを送信します。 {% .lead %}
{% callout title="学習内容" %}
- Assetを新しい所有者に転送する
- Collection内のAssetの転送を処理する
- 許可された転送にTransfer Delegateを使用する
- 転送権限要件を理解する
{% /callout %}
## 概要
`transfer`命令を使用してCore Assetを新しい所有者に転送します。現在の所有者（または許可されたTransfer Delegate）のみが転送を開始できます。
- 受取人のアドレスで`transfer(umi, { asset, newOwner })`を呼び出す
- Collection Asset の場合、`collection`パラメータを含める
- Transfer Delegateは所有者に代わって転送可能
- 転送は無料（トランザクション手数料のみ）
## 対象外
Token Metadata転送（mpl-token-metadataを使用）、バッチ転送（Assetをループ）、マーケットプレイス販売（エスクロープログラムを使用）。
## クイックスタート
**ジャンプ先：** [基本転送](#transferring-a-core-asset) · [コレクション転送](#transferring-a-core-asset-in-a-collection) · [デリゲート転送](#what-if-i-am-the-transfer-delegate-of-an-asset)
1. インストール：`npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. Assetを取得して所有権とコレクションメンバーシップを確認
3. `transfer(umi, { asset, newOwner })`を呼び出す
4. `fetchAsset()`で所有権が変更されたことを確認
## 前提条件
- Assetを所有する（またはTransfer Delegateである）署名者で構成された**Umi**
- 転送するAssetの**Assetアドレス**
- 新しい所有者の**受取人アドレス**（公開鍵）
Core Assetの所有者は、MPL Coreプログラムへの`transfer`命令を使用して、別のアカウントに所有権を転送できます。
{% totem %}
{% totem-accordion title="技術的な命令の詳細" %}
**命令アカウントリスト**
| アカウント | 説明 |
| ------------- | ----------------------------------------------- |
| asset         | MPL Core Assetのアドレス |
| collection    | Core Assetが属するコレクション |
| authority     | アセットの所有者またはデリゲート |
| payer         | ストレージ手数料を支払うアカウント |
| newOwner      | アセットを転送する新しい所有者 |
| systemProgram | System Programアカウント |
| logWrapper    | SPL Noop Program |
使いやすさのため、一部のアカウントはSDKで抽象化および/またはオプションになっている場合があります。
オンチェーン命令の完全な詳細は[Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L139)で確認できます。
{% /totem-accordion %}
{% /totem %}
## Core Assetの転送
{% code-tabs-imported from="core/transfer-asset" frameworks="umi" /%}
## Collection内のCore Assetの転送
コレクションを持つAssetを転送する場合、コレクションアドレスを渡す必要があります。
[AssetがCollection内にあるかどうかの確認方法]()
{% dialect-switcher title="Collectionの一部であるAssetを転送" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { transferV1 } from '@metaplex-foundation/mpl-core'
const asset = publicKey('11111111111111111111111111111111')
await transferV1(umi, {
  asset: asset.publicKey,
  newOwner: newOwner.publicKey,
  collection: colleciton.publicKey,
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::instructions::TransferV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn transfer_asset_in_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let collection = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let new_owner = Pubkey::from_str("33333333333333333333333333333333").unwrap();
    let transfer_asset_in_collection_ix = TransferV1Builder::new()
        .asset(asset)
        .collection(Some(collection))
        .payer(authority.pubkey())
        .new_owner(new_owner)
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let transfer_asset_in_collection_tx = Transaction::new_signed_with_payer(
        &[transfer_asset_in_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&transfer_asset_in_collection_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## AssetのTransfer Delegateの場合は？
[Transfer Delegate](/ja/smart-contracts/core/plugins/transfer-delegate)プラグインを通じてAssetのTransfer Delegateである場合、Assetの所有者であるかのように`transferV1`関数を呼び出すことができます。
## よくあるエラー
### `Authority mismatch`
Assetの所有者またはTransfer Delegateではありません。所有権を確認してください：
```ts
const asset = await fetchAsset(umi, assetAddress)
console.log(asset.owner) // 署名者と一致する必要があります
```
### `Asset is frozen`
AssetにFreeze Delegateプラグインがあり、現在フリーズされています。転送前にフリーズ権限者が解除する必要があります。
### `Missing collection parameter`
Collection内のAssetの場合、`collection`アドレスを渡す必要があります。Assetにコレクションがあるかどうかを確認してください：
```ts
const asset = await fetchAsset(umi, assetAddress)
if (asset.updateAuthority.type === 'Collection') {
  console.log('Collection:', asset.updateAuthority.address)
}
```
## 注意事項
- 転送は**無料** - レントコストなし、トランザクション手数料のみ（約0.000005 SOL）
- 新しい所有者はAssetの完全な制御を受け取ります
- Transfer、Burn、Freeze Delegateは転送成功後に取り消されます
- フリーズされたAssetは解除されるまで転送できません
- コレクションメンバーシップを確認するために常に最初にAssetを取得してください
## クイックリファレンス
### 転送パラメータ
| パラメータ | 必須 | 説明 |
|-----------|----------|-------------|
| `asset` | はい | Assetアドレスまたは取得したオブジェクト |
| `newOwner` | はい | 受取人の公開鍵 |
| `collection` | コレクション内の場合 | Collectionアドレス |
| `authority` | いいえ | デフォルトは署名者（デリゲート用） |
### 誰が転送できるか？
| 権限 | 転送可能？ |
|-----------|---------------|
| Asset所有者 | はい |
| Transfer Delegate | はい（転送後に取り消し） |
| Update Authority | いいえ |
| Collection Authority | いいえ |
## FAQ
### AssetがCollection内にあるかどうかはどうやってわかりますか？
Assetを取得して`updateAuthority`を確認します：
```ts
const asset = await fetchAsset(umi, assetAddress)
if (asset.updateAuthority.type === 'Collection') {
  // asset.updateAuthority.addressをcollectionパラメータとして渡す
}
```
### 自分自身に転送できますか？
はい。自分のアドレスへの転送は有効です（ウォレットの統合やテストに便利）。
### 転送後、Transfer Delegateはどうなりますか？
Transfer Delegateプラグインは転送が完了すると自動的に取り消されます。新しい所有者は必要に応じて新しいデリゲートを割り当てる必要があります。
### 転送をキャンセルできますか？
いいえ。転送はアトミックです - トランザクションが確認されると、所有権は変更されています。キャンセルする保留状態はありません。
### 複数のAssetを一度に転送できますか？
単一の命令ではできません。1つのトランザクションに複数の転送命令をバッチ処理できます（トランザクションサイズ制限内で）が、各Assetには独自の転送呼び出しが必要です。
### 転送するとupdate authorityは変更されますか？
いいえ。転送は所有権のみを変更します。update authorityは`update`命令で明示的に変更されない限り同じままです。
## 用語集
| 用語 | 定義 |
|------|------------|
| **所有者** | 現在Assetを所有しているウォレット |
| **Transfer Delegate** | 所有者に代わって転送する権限を持つアカウント |
| **フリーズ** | 転送がブロックされるAssetの状態 |
| **新しい所有者** | Assetを受け取る受取人ウォレット |
| **Collection** | Assetが属するCollection（転送要件に影響） |
