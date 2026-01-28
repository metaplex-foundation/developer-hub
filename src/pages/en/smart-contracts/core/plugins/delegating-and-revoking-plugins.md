---
title: Delegating and Revoking Plugins
metaTitle: Delegating and Revoking Plugin Authority | Metaplex Core
description: Learn how to delegate and revoke plugin authorities on Core Assets. Change who controls plugins and make plugin data immutable.
---

This guide shows how to **delegate and revoke plugin authorities** on Core Assets. Transfer control of plugins to other addresses or make plugin data permanently immutable. {% .lead %}

{% callout title="What You'll Learn" %}

- Delegate plugin authority to another address
- Revoke delegated authority
- Understand revocation behavior for different plugin types
- Make plugin data immutable

{% /callout %}

## Summary

Delegate plugin authority using `approvePluginAuthority()` and revoke with `revokePluginAuthority()`. Different plugin types have different revocation behaviors.

- **Owner Managed**: Revokes back to `Owner` authority
- **Authority Managed**: Revokes back to `UpdateAuthority`
- Set authority to `None` to make plugin immutable
- Owner Managed plugins auto-revoke on Asset transfer

## Out of Scope

Plugin removal (see [Removing Plugins](/smart-contracts/core/plugins/removing-plugins)), adding plugins (see [Adding Plugins](/smart-contracts/core/plugins/adding-plugins)), and permanent plugin authority changes.

## Quick Start

**Jump to:** [Delegate Authority](#delegating-an-authority) · [Revoke Authority](#revoking-an-authority) · [Make Immutable](#making-plugin-data-immutable)

1. Call `approvePluginAuthority()` with the new authority address
2. To revoke: call `revokePluginAuthority()`
3. To make immutable: set authority to `None`

## Delegating an Authority

Plugins can be delegated to another address with a Delegate Authority instruction update. Delegated plugins allow addresses other than the main authority to have control over that plugins functionality.

{% dialect-switcher title="Delegate a Plugin Authority" %}
{% dialect title="JavaScript" id="js" %}

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

Revoking an Authority on a plugin results in different behaviours depending on the plugin type that's being revoked.

- **Owner Managed Plugins:** If an address is revoked from an `Owner Managed Plugin` then the plugin will default back to the `Owner` authority type.

- **Authority Managed Plugins:** If an address is revoked from an `Authority Managed Plugin` then the plugin will default back to the `UpdateAuthority` authority type.

### Who can Revoke a Plugin?

#### Owner Managed Plugins

- An Owner Managed Plugin can be revoked by the owner which revokes the delegate and sets the pluginAuthority type to `Owner`.
- The delegated Authority of the plugin can revoke themselves which then sets the plugin authority type to `Owner`.
- On Transfer, delegated Authorities of owner managed plugins are automatically revoked back to the `Owner Authority` type.

#### Authority Managed Plugins

- The Update Authority of an Asset can revoke a delegate which thens sets the pluginAuthority type to `UpdateAuthority`.
- The delegated Authority of the plugin can revoke themselves which then sets the plugin authority type to `UpdateAuthority`.

A list of plugins and their types can be viewed on the [Plugins Overview](/smart-contracts/core/plugins) page.

{% dialect-switcher title="Revoking a Plugin Authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { revokePluginAuthority } from '@metaplex-foundation/mpl-core'

await revokePluginAuthority(umi, {
  asset: asset.publicKey,
  plugin: { type: 'Attributes' },
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

By updating your plugin's authority to a `None` value will effectively make your plugin's data immutable.

{% callout type="warning" %}

**WARNING** - Doing so will leave your plugin data immutable. Proceed with caution!

{% /callout %}

{% dialect-switcher title="Making a Plugin Immutable" %}
{% dialect title="JavaScript" id="js" %}

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

## Common Errors

### `Authority mismatch`

You don't have permission to delegate or revoke this plugin. Only the current authority can delegate; only owner/authority can revoke.

### `Plugin not found`

The Asset/Collection doesn't have this plugin type attached.

### `Cannot revoke None authority`

A plugin with `None` authority is immutable. There's no authority to revoke.

## Notes

- Delegation transfers control but doesn't remove the original authority's ability to revoke
- Setting authority to `None` is permanent and irreversible
- Owner Managed plugins auto-revoke when the Asset transfers to a new owner
- Revocation returns authority to the default type (Owner or UpdateAuthority)

## Quick Reference

### Revocation Behavior by Plugin Type

| Plugin Type | Revokes To |
|-------------|------------|
| Owner Managed | `Owner` authority |
| Authority Managed | `UpdateAuthority` |

### Who Can Delegate/Revoke

| Action | Owner Managed | Authority Managed |
|--------|---------------|-------------------|
| Delegate | Owner | Update Authority |
| Revoke | Owner or Delegate | Update Authority or Delegate |

## FAQ

### What's the difference between revoking and removing a plugin?

Revoking only changes who controls the plugin—the plugin and its data remain. Removing deletes the plugin entirely.

### Can I delegate to multiple addresses?

No. Each plugin has only one authority at a time. Delegating to a new address replaces the previous authority.

### What happens to delegated plugins when I transfer an Asset?

Owner Managed plugins automatically revoke back to `Owner` authority. Authority Managed plugins remain unchanged.

### Can I undo setting authority to None?

No. Setting authority to `None` makes the plugin permanently immutable. This cannot be reversed.

### Can a delegate revoke themselves?

Yes. A delegated authority can revoke their own access, which returns control to the default authority type.

## Related Operations

- [Adding Plugins](/smart-contracts/core/plugins/adding-plugins) - Add plugins to Assets/Collections
- [Removing Plugins](/smart-contracts/core/plugins/removing-plugins) - Delete plugins entirely
- [Updating Plugins](/smart-contracts/core/plugins/update-plugins) - Modify plugin data
- [Plugins Overview](/smart-contracts/core/plugins) - Full list of available plugins

## Glossary

| Term | Definition |
|------|------------|
| **Delegate** | Address given temporary control of a plugin |
| **Revoke** | Remove delegated authority, returning to default |
| **None Authority** | Special authority type making plugin immutable |
| **Auto-revoke** | Automatic revocation of Owner Managed plugins on transfer |
| **Plugin Authority** | Current address with control over a plugin |

---

*Maintained by Metaplex Foundation · Last verified January 2026 · Applies to @metaplex-foundation/mpl-core*
