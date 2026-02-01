---
title: Removing Plugins
metaTitle: Removing Plugins | Metaplex Core
description: Learn how to remove plugins from Core NFT Assets and Collections. Remove functionality and recover rent from plugin accounts.
updated: '01-31-2026'
keywords:
  - remove plugin
  - removePlugin
  - delete plugin
  - recover rent
about:
  - Removing plugins
  - Rent recovery
  - Plugin management
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Can I recover the data after removing a plugin?
    a: No. Removing a plugin permanently deletes all its data. Make sure to back up any important data before removal.
  - q: What happens to the rent when I remove a plugin?
    a: The rent that was used to store the plugin data is recovered and returned to the payer.
  - q: Can I remove a plugin someone else delegated to me?
    a: Yes, if you're the delegated authority for that plugin, you can remove it.
  - q: Why can't I remove a Permanent plugin?
    a: Permanent plugins are designed to be immutable and cannot be removed after creation. This is by design for use cases that require guaranteed permanence.
  - q: Can I remove a plugin from a Collection and its Assets at once?
    a: No. Collection plugins and Asset plugins are managed separately. Removing a Collection plugin only affects the Collection, not its Assets.
---
This guide shows how to **remove plugins** from Core Assets and Collections. Removing a plugin deletes its data and functionality. {% .lead %}
{% callout title="What You'll Learn" %}
- Remove plugins from Assets
- Remove plugins from Collections
- Understand authority requirements for removal
- Recover rent from removed plugins
{% /callout %}
## Summary
Remove plugins using `removePlugin()` for Assets or `removeCollectionPlugin()` for Collections. Only the plugin authority can remove a plugin.
- Specify the plugin type to remove
- Plugin data is deleted
- Rent is recovered
- Permanent plugins cannot be removed
## Out of Scope
Permanent plugin removal (not possible), plugin updates (see [Updating Plugins](/smart-contracts/core/plugins/update-plugins)), and authority changes (see [Delegating Plugins](/smart-contracts/core/plugins/delegating-and-revoking-plugins)).
## Quick Start
**Jump to:** [Remove from Asset](#removing-a-plugin-from-a-mpl-core-asset) · [Remove from Collection](#removing-a-plugin-from-a-collection)
1. Identify the plugin type to remove
2. Call `removePlugin()` with the Asset and plugin type
3. Plugin is removed immediately
Plugins can also be removed from MPL Core Assets and MPL Core Collections.
## Removing a Plugin from a MPL Core Asset
{% dialect-switcher title="Removing a Plugin from a MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { removePlugin } from '@metaplex-foundation/mpl-core'
const asset = publicKey('11111111111111111111111111111111')
await removePlugin(umi, {
  asset: asset.publicKey,
  plugin: { type: 'Attributes' },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{instructions::RemovePluginV1Builder, types::PluginType};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn remove_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let remove_plugin_ix = RemovePluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let remove_plugin_tx = Transaction::new_signed_with_payer(
        &[remove_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&remove_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## Removing a Plugin from a Collection
{% dialect-switcher title="Removing a Plugin from a MPL Core Collection" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  removeCollectionPluginV1,
  PluginType,
} from '@metaplex-foundation/mpl-core'
const collectionAddress = publicKey('11111111111111111111111111111111')
await removeCollectionPlugin(umi, {
  collection: collectionAddress,
  pluginType: { type: 'Royalties' },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{instructions::RemoveCollectionPluginV1Builder, types::PluginType};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn remove_collection_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let remove_collection_plugin_ix = RemoveCollectionPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let remove_collection_plugin_tx = Transaction::new_signed_with_payer(
        &[remove_collection_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&remove_collection_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## Common Errors
### `Authority mismatch`
You don't have permission to remove this plugin. Check who has authority over the plugin.
### `Plugin not found`
The Asset/Collection doesn't have this plugin type attached.
### `Cannot remove permanent plugin`
Permanent plugins cannot be removed after creation. They are permanently attached.
## Notes
- Removing a plugin deletes all its data
- Rent from the removed plugin is recovered
- Only the plugin authority can remove a plugin
- Permanent plugins can never be removed
## Quick Reference
### Removal Authority Requirements
| Plugin Type | Who Can Remove |
|-------------|----------------|
| Owner Managed | Owner or delegate |
| Authority Managed | Update authority or delegate |
| Permanent | Cannot be removed |
## FAQ
### Can I recover the data after removing a plugin?
No. Removing a plugin permanently deletes all its data. Make sure to back up any important data before removal.
### What happens to the rent when I remove a plugin?
The rent that was used to store the plugin data is recovered and returned to the payer.
### Can I remove a plugin someone else delegated to me?
Yes, if you're the delegated authority for that plugin, you can remove it.
### Why can't I remove a Permanent plugin?
Permanent plugins are designed to be immutable and cannot be removed after creation. This is by design for use cases that require guaranteed permanence.
### Can I remove a plugin from a Collection and its Assets at once?
No. Collection plugins and Asset plugins are managed separately. Removing a Collection plugin only affects the Collection, not its Assets.
## Related Operations
- [Adding Plugins](/smart-contracts/core/plugins/adding-plugins) - Add plugins to Assets/Collections
- [Delegating Plugins](/smart-contracts/core/plugins/delegating-and-revoking-plugins) - Change plugin authorities
- [Updating Plugins](/smart-contracts/core/plugins/update-plugins) - Modify plugin data
- [Plugins Overview](/smart-contracts/core/plugins) - Full list of available plugins
## Glossary
| Term | Definition |
|------|------------|
| **Plugin Authority** | Address with permission to manage the plugin |
| **Permanent Plugin** | Plugin that cannot be removed after creation |
| **Rent** | SOL deposited to store account data on Solana |
| **Owner Managed** | Plugin where owner controls removal |
| **Authority Managed** | Plugin where update authority controls removal |
