---
title: immutableMetadata Plugin
metaTitle: Core - immutableMetadata
description: Learn how to make Metadata immutable using Core
---

The Royalties Plugin is a `Authority Managed` plugin that allows to make the Metadata (Name and URI) immutable. It can only be added by the update authority.

This plugin can be used on both the `MPL Core Asset` and the `MPL Core Collection`.

As it is for other plugins, like [royalties](/core/plugins/royalties) when it is assigned to an MPL Core Collection the MPL Core Asset also is used on the Asset. So if it is added to a collection the asset also becomes immutable.

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## Arguments

The Royalties Plugin requires no arguments.

## Adding the Immutability Plugin to an Asset code example

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

## Adding the Immutability Plugin to a Collection code example

{% dialect-switcher title="Add Royalties Plugin to Collection" %}
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
