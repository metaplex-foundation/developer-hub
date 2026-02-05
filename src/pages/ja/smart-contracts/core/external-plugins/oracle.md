---
title: Oracle Plugin
metaTitle: Oracle Plugin | Metaplex Core
description: Oracle Pluginを使用してCore NFTにカスタムバリデーションロジックを追加。外部アカウントの状態やカスタムルールに基づいて、転送、バーン、更新を制御します。
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
  - q: Oracle Pluginは転送を承認できますか？それとも拒否のみ？
    a: Oracle Pluginは拒否またはパスのみ可能です。他のPluginが拒否した転送を強制的に承認することはできません。
  - q: 時間ベースの転送制限を作成するにはどうすればよいですか？
    a: Oracle Accountをデプロイし、cronジョブを使用して特定の時間にバリデーション結果を更新します。
  - q: 1つのOracleを複数のAssetに使用できますか？
    a: はい。単一のOracleには静的なベースアドレスを使用するか、Collection全体のバリデーションにはPreconfiguredCollectionを使用したPDA導出を使用します。
  - q: OracleとFreeze Delegateの違いは何ですか？
    a: Freeze Delegateは組み込みでバイナリ（凍結/非凍結）です。Oracleはカスタムロジック（時間ベース、価格ベース、または実装する任意の条件）を可能にします。
  - q: OracleにはSolanaプログラムを書く必要がありますか？
    a: はい。Oracle Accountは正しい構造を持つSolanaアカウントである必要があります。AnchorまたはネイティブRustを使用できます。
---
**Oracle Plugin**は、Core Assetを外部Oracle Accountに接続してカスタムバリデーションロジックを実現します。時間、価格、所有権、または実装する任意のカスタムルールに基づいて、転送、バーン、更新を拒否できます。 {% .lead %}
{% callout title="学習内容" %}
- バリデーション用のOracle Accountの作成
- ライフサイクルチェックの設定（転送、更新、バーンの拒否）
- PDAベースのOracleアドレッシングの使用
- 時間ベースおよび条件ベースの制限のデプロイ
{% /callout %}
## 概要
**Oracle Plugin**は、外部Oracle Accountに対してライフサイクルイベントをバリデーションします。Oracle Accountはバリデーション結果を保存し、Coreプログラムがそれを読み取って操作を承認または拒否します。
- create、transfer、burn、updateイベントを拒否可能
- Oracle AccountはAssetの外部（あなたが管理）
- 動的：Oracle Accountを更新して動作を変更
- Asset単位またはオーナー単位のOracleのためのPDA導出をサポート
## 対象外
AppDataストレージ（[AppData Plugin](/ja/smart-contracts/core/external-plugins/app-data)を参照）、組み込みのフリーズ動作（[Freeze Delegate](/ja/smart-contracts/core/plugins/freeze-delegate)を参照）、およびオフチェーンOracleは対象外です。
## クイックスタート
**ジャンプ先:** [Oracle Accountの構造](#on-chain-oracle-account-structure) · [Oracleで作成](#creating-an-asset-with-the-oracle-plugin) · [Assetに追加](#adding-an-oracle-plugin-to-an-asset) · [デフォルトOracle](#default-oracles-deployed-by-metaplex)
1. バリデーションルールを持つOracle Accountをデプロイ
2. Oracle Plugin AdapterをAsset/Collectionに追加
3. ライフサイクルチェックを設定（どのイベントをバリデーションするか）
4. Oracle Accountを更新してバリデーション動作を動的に変更
## Oracle Pluginとは？
Oracle Pluginは、MPL Core AssetまたはCollectionとは別に、Authorityによって外部で作成されるオンチェーンアカウントです。AssetまたはCollectionでOracle Adapterが有効になり、Oracle Accountが割り当てられている場合、Oracle AccountはMPL Coreプログラムによってライフサイクルイベントに対するバリデーションのために読み込まれます。
Oracle Pluginは`create`、`transfer`、`burn`、`update`の4つのライフサイクルイベントに関連するデータを保存し、**Reject**バリデーションを実行するように設定できます。
Oracle Accountを更新・変更できることで、強力でインタラクティブなライフサイクル体験が可能になります。
## 対応状況
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |
## 許可されるバリデーション
Oracle AccountからOracle Pluginに以下のバリデーション結果を返すことができます。
|             |     |
| ----------- | --- |
| Can Approve | ❌  |
| Can Reject  | ✅  |
| Can Pass    | ❌  |
## オンチェーンOracle Accountの構造
Oracle Accountは以下のオンチェーンアカウント構造を持つ必要があります。
{% dialect-switcher title="Oracle Accountのオンチェーンアカウント構造" %}
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
### Oracle Accountのオフセット
アカウント構造は、アカウントに必要なdiscriminatorサイズにより、アカウントフレームワーク（Anchor、Shankなど）間でわずかに異なります：
- `OracleValidation`構造体がOracle Accountのデータセクションの先頭にある場合、`ValidationResultsOffset`には`NoOffset`を選択します。
- Oracle Accountが`OracleValidation`構造体のみを含み、Anchorプログラムによって管理されている場合、Anchorアカウントdiscriminatorの後に構造体を配置できるように`ValidationResultsOffset`に`Anchor`を選択します。
- `OracleValidation`構造体がOracle Account内の他のオフセットにある場合、`Custom`オフセットを使用します。
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
## Oracle Accountの更新
Oracle Accountは作成者/開発者によって作成・維持されるため、`OracleValidation`構造体はいつでも更新でき、ライフサイクルを動的にすることができます。
## Oracle Adapter
Oracle Adapterは以下の引数とデータを受け入れます。
### オンチェーン構造体
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
### Oracle PluginのPDAの宣言
**Oracle Plugin Adapter**のデフォルトの動作は、アダプターに静的な`base_address`を提供し、アダプターがそこから読み取って結果のバリデーション結果を提供することです。
**Oracle Plugin Adapter**をより動的にしたい場合は、`base_address`として`program_id`を渡し、次に**Oracle Account**アドレスを指す1つ以上のPDAを導出するために使用できる`ExtraAccount`を渡すことができます。これにより、Oracle Adapterは複数の導出されたOracle Accountからデータにアクセスできます。`ExtraAccount`を使用する場合、他の高度な非PDA仕様も利用可能であることに注意してください。
#### ExtraAccountオプションのリスト
Collection内のすべてのAssetで同じ追加アカウントの例は`PreconfiguredCollection` PDAで、CollectionのPubkeyを使用してOracle Accountを導出します。より動的な追加アカウントの例は`PreconfiguredOwner` PDAで、オーナーのpubkeyを使用してOracle Accountを導出します。
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
## Oracle Pluginの作成と追加
### Oracle PluginでAssetを作成
{% dialect-switcher title="Oracle PluginでMPL Core Assetを作成" %}
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
### AssetにOracle Pluginを追加
{% dialect-switcher title="CollectionにOracle Pluginを追加" %}
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
### Oracle PluginでCollectionを作成
{% dialect-switcher title="Oracle PluginでCollectionを作成" %}
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
### CollectionにOracle Pluginを追加
{% dialect-switcher title="CollectionにOracle Pluginを追加" %}
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
## MetaplexがデプロイしたデフォルトのOracle
[Soulbound NFT](/ja/smart-contracts/core/guides/create-soulbound-nft-asset)のようなまれなケースでは、常にライフサイクルイベントを拒否または承認するOracleがあると便利な場合があります。そのために、以下のOracleがデプロイされており、誰でも使用できます：
- **Transfer Oracle**: 常に転送を拒否します。`AwPRxL5f6GDVajyE1bBcfSWdQT58nWMoS36A1uFtpCZY`
- **Update Oracle**: 常に更新を拒否します。`6cKyMV4toCVCEtvh6Sh5RQ1fevynvBDByaQP4ufz1Zj6`
- **Create Oracle**: 常に作成を拒否します。`2GhRFi9RhqmtEFWCwrAHC61Lti3jEKuCKPcZTfuujaGr`
## 使用例/アイデア
### 例1
**正午から深夜（UTC）の間、Assetを転送不可にする。**
- 任意のプログラムでオンチェーンOracle Pluginを作成します。
- 拒否バリデーションを行いたいライフサイクルイベントを指定して、Oracle Plugin AdapterをAssetまたはCollectionに追加します。
- 正午と深夜にOracle Pluginに書き込み更新を行い、バリデーションビットをtrue/false/trueに切り替えるcronを作成します。
### 例2
**フロア価格が$10以上で、Assetに「red hat」属性がある場合のみ更新可能。**
- 任意のプログラムでオンチェーンOracle Pluginを作成します。
- 拒否バリデーションを行いたいライフサイクルイベントを指定して、Oracle Plugin AdapterをAssetに追加します。
- 開発者は同じPRECONFIGURED_ASSETアカウントを導出するOracle Accountに書き込むことができるAnchorプログラムを作成します。
- 開発者はマーケットプレイスの価格を監視し、'Red Hat'トレイトを持つAssetの既知のハッシュリストを使用して、関連するOracle Accountを更新・書き込みするweb2スクリプトを作成します。
## 一般的なエラー
### `Oracle validation failed`
Oracle Accountが拒否を返しました。Oracle Accountの状態とバリデーションロジックを確認してください。
### `Oracle account not found`
Oracle Accountアドレスが無効か存在しません。ベースアドレスとPDA導出を確認してください。
### `Invalid results offset`
ValidationResultsOffsetがOracle Accountの構造と一致しません。Anchorプログラムには`Anchor`を、生のアカウントには`NoOffset`を使用してください。
## 注意事項
- Oracle Accountは外部です。あなたがデプロイして維持します
- バリデーションは読み取り専用です：CoreはOracleを読み取りますが、書き込みはしません
- cronジョブやイベントリスナーを使用してOracle状態を動的に更新します
- PDA導出により、Asset単位、オーナー単位、またはCollection単位のOracleが可能になります
## FAQ
### Oracle Pluginは転送を承認できますか？それとも拒否のみ？
Oracle Pluginは拒否またはパスのみ可能です。他のPluginが拒否した転送を強制的に承認することはできません。
### 時間ベースの転送制限を作成するにはどうすればよいですか？
Oracle Accountをデプロイし、cronジョブを使用して特定の時間にバリデーション結果を更新します。上記の例1を参照してください。
### 1つのOracleを複数のAssetに使用できますか？
はい。単一のOracleには静的なベースアドレスを使用するか、Collection全体のバリデーションには`PreconfiguredCollection`を使用したPDA導出を使用します。
### OracleとFreeze Delegateの違いは何ですか？
Freeze Delegateは組み込みでバイナリ（凍結/非凍結）です。Oracleはカスタムロジック（時間ベース、価格ベース、または実装する任意の条件）を可能にします。
### OracleにはSolanaプログラムを書く必要がありますか？
はい。Oracle Accountは正しい構造を持つSolanaアカウントである必要があります。AnchorまたはネイティブRustを使用できます。[Oracle Pluginの例](/ja/smart-contracts/core/guides/oracle-plugin-example)ガイドを参照してください。
## 用語集
| 用語 | 定義 |
|------|------------|
| **Oracle Account** | バリデーション結果を保存する外部Solanaアカウント |
| **Oracle Adapter** | Oracleを参照するAssetにアタッチされたPluginコンポーネント |
| **ValidationResultsOffset** | Oracle Account内のバリデーションデータを見つけるためのバイトオフセット |
| **ExtraAccount** | 動的なOracleアドレッシングのためのPDA導出設定 |
| **Lifecycle Check** | Oracleがバリデーションするイベントを指定する設定 |
## 関連ページ
- [External Plugins概要](/ja/smart-contracts/core/external-plugins/overview) - External Pluginの理解
- [AppData Plugin](/ja/smart-contracts/core/external-plugins/app-data) - バリデーションではなくデータストレージ
- [Oracle Pluginの例](/ja/smart-contracts/core/guides/oracle-plugin-example) - 完全な実装ガイド
- [Freeze Delegate](/ja/smart-contracts/core/plugins/freeze-delegate) - 組み込みのフリーズ代替機能
