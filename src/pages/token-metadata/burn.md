---
title: Burning Assets
metaTitle: Burning Assets | Token Metadata
description: Learn how to burn Assets on Token Metadata
---

The owner of an asset can burn it using the **Burn** instruction of the Token Metadata program. This will close all possible accounts associated with the asset and transfer the various rent-exempt fees previously held in the closed accounts to the owner. This instruction accepts the following attributes:

- **Authority**: The signer that authorizes the burn. Typically, this is the owner of the asset but note that certain delegated authorities can also burn assets on behalf of the owner as discussed in the "[Delegated Authorities](/token-metadata/delegates)" page.
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

{% dialect-switcher title="NFT Asset Burn" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { burnV1 } from '@metaplex-foundation/mpl-token-metadata'

await burnV1(umi, {
  mint,
  authority: owner,
  tokenOwner: owner.publicKey,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

If the asset that you are trying to burn is part of a collection you additionally need to pass the collectionMetadata account into the function:

{% dialect-switcher title="Burning NFT Assets that are part of a collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { burnV1, findMetadataPda } from '@metaplex-foundation/mpl-token-metadata'

await burnV1(umi, {
  mint,
  authority: owner,
  tokenOwner: owner.publicKey,
  collectionMetadata: findMetadataPda( umi, { mint: collectionMintAddress })
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## pNFT Burn

{% dialect-switcher title="pNFT Asset Burn" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  burnV1,
  fetchDigitalAssetWithAssociatedToken,
  findMetadataPda,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import { publicKey, unwrapOption } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";

// The pNFT mint ID
const mintId = publicKey("11111111111111111111111111111111");

// Fetch the pNFT Asset with the Token Account
const assetWithToken = await fetchDigitalAssetWithAssociatedToken(
  umi,
  mintId,
  umi.identity.publicKey
);

// Determine if the pNFT Asset is in a collection
const collectionMint = unwrapOption(assetWithToken.metadata.collection);

// If there's a collection find the collection metadata PDAs
const collectionMetadata = collectionMint
  ? findMetadataPda(umi, { mint: collectionMint.key })
  : null;

// Burn the pNFT Asset
const res = await burnV1(umi, {
  mint: mintId,
  collectionMetadata: collectionMetadata || undefined,
  token: assetWithToken.token.publicKey,
  tokenRecord: assetWithToken.tokenRecord?.publicKey,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi);


const signature = base58.deserialize(tx.signature)[0];
console.log('Transaction Signature: ' + signature)
```

{% /dialect %}
{% /dialect-switcher %}
