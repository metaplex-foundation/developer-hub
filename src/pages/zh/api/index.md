---
title: Metaplex API
metaTitle: Metaplex API - 公开 REST API 参考 | Metaplex
description: api.metaplex.com 上的 Metaplex 公开 REST API — Genesis 发行数据、发行创建、Agent 注册表以及 Agent 钱包交易。无需认证。
created: '01-15-2025'
updated: '08-01-2026'
keywords:
  - Metaplex API
  - Genesis API
  - agent registry API
  - launch data
  - token queries
  - REST API
about:
  - API integration
  - Data aggregation
  - Launch information
  - Agent registry
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---

Metaplex API 是位于 `api.metaplex.com` 的公开 REST API。它提供 Genesis 发行数据、构建发行创建交易，并对外提供 Metaplex Agent 注册表 — 浏览 Agent、提供 A2A AgentCard 以及构建 Agent 钱包交易。为 [metaplex.com](https://www.metaplex.com) 发行平台提供支持的也是同一个 API — 此处记录的端点正是网站自身所使用的。 {% .lead %}

## Summary

Metaplex API 提供对 Genesis 发行数据、发行创建和 Agent 注册表的公开 HTTP 访问 — 无需 SDK，也无需认证。

- 通过 Genesis 地址、代币铸造地址查询发行，或浏览所有活跃发行
- 创建并注册新的 Genesis 发行
- 浏览和搜索 Agent 注册表；获取每个 Agent 的 A2A AgentCard
- 构建 Agent 铸造、注资和提款交易
- `https://api.metaplex.com/v1` 的公开 REST API — 无需认证
- 为 [metaplex.com](https://www.metaplex.com) 发行平台提供支持 — 集成方使用的端点与平台本身相同
- 通过 `network` 查询参数支持 Solana 主网（默认）和开发网
- 机器可读的 OpenAPI 3.1 规范：[YAML](https://api.metaplex.com/v1/openapi.yaml)（规范版本）/ [JSON](https://api.metaplex.com/v1/openapi.json)，可通过 [RFC 9727 API 目录](https://api.metaplex.com/.well-known/api-catalog)发现

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

## 发行端点

| 方法 | 端点 | 描述 |
|--------|----------|-------------|
| `GET` | [`/launches/{genesis_pubkey}`](/zh/api/get-launch) | 通过 Genesis 地址获取发行数据 |
| `GET` | [`/tokens/{mint}`](/zh/api/get-launches-by-token) | 获取代币铸造的所有发行 |
| `GET` | [`/launches`](/zh/api/list-launches) | 使用可选过滤器获取发行列表 |
| `GET` | [`/launches?spotlight=true`](/zh/api/get-spotlight) | 获取精选推荐发行 |
| `POST` | [`/launches/create`](/zh/api/create-launch) | 为新发行构建链上交易 |
| `POST` | [`/launches/register`](/zh/api/register) | 注册已确认的发行以进行展示 |
| `POST` | [`/twitter/verify`](/zh/api/verify-twitter) | 验证 Twitter 账户所有权（用于发行注册） |
| `POST` | [`/creator-rewards/claim`](/zh/api/claim-creator-rewards) | 构建创作者奖励领取交易 |

{% callout type="note" %}
`POST` 端点（`/launches/create` 和 `/launches/register`）配合使用以创建新的代币发行。对于大多数用例，[SDK API 客户端](/smart-contracts/genesis/sdk/api-client)提供了更简洁的接口，它封装了这两个端点。实时链上发行状态可通过 SDK 链方法 [`fetchBucketState`](/smart-contracts/genesis/integration-apis/fetch-bucket-state) 和 [`fetchDepositState`](/smart-contracts/genesis/integration-apis/fetch-deposit-state) 直接读取。
{% /callout %}

## Agent 端点

| 方法 | 端点 | 描述 |
|--------|----------|-------------|
| `GET` | [`/agents`](/zh/api/list-agents) | 列出并搜索已注册的 Agent（分页） |
| `GET` | [`/agents/{address}`](/zh/api/get-agent) | 获取单个 Agent 及其代币和元数据 |
| `GET` | [`/agents/{address}/agent-card.json`](/zh/api/get-agent-card) | 获取托管的 A2A AgentCard |
| `POST` | [`/agents/mint`](/zh/api/mint-agent) | 构建 Agent 铸造 + 注册交易 |
| `POST` | [`/agents/{address}/fund`](/zh/api/fund-agent) | 构建向 Agent 钱包转入 SOL 的交易 |
| `POST` | [`/agents/{address}/withdraw`](/zh/api/withdraw-agent) | 构建从 Agent 钱包提款的交易（仅限所有者） |

有关铸造 Agent 的引导式演练，请参阅[铸造 Agent](/agents/mint-agent)。

## 交易构建端点

构建交易的 `POST` 端点绝不持有用户密钥，也绝不提交交易。每个端点返回一个或多个 base64 序列化的交易以及构建时所依据的区块哈希；您的应用程序对其进行反序列化，由用户的钱包签名，然后提交到网络。

## 错误码

| 状态码 | 描述 |
| --- | --- |
| `400` | 错误请求 - 无效参数 |
| `403` | 无权执行该操作（例如从您不拥有的 Agent 提款） |
| `404` | 未找到发行、代币或 Agent |
| `429` | 超出速率限制 |
| `500` | 内部服务器错误 |

## 响应信封

由于 API 的演进，目前存在两种信封约定：

**发行读取端点**（`/launches*`、`/tokens/*`、`/creator-rewards/claim`）将结果包装在 `data` 中，错误包装在 `error.message` 中：

```json
{ "data": { "…": "…" } }
```

```json
{ "error": { "message": "Launch not found" } }
```

**Agent 端点、发行写入端点和 `/twitter/verify`** 使用 `success` 判别字段：

```json
{ "success": true, "…": "…" }
```

```json
{ "success": false, "error": "Agent not found" }
```

例外是 [`/agents/{address}/agent-card.json`](/zh/api/get-agent-card)，它返回不带信封的原始 AgentCard JSON，以便 A2A 客户端可以直接使用。每个端点页面都记录了其确切的响应结构，[OpenAPI 规范](https://api.metaplex.com/v1/openapi.json)中也有记录。

## 机器可读规范

完整的 API 契约以 OpenAPI 3.1 文档的形式发布，直接从 API 的请求验证器生成（因此不会与实现产生偏差）：

| 格式 | URL |
|--------|-----|
| YAML（规范版本） | `https://api.metaplex.com/v1/openapi.yaml` |
| JSON | `https://api.metaplex.com/v1/openapi.json` |
| 当前版本别名 | `https://api.metaplex.com/openapi.json` / `openapi.yaml` |
| RFC 9727 API 目录 | `https://api.metaplex.com/.well-known/api-catalog` |

将该规范导入 Postman、Swagger UI、代码生成器或 Agent 框架，即可为每个端点获得类型化客户端和可调用工具。

## Notes

- API 有速率限制。如果收到 `429` 响应，请降低请求频率。
- 所有日期字段（`startTime`、`endTime`、`graduatedAt`、`lastActivityAt`）以 ISO 8601 字符串返回。
- 默认网络为 `solana-mainnet`。可通过 `?network=solana-devnet` 获取开发网数据。
- 对于 `POST` 端点，建议使用 [SDK API 客户端](/smart-contracts/genesis/sdk/api-client)，它封装了 `/launches/create` 和 `/launches/register`。

## 共享类型 {% #shared-types %}

### TypeScript

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
  type: 'launchpool' | 'presale';
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

## Glossary

| 术语 | 定义 |
|------|------------|
| **Genesis Address** | 唯一标识特定发行活动的 PDA（Program Derived Address） |
| **Base Token** | 通过铸造地址标识的待发行代币 |
| **Launch Page** | 用户可以参与发行的 URL |
| **Mechanic** | 发行使用的分配机制（例如 `launchpoolV2`、`presaleV2`、`auction`） |
| **Launch Type** | 发行的底层机制：`launchpool` 或 `presale` |
| **Spotlight** | 平台策划的精选发行标志 |
| **Status** | 发行的当前状态：`upcoming`、`live`、`graduated` 或 `ended` |
| **Socials** | 与代币关联的社交媒体链接（X/Twitter、Telegram、Discord） |
| **LaunchData** | 包含 `launch`、`baseToken`、`website` 和 `socials` 的响应包装器 |
| **TokenData** | 代币查询的响应包装器，包含 `launches` 数组以及 `baseToken`、`website` 和 `socials` |
