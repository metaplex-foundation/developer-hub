---
title: Locking Assets
metaTitle: Locking Assets | Token Metadata
description: Learn how to lock/freeze Assets on Token Metadata
---

As mentioned in the "[Delegate Authorities](/token-metadata/delegates#token-delegates)" page, certain delegates can lock and unlock assets, preventing their owners from transferring or burning them. A locked asset also forbids the owner from revoking the delegate's authority. This locking mechanism enables various utility use cases — such as staking — that would otherwise require an escrow account to function. {% .lead %}

In the table below, we list all the Token Delegates that support locking assets. You can learn more about each of these delegates and how to approve/revoke them in their respective sections.

| Delegate                                                                        | Lock/Unlock | Transfer | Burn | For              |
| ------------------------------------------------------------------------------- | ----------- | -------- | ---- | ---------------- |
| [Standard](/token-metadata/delegates#standard-delegate)                         | ✅          | ✅       | ✅   | All except pNFTs |
| [Locked Transfer](/token-metadata/delegates#locked-transfer-delegate-pnft-only) | ✅          | ✅       | ❌   | pNFTs only       |
| [Utility](/token-metadata/delegates#utility-delegate-pnft-only)                 | ✅          | ❌       | ✅   | pNFTs only       |
| [Staking](/token-metadata/delegates#staking-delegate-pnft-only)                 | ✅          | ❌       | ❌   | pNFTs only       |

Assuming we have an approved Token Delegate on an asset, let's now see how the delegate can lock and unlock it.

## Lock an Asset

### NFT

To lock an asset, the delegate may use the **Lock** instruction of the Token Metadata program. This instruction accepts the following attributes:

- **Mint**: The address of the asset's Mint account.
- **Authority**: The signer that authorizes the lock. This must be the delegated authority.
- **Token Standard**: The standard of the asset being locked. Note that the Token Metadata program does not explicitly require this argument but our SDKs do so they can provide adequate default values for most of the other parameters.

{% dialect-switcher title="Lock an asset" %}
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

### pNFT

```ts
import {
  fetchDigitalAssetWithAssociatedToken,
  lockV1,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";

// Mint ID of the pNFT Asset
const mintId = publicKey("11111111111111111111111111111111");

// Fetch pNFT Asset with Token Accounts
const assetWithToken = await fetchDigitalAssetWithAssociatedToken(
  umi,
  mintId,
  umi.identity.publicKey
);

// Send lock instruction
const { signature } = await lockV1(umi, {
  // Mint ID of the pNFT Asset
  mint: mintId,
  // Update Authority or Delegate Authority
  authority: umi.identity,
  // Token Standard
  tokenStandard: TokenStandard.ProgrammableNonFungible,
  // Owner of the pNFT Asset
  tokenOwner: assetWithToken.token.owner,
  // Token Account of the pNFT Asset
  token: assetWithToken.token.publicKey,
  // Token Record of the pNFT Asset
  tokenRecord: assetWithToken.tokenRecord?.publicKey,
}).sendAndConfirm(umi);

console.log("Signature: ", base58.deserialize(signature));
```

## Unlock an Asset

### NFT

Reciprocally, the delegate may use the **Unlock** instruction of the Token Metadata program to unlock an asset. This instruction accepts the same attributes as the **Lock** instruction and can be used in the same way.

{% dialect-switcher title="Unlock an NFT Asset" %}
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

### pNFT

{% dialect-switcher title="Unlock a pNFT Asset" %}
{% dialect title="JavaScript" id="js" %}
```ts
import {
    fetchDigitalAssetWithAssociatedToken,
    TokenStandard,
    unlockV1
} from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";

// Mint ID of the Asset
const mintId = publicKey("11111111111111111111111111111111");

// Fetch the mint token accounts
const assetWithToken = await fetchDigitalAssetWithAssociatedToken(
  umi,
  mintId,
  umi.identity.publicKey
);

// Send unlock instruction
const { signature } = await unlockV1(umi, {
  // Mint ID of the pNFT Asset
  mint: mintId,
  // Update Authority or Delegate Authority
  authority: umi.identity,
  // Token Standard
  tokenStandard: TokenStandard.ProgrammableNonFungible,
  // Owner of the pNFT Assets
  tokenOwner: assetWithToken.token.owner,
  // Token Account of the pNFT Asset
  token: assetWithToken.token.publicKey,
  // Token Record of the pNFT Asset
  tokenRecord: assetWithToken.tokenRecord?.publicKey,
}).sendAndConfirm(umi);

console.log("Signature: ", base58.deserialize(signature));
```
