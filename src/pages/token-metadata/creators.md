---
title: Verified Creators
metaTitle: Token Metadata - Verified Creators
description: Learn how to verify the creators of an Asset on Token Metadata
---

_Coming soon..._

## Verify a Creator

_Coming soon..._

{% dialect-switcher title="Verify a Creator" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { verifyCreatorV1 } from '@metaplex-foundation/mpl-token-metadata'

await verifyCreatorV1(umi, {
  metadata,
  authority: creator,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Unverify a Creator

_Coming soon..._

{% dialect-switcher title="Unverify a Creator" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { unverifyCreatorV1 } from '@metaplex-foundation/mpl-token-metadata'

await unverifyCreatorV1(umi, {
  metadata,
  authority: creator,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}
