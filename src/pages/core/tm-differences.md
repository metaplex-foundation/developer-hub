---
title: Differences between Core and Token Metadata
metaTitle: Core - Differences between Core and Token Metadata
description: Differences between Core and Token Metadata
---

This page first explores the general improvements compared with TM and will later provide more technical information on how how the equivalents of TM functions can be used in core.

## Difference Overview

- **Unprecedented Cost Efficiency**: Metaplex Core offers the lowest minting costs compared to available alternatives. For instance, an NFT that would cost .0077 SOL with Token Extensions can be minted with Core for .0037 SOL.
- **Improved Developer Experience**: While most digital assets inherit the data needed to maintain an entire fungible token program, Core is optimized for NFTs, allowing all key data to be stored in a single Solana account. This dramatically reduces complexity for developers, while also helping improve network performance for Solana more broadly.
- **Enhanced Collection Management**: With first-class support for collections, developers and creators can easily manage collection-level configurations such as royalties and plugins, which can be uniquely overridden for individual NFTs. This can be done in a single transaction, reducing collection management costs and Solana transaction fees.
- **Advanced Plugin Support**: From built-in staking to asset-based point systems, the plugin architecture of Metaplex Core opens up a vast landscape of utility and customization. Plugins allow developers to to hook into any asset life cycle event like create, transfer and burn to add custom behaviors
- **Compatibility and Support**: Fully supported by the Metaplex Developer Platform, Core is set to integrate seamlessly with a suite of SDKs and upcoming programs, enriching the Metaplex ecosystem.
- **Out of the Box Indexing**: Expanding on the Metaplex Digital Asset Standard API (DAS API), Core assets will be automatically indexed and available for application developers through a common interface that is used for all Solana NFTs. However, a unique improvement is that with the Core attribute plugin, developers will be able to add on chain data that is now also automatically indexed.

## Technical overview
### Create
To create a Core asset it is just required to run a single create instruction. There is no need to mint and attach metadata later as it was in Metaplex Token Metadata. This reduces the complexity and transaction size.

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
Collections got multiple new features compared to TM. They are used to group assets, but are first class assets now. In TM a Collection NFT was a standard NFT, with not much differences.

With Core Collections now are **first class assets** to allow additional functionalities. Thats also the reason for them to have a different data structure in Core.

Collection features that were not possible with TM are for example collection level royalties - no more having updating each asset when changing the royalties or creators but define it in the collection. This can be done by adding the [Royalties Plugin](/core/plugins/royalties) to your collection. Some assets should have different royalty settings? Just add the same plugin to the asset and the collection level royalty plugin would be overwritten. 

Freezing is also possible on collection level.

You can find more information on handling collections, like creating or updating them on the [Managing Collections](/core/collections) page.

### Lifecycle events and Plugins
During an assets lifecycle there are multiple events that can be triggered such as:

- Creating
- Transfering
- Updating
- Burning
- Add Plugin
- Approve Authority Plugin
- Remove Authority Plugin


These lifecycle events affect the Asset in various ways from creation, transfering to another wallet, through to destruction of the Asset. 

In TM these events were either handled by the owner or a delegate. All Assets had all those possibilities. In Core those events are handled by [Plugins](/core/plugins). They have to be added either on creation or later. The `permanent` plugins have to be added on asset creation. 

Plugins attached on both an Asset level or a Collection level will run through a validation process during these lifecycle events to either `approve`, `reject`, or `force approve` the event from execution.

### Freeze / Lock
With TM to freeze an asset you normally first delegated the freeze authority to a different wallet, which then froze the NFT. In Core you have to use one of two plugins: `freeze` or `permanentFreeze`. The latter has to be added on mint, the `freeze` plugin can be [added](/core/plugins/adding-plugins) at any time by the owner.

To have the owner assign the freeze authority to a different Account, when the asset does not have a freeze plugin yet they would need to add the plugin with that authority and freeze it.

The `addPlugin` Method allows to do all this in one step:

{% totem %}
{% totem-accordion title="Add Freeze Plugin, assign Authority and freeze" %}
```js
await addPlugin(umi, {
    asset: asset.publicKey,
    plugin: createPlugin('Freeze', { frozen: true }),
    initAuthority: authority('Pubkey', { address: yourPubKey }),
  }).sendAndConfirm(umi);
```
{% /totem-accordion %}
{% /totem %}

Additionally in Core freezing can be done on **collection level**. If a complete collection shall be frozen or thawed just one transaction is required instead of thousands.

### Asset status
In TM you often had to check multiple Accounts to find the current status of an Asset. For example if it is frozen, locked or could be transferred. With Core this status is stored in the  asset account, but can be also be affected by the collection account.

To make things easier we have introduced helpers like `canBurn`, `canTransfer`, `canUpdate` in the @metaplex-foundation/mpl-core package. You just pass in the asset and the authority you are trying to use and the method will return a boolean value to tell you if you can burn, transfer or update.

```js
const burningAllowed = canBurn(
  authority,
  asset,
  collection,
)
```

# Further Reading
The described features above are just the tip of the iceberg. Additional probably interesting topics could be:

- Collection Management
- Plugin Overview
- Adding on chain Data using the [Attributes Plugin](/core/plugins/attribute)