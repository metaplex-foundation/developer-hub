---
title: 获取 Asset
metaTitle: 获取 Asset | Metaplex Core
description: 学习如何在 Solana 上获取 Core NFT Asset 和 Collection。检索单个资产，按所有者或集合查询，使用 DAS API 进行快速索引查询。
updated: '01-31-2026'
keywords:
  - fetch NFT
  - query NFT
  - DAS API
  - get NFT by owner
  - mpl-core fetch
about:
  - NFT queries
  - DAS API
  - Asset retrieval
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
howToSteps:
  - 使用 npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi 安装 SDK
  - 使用您的 RPC 端点配置 Umi
  - 使用 Asset 地址调用 fetchAsset(umi, publicKey)
  - 访问 Asset 属性如 name、uri、owner、plugins
howToTools:
  - Node.js
  - Umi framework
  - mpl-core SDK
  - DAS-enabled RPC (optional)
faqs:
  - q: 获取多个 Asset 时应该使用 GPA 还是 DAS？
    a: 尽可能使用 DAS。GPA 查询扫描所有程序账户，在主网上可能很慢且昂贵。DAS 提供更快的索引查询，并包含链下元数据。
  - q: 如何获取 Asset 的链下元数据？
    a: uri 字段包含元数据 URL。在获取 Asset 后，使用标准 HTTP 请求单独获取它。
  - q: 我可以跨多个 Collection 获取 Asset 吗？
    a: 不能在单个查询中实现。分别获取每个 Collection 的 Asset 并合并结果，或使用带有自定义过滤器的 DAS。
  - q: skipDerivePlugins 有什么用？
    a: 默认情况下，fetchAsset 会将 Collection 级别的插件派生到 Asset。设置 skipDerivePlugins 为 true 会跳过此步骤，仅返回 Asset 级别的插件以实现更快的获取。
  - q: 如何对大型结果集进行分页？
    a: GPA 函数不支持内置分页。对于大型集合，使用支持 page 和 limit 参数的 DAS，或实现客户端分页。
---
本指南展示如何使用 Metaplex Core SDK 从 Solana 区块链**获取 Core Asset 和 Collection**。检索单个 Asset，按所有者或集合查询，或使用 DAS 进行索引查询。{% .lead %}
{% callout title="您将学到" %}
- 按地址获取单个 Asset 或 Collection
- 按所有者、集合或更新权限查询 Asset
- 使用 DAS（数字资产标准）API 进行快速索引查询
- 了解 GPA 与 DAS 的性能权衡
{% /callout %}
## 概要
使用 SDK 辅助函数或 DAS API 获取 Core Asset 和 Collection。根据您的用例选择正确的方法：
- **单个 Asset/Collection**：使用 `fetchAsset()` 或 `fetchCollection()` 配合公钥
- **多个 Asset**：使用 `fetchAssetsByOwner()`、`fetchAssetsByCollection()` 或 `fetchAssetsByUpdateAuthority()`
- **DAS API**：使用索引查询以获得更快的性能（需要启用 DAS 的 RPC）
## 超出范围
Token Metadata 获取（使用 mpl-token-metadata）、压缩 NFT 获取（使用 Bubblegum DAS 扩展）和链下元数据获取（直接获取 URI）。
## 快速开始
**跳转至：** [单个 Asset](#fetch-a-single-asset-or-collection) · [按所有者](#fetch-assets-by-owner) · [按集合](#fetch-assets-by-collection) · [DAS API](#das---digital-asset-standard-api)
1. 安装：`npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. 使用您的 RPC 端点配置 Umi
3. 使用 Asset 地址调用 `fetchAsset(umi, publicKey)`
4. 访问 Asset 属性：`name`、`uri`、`owner`、`plugins`
## 前置条件
- 配置了 RPC 连接的 **Umi**
- 要获取的 **Asset/Collection 地址**（公钥）
- **启用 DAS 的 RPC** 用于索引查询（可选但推荐）
## 获取单个 Asset 或 Collection
要获取单个 Asset，可以使用以下函数：
{% code-tabs-imported from="core/fetch-asset" frameworks="umi" /%}
{% seperator h="6" /%}
{% dialect-switcher title="获取 Core Collection" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { fetchCollection } from '@metaplex-foundation/mpl-core'
const asset = await fetchCollection(umi, collection.publicKey, {
  skipDerivePlugins: false,
})
console.log(asset)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```ts
use std::str::FromStr;
use mpl_core::Collection;
use solana_client::nonblocking::rpc_client;
use solana_sdk::pubkey::Pubkey;
pub async fn fetch_asset() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let collection_id = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let rpc_data = rpc_client.get_account_data(&collection_id).await.unwrap();
    let collection = Collection::from_bytes(&rpc_data).unwrap();
    print!("{:?}", collection)
}
```
{% /dialect %}
{% /dialect-switcher %}
## 获取多个 Asset
可以使用 `getProgramAccounts`（GPA）调用获取多个 Asset，这在 RPC 方面可能相当昂贵和缓慢，或者使用 `Digital Asset Standard` API，它更快但需要[特定的 RPC 提供商](/rpc-providers)。
### 按所有者获取 Asset
{% dialect-switcher title="按所有者获取 Asset" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { fetchAssetsByOwner } from '@metaplex-foundation/mpl-core'
const owner = publicKey('11111111111111111111111111111111')
const assetsByOwner = await fetchAssetsByOwner(umi, owner, {
  skipDerivePlugins: false,
})
console.log(assetsByOwner)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use std::str::FromStr;
use mpl_core::{accounts::BaseAssetV1, types::Key, ID as MPL_CORE_ID};
use solana_client::{
    nonblocking::rpc_client,
    rpc_config::{RpcAccountInfoConfig, RpcProgramAccountsConfig},
    rpc_filter::{Memcmp, MemcmpEncodedBytes, RpcFilterType},
};
use solana_sdk::pubkey::Pubkey;
pub async fn fetch_assets_by_owner() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let owner = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let rpc_data = rpc_client
        .get_program_accounts_with_config(
            &MPL_CORE_ID,
            RpcProgramAccountsConfig {
                filters: Some(vec![
                    RpcFilterType::Memcmp(Memcmp::new(
                        0,
                        MemcmpEncodedBytes::Bytes(vec![Key::AssetV1 as u8]),
                    )),
                    RpcFilterType::Memcmp(Memcmp::new(
                        1,
                        MemcmpEncodedBytes::Base58(owner.to_string()),
                    )),
                ]),
                account_config: RpcAccountInfoConfig {
                    encoding: None,
                    data_slice: None,
                    commitment: None,
                    min_context_slot: None,
                },
                with_context: None,
            },
        )
        .await
        .unwrap();
    let accounts_iter = rpc_data.into_iter().map(|(_, account)| account);
    let mut assets: Vec<BaseAssetV1> = vec![];
    for account in accounts_iter {
        let asset = BaseAssetV1::from_bytes(&account.data).unwrap();
        assets.push(asset);
    }
    print!("{:?}", assets)
}
```
{% /dialect %}
{% /dialect-switcher %}
### 按集合获取 Asset
{% dialect-switcher title="按集合获取 Asset" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { fetchAssetsByCollection } from '@metaplex-foundation/mpl-core'
const collection = publicKey('11111111111111111111111111111111')
const assetsByCollection = await fetchAssetsByCollection(umi, collection, {
  skipDerivePlugins: false,
})
console.log(assetsByCollection)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```ts
use mpl_core::{accounts::BaseAssetV1, types::Key, ID as MPL_CORE_ID};
use solana_client::{
    nonblocking::rpc_client,
    rpc_config::{RpcAccountInfoConfig, RpcProgramAccountsConfig},
    rpc_filter::{Memcmp, MemcmpEncodedBytes, RpcFilterType},
};
use solana_sdk::pubkey::Pubkey;
use std::str::FromStr;
pub async fn fetch_assets_by_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let rpc_data = rpc_client
        .get_program_accounts_with_config(
            &MPL_CORE_ID,
            RpcProgramAccountsConfig {
                filters: Some(vec![
                    RpcFilterType::Memcmp(Memcmp::new(
                        0,
                        MemcmpEncodedBytes::Bytes(vec![Key::AssetV1 as u8]),
                    )),
                    RpcFilterType::Memcmp(Memcmp::new(
                        34,
                        MemcmpEncodedBytes::Bytes(vec![2 as u8]),
                    )),
                    RpcFilterType::Memcmp(Memcmp::new(
                        35,
                        MemcmpEncodedBytes::Base58(collection.to_string()),
                    )),
                ]),
                account_config: RpcAccountInfoConfig {
                    encoding: None,
                    data_slice: None,
                    commitment: None,
                    min_context_slot: None,
                },
                with_context: None,
            },
        )
        .await
        .unwrap();
    let accounts_iter = rpc_data.into_iter().map(|(_, account)| account);
    let mut assets: Vec<BaseAssetV1> = vec![];
    for account in accounts_iter {
        let asset = BaseAssetV1::from_bytes(&account.data).unwrap();
        assets.push(asset);
    }
    print!("{:?}", assets)
}
```
{% /dialect %}
{% /dialect-switcher %}
### 按更新权限获取 Asset
要获取单个 Asset，可以使用以下函数：
{% dialect-switcher title="获取单个 Asset" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { fetchAssetsByUpdateAuthority } from '@metaplex-foundation/mpl-core'
const updateAuthority = publicKey('11111111111111111111111111111111')
const assetsByUpdateAuthority = await fetchAssetsByUpdateAuthority(
  umi,
  updateAuthority,
  { skipDerivePlugins: false }
)
console.log(assetsByUpdateAuthority)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```ts
pub async fn fetch_assets_by_update_authority() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let update_authority = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let rpc_data = rpc_client
        .get_program_accounts_with_config(
            &MPL_CORE_ID,
            RpcProgramAccountsConfig {
                filters: Some(vec![
                    RpcFilterType::Memcmp(Memcmp::new(
                        0,
                        MemcmpEncodedBytes::Bytes(vec![Key::AssetV1 as u8]),
                    )),
                    RpcFilterType::Memcmp(Memcmp::new(
                        34,
                        MemcmpEncodedBytes::Bytes(vec![1 as u8]),
                    )),
                    RpcFilterType::Memcmp(Memcmp::new(
                        35,
                        MemcmpEncodedBytes::Base58(update_authority.to_string()),
                    )),
                ]),
                account_config: RpcAccountInfoConfig {
                    encoding: None,
                    data_slice: None,
                    commitment: None,
                    min_context_slot: None,
                },
                with_context: None,
            },
        )
        .await
        .unwrap();
    let accounts_iter = rpc_data.into_iter().map(|(_, account)| account);
    let mut assets: Vec<BaseAssetV1> = vec![];
    for account in accounts_iter {
        let asset = BaseAssetV1::from_bytes(&account.data).unwrap();
        assets.push(asset);
    }
    print!("{:?}", assets)
}
```
{% /dialect %}
{% /dialect-switcher %}
## DAS - 数字资产标准 API
如果您使用启用了 DAS 的 RPC，您将能够利用索引 Asset 进行快速获取和数据检索。
DAS 将索引从元数据、链下元数据、集合数据、插件（包括 Attributes）等所有内容。要了解更多关于 Metaplex DAS API 的信息，您可以[访问Metaplex DAS API页面](/dev-tools/das-api)。除了通用的 DAS SDK，还创建了一个[针对 MPL Core 的扩展](/dev-tools/das-api/core-extension)，它直接返回正确的类型，以便进一步与 MPL Core SDK 一起使用。它还自动派生从集合继承的资产中的插件，并提供 DAS 到 Core 类型转换的函数。
以下是使用 DAS 获取 MPL Core Asset 返回数据的示例。
### FetchAsset 示例
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "result": {
    "authorities": [
      {
        "address": "Gi47RpRmg3wGsRRzFvcmyXHkELHznpx6DxEELGWBRWoC",
        "scopes": ["full"]
      }
    ],
    "burnt": false,
    "compression": {
      "asset_hash": "",
      "compressed": false,
      "creator_hash": "",
      "data_hash": "",
      "eligible": false,
      "leaf_id": 0,
      "seq": 0,
      "tree": ""
    },
    "content": {
      "$schema": "https://schema.metaplex.com/nft1.0.json",
      "files": [],
      "json_uri": "https://example.com/asset",
      "links": {},
      "metadata": {
        "name": "Test Asset",
        "symbol": ""
      }
    },
    "creators": [],
    "grouping": [
      {
        "group_key": "collection",
        "group_value": "8MPNmg4nyMGKdStSxbo2r2aoQGWz1pdjtYnQEt1kA2V7"
      }
    ],
    "id": "99A5ZcoaRSTGRigMpeu1u4wdgQsv6NgTDs5DR2Ug9TCQ",
    "interface": "MplCore",
    "mutable": true,
    "ownership": {
      "delegate": null,
      "delegated": false,
      "frozen": false,
      "owner": "Gi47RpRmg3wGsRRzFvcmyXHkELHznpx6DxEELGWBRWoC",
      "ownership_model": "single"
    },
    "plugins": {
      "FreezeDelegate": {
        "authority": {
          "Pubkey": {
            "address": "Gi47RpRmg3wGsRRzFvcmyXHkELHznpx6DxEELGWBRWoC"
          }
        },
        "data": {
          "frozen": false
        },
        "index": 0,
        "offset": 119
      }
    },
    "royalty": {
      "basis_points": 0,
      "locked": false,
      "percent": 0,
      "primary_sale_happened": false,
      "royalty_model": "creators",
      "target": null
    },
    "supply": null,
    "unknown_plugins": [
      {
        "authority": {
          "Pubkey": {
            "address": "Gi47RpRmg3wGsRRzFvcmyXHkELHznpx6DxEELGWBRWoC"
          }
        },
        "data": "CQA=",
        "index": 1,
        "offset": 121,
        "type": 9
      }
    ]
  }
}
```
## 常见错误
### `Asset not found`
公钥未指向有效的 Core Asset。请验证：
- 地址正确且在预期的网络上（devnet vs mainnet）
- 账户存在且是 Core Asset（不是 Token Metadata）
### `RPC rate limit exceeded`
GPA 查询可能很昂贵。解决方案：
- 使用启用 DAS 的 RPC 进行索引查询
- 添加分页以限制结果
- 在适当的地方缓存结果
## 注意事项
- `fetchAsset` 返回完整的 Asset，包括从 Collection 派生的插件
- 设置 `skipDerivePlugins: true` 仅获取 Asset 级别的插件（更快）
- GPA 查询（`fetchAssetsByOwner` 等）在主网上可能很慢——优先使用 DAS
- DAS 返回链下元数据；SDK 获取函数仅返回链上数据
## 快速参考
### 获取函数
| 函数 | 用例 |
|------|------|
| `fetchAsset(umi, publicKey)` | 按地址获取单个 Asset |
| `fetchCollection(umi, publicKey)` | 按地址获取单个 Collection |
| `fetchAssetsByOwner(umi, owner)` | 获取钱包拥有的所有 Asset |
| `fetchAssetsByCollection(umi, collection)` | 获取 Collection 中的所有 Asset |
| `fetchAssetsByUpdateAuthority(umi, authority)` | 按更新权限获取所有 Asset |
### DAS 与 GPA 比较
| 特性 | GPA (getProgramAccounts) | DAS API |
|------|--------------------------|---------|
| 速度 | 慢（扫描所有账户） | 快（索引） |
| RPC 负载 | 高 | 低 |
| 链下元数据 | 否 | 是 |
| 需要特殊 RPC | 否 | 是 |
## 常见问题
### 获取多个 Asset 时应该使用 GPA 还是 DAS？
尽可能使用 DAS。GPA 查询扫描所有程序账户，在主网上可能很慢且昂贵。DAS 提供更快的索引查询，并包含链下元数据。参见 [DAS RPC 提供商](/rpc-providers)了解兼容的端点。
### 如何获取 Asset 的链下元数据？
`uri` 字段包含元数据 URL。单独获取它：
```ts
const asset = await fetchAsset(umi, assetAddress)
const metadata = await fetch(asset.uri).then(res => res.json())
```
### 我可以跨多个 Collection 获取 Asset 吗？
不能在单个查询中实现。分别获取每个 Collection 的 Asset 并合并结果，或使用带有自定义过滤器的 DAS。
### `skipDerivePlugins` 有什么用？
默认情况下，`fetchAsset` 会将 Collection 级别的插件派生到 Asset。设置 `skipDerivePlugins: true` 会跳过此步骤，仅返回 Asset 自己的插件。当您只需要 Asset 自己的插件或想要更快的获取时使用此选项。
### 如何对大型结果集进行分页？
GPA 函数不支持内置分页。对于大型集合，使用支持 `page` 和 `limit` 参数的 DAS，或实现客户端分页。
## 术语表
| 术语 | 定义 |
|------|------|
| **GPA** | getProgramAccounts - 用于查询程序拥有的所有账户的 Solana RPC 方法 |
| **DAS** | 数字资产标准 - 用于快速资产查询的索引 API |
| **Derived Plugin** | 从 Collection 继承到 Asset 的插件 |
| **skipDerivePlugins** | 在获取期间跳过 Collection 插件派生的选项 |
| **链下元数据** | 存储在 Asset URI 中的 JSON 数据（name、image、attributes） |
| **链上数据** | 直接存储在 Solana 账户中的数据（owner、plugins、URI） |
