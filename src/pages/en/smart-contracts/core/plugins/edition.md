---
title: Edition Plugin
metaTitle: Edition Plugin | Metaplex Core
description: Add edition numbers to Core NFT Assets for prints and limited runs. Track edition numbers like 1/100 for collectible series.
updated: '01-31-2026'
---
The **Edition Plugin** stores an edition number on individual Assets. Use it to create numbered prints like "1 of 100" for collectible series and limited editions. {% .lead %}
{% callout title="What You'll Learn" %}
- Add edition numbers to Assets
- Create mutable and immutable editions
- Update edition numbers
- Understand the Edition workflow
{% /callout %}
## Summary
The **Edition** plugin is an Authority Managed plugin that stores a unique edition number on an Asset. Best used with the [Master Edition plugin](/smart-contracts/core/plugins/master-edition) on Collections to group numbered editions together.
- Authority Managed (update authority controls)
- Must be added at Asset creation
- Number can be updated if authority is mutable
- Use with Candy Machine Edition Guard for automatic numbering
## Out of Scope
Supply enforcement (informational only), automatic numbering (use Candy Machine), and Collection-level editions (use Master Edition plugin for Collections).
## Quick Start
**Jump to:** [Create Mutable Edition](#create-with-a-mutable-plugin) · [Create Immutable Edition](#create-with-a-immutable-plugin) · [Update Edition](#update-the-editions-plugin)
1. Add Edition plugin during Asset creation with a unique number
2. Optionally set authority to `None` for immutability
3. Update the number later if mutable
{% callout type="note" title="Intended Usage" %}
We recommend to
- Group the Editions using the Master Edition Plugin
- use Candy Machine with the Edition Guard to handled numbering automatically.
{% /callout %}
## Works With
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |
## Arguments
| Arg    | Value  |
| ------ | ------ |
| number | number |
The number is a specific value that is assigned to the asset. Usually this number is unique, therefore the Creator should make sure that a number is not used twice.
## Creating an Asset with the editions plugin
The Editions Plugin must be added on creation of the asset. As long as it is mutable the number can be changed.
### Create with a mutable Plugin
{% dialect-switcher title="Creating an MPL Core Asset with the Edition Plugin" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'
const assetSigner = generateSigner(umi)
const result = create(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    {
      type: 'Edition',
      number: 1
    },
  ],
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use std::str::FromStr;
use mpl_core::{
    instructions::CreateV1Builder,
    types::{Creator, Plugin, PluginAuthority, PluginAuthorityPair, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
pub async fn create_asset_with_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let payer = Keypair::new();
    let asset = Keypair::new();
    let authority = Keypair::new();
    let creator = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let create_asset_with_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Asset".into())
        .uri("https://example.com/my-asset.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::Edition(Edition {
                number: 1,
            })
        }])
        .instruction();
    let signers = vec![&asset, &payer];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let create_asset_with_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
### Create with a Immutable Plugin
To create the Asset with immutable Edition Plugin the following code can be used:
{% dialect-switcher title="Adding the Editions Plugin to an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}
To have the editions Plugin immutable the authority has to be set to `nonePluginAuthority()` like this:
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'
const asset = generateSigner(umi)
const result = create(umi, {
  asset: asset,
  name: 'My Nft',
  uri: 'https://example.com/my-nft',
  plugins: [
    {
      type: 'Edition',
      number: 1,
      authority: { type: 'None' },
    },
  ],
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use std::str::FromStr;
use mpl_core::{
    instructions::CreateV1Builder,
    types::{Creator, Plugin, PluginAuthority, PluginAuthorityPair, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
pub async fn create_asset_with_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let payer = Keypair::new();
    let asset = Keypair::new();
    let authority = Keypair::new();
    let creator = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let create_asset_with_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::Edition(Edition {
                number: 1,
            }),
            authority: None,
        }])
        .instruction();
    let signers = vec![&asset, &payer];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let create_asset_with_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## Update the Editions Plugin
If the Editions Plugin is mutable it can be updated similar to other Plugins:
{% dialect-switcher title="Update The Edition Plugin on an Asset" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin } from '@metaplex-foundation/mpl-core'
const asset = publicKey('11111111111111111111111111111111')
  await updatePlugin(umi, {
    asset: assetAccount.publicKey,
    plugin: { type: 'Edition', number: 2 },
  }).sendAndConfirm(umi);
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
_coming soon_
{% /dialect %}
{% /dialect-switcher %}
## Common Errors
### `Cannot add Edition plugin after creation`
The Edition plugin must be added during Asset creation. It cannot be added to existing Assets.
### `Authority mismatch`
Only the update authority can update the edition number (if mutable).
### `Plugin is immutable`
The Edition plugin has authority set to `None`. The number cannot be changed.
## Notes
- Edition numbers are NOT enforced to be unique—creators must track this
- The plugin must be added during `create()`, not after
- Setting authority to `None` makes the edition number permanent
- Use with Master Edition plugin on Collections for proper grouping
## Quick Reference
### Authority Options
| Authority | Can Update | Use Case |
|-----------|------------|----------|
| `UpdateAuthority` | ✅ | Mutable edition numbers |
| `None` | ❌ | Permanent, immutable editions |
### Recommended Setup
| Component | Location | Purpose |
|-----------|----------|---------|
| Master Edition | Collection | Groups editions, stores max supply |
| Edition | Asset | Stores individual edition number |
| Candy Machine | Minting | Automatic sequential numbering |
## FAQ
### Is the edition number enforced to be unique?
No. The edition number is informational only. Creators are responsible for ensuring unique numbers. Use Candy Machine with the Edition Guard for automatic sequential numbering.
### Can I add the Edition plugin to an existing Asset?
No. The Edition plugin must be added during Asset creation. Plan ahead if you need edition numbers.
### How do I create a "1 of 100" style edition?
Add the Edition plugin to Assets (with numbers 1-100) and add the Master Edition plugin to the Collection with `maxSupply: 100`. The Master Edition groups the editions and indicates total supply.
### Can I change the edition number after creation?
Yes, if the plugin authority is not set to `None`. The update authority can modify the number using `updatePlugin`.
### What's the difference between Edition and Master Edition?
Edition stores the individual number (e.g., #5) on an Asset. Master Edition stores collection-level data (max supply, edition name/URI) on a Collection and groups the editions together.
## Glossary
| Term | Definition |
|------|------------|
| **Edition Number** | Unique identifier for a specific print (e.g., 1, 2, 3) |
| **Master Edition** | Collection-level plugin that groups editions |
| **Edition Guard** | Candy Machine guard for automatic numbering |
| **Authority Managed** | Plugin controlled by update authority |
| **Immutable Edition** | Edition with authority set to `None` |
