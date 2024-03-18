---
title: Plugins Overview
metaTitle: Core - Asset Plugins Overview
description: Learn about the different types of Plugins available on MPL Core Assets
---

## What are Plugins?

Plugins can attach to both MPL Core Assets and also Collection Assets to modify the behaviour either at asset level or even collection level depending on the plugin.

## Types of Plugins

### Owner Managed Plugins

Owner managed plugins are plugins that are only allowed to be added to an asset if the asset owners signature is present in the transaction.

Those include but are not limited to:

- [Transfer Delegate](/core/plugins/transfer) (market places, games)
- [Freeze Delegate](/core/plugins/freeze) (market places, staking, games)
- [Burn Delegate](/core/plugins/burn) (games)

### Authority Managed Plugins

Authority managed plugins are plugins that the authority of the MPL Core Asset can add and update at any time.

Those include but are not limited to:

- [Royalties](/core/plugins/royalties)
- [Update Delegate](/core/plugins/update)
- [Attribute](/core/plugins/attribute)

### Permanent Plugins

Permanent plugins are plugins that are only available to add to an Asset at the time of mint/creation of the MPL Core Asset. If an Asset has already been created then Permanent plugins will not be available to add to the Asset.

Those include but are not limited to:

- [Permanent Transfer Delegate](/core/plugins/permenant-transfer)
- [Permanent Freeze Delegate](/core/plugins/permenant-freeze)
- [Permanent Burn Delegate](/core/plugins/permenant-burn)

## Collection Plugins

Collection Plugins are plugins that can have a collection wide effect. This is particularly useful for royalties where you should assign the [royalties plugin](/core/plugins/royalties) to the Collection Asset and all nfts in that collection will now reference to that plugin.

Collections only have access to `Permanent Plugins` and `Authority Managed Plugins`.

## Plugin Priority

If a MPL Core Asset and MPL Core Collection Asset both share the same plugin type then the plugin and its data on the Core Asset will take precedence over the Collection Asset plugin.

This can be used in creative ways such as setting royalties at different levels for your collection of assets. E.g.:

- Collection Asset has a Royalties Plugin assigned at 2%
- Your Super Rare MPL Core Asset then has a Royalty Plugin assigned at 5%

This means all your regular MPL Core Asset sales from your collection will retain a 2% royalty while your Super Rare MPL Core Asset will retain a 5% royalty at sale because it has it's own Royalties Plugin that will take precedence over the Collection Asset Royalties Plugin that is also assigned.

## Plugin Table

| Plugin                                                         | Owner Managed | Authority Managed | Permanent |
| -------------------------------------------------------------- | ------------- | ----------------- | --------- |
| [Transfer Delegate](/core/plugins/transfer)                    | ✅            |                   |           |
| [Freeze Delegate](/core/plugins/freeze)                        | ✅            |                   |           |
| [Burn Delegate](/core/plugins/burn)                            | ✅            |                   |           |
| [Royalties](/core/plugins/royalties)                           |               | ✅                |           |
| [Update Delegate](/core/plugins/update)                        |               | ✅                |           |
| [Attribute](core/plugins/attribute)                            |               | ✅                |           |
| [Permanent Transfer Delegate](core/plugins/permanent-transfer) |               |                   | ✅        |
| [Permanent Freeze Delegate](core/plugins/permanent-freeze)     |               |                   | ✅        |
| [Permanent Burn Delegate](core/plugins/permanent-burn)         |               |                   | ✅        |
