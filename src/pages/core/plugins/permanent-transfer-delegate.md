---
title: Permanent Transfer
metaTitle: Core - Permanent Transfer Plugin
description: Learn about the Permanent Transfer Plugin for MPL Core Assets
---

## Overview

The Permanent Transfer Plugin is a `Permanent` plugin will always be present on the MPL Core Asset or MPL Core Collection. A permanent plugin can only be added at the time of Asset or Collection creation. This plugin allows the plugin authority to transfer the asset at any point to another address.

The Permanent Transfer Plugin will work in areas such as:

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
import { publicKey } from '@metaplex-foundation/umi'
import {
  createV1,
  createPlugin,
  pluginAuthority,
  addressPluginAuthority
} from '@metaplex-foundation/mpl-core'

const assetSigner = generateSigner(umi)

const delegate = publicKey('33333333333333333333333333333')

await createV1(umi, {
  asset: asset.publicKey,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  plugins: [
    {
      plugin: createPlugin({
        type: 'PermanentTransferDelegate',
      }),
      authority: addressPluginAuthority(delegate),
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}
