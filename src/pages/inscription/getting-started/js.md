---
title: Getting Started using JavaScript
metaTitle: Inscription - Getting Started - JavaScript
description: Get started with Inscription using JavaScript
---

Metaplex provides a JavaScript library that can be used to interact with Metaplex Inscriptions. Thanks to the [Umi framework](https://github.com/metaplex-foundation/umi), it ships without many opinionated dependencies and, thus, provides a lightweight library that can be used in any JavaScript project.

To get started, you'll need to [install the Umi framework](https://github.com/metaplex-foundation/umi/blob/main/docs/installation.md) and the Inscriptions JavaScript library.

```sh
npm install \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults \
  @solana/web3.js \
  @metaplex-foundation/mpl-inscriptions
```

Next, you may create your `Umi` instance and install the `MplInscription` plugin like so.

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { MplInscription } from '@metaplex-foundation/mpl-inscription'

// Use the RPC endpoint of your choice.
const umi = createUmi('http://127.0.0.1:8899').use(MplInscription())
```

That's it, you can now interact with Inscriptions by using [the various functions provided by the library](https://mpl-inscription-js-docs.vercel.app/) and passing your `Umi` instance to them. Here's an example of creating on how to mint a simple inscription with small metadata, fetching the data of the inscription and printing the inscription Rank.

```ts
// Step 1: Mint an NFT or pNFT
// See https://developers.metaplex.com/token-metadata/mint

// Step 2: Inscribe metadata

const inscriptionAccount = await findMintInscriptionPda(umi, {
  mint: mint.publicKey,
})
const inscriptionMetadataAccount = await findInscriptionMetadataPda(umi, {
  inscriptionAccount: inscriptionAccount[0],
})
const inscriptionShardAccount = findInscriptionShardPda(umi, {
  shardNumber: Math.floor(Math.random() * 32),
})

await initializeFromMint(umi, {
  mintInscriptionAccount: inscriptionAccount,
  metadataAccount: inscriptionMetadataAccount,
  mintAccount: mint.publicKey,
  tokenMetadataAccount, // The metadata account from token metadata
  inscriptionShardAccount, // For concurrency
})
  .add(
    writeData(umi, {
      inscriptionAccount,
      metadataAccount: inscriptionMetadataAccount,
      value: Buffer.from(
        JSON.stringify(metadata) // your NFT's metadata to be inscribed
      ),
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

🔗 **Helpful Links:**

- [Umi Framework](https://github.com/metaplex-foundation/umi)
- [GitHub Repository](https://github.com/metaplex-foundation/mpl-inscription)
- [NPM Package](https://www.npmjs.com/package/@metaplex-foundation/mpl-inscription)
- [API References](https://mpl-inscription-js-docs.vercel.app/)
