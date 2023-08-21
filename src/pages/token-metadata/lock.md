---
title: Locking Assets
metaTitle: Token Metadata - Locking Assets
description: Learn how to lock/freeze Assets on Token Metadata
---

_Coming soon..._

## Lock an asset

_Coming soon..._

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

## Unlock an asset

_Coming soon..._

{% dialect-switcher title="Unlock an asset" %}
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
