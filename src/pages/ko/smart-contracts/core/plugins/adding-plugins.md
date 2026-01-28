---
title: Plugin 추가
metaTitle: Core Asset에 Plugin 추가 | Metaplex Core
description: Core NFT Asset과 Collection에 Plugin을 추가하는 방법을 알아봅니다. Plugin 권한을 설정하고 생성 시 또는 생성 후에 Plugin 데이터를 구성합니다.
---

이 가이드에서는 Core Asset과 Collection에 **Plugin을 추가하는** 방법을 설명합니다. Plugin은 로열티, 동결, 속성, 위임 권한 등의 기능을 추가합니다. {% .lead %}

{% callout title="학습 내용" %}

- 기존 Asset과 Collection에 Plugin 추가
- 기본 및 커스텀 Plugin 권한 설정
- 추가 시 Plugin 데이터 구성
- 권한 타입 차이 이해

{% /callout %}

## 요약

`addPlugin()`을 사용하여 Asset에, `addCollectionPlugin()`을 사용하여 Collection에 Plugin을 추가합니다. 각 Plugin에는 기본 권한 타입이 있지만 재정의할 수 있습니다.

- **Owner Managed** Plugin은 기본적으로 `Owner` 권한
- **Authority Managed** Plugin은 기본적으로 `UpdateAuthority`
- **Permanent** Plugin은 생성 시에만 추가 가능
- 커스텀 권한은 `authority` 매개변수로 설정 가능

## 범위 외

Permanent Plugin(생성 시 추가 필요), Plugin 제거([Plugin 제거](/ko/smart-contracts/core/plugins/removing-plugins) 참조), Plugin 업데이트([Plugin 업데이트](/ko/smart-contracts/core/plugins/update-plugins) 참조)는 범위 외입니다.

## 빠른 시작

**바로 가기:** [Asset에 추가](#core-asset에-plugin-추가) · [Collection에 추가](#collection에-plugin-추가) · [커스텀 권한](#할당된-권한으로-plugin-추가)

1. [Plugin 개요](/ko/smart-contracts/core/plugins)에서 Plugin 선택
2. Asset 주소와 Plugin 설정으로 `addPlugin()` 호출
3. Plugin이 즉시 활성화

Plugin은 MPL Core Asset과 MPL Core Collection 모두에 할당될 수 있습니다. MPL Core Asset과 MPL Core Collection은 모두 사용 가능한 Plugin의 유사한 목록을 공유합니다. 각각에서 사용할 수 있는 Plugin을 확인하려면 [Plugin 개요](/ko/smart-contracts/core/plugins) 영역을 방문하세요.

## Core Asset에 Plugin 추가

Plugin은 Plugin에 대한 권한을 할당할 수 있는 기능을 지원합니다. `initAuthority` 인수가 제공되면 원하는 Plugin 권한 타입으로 권한이 설정됩니다. 할당되지 않은 경우 Plugin의 기본 권한 타입이 할당됩니다(다음 섹션).

**Create Plugin Helper**

`createPlugin()` 헬퍼는 `addPlugin()` 과정에서 Plugin을 할당할 수 있는 타입화된 메서드를 제공합니다.
Plugin의 전체 목록과 해당 인수는 [Plugin 개요](/ko/smart-contracts/core/plugins) 페이지를 참조하세요.

### 기본 권한으로 Plugin 추가

Plugin의 권한을 지정하지 않고 Asset이나 Collection에 Plugin을 추가하면 권한이 해당 Plugin의 기본 권한 타입으로 설정됩니다.

- Owner Managed Plugin은 `Owner`의 Plugin 권한 타입으로 기본 설정됩니다.
- Authority Managed Plugin은 `UpdateAuthority`의 Plugin 권한 타입으로 기본 설정됩니다.
- Permanent Plugin은 `UpdateAuthority`의 Plugin 권한 타입으로 기본 설정됩니다.

{% dialect-switcher title="기본 권한으로 Plugin 추가" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin } from '@metaplex-foundation/mpl-core'

const assetId = publicKey('11111111111111111111111111111111')

await addPlugin(umi, {
  asset: assetId,
  plugin: {
    type: 'Attributes',
    attributeList: [{ key: 'key', value: 'value' }],
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{FreezeDelegate, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let add_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let add_plugin_tx = Transaction::new_signed_with_payer(
        &[add_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&add_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

### 할당된 권한으로 Plugin 추가

Plugin의 권한을 설정하는 데 도움이 되는 몇 가지 권한 헬퍼가 있습니다.

**Address**

```js
await addPlugin(umi, {
    ...
    plugin: {
      ...
      authority: {
        type: 'Address',
        address: publicKey('22222222222222222222222222222222'),
      },
    },
  }).sendAndConfirm(umi);
```

이는 Plugin의 권한을 특정 주소로 설정합니다.

**Owner**

```js
await addPlugin(umi, {
    ...
    plugin: {
      ...
      authority: {
        type: 'Owner'
      },
    },
  }).sendAndConfirm(umi);
```

이는 Plugin의 권한을 `Owner` 타입으로 설정합니다.
Asset의 현재 소유자가 이 Plugin에 액세스할 수 있습니다.

**UpdateAuthority**

```js
await addPlugin(umi, {
    ...
    plugin: {
      ...
      authority: {
        type: "UpdateAuthority",
      },
    },
  }).sendAndConfirm(umi);
```

이는 Plugin의 권한을 `UpdateAuthority` 타입으로 설정합니다.
Asset의 현재 업데이트 권한이 이 Plugin에 액세스할 수 있습니다.

**None**

```js
await addPlugin(umi, {
    ...
    plugin: {
      ...
      authority: {
        type: "None",
      },
    },
  }).sendAndConfirm(umi);
```

이는 Plugin의 권한을 `None` 타입으로 설정합니다.
Plugin의 데이터가 있다면 이 시점에서 불변이 됩니다.

{% dialect-switcher title="할당된 권한으로 Plugin 추가" %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{FreezeDelegate, Plugin, PluginAuthority},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_plugin_with_authority() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let plugin_authority = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let add_plugin_with_authority_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
        .init_authority(PluginAuthority::Address {
            address: plugin_authority,
        })
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let add_plugin_with_authority_tx = Transaction::new_signed_with_payer(
        &[add_plugin_with_authority_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&add_plugin_with_authority_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}

{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  addPlugin,
} from '@metaplex-foundation/mpl-core'

const asset = publicKey("11111111111111111111111111111111")
const delegate = publicKey('222222222222222222222222222222')

await addPlugin(umi, {
    asset: asset.publicKey,
    plugin: {
      type: 'Attributes',
      attributeList: [{ key: 'key', value: 'value' }],
      authority: {
        type: 'Address',
        address: delegate,
      },
    },
  }).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

## Collection에 Plugin 추가

Core Collection에 Plugin을 추가하는 것은 Core Asset에 추가하는 것과 유사합니다. 생성 중에 Plugin을 추가하거나 `addCollectionV1` 명령어를 사용할 수 있습니다. Collection은 `Authority Plugin`과 `Permanent Plugin`에만 액세스할 수 있습니다.

### 기본 권한으로 Collection Plugin 추가

{% dialect-switcher title="기본 권한으로 Collection Plugin 추가" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addCollectionPlugin, ruleSet } from '@metaplex-foundation/mpl-core'

const collection = publicKey('11111111111111111111111111111111')

const creator = publicKey('22222222222222222222222222222222')

await addCollectionPlugin(umi, {
  collection: collection,
  plugin: {
    type: 'Royalties',
    data: {
      basisPoints: 5000,
      creators: [
        {
          address: creator,
          percentage: 100,
        },
      ],
      ruleSet: ruleSet('None'),
    },
  },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::AddCollectionPluginV1Builder,
    types::{FreezeDelegate, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_plugin_to_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let add_plugin_to_collection_ix = AddCollectionPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let add_plugin_to_collection_tx = Transaction::new_signed_with_payer(
        &[add_plugin_to_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&add_plugin_to_collection_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

### 할당된 권한으로 Collection Plugin 추가

{% dialect-switcher title="Asset 소각" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  addCollectionPlugin,
  ruleSet,
} from '@metaplex-foundation/mpl-core'

const collection = publicKey('11111111111111111111111111111111')
const delegate = publicKey('22222222222222222222222222222222')

await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'Attributes',
    attributeList: [{ key: 'key', value: 'value' }],
    authority: {
      type: 'Address',
      address: delegate,
    },
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::AddCollectionPluginV1Builder,
    types::{FreezeDelegate, Plugin, PluginAuthority},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_plugin_to_collection_with_authority() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let plugin_authority = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let add_plugin_to_collection_with_authority_ix = AddCollectionPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
        .init_authority(PluginAuthority::Address {
            address: plugin_authority,
        })
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let add_plugin_to_collection_with_authority_tx = Transaction::new_signed_with_payer(
        &[add_plugin_to_collection_with_authority_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&add_plugin_to_collection_with_authority_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## 일반적인 오류

### `Authority mismatch`

이 Plugin을 추가할 권한이 없습니다. Owner Managed Plugin은 소유자 서명이 필요하고, Authority Managed Plugin은 업데이트 권한이 필요합니다.

### `Plugin already exists`

Asset/Collection에 이미 이 Plugin 타입이 있습니다. 대신 `updatePlugin`을 사용하여 수정하세요.

### `Cannot add permanent plugin`

Permanent Plugin은 생성 시에만 추가할 수 있습니다. 기존 Asset/Collection에는 추가할 수 없습니다.

## 참고사항

- Owner Managed Plugin은 추가에 **소유자 서명**이 필요
- Authority Managed Plugin은 추가에 **업데이트 권한 서명**이 필요
- Permanent Plugin은 **생성 시**에만 추가 가능
- Plugin을 추가하면 계정 크기와 렌트가 증가

## 빠른 참조

### 기본 권한 타입

| Plugin 타입 | 기본 권한 |
|-------------|-------------------|
| Owner Managed | `Owner` |
| Authority Managed | `UpdateAuthority` |
| Permanent | `UpdateAuthority` |

### 권한 옵션

| 권한 타입 | 설명 |
|----------------|-------------|
| `Owner` | 현재 Asset 소유자 |
| `UpdateAuthority` | 현재 업데이트 권한 |
| `Address` | 특정 공개 키 |
| `None` | 불변 (아무도 업데이트 불가) |

## FAQ

### 한 트랜잭션에서 여러 Plugin을 추가할 수 있나요?

예, Asset 생성 시 가능합니다. 기존 Asset의 경우 각 `addPlugin` 호출은 별도의 트랜잭션입니다.

### 권한을 None으로 설정하면 어떻게 되나요?

Plugin이 불변이 됩니다. 아무도 업데이트하거나 제거할 수 없습니다.

### 업데이트 권한으로 Owner Managed Plugin을 추가할 수 있나요?

아니요. Owner Managed Plugin은 누가 서명하든 상관없이 추가에 항상 소유자 서명이 필요합니다.

### Permanent Plugin을 추가할 수 없는 이유는 무엇인가요?

Permanent Plugin은 Asset/Collection 생성 시에만 추가할 수 있습니다. 기존 계정에는 추가할 수 없습니다.

## 관련 작업

- [Plugin 제거](/ko/smart-contracts/core/plugins/removing-plugins) - Asset/Collection에서 Plugin 삭제
- [Plugin 위임](/ko/smart-contracts/core/plugins/delegating-and-revoking-plugins) - Plugin 권한 변경
- [Plugin 업데이트](/ko/smart-contracts/core/plugins/update-plugins) - Plugin 데이터 수정
- [Plugin 개요](/ko/smart-contracts/core/plugins) - 사용 가능한 Plugin 전체 목록

## 용어집

| 용어 | 정의 |
|------|------------|
| **Owner Managed** | 추가에 소유자 서명이 필요한 Plugin |
| **Authority Managed** | 업데이트 권한이 추가할 수 있는 Plugin |
| **Permanent** | 생성 시에만 추가 가능한 Plugin |
| **initAuthority** | 커스텀 Plugin 권한을 설정하는 매개변수 |

---

*Metaplex Foundation에서 관리 · 2026년 1월 마지막 확인 · @metaplex-foundation/mpl-core에 적용*
