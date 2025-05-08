---
title: Verifying Creators
metaTitle: Verifying Creators | Bubblegum v2
description: Learn how to verify and unverify creators on Bubblegum
---

If a Compressed NFT has a list of creators set in its metadata, these creators can use special instructions to verify and unverify themselves on the cNFT. {% .lead %}

These instructions will toggle a **Verified** boolean on the appropriate item of the cNFT's **Creators** array. That boolean is important as it allows apps such as wallets and marketplaces to know which creators are genuine and which ones are not.

It is worth noting that creators can verify themselves directly when [minting the Compressed NFT](/bubblegum-v2/mint-cnfts) by signing the mint transaction. That being said, let's now see how a creator can verify or unverify themselves on an existing Compressed NFT.

## Verify a Creator

The Bubblegum program offers a **verifyCreatorV2** instruction that must be signed by the creator we are trying to verify. The creator has to be part of the **Creators** array of the Compressed NFT already. Use the [`updateMetadataV2`](/bubblegum-v2/update-cnfts) instruction to add a creator to the **Creators** array first if it is not already part of the array.

Additionally, more parameters must be provided to verify the integrity of the Compressed NFT, as this instruction will end up replacing the leaf on the Bubblegum Tree. Since these parameters are common to all instructions that mutate leaves, they are documented [in the following FAQ](/bubblegum-v2/faq#replace-leaf-instruction-arguments). Fortunately, we can use a helper method that will automatically fetch these parameters for us using the Metaplex DAS API.

{% dialect-switcher title="Verify the Creator of a Compressed NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  verifyCreatorV2,
  MetadataArgsV2Args
} from '@metaplex-foundation/mpl-bubblegum'
import {
  unwrapOption,
  none,
} from '@metaplex-foundation/umi';

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
const metadata: MetadataArgsV2Args = {
  name: assetWithProof.metadata.name,
  uri: assetWithProof.metadata.uri,
  sellerFeeBasisPoints: assetWithProof.metadata.sellerFeeBasisPoints,
  collection: unwrapOption(assetWithProof.metadata.collection)
    ? unwrapOption(assetWithProof.metadata.collection)!.key
    : none(),
  creators: assetWithProof.metadata.creators,
};
await verifyCreatorV2(umi, {
  ...assetWithProof,
  metadata,
  creator: umi.identity, // Or a different signer than the umi identity
}).sendAndConfirm(umi);
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Unverify a Creator

Similarly to the **verifyCreatorV2** instruction, the **unverifyCreatorV2** instruction must be signed by the creator and will unverify them on the Compressed NFT.

{% dialect-switcher title="Unverify the Creator of a Compressed NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  unverifyCreatorV2,
  MetadataArgsV2Args
} from '@metaplex-foundation/mpl-bubblegum'
import {
  unwrapOption,
  none,
} from '@metaplex-foundation/umi';

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
const metadata: MetadataArgsV2Args = {
  name: assetWithProof.metadata.name,
  uri: assetWithProof.metadata.uri,
  sellerFeeBasisPoints: assetWithProof.metadata.sellerFeeBasisPoints,
  collection: unwrapOption(assetWithProof.metadata.collection)
    ? unwrapOption(assetWithProof.metadata.collection)!.key
    : none(),
  creators: assetWithProof.metadata.creators,
};
await unverifyCreatorV2(umi, {
  ...assetWithProof,
  metadata,
  creator: umi.identity, // Or a different signer than the umi identity
}).sendAndConfirm(umi);
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
