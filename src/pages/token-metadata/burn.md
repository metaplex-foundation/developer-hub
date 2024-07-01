---
title: Burning Nfts
metaTitle: Token Metadata - Burning Nfts
description: Learn how to burn Nftss on Token Metadata
---

The owner of an Nft can burn it using the **Burn** instruction of the Token Metadata program. This will close all possible accounts associated with the Nft and return the various rent-exempt fees to the owner. This instruction accepts the following attributes:

- **Authority**: The signer that authorizes the burn. Typically, this is the owner of the Nft but note that certain delegated authorities can also burn Nftss on behalf of the owner as discussed in the "[Delegated Authorities](/token-metadata/delegates)" page.
- **Token Owner**: The public key of the current owner of the Nft.
- **Token Standard**: The standard of the Nft being burnt. This instruction works for all Token Standards in order to provide a unified interface for burning Nfts. That being said, it is worth noting that non-programmable Nfts can be burnt using the **Burn** instruction of the SPL Token program directly.

The exact accounts closed by the **Burn** instruction depend on the Token Standard of the Nft being burnt. Here's a table that summarizes the accounts for each Token Standard:

| Token Standard                 | Mint | Token                      | Metadata | Edition | Token Record | Edition Marker                    |
| ------------------------------ | ---- | -------------------------- | -------- | ------- | ------------ | --------------------------------- |
| `NonFungible`                  | ❌   | ✅                         | ✅       | ✅      | ❌           | ❌                                |
| `NonFungibleEdition`           | ❌   | ✅                         | ✅       | ✅      | ❌           | ✅ if all prints for it are burnt |
| `Fungible` and `FungibleAsset` | ❌   | ✅ if all tokens are burnt | ❌       | ❌      | ❌           | ❌                                |
| `ProgrammableNonFungible`      | ❌   | ✅                         | ✅       | ✅      | ✅           | ❌                                |

Note that the Mint account is never closed because the SPL Token program does not allow it.

Here is how you can use our SDKs to burn an asset on Token Metadata.

{% dialect-switcher title="Burning Nfts" %}
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

{% dialect-switcher title="Burning Assets that are part of a collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {publicKey } from '@metaplex-foundation/umi'
import { burnV1, findMetadataPda } from '@metaplex-foundation/mpl-token-metadata'

const mint = publicKey("1111111111111111111111111111111")

await burnV1(umi, {
  mint: mint,
  authority: owner,
  tokenOwner: owner.publicKey,
  collectionMetadata: findMetadataPda( umi, { mint: collectionMintAddress })
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}
