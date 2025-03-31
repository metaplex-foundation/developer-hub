---
title: MPL Core Candy Machine Javascript SDK
metaTitle: Javascript SDK | MPL Core Candy Machine
description: Learn how to set up your project to run the MPL Core Candy Machine Javascript SDK.
---

Metaplex provides a JavaScript library that can be used to interact with the MPL Core Candy Machine program. Thanks to the [Umi Framework](/umi), it ships without many opinionated dependencies thus providing a lightweight library that can be used in any JavaScript project.

To get started, you'll need to [install the Umi framework](/umi/getting-started) and the MPL-Core JavaScript library.

## Installation

Installation can be executed with any of the JS package managers, npm, yarn, bun etc...

```sh
npm install @metaplex-foundation/mpl-core-candy-machine
```

{% quick-links %}

{% quick-link title="typedoc" target="_blank" icon="JavaScript" href="https://mpl-core-candy-machine.typedoc.metaplex.com/" description="MPL Core Candy Machine Javascript SDK generated package API documentation." /%}

{% quick-link title="npmjs.com" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/mpl-core-candy-machine" description="MPL Core Candy Machine Javascript SDK on NPM." /%}

{% /quick-links %}

## Umi Setup

An `umi` instance is required to interact with the Metaplex Javascript SDKs. If you haven't set up and configured an `umi` instance yet then you can get checkout the [Umi Getting Started](/umi/getting-started) page and configure your RPC endpoint and your `umi` identity/signer.

During the initialization of the `umi` instance you can add the mpl-core package to `umi` using

```js
.use(mplCandyMachine())
```

You can add the `mpCandyMachine()` package anywhere in your umi instance creation with `.use()`.

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine'

// Use the RPC endpoint of your choice.
const umi = createUmi('http://api.devnet.solana.com')
... // additional umi settings, packages, and signers
.use(mplCandyMachine())
```

From here your `umi` instance will have access to the mpl-core package and you start to explore the mpl-core feature set.
