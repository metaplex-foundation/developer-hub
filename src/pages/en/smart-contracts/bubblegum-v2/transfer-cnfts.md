---
title: Transferring Compressed NFTs
metaTitle: Transferring Compressed NFTs - Bubblegum V2 - Metaplex
description: Learn how to transfer compressed NFTs using Bubblegum V2. Covers transfers by owner, delegate, and permanent transfer delegate, plus transferability checks.
created: '01-15-2025'
updated: '02-24-2026'
keywords:
  - transfer compressed NFT
  - transfer cNFT
  - NFT transfer
  - Bubblegum transfer
  - transferV2
  - permanent transfer delegate
about:
  - Compressed NFTs
  - NFT transfers
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Can I transfer a frozen cNFT?
    a: No. Frozen cNFTs cannot be transferred. You must thaw the cNFT first using the appropriate delegate authority.
  - q: What happens to the delegate after a transfer?
    a: The leaf delegate is automatically reset to the new owner after a successful transfer. The new owner must re-delegate if needed.
  - q: How do I check if a cNFT can be transferred?
    a: Use the canTransfer helper function. It returns true if the cNFT is not frozen and not marked as non-transferable (soulbound).
---

## Summary

**Transferring a compressed NFT** moves ownership from one wallet to another using the **transferV2** instruction. This page covers transfers by owner, delegate, permanent transfer delegate, and transferability checks.

- Transfer a cNFT to a new owner using transferV2
- Authorize transfers via leaf owner, leaf delegate, or permanent transfer delegate
- Check if a cNFT can be transferred using the canTransfer helper
- Pass the coreCollection parameter when the cNFT belongs to a collection

The **transferV2** instruction can be used to transfer a Compressed NFT from one owner to another. To authorize the transfer, either the current owner or the delegate authority — if any — must sign the transaction. The delegated authority can either be a leaf delegate or the `permanentTransferDelegate` of the collection.

Note that this instruction updates the Compressed NFT and therefore replaces the leaf on the Bubblegum Tree. This means additional parameters must be provided to verify the integrity of the Compressed NFT. Since these parameters are common to all instructions that mutate leaves, they are documented [in the following FAQ](/smart-contracts/bubblegum-v2/faq#replace-leaf-instruction-arguments). Fortunately, we can use a helper method that will automatically fetch these parameters for us using the Metaplex DAS API.

{% callout title="Transaction size" type="note" %}
If you encounter transaction size errors, consider using `{ truncateCanopy: true }` with `getAssetWithProof`. See the [FAQ](/smart-contracts/bubblegum-v2/faq#replace-leaf-instruction-arguments) for details.
{% /callout %}

## Transfer a Bubblegum V2 Compressed NFT

The instruction accepts the following parameters:

- **Leaf Owner**: The current owner of the Compressed NFT. It defaults to the payer of the transaction.
- **Leaf Delegate**: The current owner of the Compressed NFT and its delegate authority if any. One of these must sign the transaction.
- **Authority**: An optional authority that signs the transaction. It can be the Leaf Owner or the `permanentTransferDelegate` and defaults to the `payer` of the transaction.
- **New Leaf Owner**: The address of the Compressed NFT's new owner
- **Merkle Tree**: The address of the Bubblegum Tree
- **Root**: The current root of the Bubblegum Tree
- **Data Hash**: The hash of the metadata of the Compressed NFT
- **Creator Hash**: The hash of the creators of the Compressed NFT
- **Nonce**: The nonce of the Compressed NFT
- **Index**: The index of the Compressed NFT
- **Collection**: The core collection of the Compressed NFT (if the cNFT is part of a collection)

When using JavaScript we suggest to use the `getAssetWithProof` function first to fetch the parameters and then pass them to the `transferV2` instruction.

{% dialect-switcher title="Transfer a Compressed NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, transferV2 } from '@metaplex-foundation/mpl-bubblegum';
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
  // If the cNFT is part of a collection, pass the core collection.
  //coreCollection: coreCollection.publicKey, 
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
  // If the cNFT is part of a collection, pass the core collection.
  //coreCollection: coreCollection.publicKey, 
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="Using a permanent transfer delegate" %}

```ts
import { getAssetWithProof, transferV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {
  truncateCanopy: true,
})
await transferV2(umi, {
  ...assetWithProof,
  authority: permanentTransferDelegate, // <- The delegated authority signs the transaction.
  newLeafOwner: leafOwnerB.publicKey,
  coreCollection: coreCollection.publicKey, 
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


## Notes

- After a transfer, the leaf delegate is automatically reset to the new owner.
- Frozen cNFTs and soulbound (non-transferable) cNFTs cannot be transferred. Use `canTransfer` to check.
- The permanent transfer delegate can transfer without the owner's signature if the `PermanentTransferDelegate` plugin is enabled on the collection.

## FAQ

### Can I transfer a frozen cNFT?

No. Frozen cNFTs cannot be transferred. You must thaw the cNFT first using the appropriate delegate authority.

### What happens to the delegate after a transfer?

The leaf delegate is automatically reset to the new owner after a successful transfer. The new owner must re-delegate if needed.

### How do I check if a cNFT can be transferred?

Use the `canTransfer` helper function. It returns `true` if the cNFT is not frozen and not marked as non-transferable (soulbound).

## Glossary

| Term | Definition |
|------|------------|
| **transferV2** | The Bubblegum V2 instruction that transfers a cNFT from one owner to another |
| **Permanent Transfer Delegate** | A collection-level authority that can transfer any cNFT without owner consent |
| **canTransfer** | A helper function that checks whether a cNFT can be transferred (not frozen or soulbound) |
| **Leaf Owner** | The current owner of the compressed NFT |
| **New Leaf Owner** | The wallet address that will receive ownership of the cNFT after transfer |
