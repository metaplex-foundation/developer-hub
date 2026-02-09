---
title: Burning NFTs
metaTitle: Burning NFTs | Token Metadata
description: Burn NFTs, fungible tokens, and Programmable NFTs on Solana using the Token Metadata BurnV1 instruction. Reclaim rent from closed accounts and permanently destroy digital assets.
updated: '02-07-2026'
keywords:
  - burn NFT Solana
  - BurnV1 instruction
  - delete NFT
  - reclaim rent
  - destroy token
about:
  - burning NFTs
  - account cleanup
  - rent reclamation
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
howToSteps:
  - Identify the asset to burn
  - Call BurnV1 with the mint, token, and metadata accounts
  - Confirm the transaction and reclaim rent
howToTools:
  - Umi SDK
  - Kit SDK
  - Rust SDK
faqs:
  - q: How do I burn an NFT?
    a: Use burnV1 with the mint address and token standard. The instruction closes the Token, Metadata, and Edition accounts and returns rent to the payer.
  - q: Can I burn a Programmable NFT?
    a: Yes. Burning pNFTs follows the same pattern but must go through the Token Metadata program. Authorization rules in the RuleSet may restrict who can burn.
  - q: Does burning an NFT refund rent?
    a: Yes. Burning closes the associated accounts (Token, Metadata, Master Edition/Edition) and returns the rent-exempt lamports to the specified authority.
  - q: Can a delegate burn an NFT?
    a: Yes, if a burn delegate has been approved on the asset. The delegate can call BurnV1 with their authority.
---

The owner of an asset can burn it using the **Burn** instruction of the Token Metadata program. This will close all possible accounts associated with the asset and transfer the various rent-exempt fees previously held in the closed accounts to the owner. This instruction accepts the following attributes:

- **Authority**: The signer that authorizes the burn. Typically, this is the owner of the asset but note that certain delegated authorities can also burn assets on behalf of the owner as discussed in the "[Delegated Authorities](/smart-contracts/token-metadata/delegates)" page.
- **Token Owner**: The public key of the current owner of the asset.
- **Token Standard**: The standard of the asset being burnt. This instruction works for all Token Standards in order to provide a unified interface for burning assets. That being said, it is worth noting that non-programmable assets can be burnt using the **Burn** instruction of the SPL Token program directly.

The exact accounts closed by the **Burn** instruction depend on the Token Standard of the asset being burnt. Here's a table that summarizes the accounts for each Token Standard:

| Token Standard                 | Mint | Token                      | Metadata | Edition | Token Record | Edition Marker                    |
| ------------------------------ | ---- | -------------------------- | -------- | ------- | ------------ | --------------------------------- |
| `NonFungible`                  | ❌   | ✅                         | ✅       | ✅      | ❌           | ❌                                |
| `NonFungibleEdition`           | ❌   | ✅                         | ✅       | ✅      | ❌           | ✅ if all prints for it are burnt |
| `Fungible` and `FungibleAsset` | ❌   | ✅ if all tokens are burnt | ❌       | ❌      | ❌           | ❌                                |
| `ProgrammableNonFungible`      | ❌   | ✅                         | ✅       | ✅      | ✅           | ❌                                |

Note that the Mint account is never closed because the SPL Token program does not allow it.

Here is how you can use our SDKs to burn an asset on Token Metadata.

## NFT Burn

{% code-tabs-imported from="token-metadata/burn-nft" frameworks="umi,kit,shank,anchor" /%}

## pNFT Burn

`pNFTs` may require additional accounts to be passed in for the instruction to work. These may include:

- tokenAccount
- tokenRecord
- authorizationRules
- authorizationRulesProgram

{% code-tabs-imported from="token-metadata/burn-pnft" frameworks="umi,kit,shank,anchor" /%}
