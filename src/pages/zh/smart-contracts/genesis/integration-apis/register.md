---
title: 注册发行
metaTitle: Genesis - 注册发行 | REST API | Metaplex
description: 在链上交易确认后注册 Genesis 发行。验证链上状态并创建发行列表。
method: POST
created: '01-15-2025'
updated: '02-19-2026'
keywords:
  - Genesis API
  - register launch
  - submit launch
  - launch metadata
about:
  - API endpoint
  - Launch registration
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

在[创建发行](/smart-contracts/genesis/integration-apis/create-launch)的链上交易确认后注册 Genesis 发行。该端点验证链上状态、创建发行列表并返回发行页面 URL。{% .lead %}

{% callout type="warning" title="建议使用 SDK" %}
大多数集成方应使用 SDK 中的 [`createAndRegisterLaunch`](/smart-contracts/genesis/sdk/api-client)，它在一次调用中处理创建交易、签名、发送和注册发行的全部流程。只有在需要不依赖 SDK 直接进行 HTTP 访问时才需要使用此端点。
{% /callout %}

## 端点

```
POST /v1/launches/register
```

## 请求体

| 字段 | 类型 | 必填 | 描述 |
|-------|------|----------|-------------|
| `genesisAccount` | `string` | 是 | Genesis 账户公钥（来自创建发行响应） |
| `network` | `string` | 否 | `'solana-mainnet'`（默认）或 `'solana-devnet'` |
| `launch` | `object` | 是 | 与创建发行中使用的相同发行配置 |

`launch` 对象必须与发送到创建发行端点的内容一致，以便 API 能够验证链上状态与预期配置匹配。顶级 `network` 字段决定要验证的 Solana 集群；`launch` 中的 `network` 应与之一致。

## 请求示例

```bash
curl -X POST https://api.metaplex.com/v1/launches/register \
  -H "Content-Type: application/json" \
  -d '{
    "genesisAccount": "GenesisAccountPDA...",
    "network": "solana-devnet",
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
  "existing": false,
  "launch": {
    "id": "uuid-launch-id",
    "link": "https://www.metaplex.com/token/MintPublicKey..."
  },
  "token": {
    "id": "uuid-token-id",
    "mintAddress": "MintPublicKey..."
  }
}
```

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `success` | `boolean` | 成功时为 `true` |
| `existing` | `boolean?` | 如果发行已注册则为 `true`（幂等） |
| `launch.id` | `string` | 唯一发行 ID |
| `launch.link` | `string` | 公开发行页面 URL |
| `token.id` | `string` | 唯一代币 ID |
| `token.mintAddress` | `string` | 代币铸造公钥 |

{% callout type="note" %}
如果发行已经注册，该端点将返回现有记录并附带 `existing: true`，而不会创建重复项。
{% /callout %}

{% callout type="note" %}
主网发行在注册后将显示在 [metaplex.com](https://www.metaplex.com) 上。返回的 `launch.link` 指向公开的发行页面。
{% /callout %}

## 错误响应

```json
{
  "success": false,
  "error": "Genesis account not found on-chain",
  "details": [...]
}
```

## 错误码

| 状态码 | 描述 |
|------|-------------|
| `400` | 无效输入、链上状态不匹配或 Genesis 账户未找到 |
| `500` | 内部服务器错误 |

## 验证

注册端点执行广泛的链上验证：

- 获取 Genesis V2 账户并验证其存在
- 验证所有 bucket 账户与预期分配匹配
- 验证代币元数据（名称、符号、图片）与输入匹配
- 检查铸造属性（供应量、精度、权限）

## 推荐：使用 SDK

我们建议使用 [`createAndRegisterLaunch`](/smart-contracts/genesis/sdk/api-client) 而非直接调用此端点，该函数在一次调用中处理整个流程——创建交易、签名、发送和注册：

{% code-tabs-imported from="genesis/api_easy_mode" frameworks="umi" filename="createAndRegisterLaunch" /%}

请参阅 [API 客户端](/smart-contracts/genesis/sdk/api-client)获取完整的 SDK 文档，包括全部三种集成模式。
