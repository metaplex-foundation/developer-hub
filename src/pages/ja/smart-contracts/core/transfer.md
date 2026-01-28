---
title: アセットの転送
metaTitle: アセットの転送 | Metaplex Core
description: Solana上でCore NFTアセットをウォレット間で転送する方法を学びます。NFTを他のユーザーに送信し、コレクション転送を処理し、Transfer Delegateを使用します。
---

このガイドでは、Metaplex Core SDKを使用してSolana上で**Core Assetをウォレット間で転送**する方法を説明します。単一のインストラクションでNFTを他のユーザーに送信できます。 {% .lead %}

{% callout title="学習内容" %}

- Assetを新しい所有者に転送する
- コレクション内のAssetの転送を処理する
- 認可された転送にTransfer Delegateを使用する
- 転送権限の要件を理解する

{% /callout %}

## 概要

`transfer`インストラクションを使用してCore Assetを新しい所有者に転送します。現在の所有者（または認可されたTransfer Delegate）のみが転送を開始できます。

- 受信者のアドレスで`transfer(umi, { asset, newOwner })`を呼び出す
- コレクションAssetの場合は、`collection`パラメータを含める
- Transfer Delegateは所有者に代わって転送可能
- 転送は無料（トランザクション手数料のみ適用）

## 対象外

Token Metadata転送（mpl-token-metadataを使用）、バッチ転送（Assetをループ処理）、マーケットプレイス販売（エスクロープログラムを使用）。

## クイックスタート

**移動先:** [基本的な転送](#core-assetの転送) · [コレクション転送](#コレクション内のcore-assetの転送) · [Delegate転送](#アセットのtransfer-delegateである場合はどうなりますか)

1. インストール: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. Assetをフェッチして所有権とコレクションメンバーシップを確認
3. `transfer(umi, { asset, newOwner })`を呼び出す
4. `fetchAsset()`で所有権が変更されたことを確認

## 前提条件

- Assetを所有する（またはTransfer Delegateである）署名者で設定された**Umi**
- 転送するAssetの**Assetアドレス**
- 新しい所有者の**受信者アドレス**（公開鍵）

Core Assetの所有者は、MPL Coreプログラムへの`transfer`インストラクションを使用して、別のアカウントに所有権を転送できます。

{% totem %}
{% totem-accordion title="技術的インストラクション詳細" %}
**インストラクションアカウントリスト**

| アカウント      | 説明                                          |
| ------------- | -------------------------------------------- |
| asset         | MPL Core Assetのアドレス                      |
| collection    | Core Assetが属するコレクション                  |
| authority     | アセットの所有者またはデリゲート                 |
| payer         | ストレージ手数料を支払うアカウント                |
| newOwner      | アセットを転送する新しい所有者                   |
| systemProgram | System Programアカウント                      |
| logWrapper    | SPL Noopプログラム                           |

一部のアカウントは、使いやすさのためにSDKで抽象化されるか、オプションである場合があります。
オンチェーンインストラクションの詳細な説明は[Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L139)で見ることができます。
{% /totem-accordion %}
{% /totem %}

## Core Assetの転送

{% code-tabs-imported from="core/transfer-asset" frameworks="umi" /%}

## コレクション内のCore Assetの転送

コレクションを持つAssetを転送する場合は、コレクションアドレスを渡す必要があります。
[Assetがコレクションに含まれているかどうかを確認する方法は？]()

{% dialect-switcher title="コレクションの一部であるAssetの転送" %}
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

## アセットのTransfer Delegateである場合はどうなりますか？

[Transfer Delegate](/ja/smart-contracts/core/plugins/transfer-delegate)プラグインを介してAssetのTransfer Delegateである場合、Assetの所有者であるかのように`transferV1`関数を呼び出すことができます。

## よくあるエラー

### `Authority mismatch`

AssetのオーナーまたはTransfer Delegateではありません。所有権を確認してください：

```ts
const asset = await fetchAsset(umi, assetAddress)
console.log(asset.owner) // 署名者と一致する必要があります
```

### `Asset is frozen`

AssetにはFreeze Delegateプラグインがあり、現在フリーズされています。転送前にフリーズ権限者がフリーズを解除する必要があります。

### `Missing collection parameter`

コレクション内のAssetの場合、`collection`アドレスを渡す必要があります。Assetにコレクションがあるか確認してください：

```ts
const asset = await fetchAsset(umi, assetAddress)
if (asset.updateAuthority.type === 'Collection') {
  console.log('Collection:', asset.updateAuthority.address)
}
```

## 注意事項

- 転送は**無料** - レントコストなし、トランザクション手数料のみ（約0.000005 SOL）
- 新しい所有者はAssetの完全な制御権を受け取ります
- Transfer Delegateは転送成功後に取り消されます
- フリーズされたAssetはフリーズ解除されるまで転送できません
- 常にAssetをフェッチしてコレクションメンバーシップを確認してください

## クイックリファレンス

### 転送パラメータ

| パラメータ | 必須 | 説明 |
|-----------|----------|-------------|
| `asset` | はい | Assetアドレスまたはフェッチされたオブジェクト |
| `newOwner` | はい | 受信者の公開鍵 |
| `collection` | コレクション内の場合 | コレクションアドレス |
| `authority` | いいえ | デフォルトは署名者（デリゲートに使用） |

### 誰が転送できますか？

| 権限 | 転送可能？ |
|-----------|---------------|
| Asset所有者 | はい |
| Transfer Delegate | はい（転送後に取り消し） |
| Update Authority | いいえ |
| Collection Authority | いいえ |

## FAQ

### Assetがコレクションに含まれているかどうかを確認する方法は？

Assetをフェッチして`updateAuthority`を確認してください：

```ts
const asset = await fetchAsset(umi, assetAddress)
if (asset.updateAuthority.type === 'Collection') {
  // asset.updateAuthority.addressをcollectionパラメータとして渡す
}
```

### 自分自身に転送できますか？

はい。自分のアドレスへの転送は有効です（ウォレットの統合やテストに便利です）。

### 転送後にTransfer Delegateはどうなりますか？

Transfer Delegateプラグインは転送が完了すると自動的に取り消されます。新しい所有者は必要に応じて新しいデリゲートを割り当てる必要があります。

### 転送をキャンセルできますか？

いいえ。転送はアトミックです - トランザクションが確認されると、所有権は変更されています。キャンセルする保留状態はありません。

### 一度に複数のAssetを転送できますか？

単一のインストラクションではできません。1つのトランザクションで複数の転送インストラクションをバッチ処理できます（トランザクションサイズ制限まで）が、各Assetには独自の転送呼び出しが必要です。

### 転送するとUpdate Authorityは変更されますか？

いいえ。転送は所有権のみを変更します。Update Authorityは`update`インストラクションで明示的に変更しない限り同じままです。

## 用語集

| 用語 | 定義 |
|------|------------|
| **Owner** | 現在Assetを所有しているウォレット |
| **Transfer Delegate** | 所有者に代わって転送を許可されたアカウント |
| **Frozen** | 転送がブロックされているAssetの状態 |
| **New Owner** | Assetを受け取る受信者ウォレット |
| **Collection** | Assetが属するコレクション（転送要件に影響） |

---

*Metaplex Foundationによって管理・2026年1月最終確認・@metaplex-foundation/mpl-coreに適用*
