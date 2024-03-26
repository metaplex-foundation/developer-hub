---
title: Update Delegate Plugin
metaTitle: Core - Delegating Update permissions
description: Learn how to delegate a update authority on Core
---

The Update Delegate is a `Authority Managed` plugin that allows the authority of the MPL Core Asset to assign an Update Delegate to the Asset.

The Update Delegate Plugin will work in areas such as:

- scenarios where you need a 3rd party to update/edit the entire MPL Core Asset.

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## Arguments

The Update Delegate Plugin doesn't contain any arguments to pass in.

## Adding the Update Delegate Plugin to an Asset

{% dialect-switcher title="Adding a Update Delegate Plugin to an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  addPluginV1,
  createPlugin,
  pluginAuthority,
  addressPluginAuthority,
} from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')
const delegate = publicKey('22222222222222222222222222222222')

await addPluginV1(umi, {
  asset: asset,
  plugin: createPlugin({ type: 'UpdateDelegate' }),
  initAuthority: addressPluginAuthority(delegate),
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```ts
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{Plugin, UpdateDelegate},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_update_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let add_update_delegate_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::UpdateDelegate(UpdateDelegate {}))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let add_update_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[add_update_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&add_update_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /dialect %}
{% /dialect-switcher %}
