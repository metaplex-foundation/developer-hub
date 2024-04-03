---
title: Permanent Burn Delegate
metaTitle: Core - Permanent Burn Delegate
description: Learn about the Permanent Burn Plugin for MPL Core Assets
---

## Overview

The Permanent Burn Plugin is a `Permanent` plugin that will always be present on the MPL Core Asset or MPL Core Collection to which it was added. A permanent plugin can only be added at the time of Asset or Collection creation. This plugin allows the authority of the plugin to burn the asset at any point in time.

The Permanent Burn Plugin will work in areas such as;

- Gaming event which triggers the burning of the asset.

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## Arguments

The Permanent Burn Plugin doesn't contain any arguments to pass in.

## Creating an Asset with a Permanent Burn Plugin

{% dialect-switcher title="Creating an Asset with a Permanent Freeze plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  createV1,
  createPlugin,
  pluginAuthority,
  addressPluginAuthority,
} from '@metaplex-foundation/mpl-core'

const delegate = publicKey('33333333333333333333333333333')

await createV1(umi, {
  asset: asset.publicKey,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  plugins: [
    {
      plugin: createPlugin({
        type: 'PermanentBurnDelegate',
      }),
      authority: addressPluginAuthority(delegate),
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::CreateV1Builder,
    types::{PermanentBurnDelegate, Plugin, PluginAuthority, PluginAuthorityPair},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn create_asset_with_permanent_burn_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let create_asset_with_permanent_burn_delegate_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::PermanentBurnDelegate(PermanentBurnDelegate {}),
            authority: Some(PluginAuthority::None),
        }])
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_permanent_burn_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_permanent_burn_delegate_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_permanent_burn_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}

{% /dialect-switcher %}
