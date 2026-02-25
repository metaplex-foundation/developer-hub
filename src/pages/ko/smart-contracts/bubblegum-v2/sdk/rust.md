---
title: MPL-Bubblegum V2 Rust SDK
metaTitle: Rust SDK - MPL-Bubblegum V2
description: MPL-Bubblegum Rust SDK를 실행하도록 프로젝트를 설정하는 방법을 알아보세요.
created: '01-15-2025'
updated: '02-24-2026'
keywords:
  - Rust SDK
  - MPL-Bubblegum Rust
  - Cargo
  - Solana program
  - CPI
  - instruction builder
about:
  - Compressed NFTs
  - Rust SDK
  - Solana programs
proficiencyLevel: Beginner
programmingLanguage:
  - Rust
---

## Summary

The **MPL-Bubblegum V2 Rust SDK** provides instruction builders for local scripts and CPI builders for on-chain programs interacting with compressed NFTs.

- Install via Cargo: `cargo add mpl-bubblegum`
- Use `Builder` types for local scripts and `CpiBuilder` types for on-chain CPI
- Full instruction reference available on docs.rs

Metaplex provides a Rust library that can be used to interact with the MPL-Bubblegum program. The Rust library can be used in Rust scripts/builds as well as onchain programs via CPI instructions.


Metaplex는 MPL-Bubblegum 프로그램과 상호 작용하는 데 사용할 수 있는 Rust 라이브러리를 제공합니다. Rust 라이브러리는 CPI 명령어를 통해 Rust 스크립트/빌드와 온체인 프로그램에서 사용할 수 있습니다.

## 설치

MPL-Bubblegum Rust SDK는 스크립트/데스크톱/모바일 애플리케이션과 Solana 온체인 프로그램 모두에서 사용할 수 있습니다.

```rust
cargo add mpl-bubblegum
```

{% quick-links %}

{% quick-link title="crates.io" target="_blank" icon="Rust" href="https://crates.io/crates/mpl-bubblegum" description="MPL-Bubblegum Rust 크레이트로 시작하세요." /%}

{% quick-link title="docs.rs" target="_blank" icon="Rust" href="https://docs.rs/MPL-Bubblegum/latest/mpl_bubblegum/" description="MPL-Bubblegum용 Rust SDK typedoc 플랫폼." /%}

{% /quick-links %}

## 로컬 스크립트

로컬 스크립트의 경우 나열된 모든 명령어의 `Builder` 버전을 사용하는 것을 권장합니다. 이러한 빌더는 많은 작업을 추상화하고 트랜잭션에 추가할 수 있는 명령어를 반환합니다.

모든 Bubblegum 명령어 목록은 여기에서 찾을 수 있습니다: [MPL-Bubblegum - Rust Instructions](https://docs.rs/mpl-bubblegum/latest/mpl_bubblegum/instructions/index.html)

Rust 사용에 대한 더 포괄적인 가이드는 [Metaplex Rust SDK 가이드](/ko/guides/rust/metaplex-rust-sdks) 페이지를 확인하세요.

#### CreateTreeConfigBuilder - 예제

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

## CPI (Cross Program Invocation)

자체 프로그램에서 CPI 명령어를 수행하는 것은 `MPL-Bubblegum` Rust 크레이트의 모든 명령어에서 찾을 수 있는 명령어 함수의 `CpiBuilder` 버전을 사용하여 쉽게 달성할 수 있습니다.

모든 Bubblegum 명령어 목록은 여기에서 찾을 수 있습니다: [Metaplex Bubblegum - Rust Instructions](https://docs.rs/mpl-bubblegum/latest/mpl_bubblegum/instructions/index.html)

Metaplex 크레이트를 사용하여 CPI 명령어를 생성하는 더 포괄적인 가이드는 [Metaplex 프로그램에 CPI하는 방법 가이드](/ko/guides/rust/how-to-cpi-into-a-metaplex-program) 페이지를 확인하세요.

#### CreateTreeConfigCpiBuilder - 예제

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
