---
title: immutableMetadata Plugin
metaTitle: Core - immutableMetadata
description: Learn how to make Metadata immutable using Core
---

The Royalties Plugin is a `Authority Managed` plugin that allows to make the Metadata (Name and URI) immutable. It can only be added by the update authority.

This plugin can be used on both the `MPL Core Asset` and the `MPL Core Collection`.

As it is for other plugins, like [royalties](/core/plugins/royalties) when it is assigned to an MPL Core Collection the MPL Core Asset also is used on the Asset. So if it is added to a collection the asset also becomes immutable.

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## Arguments

The Royalties Plugin requires no arguments.

## Adding the Immutability Plugin to an Asset code example

{% dialect-switcher title="Adding a Immutability Plugin to an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  addPluginV1,
  createPlugin,
  updatePluginAuthority,
} from '@metaplex-foundation/mpl-core'


await addPluginV1(umi, {
  asset: asset.publicKey,
  plugin: createPlugin({
    type: 'ImmutableMetadata',
  }),
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Adding the Immutability Plugin to a Collection code example

{% dialect-switcher title="Add Royalties Plugin to Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  addCollectionPluginV1,
  createPlugin,
  ruleSet,
} from '@metaplex-foundation/mpl-core'

await addCollectionPluginV1(umi, {
  collection: collection.publicKey,
  plugin: createPlugin({
    type: 'ImmutableMetadata',
  }),
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```ts
use mpl_core::{
    instructions::AddCollectionPluginV1Builder,
    types::{Creator, Plugin, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_royalties_pluging_to_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();


    let add_royalties_plugin_to_collection_ix = AddCollectionPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .plugin(Plugin::Royalties(Royalties {
            basis_points: 500,
            creators: vec![
                Creator {
                    address: creator1,
                    percentage: 80,
                },
                Creator {
                    address: creator2,
                    percentage: 20,
                },
            ],
            rule_set: RuleSet::None,
        }))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let add_royalties_pluging_to_collection_tx = Transaction::new_signed_with_payer(
        &[add_royalties_pluging_to_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&add_royalties_pluging_to_collection_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /dialect %}
{% /dialect-switcher %}
