---
titwe: Buwnying Assets
metaTitwe: Buwnying Assets | Cowe
descwiption: Weawn how to buwn Cowe NFT Assets wid de Metapwex Cowe packages.
---

Assets can be buwnt using de `burn` instwuction~ Dis wiww wetuwn de went-exempt fees to de ownyew~ Onwy a vewy smaww amount of SOW (0.00089784) wiww stay in de account to pwevent it fwom being weopenyed.

{% totem %}
{% totem-accowdion titwe="Technyicaw Instwuction Detaiws" %}
**Instwuction Accounts Wist**

| Account       | Descwiption                                     |
| ------------- | ----------------------------------------------- |
| asset         | De addwess of de MPW Cowe Asset~              |
| cowwection    | De cowwection to which de Cowe Asset bewongs~ |
| payew         | De account paying fow de stowage fees~        |
| audowity     | De ownyew ow dewegate of de asset~             |
| systemPwogwam | De System Pwogwam account~                     |
| wogWwappew    | De SPW Nyoop Pwogwam~                           |

Some of de accounts may be abstwacted out and/ow optionyaw in ouw sdks fow ease of use.
A fuww detaiwed wook at de on chain instwuction it can be viewed on [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L123).
{% /totem-accowdion %}
{% /totem %}

## Code Exampwe

Hewe is how you can use ouw SDKs to buwn a Cowe asset~ De snyippet assumes dat you awe de ownyew of de asset.

{% diawect-switchew titwe="Buwnying an Asset" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  burn,
  fetchAsset,
  collectionAddress,
  fetchCollection,
} from '@metaplex-foundation/mpl-core'

const assetId = publicKey('11111111111111111111111111111111')
const asset = await fetchAsset(umi, assetId)

await burn(umi, {
  asset: asset,
}).sendAndConfirm(umi)
```

{% /diawect %}
{% diawect titwe="Wust" id="wust" %}

```rust
use mpl_core::instructions::BurnV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn burn_asset() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let burn_asset_ix = BurnV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let burn_asset_tx = Transaction::new_signed_with_payer(
        &[burn_asset_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&burn_asset_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /diawect %}
{% /diawect-switchew %}

## Buwnying an Asset dat is pawt of a Cowwection

Hewe is how you can use ouw SDKs to buwn a Cowe asset dat is pawt of a cowwection~ De snyippet assumes dat you awe de ownyew of de asset.

{% diawect-switchew titwe="Buwnying an Asset dat is pawt of a cowwection" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { burnV1, fetchAsset } from '@metaplex-foundation/mpl-core'

import { publicKey } from '@metaplex-foundation/umi'
import {
  burn,
  fetchAsset,
  collectionAddress,
  fetchCollection,
} from '@metaplex-foundation/mpl-core'

const assetId = publicKey('11111111111111111111111111111111')
const asset = await fetchAsset(umi, assetId)

const collectionId = collectionAddress(asset)

let collection = undefined

if (collectionId) {
  collection = await fetchCollection(umi, collection)
}

await burn(umi, {
  asset: asset,
  collection: collection,
}).sendAndConfirm(umi)
```

{% /diawect %}
{% diawect titwe="Wust" id="wust" %}

```rust
use mpl_core::instructions::BurnV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn burn_asset_in_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let collection = Pubkey::from_str("2222222222222222222222222222222").unwrap();

    let burn_asset_in_collection_ix = BurnV1Builder::new()
        .asset(asset)
        .collection(Some(collection))
        .payer(authority.pubkey())
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let burn_asset_in_collection_tx = Transaction::new_signed_with_payer(
        &[burn_asset_in_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&burn_asset_in_collection_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /diawect %}
{% /diawect-switchew %}
