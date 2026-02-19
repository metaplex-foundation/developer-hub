---
title: 集成 API
metaTitle: Genesis - 集成 API | 发行数据 | Metaplex
description: 通过 HTTP REST 端点和链上 SDK 方法访问 Genesis 发行数据。无需认证的公开 API。
created: '01-15-2025'
updated: '02-19-2026'
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

Genesis 集成 API 允许聚合器和应用程序查询 Genesis 代币发行的发行数据。通过 REST 端点访问元数据，或使用 SDK 获取实时链上状态。{% .lead %}

## 基础 URL

```
https://api.metaplex.com/v1
```

## 网络选择

默认情况下，API 返回 Solana 主网的数据。要查询开发网发行，请添加 `network` 查询参数：

```
?network=solana-devnet
```

**示例：**

```bash
# Mainnet (default)
curl https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN

# Devnet
curl "https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN?network=solana-devnet"
```

## 认证

无需认证。API 公开访问，有速率限制。

## 可用端点

| 方法 | 端点 | 描述 |
|--------|----------|-------------|
| `GET` | [`/launches/{genesis_pubkey}`](/smart-contracts/genesis/integration-apis/get-launch) | 通过 Genesis 地址获取发行数据 |
| `GET` | [`/tokens/{mint}`](/smart-contracts/genesis/integration-apis/get-launches-by-token) | 获取代币铸造的所有发行 |
| `GET` | [`/listings`](/smart-contracts/genesis/integration-apis/get-listings) | 获取活跃和即将到来的发行列表 |
| `GET` | [`/spotlight`](/smart-contracts/genesis/integration-apis/get-spotlight) | 获取精选推荐发行 |
| `POST` | [`/launches/create`](/smart-contracts/genesis/integration-apis/create-launch) | 为新发行构建链上交易 |
| `POST` | [`/launches/register`](/smart-contracts/genesis/integration-apis/register) | 注册已确认的发行以进行展示 |
| `CHAIN` | [`fetchBucketState`](/smart-contracts/genesis/integration-apis/fetch-bucket-state) | 从链上获取 bucket 状态 |
| `CHAIN` | [`fetchDepositState`](/smart-contracts/genesis/integration-apis/fetch-deposit-state) | 从链上获取存款状态 |

{% callout type="note" %}
`POST` 端点（`/launches/create` 和 `/launches/register`）配合使用以创建新的代币发行。对于大多数用例，[SDK API 客户端](/smart-contracts/genesis/sdk/api-client)提供了更简洁的接口，它封装了这两个端点。
{% /callout %}

## 错误码

| 状态码 | 描述 |
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
  status: 'upcoming' | 'live' | 'graduated';
  startTime: string;
  endTime: string;
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
    pub status: String,
    pub start_time: String,
    pub end_time: String,
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
将以下依赖项添加到您的 `Cargo.toml`：
```toml
[dependencies]
reqwest = { version = "0.12", features = ["json"] }
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
```
{% /callout %}
