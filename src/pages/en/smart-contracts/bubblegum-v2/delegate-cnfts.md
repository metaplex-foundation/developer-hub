---
title: Delegating Compressed NFTs
metaTitle: Delegating Compressed NFTs - Bubblegum V2 - Metaplex
description: Learn how to delegate and revoke delegate authority on compressed NFTs using Bubblegum V2. Covers leaf delegate approval and revocation.
created: '01-15-2025'
updated: '02-24-2026'
keywords:
  - delegate NFT
  - NFT delegation
  - leaf delegate
  - approved operator
  - delegate authority
  - revoke delegate
about:
  - Compressed NFTs
  - NFT delegation
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: What can a delegate do with a cNFT?
    a: A leaf delegate can transfer, burn, and freeze/thaw the cNFT on the owner's behalf.
  - q: How do I revoke a delegate?
    a: Call the delegate instruction with newLeafDelegate set to the owner's own public key. This effectively removes the delegate.
  - q: Does the delegate persist after a transfer?
    a: No. After a transfer, the leaf delegate is automatically reset to the new owner.
---

## Summary

**Delegating compressed NFTs** allows the owner to authorize another account to perform actions on their behalf. This page covers approving and revoking delegate authorities on individual cNFTs.

- Approve a leaf delegate to transfer, burn, or freeze a cNFT on the owner's behalf
- Revoke a delegate by re-delegating to the owner's own address
- Delegate authority is reset automatically after a transfer

The owner of a Compressed NFT can delegate it to another account while keeping ownership of the cNFT. {% .lead %}

This allows the delegated account — which we also refer to as the **Delegate Authority** — to perform actions on behalf of the owner. These actions are:

- [Transferring the cNFT](/smart-contracts/bubblegum-v2/transfer-cnfts): The Delegate Authority will be reset — i.e. set to the new owner — after the transfer.
- [Burning the cNFT](/smart-contracts/bubblegum-v2/burn-cnfts).
- [Freezing and Thawing the cNFT](/smart-contracts/bubblegum-v2/freeze-cnfts).

Each of these actions provides examples of how to use the Delegate Authority to perform them. Usually, you simply provide the **Leaf Delegate** account as a Signer instead of the **Leaf Owner** account.
Let's see how we can approve and revoke Delegate Authorities for our Compressed NFTs.

## Approving a Delegate Authority

To approve or replace a Delegate Authority, the owner must send a **Delegate** instruction. This instruction accepts the following parameters:

- **Leaf Owner**: The current owner of the Compressed NFT as a Signer. It defaults to the payer of the transaction.
- **Previous Leaf Delegate**: The previous Delegate Authority, if any. Otherwise, this should be set to the **Leaf Owner**.
- **New Leaf Delegate**: The new Delegate Authority to approve.

Additionally, more parameters must be provided to verify the integrity of the Compressed NFT as this instruction replaces the leaf on the Bubblegum Tree, since these parameters are common to all instructions that mutate leaves, they are documented [in the following FAQ](/smart-contracts/bubblegum-v2/faq#replace-leaf-instruction-arguments). Fortunately, we can use a helper method that will automatically fetch these parameters for us using the Metaplex DAS API.

{% dialect-switcher title="Delegate a Compressed NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, delegate } from '@metaplex-foundation/mpl-bubblegum';

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true });
await delegate(umi, {
  ...assetWithProof,
  leafOwner,
  previousLeafDelegate: leafOwner.publicKey,
  newLeafDelegate: newDelegate,
}).sendAndConfirm(umi);
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Revoking a Delegate Authority

To revoke an existing Delegate Authority, the owner simply needs to set themselves as the new Delegate Authority.

{% dialect-switcher title="Revoke the Delegate Authority of a Compressed NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, delegate } from '@metaplex-foundation/mpl-bubblegum';

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await delegate(umi, {
  ...assetWithProof,
  leafOwner,
  previousLeafDelegate: currentDelegate,
  newLeafDelegate: leafOwner.publicKey,
}).sendAndConfirm(umi);
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}


## Notes

- Delegate authority is reset to the new owner after a transfer. The new owner must re-delegate if needed.
- Only one leaf delegate can be active at a time per cNFT. Approving a new delegate replaces the previous one.
- To revoke a delegate, set the new delegate to the owner's own public key.

## FAQ

### What can a delegate do with a cNFT?

A leaf delegate can transfer, burn, and freeze/thaw the cNFT on the owner's behalf.

### How do I revoke a delegate?

Call the delegate instruction with `newLeafDelegate` set to the owner's own public key. This effectively removes the delegate.

### Does the delegate persist after a transfer?

No. After a transfer, the leaf delegate is automatically reset to the new owner.

## Glossary

| Term | Definition |
|------|------------|
| **Leaf Delegate** | An account authorized by the cNFT owner to perform transfer, burn, and freeze actions |
| **Delegate Authority** | The approved account that can act on behalf of the cNFT owner |
| **Previous Leaf Delegate** | The current delegate being replaced, or the owner if no delegate was previously set |
