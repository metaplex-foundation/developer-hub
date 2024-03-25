---
title: Getting Started using JavaScript
metaTitle: Core - Getting Started - JavaScript
description: Get started with Core using JavaScript
---

Metaplex provides a JavaScript library that can be used to interact with Core Assets. Thanks to the [Umi framework](https://github.com/metaplex-foundation/umi), it ships without many opinionated dependencies and, thus, provides a lightweight library that can be used in any JavaScript project.

To get started, you'll need to [install the Umi framework](https://github.com/metaplex-foundation/umi/blob/main/docs/installation.md) and the Core JavaScript library.

```sh
npm install \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults \
  @solana/web3.js \
  @metaplex-foundation/mpl-core
```

Next, you may create your `Umi` instance and install the `mplCore` plugin like so.

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCore } from '@metaplex-foundation/mpl-core'

// Use the RPC endpoint of your choice.
const umi = createUmi('http://127.0.0.1:8899').use(mplCore())
```

That's it, you can now interact with NFTs by using [the various functions provided by the library](https://mpl-core-js-docs.vercel.app/) and passing your `Umi` instance to them. Here's an example of creating an Asset:

{% dialect-switcher title="Upload assets and JSON data" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
const result = createV1(umi, {
  asset: asset,
  name: 'My Nft',
  uri: 'https://example.com/my-nft',
}).sendAndConfirm(umi)
```
{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

To then fetch the data of your newly created asset you can use:

{% dialect-switcher title="Fetch a single asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchAssetV1 } from '@metaplex-foundation/mpl-core'

const asset = await fetchAssetV1(umi, asset.publicKey)

console.log(asset)
```

{% /dialect %}
{% /dialect-switcher %}

🔗 **Helpful Links:**

- [Umi Framework](https://github.com/metaplex-foundation/umi)
- [GitHub Repository](https://github.com/metaplex-foundation/mpl-core)
- [NPM Package](https://www.npmjs.com/package/@metaplex-foundation/mpl-core)
- [API References](https://mpl-core-js-docs.vercel.app/)
