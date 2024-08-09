---
title: Web3.js Differences and Adapters
metaTitle: Umi - Web3.js Differences and Adapters
description: Difference and Adapters to make Metaplex Umi work with Solana web3js.
---

The `@solana/web3.js` library is currently widely used in the Solana ecosystem and defines its own types for `Publickeys`, `Transactions`, `Instructions`, etc. 

When creating `Umi`, we wanted to move away from the class-based types defined in `@solana/web3.js` and instead use a more functional approach by relying only on TypeScript types. This unfortunately means that, although having the same or similar import names, not all types from `@solana/web3.js` are compatible with the ones provided by `Umi` and vice versa.

To help with this issue, `Umi` provides a set of adapters that allows to parse types to and from their `Web3.js` counterparts and they can be found in the [`@metaplex-foundation/umi-web3js-adapters`](https://www.npmjs.com/package/@metaplex-foundation/umi-web3js-adapters) package.

## Required Package and Imports

The package where you can find all the helper methods to convert to and from Web3.js types is the `umi-web3js-adapters` package. This package can be individually installed using the following command:

The `umi-web3js-adapters` package provides all the helper methods to convert between Umi and Web3.js types. Although you can install it separately usign the following command:

```
npm i @metaplex-foundation/umi-web3js-adapters
```

It's not necessary because this package get's already installed when you install the `@metaplex-foundation/umi` package.

**Here are the imports you’ll have access to:**

```ts
import { 
  // Keypairs
  fromWeb3JsKeypair, toWeb3JsKeypair,
  // Publickey
  fromWeb3JsPublicKey, toWeb3JsPublicKey,
  // Instructions
  fromWeb3JsInstruction, toWeb3JsInstruction,
  // Legacy Transactions
  fromWeb3JsLegacyTransaction, toWeb3JsLegacyTransaction,
  // Versioned Transactions
  fromWeb3JsTransaction, toWeb3JsTransaction, 
  // Messages
  fromWeb3JsMessage, toWeb3JsMessage, toWeb3JsMessageFromInput
} from '@metaplex-foundation/umi-web3js-adapters';
```

## Publickeys

Generating publickeys might seem similar at first sight, but there are some subtle differences between the packages. Web3Js uses a capital `P` and requires `new`, while the Umi version uses a lowercase `p`.

### Umi
```ts
import { publicKey } from '@metaplex-foundation/umi';

// Generate a new Umi Publickey
const umiPublicKey = publicKey("11111111111111111111111111111111");
```

### Web3Js
```ts
import { PublicKey } from '@solana/web3.js';

// Generate a new Web3Js Publickey
const web3jsPublickey = new PublicKey("<1111111111111111111111111111111111111111>");
```

Next, let's look into how to use the adapters.

### From Web3Js to Umi
```ts
import { PublicKey } from '@solana/web3.js';
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';

// Generate a new Publickey
const web3jsPublickey = new PublicKey("<1111111111111111111111111111111111111111>");

// Convert it using the UmiWeb3jsAdapters Package
const umiPublicKey = fromWeb3JsPublicKey(web3jsPublickey);
```

### From Umi to Web3Js
```ts
import { publicKey } from '@metaplex-foundation/umi';
import { toWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';

// Generate a new Publickey
const umiPublicKey = publicKey("11111111111111111111111111111111");

// Convert it using the UmiWeb3jsAdapters Package
const web3jsPublickey = toWeb3JsPublicKey(umiPublicKey);
```

## Keypairs

Generating keypairs is where the difference from Web3Js and Umi increase. With Web3Js, you can simply use `Keypair.generate()`, however, in Umi, you first need to create an Umi instance, which you'll use for most Umi and Metaplex-related operations.

### Umi
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { generateSigner, createSignerFromKeypair } from '@metaplex-foundation/umi'

// Generate a new Umi instance
const umi = createUmi('https://api.devnet.solana.com')

// Generate a new Umi keypair
const umiKeypair = generateSigner(umi)

// Or use an existing one
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));
```

### Web3Js
```ts
import { Keypair } from '@solana/web3.js';

// Generate a new Web3Js keypair
const web3jsKeypair = Keypair.generate();

// Or use an existing one
const web3jsKeypair = Keypair.fromSecretKey(new Uint8Array(walletFile));
```

Next, let's look into how to use the adapters.

### From Web3Js to Umi
```ts
import { Keypair } from '@solana/web3.js';
import { fromWeb3JsKeypair } from '@metaplex-foundation/umi-web3js-adapters';

// Generate a new keypair
const web3jsKeypair = Keypair.generate();

// Convert it using the UmiWeb3jsAdapters Package
const umiKeypair = fromWeb3JsKeypair(web3jsKeypair);
```

### From Umi to Web3Js
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { generateSigner } from '@metaplex-foundation/umi'
import { toWeb3JsKeypair } from '@metaplex-foundation/umi-web3js-adapters';

// Generate a new Umi instance
const umi = createUmi('https://api.devnet.solana.com')

// Generate a new keypair
const umiKeypair = generateSigner(umi)

// Convert it using the UmiWeb3jsAdapters Package
const web3jsKeypair = toWeb3JsKeypair(umiKeypair);
```

## Instructions

When creating instructions, the key difference with Umi is that you must first create an Umi instance (as with `Keypairs`). Additionally, `getInstructions()` returns an array of instructions instead of a single one.

For most use cases, handling individual instructions isn't necessary anyway, as this can be simplified using other helpers and transaction builders.

### Umi
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { transfer, mplCore } from '@metaplex-foundation/mpl-core'

// Generate a new Umi instance
const umi = createUmi('https://api.devnet.solana.com').use(mplCore())

// Create a new instruction (like a core nft transfer)
// get instructions will give you an Array of instructions
const umiInstructions = transfer(umi, {...TransferParams}).getInstructions();
```

### Web3Js
```ts
import { SystemProgram } from '@solana/web3.js';

// Create a new instruction (like a lamport transfer)
const web3jsInstruction = SystemProgram.transfer({...TransferParams})
```

Next, let's look into how to use the adapters.

### From Web3Js to Umi
```ts
import { SystemProgram } from '@solana/web3.js';
import { fromWeb3JsInstruction } from '@metaplex-foundation/umi-web3js-adapters';

// Generate a new Umi instance
const umi = createUmi('https://api.devnet.solana.com')

// Create a new instruction (like a lamport transfer)
const web3jsInstruction = SystemProgram.transfer({...TransferParams})

// Convert it using the UmiWeb3jsAdapters Package
const umiInstruction = fromWeb3JsInstruction(web3jsInstruction);
```

### From Umi to Web3Js
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { transfer, mplCore } from '@metaplex-foundation/mpl-core'
import { toWeb3JsInstruction } from '@metaplex-foundation/umi-web3js-adapters';

// Generate a new Umi instance
const umi = createUmi('https://api.devnet.solana.com').use(mplCore())

// Create a new instruction (like a core nft transfer)
const umiInstruction = transfer(umi, {...TransferParams}).getInstructions();

// Convert it using the UmiWeb3jsAdapters Package
const web3jsInstruction = umiInstruction.map(toWeb3JsInstruction);
```

## Transactions

The Solana runtime supports two transaction versions:
- Legacy Transaction: Older transaction format with no additional benefit
- 0 / Versioned Transaction: Added support for Address Lookup Tables

**Note**: if you're not familiar with the concept of Versioned Transactions, read more about it [here](https://solana.com/en/docs/advanced/versions)

For `umi` and `umi-web3js-adapters` we added support for both transaction types! 

### Umi
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { transfer, mplCore } from '@metaplex-foundation/mpl-core'
// Generate a new Umi instance
const umi = createUmi('https://api.devnet.solana.com').use(mplCore())

// Create a new Umi Legacy Transaction
const umiTransaction = transfer(umi, {...TransferParams}).useLegacyVersion();

// Create a new Umi Versioned Transaction
const umiVersionedTransaction = transfer(umi, {...TransferParams}).useV0().build(umi)
```

### Web3Js
```ts
import { Transaction, VersionedTransaction, TransactionMessage, Connection, clusterApiUrl, SystemProgram } from '@solana/web3.js';

// Create a new Web3Js Legacy Transaction
const web3jsTransaction = new Transaction().add(SystemProgram.transfer({...TransferParams}));

// Create a new Web3Js Versioned Transaction
const instructions = [SystemProgram.transfer({...TransferParams})];

const connection = new Connection(clusterApiUrl("devnet"));
const blockhash = await connection.getLatestBlockhash().then(res => res.blockhash);

const messageV0 = new TransactionMessage({
  payerKey: payer.publicKey,
  recentBlockhash: blockhash,
  instructions,
}).compileToV0Message();

const web3jsVersionedTransaction = new VersionedTransaction(messageV0);
```

### From Web3Js to Umi
```ts
import { Transaction, VersionedTransaction, TransactionMessage, Connection, clusterApiUrl, SystemProgram } from '@solana/web3.js';
import { fromWeb3JsLegacyTransaction, fromWeb3JsTransaction } from '@metaplex-foundation/umi-web3js-adapters';

// Create a new Legacy Transaction
const web3jsTransaction = new Transaction().add(SystemProgram.transfer({...TransferParams}));

// Convert it using the UmiWeb3jsAdapters Package
const umiTransaction = fromWeb3JsLegacyTransaction(web3jsTransaction);

/// Versioned Transactions ///

// Create a new Versioned Transaction
const web3jsVersionedTransaction = new VersionedTransaction(...messageV0Params);

// Convert it using the UmiWeb3jsAdapters Package
const umiVersionedTransaction = fromWeb3JsTransaction(web3jsVersionedTransaction);
```

### From Umi to Web3Js
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { transfer } from '@metaplex-foundation/mpl-core'
import { toWeb3JsLegacyTransaction, toWeb3JsTransaction } from '@metaplex-foundation/umi-web3js-adapters';

// Generate a new Umi instance
const umi = createUmi('https://api.devnet.solana.com').use(mplCore())

// Create a new Legacy Transaction
const umiTransaction = transfer(umi, {...TransferParams}).useLegacyVersion();

// Convert it using the UmiWeb3jsAdapters Package
const web3jsTransaction = toWeb3JsTransaction(umiTransaction);

/// Versioned Transactions ///

// Create a new Versioned Transaction
const umiVersionedTransaction = umi.transactions.create({...createParams});

// Convert it using the UmiWeb3jsAdapters Package
const web3jsVersionedTransaction = toWeb3JsTransaction(umiVersionedTransaction);
```


## Messages 

We've already covered creating messages during versioned transaction creation. Let's review it again.

### Umi
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { transfer, mplCore } from '@metaplex-foundation/mpl-core'

// Generate a new Umi instance
const umi = createUmi('https://api.devnet.solana.com').use(mplCore())

// Create a new Umi Message
const blockhash = await umi.rpc.getLatestBlockhash()

const instructions = transfer(umi, {...TransferParams}).getInstructions()

const umiVersionedTransaction = umi.transactions.create({
  version: 0,
  payer: frontEndSigner.publicKey,
  instructions,
  blockhash: blockhash.blockhash,
});

const umiMessage = umiVersionedTransaction.message
```

### Web3Js
```ts
import { TransactionMessage, Connection, clusterApiUrl, SystemProgram } from '@solana/web3.js';

// Create a new Web3Js Message
const connection = new Connection(clusterApiUrl("devnet"));
const minRent = await connection.getMinimumBalanceForRentExemption(0);
const blockhash = await connection.getLatestBlockhash().then(res => res.blockhash);

const instructions = [SystemProgram.transfer({...TransferParams})];

const Web3JsMessage = new TransactionMessage({
  payerKey: payer.publicKey,
  recentBlockhash: blockhash,
  instructions,
}).compileToV0Message();
```

Next, let's look into how to use the adapters.

### From Web3Js to Umi
```ts
import { TransactionMessage } from '@solana/web3.js';
import { fromWeb3JMessage } from '@metaplex-foundation/umi-web3js-adapters';

// Create a new Versioned Transaction
const Web3JsMessage = new TransactionMessage({...createMessageParams}).compileToV0Message();

// Convert it using the UmiWeb3jsAdapters Package
const umiMessage = fromWeb3JMessage(Web3JsMessage);
```

### From Umi to Web3Js
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { toWeb3JMessage } from '@metaplex-foundation/umi-web3js-adapters';

// Generate a new Umi instance
const umi = createUmi('https://api.devnet.solana.com').use(mplCore())

// Create a new Versioned Transaction
const umiMessage = umi.transactions.create({...createParams}).message;

// Convert it using the UmiWeb3jsAdapters Package
const web3jsMessage = toWeb3JMessage(umiMessage);
```
