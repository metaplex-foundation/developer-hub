---
title: ツリーのデリゲート
metaTitle: ツリーのデリゲート | Bubblegum V2
description: Bubblegumでマークルツリーをデリゲートする方法を学びます。
---

圧縮NFTの所有者がデリゲート権限を承認できるのと同様に、Bubblegumツリーの作成者も、自分の代わりにアクションを実行する別のアカウントを承認できます。 {% .lead %}

Bubblegumツリーに対してデリゲート権限が承認されると、作成者に代わって[圧縮NFTをミント](/ja/smart-contracts/bubblegum-v2/mint-cnfts)できるようになります。これは、誰でも公開ツリーでミントできるため、プライベートツリーにのみ関連することに注意してください。

## ツリーのデリゲート権限の承認

Bubblegumツリーに新しいデリゲート権限を承認するには、その作成者が以下のパラメータを受け入れる**ツリーデリゲート設定**命令を使用できます：

- **マークルツリー**: デリゲートするマークルツリーのアドレス。
- **ツリー作成者**: 署名者としてのマークルツリーの作成者。
- **新しいツリーデリゲート**: 承認する新しいデリゲート権限。

{% dialect-switcher title="Bubblegumツリーのデリゲート" %}
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

## ツリーのデリゲート権限の取り消し

既存のデリゲート権限を取り消すには、ツリーの作成者は単に自分自身を新しいデリゲート権限として設定する必要があります。

{% dialect-switcher title="Bubblegumツリーのデリゲート権限の取り消し" %}
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
