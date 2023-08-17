---
title: Transferring Assets
metaTitle: Token Metadata - Transferring Assets
description: Learn how to transfer Assets on Token Metadata
---

_Coming soon..._

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
