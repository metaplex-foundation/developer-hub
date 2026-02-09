---
title: Transferring NFTs
metaTitle: Transferring NFTs | Token Metadata
description: Transfer NFTs, fungible tokens, and Programmable NFTs on Solana using the Token Metadata TransferV1 instruction. Covers owner transfers, delegate transfers, and pNFT authorization rules.
updated: '02-07-2026'
keywords:
  - transfer NFT Solana
  - TransferV1 instruction
  - send NFT
  - pNFT transfer
  - delegate transfer
about:
  - transferring NFTs
  - NFT ownership transfer
  - delegate transfers
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
howToSteps:
  - Identify the asset to transfer and the destination wallet
  - Call TransferV1 with the mint, token, and destination accounts
  - Confirm the transaction
howToTools:
  - Umi SDK
  - Kit SDK
  - Rust SDK
faqs:
  - q: How do I transfer an NFT to another wallet?
    a: Use transferV1 with the mint address, your token account, and the destination owner address. The SDK handles associated token account creation automatically.
  - q: Can a delegate transfer an NFT?
    a: Yes. If a transfer delegate has been approved, they can transfer the NFT on behalf of the owner using TransferV1 with their authority.
  - q: How do pNFT transfers work?
    a: Programmable NFT transfers go through the Token Metadata program, which checks the RuleSet authorization rules before allowing the transfer. Additional accounts (Token Record, Edition) may be required.
  - q: Do I need to create the destination token account first?
    a: No. The TransferV1 instruction creates the associated token account for the destination if it doesn't exist. The payer covers the rent.
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
