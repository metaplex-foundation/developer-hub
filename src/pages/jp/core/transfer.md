---
title: アセットの転送
metaTitle: アセットの転送 | Core
description: Metaplexパッケージを使用してCore NFTアセットをウォレット間で転送する方法を学びます。
---

Core Assetの所有者は、MPL Coreプログラムへの`transfer`インストラクションを使用して、別のアカウントに所有権を転送できます。

{% totem %}
{% totem-accordion title="技術的インストラクション詳細" %}
**インストラクションアカウントリスト**

| アカウント      | 説明                                          |
| ------------- | -------------------------------------------- |
| asset         | MPL Core Assetのアドレス                      |
| collection    | Core Assetが属するコレクション                  |
| authority     | アセットの所有者または委任者                     |
| payer         | ストレージ手数料を支払うアカウント                |
| newOwner      | アセットを転送する新しい所有者                   |
| systemProgram | システムプログラムアカウント                     |
| logWrapper    | SPL Noopプログラム                           |

一部のアカウントは、使いやすさのためにSDKで抽象化されるか、オプションである場合があります。
オンチェーンインストラクションの詳細な説明は[Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L139)で見ることができます。
{% /totem-accordion %}
{% /totem %}

## Core Assetの転送

{% dialect-switcher title="アセットの転送" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { transferV1 } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')

await transferV1(umi, {
  asset: asset,
  newOwner: newOwner.publicKey,
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```ts
use mpl_core::instructions::TransferV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn transfer_asset() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let new_owner = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let transfer_asset_ix = TransferV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .new_owner(new_owner)
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let transfer_asset_tx = Transaction::new_signed_with_payer(
        &[transfer_asset_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&transfer_asset_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## コレクション内のCore Assetの転送

コレクションを持つアセットを転送する場合は、コレクションアドレスを渡す必要があります。
[アセットがコレクションに含まれているかどうかを確認する方法は？]()

{% dialect-switcher title="コレクションの一部であるアセットの転送" %}
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

## アセットの Transfer Delegate である場合はどうなりますか？

[Transfer Delegate](/jp/core/plugins/transfer-delegate)プラグインを介してアセットのTransfer Delegateである場合、アセットの所有者であるかのように`transferV1`関数を呼び出すことができます。