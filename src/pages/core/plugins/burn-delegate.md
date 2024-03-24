---
title: Burn Delegate
metaTitle: Core - Burn Delegate
description: Learn about the MPL Core Asset Burn Delegate Plugin
---

The Transfer Plugin is a `Owner Managed` plugin that allows the authority of the program to burn the nft at any given moment.

The Burn Plugin will work in areas such as:

- Gaming scenario where the users NFT get burned based on an event that occurs.

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |

## Arguments

The Burn Plugin doesn't contain any arguments to pass in.


## Adding the Burn Plugin to an Asset

{% dialect-switcher title="Adding a Burn Plugin to an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { addPlugin, createPlugin } from '@metaplex-foundation/mpl-core'

await addPlugin(umi, {
    asset: asset.publicKey,
    plugin: createPlugin('Burn', {}),
  }).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}