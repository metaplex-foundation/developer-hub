---
title: Core Collection 생성
metaTitle: Core Collection 생성 | Metaplex Core
description: mpl-core SDK와 Umi를 사용하여 Solana에서 Core Collection을 생성하는 방법 — 플러그인 유무에 관계없이.
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
howToSteps:
  - npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi 로 mpl-core SDK 설치
  - URI를 얻기 위해 컬렉션 메타데이터 JSON 업로드
  - createCollection(umi, { collection, name, uri }) 호출
  - Asset 생성 시 collection 주소 전달
howToTools:
  - Node.js
  - Umi framework
  - mpl-core SDK
---

`createCollection` 명령어는 이름, 메타데이터 URI, 선택적 플러그인을 가진 새로운 [Core Collection](/smart-contracts/core/collections) 계정을 Solana에 생성합니다. {% .lead %}

{% callout title="학습 내용" %}
- 이름과 URI로 간단한 Collection 생성
- Royalties 플러그인이 부착된 Collection 생성
- 일반적인 생성 오류 처리
{% /callout %}

## Summary

`createCollection`은 [Core Asset](/smart-contracts/core/what-is-an-asset)을 공유 메타데이터와 플러그인 아래에 그룹화하는 새로운 Collection 계정을 배포합니다.

- collection 주소로 새로운 키페어가 필요합니다 — 기존 주소를 재사용하면 실패합니다
- 생성 시 선택적 [플러그인](/smart-contracts/core/plugins)을 지정할 수 있습니다
- 렌트로 약 0.0015 SOL이 필요합니다
- 기본적으로 페이어가 `updateAuthority`가 됩니다

## Quick Start

1. 설치: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. 컬렉션 메타데이터 JSON을 업로드하여 URI 획득
3. `createCollection(umi, { collection, name, uri })` 호출
4. Asset 생성 시 collection 주소 전달

**이동:** [간단한 Collection](#간단한-collection-생성) · [플러그인 포함](#플러그인이-포함된-collection-생성) · [오류 처리](#일반적인-오류)

## 전제 조건

- 서명자와 RPC 연결이 설정된 **Umi** — [JavaScript SDK](/smart-contracts/core/sdk/javascript) 참조
- 트랜잭션 수수료용 **SOL** (Collection 당 약 0.002 SOL)
- Arweave 또는 IPFS에 업로드된 컬렉션 이미지와 이름이 포함된 **메타데이터 JSON**

## 간단한 Collection 생성

`createCollection`에는 `name`, 메타데이터 `uri`, 그리고 collection 서명자로 새로운 키페어가 필요합니다.

{% code-tabs-imported from="core/create-collection" frameworks="umi" /%}

{% callout type="note" %}
`collection` 파라미터는 매번 새로운 키페어여야 합니다. 기존 계정 주소를 재사용하면 `Collection account already exists` 오류가 발생합니다.
{% /callout %}

## 플러그인이 포함된 Collection 생성

`createCollection`에 `plugins` 배열을 전달하여 생성 시 플러그인을 부착할 수 있습니다. 아래 예시는 [Royalties 플러그인](/smart-contracts/core/plugins/royalties)을 부착합니다.

{% dialect-switcher title="Royalties 플러그인이 포함된 Core Collection 생성" %}
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

## 일반적인 오류

### `Collection account already exists`
이 네트워크에서 collection 키페어가 이미 사용되었습니다. 매번 새로운 서명자를 생성하세요:
```ts
const collectionSigner = generateSigner(umi) // 고유한 키페어여야 함
```

### `Insufficient funds`
페이어 지갑에 약 0.002 SOL이 필요합니다. 데브넷에서 충전하는 방법:
```bash
solana airdrop 1 <WALLET_ADDRESS> --url devnet
```

## Notes

- 생성 시 추가한 플러그인은 나중에 `updateCollectionPlugin`으로 업데이트할 수 있습니다 — [Collection 업데이트](/smart-contracts/core/collections/update) 참조
- `updateAuthority`는 기본적으로 페이어가 됩니다 — 다른 계정으로 설정하려면 명시적으로 `updateAuthority`를 전달하세요
- Asset에 사용 가능한 모든 플러그인은 Collection에도 적용할 수 있습니다 — [플러그인 개요](/smart-contracts/core/plugins) 참조

## Quick Reference

| 항목 | 값 |
|------|-------|
| Instruction | `CreateCollectionV1` |
| JS 함수 | `createCollection` |
| 필수 계정 | `collection` (새 키페어), `payer` |
| 선택 계정 | `updateAuthority`, `systemProgram` |
| 필수 인수 | `name`, `uri` |
| 선택 인수 | `plugins` |
| 렌트 비용 | 약 0.0015 SOL |
| 소스 | [GitHub](https://github.com/metaplex-foundation/mpl-core/blob/main/programs/mpl-core/src/instruction.rs#L30) |
