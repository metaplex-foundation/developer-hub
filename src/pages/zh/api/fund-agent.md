---
title: 为 Agent 注资
metaTitle: Metaplex API - 为 Agent 钱包注资 | REST API | Metaplex
description: 构建一个带有链上备注的 SOL 转账交易，为已注册 Agent 的钱包注资。
method: POST
created: '08-01-2026'
updated: '08-01-2026'
keywords:
  - Agent API
  - fund agent
  - agent wallet
  - SOL transfer
about:
  - API endpoint
  - Agent finance
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

构建一个交易，将 SOL 从发送方钱包转账到 Agent 的签名者 PDA 钱包，并附带链上备注。任何人都可以为任何 Agent 注资。 {% .lead %}

## Summary

- 将 SOL 转账到 Agent 的钱包 PDA（由服务端根据 Agent 地址解析）
- 附加一条必需的、由发送方签名的备注指令，用于归因
- 返回未签名的交易，由发送方签名并提交

## Quick Reference

| 项目 | 值 |
|------|-------|
| **方法** | `POST` |
| **路径** | `/agents/{address}/fund` |
| **认证** | 无需 |
| **响应** | 序列化交易 |

## 端点

```
POST /agents/{address}/fund
```

## 路径参数

| 参数 | 类型 | 必填 | 描述 |
|-----------|------|----------|-------------|
| `address` | `string` | 是 | Agent 的 Core 资产铸造地址（base58）。 |

## 请求体

| 字段 | 类型 | 必填 | 描述 |
|-------|------|----------|-------------|
| `sender` | `string` | 是 | 发送 SOL 的钱包（base58）。为交易签名。 |
| `amount` | `number` | 是 | 以 SOL 为单位的金额。必须为正数。 |
| `memo` | `string` | 是 | 记录在链上的备注，1–256 个字符。 |
| `network` | `string` | 否 | `solana-mainnet`（默认）或 `solana-devnet`。 |

## 请求示例

```bash
curl -X POST "https://api.metaplex.com/v1/agents/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN/fund" \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "4Nd1mYvJ9jVexjIXG5oJhanoGWyF7Cz6XkY8dEc4RsyG",
    "amount": 0.5,
    "memo": "Operating budget for July"
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

发送方对交易进行反序列化、签名并提交 — 请参阅[签名和提交](/api/mint-agent#signing-and-submitting)。

## 错误

| 状态码 | 响应体 | 含义 |
|--------|------|---------|
| `400` | `{ "success": false, "error": "Invalid input data" }` | 请求体验证失败（公钥无效、金额非正数、缺少备注）。 |
| `404` | `{ "success": false, "error": "Agent not found" }` | 在指定网络的该地址上没有注册的 Agent。 |
| `500` | `{ "success": false, "error": "Failed to prepare fund transaction" }` | 服务器错误。 |

## Notes

- 转账目标是 Agent 的**钱包 PDA**，而非 Core 资产地址 — API 会为您解析。
- 要将资金转出，Agent 所有者需使用[提款](/api/withdraw-agent)。
- 有关 Agent 钱包背后的概念，请参阅 [Agent 金融](/agents/agent-finance)。
