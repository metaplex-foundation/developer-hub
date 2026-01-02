---
title: 플러그인 추가하기
metaTitle: 플러그인 추가하기 | Core
description: MPL Core NFT 애셋 및 컬렉션에 플러그인을 추가하는 방법을 알아보세요.
---

플러그인은 MPL Core 애셋과 MPL Core 컬렉션 모두에 할당될 수 있습니다. MPL Core 애셋과 MPL Core 컬렉션은 모두 사용 가능한 플러그인의 유사한 목록을 공유합니다. 각각에서 사용할 수 있는 플러그인을 확인하려면 [플러그인 개요](/ko/smart-contracts/core/plugins) 영역을 방문하세요.

## Core 애셋에 플러그인 추가하기

플러그인은 플러그인에 대한 권한을 할당할 수 있는 기능을 지원합니다. `initAuthority` 인수가 제공되면 원하는 플러그인 권한 타입으로 권한이 설정됩니다. 할당되지 않은 경우 플러그인의 기본 권한 타입이 할당됩니다(다음 섹션).

**Create Plugin Helper**

`createPlugin()` 헬퍼는 `addPlugin()` 과정에서 플러그인을 할당할 수 있는 타입화된 메서드를 제공합니다.
플러그인의 전체 목록과 해당 인수는 [플러그인 개요](/ko/smart-contracts/core/plugins) 페이지를 참조하세요.

### 기본 권한으로 플러그인 추가하기

플러그인의 권한을 지정하지 않고 애셋이나 컬렉션에 플러그인을 추가하면 권한이 해당 플러그인의 기본 권한 타입으로 설정됩니다.

- 소유자 관리 플러그인은 `Owner`의 플러그인 권한 타입으로 기본 설정됩니다.
- 권한 관리 플러그인은 `UpdateAuthority`의 플러그인 권한 타입으로 기본 설정됩니다.
- 영구 플러그인은 `UpdateAuthority`의 플러그인 권한 타입으로 기본 설정됩니다.

{% dialect-switcher title="기본 권한으로 플러그인 추가하기" %}
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

### 할당된 권한으로 플러그인 추가하기

플러그인의 권한을 설정하는 데 도움이 되는 몇 가지 권한 헬퍼가 있습니다.

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

이는 플러그인의 권한을 특정 주소로 설정합니다.

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

이는 플러그인의 권한을 `Owner` 타입으로 설정합니다.
애셋의 현재 소유자가 이 플러그인에 액세스할 수 있습니다.

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

이는 플러그인의 권한을 `UpdateAuthority` 타입으로 설정합니다.
애셋의 현재 업데이트 권한이 이 플러그인에 액세스할 수 있습니다.

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

이는 플러그인의 권한을 `None` 타입으로 설정합니다.
플러그인의 데이터가 있다면 이 시점에서 불변이 됩니다.

{% dialect-switcher title="할당된 권한으로 플러그인 추가하기" %}
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

## 컬렉션에 플러그인 추가하기

Core 컬렉션에 플러그인을 추가하는 것은 Core 애셋에 추가하는 것과 유사합니다. 생성 중에 플러그인을 추가하거나 `addCollectionV1` 명령어를 사용할 수 있습니다. 컬렉션은 `Authority 플러그인`과 `Permanent 플러그인`에만 액세스할 수 있습니다.

### 기본 권한으로 컬렉션 플러그인 추가하기

{% dialect-switcher title="기본 권한으로 컬렉션 플러그인 추가하기" %}
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

### 할당된 권한으로 컬렉션 플러그인 추가하기

{% dialect-switcher title="애셋 소각하기" %}
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