---
title: Master Edition 플러그인
metaTitle: Master Edition 플러그인 | Metaplex Core
description: Master Edition 플러그인으로 에디션 자산을 컬렉션에 그룹화합니다. 프린트 시리즈 및 한정판을 위한 최대 공급량과 에디션 메타데이터를 저장합니다.
---

**Master Edition 플러그인**은 번호가 매겨진 에디션 자산을 컬렉션에 그룹화합니다. 최대 공급량, 에디션 이름 및 URI를 저장하여 "100부 한정"과 같은 프린트 시리즈를 생성합니다. {% .lead %}

{% callout title="학습 내용" %}

- 컬렉션에 Master Edition 추가
- 최대 공급량 및 메타데이터 구성
- Edition 자산 함께 그룹화
- 프린트 워크플로우 이해

{% /callout %}

## 요약

**Master Edition** 플러그인은 [Edition](/ko/smart-contracts/core/plugins/edition) 자산을 함께 그룹화하는 컬렉션용 권한 관리 플러그인입니다. 최대 공급량과 선택적 에디션별 메타데이터를 저장합니다.

- 권한 관리(업데이트 권한이 제어)
- 컬렉션에만 작동(자산에는 불가)
- 값은 정보 제공용이며 강제되지 않음
- 자동 에디션 생성을 위해 Candy Machine과 함께 사용

## 범위 외

공급량 강제(Candy Machine 가드 사용), 개별 에디션 번호(자산의 Edition 플러그인 사용), 자동 민팅.

## 빠른 시작

**바로가기:** [컬렉션 생성](#creating-a-collection-with-the-master-edition-plugin) · [플러그인 업데이트](#update-the-master-edition-plugin)

1. Master Edition 플러그인과 최대 공급량으로 컬렉션 생성
2. Edition 플러그인으로 자산 민트(번호 1, 2, 3...)
3. 필요에 따라 최대 공급량 또는 메타데이터 업데이트

{% callout type="note" title="권장 사용법" %}

권장 사항:

- Master Edition 플러그인을 사용하여 에디션 그룹화
- Candy Machine과 Edition Guard를 사용하여 번호 매기기 자동 처리

{% /callout %}

## 지원 대상

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ❌  |
| MPL Core Collection | ✅  |

## 인수

| 인수      | 값                   | 용도                                                                     |
| --------- | -------------------- | ----------------------------------------------------------------------- |
| maxSupply | Option<number> (u32) | 최대 프린트 수를 나타냅니다. 오픈 에디션을 허용하기 위해 선택적 |
| name      | Option<String>       | 에디션 이름(컬렉션 이름과 다른 경우)                             |
| uri       | Option<String>       | 에디션 URI(컬렉션 URI와 다른 경우)                               |

이러한 값은 권한자에 의해 언제든지 변경할 수 있습니다. 순수하게 정보 제공용이며 강제되지 않습니다.

## Master Edition 플러그인으로 컬렉션 생성

{% dialect-switcher title="Master Edition 플러그인으로 MPL Core 컬렉션 생성" %}
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

Master Edition 플러그인이 변경 가능한 경우 다른 컬렉션 플러그인과 유사하게 업데이트할 수 있습니다:

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

Master Edition은 컬렉션에만 작동하며 개별 자산에는 작동하지 않습니다. 자산에는 Edition 플러그인을 사용하세요.

### `Authority mismatch`

업데이트 권한만 Master Edition 플러그인을 추가하거나 업데이트할 수 있습니다.

## 참고 사항

- 모든 값(maxSupply, name, uri)은 정보 제공용이며 강제되지 않음
- 실제 공급량 제한을 강제하려면 Candy Machine 가드 사용
- name/uri는 에디션별 브랜딩을 위해 컬렉션 메타데이터를 재정의
- 권한자에 의해 언제든지 업데이트 가능

## 빠른 참조

### 인수

| 인수 | 타입 | 필수 | 설명 |
|----------|------|----------|-------------|
| `maxSupply` | `Option<u32>` | 아니오 | 최대 에디션 수(오픈 에디션의 경우 null) |
| `name` | `Option<String>` | 아니오 | 에디션별 이름 |
| `uri` | `Option<String>` | 아니오 | 에디션별 메타데이터 URI |

### 에디션 설정 패턴

| 단계 | 액션 | 플러그인 |
|------|--------|--------|
| 1 | 컬렉션 생성 | Master Edition(최대 공급량) |
| 2 | 자산 민트 | Edition(번호 1, 2, 3...) |
| 3 | 검증 | 에디션 번호와 공급량 확인 |

## FAQ

### Master Edition이 최대 공급량을 강제하나요?

아니요. `maxSupply`는 정보 제공용입니다. 실제로 민팅 시 공급량 제한을 강제하려면 적절한 가드가 있는 Candy Machine을 사용하세요.

### Master Edition의 name/uri와 컬렉션의 name/uri의 차이점은 무엇인가요?

Master Edition의 name/uri는 기본 컬렉션과 다른 에디션별 메타데이터를 제공할 수 있습니다. 예를 들어, 컬렉션은 "추상 아트 시리즈"이고 Master Edition 이름은 "2024년 한정 프린트 런"일 수 있습니다.

### 오픈 에디션(무제한 공급)을 만들 수 있나요?

예. `maxSupply`를 `null`로 설정하거나 완전히 생략하세요. 이는 정의된 제한이 없는 오픈 에디션을 나타냅니다.

### Master Edition과 Edition 플러그인 둘 다 필요한가요?

적절한 프린트 추적을 위해서는 예. Master Edition은 컬렉션에 적용(그룹화 및 공급 정보), Edition은 각 자산에 적용(개별 번호). 함께 작동합니다.

### 기존 컬렉션에 Master Edition을 추가할 수 있나요?

예, 자산의 Edition 플러그인과 달리 Master Edition은 `addCollectionPlugin`을 사용하여 기존 컬렉션에 추가할 수 있습니다.

## 용어집

| 용어 | 정의 |
|------|------------|
| **Master Edition** | 에디션을 그룹화하고 공급량을 저장하는 컬렉션 플러그인 |
| **Edition** | 개별 에디션 번호를 저장하는 자산 플러그인 |
| **Open Edition** | 최대 공급량 제한이 없는 에디션 시리즈 |
| **Provenance** | 출처 및 소유권 기록 |
| **maxSupply** | 최대 에디션 수(정보 제공용) |

---

*Metaplex Foundation 관리 · 2026년 1월 최종 확인 · @metaplex-foundation/mpl-core 적용*
