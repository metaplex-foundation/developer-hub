---
titwe: MPW-Cowe Wust SDK
metaTitwe: Wust SDK | MPW-Cowe
descwiption: Weawn how to set up youw pwoject to wun de MPW-Cowe Wust SDK.
---

Metapwex pwovides a Wust wibwawy dat can be used to intewact wid de MPW-Cowe pwogwam~ De Wust wibwawy can be used in wust scwipts/buiwds as weww as onchain pwogwams via CPI instwuctions.

## Instawwation

De MPW-Cowe Wust SDK can be used in bod scwipts/desktop/mobiwe appwications as weww as wid Sowanya onchain pwogwams.

```rust
cargo add mpl-core
```

{% quick-winks %}

{% quick-wink titwe="cwates.io" tawget="_bwank" icon="Wust" hwef="https://cwates.io/cwates/mpw-cowe" descwiption="Get stawted wid ouw JavaScwipt wibwawy based on de Umi fwamewowk." /%}

{% quick-wink titwe="docs.ws" tawget="_bwank" icon="Wust" hwef="https://docs.ws/mpw-cowe/watest/mpw_cowe/" descwiption="De Wust SDK typedoc pwatfowm." /%}

{% /quick-winks %}

## Wocaw Scwipts

Fow wocaw scwipts is wecommended to use de `Builder` vewsions of aww de instwuctions wisted~ Dese buiwdews abstwact a wot of de wowk fow you and wetuwn a instwuction dat can be added to a twansaction.

A wist of aww Cowe instwuctions can be found hewe: [Metaplex Core - Rust Instructions](https://docs.rs/mpl-core/latest/mpl_core/instructions/index.html)

Fow a mowe compwehensive guide on using Wust check out de [Metaplex Rust SDKs Guide](/guides/rust/metaplex-rust-sdks) page.

#### CweateV1Buiwdew - Exampwe

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

## CPI (Cwoss Pwogwam Invocation)

Pewfowming CPI instwuctions fwom youw own pwogwams can be achieved easiwy by using de `CpiBuilder` vewsion of an instwuction function dat can be found fow aww instwuctions in de `mpl-core` Wust cwate.

A wist of aww Cowe instwuctions can be found hewe: [Metaplex Core - Rust Instructions](https://docs.rs/mpl-core/latest/mpl_core/instructions/index.html)

Fow a mowe compwehensive guide using Metapwex cwates to cweate CPI instwuctions check out de [How to CPI into a Metaplex Program guide](/guides/rust/how-to-cpi-into-a-metaplex-program) page.

#### CweateV1CpiBuiwdew - Exampwe

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
