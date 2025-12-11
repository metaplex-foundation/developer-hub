---
title: アセットの更新
metaTitle: アセットの更新 | Core
description: Metaplexパッケージを使用してCore NFTアセットを更新する方法を学びます。
---

Core Assetの更新権限または委任者は、アセットのデータの一部を変更する能力を持っています。

{% totem %}
{% totem-accordion title="技術的インストラクション詳細" %}

**インストラクションアカウントリスト**

| アカウント         | 説明                                          |
| ------------------ | -------------------------------------------- |
| asset              | MPL Core Assetのアドレス                      |
| collection         | Core Assetが属するコレクション                  |
| payer              | ストレージ手数料を支払うアカウント                |
| authority          | アセットの所有者または委任者                     |
| newUpdateAuthority | アセットの新しい更新権限                        |
| systemProgram      | システムプログラムアカウント                     |
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

{% dialect-switcher title="アセットの更新" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { update, fetchAsset } from '@metaplex-foundation/mpl-core'

const assetId = publicKey('11111111111111111111111111111111')
const asset = await fetchAsset(umi, assetId)

// オプション：アセットがコレクションにある場合、コレクションを取得
const collectionId = publicKey('2222222222222222222222222222222')
const collection = await fetchCollection(umi, collectionId)

await update(umi, {
  asset,
  // オプション：アセットがコレクションの一部である場合のみコレクションが必要
  collection,
  name: 'New Nft Name',
  uri: 'https://example.com/new-uri',
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```ts
use mpl_core::instructions::UpdateV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn update_asset() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    // オプション：アセットがコレクションにある場合、コレクションを取得
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let update_asset_ix = UpdateV1Builder::new()
        .asset(asset)
        // オプション：アセットがコレクションの一部である場合のみコレクションが必要
        .collection(collection)
        .payer(authority.pubkey())
        .new_name("My asset".into())
        .new_uri("https://example.com/my-asset.json".into())
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

以下は、SDKを使用してCore Assetを完全に不変にする方法です。[不変性ガイド](/ja/core/guides/immutability)で説明されているように、不変性には異なるレベルがあることに注意してください。

{% callout type="warning" title="重要" %}

これは破壊的なアクションであり、アセットを更新する能力を削除します。

また、アセットが所属していたコレクションからアセットを削除します。コレクションアセットを不変にするには、コレクションの更新権限を変更する必要があります。

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