---
title: Aggregation API
metaTitle: Genesis - Aggregation API | 发行数据查询 | Metaplex
description: 用于通过 Genesis 地址或代币 Mint 查询 Genesis 发行数据的公共 API。包括链上状态获取。
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - Genesis API
  - aggregation API
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
faqs:
  - q: API 和链上获取有什么区别？
    a: API 返回聚合的元数据（社交链接、图片）。通过 SDK 进行链上获取则返回实时状态，如存款总额和时间条件。
  - q: 如何获取实时存款总额？
    a: 使用 Genesis SDK 中的 fetchLaunchPoolBucketV2 或 fetchPresaleBucketV2 来读取当前链上状态。
  - q: 可以查询 Bucket 的时间条件吗？
    a: 可以。获取 Bucket 账户并访问 depositStartCondition、depositEndCondition、claimStartCondition 和 claimEndCondition。
  - q: 如何检查用户是否已存款？
    a: 使用 safeFetchLaunchPoolDepositV2 或 safeFetchPresaleDepositV2 配合存款 PDA。如果不存在存款记录，则返回 null。
---

Genesis API 允许聚合器和应用程序查询 Genesis 代币发行的发行数据。使用这些端点在您的应用程序中显示发行信息、代币元数据和社交链接。 {% .lead %}

{% callout title="您将学到什么" %}
本参考文档涵盖：
- 用于发行元数据的 HTTP API 端点
- 使用 JavaScript SDK 获取链上状态
- TypeScript 和 Rust 类型定义
- 实时 Bucket 和存款状态
{% /callout %}

## 概要

通过 HTTP API 获取元数据，或通过 SDK 获取实时链上状态来访问 Genesis 数据。

- HTTP API 返回发行信息、代币元数据、社交链接
- SDK 提供实时状态：存款、计数、时间条件
- HTTP API 无需身份验证
- 链上获取需要 Umi 和 Genesis SDK

{% callout type="note" %}
该 API 是公开的，有速率限制。无需身份验证。
{% /callout %}

## Base URL

```
https://api.metaplex.com/v1
```

## 网络选择

默认情况下，API 返回 Solana 主网数据。要查询 devnet 上的发行数据，请添加 `network` 查询参数：

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

## 使用场景

- **`/launches/{genesis_pubkey}`** - 当您拥有 Genesis 地址时使用，例如来自链上事件或交易日志。
- **`/tokens/{mint}`** - 当您只知道代币 Mint 地址时使用。返回与该代币关联的所有发行活动（一个代币可以有多个发行活动）。

## 端点

### 通过 Genesis 地址获取发行信息

```
GET /launches/{genesis_pubkey}
```

**请求示例：**

```bash
curl https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN
```

**响应：**

```json
{
  "data": {
    "launch": {
      "launchPage": "https://example.com/launch/mytoken",
      "type": "launchpool",
      "genesisAddress": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
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

### 通过代币 Mint 获取发行信息

```
GET /tokens/{mint}
```

返回某个代币的所有发行活动。响应格式相同，只是 `launches` 是一个数组。

**请求示例：**

```bash
curl https://api.metaplex.com/v1/tokens/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
```

**响应：**

```json
{
  "data": {
    "launches": [
      {
        "launchPage": "https://example.com/launch/mytoken",
        "type": "launchpool",
        "genesisAddress": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
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
查找 Genesis 公钥需要索引或 `getProgramAccounts`。如果您只有代币 Mint，请使用 `/tokens` 端点。
{% /callout %}

## 错误

```json
{
  "error": {
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

## 类型与示例

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
在您的 `Cargo.toml` 中添加以下依赖：
```toml
[dependencies]
reqwest = { version = "0.11", features = ["json"] }
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
```
{% /callout %}

## 获取链上状态（JavaScript SDK）

除了 HTTP API，您还可以使用 Genesis JavaScript SDK 直接从区块链获取发行状态。这对于获取存款总额和时间条件等实时数据非常有用。

### Bucket 状态

```typescript
import { fetchLaunchPoolBucketV2 } from '@metaplex-foundation/genesis';

const bucket = await fetchLaunchPoolBucketV2(umi, launchPoolBucket);

console.log('Total deposits:', bucket.quoteTokenDepositTotal);
console.log('Deposit count:', bucket.depositCount);
console.log('Claim count:', bucket.claimCount);
console.log('Token allocation:', bucket.bucket.baseTokenAllocation);
```

### 时间条件

每个 Bucket 有四个时间条件来控制发行阶段：

```typescript
const bucket = await fetchLaunchPoolBucketV2(umi, launchPoolBucket);

// Deposit window
const depositStart = bucket.depositStartCondition.time;
const depositEnd = bucket.depositEndCondition.time;

// Claim window
const claimStart = bucket.claimStartCondition.time;
const claimEnd = bucket.claimEndCondition.time;

console.log('Deposit starts:', new Date(Number(depositStart) * 1000));
console.log('Deposit ends:', new Date(Number(depositEnd) * 1000));
console.log('Claims start:', new Date(Number(claimStart) * 1000));
console.log('Claims end:', new Date(Number(claimEnd) * 1000));
```

### 存款状态

```typescript
import {
  fetchLaunchPoolDepositV2,
  safeFetchLaunchPoolDepositV2,
} from '@metaplex-foundation/genesis';

// Throws if not found
const deposit = await fetchLaunchPoolDepositV2(umi, depositPda);

// Returns null if not found
const maybeDeposit = await safeFetchLaunchPoolDepositV2(umi, depositPda);

if (deposit) {
  console.log('Amount:', deposit.amountQuoteToken);
  console.log('Claimed:', deposit.claimed);
}
```

## 常见问题

### API 和链上获取有什么区别？
API 返回聚合的元数据（社交链接、图片）。通过 SDK 进行链上获取则返回实时状态，如存款总额和时间条件。

### 如何获取实时存款总额？
使用 Genesis SDK 中的 `fetchLaunchPoolBucketV2` 或 `fetchPresaleBucketV2` 来读取当前链上状态。

### 可以查询 Bucket 的时间条件吗？
可以。获取 Bucket 账户并访问 `depositStartCondition`、`depositEndCondition`、`claimStartCondition` 和 `claimEndCondition`。

### 如何检查用户是否已存款？
使用 `safeFetchLaunchPoolDepositV2` 或 `safeFetchPresaleDepositV2` 配合存款 PDA。如果不存在存款记录，则返回 null。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Aggregation** | 从多个来源收集和标准化数据 |
| **Bucket 状态** | 当前链上数据，包括存款总额和计数 |
| **时间条件** | 控制某个阶段开始或结束的 Unix 时间戳 |
| **存款 PDA** | 存储用户存款记录的程序派生地址 |
| **safeFetch** | 对于缺失账户返回 null 而非抛出错误的获取变体 |

## 后续步骤

- [JavaScript SDK](/zh/smart-contracts/genesis/sdk/javascript) - 完整的 SDK 设置和配置
- [API Reference](/zh/smart-contracts/genesis/api) - HTTP API 端点详情
- [Launch Pool](/zh/smart-contracts/genesis/launch-pool) - 按比例分配设置
