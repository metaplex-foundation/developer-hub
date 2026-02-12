---
title: The Payer-Authority Pattern
metaTitle: The Payer-Authority Pattern | Metaplex Guides
description: A common programming pattern for Solana instructions using a separate authority and payer.
# remember to update dates also in /components/guides/index.js
created: '12-30-2024'
updated: null
keywords:
  - payer-authority pattern
  - Solana program design
  - PDA signers
  - account ownership
  - Solana instruction pattern
about:
  - payer-authority pattern
  - Solana program architecture
  - account ownership
  - PDA signers
proficiencyLevel: Advanced
programmingLanguage:
  - Rust
  - TypeScript
faqs:
  - q: What is the payer-authority pattern in Solana?
    a: The payer-authority pattern separates the account paying for storage fees (payer) from the account that owns or controls the created account (authority), enabling more flexible funding and ownership semantics.
  - q: Why would I need separate payer and authority signers?
    a: Separate signers allow a sponsor to pay for on-chain storage while the end user retains ownership, and they simplify PDA-based interactions where PDAs cannot directly pay rent.
  - q: How does the payer-authority pattern handle PDA signers?
    a: Since PDAs cannot sign transactions or pay fees directly, the pattern uses a separate payer account to cover rent and storage costs on behalf of the PDA, avoiding the complexity of funneling funds into PDAs.
---

## P-A Pattern Overview

The Payer-Authority (P-A) pattern is a common approach to structuring Solana
program instructions in scenarios where the party paying for storage or rent
(the *payer*) can be different from the party that owns or exercises control
over the account (the *authority*). It serves as a powerful default behavior
when designing protocols for maximum composability, and is a staple in the
Metaplex Program Library.

By separating these roles, your program can accommodate more flexible funding
mechanisms (one or more payers) and clearer ownership or control semantics. For
example, in a game, you might want a user to pay for initializing an account,
but have your program or a PDA serve as the authority for subsequent actions.

## Why you might need two different signers

1. **Different Responsibilities**:  
   Splitting responsibilities allows one signer to pay for the account creation
   or rent, and another signer to actually manage or own that account. This is
   a clean separation of concerns that is especially important for large or more
   complex programs.

2. **Flexibility**:  
   Sometimes the party funding the transaction is not the same one that will
   ultimately control the account. By setting up two roles, you can easily
   accommodate patterns where a sponsor pays for onchain storage, but the end
   user retains autonomy and ownership of the asset.

3. **PDA Signers**:
   Program Derived Addresses (PDAs) do not possess private keys that allow them
   to sign transactions in the same way as regular keypairs, so all of their
   interactions must be managed by calling a program. While a PDA can be the
   authority of an account, it cannot directly be used to pay rent or fees
   without involving complicated fund movements. Having a separate payer account
   to cover rent or small storage adjustments on behalf of the PDA avoids the
   complexity of funneling funds into the PDA just to pay for minor changes.

## Rust Example

Below are examples of how you can implement the P-A pattern in both Shank and
Anchor. We also discuss how to validate these signer conditions and how to build
a client that works with this pattern.

{% dialect-switcher title="Payer-Authority Pattern in Rust" %}
{% dialect title="Shank" id="shank" %}
{% totem %}

```rust
    /// Create a new account.
    #[account(0, writable, signer, name="account", desc = "The address of the new account")]
    #[account(1, writable, signer, name="payer", desc = "The account paying for the storage fees")]
    #[account(2, optional, signer, name="authority", desc = "The authority signing for account creation")]
    #[account(3, name="system_program", desc = "The system program")]
    CreateAccountV1(CreateAccountV1Args),
```

{% /totem %}
{% /dialect %}

{% dialect title="Anchor" id="anchor" %}
{% totem %}

```rust
    /// Create a new account.
    #[derive(Accounts)]
    pub struct CreateAccount<'info> {
        /// The address of the new account
        #[account(init, payer = payer, space = 8 + NewAccount::MAXIMUM_SIZE)]
        pub account: Account<'info, NewAccount>,
        
        /// The account paying for the storage fees
        #[account(mut)]
        pub payer: Signer<'info>,
        
        /// The authority signing for the account creation
        pub authority: Option<Signer<'info>>,
        
        // The system program
        pub system_program: Program<'info, System>
    }
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Constraint checks

In native Solana code you need to ensure that the correct signers are present for
each instruction. This typically means:

```rust
    // Check that the payer has signed the transaction and consented to paying storage fees.
    assert_signer(ctx.accounts.payer)?;

    // If the authority is present, check that they're a signer. Otherwise treat 
    // the payer as the one authorizing the transaction.
    let authority = match ctx.accounts.authority {
        Some(authority) => {
            assert_signer(authority)?;
            authority
        }
        None => ctx.accounts.payer,
    };
```

### Key points

* `assert_signer` ensures that the account key provided has signed the transaction.

* We set up fallback logic: if no authority is provided, we treat payer as the authority.
This effectively captures the essence of the P-A pattern: a separate, optional
authority can manage account creation or modifications, but if no authority is
provided, the payer takes on that role by default.

## What the client looks like

From the client side, you’ll need to pass both the payer and authority
(optionally) to the transaction. Below is an example using Umi, which shows how
these accounts might be structured for a CreateAccountV1 instruction.

{% dialect-switcher title="Payer-Authority Pattern Client" %}
{% dialect title="Umi" id="umi" %}
{% totem %}

```ts
    // Accounts.
    export type CreateAccountV1InstructionAccounts = {
        /** The address of the new account */
        account: Signer;
        /** The account paying for the storage fees */
        payer: Signer;
        /** The authority of the new asset */
        authority?: Signer | Pda;
        /** The system program */
        systemProgram?: PublicKey | Pda;
    };
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Summary

The Payer-Authority pattern is an elegant way to handle situations where the
account’s funder (payer) differs from the account’s owner or manager
(authority). By requiring separate signers and validating them in your on-chain
logic, you can maintain clear, robust, and flexible ownership semantics in your
program. The sample code in Rust (Shank and Anchor) and the Umi client example
illustrate how to implement this pattern end to end.

Use this pattern whenever you anticipate needing a specialized account authority
that may differ from the entity paying for account creation or transaction fees,
or in situations where you expect users to CPI into your program. This ensures
you can easily handle more sophisticated scenarios without complicating your
core program logic.
