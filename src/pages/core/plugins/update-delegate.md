---
title: Update Delegate Plugin
metaTitle: Core - Delegating Update permissions
description: Learn how to delegate a update authority on Core
---

The Update Delegate is a `Authority Managed` plugin that allows the authority of the MPL Core Asset to assign an Update Delegate to the Asset.

The Update Delegate Plugin will work in areas such as:

- scenarios where you need a 3rd party to update/edit the entire MPL Core Asset.

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## Arguments

The Update Delegate Plugin doesn't contain any arguments to pass in.

## Adding the Update Delegate Plugin to an Asset

{% dialect-switcher title="Adding a Update Delegate Plugin to an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  addPluginV1,
  createPlugin,
  pluginAuthority,
} from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')
const delegate = publicKey('22222222222222222222222222222222')

await addPluginV1(umi, {
  asset: asset,
  plugin: createPlugin({ type: 'UpdateDelegate' }),
  initAuthority: pluginAuthority('Address', { address: delegate }),
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}
