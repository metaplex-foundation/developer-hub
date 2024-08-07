---
title: Getting Started using JavaScript
metaTitle: Javascript SDK | Core Candy Machine
description: Get started using Javascript with the latest mpl-core-candy-machine packages for Core Candy Machine.
---

Metaplex provides a JavaScript library that can be used to interact with the Core Candy Machine program. Thanks to the [Umi framework](https://github.com/metaplex-foundation/umi), it ships without many opinionated dependencies and, thus, provides a lightweight library that can be used in any JavaScript project.

To get started, you'll need to [install the Umi framework](https://github.com/metaplex-foundation/umi/blob/main/docs/installation.md) and the Core Candy Machine JavaScript library.

```sh
npm install \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults \
  @metaplex-foundation/mpl-core-candy-machine
```

Next, you may create your `Umi` instance and install the `mplCore` plugin like so.

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { 
  mplCandyMachine as mplCoreCandyMachine 
} from "@metaplex-foundation/mpl-core-candy-machine";

// Use the RPC endpoint of your choice.
const umi = createUmi('http://127.0.0.1:8899').use(mplCoreCandyMachine())
```

Then you want to tell Umi which wallet to use. This can either be a [keypair](/umi/connecting-to-umi#connecting-w-a-secret-key) or the [solana wallet adapter](/umi/connecting-to-umi#connecting-w-wallet-adapter).

That's it, you can now start interacting with the `Core Candy Machine` program.



🔗 **Helpful Links:**

- [Umi Framework](https://github.com/metaplex-foundation/umi)
- [GitHub Repository](https://github.com/metaplex-foundation/mpl-core-candy-machine)
- [NPM Package](https://www.npmjs.com/package/@metaplex-foundation/mpl-core-candy-machine)
- [API References](https://mpl-core.typedoc.metaplex.com/)
