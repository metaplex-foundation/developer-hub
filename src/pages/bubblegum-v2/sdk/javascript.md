---
title: MPL-Bubblegum Javascript SDK
metaTitle: Javascript SDK | MPL-Bubblegum
description: Learn how to set up your project to run the MPL-Bubblegum Javascript SDK.
---

Metaplex provides a JavaScript library that can be used to interact with the MPL-Bubblegum program. Thanks to the [Umi framework](/umi), it ships without many opinionated dependencies, thus providing a lightweight library that can be used in any JavaScript project.

To get started, you'll need to [install the Umi framework](/umi/getting-started) and the MPL-Bubblegum JavaScript library.

## Installation

Installation can be executed with any JavaScript package manager (npm, yarn, bun, etc.).
```sh
npm install @metaplex-foundation/mpl-bubblegum
```

{% quick-links %}

{% quick-link title="typedoc" target="_blank" icon="JavaScript" href="https://mpl-bubblegum.typedoc.metaplex.com/" description="MPL-Bubblegum JavaScript SDK generated package API documentation." /%}

{% quick-link title="npmjs.com" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/mpl-bubblegum" description="MPL-Bubblegum Javascript SDK on NPM." /%}

{% /quick-links %}

## Umi Setup

If you haven't set up and configured an `umi` instance yet, then you can check out the [Umi Getting Started](/umi/getting-started) page.

During the initialization of the `umi` instance, you can add the MPL-Bubblegum package to `umi` using

```js
.use(mplBubblegum())
```

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'

// Use the RPC endpoint of your choice.
const umi = createUmi('http://api.devnet.solana.com')
... // additional umi settings, packages, and signers
.use(mplBubblegum())
```

From here, your `umi` instance will have access to the MPL-Bubblegum package, allowing you to explore its features.
