---
title: Fetching a Core Collection
metaTitle: Fetch a Core Collection | Metaplex Core
description: How to fetch a Core Collection account from Solana by address using the mpl-core SDK and Umi.
updated: '04-08-2026'
keywords:
  - fetch collection
  - fetchCollection
  - Core Collection
  - mpl-core
  - read collection data
about:
  - Fetching Core Collections
  - Reading onchain data
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---

`fetchCollection` retrieves a [Core Collection](/smart-contracts/core/collections) account from Solana by its address and deserialises it into a typed object. {% .lead %}

## Summary

`fetchCollection` reads a Collection account and returns all its onchain fields — name, URI, update authority, plugin data, and member counts.

- Requires the collection's public key
- Returns a typed `Collection` object with all onchain fields
- Throws if the address is not a valid Collection account

## Fetching a Collection by Address

Pass the collection's public key to `fetchCollection` to retrieve the account.

{% dialect-switcher title="Fetch a Core Collection" %}
{% dialect title="JavaScript" id="js" %}
```ts {% title="fetch-collection.ts" %}
import { fetchCollection } from '@metaplex-foundation/mpl-core'
import { publicKey } from '@metaplex-foundation/umi'

const collectionId = publicKey('11111111111111111111111111111111')
const collection = await fetchCollection(umi, collectionId)

console.log(collection)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust {% title="fetch_collection.rs" %}
use mpl_core::Collection;
use solana_client::nonblocking::rpc_client;
use solana_sdk::pubkey::Pubkey;
use std::str::FromStr;

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

## Notes

- `fetchCollection` throws if the address does not exist or is not a Core Collection account
- `currentSize` reflects the live count of Assets in the collection; `numMinted` is the all-time total
- To verify state after a write, call `fetchCollection` after `sendAndConfirm`

## Quick Reference

| Item | Value |
|------|-------|
| JS function | `fetchCollection` |
| Required arg | Collection public key |
| Returns | `Collection` object |
| Source | [GitHub](https://github.com/metaplex-foundation/mpl-core) |
