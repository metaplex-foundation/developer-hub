---
title: Delegating Compressed NFTs
metaTitle: Delegating Compressed NFTs | Bubblegum V2
description: Learn how to delegate compressed NFTs on Bubblegum.
---

The owner of a Compressed NFT can delegate it to another account while keeping ownership of the cNFT. {% .lead %}

This allows the delegated account — which we also refer to as the **Delegate Authority** — to perform actions on behalf of the owner. These actions are:

- [Transferring the cNFT](/bubblegum-v2/transfer-cnfts): The Delegate Authority will be reset — i.e. set to the new owner — after the transfer.
- [Burning the cNFT](/bubblegum-v2/burn-cnfts).
- [Freezing and Thawing the cNFT](/bubblegum-v2/freeze-cnfts).

Each of these actions provides examples of how to use the Delegate Authority to perform them. Usually, you simply provide the **Leaf Delegate** account as a Signer instead of the **Leaf Owner** account.
Let's see how we can approve and revoke Delegate Authorities for our Compressed NFTs.

## Approving a Delegate Authority

To approve or replace a Delegate Authority, the owner must send a **Delegate** instruction. This instruction accepts the following parameters:

- **Leaf Owner**: The current owner of the Compressed NFT as a Signer. It defaults to the payer of the transaction.
- **Previous Leaf Delegate**: The previous Delegate Authority, if any. Otherwise, this should be set to the **Leaf Owner**.
- **New Leaf Delegate**: The new Delegate Authority to approve.

Additionally, more parameters must be provided to verify the integrity of the Compressed NFT as this instruction replaces the leaf on the Bubblegum Tree, since these parameters are common to all instructions that mutate leaves, they are documented [in the following FAQ](/bubblegum-v2/faq#replace-leaf-instruction-arguments). Fortunately, we can use a helper method that will automatically fetch these parameters for us using the Metaplex DAS API.

{% dialect-switcher title="Delegate a Compressed NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, delegate } from '@metaplex-foundation/mpl-bubblegum';

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
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
