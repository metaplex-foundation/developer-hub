---
title: Managing Collections
metaTitle: Core - Verified Collections
description: Learn how to safely manage Collections of Assets on Core
---

## What are Collections?

Collections are a group of Assets that belong together, part of the same series, or group. In order to group Assets together, we must first create a Collection Asset whose purpose is to store any metadata related to that collection such as collection name and collection image. The Collection Asset acts as a front cover to your collection and can also store collection wide plugins.

The data that is stored and accessible from the Collection Asset is as follows;

| Accounts        | Description                                       |
| --------------- | ------------------------------------------------- |
| key             | The account key discriminator                     |
| updateAuthority | The authority of the new asset.                   |
| name            | The collection name.                              |
| uri             | The uri to the collections off-chain metadata.    |
| num minted      | The number of assets minted in the collection.    |
| current size    | The number of assets currently in the collection. |

## Creating a Collection

To create a Core Collection you can use the `CreateCollection` instruction like this:

{% totem %}
{% totem-accordion title="Technical Instruction Details - CreateCollectionV1" %}

**Instruction Accounts List**

| Accounts        | Description                                        |
| --------------- | -------------------------------------------------- |
| collection      | The collection to which the Core Asset belongs to. |
| updateAuthority | The authority of the new asset.                    |
| payer           | The account paying for the storage fees.           |
| systemProgram   | The System Program account.                        |

**Instruction Arguments**

| Arg     | Description                                        |
| ------- | -------------------------------------------------- |
| name    | The collection to which the Core Asset belongs to. |
| uri     | The authority of the new asset.                    |
| plugins | The account paying for the storage fees.           |

Some of the accounts and arguments may be abstracted out and/or optional in our SDKs for ease of use.
A full detailed look at the on chain instruction it can be viewed on [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L30).

{% /totem-accordion %}
{% /totem %}

### Creating a Simple Collection

The following snippet creates a simple collection without Plugins or anything special.

{% dialect-switcher title="Create a MPL Core Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createCollectionV1 } from '@metaplex-foundation/mpl-core'

const collectionSigner = generateSigner(umi)

await createCollectionV1(umi, {
  collection: collectionSigner,
  name: 'My Collection',
  uri: 'https://example.com/my-collection.json',
})
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::instructions::CreateCollectionV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn create_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let collection = Keypair::new();

    let create_collection_ix = CreateCollectionV1Builder::new()
        .collection(collection.pubkey())
        .payer(payer.pubkey())
        .name("My Collection".into())
        .uri("https://example.com/my-collection.json".into())
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

### Creating a Collection with Plugins

The following snippet creates a collection with the [Royalties Plugin](/core/plugins/royalties) attached. You can attach additional plugins as described [here](/core/plugins).

{% dialect-switcher title="Create a MPL Core Collection with Plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import {
  createCollectionV1,
  pluginAuthorityPair,
  ruleSet,
} from '@metaplex-foundation/core'

const collectionSigner = generateSigner(umi)

const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('22222222222222222222222222222222')

await createCollectionV1(umi, {
  collection: collectionSigner,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  plugins: [
    pluginAuthorityPair({
      type: 'Royalties',
      data: {
        basisPoints: 500,
        creators: [
          {
            address: creator1,
            percentage: 20,
          },
          {
            address: creator2,
            percentage: 80,
          },
        ],
        ruleSet: ruleSet('None'), // Compatibility rule set
      },
    }),
  ],
}).sendAndConfirm(umi)
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
            plugin: Plugin::Royalties(Royalties {
                basis_points: 500,
                creators: vec![Creator {
                    address: creator,
                    percentage: 100,
                }],
                rule_set: RuleSet::None,
            }),
            authority: Some(PluginAuthority::None),
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

## Fetch a Collection

To fetch a collection the following function can be used:

{% dialect-switcher title="Fetch a collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchCollectionV1 } from '@metaplex-foundation/mpl-core'
import { publicKey } from '@metaplex-foundation/umi'

const collection = await fetchCollectionV1(umi, publicKey("11111111111111111111111111111111"))

console.log(collection)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use std::str::FromStr;
use mpl_core::Collection;
use solana_client::nonblocking::rpc_client;
use solana_sdk::pubkey::Pubkey;

pub async fn fetch_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let collection_id = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let rpc_data = rpc_client.get_account_data(&collection_id).await.unwrap();

    let collection = Collection::from_bytes(&rpc_data).unwrap();

    print!("{:?}", collection)
}
```

{% /dialect %}
{% /dialect-switcher %}

## Updating a Collection

To update the data of a Core Collection use the `UpdateCollection` instruction. For example, you use this instruction to change the name of a collection.

{% totem %}
{% totem-accordion title="Technical Instruction Details - UpdateCollectionV1" %}

**Instruction Accounts List**

| Accounts           | Description                                        |
| ------------------ | -------------------------------------------------- |
| collection         | The collection to which the Core Asset belongs to. |
| payer              | The account paying for the storage fees.           |
| authority          | The authority of the new asset.                    |
| newUpdateAuthority | The new update authority of the collection.        |
| systemProgram      | The System Program account.                        |
| logWrapper         | The SPL Noop Program.                              |

**Instruction Arguments**

| Args | Description                      |
| ---- | -------------------------------- |
| name | The name of your MPL Core Asset. |
| uri  | The off chain json metadata uri. |

Some of the accounts and arguments may be abstracted out and/or optional in our sdks for ease of use.
A full detailed look at the on chain instruction it can be viewed on [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L167C4-L167C23).

{% /totem-accordion %}
{% /totem %}

{% seperator h="6" /%}

{% dialect-switcher title="Updating a Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updateCollectionV1 } from '@metaplex-foundation/mpl-core'

const collectionAddress = publicKey('1111111111111111111111111111111')

await updateCollectionV1(umi, {
  collection: collectionAddress,
  newName: 'my-nft',
  newUri: 'https://exmaple.com/new-uri',
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use std::str::FromStr;

use mpl_core::instructions::UpdateCollectionV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn update_collection() {

    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let update_collection_ix = UpdateCollectionV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .new_name("My Collection".into())
        .new_uri("https://example.com/my-collection.json".into())
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let update_collection_tx = Transaction::new_signed_with_payer(
        &[update_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&update_collection_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## Updating a Collection Plugin

If you want to change the behaviour of a plugin that is attached to a Core Collection you may want to use the `updateCollectionPlugin` instruction.

{% totem %}
{% totem-accordion title="Technical Instruction Details - UpdateCollectionPluginV1" %}

**Instruction Accounts List**

| Accounts      | Description                                        |
| ------------- | -------------------------------------------------- |
| collection    | The collection to which the Core Asset belongs to. |
| payer         | The account paying for the storage fees.           |
| authority     | The authority of the new asset.                    |
| systemProgram | The System Program account.                        |
| logWrapper    | The SPL Noop Program.                              |

**Instruction Arguments**

| Args   | Description                    |
| ------ | ------------------------------ |
| plugin | The plugin you wish to update. |

Some of the accounts may be abstracted out and/or optional in our sdks for ease of use.
A full detailed look at the on chain instruction it can be viewed on [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L81).

{% /totem-accordion %}
{% /totem %}

{% seperator h="6" /%}

{% dialect-switcher title="Updating a Collection Plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  updateCollectionPluginV1,
  createPlugin,
  ruleSet,
} from '@metaplex-foundation/mpl-core'

const collectionAddress = publicKey('1111111111111111111111111111111')

const newCreator = publicKey('5555555555555555555555555555555')

await updateCollectionPluginV1(umi, {
  collection: collectionAddress,
  plugin: createPlugin({
    type: 'Royalties',
    data: {
      basisPoints: 400,
      creators: [{ address: newCreator, percentage: 100 }],
      ruleSet: ruleSet('None'),
    },
  }),
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use std::str::FromStr;
use mpl_core::{
    instructions::UpdateCollectionPluginV1Builder,
    types::{Creator, Plugin, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn update_collection_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let new_creator = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let update_collection_plugin_ix = UpdateCollectionPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .plugin(Plugin::Royalties(Royalties {
            basis_points: 500,
            creators: vec![Creator {
                address: new_creator,
                percentage: 100,
            }],
            rule_set: RuleSet::None,
        }))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let update_collection_plugin_tx = Transaction::new_signed_with_payer(
        &[update_collection_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&update_collection_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}
