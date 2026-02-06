---
title: Plugins Overview
metaTitle: Core Plugins Overview | Metaplex Core
description: Learn about Metaplex Core plugins - modular extensions that add behaviors like royalties, freezing, burning, and on-chain attributes to NFT Assets and Collections.
updated: '01-31-2026'
keywords:
  - Core plugins
  - NFT plugins
  - plugin system
  - royalties plugin
  - freeze plugin
about:
  - Plugin architecture
  - NFT extensions
  - Lifecycle events
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
faqs:
  - q: Can I add plugins after an Asset is created?
    a: Yes, except for Permanent plugins. Owner Managed plugins require owner signature; Authority Managed plugins require update authority signature.
  - q: What happens to plugins when an Asset is transferred?
    a: Owner Managed plugins (Transfer, Freeze, Burn Delegate) have their authority automatically revoked on transfer. Authority Managed and Permanent plugins persist.
  - q: Can an Asset have the same plugin as its Collection?
    a: Yes. When both have the same plugin type, the Asset-level plugin takes precedence over the Collection-level plugin.
  - q: How do I remove a plugin?
    a: Use the removePlugin instruction. Only the plugin authority can remove it.
  - q: Can I create custom plugins?
    a: No. Only built-in plugins are supported. The plugin system is not extensible by third parties.
  - q: Do plugins cost extra SOL?
    a: Adding plugins increases account size, which increases rent. Most plugins cost ~0.001 SOL, but data-storage plugins (like AppData or Attributes) can cost more depending on how much data is stored.
---
This page explains the **Core Plugin system** - modular extensions that add behaviors and data storage to Core Assets and Collections. Plugins hook into lifecycle events to enforce rules or store on-chain data. {% .lead %}
{% callout title="What You'll Learn" %}

- What plugins are and how they work
- Types of plugins: Owner Managed, Authority Managed, Permanent
- How plugins affect lifecycle events (create, transfer, burn)
- Plugin priority between Assets and Collections
{% /callout %}

## Summary

**Plugins** are on-chain extensions that add functionality to Core Assets or Collections. They can store data (like attributes), enforce rules (like royalties), or delegate permissions (like freeze/transfer authority).

- **Owner Managed**: Require owner signature to add (Transfer, Freeze, Burn Delegate)
- **Authority Managed**: Can be added by update authority (Royalties, Attributes, Update Delegate)
- **Permanent**: Can only be added at creation time (Permanent Transfer/Freeze/Burn Delegate)

## Out of Scope

Creating custom plugins (only built-in plugins are supported), Token Metadata plugins (different system), and off-chain plugin data storage.

## Quick Start

**Jump to:** [Plugin Types](#types-of-plugins) · [Plugin Table](#plugin-table) · [Lifecycle Events](#plugins-and-lifecycle-events) · [Adding Plugins](/smart-contracts/core/plugins/adding-plugins)

1. Choose a plugin based on your use case (royalties, freezing, attributes, etc.)
2. Add the plugin using `addPlugin()` or at Asset/Collection creation
3. Plugins automatically hook into lifecycle events
4. Query plugin data via DAS or on-chain fetch

## Lifecycles

During a Core Assets lifecycle, multiple events can be triggered such as:

- Creating
- Transferring
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

- [Transfer Delegate](/smart-contracts/core/plugins/transfer-delegate) (market places, games)
- [Freeze Delegate](/smart-contracts/core/plugins/freeze-delegate) (market places, staking, games)
- [Burn Delegate](/smart-contracts/core/plugins/burn-delegate) (games)
If an Owner Managed plugin is added to an Asset/Collection without an authority set it will default the authority type to the type of `owner`.
The authority of owner managed plugins is automatically revoked when they are transferred.

### Authority Managed Plugins

Authority managed plugins are plugins that the authority of the MPL Core Asset or Core Collection can add and update at any time.
Authority manages plugins include but are not limited to:

- [Royalties](/smart-contracts/core/plugins/royalties)
- [Update Delegate](/smart-contracts/core/plugins/update-delegate)
- [Attribute](/smart-contracts/core/plugins/attribute)
If an Authority Managed plugin is added to an Asset/Collection without an authority argument present then the plugin will default to the authority type of `update authority`.

### Permanent Plugins

**Permanent plugins are plugins that may only be added to a Core Asset at the time of creation.** If an Asset already exists then Permanent Plugins cannot be added.
Permanent Plugins include but are not limited to:

- [Permanent Transfer Delegate](/smart-contracts/core/plugins/permanent-transfer-delegate)
- [Permanent Freeze Delegate](/smart-contracts/core/plugins/permanent-freeze-delegate)
- [Permanent Burn Delegate](/smart-contracts/core/plugins/permanent-burn-delegate)
If an Permanent Plugin is added to an Asset/Collection without an authority set it will default the authority type to the type of `update authority`.

## Collection Plugins

Collection Plugins are plugins that are added at the collection level can have a collection-wide effect. This is particularly useful for royalties because you can assign the [royalties plugin](/smart-contracts/core/plugins/royalties) to the Collection Asset and all Assets in that collection will now reference that plugin.
Collections only have access to `Permanent Plugins` and `Authority Managed Plugins`.

## Plugin Priority

If an MPL Core Asset and MPL Core Collection Asset both share the same plugin type then the Asset level plugin and its data will take precedence over the Collection level plugin.
This can be used in creative ways like setting royalties at different levels for a collection of assets.

- Collection Asset has a Royalties Plugin assigned at 2%
- A Super Rare MPL Core Asset within the collection has a Royalty Plugin assigned at 5%
In the above case, regular MPL Core Asset sales from the collection will retain a 2% royalty while the Super Rare MPL Core Asset will retain a 5% royalty at sale because it has it's own Royalties Plugin that takes precedence over the Collection Asset Royalties Plugin.

## Plugin Table

| Plugin                                                                   | Owner Managed | Authority Managed | Permanent |
| ------------------------------------------------------------------------ | ------------- | ----------------- | --------- |
| [Transfer Delegate](/smart-contracts/core/plugins/transfer-delegate)                     | ✅            |                   |           |
| [Freeze Delegate](/smart-contracts/core/plugins/freeze-delegate)                         | ✅            |                   |           |
| [Burn Delegate](/smart-contracts/core/plugins/burn-delegate)                             | ✅            |                   |           |
| [Royalties](/smart-contracts/core/plugins/royalties)                                     |               | ✅                |           |
| [Update Delegate](/smart-contracts/core/plugins/update-delegate)                         |               | ✅                |           |
| [Attribute](/smart-contracts/core/plugins/attribute)                                     |               | ✅                |           |
| [Permanent Transfer Delegate](/smart-contracts/core/plugins/permanent-transfer-delegate) |               |                   | ✅        |
| [Permanent Freeze Delegate](/smart-contracts/core/plugins/permanent-freeze-delegate)     |               |                   | ✅        |
| [Permanent Burn Delegate](/smart-contracts/core/plugins/permanent-burn-delegate)         |               |                   | ✅        |

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
The `force approve` validation is only available on 1st party plugins and on `Permanent Delegate` plugins.

### Force Approve

Force approve is the first check made when checking a plugins validations. The plugins which will force approve validations currently are:

- **Permanent Transfer**
- **Pernament Burn**
- **Permanent Freeze**
These plugins will take precedence with their actions over their non permanent counterparts and other plugins.

#### Example

If you have an Asset frozen at Asset level with a Freeze Plugin while simultaneously have a **Permanent Burn** plugin on the Asset, even if the Asset is frozen the burn procedure called via the **Pernament Burn** plugin with still execute due to the `forceApprove` nature of permanent plugins.

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

## Common Use Cases

| Use Case | Recommended Plugin |
|----------|-------------------|
| Enforce creator royalties | [Royalties](/smart-contracts/core/plugins/royalties) |
| Escrowless staking | [Freeze Delegate](/smart-contracts/core/plugins/freeze-delegate) |
| Marketplace listings | [Freeze Delegate](/smart-contracts/core/plugins/freeze-delegate) + [Transfer Delegate](/smart-contracts/core/plugins/transfer-delegate) |
| On-chain game stats | [Attributes](/smart-contracts/core/plugins/attribute) |
| Allow third-party burns | [Burn Delegate](/smart-contracts/core/plugins/burn-delegate) |
| Permanent staking program | [Permanent Freeze Delegate](/smart-contracts/core/plugins/permanent-freeze-delegate) |

## FAQ

### Can I add plugins after an Asset is created?

Yes, except for Permanent plugins. Owner Managed plugins require owner signature; Authority Managed plugins require update authority signature.

### What happens to plugins when an Asset is transferred?

Owner Managed plugins (Transfer, Freeze, Burn Delegate) have their authority automatically revoked on transfer. Authority Managed and Permanent plugins persist.

### Can an Asset have the same plugin as its Collection?

Yes. When both have the same plugin type, the Asset-level plugin takes precedence over the Collection-level plugin.

### How do I remove a plugin?

Use the `removePlugin` instruction. Only the plugin authority can remove it. See [Removing Plugins](/smart-contracts/core/plugins/removing-plugins).

### Can I create custom plugins?

No. Only built-in plugins are supported. The plugin system is not extensible by third parties.

### Do plugins cost extra SOL?

Adding plugins increases account size, which increases rent. Most plugins cost ~0.001 SOL, but data-storage plugins (like AppData or Attributes) can cost more depending on how much data is stored.

## Glossary

| Term | Definition |
|------|------------|
| **Plugin** | A modular extension adding behavior or data to an Asset/Collection |
| **Owner Managed** | Plugin type requiring owner signature to add |
| **Authority Managed** | Plugin type that update authority can add |
| **Permanent** | Plugin type that can only be added at creation |
| **Lifecycle Event** | An action (create, transfer, burn) that plugins can validate |
| **Force Approve** | Permanent plugin validation that overrides other rejections |
| **Plugin Authority** | The account authorized to update or remove a plugin |
