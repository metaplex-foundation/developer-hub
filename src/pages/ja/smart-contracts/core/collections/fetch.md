---
title: Core Collectionの取得
metaTitle: Core Collectionの取得 | Metaplex Core
description: mpl-core SDKとUmiを使用してアドレスでSolanaからCore Collectionアカウントを取得する方法。
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

`fetchCollection`はアドレスでSolanaから[Core Collection](/smart-contracts/core/collections)アカウントを取得し、型付きオブジェクトにデシリアライズします。 {% .lead %}

## Summary

`fetchCollection`はCollectionアカウントを読み取り、名前、URI、Update Authority、プラグインデータ、メンバー数などすべてのオンチェーンフィールドを返します。

- Collectionの公開鍵が必要です
- すべてのオンチェーンフィールドを持つ型付き`Collection`オブジェクトを返します
- アドレスが有効なCollectionアカウントでない場合はエラーをスローします

## アドレスによるCollectionの取得

CollectionのPublic Keyを`fetchCollection`に渡してアカウントを取得します。

{% dialect-switcher title="Core Collectionの取得" %}
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

- アドレスが存在しないか、Core Collectionアカウントでない場合、`fetchCollection`はエラーをスローします
- `currentSize`はコレクション内の現在のAsset数を反映し、`numMinted`は累計総数です
- 書き込み操作後に状態を確認するには、`sendAndConfirm`の後に`fetchCollection`を呼び出してください

## Quick Reference

| 項目 | 値 |
|------|-------|
| JS関数 | `fetchCollection` |
| 必須引数 | CollectionのPublic Key |
| 戻り値 | `Collection`オブジェクト |
| ソース | [GitHub](https://github.com/metaplex-foundation/mpl-core) |
