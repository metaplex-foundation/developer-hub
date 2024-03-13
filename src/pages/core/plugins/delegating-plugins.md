---
title: Delegating and Revoking Plugins
metaTitle: Core - Delegating Plugins
description: Learn how to delegate plugins to MPL Core Assets and Collections
---

## Delegating an Authority

Plugins can be delegated to another address with a Delegate Authority instruction update. Delegated plugins allow addresses other than the main authority to have control over that plugins function.

{% dialect-switcher title="Delegate a Plugin Authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {approvePluginAuthority, PluginType, getPubkeyAuthority } from '@metaplex-foundation/mpl-core'

await approvePluginAuthority(umi, {
    asset: asset.publicKey,
    pluginType: PluginType.Freeze,
    newAuthority: getPubkeyAuthority(delegateAddress.publicKey),
  }).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

## Revoking an Authority

//TODO
Write about who's able to revoke the authority based on the plugin type.

{% dialect-switcher title="Revoking a Plugin Authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { PluginType, revokePluginAuthority } from '@metaplex-foundation/mpl-core'

await revokePluginAuthority(umi, {
    asset: asset.publicKey,
    pluginType: PluginType.Freeze,
  }).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

## Making a Plugin Immutable

By setting a null value to the plugins authority you can create an immutable plugin.

**WARNING** - Doing so will leave your plugin immutable and unable to be updated or assigned a new authority. Proceed with caution!

{% dialect-switcher title="Making a Plugin Immutable" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { PluginType, approvePluginAuthority, getNoneAuthority } from '@metaplex-foundation/mpl-core'

await approvePluginAuthority(umi, {
    asset: asset.publicKey,
    pluginType: PluginType.Freeze,
    newAuthority: getNoneAuthority(),
  }).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

