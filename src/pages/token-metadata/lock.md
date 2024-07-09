---
title: Locking Assets
metaTitle: Token Metadata - Locking Assets
description: Learn how to lock/freeze Assets on Token Metadata
---

As mentioned in the "[Delegate Authorities](/token-metadata/delegates#token-delegates)" page, certain delegates can lock and unlock assets, preventing their owners from transferring or burning them. A locked NFT also forbids the owner from revoking the delegate's authority. This locking mechanism enables various utility use cases — such as staking — that would otherwise require an escrow account to function. {% .lead %}

In the table below, we list all the Token Delegates that support locking assets. You can learn more about each of these delegates and how to approve/revoke them in their respective sections.

| Delegate                                                                        | Lock/Unlock | Transfer | Burn | For              |
| ------------------------------------------------------------------------------- | ----------- | -------- | ---- | ---------------- |
| [Standard](/token-metadata/delegates#standard-delegate)                         | ✅          | ✅       | ✅   | All except PNFTs |
| [Locked Transfer](/token-metadata/delegates#locked-transfer-delegate-pNFT-only) | ✅          | ✅       | ❌   | PNFTs only       |
| [Utility](/token-metadata/delegates#utility-delegate-pNFT-only)                 | ✅          | ❌       | ✅   | PNFTs only       |
| [Staking](/token-metadata/delegates#staking-delegate-pNFT-only)                 | ✅          | ❌       | ❌   | PNFTs only       |

Assuming we have an approved Token Delegate on an NFT, let's now see how the delegate can lock and unlock it.

## Lock an NFT

To lock an NFT, the delegate may use the **Lock** instruction of the Token Metadata program. This instruction accepts the following attributes:

- **Mint**: The address of the NFT's Mint account.
- **Authority**: The signer that authorizes the lock. This must be the delegated authority.
- **Token Standard**: The standard of the NFT being locked. Note that the Token Metadata program does not explicitly require this argument but our SDKs do so they can provide adequate default values for most of the other parameters.

{% dialect-switcher title="Lock an NFT" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { lockV1 } from '@metaplex-foundation/mpl-token-metadata'

await lockV1(umi, {
  mint,
  authority,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Unlock an NFT

Reciprocally, the delegate may use the **Unlock** instruction of the Token Metadata program to unlock an NFT. This instruction accepts the same attributes as the **Lock** instruction and can be used in the same way.

{% dialect-switcher title="Unlock an NFT" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { unlockV1 } from '@metaplex-foundation/mpl-token-metadata'

await unlockV1(umi, {
  mint,
  authority,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}
