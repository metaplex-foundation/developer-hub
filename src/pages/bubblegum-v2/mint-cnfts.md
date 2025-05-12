---
title: Minting Compressed NFTs
metaTitle: Minting Compressed NFTs | Bubblegum V2
description: Learn how to mint compressed NFTs on Bubblegum V2.
---

In [the previous page](/bubblegum-v2/create-trees), we saw that we need a Bubblegum Tree to mint Compressed NFTs, and we saw how to create one. Now, let's see how to mint compressed NFTs from a given Bubblegum Tree. {% .lead %}

The Bubblegum program offers multiple minting instructions for the different leaf schema versions. Bubblegum V2 introduces a new minting instruction called **mintV2** that is used to mint Compressed NFTs either to a given Collection or without a Collection.

## Minting without a Collection

The Bubblegum program provides the **mintV2** instruction that enables us to mint Compressed NFTs from a Bubblegum Tree. If the Bubblegum Tree is public, anyone will be able to use this instruction. Otherwise, only the Tree Creator or the Tree Delegate will be able to do so.

The main parameters of the **mintV2** instruction are:

- **Merkle Tree**: The Merkle Tree address from which the Compressed NFT will be minted.
- **Tree Creator Or Delegate**: The authority allowed to mint from the Bubblegum Tree — this can either be the creator or the delegate of the tree. This authority must sign the transaction. In the case of a public tree, this parameter can be any authority, but must still be a signer.
- **Leaf Owner**: The owner of the Compressed NFT that will be minted. It defaults to the payer of the transaction.
- **Leaf Delegate**: A delegate authority allowed to manage the minted cNFT, if any. Otherwise, it is set to the Leaf Owner.
- **Collection Authority**: The authority allowed to manage the given Collection.
- **Core Collection**: The MPL-Core Collection NFT to which the Compressed NFT will be added.
- **Metadata**: The metadata of the Compressed NFT that will be minted. It contains information such as the **Name** of the NFT, its **URI**, its **Collection**, its **Creators**, etc. In Bubblegum V2 the metadata is using `MetadataArgsV2` which excludes unneeded fields like `uses` and the `verified` flag for the collection.

{% dialect-switcher title="Mint a Compressed NFT without a Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { none } from '@metaplex-foundation/umi';
import { mintV2 } from '@metaplex-foundation/mpl-bubblegum';

await mintV2(umi, {
  leafOwner: umi.identity.publicKey,
  merkleTree: merkleTree.publicKey,
  metadata: {
    name: 'My NFT',
    uri: 'https://example.com/my-nft.json',
    sellerFeeBasisPoints: 550, 
    collection: none(),
    creators: [],
  },
}).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

## Minting to a Collection

While it is possible to set and verify a Collection for a Compressed NFT _after_ it is minted, Bubblegum V2 allows you to mint a Compressed NFT directly to a given Collection. Bubblegum V2 uses MPL-Core Collections to group the compressed NFTs. The same **mintV2** instruction is used for that. In addition to the parameters described above, you need to pass in the core collection and sign as collection authority or delegate:

- **Core Collection**: The mint address passed to the `coreCollection` parameter, pointing to the MPL-Core Collection NFT…
- **Collection Authority**: The authority allowed to manage the given Collection NFT. This can either be the update authority of the Collection NFT or a delegated collection authority. This authority must sign the transaction regardless of whether the Bubblegum Tree is public or not.

Note that the **Metadata** parameter must contain the **Collection** Public Key.

{% dialect-switcher title="Mint a Compressed NFT to a Collection" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { some } from '@metaplex-foundation/umi';
import { mintV2 } from '@metaplex-foundation/mpl-bubblegum';

await mintV2(umi, {
  collectionAuthority: umi.identity,
  leafOwner: umi.identity.publicKey,
  merkleTree: merkleTree.publicKey,
  coreCollection: collectionSigner.publicKey,
  metadata: {
    name: 'My NFT',
    uri: 'https://example.com/my-nft.json',
    sellerFeeBasisPoints: 550, // 5.5%
    collection: some(collectionSigner.publicKey),
    creators: [],
  },
}).sendAndConfirm(umi);
```

{% totem-accordion title="Create a MPL-Core Collection" %}

If you do not have a Collection yet, you can create one using the [`@metaplex-foundation/mpl-core` library](https://developers.metaplex.com/core/collections#creating-a-collection-with-plugins). Keep in mind that you need to add the `BubblegumV2` Plugin to the collection, too.
npm install @metaplex-foundation/mpl-core
And create a Collection like so:

```ts
import { generateSigner } from '@metaplex-foundation/umi';
import { createCollection } from '@metaplex-foundation/mpl-core';

const collectionSigner = generateSigner(umi);
await createCollection(umi, {
    collection: collectionSigner,
    name: "My Collection",
    uri: "https://example.com/my-nft.json",
    plugins: [
      {
        type: "BubblegumV2",
      },
    ],
  }).sendAndConfirm(umi);
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### Get Asset ID and Leaf Schema from mint transaction {% #get-leaf-schema-from-mint-transaction %}

You can retrieve the leaf and determine the asset ID from the `mintV2` transaction using the `parseLeafFromMintV2Transaction` helper. This function parses the Transaction, therefore you have to make sure that it has been finalized before calling `parseLeafFromMintV2Transaction`.

{% callout type="note" title="Transaction finalization" %}
Please make sure that the transaction has been finalized before calling `parseLeafFromMintV2Transaction`.
{% /callout %}

{% dialect-switcher title="Get leaf schema from mint transaction" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  mintV2,
  parseLeafFromMintV2Transaction,
} from '@metaplex-foundation/mpl-bubblegum';

const { signature } = await mintV2(umi, {
  // ... see details above
}).sendAndConfirm(umi);

const leaf = await parseLeafFromMintV2Transaction(umi, signature);
const assetId = leaf.id;
```

{% /dialect %}
{% /dialect-switcher %}