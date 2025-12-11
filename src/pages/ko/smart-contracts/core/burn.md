---
title: 자산 소각하기
metaTitle: 자산 소각하기 | Core
description: Metaplex Core 패키지를 사용하여 Core NFT 자산을 소각하는 방법을 알아보세요.
---

자산은 `burn` 명령어를 사용하여 소각할 수 있습니다. 이렇게 하면 렌트 면제 수수료가 소유자에게 반환됩니다. 계정이 다시 열리는 것을 방지하기 위해 매우 적은 양의 SOL(0.00089784)만 계정에 남게 됩니다.

{% totem %}
{% totem-accordion title="기술적 명령어 세부사항" %}
**명령어 계정 목록**

| 계정          | 설명                                   |
| ------------- | -------------------------------------- |
| asset         | MPL Core 자산의 주소.                  |
| collection    | Core 자산이 속한 컬렉션.               |
| payer         | 저장 수수료를 지불하는 계정.           |
| authority     | 자산의 소유자 또는 위임자.             |
| systemProgram | 시스템 프로그램 계정.                  |
| logWrapper    | SPL Noop 프로그램.                     |

일부 계정은 사용 편의성을 위해 SDK에서 추상화되거나 선택적일 수 있습니다.
온체인 명령어의 자세한 내용은 [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L123)에서 확인할 수 있습니다.
{% /totem-accordion %}
{% /totem %}

## 코드 예제

다음은 SDK를 사용하여 Core 자산을 소각하는 방법입니다. 이 스니펫은 당신이 자산의 소유자라고 가정합니다.

{% dialect-switcher title="자산 소각하기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  burn,
  fetchAsset,
  collectionAddress,
  fetchCollection,
} from '@metaplex-foundation/mpl-core'

const assetId = publicKey('11111111111111111111111111111111')
const asset = await fetchAsset(umi, assetId)

await burn(umi, {
  asset: asset,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::instructions::BurnV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn burn_asset() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let burn_asset_ix = BurnV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let burn_asset_tx = Transaction::new_signed_with_payer(
        &[burn_asset_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&burn_asset_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## 컬렉션의 일부인 자산 소각하기

다음은 컬렉션의 일부인 Core 자산을 소각하는 방법입니다. 이 스니펫은 당신이 자산의 소유자라고 가정합니다.

{% dialect-switcher title="컬렉션의 일부인 자산 소각하기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { burnV1, fetchAsset } from '@metaplex-foundation/mpl-core'

import { publicKey } from '@metaplex-foundation/umi'
import {
  burn,
  fetchAsset,
  collectionAddress,
  fetchCollection,
} from '@metaplex-foundation/mpl-core'

const assetId = publicKey('11111111111111111111111111111111')
const asset = await fetchAsset(umi, assetId)

const collectionId = collectionAddress(asset)

let collection = undefined

if (collectionId) {
  collection = await fetchCollection(umi, collection)
}

await burn(umi, {
  asset: asset,
  collection: collection,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::instructions::BurnV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn burn_asset_in_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let collection = Pubkey::from_str("2222222222222222222222222222222").unwrap();

    let burn_asset_in_collection_ix = BurnV1Builder::new()
        .asset(asset)
        .collection(Some(collection))
        .payer(authority.pubkey())
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let burn_asset_in_collection_tx = Transaction::new_signed_with_payer(
        &[burn_asset_in_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&burn_asset_in_collection_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}