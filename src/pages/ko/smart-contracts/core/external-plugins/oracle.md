---
title: 오라클 플러그인
metaTitle: 오라클 플러그인 | Core
description: 오라클 플러그인과 오라클 계정, 그리고 이들이 Core NFT Asset의 라이프사이클 이벤트와 어떻게 상호작용하는지 알아보세요.
---

<!-- 오라클 플러그인은 Core Asset과 Collection에서 사용되는 `외부 플러그인`으로 다음의 라이프사이클 이벤트를 `거부`하는 기능을 제공합니다:

- Create
- Transfer
- Update
- Burn

Asset 또는 Collection에 오라클 플러그인을 추가할 때 오라클 플러그인 어댑터는 Mpl Core Asset 외부의 오라클 계정을 저장하고 참조합니다. 이 외부 계정은 해당 시점에서 asset에 대한 라이프사이클 이벤트가 일어날 수 있는지 결정하기 위해 참조되고 호출됩니다. -->

## 오라클 플러그인이란?

오라클 플러그인은 MPL Core Asset 또는 Collection 외부에서 권한에 의해 생성된 온체인 계정입니다. Asset 또는 Collection에 오라클 어댑터가 활성화되고 오라클 계정이 할당되어 있으면, 오라클 계정이 MPL Core 프로그램에 의해 라이프사이클 이벤트에 대한 검증을 위해 로드됩니다.

오라클 플러그인은 `create`, `transfer`, `burn`, `update`의 4가지 라이프사이클 이벤트와 관련된 데이터를 저장하며 **거부** 검증을 수행하도록 구성할 수 있습니다.

오라클 계정을 업데이트하고 변경할 수 있는 능력은 강력하고 상호작용적인 라이프사이클 경험을 제공합니다.

## 호환성

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## 허용되는 검증

다음 검증 결과들이 오라클 계정에서 오라클 플러그인으로 반환될 수 있습니다.

|             |     |
| ----------- | --- |
| Can Approve | ❌  |
| Can Reject  | ✅  |
| Can Pass    | ❌  |

## 온체인 오라클 계정 구조

오라클 계정은 다음과 같은 온체인 계정 구조를 가져야 합니다.

{% dialect-switcher title="오라클 계정의 온체인 계정 구조" %}
{% dialect title="Anchor" id="rust-anchor" %}

```rust
#[account]
pub struct Validation {
    pub validation: OracleValidation,
}

impl Validation {
    pub fn size() -> usize {
        8 // anchor discriminator
        + 5 // validation
    }
}

pub enum OracleValidation {
    Uninitialized,
    V1 {
        create: ExternalValidationResult,
        transfer: ExternalValidationResult,
        burn: ExternalValidationResult,
        update: ExternalValidationResult,
    },
}

pub enum ExternalValidationResult {
    Approved,
    Rejected,
    Pass,
}
```

{% /dialect %}

{% dialect title="Shank" id="rust-shank" %}

```rust
#[account]
pub struct Validation {
    pub validation: OracleValidation,
}

impl Validation {
    pub fn size() -> usize {
        1 // shank discriminator
        + 5 // validation
    }
}

pub enum OracleValidation {
    V1 {
        create: ExternalValidationResult,
        transfer: ExternalValidationResult,
        burn: ExternalValidationResult,
        update: ExternalValidationResult,
    },
}

pub enum ExternalValidationResult {
    Approved,
    Rejected,
    Pass,
}
```

{% /dialect %}

{% /dialect-switcher %}

### 오라클 계정 오프셋

계정 구조는 계정에 필요한 구분자 크기로 인해 계정 프레임워크(Anchor, Shank 등)에 따라 약간 다릅니다:

- `OracleValidation` 구조체가 오라클 계정의 데이터 섹션 시작 부분에 위치한다면, `ValidationResultsOffset`에 대해 `NoOffset`을 선택하세요.
- 오라클 계정이 `OracleValidation` 구조체만 포함하지만 Anchor 프로그램에 의해 관리된다면, Anchor 계정 구분자 다음에서 구조체를 찾을 수 있도록 `ValidationResultsOffset`에 대해 `Anchor`를 선택하세요.
- `OracleValidation` 구조체가 오라클 계정의 다른 오프셋에 위치한다면, `Custom` 오프셋을 사용하세요.

{% dialect-switcher title="resultsOffset / result_offset" %}
{% dialect title="JavaScript" id="js" %}

```js
const resultsOffset: ValidationResultsOffset =
  | { type: 'NoOffset' }
  | { type: 'Anchor' }
  | { type: 'Custom'; offset: bigint };
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
pub enum ValidationResultsOffset {
    NoOffset,
    Anchor,
    Custom(u64),
}

```

{% /dialect %}

{% /dialect-switcher %}

## 오라클 계정 업데이트

오라클 계정은 생성자/개발자에 의해 생성되고 유지되기 때문에 `OracleValidation` 구조체는 언제든지 업데이트될 수 있어 라이프사이클을 동적으로 만들 수 있습니다.

## 오라클 어댑터

오라클 어댑터는 다음 인수와 데이터를 받습니다.

### 온체인 구조체

```rust
pub struct Oracle {
    /// 오라클의 주소, 또는 `pda` 옵션을 사용하는 경우
    /// PDA를 도출할 프로그램 ID
    pub base_address: Pubkey,
    /// 선택적 계정 사양 (`base_address`에서 도출된 PDA 또는 기타
    /// 사용 가능한 계정 사양). 이 구성을 사용하더라도
    /// 어댑터에 의해 지정된 오라클 계정은 여전히 하나뿐입니다.
    pub base_address_config: Option<ExtraAccount>,
    /// 오라클 계정에서의 검증 결과 오프셋.
    /// 기본값은 `ValidationResultsOffset::NoOffset`입니다
    pub results_offset: ValidationResultsOffset,
}
```

### 오라클 플러그인의 PDA 선언

**오라클 플러그인 어댑터**의 기본 동작은 어댑터에 정적 `base_address`를 제공하는 것으로, 어댑터가 이를 읽고 결과 검증 결과를 제공할 수 있습니다.

**오라클 플러그인 어댑터**를 더 동적으로 만들고 싶다면, `base_address`로 `program_id`를 전달하고 `ExtraAccount`를 사용할 수 있습니다. 이는 **오라클 계정** 주소를 가리키는 하나 이상의 PDA를 도출하는 데 사용할 수 있습니다. 이를 통해 오라클 어댑터가 여러 도출된 오라클 계정의 데이터에 접근할 수 있습니다. `ExtraAccount`를 사용할 때 다른 고급 비PDA 사양도 사용할 수 있습니다.

#### ExtraAccounts 옵션 목록

컬렉션의 모든 asset에 대해 동일한 추가 계정의 예는 컬렉션의 Pubkey를 사용하여 오라클 계정을 도출하는 `PreconfiguredCollection` PDA입니다. 더 동적인 추가 계정의 예는 소유자 pubkey를 사용하여 오라클 계정을 도출하는 `PreconfiguredOwner` PDA입니다.

```rust
pub enum ExtraAccount {
    /// 씨드 \["mpl-core"\]를 가진 프로그램 기반 PDA
    PreconfiguredProgram {
        /// 계정이 서명자인지
        is_signer: bool,
        /// 계정이 쓰기 가능한지
        is_writable: bool,
    },
    /// 씨드 \["mpl-core", collection_pubkey\]를 가진 컬렉션 기반 PDA
    PreconfiguredCollection {
        /// 계정이 서명자인지
        is_signer: bool,
        /// 계정이 쓰기 가능한지
        is_writable: bool,
    },
    /// 씨드 \["mpl-core", owner_pubkey\]를 가진 소유자 기반 PDA
    PreconfiguredOwner {
        /// 계정이 서명자인지
        is_signer: bool,
        /// 계정이 쓰기 가능한지
        is_writable: bool,
    },
    /// 씨드 \["mpl-core", recipient_pubkey\]를 가진 수령자 기반 PDA
    /// 라이프사이클 이벤트에 수령자가 없으면 도출이 실패합니다.
    PreconfiguredRecipient {
        /// 계정이 서명자인지
        is_signer: bool,
        /// 계정이 쓰기 가능한지
        is_writable: bool,
    },
    /// 씨드 \["mpl-core", asset_pubkey\]를 가진 asset 기반 PDA
    PreconfiguredAsset {
        /// 계정이 서명자인지
        is_signer: bool,
        /// 계정이 쓰기 가능한지
        is_writable: bool,
    },
    /// 사용자 지정 씨드를 기반으로 한 PDA
    CustomPda {
        /// PDA를 도출하는 데 사용되는 씨드
        seeds: Vec<Seed>,
        /// 외부 플러그인의 기본 주소/프로그램 ID가 아닌 경우의 프로그램 ID
        custom_program_id: Option<Pubkey>,
        /// 계정이 서명자인지
        is_signer: bool,
        /// 계정이 쓰기 가능한지
        is_writable: bool,
    },
    /// 직접 지정된 주소
    Address {
        /// 주소
        address: Pubkey,
        /// 계정이 서명자인지
        is_signer: bool,
        /// 계정이 쓰기 가능한지
        is_writable: bool,
    },
}
```

## 오라클 플러그인 생성 및 추가

### 오라클 플러그인과 함께 Asset 생성

{% dialect-switcher title="오라클 플러그인과 함께 MPL Core Asset 생성" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import {
  create,
  CheckResult
} from '@metaplex-foundation/mpl-core'

const collectionSigner = generateSigner(umi)

const oracleAccount = publicKey('11111111111111111111111111111111')

const asset = await create(umi, {
    ... CreateAssetArgs,
    plugins: [
        {
        type: 'Oracle',
        resultsOffset: {
          type: 'Anchor',
        },
        baseAddress: oracleAccount,
        lifecycleChecks: {
          update: [CheckResult.CAN_REJECT],
        },
        baseAddressConfig: undefined,
      },
    ],
  });.sendAndConfirm(umi)
```

{% /dialect  %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::CreateV2Builder,
    types::{
        ExternalCheckResult, ExternalPluginAdapterInitInfo, HookableLifecycleEvent, OracleInitInfo,
        ValidationResultsOffset
    },
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn create_asset_with_oracle_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let oracle_plugin = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_oracle_plugin_ix = CreateV2Builder::new()
    .asset(asset.pubkey())
    .payer(payer.pubkey())
    .name("My Asset".into())
    .uri("https://example.com/my-asset.json".into())
    .external_plugin_adapters(vec![ExternalPluginAdapterInitInfo::Oracle(OracleInitInfo {
        base_address: oracle_plugin,
        init_plugin_authority: None,
        lifecycle_checks: vec![
            (
                HookableLifecycleEvent::Transfer,
                ExternalCheckResult { flags: 4 },
            ),
        ],
        base_address_config: None,
        results_offset: Some(ValidationResultsOffset::Anchor),
    })])
    .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_oracle_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_oracle_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_oracle_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /dialect %}

{% /dialect-switcher %}

{% seperator h="6" /%}

<!-- {% seperator h="6" /%}

{% dialect-switcher title="lifecycleChecks / lifecycle_checks" %}
{% dialect title="JavaScript" id="js" %}

```js
const lifecycleChecks: LifecycleChecks =  {
    create: [CheckResult.CAN_REJECT],
    transfer: [CheckResult.CAN_REJECT],
    update: [CheckResult.CAN_REJECT],
    burn: [CheckResult.CAN_REJECT],
},
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
pub lifecycle_checks: Vec<(HookableLifecycleEvent, ExternalCheckResult)>,

pub enum HookableLifecycleEvent {
    Create,
    Transfer,
    Burn,
    Update,
}

pub struct ExternalCheckResult {
    pub flags: u32,
}
```

{% /dialect %}

{% /dialect-switcher %}

{% seperator h="6" /%}

{% dialect-switcher title="pda: ExtraAccount / extra_account" %}
{% dialect title="JavaScript" id="js" %}

```js
const pda: ExtraAccount =  {
    type: {
        "PreconfiguredProgram",
        | "PreconfiguredCollection",
        | "PreconfiguredOwner",
        | "PreconfiguredRecipient",
        | "PreconfiguredAsset",
    }
}

추가 프로퍼티를 받는 두 개의 추가 ExtraAccount 타입이 있습니다:

const pda: ExtraAccount = {
    type: 'CustomPda',
    seeds: [],
}

const pda: ExtraAccount = {
    type: 'Address',
    address: publickey("33333333333333333333333333333333") ,
}
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
pub pda: Option<ExtraAccount>

pub enum ExtraAccount {
    PreconfiguredProgram {
        is_signer: bool,
        is_writable: bool,
    },
    PreconfiguredCollection {
        is_signer: bool,
        is_writable: bool,
    },
    PreconfiguredOwner {
        is_signer: bool,
        is_writable: bool,
    },
    PreconfiguredRecipient {
        is_signer: bool,
        is_writable: bool,
    },
    PreconfiguredAsset {
        is_signer: bool,
        is_writable: bool,
    },
    CustomPda {
        seeds: Vec<Seed>,
        is_signer: bool,
        is_writable: bool,
    },
    Address {
        address: Pubkey,
        is_signer: bool,
        is_writable: bool,
    },
}
```

{% /dialect %}

{% /dialect-switcher %} -->

### Asset에 오라클 플러그인 추가하기

{% dialect-switcher title="Collection에 오라클 플러그인 추가하기" %}
{% dialect title="Javascript" id="js" %}

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

{% /dialect-switcher %}

### 오라클 플러그인과 함께 Collection 생성하기

{% dialect-switcher title="오라클 플러그인과 함께 Collection 생성하기" %}
{% dialect title="Javascript" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import {
  create,
  CheckResult
  } from '@metaplex-foundation/mpl-core'

const collectionSigner = generateSigner(umi)
const oracleAccount = publicKey('11111111111111111111111111111111')

const collection = await createCollection(umi, {
    ... CreateCollectionArgs,
    plugins: [
        {
        type: 'Oracle',
        resultsOffset: {
          type: 'Anchor',
        },
        baseAddress: oracleAccount,
        lifecycleChecks: {
          update: [CheckResult.CAN_REJECT],
        },
        baseAddressConfig: undefined,
      },
    ],
  });.sendAndConfirm(umi)
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
        .uri("https://example.com/my-collection.json".into())
        .external_plugin_adapters(vec![ExternalPluginAdapterInitInfo::Oracle(OracleInitInfo {
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

### Collection에 오라클 플러그인 추가하기

{% dialect-switcher title="Collection에 오라클 플러그인 추가하기" %}
{% dialect title="Javascript" id="js" %}

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
    instructions::AddCollectionExternalPluginAdapterV1Builder,
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

    let add_oracle_plugin_to_collection_ix = AddCollectionExternalPluginAdapterV1Builder::new()
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

## Metaplex에서 배포한 기본 오라클
[소울바운드 NFT](/ko/smart-contracts/core/guides/create-soulbound-nft-asset)와 같은 드문 경우에 라이프사이클 이벤트를 항상 거부하거나 승인하는 오라클이 유용할 수 있습니다. 이를 위해 다음 오라클들이 배포되어 있으며 누구나 사용할 수 있습니다:

- **Transfer Oracle**: 항상 전송을 거부합니다. `AwPRxL5f6GDVajyE1bBcfSWdQT58nWMoS36A1uFtpCZY`

- **Update Oracle**: 항상 업데이트를 거부합니다. `6cKyMV4toCVCEtvh6Sh5RQ1fevynvBDByaQP4ufz1Zj6`

- **Create Oracle**: 항상 생성을 거부합니다. `2GhRFi9RhqmtEFWCwrAHC61Lti3jEKuCKPcZTfuujaGr`

## 사용 예시/아이디어

### 예시 1

**정오-자정 UTC 시간 동안 전송이 불가능한 Asset.**

- 원하는 프로그램에서 온체인 오라클 플러그인을 생성합니다.
- 거부 검증을 원하는 라이프사이클 이벤트를 지정하여 Asset 또는 Collection에 오라클 플러그인 어댑터를 추가합니다.
- 정오와 자정에 오라클 플러그인에 쓰고 업데이트하여 비트 검증을 true/false/true로 전환하는 크론을 작성합니다.

### 예시 2

**바닥가가 $10 이상이고 asset에 "빨간 모자" 속성이 있는 경우에만 Asset을 업데이트할 수 있습니다.**

- 원하는 프로그램에서 온체인 오라클 플러그인을 생성합니다.
- 거부 검증을 원하는 라이프사이클 이벤트를 지정하여 Asset에 오라클 플러그인 어댑터를 추가합니다.
- 개발자는 동일한 PRECONFIGURED_ASSET 계정을 도출할 수 있는 오라클 계정에 쓸 수 있는 Anchor 프로그램을 작성합니다.
- 개발자는 마켓플레이스의 가격을 감시하고, '빨간 모자' 특성을 가진 Asset의 알려진 해시리스트와 함께 관련 오라클 계정을 업데이트하고 쓰는 web2 스크립트를 작성합니다.