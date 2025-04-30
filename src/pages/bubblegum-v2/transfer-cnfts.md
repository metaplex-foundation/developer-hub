---
title: Transferring Compressed NFTs
metaTitle: Transferring Compressed NFTs | Bubblegum v2
description: Learn how to transfer compressed NFTs on Bubblegum
---

The **Transfer** instruction can be used to transfer a Compressed NFT from one owner to another. To authorize the transfer, either the current owner or the delegate authority — if any — must sign the transaction. 

Note that this instruction updates the Compressed NFT and therefore replaces the leaf on the Bubblegum Tree. This means additional parameters must be provided to verify the integrity of the Compressed NFT. Since these parameters are common to all instructions that mutate leaves, they are documented [in the following FAQ](/bubblegum-v2/faq#replace-leaf-instruction-arguments). Fortunately, we can use a helper method that will automatically fetch these parameters for us using the Metaplex DAS API.

{% callout title="Transaction size" type="note" %}
If you encounter transaction size errors, consider using `{ truncateCanopy: true }` with `getAssetWithProof`. See the [FAQ](/bubblegum-v2/faq#replace-leaf-instruction-arguments) for details.
{% /callout %}

## Transfer a Bubblegum V2 Compressed NFT

The instruction accepts the following parameters:

- **Leaf Owner**: The current owner of the Compressed NFT
- **Leaf Delegate**: The current owner of the Compressed NFT and its delegate authority if any. One of these must sign the transaction.
- **New Leaf Owner**: The address of the Compressed NFT's new owner
- **Merkle Tree**: The address of the Bubblegum Tree
- **Root**: The current root of the Bubblegum Tree
- **Data Hash**: The hash of the metadata of the Compressed NFT
- **Creator Hash**: The hash of the creators of the Compressed NFT
- **Nonce**: The nonce of the Compressed NFT
- **Index**: The index of the Compressed NFT

{% dialect-switcher title="Transfer a Compressed NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, transfer } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
  await transferV2(umi, {
    authority: leafOwnerA,
    leafOwner: leafOwnerA.publicKey,
    newLeafOwner: leafOwnerB.publicKey,
    merkleTree,
    root: getCurrentRoot(merkleTreeAccount.tree),
    dataHash: hashMetadataDataV2(metadata),
    creatorHash: hashMetadataCreators(metadata.creators),
    nonce: leafIndex,
    index: leafIndex,
    proof: [],
  }).sendAndConfirm(umi);
```

{% totem-accordion title="Using a delegate" %}

```ts
import { getAssetWithProof, transfer } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
  await transferV2(umi, {
    authority: delegateAuthority, // <- The delegated authority signs the transaction.
    leafOwner: leafOwnerA.publicKey,
    leafDelegate: delegateAuthority.publicKey,
    newLeafOwner: leafOwnerB.publicKey,
    merkleTree,
    root: getCurrentRoot(merkleTreeAccount.tree),
    dataHash: hashMetadataDataV2(metadata),
    creatorHash: hashMetadataCreators(metadata.creators),
    nonce: leafIndex,
    index: leafIndex,
    proof: [],
  }).sendAndConfirm(umi);
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}


## Transfer a Bubblegum V1 Compressed NFT


The instruction accepts the following parameters:

- **Leaf Owner** and **Leaf Delegate**: The current owner of the Compressed NFT and its delegate authority if any. One of these must sign the transaction.
- **New Leaf Owner**: The address of the Compressed NFT's new owner.


{% dialect-switcher title="Transfer a Compressed NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, transfer } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await transfer(umi, {
  ...assetWithProof,
  leafOwner: currentLeafOwner,
  newLeafOwner: newLeafOwner.publicKey,
}).sendAndConfirm(umi)
```

{% totem-accordion title="Using a delegate" %}

```ts
import { getAssetWithProof, transfer } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await transfer(umi, {
  ...assetWithProof,
  leafDelegate: currentLeafDelegate,
  newLeafOwner: newLeafOwner.publicKey,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
