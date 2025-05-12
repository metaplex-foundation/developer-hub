---
title: FAQ
metaTitle: FAQ | Bubblegum V2
description: Frequently asked questions about Bubblegum.
---

## What is Bubblegum V2?

Bubblegum V2 is a new iteration of the Bubblegum program that introduces several improvements and new features.
It is part of the known Bubblegum program, but the instructions and data structures are different.
With Bubblegum V2 cNFTs are grouped into collections using MPL-Core Collections instead of Metaplex Token Metadata Collections. It also introduces new features like freezing, thawing, and soulbound NFTs and additional features like:
- **Freeze and Thaw Functionality**: Project creators can now freeze and thaw cNFTs, providing greater control over their assets for various use cases such as preventing transfers during specific events or implementing vesting mechanics.
- **MPL-Core Collections Integration**: Bubblegum V2 NFTs can now be added to MPL-Core collections instead of being limited to token metadata collections, allowing for greater flexibility and integration with the broader Metaplex ecosystem.
- **Royalty Enforcement**: Since Bubblegum V2 is using [MPL-Core](https://docs.metaplex.com/core/overview) Collections, it is possible to enforce royalties on cNFTs e.g. using a `ProgramDenyList`.
- **Soulbound NFTs**: cNFTs can now be made soulbound (non-transferrable), permanently binding them to their owner's wallet. This is perfect for credentials, proof of attendance, identity verification, and more. It requires the `PermanentFreezeDelegate` plugin to be enabled on the collection.
- **Allow Permanent Transfer**: The permanent transfer delegate can now transfer the cNFT to a new owner without interaction of the leaf owner if the `PermanentTransferDelegate` plugin is enabled on the collection.

## How do I find the arguments needed for operations such as transfer, delegate, burn, etc? {% #replace-leaf-instruction-arguments %}

Whenever we use an instruction that ends up replacing a leaf in the Bubblegum Tree — such as transfer, delegate, burn, etc. — the program requires a bunch of parameters that are used to ensure the current leaf is valid and can be updated. This is because the data of Compressed NFTs is not available inside onchain accounts and therefore additional parameters such as the **Proof**, the **Leaf Index**, the **Nonce** and more are required for the program to fill the pieces.

All of that information can be retrieved from the **Metaplex DAS API** using both the `getAsset` and the `getAssetProof` RPC methods. However, the RPC responses from these methods and the parameters expected by the instructions are not exactly the same and parsing from one to the other is not trivial.

Fortunately, our SDKs provide a helper method that will do all the heavy lifting for us, as we can see in the code examples below. It accepts the Asset ID of the Compressed NFT and returns a bunch of parameters that can be directly injected into instructions that replace the leaf — such as burn, transfer, update, etc.

That being said, if you ever needed to do that parsing yourself, here is a quick breakdown of the parameters expected by the instructions and how to retrieve them from the Metaplex DAS API. Here we will assume the result of the `getAsset` and `getAssetProof` RPC methods are accessible via the `rpcAsset` and `rpcAssetProof` variables respectively.

- **Leaf Owner**: Accessible via `rpcAsset.ownership.owner`.
- **Leaf Delegate**: Accessible via `rpcAsset.ownership.delegate` and should default to `rpcAsset.ownership.owner` when null.
- **Merkle Tree**: Accessible via `rpcAsset.compression.tree` or `rpcAssetProof.tree_id`.
- **Root**: Accessible via `rpcAssetProof.root`.
- **Data Hash**: Accessible via `rpcAsset.compression.data_hash`.
- **Creator Hash**: Accessible via `rpcAsset.compression.creator_hash`.
- **Nonce**: Accessible via `rpcAsset.compression.leaf_id`.
- **Index**: Accessible via `rpcAssetProof.node_index - 2^max_depth` where `max_depth` is the maximum depth of the tree and can be inferred from the length of the `rpcAssetProof.proof` array.
- **Proof**: Accessible via `rpcAssetProof.proof`.
- **Metadata**: Currently needs to be reconstructed from various fields in the `rpcAsset` response.

{% dialect-switcher title="Get parameters for instructions that replace leaves" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

The Bubblegum Umi library provides a `getAssetWithProof` helper method that fits the description above. Here's an example of how to use it using the `transfer` instruction. Note that, in this case, we override the `leafOwner` parameter as it needs to be a Signer and `assetWithProof` gives us the owner as a Public Key.

Depending on Canopy size it can make sense to use the `truncateCanopy: true` parameter of the `getAssetWithProof` helper. It fetches the tree config and truncates not required proofs. This will help if your transaction sizes grow too large.

```ts
import { getAssetWithProof, transfer } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, 
// {  truncateCanopy: true } // optional to prune the proofs 
);
await transferV2(umi, {
  ...assetWithProof,
  leafOwner: leafOwnerA, // As a signer.
  newLeafOwner: leafOwnerB.publicKey,
}).sendAndConfirm(umi);

await transferV2(umi, {
  ...assetWithProof,
  leafOwner: leafOwnerA, // As a signer.
  newLeafOwner: leafOwnerB.publicKey,
}).sendAndConfirm(umi)
```

{% totem-accordion title="Get parameters without the helper function" %}

For completeness, here's how we could achieve the same result without using the provided helper function.

```ts
import { publicKeyBytes } from '@metaplex-foundation/umi'
import { transfer } from '@metaplex-foundation/mpl-bubblegum'

const rpcAsset = await umi.rpc.getAsset(assetId)
const rpcAssetProof = await umi.rpc.getAssetProof(assetId)

await transfer(umi, {
  leafOwner: leafOwnerA,
  newLeafOwner: leafOwnerB.publicKey,
  merkleTree: rpcAssetProof.tree_id,
  root: publicKeyBytes(rpcAssetProof.root),
  dataHash: publicKeyBytes(rpcAsset.compression.data_hash),
  creatorHash: publicKeyBytes(rpcAsset.compression.creator_hash),
  nonce: rpcAsset.compression.leaf_id,
  index: rpcAssetProof.node_index - 2 ** rpcAssetProof.proof.length,
  proof: rpcAssetProof.proof,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## How to Resolve "Transaction too large" Errors {% #transaction-size %}

When performing leaf-replacing operations like transfers or burns, you may encounter a "Transaction too large" error. To resolve this, consider the following solutions:

1. Use the `truncateCanopy` option:
   Pass `{ truncateCanopy: true }` to the `getAssetWithProof` function:

   ```ts
   const assetWithProof = await getAssetWithProof(umi, assetId, 
    { truncateCanopy: true }
   );
   ```

   This option retrieves the Merkle Tree configuration and optimizes the `assetWithProof` by removing unnecessary proofs based on the Canopy. While it adds an extra RPC call, it significantly reduces the transaction size.

2. Utilize versioned transactions and Address Lookup Tables:
   Another approach is to implement [versioned transactions and Address Lookup Tables](https://developers.metaplex.com/umi/toolbox/address-lookup-table). This method can help manage transaction size more effectively.

By applying these techniques, you can overcome transaction size limitations and successfully execute your operations.