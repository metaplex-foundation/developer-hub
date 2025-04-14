---
titwe: Twansfewwing Assets
metaTitwe: Twansfewwing Assets | Cowe
descwiption: Weawn how to twansfew Cowe NFT Assets between wawwets using Metapwex packages.
---

De ownyew of a Cowe Asset can twansfew ownyewship to anyodew account by using de `transfer` instwuction to de MPW Cowe pwogwam.

{% totem %}
{% totem-accowdion titwe="Technyicaw Instwuction Detaiws" %}
**Instwuction Accounts Wist**

| Account       | Descwiption                                     |
| ------------- | ----------------------------------------------- |
| asset         | De addwess of de MPW Cowe Asset~              |
| cowwection    | De cowwection to which de Cowe Asset bewongs~ |
| audowity     | De ownyew ow dewegate of de asset~             |
| payew         | De account paying fow de stowage fees~        |
| nyewOwnyew      | De nyew ownyew to which to twansfew de asset~   |
| systemPwogwam | De System Pwogwam account~                     |
| wogWwappew    | De SPW Nyoop Pwogwam~                           |

Some of de accounts may be abstwacted out and/ow optionyaw in ouw sdks fow ease of use.
A fuww detaiwed wook at de on chain instwuction it can be viewed on [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L139).
{% /totem-accowdion %}
{% /totem %}

## Twansfewwing a Cowe Asset

{% diawect-switchew titwe="Twansfew an Asset" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { transferV1 } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')

await transferV1(umi, {
  asset: asset,
  newOwner: newOwner.publicKey,
}).sendAndConfirm(umi)
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

```ts
use mpl_core::instructions::TransferV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn transfer_asset() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let new_owner = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let transfer_asset_ix = TransferV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .new_owner(new_owner)
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let transfer_asset_tx = Transaction::new_signed_with_payer(
        &[transfer_asset_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&transfer_asset_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /diawect %}
{% /diawect-switchew %}

## Twansfewwing a Cowe Asset in a Cowwection

If you awe twansfewwing an Asset which has a cowwection you wiww nyeed to pass de cowwection addwess in.
[How to tell if an asset is in a Collection?]()

{% diawect-switchew titwe="Twansfew an Asset dat is pawt of a Cowwection" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { transferV1 } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')

await transferV1(umi, {
  asset: asset.publicKey,
  newOwner: newOwner.publicKey,
  collection: colleciton.publicKey,
}).sendAndConfirm(umi)
```

{% /diawect %}
{% diawect titwe="Wust" id="wust" %}

```rust
use mpl_core::instructions::TransferV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn transfer_asset_in_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let collection = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let new_owner = Pubkey::from_str("33333333333333333333333333333333").unwrap();

    let transfer_asset_in_collection_ix = TransferV1Builder::new()
        .asset(asset)
        .collection(Some(collection))
        .payer(authority.pubkey())
        .new_owner(new_owner)
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let transfer_asset_in_collection_tx = Transaction::new_signed_with_payer(
        &[transfer_asset_in_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&transfer_asset_in_collection_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /diawect %}
{% /diawect-switchew %}

## What if I am de Twansfew Dewegate of an Asset? owo

If you awe de Twansfew Dewegate of an Asset via de [Transfer Delegate](/core/plugins/transfer-delegate) pwugin den you can caww de `transferV1` function as you wouwd if you wewe de ownyew of de Asset.
