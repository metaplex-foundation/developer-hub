---
title: 圧縮NFTの転送
metaTitle: 圧縮NFTの転送 | Bubblegum
description: Bubblegumで圧縮NFTを転送する方法を学びます。
---

**Transfer**命令を使用して、圧縮NFTを1つの所有者から別の所有者に転送できます。転送を承認するには、現在の所有者またはdelegate権限（存在する場合）のいずれかがトランザクションに署名する必要があります。命令は以下のパラメータを受け取ります：

- **Leaf Owner**と**Leaf Delegate**: 圧縮NFTの現在の所有者とそのdelegate権限（存在する場合）。これらのいずれかがトランザクションに署名する必要があります。
- **New Leaf Owner**: 圧縮NFTの新しい所有者のアドレス。

この命令は圧縮NFTを更新するため、Bubblegum Tree上のリーフを置き換えることに注意してください。これは、圧縮NFTの整合性を検証するために追加のパラメータを提供する必要があることを意味します。これらのパラメータはリーフを変更するすべての命令に共通であるため、[以下のFAQ](/ja/bubblegum/faq#replace-leaf-instruction-arguments)に文書化されています。幸い、Metaplex DAS APIを使用してこれらのパラメータを自動的に取得するヘルパーメソッドを使用できます。

{% callout title="トランザクションサイズ" type="note" %}
トランザクションサイズエラーが発生した場合は、`getAssetWithProof`で`{ truncateCanopy: true }`の使用を検討してください。詳細については[FAQ](/ja/bubblegum/faq#replace-leaf-instruction-arguments)を参照してください。
{% /callout %}

{% dialect-switcher title="圧縮NFTの転送" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, transfer } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await transfer(umi, {
  ...assetWithProof,
  leafOwner: currentLeafOwner,
  newLeafOwner: newLeafOwner.publicKey,
}).sendAndConfirm(umi)
```

{% totem-accordion title="delegateを使用する" %}

```ts
import { getAssetWithProof, transfer } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await transfer(umi, {
  ...assetWithProof,
  leafDelegate: currentLeafDelegate,
  newLeafOwner: newLeafOwner.publicKey,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}