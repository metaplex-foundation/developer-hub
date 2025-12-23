---
title: 已验证的创作者
metaTitle: 已验证的创作者 | Token Metadata
description: 了解如何在 Token Metadata 上验证资产的创作者
---

与[集合](/zh/smart-contracts/token-metadata/collections)类似，资产的创作者必须经过验证以确保资产的真实性。{% .lead %}

一个 `verified` 标志为 `false` 的创作者可能是由任何人添加的，因此不能被信任。另一方面，一个 `verified` 标志为 `true` 的创作者保证已经签署了一笔交易，验证他们是该资产的创作者。

在下面的部分中，我们将学习如何验证和取消验证资产的创作者。请注意，在验证创作者之前，它必须已经是资产的**元数据**账户的 **Creators** 数组的一部分。这可以在[铸造资产](/zh/smart-contracts/token-metadata/mint)时完成，也可以在[更新资产](/zh/smart-contracts/token-metadata/update)时完成。

## 验证创作者

**验证**指令可用于验证资产的创作者。请注意，如果我们向指令传递不同的参数，同一指令也可用于验证集合。我们的一些 SDK 将这些指令拆分为多个辅助函数，如 `verifyCreatorV1` 和 `verifyCollectionV1`，以提供更好的开发者体验。

在验证创作者的上下文中，**验证**指令所需的主要属性如下：

- **Metadata**：资产的**元数据**账户地址。
- **Authority**：我们试图验证的创作者作为签名者。

以下是我们如何使用 SDK 在 Token Metadata 上验证创作者。

{% dialect-switcher title="验证创作者" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { verifyCreatorV1 } from '@metaplex-foundation/mpl-token-metadata'

await verifyCreatorV1(umi, {
  metadata,
  authority: creator,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 取消验证创作者

相反，**取消验证**指令可用于将创作者的 `verified` 标志转为 `false`。它接受与**验证**指令相同的属性，并且可以以相同的方式使用。

{% dialect-switcher title="取消验证创作者" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { unverifyCreatorV1 } from '@metaplex-foundation/mpl-token-metadata'

await unverifyCreatorV1(umi, {
  metadata,
  authority: creator,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}
