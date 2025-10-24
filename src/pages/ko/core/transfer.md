---
title: Assets 전송하기
metaTitle: Assets 전송하기 | Core
description: Metaplex 패키지를 사용하여 지갑 간 Core NFT Assets을 전송하는 방법을 알아보세요.
---

Core Asset의 소유자는 MPL Core 프로그램에 `transfer` 명령어를 사용하여 다른 계정으로 소유권을 전송할 수 있습니다.

{% totem %}
{% totem-accordion title="기술적 명령어 세부사항" %}
**명령어 계정 목록**

| 계정          | 설명                                          |
| ------------- | --------------------------------------------- |
| asset         | MPL Core Asset의 주소.                        |
| collection    | Core Asset이 속한 컬렉션.                      |
| authority     | 자산의 소유자 또는 위임자.                     |
| payer         | 저장 수수료를 지불하는 계정.                   |
| newOwner      | 자산을 전송받을 새 소유자.                     |
| systemProgram | System Program 계정.                          |
| logWrapper    | SPL Noop Program.                             |

일부 계정은 사용 편의성을 위해 SDK에서 추상화되거나 선택적일 수 있습니다.
온체인 명령어에 대한 자세한 내용은 [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L139)에서 확인할 수 있습니다.
{% /totem-accordion %}
{% /totem %}

## Core Asset 전송하기

{% dialect-switcher title="Asset 전송하기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { transferV1 } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')

await transferV1(umi, {
  asset: asset,
  newOwner: newOwner.publicKey,
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```ts
use mpl_core::instructions::TransferV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn transfer_asset() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let new_owner = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let transfer_asset_ix = TransferV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .new_owner(new_owner)
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let transfer_asset_tx = Transaction::new_signed_with_payer(
        &[transfer_asset_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&transfer_asset_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## 컬렉션에 있는 Core Asset 전송하기

컬렉션이 있는 Asset을 전송하는 경우 컬렉션 주소를 전달해야 합니다.
[자산이 컬렉션에 있는지 어떻게 알 수 있나요?]()

{% dialect-switcher title="컬렉션의 일부인 Asset 전송하기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { transferV1 } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')

await transferV1(umi, {
  asset: asset.publicKey,
  newOwner: newOwner.publicKey,
  collection: colleciton.publicKey,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::instructions::TransferV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn transfer_asset_in_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let collection = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let new_owner = Pubkey::from_str("33333333333333333333333333333333").unwrap();

    let transfer_asset_in_collection_ix = TransferV1Builder::new()
        .asset(asset)
        .collection(Some(collection))
        .payer(authority.pubkey())
        .new_owner(new_owner)
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let transfer_asset_in_collection_tx = Transaction::new_signed_with_payer(
        &[transfer_asset_in_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&transfer_asset_in_collection_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /dialect %}
{% /dialect-switcher %}

## Asset의 전송 위임자인 경우는 어떻게 하나요?

[전송 위임자](/core/plugins/transfer-delegate) 플러그인을 통해 Asset의 전송 위임자라면, Asset의 소유자인 것처럼 `transferV1` 함수를 호출할 수 있습니다.