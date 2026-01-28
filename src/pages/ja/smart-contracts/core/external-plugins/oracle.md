---
title: Oracle プラグイン
metaTitle: Oracle プラグイン | Metaplex Core
description: Oracle プラグインで Core NFT にカスタム検証ロジックを追加します。時間、価格、所有権、またはカスタムルールに基づいて転送、バーン、更新を制御できます。
---

**Oracle プラグイン**は、Core Assets を外部の Oracle アカウントに接続してカスタム検証ロジックを実現します。時間、価格、所有権、または実装した任意のカスタムルールに基づいて転送、バーン、更新を拒否できます。{% .lead %}

{% callout title="学習内容" %}

- 検証用の Oracle アカウントを作成する
- ライフサイクルチェックを設定する（転送、更新、バーンの拒否）
- PDA ベースの Oracle アドレッシングを使用する
- 時間ベースおよび条件ベースの制限をデプロイする

{% /callout %}

## 概要

**Oracle プラグイン**は、外部の Oracle アカウントに対してライフサイクルイベントを検証します。Oracle アカウントには、Core プログラムが操作を承認または拒否するために読み取る検証結果が保存されています。

- create、transfer、burn、update イベントを拒否可能
- Oracle アカウントは Asset の外部（あなたが制御）
- 動的: Oracle アカウントを更新して動作を変更
- アセットごとまたはオーナーごとの Oracle 用の PDA 導出をサポート

## 対象外

AppData ストレージ（[AppData プラグイン](/ja/smart-contracts/core/external-plugins/app-data)を参照）、ビルトインのフリーズ動作（[Freeze Delegate](/ja/smart-contracts/core/plugins/freeze-delegate)を参照）、オフチェーン Oracle。

## クイックスタート

**ジャンプ先:** [Oracle アカウント構造](#on-chain-oracle-account-structure) · [Oracle 付きで作成](#creating-an-asset-with-the-oracle-plugin) · [Asset に追加](#adding-an-oracle-plugin-to-an-asset) · [デフォルト Oracle](#default-oracles-deployed-by-metaplex)

1. 検証ルールを持つ Oracle アカウントをデプロイ
2. Asset/Collection に Oracle プラグインアダプターを追加
3. ライフサイクルチェックを設定（どのイベントを検証するか）
4. Oracle アカウントを更新して検証動作を動的に変更

## Oracle プラグインとは？

Oracle プラグインは、MPL Core Asset や Collection とは別に、権限者が外部で作成するオンチェーンアカウントです。Asset や Collection に Oracle アダプターが有効化され、Oracle アカウントが割り当てられている場合、MPL Core プログラムはライフサイクルイベントの検証のためにその Oracle アカウントを読み込みます。

Oracle プラグインは `create`、`transfer`、`burn`、`update` の4つのライフサイクルイベントに関するデータを保存し、**Reject** 検証を実行するよう設定できます。

Oracle アカウントを更新・変更できる能力は、パワフルでインタラクティブなライフサイクル体験を提供します。

## 対応状況

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## 許可される検証

以下の検証結果を Oracle アカウントから Oracle プラグインに返すことができます。

|             |     |
| ----------- | --- |
| Can Approve | ❌  |
| Can Reject  | ✅  |
| Can Pass    | ❌  |

## On Chain Oracle Account Structure

Oracle アカウントは以下のオンチェーンアカウント構造を持つ必要があります。

{% dialect-switcher title="Oracle アカウントのオンチェーンアカウント構造" %}
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

### Oracle アカウントオフセット

アカウントに必要なディスクリミネーターサイズにより、アカウント構造はアカウントフレームワーク（Anchor、Shank など）によってわずかに異なります:

- `OracleValidation` 構造体が Oracle アカウントのデータセクションの先頭にある場合、`ValidationResultsOffset` には `NoOffset` を選択します。
- Oracle アカウントが `OracleValidation` 構造体のみを含み、Anchor プログラムで管理されている場合、Anchor アカウントディスクリミネーターの後に構造体を配置できるよう `ValidationResultsOffset` には `Anchor` を選択します。
- `OracleValidation` 構造体が Oracle アカウントの他のオフセットにある場合、`Custom` オフセットを使用します。

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

## Oracle アカウントの更新

Oracle アカウントは作成者/開発者によって作成・維持されるため、`OracleValidation` 構造体はいつでも更新でき、ライフサイクルを動的にすることができます。

## Oracle アダプター

Oracle アダプターは以下の引数とデータを受け取ります。

### オンチェーン構造

```rust
pub struct Oracle {
    /// Oracle のアドレス、または `pda` オプションを使用する場合は
    /// PDA を導出するプログラム ID。
    pub base_address: Pubkey,
    /// オプションのアカウント仕様（`base_address` から導出された PDA または
    /// 他の利用可能なアカウント仕様）。この設定を使用しても
    /// アダプターで指定される Oracle アカウントは1つだけです。
    pub base_address_config: Option<ExtraAccount>,
    /// Oracle アカウント内の検証結果オフセット。
    /// デフォルトは `ValidationResultsOffset::NoOffset`
    pub results_offset: ValidationResultsOffset,
}
```

### Oracle プラグインの PDA 宣言

**Oracle プラグインアダプター**のデフォルト動作は、アダプターに静的な `base_address` を提供し、そこから結果の検証結果を読み取ることです。

**Oracle プラグインアダプター**をより動的にしたい場合、`base_address` として `program_id` を渡し、**Oracle アカウント**アドレスを指す1つ以上の PDA を導出するために使用できる `ExtraAccount` を渡すことができます。これにより、Oracle アダプターは複数の導出された Oracle アカウントからデータにアクセスできます。`ExtraAccount` を使用する場合、他の高度な非 PDA 仕様も利用可能です。

#### ExtraAccounts オプションリスト

コレクション内のすべてのアセットで同じ追加アカウントの例は、コレクションの Pubkey を使用して Oracle アカウントを導出する `PreconfiguredCollection` PDA です。より動的な追加アカウントの例は、オーナーの pubkey を使用して Oracle アカウントを導出する `PreconfiguredOwner` PDA です。

```rust
pub enum ExtraAccount {
    /// シード \["mpl-core"\] を持つプログラムベースの PDA
    PreconfiguredProgram {
        /// アカウントは署名者
        is_signer: bool,
        /// アカウントは書き込み可能
        is_writable: bool,
    },
    /// シード \["mpl-core", collection_pubkey\] を持つコレクションベースの PDA
    PreconfiguredCollection {
        /// アカウントは署名者
        is_signer: bool,
        /// アカウントは書き込み可能
        is_writable: bool,
    },
    /// シード \["mpl-core", owner_pubkey\] を持つオーナーベースの PDA
    PreconfiguredOwner {
        /// アカウントは署名者
        is_signer: bool,
        /// アカウントは書き込み可能
        is_writable: bool,
    },
    /// シード \["mpl-core", recipient_pubkey\] を持つ受取人ベースの PDA
    /// ライフサイクルイベントに受取人がいない場合、導出は失敗します。
    PreconfiguredRecipient {
        /// アカウントは署名者
        is_signer: bool,
        /// アカウントは書き込み可能
        is_writable: bool,
    },
    /// シード \["mpl-core", asset_pubkey\] を持つアセットベースの PDA
    PreconfiguredAsset {
        /// アカウントは署名者
        is_signer: bool,
        /// アカウントは書き込み可能
        is_writable: bool,
    },
    /// ユーザー指定のシードに基づく PDA。
    CustomPda {
        /// PDA を導出するために使用されるシード。
        seeds: Vec<Seed>,
        /// 外部プラグインのベースアドレス/プログラム ID でない場合のプログラム ID。
        custom_program_id: Option<Pubkey>,
        /// アカウントは署名者
        is_signer: bool,
        /// アカウントは書き込み可能
        is_writable: bool,
    },
    /// 直接指定されたアドレス。
    Address {
        /// アドレス。
        address: Pubkey,
        /// アカウントは署名者
        is_signer: bool,
        /// アカウントは書き込み可能
        is_writable: bool,
    },
}
```

## Oracle プラグインの作成と追加

### Creating an Asset with the Oracle Plugin

{% dialect-switcher title="Oracle プラグイン付き MPL Core Asset の作成" %}
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

### Adding an Oracle Plugin to An Asset

{% dialect-switcher title="Collection への Oracle プラグイン追加" %}
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

### Oracle プラグイン付き Collection の作成

{% dialect-switcher title="Oracle プラグイン付き Collection の作成" %}
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

### Collection への Oracle プラグイン追加

{% dialect-switcher title="Collection への Oracle プラグイン追加" %}
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

## Default Oracles deployed by Metaplex

[ソウルバウンド NFT](/ja/smart-contracts/core/guides/create-soulbound-nft-asset)のように、特定のライフサイクルイベントを常に拒否または承認する Oracle が有用なまれなケースがあります。そのため、以下の Oracle がデプロイされており、誰でも使用できます:

- **Transfer Oracle**: 転送を常に拒否。`AwPRxL5f6GDVajyE1bBcfSWdQT58nWMoS36A1uFtpCZY`

- **Update Oracle**: 更新を常に拒否。`6cKyMV4toCVCEtvh6Sh5RQ1fevynvBDByaQP4ufz1Zj6`

- **Create Oracle**: 作成を常に拒否。`2GhRFi9RhqmtEFWCwrAHC61Lti3jEKuCKPcZTfuujaGr`

## 使用例/アイデア

### 例 1

**UTC 正午から深夜の間、Assets を転送不可にする。**

- 任意のプログラムでオンチェーン Oracle プラグインを作成。
- 拒否検証を行いたいライフサイクルイベントを指定して、Asset または Collection に Oracle プラグインアダプターを追加。
- 正午と深夜に Oracle プラグインに書き込み/更新し、ビット検証を true/false/true に切り替える cron を作成。

### 例 2

**フロア価格が $10 以上で、アセットに "red hat" 属性がある場合のみ、Assets を更新可能にする。**

- 任意のプログラムでオンチェーン Oracle プラグインを作成。
- 拒否検証を行いたいライフサイクルイベントを指定して、Asset に Oracle プラグインアダプターを追加。
- 開発者が同じ PRECONFIGURED_ASSET アカウントを導出できる Oracle アカウントに書き込める Anchor プログラムを作成。
- 開発者がマーケットプレイスの価格を監視し、'Red Hat' 特性を持つ既知の Assets ハッシュリストと共に関連する Oracle アカウントを更新・書き込みする web2 スクリプトを作成。

## よくあるエラー

### `Oracle validation failed`

Oracle アカウントが拒否を返しました。Oracle アカウントの状態と検証ロジックを確認してください。

### `Oracle account not found`

Oracle アカウントアドレスが無効または存在しません。ベースアドレスと PDA 導出を確認してください。

### `Invalid results offset`

ValidationResultsOffset が Oracle アカウント構造と一致しません。Anchor プログラムには `Anchor` を、生アカウントには `NoOffset` を使用してください。

## 注意事項

- Oracle アカウントは外部 - あなたがデプロイして維持する
- 検証は読み取り専用: Core は Oracle を読み取るが、書き込まない
- Oracle 状態を動的に更新するには cron ジョブまたはイベントリスナーを使用
- PDA 導出により、アセットごと、オーナーごと、またはコレクションごとの Oracle が可能

## FAQ

### Oracle プラグインは転送を承認できますか、それとも拒否のみですか？

Oracle プラグインは拒否またはパスのみ可能です。他のプラグインが拒否する転送を強制承認することはできません。

### 時間ベースの転送制限を作成するには？

Oracle アカウントをデプロイし、cron ジョブを使用して特定の時間に検証結果を更新します。上記の例 1 を参照してください。

### 複数の Assets に1つの Oracle を使用できますか？

はい。単一の Oracle には静的ベースアドレスを使用するか、コレクション全体の検証には `PreconfiguredCollection` を使用した PDA 導出を使用します。

### Oracle と Freeze Delegate の違いは？

Freeze Delegate はビルトインでバイナリ（凍結/非凍結）です。Oracle はカスタムロジックを可能にします - 時間ベース、価格ベース、または実装した任意の条件。

### Oracle 用に Solana プログラムを書く必要がありますか？

はい。Oracle アカウントは正しい構造を持つ Solana アカウントである必要があります。Anchor またはネイティブ Rust を使用できます。[Oracle プラグイン例](/ja/smart-contracts/core/guides/oracle-plugin-example)ガイドを参照してください。

## 用語集

| 用語 | 定義 |
|------|------|
| **Oracle アカウント** | 検証結果を保存する外部 Solana アカウント |
| **Oracle アダプター** | Oracle を参照する Asset にアタッチされるプラグインコンポーネント |
| **ValidationResultsOffset** | Oracle アカウント内の検証データを見つけるバイトオフセット |
| **ExtraAccount** | 動的 Oracle アドレッシング用の PDA 導出設定 |
| **ライフサイクルチェック** | Oracle が検証するイベントを指定する設定 |

## 関連ページ

- [外部プラグイン概要](/ja/smart-contracts/core/external-plugins/overview) - 外部プラグインの理解
- [AppData プラグイン](/ja/smart-contracts/core/external-plugins/app-data) - 検証の代わりにデータストレージ
- [Oracle プラグイン例](/ja/smart-contracts/core/guides/oracle-plugin-example) - 完全な実装ガイド
- [Freeze Delegate](/ja/smart-contracts/core/plugins/freeze-delegate) - ビルトインのフリーズ代替

---

*Metaplex Foundation によって管理 - 最終確認 2026年1月 - @metaplex-foundation/mpl-core に適用*
