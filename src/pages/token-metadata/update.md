---
title: Updating Assets
metaTitle: Token Metadata - Updating Assets
description: Learn how to update Assets on Token Metadata
---

_Coming soon..._

{% dialect-switcher title="Update Assets" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  updateV1,
  fetchMetadataFromSeeds,
} from '@metaplex-foundation/mpl-token-metadata'

const initialMetadata = await fetchMetadataFromSeeds(umi, { mint })
await updateV1(umi, {
  mint,
  data: { ...initialMetadata, name: 'Updated Asset' },
}).sendAndConfirm(umi)
```

If you want to update more than just the **Data** attribute of the **Metadata** account, simply provide these attributes to the `updateV1` method.

```ts
import {
  updateV1,
  fetchMetadataFromSeeds,
} from '@metaplex-foundation/mpl-token-metadata'

const initialMetadata = await fetchMetadataFromSeeds(umi, { mint })
await updateV1(umi, {
  mint,
  data: { ...initialMetadata, name: 'Updated Asset' },
  primarySaleHappened: true,
  isMutable: true,
  // ...
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
