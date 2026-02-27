---
title: API
metaTitle: Genesis - API | 发行数据 API | Metaplex
description: 通过 Genesis 地址或代币铸币地址查询 Genesis 发行数据的公共 API。无需身份验证。
created: '01-15-2025'
updated: '02-26-2026'
keywords:
  - Genesis API
  - launch data API
  - token metadata API
  - aggregator API
  - REST API
about:
  - API reference
  - Data aggregation
  - Launch queries
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
faqs:
  - q: 是否需要身份验证？
    a: 不需要。Genesis API 是公共的，带有速率限制。无需 API 密钥或身份验证。
  - q: 如果我只有代币铸币地址，应该使用哪个端点？
    a: 使用 /tokens/{mint} 获取该代币的所有发行活动。如果您有 Genesis 地址，请使用 /launches/{genesis_pubkey}。
  - q: 速率限制是多少？
    a: 速率限制用于防止滥用。如果您收到 429 响应，请降低请求频率。
  - q: 一个代币可以有多个发行活动吗？
    a: 可以。/tokens 端点返回一个发行活动数组，因为代币可以有多个活动。
---

Genesis API 允许聚合器和应用程序查询 Genesis 代币发行的数据。使用这些端点在您的应用中显示发行信息、代币元数据和社交链接。 {% .lead %}

{% callout title="学习内容" %}
本参考涵盖：
- 可用端点及其使用场景
- 请求/响应格式和示例
- TypeScript 和 Rust 类型定义
- 错误处理
{% /callout %}

## 概述

Genesis API 提供对发行数据的只读访问。通过 Genesis 地址或代币铸币地址进行查询。

- 带速率限制的公共 API（无需身份验证）
- 返回发行信息、代币元数据和社交链接
- 提供 TypeScript 和 Rust 类型
- 标准 REST 错误码

{% callout type="note" %}
该 API 是公共的，带有速率限制。无需身份验证。
{% /callout %}

## Base URL

```
https://api.metaplex.com/v1
```

## 使用场景

- **`/launches/{genesis_pubkey}`** - 当您有 Genesis 地址时使用，例如来自链上事件或交易日志。
- **`/tokens/{mint}`** - 当您只知道代币铸币地址时使用。返回与该代币关联的所有发行活动（一个代币可以有多个发行活动）。

## 端点

### 通过 Genesis 地址获取发行数据

```
GET /launches/{genesis_pubkey}
```

**请求示例：**

```
GET https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN
```

**响应：**

```json
{
  "data": {
    "launch": {
      "launchPage": "https://example.com/launch/mytoken",
      "mechanic": "launchpoolV2",
      "genesisAddress": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN",
      "spotlight": false,
      "startTime": "2026-01-15T14:00:00.000Z",
      "endTime": "2026-01-15T18:00:00.000Z",
      "status": "graduated",
      "heroUrl": "launches/abc123/hero.webp",
      "graduatedAt": "2026-01-15T18:05:00.000Z",
      "lastActivityAt": "2026-01-15T17:45:00.000Z",
      "type": "project"
    },
    "baseToken": {
      "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "name": "My Token",
      "symbol": "MTK",
      "image": "https://example.com/token-image.png",
      "description": "A community-driven token for the example ecosystem."
    },
    "website": "https://example.com",
    "socials": {
      "x": "https://x.com/mytoken",
      "telegram": "https://t.me/mytoken",
      "discord": "https://discord.gg/mytoken"
    }
  }
}
```

### 通过代币铸币地址获取发行数据

```
GET /tokens/{mint}
```

返回该代币的所有发行活动。响应格式相同，只是 `launches` 是一个数组。

**响应：**

```json
{
  "data": {
    "launches": [
      {
        "launchPage": "https://example.com/launch/mytoken",
        "mechanic": "launchpoolV2",
        "genesisAddress": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN",
        "spotlight": false,
        "startTime": "2026-01-15T14:00:00.000Z",
        "endTime": "2026-01-15T18:00:00.000Z",
        "status": "graduated",
        "heroUrl": "launches/abc123/hero.webp",
        "graduatedAt": "2026-01-15T18:05:00.000Z",
        "lastActivityAt": "2026-01-15T17:45:00.000Z",
        "type": "project"
      }
    ],
    "baseToken": {
      "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "name": "My Token",
      "symbol": "MTK",
      "image": "https://example.com/token-image.png",
      "description": "A community-driven token for the example ecosystem."
    },
    "website": "https://example.com",
    "socials": {
      "x": "https://x.com/mytoken",
      "telegram": "https://t.me/mytoken",
      "discord": "https://discord.gg/mytoken"
    }
  }
}
```

{% callout type="note" %}
查找 Genesis 公钥需要索引或 `getProgramAccounts`。如果您只有代币铸币地址，请改用 `/tokens` 端点。
{% /callout %}

## 错误

```json
{
  "error": {
    "code": 404,
    "message": "Launch not found"
  }
}
```

| 状态码 | 描述 |
| --- | --- |
| `400` | 错误请求 - 无效参数 |
| `404` | 未找到发行活动或代币 |
| `429` | 超出速率限制 |
| `500` | 服务器内部错误 |

## TypeScript 类型

```ts
interface Launch {
  launchPage: string;
  mechanic: string;
  genesisAddress: string;
  spotlight: boolean;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'live' | 'graduated' | 'ended';
  heroUrl: string | null;
  graduatedAt: string | null;
  lastActivityAt: string;
  type: 'project' | 'memecoin' | 'custom';
}

interface BaseToken {
  address: string;
  name: string;
  symbol: string;
  image: string;
  description: string;
}

interface Socials {
  x: string;
  telegram: string;
  discord: string;
}

interface LaunchResponse {
  data: {
    launch: Launch;
    baseToken: BaseToken;
    website: string;
    socials: Socials;
  };
}

interface TokenResponse {
  data: {
    launches: Launch[];
    baseToken: BaseToken;
    website: string;
    socials: Socials;
  };
}

interface ErrorResponse {
  error: {
    code: number;
    message: string;
  };
}
```

**示例：**

```ts
const response = await fetch(
  "https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
);
const { data }: LaunchResponse = await response.json();
console.log(data.baseToken.name); // "My Token"
```

## Rust 类型

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Launch {
    pub launch_page: String,
    pub mechanic: String,
    pub genesis_address: String,
    pub spotlight: bool,
    pub start_time: String,
    pub end_time: String,
    pub status: String,
    pub hero_url: Option<String>,
    pub graduated_at: Option<String>,
    pub last_activity_at: String,
    #[serde(rename = "type")]
    pub launch_type: String,
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
    pub x: String,
    pub telegram: String,
    pub discord: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LaunchData {
    pub launch: Launch,
    pub base_token: BaseToken,
    pub website: String,
    pub socials: Socials,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TokenData {
    pub launches: Vec<Launch>,
    pub base_token: BaseToken,
    pub website: String,
    pub socials: Socials,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LaunchResponse {
    pub data: LaunchData,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TokenResponse {
    pub data: TokenData,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiError {
    pub code: u16,
    pub message: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ErrorResponse {
    pub error: ApiError,
}
```

**示例：**

```rust
let response: LaunchResponse = reqwest::get(
    "https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
)
.await?
.json()
.await?;

println!("{}", response.data.base_token.name); // "My Token"
```

{% callout type="note" %}
将以下依赖添加到您的 `Cargo.toml`：
```toml
[dependencies]
reqwest = { version = "0.11", features = ["json"] }
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
```
{% /callout %}

## 常见问题

### 是否需要身份验证？
不需要。Genesis API 是公共的，带有速率限制。无需 API 密钥或身份验证。

### 如果我只有代币铸币地址，应该使用哪个端点？
使用 `/tokens/{mint}` 获取该代币的所有发行活动。如果您有 Genesis 地址，请使用 `/launches/{genesis_pubkey}`。

### 速率限制是多少？
速率限制用于防止滥用。如果您收到 429 响应，请降低请求频率。

### 一个代币可以有多个发行活动吗？
可以。`/tokens` 端点返回一个发行活动数组，因为代币可以有多个活动（使用不同的 `genesisIndex` 值）。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Genesis Address** | 标识特定发行活动的 PDA |
| **Base Token** | 正在发行的代币 |
| **Launch Page** | 用户可以参与发行的 URL |
| **Mechanic** | 使用的机制（launchpoolV2、presaleV2 等） |
| **Launch Type** | 发行的类型（project、memecoin、custom） |
| **Socials** | 与代币关联的社交媒体链接 |

## 下一步

- [JavaScript SDK](/zh/smart-contracts/genesis/sdk/javascript) - 以编程方式访问 Genesis
- [Aggregation API](/zh/smart-contracts/genesis/aggregation) - 更多 API 详情和链上获取
- [开始使用](/zh/smart-contracts/genesis/getting-started) - 发行您自己的代币
