---
title: トランザクションメモ
metaTitle: メモプログラム | Toolbox
description: Umiでメモを使用する方法。
---

SPLメモプログラムにより、トランザクションにテキストノート（メモ）を添付できます。このプログラムについては、[Solanaの公式ドキュメント](https://spl.solana.com/memo)で詳しく学ぶことができます。

## トランザクションにメモを追加

この命令により、トランザクションにメモを追加できます。

```ts
import { transactionBuilder } from '@metaplex-foundation/umi'
import { addMemo } from '@metaplex-foundation/mpl-toolbox'

await transactionBuilder()
  .add(...) // ここに任意の命令。
  .add(addMemo(umi, { memo: 'Hello world!' })) // トランザクションにメモを追加。
  .sendAndConfirm(umi)
```
