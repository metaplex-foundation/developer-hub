---
title: Transferring Compressed NFTs
metaTitle: Transferring Compressed NFTs | Bubblegum V2
description: Learn how to transfer compressed NFTs on Bubblegum
---

The **transferV2** instruction can be used to transfer a Compressed NFT from one owner to another. To authorize the transfer, either the current owner or the delegate authority — if any — must sign the transaction.

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

When using JavaScript we suggest to use the `getAssetWithProof` function first to fetch the parameters and then pass them to the `transferV2` instruction.

{% dialect-switcher title="Transfer a Compressed NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
-import { getAssetWithProof, transfer } from '@metaplex-foundation/mpl-bubblegum'
+import { getAssetWithProof, transferV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {
  truncateCanopy: true,
})

// Then leafOwnerA can use it to transfer the NFT to leafOwnerB.
const leafOwnerB = generateSigner(umi)
await transferV2(umi, {
  // Pass parameters from the asset with proof.
  ...assetWithProof,
  authority: leafOwnerA,
  newLeafOwner: leafOwnerB.publicKey,
}).sendAndConfirm(umi)
```

{% totem-accordion title="Using a delegate" %}

```ts
import { getAssetWithProof, transferV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {
  truncateCanopy: true,
})
await transferV2(umi, {
  // Pass parameters from the asset with proof.
  ...assetWithProof,
  authority: delegateAuthority, // <- The delegated authority signs the transaction.
  newLeafOwner: leafOwnerB.publicKey,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### Transferability Check for Compressed NFTs

The `canTransfer` function can be used to check if a Compressed NFT can be transferred. It will return `true` if the NFT can be transferred and `false` otherwise. Frozen and `NonTransferable` cNFTs cannot be transferred.

```ts
import { canTransfer } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {
  truncateCanopy: true,
})

const canBeTransferred = canTransfer(assetWithProof)
console.log("canBeTransferred", canBeTransferred ? "Yes" : "No")
```