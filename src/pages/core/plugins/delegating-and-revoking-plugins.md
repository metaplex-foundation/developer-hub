---
title: Delegating and Revoking Plugins
metaTitle: Core - Delegating Plugins
description: Learn how to delegate plugins to MPL Core Assets and Collections
---

## Delegating an Authority

Plugins can be delegated to another address with a Delegate Authority instruction update. Delegated plugins allow addresses other than the main authority to have control over that plugins functionality.

{% dialect-switcher title="Delegate a Plugin Authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  approvePluginAuthority,
  pluginAuthority,
  PluginType,
  addressPluginAuthority,
} from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')
const delegate = publicKey('33333333333333333333333333333')

await approvePluginAuthorityV1(umi, {
  asset: asset,
  pluginType: PluginType.FreezeDelegate,
  newAuthority: addressPluginAuthority(delegate),
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Revoking an Authority

Revoking an Authority on a plugin can have different behaviours depending on what type of plugin is being revoked.

- **Owner Mananged Plugins:** If an address is revoked from an `Owner Managed Plugin` then the plugin will default back to the `Owner` authority type.

- **Authority Mananged Plugins:** If an address is revoked from an `Authority Managed Plugin` then the plugin will default back to the `UpdateAuthority` authority type.

### Who can Revoke a Plugin?

#### Owner Managed Plugins

- An Owner Managed Plugin can be revoked by the owner which revokes the delegate and sets the pluginAuthority type to `Owner`.
- The delegated Authority of the plugin can revoke themselves which then sets the plugin authority type to `Owner`.
- On Transfer delegated Authorities of owner managed plugins are automatically revoked. 

#### Authority Managed Plugins

- The Update Authority of an Asset can revoke a delegate which thens sets the pluginAuthority type to `UpdateAuthority`.
- The delegated Authority of the plugin can revoke themselves which then sets the plugin authority type to `UpdateAuthority`.

A list of plugins and their types can be viewed on the [Plugins Overview](/core/plugins) page.

{% dialect-switcher title="Revoking a Plugin Authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  PluginType,
  revokePluginAuthorityV1,
} from '@metaplex-foundation/mpl-core'

await revokePluginAuthorityV1(umi, {
  asset: asset.publicKey,
  pluginType: PluginType.Freeze,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

### Delegate Resets Upon Asset Transfer

All Owner Managed plugins will have their delegated authorities revoked and set back to the authority type of `Owner` upon Transfer of an Asset.

This includes:

- Freeze Delegate
- Transfer Delegate
- Burn Delegate

## Making Plugin Data Immutable

By updating your plugins authority to a `None` value will effectively make your plugin's data immutable.

{% callout type="warning" %}

**WARNING** - Doing so will leave your plugin data immutable. Proceed with caution!

{% /callout %}

{% dialect-switcher title="Making a Plugin Immutable" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  PluginType,
  approvePluginAuthorityV1,
  getNoneAuthority,
} from '@metaplex-foundation/mpl-core'

await approvePluginAuthorityV1(umi, {
  asset: asset.publicKey,
  pluginType: PluginType.Freeze,
  newAuthority: getNoneAuthority(),
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}
