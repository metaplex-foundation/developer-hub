---
title: Transfer Delegate Plugin
metaTitle: Core - Transfer Plugin
description: Learn about the MPL Core Asset Transfer Plugin
---

## Overview

The `Transfer Delegate` Plugin is a `Owner Managed` plugin that allows the authority of the Transfer Delegate Plugin to transfer the Asset at any time.

The Transfer Plugin will work in areas such as;

- Escrowless sale of the Asset.
- Gaming scenario where the user swaps/loses their asset based on an event.

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |

## Arguments

The Transfer Plugin doesn't contain any arguments to pass in.

## Adding the Transfer Plugin to an Asset

{% dialect-switcher title="Adding a Transfer Plugin to an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPluginV1, createPlugin } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')

await addPluginV1(umi, {
  asset: asset,
  plugin: createPlugin({ type: 'TransferDelegate' }),
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{Plugin, TransferDelegate},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_transfer_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let add_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::TransferDelegate(TransferDelegate {}))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let add_plugin_tx = Transaction::new_signed_with_payer(
        &[add_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&add_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /dialect %}
{% /dialect-switcher %}
