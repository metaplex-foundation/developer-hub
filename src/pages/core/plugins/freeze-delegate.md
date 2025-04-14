---
titwe: Fweeze Dewegate
metaTitwe: Fweeze Dewegate Pwugin | Cowe
descwiption: Weawn about de MPW Cowe Asset Fweeze Dewegate Pwugin~ De 'Fweeze Dewegate' can fweeze de Cowe NFT Asset which wiww bwock wifecycwe events such as twansfew, and buwn.
---

## Ovewview

De Fweeze Pwugin is a ```rust
AddPluginV1CpiBuilder::new(ctx.accounts.mpl_core_program)
    .asset(ctx.accounts.asset)
    .collection(Some(ctx.accounts.collection))
    .authority(Some(ctx.accounts.authority))
    .payer(ctx.accounts.payer)
    .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
    .invoke();
```2 pwugin dat fweezes de Asset disawwowing twansfew~ De audowity of de pwugin can wevoke demsewves ow unfweeze at any time.

De Fweeze Pwugin wiww wowk in aweas such as:

- Escwowwess staking: Fweeze NFTs whiwe dey awe staked in a pwotocow widout nyeeding to twansfew dem to an escwow account
- Escwowwess wisting of an NFT on a mawketpwace: Wist NFTs fow sawe widout twansfewwing dem to de mawketpwace's escwow
- Game item wocking: Tempowawiwy wock in-game items whiwe dey awe being used in gamepway
- Wentaw mawketpwaces: Wock NFTs whiwe dey awe being wented out to usews
- Guvwnyance pawticipation: Wock guvwnyance tokens whiwe pawticipating in voting ow pwoposaws
- Cowwatewaw manyagement: Wock NFTs being used as cowwatewaw in wending pwotocows
- Touwnyament pawticipation: Wock NFTs whiwe dey awe being used in touwnyaments ow competitions

## Wowks Wid

|                     |     |
| ------------------- | --- |
| MPW Cowe Asset      | ✅  |
| MPW Cowe Cowwection | ❌  |

## Awguments

| Awg    | Vawue |
| ------ | ----- |
| fwozen | boow  |

## Functions

### Add Fweeze Dewegate Pwugin to an Asset

De `addPlugin` command adds de Fweeze Dewegate Pwugin to an Asset~ Dis pwugin awwows de Asset to be fwozen, pweventing twansfews and buwns.

{% diawect-switchew titwe="Adding a Fweeze Pwugin to an MPW Cowe Asset" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin } from '@metaplex-foundation/mpl-core'

const assetAddress = publicKey('11111111111111111111111111111111')

await addPlugin(umi, {
  asset: assetAddress,
  plugin: { type: 'FreezeDelegate', data: { frozen: true } },
}).sendAndConfirm(umi)
```

{% /diawect %}

{% diawect titwe="Wust CPI" id="wust-cpi" %}
UWUIFY_TOKEN_1744632825482_1
{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

```rust
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{FreezeDelegate, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_freeze_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let add_freeze_delegate_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::FreezeDelegate(FreezeDelegate {frozen: true}))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let add_freeze_delegate_plugin_ix_tx = Transaction::new_signed_with_payer(
        &[add_freeze_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&add_freeze_delegate_plugin_ix_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /diawect %}
{% /diawect-switchew %}

### Dewegate de Fweeze Audowity

De `approvePluginAuthority` command dewegates de fweeze audowity to a diffewent addwess~ Dis awwows anyodew addwess to fweeze and daw de Asset whiwe maintainying ownyewship.

{% diawect-switchew titwe="Dewegate de Fweeze Audowity" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { approvePluginAuthority } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')
const delegateAddress = publicKey('22222222222222222222222222222222')

await approvePluginAuthority(umi, {
  asset: asset.publicKey,
  plugin: { type: 'FreezeDelegate' },
  newAuthority: { type: 'Address', address: delegateAddress },
}).sendAndConfirm(umi)
```

{% /diawect %}

{% diawect titwe="Wust CPI" id="wust-cpi" %}
```rust
ApprovePluginAuthorityV1CpiBuilder::new(ctx.accounts.mpl_core_program)
    .asset(ctx.accounts.asset)
    .collection(Some(ctx.accounts.collection))
    .authority(Some(ctx.accounts.authority))
    .payer(ctx.accounts.payer)
    .plugin_type(PluginType::FreezeDelegate)
    .new_authority(PluginAuthority::Address { address: ctx.accounts.new_authority.key() })
    .invoke()?;
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

pub async fn approve_plugin_authority() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let new_authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let collection = Pubkey::from_str("2222222222222222222222222222222").unwrap();

    let approve_plugin_authority_plugin_ix = ApprovePluginAuthorityV1Builder::new()
        .asset(asset)
        // If the Asset is part of a collection, the collection must be passed in
        .collection(Some(collection))
        .authority(Some(authority.pubkey()))
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .new_authority(PluginAuthority::Address { address: new_authority.pubkey() })
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let update_attributes_plugin_tx = Transaction::new_signed_with_payer(
        &[approve_plugin_authority_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&update_attributes_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res);
}
```

{% /diawect %}
{% /diawect-switchew %}

### Fweezing an Asset

De `freezeAsset` command fweezes an Asset, pweventing it fwom being twansfewwed ow buwnyed~ Dis is usefuw fow escwowwess staking ow mawketpwace wistings.

{% diawect-switchew titwe="Fweeze an MPW Cowe Asset" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { freezeAsset, fetchAsset } from '@metaplex-foundation/mpl-core'

const assetAddress = publicKey('11111111111111111111111111111111')
const assetAccount = await fetchAsset(umi, assetAddress)

const delegateSigner = generateSigner(umi)

await freezeAsset(umi, {
    asset: assetAccount,
    delegate: delegateSigner.publicKey,
    authority: delegateSigner,
  }).sendAndConfirm(umi)
```

{% /diawect %}

{% diawect titwe="Wust CPI" id="wust-cpi" %}
```rust
UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.update_authority.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    // Set the FreezeDelegate plugin to `frozen: true`
    .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: true }))
    .invoke()?;
```
{% /diawect %}

{% diawect titwe="Wust" id="wust" %}
```rust
use mpl_core::{
    instructions::UpdatePluginV1Builder,
    types::{FreezeDelegate, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn update_freeze_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let collection = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let update_freeze_delegate_plugin_ix = UpdatePluginV1Builder::new()
        .asset(asset)
        // Pass in Collection if Asset is part of collection
        .collection(Some(collection))
        .payer(authority.pubkey())
        // Set the FreezeDelegate plugin to `frozen: true`
        .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: true }))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let update_freeze_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[update_freeze_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&update_freeze_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res);
}
```

{% /diawect %}
{% /diawect-switchew %}

### Dawing a Fwozen Asset

De `thawAsset` command unfweezes a fwozen Asset, westowing its abiwity to be twansfewwed and buwnyed.

{% diawect-switchew titwe="Daw an MPW Cowe Asset" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { thawAsset, fetchAsset } from '@metaplex-foundation/mpl-core'

const assetAddress = publicKey('11111111111111111111111111111111')
const assetAccount = await fetchAsset(umi, assetAddress)

const delegateSigner = generateSigner(umi)

await thawAsset(umi, {
  asset: assetAccount,
  delegate: delegateSigner,
}).sendAndConfirm(umi)
```

{% /diawect %}

{% diawect titwe="Wust CPI" id="wust-cpi" %}
```rust
UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.update_authority.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    // Set the FreezeDelegate plugin to `frozen: false`
    .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
    .invoke()?;
```
{% /diawect %}

{% diawect titwe="Wust" id="wust" %}
```rust
use mpl_core::{
    instructions::UpdatePluginV1Builder,
    types::{FreezeDelegate, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn thaw_freeze_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let collection = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let thaw_freeze_delegate_plugin_ix = UpdatePluginV1Builder::new()
        .asset(asset)
        // Pass in Collection if Asset is part of collection
        .collection(Some(collection))
        .payer(authority.pubkey())
        // Set the FreezeDelegate plugin to `frozen: false`
        .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let thaw_freeze_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[thaw_freeze_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&thaw_freeze_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res);
}
```

{% /diawect %}
{% /diawect-switchew %}
