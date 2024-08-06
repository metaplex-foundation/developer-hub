---
title: Web3.js adapters
metaTitle: Umi - Web3.js adapters
description: Adapters to make Metaplex Umi work with Solana web3js.
---

The `@solana/web3.js` library is currently widely used in the Solana ecosystem and defines its own types for `Publickeys`, `Transactions`, `Instructions`, etc. 

When creating `Umi`, we wanted to move away from the class-based types defined in `@solana/web3.js` and instead use a more functional approach by relying only on TypeScript types. This unfortunately means that not all types from `@solana/web3.js` are compatible with the ones provided by `Umi` and vice versa.

To help with this issue, `Umi` provides a set of adapters that allows to parse types to and from their `Web3.js` counterparts and they can be found in the [`@metaplex-foundation/umi-web3js-adapters`](https://www.npmjs.com/package/@metaplex-foundation/umi-web3js-adapters) package.

## Required Package 

To install the `umi-web3js-adapters` package and be abel to access to a bunch of helper methods to convert to and from Web3.js types, use the following commands:

```
npm i @metaplex-foundation/umi-web3js-adapters
```

And this are all the imports that you will gain access to

```ts
import { 
  // Instructions
  fromWeb3JsInstruction, toWeb3JsInstruction,
  // Keypairs
  fromWeb3JsKeypair, toWeb3JsKeypair,
  // Publickey
  fromWeb3JsPublicKey, toWeb3JsPublicKey,
  // Legacy Transactions
  fromWeb3JsLegacyTransaction, toWeb3JsLegacyTransaction,
  // Versioned Transactions
  fromWeb3JsTransaction, toWeb3JsTransaction, 
  // Messages
  fromWeb3JsMessage, toWeb3JsMessage, toWeb3JsMessageFromInput
} from '@metaplex-foundation/umi-web3js-adapters';
```

## Publickeys

Let's look into how the different publickey types gets generated and can be transformed:

**From Web3Js to Umi**
```ts
import { PublicKey } from '@solana/web3.js';
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';

// Generate a new Publickey
const web3jsPublickey = new PublicKey("<SOLANA_PUBLIC_KEY>");

// Convert it using the UmiWeb3jsAdapters Package
const umiPublicKey = fromWeb3JsPublicKey(web3jsPublickey);
```

**From Umi to Web3Js**
```ts
import { publicKey } from '@metaplex-foundation/umi';
import { toWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';

// Generate a new Publickey
const umiPublicKey = publicKey("<SOLANA_PUBLIC_KEY>");

// Convert it using the UmiWeb3jsAdapters Package
const web3jsPublickey = toWeb3JsPublicKey(umiPublicKey);
```

## Keypairs

Let's look into how the different keypair types gets generated and can be transformed:

**From Web3Js to Umi**
```ts
import { Keypair } from '@solana/web3.js';
import { fromWeb3JsKeypair } from '@metaplex-foundation/umi-web3js-adapters';

// Generate a new keypair
const web3jsKeypair = Keypair.generate();

// Or use an existing one
const web3jsKeypair = Keypair.fromSecretKey(new Uint8Array(walletFile));

// Convert it using the UmiWeb3jsAdapters Package
const umiKeypair = fromWeb3JsKeypair(web3jsKeypair);
```

**From Umi to Web3Js**
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { generateSigner, createSignerFromKeypair } from '@metaplex-foundation/umi'
import { toWeb3JsKeypair } from '@metaplex-foundation/umi-web3js-adapters';

// Generate a new Umi instance
const umi = createUmi('https://api.devnet.solana.com')

// Generate a new keypair
const umiKeypair = generateSigner(umi)

// Or use an existing one
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

// Convert it using the UmiWeb3jsAdapters Package
const web3jsKeypair = toWeb3JsKeypair(umiKeypair);
```

## Instructions

Let's look into how the different instructions types gets generated and can be transformed:

**From Web3Js to Umi**
```ts
import { SystemProgram } from '@solana/web3.js';
import { fromWeb3JsInstruction } from '@metaplex-foundation/umi-web3js-adapters';

// Create a new instruction (like a lamport transfer)
const web3jsInstruction = SystemProgram.transfer(...)

// Convert it using the UmiWeb3jsAdapters Package
const umiInstruction = fromWeb3JsInstruction(web3jsInstruction);
```

**From Umi to Web3Js**
```ts
import { transfer } from '@metaplex-foundation/mpl-core'
import { toWeb3JsInstruction } from '@metaplex-foundation/umi-web3js-adapters';

// Create a new instruction (like a core nft transfer)
// get instructions will give you an Array of instructions
const umiInstruction = transfer().getInstructions();

// Convert it using the UmiWeb3jsAdapters Package
const web3jsInstruction = umiInstruction.map(toWeb3JsInstruction);
```

## Transactions

The Solana runtime supports two transaction versions:
- Legacy Transaction: older transaction format with no additional benefit
- 0 / Versioned Transaction: added support for Address Lookup Tables

So for the `umi-web3js-adapters` we added support for both! 

Note: if you're not familiar with the concept of Versioned Transactions, read more about it [here](https://solana.com/it/docs/advanced/versions)

**From Web3Js to Umi**
```ts
import { Transaction, VersionedTransaction, TransactionMessage, Connection, clusterApiUrl, SystemProgram } from '@solana/web3.js';
import { fromWeb3JsLegacyTransaction, fromWeb3JsTransaction } from '@metaplex-foundation/umi-web3js-adapters';

// Create a new Legacy Transaction
const web3jsTransaction = new Transaction();

// Convert it using the UmiWeb3jsAdapters Package
const umiTransaction = fromWeb3JsLegacyTransaction(web3jsTransaction);


// Create a new Versioned Transaction
const connection = new Connection(clusterApiUrl("devnet"));
const minRent = await connection.getMinimumBalanceForRentExemption(0);
const blockhash = await connection.getLatestBlockhash().then(res => res.blockhash);

const instructions = [SystemProgram.transfer()];

const messageV0 = new TransactionMessage({
  payerKey: payer.publicKey,
  recentBlockhash: blockhash,
  instructions,
}).compileToV0Message();
const web3jsVersionedTransaction = new VersionedTransaction(messageV0);

// Convert it using the UmiWeb3jsAdapters Package
const umiVersionedTransaction = fromWeb3JsTransaction(web3jsVersionedTransaction);

```

**From Umi to Web3Js**
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { transfer } from '@metaplex-foundation/mpl-core'
import { toWeb3JsLegacyTransaction, toWeb3JsTransaction } from '@metaplex-foundation/umi-web3js-adapters';

// Generate a new Umi instance
const umi = createUmi('https://api.devnet.solana.com')

// Create a new Legacy Transaction
const umiTransaction = transfer().useLegacyVersion();

// Convert it using the UmiWeb3jsAdapters Package
const web3jsTransaction = toWeb3JsTransaction(umiTransaction);


// Create a new Versioned Transaction
const blockhash = await umi.rpc.getLatestBlockhash()

const instructions = create().getInstructions()

const umiVersionedTransaction = umi.transactions.create({
  version: 0,
  payer: frontEndSigner.publicKey,
  instructions: createAssetIx,
  blockhash: blockhash.blockhash,
});

// Convert it using the UmiWeb3jsAdapters Package
const web3jsVersionedTransaction = toWeb3JsTransaction(umiVersionedTransaction);
```

## Messages

```ts
// For transaction messages.
fromWeb3JsMessage(myWeb3JsTransactionMessage)
toWeb3JsMessage(myUmiTransactionMessage)
toWeb3JsMessageFromInput(myUmiTransactionInput)
```

Let's take a look at an example. Say you want to issue a vanilla token using the `@identity.com/solana-gateway-ts` library which relies on `@solana/web3.js`. It offers an `issueVanilla` function that creates an instruction but this isn't compatible with Umi.

To go around this, you could create a wrapper function that converts the `issueVanilla` function into a Umi-compatible one. Precisely, this means we need to convert the returned instruction using `fromWeb3JsInstruction` and convert any public key passed into the function using `toWeb3JsPublicKey`.
