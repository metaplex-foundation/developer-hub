---
title: Updating Assets
metaTitle: Updating Assets | Core
description: Learn how to update Core NFT Assets on using Metaplex packages.
---

The update authority or delegate of a Core Asset has the ability to change some of the Asset's data.

{% totem %}
{% totem-accordion title="Technical Instruction Details" %}

**Instruction Accounts List**

| Account            | Description                                     |
| ------------------ | ----------------------------------------------- |
| asset              | The address of the MPL Core Asset.              |
| collection         | The collection to which the Core Asset belongs. |
| payer              | The account paying for the storage fees.        |
| authority          | The owner or delegate of the asset.             |
| newUpdateAuthority | The new update authority of the asset.          |
| systemProgram      | The System Program account.                     |
| logWrapper         | The SPL Noop Program.                           |

**Instruction Arguments**

| Args    | Description                      |
| ------- | -------------------------------- |
| newName | The new name of your Core Asset. |
| newUri  | The new off-chain metadata URI.  |

Some of the accounts/args may be abstracted out and/or optional in our sdks for ease of use.
A full detailed look at the on chain instruction it can be viewed here. [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/clients/rust/src/generated/instructions/update_v1.rs#L126)

{% /totem-accordion %}
{% /totem %}

## Updating a Core Asset

Here is how you can use our SDKs to update an MPL Core Asset.

{% dialect-switcher title="Update an Asset" %}
{% dialect title="JavaScript" id="js" %}

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

{% /dialect %}
{% dialect title="Rust" id="rust" %}

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

{% /dialect %}
{% /dialect-switcher %}

## Change the Collection of a Core Asset

Here is how you can use our SDKs to change the collection of a Core Asset.

{% dialect-switcher title="Change the collection of a Core Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from "@metaplex-foundation/umi";
import {
  update,
  fetchAsset,
  fetchCollection,
  collectionAddress,
  updateAuthority
} from "@metaplex-foundation/mpl-core";

const assetId = publicKey("11111111111111111111111111111111");

const asset = await fetchAsset(umi, assetId);

const collectionId = collectionAddress(asset)

if (!collectionId) {
  console.log("Collection not found");
  return;
}

const collection = await fetchCollection(umi, collectionId);

const newCollectionId = publicKey("22222222222222222222222222222222")

const updateTx = await update(umi, {
  asset,
  collection,
  newCollection: newCollectionId,
  newUpdateAuthority: updateAuthority('Collection', [newCollectionId]),
}).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

## Making a Core Asset Data Immutable

Here is how you can use our SDKs to make a Core Asset fully immutable. Be aware that there are different levels of immutability described in the [immutability Guide](/smart-contracts/core/guides/immutability).

{% callout type="warning" title="Important" %}

This is a destructive action and will remove the ability to update the asset.

It will also remove the asset from any collections it was in. To make collection assets immutable you will need to change the update authority of the collection.

{% /callout %}

{% dialect-switcher title="Make a Core Asset Immutable" %}
{% dialect title="JavaScript" id="js" %}

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

{% /dialect %}

{% dialect title="Rust" id="rust" %}

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

{% /dialect %}
{% /dialect-switcher %}
