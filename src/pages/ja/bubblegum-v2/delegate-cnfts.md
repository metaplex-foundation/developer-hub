---
title: 圧縮NFTのデリゲート
metaTitle: 圧縮NFTのデリゲート | Bubblegum V2
description: Bubblegumで圧縮NFTをデリゲートする方法を学びます。
---

圧縮NFTの所有者は、cNFTの所有権を保持したまま、別のアカウントにデリゲートできます。 {% .lead %}

これにより、デリゲートされたアカウント（**デリゲート権限**とも呼ばれます）は、所有者に代わってアクションを実行できます。これらのアクションは以下の通りです：

- [cNFTの転送](/jp/bubblegum-v2/transfer-cnfts)：デリゲート権限は転送後にリセット（つまり新しい所有者に設定）されます。
- [cNFTのバーン](/jp/bubblegum-v2/burn-cnfts)。
- [cNFTの凍結と解凍](/jp/bubblegum-v2/freeze-cnfts)。

これらのアクションはそれぞれ、デリゲート権限を使用してそれらを実行する方法の例を提供します。通常、**リーフ所有者**アカウントの代わりに**リーフデリゲート**アカウントを署名者として提供するだけです。
圧縮NFTのデリゲート権限を承認・取り消しする方法を見てみましょう。

## デリゲート権限の承認

デリゲート権限を承認または置き換えるには、所有者が**デリゲート**命令を送信する必要があります。この命令は以下のパラメータを受け入れます：

- **リーフ所有者**：署名者としての圧縮NFTの現在の所有者。デフォルトではトランザクションの支払者です。
- **前のリーフデリゲート**：前のデリゲート権限（存在する場合）。そうでなければ、これは**リーフ所有者**に設定する必要があります。
- **新しいリーフデリゲート**：承認する新しいデリゲート権限。

さらに、この命令はBubblegumツリー上のリーフを置き換えるため、圧縮NFTの整合性を検証するためにより多くのパラメータを提供する必要があります。これらのパラメータはリーフを変更するすべての命令に共通であるため、[次のFAQ](/jp/bubblegum-v2/faq#replace-leaf-instruction-arguments)でドキュメント化されています。幸いなことに、Metaplex DAS APIを使用してこれらのパラメータを自動的に取得するヘルパーメソッドを使用できます。

{% dialect-switcher title="圧縮NFTのデリゲート" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, delegate } from '@metaplex-foundation/mpl-bubblegum';

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true });
await delegate(umi, {
  ...assetWithProof,
  leafOwner,
  previousLeafDelegate: leafOwner.publicKey,
  newLeafDelegate: newDelegate,
}).sendAndConfirm(umi);
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## デリゲート権限の取り消し

既存のデリゲート権限を取り消すには、所有者は単に自分自身を新しいデリゲート権限として設定する必要があります。

{% dialect-switcher title="圧縮NFTのデリゲート権限の取り消し" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, delegate } from '@metaplex-foundation/mpl-bubblegum';

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await delegate(umi, {
  ...assetWithProof,
  leafOwner,
  previousLeafDelegate: currentDelegate,
  newLeafDelegate: leafOwner.publicKey,
}).sendAndConfirm(umi);
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}