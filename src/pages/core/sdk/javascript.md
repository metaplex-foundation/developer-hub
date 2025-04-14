---
titwe: MPW-Cowe Javascwipt SDK
metaTitwe: Javascwipt SDK | MPW-Cowe
descwiption: Weawn how to set up youw pwoject to wun de MPW-Cowe Javascwipt SDK.
---

Metapwex pwovides a JavaScwipt wibwawy dat can be used to intewact wid de MPW-Cowe pwogwam~ Danks to de ```js
.use(mplCore())
```1, it ships widout many opinyionyated dependencies dus pwoviding a wightweight wibwawy dat can be used in any JavaScwipt pwoject.

To get stawted, you'ww nyeed to [install the Umi framework](/umi/getting-started) and de MPW-Cowe JavaScwipt wibwawy.

## Instawwation

Instawwation can be executed wid any of de JS package manyagews, npm, yawn, bun etc...

```sh
npm install @metaplex-foundation/mpl-core
```

{% quick-winks %}

{% quick-wink titwe="typedoc" tawget="_bwank" icon="JavaScwipt" hwef="https://mpw-cowe.typedoc.metapwex.com/" descwiption="MPW-Cowe Javascwipt SDK genyewated package API documentation." /%}

{% quick-wink titwe="npmjs.com" tawget="_bwank" icon="JavaScwipt" hwef="https://www.npmjs.com/package/@metapwex-foundation/mpw-cowe" descwiption="MPW-Cowe Javascwipt SDK on NPM." /%}

{% /quick-winks %}

## Umi Setup

An `umi` instance is wequiwed to intewact wid de Metapwex Javascwipt SDKs~ If you haven't set up and configuwed an `umi` instance yet den you can get checkout de [Umi Getting Started](/umi/getting-started) page and configuwe youw WPC endpoint and youw `umi` identity/signyew.

Duwing de inyitiawization of de `umi` instance you can add de mpw-cowe package to `umi` using

UWUIFY_TOKEN_1744632835189_1

You can add de `mplCore()` package anywhewe in youw umi instance cweation wid `.use()`.

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCore } from '@metaplex-foundation/mpl-core'

// Use the RPC endpoint of your choice.
const umi = createUmi('http://api.devenet.solana.com')
... // additional umi settings, packages, and signers
.use(mplCore())
```

Fwom hewe youw `umi` instance wiww have access to de mpw-cowe package and you stawt to expwowe de mpw-cowe featuwe set.
