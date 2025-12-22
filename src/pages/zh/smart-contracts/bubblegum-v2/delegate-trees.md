---
title: 委托树
metaTitle: 委托树 | Bubblegum V2
description: 了解如何在Bubblegum上委托默克尔树。
---

与压缩NFT的所有者可以批准委托权限类似，Bubblegum树的创建者也可以批准另一个账户代表他们执行操作。{% .lead %}

一旦为Bubblegum树批准了委托权限，它将能够代表创建者[铸造压缩NFT](/zh/bubblegum-v2/mint-cnfts)。请注意，这仅与私有树相关，因为任何人都可以在公共树上铸造。

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
