---
title: FAQ
metaTitle: Core - FAQ
description: Frequently asked questions about Core
---

## Why does the Core Asset and Collection accounts have both on-chain and off-chain data?

The Core Asset and Collection accounts both contain on-chain data, yet both also include a `URI` attribute that points to an off-chain JSON file which provides additional data. Why is that? Can't we just store everything on-chain? Well, there are several issues with storing data on-chain:

- Storing data on-chain requires paying rent. If we had to store everything within the Asset or Collection account, which may include long texts such as the description of an asset, it would require a lot more bytes and creating an Asset would suddenly be a lot more expensive, since storing more bytes means more rent has to be paid
- On-chain data is less flexible. Once an account state is created using a certain byte structure it cannot easily be changed without potentially causing deserialization issues. Therefore, if we had to store everything on-chain, the standard would be a lot harder to evolve with the demands of the ecosystem.

Therefore, splitting the data into on-chain and off-chain data allows users to get the best of both worlds where on-chain data can be used by the program **to create guarantees and expectations for its users** and off-chain data can be used **to provide standardized yet flexible information**. But don't worry, if you want data entirely on chain Metaplex also offers [Inscriptions](/inscription) for this this purpose.

## Are there any costs to using Core?

Core currently charges a very small fee of 0.0015 SOL per Asset mint to the caller. More details can be found on the [Protocol Fees](/protocol-fees) page.

## How to create a Soulbound Asset?

The Core Standard allows you to create Soulbound Assets. To achieve this use the [Permanent Freeze Delegate](/core/plugins/permanent-freeze-delegate) plugin. On Asset creation you would include the `Permanent Freeze` plugin set to frozen, and with the authority set to none, making the plugins data immutable.

{% dialect-switcher title="Create a Soulbound asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  createAsset,
  pluginAuthorityPair,
  nonePluginAuthority,
} from '@metaplex-foundation/mpl-core'

await createAsset(umi, {
  owner,
  plugins: [
    pluginAuthorityPair({
      type: 'PermanentFreeze',
      data: { frozen: true },
      authority: nonePluginAuthority(),
    }),
  ],
})
```

{% /dialect %}
{% /dialect-switcher %}

## How to set an Asset to be Immutable?

_coming soon_

## What are the differences between Metaplex Token Metadata and Core?

Core is an entirely new standard designed specifically for NFTs, hence there are several notable differences. For example Core is cheaper, requires less Compute Units and should be easier to work with from a developer perspective. Have a look at the [differences](/core/tm-differences) page for details.

## Does Core Support Editions?
Yes! Using the [Edition](/core/plugins/edition) and [Master Edition](/core/plugins/editions) Plugins. You can find more information in the ["How to print Editions" Guide](/core/guides/print-editions).