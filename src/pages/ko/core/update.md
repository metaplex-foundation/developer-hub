---
title: Assets 업데이트하기
metaTitle: Assets 업데이트하기 | Core
description: Metaplex 패키지를 사용하여 Core NFT Assets을 업데이트하는 방법을 알아보세요.
---

Core Asset의 업데이트 권한자 또는 위임자는 Asset의 일부 데이터를 변경할 수 있는 능력을 가집니다.

{% totem %}
{% totem-accordion title="기술적 명령어 세부사항" %}

**명령어 계정 목록**

| 계정               | 설명                                          |
| ------------------ | --------------------------------------------- |
| asset              | MPL Core Asset의 주소.                        |
| collection         | Core Asset이 속한 컬렉션.                      |
| payer              | 저장 수수료를 지불하는 계정.                   |
| authority          | 자산의 소유자 또는 위임자.                     |
| newUpdateAuthority | 자산의 새로운 업데이트 권한자.                 |
| systemProgram      | System Program 계정.                          |
| logWrapper         | SPL Noop Program.                             |

**명령어 인수**

| 인수    | 설명                           |
| ------- | ------------------------------ |
| newName | Core Asset의 새 이름.           |
| newUri  | 새 오프체인 메타데이터 URI.     |

일부 계정/인수는 사용 편의성을 위해 SDK에서 추상화되거나 선택적일 수 있습니다.
온체인 명령어에 대한 자세한 내용은 여기에서 확인할 수 있습니다. [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/clients/rust/src/generated/instructions/update_v1.rs#L126)

{% /totem-accordion %}
{% /totem %}

## Core Asset 업데이트하기

다음은 SDK를 사용하여 MPL Core Asset을 업데이트하는 방법입니다.

{% dialect-switcher title="Asset 업데이트하기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { update, fetchAsset } from '@metaplex-foundation/mpl-core'

const assetId = publicKey('11111111111111111111111111111111')
const asset = await fetchAsset(umi, assetId)

// 선택사항: Asset이 컬렉션에 있다면 컬렉션 조회
const collectionId = publicKey('2222222222222222222222222222222')
const collection = await fetchCollection(umi, collectionId)

await update(umi, {
  asset,
  // 선택사항: Asset이 컬렉션의 일부인 경우에만 Collection이 필요
  collection,
  name: 'New Nft Name',
  uri: 'https://example.com/new-uri',
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```ts
use mpl_core::instructions::UpdateV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn update_asset() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    // 선택사항: Asset이 컬렉션에 있다면 컬렉션 조회
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let update_asset_ix = UpdateV1Builder::new()
        .asset(asset)
        // 선택사항: Asset이 컬렉션의 일부인 경우에만 Collection이 필요
        .collection(collection)
        .payer(authority.pubkey())
        .new_name("My asset".into())
        .new_uri("https://example.com/my-asset.json".into())
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let update_asset_tx = Transaction::new_signed_with_payer(
        &[update_asset_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&update_asset_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## Core Asset의 컬렉션 변경하기

다음은 SDK를 사용하여 Core Asset의 컬렉션을 변경하는 방법입니다.

{% dialect-switcher title="Core Asset의 컬렉션 변경하기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from "@metaplex-foundation/umi";
import {
  update,
  fetchAsset,
  fetchCollection,
  collectionAddress,
  updateAuthority
} from "@metaplex-foundation/mpl-core";

const assetId = publicKey("11111111111111111111111111111111");

const asset = await fetchAsset(umi, assetId);

const collectionId = collectionAddress(asset)

if (!collectionId) {
  console.log("Collection not found");
  return;
}

const collection = await fetchCollection(umi, collectionId);

const newCollectionId = publicKey("22222222222222222222222222222222")

const updateTx = await update(umi, {
  asset,
  collection,
  newCollection: newCollectionId,
  newUpdateAuthority: updateAuthority('Collection', [newCollectionId]),
}).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

## Core Asset 데이터를 불변으로 만들기

다음은 SDK를 사용하여 Core Asset을 완전히 불변으로 만드는 방법입니다. [불변성 가이드](/core/guides/immutability)에 설명된 다양한 수준의 불변성이 있다는 점에 주의하세요.

{% callout type="warning" title="중요" %}

이는 파괴적인 행동으로 자산 업데이트 능력을 제거합니다.

또한 자산이 속해 있던 모든 컬렉션에서 자산을 제거합니다. 컬렉션 자산을 불변으로 만들려면 컬렉션의 업데이트 권한을 변경해야 합니다.

{% /callout %}

{% dialect-switcher title="Core Asset을 불변으로 만들기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { update, fetchAsset } from '@metaplex-foundation/mpl-core'

const assetId = publicKey('11111111111111111111111111111111')
const asset = await fetchAsset(umi, asset)

await update(umi, {
  asset: asset,
  newUpdateAuthority: updateAuthority('None'),
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{instructions::UpdateV1Builder, types::UpdateAuthority};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn update_asset_data_to_immutable() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let update_asset_ix = UpdateV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .new_update_authority(UpdateAuthority::None)
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let update_asset_tx = Transaction::new_signed_with_payer(
        &[update_asset_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&update_asset_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /dialect %}
{% /dialect-switcher %}