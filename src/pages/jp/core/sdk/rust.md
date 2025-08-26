---
title: MPL-Core Rust SDK
metaTitle: Rust SDK | MPL-Core
description: MPL-Core Rust SDKを実行するためのプロジェクトのセットアップ方法を学びます。
---

MetaplexはMPL-Coreプログラムとやり取りするために使用できるRustライブラリを提供しています。RustライブラリはRustスクリプト/ビルドおよびCPIインストラクションを介したオンチェーンプログラムで使用できます。

## インストール

MPL-Core Rust SDKはスクリプト/デスクトップ/モバイルアプリケーションおよびSolanaオンチェーンプログラムの両方で使用できます。

```rust
cargo add mpl-core
```

{% quick-links %}

{% quick-link title="crates.io" target="_blank" icon="Rust" href="https://crates.io/crates/mpl-core" description="Umiフレームワークに基づくJavaScriptライブラリをはじめましょう。" /%}

{% quick-link title="docs.rs" target="_blank" icon="Rust" href="https://docs.rs/mpl-core/latest/mpl_core/" description="Rust SDK typedocプラットフォーム。" /%}

{% /quick-links %}

## ローカルスクリプト

ローカルスクリプトでは、リストされているすべてのインストラクションの`Builder`バージョンを使用することが推奨されます。これらのビルダーは多くの作業を抽象化し、トランザクションに追加できるインストラクションを返します。

すべてのCoreインストラクションのリストはこちらで見つけることができます：[Metaplex Core - Rust Instructions](https://docs.rs/mpl-core/latest/mpl_core/instructions/index.html)

Rustの使用に関するより包括的なガイドについては、[Metaplex Rust SDKsガイド](/jp/guides/rust/metaplex-rust-sdks)ページをチェックしてください。

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

## CPI（クロスプログラム呼び出し）

独自のプログラムからCPIインストラクションを実行することは、`mpl-core` Rustクレート内のすべてのインストラクションで見つけることができるインストラクション関数の`CpiBuilder`バージョンを使用することで簡単に実現できます。

すべてのCoreインストラクションのリストはこちらで見つけることができます：[Metaplex Core - Rust Instructions](https://docs.rs/mpl-core/latest/mpl_core/instructions/index.html)

MetaplexクレートをしてCPIインストラクションを作成するための包括的なガイドについては、[Metaplexプログラムへのライブラリ](/jp/guides/rust/how-to-cpi-into-a-metaplex-program)ページをチェックしてください。

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