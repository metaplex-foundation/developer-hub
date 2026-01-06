---
title: 交易备忘录
metaTitle: Memo 程序 | Toolbox
description: 如何在 Umi 中使用备忘录。
---

SPL Memo 程序允许您将文本备注（即备忘录）附加到交易。您可以在 [Solana 官方文档](https://spl.solana.com/memo)中了解有关此程序的更多信息。

## 向交易添加备忘录

此指令允许您向交易添加备忘录。

```ts
import { transactionBuilder } from '@metaplex-foundation/umi'
import { addMemo } from '@metaplex-foundation/mpl-toolbox'

await transactionBuilder()
  .add(...) // 此处添加任何指令。
  .add(addMemo(umi, { memo: 'Hello world!' })) // 向交易添加备忘录。
  .sendAndConfirm(umi)
```
