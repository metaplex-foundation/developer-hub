---
title: Adding Plugins
metaTitle: Core - Adding Plugins
description: Learn how to add plugins to MPL Core Assets and Collections
---

Plugins can be assigned to both the MPL Core Asset and also the MPL Core Collection. MPL
Core Asset and MPL Core Collection both share a similar list of available plugins. To find out which plugins can be used on both entities visit the [Plugins Overview](/core/plugins) area.

## Adding a Plugin to a Core Asset

Plugins support the ability to assign an authority over the plugin. If an `initAuthority` is passed in this will set the authority to the desired address. If unassigned then the signer will be the default authority set for the plugin.

### Adding a Plugin with the default authority

{% dialect-switcher title="Adding a Plugin with the default authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { addPlugin, plugin } from '@metaplex-foundation/mpl-core'

await addPlugin(umi, {
    asset: asset.publicKey,
    plugin: plugin('Transfer', [{}]),
  }).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

### Adding a Plugin with an assigned authority

{% dialect-switcher title="Adding a Plugin with an assigned authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { addPlugin, plugin  } from '@metaplex-foundation/mpl-core'

await addPlugin(umi, {
    asset: asset.publicKey,
    plugin: plugin('Transfer', [{}]),
    initAuthority: authority('Pubkey', { address: delegate.publicKey }),
  }).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

## Adding a Plugin to a Collection

Plugins support the ability to assign an authority over the plugin. If an `initAuthority` is passed in this will set the authority to the desired address. If unassigned then the signer will be the default authority set for the plugin.

### Adding a Collection Plugin with the default authority

{% dialect-switcher title="Adding a Collection Plugin with the default authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { addCollectionPlugin, plugin } from '@metaplex-foundation/mpl-core'

await addCollectionPlugin(umi, {
    collection: collection.publicKey,
    plugin: plugin('Royalties', [
      {
        percentage: 5,
        creators: [],
        ruleSet: ruleSet('None'),
      },
    ]),
  }).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

### Adding a Collection Plugin with an assigned authority

{% dialect-switcher title="Burning an Assets" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { addCollectionPlugin, plugin } from '@metaplex-foundation/mpl-core'

await addCollectionPlugin(umi, {
    collection: collection.publicKey,
    plugin: plugin('Royalties', [
      {
        percentage: 5,
        creators: [],
        ruleSet: ruleSet('None'),
      },
    ]),
    initAuthority: authority('Pubkey', { address: delegate.publicKey }),
  }).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}