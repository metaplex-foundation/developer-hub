---
title: MPL-Core Rust SDK
metaTitle: Rust SDK | MPL-Core
description: 学习如何设置您的项目以运行MPL-Core Rust SDK。
updated: '01-31-2026'
keywords:
  - mpl-core Rust
  - Core Rust SDK
  - Solana Rust NFT
  - NFT Rust crate
about:
  - Rust SDK
  - CPI integration
  - On-chain programs
proficiencyLevel: Intermediate
programmingLanguage:
  - Rust
---
Metaplex提供了一个Rust库，可用于与MPL-Core程序交互。Rust库可用于Rust脚本/构建以及通过CPI指令的链上程序。
## 安装
MPL-Core Rust SDK可用于脚本/桌面/移动应用程序以及Solana链上程序。
```rust
cargo add mpl-core
```
{% quick-links %}
{% quick-link title="crates.io" target="_blank" icon="Rust" href="https://crates.io/crates/mpl-core" description="使用基于Umi框架的JavaScript库开始使用。" /%}
{% quick-link title="docs.rs" target="_blank" icon="Rust" href="https://docs.rs/mpl-core/latest/mpl_core/" description="Rust SDK typedoc平台。" /%}
{% /quick-links %}
## 本地脚本
对于本地脚本，建议使用所有列出指令的`Builder`版本。这些构建器为您抽象了大量工作，并返回可以添加到交易中的指令。
所有Core指令的列表可以在这里找到：[Metaplex Core - Rust Instructions](https://docs.rs/mpl-core/latest/mpl_core/instructions/index.html)
有关使用Rust的更全面指南，请查看[Metaplex Rust SDK指南](/guides/rust/metaplex-rust-sdks)页面。
#### CreateV1Builder - 示例
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
## CPI（跨程序调用）
从您自己的程序执行CPI指令可以通过使用`mpl-core` Rust crate中所有指令都提供的`CpiBuilder`版本轻松实现。
所有Core指令的列表可以在这里找到：[Metaplex Core - Rust Instructions](https://docs.rs/mpl-core/latest/mpl_core/instructions/index.html)
有关使用Metaplex crate创建CPI指令的更全面指南，请查看[如何CPI到Metaplex程序指南](/guides/rust/how-to-cpi-into-a-metaplex-program)页面。
#### CreateV1CpiBuilder - 示例
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
