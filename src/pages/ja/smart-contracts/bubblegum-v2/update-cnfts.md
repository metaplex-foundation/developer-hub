---
title: 圧縮NFTの更新
metaTitle: 圧縮NFTの更新 - Bubblegum V2
description: Bubblegum V2で圧縮NFTを更新する方法を学びます。
created: '01-15-2025'
updated: '06-19-2026'
keywords:
  - update compressed NFT
  - update cNFT
  - NFT metadata update
  - Bubblegum update
  - updateMetadataV2
about:
  - Compressed NFTs
  - NFT metadata
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 圧縮NFTのメタデータを更新できるのは誰ですか？
    a: cNFTがコレクションに属している場合、更新できるのはコレクション権限のみです。コレクションに属していない場合、ツリー権限（ツリー作成者またはデリゲート）が更新できます。
  - q: cNFTで更新できるフィールドは何ですか？
    a: UpdateArgsArgsで定義された名前、URI、セラーフィーベーシスポイント、その他のメタデータフィールドを更新できます。変更したいフィールドにはsome('newValue')を使用します。
  - q: 更新時にコレクションを渡す必要がありますか？
    a: はい、cNFTがコレクションに属している場合。コレクションの公開鍵とともにcoreCollectionパラメータを渡します。コレクション権限がトランザクションに署名する必要があります。
  - q: コレクションからロイヤリティを継承しているcNFTを更新するにはどうすればよいですか？
    a: getAssetWithProofからcurrentMetadata（オンチェーンセンチネルを保持）を渡し、必要に応じてupdateArgs.sellerFeeBasisPointsで明示的な値を設定します。
---

## Summary

**圧縮NFTの更新**は、**updateMetadataV2**命令を使用してメタデータを変更します。このページでは、コレクションベースおよびツリーベースのcNFTの更新権限ルールについて説明します。

- updateMetadataV2を使用してcNFTメタデータ（名前、URI、作成者、版税）を更新する
- コレクション権限はコレクションに属するcNFTを更新する
- ツリー権限はコレクションに属さないcNFTを更新する
- 変更はマークルツリーに反映され、DAS APIプロバイダーによってインデックス化されます
- リーフ検証には `getAssetWithProof` の `currentMetadata` を使用する（特にセラーフィーが継承されている場合）

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
  currentMetadata: assetWithProof.currentMetadata ?? assetWithProof.metadata,
  updateArgs,
  // オプションパラメータ。権限が現在のumiアイデンティティと
  // 異なる署名者型の場合、ここでその署名者を割り当てます。
  authority: <Signer>,
  // オプションパラメータ。cNFTがコレクションに属している場合はここで渡します。
  coreCollection: publicKey("22222222222222222222222222222222"),
}).sendAndConfirm(umi)
```

{% callout type="note" title="metadataではなくcurrentMetadataを使用" %}
V2 cNFTでは、`getAssetWithProof` はロイヤリティ関連の2つの形状を返します：

- **`metadata`** — 表示用の値。継承されたロイヤリティの場合、`sellerFeeBasisPoints` は解決されたコレクションのパーセンテージを示すことがあります。
- **`currentMetadata`** — リーフハッシュ化と更新命令に使用される正規のオンチェーンメタデータ。継承されたロイヤリティの場合、`SELLER_FEE_BASIS_POINTS_INHERIT` センチネル（`65535`）を保持します。

`updateMetadataV2`、`setCollectionV2`、および既存リーフを検証するその他の書き込み命令には、常に `currentMetadata` を渡してください。
{% /callout %}

## 継承されたロイヤリティ {% #inherited-royalties %}

`updateArgs.sellerFeeBasisPoints` を `some(SELLER_FEE_BASIS_POINTS_INHERIT)` に設定することで、cNFTを継承ロイヤリティ**へ**切り替えられます。コレクションには `Royalties` プラグインが必要で、更新後のメタデータの `creators` 配列は空である必要があります。

継承ロイヤリティ**から**明示的なパーセンテージに戻すには — 例えば[cNFTをコレクションから削除する](/ja/smart-contracts/bubblegum-v2/collections#inherited-royalties)前に — 希望するベーシスポイントを渡します：

{% code-tabs-imported from="bubblegum/update-inherit-royalties" frameworks="umi" /%}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Notes

- 更新権限は、cNFTがコレクションに属しているかどうかによって異なります。コレクションcNFTはコレクション権限を使用し、スタンドアロンcNFTはツリー権限を使用します。
- 更新を適用する前にプログラムが現在のリーフを検証できるよう、`getAssetWithProof`からの`currentMetadata`を渡す必要があります。`currentMetadata`が存在する場合は`metadata`で代用しないでください。
- 更新したいフィールドには`some()`を使用し、変更しないフィールドは省略します。
- 継承されたセラーフィーには、リーフレベルの空の`creators`配列と`Royalties`プラグインを持つコレクションが必要です。

## FAQ

### 圧縮NFTのメタデータを更新できるのは誰ですか？

cNFTがコレクションに属している場合、更新できるのはコレクション権限のみです。コレクションに属していない場合、ツリー権限（ツリー作成者またはデリゲート）が更新できます。

### cNFTで更新できるフィールドは何ですか？

`UpdateArgsArgs`で定義された名前、URI、セラーフィーベーシスポイント、その他のメタデータフィールドを更新できます。変更したいフィールドには`some('newValue')`を使用します。

### 更新時にコレクションを渡す必要がありますか？

はい、cNFTがコレクションに属している場合。コレクションの公開鍵とともに`coreCollection`パラメータを渡します。コレクション権限がトランザクションに署名する必要があります。

### コレクションからロイヤリティを継承しているcNFTを更新するにはどうすればよいですか？

検証のためにオンチェーンセンチネルを保持するため、`getAssetWithProof`から`currentMetadata`を渡します。継承ロイヤリティに切り替えるには`updateArgs.sellerFeeBasisPoints`に`some(SELLER_FEE_BASIS_POINTS_INHERIT)`を、切り替えるには明示的な数値を使用します。

## Glossary

| 用語 | 定義 |
|------|------|
| **updateMetadataV2** | 圧縮NFTメタデータを変更するためのBubblegum V2命令 |
| **コレクション権限** | MPL-Coreコレクションの更新権限。そのコレクション内のcNFTを更新する権限がある |
| **ツリー権限** | コレクションに属さないcNFTを更新する権限を持つツリー作成者またはデリゲート |
| **UpdateArgsArgs** | どのメタデータフィールドをOptionラッパーを使用して更新するかを定義するTypeScript型 |
| **currentMetadata** | 書き込み命令でのリーフ検証に必要な、`getAssetWithProof`からの正規オンチェーンメタデータ |
| **SELLER_FEE_BASIS_POINTS_INHERIT** | MPL-Coreコレクションからロイヤリティが継承されることを示すセンチネル値 `65535` |
