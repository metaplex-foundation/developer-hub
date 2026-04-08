---
title: Core Collection 조회
metaTitle: Core Collection 조회 | Metaplex Core
description: mpl-core SDK와 Umi를 사용하여 주소로 Solana에서 Core Collection 계정을 조회하는 방법.
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

`fetchCollection`은 주소로 Solana에서 [Core Collection](/smart-contracts/core/collections) 계정을 조회하고 타입이 지정된 객체로 역직렬화합니다. {% .lead %}

## Summary

`fetchCollection`은 Collection 계정을 읽고 이름, URI, Update Authority, 플러그인 데이터, 멤버 수 등 모든 온체인 필드를 반환합니다.

- 컬렉션의 공개 키가 필요합니다
- 모든 온체인 필드를 가진 타입이 지정된 `Collection` 객체를 반환합니다
- 주소가 유효한 Collection 계정이 아닌 경우 오류를 발생시킵니다

## 주소로 Collection 조회

Collection의 공개 키를 `fetchCollection`에 전달하여 계정을 조회합니다.

{% dialect-switcher title="Core Collection 조회" %}
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

- 주소가 존재하지 않거나 Core Collection 계정이 아닌 경우 `fetchCollection`은 오류를 발생시킵니다
- `currentSize`는 컬렉션 내 현재 Asset 수를 반영하고, `numMinted`는 누적 총수입니다
- 쓰기 작업 후 상태를 확인하려면 `sendAndConfirm` 이후 `fetchCollection`을 호출하세요

## Quick Reference

| 항목 | 값 |
|------|-------|
| JS 함수 | `fetchCollection` |
| 필수 인수 | Collection 공개 키 |
| 반환값 | `Collection` 객체 |
| 소스 | [GitHub](https://github.com/metaplex-foundation/mpl-core) |
