---
title: Assetのバーン
metaTitle: Assetのバーン | Metaplex Core
description: SolanaでCore NFT Assetをバーンする方法を学びます。Metaplex Core SDKを使用してAssetを永久に破棄し、レントを回収します。
created: '06-15-2024'
updated: '01-31-2026'
keywords:
  - burn NFT
  - destroy asset
  - recover rent
  - Solana NFT
  - mpl-core burn
about:
  - NFT burning
  - Rent recovery
  - Asset destruction
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
howToSteps:
  - npm install @metaplex-foundation/mpl-coreでSDKをインストール
  - Assetを取得して所有権を確認
  - 所有者としてburn(umi, { asset })を呼び出す
  - レントは自動的にウォレットに返却される
howToTools:
  - Node.js
  - Umi framework
  - mpl-core SDK
faqs:
  - q: アカウントに残っている約0.0009 SOLを回収できますか？
    a: いいえ。この少額はアカウントをバーン済みとしてマークし、アドレスの再利用を防ぐために意図的に残されています。
  - q: バーン後、Assetのメタデータはどうなりますか？
    a: オンチェーンアカウントはクリアされます。Arweave/IPFSのオフチェーンメタデータはアクセス可能ですが、オンチェーンリンクはありません。
  - q: Burn Delegateは所有者の承認なしにバーンできますか？
    a: はい。一度割り当てられると、Burn Delegateはいつでもアセットをバーンできます。信頼できるアドレスのみを割り当ててください。
  - q: バーンはコレクションのカウントに影響しますか？
    a: はい。コレクションのcurrentSizeが減少します。numMintedカウンターは変更されません。
  - q: 複数のAssetを一度にバーンできますか？
    a: 単一の命令ではできません。サイズ制限内で1つのトランザクションに複数のバーン命令をバッチ処理できます。
---
このガイドでは、Metaplex Core SDKを使用してSolana上で**Core Assetをバーン**する方法を説明します。Assetを永久に破棄し、レント保証金のほとんどを回収します。 {% .lead %}
{% callout title="学習内容" %}

- Assetをバーンしてレントを回収する
- Collection内のAssetのバーンを処理する
- Burn Delegate権限を理解する
- バーン後にアカウントがどうなるかを知る
{% /callout %}

## 概要

Core Assetをバーンして永久に破棄し、レントを回収します。所有者（またはBurn Delegate）のみがAssetをバーンできます。

- `burn(umi, { asset })`を呼び出してAssetを破棄
- ほとんどのレント（約0.0028 SOL）が支払者に返却される
- 少額（約0.0009 SOL）がアカウント再利用防止のために残る
- バーンは**永久的で取り消し不可能**

## 対象外

Token Metadataのバーン（mpl-token-metadataを使用）、圧縮NFTのバーン（Bubblegumを使用）、Collectionのバーン（Collectionには独自のバーンプロセスがあります）。

## クイックスタート

**ジャンプ先：** [Assetをバーン](#code-example) · [Collection内でバーン](#burning-an-asset-that-is-part-of-a-collection)

1. インストール: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. Assetを取得して所有権を確認
3. 所有者として`burn(umi, { asset })`を呼び出す
4. レントは自動的にウォレットに返却される

## 前提条件

- Assetを所有する（またはBurn Delegateである）署名者で構成された**Umi**
- バーンするAssetの**Assetアドレス**
- **Collectionアドレス**（AssetがCollection内にある場合）
Assetは`burn`命令を使用してバーンできます。これにより、レント免除手数料が所有者に返却されます。アカウントの再オープンを防ぐため、非常に少額のSOL（0.00089784）のみがアカウントに残ります。
{% totem %}
{% totem-accordion title="技術的な命令の詳細" %}
**命令アカウントリスト**
| アカウント | 説明 |
| ------------- | ----------------------------------------------- |
| asset         | MPL Core Assetのアドレス |
| collection    | Core Assetが属するコレクション |
| payer         | ストレージ手数料を支払うアカウント |
| authority     | アセットの所有者またはデリゲート |
| systemProgram | System Programアカウント |
| logWrapper    | SPL Noop Program |
使いやすさのため、一部のアカウントはSDKで抽象化および/またはオプションになっている場合があります。
オンチェーン命令の完全な詳細は[Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L123)で確認できます。
{% /totem-accordion %}
{% /totem %}

## コード例

SDKを使用してCore assetをバーンする方法を示します。このスニペットはあなたがアセットの所有者であることを前提としています。
{% code-tabs-imported from="core/burn-asset" frameworks="umi" /%}

## Collectionに属するAssetのバーン

コレクションの一部であるCore assetをバーンするためのSDKの使用方法を示します。このスニペットはあなたがアセットの所有者であることを前提としています。
{% dialect-switcher title="Collectionに属するAssetのバーン" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  burn,
  fetchAsset,
  collectionAddress,
  fetchCollection,
} from '@metaplex-foundation/mpl-core'

const assetId = publicKey('11111111111111111111111111111111')
const asset = await fetchAsset(umi, assetId)
const collectionId = collectionAddress(asset)

let collection = undefined
if (collectionId) {
  collection = await fetchCollection(umi, collectionId)
}

await burn(umi, {
  asset,
  collection,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::instructions::BurnV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn burn_asset_in_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let collection = Pubkey::from_str("2222222222222222222222222222222").unwrap();
    let burn_asset_in_collection_ix = BurnV1Builder::new()
        .asset(asset)
        .collection(Some(collection))
        .payer(authority.pubkey())
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let burn_asset_in_collection_tx = Transaction::new_signed_with_payer(
        &[burn_asset_in_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&burn_asset_in_collection_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## よくあるエラー

### `Authority mismatch`

Assetの所有者またはBurn Delegateではありません。所有権を確認してください：

```ts
const asset = await fetchAsset(umi, assetAddress)
console.log(asset.owner) // 署名者と一致する必要があります
```

### `Asset is frozen`

AssetにFreeze Delegateプラグインがあり、現在フリーズされています。バーンする前にフリーズ権限者が解除する必要があります。

### `Missing collection parameter`

Collection内のAssetの場合、`collection`アドレスを渡す必要があります。最初にAssetを取得してコレクションを取得してください：

```ts
const asset = await fetchAsset(umi, assetAddress)
const collectionId = collectionAddress(asset)
```

## 注意事項

- バーンは**永久的で取り消し不可能** - Assetは回復できません
- レントは所有者に返却されます（金額はアセットサイズとプラグインによって異なります）
- 残りのSOLはアカウントアドレスの再利用を防ぎます
- Burn Delegateは所有者に代わってバーンできます（Burn Delegateプラグイン経由）
- フリーズされたAssetはバーン前に解除する必要があります

## クイックリファレンス

### バーンパラメータ

| パラメータ | 必須 | 説明 |
|-----------|----------|-------------|
| `asset` | はい | Assetアドレスまたは取得したオブジェクト |
| `collection` | コレクション内の場合 | Collectionアドレス |
| `authority` | いいえ | デフォルトは署名者（デリゲート用） |

### 誰がバーンできるか？

| 権限 | バーン可能？ |
|-----------|-----------|
| Asset所有者 | はい |
| Burn Delegate | はい |
| Transfer Delegate | いいえ |
| Update Authority | いいえ |

### レント回収

| 項目 | 金額 |
|------|--------|
| 支払者に返却 | ベース + プラグインストレージレント |
| アカウントに残る | 約0.0009 SOL |

## FAQ

### アカウントに残っている約0.0009 SOLを回収できますか？

いいえ。この少額はアカウントを「バーン済み」としてマークし、そのアドレスが新しいAssetに再利用されるのを防ぐために意図的に残されています。

### バーン後、Assetのメタデータはどうなりますか？

オンチェーンアカウントはクリア（ゼロ化）されます。オフチェーンメタデータは元のURIからアクセス可能ですが、それにリンクするオンチェーンレコードはありません。

### Burn Delegateは所有者の承認なしにバーンできますか？

はい。所有者がプラグイン経由でBurn Delegateを割り当てると、デリゲートはいつでもAssetをバーンできます。所有者は信頼できるアドレスのみをBurn Delegateとして割り当てるべきです。

### バーンはCollectionのカウントに影響しますか？

はい。Assetがバーンされると、Collectionの`currentSize`が減少します。`numMinted`カウンターは変更されません（これまでにミントされた総数を追跡します）。

### 複数のAssetを一度にバーンできますか？

単一の命令ではできません。1つのトランザクションに複数のバーン命令をバッチ処理できます（トランザクションサイズ制限内で）。

## 用語集

| 用語 | 定義 |
|------|------------|
| **バーン** | Assetを永久に破棄してレントを回収する |
| **Burn Delegate** | 所有者に代わってバーンする権限を持つアカウント |
| **レント** | Solana上でアカウントを維持するために預けるSOL |
| **フリーズ** | バーンと転送がブロックされるAssetの状態 |
| **Collection** | Assetが属する可能性のあるグループアカウント |
