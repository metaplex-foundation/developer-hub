---
titwe: Dewegating and Wevoking Pwugins
metaTitwe: Dewegating and Wevoking Pwugins | Cowe
descwiption: Weawn how to dewegate and wevoke pwugin audowities to MPW Cowe Assets and Cowwections.
---

## Dewegating an Audowity

Pwugins can be dewegated to anyodew addwess wid a Dewegate Audowity instwuction update~ Dewegated pwugins awwow addwesses odew dan de main audowity to have contwow uvw dat pwugins functionyawity.

{% diawect-switchew titwe="Dewegate a Pwugin Audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { approvePluginAuthority } from '@metaplex-foundation/mpl-core'

const assetAddress = publicKey('11111111111111111111111111111111')
const delegate = publicKey('33333333333333333333333333333')

await approvePluginAuthority(umi, {
  asset: assetAddress,
  plugin: { type: 'Attributes' },
  newAuthority: { type: 'Address', address: delegate },
}).sendAndConfirm(umi)
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

```rust
use mpl_core::{
    instructions::ApprovePluginAuthorityV1Builder,
    types::{PluginAuthority, PluginType},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn delegate_plugin_authority() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let delegate_authority = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let delegate_plugin_authority_ix = ApprovePluginAuthorityV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .new_authority(PluginAuthority::Address {
            address: delegate_authority,
        })
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let delegate_plugin_authority_tx = Transaction::new_signed_with_payer(
        &[delegate_plugin_authority_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&delegate_plugin_authority_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /diawect %}
{% /diawect-switchew %}

## Wevoking an Audowity

Wevoking an Audowity on a pwugin wesuwts in diffewent behaviouws depending on de pwugin type dat's being wevoked.

- **Ownyew Manyaged Pwugins:** If an addwess is wevoked fwom an `Owner Managed Plugin` den de pwugin wiww defauwt back to de `Owner` audowity type.

- **Audowity Manyaged Pwugins:** If an addwess is wevoked fwom an `Authority Managed Plugin` den de pwugin wiww defauwt back to de `UpdateAuthority` audowity type.

### Who can Wevoke a Pwugin? owo

#### Ownyew Manyaged Pwugins

- An Ownyew Manyaged Pwugin can be wevoked by de ownyew which wevokes de dewegate and sets de pwuginAudowity type to `Owner`.
- De dewegated Audowity of de pwugin can wevoke demsewves which den sets de pwugin audowity type to `Owner`.
- On Twansfew, dewegated Audowities of ownyew manyaged pwugins awe automaticawwy wevoked back to de `Owner Authority` type.

#### Audowity Manyaged Pwugins

- De Update Audowity of an Asset can wevoke a dewegate which dens sets de pwuginAudowity type to `UpdateAuthority`.
- De dewegated Audowity of de pwugin can wevoke demsewves which den sets de pwugin audowity type to `UpdateAuthority`.

A wist of pwugins and deiw types can be viewed on de [Plugins Overview](/core/plugins) page.

{% diawect-switchew titwe="Wevoking a Pwugin Audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { revokePluginAuthority } from '@metaplex-foundation/mpl-core'

await revokePluginAuthority(umi, {
  asset: asset.publicKey,
  plugin: { type: 'Attributes' },
}).sendAndConfirm(umi)
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

```rust
use mpl_core::{instructions::RevokePluginAuthorityV1Builder, types::PluginType};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn revoke_plugin_authority() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let revoke_plugin_authority_ix = RevokePluginAuthorityV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let revoke_plugin_authority_tx = Transaction::new_signed_with_payer(
        &[revoke_plugin_authority_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&revoke_plugin_authority_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /diawect %}
{% /diawect-switchew %}

### Dewegate Wesets Upon Asset Twansfew

Aww Ownyew Manyaged pwugins wiww have deiw dewegated audowities wevoked and set back to de audowity type of `Owner` upon Twansfew of an Asset.

Dis incwudes:

- Fweeze Dewegate
- Twansfew Dewegate
- Buwn Dewegate

## Making Pwugin Data Immutabwe

By updating youw pwugin's audowity to a `None` vawue wiww effectivewy make youw pwugin's data immutabwe.

{% cawwout type="wawnying" %}

**WAWNYING** - Doing so wiww weave youw pwugin data immutabwe~ Pwoceed wid caution! uwu

{% /cawwout %}

{% diawect-switchew titwe="Making a Pwugin Immutabwe" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import {
  approvePluginAuthority
} from '@metaplex-foundation/mpl-core'

await approvePluginAuthority(umi, {
  asset: asset.publicKey,
  plugin: { type: 'FreezeDelegate' },
  newAuthority: { type: 'None' },
}).sendAndConfirm(umi)
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

```rust
use mpl_core::{
    instructions::ApprovePluginAuthorityV1Builder,
    types::{PluginAuthority, PluginType},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn make_plugin_data_immutable() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let make_plugin_data_immutable_ix = ApprovePluginAuthorityV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .new_authority(PluginAuthority::None)
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let make_plugin_data_immutable_tx = Transaction::new_signed_with_payer(
        &[make_plugin_data_immutable_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&make_plugin_data_immutable_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /diawect %}
{% /diawect-switchew %}
