---
title: MPL-Core Rust SDK
metaTitle: Rust SDK | MPL-Core
description: MPL-Core Rust SDK를 실행하기 위한 프로젝트 설정 방법을 배웁니다.
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
Metaplex는 MPL-Core 프로그램과 상호 작용하는 데 사용할 수 있는 Rust 라이브러리를 제공합니다. Rust 라이브러리는 rust 스크립트/빌드뿐만 아니라 CPI 명령을 통한 온체인 프로그램에서도 사용할 수 있습니다.

## 설치

MPL-Core Rust SDK는 스크립트/데스크톱/모바일 애플리케이션과 Solana 온체인 프로그램 모두에서 사용할 수 있습니다.

```rust
cargo add mpl-core
```

{% quick-links %}
{% quick-link title="crates.io" target="_blank" icon="Rust" href="<https://crates.io/crates/mpl-core>" description="Umi 프레임워크 기반 JavaScript 라이브러리로 시작하세요." /%}
{% quick-link title="docs.rs" target="_blank" icon="Rust" href="<https://docs.rs/mpl-core/latest/mpl_core/>" description="Rust SDK typedoc 플랫폼." /%}
{% /quick-links %}

## 로컬 스크립트

로컬 스크립트의 경우 나열된 모든 명령의 `Builder` 버전을 사용하는 것이 좋습니다. 이러한 빌더는 많은 작업을 추상화하고 트랜잭션에 추가할 수 있는 명령을 반환합니다.
모든 Core 명령 목록은 여기에서 찾을 수 있습니다: [Metaplex Core - Rust Instructions](https://docs.rs/mpl-core/latest/mpl_core/instructions/index.html)
Rust 사용에 대한 보다 포괄적인 가이드는 [Metaplex Rust SDK 가이드](/guides/rust/metaplex-rust-sdks) 페이지를 확인하세요.

#### CreateV1Builder - 예제

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

자신의 프로그램에서 CPI 명령을 수행하는 것은 `mpl-core` Rust crate의 모든 명령에서 찾을 수 있는 명령 함수의 `CpiBuilder` 버전을 사용하여 쉽게 달성할 수 있습니다.
모든 Core 명령 목록은 여기에서 찾을 수 있습니다: [Metaplex Core - Rust Instructions](https://docs.rs/mpl-core/latest/mpl_core/instructions/index.html)
Metaplex crate를 사용하여 CPI 명령을 생성하는 보다 포괄적인 가이드는 [Metaplex 프로그램에 CPI하는 방법 가이드](/guides/rust/how-to-cpi-into-a-metaplex-program) 페이지를 확인하세요.

#### CreateV1CpiBuilder - 예제

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
