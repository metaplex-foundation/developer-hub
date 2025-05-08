---
title: Bubblegum Plugin
metaTitle: Bubblegum Plugin | Core Plugins
description: Learn how to use the Bubblegum Plugin to create Collections that can be used for compressed NFTs.
---

The `Bubblegum` Plugin is a `Authority Managed` plugin that allows to create Collections that can be used for compressed NFTs.


This plugin can be only be used on `MPL Core Collections`.

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |

## Arguments

The `Bubblegum` Plugin requires no arguments.

## Create a Collection with the Bubblegum Plugin code example

{% dialect-switcher title="Create a Collection with the Bubblegum Plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  createCollection,
} from '@metaplex-foundation/mpl-core'
import {
  generateSigner,
} from "@metaplex-foundation/umi";

const collectionSigner = generateSigner(umi);

await createCollection(umi, {
    collection: collectionSigner,
    name: "My Collection",
    uri: "https://example.com/my-nft.json",
    plugins: [
      {
        type: "BubblegumV2",
      },
    ],
  })
```

{% /dialect %}
{% /dialect-switcher %}


## Adding the Bubblegum Plugin to a Collection code example

{% dialect-switcher title="Add Bubblegum Plugin to Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  addCollectionPlugin,
} from '@metaplex-foundation/mpl-core'

await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'BubblegumV2',
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}
