---
title: Transferring Assets
metaTitle: Token Metadata - Transferring Assets
description: Learn how to transfer Assets on Token Metadata
---

The owner of an Nft can transfer it to another account by sending a **Transfer** instruction to the Token Metadata program. This instruction accepts the following attributes:

- **Authority**: The signer that authorized the transfer. Typically, this is the owner of the Nft but note that certain delegated authorities can also transfer assets on behalf of the owner as discussed in the "[Delegated Authorities](/token-metadata/delegates)" page.
- **Token Owner**: The public key of the current owner of the Nft.
- **Destination Owner**: The public key of the new owner of the Nft.
- **Token Standard**: The standard of the Nft being transferred. This instruction works for all Token Standards in order to provide a unified interface for transferring assets. That being said, it is worth noting that non-programmable assets can be transferred using the **Transfer** instruction of the SPL Token program directly.

Here is how you can use our SDKs to transfer an Nft on Token Metadata.

{% dialect-switcher title="Transfer Assets" %}
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
