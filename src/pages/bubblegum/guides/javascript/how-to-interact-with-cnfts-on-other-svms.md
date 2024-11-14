---
title: How to Interact with cNFTs on Other SVMs
metaTitle: How to Interact with cNFTs on Other SVMs | Bubblegum
description: How to Interact with compressed NFTs, using the Metaplex Bubblegum program, on Solana Virtual Machine (SVM) environments other than Solana devnet and mainnet-beta.
---

## Overview

This guide covers the specific differences required to interact with compressed NFT (cNFT) Assets using Javascript on Solana Virtual Machine (SVM) environments other than Solana devnet and mainnet-beta.  See the [Create 1,000,000 NFTs on Solana with Bubblegum](/bubblegum/guides/javascript/how-to-create-1000000-nfts-on-solana) guide for a more thorough discussion of creating cNFTs in general.

### Creating a Tree

{% callout title="Tree Cost" type="warning" %}
We are creating a Merkle Tree that with a real up-front SOL cost that will vary depending on the tree size and the specific SVM you are using.  Please try this example on devnet only until you are ready as Merkle Trees can not be closed or refunded.
{% /callout %}

Creating a tree can be done using the same `createTree` method as used on Solana mainnet-beta/devnet.  However, we must override the default `logWrapper` and `compressionProgram` values.  This could be accomplished as simply as:

```ts
import {
  createTree,
} from '@metaplex-foundation/mpl-bubblegum'
import {
  generateSigner,
} from '@metaplex-foundation/umi'

const merkleTree = generateSigner(umi)

// Create a Merkle tree specifying the correct `logWrapper` and `compressionProgram` for the SVM.
const createTreeTx = await createTree(umi, {
  merkleTree,
  maxDepth: 3,
  maxBufferSize: 8,
  canopyDepth: 0,
  logWrapper: publicKey('mnoopTCrg4p8ry25e4bcWA9XZjbNjMTfgYVGGEdRsf3'),
  compressionProgram: publicKey('mcmt6YrQEMKw8Mw43FmpRLmf7BqRnFMKmAcbxE3xkAW'),
})

await createTreeTx.sendAndConfirm(umi)
```

However, a helper function has been provided to automatically resolve these, and this is the recommended approach as it will work on solana devnet/mainnet-beta as well as other SVMs to which Bubblegum has been deployed:

```ts
import {
  createTree,
  getCompressionPrograms,
} from '@metaplex-foundation/mpl-bubblegum'
import {
  generateSigner,
} from '@metaplex-foundation/umi'

// Create a Merkle tree using the `getCompressionPrograms` helper function.
const merkleTree = generateSigner(umi)
const createTreeTx = await createTree(umi, {
  merkleTree,
  maxDepth: 3,
  maxBufferSize: 8,
  canopyDepth: 0,
  ...(await getCompressionPrograms(umi)),
}).sendAndConfirm(umi);
```

### Mint and Transfer a cNFT

Similarly to creating the Merkle tree, other methods such as `mintV1` and `transfer` also require specification of the compression programs.  Again we use the `getCompressionPrograms` helper.

```ts
import {
  fetchMerkleTree,
  getCompressionPrograms,
  getCurrentRoot,
  hashMetadataData,
  mintV1,
  transfer,
} from '@metaplex-foundation/mpl-bubblegum'
import {
  generateSigner,
} from '@metaplex-foundation/umi'

// Mint a cNFT to the Merkle tree.
const originalOwner = generateSigner(umi);
const mintTxn = await mintV1(umi, {
  leafOwner: originalOwner.publicKey,
  merkleTree: merkleTree.publicKey,
  metadata: {
    name: 'My cNFT',
    uri: `https://example.com/my-nft.json`,
    sellerFeeBasisPoints: 500, // 5%
    collection: { key: collectionId.publicKey, verified: false },
    creators: [{ address: umi.identity.publicKey, verified: true, share: 100 }],
    ...(await getCompressionPrograms(umi)),
  },
}).sendAndConfirm(umi);

// Transfer the cNFT to the new owner.
const newOwner = generateSigner(umi);
const merkleTreeAccount = await fetchMerkleTree(umi, merkleTree);
const transferTxn = await transfer(umi, {
  leafOwner: originalOwner,
  newLeafOwner: newOwner.publicKey,
  merkleTree,
  root: getCurrentRoot(merkleTreeAccount.tree),
  dataHash: hashMetadataData(metadata),
  creatorHash: hashMetadataCreators(metadata.creators),
  nonce: leafIndex,
  index: leafIndex,
  proof: [],
  ...(await getCompressionPrograms(umi)),
}).sendAndConfirm(umi);
```


