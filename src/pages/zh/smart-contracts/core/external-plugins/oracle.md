---
title: Oracle Plugin
metaTitle: Oracle Plugin | Metaplex Core
description: 使用 Oracle Plugin 为 Core NFT 添加自定义验证逻辑。基于外部账户状态和自定义规则控制转账、销毁和更新操作。
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
  - q: Oracle Plugin 可以批准转账吗，还是只能拒绝？
    a: Oracle Plugin 只能拒绝或通过。它们无法强制批准被其他 Plugin 拒绝的转账。
  - q: 如何创建基于时间的转账限制？
    a: 部署一个 Oracle 账户，并使用定时任务在特定时间更新验证结果。
  - q: 一个 Oracle 可以用于多个 Asset 吗？
    a: 可以。使用静态基地址用于单个 Oracle，或者使用 PDA 派生配合 PreconfiguredCollection 实现 Collection 范围的验证。
  - q: Oracle 和 Freeze Delegate 有什么区别？
    a: Freeze Delegate 是内置的二元状态（冻结/解冻）。Oracle 允许自定义逻辑——基于时间、价格或任何您实现的条件。
  - q: 使用 Oracle 需要编写 Solana 程序吗？
    a: 是的。Oracle 账户必须是具有正确结构的 Solana 账户。您可以使用 Anchor 或原生 Rust。
---
**Oracle Plugin** 将 Core Asset 连接到外部 Oracle 账户以实现自定义验证逻辑。基于时间、价格、所有权或任何您实现的自定义规则来拒绝转账、销毁或更新操作。{% .lead %}
{% callout title="您将学到" %}

- 创建用于验证的 Oracle 账户
- 配置生命周期检查（拒绝转账、更新、销毁）
- 使用基于 PDA 的 Oracle 寻址
- 部署基于时间和条件的限制
{% /callout %}

## 概要

**Oracle Plugin** 根据外部 Oracle 账户验证生命周期事件。Oracle 账户存储验证结果，Core 程序读取这些结果来批准或拒绝操作。

- 可以拒绝创建、转账、销毁和更新事件
- Oracle 账户在 Asset 外部（由您控制）
- 动态性：更新 Oracle 账户以改变行为
- 支持 PDA 派生，实现按 Asset 或按所有者的 Oracle

## 不在范围内

AppData 存储（参见 [AppData Plugin](/zh/smart-contracts/core/external-plugins/app-data)）、内置冻结行为（参见 [Freeze Delegate](/zh/smart-contracts/core/plugins/freeze-delegate)）以及链下 Oracle。

## 快速开始

**跳转至：** [Oracle 账户结构](#on-chain-oracle-account-structure) · [使用 Oracle 创建](#creating-an-asset-with-the-oracle-plugin) · [添加到 Asset](#adding-an-oracle-plugin-to-an-asset) · [默认 Oracle](#default-oracles-deployed-by-metaplex)

1. 部署带有验证规则的 Oracle 账户
2. 将 Oracle Plugin 适配器添加到 Asset/Collection
3. 配置生命周期检查（要验证哪些事件）
4. 更新 Oracle 账户以动态改变验证行为

## 什么是 Oracle Plugin？

Oracle Plugin 是由 Authority 在 MPL Core Asset 或 Collection 外部创建的链上账户。如果 Asset 或 Collection 启用了 Oracle Adapter 并分配了 Oracle Account，则 Oracle Account 将被 MPL Core 程序加载，用于对生命周期事件进行验证。
Oracle Plugin 存储与 4 个生命周期事件（`create`、`transfer`、`burn` 和 `update`）相关的数据，可以配置为执行 **Reject** 验证。
更新和更改 Oracle Account 的能力提供了强大的交互式生命周期体验。

## 适用于

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## 允许的验证

以下验证结果可以从 Oracle Account 返回到 Oracle Plugin。

|             |     |
| ----------- | --- |
| Can Approve | ❌  |
| Can Reject  | ✅  |
| Can Pass    | ❌  |

## 链上 Oracle 账户结构

Oracle Account 应具有以下链上账户结构。
{% dialect-switcher title="Oracle Account 的链上账户结构" %}
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

### Oracle 账户偏移量

由于账户所需的鉴别器大小不同，账户结构在不同账户框架（Anchor、Shank 等）之间会略有不同：

- 如果 `OracleValidation` 结构体位于 Oracle 账户数据部分的开头，则为 `ValidationResultsOffset` 选择 `NoOffset`。
- 如果 Oracle 账户仅包含 `OracleValidation` 结构体但由 Anchor 程序管理，请为 `ValidationResultsOffset` 选择 `Anchor`，以便结构体可以在 Anchor 账户鉴别器之后定位。
- 如果 `OracleValidation` 结构体位于 Oracle 账户的其他偏移位置，请使用 `Custom` 偏移量。
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

## 更新 Oracle 账户

因为 Oracle Account 由创建者/开发者创建和维护，`OracleValidation` 结构体可以随时更新，使生命周期具有动态性。

## Oracle Adapter

Oracle Adapter 接受以下参数和数据。

### 链上结构体

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

### 声明 Oracle Plugin 的 PDA

**Oracle Plugin Adapter** 的默认行为是为适配器提供一个静态 `base_address`，然后适配器可以从中读取并提供验证结果。
如果您希望使 **Oracle Plugin Adapter** 更具动态性，您可以将 `program_id` 作为 `base_address` 传入，然后传入一个 `ExtraAccount`，可用于派生一个或多个指向 **Oracle Account** 地址的 PDA。这允许 Oracle Adapter 访问来自多个派生 Oracle Account 的数据。请注意，使用 `ExtraAccount` 时还有其他高级的非 PDA 规范可用。

#### ExtraAccount 选项列表

对于 Collection 中所有 Asset 都相同的额外账户示例是 `PreconfiguredCollection` PDA，它使用 Collection 的 Pubkey 来派生 Oracle 账户。更动态的额外账户示例是 `PreconfiguredOwner` PDA，它使用所有者的 pubkey 来派生 Oracle 账户。

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

## 创建和添加 Oracle Plugin

### 使用 Oracle Plugin 创建 Asset

{% dialect-switcher title="使用 Oracle Plugin 创建 MPL Core Asset" %}
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
### 将 Oracle Plugin 添加到 Asset

{% dialect-switcher title="将 Oracle Plugin 添加到 Collection" %}
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

### 使用 Oracle Plugin 创建 Collection

{% dialect-switcher title="使用 Oracle Plugin 创建 Collection" %}
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

### 将 Oracle Plugin 添加到 Collection

{% dialect-switcher title="将 Oracle Plugin 添加到 Collection" %}
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

## Metaplex 部署的默认 Oracle

在某些罕见情况下，如 [灵魂绑定 NFT](/zh/smart-contracts/core/guides/create-soulbound-nft-asset)，可能需要始终拒绝或批准生命周期事件的 Oracle。为此，以下 Oracle 已部署，任何人都可以使用：

- **Transfer Oracle**：始终拒绝转账。`AwPRxL5f6GDVajyE1bBcfSWdQT58nWMoS36A1uFtpCZY`
- **Update Oracle**：始终拒绝更新。`6cKyMV4toCVCEtvh6Sh5RQ1fevynvBDByaQP4ufz1Zj6`
- **Create Oracle**：始终拒绝创建。`2GhRFi9RhqmtEFWCwrAHC61Lti3jEKuCKPcZTfuujaGr`

## 使用示例/想法

### 示例 1

**Asset 在 UTC 中午到午夜期间不可转账。**

- 在您选择的程序中创建链上 Oracle Plugin。
- 将 Oracle Plugin Adapter 添加到 Asset 或 Collection，指定您希望进行拒绝验证的生命周期事件。
- 编写一个定时任务，在中午和午夜写入和更新您的 Oracle Plugin，将验证位从 true/false/true 翻转。

### 示例 2

**只有当地板价高于 $10 且 Asset 具有 "red hat" 属性时才能更新。**

- 在您选择的程序中创建链上 Oracle Plugin。
- 将 Oracle Plugin Adapter 添加到 Asset，指定您希望进行拒绝验证的生命周期事件。
- 开发者编写 Anchor 程序，可以写入派生相同 PRECONFIGURED_ASSET 账户的 Oracle Account。
- 开发者编写 web2 脚本，监视市场价格，并根据已知的具有 'Red Hat' 特征的 Asset 哈希列表，更新和写入相关的 Oracle Account。

## 常见错误

### `Oracle validation failed`

Oracle 账户返回了拒绝。检查您的 Oracle 账户状态和验证逻辑。

### `Oracle account not found`

Oracle 账户地址无效或不存在。验证基地址和任何 PDA 派生。

### `Invalid results offset`

ValidationResultsOffset 与您的 Oracle 账户结构不匹配。Anchor 程序使用 `Anchor`，原始账户使用 `NoOffset`。

## 注意事项

- Oracle 账户是外部的。由您部署和维护
- 验证是只读的：Core 读取 Oracle，不写入
- 使用定时任务或事件监听器动态更新 Oracle 状态
- PDA 派生允许按 Asset、按所有者或按 Collection 的 Oracle

## 常见问题

### Oracle Plugin 可以批准转账吗，还是只能拒绝？

Oracle Plugin 只能拒绝或通过。它们无法强制批准被其他 Plugin 拒绝的转账。

### 如何创建基于时间的转账限制？

部署一个 Oracle 账户，并使用定时任务在特定时间更新验证结果。参见上面的示例 1。

### 一个 Oracle 可以用于多个 Asset 吗？

可以。使用静态基地址用于单个 Oracle，或者使用 PDA 派生配合 `PreconfiguredCollection` 实现 Collection 范围的验证。

### Oracle 和 Freeze Delegate 有什么区别？

Freeze Delegate 是内置的二元状态（冻结/解冻）。Oracle 允许自定义逻辑——基于时间、价格或任何您实现的条件。

### 使用 Oracle 需要编写 Solana 程序吗？

是的。Oracle 账户必须是具有正确结构的 Solana 账户。您可以使用 Anchor 或原生 Rust。参见 [Oracle Plugin 示例](/zh/smart-contracts/core/guides/oracle-plugin-example) 指南。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Oracle Account** | 存储验证结果的外部 Solana 账户 |
| **Oracle Adapter** | 附加到 Asset 的 Plugin 组件，引用 Oracle |
| **ValidationResultsOffset** | 在 Oracle 账户中定位验证数据的字节偏移量 |
| **ExtraAccount** | 用于动态 Oracle 寻址的 PDA 派生配置 |
| **Lifecycle Check** | 指定 Oracle 验证哪些事件的配置 |

## 相关页面

- [External Plugin 概述](/zh/smart-contracts/core/external-plugins/overview) - 了解 External Plugin
- [AppData Plugin](/zh/smart-contracts/core/external-plugins/app-data) - 数据存储而非验证
- [Oracle Plugin 示例](/zh/smart-contracts/core/guides/oracle-plugin-example) - 完整实现指南
- [Freeze Delegate](/zh/smart-contracts/core/plugins/freeze-delegate) - 内置冻结替代方案
