---
title: 铸造 Agent
metaTitle: Metaplex API - 铸造 Agent | REST API | Metaplex
description: 构建一个部分签名的交易，用于铸造 Agent Core 资产并注册其链上身份。
method: POST
created: '08-01-2026'
updated: '08-01-2026'
keywords:
  - Agent API
  - mint agent
  - agent registration
  - EIP-8004
about:
  - API endpoint
  - Agent minting
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

构建一个交易，一步完成为您的 Agent 铸造 MPL Core 资产并在 Agent 注册表中注册其身份。API 在链下存储 Agent 元数据，并返回一个部分签名的交易，由钱包作为付款方共同签名。 {% .lead %}

## Summary

这是[铸造 Agent](/zh/agents/mint-agent) 指南背后的端点。

- 在单笔交易中创建 Core 资产并调用 `registerIdentity`
- 资产密钥对在服务端生成并预先签名，因此响应包含最终的 `assetAddress`
- 存储 EIP-8004 元数据和托管的 [A2A AgentCard](/zh/api/get-agent-card)（您提供的，或从元数据合成的）
- 调用方的钱包作为付款方签名并提交交易

## Quick Reference

| 项目 | 值 |
|------|-------|
| **方法** | `POST` |
| **路径** | `/agents/mint` |
| **认证** | 无需 |
| **响应** | 序列化交易 + `assetAddress` |

## 端点

```
POST /agents/mint
```

## 请求体

| 字段 | 类型 | 必填 | 描述 |
|-------|------|----------|-------------|
| `wallet` | `string` | 是 | 将支付并拥有该 Agent 的钱包（base58）。 |
| `network` | `string` | 是 | `solana-mainnet` 或 `solana-devnet`。 |
| `name` | `string` | 是 | Core 资产的 Agent 名称。 |
| `uri` | `string` | 是 | 资产链下 JSON 元数据的 URI。 |
| `agentMetadata` | `object` | 是 | EIP-8004 Agent 注册 JSON（name、description、image、services、registrations、active 等）。 |
| `collectionAddress` | `string` | 否 | 将 Agent 铸造到其中的 Core 集合。 |
| `a2aCard` | `object` | 否 | 预先构建的 A2A AgentCard。省略时会从 `agentMetadata` 合成一个。 |

## 请求示例

```bash
curl -X POST "https://api.metaplex.com/v1/agents/mint" \
  -H "Content-Type: application/json" \
  -d '{
    "wallet": "4Nd1mYvJ9jVexjIXG5oJhanoGWyF7Cz6XkY8dEc4RsyG",
    "network": "solana-devnet",
    "name": "Example Agent",
    "uri": "https://example.com/agent-metadata.json",
    "agentMetadata": {
      "name": "Example Agent",
      "description": "An autonomous trading agent.",
      "active": true,
      "services": [],
      "registrations": []
    }
  }'
```

## 响应

```json
{
  "success": true,
  "tx": "<base64-encoded partially signed transaction>",
  "blockhash": {
    "blockhash": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    "lastValidBlockHeight": 123456789
  },
  "assetAddress": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
}
```

## 签名和提交 {% #signing-and-submitting %}

返回的交易已由资产密钥对签名；您的钱包作为付款方共同签名并提交：

```ts
import { base64 } from "@metaplex-foundation/umi/serializers";

const res = await fetch("https://api.metaplex.com/v1/agents/mint", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(input),
});
const result = await res.json();
if (!result.success) throw new Error(result.error);

const tx = umi.transactions.deserialize(base64.serialize(result.tx));
const signed = await umi.identity.signTransaction(tx);
await umi.rpc.sendTransaction(signed);
```

## 错误

| 状态码 | 响应体 | 含义 |
|--------|------|---------|
| `400` | `{ "success": false, "error": "Invalid input data", "details": [...] }` | 请求体验证失败；`details` 列出具体问题。 |
| `400` | `{ "success": false, "error": "<message>" }` | 构建失败（例如未找到集合）。 |
| `500` | `{ "success": false, "error": "Failed to prepare mint agent" }` | 服务器错误。 |

## Notes

- Metaplex 注册表条目（`solana:101:metaplex`）会自动添加到 `agentMetadata.registrations` 的最前面。
- 一个托管的 A2A 服务条目会被插入到 `services[]` 中，以便 EIP-8004 消费者可以发现 [AgentCard 端点](/zh/api/get-agent-card)；如果您已经自行编写了一个，此操作不产生任何变化。
- 调用此端点时会存储 Agent 记录，但只有在已签名的交易被确认并索引后，它才会出现在[列出 Agent](/zh/api/list-agents) 中。
- 有关使用 SDK 的引导式演练，请参阅[铸造 Agent](/zh/agents/mint-agent)。
