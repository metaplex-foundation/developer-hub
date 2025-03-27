---
title: MPL-Bubblegum Rust SDK
metaTitle: Rust SDK | MPL-Bubblegum
description: Learn how to set up your project to run the MPL-Bubblegum Rust SDK.
---

Metaplex provides a Rust library that can be used to interact with the MPL-Bubblegum program. The Rust library can be used in rust scripts/builds as well as onchain programs via CPI instructions.

## Installation

The MPL-Bubblegum Rust SDK can be used in both scripts/desktop/mobile applications as well as with Solana onchain programs.

```rust
cargo add mpl-bubblegum
```

{% quick-links %}

{% quick-link title="crates.io" target="_blank" icon="Rust" href="https://crates.io/crates/mpl-bubblegum" description="Get started with our MPL-Bubblegum Rust crate." /%}

{% quick-link title="docs.rs" target="_blank" icon="Rust" href="https://docs.rs/MPL-Bubblegum/latest/mpl_bubblegum/" description="The Rust SDK typedoc platform for MPL-Bubblegum." /%}

{% /quick-links %}

## Local Scripts

For local scripts is recommended to use the `Builder` versions of all the instructions listed. These builders abstract a lot of the work for you and return a instruction that can be added to a transaction.

A list of all Bubblegum instructions can be found here: [MPL-Bubblegum - Rust Instructions](https://docs.rs/mpl-bubblegum/latest/mpl_bubblegum/instructions/index.html)

For a more comprehensive guide on using Rust check out the [Metaplex Rust SDKs Guide](/guides/rust/metaplex-rust-sdks) page.

#### CreateTreeConfigBuilder - Example

```rust
use mpl_bubblegum::{instructions::CreateTreeConfigBuilder, programs::{SPL_ACCOUNT_COMPRESSION_ID, SPL_NOOP_ID}};
use solana_client::{nonblocking::rpc_client, rpc_config::RpcSendTransactionConfig};
use solana_sdk::{commitment_config::CommitmentConfig, pubkey::Pubkey, signature::Keypair, signer::Signer, system_program, transaction::Transaction};

#[tokio::main]
pub async fn create_tree(keypair: Keypair) {
    let rpc_client = rpc_client::RpcClient::new("https://devnet.helius-rpc.com/?api-key=555f20ad-afaf-4a78-a889-244f281ab399".to_string());

    let payer = keypair;
        

    let asset = Keypair::new();

    let merkle_tree = Keypair::new();

    let tree_config = Pubkey::find_program_address(
        &[
            &merkle_tree.pubkey().to_bytes(),
        ],
        &mpl_bubblegum::ID,
    );

    let create_tree_config_ix = CreateTreeConfigBuilder::new()
        .merkle_tree(merkle_tree.pubkey())
        .tree_config(tree_config.0)
        .payer(payer.pubkey())
        .log_wrapper(SPL_NOOP_ID)
        .compression_program(SPL_ACCOUNT_COMPRESSION_ID)
        .system_program(system_program::ID)
        .max_depth(20)
        .max_buffer_size(1024)
        .public(false)
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await;

    let create_tree_config_tx = Transaction::new_signed_with_payer(
        &[create_tree_config_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash.unwrap(),
    );

    let res = rpc_client
        .send_transaction_with_config(&create_tree_config_tx, RpcSendTransactionConfig {
            skip_preflight: false,
            preflight_commitment: Some(CommitmentConfig::confirmed().commitment),
            encoding: None,
            max_retries: None,
            min_context_slot: None,
        })
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

## CPI (Cross Program Invocation)

Performing CPI instructions from your own programs can be achieved easily by using the `CpiBuilder` version of an instruction function that can be found for all instructions in the `MPL-Bubblegum` Rust crate.

A list of all Bubblegum instructions can be found here: [Metaplex Bubblegum - Rust Instructions](https://docs.rs/mpl-bubblegum/latest/mpl_bubblegum/instructions/index.html)

For a more comprehensive guide using Metaplex crates to create CPI instructions check out the [How to CPI into a Metaplex Program guide](/guides/rust/how-to-cpi-into-a-metaplex-program) page.

#### CreateTreeConfigCpiBuilder - Example

```rust
CreateTreeConfigCpiBuilder::new()
        .merkle_tree(context.accounts.merkle_tree)
        .tree_config(context.accounts.tree_config)
        .payer(context.accounts.payer)
        .tree_creator(context.accounts.tree_creator)
        .log_wrapper(SPL_NOOP_ID)
        .compression_program(context.accounts.compression_program)
        .system_program(context.acccounts.system_program)
        .max_depth(20)
        .max_bufferisz(1024)
        .public(false)
        .invoke()
```