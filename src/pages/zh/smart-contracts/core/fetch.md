---
title: 获取资产
metaTitle: 获取资产 | Metaplex Core
description: 了解如何在 Solana 上获取 Core NFT Asset 和 Collection。检索单个 Asset，按所有者或 Collection 查询，以及使用 DAS API 进行快速索引查询。
---

本指南展示如何使用 Metaplex Core SDK 从 Solana 区块链**获取 Core Asset 和 Collection**。检索单个 Asset，按所有者或 Collection 查询，或使用 DAS 进行索引查询。 {% .lead %}

{% callout title="学习内容" %}

- 按地址获取单个 Asset 或 Collection
- 按所有者、Collection 或更新权限查询 Asset
- 使用 DAS（Digital Asset Standard）API 进行快速索引查询
- 了解 GPA 与 DAS 的性能权衡

{% /callout %}

## 摘要

使用 SDK 辅助函数或 DAS API 获取 Core Asset 和 Collection。根据您的用例选择正确的方法：

- **单个 Asset/Collection**：使用公钥调用 `fetchAsset()` 或 `fetchCollection()`
- **多个 Asset**：使用 `fetchAssetsByOwner()`、`fetchAssetsByCollection()` 或 `fetchAssetsByUpdateAuthority()`
- **DAS API**：使用索引查询以获得更快的性能（需要支持 DAS 的 RPC）

## 范围外

Token Metadata 获取（使用 mpl-token-metadata）、压缩 NFT 获取（使用 Bubblegum DAS 扩展）、以及链外元数据获取（直接获取 URI）。

## 快速开始

**跳转到：** [单个 Asset](#获取单个资产或集合) · [按所有者](#按所有者获取资产) · [按 Collection](#按集合获取资产) · [DAS API](#das---数字资产标准-api)

1. 安装：`npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. 使用您的 RPC 端点配置 Umi
3. 使用 Asset 地址调用 `fetchAsset(umi, publicKey)`
4. 访问 Asset 属性：`name`、`uri`、`owner`、`plugins`

## 前提条件

- **Umi** - 配置了 RPC 连接
- **Asset/Collection 地址** - 要获取的公钥
- **支持 DAS 的 RPC** - 用于索引查询（可选但推荐）

## 获取单个资产或集合

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

## 获取多个资产

可以使用 `getProgramAccounts`（GPA）调用获取多个 Asset，这在 RPC 方面可能相当昂贵且缓慢，或者使用 `Digital Asset Standard` API，它更快但需要[特定的 RPC 提供商](/zh/rpc-providers)。

### 按所有者获取资产

{% dialect-switcher title="按所有者获取资产" %}

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

### 按集合获取资产

{% dialect-switcher title="按集合获取资产" %}

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

### 按更新权限获取资产

要获取单个 Asset，可以使用以下函数：

{% dialect-switcher title="获取单个资产" %}
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

如果您使用支持 DAS 的 RPC，您将能够利用索引 Asset 进行快速获取和数据检索。

DAS 将索引所有内容，包括元数据、链外元数据、Collection 数据、插件（包括 Attributes）等。要了解有关 Metaplex DAS API 的更多信息，您可以[点击这里](/zh/dev-tools/das-api)。除了通用 DAS SDK 之外，还创建了 [MPL Core 扩展](/zh/dev-tools/das-api/core-extension)，可直接返回正确的类型以进一步与 MPL Core SDK 一起使用。它还会自动派生从 Collection 继承的 Asset 中的插件，并提供 DAS 到 Core 类型转换的函数。

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

公钥没有指向有效的 Core Asset。请验证：
- 地址正确且在预期的网络上（devnet vs mainnet）
- 账户存在且是 Core Asset（不是 Token Metadata）

### `RPC rate limit exceeded`

GPA 查询可能很昂贵。解决方案：
- 使用支持 DAS 的 RPC 进行索引查询
- 添加分页以限制结果
- 在适当的地方缓存结果

## 注意事项

- `fetchAsset` 返回包含从 Collection 派生的插件的完整 Asset
- 设置 `skipDerivePlugins: true` 以仅获取 Asset 级别的插件（更快）
- GPA 查询（`fetchAssetsByOwner` 等）在主网上可能很慢 - 推荐使用 DAS
- DAS 返回链外元数据；SDK 获取函数仅返回链上数据

## 快速参考

### 获取函数

| 函数 | 用例 |
|----------|----------|
| `fetchAsset(umi, publicKey)` | 按地址获取单个 Asset |
| `fetchCollection(umi, publicKey)` | 按地址获取单个 Collection |
| `fetchAssetsByOwner(umi, owner)` | 获取钱包拥有的所有 Asset |
| `fetchAssetsByCollection(umi, collection)` | 获取 Collection 中的所有 Asset |
| `fetchAssetsByUpdateAuthority(umi, authority)` | 按更新权限获取所有 Asset |

### DAS vs GPA 比较

| 功能 | GPA (getProgramAccounts) | DAS API |
|---------|--------------------------|---------|
| 速度 | 慢（扫描所有账户） | 快（已索引） |
| RPC 负载 | 高 | 低 |
| 链外元数据 | 无 | 有 |
| 需要特殊 RPC | 否 | 是 |

## FAQ

### 获取多个 Asset 时应该使用 GPA 还是 DAS？

尽可能使用 DAS。GPA 查询扫描所有程序账户，在主网上可能很慢且昂贵。DAS 提供更快的索引查询，并包含链外元数据。有关兼容端点，请参阅 [DAS RPC 提供商](/zh/rpc-providers)。

### 如何获取 Asset 的链外元数据？

`uri` 字段包含元数据 URL。单独获取它：

```ts
const asset = await fetchAsset(umi, assetAddress)
const metadata = await fetch(asset.uri).then(res => res.json())
```

### 我可以跨多个 Collection 获取 Asset 吗？

单个查询无法实现。分别获取每个 Collection 的 Asset 并合并结果，或使用带有自定义过滤器的 DAS。

### `skipDerivePlugins` 有什么用？

默认情况下，`fetchAsset` 将 Collection 级别的插件派生到 Asset 上。设置 `skipDerivePlugins: true` 会跳过此步骤，只返回 Asset 级别的插件。当您只需要 Asset 自己的插件或需要更快的获取时使用。

### 如何对大型结果集进行分页？

GPA 函数不支持内置分页。对于大型 Collection，使用支持 `page` 和 `limit` 参数的 DAS，或实现客户端分页。

## 术语表

| 术语 | 定义 |
|------|------------|
| **GPA** | getProgramAccounts - 查询程序拥有的所有账户的 Solana RPC 方法 |
| **DAS** | Digital Asset Standard - 用于快速 Asset 查询的索引 API |
| **派生插件** | 从 Collection 继承到 Asset 的插件 |
| **skipDerivePlugins** | 获取时跳过 Collection 插件派生的选项 |
| **链外元数据** | 存储在 Asset URI 的 JSON 数据（名称、图片、属性） |
| **链上数据** | 直接存储在 Solana 账户中的数据（所有者、插件、URI） |

---

*由 Metaplex Foundation 维护 · 最后验证于 2026 年 1 月 · 适用于 @metaplex-foundation/mpl-core*
