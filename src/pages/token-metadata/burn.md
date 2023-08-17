---
title: Burning Assets
metaTitle: Token Metadata - Burning Assets
description: Learn how to burn Assets on Token Metadata
---

_Coming soon..._

{% dialect-switcher title="Burning Assets" %}
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
