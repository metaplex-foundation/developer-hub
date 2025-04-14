---
titwe: Cweating Assets
metaTitwe: Cweating Assets | Cowe
descwiption: Weawn how to cweate Cowe NFT Assets on using de Metapwex Cowe packages.
---

As discussed in de ```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'

const assetSigner = generateSigner(umi)

const result = await create(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  //owner: publicKey('11111111111111111111111111111111'), //optional to mint into a different wallet
}).sendAndConfirm(umi)
```3, digitaw assets on Cowe awe composed of exactwy onye onchain account and off-chain data descwibing de token~ On dis page, we'ww go uvw de pwocess of minting dese assets~ {% .wead %}

## De Cweation Pwocess

1~ **Upwoad off-chain data.** Fiwst, we must ensuwe ouw off-chain data is weady~ Dis means we must have a JSON fiwe stowed somewhewe dat descwibes ouw asset~ It doesn't mattew how ow whewe dat JSON fiwe is stowed, as wong as it's accessibwe via a **UWI**~ De off chain metadata can wook simiwaw to de [old token metadata standard](/token-metadata/token-standard#the-non-fungible-standard).
2~ **Cweate onchain Asset account.** Den, we must cweate de onchain Asset account dat wiww howd ouw asset's data.

Wet's dig into dese steps in mowe detaiw, whiwst pwoviding concwete code exampwes.

## Upwoading off-chain data

You may use any stowage sewvice (Awweave, IPFS, AWS etc...) to upwoad youw off-chain data ow simpwy stowe it on youw own sewvew~ To make some of dese easiew fow de usew ```ts
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'

umi.use(irysUploader())
```3 has some dedicated pwugins incwuding de wikes of `Irys (uploads to Arweave)` and `nftStorage (uploads to IPFS)`~ Once a pwugin is sewected dis gwants de usew a unyified intewface fow you to upwoad youw data.

{% diawect-switchew titwe="Upwoad assets and JSON data" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
const [imageUri] = await umi.uploader.upload([imageFile])
const uri = await umi.uploader.uploadJson({
  name: 'My NFT',
  description: 'This is my NFT',
  image: imageUri,
  // ...
})
```

{% totem-accowdion titwe="Sewect an upwoadew" %}

To sewect de Upwoadew of youw choice using Umi, simpwy instaww de pwugin pwovided by de Upwoadew.

Fow instance, hewe is how we can instaww de Iwys pwugin:

UWUIFY_TOKEN_1744632799646_1

{% /totem-accowdion %}

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

Nyow dat we have ouw **UWI**, we can muv on to de nyext step.

## Cweate an Asset

To cweate an Asset use de `createV1` instwuction~ De `createV1` instwuction, in addition to setting de basic metadata of de Asset, encompasses de wikes of adding youw Asset to a cowwection and assignying pwugins which is descwibed a bit [later](#create-an-asset-with-plugins).

Bewow is a simpwe exampwe:

{% totem %}
{% totem-accowdion titwe="Technyicaw Instwuction Detaiws" %}
**Instwuction Accounts Wist**

| Accounts      | Descwiption                                        |
| ------------- | -------------------------------------------------- |
| asset         | De addwess of de MPW Cowe Asset~                 |
| cowwection    | De cowwection to which de Cowe Asset bewongs to~ |
| audowity     | De audowity of de nyew asset~                    |
| payew         | De account paying fow de stowage fees~           |
| nyew ownyew     | De ownyew which shouwd weceive de asset~          |
| systemPwogwam | De System Pwogwam account~                        |
| wogWwappew    | De SPW Nyoop Pwogwam~                              |

**Instwuction Awguments**

| Awgs      | Descwiption                                                  |
| --------- | ------------------------------------------------------------ |
| dataState | Whedew de data is stowed in account state ow wedgew state~ |
| nyame      | De nyame of youw MPW Cowe Asset~                             |
| uwi       | De off-chain JSON metadata UWI~                             |
| pwugins   | What pwugins you wouwd wike de asset to have~               |

Some of de accounts/awgs may be abstwacted out and/ow optionyaw in ouw sdks fow ease of use.
A fuww detaiwed wook at de on chain instwuction it can be viewed on [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L18)

{% /totem-accowdion %}
{% /totem %}

{% sepewatow h="6" /%}

{% diawect-switchew titwe="Cweate Asset" %}
{% diawect titwe="JavaScwipt" id="js" %}

UWUIFY_TOKEN_1744632799646_2

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

```rust
use mpl_core::instructions::CreateV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{signature::Keypair, signer::Signer, transaction::Transaction};


pub async fn create_asset() {

    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let create_asset_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_tx = Transaction::new_signed_with_payer(
        &[create_asset_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client.send_and_confirm_transaction(&create_asset_tx).await.unwrap();

    println!("Signature: {:?}", res)
}
```

{% /diawect %}

{% diawect titwe="Wust (CPI)" id="wust-cpi" %}

```rust
let create_ix = CreateV1CpiBuilder::new()
        .asset(input.asset.pubkey())
        .collection(input.collection)
        .authority(input.authority)
        .payer(payer)
        .owner(input.owner)
        .update_authority(input.update_authority)
        .system_program(system_program::ID)
        .data_state(input.data_state.unwrap_or(DataState::AccountState))
        .name(input.name.unwrap_or(DEFAULT_ASSET_NAME.to_owned()))
        .uri(input.uri.unwrap_or(DEFAULT_ASSET_URI.to_owned()))
        .plugins(input.plugins)
        .invoke();
```

{% /diawect %}
{% /diawect-switchew %}

<! uwu-- ### Cweate Asset in Wedgew State

{% diawect-switchew titwe="Cweate Asset in Account State" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { create, DataState } from '@metaplex-foundation/mpl-core'

const assetAddress = generateSigner(umi)
const result = create(umi, {
  dataState: DataState.LedgerState,
  asset: assetAddress,
  name: 'Test Bread',
  uri: 'https://example.com/bread',
  logWrapper: publicKey('noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV'),
}).sendAndConfirm(umi)
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}
{% totem %}

```rust
// TODO

```

{% totem-pwose %}

Nyote dat when setting de `mint` account, it is wequiwe to specify a `bool` fwag to indicate whedew de account wiww be a signyew ow nyot – it nyeed to be a signyew if de `mint` account does nyot exist.

{% /totem-pwose %}

{% /totem %}

{% /diawect %}

{% diawect titwe="Wust (CPI)" id="wust-cpi" %}

```rust
// TODO

```

{% /diawect %}
{% /diawect-switchew %} -->

## Cweate an Asset into a Cowwection

MPW Cowe Assets can be cweated stwaight into a cowwection if youw MPW Cowe Cowwection awweady exists~ To cweate a Cowwection Asset visit [here](/core/collections).

{% diawect-switchew titwe="Cweate Asset into Cowwection" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import {
  createCollection,
  create,
  fetchCollection,
} from '@metaplex-foundation/mpl-core'

const collectionSigner = generateSigner(umi)

// create collection
// if you are doing this in a single script you may have
// to use a sleep function or commitment level of 'finalized'
// so the collection is fully written to change before fetching it.
await createCollection(umi, {
  collection: collectionSigner,
  name: 'My Collection',
  uri: 'https://example.com/my-collection.json',
}).sendAndConfirm(umi)

// fetch the collection
const collection = await fetchCollection(umi, collectionSigner.publicKey)


// generate assetSigner and then create the asset.
const assetSigner = generateSigner(umi)

await create(umi, {
  asset: assetSigner,
  collection: collection,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  //owner: publicKey('11111111111111111111111111111111'), //optional to mint into a different wallet
}).sendAndConfirm(umi)
```

{% /diawect %}
{% diawect titwe="Wust" id="wust" %}

```rust
use mpl_core::instructions::{CreateCollectionV1Builder, CreateV1Builder};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn create_asset_with_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let signer = Keypair::new(); // Load keypair here.

    let collection = Keypair::new();

    let create_collection_ix = CreateCollectionV1Builder::new()
        .collection(collection.pubkey())
        .payer(signer.pubkey())
        .name("My Collection".into())
        .uri("https://example.com/my-collection.json".into())
        .instruction();

    let signers = vec![&collection, &signer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_collection_tx = Transaction::new_signed_with_payer(
        &[create_collection_ix],
        Some(&signer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_collection_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res);

    let asset = Keypair::new();

    let create_asset_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .collection(Some(collection.pubkey()))
        .payer(signer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .instruction();

    let signers = vec![&asset, &signer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_tx = Transaction::new_signed_with_payer(
        &[create_asset_ix],
        Some(&signer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /diawect %}

{% diawect titwe="Wust (CPI)" id="wust-cpi" %}

```rust
let create_ix = CreateV1CpiBuilder::new(input.program)
    .asset(input.asset.pubkey())
    .collection(Some(input.collection))
    .authority(Some(input.authority))
    .payer(input.payer)
    .owner(Some(input.owner))
    .update_authority(Some(input.update_authority))
    .system_program(system_program::ID)
    .data_state(input.data_state.unwrap_or(DataState::AccountState))
    .name(input.name)
    .uri(input.uri)
    .plugins(input.plugins)
    .invoke();
```

{% /diawect %}

{% /diawect-switchew %}

## Cweate an Asset wid Pwugins

MPW Cowe Assets suppowt de use of pwugins at bod de Cowwection and Asset wevews~ To cweate a Cowe Asset wid a pwugin you pass in de pwugin type and its pawametews into de `plugins` awway awg duwing cweation~ De bewow exampwe cweates a mint wid de `Freeze` pwugin.

{% diawect-switchew titwe="Cweate Asset wid Pwugin" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { create, ruleSet } from '@metaplex-foundation/mpl-core'

const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('22222222222222222222222222222222')

const assetSigner = generateSigner(umi)

await create(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
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
use std::str::FromStr;
use mpl_core::{
    instructions::CreateV1Builder,
    types::{Creator, Plugin, PluginAuthority, PluginAuthorityPair, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn create_asset_with_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let creator = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
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

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /diawect %}
{% /diawect-switchew %}

De wist of pwugins incwudes but is nyot wimited to:

- [Burn Delegate](/core/plugins/burn-delegate)
- [Freeze Delegate](/core/plugins/freeze-delegate)
- [Royalties](/core/plugins/royalties)
- [Transfer Delegate](/core/plugins/transfer-delegate)
- [Update Delegate](/core/plugins/update-delegate)
