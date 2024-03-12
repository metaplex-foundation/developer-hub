---
title: Burn Plugin
metaTitle: Core - Burn Plugin
description: Learn about the MPL Core Asset Burn Plugin
---

## Overview

The Transfer Plugin is a `Owner Managed` plugin that allows the authority of the program to transfer the nft at any given moment.

The Burn Plugin will work in areas such as; 

- Gaming scenario where the users NFT get burned based on an event that occurs.

## Arguments

The Burn Plugin doesn't contain any arguments to pass in.


## Adding the Burn Plugin to an Asset

{% dialect-switcher title="Adding a Burn Plugin to an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { addPlugin, plugin } from '@metaplex-foundation/mpl-core'

await addPlugin(umi, {
    asset: asset.publicKey,
    plugin: plugin('Burn', [{}]),
  }).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}