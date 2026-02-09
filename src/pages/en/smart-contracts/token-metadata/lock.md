---
title: Locking NFTs
metaTitle: Locking NFTs | Token Metadata
description: Lock and unlock NFTs on Solana using Token Metadata. Freeze token accounts to prevent transfers while listed on escrowless marketplaces or during staking using the LockV1 instruction.
updated: '02-07-2026'
keywords:
  - lock NFT Solana
  - freeze NFT
  - LockV1 instruction
  - escrowless marketplace
  - NFT staking lock
about:
  - locking NFTs
  - freeze delegate
  - escrowless listings
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
howToSteps:
  - Approve a lock delegate (or utility delegate for pNFTs) on the asset
  - The delegate calls LockV1 to freeze the token account
  - The asset cannot be transferred while locked
  - The delegate calls UnlockV1 to unfreeze when done
howToTools:
  - Umi SDK
  - Kit SDK
  - Rust SDK
faqs:
  - q: What does locking an NFT do?
    a: Locking freezes the token account, preventing the owner from transferring or burning the NFT. The asset remains in the owner's wallet but is immovable until unlocked.
  - q: Who can lock an NFT?
    a: Only an approved lock delegate (for standard NFTs) or utility delegate (for pNFTs) can lock an asset.
  - q: What are common use cases for locking?
    a: Escrowless marketplace listings (lock while listed, unlock when sold or delisted), staking programs, and preventing transfers during game events.
  - q: How do I unlock a locked NFT?
    a: The same delegate that locked the NFT must call UnlockV1 to unfreeze the token account and restore transferability.
---

As mentioned in the "[Delegate Authorities](/smart-contracts/token-metadata/delegates#token-delegates)" page, certain delegates can lock and unlock assets, preventing their owners from transferring or burning them. A locked asset also forbids the owner from revoking the delegate's authority. This locking mechanism enables various utility use cases — such as staking — that would otherwise require an escrow account to function. {% .lead %}

In the table below, we list all the Token Delegates that support locking assets. You can learn more about each of these delegates and how to approve/revoke them in their respective sections.

| Delegate                                                                        | Lock/Unlock | Transfer | Burn | For              |
| ------------------------------------------------------------------------------- | ----------- | -------- | ---- | ---------------- |
| [Standard](/smart-contracts/token-metadata/delegates#standard-delegate)                         | ✅          | ✅       | ✅   | All except pNFTs |
| [Locked Transfer](/smart-contracts/token-metadata/delegates#locked-transfer-delegate-pnft-only) | ✅          | ✅       | ❌   | pNFTs only       |
| [Utility](/smart-contracts/token-metadata/delegates#utility-delegate-pnft-only)                 | ✅          | ❌       | ✅   | pNFTs only       |
| [Staking](/smart-contracts/token-metadata/delegates#staking-delegate-pnft-only)                 | ✅          | ❌       | ❌   | pNFTs only       |

Assuming we have an approved Token Delegate on an asset, let's now see how the delegate can lock and unlock it.

## Lock an Asset

### NFT

To lock an asset, the delegate may use the **Lock** instruction of the Token Metadata program. This instruction accepts the following attributes:

- **Mint**: The address of the asset's Mint account.
- **Authority**: The signer that authorizes the lock. This must be the delegated authority.
- **Token Standard**: The standard of the asset being locked. Note that the Token Metadata program does not explicitly require this argument but our SDKs do so they can provide adequate default values for most of the other parameters.

{% code-tabs-imported from="token-metadata/lock-nft" frameworks="umi,kit" /%}

### pNFT

{% code-tabs-imported from="token-metadata/lock-pnft" frameworks="umi,kit" /%}

## Unlock an Asset

### NFT

Reciprocally, the delegate may use the **Unlock** instruction of the Token Metadata program to unlock an asset. This instruction accepts the same attributes as the **Lock** instruction and can be used in the same way.

{% code-tabs-imported from="token-metadata/unlock-nft" frameworks="umi,kit" /%}

### pNFT

{% code-tabs-imported from="token-metadata/unlock-pnft" frameworks="umi,kit" /%}
