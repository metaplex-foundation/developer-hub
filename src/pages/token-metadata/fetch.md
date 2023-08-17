---
title: Fetching Assets
metaTitle: Token Metadata - Fetching Assets
description: Learn how to fetch the various on-chain accounts of your assets on Token Metadata
---

_Coming soon..._

## Digital Assets

_Coming soon..._

### Fetch By Mint

_Coming soon..._

{% dialect-switcher title="Fetch Asset by Mint" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata'

const asset = await fetchDigitalAsset(umi, mint)
```

{% /dialect %}
{% /dialect-switcher %}

### Fetch By Metadata

_Coming soon..._

{% dialect-switcher title="Fetch Asset by Metadata" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchDigitalAssetByMetadata } from '@metaplex-foundation/mpl-token-metadata'

const asset = await fetchDigitalAssetByMetadata(umi, metadata)
```

{% /dialect %}
{% /dialect-switcher %}

### Fetch All By Mint List

_Coming soon..._

{% dialect-switcher title="Fetch Assets by Mint List" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchAllDigitalAsset } from '@metaplex-foundation/mpl-token-metadata'

const [assetA, assetB] = await fetchAllDigitalAsset(umi, [mintA, mintB])
```

{% /dialect %}
{% /dialect-switcher %}

### Fetch All By Creator

_Coming soon..._

{% dialect-switcher title="Fetch Assets by Creator" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchAllDigitalAssetByCreator } from '@metaplex-foundation/mpl-token-metadata'

// Assets such that the creator is first in the Creator array.
const assetsA = await fetchAllDigitalAssetByCreator(umi, creator)

// Assets such that the creator is second in the Creator array.
const assetsB = await fetchAllDigitalAssetByCreator(umi, creator, {
  position: 2,
})
```

{% /dialect %}
{% /dialect-switcher %}

### Fetch All By Owner

_Coming soon..._

{% dialect-switcher title="Fetch Assets by Owner" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchAllDigitalAssetByOwner } from '@metaplex-foundation/mpl-token-metadata'

const assets = await fetchAllDigitalAssetByOwner(umi, owner)
```

{% /dialect %}
{% /dialect-switcher %}

### Fetch All By Update Authority

_Coming soon..._

{% dialect-switcher title="Fetch Assets by Update Authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchAllDigitalAssetByUpdateAuthority } from '@metaplex-foundation/mpl-token-metadata'

const assets = await fetchAllDigitalAssetByUpdateAuthority(umi, owner)
```

{% /dialect %}
{% /dialect-switcher %}

## Digital Assets With Token

_Coming soon..._

### Fetch By Mint

_Coming soon..._

{% dialect-switcher title="Fetch Asset with Token By Mint" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchDigitalAssetWithTokenByMint } from '@metaplex-foundation/mpl-token-metadata'

const asset = await fetchDigitalAssetWithTokenByMint(umi, owner)
```

{% /dialect %}
{% /dialect-switcher %}

### Fetch By Mint and Owner

_Coming soon..._ (More performant)

{% dialect-switcher title="Fetch Asset with Token By Mint" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchDigitalAssetWithAssociatedToken } from '@metaplex-foundation/mpl-token-metadata'

const asset = await fetchDigitalAssetWithAssociatedToken(umi, mint, owner)
```

{% /dialect %}
{% /dialect-switcher %}

### Fetch All By Owner

_Coming soon..._

{% dialect-switcher title="Fetch Assets with Token By Owner" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchAllDigitalAssetWithTokenByOwner } from '@metaplex-foundation/mpl-token-metadata'

const assets = await fetchAllDigitalAssetWithTokenByOwner(umi, owner)
```

{% /dialect %}
{% /dialect-switcher %}

### Fetch All By Mint

_Coming soon..._

{% dialect-switcher title="Fetch Assets with Token By Owner" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchAllDigitalAssetWithTokenByMint } from '@metaplex-foundation/mpl-token-metadata'

const assets = await fetchAllDigitalAssetWithTokenByMint(umi, owner)
```

{% /dialect %}
{% /dialect-switcher %}

### Fetch All By Owner and Mint

_Coming soon..._

{% dialect-switcher title="Fetch Assets with Token By Mint and Owner" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchAllDigitalAssetWithTokenByOwnerAndMint } from '@metaplex-foundation/mpl-token-metadata'

const assets = await fetchAllDigitalAssetWithTokenByOwnerAndMint(
  umi,
  owner,
  mint
)
```

{% /dialect %}
{% /dialect-switcher %}
