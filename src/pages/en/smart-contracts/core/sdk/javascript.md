---
title: MPL-Core Javascript SDK
metaTitle: Javascript SDK | MPL-Core
description: Learn how to set up your project to run the MPL-Core Javascript SDK.
---

Metaplex provides a JavaScript library that can be used to interact with the MPL-Core program. Thanks to the [Umi Framework](/dev-tools/umi), it ships without many opinionated dependencies thus providing a lightweight library that can be used in any JavaScript project.

To get started, you'll need to [install the Umi framework](/dev-tools/umi/getting-started) and the MPL-Core JavaScript library.

## Installation

Installation can be executed with any of the JS package managers, npm, yarn, bun etc...

```sh
npm install @metaplex-foundation/mpl-core
```

{% quick-links %}

{% quick-link title="typedoc" target="_blank" icon="JavaScript" href="https://mpl-core.typedoc.metaplex.com/" description="MPL-Core Javascript SDK generated package API documentation." /%}

{% quick-link title="npmjs.com" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/mpl-core" description="MPL-Core Javascript SDK on NPM." /%}

{% /quick-links %}

## Umi Setup

An `umi` instance is required to interact with the Metaplex Javascript SDKs. If you haven't set up and configured an `umi` instance yet then you can get checkout the [Umi Getting Started](/dev-tools/umi/getting-started) page and configure your RPC endpoint and your `umi` identity/signer.

During the initialization of the `umi` instance you can add the mpl-core package to `umi` using

```js
.use(mplCore())
```

You can add the `mplCore()` package anywhere in your umi instance creation with `.use()`.

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCore } from '@metaplex-foundation/mpl-core'

// Use the RPC endpoint of your choice.
const umi = createUmi('http://api.devenet.solana.com')
... // additional umi settings, packages, and signers
.use(mplCore())
```

From here your `umi` instance will have access to the mpl-core package and you start to explore the mpl-core feature set.
