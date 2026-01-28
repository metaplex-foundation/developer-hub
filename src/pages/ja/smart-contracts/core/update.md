---
title: アセットの更新
metaTitle: アセットの更新 | Metaplex Core
description: Solana上でCore NFTアセットメタデータを更新する方法を学びます。Metaplex Core SDKを使用して名前、URI、コレクションメンバーシップを変更し、アセットを不変にします。
---

このガイドでは、Metaplex Core SDKを使用してSolana上で**Core Assetメタデータを更新**する方法を説明します。あなたが管理するAssetの名前、URI、またはコレクションメンバーシップを変更できます。 {% .lead %}

{% callout title="学習内容" %}

- Asset名とメタデータURIを更新する
- Assetを別のコレクションに移動する
- Assetを不変（永続的）にする
- Update Authority要件を理解する

{% /callout %}

## 概要

`update`インストラクションを使用してCore Assetのメタデータを更新します。Update Authority（または認可されたデリゲート）のみがAssetを変更できます。

- メタデータを更新するために`name`と`uri`を変更
- Assetをコレクション間で移動するために`newCollection`を使用
- 不変にするために`updateAuthority`を`None`に設定
- 更新は無料（アカウントサイズが変更されない限りレントコストなし）

## 対象外

Token Metadata NFTの更新（mpl-token-metadataを使用）、プラグインの変更（[プラグイン](/ja/smart-contracts/core/plugins)を参照）、所有権の転送（[アセットの転送](/ja/smart-contracts/core/transfer)を参照）。

## クイックスタート

**移動先:** [Assetの更新](#core-assetの更新) · [コレクションの変更](#core-assetのコレクションの変更) · [不変にする](#core-assetデータを不変にする)

1. インストール: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. 現在の状態を取得するためにAssetをフェッチ
3. 新しい値で`update(umi, { asset, name, uri })`を呼び出す
4. `fetchAsset()`で変更を確認

## 前提条件

- AssetのUpdate Authorityである署名者で設定された**Umi**
- 更新するAssetの**Assetアドレス**
- Arweave/IPFSにアップロードされた**新しいメタデータ**（URIを変更する場合）

Core Assetの更新権限またはデリゲートは、Assetのデータの一部を変更する能力を持っています。

{% totem %}
{% totem-accordion title="技術的インストラクション詳細" %}

**インストラクションアカウントリスト**

| アカウント         | 説明                                          |
| ------------------ | -------------------------------------------- |
| asset              | MPL Core Assetのアドレス                      |
| collection         | Core Assetが属するコレクション                  |
| payer              | ストレージ手数料を支払うアカウント                |
| authority          | アセットの所有者またはデリゲート                 |
| newUpdateAuthority | アセットの新しいUpdate Authority               |
| systemProgram      | System Programアカウント                      |
| logWrapper         | SPL Noopプログラム                           |

**インストラクション引数**

| 引数      | 説明                             |
| ------- | -------------------------------- |
| newName | Core Assetの新しい名前            |
| newUri  | 新しいオフチェーンメタデータURI       |

一部のアカウント/引数は、使いやすさのためにSDKで抽象化されるか、オプションである場合があります。
オンチェーンインストラクションの詳細な説明は[Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/clients/rust/src/generated/instructions/update_v1.rs#L126)で見ることができます

{% /totem-accordion %}
{% /totem %}

## Core Assetの更新

以下は、SDKを使用してMPL Core Assetを更新する方法です。

{% code-tabs-imported from="core/update-asset" frameworks="umi" /%}

## Core Assetのコレクションの変更

以下は、SDKを使用してCore Assetのコレクションを変更する方法です。

{% dialect-switcher title="Core Assetのコレクションの変更" %}
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

## Core Assetデータを不変にする

以下は、SDKを使用してCore Assetを完全に不変にする方法です。[不変性ガイド](/ja/smart-contracts/core/guides/immutability)で説明されているように、不変性には異なるレベルがあることに注意してください。

{% callout type="warning" title="重要" %}

これは破壊的なアクションであり、アセットを更新する能力を削除します。

また、アセットが所属していたコレクションからアセットを削除します。コレクションアセットを不変にするには、コレクションのUpdate Authorityを変更する必要があります。

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

AssetのUpdate Authorityではありません。確認してください：

```ts
const asset = await fetchAsset(umi, assetAddress)
console.log(asset.updateAuthority) // 署名者と一致する必要があります
```

### `Collection authority required`

コレクションを変更する場合、Assetとターゲットコレクションの両方に対する権限が必要です。

### `Asset is immutable`

AssetのUpdate Authorityは`None`に設定されています。これは元に戻せません。

## 注意事項

- 更新前にAssetをフェッチして現在の状態を確認してください
- Update Authority（またはデリゲート）のみがAssetを更新できます
- Assetを不変にすることは**永続的で取り消し不可能**です
- コレクションを変更すると継承されたプラグイン（ロイヤリティなど）に影響する場合があります
- 更新はAssetの所有者を変更しません

## クイックリファレンス

### 更新パラメータ

| パラメータ | 説明 |
|-----------|-------------|
| `asset` | 更新するAsset（アドレスまたはフェッチされたオブジェクト） |
| `name` | Assetの新しい名前 |
| `uri` | 新しいメタデータURI |
| `newCollection` | ターゲットコレクションアドレス |
| `newUpdateAuthority` | 新しい権限（不変にするには`None`） |

### 権限タイプ

| タイプ | 説明 |
|------|-------------|
| `Address` | 特定の公開鍵 |
| `Collection` | コレクションのUpdate Authority |
| `None` | 不変 - 更新不可 |

## FAQ

### Assetを不変にすることを元に戻せますか？

いいえ。Update Authorityを`None`に設定することは永続的です。Assetの名前、URI、コレクションメンバーシップは永久に凍結されます。確信がある場合にのみ実行してください。

### URIを変更せずに名前だけを更新するにはどうすればよいですか？

変更したいフィールドのみを渡します。現在の値を維持するには`uri`を省略します：

```ts
await update(umi, { asset, name: 'New Name' }).sendAndConfirm(umi)
```

### 更新と転送の違いは何ですか？

更新はAssetのメタデータ（名前、URI）を変更します。転送は所有権を変更します。これらは異なる権限要件を持つ別々の操作です。

### デリゲートはAssetを更新できますか？

はい、[Update Delegateプラグイン](/ja/smart-contracts/core/plugins/update-delegate)を介してUpdate Delegateとして割り当てられている場合。

### 更新にSOLはかかりますか？

新しいデータが現在のアカウントサイズより大きい場合（まれ）を除き、更新は無料です。トランザクション手数料（約0.000005 SOL）は依然として適用されます。

## 用語集

| 用語 | 定義 |
|------|------------|
| **Update Authority** | Assetのメタデータを変更する権限を持つアカウント |
| **Immutable** | 更新できないAsset（Update AuthorityがNone） |
| **URI** | オフチェーンメタデータJSONを指すURL |
| **Delegate** | プラグインを介して特定の権限を付与されたアカウント |
| **Collection Membership** | Assetが属するコレクション |

---

*Metaplex Foundationによって管理・2026年1月最終確認・@metaplex-foundation/mpl-coreに適用*
