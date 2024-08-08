---
title: Core - Differences between Core and Token Metadata
metaTitle: Core - Differences between Core and Token Metadata
description: Differences between Core and Token Metadata NFT protocols on the Solana blockchain.
---

This page first explores Core's general improvements compared with TM and later provides more technical information on how the equivalents of TM functions can be used in Core.

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

Collection features that were not possible with TM are for example collection level royalties - no more having updating each asset when changing the royalties or creators but define it in the collection. This can be done by adding the [Royalties Plugin](/core/plugins/royalties) to your collection. Some assets should have different royalty settings? Just add the same plugin to the asset and the collection level royalty plugin would be overwritten.

Freezing is also possible on the collection level.

You can find more information on handling collections, like creating or updating them on the [Managing Collections](/core/collections) page.

### Lifecycle events and Plugins

During an Asset's lifecycle multiple events can be triggered, such as:

- Creating
- Transferring
- Updating
- Burning
- Add Plugin
- Approve Authority Plugin
- Remove Authority Plugin

In TM these lifecyle events are either executed by the owner or a delegate. All TM Assets (nfts/pNfts) include functions for every lifecycle event. In Core these events are handled by [Plugins](/core/plugins) at either a Asset or Collection wide level.

Plugins attached on both an Asset level or a Collection level will run through a validation process during these lifecycle events to either `approve`, `reject`, or `force approve` the event from execution.

### Freeze / Lock

To freeze an asset with TM you typically first delegate the freeze authority to a different wallet, which then freezes the NFT. In Core you must use one of two plugins: `Freeze Delegate` or `Permanent Freeze Delegate`. The latter can only be added during Asset creation, while the `Freeze Delegate` plugin can be [added](/core/plugins/adding-plugins) at any time providing the current owner signs the transaction.

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

## Further Reading

The features described above are just the tip of the iceberg. Additional interesting topics include:

- Collection Management
- Plugin Overview
- Adding on chain Data using the [Attributes Plugin](/core/plugins/attribute)
