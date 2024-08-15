---
title: Getting Started using MPL-Hybrid
metaTitle: Javascript SDK | MPL-Hybrid
description: Get started with MPL-Hybrid using JavaScript SDK.
---

Metaplex provides a JavaScript library that can be used to interact with the MPL-Hybrid program. Thanks to the [Umi framework](https://github.com/metaplex-foundation/mpl-hybrid), it ships without many opinionated dependencies thus providing a lightweight library that can be used in any JavaScript project.

To get started, you'll need to [install the Umi framework](https://github.com/metaplex-foundation/umi/blob/main/docs/installation.md) and the MPL-Hybrid JavaScript library.

```sh
npm install @metaplex-foundation/mpl-hybrid
```

Next, you should create your `Umi` instance and install the `mplHybrid` plugin like so.

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplHybrid } from '@metaplex-foundation/mpl-hybrid'

// Use the RPC endpoint of your choice.
const umi = createUmi('http://127.0.0.1:8899').use(mplHybrid())
```

From here you can decide which wallet connection method to use:

- [Local keypair](/umi/connecting-to-umi#connecting-w-a-secret-key)
- [Solana Wallet Adapter](/umi/connecting-to-umi#connecting-w-wallet-adapter).

🔗 **Helpful Links:**

- [Umi Framework](https://github.com/metaplex-foundation/umi)
- [GitHub Repository](https://github.com/metaplex-foundation/mpl-hybrid)
- [NPM Package](https://www.npmjs.com/package/@metaplex-foundation/mpl-hybrid)
- [API References](https://mpl-hybrid.typedoc.metaplex.com/)
