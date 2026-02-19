---
title: Transaction Memo
metaTitle: Memo Program | Toolbox
description: How to use Memos with Umi.
---

The SPL Memo program allows you to attach text notes - i.e. memos - to transactions. You can learn more about this program in [Solana's official documentation](https://spl.solana.com/memo).

## Add memos to transactions

This instruction allows you to add a memo to a transaction.

```ts
import { transactionBuilder } from '@metaplex-foundation/umi'
import { addMemo } from '@metaplex-foundation/mpl-toolbox'

await transactionBuilder()
  .add(...) // Any instruction(s) here.
  .add(addMemo(umi, { memo: 'Hello world!' })) // Add a memo to the transaction.
  .sendAndConfirm(umi)
```
