---
title: 聚合API
metaTitle: Genesis - 聚合API
description: 通过genesis地址或代币铸币查询Genesis发行数据的公共API。
---

Genesis API允许聚合器和应用程序查询Genesis代币发行的发行数据。使用这些端点在您的应用程序中显示发行信息、代币元数据和社交链接。

{% callout type="note" %}
API是公开的，有速率限制。无需认证。
{% /callout %}

## 基础URL

```
https://api.metaplex.com/v1
```

## 用例

- **`/launches/{genesis_pubkey}`** - 当您有genesis地址时使用，例如来自链上事件或交易日志。
- **`/tokens/{mint}`** - 当您只知道代币铸币地址时使用。返回与该代币相关的所有发行（一个代币可以有多个发行活动）。

## 端点

### 通过Genesis地址获取发行

```
GET /launches/{genesis_pubkey}
```

**示例请求：**

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
      "description": "示例生态系统的社区驱动代币。"
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

### 通过代币铸币获取发行

```
GET /tokens/{mint}
```

返回代币的所有发行。响应相同，只是`launches`是一个数组。

**示例请求：**

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
      "description": "示例生态系统的社区驱动代币。"
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
查找genesis公钥需要索引或`getProgramAccounts`。如果您只有代币铸币，请改用`/tokens`端点。
{% /callout %}

## 错误

```json
{
  "error": {
    "message": "Launch not found"
  }
}
```

| 代码 | 描述 |
| --- | --- |
| `400` | 错误请求 - 无效参数 |
| `404` | 发行或代币未找到 |
| `429` | 超出速率限制 |
| `500` | 内部服务器错误 |

## 类型和示例

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
在您的`Cargo.toml`中添加这些依赖：
```toml
[dependencies]
reqwest = { version = "0.11", features = ["json"] }
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
```
{% /callout %}

## 获取链上状态（JavaScript SDK）

除了HTTP API，您还可以使用Genesis JavaScript SDK直接从区块链获取发行状态。这对于获取存款总额和时间条件等实时数据很有用。

### 桶状态

```typescript
import { fetchLaunchPoolBucketV2 } from '@metaplex-foundation/genesis';

const bucket = await fetchLaunchPoolBucketV2(umi, launchPoolBucket);

console.log('总存款:', bucket.quoteTokenDepositTotal);
console.log('存款数量:', bucket.depositCount);
console.log('领取数量:', bucket.claimCount);
console.log('代币分配:', bucket.bucket.baseTokenAllocation);
```

### 时间条件

每个桶有四个控制发行阶段的时间条件：

```typescript
const bucket = await fetchLaunchPoolBucketV2(umi, launchPoolBucket);

// 存款窗口
const depositStart = bucket.depositStartCondition.time;
const depositEnd = bucket.depositEndCondition.time;

// 领取窗口
const claimStart = bucket.claimStartCondition.time;
const claimEnd = bucket.claimEndCondition.time;

console.log('存款开始:', new Date(Number(depositStart) * 1000));
console.log('存款结束:', new Date(Number(depositEnd) * 1000));
console.log('领取开始:', new Date(Number(claimStart) * 1000));
console.log('领取结束:', new Date(Number(claimEnd) * 1000));
```

### 存款状态

```typescript
import {
  fetchLaunchPoolDepositV2,
  safeFetchLaunchPoolDepositV2,
} from '@metaplex-foundation/genesis';

// 如果未找到则抛出异常
const deposit = await fetchLaunchPoolDepositV2(umi, depositPda);

// 如果未找到则返回null
const maybeDeposit = await safeFetchLaunchPoolDepositV2(umi, depositPda);

if (deposit) {
  console.log('金额:', deposit.amountQuoteToken);
  console.log('已领取:', deposit.claimed);
}
```
