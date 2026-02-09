---
title: Verified Creators
metaTitle: Verified Creators | Token Metadata
description: Verify and unverify creator signatures on Solana NFTs using Token Metadata. Prove creator authenticity with the VerifyV1 instruction and manage creator shares for royalty distribution.
updated: '02-07-2026'
keywords:
  - verified creator NFT
  - creator verification
  - VerifyV1 creator
  - NFT royalties
  - creator shares
about:
  - verified creators
  - creator authentication
  - royalty distribution
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
howToSteps:
  - Create an NFT with the creators array in the Metadata account
  - Each creator calls VerifyV1 to sign their verification
  - The Verified flag on the creator entry is set to true
howToTools:
  - Umi SDK
  - Kit SDK
  - Rust SDK
faqs:
  - q: What does verifying a creator mean?
    a: Verifying a creator sets the Verified flag to true on that creator's entry in the Metadata account, proving they endorsed the token. Marketplaces use this to confirm authenticity.
  - q: How are royalties distributed among creators?
    a: Each creator has a Share percentage in the creators array. Marketplaces use these shares combined with the Seller Fee Basis Points to distribute royalties on secondary sales.
  - q: Can a creator remove their verification?
    a: Yes. A creator can call UnverifyV1 to remove their verification from an NFT's Metadata account.
  - q: How many creators can an NFT have?
    a: Up to 5 creators can be listed in the creators array. Their shares must sum to 100%.
---

Similarly to [collections](/smart-contracts/token-metadata/collections), the creators of an asset must be verified to ensure the authenticity of the asset. {% .lead %}

A creator whose `verified` flag is `false` could have been added by anyone and, therefore, cannot be trusted. On the other hand, a creator whose `verified` flag is `true` is guaranteed to have signed a transaction that verified them as a creator of that asset.

In the section below, we will learn how to verify and unverify the creators of an asset. Note that before verifying a creator, it must already be part of the **Creators** array of the asset's **Metadata** account. This can be done when [minting the asset](/smart-contracts/token-metadata/mint) but also when [updating the asset](/smart-contracts/token-metadata/update).

## Verify a Creator

The **Verify** instruction can be used to verify the creator of an asset. Notice that the same instruction can also be used to verify collections providing we pass different arguments to the instruction. Some of our SDKs split these instructions into multiple helpers like `verifyCreatorV1` and `verifyCollectionV1` to provide a better developer experience.

The main attributes required by the **Verify** instruction in the context of verifying a creator are the following:

- **Metadata**: The address of the asset's **Metadata** account.
- **Authority**: The creator we are trying to verify as a Signer.

Here's how we can use our SDKs to verify a creator on Token Metadata.

{% code-tabs-imported from="token-metadata/verify-creator" frameworks="umi,kit" /%}

## Unverify a Creator

Reciprocally, the **Unverify** instruction can be used to turn the `verified` flag of a creator to `false`. It accepts the same attributes as the **Verify** instruction and can be used in the same way.

{% code-tabs-imported from="token-metadata/unverify-creator" frameworks="umi,kit" /%}
