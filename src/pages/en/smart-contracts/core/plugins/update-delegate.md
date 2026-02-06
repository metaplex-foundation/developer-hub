---
title: Update Delegate Plugin
metaTitle: Update Delegate Plugin | Metaplex Core
description: Delegate update authority to third parties for Core NFT Assets and Collections. Allow others to modify metadata without transferring ownership.
updated: '01-31-2026'
keywords:
  - update delegate
  - delegate update authority
  - metadata permissions
  - third-party updates
about:
  - Update delegation
  - Metadata permissions
  - Authority management
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: What can additional delegates do?
    a: Almost everything the update authority can do - update metadata, add/remove plugins, etc. They cannot change the root update authority, modify the additional delegates list, or change the Update Delegate plugin authority.
  - q: Can additional delegates add more delegates?
    a: No. Only the root update authority (or plugin authority) can add or remove additional delegates.
  - q: How do I remove myself as an additional delegate?
    a: Additional delegates can remove themselves from the list by updating the plugin without their address in the additionalDelegates array.
  - q: Is there a limit to additional delegates?
    a: There's no hard limit, but more delegates increase account size and rent. Keep the list reasonable.
  - q: Does Update Delegate work on Collections?
    a: Yes. Adding Update Delegate to a Collection allows delegates to update collection metadata and collection-level plugins.
---
The **Update Delegate Plugin** allows you to grant update permissions to additional addresses. Useful when third parties need to modify Asset metadata without being the primary update authority. {% .lead %}
{% callout title="What You'll Learn" %}

- Add the Update Delegate plugin to Assets and Collections
- Grant update permissions to additional addresses
- Understand what additional delegates can and cannot do
- Update and manage the delegates list
{% /callout %}

## Summary

The **Update Delegate** is an Authority Managed plugin that allows the update authority to grant update permissions to other addresses. Additional delegates can modify most Asset data but cannot change core authority settings.

- Grant update permissions to third parties
- Add multiple additional delegates
- Works with both Assets and Collections
- Delegates cannot modify the root update authority

## Out of Scope

Permanent update delegation, owner-level permissions (this is authority managed), and Token Metadata update authority (different system).

## Quick Start

**Jump to:** [Add to Asset](#adding-the-update-delegate-plugin-to-an-asset) · [Update Delegates](#updating-the-update-delegate-plugin) · [Collection](#updating-update-delegate-plugin-on-collection)

1. Add the Update Delegate plugin with the delegate address
2. Optionally add additional delegates
3. Delegates can now update Asset metadata
{% callout type="note" title="When to Use Update Delegate" %}
| Scenario | Solution |
|----------|----------|
| Third-party needs to update metadata | ✅ Update Delegate |
| Game program needs to modify stats | ✅ Update Delegate (delegate to program) |
| Multiple team members need update access | ✅ Additional Delegates |
| Permanent irrevocable update access | ❌ Not supported (use multisig authority) |
| Owner should control updates | ❌ Use default authority |
**Use Update Delegate** when you need to grant update permissions to programs or third parties without transferring the root authority.
{% /callout %}

## Common Use Cases

- **Third-party services**: Allow platforms to update metadata on your behalf
- **Game programs**: Grant your game program authority to modify Asset attributes
- **Team collaboration**: Multiple team members can update without sharing keys
- **Marketplaces**: Allow marketplaces to update listing-related metadata
- **Dynamic content**: Services that automatically update Asset data

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## Arguments

|                     |             |
| ------------------- | ----------- |
| additionalDelegates | publickey[] |

### additionalDelegates

Additional delegates allow you to add more than one delegate to the updateDelegate plugin.
Additional delegates can do everything that the update authority can do except:

- add or change the additional delegates array (apart from remove themselves).
- change the plugin authority of the updateAuthority plugin.
- change the root update authority of the collection.

## Adding the Update Delegate Plugin to an Asset

{% dialect-switcher title="Adding a Update Delegate Plugin to an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin } from '@metaplex-foundation/mpl-core'
const assetAddress = publicKey('11111111111111111111111111111111')
const delegate = publicKey('22222222222222222222222222222222')
await addPlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'UpdateDelegate',
    authority: { type: 'Address', address: delegate },
    additionalDelegates: [],
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```ts
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{Plugin, UpdateDelegate},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn add_update_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let add_update_delegate_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::UpdateDelegate(UpdateDelegate {}))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let add_update_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[add_update_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&add_update_delegate_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## Updating the Update Delegate Plugin

The Update Delegate Plugin can be updated to modify the list of additional delegates or change the plugin authority.
{% dialect-switcher title="Updating Update Delegate Plugin on Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin } from '@metaplex-foundation/mpl-core'
const assetAddress = publicKey('11111111111111111111111111111111')
const newDelegate = publicKey('33333333333333333333333333333333')
const existingDelegate = publicKey('22222222222222222222222222222222')
await updatePlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'UpdateDelegate',
    additionalDelegates: [existingDelegate, newDelegate], // Add or remove delegates
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::UpdatePluginV1Builder,
    types::{Plugin, UpdateDelegate},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn update_update_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    
    let new_delegate = Pubkey::from_str("33333333333333333333333333333333").unwrap();
    let existing_delegate = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let update_update_delegate_plugin_ix = UpdatePluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::UpdateDelegate(UpdateDelegate {
            additional_delegates: vec![existing_delegate, new_delegate], // Add or remove delegates
        }))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let update_update_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[update_update_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&update_update_delegate_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## Updating Update Delegate Plugin on Collection

{% dialect-switcher title="Updating Update Delegate Plugin on Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updateCollectionPlugin } from '@metaplex-foundation/mpl-core'
const collectionAddress = publicKey('11111111111111111111111111111111')
const delegate1 = publicKey('22222222222222222222222222222222')
const delegate2 = publicKey('33333333333333333333333333333333')
await updateCollectionPlugin(umi, {
  collection: collectionAddress,
  plugin: {
    type: 'UpdateDelegate',
    additionalDelegates: [delegate1, delegate2], // Updated delegates list
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::UpdateCollectionPluginV1Builder,
    types::{Plugin, UpdateDelegate},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn update_collection_update_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    
    let delegate1 = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let delegate2 = Pubkey::from_str("33333333333333333333333333333333").unwrap();
    let update_collection_update_delegate_plugin_ix = UpdateCollectionPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .plugin(Plugin::UpdateDelegate(UpdateDelegate {
            additional_delegates: vec![delegate1, delegate2], // Updated delegates list
        }))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let update_collection_update_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[update_collection_update_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&update_collection_update_delegate_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## Common Errors

### `Authority mismatch`

Only the update authority (or existing plugin authority) can add/modify the Update Delegate plugin.

### `Cannot modify root authority`

Additional delegates cannot change the root update authority or modify the additional delegates list (except removing themselves).

## Notes

- Authority Managed: update authority can add without owner signature
- Additional delegates have almost full update permissions
- Delegates cannot change the root update authority
- Delegates cannot modify the additional delegates list (except remove themselves)
- Works on both Assets and Collections

## Quick Reference

### Additional Delegate Permissions

| Action | Allowed? |
|--------|----------|
| Update name/URI | ✅ |
| Add plugins | ✅ |
| Update plugins | ✅ |
| Remove plugins | ✅ |
| Change root update authority | ❌ |
| Modify additional delegates | ❌ (except self-removal) |
| Change plugin authority | ❌ |

## FAQ

### What can additional delegates do?

Almost everything the update authority can do: update metadata, add/remove plugins, etc. They cannot change the root update authority, modify the additional delegates list, or change the Update Delegate plugin authority.

### Can additional delegates add more delegates?

No. Only the root update authority (or plugin authority) can add or remove additional delegates.

### How do I remove myself as an additional delegate?

Additional delegates can remove themselves from the list by updating the plugin without their address in the `additionalDelegates` array.

### Is there a limit to additional delegates?

There's no hard limit, but more delegates increase account size and rent. Keep the list reasonable.

### Does Update Delegate work on Collections?

Yes. Adding Update Delegate to a Collection allows delegates to update collection metadata and collection-level plugins.

## Related Plugins

- [Attributes](/smart-contracts/core/plugins/attribute) - Store on-chain data that delegates can update
- [ImmutableMetadata](/smart-contracts/core/plugins/immutableMetadata) - Make metadata unchangeable (overrides delegates)
- [AddBlocker](/smart-contracts/core/plugins/addBlocker) - Prevent delegates from adding new plugins

## Glossary

| Term | Definition |
|------|------------|
| **Update Delegate** | Authority Managed plugin for granting update permissions |
| **Additional Delegates** | Extra addresses with update permissions |
| **Authority Managed** | Plugin type controlled by update authority |
| **Root Update Authority** | The primary update authority of the Asset/Collection |
