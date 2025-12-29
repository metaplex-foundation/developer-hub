---
title: 圧縮NFTのバーン
metaTitle: 圧縮NFTのバーン | Bubblegum
description: Bubblegumで圧縮NFTをバーンする方法を学びます。
---

**Burn**命令を使用して圧縮NFTをバーンし、Bubblegum Treeから永続的に削除できます。この操作を承認するには、現在の所有者またはdelegate権限（存在する場合）のいずれかがトランザクションに署名する必要があります。命令は以下のパラメータを受け取ります：

- **Leaf Owner**と**Leaf Delegate**: 圧縮NFTの現在の所有者とそのdelegate権限（存在する場合）。これらのいずれかがトランザクションに署名する必要があります。

この命令はBubblegum Tree上のリーフを置き換えるため、圧縮NFTをバーンする前にその整合性を検証するために追加のパラメータを提供する必要があることに注意してください。これらのパラメータはリーフを変更するすべての命令に共通であるため、[以下のFAQ](/ja/smart-contracts/bubblegum/faq#replace-leaf-instruction-arguments)に文書化されています。幸い、Metaplex DAS APIを使用してこれらのパラメータを自動的に取得するヘルパーメソッドを使用できます。

{% callout title="トランザクションサイズ" type="note" %}
トランザクションサイズエラーが発生した場合は、`getAssetWithProof`で`{ truncateCanopy: true }`の使用を検討してください。詳細については[FAQ](/ja/smart-contracts/bubblegum/faq#replace-leaf-instruction-arguments)を参照してください。
{% /callout %}

{% dialect-switcher title="圧縮NFTのバーン" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, burn } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await burn(umi, {
  ...assetWithProof,
  leafOwner: currentLeafOwner,
}).sendAndConfirm(umi)
```

{% totem-accordion title="delegateを使用する" %}

```ts
import { getAssetWithProof, burn } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await burn(umi, {
  ...assetWithProof,
  leafDelegate: currentLeafDelegate,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}