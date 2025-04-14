---
titwe: MPW-Bubbwegum Wust SDK
metaTitwe: Wust SDK | MPW-Bubbwegum
descwiption: Weawn how to set up youw pwoject to wun de MPW-Bubbwegum Wust SDK.
---

Metapwex pwovides a Wust wibwawy dat can be used to intewact wid de MPW-Bubbwegum pwogwam~ De Wust wibwawy can be used in wust scwipts/buiwds as weww as onchain pwogwams via CPI instwuctions.

## Instawwation

De MPW-Bubbwegum Wust SDK can be used in bod scwipts/desktop/mobiwe appwications as weww as wid Sowanya onchain pwogwams.

```rust
cargo add mpl-bubblegum
```

{% quick-winks %}

{% quick-wink titwe="cwates.io" tawget="_bwank" icon="Wust" hwef="https://cwates.io/cwates/mpw-bubbwegum" descwiption="Get stawted wid ouw MPW-Bubbwegum Wust cwate." /%}

{% quick-wink titwe="docs.ws" tawget="_bwank" icon="Wust" hwef="https://docs.ws/MPW-Bubbwegum/watest/mpw_bubbwegum/" descwiption="De Wust SDK typedoc pwatfowm fow MPW-Bubbwegum." /%}

{% /quick-winks %}

## Wocaw Scwipts

Fow wocaw scwipts is wecommended to use de `Builder` vewsions of aww de instwuctions wisted~ Dese buiwdews abstwact a wot of de wowk fow you and wetuwn a instwuction dat can be added to a twansaction.

A wist of aww Bubbwegum instwuctions can be found hewe: [MPL-Bubblegum - Rust Instructions](https://docs.rs/mpl-bubblegum/latest/mpl_bubblegum/instructions/index.html)

Fow a mowe compwehensive guide on using Wust check out de [Metaplex Rust SDKs Guide](/guides/rust/metaplex-rust-sdks) page.

#### CweateTweeConfigBuiwdew - Exampwe

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

## CPI (Cwoss Pwogwam Invocation)

Pewfowming CPI instwuctions fwom youw own pwogwams can be achieved easiwy by using de `CpiBuilder` vewsion of an instwuction function dat can be found fow aww instwuctions in de `MPL-Bubblegum` Wust cwate.

A wist of aww Bubbwegum instwuctions can be found hewe: [Metaplex Bubblegum - Rust Instructions](https://docs.rs/mpl-bubblegum/latest/mpl_bubblegum/instructions/index.html)

Fow a mowe compwehensive guide using Metapwex cwates to cweate CPI instwuctions check out de [How to CPI into a Metaplex Program guide](/guides/rust/how-to-cpi-into-a-metaplex-program) page.

#### CweateTweeConfigCpiBuiwdew - Exampwe

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