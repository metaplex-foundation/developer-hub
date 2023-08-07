---
title: Fetching Compressed NFTs
metaTitle: Bubblegum - Fetching Compressed NFTs
description: Learn how to fetch compressed NFTs on Bubblegum
---

As mentioned in the [Overview](/bubblegum#read-api) page, Compressed NFTs are not stored inside on-chain accounts like regular NFTs but, instead, they are logged in the transactions that created and updated them. {% .lead %}

As such, a special indexer was created to facilitate the retrieval of Compressed NFTs. This indexed data is made available through an extension of the Solana RPC methods which we call the **Read API**. Since not all RPCs support the Read API, you will need to choose your RPC provider carefully if you are planning to work with Compressed NFTs. Note that we maintain a list of all RPCs that support the Read API [in a dedicated page](/bubblegum/rpcs).

In this page, we will learn how to fetch Compressed NFTs using the Read API.

## Installing the Read API

Once you have chosen an RPC provider that supports the Read API, you may simply send special RPC methods to fetch Compressed NFTs. However, our SDKs provide a more convenient way to get started with the Read API by offering helper methods. Follow the instructions below to get started with the Read API using our SDKs.

{% dialect-switcher title="Get started with the Read API" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

{% totem-prose %}
When using Umi, the Read API plugin is automatically installed within the `mplBubblegum` plugin. So you are already be good to go!

If you wanted to use the Read API plugin _without_ importing the whole `mplBubblegum` plugin, you could do so by installing the `readApi` plugin directly like so:
{% /totem-prose %}

```ts
import { readApi } from '@metaplex-foundation/mpl-bubblegum'

umi.use(readApi())
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Asset IDs

TODO

{% dialect-switcher title="Find the Asset ID PDA" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { findLeafAssetIdPda } from '@metaplex-foundation/mpl-bubblegum'

const [assetId, bump] = await findLeafAssetIdPda(umi, {
  merkleTree,
  leafIndex,
})
```

{% /dialect %}
{% /dialect-switcher %}

## Fetching a Compressed NFT

TODO

{% dialect-switcher title="Fetch a Compressed NFT" %}
{% dialect title="JavaScript" id="js" %}

```ts
const rpcAsset = await umi.rpc.getAsset(assetId)
```

{% /dialect %}
{% /dialect-switcher %}

## Fetching the proof of a Compressed NFT

{% dialect-switcher title="Fetch the proof of a Compressed NFT" %}
{% dialect title="JavaScript" id="js" %}

```ts
const rpcAssetProof = await umi.rpc.getAssetProof(assetId)
```

{% /dialect %}
{% /dialect-switcher %}

## Fetching multiple Compressed NFTs

TODO

### By owner

TODO

{% dialect-switcher title="Fetch Compressed NFTs by owner" %}
{% dialect title="JavaScript" id="js" %}

```ts
const rpcAssetList = await umi.rpc.getAssetsByOwner({ owner })
```

{% /dialect %}
{% /dialect-switcher %}

### By collection

TODO

{% dialect-switcher title="Fetch Compressed NFTs by collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
const rpcAssetList = await umi.rpc.getAssetsByGroup({
  groupKey: 'collection',
  groupValue: collectionMint,
})
```

{% /dialect %}
{% /dialect-switcher %}
