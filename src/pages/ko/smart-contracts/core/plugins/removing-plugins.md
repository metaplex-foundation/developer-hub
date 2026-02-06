---
title: 플러그인 제거
metaTitle: 플러그인 제거 | Metaplex Core
description: Core NFT Asset 및 Collection에서 플러그인을 제거하는 방법을 알아보세요. 기능을 제거하고 플러그인 계정에서 렌트를 회수합니다.
updated: '01-31-2026'
keywords:
  - remove plugin
  - removePlugin
  - delete plugin
  - recover rent
about:
  - Removing plugins
  - Rent recovery
  - Plugin management
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 플러그인 제거 후 데이터를 복구할 수 있나요?
    a: 아니요. 플러그인을 제거하면 모든 데이터가 영구적으로 삭제됩니다. 제거 전에 중요한 데이터를 백업하세요.
  - q: 플러그인을 제거하면 렌트는 어떻게 되나요?
    a: 플러그인 데이터를 저장하는 데 사용된 렌트는 회수되어 지불자에게 반환됩니다.
  - q: 다른 사람이 위임한 플러그인을 제거할 수 있나요?
    a: 네, 해당 플러그인의 위임된 권한자라면 제거할 수 있습니다.
  - q: Permanent 플러그인을 제거할 수 없는 이유는 무엇인가요?
    a: Permanent 플러그인은 생성 후 제거할 수 없습니다. 단, 설정은 여전히 조정할 수 있습니다. 이는 플러그인 존재를 보장해야 하는 사용 사례를 위한 설계입니다.
  - q: Collection과 Asset의 플러그인을 한 번에 제거할 수 있나요?
    a: '아니요. Collection 플러그인과 Asset 플러그인은 별도로 관리됩니다. 단, Collection 플러그인을 제거하면 그것을 상속받는 Asset에 영향을 줄 수 있습니다(예: 자체 Royalties 플러그인이 없는 Asset은 더 이상 로열티가 적용되지 않습니다).'
---
이 가이드에서는 Core Asset 및 Collection에서 **플러그인을 제거**하는 방법을 설명합니다. 플러그인을 제거하면 데이터와 기능이 삭제됩니다. {% .lead %}
{% callout title="학습 내용" %}

- Asset에서 플러그인 제거
- Collection에서 플러그인 제거
- 제거에 필요한 권한 요구 사항 이해
- 제거된 플러그인에서 렌트 회수
{% /callout %}

## 요약

Asset에는 `removePlugin()`, Collection에는 `removeCollectionPlugin()`을 사용하여 플러그인을 제거합니다. 플러그인 권한자만 플러그인을 제거할 수 있습니다.

- 제거할 플러그인 유형 지정
- 플러그인 데이터 삭제
- 렌트 회수
- Permanent 플러그인은 제거 불가

## 범위 외

Permanent 플러그인 제거(불가능), 플러그인 업데이트([플러그인 업데이트](/ko/smart-contracts/core/plugins/update-plugins) 참조), 권한 변경([플러그인 위임](/ko/smart-contracts/core/plugins/delegating-and-revoking-plugins) 참조).

## 빠른 시작

**바로 가기:** [Asset에서 제거](#mpl-core-asset에서-플러그인-제거) · [Collection에서 제거](#collection에서-플러그인-제거)

1. 제거할 플러그인 유형 식별
2. Asset과 플러그인 유형으로 `removePlugin()` 호출
3. 플러그인 즉시 제거됨
MPL Core Asset 및 MPL Core Collection에서도 플러그인을 제거할 수 있습니다.

## MPL Core Asset에서 플러그인 제거

{% dialect-switcher title="MPL Core Asset에서 플러그인 제거" %}
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

## Collection에서 플러그인 제거

{% dialect-switcher title="MPL Core Collection에서 플러그인 제거" %}
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

이 플러그인을 제거할 권한이 없습니다. 누가 플러그인에 대한 권한을 가지고 있는지 확인하세요.

### `Plugin not found`

Asset/Collection에 이 플러그인 유형이 첨부되어 있지 않습니다.

### `Cannot remove permanent plugin`

Permanent 플러그인은 생성 후 제거할 수 없습니다. 영구적으로 첨부되어 있습니다.

## 참고 사항

- 플러그인을 제거하면 모든 데이터가 삭제됨
- 제거된 플러그인의 렌트가 회수됨
- 플러그인 권한자만 플러그인을 제거할 수 있음
- Permanent 플러그인은 절대 제거 불가

## 빠른 참조

### 제거 권한 요구 사항

| 플러그인 유형 | 제거 가능한 사람 |
|-------------|----------------|
| Owner Managed | 소유자 또는 위임자 |
| Authority Managed | Update authority 또는 위임자 |
| Permanent | 제거 불가 |

## FAQ

### 플러그인 제거 후 데이터를 복구할 수 있나요?

아니요. 플러그인을 제거하면 모든 데이터가 영구적으로 삭제됩니다. 제거 전에 중요한 데이터를 백업하세요.

### 플러그인을 제거하면 렌트는 어떻게 되나요?

플러그인 데이터를 저장하는 데 사용된 렌트는 회수되어 지불자에게 반환됩니다.

### 다른 사람이 위임한 플러그인을 제거할 수 있나요?

네, 해당 플러그인의 위임된 권한자라면 제거할 수 있습니다.

### Permanent 플러그인을 제거할 수 없는 이유는 무엇인가요?

Permanent 플러그인은 생성 후 제거할 수 없습니다. 단, 설정은 여전히 조정할 수 있습니다. 이는 플러그인 존재를 보장해야 하는 사용 사례를 위한 설계입니다.

### Collection과 Asset의 플러그인을 한 번에 제거할 수 있나요?

아니요. Collection 플러그인과 Asset 플러그인은 별도로 관리됩니다. 단, Collection 플러그인을 제거하면 그것을 상속받는 Asset에 영향을 줄 수 있습니다(예: 자체 Royalties 플러그인이 없는 Asset은 더 이상 로열티가 적용되지 않습니다).

## 관련 작업

- [플러그인 추가](/ko/smart-contracts/core/plugins/adding-plugins) - Asset/Collection에 플러그인 추가
- [플러그인 위임](/ko/smart-contracts/core/plugins/delegating-and-revoking-plugins) - 플러그인 권한 변경
- [플러그인 업데이트](/ko/smart-contracts/core/plugins/update-plugins) - 플러그인 데이터 수정
- [플러그인 개요](/ko/smart-contracts/core/plugins) - 사용 가능한 플러그인 전체 목록

## 용어집

| 용어 | 정의 |
|------|------------|
| **Plugin Authority** | 플러그인을 관리할 권한이 있는 주소 |
| **Permanent Plugin** | 생성 후 제거할 수 없는 플러그인 |
| **Rent** | Solana에서 계정 데이터를 저장하기 위해 예치하는 SOL |
| **Owner Managed** | 소유자가 제거를 제어하는 플러그인 |
| **Authority Managed** | Update authority가 제거를 제어하는 플러그인 |
