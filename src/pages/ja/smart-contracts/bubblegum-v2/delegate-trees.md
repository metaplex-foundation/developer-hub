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

**ツリーのデリゲート**により、ツリー作成者はプライベートBubblegumツリーからcNFTをミントするための別のアカウントを承認できます。このページでは、ツリーデリゲート権限の承認と取り消しについて説明します。

- ツリー作成者に代わってcNFTをミントするためのツリーデリゲートを承認する
- デリゲートを作成者に戻すことでツリーデリゲートを取り消す
- プライベートツリーにのみ関連（公開ツリーは誰でもミントできる）

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

- ツリーのデリゲートは、プライベートツリーにのみ関連します。公開ツリーでは誰でもミントできます。
- 一度にアクティブなツリーデリゲートは1つのみです。新しいデリゲートを承認すると、前のデリゲートが置き換えられます。
- デリゲートが設定されていても、ツリー作成者は完全な権限を保持します。

## Glossary

| 用語 | 定義 |
|------|------|
| **ツリーデリゲート** | プライベートツリーからcNFTをミントするためにツリー作成者によって承認されたアカウント |
| **ツリー作成者** | Bubblegumツリーを作成し、完全な管理権限を持つアカウント |
| **setTreeDelegate** | ツリーデリゲートの承認または取り消しに使用する命令 |
