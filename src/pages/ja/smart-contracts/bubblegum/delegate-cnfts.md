---
title: 圧縮NFTのDelegate
metaTitle: 圧縮NFTのDelegate - Bubblegum
description: Bubblegumで圧縮NFTをdelegateする方法を学びます。
---

圧縮NFTの所有者は、cNFTの所有権を保持しながら、別のアカウントにdelegateすることができます。 {% .lead %}

これにより、委任されたアカウント（**Delegate Authority**とも呼ばれます）が所有者に代わってアクションを実行できます。これらのアクションは以下の通りです：

- [cNFTの転送](/ja/smart-contracts/bubblegum/transfer-cnfts)。Delegate Authorityは転送後にリセットされます（つまり、新しい所有者に設定されます）。
- [cNFTのバーン](/ja/smart-contracts/bubblegum/burn-cnfts)。

これらのアクションのそれぞれで、Delegate Authorityを使用してそれらを実行する方法の例が提供されていますが、通常は単に**Leaf Owner**アカウントをSignerとして渡す代わりに**Leaf Delegate**アカウントをSignerとして提供するだけです。

圧縮NFTのDelegate Authoritiesを承認および取り消す方法を見てみましょう。

## Delegate Authorityの承認

Delegate Authorityを承認または置き換えるために、所有者は**Delegate**命令を送信する必要があります。この命令は以下のパラメータを受け取ります：

- **Leaf Owner**: 圧縮NFTの現在の所有者（Signerとして）。
- **Previous Leaf Delegate**: 以前のDelegate Authority（存在する場合）。そうでない場合は、これを**Leaf Owner**に設定する必要があります。
- **New Leaf Delegate**: 承認する新しいDelegate Authority。

さらに、この命令はBubblegum Tree上のリーフを置き換えることになるため、圧縮NFTの整合性を検証するためにより多くのパラメータを提供する必要があります。これらのパラメータはリーフを変更するすべての命令に共通であるため、[以下のFAQ](/ja/smart-contracts/bubblegum/faq#replace-leaf-instruction-arguments)に文書化されています。幸い、Metaplex DAS APIを使用してこれらのパラメータを自動的に取得するヘルパーメソッドを使用できます。

{% dialect-switcher title="圧縮NFTのDelegate" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, delegate } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await delegate(umi, {
  ...assetWithProof,
  leafOwner,
  previousLeafDelegate: leafOwner.publicKey,
  newLeafDelegate: newDelegate,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Delegate Authorityの取り消し

既存のDelegate Authorityを取り消すには、所有者は単に自分自身を新しいDelegate Authorityとして設定すればよいです。

{% dialect-switcher title="圧縮NFTのDelegate Authorityの取り消し" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, delegate } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await delegate(umi, {
  ...assetWithProof,
  leafOwner,
  previousLeafDelegate: currentDelegate,
  newLeafDelegate: leafOwner.publicKey,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}