---
title: Delegating and Revoking Plugins
metaTitle: Core - Delegating Plugins
description: Learn how to delegate plugins to MPL Core Assets and Collections
---

## Delegating an Authority

Plugins can be delegated to another address with a Delegate Authority instruction update. Delegated plugins allow addresses other than the main authority to have control over that plugins functionality.

{% dialect-switcher title="Delegate a Plugin Authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  approvePluginAuthority,
  pluginAuthority,
  PluginType,
  addressPluginAuthority,
} from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')
const delegate = publicKey('33333333333333333333333333333')

await approvePluginAuthorityV1(umi, {
  asset: asset,
  pluginType: PluginType.FreezeDelegate,
  newAuthority: addressPluginAuthority(delegate),
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

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

{% /dialect %}
{% /dialect-switcher %}

## Revoking an Authority

Revoking an Authority on a plugin can have different behaviours depending on what type of plugin is being revoked.

- **Owner Mananged Plugins:** If an address is revoked from an `Owner Managed Plugin` then the plugin will default back to the `Owner` authority type.

- **Authority Mananged Plugins:** If an address is revoked from an `Authority Managed Plugin` then the plugin will default back to the `UpdateAuthority` authority type.

### Who can Revoke a Plugin?

#### Owner Managed Plugins

- An Owner Managed Plugin can be revoked by the owner which revokes the delegate and sets the pluginAuthority type to `Owner`.
- The delegated Authority of the plugin can revoke themselves which then sets the plugin authority type to `Owner`.
- On Transfer delegated Authorities of owner managed plugins are automatically revoked.

#### Authority Managed Plugins

- The Update Authority of an Asset can revoke a delegate which thens sets the pluginAuthority type to `UpdateAuthority`.
- The delegated Authority of the plugin can revoke themselves which then sets the plugin authority type to `UpdateAuthority`.

A list of plugins and their types can be viewed on the [Plugins Overview](/core/plugins) page.

{% dialect-switcher title="Revoking a Plugin Authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  PluginType,
  revokePluginAuthorityV1,
} from '@metaplex-foundation/mpl-core'

await revokePluginAuthorityV1(umi, {
  asset: asset.publicKey,
  pluginType: PluginType.Freeze,
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

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

{% /dialect %}
{% /dialect-switcher %}

### Delegate Resets Upon Asset Transfer

All Owner Managed plugins will have their delegated authorities revoked and set back to the authority type of `Owner` upon Transfer of an Asset.

This includes:

- Freeze Delegate
- Transfer Delegate
- Burn Delegate

## Making Plugin Data Immutable

By updating your plugins authority to a `None` value will effectively make your plugin's data immutable.

{% callout type="warning" %}

**WARNING** - Doing so will leave your plugin data immutable. Proceed with caution!

{% /callout %}

{% dialect-switcher title="Making a Plugin Immutable" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  PluginType,
  approvePluginAuthorityV1,
  getNoneAuthority,
} from '@metaplex-foundation/mpl-core'

await approvePluginAuthorityV1(umi, {
  asset: asset.publicKey,
  pluginType: PluginType.Freeze,
  newAuthority: getNoneAuthority(),
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

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

{% /dialect %}
{% /dialect-switcher %}
