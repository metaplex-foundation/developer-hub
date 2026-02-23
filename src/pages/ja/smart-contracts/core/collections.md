---
title: Collectionの管理
metaTitle: Core Collection | Metaplex Core
description: SolanaでCore Collectionを作成・管理する方法を学びましょう。NFT Assetをグループ化し、コレクションレベルのロイヤリティを設定し、コレクションメタデータを管理します。
updated: '01-31-2026'
keywords:
  - NFT collection
  - create collection
  - collection metadata
  - mpl-core collection
  - group NFTs
about:
  - NFT collections
  - Collection management
  - Collection plugins
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
howToSteps:
  - Install SDK with npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi
  - Upload collection metadata JSON to get a URI
  - Call createCollection(umi, { collection, name, uri })
  - Pass collection address when creating Assets
howToTools:
  - Node.js
  - Umi framework
  - mpl-core SDK
faqs:
  - q: CollectionとAssetの違いは何ですか？
    a: CollectionはAssetをグループ化するコンテナです。独自のメタデータを持ちますが、Assetのように所有したり転送したりすることはできません。Assetはユーザーが所有する実際のNFTです。
  - q: 既存のAssetをCollectionに追加できますか？
    a: はい、newCollectionパラメータを指定してupdate命令を使用します。AssetのUpdate AuthorityがターゲットのCollectionに追加する権限を持っている必要があります。
  - q: NFTにCollectionは必要ですか？
    a: いいえ。AssetはCollectionなしでスタンドアロンで存在できます。ただし、Collectionを使用するとコレクションレベルのロイヤリティ、発見しやすさ、一括操作が可能になります。
  - q: CollectionからAssetを削除できますか？
    a: はい、update命令を使用してAssetのCollectionを変更できます。AssetとCollection両方で適切な権限が必要です。
  - q: Collectionを削除するとどうなりますか？
    a: CollectionはAssetを含んでいる間は削除できません。まずすべてのAssetを削除してから、Collectionアカウントをクローズできます。
---
このガイドでは、Metaplex Core SDKを使用してSolanaで**Core Collectionを作成・管理**する方法を説明します。Collectionは関連するAssetを共有のアイデンティティとコレクションレベルのメタデータとプラグインでグループ化します。 {% .lead %}
{% callout title="学習内容" %}
- 名前、URI、オプションのプラグインを持つCollectionの作成
- 作成時にAssetをCollectionに追加
- Collectionメタデータの取得と更新
- コレクションレベルのプラグイン（ロイヤリティなど）の管理
{% /callout %}
## 概要
**Collection**は関連するAssetをグループ化するCoreアカウントです。コレクションメタデータ（名前、画像、説明）を保存し、コレクション内のすべてのAssetに適用されるプラグインを保持できます。
- CollectionはAssetグループの「表紙」として機能します
- Assetは`collection`フィールドを通じてCollectionを参照します
- Collectionプラグイン（ロイヤリティなど）はすべてのメンバーAssetに適用できます
- Collectionの作成には約0.0015 SOLかかります
## スコープ外
Token Metadata Collection（mpl-token-metadataを使用）、圧縮NFTコレクション（Bubblegumを使用）、既存のコレクションのCoreへの移行。
## クイックスタート
**ジャンプ先:** [Collection作成](#シンプルなcollectionの作成) · [プラグイン付き](#プラグイン付きcollectionの作成) · [取得](#collectionの取得) · [更新](#collectionの更新)
1. インストール: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. コレクションメタデータJSONをアップロードしてURIを取得
3. `createCollection(umi, { collection, name, uri })`を呼び出す
4. Asset作成時にCollectionアドレスを渡す
## 前提条件
- 署名者とRPC接続が設定された**Umi**
- トランザクション手数料用の**SOL**（Collectionあたり約0.002 SOL）
- Arweave/IPFSにアップロードされたコレクション画像付きの**メタデータJSON**
## Collectionとは？
Collectionは、同じシリーズやグループに属するAssetのグループです。Assetをグループ化するには、まずコレクション名やコレクション画像などのコレクション関連のメタデータを保存するためのCollection Assetを作成する必要があります。Collection Assetはコレクションの表紙として機能し、コレクション全体のプラグインも保存できます。
Collection Assetから保存およびアクセスできるデータは以下の通りです：
| アカウント        | 説明                                       |
| --------------- | ------------------------------------------ |
| key             | アカウントキーの識別子                      |
| updateAuthority | 新しいAssetの権限者                         |
| name            | コレクション名                              |
| uri             | コレクションのオフチェーンメタデータへのURI  |
| num minted      | コレクション内でミントされたAssetの数        |
| current size    | 現在コレクション内にあるAssetの数            |
## Collectionの作成
Core Collectionを作成するには、`CreateCollection`命令を次のように使用できます：
{% totem %}
{% totem-accordion title="技術的な命令の詳細 - CreateCollectionV1" %}
**命令アカウントリスト**
| アカウント        | 説明                                        |
| --------------- | ------------------------------------------ |
| collection      | Core Assetが属するCollection                |
| updateAuthority | 新しいAssetの権限者                         |
| payer           | ストレージ手数料を支払うアカウント           |
| systemProgram   | System Programアカウント                    |
**命令引数**
| 引数     | 説明                                        |
| ------- | ------------------------------------------ |
| name    | Core Assetが属するCollection                |
| uri     | 新しいAssetの権限者                         |
| plugins | Collectionに持たせたいプラグイン            |
一部のアカウントと引数は、SDKで使いやすくするために抽象化されているか、オプションになっている場合があります。
オンチェーン命令の詳細は[Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L30)で確認できます。
{% /totem-accordion %}
{% /totem %}
### シンプルなCollectionの作成
以下のスニペットは、プラグインや特別なものなしでシンプルなCollectionを作成します。
{% code-tabs-imported from="core/create-collection" frameworks="umi" /%}
### プラグイン付きCollectionの作成
以下のスニペットは、[Royaltiesプラグイン](/ja/smart-contracts/core/plugins/royalties)を添付してCollectionを作成します。[プラグインページ](/ja/smart-contracts/core/plugins)で説明されているように、追加のプラグインを添付できます。
{% dialect-switcher title="プラグイン付きMPL Core Collectionの作成" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import { createCollection, ruleSet } from '@metaplex-foundation/mpl-core'
const collectionSigner = generateSigner(umi)
const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('22222222222222222222222222222222')
await createCollection(umi, {
  collection: collectionSigner,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  plugins: [
    {
      type: 'Royalties',
      basisPoints: 500,
      creators: [
        {
          address: creator1,
          percentage: 20,
        },
        {
          address: creator2,
          percentage: 80,
        },
      ],
      ruleSet: ruleSet('None'), // 互換性ルールセット
    },
  ],
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{
    instructions::CreateCollectionV1Builder,
    types::{Creator, Plugin, PluginAuthority, PluginAuthorityPair, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn create_collection_with_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let payer = Keypair::new();
    let collection = Keypair::new();
    let creator = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let create_collection_ix = CreateCollectionV1Builder::new()
        .collection(collection.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::Royalties(Royalties {
                basis_points: 500,
                creators: vec![Creator {
                    address: creator,
                    percentage: 100,
                }],
                rule_set: RuleSet::None,
            }),
            authority: Some(PluginAuthority::None),
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
## Collectionの取得
Collectionを取得するには、以下の関数を使用できます：
{% dialect-switcher title="Collectionの取得" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { fetchCollectionV1 } from '@metaplex-foundation/mpl-core'
import { publicKey } from '@metaplex-foundation/umi'
const collectionId = publicKey('11111111111111111111111111111111')
const collection = await fetchCollection(umi, collectionId)
console.log(collection)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use std::str::FromStr;
use mpl_core::Collection;
use solana_client::nonblocking::rpc_client;
use solana_sdk::pubkey::Pubkey;
pub async fn fetch_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let collection_id = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let rpc_data = rpc_client.get_account_data(&collection_id).await.unwrap();
    let collection = Collection::from_bytes(&rpc_data).unwrap();
    print!("{:?}", collection)
}
```
{% /dialect %}
{% /dialect-switcher %}
## Collectionの更新
Core Collectionのデータを更新するには、`UpdateCollection`命令を使用します。例えば、この命令を使用してCollectionの名前を変更できます。
{% totem %}
{% totem-accordion title="技術的な命令の詳細 - UpdateCollectionV1" %}
**命令アカウントリスト**
| アカウント           | 説明                                        |
| ------------------ | ------------------------------------------ |
| collection         | Core Assetが属するCollection                |
| payer              | ストレージ手数料を支払うアカウント           |
| authority          | 新しいAssetの権限者                         |
| newUpdateAuthority | Collectionの新しいUpdate Authority          |
| systemProgram      | System Programアカウント                    |
| logWrapper         | SPL Noop Program                           |
**命令引数**
| 引数  | 説明                       |
| ---- | ------------------------- |
| name | MPL Core Assetの名前       |
| uri  | オフチェーンJSONメタデータURI |
一部のアカウントと引数は、SDKで使いやすくするために抽象化されているか、オプションになっている場合があります。
オンチェーン命令の詳細は[Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L167C4-L167C23)で確認できます。
{% /totem-accordion %}
{% /totem %}
{% seperator h="6" /%}
{% dialect-switcher title="Collectionの更新" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updateCollection } from '@metaplex-foundation/mpl-core'
const collectionAddress = publicKey('1111111111111111111111111111111')
await updateCollection(umi, {
  collection: collectionAddress,
  name: 'my-nft',
  uri: 'https://exmaple.com/new-uri',
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use std::str::FromStr;
use mpl_core::instructions::UpdateCollectionV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
pub async fn update_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let update_collection_ix = UpdateCollectionV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .new_name("My Collection".into())
        .new_uri("https://example.com/my-collection.json".into())
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let update_collection_tx = Transaction::new_signed_with_payer(
        &[update_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&update_collection_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## Collectionプラグインの更新
Core Collectionに添付されているプラグインの動作を変更したい場合は、`updateCollectionPlugin`命令を使用できます。
{% totem %}
{% totem-accordion title="技術的な命令の詳細 - UpdateCollectionPluginV1" %}
**命令アカウントリスト**
| アカウント      | 説明                                        |
| ------------- | ------------------------------------------ |
| collection    | Core Assetが属するCollection                |
| payer         | ストレージ手数料を支払うアカウント           |
| authority     | 新しいAssetの権限者                         |
| systemProgram | System Programアカウント                    |
| logWrapper    | SPL Noop Program                           |
**命令引数**
| 引数    | 説明                    |
| ------ | ----------------------- |
| plugin | 更新したいプラグイン     |
一部のアカウントは、SDKで使いやすくするために抽象化されているか、オプションになっている場合があります。
オンチェーン命令の詳細は[Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L81)で確認できます。
{% /totem-accordion %}
{% /totem %}
{% seperator h="6" /%}
{% dialect-switcher title="Collectionプラグインの更新" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updateCollectionPlugin, ruleSet } from '@metaplex-foundation/mpl-core'
const collectionAddress = publicKey('1111111111111111111111111111111')
const newCreator = publicKey('5555555555555555555555555555555')
await updateCollectionPlugin(umi, {
  collection: collectionAddress,
  plugin: {
    type: 'Royalties',
    basisPoints: 400,
    creators: [{ address: newCreator, percentage: 100 }],
    ruleSet: ruleSet('None'),
  },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use std::str::FromStr;
use mpl_core::{
    instructions::UpdateCollectionPluginV1Builder,
    types::{Creator, Plugin, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
pub async fn update_collection_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let new_creator = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let update_collection_plugin_ix = UpdateCollectionPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .plugin(Plugin::Royalties(Royalties {
            basis_points: 500,
            creators: vec![Creator {
                address: new_creator,
                percentage: 100,
            }],
            rule_set: RuleSet::None,
        }))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let update_collection_plugin_tx = Transaction::new_signed_with_payer(
        &[update_collection_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&update_collection_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## よくあるエラー
### `Collection account already exists`
Collectionキーペアはすでに使用されています。新しい署名者を生成してください：
```ts
const collectionSigner = generateSigner(umi) // 一意である必要があります
```
### `Authority mismatch`
あなたはCollectionのUpdate Authorityではありません。Collectionの`updateAuthority`フィールドが署名者と一致しているか確認してください。
### `Insufficient funds`
支払いウォレットには約0.002 SOLが必要です。以下でファンドを追加してください：
```bash
solana airdrop 1 <WALLET_ADDRESS> --url devnet
```
## 注意事項
- `collection`パラメータは作成時に**新しいキーペア**である必要があります
- Collectionプラグインは、Assetレベルでオーバーライドしない限り、Assetに継承されます
- 作成後にCollectionの状態を確認するには`fetchCollection`を使用してください
- `numMinted`カウンターは現在のサイズではなく、これまでに作成されたAssetの総数を追跡します
## クイックリファレンス
### プログラムID
| ネットワーク | アドレス |
|---------|---------|
| Mainnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
| Devnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
### 最小コード
```ts {% title="minimal-collection.ts" %}
import { generateSigner } from '@metaplex-foundation/umi'
import { createCollection } from '@metaplex-foundation/mpl-core'
const collection = generateSigner(umi)
await createCollection(umi, { collection, name: 'My Collection', uri: 'https://...' }).sendAndConfirm(umi)
```
### コスト内訳
| 項目 | コスト |
|------|------|
| Collectionアカウントのレント | 約0.0015 SOL |
| トランザクション手数料 | 約0.000005 SOL |
| **合計** | **約0.002 SOL** |
## FAQ
### CollectionとAssetの違いは何ですか？
CollectionはAssetをグループ化するコンテナです。独自のメタデータ（名前、画像）を持ちますが、Assetのように所有したり転送したりすることはできません。Assetはユーザーが所有する実際のNFTです。
### 既存のAssetをCollectionに追加できますか？
はい、`newCollection`パラメータを指定して`update`命令を使用します。AssetのUpdate AuthorityがターゲットのCollectionに追加する権限を持っている必要があります。
### NFTにCollectionは必要ですか？
いいえ。AssetはCollectionなしでスタンドアロンで存在できます。ただし、Collectionを使用するとコレクションレベルのロイヤリティ、発見しやすさ、一括操作が可能になります。
### CollectionからAssetを削除できますか？
はい、`update`命令を使用してAssetのCollectionを変更できます。AssetとCollection両方で適切な権限が必要です。
### Collectionを削除するとどうなりますか？
CollectionはAssetを含んでいる間は削除できません。まずすべてのAssetを削除してから、Collectionアカウントをクローズできます。
## 用語集
| 用語 | 定義 |
|------|------------|
| **Collection** | 共有メタデータの下で関連するAssetをグループ化するCoreアカウント |
| **Update Authority** | Collectionのメタデータとプラグインを変更できるアカウント |
| **numMinted** | Collection内でこれまでに作成されたAssetの総数を追跡するカウンター |
| **currentSize** | 現在Collection内にあるAssetの数 |
| **Collectionプラグイン** | Collectionに添付されたプラグイン（例：Royalties） |
| **URI** | Collectionのオフチェーンメタデータを指すURL |
