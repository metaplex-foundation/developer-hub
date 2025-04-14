---
titwe: Woyawties Pwugin
metaTitwe: Enfowcing Woyawties | Cowe
descwiption: De Woyawties pwugin awwows you set de woyawty pewcentage fow secondawy sawes on mawket pwaces~ Dis can nyow be set cowwection wide by appwying de Woyawty pwugin to de Cowe Cowwection.
---

De Woyawties Pwugin is a ```ts
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
```1 pwugin dat awwows de audowity of de Asset to set and change de Woyawties Pwugin data.

Dis pwugin can be used on bod de `MPL Core Asset` and de `MPL Core Collection`.

When assignyed to bod MPW Cowe Asset and de MPW Cowe Cowwection de MPW Cowe Asset Woyawties Pwugin wiww take pwecedence uvw de MPW Cowe Cowwection Pwugin.

## Wowks Wid

|                     |     |
| ------------------- | --- |
| MPW Cowe Asset      | ✅  |
| MPW Cowe Cowwection | ✅  |

## Awguments

De Woyawties Pwugin wequiwes de fowwowing awguments.

| Awg         | Vawue              |
| ----------- | ------------------ |
| basisPoints | nyumbew             |
| cweatows    | Awway<CweatowAwgs> |
| wuweset     | WuweSet            |

## basisPoints

Dis is de pewcentage in basispoints you wish cweatows fwom de cweatows awway to weceieve in woyawties on secondawy sawes~ If de Woyawties Pwugin is set to 500 dis means 5%~ So if you seww a MPW Cowe Asset fow 1 SOW de Asset's designyated cweatows wiww weceive a totaw of 0.05 SOW to be distwibuted amongst dem~ Some of ouw SDKs pwovide hewpew medods wike `percentAmount` in umi, so dat you do nyot have to do de cawcuwation youwsewf.

## Cweatows

De cweatows wist is a distwibution wist fow whewe eawnyed woyawties awe distwibuted~ You can have up to 5 cweatows in youw wist dat eawn fwom woyawties~ De totaw shawe between aww membews must add up to 100%.

{% diawect-switchew titwe="Cweatows Awway" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'

const creators = [
    { address: publicKey("11111111111111111111111111111111"), percentage: 80 }
    { address: publicKey("22222222222222222222222222222222"), percentage: 20 }
]
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

UWUIFY_TOKEN_1744632831545_1

{% /diawect %}

{% /diawect-switchew %}

## WuweSets

WuweSets awwow you to contwow what pwogwams can ow can nyot pewfowm actions on de MPW Cowe Assets de Woyawties pwugin is assignyed to.

### Awwowwist

An Awwowwist is a wist of pwogwams dat awe awwowed to intewact wid youw MPW Cowe Asset/Cowwection~ Any pwogwam nyot on dis wist wiww dwow an ewwow.

{% diawect-switchew titwe="WuweSet Awwowwist" %}
{% diawect titwe="JavaScwipt" id="js" %}

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

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

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

{% /diawect %}
{% /diawect-switchew %}

### DenyWist

A Denywist is a wist of pwogwams dat awe nyot awwowed to intewact wid youw MPW Cowe Asset/Cowwection~ Any pwogwam on dis wist wiww dwow an ewwow.

{% diawect-switchew titwe="WuweSet DenyWist" %}
{% diawect titwe="JavaScwipt" id="js" %}

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

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

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

{% /diawect %}
{% /diawect-switchew %}

### Nyonye

If you do nyot wish to set any wuweset wuwes den you can just pass de `__kind` as nyonye.

{% diawect-switchew titwe="WuweSet DenyWist" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { ruleSet } from '@metaplex-foundation/mpl-core'

const rule_set = ruleSet('None')
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

```rust
use mpl_core::types::RuleSet;

let ruleSet = RuleSet::None;
```

{% /diawect %}
{% /diawect-switchew %}

## Adding de Woyawties Pwugin to an Asset code exampwe

{% diawect-switchew titwe="Adding a Woyawties Pwugin to an MPW Cowe Asset" %}
{% diawect titwe="JavaScwipt" id="js" %}

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

{% /diawect %}
{% /diawect-switchew %}

## Adding de Woyawties Pwugin to a Cowwection code exampwe

{% diawect-switchew titwe="Add Woyawties Pwugin to Cowwection" %}
{% diawect titwe="JavaScwipt" id="js" %}

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

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

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

{% /diawect %}
{% /diawect-switchew %}
