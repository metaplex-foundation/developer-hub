---
title: TreeのDelegate
metaTitle: TreeのDelegate | Bubblegum
description: BubblegumでMerkle Treesをdelegateする方法を学びます。
---

圧縮NFTの所有者がDelegate Authorityを承認できるのと同様に、Bubblegum Treeの作成者も他のアカウントに代理でアクションを実行することを承認できます。 {% .lead %}

Bubblegum TreeにDelegate Authorityが承認されると、作成者に代わって[圧縮NFTをミント](/ja/bubblegum/mint-cnfts)できるようになります。これはプライベートtreeにのみ関連することに注意してください。なぜなら、パブリックtreeでは誰でもミントできるからです。

## TreeのDelegate Authorityの承認

Bubblegum Treeで新しいDelegate Authorityを承認するために、その作成者は以下のパラメータを受け取る**Set Tree Delegate**命令を使用できます：

- **Merkle Tree**: delegateするMerkle Treeのアドレス。
- **Tree Creator**: Merkle Treeの作成者（Signerとして）。
- **New Tree Delegate**: 承認する新しいDelegate Authority。

{% dialect-switcher title="Bubblegum TreeのDelegate" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { setTreeDelegate } from '@metaplex-foundation/mpl-bubblegum'

await setTreeDelegate(umi, {
  merkleTree,
  treeCreator,
  newTreeDelegate,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## TreeのDelegate Authorityの取り消し

既存のDelegate Authorityを取り消すために、treeの作成者は単に自分自身を新しいDelegate Authorityとして設定すればよいです。

{% dialect-switcher title="Bubblegum TreeのDelegate Authorityの取り消し" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { setTreeDelegate } from '@metaplex-foundation/mpl-bubblegum'

await setTreeDelegate(umi, {
  merkleTree,
  treeCreator,
  newTreeDelegate: treeCreator.publicKey,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}