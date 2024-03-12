---
title: Adding Plugins
metaTitle: Core - Adding Plugins
description: Learn how to add plugins to MPL Core Assets and Collections
---


## Removing a Plugin from a MPL Core Asset

{% dialect-switcher title="Removing a Plugin from a MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { removePlugin, PluginType } from '@metaplex-foundation/mpl-core'

await removePlugin(umi, {
    asset: asset.publicKey,
    pluginType: PluginType.Freeze,
  }).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}


## Removing a Plugin from a Collection


{% dialect-switcher title="Removing a Plugin from a MPL Core Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { removeCollectionPlugin, PluginType } from '@metaplex-foundation/mpl-core'

await removeCollectionPlugin(umi, {
    collection: collection.publicKey,
    pluginType: PluginType.UpdateDelegate,
  }).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}
