---
title: アセットのバーン
metaTitle: アセットのバーン | Core
description: Metaplex CoreパッケージでCore NFTアセットをバーンする方法を学びます。
---

アセットは`burn`インストラクションを使用してバーンできます。これにより、レント免除手数料が所有者に返されます。アカウントが再開されることを防ぐために、非常に少量のSOL（0.00089784）がアカウントに残ります。

{% totem %}
{% totem-accordion title="技術的インストラクション詳細" %}
**インストラクションアカウントリスト**

| アカウント      | 説明                                          |
| ------------- | -------------------------------------------- |
| asset         | MPL Core Assetのアドレス                      |
| collection    | Core Assetが属するコレクション                  |
| payer         | ストレージ手数料を支払うアカウント                |
| authority     | アセットの所有者または委任者                     |
| systemProgram | システムプログラムアカウント                     |
| logWrapper    | SPL Noopプログラム                           |

一部のアカウントは、使いやすさのためにSDKで抽象化されるか、オプションである場合があります。
オンチェーンインストラクションの詳細な説明は[Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L123)で見ることができます。
{% /totem-accordion %}
{% /totem %}

## コード例

以下は、SDKを使用してCoreアセットをバーンする方法です。このスニペットは、あなたがアセットの所有者であることを前提としています。

{% dialect-switcher title="アセットのバーン" %}
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

await burn(umi, {
  asset: asset,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::instructions::BurnV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn burn_asset() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let burn_asset_ix = BurnV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let burn_asset_tx = Transaction::new_signed_with_payer(
        &[burn_asset_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&burn_asset_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## コレクションの一部であるアセットのバーン

以下は、コレクションの一部であるCoreアセットをバーンするためにSDKを使用する方法です。このスニペットは、あなたがアセットの所有者であることを前提としています。

{% dialect-switcher title="コレクションの一部であるアセットのバーン" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { burnV1, fetchAsset } from '@metaplex-foundation/mpl-core'

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
  collection = await fetchCollection(umi, collection)
}

await burn(umi, {
  asset: asset,
  collection: collection,
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