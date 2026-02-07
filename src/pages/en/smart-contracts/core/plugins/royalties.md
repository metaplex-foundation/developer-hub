---
title: Royalties Plugin
metaTitle: Royalties Plugin | Metaplex Core
description: The Royalties plugin enforces creator royalties on Core Assets and Collections. Set basis points, creator splits, and allowlist/denylist rules for marketplace compliance.
updated: '01-31-2026'
keywords:
  - NFT royalties
  - creator royalties
  - royalties plugin
  - basis points
  - marketplace royalties
about:
  - Royalty enforcement
  - Creator payments
  - Marketplace rules
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
faqs:
  - q: Are Core royalties enforced?
    a: Yes, when using an allowlist ruleset. Only programs on the allowlist can transfer the asset, ensuring royalties are paid.
  - q: What's the difference between Core royalties and Token Metadata royalties?
    a: Core royalties require the Royalties plugin at either asset or collection level, with optional enforcement via rulesets. Standard Token Metadata NFT royalties are advisory and rely on marketplace cooperation. pNFTs (programmable NFTs) also support ruleset-based enforcement similar to Core.
  - q: Can I have different royalties per asset in a collection?
    a: Yes. Add the Royalties plugin to individual assets to override the collection-level setting.
  - q: How do marketplaces read royalties?
    a: Marketplaces query the asset's plugins via DAS or on-chain data. The Royalties plugin data includes basis points, creators, and ruleset.
  - q: What happens if I don't set a ruleset?
    a: Use ruleSet('None'). Any program can transfer the asset and royalties are advisory only.
  - q: Can I change royalties after minting?
    a: Yes. Use updatePlugin for assets or updateCollectionPlugin for collections if you have the authority.
---
The **Royalties Plugin** enforces creator royalties on secondary sales of Core Assets. It specifies the royalty percentage, creator split, and which programs (marketplaces) are allowed or denied from transferring the asset. {% .lead %}
{% callout title="What You'll Learn" %}
How to:
- Add royalties to Assets and Collections
- Configure basis points and creator splits
- Set up allowlists and denylists for marketplace control
- Update royalties after creation
{% /callout %}
## Summary
The **Royalties Plugin** is an authority-managed plugin that enforces royalties on Core Assets. Set a percentage (basis points), distribute to multiple creators, and optionally restrict which programs can transfer assets.
- Set royalties as basis points (500 = 5%)
- Split royalties between up to 5 creators
- Use allowlists/denylists to control marketplace access
- Apply at Asset level (individual) or Collection level (all assets)
## Out of Scope
Token Metadata royalties (different system), royalty collection/distribution (handled by marketplaces), and legal enforcement of royalties.
## Quick Start
**Jump to:** [Add to Asset](#adding-the-royalties-plugin-to-an-asset-code-example) · [Add to Collection](#adding-the-royalties-plugin-to-a-collection-code-example) · [RuleSets](#rulesets) · [Update](#updating-the-royalties-plugin-on-an-asset)
1. Import `addPlugin` from `@metaplex-foundation/mpl-core`
2. Call with `type: 'Royalties'`, `basisPoints`, `creators`, and `ruleSet`
3. Marketplaces read the plugin and enforce the royalty on sales
## Works With
| Account Type | Supported |
|--------------|-----------|
| MPL Core Asset | Yes |
| MPL Core Collection | Yes |
When applied to both an Asset and its Collection, the **Asset-level plugin takes precedence**.
## Arguments
| Argument | Type | Description |
|----------|------|-------------|
| basisPoints | number | Royalty percentage (500 = 5%, 1000 = 10%) |
| creators | Creator[] | Array of creator addresses and their percentage share |
| ruleSet | RuleSet | Program allowlist, denylist, or none |
## Basis Points
The royalty percentage in hundredths of a percent.
| Basis Points | Percentage |
|--------------|------------|
| 100 | 1% |
| 250 | 2.5% |
| 500 | 5% |
| 1000 | 10% |
Example: If `basisPoints` is 500 and an Asset sells for 1 SOL, creators receive 0.05 SOL total.
## Creators
The creators array defines who receives royalties and how they're split. Up to 5 creators are supported. Percentages must add up to 100.
{% dialect-switcher title="Creators Array" %}
{% dialect title="JavaScript" id="js" %}
```ts {% title="creators-array.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
const creators = [
  { address: publicKey('11111111111111111111111111111111'), percentage: 80 },
  { address: publicKey('22222222222222222222222222222222'), percentage: 20 },
]
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust {% title="creators_array.rs" %}
use mpl_core::types::Creator;
use solana_sdk::pubkey::Pubkey;
use std::str::FromStr;
let creators = vec![
    Creator {
        address: Pubkey::from_str("11111111111111111111111111111111").unwrap(),
        percentage: 80,
    },
    Creator {
        address: Pubkey::from_str("22222222222222222222222222222222").unwrap(),
        percentage: 20,
    },
];
```
{% /dialect %}
{% /dialect-switcher %}
## RuleSets
RuleSets control which programs can transfer Assets with royalties. Use them to enforce royalties by restricting transfers to compliant marketplaces.
### None (No Restrictions)
Any program can transfer the asset. Royalties are advisory only.
{% dialect-switcher title="RuleSet None" %}
{% dialect title="JavaScript" id="js" %}
```ts {% title="ruleset-none.ts" %}
import { ruleSet } from '@metaplex-foundation/mpl-core'
const rules = ruleSet('None')
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust {% title="ruleset_none.rs" %}
use mpl_core::types::RuleSet;
let rule_set = RuleSet::None;
```
{% /dialect %}
{% /dialect-switcher %}
### Allowlist (Recommended for Enforcement)
Only programs on the list can transfer. Use this to restrict to royalty-compliant marketplaces.
{% dialect-switcher title="RuleSet Allowlist" %}
{% dialect title="JavaScript" id="js" %}
```ts {% title="ruleset-allowlist.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { ruleSet } from '@metaplex-foundation/mpl-core'
const rules = ruleSet('ProgramAllowList', [
  [
    publicKey('M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K'), // Magic Eden
    publicKey('TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN'), // Tensor
  ],
])
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust {% title="ruleset_allowlist.rs" %}
use mpl_core::types::RuleSet;
use solana_sdk::pubkey::Pubkey;
use std::str::FromStr;
let rule_set = RuleSet::ProgramAllowList(vec![
    Pubkey::from_str("M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K").unwrap(),
    Pubkey::from_str("TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN").unwrap(),
]);
```
{% /dialect %}
{% /dialect-switcher %}
### Denylist
All programs can transfer except those on the list. Use to block known non-compliant marketplaces.
{% dialect-switcher title="RuleSet DenyList" %}
{% dialect title="JavaScript" id="js" %}
```ts {% title="ruleset-denylist.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { ruleSet } from '@metaplex-foundation/mpl-core'
const rules = ruleSet('ProgramDenyList', [
  [
    publicKey('BadMarketplace111111111111111111111111111'),
  ],
])
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust {% title="ruleset_denylist.rs" %}
use mpl_core::types::RuleSet;
use solana_sdk::pubkey::Pubkey;
use std::str::FromStr;
let rule_set = RuleSet::ProgramDenyList(vec![
    Pubkey::from_str("BadMarketplace111111111111111111111111111").unwrap(),
]);
```
{% /dialect %}
{% /dialect-switcher %}
## Adding the Royalties Plugin to an Asset (Code Example)
{% dialect-switcher title="Add Royalties Plugin to Asset" %}
{% dialect title="JavaScript" id="js" %}
```ts {% title="add-royalties-to-asset.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin, ruleSet } from '@metaplex-foundation/mpl-core'
const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('22222222222222222222222222222222')
await addPlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'Royalties',
    basisPoints: 500, // 5%
    creators: [
      { address: creator1, percentage: 80 },
      { address: creator2, percentage: 20 },
    ],
    ruleSet: ruleSet('None'),
  },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust {% title="add_royalties_to_asset.rs" %}
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{Creator, Plugin, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn add_royalties_to_asset() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("AssetAddress111111111111111111111111111").unwrap();
    let creator = Pubkey::from_str("CreatorAddress11111111111111111111111111").unwrap();
    let add_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::Royalties(Royalties {
            basis_points: 500,
            creators: vec![Creator {
                address: creator,
                percentage: 100,
            }],
            rule_set: RuleSet::None,
        }))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let tx = Transaction::new_signed_with_payer(
        &[add_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client.send_and_confirm_transaction(&tx).await.unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## Adding the Royalties Plugin to a Collection (Code Example)
Collection-level royalties apply to all Assets in the Collection unless overridden at the Asset level.
{% dialect-switcher title="Add Royalties Plugin to Collection" %}
{% dialect title="JavaScript" id="js" %}
```ts {% title="add-royalties-to-collection.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { addCollectionPlugin, ruleSet } from '@metaplex-foundation/mpl-core'
const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('22222222222222222222222222222222')
await addCollectionPlugin(umi, {
  collection: collectionAddress,
  plugin: {
    type: 'Royalties',
    basisPoints: 500, // 5%
    creators: [
      { address: creator1, percentage: 80 },
      { address: creator2, percentage: 20 },
    ],
    ruleSet: ruleSet('None'),
  },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust {% title="add_royalties_to_collection.rs" %}
use mpl_core::{
    instructions::AddCollectionPluginV1Builder,
    types::{Creator, Plugin, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn add_royalties_to_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let collection = Pubkey::from_str("CollectionAddress111111111111111111111").unwrap();
    let creator1 = Pubkey::from_str("Creator1Address111111111111111111111111").unwrap();
    let creator2 = Pubkey::from_str("Creator2Address111111111111111111111111").unwrap();
    let add_plugin_ix = AddCollectionPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .plugin(Plugin::Royalties(Royalties {
            basis_points: 500,
            creators: vec![
                Creator { address: creator1, percentage: 80 },
                Creator { address: creator2, percentage: 20 },
            ],
            rule_set: RuleSet::None,
        }))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let tx = Transaction::new_signed_with_payer(
        &[add_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client.send_and_confirm_transaction(&tx).await.unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## Updating the Royalties Plugin on an Asset
Modify royalty percentage, creators, or ruleset on an existing Asset.
{% dialect-switcher title="Update Royalties Plugin on Asset" %}
{% dialect title="JavaScript" id="js" %}
```ts {% title="update-royalties-asset.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, ruleSet } from '@metaplex-foundation/mpl-core'
await updatePlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'Royalties',
    basisPoints: 750, // Updated to 7.5%
    creators: [
      { address: creator1, percentage: 60 },
      { address: creator2, percentage: 40 },
    ],
    ruleSet: ruleSet('ProgramAllowList', [[marketplace1, marketplace2]]),
  },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust {% title="update_royalties_asset.rs" %}
use mpl_core::{
    instructions::UpdatePluginV1Builder,
    types::{Creator, Plugin, Royalties, RuleSet},
};
let update_ix = UpdatePluginV1Builder::new()
    .asset(asset)
    .payer(authority.pubkey())
    .plugin(Plugin::Royalties(Royalties {
        basis_points: 750,
        creators: vec![
            Creator { address: creator1, percentage: 60 },
            Creator { address: creator2, percentage: 40 },
        ],
        rule_set: RuleSet::None,
    }))
    .instruction();
```
{% /dialect %}
{% /dialect-switcher %}
## Updating the Royalties Plugin on a Collection
{% dialect-switcher title="Update Royalties Plugin on Collection" %}
{% dialect title="JavaScript" id="js" %}
```ts {% title="update-royalties-collection.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { updateCollectionPlugin, ruleSet } from '@metaplex-foundation/mpl-core'
await updateCollectionPlugin(umi, {
  collection: collectionAddress,
  plugin: {
    type: 'Royalties',
    basisPoints: 600, // Updated to 6%
    creators: [
      { address: creator1, percentage: 70 },
      { address: creator2, percentage: 30 },
    ],
    ruleSet: ruleSet('None'),
  },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% /dialect-switcher %}
## Common Errors
### `Creator percentages must sum to 100`
The creator percentage values don't add up to 100. Adjust the splits.
### `Authority mismatch`
Only the plugin authority can update royalties. Ensure you're signing with the correct keypair.
### `Program not in allowlist`
A transfer was blocked because the calling program isn't in the allowlist. Add the program or switch to a denylist/none ruleset.
## Notes
- Asset-level royalties override Collection-level royalties
- Creator percentages must sum to exactly 100
- Use allowlists for strict enforcement, denylists for flexibility
- Royalty collection/distribution is handled by marketplaces, not the Core program
## Quick Reference
### Minimum Code
```ts {% title="minimal-royalties.ts" %}
import { addPlugin, ruleSet } from '@metaplex-foundation/mpl-core'
await addPlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'Royalties',
    basisPoints: 500,
    creators: [{ address: creatorAddress, percentage: 100 }],
    ruleSet: ruleSet('None'),
  },
}).sendAndConfirm(umi)
```
### Basis Points Reference
| Desired % | Basis Points |
|-----------|--------------|
| 2.5% | 250 |
| 5% | 500 |
| 7.5% | 750 |
| 10% | 1000 |
## FAQ
### Are Core royalties enforced?
Yes, when using an allowlist ruleset. Only programs on the allowlist can transfer the asset, ensuring royalties are paid.
### What's the difference between Core royalties and Token Metadata royalties?
Core royalties require the Royalties plugin at either asset or collection level, with optional enforcement via rulesets. Standard Token Metadata NFT royalties are advisory and rely on marketplace cooperation. pNFTs (programmable NFTs) also support ruleset-based enforcement similar to Core.
### Can I have different royalties per asset in a collection?
Yes. Add the Royalties plugin to individual assets to override the collection-level setting.
### How do marketplaces read royalties?
Marketplaces query the asset's plugins via DAS or on-chain data. The Royalties plugin data includes basis points, creators, and ruleset.
### What happens if I don't set a ruleset?
Use `ruleSet('None')`. Any program can transfer the asset and royalties are advisory only.
### Can I change royalties after minting?
Yes. Use `updatePlugin` (for assets) or `updateCollectionPlugin` (for collections) if you have the authority.
## Glossary
| Term | Definition |
|------|------------|
| **Basis Points** | Royalty percentage in hundredths (500 = 5%) |
| **Creators** | Array of addresses that receive royalty payments |
| **RuleSet** | Allowlist/denylist controlling which programs can transfer |
| **Allowlist** | Only listed programs can transfer (strict enforcement) |
| **Denylist** | All programs except listed ones can transfer |
| **Authority** | The account permitted to update the plugin |
