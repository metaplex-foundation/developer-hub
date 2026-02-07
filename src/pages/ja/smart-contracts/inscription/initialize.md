---
title: Inscriptionの初期化
metaTitle: Inscriptionの初期化 | Inscription
description: Metaplex Inscriptionの作成方法を学びます
---

`initialize`命令は、データが保存される場所であるinscriptionアカウントを作成します。3つのタイプの初期化があります：

1. `initializeFromMint` - NFTに添付されたInscription用 - **おそらくこれが必要です**
2. `initialize` - ストレージプロバイダーとしてのInscription用
3. `initializeAssociatedInscription` - 追加データアカウント用

初期化が完了した後、inscriptionに[データを書き込む](write)ことができます。

初期化時に、番号付けに使用される`shard`を選択できます。ロックを最小限に抑えるために、ランダムなものを使用してください。[シャーディングについてはこちら](sharding)で詳しく読むことができます。

## `initializeFromMint`

{% callout type="note" %}

これらのinscriptionはNFTと同様に取引可能です。不確実な場合は、おそらくこれを使用したいでしょう。

{% /callout %}

取引可能なinscriptionが必要な場合は、この種のinscriptionを使用したいでしょう。これはあなたのNFTから派生されます。この関数を使用する際は、NFTの更新権限を持っている必要があります。

以下のように実行できます：

{% dialect-switcher title="ミントInscriptionの初期化" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
import {
  findInscriptionShardPda,
  initializeFromMint,
} from '@metaplex-foundation/mpl-inscription'

const inscriptionShardAccount = await findInscriptionShardPda(umi, {
  shardNumber: 0, // 0から31までのランダムな数
})
await initializeFromMint(umi, {
  mintAccount: mint.publicKey,
  inscriptionShardAccount,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## `Initialize`

{% callout type="warning" %}

この種のinscriptionは**取引できません**。ゲームなどの高度な使用例にのみ推奨します。

{% /callout %}

Inscriptionはデータが書き込まれる前に初期化される必要があります。以下のように実行できます：

{% dialect-switcher title="Inscriptionの初期化" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
import {
  findInscriptionMetadataPda,
  findInscriptionShardPda,
  initialize,
} from '@metaplex-foundation/mpl-inscription'

const inscriptionAccount = generateSigner(umi)

const inscriptionMetadataAccount = await findInscriptionMetadataPda(umi, {
  inscriptionAccount: inscriptionAccount.publicKey,
})
const inscriptionShardAccount = await findInscriptionShardPda(umi, {
  shardNumber: 0, // 0から31までのランダムな数
})

await initialize(umi, {
  inscriptionAccount,
  inscriptionShardAccount,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## `initializeAssociatedInscription`

1つのInscriptionアカウントは複数の関連Inscriptionアカウントを持つことができます。これらは`associationTag`に基づいて派生されます。例えば、タグはファイルのデータタイプ（例：`image/png`）にできます。

関連するinscriptionへのポインターは、`inscriptionMetadata`アカウントの`associatedInscriptions`フィールドの配列に保存されます。

新しい関連Inscriptionを初期化するには、以下の関数を使用できます：

{% dialect-switcher title="関連Inscriptionの初期化" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
import {
  findInscriptionMetadataPda,
  initializeAssociatedInscription,
} from '@metaplex-foundation/mpl-inscription'

const inscriptionMetadataAccount = await findInscriptionMetadataPda(umi, {
  inscriptionAccount: inscriptionAccount.publicKey,
})

await initializeAssociatedInscription(umi, {
  inscriptionMetadataAccount,
  associationTag: 'image/png',
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
