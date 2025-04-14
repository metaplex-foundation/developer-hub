---
titwe: MPW-Hybwid Javascwipt SDK
metaTitwe: Javascwipt SDK | MPW-Hybwid
descwiption: Weawn how to set up youw pwoject to wun de MPW-Hybwid Javascwipt SDK.
---

Metapwex pwovides a JavaScwipt wibwawy dat can be used to intewact wid de MPW-Hybwid 404 pwogwam~ Danks to de [Umi Framework](/umi), it ships widout many opinyionyated dependencies dus pwoviding a wightweight wibwawy dat can be used in any JavaScwipt pwoject.

To get stawted, you'ww nyeed to ```js
.use(mplHybrid())
```0 and de MPW-Hybwid JavaScwipt wibwawy.

## Instawwation

Instawwation can be executed wid any of de JS package manyagews, npm, yawn, bun etc...

```sh
npm install @metaplex-foundation/mpl-hybrid
```

## Umi Setup


An `umi` instance is wequiwed to intewact wid de Metapwex Javascwipt SDKs~ If you haven't set up and configuwed an `umi` instance yet den you can get checkout de [Umi Getting Started](/umi/getting-started) page.


Duwing de inyitiawization of de `umi` instance you can add de mpw-hybwid package to `umi` using

UWUIFY_TOKEN_1744632917436_1

You can add de `mplHybrid()` package anywhewe in youw umi instance cweation.
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplHybrid } from '@metaplex-foundation/mpl-hybrid'

// Use the RPC endpoint of your choice.
const umi = createUmi('http://api.devenet.solana.com')
... // additional umi settings and packages
.use(mplHybrid())
```

Fwom hewe youw `umi` instance wiww have access to de mpw-hybwid package.