---
title: Minting Compressed NFTs
metaTitle: Minting Compressed NFTs | Bubblegum v2
description: Learn how to mint compressed NFTs on Bubblegum.
---

In [the previous page](/bubblegum-v2/create-trees), we saw that we need a Bubblegum Tree to mint Compressed NFTs and we saw how to create one. Now, let's see how to mint compressed NFTs from a given Bubblegum Tree. {% .lead %}

The Bubblegum program offers multiple minting instructions for the different leaf schema versions. Bubblegum v2 introduces a new minting instruction called **mintV2** that is used to mint Compressed NFTs either to a given Collection or without a Collection.

## Minting without a Collection

The Bubblegum program provides a **Mint V2** instruction that enables us to mint Compressed NFTs from a Bubblegum Tree. If the Bubblegum Tree is public, anyone will be able to use this instruction. Otherwise, only the Tree Creator or the Tree Delegate will be able to do so.

The main parameters of the Mint V2 instruction are:

- **Merkle Tree**: The Merkle Tree address from which the Compressed NFT will be minted.
- **Tree Creator Or Delegate**: The authority allowed to mint from the Bubblegum Tree — this can either be the creator or the delegate of the tree. This authority must sign the transaction. In the case of a public tree, this parameter can be any authority but must still be a signer.
- **Leaf Owner**: The owner of the Compressed NFT that will be minted.
- **Leaf Delegate**: An delegate authority allowed to manage the minted cNFT, if any. Otherwise, it is set to the Leaf Owner.
- **Metadata**: The metadata of the Compressed NFT that will be minted. It contains information such as the **Name** of the NFT, its **URI**, its **Collection**, its **Creators**, etc.

{% dialect-switcher title="Mint a Compressed NFT without a Collection" %}
{% dialect title="JavaScript" id="js" %}
//TODO
```ts
import { none } from '@metaplex-foundation/umi'
import { mintV1 } from '@metaplex-foundation/mpl-bubblegum'

await mintV1(umi, {
  leafOwner,
  merkleTree,
  metadata: {
    name: 'My Compressed NFT',
    uri: 'https://example.com/my-cnft.json',
    sellerFeeBasisPoints: 500, // 5%
    collection: none(),
    creators: [
      { address: umi.identity.publicKey, verified: false, share: 100 },
    ],
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

### Get leaf schema and Asset ID from mint transaction {% #get-leaf-schema-from-mint-transaction %}
//TODO
You can retrieve the leaf and determine the asset ID from the `mintV1` transaction using the `parseLeafFromMintV1Transaction` helper. This function parses the Transaction, therefore you have to make sure that it has been finalized before calling `parseLeafFromMintV1Transaction`.

{% callout type="note" title="Transaction finalization" %}
Please make sure that the transaction has been finalized before calling `parseLeafFromMintV1Transaction`.
{% /callout %}

{% dialect-switcher title="Get leaf schema from mint transaction" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
    findLeafAssetIdPda,
    mintV1,
    parseLeafFromMintV1Transaction
} from "@metaplex-foundation/mpl-bubblegum";

const { signature } = await mintV1(umi, {
  leafOwner,
  merkleTree,
  metadata,
}).sendAndConfirm(umi, { confirm: { commitment: "confirmed" } });

const leaf: LeafSchema = await parseLeafFromMintV1Transaction(umi, signature);
const assetId = findLeafAssetIdPda(umi, { merkleTree, leafIndex: leaf.nonce });
// or const assetId = leaf.id;
```

{% /dialect %}
{% /dialect-switcher %}

## Minting to a Collection

Whilst it is possible to set and verify a Collection for a Compressed NFT _after_ it was minted, Bubblegum v2 allows to mint a Compressed NFT directly to a given Collection. Bubblegum v2 uses MPL-Core Collections to group the compressed NFTs. The same **mintV2** instruction is used for that. In addition to the parameters described above, you need to pass in the core collection and sign as collection authority or delegate:

- **Collection Mint**: The Mint address of the [MPL-Core Collection NFT](/core/collections#creating-a-collection-with-plugins) to which the Compressed NFT will be added.
- **Collection Authority**: The authority allowed to manage the given Collection NFT. This can either be the update authority of the Collection NFT or a delegated collection authority. This authority must sign the transaction regardless of whether the Bubblegum Tree is public or not.

Note that the **Metadata** parameter must contain the **Collection** Public Key.

{% dialect-switcher title="Mint a Compressed NFT to a Collection" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}
//TODO
```ts
import { none } from '@metaplex-foundation/umi'
import { mintToCollectionV1 } from '@metaplex-foundation/mpl-bubblegum'

await mintToCollectionV1(umi, {
  leafOwner,
  merkleTree,
  collectionMint,
  metadata: {
    name: 'My Compressed NFT',
    uri: 'https://example.com/my-cnft.json',
    sellerFeeBasisPoints: 500, // 5%
    collection: { key: collectionMint, verified: false },
    creators: [
      { address: umi.identity.publicKey, verified: false, share: 100 },
    ],
  },
}).sendAndConfirm(umi)
```

By default, the Collection Authority is set to the Umi identity but this can be customized as shown in the example below.

```ts
const customCollectionAuthority = generateSigner(umi)
await mintToCollectionV1(umi, {
  // ...
  collectionAuthority: customCollectionAuthority,
})
```

{% totem-accordion title="Create a MPL-Core Collection" %}

If you do not have a Collection yet, you can create one using the []`@metaplex-foundation/mpl-core` library](https://developers.metaplex.com/core/collections#creating-a-collection-with-plugins). Keep in mind that you need to add the `BubblegumV1` Plugin to the collection, too

```shell
npm install @metaplex-foundation/mpl-core
```
//TODO
And create a Collection  like so:

```ts
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  name: 'My Collection',
  uri: 'https://example.com/my-collection.json',
  sellerFeeBasisPoints: percentAmount(5.5), // 5.5%
  isCollection: true,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

//TODO
### Get leaf schema and Asset ID from mint to collection transaction {% #get-leaf-schema-from-mint-to-collection-transaction %}

Again you can retrieve the leaf and determine the asset ID from the `mintToCollectionV1` transaction using the `parseLeafFromMintToCollectionV1Transaction` helper.

{% callout type="note" title="Transaction finalization" %}
Please make sure that the transaction has been finalized before calling `parseLeafFromMintToCollectionV1Transaction`.
{% /callout %}

{% dialect-switcher title="Get leaf schema from mintToCollectionV1 transaction" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
    findLeafAssetIdPda,
    mintV1,
    parseLeafFromMintToCollectionV1Transaction
} from "@metaplex-foundation/mpl-bubblegum";

const { signature } = await mintToCollectionV1(umi, {
  leafOwner,
  merkleTree,
  metadata,
  collectionMint: collectionMint.publicKey,
}).sendAndConfirm(umi);

const leaf: LeafSchema = await parseLeafFromMintToCollectionV1Transaction(umi, signature);
const assetId = findLeafAssetIdPda(umi, { merkleTree, leafIndex: leaf.nonce });
// or const assetId = leaf.id;
```

{% /dialect %}
{% /dialect-switcher %}
