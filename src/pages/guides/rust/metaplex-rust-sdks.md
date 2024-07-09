---
title: Metaplex Rust SDKs
metaTitle: Metaplex Rust SDKss
description: A quick overview on Metaplex Rust SDKs.
---

## Introduction

Metaplex provides Rust SDK's for most of our programs which have consistant and predictable outputs and functionality leading to improved intergration times for developers working with our products.

### Modules

The Core Rust SDKs our organized into several modules:

- `accounts`: represents the program's accounts.
- `errors`: enumerates the program's errors.
- `instructions`: facilitates the creation of instructions, instruction arguments, and CPI instructions.
- `types`: represents types used by the program.

### Instructions

Furthermore each instruction comes with multiple versions depending on your needed use case which can strip away a lot of the boilerplate that comes with sending or cpi'ing instructions.

```
CreateV1
CreateV1Builder
CreateV1Cpi
CreateV1CpiAccounts
CreateV1CpiBuilder
CreateV1InstructionArgs
CreateV1InstructionData
```

#### Instruction


#### Builder


#### CPI Builder


## Using Metaplex Rust Instruction Builders

Each instruction that comes from a Metaplex Rust crate will also currently come with a `Builder` version of that instruction which you can import. This abstracts a massive amount code for you and will return you an instruction that's ready to send.

Lets take the `CreateV1` instruction from Core as an example (this applies to all other instructions from this Crate and all other Metaplex crates too).

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

## Full Builder Example

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
