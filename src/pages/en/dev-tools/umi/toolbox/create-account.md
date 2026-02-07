---
title: Create Account
metaTitle: Create Account | Toolbox
description: How to Create Account with Umi.
---

The following instructions are part of the System Program and MPL System Extras Program. You can learn more about the System Program in [Solana's official documentation](https://docs.solanalabs.com/runtime/programs#system-program).

## Create Account

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

## Create Account with Rent

This instruction allows you to create new accounts without needing to manually fetch the rent exemption. It leverages the `Rent` sysvar within the program to compute the rent exemption based on the provided `space` attribute, and then performs a CPI (Cross-Program Invocation) call to the SPL System program to create the account with the calculated rent.

**Advantages**: By using this instruction, clients avoid the need for an extra HTTP request to fetch the rent exemption from the RPC node, streamlining the process.

**Limitations**: Since this instruction involves a CPI call, the maximum account size that can be created is limited to 10KB, compared to 10MB when using the SPL System program directly.

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createAccountWithRent } from '@metaplex-foundation/mpl-toolbox'

const newAccount = generateSigner(umi)
const space = 42

await createAccountWithRent(umi, {
  newAccount,
  payer: umi.payer,
  space,
  programId: umi.programs.get('myProgramName').publicKey,
}).sendAndConfirm(umi)
```
