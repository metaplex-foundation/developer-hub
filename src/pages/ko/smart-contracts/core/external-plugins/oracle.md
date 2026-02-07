---
title: Oracle Plugin
metaTitle: Oracle Plugin | Metaplex Core
description: Oracle Plugin을 사용하여 Core NFT에 커스텀 검증 로직을 추가하세요. 외부 계정 상태 및 커스텀 규칙에 따라 전송, 소각, 업데이트를 제어합니다.
updated: '01-31-2026'
keywords:
  - Oracle plugin
  - custom validation
  - transfer restrictions
  - time-based rules
about:
  - Custom validation
  - Lifecycle controls
  - External accounts
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
faqs:
  - q: Oracle Plugin이 전송을 승인할 수 있나요, 아니면 거부만 가능한가요?
    a: Oracle Plugin은 거부하거나 통과만 가능합니다. 다른 Plugin이 거부한 전송을 강제로 승인할 수 없습니다.
  - q: 시간 기반 전송 제한은 어떻게 만드나요?
    a: Oracle 계정을 배포하고 cron 작업을 사용하여 특정 시간에 검증 결과를 업데이트하세요.
  - q: 하나의 Oracle을 여러 Asset에 사용할 수 있나요?
    a: 예. 단일 Oracle에는 정적 base address를 사용하거나, Collection 전체 검증을 위해 PreconfiguredCollection과 함께 PDA 파생을 사용하세요.
  - q: Oracle과 Freeze Delegate의 차이점은 무엇인가요?
    a: Freeze Delegate는 내장되어 있고 이진(frozen/unfrozen) 방식입니다. Oracle은 시간 기반, 가격 기반 또는 구현하는 모든 조건에 대한 커스텀 로직을 허용합니다.
  - q: Oracle을 위해 Solana 프로그램을 작성해야 하나요?
    a: 예. Oracle 계정은 올바른 구조를 가진 Solana 계정이어야 합니다. Anchor 또는 네이티브 Rust를 사용할 수 있습니다.
---
**Oracle Plugin**은 Core Asset을 커스텀 검증 로직을 위한 외부 Oracle 계정에 연결합니다. 시간, 가격, 소유권 또는 구현하는 모든 커스텀 규칙에 따라 전송, 소각 또는 업데이트를 거부할 수 있습니다. {% .lead %}
{% callout title="학습 내용" %}
- 검증을 위한 Oracle 계정 생성
- Lifecycle 검사 구성 (전송, 업데이트, 소각 거부)
- PDA 기반 Oracle 주소 지정 사용
- 시간 기반 및 조건 기반 제한 배포
{% /callout %}
## 요약
**Oracle Plugin**은 외부 Oracle 계정에 대해 Lifecycle 이벤트를 검증합니다. Oracle 계정은 Core 프로그램이 작업을 승인하거나 거부하기 위해 읽는 검증 결과를 저장합니다.
- create, transfer, burn, update 이벤트를 거부할 수 있음
- Oracle 계정은 Asset 외부에 있음 (사용자가 제어)
- 동적: Oracle 계정을 업데이트하여 동작 변경
- Asset별 또는 소유자별 Oracle을 위한 PDA 파생 지원
## 범위 외
AppData 저장소 ([AppData Plugin](/ko/smart-contracts/core/external-plugins/app-data) 참조), 내장 동결 동작 ([Freeze Delegate](/ko/smart-contracts/core/plugins/freeze-delegate) 참조), 오프체인 Oracle.
## 빠른 시작
**바로 가기:** [Oracle 계정 구조](#on-chain-oracle-account-structure) · [Oracle로 생성](#creating-an-asset-with-the-oracle-plugin) · [Asset에 추가](#adding-an-oracle-plugin-to-an-asset) · [기본 Oracle](#default-oracles-deployed-by-metaplex)
1. 검증 규칙이 있는 Oracle 계정 배포
2. Asset/Collection에 Oracle Plugin 어댑터 추가
3. Lifecycle 검사 구성 (검증할 이벤트)
4. 검증 동작을 동적으로 변경하기 위해 Oracle 계정 업데이트
## Oracle Plugin이란?
Oracle Plugin은 MPL Core Asset 또는 Collection 외부에서 Authority에 의해 생성되는 온체인 계정입니다. Asset 또는 Collection에 Oracle Adapter가 활성화되어 있고 Oracle Account가 할당되어 있으면, MPL Core 프로그램에서 Lifecycle 이벤트에 대한 검증을 위해 Oracle Account를 로드합니다.
Oracle Plugin은 `create`, `transfer`, `burn`, `update`의 4가지 Lifecycle 이벤트와 관련된 데이터를 저장하며 **Reject** 검증을 수행하도록 구성할 수 있습니다.
Oracle Account를 업데이트하고 변경할 수 있는 기능은 강력하고 대화형 Lifecycle 경험을 제공합니다.
## 호환 대상
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |
## 허용된 검증
다음 검증 결과가 Oracle Account에서 Oracle Plugin으로 반환될 수 있습니다.
|             |     |
| ----------- | --- |
| Can Approve | ❌  |
| Can Reject  | ✅  |
| Can Pass    | ❌  |
## 온체인 Oracle 계정 구조
Oracle Account는 다음과 같은 온체인 계정 구조를 가져야 합니다.
{% dialect-switcher title="Oracle Account의 온체인 계정 구조체" %}
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
### Oracle 계정 오프셋
계정 구조는 계정에 필요한 discriminator 크기로 인해 계정 프레임워크(Anchor, Shank 등)에 따라 약간 다릅니다:
- `OracleValidation` 구조체가 Oracle 계정의 데이터 섹션 시작 부분에 위치하면 `ValidationResultsOffset`에 `NoOffset`을 선택합니다.
- Oracle 계정에 `OracleValidation` 구조체만 포함되어 있지만 Anchor 프로그램에서 관리하는 경우, Anchor 계정 discriminator 다음에 구조체를 찾을 수 있도록 `ValidationResultsOffset`에 `Anchor`를 선택합니다.
- `OracleValidation` 구조체가 Oracle 계정의 다른 오프셋에 위치하면 `Custom` 오프셋을 사용합니다.
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
## Oracle 계정 업데이트
Oracle Account는 생성자/개발자가 생성하고 유지하므로 `OracleValidation` 구조체를 언제든지 업데이트하여 Lifecycle을 동적으로 만들 수 있습니다.
## Oracle Adapter
Oracle Adapter는 다음 인수와 데이터를 받습니다.
### 온체인 구조체
```rust
pub struct Oracle {
    /// The address of the oracle, or if using the `pda` option,
    /// a program ID from which to derive a PDA.
    pub base_address: Pubkey,
    /// Optional account specification (PDA derived from `base_address` or other
    /// available account specifications).  Note that even when this
    /// configuration is used there is still only one
    /// Oracle account specified by the adapter.
    pub base_address_config: Option<ExtraAccount>,
    /// Validation results offset in the Oracle account.
    /// Default is `ValidationResultsOffset::NoOffset`
    pub results_offset: ValidationResultsOffset,
}
```
### Oracle Plugin의 PDA 선언
**Oracle Plugin Adapter**의 기본 동작은 어댑터에 정적 `base_address`를 제공하여 어댑터가 읽고 결과 검증 결과를 제공하는 것입니다.
**Oracle Plugin Adapter**를 더 동적으로 사용하려면 `program_id`를 `base_address`로 전달한 다음 `ExtraAccount`를 전달할 수 있으며, 이를 사용하여 **Oracle Account** 주소를 가리키는 하나 이상의 PDA를 파생할 수 있습니다. 이를 통해 Oracle Adapter는 여러 파생된 Oracle Account의 데이터에 액세스할 수 있습니다. `ExtraAccount`를 사용할 때 다른 고급 비PDA 사양도 사용할 수 있습니다.
#### ExtraAccounts 옵션 목록
Collection의 모든 Asset에 대해 동일한 추가 계정의 예는 `PreconfiguredCollection` PDA로, Collection의 Pubkey를 사용하여 Oracle 계정을 파생합니다. 더 동적인 추가 계정의 예는 `PreconfiguredOwner` PDA로, 소유자 pubkey를 사용하여 Oracle 계정을 파생합니다.
```rust
pub enum ExtraAccount {
    /// Program-based PDA with seeds \["mpl-core"\]
    PreconfiguredProgram {
        /// Account is a signer
        is_signer: bool,
        /// Account is writable.
        is_writable: bool,
    },
    /// Collection-based PDA with seeds \["mpl-core", collection_pubkey\]
    PreconfiguredCollection {
        /// Account is a signer
        is_signer: bool,
        /// Account is writable.
        is_writable: bool,
    },
    /// Owner-based PDA with seeds \["mpl-core", owner_pubkey\]
    PreconfiguredOwner {
        /// Account is a signer
        is_signer: bool,
        /// Account is writable.
        is_writable: bool,
    },
    /// Recipient-based PDA with seeds \["mpl-core", recipient_pubkey\]
    /// If the lifecycle event has no recipient the derivation will fail.
    PreconfiguredRecipient {
        /// Account is a signer
        is_signer: bool,
        /// Account is writable.
        is_writable: bool,
    },
    /// Asset-based PDA with seeds \["mpl-core", asset_pubkey\]
    PreconfiguredAsset {
        /// Account is a signer
        is_signer: bool,
        /// Account is writable.
        is_writable: bool,
    },
    /// PDA based on user-specified seeds.
    CustomPda {
        /// Seeds used to derive the PDA.
        seeds: Vec<Seed>,
        /// Program ID if not the base address/program ID for the external plugin.
        custom_program_id: Option<Pubkey>,
        /// Account is a signer
        is_signer: bool,
        /// Account is writable.
        is_writable: bool,
    },
    /// Directly-specified address.
    Address {
        /// Address.
        address: Pubkey,
        /// Account is a signer
        is_signer: bool,
        /// Account is writable.
        is_writable: bool,
    },
}
```
## Oracle Plugin 생성 및 추가
### Oracle Plugin으로 Asset 생성
{% dialect-switcher title="Oracle Plugin이 있는 MPL Core Asset 생성" %}
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
There are two additional ExtraAccount types that take additional properties these are:
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
### Asset에 Oracle Plugin 추가
{% dialect-switcher title="Collection에 Oracle Plugin 추가" %}
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
### Oracle Plugin으로 Collection 생성
{% dialect-switcher title="Oracle Plugin으로 Collection 생성" %}
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
### Collection에 Oracle Plugin 추가
{% dialect-switcher title="Collection에 Oracle Plugin 추가" %}
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
## Metaplex에서 배포한 기본 Oracle
[Soulbound NFT](/ko/smart-contracts/core/guides/create-soulbound-nft-asset)와 같은 드문 경우에 항상 Lifecycle 이벤트를 거부하거나 승인하는 Oracle이 유용할 수 있습니다. 이를 위해 다음 Oracle이 배포되었으며 누구나 사용할 수 있습니다:
- **Transfer Oracle**: 항상 전송을 거부합니다. `AwPRxL5f6GDVajyE1bBcfSWdQT58nWMoS36A1uFtpCZY`
- **Update Oracle**: 항상 업데이트를 거부합니다. `6cKyMV4toCVCEtvh6Sh5RQ1fevynvBDByaQP4ufz1Zj6`
- **Create Oracle**: 항상 생성을 거부합니다. `2GhRFi9RhqmtEFWCwrAHC61Lti3jEKuCKPcZTfuujaGr`
## 사용 예시/아이디어
### 예시 1
**UTC 정오부터 자정까지 Asset을 전송할 수 없도록 합니다.**
- 선택한 프로그램에서 온체인 Oracle Plugin을 생성합니다.
- 거부 검증을 수행하려는 Lifecycle 이벤트를 지정하여 Asset 또는 Collection에 Oracle Plugin Adapter를 추가합니다.
- 정오와 자정에 true/false/true로 비트 검증을 전환하여 Oracle Plugin에 쓰고 업데이트하는 cron을 작성합니다.
### 예시 2
**바닥 가격이 $10 이상이고 Asset에 "red hat" 속성이 있는 경우에만 Asset을 업데이트할 수 있습니다.**
- 선택한 프로그램에서 온체인 Oracle Plugin을 생성합니다.
- 거부 검증을 수행하려는 Lifecycle 이벤트를 지정하여 Asset에 Oracle Plugin Adapter를 추가합니다.
- 개발자가 동일한 PRECONFIGURED_ASSET 계정을 파생하는 Oracle Account에 쓸 수 있는 Anchor 프로그램을 작성합니다.
- 개발자가 마켓플레이스의 가격을 모니터링하고 'Red Hat' 특성을 가진 Asset의 알려진 해시 목록과 함께 관련 Oracle Account를 업데이트하고 쓰는 web2 스크립트를 작성합니다.
## 일반적인 오류
### `Oracle validation failed`
Oracle 계정이 거부를 반환했습니다. Oracle 계정 상태와 검증 로직을 확인하세요.
### `Oracle account not found`
Oracle 계정 주소가 유효하지 않거나 존재하지 않습니다. base address와 모든 PDA 파생을 확인하세요.
### `Invalid results offset`
ValidationResultsOffset이 Oracle 계정 구조와 일치하지 않습니다. Anchor 프로그램에는 `Anchor`를, raw 계정에는 `NoOffset`을 사용하세요.
## 참고 사항
- Oracle 계정은 외부에 있습니다. 배포하고 유지 관리합니다
- 검증은 읽기 전용입니다: Core는 Oracle을 읽고 쓰지 않습니다
- cron 작업이나 이벤트 리스너를 사용하여 Oracle 상태를 동적으로 업데이트합니다
- PDA 파생을 통해 Asset별, 소유자별 또는 Collection별 Oracle이 가능합니다
## FAQ
### Oracle Plugin이 전송을 승인할 수 있나요, 아니면 거부만 가능한가요?
Oracle Plugin은 거부하거나 통과만 가능합니다. 다른 Plugin이 거부한 전송을 강제로 승인할 수 없습니다.
### 시간 기반 전송 제한은 어떻게 만드나요?
Oracle 계정을 배포하고 cron 작업을 사용하여 특정 시간에 검증 결과를 업데이트하세요. 위의 예시 1을 참조하세요.
### 하나의 Oracle을 여러 Asset에 사용할 수 있나요?
예. 단일 Oracle에는 정적 base address를 사용하거나, Collection 전체 검증을 위해 `PreconfiguredCollection`과 함께 PDA 파생을 사용하세요.
### Oracle과 Freeze Delegate의 차이점은 무엇인가요?
Freeze Delegate는 내장되어 있고 이진(frozen/unfrozen) 방식입니다. Oracle은 시간 기반, 가격 기반 또는 구현하는 모든 조건에 대한 커스텀 로직을 허용합니다.
### Oracle을 위해 Solana 프로그램을 작성해야 하나요?
예. Oracle 계정은 올바른 구조를 가진 Solana 계정이어야 합니다. Anchor 또는 네이티브 Rust를 사용할 수 있습니다. [Oracle Plugin 예시](/ko/smart-contracts/core/guides/oracle-plugin-example) 가이드를 참조하세요.
## 용어집
| 용어 | 정의 |
|------|------------|
| **Oracle Account** | 검증 결과를 저장하는 외부 Solana 계정 |
| **Oracle Adapter** | Oracle을 참조하는 Asset에 연결된 Plugin 컴포넌트 |
| **ValidationResultsOffset** | Oracle 계정에서 검증 데이터를 찾기 위한 바이트 오프셋 |
| **ExtraAccount** | 동적 Oracle 주소 지정을 위한 PDA 파생 구성 |
| **Lifecycle Check** | Oracle이 검증하는 이벤트를 지정하는 구성 |
## 관련 페이지
- [External Plugin 개요](/ko/smart-contracts/core/external-plugins/overview) - External Plugin 이해하기
- [AppData Plugin](/ko/smart-contracts/core/external-plugins/app-data) - 검증 대신 데이터 저장
- [Oracle Plugin 예시](/ko/smart-contracts/core/guides/oracle-plugin-example) - 완전한 구현 가이드
- [Freeze Delegate](/ko/smart-contracts/core/plugins/freeze-delegate) - 내장된 동결 대안
