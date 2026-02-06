---
title: Master Edition 플러그인
metaTitle: Master Edition 플러그인 | Metaplex Core
description: Master Edition 플러그인으로 Collection 아래에 에디션 Asset을 그룹화합니다. 프린트 및 한정판을 위한 최대 공급량과 에디션 메타데이터를 저장합니다.
updated: '01-31-2026'
keywords:
  - master edition
  - max supply
  - print series
  - edition collection
about:
  - Master editions
  - Supply management
  - Edition grouping
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Master Edition이 최대 공급량을 강제하나요?
    a: 아니요. maxSupply는 정보 제공 목적으로만 사용됩니다. 민팅 중 공급 제한을 실제로 강제하려면 적절한 가드가 있는 Candy Machine을 사용하세요.
  - q: Master Edition name/uri와 Collection name/uri의 차이점은 무엇인가요?
    a: Master Edition name/uri는 기본 Collection과 다른 에디션별 메타데이터를 제공할 수 있습니다. 예를 들어, Collection은 "Abstract Art Series"일 수 있고 Master Edition 이름은 "Limited Print Run 2024"일 수 있습니다.
  - q: 오픈 에디션(무제한 공급)을 만들 수 있나요?
    a: 네. maxSupply를 null로 설정하거나 완전히 생략하세요. 이는 정의된 제한이 없는 오픈 에디션을 나타냅니다.
  - q: Master Edition과 Edition 플러그인이 둘 다 필요한가요?
    a: 적절한 프린트 추적을 위해서는 네. Master Edition은 Collection에, Edition은 각 Asset에 추가합니다. 함께 작동합니다.
  - q: 기존 Collection에 Master Edition을 추가할 수 있나요?
    a: 네, Asset의 Edition 플러그인과 달리 Master Edition은 addCollectionPlugin을 사용하여 기존 Collection에 추가할 수 있습니다.
---
**Master Edition 플러그인**은 번호가 매겨진 에디션 Asset을 Collection 아래에 그룹화합니다. 최대 공급량, 에디션 이름 및 URI를 저장하여 "100부 한정"과 같은 프린트 시리즈를 만듭니다. {% .lead %}
{% callout title="학습 내용" %}

- Collection에 Master Edition 추가
- 최대 공급량 및 메타데이터 구성
- Edition Asset을 함께 그룹화
- 프린트 워크플로우 이해
{% /callout %}

## 요약

**Master Edition** 플러그인은 [Edition](/smart-contracts/core/plugins/edition) Asset을 함께 그룹화하는 Collection용 권한 관리 플러그인입니다. 최대 공급량과 선택적 에디션별 메타데이터를 저장합니다.

- 권한 관리 (업데이트 권한이 제어)
- Collection에서만 작동 (Asset에서는 작동하지 않음)
- 값은 정보 제공용이며 강제되지 않음
- 자동 에디션 생성을 위해 Candy Machine과 함께 사용

## 범위 외

공급 강제 (Candy Machine 가드 사용), 개별 에디션 번호 (Asset에 Edition 플러그인 사용), 자동 민팅은 범위 외입니다.

## 빠른 시작

**바로가기:** [Collection 생성](#master-edition-플러그인으로-collection-생성) · [플러그인 업데이트](#master-edition-플러그인-업데이트)

1. Master Edition 플러그인과 최대 공급량으로 Collection 생성
2. Edition 플러그인으로 Asset 민팅 (번호 1, 2, 3...)
3. 필요에 따라 최대 공급량 또는 메타데이터 업데이트
{% callout type="note" title="권장 사용법" %}
다음을 권장합니다:

- Master Edition 플러그인을 사용하여 에디션 그룹화
- 자동 번호 매기기를 위해 Edition Guard가 있는 Candy Machine 사용
{% /callout %}

## 호환성

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ❌  |
| MPL Core Collection | ✅  |

## 인수

| 인수      | 값                   | 용도                                                                           |
| --------- | -------------------- | ------------------------------------------------------------------------------- |
| maxSupply | Option<number> (u32) | 최대 프린트 수량을 표시. 오픈 에디션을 허용하려면 선택 사항 |
| name      | Option<String>       | 에디션의 이름 (Collection 이름과 다른 경우)                     |
| uri       | Option<String>       | 에디션의 URI (Collection URI와 다른 경우)                      |
이 값들은 권한에 의해 언제든지 변경될 수 있습니다. 순수하게 정보 제공용이며 강제되지 않습니다.

## Master Edition 플러그인으로 Collection 생성

{% dialect-switcher title="Master Edition 플러그인으로 MPL Core Collection 생성" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import { createCollection } from '@metaplex-foundation/core'
const collectionSigner = generateSigner(umi)
await createCollection(umi, {
  collection: collectionSigner,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  plugins: [
    {
      type: 'MasterEdition',
      maxSupply: 100,
      name: 'My Master Edition',
      uri: 'https://example.com/my-master-edition.json',
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::CreateCollectionV1Builder,
    types::{Creator, Plugin, PluginAuthority, PluginAuthorityPair},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn create_collection_with_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let payer = Keypair::new();
    let collection = Keypair::new();
    let create_collection_ix = CreateCollectionV1Builder::new()
        .collection(collection.pubkey())
        .payer(payer.pubkey())
        .name("My Collection".into())
        .uri("https://example.com/my-collection.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::MasterEdition(MasterEdition {
                max_supply: 100,
                name: "My Master Edition"
                uri: "https://example.com/my-master-edition.json",
            }),
            authority: Some(PluginAuthority::UpdateAuthority),
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

## Master Edition 플러그인 업데이트

Master Edition 플러그인이 변경 가능한 경우 다른 Collection 플러그인과 유사하게 업데이트할 수 있습니다:
{% dialect-switcher title="Master Edition 플러그인 업데이트" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePluginV1, createPlugin } from '@metaplex-foundation/mpl-core'
const asset = publicKey('11111111111111111111111111111111')
await updatePlugin(umi, {
  asset: asset,
  plugin: {
    type: 'MasterEdition',
    maxSupply: 110,
    name: 'My Master Edition',
    uri: 'https://example.com/my-master-edition',
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}
_곧 제공 예정_
{% /dialect %}
{% /dialect-switcher %}

## 일반적인 오류

### `Cannot add to Asset`

Master Edition은 개별 Asset이 아닌 Collection에서만 작동합니다. Asset에는 Edition 플러그인을 사용하세요.

### `Authority mismatch`

업데이트 권한만 Master Edition 플러그인을 추가하거나 업데이트할 수 있습니다.

## 참고 사항

- 모든 값(maxSupply, name, uri)은 정보 제공용으로만 사용되며 강제되지 않습니다
- 실제 공급 제한을 강제하려면 Candy Machine 가드를 사용하세요
- name/uri는 에디션별 브랜딩을 위해 Collection 메타데이터를 재정의합니다
- 권한에 의해 언제든지 업데이트할 수 있습니다

## 빠른 참조

### 인수

| 인수 | 타입 | 필수 | 설명 |
|----------|------|----------|-------------|
| `maxSupply` | `Option<u32>` | 아니요 | 최대 에디션 수 (오픈 에디션의 경우 null) |
| `name` | `Option<String>` | 아니요 | 에디션별 이름 |
| `uri` | `Option<String>` | 아니요 | 에디션별 메타데이터 URI |

### 에디션 설정 패턴

| 단계 | 작업 | 플러그인 |
|------|--------|--------|
| 1 | Collection 생성 | Master Edition (최대 공급량) |
| 2 | Asset 민팅 | Edition (번호 1, 2, 3...) |
| 3 | 검증 | 에디션 번호와 공급량 확인 |

## FAQ

### Master Edition이 최대 공급량을 강제하나요?

아니요. `maxSupply`는 정보 제공 목적으로만 사용됩니다. 민팅 중 공급 제한을 실제로 강제하려면 적절한 가드가 있는 Candy Machine을 사용하세요.

### Master Edition name/uri와 Collection name/uri의 차이점은 무엇인가요?

Master Edition name/uri는 기본 Collection과 다른 에디션별 메타데이터를 제공할 수 있습니다. 예를 들어, Collection은 "Abstract Art Series"일 수 있고 Master Edition 이름은 "Limited Print Run 2024"일 수 있습니다.

### 오픈 에디션(무제한 공급)을 만들 수 있나요?

네. `maxSupply`를 `null`로 설정하거나 완전히 생략하세요. 이는 정의된 제한이 없는 오픈 에디션을 나타냅니다.

### Master Edition과 Edition 플러그인이 둘 다 필요한가요?

적절한 프린트 추적을 위해서는 네. Master Edition은 Collection에 (그룹화 및 공급 정보), Edition은 각 Asset에 (개별 번호) 추가합니다. 함께 작동합니다.

### 기존 Collection에 Master Edition을 추가할 수 있나요?

네, Asset의 Edition 플러그인과 달리 Master Edition은 `addCollectionPlugin`을 사용하여 기존 Collection에 추가할 수 있습니다.

## 용어집

| 용어 | 정의 |
|------|------------|
| **Master Edition** | 에디션을 그룹화하고 공급량을 저장하는 Collection 플러그인 |
| **Edition** | 개별 에디션 번호를 저장하는 Asset 플러그인 |
| **오픈 에디션** | 최대 공급 제한이 없는 에디션 시리즈 |
| **출처** | 원산지 및 소유권 이력의 기록 |
| **maxSupply** | 최대 에디션 수 (정보 제공용) |
