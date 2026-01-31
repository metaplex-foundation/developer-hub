---
title: Attribute Plugin
metaTitle: Attribute Plugin | Metaplex Core
description: Store on-chain key-value data on Core NFT Assets. Use the Attributes plugin for game stats, traits, and any data that needs to be readable by on-chain programs.
updated: '01-31-2026'
---
The **Attributes Plugin** stores key-value pairs directly on-chain within Core Assets or Collections. Perfect for game stats, traits, and any data that on-chain programs need to read. {% .lead %}
{% callout title="What You'll Learn" %}
- Add on-chain attributes to Assets and Collections
- Store and update key-value pairs
- Read attributes from on-chain programs
- Use cases: game stats, traits, access levels
{% /callout %}
## Summary
The **Attributes Plugin** is an Authority Managed plugin that stores key-value string pairs on-chain. Unlike off-chain metadata, these attributes are readable by Solana programs and indexed by DAS.
- Store any string key-value pairs on-chain
- Readable by on-chain programs via CPI
- Automatically indexed by DAS for fast queries
- Mutable by the update authority
## Out of Scope
Off-chain metadata attributes (stored in JSON at URI), complex data types (only strings supported), and immutable attributes (all attributes are mutable).
## Quick Start
**Jump to:** [Add to Asset](#adding-the-attributes-plugin-to-an-asset) · [Update Attributes](#updating-the-attributes-plugin-on-an-asset)
1. Add the Attributes plugin: `addPlugin(umi, { asset, plugin: { type: 'Attributes', attributeList: [...] } })`
2. Each attribute is a `{ key: string, value: string }` pair
3. Update anytime with `updatePlugin()`
4. Query via DAS or fetch on-chain
{% callout type="note" title="On-Chain vs Off-Chain Attributes" %}
| Feature | On-Chain (this plugin) | Off-Chain (JSON metadata) |
|---------|------------------------|---------------------------|
| Storage location | Solana account | Arweave/IPFS |
| Readable by programs | ✅ Yes (CPI) | ❌ No |
| Indexed by DAS | ✅ Yes | ✅ Yes |
| Mutable | ✅ Yes | Depends on storage |
| Cost | Rent (recoverable) | Upload cost (one-time) |
| Best for | Dynamic data, game stats | Static traits, images |
**Use on-chain attributes** when programs need to read the data or it changes frequently.
**Use off-chain metadata** for static traits and image references.
{% /callout %}
## Common Use Cases
- **Game character stats**: Health, XP, level, class - data that changes during gameplay
- **Access control**: Tier, role, permissions - data programs check for authorization
- **Dynamic traits**: Evolving NFTs where traits change based on actions
- **Staking state**: Track staking status, rewards earned, time staked
- **Achievement tracking**: Badges, milestones, completion status
- **Rental/lending**: Track rental periods, borrower info, return dates
## Works With
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |
## Arguments
| Arg           | Value                               |
| ------------- | ----------------------------------- |
| attributeList | Array<{key: string, value: string}> |
### AttributeList
The attribute list consists of an Array[] then an object of key-value pairs `{key: "value"}` string value pairs.
{% dialect-switcher title="AttributeList" %}
{% dialect title="JavaScript" id="js" %}
```ts
const attributeList = [
  { key: 'key0', value: 'value0' },
  { key: 'key1', value: 'value1' },
]
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::types::{Attributes, Attribute}
let attributes = Attributes {
    attribute_list: vec![
        Attribute {
            key: "color".to_string(),
            value: "blue".to_string(),
        },
        Attribute {
            key: "access_type".to_string(),
            value: "prestige".to_string(),
        },
    ],
}
```
{% /dialect %}
{% /dialect-switcher %}
## Adding the Attributes Plugin to an Asset
{% dialect-switcher title="Adding a Attribute Plugin to an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin } from '@metaplex-foundation/mpl-core'
const asset = publicKey('11111111111111111111111111111111')
await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Attributes',
    attributeList: [
      { key: 'key0', value: 'value0' },
      { key: 'key1', value: 'value1' },
    ],
  },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{Attribute, Attributes, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn add_attributes_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let add_attribute_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::Attributes(Attributes {
            attribute_list: vec![
                Attribute {
                    key: "color".to_string(),
                    value: "blue".to_string(),
                },
                Attribute {
                    key: "access_type".to_string(),
                    value: "prestige".to_string(),
                },
            ],
        }))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let add_attribute_plugin_tx = Transaction::new_signed_with_payer(
        &[add_attribute_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&add_attribute_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## Updating the Attributes Plugin on an Asset
{% dialect-switcher title="Updating the Attributes Plugin on an Asset" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin } from '@metaplex-foundation/mpl-core'
const assetAddress = publicKey('11111111111111111111111111111111')
await updatePlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'Attributes',
    attributeList: [
      { key: 'key0', value: 'value0' },
      { key: 'key1', value: 'value1' },
    ],
  },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```ts
use mpl_core::{
    instructions::UpdatePluginV1Builder,
    types::{Attribute, Attributes, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn update_attributes_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let update_attributes_plugin_ix = UpdatePluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::Attributes(Attributes {
            attribute_list: vec![
                Attribute {
                    key: "color".to_string(),
                    value: "new value".to_string(),
                },
                Attribute {
                    key: "access_type".to_string(),
                    value: "new value".to_string(),
                },
                Attribute {
                    key: "additional_attribute".to_string(),
                    value: "additional_value".to_string(),
                },
            ],
        }))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let update_attributes_plugin_tx = Transaction::new_signed_with_payer(
        &[update_attributes_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&update_attributes_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## Common Errors
### `Authority mismatch`
Only the plugin authority (usually update authority) can add or update attributes. Verify you're signing with the correct keypair.
### `String too long`
Attribute keys and values are limited in size. Keep them concise.
## Notes
- Authority Managed: update authority can add/update without owner signature
- All values are strings - convert numbers/booleans as needed
- Updating replaces the entire attribute list (no partial updates)
- Attributes increase account size and rent cost
- DAS indexes attributes for fast queries
## Quick Reference
### Minimum Code
```ts {% title="minimal-attributes.ts" %}
import { addPlugin } from '@metaplex-foundation/mpl-core'
await addPlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'Attributes',
    attributeList: [
      { key: 'level', value: '5' },
      { key: 'class', value: 'warrior' },
    ],
  },
}).sendAndConfirm(umi)
```
### Common Attribute Patterns
| Use Case | Example Keys |
|----------|--------------|
| Game character | `level`, `health`, `xp`, `class` |
| Access control | `tier`, `access_level`, `role` |
| Traits | `background`, `eyes`, `rarity` |
| State | `staked`, `listed`, `locked` |
## FAQ
### What's the difference between on-chain attributes and off-chain metadata attributes?
On-chain attributes (this plugin) are stored on Solana and readable by programs. Off-chain attributes (in JSON at URI) are stored on Arweave/IPFS and only readable by clients.
### Can on-chain programs read these attributes?
Yes. Use CPI to fetch the Asset account and deserialize the Attributes plugin data.
### Are attributes indexed by DAS?
Yes. DAS automatically indexes attribute key-value pairs for fast queries.
### Can I store numbers or booleans?
Values are strings only. Convert as needed: `{ key: 'level', value: '5' }`, `{ key: 'active', value: 'true' }`.
### How do I update a single attribute?
You can't update individual attributes. Fetch the current list, modify it, and update with the full new list.
### What's the size limit for attributes?
There's no hard limit, but larger attribute lists increase rent cost. Keep data concise.
### Can the owner update attributes?
No. The Attributes plugin is Authority Managed, so only the update authority can modify it (not the owner).
## Related Plugins
- [Update Delegate](/smart-contracts/core/plugins/update-delegate) - Grant others permission to update attributes
- [ImmutableMetadata](/smart-contracts/core/plugins/immutableMetadata) - Lock name/URI (attributes remain mutable)
- [AddBlocker](/smart-contracts/core/plugins/addBlocker) - Prevent adding new plugins
## Glossary
| Term | Definition |
|------|------------|
| **Attributes Plugin** | Authority Managed plugin storing on-chain key-value pairs |
| **attributeList** | Array of `{ key, value }` objects |
| **Authority Managed** | Plugin type controlled by update authority |
| **On-chain Data** | Data stored directly in Solana account (readable by programs) |
| **DAS** | Digital Asset Standard API that indexes attributes |
