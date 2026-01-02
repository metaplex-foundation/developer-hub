---
title: Oracleプラグイン
metaTitle: Oracleプラグイン | Core
description: OracleプラグインとOracleアカウント、そしてCore NFTアセットのライフサイクルイベントとの関係を学びます。
---

## Oracleプラグインとは？

Oracleプラグインは、MPL Coreのアセット/コレクションとは別に、権限者が外部で作成するオンチェーンアカウントです。アセット/コレクションにOracleアダプターが有効化され、Oracleアカウントが割り当てられている場合、MPL Coreプログラムはライフサイクルイベントの検証時にそのOracleアカウントを読み込みます。

Oracleプラグインは、`create`、`transfer`、`burn`、`update`の4つのライフサイクルイベントに関連するデータを保持し、**Reject**（拒否）検証を実行するよう設定できます。

Oracleアカウントを更新して挙動を変えられるため、ダイナミックなライフサイクル体験が可能です。

## 対応状況

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## 許可される検証

OracleアカウントがOracleプラグインへ返せる検証結果は次のとおりです。

|             |     |
| ----------- | --- |
| Can Approve | ❌  |
| Can Reject  | ✅  |
| Can Pass    | ❌  |

## オンチェーンのOracleアカウント構造

Oracleアカウントは以下の構造を持つことを推奨します。

{% dialect-switcher title="Oracleアカウントのオンチェーン構造" %}
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

### Oracleアカウントのオフセット

アカウントフレームワーク（Anchor、Shankなど）によってディスクリミネーターのサイズが異なるため、アカウント構造はわずかに異なります。

- `OracleValidation`構造体がOracleアカウントのデータ先頭にある場合、`ValidationResultsOffset`は`NoOffset`を選択します。
- Oracleアカウントが`OracleValidation`のみを保持し、Anchorプログラムにより管理される場合は、アカウントのディスクリミネーターの後ろに続くため、`ValidationResultsOffset`に`Anchor`を選択します。
- `OracleValidation`構造体が別の任意オフセットにある場合は、`Custom`を使用します。

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

## Oracleアカウントの更新

Oracleアカウントは作成者/開発者が管理するため、`OracleValidation`構造体をいつでも更新でき、ライフサイクルを動的に制御できます。

## Oracleアダプター

Oracleアダプターは以下の引数/データを受け取ります。

### オンチェーン構造

```rust
pub struct Oracle {
    /// `pda`オプションを使わない場合、Oracleのアドレス。
    /// `pda`オプションの場合はPDA導出元のプログラムID。
    pub base_address: Pubkey,
    /// 追加のアカウント指定（`base_address`から導出するPDAなど）。
    /// この設定を使っても、指定されるOracleアカウントは常に1つです。
    pub base_address_config: Option<ExtraAccount>,
    /// Oracleアカウント内の結果オフセット。
    /// 既定は `ValidationResultsOffset::NoOffset`
    pub results_offset: ValidationResultsOffset,
}
```

### OracleプラグインのPDAを指定

デフォルトでは、**Oracleプラグインアダプター**は静的な`base_address`を受け取り、そこから結果を読み出します。

より動的にしたい場合、`program_id`を`base_address`として渡し、`ExtraAccount`を指定して1つ以上のPDAを導出し、**Oracleアカウント**を指すことができます。これにより、Oracleアダプターは複数の派生Oracleアカウントのデータへアクセスできます。`ExtraAccount`にはPDA以外の高度な指定方法もあります。

#### ExtraAccountの主なオプション

すべてのアセットで共通のPDA例としては、コレクションのPubkeyから導出する`PreconfiguredCollection`があります。より動的な例としては、オーナーのpubkeyから導出する`PreconfiguredOwner`があります。

```rust
pub enum ExtraAccount {
    /// プログラムベースのPDA（シード: \["mpl-core"\]）
    PreconfiguredProgram {
        is_signer: bool,
        is_writable: bool,
    },
    /// コレクションベースのPDA（シード: \["mpl-core", collection_pubkey\]）
    PreconfiguredCollection {
        is_signer: bool,
        is_writable: bool,
    },
    /// オーナーベースのPDA（シード: \["mpl-core", owner_pubkey\]）
    PreconfiguredOwner {
        is_signer: bool,
        is_writable: bool,
    },
    /// 受取人ベースのPDA（シード: \["mpl-core", recipient_pubkey\]）
    /// ライフサイクルイベントに受取人がいない場合、導出は失敗します。
    PreconfiguredRecipient {
        is_signer: bool,
        is_writable: bool,
    },
    /// アセットベースのPDA（シード: \["mpl-core", asset_pubkey\]）
    PreconfiguredAsset {
        is_signer: bool,
        is_writable: bool,
    },
    /// 任意シードPDA
    CustomPda {
        seeds: Vec<Seed>,
        custom_program_id: Option<Pubkey>,
        is_signer: bool,
        is_writable: bool,
    },
    /// 直接アドレス指定
    Address {
        address: Pubkey,
        is_signer: bool,
        is_writable: bool,
    },
}
```

## Oracleプラグインの作成と追加

### Oracleプラグイン付きアセットの作成

{% dialect-switcher title="Oracle付きMPL Coreアセットの作成" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import { create, CheckResult } from '@metaplex-foundation/mpl-core'

const collectionSigner = generateSigner(umi)

const oracleAccount = publicKey('11111111111111111111111111111111')

const asset = await create(umi, {
  ... CreateAssetArgs,
  plugins: [
    {
      type: 'Oracle',
      resultsOffset: { type: 'Anchor' },
      baseAddress: oracleAccount,
      lifecycleChecks: { update: [CheckResult.CAN_REJECT] },
      baseAddressConfig: undefined,
    },
  ],
}).sendAndConfirm(umi)
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

### アセットへOracleプラグインを追加

{% dialect-switcher title="アセットへの追加" %}
{% dialect title="Javascript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin, CheckResult } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')
const oracleAccount = publicKey('22222222222222222222222222222222')

await addPlugin(umi, {
  asset,
  plugin: {
    type: 'Oracle',
    resultsOffset: { type: 'Anchor' },
    lifecycleChecks: { update: [CheckResult.CAN_REJECT] },
    baseAddress: oracleAccount,
  },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
// 省略（adding-external-plugins.mdの例を参照）
```

{% /dialect %}
{% /dialect-switcher %}

### Oracleプラグイン付きコレクションの作成

{% dialect-switcher title="コレクションの作成" %}
{% dialect title="Javascript" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import { createCollection, CheckResult } from '@metaplex-foundation/mpl-core'

const collectionSigner = generateSigner(umi)
const oracleAccount = publicKey('11111111111111111111111111111111')

const collection = await createCollection(umi, {
  ... CreateCollectionArgs,
  plugins: [
    {
      type: 'Oracle',
      resultsOffset: { type: 'Anchor' },
      baseAddress: oracleAccount,
      lifecycleChecks: { update: [CheckResult.CAN_REJECT] },
      baseAddressConfig: undefined,
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
// 省略（adding-external-plugins.mdの例を参照）
```

{% /dialect %}
{% /dialect-switcher %}

### コレクションへOracleプラグインを追加

{% dialect-switcher title="コレクションへの追加" %}
{% dialect title="Javascript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addCollectionPlugin, CheckResult } from '@metaplex-foundation/mpl-core'

const collection = publicKey('11111111111111111111111111111111')
const oracleAccount = publicKey('22222222222222222222222222222222')

await addCollectionPlugin(umi, {
  collection,
  plugin: {
    type: 'Oracle',
    resultsOffset: { type: 'Anchor' },
    lifecycleChecks: { update: [CheckResult.CAN_REJECT] },
    baseAddress: oracleAccount,
  },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
// 省略（adding-external-plugins.mdの例を参照）
```

{% /dialect %}
{% /dialect-switcher %}

## Metaplexが提供するデフォルトOracle

まれに、[ソウルバウンドNFT](/ja/smart-contracts/core/guides/create-soulbound-nft-asset)のように常に特定のイベントを拒否/承認するOracleが有用なケースがあります。そのために、次のOracleがデプロイされ、誰でも利用できます。

- **Transfer Oracle**: 移転を常に拒否。`AwPRxL5f6GDVajyE1bBcfSWdQT58nWMoS36A1uFtpCZY`
- **Update Oracle**: 更新を常に拒否。`6cKyMV4toCVCEtvh6Sh5RQ1fevynvBDByaQP4ufz1Zj6`
- **Create Oracle**: 作成を常に拒否。`2GhRFi9RhqmtEFWCwrAHC61Lti3jEKuCKPcZTfuujaGr`

## 例とアイデア

### 例1

「UTCで正午〜真夜中の間はアセットを譲渡不可にする」

- 任意のプログラムでオンチェーンのOracleプラグインを作成
- 拒否バリデーションを行いたいイベントを指定して、アセット/コレクションにOracleアダプターを追加
- 正午と真夜中にOracleプラグインのビットを切り替えるスクリプト/cronを用意

### 例2

「フロア価格が$10以上、かつアセットに“red hat”属性がある場合のみ更新可能」

- 任意のプログラムでオンチェーンのOracleプラグインを作成
- 拒否バリデーションを行いたいイベントを指定して、アセットにOracleアダプターを追加
- PRECONFIGURED_ASSETと同じ導出を行うAnchorプログラムを用意
- マーケットの価格を監視しつつ、“Red Hat”属性のハッシュリストに基づいて対象Oracleアカウントを更新するWeb2スクリプトを用意

