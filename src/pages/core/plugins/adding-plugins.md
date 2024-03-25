---
title: Adding Plugins
metaTitle: Core - Adding Plugins
description: Learn how to add plugins to MPL Core Assets and Collections
---

Plugins can be assigned to both the MPL Core Asset and also the MPL Core Collection. MPL
Core Asset and MPL Core Collection both share a similar list of available plugins. To find out which plugins can be used on both entities visit the [Plugins Overview](/core/plugins) area.

## Adding a Plugin to a Core Asset

Plugins support the ability to assign an authority over the plugin. If an `initAuthority` is passed in this will set the authority to the desired address. If unassigned then the signer will be the default authority set for the plugin.

**Create Plugin Helper**

The `createPlugin()` helper gives you a typed method that allows you to assign plugins during the `addPlugin()` process.
For a full list of plugins and their arguments see the [plugins overview](/plugins/overview) page.

### Adding a Plugin with the default authority

If you add a plugin to an Asset or Collection without specifying the authority of the plugin the authority will be set to that plugins default authority type.

- Owner Managed Plugins will default to the plugin authority type of `Owner`.
- Authority Managed Plugins will default to the plugin authority type of `UpdateAuthority`.
- Permanment Plugins will default to the plugin authority type of `UpdateAuthority`

{% dialect-switcher title="Adding a Plugin with the default authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPluginV1, createPlugin } from '@metaplex-foundation/mpl-core'

await addPluginV1(umi, {
  asset: asset.publicKey,
  plugin: createPlugin({ type: 'FreezeDelegate' }),
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

### Adding a Plugin with an assigned authority

There are a few authority helpers to aid you in setting the authorities of plugins.

**addressPluginAuthority()**
```js
addressPluginAuthority(publicKey)
```

This sets the plugins authority to a specific address.

**ownerPluginAuthority()**
```js
ownerPluginAuthority()
```

This sets the plugins authority to the type of `Owner`.
The current owner of the Asset will have access to this plugin.

**updatePluginAuthority()**
```js
updatePluginAuthority()
```

This sets the plugins authority to the type of `UpdateAuthority`.
The current update authority of the Asset will have access to this plugin.

**nonePluginAuthority()**
```js
nonePluginAuthority()
```

This sets the plugins authority to the type of `None`.
The plugins data if it has any becomes immutable at this point.


{% dialect-switcher title="Adding a Plugin with an assigned authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  addPluginV1,
  createPlugin,
  pluginAuthority,
  addressPluginAuthority
} from '@metaplex-foundation/mpl-core'

const delegate = publicKey("222222222222222222222222222222")

await addPluginV1(umi, {
  asset: asset.publicKey,
  plugin: createPlugin({ type: 'FreezeDelegate', data: { frozen: true } }),
  initAuthority: addressPluginAuthority(delegate),
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Adding a Plugin to a Collection

Plugins support the ability to assign an authority over the plugin. If an `initAuthority` is passed in this will set the authority to the desired address. If unassigned then the signer will be the default authority set for the plugin.

### Adding a Collection Plugin with the default authority

{% dialect-switcher title="Adding a Collection Plugin with the default authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  addCollectionPluginV1,
  createPlugin,
  ruleSet,
} from '@metaplex-foundation/mpl-core'

const collection = publicKey('11111111111111111111111111111111')

const creator = publicKey('22222222222222222222222222222222')

await addCollectionPluginV1(umi, {
  collection: collection,
  plugin: createPlugin({
    type: 'Royalties',
    data: {
      basisPoints: 5000,
      creators: [
        {
          address: creator,
          percentage: 100,
        },
      ],
      ruleSet: ruleSet('None'),
    },
  }),
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

### Adding a Collection Plugin with an assigned authority

{% dialect-switcher title="Burning an Assets" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  addCollectionPluginV1,
  createPlugin,
  ruleSet,
  pluginAuthority,
  addressPluginAuthority
} from '@metaplex-foundation/mpl-core'

const collection = publicKey('11111111111111111111111111111111')

const delegate = publicKey('22222222222222222222222222222222')

await addCollectionPluginV1(umi, {
  collection: collection,
  plugin: createPlugin({
    type: 'Royalties',
    data: {
      basisPoints: 5000,
      creators: [
        {
          address: creator,
          percentage: 100,
        },
      ],
      ruleSet: ruleSet('None'),
    },
  }),
  initAuthority: addressPluginAuthority(delegate),
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}
