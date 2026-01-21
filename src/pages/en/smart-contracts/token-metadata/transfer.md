---
title: Transferring Assets
metaTitle: Transferring Assets | Token Metadata
description: Learn how to transfer Assets on Token Metadata
---

The owner of an asset can transfer it to another account by sending a **Transfer** instruction to the Token Metadata program. This instruction accepts the following attributes:

- **Authority**: The signer that authorized the transfer. Typically, this is the owner of the asset but note that certain delegated authorities can also transfer assets on behalf of the owner as discussed in the "[Delegated Authorities](/smart-contracts/token-metadata/delegates)" page.
- **Token Owner**: The public key of the current owner of the asset.
- **Destination Owner**: The public key of the new owner of the asset.
- **Token Standard**: The standard of the asset being transferred. This instruction works for all Token Standards in order to provide a unified interface for transferring assets. That being said, it is worth noting that non-programmable assets can be transferred using the **Transfer** instruction of the SPL Token program directly.

Here is how you can use our SDKs to transfer an asset on Token Metadata.

## Transfer NFT

{% code-tabs-imported from="token-metadata/transfer-nft" frameworks="umi,kit" /%}

## Transfer pNFT

Programmable NFTs (pNFTs) may have additional authorization rules that need to be handled during transfer. The instruction will automatically handle Token Record accounts.

{% code-tabs-imported from="token-metadata/transfer-pnft" frameworks="umi,kit" /%}

### Advanced pNFT Transfer

For pNFTs with complex authorization rules, you may need to provide additional parameters.

{% code-tabs-imported from="token-metadata/transfer-pnft-advanced" frameworks="umi,kit" /%}
