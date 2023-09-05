---
title: Overview
metaTitle: Toolbox - Overview
description: Provides a high-level overview of the Toolbox product and what it includes.
---

Mpl Toolbox includes a bunch of essential Solana and Metaplex programs to get you up and running with your decentralized applications. {% .lead %}

{% quick-links %}

{% quick-link title="Getting Started" icon="InboxArrowDown" href="/token-metadata/getting-started" description="Find the language or library of your choice and get started essentials programs." /%}

{% quick-link title="API reference" icon="CodeBracketSquare" href="/token-metadata/references" description="Looking for something specific? Have a peak at our API References and find your answer." /%}

{% /quick-links %}

## Introduction

Whilst all of Metaplex's products offer clients that include all you need to get started with that particular product, they do not include clients for low-level yet essentials tasks such as creating an account from the SPL System program or extending a Lookup Table from the SPL Address Lookup Table program. MPL Toolbox aims to fix this by offering a collection of essential Solana and Metaplex programs that can be used to perform these more low-level tasks. Namely, MPL Toolbox includes the following programs:

- [SPL System](#spl-system). The native Solana program that allows us to create accounts.
- [SPL Token and SPL Associated Token](#spl-token-and-spl-associated-token). The native Solana programs that allow us to manage tokens.
- [SPL Memo](#spl-memo). The native Solana program that allows us to attach memos to transactions.
- [SPL Address Lookup Table](#spl-address-lookup-table). The native Solana program that allows us to manage lookup tables.
- [MPL System Extras](#mpl-system-extras). An immutable Metaplex program that allows us to create accounts without needing to fetch the rent exemption.
- [MPL Token Extras](#mpl-token-extras). An immutable Metaplex program that offers a few extra low-level features on top of SPL Token.

## SPL System

The instructions of the SPL System program can be used to create new uninitialized accounts on-chain and transfer SOL between wallets. You can read more about the SPL System program in [Solana's official documentation](https://docs.solana.com/developing/runtime-facilities/programs).

Note that, if you need to create an account that requires less than 10Kb of space, you may be interested in the `createAccountWithRent` instruction of the [MPL System Extras program](#mpl-system-extras).

{% dialect-switcher title="Interact with SPL System" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

{% totem-accordion title="Create Account" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createAccount } from '@metaplex-foundation/mpl-toolbox'

const space = 42
const newAccount = generateSigner(umi)
await createAccount(umi, {
  newAccount,
  lamports: await umi.rpc.getRent(space),
  space,
  programId: umi.programs.get('myProgramName').publicKey,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="Transfer SOL" %}

```ts
import { sol } from '@metaplex-foundation/umi'
import { transferSol } from '@metaplex-foundation/mpl-toolbox'

await transferSol(umi, {
  source,
  destination,
  amount: sol(1.3),
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## SPL Token and SPL Associated Token

The SPL Token and SPL Associated Token programs can be used to manage tokens in Solana. It allows us to create Mint accounts, Token accounts, Associated Token PDAs, mint tokens, transfer tokens, delegate tokens, etc. You can read more about these programs in [Solana's official documentation](https://spl.solana.com/token).

Note that, you may be interested in the [Mpl Token Extras program](#mpl-token-extras) which offers a few convenient instructions when dealing with tokens.

{% dialect-switcher title="Manage tokens" %}
{% dialect title="JavaScript" id="js" %}
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

This helper creates a Mint account and an Associated Token account for the given mint and owner. It also mints tokens to that accounts if an amount greater than zero is provided.

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
{% /dialect %}
{% /dialect-switcher %}

## SPL Memo

The SPL Memo program simply allows us to attach text notes — i.e. memos — to transactions. You can read more about this program in [Solana's official documentation](https://spl.solana.com/memo).

{% dialect-switcher title="Add memos to transactions" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { transactionBuilder } from '@metaplex-foundation/umi'
import { addMemo } from '@metaplex-foundation/mpl-toolbox'

await transactionBuilder()
  .add(...) // Any instruction(s) here.
  .add(addMemo(umi, { memo: 'Hello world!' })) // Add a memo to the transaction.
  .sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## SPL Address Lookup Table

_Coming soon..._

{% /dialect %}
{% /dialect-switcher %}

## MPL System Extras

_Coming soon..._

{% /dialect %}
{% /dialect-switcher %}

## MPL Token Extras

_Coming soon..._
{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
