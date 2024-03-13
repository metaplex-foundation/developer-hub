---
title: Permanent Transfer
metaTitle: Core - Permanent Transfer Plugin
description: Learn about the Permanent Transfer Plugin for MPL Core Assets
---

## Overview

The Permanent Transfer Plugin is a `Permanent` plugin will always be present on the MPL Core Asset or MPL Core Collection. A permanent plugin can only be added at the time of Asset or Collection creation. This plugin allows the plugin authority to transfer the asset at any point to another address.

The Permanent Transfer Plugin will work in areas such as;

- Gaming event triggers the transfer of a users Asset to another wallet.

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## Arguments

| Arg    | Value |
| ------ | ----- |
| frozen | bool  |

## Creating a MPL Core Asset with a Permanent Transfer Plugin

{% dialect-switcher title="## Creating a MPL Core Asset with a Permanent Transfer Plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { createAsset, pluginAuthorityPair } from '@metaplex-foundation/mpl-core'

await createAsset(umi, {
  owner,
  plugins: [
    pluginAuthorityPair({ type: 'PermanentFreeze', data: { frozen: true } }),
  ],
})
```

{% /dialect %}
{% /dialect-switcher %}
