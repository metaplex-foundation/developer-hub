---
title: 圧縮NFTの更新
metaTitle: 圧縮NFTの更新 | Bubblegum V2
description: Bubblegum V2で圧縮NFTを更新する方法を学びます。
---

**updateMetadataV2**命令は、圧縮NFTのメタデータを変更するために使用できます。マークルルートは、データの伝播されたハッシュを反映するように更新され、[Metaplex DAS API](https://github.com/metaplex-foundation/digital-asset-standard-api)に準拠するRPCプロバイダーは、cNFTのインデックスを更新します。

メタデータは、圧縮NFTがコレクション内の検証されたアイテムかどうかによって、2つの権限のうちの1つによって更新できます。

## 更新権限

cNFTには2つの可能な更新権限があります：ツリー所有者、または（コレクションに属している場合）コレクション権限です。

### コレクション権限

cNFTがコレクションに属している場合、そのcNFTの更新権限はコレクションの権限になります。cNFTを更新する際は、更新関数に`coreCollection`引数を渡す必要があります。

権限は現在のumiアイデンティティから推測されます。権限が現在のumiアイデンティティと異なる場合は、`authority`引数をsigner型として渡すか、後で署名するための`noopSigner`を作成する必要があります。

```js
await updateMetadataV2(umi, {
  ...
  authority: collectionAuthority,
  coreCollection: publicKey("11111111111111111111111111111111"),
}).sendAndConfirm(umi)
```

### ツリー権限

cNFTがコレクションに属していない場合、cNFTの更新権限は、cNFTが属するツリーの権限になります。この場合、更新関数から`coreCollection`引数を**省略**します。

権限は現在のumiアイデンティティから推測されます。権限が現在のumiアイデンティティと異なる場合は、`authority`引数をsigner型として渡すか、後で署名するための`noopSigner`を作成する必要があります。

## cNFTの更新

{% dialect-switcher title="圧縮NFTの更新" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  updateMetadataV2,
  UpdateArgsArgs,
} from '@metaplex-foundation/mpl-bubblegum'
import { some } from '@metaplex-foundation/umi'

// ヘルパーを使用してアセットと証明を取得します。
const assetWithProof = await getAssetWithProof(umi, assetId, {
  truncateCanopy: true,
})

// その後、NFTのメタデータを更新するために使用できます。
const updateArgs: UpdateArgsArgs = {
  name: some('新しい名前'),
  uri: some('https://updated-example.com/my-nft.json'),
}
await updateMetadataV2(umi, {
  ...assetWithProof,
  leafOwner,
  currentMetadata: assetWithProof.metadata,
  updateArgs,
  // オプションパラメータ。権限が現在のumiアイデンティティと
  // 異なる署名者型の場合、ここでその署名者を割り当てます。
  authority: <Signer>,
  // オプションパラメータ。cNFTがコレクションに属している場合はここで渡します。
  coreCollection: publicKey("22222222222222222222222222222222"),
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
