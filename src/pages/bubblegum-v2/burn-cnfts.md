---
title: Burning Compressed NFTs
metaTitle: Burning Compressed NFTs | Bubblegum V2
description: Learn how to burn compressed NFTs on Bubblegum.
---

The **burnV2** instruction can be used to burn a Compressed NFT and, therefore, remove it from the Bubblegum Tree permanently. To authorize this operation, either the current owner or the delegate authority — if any — must sign the transaction. The instruction accepts the following parameter:

- **Leaf Owner**, **Leaf Delegate**, or **Permanent Burn Delegate**: The current owner of the Compressed NFT, its delegate authority, if any, or the permanent burn delegate of the collection. If the asset is part of a collection, the `coreCollection` parameter must be passed. One of these must sign the transaction.

Note that, since this instruction replaces the leaf on the Bubblegum Tree, additional parameters must be provided to verify the integrity of the Compressed NFT before it can be burnt. Since these parameters are common to all instructions that mutate leaves, they are documented [in the following FAQ](/bubblegum-v2/faq#replace-leaf-instruction-arguments). Fortunately, we can use a helper method that will automatically fetch these parameters for us using the Metaplex DAS API.

{% callout title="Transaction size" type="note" %}
If you encounter transaction size errors, consider using `{ truncateCanopy: true }` with `getAssetWithProof`. See the [FAQ](/bubblegum-v2/faq#replace-leaf-instruction-arguments) for details.
{% /callout %}

{% callout title="Collections" type="note" %}
If the cNFT is part of a collection, the `coreCollection` parameter must be passed.
{% /callout %}

{% dialect-switcher title="Burn a Compressed NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, burnV2 } from '@metaplex-foundation/mpl-bubblegum'

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
