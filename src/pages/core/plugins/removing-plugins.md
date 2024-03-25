---
title: Removing Plugins
metaTitle: Core - Removing Plugins
description: Learn how to remove plugins to MPL Core Assets and Collections
---

Plugins can also be removed from MPL Core Assets and MPL Core Collections.

## Removing a Plugin from a MPL Core Asset

{% dialect-switcher title="Removing a Plugin from a MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { removePluginV1, PluginType } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')

await removePluginV1(umi, {
  asset: asset,
  pluginType: PluginType.Royalties,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Removing a Plugin from a Collection

{% dialect-switcher title="Removing a Plugin from a MPL Core Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  removeCollectionPluginV1,
  PluginType,
} from '@metaplex-foundation/mpl-core'

const collection = publicKey('11111111111111111111111111111111')

await removeCollectionPluginV1(umi, {
  collection: collection,
  pluginType: PluginType.Royalties,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}
