---
title: Transfer Sol
metaTitle: Transfer Sol | Toolbox
description: How to Transfer Sol with Umi.
---

The following instructions are part of the System Program and MPL System Extras Program. You can learn more about the System Program in [Solana's official documentation](https://docs.solanalabs.com/runtime/programs#system-program).

## Transfer SOL

This instruction allows you to transfer SOL from one account to another. You need to specify the amount of SOL to transfer in **lamports** (1/1,000,000 of SOL)

```ts
import { sol, publicKey } from '@metaplex-foundation/umi'
import { transferSol, transferAllSol } from '@metaplex-foundation/mpl-toolbox'

const destination = publicKey(`11111111111111111111111`)

await transferSol(umi, {
  source: umi.identity,
  destination,
  amount: sol(1.3),
}).sendAndConfirm(umi)
```

## Transfer All SOL

This instruction is similar to the **Transfer SOL** instruction from the SPL System program except that it transfers all the SOL from the source account to the destination account.

This is particularly useful when you want to drain an account of all its lamports while still using the account to pay for the transaction. Without this instruction, you'd need to manually fetch the account balance, then subtract an estimated transaction fee—a process that can be challenging, especially when dealing with prioritization fees.

```ts
import { transferAllSol } from '@metaplex-foundation/mpl-toolbox'

await transferAllSol(umi, {
  source: umi.identity,
  destination,
}).sendAndConfirm(umi)
```