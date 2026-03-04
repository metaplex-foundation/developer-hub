---
title: 委托树
metaTitle: 委托树 - Bubblegum V2
description: 了解如何在Bubblegum V2上委托默克尔树。
created: '2025-01-15'
updated: '2026-02-24'
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
  - q: 树委托人可以做什么？
    a: 树委托人可以代表树创建者从树中铸造压缩NFT。这仅与私有树相关。
  - q: 如何撤销树委托人？
    a: 将newTreeDelegate设置为树创建者自己的公钥来使用setTreeDelegate。
---

## Summary

**委托树**允许树创建者授权另一个账户从私有Bubblegum树中铸造cNFT。本页面介绍批准和撤销树委托权限的方法。

- 批准树委托人代表树创建者铸造cNFT
- 通过将委托人重置为创建者来撤销树委托人
- 仅与私有树相关（公共树允许任何人铸造）

与压缩NFT的所有者可以批准委托权限类似，Bubblegum树的创建者也可以批准另一个账户代表他们执行操作。{% .lead %}

一旦为Bubblegum树批准了委托权限，它将能够代表创建者[铸造压缩NFT](/zh/smart-contracts/bubblegum-v2/mint-cnfts)。请注意，这仅与私有树相关，因为任何人都可以在公共树上铸造。

## 为树批准委托权限

要在Bubblegum树上批准新的委托权限，其创建者可以使用**Set Tree Delegate**指令，该指令接受以下参数：

- **默克尔树**：要委托的默克尔树地址。
- **树创建者**：默克尔树的创建者作为签名者。
- **新树委托人**：要批准的新委托权限。

{% dialect-switcher title="委托Bubblegum树" %}
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

## 撤销树的委托权限

要撤销现有的委托权限，树的创建者只需将自己设置为新的委托权限。

{% dialect-switcher title="撤销Bubblegum树的委托权限" %}
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

- 树委托仅与私有树相关。公共树允许任何人铸造。
- 一次只能有一个树委托人处于活动状态。批准新委托人会替换之前的委托人。
- 即使设置了委托人，树创建者仍保留完整权限。

## Glossary

| 术语 | 定义 |
|------|------|
| **树委托人** | 由树创建者授权从私有树中铸造cNFT的账户 |
| **树创建者** | 创建Bubblegum树并拥有完整管理权限的账户 |
| **setTreeDelegate** | 用于批准或撤销树委托人的指令 |
