---
title: Burning Assets
metaTitle: Burning Assets | Token Metadata
description: Learn how to burn Assets on Token Metadata
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
