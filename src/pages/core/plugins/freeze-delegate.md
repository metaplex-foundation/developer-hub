---
title: Freeze Delegate
metaTitle: Core - Freeze Delegate Plugin
description: Learn about the MPL Core Asset Freeze Delegate Plugin
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
import { publicKey } from '@metaplex-foundation/umi'
import { addPluginV1, createPlugin } from '@metaplex-foundation/mpl-core'

const asset = publicKey("11111111111111111111111111111111")

await addPluginV1(umi, {
    asset: asset,
    plugin: createPlugin({ type: "FreezeDelegate", data: { frozen: true } }),
  }).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}
