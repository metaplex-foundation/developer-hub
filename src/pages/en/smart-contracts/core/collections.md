---
title: Managing Collections
metaTitle: Core Collections | Metaplex Core
description: Learn how to create and manage Core Collections on Solana. Group NFT Assets together, set collection-level royalties, and manage collection metadata.
updated: '01-31-2026'
keywords:
  - NFT collection
  - create collection
  - collection metadata
  - mpl-core collection
  - group NFTs
about:
  - NFT collections
  - Collection management
  - Collection plugins
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
howToSteps:
  - Install SDK with npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi
  - Upload collection metadata JSON to get a URI
  - Call createCollection(umi, { collection, name, uri })
  - Pass collection address when creating Assets
howToTools:
  - Node.js
  - Umi framework
  - mpl-core SDK
faqs:
  - q: What's the difference between a Collection and an Asset?
    a: A Collection is a container that groups Assets together. It has its own metadata but cannot be owned or transferred like an Asset. Assets are the actual NFTs that users own.
  - q: Can I add an existing Asset to a Collection?
    a: Yes, use the update instruction with the newCollection parameter. The Asset's update authority must have permission to add it to the target Collection.
  - q: Do I need a Collection for my NFTs?
    a: No. Assets can exist standalone without a Collection. However, Collections enable collection-level royalties, easier discoverability, and batch operations.
  - q: Can I remove an Asset from a Collection?
    a: Yes, use the update instruction to change the Asset's collection. You need the appropriate authority on both the Asset and Collection.
  - q: What happens if I delete a Collection?
    a: Collections cannot be deleted while they contain Assets. Remove all Assets first, then the Collection account can be closed.
---
This guide shows how to **create and manage Core Collections** on Solana using the Metaplex Core SDK. Collections group related Assets together under a shared identity with collection-level metadata and plugins. {% .lead %}
{% callout title="What You'll Learn" %}
- Create a Collection with name, URI, and optional plugins
- Add Assets to Collections at creation time
- Fetch and update Collection metadata
- Manage collection-level plugins (royalties, etc.)
{% /callout %}
## Summary
A **Collection** is a Core account that groups related Assets together. It stores collection metadata (name, image, description) and can hold plugins that apply to all Assets in the collection.
- Collections act as the "front cover" for a group of Assets
- Assets reference their Collection via the `collection` field
- Collection plugins (like Royalties) can apply to all member Assets
- Creating a Collection costs ~0.0015 SOL
## Out of Scope
Token Metadata Collections (use mpl-token-metadata), compressed NFT collections (use Bubblegum), and migrating existing collections to Core.
## Quick Start
**Jump to:** [Create Collection](#creating-a-simple-collection) · [With Plugins](#creating-a-collection-with-plugins) · [Fetch](#fetch-a-collection) · [Update](#updating-a-collection)
1. Install: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. Upload collection metadata JSON to get a URI
3. Call `createCollection(umi, { collection, name, uri })`
4. Pass collection address when creating Assets
## Prerequisites
- **Umi** configured with a signer and RPC connection
- **SOL** for transaction fees (~0.002 SOL per collection)
- **Metadata JSON** uploaded to Arweave/IPFS with collection image
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
| plugins | Plugins you would like the collection to have.     |
Some of the accounts and arguments may be abstracted out and/or optional in our SDKs for ease of use.
A full detailed look at the on chain instruction it can be viewed on [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L30).
{% /totem-accordion %}
{% /totem %}
### Creating a Simple Collection
The following snippet creates a simple collection without Plugins or anything special.
{% code-tabs-imported from="core/create-collection" frameworks="umi" /%}
### Creating a Collection with Plugins
The following snippet creates a collection with the [Royalties Plugin](/smart-contracts/core/plugins/royalties) attached. You can attach additional plugins as described [on the Plugins page](/smart-contracts/core/plugins).
{% dialect-switcher title="Create a MPL Core Collection with Plugin" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import { createCollection, ruleSet } from '@metaplex-foundation/mpl-core'
const collectionSigner = generateSigner(umi)
const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('22222222222222222222222222222222')
await createCollection(umi, {
  collection: collectionSigner,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
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
const collectionId = publicKey('11111111111111111111111111111111')
const collection = await fetchCollection(umi, collectionId)
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
import { updateCollection } from '@metaplex-foundation/mpl-core'
const collectionAddress = publicKey('1111111111111111111111111111111')
await updateCollection(umi, {
  collection: collectionAddress,
  name: 'my-nft',
  uri: 'https://exmaple.com/new-uri',
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
import { updateCollectionPlugin, ruleSet } from '@metaplex-foundation/mpl-core'
const collectionAddress = publicKey('1111111111111111111111111111111')
const newCreator = publicKey('5555555555555555555555555555555')
await updateCollectionPlugin(umi, {
  collection: collectionAddress,
  plugin: {
    type: 'Royalties',
    basisPoints: 400,
    creators: [{ address: newCreator, percentage: 100 }],
    ruleSet: ruleSet('None'),
  },
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
## Common Errors
### `Collection account already exists`
The collection keypair was already used. Generate a new signer:
```ts
const collectionSigner = generateSigner(umi) // Must be unique
```
### `Authority mismatch`
You're not the update authority of the collection. Check the collection's `updateAuthority` field matches your signer.
### `Insufficient funds`
Your payer wallet needs ~0.002 SOL. Fund it with:
```bash
solana airdrop 1 <WALLET_ADDRESS> --url devnet
```
## Notes
- The `collection` parameter must be a **new keypair** when creating
- Collection plugins are inherited by Assets unless overridden at the Asset level
- Use `fetchCollection` to verify collection state after creation
- The `numMinted` counter tracks total Assets ever created (not current size)
## Quick Reference
### Program ID
| Network | Address |
|---------|---------|
| Mainnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
| Devnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
### Minimum Code
```ts {% title="minimal-collection.ts" %}
import { generateSigner } from '@metaplex-foundation/umi'
import { createCollection } from '@metaplex-foundation/mpl-core'
const collection = generateSigner(umi)
await createCollection(umi, { collection, name: 'My Collection', uri: 'https://...' }).sendAndConfirm(umi)
```
### Cost Breakdown
| Item | Cost |
|------|------|
| Collection account rent | ~0.0015 SOL |
| Transaction fee | ~0.000005 SOL |
| **Total** | **~0.002 SOL** |
## FAQ
### What's the difference between a Collection and an Asset?
A Collection is a container that groups Assets together. It has its own metadata (name, image) but cannot be owned or transferred like an Asset. Assets are the actual NFTs that users own.
### Can I add an existing Asset to a Collection?
Yes, use the `update` instruction with the `newCollection` parameter. The Asset's update authority must have permission to add it to the target Collection.
### Do I need a Collection for my NFTs?
No. Assets can exist standalone without a Collection. However, Collections enable collection-level royalties, easier discoverability, and batch operations.
### Can I remove an Asset from a Collection?
Yes, use the `update` instruction to change the Asset's collection. You need the appropriate authority on both the Asset and Collection.
### What happens if I delete a Collection?
Collections cannot be deleted while they contain Assets. Remove all Assets first, then the Collection account can be closed.
## Glossary
| Term | Definition |
|------|------------|
| **Collection** | A Core account that groups related Assets under shared metadata |
| **Update Authority** | The account that can modify Collection metadata and plugins |
| **numMinted** | Counter tracking total Assets ever created in the Collection |
| **currentSize** | Number of Assets currently in the Collection |
| **Collection Plugin** | A plugin attached to the Collection (e.g., Royalties) |
| **URI** | URL pointing to off-chain JSON metadata for the Collection |
