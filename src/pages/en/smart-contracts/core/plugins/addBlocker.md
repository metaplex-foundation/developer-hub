---
title: addBlocker Plugin
metaTitle: addBlocker Plugin | Core Plugins
description: Learn how to block adding additional Plugins to Core NFT Assets and Collections using Metaplex Core packages.
---

The `addBlocker` Plugin is a `Authority Managed` plugin that allows to forbid adding additional authority managed plugins. This means you as an authority have to be sure that all plugins that you might need in the future have been added before. Even Plugins that are new features could not be added. It can only be added by the update authority.

The **exception** to this are user managed plugins for assets like the transfer and freeze delegate plugins. Those can always be added, even after the `addBlocker` has been added.

This plugin can be used on both the `MPL Core Asset` and the `MPL Core Collection`.

As it is for other plugins, like [royalties](/smart-contracts/core/plugins/royalties) when it is assigned to an MPL Core Collection the MPL Core Asset also is used on the Asset. So if it is added to a collection plugins cannot be added to asset anymore, too.

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## Arguments

The `addBlocker` Plugin requires no arguments.

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
    type: 'addBlocker',
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}
