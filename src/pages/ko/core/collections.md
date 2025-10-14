---
title: 컬렉션 관리
metaTitle: 검증된 컬렉션 | Core
description: Metaplex Core 패키지를 사용하여 자산을 컬렉션에 추가하고 제거하는 등 Core 컬렉션을 관리하는 방법을 알아보세요.
---

## 컬렉션이란 무엇인가요?

컬렉션은 함께 속하는 자산들의 그룹으로, 같은 시리즈나 그룹의 일부입니다. 자산을 함께 그룹화하기 위해서는 먼저 컬렉션 이름과 컬렉션 이미지와 같은 컬렉션과 관련된 메타데이터를 저장하는 목적을 가진 컬렉션 자산을 생성해야 합니다. 컬렉션 자산은 컬렉션의 표지 역할을 하며 컬렉션 전체 플러그인을 저장할 수도 있습니다.

컬렉션 자산에서 저장되고 액세스할 수 있는 데이터는 다음과 같습니다:

| 계정            | 설명                                              |
| --------------- | ------------------------------------------------- |
| key             | 계정 키 구분자                                    |
| updateAuthority | 새 자산의 권한                                    |
| name            | 컬렉션 이름                                       |
| uri             | 컬렉션의 오프체인 메타데이터에 대한 URI           |
| num minted      | 컬렉션에서 민팅된 자산 수                         |
| current size    | 현재 컬렉션에 있는 자산 수                        |

## 컬렉션 생성

Core 컬렉션을 생성하려면 다음과 같이 `CreateCollection` 명령어를 사용할 수 있습니다:

{% totem %}
{% totem-accordion title="기술적 명령어 세부사항 - CreateCollectionV1" %}

**명령어 계정 목록**

| 계정            | 설명                                              |
| --------------- | ------------------------------------------------- |
| collection      | Core 자산이 속한 컬렉션                           |
| updateAuthority | 새 자산의 권한                                    |
| payer           | 저장 수수료를 지불하는 계정                       |
| systemProgram   | 시스템 프로그램 계정                              |

**명령어 인수**

| 인수    | 설명                                              |
| ------- | ------------------------------------------------- |
| name    | Core 자산이 속한 컬렉션                           |
| uri     | 새 자산의 권한                                    |
| plugins | 컬렉션이 가져야 할 플러그인                       |

일부 계정과 인수는 사용 편의성을 위해 SDK에서 추상화되거나 선택적일 수 있습니다.
온체인 명령어에 대한 자세한 내용은 [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L30)에서 확인할 수 있습니다.

{% /totem-accordion %}
{% /totem %}

### 간단한 컬렉션 생성

다음 코드는 플러그인이나 특별한 것 없이 간단한 컬렉션을 생성합니다.

{% dialect-switcher title="MPL Core 컬렉션 생성" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createCollection } from '@metaplex-foundation/mpl-core'

const collectionSigner = generateSigner(umi)

await createCollection(umi, {
  collection: collectionSigner,
  name: 'My Collection',
  uri: 'https://example.com/my-collection.json',
})
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::instructions::CreateCollectionV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn create_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let collection = Keypair::new();

    let create_collection_ix = CreateCollectionV1Builder::new()
        .collection(collection.pubkey())
        .payer(payer.pubkey())
        .name("My Collection".into())
        .uri("https://example.com/my-collection.json".into())
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

### 플러그인과 함께 컬렉션 생성

다음 코드는 [로열티 플러그인](/kr/core/plugins/royalties)이 연결된 컬렉션을 생성합니다. [여기](/kr/core/plugins)에 설명된 대로 추가 플러그인을 연결할 수 있습니다.

{% dialect-switcher title="플러그인과 함께 MPL Core 컬렉션 생성" %}
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

컬렉션을 가져오려면 다음 함수를 사용할 수 있습니다:

{% dialect-switcher title="컬렉션 가져오기" %}
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

Core 컬렉션의 데이터를 업데이트하려면 `UpdateCollection` 명령어를 사용하세요. 예를 들어, 이 명령어를 사용하여 컬렉션의 이름을 변경할 수 있습니다.

{% totem %}
{% totem-accordion title="기술적 명령어 세부사항 - UpdateCollectionV1" %}

**명령어 계정 목록**

| 계정               | 설명                                              |
| ------------------ | ------------------------------------------------- |
| collection         | Core 자산이 속한 컬렉션                           |
| payer              | 저장 수수료를 지불하는 계정                       |
| authority          | 새 자산의 권한                                    |
| newUpdateAuthority | 컬렉션의 새 업데이트 권한                         |
| systemProgram      | 시스템 프로그램 계정                              |
| logWrapper         | SPL Noop 프로그램                                 |

**명령어 인수**

| 인수 | 설명                          |
| ---- | ----------------------------- |
| name | MPL Core 자산의 이름          |
| uri  | 오프체인 JSON 메타데이터 URI  |

일부 계정과 인수는 사용 편의성을 위해 SDK에서 추상화되거나 선택적일 수 있습니다.
온체인 명령어에 대한 자세한 내용은 [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L167C4-L167C23)에서 확인할 수 있습니다.

{% /totem-accordion %}
{% /totem %}

{% seperator h="6" /%}

{% dialect-switcher title="컬렉션 업데이트" %}
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

Core 컬렉션에 연결된 플러그인의 동작을 변경하려면 `updateCollectionPlugin` 명령어를 사용할 수 있습니다.

{% totem %}
{% totem-accordion title="기술적 명령어 세부사항 - UpdateCollectionPluginV1" %}

**명령어 계정 목록**

| 계정          | 설명                                              |
| ------------- | ------------------------------------------------- |
| collection    | Core 자산이 속한 컬렉션                           |
| payer         | 저장 수수료를 지불하는 계정                       |
| authority     | 새 자산의 권한                                    |
| systemProgram | 시스템 프로그램 계정                              |
| logWrapper    | SPL Noop 프로그램                                 |

**명령어 인수**

| 인수   | 설명                        |
| ------ | --------------------------- |
| plugin | 업데이트하려는 플러그인     |

일부 계정은 사용 편의성을 위해 SDK에서 추상화되거나 선택적일 수 있습니다.
온체인 명령어에 대한 자세한 내용은 [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L81)에서 확인할 수 있습니다.

{% /totem-accordion %}
{% /totem %}

{% seperator h="6" /%}

{% dialect-switcher title="컬렉션 플러그인 업데이트" %}
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
        Some(&payer.pubkey()),
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