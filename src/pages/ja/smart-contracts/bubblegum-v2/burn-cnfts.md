---
title: 圧縮NFTのバーン
metaTitle: 圧縮NFTのバーン | Bubblegum V2
description: Bubblegumで圧縮NFTをバーンする方法を学びます。
---

**burnV2**命令は、圧縮NFTをバーンし、Bubblegumツリーから永続的に削除するために使用できます。この操作を認証するには、現在の所有者またはデリゲート権限（存在する場合）がトランザクションに署名する必要があります。命令は以下のパラメータを受け入れます：

- **リーフ所有者**、**リーフデリゲート**、または**永続バーンデリゲート**: 圧縮NFTの現在の所有者、そのデリゲート権限（存在する場合）、またはコレクションの永続バーンデリゲート。アセットがコレクションの一部である場合、`coreCollection`パラメータを渡す必要があります。これらのいずれかがトランザクションに署名する必要があります。

この命令はBubblegumツリー上のリーフを置き換えるため、バーンする前に圧縮NFTの整合性を検証するために追加のパラメータを提供する必要があります。これらのパラメータはリーフを変更するすべての命令に共通であるため、[次のFAQ](/ja/smart-contracts/bubblegum-v2/faq#replace-leaf-instruction-arguments)でドキュメント化されています。幸いなことに、Metaplex DAS APIを使用してこれらのパラメータを自動的に取得するヘルパーメソッドを使用できます。

{% callout title="トランザクションサイズ" type="note" %}
トランザクションサイズエラーが発生した場合は、`getAssetWithProof`で`{ truncateCanopy: true }`の使用を検討してください。詳細については[FAQ](/ja/smart-contracts/bubblegum-v2/faq#replace-leaf-instruction-arguments)を参照してください。
{% /callout %}

{% callout title="コレクション" type="note" %}
cNFTがコレクションの一部である場合、`coreCollection`パラメータを渡す必要があります。
{% /callout %}

{% dialect-switcher title="圧縮NFTのバーン" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, burnV2 } from '@metaplex-foundation/mpl-bubblegum';

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await burnV2(umi, {
  ...assetWithProof,
  leafOwner: currentLeafOwner,
}).sendAndConfirm(umi)
```

{% totem-accordion title="デリゲートの使用" %}

```ts
import { getAssetWithProof, burnV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await burnV2(umi, {
  ...assetWithProof,
  leafDelegate: currentLeafDelegate,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="永続バーンデリゲートの使用" %}