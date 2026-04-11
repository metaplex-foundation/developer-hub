---
title: Updating a Core Collection
metaTitle: Update a Core Collection | Metaplex Core
description: How to update Core Collection metadata and plugins on Solana using the updateCollection and updateCollectionPlugin instructions via the mpl-core SDK.
updated: '04-08-2026'
keywords:
  - update collection
  - updateCollection
  - updateCollectionPlugin
  - Core Collection
  - mpl-core
about:
  - Updating Core Collections
  - Collection plugin management
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
cli: /dev-tools/cli/core/update-asset
howToSteps:
  - Configure Umi with the collection's updateAuthority as signer
  - Call updateCollection with the collection address and new name or URI
  - Call updateCollectionPlugin to change plugin behaviour on the collection
howToTools:
  - Node.js
  - Umi framework
  - mpl-core SDK
agentSkill: /smart-contracts/core.md
---

`updateCollection` and `updateCollectionPlugin` modify an existing [Core Collection's](/smart-contracts/core/collections) metadata and plugin configuration. {% .lead %}

{% callout title="What You'll Learn" %}
- Update a Collection's name or URI
- Update a plugin attached to a Collection
{% /callout %}

## Summary

Two instructions handle post-creation updates to a Core Collection.

- `updateCollection` — change the collection's `name` or `uri`
- `updateCollectionPlugin` — modify the configuration of an existing plugin on the collection
- Both require the `updateAuthority` to sign
- Changes to collection-level plugins propagate to member Assets that inherit them

**Jump to:** [Update Metadata](#updating-collection-metadata) · [Update Plugin](#updating-a-collection-plugin) · [Common Errors](#common-errors)

## Prerequisites

- **Umi** configured with the collection's `updateAuthority` as signer — see [Fetch Collection](/smart-contracts/core/collections/fetch) to retrieve this value
- The collection address you want to update

## Updating Collection Metadata

`updateCollection` changes the `name` and/or `uri` of an existing Collection. Pass only the fields you want to change.

{% dialect-switcher title="Update a Core Collection" %}
{% dialect title="JavaScript" id="js" %}
```ts {% title="update-collection.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { updateCollection } from '@metaplex-foundation/mpl-core'

const collectionAddress = publicKey('1111111111111111111111111111111')

await updateCollection(umi, {
  collection: collectionAddress,
  name: 'My Updated Collection',
  uri: 'https://example.com/new-uri.json',
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust {% title="update_collection.rs" %}
use mpl_core::instructions::UpdateCollectionV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

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

`updateCollectionPlugin` changes the configuration of a plugin already attached to the Collection. This example updates the [Royalties plugin's](/smart-contracts/core/plugins/royalties) basis points and creator split.

{% dialect-switcher title="Update a Core Collection plugin" %}
{% dialect title="JavaScript" id="js" %}
```ts {% title="update-collection-plugin.ts" %}
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
```rust {% title="update_collection_plugin.rs" %}
use mpl_core::{
    instructions::UpdateCollectionPluginV1Builder,
    types::{Creator, Plugin, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

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

### `Authority mismatch`
Your signer is not the collection's `updateAuthority`. Fetch the collection to check:
```ts
const collection = await fetchCollection(umi, collectionAddress)
console.log(collection.updateAuthority) // Must match umi.identity
```

## Notes

- To add a plugin that does not yet exist on the collection, use `addCollectionPlugin` instead of `updateCollectionPlugin`
- Updating a collection-level plugin affects all Assets that inherit it — Assets with their own plugin of the same type are not affected
- Transfer `updateAuthority` to a new account via the `newUpdateAuthority` parameter on `updateCollection`

## Quick Reference

| Instruction | JS Function | When to Use |
|-------------|-------------|-------------|
| `UpdateCollectionV1` | `updateCollection` | Change `name` or `uri` |
| `UpdateCollectionPluginV1` | `updateCollectionPlugin` | Modify an existing plugin's config |

| Account | Required | Description |
|---------|----------|-------------|
| `collection` | Yes | The collection to update |
| `authority` | Yes | Must be the `updateAuthority` |
| `payer` | Yes | Pays transaction fees |
| `newUpdateAuthority` | No | Transfer update authority to a new account |

| Source | Link |
|--------|------|
| UpdateCollectionV1 | [GitHub](https://github.com/metaplex-foundation/mpl-core/blob/main/programs/mpl-core/src/instruction.rs#L167) |
| UpdateCollectionPluginV1 | [GitHub](https://github.com/metaplex-foundation/mpl-core/blob/main/programs/mpl-core/src/instruction.rs#L81) |
