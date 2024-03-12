---
title: Burning Assets
metaTitle: Core - Burning Assets
description: Learn how to burn Assets on Core
---

Asset can burn it using the **Burn** instruction. This will return the rent-exempt fees to the owner. Only a very small amount of SOL will stay in the account to prevent it from being reopened. This instruction accepts the following attributes:

- **Authority**: The signer that authorizes the burn. Typically, this is the owner of the asset but note that certain delegated authorities can also burn assets on behalf of the owner as discussed in the "[Plugins](/core/plugins)" page.
- **Owner**: The public key of the current owner of the asset.
- **Collection**: The address of the collection the asset is part of, if any. 

Here is how you can use our SDKs to burn a Core asset. The snippet assumes that you are the owner of the asset.

{% dialect-switcher title="Burning an Assets" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { burn } from '@metaplex-foundation/mpl-core'

  await burn(umi, {
    asset: asset.publicKey,
  }).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

{% seperator h="6" /%}

{% dialect-switcher title="Burning an Asset that is part of a collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { burn } from '@metaplex-foundation/mpl-core'

  await burn(umi, {
    asset: asset.publicKey,
    collection: collectionAdress
  }).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}