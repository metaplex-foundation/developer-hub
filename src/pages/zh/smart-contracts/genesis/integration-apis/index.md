---
title: Integration APIs
metaTitle: Genesis - Integration APIs | 发行数据 | Metaplex
description: 通过HTTP REST端点和链上SDK方法访问Genesis发行数据。无需认证的公开API。
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - Genesis API
  - integration API
  - launch data
  - token queries
  - on-chain state
about:
  - API integration
  - Data aggregation
  - Launch information
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---

Genesis Integration APIs 允许聚合器和应用程序查询 Genesis 代币发行的发行数据。通过 REST 端点访问元数据，或使用 SDK 获取实时链上状态。 {% .lead %}

## 基础 URL

```
https://api.metaplex.com/v1
```

## 网络选择

默认情况下，API 返回 Solana 主网的数据。要查询 devnet 上的发行，请添加 `network` 查询参数：

```
?network=solana-devnet
```

**示例：**

```bash
# 主网（默认）
curl https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN

# Devnet
curl "https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN?network=solana-devnet"
```

## 认证

无需认证。API 是带有速率限制的公开 API。

## 可用端点

| 方法 | 端点 | 描述 |
|--------|----------|-------------|
| `GET` | [`/launches/{genesis_pubkey}`](/smart-contracts/genesis/integration-apis/get-launch) | 通过 genesis 地址获取发行数据 |
| `GET` | [`/tokens/{mint}`](/smart-contracts/genesis/integration-apis/get-launches-by-token) | 获取代币铸造的所有发行 |
| `GET` | [`/listings`](/smart-contracts/genesis/integration-apis/get-listings) | 获取活跃和即将到来的发行列表 |
| `GET` | [`/spotlight`](/smart-contracts/genesis/integration-apis/get-spotlight) | 获取精选聚焦发行 |
| `POST` | [`/register`](/smart-contracts/genesis/integration-apis/register) | 使用元数据注册新发行 |
| `CHAIN` | [`fetchBucketState`](/smart-contracts/genesis/integration-apis/fetch-bucket-state) | 从链上获取桶状态 |
| `CHAIN` | [`fetchDepositState`](/smart-contracts/genesis/integration-apis/fetch-deposit-state) | 从链上获取存款状态 |

## 错误代码

| 代码 | 描述 |
| --- | --- |
| `400` | 错误请求 - 无效参数 |
| `404` | 未找到发行或代币 |
| `429` | 超出速率限制 |
| `500` | 内部服务器错误 |

错误响应格式：

```json
{
  "error": {
    "message": "Launch not found"
  }
}
```

## 共享类型

### TypeScript

```ts
interface Launch {
  launchPage: string;
  type: string;
  genesisAddress: string;
}

interface BaseToken {
  address: string;
  name: string;
  symbol: string;
  image: string;
  description: string;
}

interface Socials {
  x?: string;
  telegram?: string;
  discord?: string;
}

interface ErrorResponse {
  error: {
    message: string;
  };
}
```

### Rust

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Launch {
    pub launch_page: String,
    #[serde(rename = "type")]
    pub launch_type: String,
    pub genesis_address: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BaseToken {
    pub address: String,
    pub name: String,
    pub symbol: String,
    pub image: String,
    pub description: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Socials {
    pub x: Option<String>,
    pub telegram: Option<String>,
    pub discord: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiError {
    pub message: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ErrorResponse {
    pub error: ApiError,
}
```

{% callout type="note" %}
在 `Cargo.toml` 中添加以下依赖：
```toml
[dependencies]
reqwest = { version = "0.11", features = ["json"] }
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
```
{% /callout %}
