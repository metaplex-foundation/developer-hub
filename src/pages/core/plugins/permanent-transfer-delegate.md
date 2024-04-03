---
title: Permanent Transfer
metaTitle: Core - Permanent Transfer Plugin
description: Learn about the Permanent Transfer Plugin for MPL Core Assets
---

## Overview

The Permanent Transfer Delegate Plugin is a `Permanent` plugin that will always be present on the MPL Core Asset or MPL Core Collection to which it is added. A permanent plugin can only be added at the time of Asset or Collection creation. This plugin allows the plugin authority to transfer the asset at any point to another address.

The Permanent Transfer Plugin will work in areas such as:

- Gaming event triggers the transfer of a users Asset to another wallet.

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## Arguments

| Arg    | Value |
| ------ | ----- |
| frozen | bool  |

## Creating a MPL Core Asset with a Permanent Transfer Plugin

{% dialect-switcher title="## Creating a MPL Core Asset with a Permanent Transfer Plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  createV1,
  createPlugin,
  pluginAuthority,
  addressPluginAuthority,
} from '@metaplex-foundation/mpl-core'

const assetSigner = generateSigner(umi)

const delegate = publicKey('33333333333333333333333333333')

await createV1(umi, {
  asset: asset.publicKey,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  plugins: [
    {
      plugin: createPlugin({
        type: 'PermanentTransferDelegate',
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
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn create_asset_with_permanent_burn_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let delegate = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_burn_transfer_delegate_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::PermanentBurnDelegate(PermanentBurnDelegate {}),
            authority: Some(PluginAuthority::Address { address: delegate }),
        }])
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_burn_transfer_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_burn_transfer_delegate_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_burn_transfer_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}
