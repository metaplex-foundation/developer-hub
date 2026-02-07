---
title: MPL-Core Rust SDK
metaTitle: Rust SDK | MPL-Core
description: MPL-Core Rust SDKを実行するためのプロジェクトのセットアップ方法を学びます。
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
Metaplexは、MPL-Coreプログラムと対話するために使用できるRustライブラリを提供しています。RustライブラリはRustスクリプト/ビルドだけでなく、CPI命令を介したオンチェーンプログラムでも使用できます。
## インストール
MPL-Core Rust SDKは、スクリプト/デスクトップ/モバイルアプリケーションおよびSolanaオンチェーンプログラムの両方で使用できます。
```rust
cargo add mpl-core
```
{% quick-links %}
{% quick-link title="crates.io" target="_blank" icon="Rust" href="https://crates.io/crates/mpl-core" description="Umiフレームワークに基づいたJavaScriptライブラリを始める" /%}
{% quick-link title="docs.rs" target="_blank" icon="Rust" href="https://docs.rs/mpl-core/latest/mpl_core/" description="Rust SDK typedocプラットフォーム" /%}
{% /quick-links %}
## ローカルスクリプト
ローカルスクリプトでは、リストされたすべての命令の`Builder`バージョンを使用することをお勧めします。これらのビルダーは多くの作業を抽象化し、トランザクションに追加できる命令を返します。
すべてのCore命令のリストはこちらにあります：[Metaplex Core - Rust Instructions](https://docs.rs/mpl-core/latest/mpl_core/instructions/index.html)
Rustの使用に関するより包括的なガイドについては、[Metaplex Rust SDKsガイド](/guides/rust/metaplex-rust-sdks)ページをご覧ください。
#### CreateV1Builder - 例
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
## CPI（Cross Program Invocation）
自分のプログラムからCPI命令を実行するには、`mpl-core` Rustクレートのすべての命令に見つかる命令関数の`CpiBuilder`バージョンを使用することで簡単に実現できます。
すべてのCore命令のリストはこちらにあります：[Metaplex Core - Rust Instructions](https://docs.rs/mpl-core/latest/mpl_core/instructions/index.html)
MetaplexクレートをCPI命令の作成に使用する方法についてのより包括的なガイドは、[How to CPI into a Metaplex Programガイド](/guides/rust/how-to-cpi-into-a-metaplex-program)ページをご覧ください。
#### CreateV1CpiBuilder - 例
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
