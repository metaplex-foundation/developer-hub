---
title: Plugin 제거
metaTitle: Plugin 제거 | Metaplex Core
description: Core NFT Asset과 Collection에서 Plugin을 제거하는 방법을 알아봅니다. 기능을 제거하고 Plugin 계정에서 렌트를 회수합니다.
---

이 가이드에서는 Core Asset과 Collection에서 **Plugin을 제거하는** 방법을 설명합니다. Plugin을 제거하면 해당 데이터와 기능이 삭제됩니다. {% .lead %}

{% callout title="학습 내용" %}

- Asset에서 Plugin 제거
- Collection에서 Plugin 제거
- 제거 권한 요구사항 이해
- 제거된 Plugin에서 렌트 회수

{% /callout %}

## 요약

Asset에는 `removePlugin()`을, Collection에는 `removeCollectionPlugin()`을 사용하여 Plugin을 제거합니다. Plugin 권한만 Plugin을 제거할 수 있습니다.

- 제거할 Plugin 타입 지정
- Plugin 데이터가 삭제됨
- 렌트가 회수됨
- Permanent Plugin은 제거 불가

## 범위 외

Permanent Plugin 제거(불가능), Plugin 업데이트([Plugin 업데이트](/ko/smart-contracts/core/plugins/update-plugins) 참조), 권한 변경([Plugin 위임](/ko/smart-contracts/core/plugins/delegating-and-revoking-plugins) 참조)은 범위 외입니다.

## 빠른 시작

**바로 가기:** [Asset에서 제거](#mpl-core-asset에서-plugin-제거) · [Collection에서 제거](#collection에서-plugin-제거)

1. 제거할 Plugin 타입 식별
2. Asset과 Plugin 타입으로 `removePlugin()` 호출
3. Plugin이 즉시 제거됨

Plugin은 MPL Core Asset과 MPL Core Collection에서도 제거할 수 있습니다.

## MPL Core Asset에서 Plugin 제거

{% dialect-switcher title="MPL Core Asset에서 Plugin 제거" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { removePlugin } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')

await removePlugin(umi, {
  asset: asset.publicKey,
  plugin: { type: 'Attributes' },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{instructions::RemovePluginV1Builder, types::PluginType};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn remove_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let remove_plugin_ix = RemovePluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let remove_plugin_tx = Transaction::new_signed_with_payer(
        &[remove_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&remove_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## Collection에서 Plugin 제거

{% dialect-switcher title="MPL Core Collection에서 Plugin 제거" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  removeCollectionPluginV1,
  PluginType,
} from '@metaplex-foundation/mpl-core'

const collectionAddress = publicKey('11111111111111111111111111111111')

await removeCollectionPlugin(umi, {
  collection: collectionAddress,
  pluginType: { type: 'Royalties' },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{instructions::RemoveCollectionPluginV1Builder, types::PluginType};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn remove_collection_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let remove_collection_plugin_ix = RemoveCollectionPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let remove_collection_plugin_tx = Transaction::new_signed_with_payer(
        &[remove_collection_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&remove_collection_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## 일반적인 오류

### `Authority mismatch`

이 Plugin을 제거할 권한이 없습니다. 누가 Plugin의 권한을 가지고 있는지 확인하세요.

### `Plugin not found`

Asset/Collection에 이 Plugin 타입이 연결되어 있지 않습니다.

### `Cannot remove permanent plugin`

Permanent Plugin은 생성 후에 제거할 수 없습니다. 영구적으로 연결되어 있습니다.

## 참고사항

- Plugin을 제거하면 모든 데이터가 삭제됨
- 제거된 Plugin에서 렌트가 회수됨
- Plugin 권한만 Plugin을 제거할 수 있음
- Permanent Plugin은 제거 불가

## 빠른 참조

### 제거 권한 요구사항

| Plugin 타입 | 제거 가능자 |
|-------------|----------------|
| Owner Managed | 소유자 또는 위임자 |
| Authority Managed | 업데이트 권한 또는 위임자 |
| Permanent | 제거 불가 |

## FAQ

### Plugin을 제거한 후 데이터를 복구할 수 있나요?

아니요. Plugin을 제거하면 모든 데이터가 영구적으로 삭제됩니다. 제거 전에 중요한 데이터를 백업하세요.

### Plugin을 제거하면 렌트는 어떻게 되나요?

Plugin 데이터를 저장하는 데 사용된 렌트가 회수되어 지불자에게 반환됩니다.

### 다른 사람이 위임한 Plugin을 제거할 수 있나요?

예, 해당 Plugin의 위임 권한이라면 제거할 수 있습니다.

### Permanent Plugin을 제거할 수 없는 이유는 무엇인가요?

Permanent Plugin은 불변으로 설계되어 생성 후 제거할 수 없습니다. 이는 영구성이 필요한 사용 사례를 위한 설계입니다.

### Collection과 해당 Asset에서 Plugin을 한 번에 제거할 수 있나요?

아니요. Collection Plugin과 Asset Plugin은 별도로 관리됩니다. Collection Plugin을 제거해도 Collection에만 영향을 미치고 해당 Asset에는 영향을 미치지 않습니다.

## 관련 작업

- [Plugin 추가](/ko/smart-contracts/core/plugins/adding-plugins) - Asset/Collection에 Plugin 추가
- [Plugin 위임](/ko/smart-contracts/core/plugins/delegating-and-revoking-plugins) - Plugin 권한 변경
- [Plugin 업데이트](/ko/smart-contracts/core/plugins/update-plugins) - Plugin 데이터 수정
- [Plugin 개요](/ko/smart-contracts/core/plugins) - 사용 가능한 Plugin 전체 목록

## 용어집

| 용어 | 정의 |
|------|------------|
| **Plugin 권한** | Plugin을 관리할 권한이 있는 주소 |
| **Permanent Plugin** | 생성 후 제거할 수 없는 Plugin |
| **렌트** | Solana에서 계정 데이터를 저장하기 위해 예치된 SOL |
| **Owner Managed** | 소유자가 제거를 제어하는 Plugin |
| **Authority Managed** | 업데이트 권한이 제거를 제어하는 Plugin |

---

*Metaplex Foundation에서 관리 · 2026년 1월 마지막 확인 · @metaplex-foundation/mpl-core에 적용*
