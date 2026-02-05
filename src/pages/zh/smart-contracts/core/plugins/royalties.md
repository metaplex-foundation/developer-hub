---
title: Royalties Plugin
metaTitle: Royalties Plugin | Metaplex Core
description: Royalties Plugin 在 Core Assets 和 Collections 上强制执行创作者版税。设置基点、创作者分成以及市场合规的白名单/黑名单规则。
updated: '01-31-2026'
keywords:
  - NFT royalties
  - creator royalties
  - royalties plugin
  - basis points
  - marketplace royalties
about:
  - Royalty enforcement
  - Creator payments
  - Marketplace rules
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
faqs:
  - q: Core 版税是强制执行的吗？
    a: 是的，当使用白名单规则集时。只有白名单中的程序才能转移资产，确保版税得到支付。
  - q: Core 版税和 Token Metadata 版税有什么区别？
    a: Core 版税需要在 Asset 或 Collection 级别使用 Royalties Plugin，并可选择通过规则集强制执行。标准 Token Metadata NFT 版税仅为建议性质，依赖市场的配合。pNFTs（可编程 NFT）也支持类似于 Core 的基于规则集的强制执行。
  - q: 我可以为 Collection 中的每个 Asset 设置不同的版税吗？
    a: 可以。将 Royalties Plugin 添加到单个 Asset 即可覆盖 Collection 级别的设置。
  - q: 市场如何读取版税信息？
    a: 市场通过 DAS 或链上数据查询 Asset 的 Plugin。Royalties Plugin 数据包括基点、创作者和规则集。
  - q: 如果我不设置规则集会怎样？
    a: 使用 ruleSet('None')。任何程序都可以转移资产，版税仅为建议性质。
  - q: 铸造后可以更改版税吗？
    a: 可以。如果您有权限，可以使用 updatePlugin（用于 Assets）或 updateCollectionPlugin（用于 Collections）。
---
**Royalties Plugin** 在 Core Assets 的二次销售中强制执行创作者版税。它指定版税百分比、创作者分成，以及哪些程序（市场）被允许或禁止转移资产。 {% .lead %}
{% callout title="您将学到" %}
如何：
- 为 Assets 和 Collections 添加版税
- 配置基点和创作者分成
- 设置白名单和黑名单以控制市场访问
- 创建后更新版税
{% /callout %}
## 概述
**Royalties Plugin** 是一个由 Authority 管理的 Plugin，用于在 Core Assets 上强制执行版税。设置百分比（基点），分配给多个创作者，并可选择限制哪些程序可以转移资产。
- 将版税设置为基点（500 = 5%）
- 在最多 5 个创作者之间分配版税
- 使用白名单/黑名单控制市场访问
- 应用于 Asset 级别（单个）或 Collection 级别（所有资产）
## 不在范围内
Token Metadata 版税（不同的系统）、版税收取/分配（由市场处理）以及版税的法律强制执行。
## 快速开始
**跳转到：** [添加到 Asset](#adding-the-royalties-plugin-to-an-asset-code-example) · [添加到 Collection](#adding-the-royalties-plugin-to-a-collection-code-example) · [RuleSets](#rulesets) · [更新](#updating-the-royalties-plugin-on-an-asset)
1. 从 `@metaplex-foundation/mpl-core` 导入 `addPlugin`
2. 使用 `type: 'Royalties'`、`basisPoints`、`creators` 和 `ruleSet` 调用
3. 市场读取 Plugin 并在销售时强制执行版税
## 适用于
| 账户类型 | 支持 |
|--------------|-----------|
| MPL Core Asset | 是 |
| MPL Core Collection | 是 |
当同时应用于 Asset 和其 Collection 时，**Asset 级别的 Plugin 优先**。
## 参数
| 参数 | 类型 | 描述 |
|----------|------|-------------|
| basisPoints | number | 版税百分比（500 = 5%，1000 = 10%） |
| creators | Creator[] | 创作者地址及其百分比份额的数组 |
| ruleSet | RuleSet | 程序白名单、黑名单或无 |
## 基点
版税百分比以百分之一的百分比表示。
| 基点 | 百分比 |
|--------------|------------|
| 100 | 1% |
| 250 | 2.5% |
| 500 | 5% |
| 1000 | 10% |
示例：如果 `basisPoints` 为 500，Asset 以 1 SOL 出售，创作者总共获得 0.05 SOL。
## Creators
creators 数组定义谁接收版税以及如何分配。最多支持 5 个创作者。百分比必须加起来等于 100。
{% dialect-switcher title="Creators 数组" %}
{% dialect title="JavaScript" id="js" %}
```ts {% title="creators-array.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
const creators = [
  { address: publicKey('11111111111111111111111111111111'), percentage: 80 },
  { address: publicKey('22222222222222222222222222222222'), percentage: 20 },
]
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust {% title="creators_array.rs" %}
use mpl_core::types::Creator;
use solana_sdk::pubkey::Pubkey;
use std::str::FromStr;
let creators = vec![
    Creator {
        address: Pubkey::from_str("11111111111111111111111111111111").unwrap(),
        percentage: 80,
    },
    Creator {
        address: Pubkey::from_str("22222222222222222222222222222222").unwrap(),
        percentage: 20,
    },
];
```
{% /dialect %}
{% /dialect-switcher %}
## RuleSets
RuleSets 控制哪些程序可以转移带有版税的 Assets。使用它们通过限制转移到合规市场来强制执行版税。
### None（无限制）
任何程序都可以转移资产。版税仅为建议性质。
{% dialect-switcher title="RuleSet None" %}
{% dialect title="JavaScript" id="js" %}
```ts {% title="ruleset-none.ts" %}
import { ruleSet } from '@metaplex-foundation/mpl-core'
const rules = ruleSet('None')
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust {% title="ruleset_none.rs" %}
use mpl_core::types::RuleSet;
let rule_set = RuleSet::None;
```
{% /dialect %}
{% /dialect-switcher %}
### Allowlist（推荐用于强制执行）
只有列表中的程序才能转移。使用此选项限制为符合版税的市场。
{% dialect-switcher title="RuleSet Allowlist" %}
{% dialect title="JavaScript" id="js" %}
```ts {% title="ruleset-allowlist.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { ruleSet } from '@metaplex-foundation/mpl-core'
const rules = ruleSet('ProgramAllowList', [
  [
    publicKey('M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K'), // Magic Eden
    publicKey('TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN'), // Tensor
  ],
])
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust {% title="ruleset_allowlist.rs" %}
use mpl_core::types::RuleSet;
use solana_sdk::pubkey::Pubkey;
use std::str::FromStr;
let rule_set = RuleSet::ProgramAllowList(vec![
    Pubkey::from_str("M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K").unwrap(),
    Pubkey::from_str("TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN").unwrap(),
]);
```
{% /dialect %}
{% /dialect-switcher %}
### Denylist
除列表中的程序外，所有程序都可以转移。用于阻止已知的不合规市场。
{% dialect-switcher title="RuleSet DenyList" %}
{% dialect title="JavaScript" id="js" %}
```ts {% title="ruleset-denylist.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { ruleSet } from '@metaplex-foundation/mpl-core'
const rules = ruleSet('ProgramDenyList', [
  [
    publicKey('BadMarketplace111111111111111111111111111'),
  ],
])
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust {% title="ruleset_denylist.rs" %}
use mpl_core::types::RuleSet;
use solana_sdk::pubkey::Pubkey;
use std::str::FromStr;
let rule_set = RuleSet::ProgramDenyList(vec![
    Pubkey::from_str("BadMarketplace111111111111111111111111111").unwrap(),
]);
```
{% /dialect %}
{% /dialect-switcher %}
## 将 Royalties Plugin 添加到 Asset（代码示例）
{% dialect-switcher title="将 Royalties Plugin 添加到 Asset" %}
{% dialect title="JavaScript" id="js" %}
```ts {% title="add-royalties-to-asset.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin, ruleSet } from '@metaplex-foundation/mpl-core'
const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('22222222222222222222222222222222')
await addPlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'Royalties',
    basisPoints: 500, // 5%
    creators: [
      { address: creator1, percentage: 80 },
      { address: creator2, percentage: 20 },
    ],
    ruleSet: ruleSet('None'),
  },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust {% title="add_royalties_to_asset.rs" %}
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{Creator, Plugin, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn add_royalties_to_asset() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("AssetAddress111111111111111111111111111").unwrap();
    let creator = Pubkey::from_str("CreatorAddress11111111111111111111111111").unwrap();
    let add_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::Royalties(Royalties {
            basis_points: 500,
            creators: vec![Creator {
                address: creator,
                percentage: 100,
            }],
            rule_set: RuleSet::None,
        }))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let tx = Transaction::new_signed_with_payer(
        &[add_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client.send_and_confirm_transaction(&tx).await.unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## 将 Royalties Plugin 添加到 Collection（代码示例）
Collection 级别的版税适用于 Collection 中的所有 Assets，除非在 Asset 级别被覆盖。
{% dialect-switcher title="将 Royalties Plugin 添加到 Collection" %}
{% dialect title="JavaScript" id="js" %}
```ts {% title="add-royalties-to-collection.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { addCollectionPlugin, ruleSet } from '@metaplex-foundation/mpl-core'
const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('22222222222222222222222222222222')
await addCollectionPlugin(umi, {
  collection: collectionAddress,
  plugin: {
    type: 'Royalties',
    basisPoints: 500, // 5%
    creators: [
      { address: creator1, percentage: 80 },
      { address: creator2, percentage: 20 },
    ],
    ruleSet: ruleSet('None'),
  },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust {% title="add_royalties_to_collection.rs" %}
use mpl_core::{
    instructions::AddCollectionPluginV1Builder,
    types::{Creator, Plugin, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn add_royalties_to_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let collection = Pubkey::from_str("CollectionAddress111111111111111111111").unwrap();
    let creator1 = Pubkey::from_str("Creator1Address111111111111111111111111").unwrap();
    let creator2 = Pubkey::from_str("Creator2Address111111111111111111111111").unwrap();
    let add_plugin_ix = AddCollectionPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .plugin(Plugin::Royalties(Royalties {
            basis_points: 500,
            creators: vec![
                Creator { address: creator1, percentage: 80 },
                Creator { address: creator2, percentage: 20 },
            ],
            rule_set: RuleSet::None,
        }))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let tx = Transaction::new_signed_with_payer(
        &[add_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client.send_and_confirm_transaction(&tx).await.unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## 更新 Asset 上的 Royalties Plugin
修改现有 Asset 上的版税百分比、创作者或规则集。
{% dialect-switcher title="更新 Asset 上的 Royalties Plugin" %}
{% dialect title="JavaScript" id="js" %}
```ts {% title="update-royalties-asset.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, ruleSet } from '@metaplex-foundation/mpl-core'
await updatePlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'Royalties',
    basisPoints: 750, // Updated to 7.5%
    creators: [
      { address: creator1, percentage: 60 },
      { address: creator2, percentage: 40 },
    ],
    ruleSet: ruleSet('ProgramAllowList', [[marketplace1, marketplace2]]),
  },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust {% title="update_royalties_asset.rs" %}
use mpl_core::{
    instructions::UpdatePluginV1Builder,
    types::{Creator, Plugin, Royalties, RuleSet},
};
let update_ix = UpdatePluginV1Builder::new()
    .asset(asset)
    .payer(authority.pubkey())
    .plugin(Plugin::Royalties(Royalties {
        basis_points: 750,
        creators: vec![
            Creator { address: creator1, percentage: 60 },
            Creator { address: creator2, percentage: 40 },
        ],
        rule_set: RuleSet::None,
    }))
    .instruction();
```
{% /dialect %}
{% /dialect-switcher %}
## 更新 Collection 上的 Royalties Plugin
{% dialect-switcher title="更新 Collection 上的 Royalties Plugin" %}
{% dialect title="JavaScript" id="js" %}
```ts {% title="update-royalties-collection.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { updateCollectionPlugin, ruleSet } from '@metaplex-foundation/mpl-core'
await updateCollectionPlugin(umi, {
  collection: collectionAddress,
  plugin: {
    type: 'Royalties',
    basisPoints: 600, // Updated to 6%
    creators: [
      { address: creator1, percentage: 70 },
      { address: creator2, percentage: 30 },
    ],
    ruleSet: ruleSet('None'),
  },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% /dialect-switcher %}
## 常见错误
### `Creator percentages must sum to 100`
创作者百分比值加起来不等于 100。调整分配比例。
### `Authority mismatch`
只有 Plugin Authority 可以更新版税。确保您使用正确的密钥对签名。
### `Program not in allowlist`
转移被阻止，因为调用程序不在白名单中。添加该程序或切换到黑名单/无规则集。
## 注意事项
- Asset 级别的版税覆盖 Collection 级别的版税
- 创作者百分比必须正好加起来等于 100
- 使用白名单进行严格执行，黑名单提供灵活性
- 版税收取/分配由市场处理，而不是 Core 程序
## 快速参考
### 最小代码
```ts {% title="minimal-royalties.ts" %}
import { addPlugin, ruleSet } from '@metaplex-foundation/mpl-core'
await addPlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'Royalties',
    basisPoints: 500,
    creators: [{ address: creatorAddress, percentage: 100 }],
    ruleSet: ruleSet('None'),
  },
}).sendAndConfirm(umi)
```
### 基点参考
| 期望百分比 | 基点 |
|-----------|--------------|
| 2.5% | 250 |
| 5% | 500 |
| 7.5% | 750 |
| 10% | 1000 |
## 常见问题
### Core 版税是强制执行的吗？
是的，当使用白名单规则集时。只有白名单中的程序才能转移资产，确保版税得到支付。
### Core 版税和 Token Metadata 版税有什么区别？
Core 版税需要在 Asset 或 Collection 级别使用 Royalties Plugin，并可选择通过规则集强制执行。标准 Token Metadata NFT 版税仅为建议性质，依赖市场的配合。pNFTs（可编程 NFT）也支持类似于 Core 的基于规则集的强制执行。
### 我可以为 Collection 中的每个 Asset 设置不同的版税吗？
可以。将 Royalties Plugin 添加到单个 Asset 即可覆盖 Collection 级别的设置。
### 市场如何读取版税信息？
市场通过 DAS 或链上数据查询 Asset 的 Plugin。Royalties Plugin 数据包括基点、创作者和规则集。
### 如果我不设置规则集会怎样？
使用 `ruleSet('None')`。任何程序都可以转移资产，版税仅为建议性质。
### 铸造后可以更改版税吗？
可以。如果您有权限，可以使用 `updatePlugin`（用于 Assets）或 `updateCollectionPlugin`（用于 Collections）。
## 术语表
| 术语 | 定义 |
|------|------------|
| **Basis Points** | 以百分之一表示的版税百分比（500 = 5%） |
| **Creators** | 接收版税付款的地址数组 |
| **RuleSet** | 控制哪些程序可以转移的白名单/黑名单 |
| **Allowlist** | 只有列出的程序可以转移（严格执行） |
| **Denylist** | 除列出的程序外所有程序都可以转移 |
| **Authority** | 被允许更新 Plugin 的账户 |
