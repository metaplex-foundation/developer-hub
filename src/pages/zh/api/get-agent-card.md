---
title: 获取 AgentCard
metaTitle: Metaplex API - 获取 A2A AgentCard | REST API | Metaplex
description: 获取已注册 Agent 的托管 A2A AgentCard。符合标准的 AgentCard JSON，支持 ETag 缓存。
method: GET
created: '08-01-2026'
updated: '08-01-2026'
keywords:
  - Agent API
  - A2A
  - AgentCard
  - agent discovery
about:
  - API endpoint
  - A2A protocol
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

获取已注册 Agent 的托管 A2A AgentCard。返回原始 AgentCard JSON（A2A 规范 §4.4），A2A 客户端可以直接使用。 {% .lead %}

## Summary

Metaplex 为通过应用注册的 Agent 托管 A2A AgentCard。EIP-8004 消费者通过 Agent 的 `services[]` 条目发现此端点。

- 按存储原样返回 AgentCard — 无响应信封
- 支持通过 `ETag` / `If-None-Match` 进行条件请求（`304 Not Modified`）
- 当 Agent 没有托管的卡片时返回 `404`

## Quick Reference

| 项目 | 值 |
|------|-------|
| **方法** | `GET` |
| **路径** | `/agents/{address}/agent-card.json` |
| **认证** | 无需 |
| **响应** | A2A AgentCard JSON |
| **缓存** | `max-age=60, stale-while-revalidate=600`，ETag |

## 端点

```
GET /agents/{address}/agent-card.json
```

## 路径参数

| 参数 | 类型 | 必填 | 描述 |
|-----------|------|----------|-------------|
| `address` | `string` | 是 | Agent 的 Core 资产铸造地址（base58）。 |

## 查询参数

| 参数 | 类型 | 必填 | 描述 |
|-----------|------|----------|-------------|
| `network` | `string` | 否 | 查询的网络。默认：`solana-mainnet`。使用 `solana-devnet` 查询 devnet。 |

## 请求示例

```bash
curl "https://api.metaplex.com/v1/agents/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN/agent-card.json"
```

## 响应

一个 [A2A AgentCard](https://a2a-protocol.org/latest/specification/#44-agentcard) 对象：

```json
{
  "name": "Example Agent",
  "description": "An autonomous trading agent.",
  "url": "https://api.metaplex.com/v1/agents/7nE9.../agent-card.json",
  "version": "1.0.0",
  "capabilities": { "streaming": false },
  "skills": [
    {
      "id": "trade",
      "name": "Trade tokens",
      "description": "Executes token swaps on Solana.",
      "tags": ["solana", "trading"]
    }
  ],
  "defaultInputModes": ["text/plain"],
  "defaultOutputModes": ["text/plain"]
}
```

## 条件请求

响应包含 `ETag` 头。将其作为 `If-None-Match` 发回，当卡片未变化时会收到 `304 Not Modified`：

```bash
curl -H 'If-None-Match: "m3k9x1"' \
  "https://api.metaplex.com/v1/agents/7nE9.../agent-card.json"
```

## 错误

| 状态码 | 含义 |
|--------|---------|
| `304` | 自您提供的 ETag 以来卡片未变化。 |
| `404` | 未找到 Agent，或该 Agent 没有托管的 AgentCard。 |

## Notes

- 此端点有意**不使用** `success` 信封 — 响应体就是 AgentCard 本身，遵循 A2A 发现约定。
- 卡片要么由 Agent 创建者在铸造时编写，要么从 Agent 的注册元数据合成。
