---
title: Token Management
metaTitle: Token Management | Toolbox
description: How to manage Token with Umi.
---

The following instructions are part of the Token Programm the Associated Token Program and MPL Token Extras Program. The Token Program and Associated Token programs are essential for managing tokens on Solana since they enable you to create Mint accounts, Token accounts, Associated Token PDAs, mint tokens, transfer tokens, delegate tokens, and more. You can learn more about these programs in [Solana's official documentation](https://spl.solana.com/token).

## Create a Mint

This instruction allows you to create a new Mint account.

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

## Create a Token Account

This instruction creates a new Token account, which is used to hold tokens of a specific mint for a particular owner.

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createToken } from '@metaplex-foundation/mpl-toolbox'

const token = generateSigner(umi)

await createToken(umi, { token, mint, owner }).sendAndConfirm(umi)
```

## Create an Associated Token Account

This instruction creates an Associated Token Account, which is a deterministic Token account derived from the owner's and mint's public keys.

```ts
import { createAssociatedToken } from '@metaplex-foundation/mpl-toolbox'

await createAssociatedToken(umi, { mint, owner }).sendAndConfirm(umi)
```

## Mint Tokens

This instruction allows you to mint new tokens to a specified Token account.

```ts
import { mintTokensTo } from '@metaplex-foundation/mpl-toolbox'

await mintTokensTo(umi, {
  mintAuthority,
  mint,
  token,
  amount: 42,
}).sendAndConfirm(umi)
```

## Create Mint with Associated Token Account

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

## Transfer Tokens

This instruction allows you to transfer tokens from one Token account to another.

```ts
import { transferTokens } from '@metaplex-foundation/mpl-toolbox'

await transferTokens(umi, {
  source: sourceTokenAccount,
  destination: destinationTokenAccount,
  authority: ownerOrDelegate,
  amount: 30,
}).sendAndConfirm(umi)
```

## Set Authority

This instruction allows you to change the authority on a Token or Mint account.

```ts
import { setAuthority, AuthorityType } from '@metaplex-foundation/mpl-toolbox'

await setAuthority(umi, {
  owned: tokenAccount,
  owner,
  authorityType: AuthorityType.CloseAccount,
  newAuthority: newCloseAuthority.publicKey,
}).sendAndConfirm(umi)
```

## Fetch Mint and Token accounts

These functions allow you to fetch information about Mint and Token accounts.

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

## Create Token If Missing

This instruction creates a new Token account only if it doesn't already exist. It's particularly useful when a subsequent instruction requires a Token account, but you’re unsure whether it already exists. This instruction ensures the Token account's existence without needing to fetch it on the client side.

Here’s how it works:

- If the account exists, the instruction succeeds and does nothing.
- If the account does not exist, the instruction succeeds and creates the associated token account.

```ts
import { transactionBuilder } from '@metaplex-foundation/umi'
import { createTokenIfMissing } from '@metaplex-foundation/mpl-toolbox'

// If the token account is an associated token account.
await transactionBuilder()
  .add(createTokenIfMissing(umi, { mint, owner }))
  .add(...) // Subsequent instructions can be sure the Associated Token account exists.
  .sendAndConfirm(umi)
```
