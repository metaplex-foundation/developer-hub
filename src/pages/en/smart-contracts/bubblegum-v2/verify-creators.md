---
title: Verifying Creators
metaTitle: Verifying Creators - Bubblegum V2 - Metaplex
description: Learn how to verify and unverify creators on compressed NFTs using Bubblegum V2. Covers the verifyCreatorV2 and unverifyCreatorV2 instructions.
created: '01-15-2025'
updated: '02-24-2026'
keywords:
  - verify creator
  - NFT creator
  - creator verification
  - unverify creator
  - verifyCreatorV2
about:
  - Compressed NFTs
  - Creator verification
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

## Summary

**Verifying creators** toggles the verified flag on a cNFT's creator entries. This page covers verifying and unverifying creators using the verifyCreatorV2 and unverifyCreatorV2 instructions.

- Verify a creator on an existing cNFT (the creator must sign)
- Unverify a creator from a cNFT
- Creators can also be verified at mint time by signing the mint transaction

## Out of Scope

This page does not cover: updating metadata (see [Updating cNFTs](/smart-contracts/bubblegum-v2/update-cnfts)), collection verification (see [Collections](/smart-contracts/bubblegum-v2/collections)), or minting (see [Minting](/smart-contracts/bubblegum-v2/mint-cnfts)).

If a Compressed NFT has a list of creators set in its metadata, these creators can use special instructions to verify and unverify themselves on the cNFT. {% .lead %}

These instructions will toggle a **Verified** boolean on the appropriate item of the cNFT's **Creators** array. That boolean is important as it allows apps such as wallets and marketplaces to know which creators are genuine and which ones are not.

It is worth noting that creators can verify themselves directly when [minting the Compressed NFT](/smart-contracts/bubblegum-v2/mint-cnfts) by signing the mint transaction. That being said, let's now see how a creator can verify or unverify themselves on an existing Compressed NFT.

## Verify a Creator

The Bubblegum program offers a **verifyCreatorV2** instruction that must be signed by the creator we are trying to verify. The creator has to be part of the **Creators** array of the Compressed NFT already. Use the [`updateMetadataV2`](/smart-contracts/bubblegum-v2/update-cnfts) instruction to add a creator to the **Creators** array first if it is not already part of the array.

Additionally, more parameters must be provided to verify the integrity of the Compressed NFT, as this instruction will replace the leaf on the Bubblegum Tree. Since these parameters are common to all instructions that mutate leaves, they are documented [in the following FAQ](/smart-contracts/bubblegum-v2/faq#replace-leaf-instruction-arguments). Fortunately, we can use a helper method that will automatically fetch these parameters for us using the Metaplex DAS API.

{% dialect-switcher title="Verify the Creator of a Compressed NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  verifyCreatorV2,
  MetadataArgsV2Args
} from '@metaplex-foundation/mpl-bubblegum';
import {
  unwrapOption,
  none,
} from '@metaplex-foundation/umi';

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
const collectionOption = unwrapOption(assetWithProof.metadata.collection);
const metadata: MetadataArgsV2Args = {
  name: assetWithProof.metadata.name,
  uri: assetWithProof.metadata.uri,
  sellerFeeBasisPoints: assetWithProof.metadata.sellerFeeBasisPoints,
  collection: collectionOption
    ? collectionOption.key
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


## Notes

- Only creators already listed in the cNFT's creators array can be verified. Use `updateMetadataV2` to add creators first.
- The creator being verified must sign the transaction themselves.
- Creators can be verified at mint time by signing the mint transaction, avoiding the need for a separate verification step.

## FAQ

### Can I verify a creator who is not in the creators array?

No. The creator must already be listed in the cNFT's creators array. Use `updateMetadataV2` to add the creator first, then verify them.

### Who signs the verify transaction?

The creator being verified must sign the transaction. You cannot verify a creator on someone else's behalf.

### Can a creator verify themselves at mint time?

Yes. If a creator signs the mint transaction, they are automatically verified in the cNFT's creator array.

## Glossary

| Term | Definition |
|------|------------|
| **verifyCreatorV2** | Instruction that sets a creator's verified flag to true on a compressed NFT |
| **unverifyCreatorV2** | Instruction that sets a creator's verified flag to false on a compressed NFT |
| **Creators Array** | The list of creator addresses, verification statuses, and royalty share percentages stored in cNFT metadata |
| **Verified** | A boolean flag indicating whether a creator has confirmed their association with the cNFT |
