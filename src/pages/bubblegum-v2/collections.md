---
title: Verifying Collections
metaTitle: Verifying Collections | Bubblegum V2
description: Learn how to set, verify and unverify collections on Bubblegum.
---

A cNFT can be added to a MPL-Core Collection either on mint or later. {% .lead %}

If you are not familiar with the concept of collections with regard to NFTs, they are special non-compressed NFTs that can be used to group other NFTs together. The data of the **Collection** is therefore used to describe the name and the branding of the entire collection. Since Bubblegum V2, it also allows additional features on collection level, like allowing freezing and thawing of cNFTs by a delegate without the need of interaction by the leaf owner. You can [read more about MPL-Core Collections here](/core/collections).
Note that it is possible to mint a Compressed NFT directly into a collection by using the **MintV2** instruction [documented here](/bubblegum-v2/mint-cnfts#minting-to-a-collection). That being said, if you have already minted a cNFT without a collection, let's see how we can set the collection on that cNFT. Unlike Bubblegum v1, which uses Metaplex Token Metadata Collections which have a "verified" boolean, Bubblegum V2 uses MPL-Core Collections which do not have that boolean.

The MPL-Core Collection has to contain the [`BubblegumV2` plugin](/core/plugins/bubblegum).

The following sections show how to set and remove a collection from a cNFT in single-step transactions. It is also possible to do both operations in a single instruction when adding the `coreCollection` and `newCoreCollection` parameters. If both collection authorities are not the same wallet both have to sign.

## Set the Collection of a Compressed NFT
The **setCollectionV2** instruction can be used to set the collection of a cNFT. It can also be used to remove the collection from a cNFT or change the collection of a cNFT.

{% dialect-switcher title="Set the Collection of a Compressed NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  setCollectionV2,
  MetadataArgsV2Args
} from '@metaplex-foundation/mpl-bubblegum';
import {
  unwrapOption,
  none,
} from '@metaplex-foundation/umi';

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
    const metadata: MetadataArgsV2Args = {
      name: assetWithProof.metadata.name,
      uri: assetWithProof.metadata.uri,
      sellerFeeBasisPoints: assetWithProof.metadata.sellerFeeBasisPoints,
      collection: none(),
      creators: assetWithProof.metadata.creators,
    };
    await setCollectionV2(umi, {
      ...assetWithProof,
      newCollectionAuthority: newCollectionUpdateAuthority,
      metadata,
      newCoreCollection: newCoreCollection.publicKey,
    }).sendAndConfirm(umi);
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Remove the Collection of a Compressed NFT
The **setCollectionV2** instruction can also be used to remove the collection from a cNFT.

{% dialect-switcher title="Remove the Collection of a Compressed NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  setCollectionV2,
  MetadataArgsV2Args
} from '@metaplex-foundation/mpl-bubblegum'
import {
  unwrapOption,
  none,
} from '@metaplex-foundation/umi';

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
const metadata: MetadataArgsV2Args = {
  name: assetWithProof.metadata.name,
  uri: assetWithProof.metadata.uri,
  sellerFeeBasisPoints: assetWithProof.metadata.sellerFeeBasisPoints,
  collection: unwrapOption(assetWithProof.metadata.collection)!.key,
  creators: assetWithProof.metadata.creators,
};
await setCollectionV2(umi, {
  ...assetWithProof,
  authority: collectionAuthoritySigner,
  metadata: metadata,
}).sendAndConfirm(umi);
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}