---
title: How to CPI into a Metaplex Program
metaTitle: Metaplex — Working with Rust
description: A quick overview on working with Rust and the Metaplex protocal.
---

## Introduction

You may have heard the term "CPI'ing into a program" or "Call a CPI on the program" terms thrown around before and be thinking "What they hell are they talking about?".

A CPI (Cross Program Invocation) is the interaction of one program invoking an instruction on another program.

An example would be that I make a program and during this transaction I need to transfer an Nft or Asset during this transaction. Well my program can CPI call and ask the Token Metadata or Core programs to exectute the transfer instruction for me if I give it all the correct details.

## Using Metaplex Rust Transaction CPI Builders

Each instruction that comes from Metaplex Rust crate will also currently come with a `CpiBuilder` version of that instruction which you can import. This abstracts a massive amount code for you and can be invoked straight from the CpiBuilder itself.

Lets take the `Transfer` instruction from Core as an example here (this applies to all other instructions from this Crate and all other Metaplex crates too.)

If we look through the instructions in the [Mpl Core crate type docs](https://docs.rs/mpl-core/0.7.0/mpl_core/instructions/index.html) we can see we have a number of instructions available to us.

```
TransferV1
TransferV1Builder
TransferV1Cpi
TransferV1CpiAccounts
TransferV1CpiBuilder
TransferV1InstructionArgs
TransferV1InstructionData
```

The one we are interested in here is the `TransferV1CpiBuilder`.

To initialize the builder we can call `new` on the CpiBuilder and pass in the program `AcountInfo` of the program address the CPI call is being made to.

```rust
TransferV1CpiBuilder::new(ctx.accounts.mpl_core_program);
```

From this point we can `ctrl + click` (pc) or `cmd + click` (mac) into the `new` function generated from the `CpiBuilder::` which presents us with all the CPI arguments (accounts and data) required for this particular CPI call.

```rust
//new() function for TransferV1CpiBuilder

pub fn new(program: &'b solana_program::account_info::AccountInfo<'a>) -> Self {
        let instruction = Box::new(TransferV1CpiBuilderInstruction {
            __program: program,
            asset: None,
            collection: None,
            payer: None,
            authority: None,
            new_owner: None,
            system_program: None,
            log_wrapper: None,
            compression_proof: None,
            __remaining_accounts: Vec::new(),
        });
        Self { instruction }
    }
```

As we can see this one requires all accounts and no data and is a fairly easy CPI call to fill out.

If we look at a second CpiBuilder but this time for CreateV1 we can see extra data here that is required such as `name` and `uri` which are both strings.

```rust
//new() function for CreateV1CpiBuilder

pub fn new(program: &'b solana_program::account_info::AccountInfo<'a>) -> Self {
        let instruction = Box::new(CreateV1CpiBuilderInstruction {
            __program: program,
            asset: None,
            collection: None,
            authority: None,
            payer: None,
            owner: None,
            update_authority: None,
            system_program: None,
            log_wrapper: None,
            data_state: None,
            name: None,
            uri: None,
            plugins: None,
            __remaining_accounts: Vec::new(),
        });
        Self { instruction }
    }
```

Some accounts may be optional in CpiBuilder's so you may have to check what you do and do not need for your use case.

Below are both CpiBuilders for Transfer and Create filled out.

```rust
TransferV1CpiBuilder::new()
        .asset(ctx.accounts.asset)
        .collection(context.accounts.collection)
        .payer(context.accounts.payer)
        .authority(context.accounts.authority)
        .new_owner(context.accounts.new_owner)
        .system_program(context.accounts.system_program)
```

```rust
CreateV1CpiBuilder::new()
        .asset(context.accounts,asset)
        .collection(context.accounts.collection)
        .authority(context.accounts.authority)
        .payer(context.accounts.payer)
        .owner(context.accounts.owner)
        .update_authority(context.accounts.update_authority)
        .system_program(context.acccounts.system_program)
        .data_state(input.data_state.unwrap_or(DataState::AccountState))
        .name(args.asset_name)
        .uri(arts.asseet_uri)
        .plugins(args.plugins)
```

## Invoking

Invoking is the term used to exectute the CPI call to the other program, a programs version of "sending a transaction" if you may.

We have two options when it comes to invoking a CPI call. `invoke()` and `invoke_signed()`

### invoke()

`invoke()` is used when no PDA signer seeds need to be passed through to the instruction being called for the transaction to succeed.
Though accounts that have signed into your original instruction will automatically pass signer validations into the cpi calls.

```rust
CreateV1CpiBuilder::new()
        .asset(context.accounts,asset)
        ...
        .invoke()

```

### invoke_signed()

`invoke_signed()` is used when a PDA is one of the accounts that needs to be a signer in a cpi call. Lets say for example we had a program that took possesion of our Asset and one of our programs PDA addresses became the other of it. In order to transfer it and change the owner to someone else that PDA will have sign transaction.

You'll need to pass in the original PDA seeds and bump so that the PDA can be recreated can sign the cpi call on your programs behalf.

```rust
let signers = &[&[b"escrow", ctx.accounts.asset.key(), &[ctx.bumps.pda_escrow]]]

CreateV1CpiBuilder::new()
        .asset(context.accounts,asset)
        ...
        .invoke(signers)

```

## Full CpiBuilder Example

Here is a full example of using a CpiBuilder using the TransferV1 instruction from the Core program.

```rust
TransferV1CpiBuilder::new()
        .asset(ctx.accounts.asset)
        .collection(context.accounts.collection)
        .payer(context.accounts.payer)
        .authority(context.accounts.authority)
        .new_owner(context.accounts.new_owner)
        .system_program(context.accounts.system_program)
        .invoke()

```
