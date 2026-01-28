---
title: Oracle 插件
metaTitle: Oracle 插件 | Metaplex Core
description: 使用外部验证构建动态 NFT 行为。Oracle 插件根据自定义条件拒绝 Asset 转移、更新、销毁和创建。
---

**Oracle 插件**为 Core Assets 和 Collections 添加外部链上验证。通过引用由权限控制的单独 Oracle 账户，根据自定义条件拒绝生命周期事件（转移、更新、销毁、创建）。{% .lead %}

{% callout title="您将学到" %}

- 向 Assets/Collections 添加 Oracle 插件
- 配置 Oracle 账户结构和偏移量
- 设置生命周期检查（转移/更新/销毁/创建）
- 使用 PDA 进行动态验证

{% /callout %}

## 摘要

**Oracle** 插件引用外部账户来验证生命周期事件。当发生生命周期事件（转移、更新、销毁、创建）时，MPL Core 程序加载 Oracle 账户并检查批准/拒绝状态。

- 通过外部验证拒绝生命周期事件
- Oracle 账户可随时更新（动态行为）
- 基于 PDA 的配置支持按 Asset/Owner/Collection 验证
- 适用于灵魂绑定 NFT、条件转移等

## 超出范围

AppData 存储（参见 [AppData 插件](/zh/smart-contracts/core/external-plugins/app-data)）、内置插件验证（参见[插件概述](/zh/smart-contracts/core/plugins)）和链下验证逻辑。

## 快速开始

**跳转到：** [添加到 Asset](#向-asset-添加-oracle-插件) · [添加到 Collection](#向-collection-添加-oracle-插件) · [默认 Oracles](#metaplex-部署的默认-oracles)

1. 创建具有适当结构的 Oracle 账户（外部）
2. 向 Asset/Collection 添加 Oracle 插件适配器
3. 配置生命周期检查和结果偏移量
4. 更新 Oracle 账户以动态更改验证

## 什么是 Oracle 插件？

Oracle 插件是由权限在 MPL Core Asset 或 Collection 外部创建的链上账户。如果 Asset 或 Collection 启用了 Oracle 适配器并分配了 Oracle 账户，MPL Core 程序将加载 Oracle 账户以对生命周期事件进行验证。

Oracle 插件存储与 `create`、`transfer`、`burn` 和 `update` 这 4 个生命周期事件相关的数据，可以配置为执行 **Reject** 验证。

更新和更改 Oracle 账户的能力提供了强大的交互式生命周期体验。

## 适用于

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## 允许的验证

以下验证结果可以从 Oracle 账户返回到 Oracle 插件。

|             |     |
| ----------- | --- |
| Can Approve | ❌  |
| Can Reject  | ✅  |
| Can Pass    | ❌  |

## 链上 Oracle 账户结构

Oracle 账户应具有以下链上账户结构。

{% dialect-switcher title="Oracle 账户的链上账户结构" %}
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

由于账户所需的判别器大小不同，账户结构在不同账户框架（Anchor、Shank 等）之间会略有不同：

- 如果 `OracleValidation` 结构位于 Oracle 账户数据部分的开头，则为 `ValidationResultsOffset` 选择 `NoOffset`。
- 如果 Oracle 账户仅包含 `OracleValidation` 结构但由 Anchor 程序管理，则为 `ValidationResultsOffset` 选择 `Anchor`，以便结构可以位于 Anchor 账户判别器之后。
- 如果 `OracleValidation` 结构位于 Oracle 账户中的其他偏移量位置，请使用 `Custom` 偏移量。

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

由于 Oracle 账户由创建者/开发者创建和维护，`OracleValidation` 结构可以随时更新，允许生命周期是动态的。

## Oracle 适配器

Oracle 适配器接受以下参数和数据。

### 链上结构

```rust
pub struct Oracle {
    /// Oracle 的地址，或者如果使用 `pda` 选项，
    /// 则为用于派生 PDA 的程序 ID。
    pub base_address: Pubkey,
    /// 可选的账户规范（从 `base_address` 或其他
    /// 可用账户规范派生的 PDA）。请注意，即使使用此
    /// 配置，适配器仍然只指定一个 Oracle 账户。
    pub base_address_config: Option<ExtraAccount>,
    /// Oracle 账户中的验证结果偏移量。
    /// 默认值为 `ValidationResultsOffset::NoOffset`
    pub results_offset: ValidationResultsOffset,
}
```

### 声明 Oracle 插件的 PDA

**Oracle 插件适配器**的默认行为是向适配器提供一个静态 `base_address`，然后适配器可以从中读取并提供生成的验证结果。

如果您希望让 **Oracle 插件适配器**更加动态，您可以将 `program_id` 作为 `base_address` 传入，然后传入一个 `ExtraAccount`，可用于派生一个或多个指向 **Oracle 账户**地址的 PDA。这允许 Oracle 适配器从多个派生的 Oracle 账户访问数据。请注意，使用 `ExtraAccount` 时还有其他高级非 PDA 规范可用。

#### ExtraAccounts 选项列表

对于集合中所有资产都相同的额外账户示例是 `PreconfiguredCollection` PDA，它使用集合的 Pubkey 来派生 Oracle 账户。更动态的额外账户示例是 `PreconfiguredOwner` PDA，它使用所有者 pubkey 来派生 Oracle 账户。

```rust
pub enum ExtraAccount {
    /// 基于程序的 PDA，seeds 为 \["mpl-core"\]
    PreconfiguredProgram {
        /// 账户是签名者
        is_signer: bool,
        /// 账户可写
        is_writable: bool,
    },
    /// 基于集合的 PDA，seeds 为 \["mpl-core", collection_pubkey\]
    PreconfiguredCollection {
        /// 账户是签名者
        is_signer: bool,
        /// 账户可写
        is_writable: bool,
    },
    /// 基于所有者的 PDA，seeds 为 \["mpl-core", owner_pubkey\]
    PreconfiguredOwner {
        /// 账户是签名者
        is_signer: bool,
        /// 账户可写
        is_writable: bool,
    },
    /// 基于接收者的 PDA，seeds 为 \["mpl-core", recipient_pubkey\]
    /// 如果生命周期事件没有接收者，派生将失败。
    PreconfiguredRecipient {
        /// 账户是签名者
        is_signer: bool,
        /// 账户可写
        is_writable: bool,
    },
    /// 基于资产的 PDA，seeds 为 \["mpl-core", asset_pubkey\]
    PreconfiguredAsset {
        /// 账户是签名者
        is_signer: bool,
        /// 账户可写
        is_writable: bool,
    },
    /// 基于用户指定 seeds 的 PDA。
    CustomPda {
        /// 用于派生 PDA 的 seeds。
        seeds: Vec<Seed>,
        /// 如果不是外部插件的基地址/程序 ID，则为程序 ID。
        custom_program_id: Option<Pubkey>,
        /// 账户是签名者
        is_signer: bool,
        /// 账户可写
        is_writable: bool,
    },
    /// 直接指定的地址。
    Address {
        /// 地址。
        address: Pubkey,
        /// 账户是签名者
        is_signer: bool,
        /// 账户可写
        is_writable: bool,
    },
}
```

## 创建和添加 Oracle 插件

### 创建带有 Oracle 插件的 Asset

{% dialect-switcher title="创建带有 Oracle 插件的 MPL Core Asset" %}
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

### 向 Asset 添加 Oracle 插件

{% dialect-switcher title="向 Collection 添加 Oracle 插件" %}
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

### 创建带有 Oracle 插件的 Collection

{% dialect-switcher title="创建带有 Oracle 插件的 Collection" %}
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

### 向 Collection 添加 Oracle 插件

{% dialect-switcher title="向 Collection 添加 Oracle 插件" %}
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

## Metaplex 部署的默认 Oracles

在某些罕见情况下，如[灵魂绑定 NFT](/zh/smart-contracts/core/guides/create-soulbound-nft-asset)，拥有始终拒绝或批准生命周期事件的 Oracles 可能很有用。为此，以下 Oracles 已部署，任何人都可以使用：

- **Transfer Oracle**：始终拒绝转移。`AwPRxL5f6GDVajyE1bBcfSWdQT58nWMoS36A1uFtpCZY`

- **Update Oracle**：始终拒绝更新。`6cKyMV4toCVCEtvh6Sh5RQ1fevynvBDByaQP4ufz1Zj6`

- **Create Oracle**：始终拒绝创建。`2GhRFi9RhqmtEFWCwrAHC61Lti3jEKuCKPcZTfuujaGr`

## 示例用法/想法

### 示例 1

**资产在 UTC 时间中午到午夜期间不可转移。**

- 在您选择的程序中创建链上 Oracle 插件。
- 向 Asset 或 Collection 添加 Oracle 插件适配器，指定您希望进行拒绝验证的生命周期事件。
- 您编写一个 cron，在中午和午夜写入和更新您的 Oracle 插件，翻转位验证从 true/false/true。

### 示例 2

**只有当地板价高于 $10 且资产具有属性"红色帽子"时，才能更新资产。**

- 在您选择的程序中创建链上 Oracle 插件。
- 向 Asset 添加 Oracle 插件适配器，指定您希望进行拒绝验证的生命周期事件。
- 开发者编写可以写入 Oracle 账户的 Anchor 程序，派生相同的 PRECONFIGURED_ASSET 账户。
- 开发者编写 web2 脚本，监控市场上的价格，并使用已知的具有"Red Hat"特征的 Assets 哈希列表更新并写入相关的 Oracle 账户。

## 常见错误

### `Oracle account not found`

Oracle 基地址不存在或没有正确的结构。

### `Invalid validation offset`

在指定的偏移量处找不到 OracleValidation 结构。对于 Anchor 程序使用 `Anchor` 偏移量。

### `Lifecycle check rejected`

Oracle 账户为该生命周期事件返回 `Rejected`。

## 注意事项

- Oracles 只能拒绝，不能批准
- 更新 Oracle 账户会立即更改验证
- PreconfiguredAsset/Owner/Collection 支持按 Asset 验证
- Metaplex 部署的默认 Oracles 支持灵魂绑定 NFT

## FAQ

### Oracle 可以批准创建/转移/更新/销毁吗？

不能。Oracles **只能拒绝**。这是有意的安全设计——外部账户不能单方面批准生命周期事件。

### Oracle 账户在哪里创建？

Oracle 账户在 MPL Core 外部创建——通常在自定义 Anchor 程序中。它们必须遵循正确的 `OracleValidation` 结构。

### 我可以对不同的 Assets 进行不同的验证吗？

可以。使用 `PreconfiguredAsset`、`PreconfiguredOwner` 或 `CustomPda` 为每个 Asset 的验证派生唯一的 Oracle 账户。

### 如何创建灵魂绑定 NFT？

使用 Metaplex 的默认 Transfer Oracle (`AwPRxL5f6GDVajyE1bBcfSWdQT58nWMoS36A1uFtpCZY`) 始终拒绝转移。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Oracle** | 存储验证状态的外部链上账户 |
| **ValidationResultsOffset** | Oracle 账户中数据开始的位置（NoOffset、Anchor、Custom） |
| **ExternalCheckResult** | Rejected、Approved 或 Pass 验证结果 |
| **ExtraAccount** | 用于动态 Oracle 地址的 PDA 配置 |
| **生命周期事件** | 可验证的操作：create、transfer、update、burn |

## 相关页面

- [外部插件概述](/zh/smart-contracts/core/external-plugins/overview) - 理解外部插件
- [AppData 插件](/zh/smart-contracts/core/external-plugins/app-data) - 数据存储而非验证
- [创建灵魂绑定 NFT](/zh/smart-contracts/core/guides/create-soulbound-nft-asset) - 使用 Oracle 实现不可转移代币

---

*由 Metaplex Foundation 维护 · 最后验证于 2026 年 1 月 · 适用于 @metaplex-foundation/mpl-core*
