---
title: AddBlocker Plugin
metaTitle: AddBlocker Plugin | Metaplex Core
description: Prevent new authority-managed plugins from being added to Core Assets and Collections. Lock down plugin configuration permanently.
updated: '01-31-2026'
keywords:
  - add blocker
  - lock plugins
  - prevent plugins
  - plugin restriction
about:
  - Plugin restriction
  - Configuration locking
  - Authority management
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Can I still add Freeze Delegate after AddBlocker?
    a: Yes. Owner-managed plugins like Freeze Delegate, Transfer Delegate, and Burn Delegate can always be added, even after AddBlocker is active.
  - q: Can I remove AddBlocker after adding it?
    a: Yes, if it hasn't been made immutable. The plugin can be removed by the authority. However, this defeats the purpose of using AddBlocker.
  - q: If I add AddBlocker to a Collection, can I still add plugins to individual Assets?
    a: No. Collection-level AddBlocker prevents adding authority-managed plugins to both the Collection and all its Assets.
  - q: What if Metaplex releases a new plugin I want to use?
    a: If AddBlocker is active, you cannot add new authority-managed plugins, even new ones released in the future. Plan accordingly.
  - q: Why would I use AddBlocker?
    a: To guarantee that the NFT's authority-managed plugin configuration is final. This provides assurance to collectors that royalties, attributes, and other critical settings cannot be modified.
---
The **AddBlocker Plugin** prevents any new authority-managed plugins from being added to an Asset or Collection. Lock down your NFT configuration while still allowing owner-managed plugins. {% .lead %}
{% callout title="What You'll Learn" %}
- Block new authority-managed plugins
- Understand which plugins are still allowed
- Apply to Assets and Collections
- Plan your plugin configuration before locking
{% /callout %}
## Summary
The **AddBlocker** plugin is an Authority Managed plugin that prevents adding new authority-managed plugins. Owner-managed plugins (like Freeze Delegate, Transfer Delegate) can still be added.
- Authority Managed (only update authority can add)
- Blocks new authority-managed plugins permanently
- Owner-managed plugins are NOT blocked
- Collection plugin affects all Assets in that Collection
## Out of Scope
Blocking owner-managed plugins (always allowed), removing existing plugins, and blocking updates to existing plugins.
## Quick Start
**Jump to:** [Add to Asset](#adding-the-addblocker-plugin-to-an-asset-code-example) · [Add to Collection](#adding-the-addblocker-plugin-to-a-collection-code-example)
1. Add all authority-managed plugins you'll need
2. Add AddBlocker plugin as update authority
3. No new authority-managed plugins can be added
{% callout type="note" title="When to Use AddBlocker" %}
| Scenario | Use AddBlocker? |
|----------|-----------------|
| Guarantee royalties can't be changed | ✅ Yes (add Royalties first, then AddBlocker) |
| Prevent future plugin additions | ✅ Yes |
| Lock attributes permanently | ❌ No (use authority `None` on Attributes) |
| Allow marketplace listings | ✅ Still works (owner-managed allowed) |
| Need new plugins in future | ❌ Don't use AddBlocker |
**Use AddBlocker** to give collectors confidence that the NFT's configuration is final.
{% /callout %}
## Common Use Cases
- **Royalty protection**: Ensure royalties cannot be changed by blocking new Royalties plugins
- **Configuration finality**: Guarantee collectors the NFT's plugins won't change
- **Trust building**: Prove to buyers that critical settings are locked
- **Collection standards**: Enforce consistent plugin configuration across a Collection
## Works With
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |
## Arguments
The `AddBlocker` Plugin requires no arguments.
## Adding the addBlocker Plugin to an Asset code example
{% dialect-switcher title="Adding a addBlocker Plugin to an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}
```ts
import {
  addPlugin,
} from '@metaplex-foundation/mpl-core'
await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'addBlocker',
  },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% /dialect-switcher %}
## Adding the addBlocker Plugin to a Collection code example
{% dialect-switcher title="Add addBlocker Plugin to Collection" %}
{% dialect title="JavaScript" id="js" %}
```ts
import {
  addCollectionPlugin,
} from '@metaplex-foundation/mpl-core'
await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'AddBlocker',
  },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% /dialect-switcher %}
## Common Errors
### `Authority mismatch`
Only the update authority can add the AddBlocker plugin.
### `Cannot add plugin - AddBlocker active`
The AddBlocker plugin is preventing new authority-managed plugins. This is expected behavior.
## Notes
- Plan your plugin configuration carefully before adding AddBlocker
- Future Metaplex plugin features cannot be added once blocked
- Owner-managed plugins (Freeze, Transfer, Burn Delegates) are always allowed
- Adding to a Collection blocks plugins on ALL Assets too
## Quick Reference
### What Gets Blocked
| Plugin Type | Blocked |
|-------------|---------|
| Authority Managed | ✅ Blocked |
| Owner Managed | ❌ Still allowed |
| Permanent | ✅ Blocked (must add at creation) |
### Common Authority Managed Plugins (Blocked)
- Royalties
- Attributes
- Verified Creators
- ImmutableMetadata
- AddBlocker (itself)
### Owner Managed Plugins (Still Allowed)
- Freeze Delegate
- Transfer Delegate
- Burn Delegate
## FAQ
### Can I still add Freeze Delegate after AddBlocker?
Yes. Owner-managed plugins like Freeze Delegate, Transfer Delegate, and Burn Delegate can always be added, even after AddBlocker is active.
### Can I remove AddBlocker after adding it?
Yes, if it hasn't been made immutable. The plugin can be removed by the authority. However, this defeats the purpose of using AddBlocker.
### If I add AddBlocker to a Collection, can I still add plugins to individual Assets?
No. Collection-level AddBlocker prevents adding authority-managed plugins to both the Collection and all its Assets.
### What if Metaplex releases a new plugin I want to use?
If AddBlocker is active, you cannot add new authority-managed plugins, even new ones released in the future. Plan accordingly.
### Why would I use AddBlocker?
To guarantee that the NFT's authority-managed plugin configuration is final. This provides assurance to collectors that royalties, attributes, and other critical settings cannot be modified by adding new plugins.
## Related Plugins
- [ImmutableMetadata](/smart-contracts/core/plugins/immutableMetadata) - Lock name and URI permanently
- [Royalties](/smart-contracts/core/plugins/royalties) - Set royalties before using AddBlocker
- [Attributes](/smart-contracts/core/plugins/attribute) - Add attributes before using AddBlocker
## Glossary
| Term | Definition |
|------|------------|
| **AddBlocker** | Plugin that prevents new authority-managed plugins |
| **Authority Managed** | Plugins controlled by update authority |
| **Owner Managed** | Plugins controlled by Asset owner |
| **Plugin Configuration** | Set of plugins attached to an Asset/Collection |
| **Inheritance** | Assets get Collection-level restrictions |
