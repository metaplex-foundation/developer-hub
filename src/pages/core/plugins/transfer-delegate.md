---
title: Transfer Delegate Plugin
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
import { publicKey } from '@metaplex-foundation/umi'
import { addPluginV1, createPlugin } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')

await addPluginV1(umi, {
  asset: asset,
  plugin: createPlugin({ type: 'TransferDelegate' }),
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}
