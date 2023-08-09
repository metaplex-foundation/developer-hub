---
title: Decompressing Compressed NFTs
metaTitle: Bubblegum - Decompressing Compressed NFTs
description: Learn how to redeem and decompress compressed NFTs on Bubblegum
---

It is possible for the owner of a Compressed NFT to decompress it into a regular NFT. {% .lead %}

This means on-chain accounts such as the Mint account, the Metadata account and the Master Edition account will be created for the NFT. This enables the NFT to perform certain operations that cannot be done with Compressed NFTs, interact with platforms that do not support Compressed NFTs and increase its interoperability with the NFT ecosystem in general.

## The decompression process

_Coming soon..._

{% diagram %}

{% node #merkle-tree-wrapper %}
{% node #merkle-tree label="Merkle Tree Account" theme="blue" /%}
{% node label="Owner: Account Compression Program" theme="dimmed" /%}
{% /node %}

{% node #tree-config-pda parent="merkle-tree" x="87" y="-60" label="PDA" theme="crimson" /%}

{% node #tree-config parent="tree-config-pda" x="-63" y="-80" %}
{% node label="Tree Config Account" theme="crimson" /%}
{% node label="Owner: Bubblegum Program" theme="dimmed" /%}
{% /node %}

{% node #voucher-wrapper parent="merkle-tree" x="350" %}
{% node #voucher label="Voucher Account" theme="crimson" /%}
{% node label="Owner: Bubblegum Program" theme="dimmed" /%}
{% /node %}

{% node parent="voucher" x="320" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node #edition-pda parent="mint" x="80" y="-100" label="PDA" theme="crimson" /%}
{% node #metadata-pda parent="mint" x="80" y="-200" label="PDA" theme="crimson" /%}

{% node parent="edition-pda" x="-250" %}
{% node #edition label="Master Edition Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}

{% node parent="metadata-pda" x="-250" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}

{% edge from="merkle-tree" to="tree-config-pda" path="straight" /%}
{% edge from="tree-config-pda" to="tree-config" path="straight" /%}
{% edge from="merkle-tree" to="voucher" animated=true label="1️⃣  Redeem" theme="mint" /%}
{% edge from="voucher" to="mint" animated=true label="2️⃣  Decompress" theme="mint" /%}
{% edge from="voucher-wrapper" to="merkle-tree-wrapper" animated=true label="2️⃣  Cancel Redeem" fromPosition="bottom" toPosition="bottom" theme="red" labelX=175 /%}
{% edge from="mint" to="edition-pda" fromPosition="right" toPosition="right" /%}
{% edge from="mint" to="metadata-pda" fromPosition="right" toPosition="right" /%}
{% edge from="edition-pda" to="edition" path="straight" /%}
{% edge from="metadata-pda" to="metadata" path="straight" /%}

{% /diagram %}

## Redeeming a Compressed NFT

_Coming soon..._

{% dialect-switcher title="Redeem a Compressed NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, redeem } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId)
await redeem(umi, {
  ...assetWithProof,
  leafOwner: currentLeafOwner,
}).sendAndConfirm(umi)
```

{% totem-accordion title="Using a delegate" %}

```ts
import { getAssetWithProof, redeem } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId)
await redeem(umi, {
  ...assetWithProof,
  leafDelegate: currentLeafDelegate,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Decompressing a Redeemed NFT

_Coming soon..._

{% dialect-switcher title="Decompress a Redeemed Compressed NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  findVoucherPda,
  decompressV1,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId)
await decompressV1(umi, {
  ...assetWithProof,
  leafOwner: currentLeafOwner,
  mint: assetId,
  voucher: findVoucherPda(umi, assetWithProof),
}).sendAndConfirm(umi)
```

{% totem-accordion title="Using a delegate" %}

```ts
import {
  getAssetWithProof,
  findVoucherPda,
  decompressV1,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId)
await decompressV1(umi, {
  ...assetWithProof,
  leafDelegate: currentLeafDelegate,
  mint: assetId,
  voucher: findVoucherPda(umi, assetWithProof),
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Cancelling a Redeemed NFT

_Coming soon..._

{% dialect-switcher title="Cancel the decompression a Redeemed Compressed NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  findVoucherPda,
  cancelRedeem,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId)
await cancelRedeem(umi, {
  ...assetWithProof,
  leafOwner: currentLeafOwner,
  voucher: findVoucherPda(umi, assetWithProof),
}).sendAndConfirm(umi)
```

{% totem-accordion title="Using a delegate" %}

```ts
import {
  getAssetWithProof,
  findVoucherPda,
  cancelRedeem,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId)
await cancelRedeem(umi, {
  ...assetWithProof,
  leafDelegate: currentLeafDelegate,
  voucher: findVoucherPda(umi, assetWithProof),
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
