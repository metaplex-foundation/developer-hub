---
title: Creating a Core Collection
metaTitle: Create a Core Collection | Metaplex Core
description: How to create a Core Collection on Solana — with and without plugins — using the mpl-core SDK and Umi.
updated: '04-08-2026'
keywords:
  - create collection
  - Core Collection
  - mpl-core
  - createCollection
  - collection plugins
about:
  - Creating NFT collections
  - Core Collections
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
cli: /dev-tools/cli/core/create-collection
agentSkill: /smart-contracts/core/collections/create.md
howToSteps:
  - Install the mpl-core SDK with npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi
  - Upload collection metadata JSON to get a URI
  - Call createCollection(umi, { collection, name, uri })
  - Pass the collection address when creating Assets
howToTools:
  - Node.js
  - Umi framework
  - mpl-core SDK
---

The `createCollection` instruction creates a new [Core Collection](/smart-contracts/core/collections) account on Solana with a name, metadata URI, and optional plugins. {% .lead %}

{% callout title="What You'll Learn" %}
- Create a simple Collection with a name and URI
- Create a Collection with the Royalties plugin attached
- Handle common creation errors
{% /callout %}

## Summary

`createCollection` deploys a new Collection account that groups [Core Assets](/smart-contracts/core/what-is-an-asset) under shared metadata and plugins.

- Requires a fresh keypair as the collection address — reusing an existing address will fail
- Accepts optional [plugins](/smart-contracts/core/plugins) at creation time
- Costs ~0.0015 SOL in rent
- The payer becomes the `updateAuthority` by default

## Quick Start

1. Install: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. Upload collection metadata JSON to get a URI
3. Call `createCollection(umi, { collection, name, uri })`
4. Pass the collection address when creating Assets

**Jump to:** [Simple Collection](#creating-a-simple-collection) · [With Plugins](#creating-a-collection-with-plugins) · [Common Errors](#common-errors)

## Prerequisites

- **Umi** configured with a signer and RPC connection — see [JavaScript SDK](/smart-contracts/core/sdk/javascript)
- **SOL** for transaction fees (~0.002 SOL per collection)
- **Metadata JSON** uploaded to Arweave or IPFS with a collection image and name

## Creating a Simple Collection

`createCollection` requires a `name`, a metadata `uri`, and a new keypair as the collection signer.

{% code-tabs-imported from="core/create-collection" frameworks="umi" /%}

{% callout type="note" %}
The `collection` parameter must be a fresh keypair each time. Reusing an existing address will fail with `Collection account already exists`.
{% /callout %}

## Creating a Collection with Plugins

Pass a `plugins` array to `createCollection` to attach plugins at creation time. The example below attaches the [Royalties plugin](/smart-contracts/core/plugins/royalties).

{% dialect-switcher title="Create a Core Collection with the Royalties plugin" %}
{% dialect title="JavaScript" id="js" %}
```ts {% title="create-collection-with-royalties.ts" %}
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
        { address: creator1, percentage: 20 },
        { address: creator2, percentage: 80 },
      ],
      ruleSet: ruleSet('None'),
    },
  ],
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust {% title="create_collection_with_royalties.rs" %}
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

## Common Errors

### `Collection account already exists`
The collection keypair was already used on this network. Generate a new signer each time:
```ts
const collectionSigner = generateSigner(umi) // Must be a unique keypair
```

### `Insufficient funds`
Your payer wallet needs ~0.002 SOL. Fund it on devnet with:
```bash
solana airdrop 1 <WALLET_ADDRESS> --url devnet
```

## Notes

- Plugins added at creation can be updated later using `updateCollectionPlugin` — see [Update Collection](/smart-contracts/core/collections/update)
- The `updateAuthority` defaults to the payer — pass an explicit `updateAuthority` to set a different account
- All plugins available to Assets can also be applied to Collections — see [Plugins Overview](/smart-contracts/core/plugins)

## Quick Reference

| Item | Value |
|------|-------|
| Instruction | `CreateCollectionV1` |
| JS function | `createCollection` |
| Required accounts | `collection` (new keypair), `payer` |
| Optional accounts | `updateAuthority`, `systemProgram` |
| Required args | `name`, `uri` |
| Optional args | `plugins` |
| Rent cost | ~0.0015 SOL |
| Source | [GitHub](https://github.com/metaplex-foundation/mpl-core/blob/main/programs/mpl-core/src/instruction.rs#L30) |
