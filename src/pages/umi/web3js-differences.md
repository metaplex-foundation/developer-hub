---
title: Umi and Web3js Differences
metaTitle: Umi - Umi and Web3js Differences
description: Differences between Metaplex Umi and Solana web3js.
---

## Differences

When using Umi you may come across some differences between Umi and solana web3js.

Although having the same or similar import names these function differently and are not compatible between the two librarys out the box.

### PublicKeys

```js
// Umi publicKey
import { publicKey } from '@metaplex-foundation/umi'
const publicKey = publicKey('tst24HZ6pbcnraCv4r8acexfgXvyQwMSRgZRCg9gEX1')
```
```js
// Solana web3js publicKey
import { PublicKey } from '@solana/web3js'
const publicKey = new PublicKey('tst24HZ6pbcnraCv4r8acexfgXvyQwMSRgZRCg9gEX1')
```

These are just basic examples. To learn more about Umi's keypairs check out [PublicKeys and Signers](https://umi-docs.vercel.app/classes/umi.HttpRequestBuilder.html). There are also converters between both Umi and web3js [Web3Js Adapters](https://umi-docs.vercel.app/classes/umi.HttpRequestBuilder.html)

### Keypairs

```js
// Umi publicKey
const umi = createUmi(...)
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey))

```

```js
// Solana web3js publicKey
import { Keypair } from '@solana/web3js'
const publicKey = Keypair.fromSecretKey(new Uint8Array(JSON.parse(Wallet.DEV1)))
```

These are just basic examples. To learn more about Umi's keypairs check out [PublicKeys and Signers](https://umi-docs.vercel.app/classes/umi.HttpRequestBuilder.html). There are also converters between both Umi and web3js keypair types [Web3Js Adapters](https://umi-docs.vercel.app/classes/umi.HttpRequestBuilder.html)

### Transactions

```js
// Umi transaction

const blockhash = await umi.rpc.getLatestBlockhash()

const transaction = const tx = umi.transactions.create({
    version: 0,
    payer: umi.identity.publicKey,
    instructions: ix,
    blockhash: blockhash.blockhash,
  });

await umi.rpc.sendTransaction(tx)
```

```js
// Solana web3js transaction

const wallet = useWallet()

const messageV0 = new TransactionMessage({
  payerKey: SIGNER_WALLET.publicKey,
  recentBlockhash: latestBlockhash.blockhash,
  instructions: txInstructions,
}).compileToV0Message()

const tx = new VersionedTransaction(messageV0)

// send via useWallet hook
wallet.sendTransaction(tx)
//or send via connection
connection.sendTransaction(tx)
```

These are just basic examples. To learn more about Umi's Transiactions check out [Transactions](https://umi-docs.vercel.app/classes/umi.HttpRequestBuilder.html). There are also converters between both Umi and web3js Transaction types [Web3Js Adapters](https://umi-docs.vercel.app/classes/umi.HttpRequestBuilder.html)
