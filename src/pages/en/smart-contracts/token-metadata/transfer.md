---
title: Transferring Assets
metaTitle: Transferring Assets | Token Metadata
description: Learn how to transfer Assets on Token Metadata
---

The owner of an asset can transfer it to another account by sending a **Transfer** instruction to the Token Metadata program. This instruction accepts the following attributes:

- **Authority**: The signer that authorized the transfer. Typically, this is the owner of the asset but note that certain delegated authorities can also transfer assets on behalf of the owner as discussed in the "[Delegated Authorities](/token-metadata/delegates)" page.
- **Token Owner**: The public key of the current owner of the asset.
- **Destination Owner**: The public key of the new owner of the asset.
- **Token Standard**: The standard of the asset being transferred. This instruction works for all Token Standards in order to provide a unified interface for transferring assets. That being said, it is worth noting that non-programmable assets can be transferred using the **Transfer** instruction of the SPL Token program directly.

Here is how you can use our SDKs to transfer an asset on Token Metadata.

## Transfer NFT

{% dialect-switcher title="Transfer an NFT" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { transferV1 } from '@metaplex-foundation/mpl-token-metadata'

await transferV1(umi, {
  mint,
  authority: currentOwner,
  tokenOwner: currentOwner.publicKey,
  destinationOwner: newOwner.publicKey,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Transfer pNFT

The following code is an example of transferring a pNFT to a new owner.

{% dialect-switcher title="Transfer a pNFT" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { getMplTokenAuthRulesProgramId } from "@metaplex-foundation/mpl-candy-machine";
import {
  fetchDigitalAssetWithAssociatedToken,
  findTokenRecordPda,
  TokenStandard,
  transferV1,
} from "@metaplex-foundation/mpl-token-metadata";
import { findAssociatedTokenPda } from "@metaplex-foundation/mpl-toolbox";
import { publicKey, unwrapOptionRecursively } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";

// The NFT Asset Mint ID
const mintId = publicKey("11111111111111111111111111111111");

// Fetch the pNFT Asset with the Token Account
const assetWithToken = await fetchDigitalAssetWithAssociatedToken(
  umi,
  mintId,
  umi.identity.publicKey
);

// The destination wallet
const destinationAddress = publicKey(
  "22222222222222222222222222222222"
);

// Calculates the destination wallet's Token Account
const destinationTokenAccount = findAssociatedTokenPda(umi, {
  mint: mintId,
  owner: destinationAddress,
});

// Calculates the destinations wallet's Token Record Account
const destinationTokenRecord = findTokenRecordPda(umi, {
  mint: mintId,
  token: destinationTokenAccount[0],
});

// Transfer the pNFT
const { signature } = await transferV1(umi, {
  mint: mintId,
  destinationOwner: destinationAddress,
  destinationTokenRecord: destinationTokenRecord,
  tokenRecord: assetWithToken.tokenRecord?.publicKey,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
  // Check to see if the pNFT asset as auth rules.
  authorizationRules:
    unwrapOptionRecursively(assetWithToken.metadata.programmableConfig)
      ?.ruleSet || undefined,
  // Auth rules program ID
  authorizationRulesProgram: getMplTokenAuthRulesProgramId(umi),
  // Some pNFTs may require authorization data if set.
  authorizationData: undefined,
}).sendAndConfirm(umi);

console.log("Signature: ", base58.deserialize(signature));
```
{% /dialect %}
{% /dialect-switcher %}