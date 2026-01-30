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
import { createSolanaRpc, createSolanaRpcSubscriptions, generateKeyPairSigner } from '@solana/kit';

// Create RPC connection
const rpc = createSolanaRpc('https://api.devnet.solana.com');
const rpcSubscriptions = createSolanaRpcSubscriptions('wss://api.devnet.solana.com');

// Generate or load a keypair
const authority = await generateKeyPairSigner();
```

### Transaction Helper

The Kit SDK returns instructions with signers already attached to the relevant accounts. This allows you to use `signTransactionMessageWithSigners` which automatically extracts and uses these signers:

```ts
import {
  appendTransactionMessageInstructions,
  createTransactionMessage,
  getSignatureFromTransaction,
  type Instruction,
  type TransactionSigner,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from '@solana/kit';

async function sendAndConfirm(options: {
  instructions: Instruction[];
  payer: TransactionSigner;
}) {
  const { instructions, payer } = options;
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

  const transactionMessage = pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayer(payer.address, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) => appendTransactionMessageInstructions(instructions, tx),
  );

  // Sign with all signers attached to instruction accounts
  const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);

  const sendAndConfirmTx = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });
  await sendAndConfirmTx(signedTransaction, { commitment: 'confirmed' });

  return getSignatureFromTransaction(signedTransaction);
}
```

## Creating an NFT

```ts
import { generateKeyPairSigner } from '@solana/kit';
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
const sx = await sendAndConfirm({
  instructions: [createIx, mintIx],
  payer: authority,
});

console.log('NFT created:', mint.address);
console.log('Signature:', sx);
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
