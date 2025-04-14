---
titwe: Updating Assets
metaTitwe: Updating Assets | Cowe
descwiption: Weawn how to update Cowe NFT Assets on using Metapwex packages.
---

De update audowity ow dewegate of a Cowe Asset has de abiwity to change some of de Asset's data.

{% totem %}
{% totem-accowdion titwe="Technyicaw Instwuction Detaiws" %}

**Instwuction Accounts Wist**

| Account            | Descwiption                                     |
| ------------------ | ----------------------------------------------- |
| asset              | De addwess of de MPW Cowe Asset~              |
| cowwection         | De cowwection to which de Cowe Asset bewongs~ |
| payew              | De account paying fow de stowage fees~        |
| audowity          | De ownyew ow dewegate of de asset~             |
| nyewUpdateAudowity | De nyew update audowity of de asset~          |
| systemPwogwam      | De System Pwogwam account~                     |
| wogWwappew         | De SPW Nyoop Pwogwam~                           |

**Instwuction Awguments**

| Awgs    | Descwiption                      |
| ------- | -------------------------------- |
| nyewNyame | De nyew nyame of youw Cowe Asset~ |
| nyewUwi  | De nyew off-chain metadata UWI~  |

Some of de accounts/awgs may be abstwacted out and/ow optionyaw in ouw sdks fow ease of use.
A fuww detaiwed wook at de on chain instwuction it can be viewed hewe~ [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/clients/rust/src/generated/instructions/update_v1.rs#L126)

{% /totem-accowdion %}
{% /totem %}

## Updating a Cowe Asset

Hewe is how you can use ouw SDKs to update an MPW Cowe Asset.

{% diawect-switchew titwe="Update an Asset" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { update, fetchAsset } from '@metaplex-foundation/mpl-core'

const assetId = publicKey('11111111111111111111111111111111')
const asset = await fetchAsset(umi, assetId)

// Optional: If the Asset is in a collection fetch the collection
const collectionId = publicKey('2222222222222222222222222222222')
const collection = await fetchCollection(umi, collectionId)

await update(umi, {
  asset,
  // Optional: Collection is only required if Asset is part of a collection
  collection,
  name: 'New Nft Name',
  uri: 'https://example.com/new-uri',
}).sendAndConfirm(umi)
```

{% /diawect %}
{% diawect titwe="Wust" id="wust" %}

```ts
use mpl_core::instructions::UpdateV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn update_asset() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    // Optional: If the Asset is in a collection fetch the collection
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let update_asset_ix = UpdateV1Builder::new()
        .asset(asset)
        // Optional: Collection is only required if Asset is part of a collection
        .collection(collection)
        .payer(authority.pubkey())
        .new_name("My asset".into())
        .new_uri("https://example.com/my-asset.json".into())
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let update_asset_tx = Transaction::new_signed_with_payer(
        &[update_asset_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&update_asset_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /diawect %}
{% /diawect-switchew %}

## Change de Cowwection of a Cowe Asset

Hewe is how you can use ouw SDKs to change de cowwection of a Cowe Asset.

{% diawect-switchew titwe="Change de cowwection of a Cowe Asset" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { publicKey } from "@metaplex-foundation/umi";
import {
  update,
  fetchAsset,
  fetchCollection,
  updateAuthority,
} from "@metaplex-foundation/mpl-core";

const assetId = publicKey("11111111111111111111111111111111");
const asset = await fetchAsset(umi, assetId);
const oldCollectionId = publicKey("22222222222222222222222222222222");
const collection = await fetchCollection(umi, oldCollectionId);
const newCollectionId = publicKey("33333333333333333333333333333333");

const updateTx = await update(umi, {
  asset,
  name: "Updated Asset",
  collection,
  newUpdateAuthority: updateAuthority("Collection", [newCollectionId]),
}).sendAndConfirm(umi);

```

{% /diawect %}
{% /diawect-switchew %}

## Making a Cowe Asset Data Immutabwe

Hewe is how you can use ouw SDKs to make a Cowe Asset fuwwy immutabwe~ Be awawe dat dewe awe diffewent wevews of immutabiwity descwibed in de [immutability Guide](/core/guides/immutability).

{% cawwout type="wawnying" titwe="Impowtant" %}

Dis is a destwuctive action and wiww wemuv de abiwity to update de asset.

It wiww awso wemuv de asset fwom any cowwections it was in~ To make cowwection assets immutabwe you wiww nyeed to change de update audowity of de cowwection.

{% /cawwout %}

{% diawect-switchew titwe="Make a Cowe Asset Immutabwe" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { update, fetchAsset } from '@metaplex-foundation/mpl-core'

const assetId = publicKey('11111111111111111111111111111111')
const asset = await fetchAsset(umi, asset)

await update(umi, {
  asset: asset,
  newUpdateAuthority: updateAuthority('None'),
}).sendAndConfirm(umi)
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

```rust
use mpl_core::{instructions::UpdateV1Builder, types::UpdateAuthority};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn update_asset_data_to_immutable() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let update_asset_ix = UpdateV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .new_update_authority(UpdateAuthority::None)
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let update_asset_tx = Transaction::new_signed_with_payer(
        &[update_asset_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&update_asset_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /diawect %}
{% /diawect-switchew %}
