---
title: 从 Agent 提款
metaTitle: Metaplex API - 从 Agent 钱包提款 | REST API | Metaplex
description: 构建一个从 Agent 钱包向其所有者提取 SOL 的交易。仅限所有者。
method: POST
created: '08-01-2026'
updated: '08-01-2026'
keywords:
  - Agent API
  - withdraw
  - agent wallet
  - execute
about:
  - API endpoint
  - Agent finance
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

构建一个交易，将 SOL 从 Agent 的签名者 PDA 钱包转回给 Agent 的所有者。只有 Agent Core 资产的当前所有者可以提款。 {% .lead %}

## Summary

- 将 SOL 转账包装在 `execute` 指令中，使 Agent 的钱包 PDA 能够签名
- 在构建交易之前，服务端会对照 Core 资产验证所有权
- 返回未签名的交易，由所有者签名并提交

## Quick Reference

| 项目 | 值 |
|------|-------|
| **方法** | `POST` |
| **路径** | `/agents/{address}/withdraw` |
| **认证** | 无需（所有权在链上和构建时强制验证） |
| **响应** | 序列化交易 |

## 端点

```
POST /agents/{address}/withdraw
```

## 路径参数

| 参数 | 类型 | 必填 | 描述 |
|-----------|------|----------|-------------|
| `address` | `string` | 是 | Agent 的 Core 资产铸造地址（base58）。 |

## 请求体

| 字段 | 类型 | 必填 | 描述 |
|-------|------|----------|-------------|
| `sender` | `string` | 是 | Agent 所有者的钱包（base58）。接收 SOL 并为交易签名。 |
| `amount` | `number` | 是 | 以 SOL 为单位的金额。必须为正数。 |
| `network` | `string` | 否 | `solana-mainnet`（默认）或 `solana-devnet`。 |

## 请求示例

```bash
curl -X POST "https://api.metaplex.com/v1/agents/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN/withdraw" \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "4Nd1mYvJ9jVexjIXG5oJhanoGWyF7Cz6XkY8dEc4RsyG",
    "amount": 0.25
  }'
```

## 响应

```json
{
  "success": true,
  "tx": "<base64-encoded transaction>",
  "blockhash": {
    "blockhash": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    "lastValidBlockHeight": 123456789
  }
}
```

所有者对交易进行反序列化、签名并提交 — 请参阅[签名和提交](/api/mint-agent#signing-and-submitting)。

## 错误

| 状态码 | 响应体 | 含义 |
|--------|------|---------|
| `400` | `{ "success": false, "error": "Invalid input data" }` | 请求体或地址验证失败。 |
| `403` | `{ "success": false, "error": "Only the agent owner can withdraw funds" }` | `sender` 不拥有该 Agent 的 Core 资产。 |
| `404` | `{ "success": false, "error": "Agent not found" }` | 在指定网络的该地址上没有 Core 资产。 |
| `500` | `{ "success": false, "error": "Failed to prepare withdraw transaction" }` | 服务器错误。 |

## Notes

- 构建时的所有权检查只是一种便利；`execute` 指令无论如何都会在链上强制验证所有权，因此伪造的请求无法转移资金。
- 提款目标始终是 `sender`（所有者）— 资金无法被重定向到第三方。
- 要添加资金，请参阅[为 Agent 注资](/api/fund-agent)。
