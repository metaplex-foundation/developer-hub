---
title: Freeze Plugin
metaTitle: Core - Freeze Plugin
description: Learn about the MPL Core Asset Freeze Plugin
---

## Overview

The Freeze Plugin is a `Owner Managed` plugin that freezes the Asset dissallowing transfer. The authority of the plugin can revoke themselves or unfreeze at any time.

The Freeze Plugin will work in areas such as;

- Escrowless staking.
- Escrowless listing of an NFT on a marketplace.

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |

## Arguments

| Arg    | Value |
| ------ | ----- |
| frozen | bool  |

## Adding the Transfer Plugin to an Asset

{% dialect-switcher title="Adding a Freeze Plugin to an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { addPlugin, plugin } from '@metaplex-foundation/mpl-core'

await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: plugin('Freeze', [{ frozen: true }]),
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}
