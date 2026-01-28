---
title: 컬렉션 관리
metaTitle: Core Collections | Metaplex Core
description: Solana에서 Core Collections를 생성하고 관리하는 방법을 알아보세요. NFT Asset을 그룹화하고, 컬렉션 수준의 로열티를 설정하고, 컬렉션 메타데이터를 관리합니다.
---

이 가이드에서는 Metaplex Core SDK를 사용하여 Solana에서 **Core Collections를 생성하고 관리**하는 방법을 설명합니다. Collections는 관련 Asset을 공유 ID 아래에 그룹화하며, 컬렉션 수준의 메타데이터와 플러그인을 가집니다. {% .lead %}

{% callout title="학습 내용" %}

- 이름, URI, 선택적 플러그인을 가진 Collection 생성
- 생성 시 Asset을 Collections에 추가
- Collection 메타데이터 가져오기 및 업데이트
- 컬렉션 수준 플러그인 관리 (로열티 등)

{% /callout %}

## 요약

**Collection**은 관련 Asset을 그룹화하는 Core 계정입니다. 컬렉션 메타데이터(이름, 이미지, 설명)를 저장하고, 컬렉션의 모든 Asset에 적용되는 플러그인을 보유할 수 있습니다.

- Collections는 관련 Asset 그룹의 "표지" 역할을 합니다
- Asset은 `collection` 필드를 통해 Collection을 참조합니다
- Collection 플러그인(Royalties 등)은 모든 멤버 Asset에 적용될 수 있습니다
- Collection 생성 비용은 약 0.0015 SOL입니다

## 범위 외

Token Metadata Collections(mpl-token-metadata 사용), 압축 NFT 컬렉션(Bubblegum 사용), 기존 컬렉션의 Core 마이그레이션.

## 빠른 시작

**이동:** [Collection 생성](#간단한-컬렉션-생성) · [플러그인 포함](#플러그인과-함께-컬렉션-생성) · [가져오기](#컬렉션-가져오기) · [업데이트](#컬렉션-업데이트)

1. 설치: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. 컬렉션 메타데이터 JSON을 업로드하여 URI 획득
3. `createCollection(umi, { collection, name, uri })` 호출
4. Asset 생성 시 컬렉션 주소 전달

## 전제 조건

- **Umi** - signer와 RPC 연결이 구성됨
- **SOL** - 트랜잭션 수수료용 (컬렉션당 약 0.002 SOL)
- **메타데이터 JSON** - 컬렉션 이미지와 함께 Arweave/IPFS에 업로드됨

## 컬렉션이란?

Collections는 함께 속하는 Asset의 그룹으로, 같은 시리즈나 그룹의 일부입니다. Asset을 함께 그룹화하려면 먼저 컬렉션 이름과 컬렉션 이미지 같은 해당 컬렉션과 관련된 메타데이터를 저장하는 Collection Asset을 생성해야 합니다. Collection Asset은 컬렉션의 표지 역할을 하며 컬렉션 전체 플러그인도 저장할 수 있습니다.

Collection Asset에서 저장되고 액세스 가능한 데이터는 다음과 같습니다:

| 계정            | 설명                                              |
| --------------- | ------------------------------------------------- |
| key             | 계정 키 식별자                                    |
| updateAuthority | 새 Asset의 권한                                   |
| name            | 컬렉션 이름                                       |
| uri             | 컬렉션의 오프체인 메타데이터에 대한 URI           |
| num minted      | 컬렉션에서 민팅된 Asset 수                        |
| current size    | 현재 컬렉션에 있는 Asset 수                       |

## 컬렉션 생성

Core Collection을 생성하려면 다음과 같이 `CreateCollection` 명령어를 사용할 수 있습니다:

{% totem %}
{% totem-accordion title="기술적 명령어 세부사항 - CreateCollectionV1" %}

**명령어 계정 목록**

| 계정            | 설명                                              |
| --------------- | ------------------------------------------------- |
| collection      | Core Asset이 속한 Collection                      |
| updateAuthority | 새 Asset의 권한                                   |
| payer           | 저장 수수료를 지불하는 계정                       |
| systemProgram   | System Program 계정                               |

**명령어 인수**

| 인수    | 설명                                              |
| ------- | ------------------------------------------------- |
| name    | Core Asset이 속한 Collection                      |
| uri     | 새 Asset의 권한                                   |
| plugins | Collection이 가져야 할 플러그인                   |

일부 계정과 인수는 사용 편의성을 위해 SDK에서 추상화되거나 선택적일 수 있습니다.
온체인 명령어에 대한 자세한 내용은 [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L30)에서 확인할 수 있습니다.

{% /totem-accordion %}
{% /totem %}

### 간단한 컬렉션 생성

다음 스니펫은 플러그인이나 특별한 것 없이 간단한 Collection을 생성합니다.

{% code-tabs-imported from="core/create-collection" frameworks="umi" /%}

### 플러그인과 함께 컬렉션 생성

다음 스니펫은 [Royalties 플러그인](/ko/smart-contracts/core/plugins/royalties)이 연결된 Collection을 생성합니다. [여기](/ko/smart-contracts/core/plugins)에 설명된 대로 추가 플러그인을 연결할 수 있습니다.

{% dialect-switcher title="플러그인과 함께 MPL Core Collection 생성" %}
{% dialect title="JavaScript" id="js" %}

```ts
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
        {
          address: creator1,
          percentage: 20,
        },
        {
          address: creator2,
          percentage: 80,
        },
      ],
      ruleSet: ruleSet('None'), // 호환성 규칙 세트
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
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

## 컬렉션 가져오기

Collection을 가져오려면 다음 함수를 사용할 수 있습니다:

{% dialect-switcher title="Collection 가져오기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchCollectionV1 } from '@metaplex-foundation/mpl-core'
import { publicKey } from '@metaplex-foundation/umi'

const collectionId = publicKey('11111111111111111111111111111111')

const collection = await fetchCollection(umi, collectionId)

console.log(collection)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use std::str::FromStr;
use mpl_core::Collection;
use solana_client::nonblocking::rpc_client;
use solana_sdk::pubkey::Pubkey;

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

## 컬렉션 업데이트

Core Collection의 데이터를 업데이트하려면 `UpdateCollection` 명령어를 사용하세요. 예를 들어, 이 명령어를 사용하여 Collection의 이름을 변경할 수 있습니다.

{% totem %}
{% totem-accordion title="기술적 명령어 세부사항 - UpdateCollectionV1" %}

**명령어 계정 목록**

| 계정               | 설명                                              |
| ------------------ | ------------------------------------------------- |
| collection         | Core Asset이 속한 Collection                      |
| payer              | 저장 수수료를 지불하는 계정                       |
| authority          | 새 Asset의 권한                                   |
| newUpdateAuthority | Collection의 새 업데이트 권한                     |
| systemProgram      | System Program 계정                               |
| logWrapper         | SPL Noop Program                                  |

**명령어 인수**

| 인수 | 설명                          |
| ---- | ----------------------------- |
| name | MPL Core Asset의 이름         |
| uri  | 오프체인 JSON 메타데이터 URI  |

일부 계정과 인수는 사용 편의성을 위해 SDK에서 추상화되거나 선택적일 수 있습니다.
온체인 명령어에 대한 자세한 내용은 [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L167C4-L167C23)에서 확인할 수 있습니다.

{% /totem-accordion %}
{% /totem %}

{% seperator h="6" /%}

{% dialect-switcher title="Collection 업데이트" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updateCollection } from '@metaplex-foundation/mpl-core'

const collectionAddress = publicKey('1111111111111111111111111111111')

await updateCollection(umi, {
  collection: collectionAddress,
  name: 'my-nft',
  uri: 'https://exmaple.com/new-uri',
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use std::str::FromStr;

use mpl_core::instructions::UpdateCollectionV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};

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

## 컬렉션 플러그인 업데이트

Core Collection에 연결된 플러그인의 동작을 변경하려면 `updateCollectionPlugin` 명령어를 사용할 수 있습니다.

{% totem %}
{% totem-accordion title="기술적 명령어 세부사항 - UpdateCollectionPluginV1" %}

**명령어 계정 목록**

| 계정          | 설명                                              |
| ------------- | ------------------------------------------------- |
| collection    | Core Asset이 속한 Collection                      |
| payer         | 저장 수수료를 지불하는 계정                       |
| authority     | 새 Asset의 권한                                   |
| systemProgram | System Program 계정                               |
| logWrapper    | SPL Noop Program                                  |

**명령어 인수**

| 인수   | 설명                        |
| ------ | --------------------------- |
| plugin | 업데이트하려는 플러그인     |

일부 계정은 사용 편의성을 위해 SDK에서 추상화되거나 선택적일 수 있습니다.
온체인 명령어에 대한 자세한 내용은 [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L81)에서 확인할 수 있습니다.

{% /totem-accordion %}
{% /totem %}

{% seperator h="6" /%}

{% dialect-switcher title="Collection 플러그인 업데이트" %}
{% dialect title="JavaScript" id="js" %}

```ts
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

```rust
use std::str::FromStr;
use mpl_core::{
    instructions::UpdateCollectionPluginV1Builder,
    types::{Creator, Plugin, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};

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

### `Collection account already exists`

Collection 키페어가 이미 사용되었습니다. 새 signer를 생성하세요:

```ts
const collectionSigner = generateSigner(umi) // 고유해야 함
```

### `Authority mismatch`

Collection의 업데이트 권한이 없습니다. Collection의 `updateAuthority` 필드가 signer와 일치하는지 확인하세요.

### `Insufficient funds`

지불 지갑에 약 0.002 SOL이 필요합니다. 다음으로 충전하세요:

```bash
solana airdrop 1 <WALLET_ADDRESS> --url devnet
```

## 참고 사항

- 생성 시 `collection` 매개변수는 **새 키페어**여야 합니다
- Collection 플러그인은 Asset 레벨에서 재정의되지 않는 한 Asset에 상속됩니다
- 생성 후 Collection 상태를 확인하려면 `fetchCollection`을 사용하세요
- `numMinted` 카운터는 생성된 총 Asset 수를 추적합니다 (현재 크기가 아님)

## 빠른 참조

### Program ID

| 네트워크 | 주소 |
|---------|---------|
| Mainnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
| Devnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |

### 최소 코드

```ts {% title="minimal-collection.ts" %}
import { generateSigner } from '@metaplex-foundation/umi'
import { createCollection } from '@metaplex-foundation/mpl-core'

const collection = generateSigner(umi)
await createCollection(umi, { collection, name: 'My Collection', uri: 'https://...' }).sendAndConfirm(umi)
```

### 비용 내역

| 항목 | 비용 |
|------|------|
| Collection 계정 렌트 | 약 0.0015 SOL |
| 트랜잭션 수수료 | 약 0.000005 SOL |
| **총계** | **약 0.002 SOL** |

## FAQ

### Collection과 Asset의 차이점은 무엇인가요?

Collection은 Asset을 그룹화하는 컨테이너입니다. 자체 메타데이터(이름, 이미지)를 가지지만 Asset처럼 소유하거나 전송할 수 없습니다. Asset은 사용자가 소유하는 실제 NFT입니다.

### 기존 Asset을 Collection에 추가할 수 있나요?

예, `newCollection` 매개변수와 함께 `update` 명령어를 사용하세요. Asset의 업데이트 권한에는 대상 Collection에 추가할 권한이 있어야 합니다.

### NFT에 Collection이 필요한가요?

아니요. Asset은 Collection 없이 독립적으로 존재할 수 있습니다. 하지만 Collections는 컬렉션 수준의 로열티, 더 쉬운 검색 가능성, 배치 작업을 가능하게 합니다.

### Collection에서 Asset을 제거할 수 있나요?

예, `update` 명령어를 사용하여 Asset의 Collection을 변경하세요. Asset과 Collection 모두에 적절한 권한이 필요합니다.

### Collection을 삭제하면 어떻게 되나요?

Collections는 Asset을 포함하는 동안 삭제할 수 없습니다. 먼저 모든 Asset을 제거한 다음 Collection 계정을 닫을 수 있습니다.

## 용어집

| 용어 | 정의 |
|------|------------|
| **Collection** | 공유 메타데이터 아래에 관련 Asset을 그룹화하는 Core 계정 |
| **Update Authority** | Collection 메타데이터와 플러그인을 수정할 수 있는 계정 |
| **numMinted** | Collection에서 생성된 총 Asset 수를 추적하는 카운터 |
| **currentSize** | 현재 Collection에 있는 Asset 수 |
| **Collection Plugin** | Collection에 연결된 플러그인 (예: Royalties) |
| **URI** | Collection의 오프체인 메타데이터를 가리키는 URL |

---

*Metaplex Foundation에서 관리 · 마지막 확인 2026년 1월 · @metaplex-foundation/mpl-core에 적용*
