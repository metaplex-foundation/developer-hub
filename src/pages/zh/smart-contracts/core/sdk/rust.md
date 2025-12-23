---
title: MPL-Core Rust SDK
metaTitle: Rust SDK | MPL-Core
description: 了解如何设置您的项目以运行 MPL-Core Rust SDK。
---

Metaplex 提供了一个可用于与 MPL-Core 程序交互的 Rust 库。Rust 库可以在 rust 脚本/构建以及通过 CPI 指令在链上程序中使用。

## 安装

MPL-Core Rust SDK 可以在脚本/桌面/移动应用程序以及 Solana 链上程序中使用。

```rust
cargo add mpl-core
```

{% quick-links %}

{% quick-link title="crates.io" target="_blank" icon="Rust" href="https://crates.io/crates/mpl-core" description="开始使用我们基于 Umi 框架的 JavaScript 库。" /%}

{% quick-link title="docs.rs" target="_blank" icon="Rust" href="https://docs.rs/mpl-core/latest/mpl_core/" description="Rust SDK typedoc 平台。" /%}

{% /quick-links %}

## 本地脚本

对于本地脚本，建议使用所有列出指令的 `Builder` 版本。这些构建器为您抽象了很多工作，并返回可以添加到交易中的指令。

所有 Core 指令的列表可以在这里找到：[Metaplex Core - Rust 指令](https://docs.rs/mpl-core/latest/mpl_core/instructions/index.html)

有关使用 Rust 的更全面指南，请查看 [Metaplex Rust SDKs 指南](/zh/guides/rust/metaplex-rust-sdks)页面。

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

从您自己的程序执行 CPI 指令可以通过使用指令函数的 `CpiBuilder` 版本轻松实现，这可以在 `mpl-core` Rust crate 中的所有指令中找到。

所有 Core 指令的列表可以在这里找到：[Metaplex Core - Rust 指令](https://docs.rs/mpl-core/latest/mpl_core/instructions/index.html)

有关使用 Metaplex crates 创建 CPI 指令的更全面指南，请查看[如何 CPI 到 Metaplex 程序指南](/zh/guides/rust/how-to-cpi-into-a-metaplex-program)页面。

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
