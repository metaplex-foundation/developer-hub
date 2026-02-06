---
title: 외부 플러그인 추가
metaTitle: 외부 플러그인 추가 | Metaplex Core
description: Core Asset과 Collection에 Oracle 및 AppData 플러그인을 추가하는 방법을 배웁니다. JavaScript와 Rust 코드 예제.
updated: '01-31-2026'
keywords:
  - add external plugin
  - add Oracle
  - add AppData
  - external plugin setup
about:
  - External plugin setup
  - Oracle configuration
  - AppData configuration
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
faqs:
  - q: 하나의 Asset에 여러 외부 플러그인을 추가할 수 있나요?
    a: 네. 하나의 Asset에 여러 개의 Oracle 및/또는 AppData 플러그인을 추가할 수 있습니다.
  - q: Oracle 계정을 먼저 생성해야 하나요?
    a: 네. Oracle 플러그인 어댑터를 추가하기 전에 Oracle 계정이 이미 존재해야 합니다.
  - q: 생성 시 추가와 나중에 추가하는 것의 차이점은 무엇인가요?
    a: 기능적 차이는 없습니다. 생성 시 추가하는 것이 더 효율적입니다(하나의 트랜잭션). 나중에 추가하려면 별도의 트랜잭션이 필요합니다.
---
이 가이드는 Core Asset과 Collection에 **외부 플러그인**(Oracle, AppData)을 추가하는 방법을 보여줍니다. 생성 시 또는 기존 Asset/Collection에 추가할 수 있습니다. {% .lead %}
{% callout title="배우게 될 내용" %}

- Asset/Collection 생성 중 외부 플러그인 추가
- 기존 Asset/Collection에 외부 플러그인 추가
- Oracle 라이프사이클 검사 구성
- Data Authority로 AppData 설정
{% /callout %}

## 요약

`create()`에서 `plugins` 배열을 사용하거나, 기존 Asset에는 `addPlugin()`을 사용하여 외부 플러그인을 추가합니다. Collection은 `createCollection()`과 `addCollectionPlugin()`을 사용합니다.

- 생성 시 추가: `plugins` 배열에 포함
- 기존에 추가: `addPlugin()` / `addCollectionPlugin()` 사용
- Update Authority 서명 필요
- Oracle 플러그인의 라이프사이클 검사 구성

## 범위 외

외부 플러그인 제거([외부 플러그인 제거](/smart-contracts/core/external-plugins/removing-external-plugins) 참조), 플러그인 데이터 업데이트, 내장 플러그인([플러그인 추가](/smart-contracts/core/plugins/adding-plugins) 참조).

## 빠른 시작

**바로 가기:** [플러그인과 함께 Asset 생성](#creating-a-core-asset-with-an-external-plugin) · [기존 Asset에 추가](#adding-a-external-plugin-to-a-core-asset) · [플러그인과 함께 Collection 생성](#creating-a-core-collection-with-an-external-plugin)

1. Oracle 계정 또는 AppData 구성 준비
2. 생성 시 또는 `addPlugin()`을 통해 플러그인 추가
3. 라이프사이클 검사(Oracle) 또는 Data Authority(AppData) 구성

## Assets

### 외부 플러그인과 함께 Core Asset 생성

{% dialect-switcher title="외부 플러그인과 함께 Core Asset 생성" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { create, CheckResult } from '@metaplex-foundation/mpl-core'
const assetSigner = publicKey('11111111111111111111111111111111')
const oracleAccount = publicKey('22222222222222222222222222222222')
await create(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    {
      type: 'Oracle',
      resultsOffset: {
        type: 'Anchor',
      },
      lifecycleChecks: {
        update: [CheckResult.CAN_REJECT],
      },
      baseAddress: oracleAccount,
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::CreateV2Builder,
    types::{
        ExternalCheckResult, ExternalPluginAdapterInitInfo, HookableLifecycleEvent, OracleInitInfo,
        ValidationResultsOffset,
    },
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn create_asset_with_oracle_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let payer = Keypair::new();
    let asset = Keypair::new();
    let onchain_oracle_account = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let create_asset_with_oracle_plugin_ix = CreateV2Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .external_plugins_adapters(vec![ExternalPluginAdapterInitInfo::Oracle(OracleInitInfo {
            base_address: onchain_oracle_account,
            init_plugin_authority: None,
            lifecycle_checks: vec![(
                HookableLifecycleEvent::Transfer,
                ExternalCheckResult { flags: 4 },
            )],
            base_address_config: None,
            results_offset: Some(ValidationResultsOffset::Anchor),
        })])
        .instruction();
    let signers = vec![&asset, &payer];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let create_asset_with_burn_transfer_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_burn_transfer_delegate_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_burn_transfer_delegate_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

### Core Asset에 외부 플러그인 추가

{% dialect-switcher title="지정된 권한으로 플러그인 추가" %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::AddExternalPluginAdapterV1Builder,
    types::{
        ExternalCheckResult, ExternalPluginAdapterInitInfo, HookableLifecycleEvent,
        OracleInitInfo, ValidationResultsOffset,
    },
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn add_oracle_plugin_to_asset() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let oracle_plugin = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let add_oracle_plugin_to_asset_ix = AddExternalPluginAdapterV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .init_info(ExternalPluginAdapterInitInfo::Oracle(OracleInitInfo {
            base_address: oracle_plugin,
            results_offset: Some(ValidationResultsOffset::Anchor),
            lifecycle_checks: vec![(
                HookableLifecycleEvent::Transfer,
                ExternalCheckResult { flags: 4 },
            )],
            base_address_config: None,
            init_plugin_authority: None,
        }))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let add_oracle_plugin_to_asset_tx = Transaction::new_signed_with_payer(
        &[add_oracle_plugin_to_asset_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&add_oracle_plugin_to_asset_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin, CheckResult } from '@metaplex-foundation/mpl-core'
const asset = publicKey('11111111111111111111111111111111')
const oracleAccount = publicKey('22222222222222222222222222222222')
addPlugin(umi, {
  asset,
  plugin: {
    type: 'Oracle',
    resultsOffset: {
      type: 'Anchor',
    },
    lifecycleChecks: {
      create: [CheckResult.CAN_REJECT],
    },
    baseAddress: oracleAccount,
  },
})
```

{% /dialect %}
{% /dialect-switcher %}

## Collections

### 외부 플러그인과 함께 Core Collection 생성

{% dialect-switcher title="Core Collection에 외부 플러그인 추가" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import { createCollection, CheckResult } from '@metaplex-foundation/mpl-core'
const collectionSigner = generateSigner(umi)
const oracleAccount = publicKey('22222222222222222222222222222222')
await createCollection(umi, {
  collection: collectionSigner,
  name: 'My Collection',
  uri: 'https://example.com/my-collection.json',
  plugins: [
    {
      type: 'Oracle',
      resultsOffset: {
        type: 'Anchor',
      },
      lifecycleChecks: {
        update: [CheckResult.CAN_REJECT],
      },
      baseAddress: oracleAccount,
    },
    ,
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::CreateCollectionV2Builder,
    types::{
        ExternalCheckResult, ExternalPluginAdapterInitInfo, HookableLifecycleEvent, OracleInitInfo,
        ValidationResultsOffset,
    },
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn create_collection_with_oracle_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let payer = Keypair::new();
    let collection = Keypair::new();
    let onchain_oracle_plugin = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let create_collection_with_oracle_plugin_ix = CreateCollectionV2Builder::new()
        .collection(collection.pubkey())
        .payer(payer.pubkey())
        .name("My Collection".into())
        .uri("https://example.com/my-nft.json".into())
        .external_plugins_adapters(vec![ExternalPluginAdapterInitInfo::Oracle(OracleInitInfo {
            base_address: onchain_oracle_plugin,
            init_plugin_authority: None,
            lifecycle_checks: vec![(
                HookableLifecycleEvent::Transfer,
                ExternalCheckResult { flags: 4 },
            )],
            base_address_config: None,
            results_offset: Some(ValidationResultsOffset::Anchor),
        })])
        .instruction();
    let signers = vec![&collection, &payer];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let create_collection_with_oracle_plugin_tx = Transaction::new_signed_with_payer(
        &[create_collection_with_oracle_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&create_collection_with_oracle_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

### Collection에 외부 플러그인 추가

{% dialect-switcher title="Asset 소각" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addCollectionPlugin, CheckResult } from '@metaplex-foundation/mpl-core'
const collection = publicKey('11111111111111111111111111111111')
const oracleAccount = publicKey('22222222222222222222222222222222')
await addCollectionPlugin(umi, {
  collection: collection,
  plugin: {
    type: 'Oracle',
    resultsOffset: {
      type: 'Anchor',
    },
    lifecycleChecks: {
      update: [CheckResult.CAN_REJECT],
    },
    baseAddress: oracleAccount,
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::AddCollectionExternalPluginV1Builder,
    types::{
        ExternalCheckResult, ExternalPluginAdapterInitInfo, HookableLifecycleEvent,
        OracleInitInfo, ValidationResultsOffset,
    },
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn add_oracle_plugin_to_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let oracle_plugin = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let add_oracle_plugin_to_collection_ix = AddCollectionExternalPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .init_info(ExternalPluginAdapterInitInfo::Oracle(OracleInitInfo {
            base_address: oracle_plugin,
            results_offset: Some(ValidationResultsOffset::Anchor),
            lifecycle_checks: vec![(
                HookableLifecycleEvent::Transfer,
                ExternalCheckResult { flags: 4 },
            )],
            base_address_config: None,
            init_plugin_authority: None,
        }))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let add_oracle_plugin_to_collection_tx = Transaction::new_signed_with_payer(
        &[add_oracle_plugin_to_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&add_oracle_plugin_to_collection_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## 일반적인 오류

### `Authority mismatch`

Update Authority만 외부 플러그인을 추가할 수 있습니다. 올바른 키페어로 서명하고 있는지 확인하세요.

### `Plugin already exists`

동일한 키를 가진 외부 플러그인이 이미 존재합니다. 먼저 제거하거나 대신 업데이트하세요.

### `Invalid Oracle account`

Oracle 기본 주소가 유효하지 않거나 계정이 존재하지 않습니다.

## 참고 사항

- 외부 플러그인은 Authority Managed입니다(Update Authority가 제어)
- Oracle 플러그인은 기존 Oracle 계정이 필요합니다
- AppData 플러그인은 쓰기 권한을 위한 Data Authority가 필요합니다
- Collection 플러그인은 기존 Asset에 자동으로 적용되지 않습니다

## FAQ

### 하나의 Asset에 여러 외부 플러그인을 추가할 수 있나요?

네. 하나의 Asset에 여러 개의 Oracle 및/또는 AppData 플러그인을 추가할 수 있습니다.

### Oracle 계정을 먼저 생성해야 하나요?

네. Oracle 플러그인 어댑터를 추가하기 전에 Oracle 계정이 이미 존재해야 합니다.

### 생성 시 추가와 나중에 추가하는 것의 차이점은 무엇인가요?

기능적 차이는 없습니다. 생성 시 추가하는 것이 더 효율적입니다(하나의 트랜잭션). 나중에 추가하려면 별도의 트랜잭션이 필요합니다.

## 관련 작업

- [외부 플러그인 제거](/smart-contracts/core/external-plugins/removing-external-plugins) - 외부 플러그인 제거
- [외부 플러그인 개요](/smart-contracts/core/external-plugins/overview) - 외부 플러그인 이해하기
- [Oracle 플러그인](/smart-contracts/core/external-plugins/oracle) - Oracle 구성 세부 정보
- [AppData 플러그인](/smart-contracts/core/external-plugins/app-data) - AppData 구성 세부 정보
