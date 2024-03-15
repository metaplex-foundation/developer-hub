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
import { addPlugin, plugin, authority } from '@metaplex-foundation/mpl-core'

await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: plugin('UpdateDelegate', [{}]),
  initAuthority: authority('Pubkey', { address: delegateAddress.publicKey }),
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}
