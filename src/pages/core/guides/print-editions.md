---
title: Print Editions with MPL Core
metaTitle: Print Editions | Core Guides
description: This guide shows you how to combine plugins to create Editions with the Metaplex Core protocol.
---

## Introduction

### What is an Edition?

An Edition is a copy of the same "Master Edition". To understand the concept it can be helpful to think of physical Paintings: The Master Edition is the initial Painting, the Editions, also known as prints, are copies of that painting. 

### Editions with Core

MPL Core Edition support was added close after to the mainnet release. Different to Token Metadata Editions the Edition Numbers and Supply are not enforced, but informational.

To achieve the Edition concept in Core two [Plugins](/core/plugins) are used: [Master Edition](/core/plugins/master-edition) in the Collection and [Edition](/core/plugins/edition) in the Asset, which are the prints. The hierarchy looks like this:

{% diagram %}
{% node %}
{% node #master label="Master Edition" theme="indigo" /%}
{% /node %}
{% node y="50" parent="master" theme="transparent" %}
Collection with 

Master Edition Plugin
{% /node %}

{% node x="200" y="-70" parent="master" %}
{% node #asset1 label="Edition" theme="blue" /%}
{% /node %}
{% node y="70" parent="asset1" %}
{% node #asset2 label="Edition" theme="blue" /%}
{% /node %}
{% node y="70" parent="asset2" %}
{% node #asset3 label="Edition" theme="blue" /%}
{% /node %}

{% node y="50" parent="asset3" theme="transparent" %}
Assets with 

Edition Plugin
{% /node %}

{% edge from="master" to="asset1" /%}
{% edge from="master" to="asset2" /%}
{% edge from="master" to="asset3" /%}

{% /diagram %}

## Create Editions using Candy Machine

The easiest method to create and sell Edition is by leveraging Core Candy Machine. 

The following Code creates a Master Edition Collection and the Candy Machine that prints the Editions for you.

{% dialect-switcher title="Create a Candy Machine with Edition Guard and Master Edition Collection" %} 
{% dialect title="JavaScript" id="js" %}

First all the required functions are imported and Umi set up with your RPC and Wallet:

```ts
import {
  create,
  mplCandyMachine,
} from "@metaplex-foundation/mpl-core-candy-machine";
import { 
    createCollection, 
    ruleSet 
} from "@metaplex-foundation/mpl-core";
import crypto from "crypto";
import {
  generateSigner,
  keypairIdentity,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

// Use the RPC endpoint of your choice.
const umi = createUmi("http://127.0.0.1:8899").use(mplCandyMachine());

// use your keypair or Wallet Adapter here.
const keypair = generateSigner(umi);
umi.use(keypairIdentity(keypair));
```

After this setup we can create the Collection with [Master Edition Plugin](/core/plugins/master-edition). The `maxSupply` field determines how many Editions you want to print. The `name` and `uri` fields in the Plugin can be used in addition to the Collection Name and uri.

For ease of use we also add the [Royalty Plugin](/core/plugins/royalties).

```ts
const collectionSigner = generateSigner(umi);
await createCollection(umi, {
  collection: collectionSigner,
  name: "Master Edition",
  uri: "https://example.com/master-edition.json",
  plugins: [
    {
      type: "MasterEdition",
        maxSupply: 100,
        //name and uri are not needed if you want them to be similar to the parent collection
        name: undefined,
        uri: undefined,
    },
    {
      type: "Royalties",
      basisPoints: 500,
      creators: [{ address: umi.identity.publicKey, percentage: 100 }],
      ruleSet: ruleSet("None"),
    }
    ]
  }).sendAndConfirm(umi);
```

After the creation of the Collection we can create the candy machine using `hiddenSettings` and the `edition` guard.

- `hiddenSettings` are used to assign the same, or similar, Name and Metadata to all Assets minted. You can use a `$ID$` variable that will be replaced by the index of the minted Asset on mint.
- The `edition` Guard is used to add the [Edition Plugin](/core/plugins/edition) to the Assets. The Edition number is increasing for each minted Asset, starting with the number in `editionStartOffset`.

```ts
// The Name and off chain Metadata of your Editions
const editionData = {
  name: "Edition Name",
  uri: "https://example.com/edition-asset.json",
};

// This creates a hash that editions do not 
// use but the Candy Machine requires  
const string = JSON.stringify(editionData);
const hash = crypto.createHash("sha256").update(string).digest();

const candyMachine = generateSigner(umi);
const createIx = await create(umi, {
  candyMachine,
  collection: collectionSigner.publicKey,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 100,
  hiddenSettings: {
    name: editionData.name,
    uri: editionData.uri,
    hash,
  },
  guards: {
    edition: { editionStartOffset: 0 },
    // ... additional Guards
  },
})

await createIx.sendAndConfirm(umi);
```

{% /dialect %} 
{% /dialect-switcher %}

That's it! 

Now users can mint editions from your candy machine.

## Create Editions without Core Candy Machine

{% callout type="note" %}
We strongly recommend to use Core Candy Machine for MPL Core Editions. Candy Machine handles the creation and also the correct numbering of the editions for you.
{% /callout %}

To create an Edition without Core Candy Machine you would:

1. Create a Collection using the [Master Edition](/core/plugins/master-edition) Plugin

{% dialect-switcher title="Create a MPL Core Collection with Master Edition Plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import {
  createCollection,
  ruleSet,
} from '@metaplex-foundation/core'

const collectionSigner = generateSigner(umi)

const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('22222222222222222222222222222222')

await createCollection(umi, {
  collection: collectionSigner,
  name: "Master Edition",
  uri: "https://example.com/master-edition.json",
  plugins: [
    {
      type: "MasterEdition",
        maxSupply: 100,
        //name and uri are not needed if you want them to be similar to the parent collection
        name: undefined,
        uri: undefined,
    },
    {
      type: "Royalties",
      basisPoints: 500,
      creators: [
        { address: creator1, percentage: 50 }, 
        { address: creator2, percentage: 50 }
      ],
      ruleSet: ruleSet("None"),
    }
    ]
  }).sendAndConfirm(umi);
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::CreateCollectionV1Builder,
    types::{Creator, Plugin, PluginAuthority, PluginAuthorityPair, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn create_collection_with_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let collection = Keypair::new();

    let creator = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_collection_ix = CreateCollectionV1Builder::new()
        .collection(collection.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::MasterEdition(MasterEdition {
                max_supply: 100,
                name: "My Master Edition"
                uri: "https://example.com/my-master-edition",
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

2. Create Assets with the [Edition](/core/plugins/edition) Plugin. Remember to increase the number in the plugin.

{% dialect-switcher title="Creating an MPL Core Asset with the Edition Plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { 
    create, 
} from '@metaplex-foundation/mpl-core'

const asset = generateSigner(umi)

const result = create(umi, {
  asset: asset,
  name: 'My Nft',
  uri: 'https://example.com/my-nft',
  collection: collectionSigner.publicKey,
  plugins: [
    {
      type: 'Edition',
      number: 1,
    }
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use std::str::FromStr;
use mpl_core::{
    instructions::CreateV1Builder,
    types::{Creator, Plugin, PluginAuthority, PluginAuthorityPair, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn create_asset_with_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();
    let authority = Keypair::new();

    let creator = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::Edition(Edition {
                number: 1,
            })
        }])
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /dialect %}

{% /dialect-switcher %}

## Further Reading
- [Mint from Candy Machine](/core-candy-machine/mint)
- [Master Edition Plugin](/core/plugins/master-edition)
- [Edition Plugin](/core/plugins/edition)