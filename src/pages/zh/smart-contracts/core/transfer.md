---
title: 转移资产
metaTitle: 转移资产 | Core
description: 了解如何使用 Metaplex 包在钱包之间转移 Core NFT 资产。
---

Core 资产的所有者可以通过使用 MPL Core 程序的 `transfer` 指令将所有权转移到另一个账户。

{% totem %}
{% totem-accordion title="技术指令详情" %}
**指令账户列表**

| 账户          | 描述                                |
| ------------- | ----------------------------------- |
| asset         | MPL Core 资产的地址。               |
| collection    | Core 资产所属的集合。               |
| authority     | 资产的所有者或委托。                |
| payer         | 支付存储费用的账户。                |
| newOwner      | 要转移资产到的新所有者。            |
| systemProgram | 系统程序账户。                      |
| logWrapper    | SPL Noop 程序。                     |

在我们的 SDK 中，某些账户可能会被抽象化和/或可选，以便于使用。
可以在 [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L139) 上查看链上指令的完整详细信息。
{% /totem-accordion %}
{% /totem %}

## 转移 Core 资产

{% dialect-switcher title="转移资产" %}
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

## 转移集合中的 Core 资产

如果您正在转移具有集合的资产，则需要传入集合地址。
[如何判断资产是否在集合中？]()

{% dialect-switcher title="转移集合中的资产" %}
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

## 如果我是资产的转移委托怎么办？

如果您通过[转移委托](/zh/smart-contracts/core/plugins/transfer-delegate)插件成为资产的转移委托，那么您可以像资产所有者一样调用 `transferV1` 函数。
