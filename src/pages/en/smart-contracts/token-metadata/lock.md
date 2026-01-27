---
title: Locking Assets
metaTitle: Locking Assets | Token Metadata
description: Learn how to lock/freeze Assets on Token Metadata
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
