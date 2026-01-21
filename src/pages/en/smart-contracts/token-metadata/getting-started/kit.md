---
title: Getting Started with Kit SDK
metaTitle: Kit SDK | Token Metadata
description: Get started with NFTs using the Metaplex Token Metadata Kit SDK.
---

The **Kit SDK** (`@metaplex-foundation/mpl-token-metadata-kit`) is built on `@solana/kit` and provides a functional API for interacting with Token Metadata. {% .lead %}

## Installation

```sh
npm install \
  @solana/kit \
  @metaplex-foundation/mpl-token-metadata-kit
```

## Setup

```ts
import { createSolanaRpc } from '@solana/rpc';
import { createSolanaRpcSubscriptions } from '@solana/rpc-subscriptions';
import { generateKeyPairSigner } from '@solana/signers';

// Create RPC connection
const rpc = createSolanaRpc('https://api.devnet.solana.com');
const rpcSubscriptions = createSolanaRpcSubscriptions('wss://api.devnet.solana.com');

// Generate or load a keypair
const authority = await generateKeyPairSigner();
```

### Transaction Helper

The Kit SDK returns instructions that you send using `@solana/kit`:

```ts
import { pipe } from '@solana/functional';
import {
  appendTransactionMessageInstructions,
  createTransactionMessage,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
} from '@solana/transaction-messages';
import {
  compileTransaction,
  signTransaction,
  sendAndConfirmTransactionFactory,
} from '@solana/kit';

async function sendAndConfirm(instructions, signers) {
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

  const transactionMessage = pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayer(signers[0].address, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) => appendTransactionMessageInstructions(instructions, tx)
  );

  const transaction = compileTransaction(transactionMessage);
  const keyPairs = signers.map((s) => s.keyPair);
  const signedTransaction = await signTransaction(keyPairs, transaction);

  const sendAndConfirmTx = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });
  await sendAndConfirmTx(signedTransaction, { commitment: 'confirmed' });
}
```

## Creating an NFT

```ts
import { generateKeyPairSigner } from '@solana/signers';
import { createNft } from '@metaplex-foundation/mpl-token-metadata-kit';

// Generate keypairs
const mint = await generateKeyPairSigner();
const authority = await generateKeyPairSigner();

// Create and mint an NFT
const [createIx, mintIx] = await createNft({
  mint,
  authority,
  payer: authority,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: 550, // 5.5%
  tokenOwner: authority.address,
});

// Send transaction
await sendAndConfirm([createIx, mintIx], [mint, authority]);

console.log('NFT created:', mint.address);
```

## Fetching an NFT

```ts
import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata-kit';

const asset = await fetchDigitalAsset(rpc, mintAddress);

console.log('Name:', asset.metadata.name);
console.log('URI:', asset.metadata.uri);
console.log('Seller Fee:', asset.metadata.sellerFeeBasisPoints);
```

## Helpful Links

- [GitHub Repository](https://github.com/metaplex-foundation/mpl-token-metadata)
- [NPM Package](https://www.npmjs.com/package/@metaplex-foundation/mpl-token-metadata-kit)
- [Solana Kit Documentation](https://github.com/solana-labs/solana-web3.js)
