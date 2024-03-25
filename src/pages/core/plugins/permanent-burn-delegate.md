---
title: Permanent Burn Delegate
metaTitle: Core - Permanent Burn Delegate
description: Learn about the Permanent Burn Plugin for MPL Core Assets
---

## Overview

The Permanent Burn Plugin is a `Permanent` plugin will always be present on the MPL Core Asset or MPL Core Collection. A permanent plugin can only be added at the time of Asset or Collection creation. This plugin allows the authority of the plugin to burn the asset at any point in time.

The Permanent Burn Plugin will work in areas such as;

- Gaming event which triggers the burning of the asset.

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## Arguments

The Permanent Burn Plugin doesn't contain any arguments to pass in.

## Creating an Asset with a Permanent Burn Plugin

{% dialect-switcher title="Creating an Asset with a Permanent Freeze plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { createV1, createPlugin, pluginAuthority } from '@metaplex-foundation/mpl-core'

await createV1(umi, {
  asset: assetSigner,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  plugins: [
    {
      plugin: createPlugin({
        type: 'PermanentBurnDelegate',
      }),
      authority: pluginAuthority('Address', {
        address: publicKey('33333333333333333333333333333'),
      }),
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}
