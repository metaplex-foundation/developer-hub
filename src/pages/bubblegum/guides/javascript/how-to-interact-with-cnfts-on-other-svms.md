---
title: How to Interact with cNFTs on Other SVMs
metaTitle: How to Interact with cNFTs on Other SVMs | Bubblegum
description: How to Interact with compressed NFTs, using the Metaplex Bubblegum program, on Solana Virtual Machine (SVM) environments other than Solana devnet and mainnet-beta.
---

## Overview

This guide details the specific requirements for interacting with compressed NFT (cNFT) assets using JavaScript on Solana Virtual Machine (SVM) environments other than Solana's devnet and mainnet-beta. For a more comprehensive overview of creating cNFTs, see the [Create 1,000,000 NFTs on Solana with Bubblegum](/bubblegum/guides/javascript/how-to-create-1000000-nfts-on-solana) guide.

### Required Package

This guide makes use of a specific beta npm package for `@metaplex-foundation/mpl-bubblegum`.  Install using:

```bash
npm -i @metaplex-foundation/mpl-bubblegum@4.3.1-beta.0
```

### Connecting to the SVM

Note you will need to create your umi instance using the endpoint for the SVM.

```ts
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

const umi = createUmi('<RPC endpoint for the SVM>')
  .use(mplBubblegum())
  .use(mplTokenMetadata())
  .use(
    irysUploader({
      ...
    })
  )
```

### Creating a Tree

{% callout title="Tree Cost" type="warning" %}
We are creating a Merkle Tree that with a real up-front SOL cost that will vary depending on the tree size and the specific SVM you are using. Until you are ready, please try this example on devnet only, as Merkle Trees can not be closed or refunded.
{% /callout %}

Creating a tree can be done using the same `createTree` function that is used on Solana devnet/mainnet-beta. However, we must override the default `logWrapper` and `compressionProgram` values. This could be accomplished as simply as:

```ts
import {
  createTree,
  MPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  MPL_NOOP_PROGRAM_ID,
} from '@metaplex-foundation/mpl-bubblegum'
import {
  generateSigner,
  publicKey,
} from '@metaplex-foundation/umi';

// Create a Merkle tree specifying the correct `logWrapper` and
// `compressionProgram` for the SVM.
const merkleTree = generateSigner(umi);
const createTreeTx = await createTree(umi, {
  merkleTree,
  maxDepth: 3,
  maxBufferSize: 8,
  canopyDepth: 0,
  logWrapper: MPL_NOOP_PROGRAM_ID,
  compressionProgram: MPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
});

await createTreeTx.sendAndConfirm(umi);
```

However, a helper function has been provided to automatically resolve these program IDs, and this is the recommended approach as it will work on Solana devnet/mainnet-beta as well as other SVMs to which Bubblegum has been deployed:

```ts
import {
  getCompressionPrograms,
  createTree,
} from '@metaplex-foundation/mpl-bubblegum'
import {
  generateSigner,
  publicKey,
} from '@metaplex-foundation/umi';

// Create a Merkle tree using the `getCompressionPrograms` helper function.
const merkleTree = generateSigner(umi);
const createTreeTx = await createTree(umi, {
  merkleTree,
  maxDepth: 3,
  maxBufferSize: 8,
  canopyDepth: 0,
  ...(await getCompressionPrograms(umi)),
});

await createTreeTx.sendAndConfirm(umi);
```

### Mint and Transfer a cNFT

Similarly to creating the Merkle tree on another SVM, other SDK functions such as `mintV1` and `transfer` will also require specifying the compression programs.  Again we use the `getCompressionPrograms` helper.

```ts
import {
  fetchMerkleTree,
  getCurrentRoot,
  hashMetadataCreators,
  hashMetadataData,
  transfer,
  getCompressionPrograms,
  createTree,
  MetadataArgsArgs,
  mintV1,
} from '@metaplex-foundation/mpl-bubblegum'
import {
  generateSigner,
  none,
} from '@metaplex-foundation/umi';

// Get leaf index before minting.
const leafIndex = Number(
  (await fetchMerkleTree(umi, merkleTree.publicKey)).tree.activeIndex
);

// Define Metadata.
const metadata: MetadataArgsArgs = {
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: 500, // 5%
  collection: none(),
  creators: [],
};

// Mint a cNFT.
const originalOwner = generateSigner(umi);
const mintTxn = await mintV1(umi, {
  leafOwner: originalOwner.publicKey,
  merkleTree: merkleTree.publicKey,
  metadata,
  ...(await getCompressionPrograms(umi)),
}).sendAndConfirm(umi);

// Transfer the cNFT to a new owner.
const newOwner = generateSigner(umi);
const merkleTreeAccount = await fetchMerkleTree(umi, merkleTree.publicKey);
const transferTxn = await transfer(umi, {
  leafOwner: originalOwner,
  newLeafOwner: newOwner.publicKey,
  merkleTree: merkleTree.publicKey,
  root: getCurrentRoot(merkleTreeAccount.tree),
  dataHash: hashMetadataData(metadata),
  creatorHash: hashMetadataCreators(metadata.creators),
  nonce: leafIndex,
  index: leafIndex,
  proof: [],
  ...(await getCompressionPrograms(umi)),
}).sendAndConfirm(umi);
```
