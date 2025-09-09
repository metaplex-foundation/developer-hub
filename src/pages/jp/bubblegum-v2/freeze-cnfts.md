---
title: 圧縮NFTの凍結と解凍
metaTitle: 圧縮NFTの凍結と解凍 | Bubblegum V2
description: Bubblegumで圧縮NFTを凍結・解凍する方法を学びます。
---

Bubblegum V2では、圧縮NFTを凍結・解凍できます。これはステーキングなどのさまざまなユースケースに役立ちます。 {% .lead %}

## 圧縮NFTの凍結

事前にリーフデリゲートに委任された圧縮NFTを凍結するには、`freezeV2`命令を使用できます。まだ委任されていない場合は、以下の`delegateAndFreezeV2`を参照してください。`freezeV2`命令は次のように使用できます：

{% dialect-switcher title="リーフデリゲートとして圧縮NFTを凍結" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}
```js
import {
  getAssetWithProof,
  freezeV2,
} from '@metaplex-foundation/mpl-bubblegum';

const assetWithProof = await getAssetWithProof(umi, assetId);
await freezeV2(umi, {
  ...assetWithProof,
  leafOwner: umi.identity.publicKey,
  authority: leafDelegate, // これはデフォルトで支払者になります
  leafDelegate: leafDelegate.publicKey,
  // cNFTがコレクションの一部である場合、コレクションアドレスを渡します。
  //coreCollection: collectionSigner.publicKey,
}).sendAndConfirm(umi);
```
{% /totem %}
{% totem-accordion title="永続凍結デリゲートとして" %}
```js
import {
  getAssetWithProof,
  freezeV2,
} from '@metaplex-foundation/mpl-bubblegum';

const assetWithProof = await getAssetWithProof(umi, assetId);
await freezeV2(umi, {
  ...assetWithProof,
  leafOwner: umi.identity.publicKey,
  authority: permanentFreezeDelegate,
  leafDelegate: permanentFreezeDelegate.publicKey,
  coreCollection: collectionSigner.publicKey,
}).sendAndConfirm(umi);
```
{% /totem-accordion %}
{% /dialect %}