---
title: Transfer Plugin
metaTitle: Core - Transfer Plugin
description: Learn about the MPL Core Asset Transfer Plugin
---

## Overview

The Transfer Plugin is a `Owner Managed` plugin that allows the authority of the program to transfer the nft at any given moment.

The Transfer Plugin will work in areas such as; 

- Escrowless sale of the Asset.
- Gaming scenario where the user swaps/looses their asset based on an event.

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |

## Arguments

The Transfer Plugin doesn't contain any arguments to pass in.


## Adding the Transfer Plugin to an Asset

{% dialect-switcher title="Adding a Transfer Plugin to an MPL Core Asset" %}
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