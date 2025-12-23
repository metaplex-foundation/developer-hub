---
title: 提取 Core Candy Machine
metaTitle: 提取 Core Candy Machine | Core Candy Machine
description: 如何提取 Core Candy Machine 并从中收回租金。
---

提取 Core Candy Machine 会返回 Candy Machine 的所有链上存储租金成本,同时删除数据并使 Candy Machine 无法使用。

{% callout %}
此操作是不可逆的,因此只有在 100% 完成铸造过程时才提取您的 Core Candy Machine。您的 Core Candy Machine 无法恢复或复原。
{% /callout %}

{% dialect-switcher title="提取 Core Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { deleteCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine'
import { publicKey } from '@metaplex-foundation/umi'

const candyMachineId = '11111111111111111111111111111111'

await deleteCandyMachine(umi, {
  candyMachine: publicKey(candyMachineId),
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}
