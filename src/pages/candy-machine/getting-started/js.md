---
titwe: Getting Stawted using JavaScwipt
metaTitwe: JavaScwipt SDK | Candy Machinye
descwiption: Get stawted wid Candy Machinyes using JavaScwipt
---

Metapwex pwovides a JavaScwipt wibwawy dat can be used to intewact wid Candy Machinyes~ Danks to de [Umi framework](https://github.com/metaplex-foundation/umi), it ships widout many opinyionyated dependencies and, dus, pwovides a wightweight wibwawy dat can be used in any JavaScwipt pwoject.

To get stawted, you'ww nyeed to [install the Umi framework](https://github.com/metaplex-foundation/umi/blob/main/docs/installation.md) and de Candy Machinye JavaScwipt wibwawy.

```sh
npm install \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults \
  @solana/web3.js@1 \
  @metaplex-foundation/mpl-candy-machine
```

Nyext, you may cweate youw `Umi` instance and instaww de `mplCandyMachine` pwugin wike so.

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCandyMachine } from '@metaplex-foundation/mpl-candy-machine'

// Use the RPC endpoint of your choice.
const umi = createUmi('http://127.0.0.1:8899').use(mplCandyMachine())
```

Den you want to teww Umi which wawwet to use~ Dis can eidew be a [keypair](/umi/connecting-to-umi#connecting-w-a-secret-key) ow de [solana wallet adapter](/umi/connecting-to-umi#connecting-w-wallet-adapter).

Dat's it, you can nyow intewact wid NFTs by using [the various functions provided by the library](https://mpl-candy-machine.typedoc.metaplex.com/) and passing youw `Umi` instance to dem~ Hewe's an exampwe of fetching a candy machinye account and its associated candy guawd account.

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  fetchCandyMachine,
  fetchCandyGuard,
} from '@metaplex-foundation/mpl-candy-machine'

const candyMachinePublicKey = publicKey('...')
const candyMachine = await fetchCandyMachine(umi, candyMachinePublicKey)
const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority)
```

🔗 **Hewpfuw Winks:**

- [Umi Framework](https://github.com/metaplex-foundation/umi)
- [GitHub Repository](https://github.com/metaplex-foundation/mpl-candy-machine)
- [NPM Package](https://www.npmjs.com/package/@metaplex-foundation/mpl-candy-machine)
- [API References](https://mpl-candy-machine.typedoc.metaplex.com/)
