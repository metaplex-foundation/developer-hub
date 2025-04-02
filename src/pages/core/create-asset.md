---
title: Creating Assets
metaTitle: Creating Assets | Core
description: Learn how to create Core NFT Assets on using the Metaplex Core packages.
---

As discussed in the [Core overview](/core), digital assets on Core are composed of exactly one onchain account and off-chain data describing the token. On this page, we'll go over the process of minting these assets. {% .lead %}

## The Creation Process

1. **Upload off-chain data.** First, we must ensure our off-chain data is ready. This means we must have a JSON file stored somewhere that describes our asset. It doesn't matter how or where that JSON file is stored, as long as it's accessible via a **URI**. The off chain metadata can look similar to the [old token metadata standard](/token-metadata/token-standard#the-non-fungible-standard).
2. **Create onchain Asset account.** Then, we must create the onchain Asset account that will hold our asset's data.

Let's dig into these steps in more detail, whilst providing concrete code examples.

## Uploading off-chain data

You may use any storage service (Arweave, IPFS, AWS etc...) to upload your off-chain data or simply store it on your own server. To make some of these easier for the user `Umi` has some dedicated plugins including the likes of `Irys (uploads to Arweave)` and `nftStorage (uploads to IPFS)`. Once a plugin is selected this grants the user a unified interface for you to upload your data.

{% dialect-switcher title="Upload assets and JSON data" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
const [imageUri] = await umi.uploader.upload([imageFile])
const uri = await umi.uploader.uploadJson({
  name: 'My NFT',
  description: 'This is my NFT',
  image: imageUri,
  // ...
})
```

{% totem-accordion title="Select an uploader" %}

To select the Uploader of your choice using Umi, simply install the plugin provided by the Uploader.

For instance, here is how we can install the Irys plugin:

```ts
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'

umi.use(irysUploader())
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

Now that we have our **URI**, we can move on to the next step.

## Create an Asset

To create an Asset use the `createV1` instruction. The `createV1` instruction, in addition to setting the basic metadata of the Asset, encompasses the likes of adding your Asset to a collection and assigning plugins which is described a bit [later](#create-an-asset-with-plugins).

Below is a simple example:

{% totem %}
{% totem-accordion title="Technical Instruction Details" %}
**Instruction Accounts List**

| Accounts      | Description                                        |
| ------------- | -------------------------------------------------- |
| asset         | The address of the MPL Core Asset.                 |
| collection    | The collection to which the Core Asset belongs to. |
| authority     | The authority of the new asset.                    |
| payer         | The account paying for the storage fees.           |
| new owner     | The owner which should receive the asset.          |
| systemProgram | The System Program account.                        |
| logWrapper    | The SPL Noop Program.                              |

**Instruction Arguments**

| Args      | Description                                                  |
| --------- | ------------------------------------------------------------ |
| dataState | Whether the data is stored in account state or ledger state. |
| name      | The name of your MPL Core Asset.                             |
| uri       | The off-chain JSON metadata URI.                             |
| plugins   | What plugins you would like the asset to have.               |

Some of the accounts/args may be abstracted out and/or optional in our sdks for ease of use.
A full detailed look at the on chain instruction it can be viewed on [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L18)

{% /totem-accordion %}
{% /totem %}

{% seperator h="6" /%}

{% dialect-switcher title="Create Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'

const assetSigner = generateSigner(umi)

const result = await create(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  //owner: publicKey('11111111111111111111111111111111'), //optional to mint into a different wallet
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::instructions::CreateV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{signature::Keypair, signer::Signer, transaction::Transaction};


pub async fn create_asset() {

    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let create_asset_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_tx = Transaction::new_signed_with_payer(
        &[create_asset_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client.send_and_confirm_transaction(&create_asset_tx).await.unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}

{% dialect title="Rust (CPI)" id="rust-cpi" %}

```rust
let create_ix = CreateV1CpiBuilder::new()
        .asset(input.asset.pubkey())
        .collection(input.collection)
        .authority(input.authority)
        .payer(payer)
        .owner(input.owner)
        .update_authority(input.update_authority)
        .system_program(system_program::ID)
        .data_state(input.data_state.unwrap_or(DataState::AccountState))
        .name(input.name.unwrap_or(DEFAULT_ASSET_NAME.to_owned()))
        .uri(input.uri.unwrap_or(DEFAULT_ASSET_URI.to_owned()))
        .plugins(input.plugins)
        .invoke();
```

{% /dialect %}
{% /dialect-switcher %}

<!-- ### Create Asset in Ledger State

{% dialect-switcher title="Create Asset in Account State" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { create, DataState } from '@metaplex-foundation/mpl-core'

const assetAddress = generateSigner(umi)
const result = create(umi, {
  dataState: DataState.LedgerState,
  asset: assetAddress,
  name: 'Test Bread',
  uri: 'https://example.com/bread',
  logWrapper: publicKey('noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV'),
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}
{% totem %}

```rust
// TODO

```

{% totem-prose %}

Note that when setting the `mint` account, it is require to specify a `bool` flag to indicate whether the account will be a signer or not – it need to be a signer if the `mint` account does not exist.

{% /totem-prose %}

{% /totem %}

{% /dialect %}

{% dialect title="Rust (CPI)" id="rust-cpi" %}

```rust
// TODO

```

{% /dialect %}
{% /dialect-switcher %} -->

## Create an Asset into a Collection

MPL Core Assets can be created straight into a collection if your MPL Core Collection already exists. To create a Collection Asset visit [here](/core/collections).

{% dialect-switcher title="Create Asset into Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import {
  createCollection,
  create,
  fetchCollection,
} from '@metaplex-foundation/mpl-core'

const collectionSigner = generateSigner(umi)

// create collection
// if you are doing this in a single script you may have
// to use a sleep function or commitment level of 'finalized'
// so the collection is fully written to change before fetching it.
await createCollection(umi, {
  collection: collectionSigner,
  name: 'My Collection',
  uri: 'https://example.com/my-collection.json',
}).sendAndConfirm(umi)

// fetch the collection
const collection = await fetchCollection(umi, collectionSigner.publicKey)


// generate assetSigner and then create the asset.
const assetSigner = generateSigner(umi)

await create(umi, {
  asset: assetSigner,
  collection: collection,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  //owner: publicKey('11111111111111111111111111111111'), //optional to mint into a different wallet
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::instructions::{CreateCollectionV1Builder, CreateV1Builder};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn create_asset_with_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let signer = Keypair::new(); // Load keypair here.

    let collection = Keypair::new();

    let create_collection_ix = CreateCollectionV1Builder::new()
        .collection(collection.pubkey())
        .payer(signer.pubkey())
        .name("My Collection".into())
        .uri("https://example.com/my-collection.json".into())
        .instruction();

    let signers = vec![&collection, &signer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_collection_tx = Transaction::new_signed_with_payer(
        &[create_collection_ix],
        Some(&signer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_collection_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res);

    let asset = Keypair::new();

    let create_asset_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .collection(Some(collection.pubkey()))
        .payer(signer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .instruction();

    let signers = vec![&asset, &signer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_tx = Transaction::new_signed_with_payer(
        &[create_asset_ix],
        Some(&signer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}

{% dialect title="Rust (CPI)" id="rust-cpi" %}

```rust
let create_ix = CreateV1CpiBuilder::new(input.program)
    .asset(input.asset.pubkey())
    .collection(Some(input.collection))
    .authority(Some(input.authority))
    .payer(input.payer)
    .owner(Some(input.owner))
    .update_authority(Some(input.update_authority))
    .system_program(system_program::ID)
    .data_state(input.data_state.unwrap_or(DataState::AccountState))
    .name(input.name)
    .uri(input.uri)
    .plugins(input.plugins)
    .invoke();
```

{% /dialect %}

{% /dialect-switcher %}

## Create an Asset with Plugins

MPL Core Assets support the use of plugins at both the Collection and Asset levels. To create a Core Asset with a plugin you pass in the plugin type and its parameters into the `plugins` array arg during creation. The below example creates a mint with the `Freeze` plugin.

{% dialect-switcher title="Create Asset with Plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { create, ruleSet } from '@metaplex-foundation/mpl-core'

const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('22222222222222222222222222222222')

const assetSigner = generateSigner(umi)

await create(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    {
      type: 'Royalties',
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

    let creator = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
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

The list of plugins includes but is not limited to:

- [Burn Delegate](/core/plugins/burn-delegate)
- [Freeze Delegate](/core/plugins/freeze-delegate)
- [Royalties](/core/plugins/royalties)
- [Transfer Delegate](/core/plugins/transfer-delegate)
- [Update Delegate](/core/plugins/update-delegate)
