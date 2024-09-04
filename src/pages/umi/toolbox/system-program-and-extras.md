---
title: System Program & Extras
metaTitle: System Program | Toolbox
description: How to use the Solana System Program with Umi.
---

## System Program

The instructions of the System Program are used to create new uninitialized accounts onchain and transfer SOL between wallets. You can learn more about the System Program in [Solana's official documentation](https://docs.solanalabs.com/runtime/programs#system-program).

**Note**: If you're using the System Program, you might also be interested in the [MPL System Extras program](#mpl-system-extras), which provides additional convenient instructions for creating accounts and transferring SOL.

### Create Account

This instruction allows you to create a new uninitialized account on Solana. You can specify the account's size and the program that will own it.

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createAccount } from '@metaplex-foundation/mpl-toolbox'

const newAccount = generateSigner(umi)
const space = 42

await createAccount(umi, {
  newAccount,
  payer: umi.payer
  lamports: await umi.rpc.getRent(space),
  space,
  programId: umi.programs.get('myProgramName').publicKey,
}).sendAndConfirm(umi)
```

### Transfer SOL

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

## MPL System Extras

The MPL System Extras program is an immutable program that provides additional convenient instructions on top of the native SPL System program.

### Create Account with Rent

This instruction allows you to create new accounts without needing to manually fetch the rent exemption. It leverages the `Rent` sysvar within the program to compute the rent exemption based on the provided `space` attribute, and then performs a CPI (Cross-Program Invocation) call to the SPL System program to create the account with the calculated rent.

**Advantages**: By using this instruction, clients avoid the need for an extra HTTP request to fetch the rent exemption from the RPC node, streamlining the process.

**Limitations**: Since this instruction involves a CPI call, the maximum account size that can be created is limited to 10KB, compared to 10MB when using the SPL System program directly.

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createAccountWithRent } from '@metaplex-foundation/mpl-toolbox'

const newAccount = generateSigner(umi)
await createAccountWithRent(umi, {
  newAccount,
  payer: umi.payer,
  space: 42,
  programId: umi.programs.get('myProgramName').publicKey,
}).sendAndConfirm(umi)
```

### Transfer All SOL

This instruction is similar to the **Transfer SOL** instruction from the SPL System program except that it transfers all the SOL from the source account to the destination account.

This is particularly useful when you want to drain an account of all its lamports while still using the account to pay for the transaction. Without this instruction, you'd need to manually fetch the account balance, then subtract an estimated transaction fee—a process that can be challenging, especially when dealing with prioritization fees.

```ts
import { transferAllSol } from '@metaplex-foundation/mpl-toolbox'

await transferAllSol(umi, {
  source: umi.identity,
  destination,
}).sendAndConfirm(umi)
```