---
title: ImmutableMetadata Plugin
metaTitle: ImmutableMetadata Plugin | Metaplex Core
description: Make Core NFT Asset and Collection metadata permanently immutable. Lock the name and URI to prevent any future changes.
updated: '01-31-2026'
keywords:
  - immutable metadata
  - lock metadata
  - permanent NFT
  - provenance
about:
  - Metadata immutability
  - Provenance protection
  - Data locking
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Can I undo adding ImmutableMetadata?
    a: No. Once added, the ImmutableMetadata plugin cannot be removed. The metadata is permanently locked. This is by design for provenance guarantees.
  - q: What exactly becomes immutable?
    a: The Asset or Collection's name and uri fields. Other plugin data is not affected - use authority None on individual plugins to make their data immutable.
  - q: If I add this to a Collection, are existing Assets affected?
    a: Yes. When ImmutableMetadata is on a Collection, all Assets in that Collection inherit the immutability. Their metadata cannot be changed.
  - q: Can I add this during Asset creation?
    a: Yes. You can add ImmutableMetadata during create() to ensure the metadata is locked from the start.
  - q: Why would I want immutable metadata?
    a: Immutable metadata provides permanent provenance - collectors know the NFT's name and associated metadata URI can never be changed, preventing rug-pulls.
---
The **ImmutableMetadata Plugin** permanently locks the name and URI of Assets or Collections. Once added, the metadata cannot be changed by anyone, ensuring permanent provenance. {% .lead %}
{% callout title="What You'll Learn" %}

- Make Asset metadata immutable
- Make Collection metadata immutable
- Understand inheritance from Collections to Assets
- Protect NFT provenance permanently
{% /callout %}

## Summary

The **ImmutableMetadata** plugin is an Authority Managed plugin that prevents any changes to an Asset or Collection's name and URI. Once added, this protection is permanent.

- Authority Managed (only update authority can add)
- Makes name and URI permanently unchangeable
- Cannot be removed after addition
- Collection plugin affects all Assets in that Collection

## Out of Scope

Making other plugin data immutable (use authority `None` on those plugins), selective field immutability, and temporary locks.

## Quick Start

**Jump to:** [Add to Asset](#adding-the-immutablemetadata-plugin-to-an-asset-code-example) · [Add to Collection](#adding-the-immutablemetadata-plugin-to-a-collection-code-example)

1. Ensure metadata (name, URI) is finalized
2. Add ImmutableMetadata plugin as update authority
3. Metadata is now permanently locked
{% callout type="note" title="When to Use ImmutableMetadata" %}
| Scenario | Use ImmutableMetadata? |
|----------|------------------------|
| Art NFTs with permanent artwork | ✅ Yes |
| Game items with evolving stats | ❌ No (need to update attributes) |
| Prevent rug-pulls | ✅ Yes |
| Dynamic/evolving NFTs | ❌ No |
| Certificates/credentials | ✅ Yes |
**Use ImmutableMetadata** for art, collectibles, and certificates where permanence is valued.
**Don't use** for game items or dynamic NFTs that need updates.
{% /callout %}

## Common Use Cases

- **Art collectibles**: Guarantee artwork and metadata will never change
- **Certificates**: Issue credentials that can't be altered
- **Provenance protection**: Prevent rug-pulls by locking metadata
- **Historical records**: Preserve NFT data permanently
- **Brand guarantees**: Assure collectors the NFT's identity is fixed

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## Arguments

The ImmutableMetadata Plugin requires no arguments.

## Adding the immutableMetadata Plugin to an Asset code example

{% dialect-switcher title="Adding a Immutability Plugin to an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  addPlugin,
} from '@metaplex-foundation/mpl-core'
await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'ImmutableMetadata',
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Adding the immutableMetadata Plugin to a Collection code example

{% dialect-switcher title="Add immutableMetadata Plugin to Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  addCollectionPlugin,
} from '@metaplex-foundation/mpl-core'
await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'ImmutableMetadata',
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Common Errors

### `Authority mismatch`

Only the update authority can add the ImmutableMetadata plugin.

### `Cannot update metadata`

The ImmutableMetadata plugin is active. The name and URI cannot be changed.

## Notes

- This action is **permanent and irreversible**
- Double-check name and URI before adding this plugin
- Adding to a Collection makes ALL Assets in that Collection immutable
- The plugin has no arguments—just add it to lock metadata

## Quick Reference

### Affected Fields

| Field | Locked |
|-------|--------|
| `name` | ✅ |
| `uri` | ✅ |
| Other metadata | ❌ (use other methods) |

### Inheritance Behavior

| Added To | Effect |
|----------|--------|
| Asset | Only that Asset's metadata is locked |
| Collection | Collection AND all Assets' metadata locked |

## FAQ

### Can I undo adding ImmutableMetadata?

No. Once added, the ImmutableMetadata plugin cannot be removed. The metadata is permanently locked. This is by design for provenance guarantees.

### What exactly becomes immutable?

The Asset or Collection's `name` and `uri` fields. Other plugin data is not affected—use authority `None` on individual plugins to make their data immutable.

### If I add this to a Collection, are existing Assets affected?

Yes. When ImmutableMetadata is on a Collection, all Assets in that Collection inherit the immutability. Their metadata cannot be changed.

### Can I add this during Asset creation?

Yes. You can add ImmutableMetadata during `create()` to ensure the metadata is locked from the start.

### Why would I want immutable metadata?

Immutable metadata provides permanent provenance—collectors know the NFT's name and associated metadata URI can never be changed, preventing rug-pulls where creators swap out artwork or descriptions.

## Related Plugins

- [AddBlocker](/smart-contracts/core/plugins/addBlocker) - Prevent new plugins (complementary to ImmutableMetadata)
- [Attributes](/smart-contracts/core/plugins/attribute) - On-chain data (not locked by ImmutableMetadata)
- [Royalties](/smart-contracts/core/plugins/royalties) - Set royalties before making immutable

## Glossary

| Term | Definition |
|------|------------|
| **Immutable** | Cannot be changed or modified |
| **Metadata** | The name and URI associated with an Asset/Collection |
| **Provenance** | Verifiable record of authenticity and ownership |
| **URI** | Link to off-chain JSON metadata |
| **Inheritance** | Assets automatically get Collection-level plugin effects |
