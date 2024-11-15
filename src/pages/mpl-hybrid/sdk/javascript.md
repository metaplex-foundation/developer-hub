---
title: MPL-Hybrid Javascript SDK
metaTitle: Javascript SDK | MPL-Hybrid
description: Learn how to set up your project to run the MPL-Hybrid Javascript SDK.
---

Metaplex provides a JavaScript library that can be used to interact with the MPL-Hybrid 404 program. Thanks to the [Umi Framework](/umi), it ships without many opinionated dependencies thus providing a lightweight library that can be used in any JavaScript project.

To get started, you'll need to [install the Umi framework](/umi/getting-started) and the MPL-Hybrid JavaScript library.

## Installation

Installation can be executed with any of the JS package managers, npm, yarn, bun etc...

```sh
npm install @metaplex-foundation/mpl-hybrid
```

## Umi Setup


An `umi` instance is required to interact with the Metaplex Javascript SDKs. If you haven't set up and configured an `umi` instance yet then you can get checkout the [Umi Getting Started](/umi/getting-started) page.


During the initialization of the `umi` instance you can add the mpl-hybrid package to `umi` using

```js
.use(mplHybrid())
```

You can add the `mplHybrid()` package anywhere in your umi instance creation.
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplHybrid } from '@metaplex-foundation/mpl-hybrid'

// Use the RPC endpoint of your choice.
const umi = createUmi('http://api.devenet.solana.com')
... // additional umi settings and packages
.use(mplHybrid())
```

From here your `umi` instance will have access to the mpl-hybrid package.