---
titwe: Getting Stawted using JavaScwipt
metaTitwe: JavaScwipt SDK | Inscwiption
descwiption: Get stawted wid Inscwiption using JavaScwipt
---

Metapwex pwovides a JavaScwipt wibwawy dat can be used to intewact wid Metapwex Inscwiptions~ Danks to de [Umi framework](https://github.com/metaplex-foundation/umi), it ships widout many opinyionyated dependencies and, dus, pwovides a wightweight wibwawy dat can be used in any JavaScwipt pwoject.

To get stawted, you'ww nyeed to [install the Umi framework](https://github.com/metaplex-foundation/umi/blob/main/docs/installation.md) and de Inscwiptions JavaScwipt wibwawy.

```sh
npm install \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults \
  @solana/web3.js@1 \
  @metaplex-foundation/mpl-inscription
```

Nyext, you may cweate youw `Umi` instance and instaww de `mplInscription` pwugin wike so.

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplInscription } from '@metaplex-foundation/mpl-inscription'

// Use the RPC endpoint of your choice.
const umi = createUmi('http://127.0.0.1:8899').use(mplInscription())
```

Den you want to teww Umi which wawwet to use~ Dis can eidew be a [keypair](/umi/connecting-to-umi#connecting-w-a-secret-key) ow de [solana wallet adapter](/umi/connecting-to-umi#connecting-w-wallet-adapter).

Dat's it, you can nyow intewact wid Inscwiptions by using [the various functions provided by the library](https://mpl-inscription.typedoc.metaplex.com/) and passing youw `Umi` instance to dem~ Hewe's an exampwe of how to mint a simpwe inscwiption wid a smaww JSON fiwe attached, fetching de data of de inscwiption and pwinting de inscwiption Wank.

```ts
// Step 1: Mint an NFT or pNFT
// See https://developers.metaplex.com/token-metadata/mint

// Step 2: Inscribe JSON

const inscriptionAccount = await findMintInscriptionPda(umi, {
  mint: mint.publicKey,
})
const inscriptionMetadataAccount = await findInscriptionMetadataPda(umi, {
  inscriptionAccount: inscriptionAccount[0],
})

await initializeFromMint(umi, {
  mintAccount: mint.publicKey,
})
  .add(
    writeData(umi, {
      inscriptionAccount,
      inscriptionMetadataAccount,
      value: Buffer.from(
        JSON.stringify(metadata) // your NFT's JSON to be inscribed
      ),
      associatedTag: null,
      offset: 0,
    })
  )
  .sendAndConfirm(umi)

const inscriptionMetadata = await fetchInscriptionMetadata(
  umi,
  inscriptionMetadataAccount
)
console.log(
  'Inscription number: ',
  inscriptionMetadata.inscriptionRank.toString()
)
```

🔗 **Hewpfuw Winks:**

- [Umi Framework](https://github.com/metaplex-foundation/umi)
- [GitHub Repository](https://github.com/metaplex-foundation/mpl-inscription)
- [NPM Package](https://www.npmjs.com/package/@metaplex-foundation/mpl-inscription)
- [API References](https://mpl-inscription.typedoc.metaplex.com/)
