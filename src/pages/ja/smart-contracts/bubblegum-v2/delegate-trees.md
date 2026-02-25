---
title: ツリーのデリゲート
metaTitle: ツリーのデリゲート - Bubblegum V2
description: Bubblegumでマークルツリーをデリゲートする方法を学びます。
created: '01-15-2025'
updated: '02-24-2026'
keywords:
  - delegate tree
  - tree delegation
  - tree authority
  - tree creator
  - set tree delegate
about:
  - Compressed NFTs
  - Tree management
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: ツリーデリゲートは何ができますか？
    a: ツリーデリゲートは、ツリー作成者に代わってツリーから圧縮NFTをミントできます。これはプライベートツリーにのみ関係します。
  - q: ツリーデリゲートを取り消すにはどうすればよいですか？
    a: newTreeDelegateをツリー作成者自身の公開鍵に設定してsetTreeDelegateを使用します。
---

## Summary

**Delegating trees** allows the tree creator to authorize another account to mint cNFTs from a private Bubblegum Tree. This page covers approving and revoking tree delegate authority.

- Approve a tree delegate to mint cNFTs on behalf of the tree creator
- Revoke a tree delegate by setting the delegate back to the creator
- Only relevant for private trees (public trees allow anyone to mint)

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

## Notes

- Tree delegation is only relevant for private trees. Public trees allow anyone to mint.
- Only one tree delegate can be active at a time. Approving a new delegate replaces the previous one.
- The tree creator retains full authority even when a delegate is set.

## FAQ

#

## Glossary

| Term | Definition |
|------|------------|
| **Tree Delegate** | An account authorized by the tree creator to mint cNFTs from a private tree |
| **Tree Creator** | The account that created the Bubblegum Tree and has full management authority |
| **setTreeDelegate** | The instruction used to approve or revoke a tree delegate |
