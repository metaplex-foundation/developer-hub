---
title: 圧縮NFTの更新
metaTitle: 圧縮NFTの更新 | Bubblegum
description: Bubblegumで圧縮NFTを更新する方法を学びます。
---

**Update**命令を使用して、圧縮NFTのメタデータを変更できます。Merkle rootは、データの伝播ハッシュを反映するように更新され、[Metaplex DAS API](https://github.com/metaplex-foundation/digital-asset-standard-api)に準拠するRPCプロバイダーは、cNFTのインデックスを更新します。

メタデータは、圧縮NFTがコレクション内の検証済みアイテムかどうかに応じて、2つの権限のいずれかによって更新できます。

## 更新権限

cNFTには2つの可能な更新権限があり、それはtreeの所有者またはcNFTがコレクションに属している場合はコレクション権限のいずれかです。

### コレクション権限

cNFTがコレクションに属している場合、そのcNFTの更新権限はコレクションの権限になります。cNFTを更新するときは、更新関数に`collectionMint`引数を渡す必要があります。

権限は現在のumi identityから推測されます。権限が現在のumi identityと異なる場合は、`authority`引数をsigner typeとして渡すか、後で署名するための「noopSigner」を作成する必要があります。

```js
await updateMetadata(umi, {
  ...
  collectionMint: publicKey("11111111111111111111111111111111"),
}).sendAndConfirm(umi)
```

### Tree権限

cNFTがコレクションに属さない場合、cNFTの更新権限はcNFTが属するtreeの権限になります。この場合、更新関数から`collectionMint`引数を**省略**します。

権限は現在のumi identityから推測されます。権限が現在のumi identityと異なる場合は、`authority`引数をsigner typeとして渡すか、後で署名するための「noopSigner」を作成する必要があります。

## cNFTの更新

{% dialect-switcher title="圧縮NFTの更新" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  updateMetadata,
  UpdateArgsArgs,
} from '@metaplex-foundation/mpl-bubblegum'

// ヘルパーを使用してアセットとプルーフを取得します。
const assetWithProof = await getAssetWithProof(umi, assetId, {
  truncateCanopy: true,
})

// その後、NFTのメタデータを更新するために使用できます。
const updateArgs: UpdateArgsArgs = {
  name: some('New name'),
  uri: some('https://updated-example.com/my-nft.json'),
}
await updateMetadata(umi, {
  ...assetWithProof,
  leafOwner,
  currentMetadata: assetWithProof.metadata,
  updateArgs,
  // オプションのパラメータ。権限が現在のumi identityとは異なるsigner typeの場合、
  // そのsignerをここに割り当てます。
  authority: <Signer>
  // オプションのパラメータ。cNFTがコレクションに属している場合は、ここに渡します。
  collectionMint: publicKey("22222222222222222222222222222222"),
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}