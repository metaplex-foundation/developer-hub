---
title: Core Collection 업데이트
metaTitle: Core Collection 업데이트 | Metaplex Core
description: mpl-core SDK의 updateCollection과 updateCollectionPlugin 명령어를 사용하여 Solana에서 Core Collection 메타데이터와 플러그인을 업데이트하는 방법.
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
howToSteps:
  - Collection의 updateAuthority를 서명자로 설정하여 Umi 구성
  - updateCollection에 collection 주소와 새 이름 또는 URI를 전달하여 호출
  - updateCollectionPlugin을 호출하여 collection의 플러그인 동작 변경
howToTools:
  - Node.js
  - Umi framework
  - mpl-core SDK
---

`updateCollection`과 `updateCollectionPlugin`은 기존 [Core Collection](/smart-contracts/core/collections)의 메타데이터와 플러그인 구성을 수정합니다. {% .lead %}

{% callout title="학습 내용" %}
- Collection의 이름 또는 URI 업데이트
- Collection에 부착된 플러그인 업데이트
{% /callout %}

## Summary

Core Collection의 생성 후 업데이트를 위한 두 가지 명령어가 있습니다.

- `updateCollection` — 컬렉션의 `name` 또는 `uri` 변경
- `updateCollectionPlugin` — 컬렉션의 기존 플러그인 구성 수정
- 두 명령어 모두 `updateAuthority`의 서명이 필요합니다
- 컬렉션 레벨 플러그인의 변경사항은 이를 상속하는 멤버 Asset에 전파됩니다

**이동:** [메타데이터 업데이트](#collection-메타데이터-업데이트) · [플러그인 업데이트](#collection-플러그인-업데이트) · [오류 처리](#일반적인-오류)

## 전제 조건

- Collection의 `updateAuthority`를 서명자로 설정한 **Umi** — 이 값을 확인하려면 [Collection 조회](/smart-contracts/core/collections/fetch) 참조
- 업데이트할 collection 주소

## Collection 메타데이터 업데이트

`updateCollection`은 기존 Collection의 `name` 및/또는 `uri`를 변경합니다. 변경하려는 필드만 전달하세요.

{% dialect-switcher title="Core Collection 업데이트" %}
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

## Collection 플러그인 업데이트

`updateCollectionPlugin`은 Collection에 이미 부착된 플러그인의 구성을 변경합니다. 아래 예시는 [Royalties 플러그인](/smart-contracts/core/plugins/royalties)의 베이시스 포인트와 크리에이터 배분을 업데이트합니다.

{% dialect-switcher title="Core Collection 플러그인 업데이트" %}
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

## 일반적인 오류

### `Authority mismatch`
컬렉션의 `updateAuthority`로 서명하고 있지 않습니다. 컬렉션을 조회하여 확인하세요:
```ts
const collection = await fetchCollection(umi, collectionAddress)
console.log(collection.updateAuthority) // umi.identity와 일치해야 함
```

## Notes

- 컬렉션에 아직 존재하지 않는 플러그인을 추가하려면 `updateCollectionPlugin` 대신 `addCollectionPlugin`을 사용하세요
- 컬렉션 레벨 플러그인을 업데이트하면 이를 상속하는 모든 Asset에 영향을 미칩니다 — 동일한 타입의 자체 플러그인을 가진 Asset은 영향을 받지 않습니다
- `updateCollection`의 `newUpdateAuthority` 파라미터로 `updateAuthority`를 새 계정으로 이전할 수 있습니다

## Quick Reference

| Instruction | JS 함수 | 사용 시점 |
|-------------|-------------|-------------|
| `UpdateCollectionV1` | `updateCollection` | `name` 또는 `uri` 변경 |
| `UpdateCollectionPluginV1` | `updateCollectionPlugin` | 기존 플러그인 구성 수정 |

| 계정 | 필수 | 설명 |
|---------|----------|-------------|
| `collection` | Yes | 업데이트할 Collection |
| `authority` | Yes | `updateAuthority`여야 함 |
| `payer` | Yes | 트랜잭션 수수료 지불 |
| `newUpdateAuthority` | No | 새 계정으로 Update Authority 이전 |

| 소스 | 링크 |
|--------|------|
| UpdateCollectionV1 | [GitHub](https://github.com/metaplex-foundation/mpl-core/blob/main/programs/mpl-core/src/instruction.rs#L167) |
| UpdateCollectionPluginV1 | [GitHub](https://github.com/metaplex-foundation/mpl-core/blob/main/programs/mpl-core/src/instruction.rs#L81) |
