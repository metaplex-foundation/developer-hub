---
title: Royalties Plugin
metaTitle: Enforcing Royalties | Core
description: The Royalties plugin allows you set the royalty percentage for secondary sales on market places. This can now be set collection wide by applying the Royalty plugin to the Core Collection.
---

The Royalties Plugin is a `Authority Managed` plugin that allows the authority of the Asset to set and change the Royalties Plugin data.

This plugin can be used on both the `MPL Core Asset` and the `MPL Core Collection`.

When assigned to both MPL Core Asset and the MPL Core Collection the MPL Core Asset Royalties Plugin will take precedence over the MPL Core Collection Plugin.

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## Arguments

The Royalties Plugin requires the following arguments.

| Arg         | Value              |
| ----------- | ------------------ |
| basisPoints | number             |
| creators    | Array<CreatorArgs> |
| ruleset     | RuleSet            |

## basisPoints

This is the percentage in basispoints you wish creators from the creators array to receieve in royalties on secondary sales. If the Royalties Plugin is set to 500 this means 5%. So if you sell a MPL Core Asset for 1 SOL the Asset's designated creators will receive a total of 0.05 SOL to be distributed amongst them. Some of our SDKs provide helper methods like `percentAmount` in umi, so that you do not have to do the calculation yourself.

## Creators

The creators list is a distribution list for where earned royalties are distributed. You can have up to 5 creators in your list that earn from royalties. The total share between all members must add up to 100%.

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

## Updating the Royalties Plugin on an Asset

The Royalties Plugin can be updated to modify basis points, creators, or rulesets for an existing Asset.

{% dialect-switcher title="Update Royalties Plugin on Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, ruleSet } from '@metaplex-foundation/mpl-core'

const assetAddress = publicKey('11111111111111111111111111111111')
const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('2222222222222222222222222222222')

await updatePlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'Royalties',
    basisPoints: 750, // Updated from 500 to 750 (7.5%)
    creators: [
      { address: creator1, percentage: 60 }, // Updated distribution
      { address: creator2, percentage: 40 },
    ],
    ruleSet: ruleSet('ProgramAllowList', [
      [
        publicKey('66666666666666666666666666666666'), // Updated ruleset
        publicKey('77777777777777777777777777777777'),
      ],
    ]),
  },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::UpdatePluginV1Builder,
    types::{Creator, Plugin, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn update_royalties_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let creator1 = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let creator2 = Pubkey::from_str("33333333333333333333333333333333").unwrap();

    let update_royalties_plugin_ix = UpdatePluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::Royalties(Royalties {
            basis_points: 750, // Updated from 500 to 750 (7.5%)
            creators: vec![
                Creator {
                    address: creator1,
                    percentage: 60, // Updated distribution
                },
                Creator {
                    address: creator2,
                    percentage: 40,
                },
            ],
            rule_set: RuleSet::None,
        }))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let update_royalties_plugin_tx = Transaction::new_signed_with_payer(
        &[update_royalties_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&update_royalties_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## Updating the Royalties Plugin on a Collection

{% dialect-switcher title="Update Royalties Plugin on Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updateCollectionPlugin, ruleSet } from '@metaplex-foundation/mpl-core'

const collectionAddress = publicKey('11111111111111111111111111111111')
const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('2222222222222222222222222222222')

await updateCollectionPlugin(umi, {
  collection: collectionAddress,
  plugin: {
    type: 'Royalties',
    basisPoints: 600, // Updated royalty percentage
    creators: [
      { address: creator1, percentage: 70 }, // Updated distribution
      { address: creator2, percentage: 30 },
    ],
    ruleSet: ruleSet('None'),
  },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::UpdateCollectionPluginV1Builder,
    types::{Creator, Plugin, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn update_collection_royalties_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let creator1 = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let creator2 = Pubkey::from_str("33333333333333333333333333333333").unwrap();

    let update_royalties_plugin_ix = UpdateCollectionPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .plugin(Plugin::Royalties(Royalties {
            basis_points: 600, // Updated royalty percentage
            creators: vec![
                Creator {
                    address: creator1,
                    percentage: 70, // Updated distribution
                },
                Creator {
                    address: creator2,
                    percentage: 30,
                },
            ],
            rule_set: RuleSet::None,
        }))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let update_collection_royalties_plugin_tx = Transaction::new_signed_with_payer(
        &[update_royalties_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&update_collection_royalties_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## RuleSets

RuleSets allow you to control what programs can or can not perform actions on the MPL Core Assets the Royalties plugin is assigned to.

### Allowlist

An Allowlist is a list of programs that are allowed to interact with your MPL Core Asset/Collection. Any program not on this list will throw an error.

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

A Denylist is a list of programs that are not allowed to interact with your MPL Core Asset/Collection. Any program on this list will throw an error.

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

If you do not wish to set any ruleset rules then you can just pass the `__kind` as none.

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

## Adding the Royalties Plugin to an Asset code example

{% dialect-switcher title="Adding a Royalties Plugin to an MPL Core Asset" %}
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

## Adding the Royalties Plugin to a Collection code example

{% dialect-switcher title="Add Royalties Plugin to Collection" %}
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
