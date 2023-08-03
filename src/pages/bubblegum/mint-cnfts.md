---
title: Minting Compressed NFTs
metaTitle: Bubblegum - Minting Compressed NFTs
description: Learn how to mint compressed NFTs on Bubblegum
---

In [the previous page](/bubblegum/create-trees), we saw that we need a Bubblegum Tree in order to mint Compressed NFTs and we saw how to create one. Now, let's see how to mint compressed NFTs from a given Bubblegum Tree. The Bubblegum program offers two minting instructions. One that mints NFTs without associating them to a collection and one that mints NFTs to a given collection. Let's start by looking at the former, since the latter simply requires a few more parameters.

## Minting without a Collection

TODO

{% dialect-switcher title="Mint a Compressed NFT without a Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { none } from '@metaplex-foundation/umi'
import { mintV1 } from '@metaplex-foundation/mpl-bubblegum'

await mintV1(umi, {
  leafOwner,
  merkleTree,
  message: {
    name: 'My Compressed NFT',
    uri: 'https://example.com/my-cnft.json',
    sellerFeeBasisPoints: 500, // 5%
    collection: none(),
    creators: [
      { address: umi.identity.publicKey, verified: false, share: 100 },
    ],
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Minting to a Collection

TODO

{% dialect-switcher title="Mint a Compressed NFT to a Collection" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { none } from '@metaplex-foundation/umi'
import { mintToCollectionV1 } from '@metaplex-foundation/mpl-bubblegum'

await mintToCollectionV1(umi, {
  leafOwner,
  merkleTree,
  collectionMint,
  message: {
    name: 'My Compressed NFT',
    uri: 'https://example.com/my-cnft.json',
    sellerFeeBasisPoints: 500, // 5%
    collection: { key: collectionMint, verified: false },
    creators: [
      { address: umi.identity.publicKey, verified: false, share: 100 },
    ],
  },
}).sendAndConfirm(umi)
```

{% totem-accordion title="Create a Collection NFT" %}

If you do not have a Collection NFT yet, you can create one using the `@metaplex-foundation/mpl-token-metadata` library (currently under the `alpha` tag).

```shell
npm install @metaplex-foundation/mpl-token-metadata@alpha
```

And create a Collection NFT like so:

```ts
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  name: 'My Collection',
  uri: 'https://example.com/my-collection.json',
  sellerFeeBasisPoints: percentAmount(5.5), // 5.5%
  isCollection: true,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

TODO
