---
title: Core - Autograph Plugin
metaTitle: Core - Autograph Plugin
description: Learn how to add your signatures and messages to a Core NFT Asset or Collection.
---

The `autograph` Plugin is a `Owner Managed` plugin that allows people to add signatures and a message to an asset or collection.

The `update authority` can add the plugin on mint. After that only the Owner can add it. Any Autograph can be removed again by the owner or autograph delegate. The Autographer can not remove their own autograph, except when they are also the owner or autograph delegate. 

To add a autograph some conditions have to be met:

- The autograph plugin must be added already.
- The signer may only add their own address.
- The existing list have to be passed along with the added signature using the `updatePlugin` function.
- There is no existing Autograph by that signer yet.

{% callout type="note" %}
As soon as the autograph plugin has been added by the owner everyone can add their signature. It can again be removed by the owner at any time.
{% /callout %}

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

Assets inherit Autographs from the Collection.

## Arguments

The `autograph` Plugin requires the following arguments in a `signatures` Array:

| Arg     | Value     |
| ------- | ------    |
| address | publicKey |
| message | string    |

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

## Adding an Autograph to an Asset code example

{% dialect-switcher title="Adding a Autograph to an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

// The new autograph that you want to add
const newAutograph = {
  address: umi.identity.publicKey,
  message: "your message"
}

// Add the new autograph to the existing signatures array
const updatedAutographs = [...asset.autograph.signatures, newAutograph]

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    // This should contain all autographs that you do not want to remove
    signatures: updatedAutographs,
  },
  authority: umi.identity,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Removing an Autograph from an Asset code example

{% dialect-switcher title="Removing a Autograph from an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

// The Publickey of the autograph that you want to remove 
const publicKeyToRemove = publicKey("abc...")

const autographsToKeep = asset.autograph.signatures.filter(
  (autograph) => autograph.address !== publicKeyToRemove
);

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    // This should contain all Autographs that you do not want to remove
    signatures: autographsToKeep,
  },
  authority: umi.identity, // Should be the owner of the asset
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
