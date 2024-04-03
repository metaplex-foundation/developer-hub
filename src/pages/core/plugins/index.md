---
title: Plugins Overview
metaTitle: Core - Asset Plugins Overview
description: Learn about the different types of Plugins available on MPL Core Assets
---

## Lifecycles

During an Core Assets lifecycle, multiple events can be triggered such as:

- Creating
- Transfering
- Updating
- Burning
- Add Plugin
- Approve Authority Plugin
- Remove Authority Plugin

Lifecycle events impact the Asset in various ways from creating, to transfers between wallets, all the way through to the Assets destruction. Plugins attached an Asset level or a Collection level will run through a validation process during these lifecycle events to either `approve`, `reject`, or `force approve` the event from execution.

## What are Plugins?

A plugin is like an onchain app for your NFT that can either store data or provide additional functionality to the asset.

## Types of Plugins

### Owner Managed Plugins

Owner managed plugins are plugins that can only be added to an Core Asset if the Asset owner's signature is present in the transaction.

Owner Managed Plugins include but are not limited to:

- [Transfer Delegate](/core/plugins/transfer-delegate) (market places, games)
- [Freeze Delegate](/core/plugins/freeze-delegate) (market places, staking, games)
- [Burn Delegate](/core/plugins/burn-delegate) (games)

If an Owner Managed plugin is added to an Asset/Collection without an authority set it will default the authority type to the type of `owner`.

### Authority Managed Plugins

Authority managed plugins are plugins that the authority of the MPL Core Asset or Core Collection can add and update at any time.

Authority manages plugins include but are not limited to:

- [Royalties](/core/plugins/royalties)
- [Update Delegate](/core/plugins/update-delegate)
- [Attribute](/core/plugins/attribute)

If an Authority Managed plugin is added to an Asset/Collection without an authority argument present then the plugin will default to the authority type of `update authority`.

### Permanent Plugins

**Permanent plugins are plugins that may only be added to a Core Asset at the time of creation.** If an Asset already exists then Permanent Plugins cannot be added.

Permanent Plugins include but are not limited to:

- [Permanent Transfer Delegate](/core/plugins/permanent-transfer-delegate)
- [Permanent Freeze Delegate](/core/plugins/permanent-freeze-delegate)
- [Permanent Burn Delegate](/core/plugins/permanent-burn-delegate)

If an Permanent Plugin is added to an Asset/Collection without an authority set it will default the authority type to the type of `update authority`.

## Collection Plugins

Collection Plugins are plugins that are added at the collection level can have a collection-wide effect. This is particularly useful for royalties because you can assign the [royalties plugin](/core/plugins/royalties) to the Collection Asset and all Assets in that collection will now reference that plugin.

Collections only have access to `Permanent Plugins` and `Authority Managed Plugins`.

## Plugin Priority

If an MPL Core Asset and MPL Core Collection Asset both share the same plugin type then the Asset level plugin and its data will take precedence over the Collection level plugin.

This can be used in creative ways like setting royalties at different levels for a collection of assets.

- Collection Asset has a Royalties Plugin assigned at 2%
- A Super Rare MPL Core Asset within the collection has a Royalty Plugin assigned at 5%

TIn the above case, regular MPL Core Asset sales from the collection will retain a 2% royalty while the Super Rare MPL Core Asset will retain a 5% royalty at sale because it has it's own Royalties Plugin that takes precedence over the Collection Asset Royalties Plugin.

## Plugin Table

| Plugin                                                                   | Owner Managed | Authority Managed | Permanent |
| ------------------------------------------------------------------------ | ------------- | ----------------- | --------- |
| [Transfer Delegate](/core/plugins/transfer-delegate)                     | ✅            |                   |           |
| [Freeze Delegate](/core/plugins/freeze-delegate)                         | ✅            |                   |           |
| [Burn Delegate](/core/plugins/burn-delegate)                             | ✅            |                   |           |
| [Royalties](/core/plugins/royalties)                                     |               | ✅                |           |
| [Update Delegate](/core/plugins/update-delegate)                         |               | ✅                |           |
| [Attribute](/core/plugins/attribute)                                     |               | ✅                |           |
| [Permanent Transfer Delegate](/core/plugins/permanent-transfer-delegate) |               |                   | ✅        |
| [Permanent Freeze Delegate](/core/plugins/permanent-freeze-delegate)     |               |                   | ✅        |
| [Permanent Burn Delegate](/core/plugins/permanent-burn-delegate)         |               |                   | ✅        |

## Plugins and Lifecycle Events

Plugins in MPL Core have the ability to affect the outcome of certain lifecycle actions such as Create, Transfer, Burn, and Update.

Each plugin has the ability to to `reject`, `approve`, or `force approve` an action to a desired outcome.

During lifecycle events the action will work its way down a list of predefined plugins checking and validating against them.
If the plugins conditions are validated the lifecycle passes and continues its action.

If a plugin validation fails then the lifecycle will be halted and rejected.

The rules for plugin validation are as follows in this hierarchy of conditions;

- If there is force approve, always approve
- Else if there is any reject, reject
- Else if there is any approve, approve
- Else reject

The `force approve` validation is only available on 1st party plugins and on `Permanent Delegate ` plugins.

### Create

{% totem %}

| Plugin    | Action     | Conditions |
| --------- | ---------- | ---------- |
| Royalties | Can Reject | Ruleset    |

{% /totem %}

### Update

{% totem %}
Update currently has no plugin conditions or validations.
{% /totem %}

### Transfer

{% totem %}

| Plugin                      | Action      | Conditions  |
| --------------------------- | ----------- | ----------- |
| Royalties                   | Can Reject  | Ruleset     |
| Freeze Delegate             | Can Reject  | isFrozen    |
| Transfer Delegate           | Can Approve | isAuthority |
| Permanent Freeze Delegate   | Can Reject  | isFrozen    |
| Permanent Transfer Delegate | Can Approve | isAuthority |

{% /totem %}

### Burn

{% totem %}

| Plugin                    | Action      | Conditions  |
| ------------------------- | ----------- | ----------- |
| Freeze Delegate           | Can Reject  | isFrozen    |
| Burn Delegate             | Can Reject  | isAuthority |
| Permanent Freeze Delegate | Can Reject  | isFrozen    |
| Permanent Burn Delegate   | Can Approve | isAuthority |

{% /totem %}

### Add Plugin

{% totem %}

| Plugin          | Action      | Conditions  |
| --------------- | ----------- | ----------- |
| Royalties       | Can Reject  | Ruleset     |
| Update Delegate | Can Approve | isAuthority |

{% /totem %}

### Remove Plugin

{% totem %}

| Plugin          | Action      | Conditions  |
| --------------- | ----------- | ----------- |
| Royalties       | Can Reject  | Ruleset     |
| Update Delegate | Can Approve | isAuthority |

{% /totem %}

### Approve Plugin Authority

{% totem %}
Approve currently has no plugin conditions or validations.
{% /totem %}

### Revoke Authority Plugin

{% totem %}
Revoke currently has no plugin conditions or validations.
{% /totem %}
