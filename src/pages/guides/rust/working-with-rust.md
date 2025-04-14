---
title: Working with Rust
metaTitle: Working with Rust | Guides
description: A quick overview on working with Rust and the Metaplex protocol.
---

## Introduction

It's no doubt that if you are building on Solana you most likely have come across the term Rust which is the most popular language for building programs within the Solana ecosystem.

Rust can be quite a daunting task to look at and use if you are new to developing but here are some resources to get you started with Rust and the Solana ecosystem.

**The Rust Book**

Start here to learn rust. It takes from basics through to the advanced coding using the language.

[https://doc.rust-lang.org/stable/book/](https://doc.rust-lang.org/stable/book/)

**Anchor**

Anchor is a framework that helps you build Solana programs by stripping away a chunk of the security boilerplate and handling it for you speeding up the development process.

[https://www.anchor-lang.com/](https://www.anchor-lang.com/)

## Working with Rust scripts locally

### Setting up a Solana client

Setting up an Solana RPC client for Rust scripts is fairly straight forward. You'll just need to grab the `solana_client` crate.

```rust
use solana_client::rpc_client;

let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
```

### Using Metaplex Rust Instruction Builders

Each instruction that comes from a Metaplex Rust crate will also currently come with a `Builder` version of that instruction which you can import. This abstracts a massive amount code for you and will return you an instruction that's ready to send.

Let's take the `CreateV1` instruction from Core as an example (this applies to all other instructions from this Crate and all other Metaplex crates too).

If we look through the instructions in the [Mpl Core crate type docs](https://docs.rs/mpl-core/0.7.0/mpl_core/instructions/index.html) we can see we have a number of instructions available to us.

```
CreateV1
CreateV1Builder
CreateV1Cpi
CreateV1CpiAccounts
CreateV1CpiBuilder
CreateV1InstructionArgs
CreateV1InstructionData
```

The one we are interested in here is the `CreateV1Builder`.

To initialize the builder we can call `new`.

```rust
CreateV1Builder::new();
```

From this point we can `ctrl + click` (pc) or `cmd + click` (mac) into the `new` function generated from the `Builder::` which positions us at the `pub fn new()` for the builder. If you scroll up slightly you'll then see the `pub struct` for the `CreateV1Builder` as outlined below.

```rust
pub struct CreateV1Builder {
    asset: Option<solana_program::pubkey::Pubkey>,
    collection: Option<solana_program::pubkey::Pubkey>,
    authority: Option<solana_program::pubkey::Pubkey>,
    payer: Option<solana_program::pubkey::Pubkey>,
    owner: Option<solana_program::pubkey::Pubkey>,
    update_authority: Option<solana_program::pubkey::Pubkey>,
    system_program: Option<solana_program::pubkey::Pubkey>,
    log_wrapper: Option<solana_program::pubkey::Pubkey>,
    data_state: Option<DataState>,
    name: Option<String>,
    uri: Option<String>,
    plugins: Option<Vec<PluginAuthorityPair>>,
    __remaining_accounts: Vec<solana_program::instruction::AccountMeta>,
}

```

These are your arguments of publickeys and data that will need to be passed into the builder. Some accounts may also be optional and default to others, this can vary from instruction to instruction. If you click through to the `new()` function again and scroll down this time you'll see the individual functions with additional comments. In the below case you can see that the owner will default to payer, so we don't need to pass in owner if in this case if the payer is also going to be the owner of the Asset.

```rust
/// `[optional account]`
    /// The owner of the new asset. Defaults to the authority if not present.
    #[inline(always)]
    pub fn owner(&mut self, owner: Option<solana_program::pubkey::Pubkey>) -> &mut Self {
        self.owner = owner;
        self
    }
```

Here is an example using the `CreateV1Builder` that returns an instruction using `.instruction()` to close out the Builder.

```rust
let create_asset_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .collection(collection.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
.       .instruction();
```

Now that we have our instruction ready we need to create a normal Solana transaction to send to our RPC. This includes a blockhash andxx§ signers.

### Full Builder Example

This is a full example of creating a instruction using a Metaplex `Builder` function and sending that transction off to the chain.

```rust
use mpl_core::instructions::CreateV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{signature::Keypair, signer::Signer, transaction::Transaction};

let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let create_asset_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_tx = Transaction::new_signed_with_payer(
        &[create_asset_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client.send_and_confirm_transaction(&create_asset_tx).await.unwrap();

    println!("Signature: {:?}", res)

```

## Working with Programs

### CPI (Cross Program Invocation)

You may have heard the term "CPI'ing into a program" or "Call a CPI on the program" terms thrown around before and be thinking "What they hell are they talking about?".

Well CPI'ing into a program is basically one program calling upon another program during a transaction.

An example would be that I make a program and during this transaction I need to transfer an Nft or Asset during this transaction. Well my program can CPI call and ask the Token Metadata or Core programs to execute the transfer instruction for me if I give it all the correct details.

### Using Metaplex Rust Transaction CPI Builders

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

To initialize the builder we can call `new` on the CpiBuilder and pass in the program `AccountInfo` of the program address the CPI call is being made to.

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
        .system_program(context.accounts.system_program)
        .data_state(input.data_state.unwrap_or(DataState::AccountState))
        .name(args.asset_name)
        .uri(arts.asset_uri)
        .plugins(args.plugins)
```

### Invoking

Invoking is the term used to execute the CPI call to the other program. And programs version of "sending a transaction" if you may.

We have two options when it comes to invoking a CPI call. `invoke()` and `invoke_signed()`

#### invoke()

`invoke()` is used when no PDA signer seeds need to be passed through to the instruction being called for the transaction to succeed.
Though accounts that have signed into your original instruction will automatically pass signer validations into the cpi calls.

```rust
CreateV1CpiBuilder::new()
        .asset(context.accounts,asset)
        ...
        .invoke()

```

#### invoke_signed()

`invoke_signed()` is used when a PDA is one of the accounts that needs to be a signer in a cpi call. Lets say for example we had a program that took possession of our Asset and one of our programs PDA addresses became the other of it. In order to transfer it and change the owner to someone else that PDA will have sign transaction.

You'll need to pass in the original PDA seeds and bump so that the PDA can be recreated can sign the cpi call on your programs behalf.

```rust
let signers = &[&[b"escrow", ctx.accounts.asset.key(), &[ctx.bumps.pda_escrow]]]

CreateV1CpiBuilder::new()
        .asset(context.accounts.asset)
        ...
        .invoke_signed(signers)

```

### Full CpiBuilder Example

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
