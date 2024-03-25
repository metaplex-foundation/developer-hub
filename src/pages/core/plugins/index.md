---
title: Plugins Overview
metaTitle: Core - Asset Plugins Overview
description: Learn about the different types of Plugins available on MPL Core Assets
---

## Lifecycles

During an assets lifecycle there are multiple events that can be triggered such as;

- Creating
- Transfering
- Updating
- Burning
- Add Plugin
- Approve Authority Plugin
- Remove Authority Plugin

These lifecycle events affect the Asset in various ways from creation, transfering to another wallet, through to destruction of the Asset. Plugins attached on both an Asset level or a Collection level will run through a validation process during these lifecycle events to either `approve`, `reject`, or `force approve` the event from execution.

## What are Plugins?

Plugins can attach to both MPL Core Assets and also Collection Assets to modify the behaviour either at asset level or even collection level depending on the plugin.

## Types of Plugins

### Owner Managed Plugins

Owner managed plugins are plugins that are only allowed to be added to an asset if the asset owners signature is present in the transaction.

Those include but are not limited to:

- [Transfer Delegate](/core/plugins/transfer-delegate) (market places, games)
- [Freeze Delegate](/core/plugins/freeze-delegate) (market places, staking, games)
- [Burn Delegate](/core/plugins/burn-delegate) (games)

If an Owner Managed plugin is added to an Asset/Collection without an authority set it will default the authority type to the type of `owner`.

### Authority Managed Plugins

Authority managed plugins are plugins that the authority of the MPL Core Asset can add and update at any time.

Those include but are not limited to:

- [Royalties](/core/plugins/royalties)
- [Update Delegate](/core/plugins/update-delegate)
- [Attribute](/core/plugins/attribute)

If an Authority Managed plugin is added to an Asset/Collection without an authority set it will default the authority type to the type of `update authority`.

### Permanent Plugins

**Permanent plugins are plugins that are only available to add to an Asset at the time of mint/creation of the MPL Core Asset.** If an Asset has already been created then Permanent plugins will not be available to add to the Asset.

Those include but are not limited to:

- [Permanent Transfer Delegate](/core/plugins/permanant-transfer-delegate)
- [Permanent Freeze Delegate](/core/plugins/permanant-freeze-delegate)
- [Permanent Burn Delegate](/core/plugins/permanant-burn-delegate)

If an Permanent Plugin is added to an Asset/Collection without an authority set it will default the authority type to the type of `update authority`.

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

## Plugins and Lifecycle Events

Plugins in MPL Core have the ability to effect the outcome of certain lifecycle actions such as Create, Transfer, Burn, and Update.

Each plugin has the ability to to `reject`, `approve`, or `force approve` an action to a desired outcome.

During lifecycle events the action will work its way down a list of predefined plugins checking and validating against them.
If the plugins conditions are validated the lifecycle passes and continues it's action.

If a plugin validation fails then the lifecycle will be halted and rejected.

The rules for plugin validation are as follows in this hierarchy of conditions;

- If there is force approve, always approve
- Else if there is any reject, reject
- Else if there is any approve, approve
- Else reject

The `force approve` validation is only available on 1st party plugins and only available on `permanent` plugins.

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
Update currently has no plugin conditions or validations.
{% /totem %}

### Revoke Authority Plugin

{% totem %}
Update currently has no plugin conditions or validations.
{% /totem %}
