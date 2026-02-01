---
title: Removing External Plugins
metaTitle: Removing External Plugins | Metaplex Core
description: Learn how to remove Oracle and AppData plugins from Core Assets and Collections. Code examples for JavaScript and Rust.
updated: '01-31-2026'
keywords:
  - remove external plugin
  - remove Oracle
  - remove AppData
  - delete plugin
about:
  - External plugin removal
  - Cleanup procedures
  - Authority requirements
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Does removing an Oracle plugin delete the Oracle account?
    a: No. Only the plugin adapter on the Asset is removed. The external Oracle account remains and can be reused.
  - q: Can I recover AppData before removing?
    a: Yes. Read the AppData using fetchAsset() before removing the plugin if you need to preserve the data.
  - q: What happens to the rent?
    a: The rent from the plugin adapter is recovered and returned to the transaction payer.
---
This guide shows how to **remove External Plugins** from Core Assets and Collections. Remove Oracle or AppData plugins when they're no longer needed. {% .lead %}
{% callout title="What You'll Learn" %}
- Remove external plugins from Assets
- Remove external plugins from Collections
- Understand authority requirements
- Recover rent from removed plugins
{% /callout %}
## Summary
Remove external plugins using `removePlugin()` for Assets or `removeCollectionPlugin()` for Collections. Only the plugin authority can remove external plugins.
- Specify the plugin type and base address
- Plugin data is deleted
- Rent is recovered
- Requires plugin authority signature
## Out of Scope
Adding external plugins (see [Adding External Plugins](/smart-contracts/core/external-plugins/adding-external-plugins)), updating plugin data, and removing built-in plugins (see [Removing Plugins](/smart-contracts/core/plugins/removing-plugins)).
## Quick Start
**Jump to:** [Remove from Asset](#remove-from-asset) · [Remove from Collection](#remove-from-collection)
1. Identify the plugin type and base address to remove
2. Call `removePlugin()` with the plugin key
3. Plugin is removed immediately, rent recovered
## Remove from Asset
{% dialect-switcher title="Remove External Plugin from Asset" %}
{% dialect title="JavaScript" id="js" %}
To remove the External Plugin Adapter from an Asset you'll need to use the `removePlugin()` function.
```ts
import {publicKey } from '@metaplex-foundation/umi'
import { removePlugin, CheckResult } from '@metaplex-foundation/mpl-core'
const asset = publicKey('1111111111111111111111111111111')
const oracleAccount = publicKey('2222222222222222222222222222222')
await removePlugin(umi, {
  asset,
  plugin: {
    type: 'Oracle',
    baseAddress: oracleAccount,
  },
})
```
{% /dialect  %}
{% dialect title="Rust" id="rust" %}
To remove the External Plugin Adapter from an Asset you'll need to use the `RemoveExternalPluginAdapterV1Builder()` function.
```rust
use mpl_core::{instructions::RemoveExternalPluginAdapterV1Builder, types::ExternalPluginAdapterKey};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn remove_external_plugin_adapter_from_asset() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let oracle_account = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let remove_external_plugin_adapter_from_asset_ix = RemoveExternalPluginAdapterV1Builder::new()
        .asset(asset)
        .key(ExternalPluginAdapterKey::Oracle(oracle_account))
        .payer(authority.pubkey())
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let remove_external_plugin_adapter_from_asset_tx = Transaction::new_signed_with_payer(
        &[remove_external_plugin_adapter_from_asset_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&remove_external_plugin_adapter_from_asset_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect  %}
{% /dialect-switcher %}
## Remove from Collection
{% dialect-switcher title="Remove External Plugin from Collection" %}
{% dialect title="JavaScript" id="js" %}
To remove the External Plugin Adapter from a Collection you'll need to use the `removeCollectionPlugin()` function.
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { removeCollectionPlugin, CheckResult } from '@metaplex-foundation/mpl-core'
const collection = publicKey('1111111111111111111111111111111')
const oracleAccount = publicKey('2222222222222222222222222222222')
removeCollectionPlugin(umi, {
  collection,
  plugin: {
    type: 'Oracle',
    baseAddress: publicKey(oracleAccount),
  },
})
```
{% /dialect  %}
{% dialect title="Rust" id="rust" %}
To remove the External Plugin Adapter from a Collection you'll need to use the `RemoveCollectionExternalPluginAdapterV1Builder()` function.
```rust
use mpl_core::{instructions::RemoveCollectionExternalPluginAdapterV1Builder, types::ExternalPluginAdapterKey};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn remove_external_plugin_adapter_from_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let oracle_account = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let remove_external_plugin_adapter_from_collection_ix = RemoveCollectionExternalPluginAdapterV1Builder::new()
        .collection(collection)
        .key(ExternalPluginAdapterKey::Oracle(oracle_account))
        .payer(authority.pubkey())
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let remove_external_plugin_adapter_from_collection_tx = Transaction::new_signed_with_payer(
        &[remove_external_plugin_adapter_from_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&remove_external_plugin_adapter_from_collection_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect  %}
{% /dialect-switcher %}
## Common Errors
### `Authority mismatch`
Only the plugin authority can remove external plugins. Verify you're signing with the correct keypair.
### `Plugin not found`
No external plugin with the specified key exists on this Asset/Collection.
## Notes
- Removing a plugin deletes all its data
- Rent is recovered and returned to the payer
- Only the plugin authority can remove (usually update authority)
- The external Oracle/AppData account is NOT deleted—only the adapter
## FAQ
### Does removing an Oracle plugin delete the Oracle account?
No. Only the plugin adapter on the Asset is removed. The external Oracle account remains and can be reused.
### Can I recover AppData before removing?
Yes. Read the AppData using `fetchAsset()` before removing the plugin if you need to preserve the data.
### What happens to the rent?
The rent from the plugin adapter is recovered and returned to the transaction payer.
## Related Operations
- [Adding External Plugins](/smart-contracts/core/external-plugins/adding-external-plugins) - Add external plugins
- [External Plugins Overview](/smart-contracts/core/external-plugins/overview) - Understanding external plugins
- [Removing Plugins](/smart-contracts/core/plugins/removing-plugins) - Remove built-in plugins
