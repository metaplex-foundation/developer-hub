---
title: Toolbox
metaTitle: Toolbox | Umi
description: Provides a high-level overview of the Toolbox product and what it includes.
---

The **mpl-toolbox** package is designed to complement Umi by providing a set of essential functions for Solana's Native Programs.

{% quick-links %}

{% quick-link title="API reference" icon="CodeBracketSquare" target="_blank" href="https://mpl-toolbox.typedoc.metaplex.com/" description="Looking for something specific? Have a peak at our API References and find your answer." /%}

{% /quick-links %}

## Installation

{% packagesUsed packages=["toolbox"] type="npm" /%}

The package isn't included by default when using the Umi package, so to install it and start using it, you need to run the following command

```
npm i @metaplex-foundation/mpl-toolbox
```

## Introduction

While Umi, and the other Metaplex products, already offer comprehensive packages that includes all the essential functions to get you started, they don't include the necessary helpers and functions for lower-level yet critical tasks, especially when dealing with Solana's native programs. For example, with just Umi, creating an account using the SPL System Program or extending a Lookup Table from the SPL Address Lookup Table program it's not possible.

That's why we created **mpl-toolbox**, a package that provides a set of essential helpers for Solana's Native that simplifies these low-level tasks. 

**The mpl-toolbox package includes helpers from the following programs:**

| Programs                                                                    | Description                                                                                                                 |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| [SPL System](#spl-system).                                                  | Solana's native program for account creation.                                                                               |
| [SPL Token and SPL Associated Token](#spl-token-and-spl-associated-token).  | Solana's native programs for managing tokens.                                                                               |
| [SPL Memo](#spl-memo).                                                      | Solana's native program for attaching memos to transactions.                                                                |
| [SPL Address Lookup Table](#spl-address-lookup-table).                      | Solana's native program for managing lookup tables.                                                                         |
| [SPL Compute Budget](#spl-compute-budget).                                  | Solana's native program for managing compute units.                                                                         |
| [MPL System Extras](#mpl-system-extras).                                    | A Metaplex program offering additional low-level features on top of SPL System.                                             |
| [MPL Token Extras](#mpl-token-extras).                                      | A Metaplex program offering additional low-level features on top of SPL Token.                                              |

## SPL System

The instructions of the SPL System Program are used to create new uninitialized accounts onchain and transfer SOL between wallets. You can learn more about the SPL System program in [Solana's official documentation](https://docs.solanalabs.com/runtime/programs#system-program).

**Note**: If you're using the SPL System Program, you might also be interested in the [MPL System Extras program](#mpl-system-extras), which provides additional convenient instructions for creating accounts and transferring SOL.

{% totem %}

{% totem-accordion title="Create Account" %}

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

{% /totem-accordion %}

{% totem-accordion title="Transfer SOL" %}

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

{% /totem-accordion %}

{% /totem %}

## SPL Token and SPL Associated Token

The SPL Token and SPL Associated Token programs are essential for managing tokens on Solana. They enable you to create Mint accounts, Token accounts, Associated Token PDAs, mint tokens, transfer tokens, delegate tokens, and more. You can learn more about these programs in [Solana's official documentation](https://spl.solana.com/token).

**Note**: If you're using the SPL Token & Associated Program, you might also be interested in the [Mpl Token Extras program](#mpl-token-extras), which provides additional convenient instructions for working with tokens.

{% totem %}

{% totem-accordion title="Create Mint" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createMint } from '@metaplex-foundation/mpl-toolbox'

const mint = generateSigner(umi)

await createMint(umi, {
  mint,
  decimals: 0,
  mintAuthority,
  freezeAuthority,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="Create Token" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createToken } from '@metaplex-foundation/mpl-toolbox'

const token = generateSigner(umi)
await createToken(umi, { token, mint, owner }).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="Create Associated Token" %}

```ts
import { createAssociatedToken } from '@metaplex-foundation/mpl-toolbox'

await createAssociatedToken(umi, { mint, owner }).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="Mint Tokens" %}

```ts
import { mintTokensTo } from '@metaplex-foundation/mpl-toolbox'

await mintTokensTo(umi, {
  mintAuthority,
  mint,
  token,
  amount: 42,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="Create Mint with Associated Token (helper)" %}

This helper creates a Mint account and an Associated Token account for the given mint and owner. It also mints tokens to that account if an amount greater than zero is provided.

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createMintWithAssociatedToken } from '@metaplex-foundation/mpl-toolbox'

const mint = generateSigner(umi)
await createMintWithAssociatedToken(umi, {
  mint,
  owner,
  amount: 1,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="Transfer Tokens" %}

```ts
import { transferTokens } from '@metaplex-foundation/mpl-toolbox'

await transferTokens(umi, {
  source: sourceTokenAccount,
  destination: destinationTokenAccount,
  authority: ownerOrDelegate,
  amount: 30,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="Set Authority" %}

```ts
import { setAuthority, AuthorityType } from '@metaplex-foundation/mpl-toolbox'

await setAuthority(umi, {
  owned: tokenAccount,
  owner,
  authorityType: AuthorityType.CloseAccount,
  newAuthority: newCloseAuthority.publicKey,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="Fetch Mint and Token accounts" %}

```ts
import {
  fetchMint,
  fetchToken,
  findAssociatedTokenPda,
  fetchAllTokenByOwner,
  fetchAllMintByOwner,
  fetchAllMintPublicKeyByOwner,
} from '@metaplex-foundation/mpl-toolbox'

// Fetch Mint account.
const mintAccount = await fetchMint(umi, mint)

// Fetch Token account.
const tokenAccount = await fetchToken(umi, token)

// Fetch Associated Token account.
const [associatedToken] = findAssociatedTokenPda(umi, { owner, mint })
const associatedTokenAccount = await fetchToken(umi, associatedToken)

// Fetch by owner.
const tokensFromOwner = await fetchAllTokenByOwner(umi, owner)
const mintsFromOwner = await fetchAllMintByOwner(umi, owner)
const mintKeysFromOwner = await fetchAllMintPublicKeyByOwner(umi, owner)
```

{% /totem-accordion %}

{% /totem %}

## SPL Memo

The SPL Memo program allows you to attach text notes - i.e. memos - to transactions. You can learn more about this program in [Solana's official documentation](https://spl.solana.com/memo).

{% totem %}

{% totem-accordion title="Add memos to transactions" %}

```ts
import { transactionBuilder } from '@metaplex-foundation/umi'
import { addMemo } from '@metaplex-foundation/mpl-toolbox'

await transactionBuilder()
  .add(...) // Any instruction(s) here.
  .add(addMemo(umi, { memo: 'Hello world!' })) // Add a memo to the transaction.
  .sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}

## SPL Address Lookup Table

The SPL Address Lookup Table program can be used to reduce the size of transactions by creating custom lookup tables — a.k.a **LUTs** or **ALTs** — before using them in transactions. This program allows you to create and extend LUTs. You can learn more about this program in [Solana's official documentation](https://docs.solana.com/developing/lookup-tables).

{% totem %}

{% totem-accordion title="Create empty LUTs" %}

```ts
import { createEmptyLut } from '@metaplex-foundation/mpl-toolbox'

const recentSlot = await umi.rpc.getSlot({ commitment: 'finalized' })
await createEmptyLut(umi, {
  recentSlot,
  authority,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="Extend a LUT" %}

```ts
import {
  findAddressLookupTablePda,
  extendLut,
} from '@metaplex-foundation/mpl-toolbox'

// The authority and slot used to create the LUT.
const lutAddress = findAddressLookupTablePda(umi, { authority, recentSlot })

await extendLut(umi, {
  authority,
  address: lutAddress, // The address of the LUT.
  addresses: [addressA, addressB], // The addresses to add to the LUT.
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="Create LUT with addresses (helper)" %}

This helper method creates a transaction builder with two instructions: one to create an empty LUT and one to extend it with the given addresses.

```ts
import { createLut } from '@metaplex-foundation/mpl-toolbox'

const recentSlot = await umi.rpc.getSlot({ commitment: 'finalized' })
await createLut(umi, {
  authority,
  recentSlot,
  addresses: [addressA, addressB],
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="Create LUT for a transaction builder (helper)" %}

This helper method accepts a "base" transaction builder and a recent slot and returns:

- An array of transaction builders to create all LUTs required by the base transaction builder.
- An array of LUTs to be used in the base transaction builder once the LUTs have been created.

```ts
import { createLutForTransactionBuilder } from '@metaplex-foundation/mpl-toolbox'

// 1. Get the LUT builders and the LUT accounts for a given transaction builder.
const recentSlot = await umi.rpc.getSlot({ commitment: 'finalized' })
const [createLutBuilders, lutAccounts] = createLutForTransactionBuilder(
  umi,
  baseBuilder,
  recentSlot
)

// 2. Create the LUTs.
for (const createLutBuilder of createLutBuilders) {
  await createLutBuilder.sendAndConfirm(umi)
}

// 3. Use the LUTs in the base transaction builder.
await baseBuilder.setAddressLookupTables(lutAccounts).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="Freeze a LUT" %}

```ts
import {
  findAddressLookupTablePda,
  freezeLut,
} from '@metaplex-foundation/mpl-toolbox'

// The authority and slot used to create the LUT.
const lutAddress = findAddressLookupTablePda(umi, { authority, recentSlot })

await freezeLut(umi, {
  authority,
  address: lutAddress,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="Deactivate a LUT" %}

```ts
import {
  findAddressLookupTablePda,
  deactivateLut,
} from '@metaplex-foundation/mpl-toolbox'

// The authority and slot used to create the LUT.
const lutAddress = findAddressLookupTablePda(umi, { authority, recentSlot })

await deactivateLut(umi, {
  authority,
  address: lutAddress,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="Close a LUT" %}

Note that a LUT can only be closed after it has been deactivated for a certain amount of time.

```ts
import {
  findAddressLookupTablePda,
  closeLut,
} from '@metaplex-foundation/mpl-toolbox'

// The authority and slot used to create the LUT.
const lutAddress = findAddressLookupTablePda(umi, { authority, recentSlot })

await closeLut(umi, {
  authority,
  address: lutAddress,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}

## SPL Compute Budget

The SPL Compute Budget program allows us to set a custom Compute Unit limit and price. You can read more about this program in [Solana's official documentation](https://docs.solana.com/developing/programming-model/runtime#compute-budget).

{% totem %}

{% totem-accordion title="Set Compute Unit limit" %}

```ts
import { transactionBuilder } from '@metaplex-foundation/umi'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'

await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 600_000 })) // Set the Compute Unit limit.
  .add(...) // Any instruction(s) here.
  .sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="Set Compute Unit price" %}

```ts
import { transactionBuilder } from '@metaplex-foundation/umi'
import { setComputeUnitPrice } from '@metaplex-foundation/mpl-toolbox'

await transactionBuilder()
  .add(setComputeUnitPrice(umi, { microLamports: 1 })) // Set the price per Compute Unit in micro-lamports.
  .add(...) // Any instruction(s) here.
  .sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}

## MPL System Extras

The MPL System Extras program is an immutable program that provides additional convenient instructions on top of the native SPL System program.

### Create Account with Rent

This instruction allows you to create new accounts without needing to manually fetch the rent exemption. It leverages the `Rent` sysvar within the program to compute the rent exemption based on the provided `space` attribute, and then performs a CPI (Cross-Program Invocation) call to the SPL System program to create the account with the calculated rent.

**Advantages**: By using this instruction, clients avoid the need for an extra HTTP request to fetch the rent exemption from the RPC node, streamlining the process.

**Limitations**: Since this instruction involves a CPI call, the maximum account size that can be created is limited to 10KB, compared to 10MB when using the SPL System program directly.

{% totem %}

{% totem-accordion title="Code Example" %}

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

{% /totem-accordion %}

{% /totem %}

### Transfer All SOL

This instruction is similar to the **Transfer SOL** instruction from the SPL System program except that it transfers all the SOL from the source account to the destination account.

This is particularly useful when you want to drain an account of all its lamports while still using the account to pay for the transaction. Without this instruction, you'd need to manually fetch the account balance, then subtract an estimated transaction fee—a process that can be challenging, especially when dealing with prioritization fees.

{% totem %}

{% totem-accordion title="Code Example" %}

```ts
import { transferAllSol } from '@metaplex-foundation/mpl-toolbox'

await transferAllSol(umi, {
  source: umi.identity,
  destination,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}

## MPL Token Extras

The MPL Token Extras program is an immutable program that offers a few convenient instructions on top of the native SPL Token program.

### Create Token If Missing

This instruction creates a new Token account only if it doesn't already exist. It's particularly useful when a subsequent instruction requires a Token account, but you’re unsure whether it already exists. This instruction ensures the Token account's existence without needing to fetch it on the client side.

Here’s how it works:
- If the account exists, the instruction succeeds and does nothing.
- If the account does not exist, the instruction succeeds and creates the associated token account.

{% totem %}

{% totem-accordion title="Code Example" %}

```ts
import { transactionBuilder } from '@metaplex-foundation/umi'
import { createTokenIfMissing } from '@metaplex-foundation/mpl-toolbox'

// If the token account is an associated token account.
await transactionBuilder()
  .add(createTokenIfMissing(umi, { mint, owner }))
  .add(...) // Subsequent instructions can be sure the Associated Token account exists.
  .sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
