---
title: MPL-Bubblegum V2 Rust SDK
metaTitle: Rust SDK | MPL-Bubblegum V2
description: 了解如何设置您的项目以运行MPL-Bubblegum V2 Rust SDK。
---

Metaplex提供了一个Rust库，可用于与MPL-Bubblegum程序交互。Rust库可用于Rust脚本/构建以及通过CPI指令的链上程序。

## 安装

MPL-Bubblegum Rust SDK可用于脚本/桌面/移动应用程序以及Solana链上程序。

```rust
cargo add mpl-bubblegum
```

{% quick-links %}

{% quick-link title="crates.io" target="_blank" icon="Rust" href="<https://crates.io/crates/mpl-bubblegum>" description="开始使用我们的MPL-Bubblegum Rust crate。" /%}

{% quick-link title="docs.rs" target="_blank" icon="Rust" href="<https://docs.rs/MPL-Bubblegum/latest/mpl_bubblegum/>" description="MPL-Bubblegum的Rust SDK typedoc平台。" /%}

{% /quick-links %}

## 本地脚本

对于本地脚本，我们建议使用列出的所有指令的`Builder`版本。这些构建器为您抽象了大量工作，并返回可添加到交易的指令。

所有Bubblegum指令的列表可在此处找到：[MPL-Bubblegum - Rust指令](https://docs.rs/mpl-bubblegum/latest/mpl_bubblegum/instructions/index.html)

有关使用Rust的更全面指南，请查看[Metaplex Rust SDK指南](/zh/guides/rust/metaplex-rust-sdks)页面。

#### CreateTreeConfigBuilder - 示例

```rust
use mpl_bubblegum::{instructions::CreateTreeConfigV2Builder, programs::{SPL_ACCOUNT_COMPRESSION_ID, SPL_NOOP_ID}};
use solana_client::{nonblocking::rpc_client, rpc_config::RpcSendTransactionConfig};
use solana_sdk::{commitment_config::CommitmentConfig, pubkey::Pubkey, signature::Keypair, signer::Signer, system_program, transaction::Transaction};

#[tokio::main]
pub async fn create_tree(keypair: Keypair) {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com/".to_string());

    let payer = keypair;


    let asset = Keypair::new();

    let merkle_tree = Keypair::new();

    let tree_config = Pubkey::find_program_address(
        &[
            &merkle_tree.pubkey().to_bytes(),
        ],
        &mpl_bubblegum::ID,
    );

    let create_tree_config_ix = CreateTreeConfigV2Builder::new()
        .merkle_tree(merkle_tree.pubkey())
        .tree_config(tree_config.0)
        .payer(payer.pubkey())
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

    println!("Signature: {:?}", res);
}
```

## CPI（跨程序调用）

从您自己的程序执行CPI指令可以通过使用`MPL-Bubblegum` Rust crate中所有指令可用的指令函数的`CpiBuilder`版本轻松实现。

所有Bubblegum指令的列表可在此处找到：[Metaplex Bubblegum - Rust指令](https://docs.rs/mpl-bubblegum/latest/mpl_bubblegum/instructions/index.html)

有关使用Metaplex crate创建CPI指令的更全面指南，请查看[如何CPI到Metaplex程序指南](/zh/guides/rust/how-to-cpi-into-a-metaplex-program)页面。

#### CreateTreeConfigCpiBuilder - 示例

```rust
CreateTreeConfigV2CpiBuilder::new()
        .merkle_tree(context.accounts.merkle_tree)
        .tree_config(context.accounts.tree_config)
        .payer(context.accounts.payer)
        .tree_creator(context.accounts.tree_creator)
        .log_wrapper(SPL_NOOP_ID)
        .compression_program(context.accounts.compression_program)
        .system_program(context.accounts.system_program)
        .max_depth(20)
        .max_buffer_size(1024)
        .public(false)
        .invoke()
```
