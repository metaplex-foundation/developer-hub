---
title: Burning Compressed NFTs
metaTitle: Burning Compressed NFTs - Bubblegum V2 - Metaplex
description: Learn how to burn compressed NFTs using Bubblegum V2. Covers burning by owner, delegate, and permanent burn delegate.
created: '01-15-2025'
updated: '02-24-2026'
keywords:
  - burn compressed NFT
  - burn cNFT
  - delete NFT
  - Bubblegum burn
  - burnV2
  - permanent burn delegate
about:
  - Compressed NFTs
  - NFT lifecycle
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

## Summary

**Burning a compressed NFT** permanently removes it from the Bubblegum Tree using the **burnV2** instruction. This page covers burning by owner, leaf delegate, and permanent burn delegate.

- Burn a cNFT using the burnV2 instruction
- Authorize burns via the leaf owner, leaf delegate, or permanent burn delegate
- Pass the coreCollection parameter when the cNFT belongs to a collection

## Out of Scope

This page does not cover: transferring cNFTs (see [Transferring](/smart-contracts/bubblegum-v2/transfer-cnfts)), delegating authority (see [Delegating cNFTs](/smart-contracts/bubblegum-v2/delegate-cnfts)), or tree creation (see [Creating Trees](/smart-contracts/bubblegum-v2/create-trees)).

The **burnV2** instruction can be used to burn a Compressed NFT and, therefore, remove it from the Bubblegum Tree permanently. To authorize this operation, either the current owner or the delegate authority — if any — must sign the transaction. The instruction accepts the following parameter:

- **Leaf Owner**, **Leaf Delegate**, or **Permanent Burn Delegate**: The current owner of the Compressed NFT, its delegate authority, if any, or the permanent burn delegate of the collection. If the asset is part of a collection, the `coreCollection` parameter must be passed. One of these must sign the transaction.

Note that, since this instruction replaces the leaf on the Bubblegum Tree, additional parameters must be provided to verify the integrity of the Compressed NFT before it can be burned. Since these parameters are common to all instructions that mutate leaves, they are documented [in the following FAQ](/smart-contracts/bubblegum-v2/faq#replace-leaf-instruction-arguments). Fortunately, we can use a helper method that will automatically fetch these parameters for us using the Metaplex DAS API.

{% callout title="Transaction size" type="note" %}
If you encounter transaction size errors, consider using `{ truncateCanopy: true }` with `getAssetWithProof`. See the [FAQ](/smart-contracts/bubblegum-v2/faq#replace-leaf-instruction-arguments) for details.
{% /callout %}

{% callout title="Collections" type="note" %}
If the cNFT is part of a collection, the `coreCollection` parameter must be passed.
{% /callout %}

{% dialect-switcher title="Burn a Compressed NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, burnV2 } from '@metaplex-foundation/mpl-bubblegum';

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await burnV2(umi, {
  ...assetWithProof,
  leafOwner: currentLeafOwner,
}).sendAndConfirm(umi)
```

{% totem-accordion title="Using a delegate" %}

```ts
import { getAssetWithProof, burnV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await burnV2(umi, {
  ...assetWithProof,
  leafDelegate: currentLeafDelegate,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="Using a permanent burn delegate" %}

```ts
import { getAssetWithProof, burnV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await burnV2(umi, {
  ...assetWithProof,
  authority: permanentBurnDelegate, // Signer of the permanent burn delegate
  coreCollection: collection.publicKey,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}


## Notes

- Burning is **irreversible** — the cNFT is permanently removed from the merkle tree.
- If the cNFT belongs to a collection, you must pass the `coreCollection` parameter.
- The permanent burn delegate can burn any cNFT in the collection without the owner's signature, if the `PermanentBurnDelegate` plugin is enabled on the collection.

## FAQ

### Can I undo a burn?

No. Burning permanently removes the cNFT from the merkle tree. The leaf is replaced with an empty hash and cannot be recovered.

### Who can burn a compressed NFT?

The current leaf owner, the leaf delegate (if one is set), or the permanent burn delegate (if the collection has the PermanentBurnDelegate plugin enabled).

### Do I need to pass the collection when burning?

Yes, if the cNFT is part of a collection. Pass the `coreCollection` parameter with the collection's public key.

## Glossary

| Term | Definition |
|------|------------|
| **burnV2** | The Bubblegum V2 instruction that permanently removes a cNFT from the merkle tree |
| **Permanent Burn Delegate** | A collection-level authority that can burn any cNFT in the collection without owner consent |
| **Leaf Delegate** | An account authorized by the cNFT owner to perform actions (transfer, burn, freeze) on their behalf |
| **getAssetWithProof** | A helper function that fetches all required parameters (proof, hashes, nonce, index) from the DAS API |
