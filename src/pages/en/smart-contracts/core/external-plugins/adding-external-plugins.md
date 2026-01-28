---
title: Adding External Plugins
metaTitle: Adding External Plugins | Metaplex Core
description: Learn how to add Oracle and AppData plugins to Core Assets and Collections. Code examples for JavaScript and Rust.
---

This guide shows how to **add External Plugins** (Oracle, AppData) to Core Assets and Collections. Add at creation time or to existing Assets/Collections. {% .lead %}

{% callout title="What You'll Learn" %}

- Add external plugins during Asset/Collection creation
- Add external plugins to existing Assets/Collections
- Configure Oracle lifecycle checks
- Set up AppData with data authorities

{% /callout %}

## Summary

Add external plugins using `create()` with the `plugins` array, or `addPlugin()` for existing Assets. Collections use `createCollection()` and `addCollectionPlugin()`.

- Add at creation: include in `plugins` array
- Add to existing: use `addPlugin()` / `addCollectionPlugin()`
- Requires update authority signature
- Configure lifecycle checks for Oracle plugins

## Out of Scope

Removing external plugins (see [Removing External Plugins](/smart-contracts/core/external-plugins/removing-external-plugins)), updating plugin data, and built-in plugins (see [Adding Plugins](/smart-contracts/core/plugins/adding-plugins)).

## Quick Start

**Jump to:** [Create Asset with Plugin](#creating-a-core-asset-with-an-external-plugin) · [Add to Existing Asset](#adding-a-external-plugin-to-a-core-asset) · [Create Collection with Plugin](#creating-a-core-collection-with-an-external-plugin)

1. Prepare your Oracle account or AppData configuration
2. Add plugin at creation or via `addPlugin()`
3. Configure lifecycle checks (Oracle) or data authority (AppData)

## Assets

### Creating a Core Asset with an External Plugin

{% dialect-switcher title="Creating a Core Asset with an External Plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { create, CheckResult } from '@metaplex-foundation/mpl-core'

const assetSigner = publicKey('11111111111111111111111111111111')
const oracleAccount = publicKey('22222222222222222222222222222222')

await create(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    {
      type: 'Oracle',
      resultsOffset: {
        type: 'Anchor',
      },
      lifecycleChecks: {
        update: [CheckResult.CAN_REJECT],
      },
      baseAddress: oracleAccount,
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::CreateV2Builder,
    types::{
        ExternalCheckResult, ExternalPluginAdapterInitInfo, HookableLifecycleEvent, OracleInitInfo,
        ValidationResultsOffset,
    },
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn create_asset_with_oracle_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let onchain_oracle_account = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_oracle_plugin_ix = CreateV2Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .external_plugins_adapters(vec![ExternalPluginAdapterInitInfo::Oracle(OracleInitInfo {
            base_address: onchain_oracle_account,
            init_plugin_authority: None,
            lifecycle_checks: vec![(
                HookableLifecycleEvent::Transfer,
                ExternalCheckResult { flags: 4 },
            )],
            base_address_config: None,
            results_offset: Some(ValidationResultsOffset::Anchor),
        })])
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_burn_transfer_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_burn_transfer_delegate_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_burn_transfer_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

### Adding a External Plugin to a Core Asset

{% dialect-switcher title="Adding a Plugin with an assigned authority" %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::AddExternalPluginAdapterV1Builder,
    types::{
        ExternalCheckResult, ExternalPluginAdapterInitInfo, HookableLifecycleEvent,
        OracleInitInfo, ValidationResultsOffset,
    },
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_oracle_plugin_to_asset() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let oracle_plugin = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let add_oracle_plugin_to_asset_ix = AddExternalPluginAdapterV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .init_info(ExternalPluginAdapterInitInfo::Oracle(OracleInitInfo {
            base_address: oracle_plugin,
            results_offset: Some(ValidationResultsOffset::Anchor),
            lifecycle_checks: vec![(
                HookableLifecycleEvent::Transfer,
                ExternalCheckResult { flags: 4 },
            )],
            base_address_config: None,
            init_plugin_authority: None,
        }))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let add_oracle_plugin_to_asset_tx = Transaction::new_signed_with_payer(
        &[add_oracle_plugin_to_asset_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&add_oracle_plugin_to_asset_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}

{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin, CheckResult } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')
const oracleAccount = publicKey('22222222222222222222222222222222')

addPlugin(umi, {
  asset,
  plugin: {
    type: 'Oracle',
    resultsOffset: {
      type: 'Anchor',
    },
    lifecycleChecks: {
      create: [CheckResult.CAN_REJECT],
    },
    baseAddress: oracleAccount,
  },
})
```

{% /dialect %}
{% /dialect-switcher %}

## Collections

### Creating a Core Collection with an External Plugin

{% dialect-switcher title="Adding a External Plugin to a Core Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import { createCollection, CheckResult } from '@metaplex-foundation/mpl-core'

const collectionSigner = generateSigner(umi)
const oracleAccount = publicKey('22222222222222222222222222222222')

await createCollection(umi, {
  collection: collectionSigner,
  name: 'My Collection',
  uri: 'https://example.com/my-collection.json',
  plugins: [
    {
      type: 'Oracle',
      resultsOffset: {
        type: 'Anchor',
      },
      lifecycleChecks: {
        update: [CheckResult.CAN_REJECT],
      },
      baseAddress: oracleAccount,
    },
    ,
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::CreateCollectionV2Builder,
    types::{
        ExternalCheckResult, ExternalPluginAdapterInitInfo, HookableLifecycleEvent, OracleInitInfo,
        ValidationResultsOffset,
    },
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn create_collection_with_oracle_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let collection = Keypair::new();

    let onchain_oracle_plugin = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_collection_with_oracle_plugin_ix = CreateCollectionV2Builder::new()
        .collection(collection.pubkey())
        .payer(payer.pubkey())
        .name("My Collection".into())
        .uri("https://example.com/my-nft.json".into())
        .external_plugins_adapters(vec![ExternalPluginAdapterInitInfo::Oracle(OracleInitInfo {
            base_address: onchain_oracle_plugin,
            init_plugin_authority: None,
            lifecycle_checks: vec![(
                HookableLifecycleEvent::Transfer,
                ExternalCheckResult { flags: 4 },
            )],
            base_address_config: None,
            results_offset: Some(ValidationResultsOffset::Anchor),
        })])
        .instruction();

    let signers = vec![&collection, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_collection_with_oracle_plugin_tx = Transaction::new_signed_with_payer(
        &[create_collection_with_oracle_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_collection_with_oracle_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

### Adding a External Plugin to a Collection

{% dialect-switcher title="Burning an Assets" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addCollectionPlugin, CheckResult } from '@metaplex-foundation/mpl-core'

const collection = publicKey('11111111111111111111111111111111')
const oracleAccount = publicKey('22222222222222222222222222222222')

await addCollectionPlugin(umi, {
  collection: collection,
  plugin: {
    type: 'Oracle',
    resultsOffset: {
      type: 'Anchor',
    },
    lifecycleChecks: {
      update: [CheckResult.CAN_REJECT],
    },
    baseAddress: oracleAccount,
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::AddCollectionExternalPluginV1Builder,
    types::{
        ExternalCheckResult, ExternalPluginAdapterInitInfo, HookableLifecycleEvent,
        OracleInitInfo, ValidationResultsOffset,
    },
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_oracle_plugin_to_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let oracle_plugin = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let add_oracle_plugin_to_collection_ix = AddCollectionExternalPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .init_info(ExternalPluginAdapterInitInfo::Oracle(OracleInitInfo {
            base_address: oracle_plugin,
            results_offset: Some(ValidationResultsOffset::Anchor),
            lifecycle_checks: vec![(
                HookableLifecycleEvent::Transfer,
                ExternalCheckResult { flags: 4 },
            )],
            base_address_config: None,
            init_plugin_authority: None,
        }))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let add_oracle_plugin_to_collection_tx = Transaction::new_signed_with_payer(
        &[add_oracle_plugin_to_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&add_oracle_plugin_to_collection_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## Common Errors

### `Authority mismatch`

Only the update authority can add external plugins. Verify you're signing with the correct keypair.

### `Plugin already exists`

An external plugin with the same key already exists. Remove it first or update it instead.

### `Invalid Oracle account`

The Oracle base address is invalid or the account doesn't exist.

## Notes

- External plugins are Authority Managed (update authority controls)
- Oracle plugins require an existing Oracle account
- AppData plugins need a Data Authority for write permissions
- Collection plugins don't automatically apply to existing Assets

## FAQ

### Can I add multiple external plugins to one Asset?

Yes. You can add multiple Oracle and/or AppData plugins to a single Asset.

### Do I need to create the Oracle account first?

Yes. The Oracle account must exist before adding an Oracle plugin adapter.

### What's the difference between adding at creation vs adding later?

No functional difference. Adding at creation is more efficient (one transaction). Adding later requires a separate transaction.

## Related Operations

- [Removing External Plugins](/smart-contracts/core/external-plugins/removing-external-plugins) - Remove external plugins
- [External Plugins Overview](/smart-contracts/core/external-plugins/overview) - Understanding external plugins
- [Oracle Plugin](/smart-contracts/core/external-plugins/oracle) - Oracle configuration details
- [AppData Plugin](/smart-contracts/core/external-plugins/app-data) - AppData configuration details

---

*Maintained by Metaplex Foundation · Last verified January 2026 · Applies to @metaplex-foundation/mpl-core*
