---
title: 获取 Core Collection
metaTitle: 获取 Core Collection | Metaplex Core
description: 如何使用 mpl-core SDK 和 Umi 通过地址从 Solana 获取 Core Collection 账户。
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

`fetchCollection` 通过地址从 Solana 获取 [Core Collection](/smart-contracts/core/collections) 账户并将其反序列化为类型化对象。 {% .lead %}

## Summary

`fetchCollection` 读取 Collection 账户并返回所有链上字段 — 名称、URI、Update Authority、插件数据和成员数量。

- 需要合集的公钥
- 返回包含所有链上字段的类型化 `Collection` 对象
- 如果地址不是有效的 Collection 账户则抛出错误

## 通过地址获取 Collection

将合集的公钥传入 `fetchCollection` 以获取账户。

{% dialect-switcher title="获取 Core Collection" %}
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

- 如果地址不存在或不是 Core Collection 账户，`fetchCollection` 会抛出错误
- `currentSize` 反映合集中当前的 Asset 数量；`numMinted` 是历史总数
- 在写入操作后验证状态，请在 `sendAndConfirm` 之后调用 `fetchCollection`

## Quick Reference

| 项目 | 值 |
|------|-------|
| JS 函数 | `fetchCollection` |
| 必填参数 | 合集公钥 |
| 返回值 | `Collection` 对象 |
| 源码 | [GitHub](https://github.com/metaplex-foundation/mpl-core) |
