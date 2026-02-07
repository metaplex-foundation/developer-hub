---
title: Attributeプラグイン
metaTitle: Attributeプラグイン | Metaplex Core
description: Core NFT Assetsにオンチェーンのキー値データを保存します。ゲームステータス、特性、オンチェーンプログラムで読み取る必要のあるデータにAttributesプラグインを使用します。
updated: '01-31-2026'
keywords:
  - on-chain attributes
  - NFT traits
  - game stats
  - key-value storage
  - DAS indexed
about:
  - On-chain data storage
  - NFT attributes
  - Program-readable data
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
faqs:
  - q: オンチェーン属性とオフチェーンメタデータ属性の違いは何ですか？
    a: オンチェーン属性はSolanaに保存され、プログラムで読み取り可能です。URIのJSONにあるオフチェーン属性はArweave/IPFSに保存され、クライアントでのみ読み取り可能です。
  - q: オンチェーンプログラムはこれらの属性を読み取れますか？
    a: はい。CPIを使用してAssetアカウントを取得し、Attributesプラグインデータをデシリアライズします。
  - q: 属性はDASでインデックスされますか？
    a: はい。DASは属性のキー値ペアを自動的にインデックスして高速クエリを可能にします。
  - q: 数値やブール値を保存できますか？
    a: 値は文字列のみです。必要に応じて変換します。例：level = '5'またはactive = 'true'。
  - q: 単一の属性を更新するにはどうすればよいですか？
    a: 個々の属性を更新することはできません。現在のリストを取得し、変更して、完全な新しいリストで更新します。
  - q: 属性のサイズ制限は何ですか？
    a: ハードリミットはありませんが、属性リストが大きくなるとレントコストが増加します。データを簡潔に保ちます。
  - q: オーナーは属性を更新できますか？
    a: いいえ。Attributesプラグインはauthority管理なので、update authorityのみが変更できます。
---
**Attributesプラグイン**は、Core AssetsまたはCollections内に直接オンチェーンでキー値ペアを保存します。ゲームステータス、特性、オンチェーンプログラムが読み取る必要のあるデータに最適です。 {% .lead %}
{% callout title="学べること" %}
- AssetsとCollectionsにオンチェーン属性を追加
- キー値ペアの保存と更新
- オンチェーンプログラムから属性を読み取り
- ユースケース：ゲームステータス、特性、アクセスレベル
{% /callout %}
## 概要
**Attributesプラグイン**は、オンチェーンでキー値文字列ペアを保存するAuthority Managedプラグインです。オフチェーンメタデータとは異なり、これらの属性はSolanaプログラムで読み取り可能で、DASでインデックスされます。
- 任意の文字列キー値ペアをオンチェーンに保存
- CPIを介してオンチェーンプログラムで読み取り可能
- 高速クエリのためにDASで自動インデックス
- update authorityによって変更可能
## 対象外
オフチェーンメタデータ属性（URIのJSONに保存）、複雑なデータ型（文字列のみサポート）、不変属性（すべての属性は変更可能）。
## クイックスタート
**ジャンプ先:** [Assetに追加](#assetへのattributesプラグインの追加) · [属性を更新](#assetのattributesプラグインの更新)
1. Attributesプラグインを追加：`addPlugin(umi, { asset, plugin: { type: 'Attributes', attributeList: [...] } })`
2. 各属性は`{ key: string, value: string }`ペア
3. `updatePlugin()`でいつでも更新可能
4. DASまたはオンチェーンフェッチでクエリ
{% callout type="note" title="オンチェーン vs オフチェーン属性" %}
| 機能 | オンチェーン（このプラグイン） | オフチェーン（JSONメタデータ） |
|---------|------------------------|---------------------------|
| 保存場所 | Solanaアカウント | Arweave/IPFS |
| プログラムで読み取り可能 | ✅ はい（CPI） | ❌ いいえ |
| DASでインデックス | ✅ はい | ✅ はい |
| 変更可能 | ✅ はい | ストレージによる |
| コスト | レント（回収可能） | アップロードコスト（一回限り） |
| 最適な用途 | 動的データ、ゲームステータス | 静的特性、画像 |
**オンチェーン属性を使用**するのは、プログラムがデータを読み取る必要がある場合や頻繁に変更される場合です。
**オフチェーンメタデータを使用**するのは、静的な特性や画像参照の場合です。
{% /callout %}
## 一般的なユースケース
- **ゲームキャラクターステータス**: 体力、XP、レベル、クラス - ゲームプレイ中に変更されるデータ
- **アクセス制御**: ティア、役割、権限 - プログラムが承認のためにチェックするデータ
- **動的特性**: アクションに基づいて特性が変化する進化するNFT
- **ステーキング状態**: ステーキングステータス、獲得報酬、ステーキング時間を追跡
- **実績追跡**: バッジ、マイルストーン、完了ステータス
- **レンタル/貸出**: レンタル期間、借り手情報、返却日を追跡
## 対応
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |
## 引数
| 引数           | 値                               |
| ------------- | ----------------------------------- |
| attributeList | Array<{key: string, value: string}> |
### AttributeList
属性リストはArray[]で構成され、次にキー値ペア`{key: "value"}`文字列値ペアのオブジェクトで構成されます。
{% dialect-switcher title="AttributeList" %}
{% dialect title="JavaScript" id="js" %}
```ts
const attributeList = [
  { key: 'key0', value: 'value0' },
  { key: 'key1', value: 'value1' },
]
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::types::{Attributes, Attribute}
let attributes = Attributes {
    attribute_list: vec![
        Attribute {
            key: "color".to_string(),
            value: "blue".to_string(),
        },
        Attribute {
            key: "access_type".to_string(),
            value: "prestige".to_string(),
        },
    ],
}
```
{% /dialect %}
{% /dialect-switcher %}
## AssetへのAttributesプラグインの追加
{% dialect-switcher title="MPL Core AssetへのAttributeプラグインの追加" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin } from '@metaplex-foundation/mpl-core'
const asset = publicKey('11111111111111111111111111111111')
await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Attributes',
    attributeList: [
      { key: 'key0', value: 'value0' },
      { key: 'key1', value: 'value1' },
    ],
  },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{Attribute, Attributes, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn add_attributes_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let add_attribute_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::Attributes(Attributes {
            attribute_list: vec![
                Attribute {
                    key: "color".to_string(),
                    value: "blue".to_string(),
                },
                Attribute {
                    key: "access_type".to_string(),
                    value: "prestige".to_string(),
                },
            ],
        }))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let add_attribute_plugin_tx = Transaction::new_signed_with_payer(
        &[add_attribute_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&add_attribute_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## AssetのAttributesプラグインの更新
{% dialect-switcher title="AssetのAttributesプラグインの更新" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin } from '@metaplex-foundation/mpl-core'
const assetAddress = publicKey('11111111111111111111111111111111')
await updatePlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'Attributes',
    attributeList: [
      { key: 'key0', value: 'value0' },
      { key: 'key1', value: 'value1' },
    ],
  },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```ts
use mpl_core::{
    instructions::UpdatePluginV1Builder,
    types::{Attribute, Attributes, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn update_attributes_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let update_attributes_plugin_ix = UpdatePluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::Attributes(Attributes {
            attribute_list: vec![
                Attribute {
                    key: "color".to_string(),
                    value: "new value".to_string(),
                },
                Attribute {
                    key: "access_type".to_string(),
                    value: "new value".to_string(),
                },
                Attribute {
                    key: "additional_attribute".to_string(),
                    value: "additional_value".to_string(),
                },
            ],
        }))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let update_attributes_plugin_tx = Transaction::new_signed_with_payer(
        &[update_attributes_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&update_attributes_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## 一般的なエラー
### `Authority mismatch`
プラグインauthority（通常はupdate authority）のみが属性を追加または更新できます。正しいキーペアで署名していることを確認してください。
### `String too long`
属性のキーと値はサイズが制限されています。簡潔に保ちます。
## 注意事項
- Authority Managed: update authorityはオーナーの署名なしで追加/更新可能
- すべての値は文字列 - 必要に応じて数値/ブール値を変換
- 更新は属性リスト全体を置き換える（部分更新なし）
- 属性はアカウントサイズとレントコストを増加
- DASは高速クエリのために属性をインデックス
## クイックリファレンス
### 最小コード
```ts {% title="minimal-attributes.ts" %}
import { addPlugin } from '@metaplex-foundation/mpl-core'
await addPlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'Attributes',
    attributeList: [
      { key: 'level', value: '5' },
      { key: 'class', value: 'warrior' },
    ],
  },
}).sendAndConfirm(umi)
```
### 一般的な属性パターン
| ユースケース | 例のキー |
|----------|--------------|
| ゲームキャラクター | `level`, `health`, `xp`, `class` |
| アクセス制御 | `tier`, `access_level`, `role` |
| 特性 | `background`, `eyes`, `rarity` |
| 状態 | `staked`, `listed`, `locked` |
## FAQ
### オンチェーン属性とオフチェーンメタデータ属性の違いは何ですか？
オンチェーン属性（このプラグイン）はSolanaに保存され、プログラムで読み取り可能です。オフチェーン属性（URIのJSON）はArweave/IPFSに保存され、クライアントでのみ読み取り可能です。
### オンチェーンプログラムはこれらの属性を読み取れますか？
はい。CPIを使用してAssetアカウントを取得し、Attributesプラグインデータをデシリアライズします。
### 属性はDASでインデックスされますか？
はい。DASは属性のキー値ペアを自動的にインデックスして高速クエリを可能にします。
### 数値やブール値を保存できますか？
値は文字列のみです。必要に応じて変換：`{ key: 'level', value: '5' }`、`{ key: 'active', value: 'true' }`。
### 単一の属性を更新するにはどうすればよいですか？
個々の属性を更新することはできません。現在のリストを取得し、変更して、完全な新しいリストで更新します。
### 属性のサイズ制限は何ですか？
ハードリミットはありませんが、属性リストが大きくなるとレントコストが増加します。データを簡潔に保ちます。
### オーナーは属性を更新できますか？
いいえ。Attributesプラグインはauthority管理なので、update authorityのみが変更できます（オーナーではない）。
## 関連プラグイン
- [Update Delegate](/smart-contracts/core/plugins/update-delegate) - 他の人に属性を更新する権限を付与
- [ImmutableMetadata](/smart-contracts/core/plugins/immutableMetadata) - 名前/URIをロック（属性は変更可能のまま）
- [AddBlocker](/smart-contracts/core/plugins/addBlocker) - 新しいプラグインの追加を防止
## 用語集
| 用語 | 定義 |
|------|------------|
| **Attributesプラグイン** | オンチェーンのキー値ペアを保存するauthority管理プラグイン |
| **attributeList** | `{ key, value }`オブジェクトの配列 |
| **Authority Managed** | update authorityによって制御されるプラグインタイプ |
| **オンチェーンデータ** | Solanaアカウントに直接保存されるデータ（プログラムで読み取り可能） |
| **DAS** | 属性をインデックスするDigital Asset Standard API |
