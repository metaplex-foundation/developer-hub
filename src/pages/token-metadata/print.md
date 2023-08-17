---
title: Printing Editions
metaTitle: Token Metadata - Printing Editions
description: Learn how to print NFT editions on Token Metadata
---

## Printable NFTs

_Coming soon..._

## Setting up a Master Edition NFT

_Coming soon..._

{% dialect-switcher title="Create the Master Edition NFT" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { percentAmount, generateSigner } from '@metaplex-foundation/umi'
import { createNft, printSupply } from '@metaplex-foundation/mpl-token-metadata'

const mint = generateSigner(umi)
await createNft(umi, {
  mint,
  name: 'My Master Edition NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
  printSupply: printSupply('Limited', [100]), // Or printSupply('Unlimited')
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Printing Editions from the Master Edition NFT

_Coming soon..._
