---
title: Attribute Plugin
metaTitle: Attribute Plugin | Metaplex Core
description: Core NFT Assetにオンチェーンのキーバリューデータを保存します。Attributes Pluginを使用してゲームステータス、特性、オンチェーンプログラムが読み取る必要のあるデータを保存します。
---

**Attributes Plugin**は、Core AssetまたはCollection内にキーバリューペアを直接オンチェーンに保存します。ゲームステータス、特性、オンチェーンプログラムが読み取る必要のあるあらゆるデータに最適です。 {% .lead %}

{% callout title="学習内容" %}

- AssetとCollectionにオンチェーン属性を追加
- キーバリューペアを保存および更新
- オンチェーンプログラムから属性を読み取る
- ユースケース：ゲームステータス、特性、アクセスレベル

{% /callout %}

## 概要

**Attributes Plugin**は、オンチェーンにキーバリュー文字列ペアを保存する権限管理Pluginです。オフチェーンメタデータとは異なり、これらの属性はSolanaプログラムで読み取り可能で、DASでインデックス化されます。

- 任意の文字列キーバリューペアをオンチェーンに保存
- CPI経由でオンチェーンプログラムで読み取り可能
- DASで高速クエリのために自動インデックス化
- 更新権限によって変更可能

## 対象外

オフチェーンメタデータ属性（URIのJSONに保存）、複雑なデータ型（文字列のみサポート）、不変属性（すべての属性は変更可能）は対象外です。

## クイックスタート

**ジャンプ：** [Assetに追加](#assetにattributes-pluginを追加) · [属性を更新](#assetのattributes-pluginを更新)

1. Attributes Pluginを追加：`addPlugin(umi, { asset, plugin: { type: 'Attributes', attributeList: [...] } })`
2. 各属性は`{ key: string, value: string }`ペア
3. いつでも`updatePlugin()`で更新可能
4. DASまたはオンチェーンフェッチでクエリ

{% callout type="note" title="オンチェーンとオフチェーン属性" %}

| 機能 | オンチェーン（このPlugin） | オフチェーン（JSONメタデータ） |
|---------|------------------------|---------------------------|
| 保存場所 | Solanaアカウント | Arweave/IPFS |
| プログラムで読み取り可能 | ✅ Yes（CPI） | ❌ No |
| DASでインデックス化 | ✅ Yes | ✅ Yes |
| 変更可能 | ✅ Yes | ストレージに依存 |
| コスト | レント（回収可能） | アップロードコスト（一回限り） |
| 最適な用途 | 動的データ、ゲームステータス | 静的特性、画像 |

**オンチェーン属性を使用**：プログラムがデータを読み取る必要がある場合、または頻繁に変更される場合。
**オフチェーンメタデータを使用**：静的特性や画像参照の場合。

{% /callout %}

## 一般的なユースケース

- **ゲームキャラクターステータス**：体力、XP、レベル、クラス - ゲームプレイ中に変化するデータ
- **アクセス制御**：ティア、ロール、権限 - プログラムが認可のためにチェックするデータ
- **動的特性**：アクションに基づいて特性が変化する進化するNFT
- **ステーキング状態**：ステーキングステータス、獲得報酬、ステーキング時間の追跡
- **実績追跡**：バッジ、マイルストーン、完了ステータス
- **レンタル/貸付**：レンタル期間、借り手情報、返却日の追跡

## 動作対象

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## 引数

| 引数           | 値                               |
| ------------- | ----------------------------------- |
| attributeList | Array<{key: string, value: string}> |

### AttributeList

属性リストは、配列[]とキーバリューペア`{key: "value"}`文字列値ペアのオブジェクトで構成されています。

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

## AssetにAttributes Pluginを追加

{% dialect-switcher title="MPL Core AssetにAttribute Pluginを追加" %}
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

## AssetのAttributes Pluginを更新

{% dialect-switcher title="AssetのAttributes Pluginを更新" %}
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

Plugin権限（通常は更新権限）のみが属性を追加または更新できます。正しいキーペアで署名していることを確認してください。

### `String too long`

属性のキーと値にはサイズ制限があります。簡潔に保ってください。

## 注意事項

- 権限管理：更新権限は所有者の署名なしで追加/更新可能
- すべての値は文字列 - 必要に応じて数値/ブール値を変換
- 更新は属性リスト全体を置き換える（部分更新なし）
- 属性はアカウントサイズとレントコストを増加させる
- DASは高速クエリのために属性をインデックス化

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
| ゲームキャラクター | `level`、`health`、`xp`、`class` |
| アクセス制御 | `tier`、`access_level`、`role` |
| 特性 | `background`、`eyes`、`rarity` |
| 状態 | `staked`、`listed`、`locked` |

## FAQ

### オンチェーン属性とオフチェーンメタデータ属性の違いは何ですか？

オンチェーン属性（このPlugin）はSolanaに保存され、プログラムで読み取り可能です。オフチェーン属性（URIのJSON）はArweave/IPFSに保存され、クライアントのみで読み取り可能です。

### オンチェーンプログラムはこれらの属性を読み取れますか？

はい。CPIを使用してAssetアカウントをフェッチし、Attributes Pluginデータをデシリアライズします。

### 属性はDASでインデックス化されますか？

はい。DASは高速クエリのために属性のキーバリューペアを自動的にインデックス化します。

### 数値やブール値を保存できますか？

値は文字列のみです。必要に応じて変換：`{ key: 'level', value: '5' }`、`{ key: 'active', value: 'true' }`。

### 単一の属性を更新するにはどうすればよいですか？

個別の属性は更新できません。現在のリストをフェッチし、変更して、完全な新しいリストで更新します。

### 属性のサイズ制限は何ですか？

厳密な制限はありませんが、属性リストが大きいほどレントコストが増加します。データは簡潔に保ってください。

### 所有者は属性を更新できますか？

いいえ。Attributes Pluginは権限管理なので、更新権限のみが変更できます（所有者ではありません）。

## 関連Plugin

- [Update Delegate](/ja/smart-contracts/core/plugins/update-delegate) - 他者に属性を更新する権限を付与
- [ImmutableMetadata](/ja/smart-contracts/core/plugins/immutableMetadata) - 名前/URIをロック（属性は変更可能のまま）
- [AddBlocker](/ja/smart-contracts/core/plugins/addBlocker) - 新しいPluginの追加を防止

## 用語集

| 用語 | 定義 |
|------|------------|
| **Attributes Plugin** | オンチェーンのキーバリューペアを保存する権限管理Plugin |
| **attributeList** | `{ key, value }`オブジェクトの配列 |
| **権限管理** | 更新権限によって制御されるPluginタイプ |
| **オンチェーンデータ** | Solanaアカウントに直接保存されるデータ（プログラムで読み取り可能） |
| **DAS** | 属性をインデックス化するDigital Asset Standard API |

---

*Metaplex Foundationによって管理 · 最終確認2026年1月 · @metaplex-foundation/mpl-coreに適用*
