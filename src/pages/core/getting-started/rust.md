---
title: Getting Started using Rust
metaTitle: Core - Getting Started - Rust
description: Get started with Core using Rust
---

## Resources

| Site          | Link                                                                   |
| ------------- | ---------------------------------------------------------------------- |
| crates.io     | [https://crates.io/crates/mpl-core](https://crates.io/crates/mpl-core) |
| rust autodocs | [https://docs.rs/mpl-core/](https://docs.rs/mpl-core/)                 |

## Installation
You can add the `mpl-core` crate to your Rust project by installing with `cargo`.

```shell
cargo add mpl-core
```

Alternatively you can paste the version of `mpl-core` crate you wish to use straight into your Cargo.toml file under `[dependencies]`.

```toml
mpl-core = "x.x.x"
```

## Local Scripts

For local scripts is recommended to use the `Builder` versions of all the instructions listed. These builders abstract a lot of the work for you and return a instruction that can be added to a transaction.

A list of all Core instructions can be found here: [Metaplex Core - Rust Instructions](https://docs.rs/mpl-core/0.7.0/mpl_core/instructions/index.html)

For a more comprehensive guide on using Rust check out the [Metaplex Rust SDKs Guide](/guides/rust/metaplex-rust-sdks) page.

### CreateV1Builder - Example

```rust
use mpl_core::instructions::CreateV1Builder;
use solana_client::rpc_client;
use solana_sdk::{signature::Keypair, signer::Signer, transaction::Transaction};

pub fn create_asset() {

let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

let keypair_path = ".../my-key.json"
    let keypair = solana_sdk::signature::read_keypair_file(keypair_path).unwrap();
    let asset = Keypair::new();

    let create_asset_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(keypair.pubkey())
        .name("My Asset".into())
        .uri("https://example.com/my-asset.json".into())
        .instruction();

    let signers = vec![&asset, &keypair];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_tx = Transaction::new_signed_with_payer(
        &[create_asset_ix],
        Some(&keypair.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client.send_and_confirm_transaction(&create_asset_tx).await.unwrap();

    println!("Signature: {:?}", res)

}
```

## CPI (Cross Program Invocation)

Performing CPI instructions from your own programs can be achieved easily by using the `CpiBuilder` version of an instruction function that can be found for all instructions.

A list of all Core instructions can be found here: [Metaplex Core - Rust Instructions](https://docs.rs/mpl-core/0.7.0/mpl_core/instructions/index.html)

For a more comprehensive guide using Metaplex Crates to create CPI instructions check out the [How to CPI into a Metaplex Program guide](/guides/rust/how-to-cpi-into-a-metaplex-program) page.

### CreateV1CpiBuilder - Example

```rust
CreateV1CpiBuilder::new()
        .asset(context.accounts.asset)
        .collection(context.accounts.collection)
        .authority(context.accounts.authority)
        .payer(context.accounts.payer)
        .owner(context.accounts.owner)
        .update_authority(context.accounts.update_authority)
        .system_program(context.acccounts.system_program)
        .data_state(input.data_state.unwrap_or(DataState::AccountState))
        .name(args.asset_name)
        .uri(args.asset_uri)
        .plugins(args.plugins)
        .invoke()
```




