---
title: Autograph Plugin
metaTitle: Core - Autograph
description: Learn how to add your signature and message to an asset or collection
---

The `autograph` Plugin is a `Owner Managed` plugin that allows people to add signatures and a message to an asset or collection.

The `update authority` can add the plugin on mint. After that only the Owner can add it. Any Autograph can be removed again by the owner or autograph delegate. The Autographer can not remove their own autograph, except when they are also the owner or autograph delegate. 

This plugin can be used on both the `MPL Core Asset` and the `MPL Core Collection`.

To add a autograph some conditions have to be met:

- The autograph must be added already.
- The signer may only add their own address.
- The existing list have to be passed along with the added signature using the `updatePlugin` function.
- There is no existing Autograph by that signer yet.

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## Arguments

The `autograph` Plugin requires the following arguments in a `signature` Array:

| Arg     | Value  |
| ------- | ------ |
| address | number |
| message | string |

## Adding the autograph Plugin to an Asset code example

{% dialect-switcher title="Adding a autograph Plugin to an MPL Core Asset as the owner" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  addPlugin,
} from '@metaplex-foundation/mpl-core'

await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    signatures: [
      {
        address: umi.identity.publicKey,
        message: 'Your Message',
      },
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Removing a Autograph from an Asset code example

// to do: better filtering for remaining autographs

{% dialect-switcher title="Removing a Autograph from an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { updatePlugin } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    signatures: [
          {
            address: asset.autograph[0].publicKey,
            message: asset.autograph[0].message,
          },
    ], // This should contain all autographs that you do not want to remove
  },
  authority: owner,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Adding the autograph Plugin to a Collection code example

{% dialect-switcher title="Add autograph Plugin to Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { addCollectionPlugin } from '@metaplex-foundation/mpl-core'

await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'autograph',
        signatures: [
      {
        address: umi.identity.publicKey,
        message: 'Your Message',
      },
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}
