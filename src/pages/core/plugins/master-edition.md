---
title: Master Edition Plugin
metaTitle: Master Edition Plugin | Core
description: Learn about the MPL Core Master Edition Plugin.
---

The Master Edition Plugin is a `Authority Managed` plugin that is used with Core Collections to group [Editions](/core/plugins/edition), provide provenance and store the maximum edition supply. Together with the Edition Plugin those Editions could be compared to the [Edition concept in Metaplex Token Metadata](/token-metadata/print).

The Master Edition Plugin will work in areas such as:

- Grouping Editions
- Providing Procenance

{% callout type="note" title="Intended Useage" %}

We recommend to

- Group the Editions using the Master Edition Plugin
- use Candy Machine with the Edition Guard to handle numbering automatically.

{% /callout %}

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ❌  |
| MPL Core Collection | ✅  |

## Arguments

| Arg       | Value                | Usecase                                                                         |
| --------- | -------------------- | ------------------------------------------------------------------------------- |
| maxSupply | Option<number> (u32) | Indicate how many prints will exist as maximum. Optional to allow Open Editions |
| name      | Option<String>       | Name of the Editions (if different to the Collection Name)                      |
| uri       | Option<String>       | URI of the Editions (if different to the Collection uri)                       |

These values can be changed by the Authority at any time. They are purely informational and not enforced.

## Creating a Collection with the Master Edition plugin

{% dialect-switcher title="Create a MPL Core Collection with Master Edition Plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import { createCollection } from '@metaplex-foundation/core'

const collectionSigner = generateSigner(umi)

await createCollection(umi, {
  collection: collectionSigner,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  plugins: [
    {
      type: 'MasterEdition',
      maxSupply: 100,
      name: 'My Master Edition',
      uri: 'https://example.com/my-master-edition.json',
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::CreateCollectionV1Builder,
    types::{Creator, Plugin, PluginAuthority, PluginAuthorityPair},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn create_collection_with_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let collection = Keypair::new();

    let create_collection_ix = CreateCollectionV1Builder::new()
        .collection(collection.pubkey())
        .payer(payer.pubkey())
        .name("My Collection".into())
        .uri("https://example.com/my-collection.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::MasterEdition(MasterEdition {
                max_supply: 100,
                name: "My Master Edition"
                uri: "https://example.com/my-master-edition.json",
            }),
            authority: Some(PluginAuthority::UpdateAuthority),
        }])
        .instruction();

    let signers = vec![&collection, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_collection_tx = Transaction::new_signed_with_payer(
        &[create_collection_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_collection_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}

{% /dialect-switcher %}

## Update the Master Edition Plugin

If the Master Edition Plugin is mutable it can be updated similar to other Collection Plugins:

{% dialect-switcher title="Update Master Edition Plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePluginV1, createPlugin } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')

await updatePlugin(umi, {
  asset: asset,
  plugin: {
    type: 'MasterEdition',
    maxSupply: 110,
    name: 'My Master Edition',
    uri: 'https://example.com/my-master-edition',
  },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}
_coming soon_

{% /dialect %}
{% /dialect-switcher %}
