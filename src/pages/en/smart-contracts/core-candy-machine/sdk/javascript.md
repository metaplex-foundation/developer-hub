---
title: MPL Core Candy Machine JavaScript SDK
metaTitle: JavaScript SDK | MPL Core Candy Machine
description: Learn how to install and configure the MPL Core Candy Machine JavaScript SDK using the Umi framework to create and manage Candy Machines on Solana.
keywords:
  - core candy machine
  - javascript sdk
  - mpl-core-candy-machine
  - umi framework
  - solana nft
  - candy machine javascript
  - metaplex sdk
  - nft minting
  - npm package
  - typescript
  - candy machine setup
about:
  - JavaScript SDK
  - Umi framework
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

## Summary

The MPL Core Candy Machine JavaScript SDK provides a lightweight library for creating and managing Core Candy Machines on Solana using the [Umi framework](/dev-tools/umi). {% .lead %}

- Install the `@metaplex-foundation/mpl-core-candy-machine` package via npm, yarn, or bun
- Requires a configured [Umi](/dev-tools/umi/getting-started) instance with an RPC endpoint and signer
- Register the SDK as a plugin on your Umi instance with `.use(mplCandyMachine())`
- Compatible with any JavaScript or TypeScript project

## Installation

The `@metaplex-foundation/mpl-core-candy-machine` package can be installed with any JavaScript package manager including npm, yarn, and bun.

```sh
npm install @metaplex-foundation/mpl-core-candy-machine
```

{% quick-links %}

{% quick-link title="typedoc" target="_blank" icon="JavaScript" href="https://mpl-core-candy-machine.typedoc.metaplex.com/" description="MPL Core Candy Machine Javascript SDK generated package API documentation." /%}

{% quick-link title="npmjs.com" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/mpl-core-candy-machine" description="MPL Core Candy Machine Javascript SDK on NPM." /%}

{% /quick-links %}

## Umi Setup

A configured [Umi](/dev-tools/umi/getting-started) instance is required before you can interact with the Core Candy Machine SDK. If you have not yet set up Umi, visit the [Umi Getting Started](/dev-tools/umi/getting-started) page to configure your RPC endpoint and identity signer.

During the initialization of the `umi` instance you can add the mpl-core package to `umi` using

```js
.use(mplCandyMachine())
```

You can add the `mplCandyMachine()` package anywhere in your umi instance creation with `.use()`.

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine'

// Use the RPC endpoint of your choice.
const umi = createUmi('http://api.devnet.solana.com')
... // additional umi settings, packages, and signers
.use(mplCandyMachine())
```

From here your `umi` instance will have access to the mpl-core package and you can start exploring the Core Candy Machine feature set.

## Notes

- The JavaScript SDK requires the [Umi framework](/dev-tools/umi) as a peer dependency. You must install and configure Umi before using this SDK.
- A Solana RPC endpoint is required. Use a dedicated RPC provider for production deployments rather than the public endpoint.
- This SDK covers both the Core Candy Machine program and the Core Candy Guard program in a single package.

