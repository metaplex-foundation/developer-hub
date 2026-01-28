---
title: 외부 플러그인 제거하기
metaTitle: 외부 플러그인 제거하기 | Metaplex Core
description: Core Assets와 Collections에서 Oracle 및 AppData 플러그인을 제거하는 방법을 알아보세요. JavaScript와 Rust 코드 예제 포함.
---

이 가이드는 Core Assets와 Collections에서 **외부 플러그인**을 제거하는 방법을 보여줍니다. 더 이상 필요하지 않을 때 Oracle 또는 AppData 플러그인을 제거하세요. {% .lead %}

{% callout title="배울 내용" %}

- Assets에서 외부 플러그인 제거
- Collections에서 외부 플러그인 제거
- 권한 요구 사항 이해
- 제거된 플러그인에서 렌트 회수

{% /callout %}

## 요약

Assets에는 `removePlugin()`, Collections에는 `removeCollectionPlugin()`을 사용하여 외부 플러그인을 제거합니다. 플러그인 권한만 외부 플러그인을 제거할 수 있습니다.

- 플러그인 유형과 기본 주소 지정
- 플러그인 데이터 삭제됨
- 렌트 회수됨
- 플러그인 권한 서명 필요

## 범위 외 내용

외부 플러그인 추가([외부 플러그인 추가하기](/ko/smart-contracts/core/external-plugins/adding-external-plugins) 참조), 플러그인 데이터 업데이트, 내장 플러그인 제거([플러그인 제거하기](/ko/smart-contracts/core/plugins/removing-plugins) 참조).

## 빠른 시작

**바로가기:** [Asset에서 제거](#asset에서-제거하기) · [Collection에서 제거](#collection에서-제거하기)

1. 제거할 플러그인 유형과 기본 주소 식별
2. 플러그인 키와 함께 `removePlugin()` 호출
3. 플러그인이 즉시 제거되고 렌트 회수

## Asset에서 제거하기

{% dialect-switcher title="Asset에서 외부 플러그인 제거하기" %}
{% dialect title="JavaScript" id="js" %}

Asset에서 외부 플러그인 어댑터를 제거하려면 `removePlugin()` 함수를 사용해야 합니다.

```ts
import {publicKey } from '@metaplex-foundation/umi'
import { removePlugin, CheckResult } from '@metaplex-foundation/mpl-core'

const asset = publicKey('1111111111111111111111111111111')
const oracleAccount = publicKey('2222222222222222222222222222222')

await removePlugin(umi, {
  asset,
  plugin: {
    type: 'Oracle',
    baseAddress: oracleAccount,
  },
})
```

{% /dialect  %}

{% dialect title="Rust" id="rust" %}

Asset에서 외부 플러그인 어댑터를 제거하려면 `RemoveExternalPluginAdapterV1Builder()` 함수를 사용해야 합니다.

```rust
use mpl_core::{instructions::RemoveExternalPluginAdapterV1Builder, types::ExternalPluginAdapterKey};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn remove_external_plugin_adapter_from_asset() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let oracle_account = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let remove_external_plugin_adapter_from_asset_ix = RemoveExternalPluginAdapterV1Builder::new()
        .asset(asset)
        .key(ExternalPluginAdapterKey::Oracle(oracle_account))
        .payer(authority.pubkey())
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let remove_external_plugin_adapter_from_asset_tx = Transaction::new_signed_with_payer(
        &[remove_external_plugin_adapter_from_asset_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&remove_external_plugin_adapter_from_asset_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect  %}

{% /dialect-switcher %}

## Collection에서 제거하기

{% dialect-switcher title="Collection에서 외부 플러그인 제거하기" %}
{% dialect title="JavaScript" id="js" %}

Collection에서 외부 플러그인 어댑터를 제거하려면 `removeCollectionPlugin()` 함수를 사용해야 합니다.

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { removeCollectionPlugin, CheckResult } from '@metaplex-foundation/mpl-core'

const collection = publicKey('1111111111111111111111111111111')
const oracleAccount = publicKey('2222222222222222222222222222222')

removeCollectionPlugin(umi, {
  collection,
  plugin: {
    type: 'Oracle',
    baseAddress: publicKey(oracleAccount),
  },
})
```

{% /dialect  %}

{% dialect title="Rust" id="rust" %}

Collection에서 외부 플러그인 어댑터를 제거하려면 `RemoveCollectionExternalPluginAdapterV1Builder()` 함수를 사용해야 합니다.

```rust

use mpl_core::{instructions::RemoveCollectionExternalPluginAdapterV1Builder, types::ExternalPluginAdapterKey};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn remove_external_plugin_adapter_from_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let oracle_account = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let remove_external_plugin_adapter_from_collection_ix = RemoveCollectionExternalPluginAdapterV1Builder::new()
        .collection(collection)
        .key(ExternalPluginAdapterKey::Oracle(oracle_account))
        .payer(authority.pubkey())
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let remove_external_plugin_adapter_from_collection_tx = Transaction::new_signed_with_payer(
        &[remove_external_plugin_adapter_from_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&remove_external_plugin_adapter_from_collection_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /dialect  %}

{% /dialect-switcher %}

## 일반적인 오류

### `Authority mismatch`

플러그인 권한만 외부 플러그인을 제거할 수 있습니다. 올바른 키페어로 서명하고 있는지 확인하세요.

### `Plugin not found`

지정된 키를 가진 외부 플러그인이 이 Asset/Collection에 존재하지 않습니다.

## 참고 사항

- 플러그인 제거 시 모든 데이터 삭제됨
- 렌트가 회수되어 지불자에게 반환됨
- 플러그인 권한만 제거 가능(일반적으로 업데이트 권한)
- 외부 Oracle/AppData 계정은 삭제되지 않음 - 어댑터만 제거

## FAQ

### Oracle 플러그인을 제거하면 Oracle 계정이 삭제되나요?

아니요. Asset의 플러그인 어댑터만 제거됩니다. 외부 Oracle 계정은 그대로 유지되며 재사용할 수 있습니다.

### 제거 전에 AppData를 복구할 수 있나요?

네. 데이터를 보존해야 한다면 플러그인을 제거하기 전에 `fetchAsset()`을 사용하여 AppData를 읽으세요.

### 렌트는 어떻게 되나요?

플러그인 어댑터의 렌트가 회수되어 트랜잭션 지불자에게 반환됩니다.

## 관련 작업

- [외부 플러그인 추가하기](/ko/smart-contracts/core/external-plugins/adding-external-plugins) - 외부 플러그인 추가
- [외부 플러그인 개요](/ko/smart-contracts/core/external-plugins/overview) - 외부 플러그인 이해하기
- [플러그인 제거하기](/ko/smart-contracts/core/plugins/removing-plugins) - 내장 플러그인 제거

---

*Metaplex Foundation 관리 · 2026년 1월 최종 검증 · @metaplex-foundation/mpl-core 적용*
