---
title: 创建发行
metaTitle: Genesis - 创建发行 | REST API | Metaplex
description: 为新的 Genesis 代币发行构建链上交易。返回可供签名和发送的未签名交易。
method: POST
created: '02-19-2026'
updated: '02-19-2026'
keywords:
  - Genesis API
  - create launch
  - token launch
  - launch transactions
about:
  - API endpoint
  - Launch creation
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

为新的 Genesis 代币发行构建链上交易。返回未签名交易，需在调用[注册发行](/smart-contracts/genesis/integration-apis/register)之前完成签名和发送。{% .lead %}

{% callout type="warning" title="建议使用 SDK" %}
大多数集成方应使用 SDK 中的 [`createAndRegisterLaunch`](/smart-contracts/genesis/sdk/api-client)，它在一次调用中处理创建交易、签名、发送和注册发行的全部流程。只有在需要不依赖 SDK 直接进行 HTTP 访问时才需要使用此端点。
{% /callout %}

{% callout type="note" %}
我们建议使用 Create API（或 SDK）以编程方式构建发行，因为 [metaplex.com](https://www.metaplex.com) 尚未支持 Genesis 程序的全部功能。通过 API 创建的主网发行在[注册](/smart-contracts/genesis/integration-apis/register)后将显示在 metaplex.com 上。
{% /callout %}

## 端点

```
POST /v1/launches/create
```

## 请求体

| 字段 | 类型 | 必填 | 描述 |
|-------|------|----------|-------------|
| `wallet` | `string` | 是 | 创建者钱包公钥 |
| `launch` | `object` | 是 | 完整发行配置（见下文） |

### 发行配置

`launch` 对象描述完整的代币和发行设置：

| 字段 | 类型 | 必填 | 描述 |
|-------|------|----------|-------------|
| `name` | `string` | 是 | 代币名称，1–32 个字符 |
| `symbol` | `string` | 是 | 代币符号，1–10 个字符 |
| `image` | `string` | 是 | 代币图片 URL（Irys 网关） |
| `description` | `string` | 否 | 代币描述，最多 250 个字符 |
| `decimals` | `number` | 否 | 代币精度（默认为 6） |
| `supply` | `number` | 否 | 代币总供应量（默认为 1,000,000,000） |
| `network` | `string` | 否 | `'solana-mainnet'`（默认）或 `'solana-devnet'` |
| `quoteMint` | `string` | 否 | 报价代币铸造地址（默认为 wrapped SOL） |
| `type` | `string` | 是 | `'project'` |
| `finalize` | `boolean` | 否 | 是否最终确认发行（默认为 `true`） |
| `allocations` | `array` | 是 | 分配配置数组 |
| `externalLinks` | `object` | 否 | 网站、Twitter、Telegram 链接 |
| `publicKey` | `string` | 是 | 创建者的钱包公钥（必须与顶级 `wallet` 字段一致） |

### 分配类型

`allocations` 数组中每个分配都有一个 `type` 字段：

- **`launchpoolV2`** — 按比例分配池
- **`raydiumV2`** — Raydium LP 分配
- **`unlockedV2`** — 向接收方分配解锁代币
- **`lockedV2`** — 通过 Streamflow 锁仓代币
- **`presaleV2`** — 固定价格预售

{% callout type="note" %}
SDK 的 `buildCreateLaunchPayload` 函数负责将简化的 `CreateLaunchInput` 转换为此完整载荷格式。请参阅 [API 客户端](/smart-contracts/genesis/sdk/api-client)文档。
{% /callout %}

## 请求示例

```bash
curl -X POST https://api.metaplex.com/v1/launches/create \
  -H "Content-Type: application/json" \
  -d '{
    "wallet": "YourWalletPublicKey...",
    "launch": {
      "name": "My Token",
      "symbol": "MTK",
      "image": "https://gateway.irys.xyz/...",
      "decimals": 6,
      "supply": 1000000000,
      "network": "solana-devnet",
      "quoteMint": "So11111111111111111111111111111111111111112",
      "type": "project",
      "finalize": true,
      "publicKey": "YourWalletPublicKey...",
      "allocations": [...]
    }
  }'
```

## 成功响应

```json
{
  "success": true,
  "transactions": [
    "base64-encoded-transaction-1...",
    "base64-encoded-transaction-2..."
  ],
  "blockhash": {
    "blockhash": "...",
    "lastValidBlockHeight": 123456789
  },
  "mintAddress": "MintPublicKey...",
  "genesisAccount": "GenesisAccountPDA..."
}
```

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `success` | `boolean` | 成功时为 `true` |
| `transactions` | `string[]` | Base64 编码的序列化交易 |
| `blockhash` | `object` | 用于交易确认的区块哈希 |
| `mintAddress` | `string` | 代币铸造公钥 |
| `genesisAccount` | `string` | Genesis 账户 PDA 公钥 |

## 错误响应

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [...]
}
```

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `success` | `boolean` | 错误时为 `false` |
| `error` | `string` | 错误信息 |
| `details` | `array?` | 验证错误详情（适用时） |

## 错误码

| 状态码 | 描述 |
|------|-------------|
| `400` | 无效输入或验证失败 |
| `500` | 内部服务器错误 |

## 推荐：使用 SDK

我们建议使用 [`createAndRegisterLaunch`](/smart-contracts/genesis/sdk/api-client) 而非直接调用此端点，该函数在一次调用中处理整个流程——创建交易、签名、发送和注册：

{% code-tabs-imported from="genesis/api_easy_mode" frameworks="umi" filename="createAndRegisterLaunch" /%}

请参阅 [API 客户端](/smart-contracts/genesis/sdk/api-client)获取完整的 SDK 文档，包括全部三种集成模式。
