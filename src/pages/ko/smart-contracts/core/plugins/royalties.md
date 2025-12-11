---
title: Royalties Plugin
metaTitle: 로열티 시행 | Core
description: Royalties 플러그인을 통해 마켓플레이스에서 2차 판매에 대한 로열티 비율을 설정할 수 있습니다. 이제 Royalty 플러그인을 Core Collection에 적용하여 컬렉션 전체에 설정할 수 있습니다.
---

Royalties Plugin은 Asset의 권한이 Royalties Plugin 데이터를 설정하고 변경할 수 있는 `Authority Managed` 플러그인입니다.

이 플러그인은 `MPL Core Asset`과 `MPL Core Collection` 모두에서 사용할 수 있습니다.

MPL Core Asset과 MPL Core Collection 모두에 할당된 경우 MPL Core Asset Royalties Plugin이 MPL Core Collection Plugin보다 우선합니다.

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## Arguments

Royalties Plugin에는 다음 인수가 필요합니다.

| Arg         | Value              |
| ----------- | ------------------ |
| basisPoints | number             |
| creators    | Array<CreatorArgs> |
| ruleset     | RuleSet            |

## basisPoints

creators 배열의 크리에이터들이 2차 판매에서 로열티로 받을 비율을 베이시스 포인트로 나타냅니다. Royalties Plugin이 500으로 설정되면 5%를 의미합니다. 따라서 MPL Core Asset을 1 SOL에 판매하면 Asset의 지정된 크리에이터들은 총 0.05 SOL을 받아 그들 사이에 분배합니다. 일부 SDK에서는 직접 계산할 필요가 없도록 umi의 `percentAmount`와 같은 헬퍼 메서드를 제공합니다.

## Creators

크리에이터 목록은 얻은 로열티가 분배되는 배분 목록입니다. 로열티에서 수익을 얻는 크리에이터를 최대 5명까지 목록에 포함할 수 있습니다. 모든 멤버 간의 총 점유율은 100%가 되어야 합니다.

{% dialect-switcher title="Creators Array" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'

const creators = [
    { address: publicKey("11111111111111111111111111111111"), percentage: 80 }
    { address: publicKey("22222222222222222222222222222222"), percentage: 20 }
]
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```ts
use mpl_core::types::Creator;
use solana_sdk::pubkey::Pubkey
use std::str::FromStr;

let creators = vec![
        Creator {
            address: Pubkey::from_str("11111111111111111111111111111111").unwrap(),
            percentage: 80,
        },
        Creator {
            address: Pubkey::from_str("22222222222222222222222222222222").unwrap(),
            percentage: 20,
        }
    ];
```

{% /dialect %}

{% /dialect-switcher %}

## RuleSets

RuleSet을 통해 Royalties 플러그인이 할당된 MPL Core Asset에서 어떤 프로그램이 작업을 수행할 수 있거나 수행할 수 없는지 제어할 수 있습니다.

### Allowlist

Allowlist는 MPL Core Asset/Collection과 상호작용할 수 있는 프로그램 목록입니다. 이 목록에 없는 프로그램은 오류를 발생시킵니다.

{% dialect-switcher title="RuleSet Allowlist" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { ruleSet } from '@metaplex-foundation/mpl-core'

const ruleSet = ruleSet('ProgramAllowList', [
    [
		publicKey("11111111111111111111111111111111")
		publicKey("22222222222222222222222222222222")
    ]
])
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::types::RuleSet;
use solana_sdk::pubkey::Pubkey
use std::str::FromStr;

let rule_set = RuleSet::ProgramAllowList(
    vec![
        Pubkey::from_str("11111111111111111111111111111111").unwrap(),
        Pubkey::from_str("22222222222222222222222222222222").unwrap()
    ]
);
```

{% /dialect %}
{% /dialect-switcher %}

### DenyList

Denylist는 MPL Core Asset/Collection과 상호작용할 수 없는 프로그램 목록입니다. 이 목록에 있는 프로그램은 오류를 발생시킵니다.

{% dialect-switcher title="RuleSet DenyList" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { ruleSet } from '@metaplex-foundation/mpl-core'

const ruleSet = ruleSet('ProgramDenyList', [
    [
		publicKey("11111111111111111111111111111111")
		publicKey("22222222222222222222222222222222")
    ]
])
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::types::RuleSet;
use solana_sdk::pubkey::Pubkey
use std::str::FromStr;

let rule_set = RuleSet::ProgramDenyList(
    vec![
        Pubkey::from_str("11111111111111111111111111111111").unwrap(),
        Pubkey::from_str("22222222222222222222222222222222").unwrap()
    ]
);
```

{% /dialect %}
{% /dialect-switcher %}

### None

어떤 ruleset 규칙도 설정하지 않으려면 `__kind`를 none으로 전달하면 됩니다.

{% dialect-switcher title="RuleSet DenyList" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { ruleSet } from '@metaplex-foundation/mpl-core'

const rule_set = ruleSet('None')
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::types::RuleSet;

let ruleSet = RuleSet::None;
```

{% /dialect %}
{% /dialect-switcher %}

## Asset에 Royalties Plugin 추가 코드 예시

{% dialect-switcher title="MPL Core Asset에 Royalties Plugin 추가" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin, ruleSet } from '@metaplex-foundation/mpl-core'

const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('2222222222222222222222222222222')

await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Royalties',
    basisPoints: 500,
    creators: [
      { address: creator1, percentage: 80 },
      { address: creator2, percentage: 20 },
    ],
    ruleSet: ruleSet('ProgramDenyList', [
      [
        publicKey('44444444444444444444444444444444'),
        publicKey('55555555555555555555555555555555'),
      ],
    ]),
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Collection에 Royalties Plugin 추가 코드 예시

{% dialect-switcher title="Collection에 Royalties Plugin 추가" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addCollectionPlugin, ruleSet } from '@metaplex-foundation/mpl-core'

const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('2222222222222222222222222222222')

await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'Royalties',
    basisPoints: 500,
    creators: [
      { address: creator1, percentage: 80 },
      { address: creator2, percentage: 20 },
    ],
    ruleSet: ruleSet('ProgramDenyList', [
      [
        publicKey('44444444444444444444444444444444'),
        publicKey('55555555555555555555555555555555'),
      ],
    ]),
  },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```ts
use mpl_core::{
    instructions::AddCollectionPluginV1Builder,
    types::{Creator, Plugin, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_royalties_pluging_to_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let creator1 = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let creator2 = Pubkey::from_str("33333333333333333333333333333333").unwrap();

    let add_royalties_plugin_to_collection_ix = AddCollectionPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .plugin(Plugin::Royalties(Royalties {
            basis_points: 500,
            creators: vec![
                Creator {
                    address: creator1,
                    percentage: 80,
                },
                Creator {
                    address: creator2,
                    percentage: 20,
                },
            ],
            rule_set: RuleSet::None,
        }))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let add_royalties_pluging_to_collection_tx = Transaction::new_signed_with_payer(
        &[add_royalties_pluging_to_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&add_royalties_pluging_to_collection_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /dialect %}
{% /dialect-switcher %}