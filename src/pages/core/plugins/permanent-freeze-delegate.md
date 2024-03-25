---
title: Permanent Freeze Delegate
metaTitle: Core - Permanent Freeze Plugin
description: Learn about the Permanent Freeze Plugin for MPL Core Assets
---

## Overview

The Freeze Plugin is a `Permanent` plugin will always be present on the MPL Core Asset or MPL Core Collection. A permanent plugin can only be added at the time of Asset or Collection creation.

The Permanent Freeze Plugin will work in areas such as;

- Soulbound Tokens.

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## Arguments

| Arg    | Value |
| ------ | ----- |
| frozen | bool  |

## Creating an Asset with a Permanent Freeze plugin

{% dialect-switcher title="Creating an Asset with a Permanent Freeze plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { createV1, createPlugin, pluginAuthority } from '@metaplex-foundation/mpl-core'

const assetSigner = generateSigner(umi)

await createV1(umi, {
  asset: assetSigner,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  plugins: [
    {
      plugin: createPlugin({
        type: 'PermanentFreezeDelegate',
        data: { frozen: true },
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
