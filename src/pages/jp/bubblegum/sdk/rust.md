---
title: MPL-Bubblegum Rust SDK
metaTitle: Rust SDK | MPL-Bubblegum
description: MPL-Bubblegum Rust SDKを実行するためのプロジェクト設定方法を学びます。
---

MetaplexはMPL-BubblegumプログラムとやりとりするためのRustライブラリを提供しています。Rustライブラリは、rustスクリプト/ビルドとCPI命令を介したオンチェーンプログラムの両方で使用できます。

## インストール

MPL-Bubblegum Rust SDKは、スクリプト/デスクトップ/モバイルアプリケーションとSolanaオンチェーンプログラムの両方で使用できます。

```rust
cargo add mpl-bubblegum
```

{% quick-links %}

{% quick-link title="crates.io" target="_blank" icon="Rust" href="https://crates.io/crates/mpl-bubblegum" description="MPL-Bubblegum Rustクレートで始めましょう。" /%}

{% quick-link title="docs.rs" target="_blank" icon="Rust" href="https://docs.rs/MPL-Bubblegum/latest/mpl_bubblegum/" description="MPL-BubblegumのRust SDK typedocプラットフォーム。" /%}

{% /quick-links %}

## ローカルスクリプト

ローカルスクリプトでは、リストされているすべての命令の`Builder`バージョンを使用することをお勧めします。これらのビルダーは多くの作業を抽象化し、トランザクションに追加できる命令を返します。

すべてのBubblegum命令のリストはここにあります：[MPL-Bubblegum - Rust Instructions](https://docs.rs/mpl-bubblegum/latest/mpl_bubblegum/instructions/index.html)

Rustの使用に関するより包括的なガイドについては、[Metaplex Rust SDKsガイド](/jp/guides/rust/metaplex-rust-sdks)ページをご覧ください。

#### CreateTreeConfigBuilder - 例

```rust
use mpl_bubblegum::{instructions::CreateTreeConfigBuilder, programs::{SPL_ACCOUNT_COMPRESSION_ID, SPL_NOOP_ID}};
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

## CPI（Cross Program Invocation）

独自のプログラムからCPI命令を実行することは、`MPL-Bubblegum` Rustクレートのすべての命令で見つけることができる命令関数の`CpiBuilder`バージョンを使用することで簡単に実現できます。

すべてのBubblegum命令のリストはここにあります：[Metaplex Bubblegum - Rust Instructions](https://docs.rs/mpl-bubblegum/latest/mpl_bubblegum/instructions/index.html)

Metaplexクレートを使用してCPI命令を作成するより包括的なガイドについては、[Metaplexプログラムへのcpi方法ガイド](/jp/guides/rust/how-to-cpi-into-a-metaplex-program)ページをご覧ください。

#### CreateTreeConfigCpiBuilder - 例

```rust
CreateTreeConfigCpiBuilder::new()
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