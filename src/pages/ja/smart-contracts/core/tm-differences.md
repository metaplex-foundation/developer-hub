---
title: Differences between Core and Token Metadata
metaTitle: Core vs Token Metadata | Metaplex Core
description: Compare Metaplex Core and Token Metadata NFT standards. Learn what changed, what's new, and how to migrate your mental model from TM to Core.
updated: '01-31-2026'
keywords:
  - Core vs Token Metadata
  - NFT standard comparison
  - migrate from Token Metadata
  - mpl-core differences
  - NFT migration
about:
  - NFT standards comparison
  - Token Metadata migration
  - Core advantages
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Should I use Core or Token Metadata for new projects?
    a: Use Core for all new projects. It's cheaper, simpler, and has better features. Token Metadata is legacy.
  - q: Can I migrate existing TM NFTs to Core?
    a: Not automatically. Core Assets are different on-chain accounts. Migration would require burning TM NFTs and minting new Core Assets.
  - q: What happened to pNFTs?
    a: Core's royalty enforcement is built-in via the Royalties plugin with allowlist/denylist support. No separate programmable variant needed.
  - q: Do I still need Associated Token Accounts?
    a: No. Core Assets don't use ATAs. Ownership is stored directly in the Asset account.
  - q: How do I verify creators in Core?
    a: Use the Verified Creators plugin. It works similarly to TM's creator array but is opt-in.
---
Coming from **Token Metadata**? This guide explains what's different in Core, why it's better, and how to translate your TM knowledge to Core concepts. {% .lead %}
{% callout title="Key Differences" %}
- **Single account** vs 3+ accounts (mint, metadata, token account)
- **80% lower costs**: ~0.0037 SOL vs 0.022 SOL per mint
- **Plugins** instead of delegates and freeze authorities
- **Collections are first-class** with collection-level operations
- **No Associated Token Accounts** needed
{% /callout %}
## Summary
Core replaces Token Metadata's multi-account model with a single-account design. Everything is simpler: creating, freezing, delegating, and managing collections. The plugin system replaces TM's scattered delegate types with a unified, extensible architecture.
| Feature | Token Metadata | Core |
|---------|---------------|------|
| Accounts per NFT | 3+ (mint, metadata, ATA) | 1 |
| Mint cost | ~0.022 SOL | ~0.0037 SOL |
| Freeze mechanism | Delegate + freeze authority | Freeze Delegate plugin |
| Collection royalties | Per-asset updates | Collection-level plugin |
| On-chain attributes | ❌ | ✅ Attributes plugin |
## Out of Scope
Migration scripts (coming soon), pNFT-specific features, and fungible token handling (use SPL Token).
## Quick Start
**Jump to:** [Cost Comparison](#difference-overview) · [Collections](#collections) · [Freeze/Lock](#freeze--lock) · [Lifecycle Events](#lifecycle-events-and-plugins)
If you're starting fresh, use Core. If migrating, the key mental shifts are:
1. One account, not three
2. Plugins, not delegates
3. Collection-level operations are native
## Difference Overview
- **Unprecedented Cost Efficiency**: Metaplex Core offers the lowest minting costs compared to available alternatives. For instance, an NFT that would cost .022 SOL with Token Metadata can be minted with Core for .0037 SOL.
- **Improved Developer Experience**: While most digital assets inherit the data needed to maintain an entire fungible token program, Core is optimized for NFTs, allowing all key data to be stored in a single Solana account. This dramatically reduces complexity for developers, while also helping improve network performance for Solana more broadly.
- **Enhanced Collection Management**: With first-class support for collections, developers and creators can easily manage collection-level configurations such as royalties and plugins, which can be uniquely overridden for individual NFTs. This can be done in a single transaction, reducing collection management costs and Solana transaction fees.
- **Advanced Plugin Support**: From built-in staking to asset-based point systems, the plugin architecture of Metaplex Core opens a vast landscape of utility and customization. Plugins allow developers to hook into any asset life cycle event like create, transfer and burn to add custom behaviors.
- **Compatibility and Support**: Fully supported by the Metaplex Developer Platform, Core is set to integrate seamlessly with a suite of SDKs and upcoming programs, enriching the Metaplex ecosystem.
- **Out of the Box Indexing**: Expanding on the Metaplex Digital Asset Standard API (DAS API), Core assets will be automatically indexed and available for application developers through a common interface that is used for all Solana NFTs. However, a unique improvement is that with the Core attribute plugin, developers will be able to add on chain data that is now also automatically indexed.
## Technical overview
### Create
To create a Core Asset, only a single create instruction is required. There is no need to mint and attach metadata later as was required by Token Metadata. This reduces the complexity and transaction size.
{% totem %}
{% totem-accordion title="Create" %}
The following snippet assumes that you have already uploaded your asset data.
```js
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'
const assetAddress = generateSigner(umi)
const result = createV1(umi, {
  asset: assetAddress,
  name: 'My Nft',
  uri: 'https://example.com/my-nft',
}).sendAndConfirm(umi)
```
{% /totem-accordion %}
{% /totem %}
### Collections
Core Collections include multiple new features. Collections are now their own account type and differentiate themselves from regular Assets. This is a welcome addition from Token Metadatas approach of using the same accounts and state to represent both NFT's and Collections making the two difficult to tell apart.
With Core, Collections are **first class assets** that allow additional functionalities. For example, Core provides for collection-level royalty adjustments by adding the Royalties Plugin to the collection. Developers and creators can now update all assets in a collection at once rather than being forced to update each asset individually. But what if some assets in the collection should have different royalty settings? No problem – just add the same plugin to the asset and the collection-level royalty plugin will be overwritten
Collection features that were not possible with TM are for example collection level royalties - no more having updating each asset when changing the royalties or creators but define it in the collection. This can be done by adding the [Royalties Plugin](/smart-contracts/core/plugins/royalties) to your collection. Some assets should have different royalty settings? Just add the same plugin to the asset and the collection level royalty plugin would be overwritten.
Freezing is also possible on the collection level.
You can find more information on handling collections, like creating or updating them on the [Managing Collections](/smart-contracts/core/collections) page.
### Lifecycle events and Plugins
During an Asset's lifecycle multiple events can be triggered, such as:
- Creating
- Transferring
- Updating
- Burning
- Add Plugin
- Approve Authority Plugin
- Remove Authority Plugin
In TM these lifecyle events are either executed by the owner or a delegate. All TM Assets (nfts/pNfts) include functions for every lifecycle event. In Core these events are handled by [Plugins](/smart-contracts/core/plugins) at either a Asset or Collection wide level.
Plugins attached on both an Asset level or a Collection level will run through a validation process during these lifecycle events to either `approve`, `reject`, or `force approve` the event from execution.
### Freeze / Lock
To freeze an asset with TM you typically first delegate the freeze authority to a different wallet, which then freezes the NFT. In Core you must use one of two plugins: `Freeze Delegate` or `Permanent Freeze Delegate`. The latter can only be added during Asset creation, while the `Freeze Delegate` plugin can be [added](/smart-contracts/core/plugins/adding-plugins) at any time providing the current owner signs the transaction.
Delegation is also easier with Core as we do away with Delegete Record accounts and store delegate authorities directly on the plugin itself while also being assignable at the point of adding a plugin to an Asset either during Asset creation or via `addPluginV1` function.
To have the owner assign the freeze authority to a different Account, when the asset does not have a freeze plugin yet they would need to add the plugin with that authority and freeze it.
Here's a quick example of adding the `Freeze Delegate` plugin to an Asset while also assigning it to a delegated authority.
{% totem %}
{% totem-accordion title="Add Freeze Plugin, assign Authority and freeze" %}
```js
await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: createPlugin('FreezeDelegate', { frozen: true }),
  initAuthority: pluginAuthority('Address', { address: delegate.publicKey }),
}).sendAndConfirm(umi)
```
{% /totem-accordion %}
{% /totem %}
Additionally in Core freezing can be done on the **collection level**. A complete collection can be frozen or thawed in just one transaction.
### Asset status
In TM you often have to check multiple Accounts to find the current status of an Asset and if it has been frozen, locked, or even in a transferable state. With Core this status is stored in the Asset account but can be also be affected by the Collection account.
To make things easier we have introduced lifecycle helpers such as `canBurn`, `canTransfer`, `canUpdate` which come included in the `@metaplex-foundation/mpl-core` package. These helpers return a `boolean` value letting you know if the passed in address has permission to execute these lifecycle events.
```js
const burningAllowed = canBurn(authority, asset, collection)
```
## Quick Reference
### TM Concept → Core Equivalent
| Token Metadata | Core Equivalent |
|----------------|-----------------|
| Mint account | Asset account |
| Metadata account | Asset account (combined) |
| Associated Token Account | Not needed |
| Freeze authority | Freeze Delegate plugin |
| Update authority | Update authority (same) |
| Delegate | Transfer/Burn/Update Delegate plugins |
| Collection verified | Collection membership (automatic) |
| Creators array | Verified Creators plugin |
| Uses/utility | Plugins (custom logic) |
### Common Operations
| Operation | Token Metadata | Core |
|-----------|---------------|------|
| Create NFT | `createV1()` (multiple accounts) | `create()` (single account) |
| Freeze | Delegate then freeze | Add Freeze Delegate plugin |
| Update metadata | `updateV1()` | `update()` |
| Transfer | SPL Token transfer | `transfer()` |
| Burn | `burnV1()` | `burn()` |
## FAQ
### Should I use Core or Token Metadata for new projects?
Use Core for all new projects. It's cheaper, simpler, and has better features. Token Metadata is legacy.
### Can I migrate existing TM NFTs to Core?
Not automatically. Core Assets are different on-chain accounts. Migration would require burning TM NFTs and minting new Core Assets.
### What happened to pNFTs?
Core's royalty enforcement is built-in via the Royalties plugin with allowlist/denylist support. No separate "programmable" variant needed.
### Do I still need Associated Token Accounts?
No. Core Assets don't use ATAs. Ownership is stored directly in the Asset account.
### How do I verify creators in Core?
Use the [Verified Creators plugin](/smart-contracts/core/plugins/verified-creators). It works similarly to TM's creator array but is opt-in.
## Further Reading
The features described above are just the tip of the iceberg. Additional interesting topics include:
- [Collection Management](/smart-contracts/core/collections)
- [Plugin Overview](/smart-contracts/core/plugins)
- Adding on-chain data using the [Attributes Plugin](/smart-contracts/core/plugins/attribute)
- [Creating Assets](/smart-contracts/core/create-asset)
## Glossary
| Term | Definition |
|------|------------|
| **Token Metadata (TM)** | Legacy Metaplex NFT standard using multiple accounts |
| **Core** | New Metaplex NFT standard with single-account design |
| **Plugin** | Modular functionality added to Core Assets |
| **ATA** | Associated Token Account (not needed in Core) |
| **pNFT** | Programmable NFT in TM (royalty enforcement built into Core) |
