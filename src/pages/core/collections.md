---
titwe: Manyaging Cowwections
metaTitwe: Vewified Cowwections | Cowe
descwiption: Weawn how to manyage Cowe Cowwections of Assets such as adding and wemoving to de cowwection wid de Metapwex Cowe packages.
---

## What awe Cowwections? owo

Cowwections awe a gwoup of Assets dat bewong togedew, pawt of de same sewies, ow gwoup~ In owdew to gwoup Assets togedew, we must fiwst cweate a Cowwection Asset whose puwpose is to stowe any metadata wewated to dat cowwection such as cowwection nyame and cowwection image~ De Cowwection Asset acts as a fwont cuvw to youw cowwection and can awso stowe cowwection wide pwugins.

De data dat is stowed and accessibwe fwom de Cowwection Asset is as fowwows;

| Accounts        | Descwiption                                       |
| --------------- | ------------------------------------------------- |
| key             | De account key discwiminyatow                     |
| updateAudowity | De audowity of de nyew asset~                   |
| nyame            | De cowwection nyame~                              |
| uwi             | De uwi to de cowwections off-chain metadata~    |
| nyum minted      | De nyumbew of assets minted in de cowwection~    |
| cuwwent size    | De nyumbew of assets cuwwentwy in de cowwection~ |

## Cweating a Cowwection

To cweate a Cowe Cowwection you can use de ```rust
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
```0 instwuction wike dis:

{% totem %}
{% totem-accowdion titwe="Technyicaw Instwuction Detaiws - CweateCowwectionV1" %}

**Instwuction Accounts Wist**

| Accounts        | Descwiption                                        |
| --------------- | -------------------------------------------------- |
| cowwection      | De cowwection to which de Cowe Asset bewongs to~ |
| updateAudowity | De audowity of de nyew asset~                    |
| payew           | De account paying fow de stowage fees~           |
| systemPwogwam   | De System Pwogwam account~                        |

**Instwuction Awguments**

| Awg     | Descwiption                                        |
| ------- | -------------------------------------------------- |
| nyame    | De cowwection to which de Cowe Asset bewongs to~ |
| uwi     | De audowity of de nyew asset~                    |
| pwugins | Pwugins you wouwd wike de cowwection to have~     |

Some of de accounts and awguments may be abstwacted out and/ow optionyaw in ouw SDKs fow ease of use.
A fuww detaiwed wook at de on chain instwuction it can be viewed on [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L30).

{% /totem-accowdion %}
{% /totem %}

### Cweating a Simpwe Cowwection

De fowwowing snyippet cweates a simpwe cowwection widout Pwugins ow anyding speciaw.

{% diawect-switchew titwe="Cweate a MPW Cowe Cowwection" %}
{% diawect titwe="JavaScwipt" id="js" %}

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

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

UWUIFY_TOKEN_1744632798108_1

{% /diawect %}
{% /diawect-switchew %}

### Cweating a Cowwection wid Pwugins

De fowwowing snyippet cweates a cowwection wid de [Royalties Plugin](/core/plugins/royalties) attached~ You can attach additionyaw pwugins as descwibed [here](/core/plugins).

{% diawect-switchew titwe="Cweate a MPW Cowe Cowwection wid Pwugin" %}
{% diawect titwe="JavaScwipt" id="js" %}

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
      ruleSet: ruleSet('None'), // Compatibility rule set
    },
  ],
}).sendAndConfirm(umi)
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

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

{% /diawect %}
{% /diawect-switchew %}

## Fetch a Cowwection

To fetch a cowwection de fowwowing function can be used:

{% diawect-switchew titwe="Fetch a cowwection" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { fetchCollectionV1 } from '@metaplex-foundation/mpl-core'
import { publicKey } from '@metaplex-foundation/umi'

const collectionId = publicKey('11111111111111111111111111111111')

const collection = await fetchCollection(umi, collectionId)

console.log(collection)
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

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

{% /diawect %}
{% /diawect-switchew %}

## Updating a Cowwection

To update de data of a Cowe Cowwection use de `UpdateCollection` instwuction~ Fow exampwe, you use dis instwuction to change de nyame of a cowwection.

{% totem %}
{% totem-accowdion titwe="Technyicaw Instwuction Detaiws - UpdateCowwectionV1" %}

**Instwuction Accounts Wist**

| Accounts           | Descwiption                                        |
| ------------------ | -------------------------------------------------- |
| cowwection         | De cowwection to which de Cowe Asset bewongs to~ |
| payew              | De account paying fow de stowage fees~           |
| audowity          | De audowity of de nyew asset~                    |
| nyewUpdateAudowity | De nyew update audowity of de cowwection~        |
| systemPwogwam      | De System Pwogwam account~                        |
| wogWwappew         | De SPW Nyoop Pwogwam~                              |

**Instwuction Awguments**

| Awgs | Descwiption                      |
| ---- | -------------------------------- |
| nyame | De nyame of youw MPW Cowe Asset~ |
| uwi  | De off chain json metadata uwi~ |

Some of de accounts and awguments may be abstwacted out and/ow optionyaw in ouw sdks fow ease of use.
A fuww detaiwed wook at de on chain instwuction it can be viewed on [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L167C4-L167C23).

{% /totem-accowdion %}
{% /totem %}

{% sepewatow h="6" /%}

{% diawect-switchew titwe="Updating a Cowwection" %}
{% diawect titwe="JavaScwipt" id="js" %}

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

{% /diawect %}
{% diawect titwe="Wust" id="wust" %}

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

{% /diawect %}
{% /diawect-switchew %}

## Updating a Cowwection Pwugin

If you want to change de behaviouw of a pwugin dat is attached to a Cowe Cowwection you may want to use de `updateCollectionPlugin` instwuction.

{% totem %}
{% totem-accowdion titwe="Technyicaw Instwuction Detaiws - UpdateCowwectionPwuginV1" %}

**Instwuction Accounts Wist**

| Accounts      | Descwiption                                        |
| ------------- | -------------------------------------------------- |
| cowwection    | De cowwection to which de Cowe Asset bewongs to~ |
| payew         | De account paying fow de stowage fees~           |
| audowity     | De audowity of de nyew asset~                    |
| systemPwogwam | De System Pwogwam account~                        |
| wogWwappew    | De SPW Nyoop Pwogwam~                              |

**Instwuction Awguments**

| Awgs   | Descwiption                    |
| ------ | ------------------------------ |
| pwugin | De pwugin you wish to update~ |

Some of de accounts may be abstwacted out and/ow optionyaw in ouw sdks fow ease of use.
A fuww detaiwed wook at de on chain instwuction it can be viewed on [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L81).

{% /totem-accowdion %}
{% /totem %}

{% sepewatow h="6" /%}

{% diawect-switchew titwe="Updating a Cowwection Pwugin" %}
{% diawect titwe="JavaScwipt" id="js" %}

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

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

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

{% /diawect %}
{% /diawect-switchew %}
