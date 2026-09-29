---
title: 获取 Agent
metaTitle: Metaplex API - 获取 Agent | REST API | Metaplex
description: 通过 Core 资产地址获取单个已注册的 Agent，包括其 EIP-8004 注册数据、已创建的代币和主 Agent 代币。
method: GET
created: '08-01-2026'
updated: '08-01-2026'
keywords:
  - Agent API
  - agent detail
  - EIP-8004
  - agent registry
about:
  - API endpoint
  - Agent data
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---

通过 Core 资产地址获取单个已注册的 Agent。返回 Agent 的身份信息、EIP-8004 注册元数据、其已创建的代币及其主 Agent 代币。 {% .lead %}

## Summary

检索单个 Agent 的完整详情，将链上身份与已索引的元数据结合。

- Agent 身份：名称、描述、图像、所有者、权限方和签名者 PDA 钱包
- EIP-8004 注册 JSON 字段合并到响应中
- `tokens` — Agent 发行过的每个代币，以 `BaseToken` 对象表示
- `agentTokenInfo` — Agent 的主代币，从发行记录或链上元数据解析

## Quick Reference

| 项目 | 值 |
|------|-------|
| **方法** | `GET` |
| **路径** | `/agents/{address}` |
| **认证** | 无需 |
| **响应** | Agent 详情对象 |
| **分页** | 无 |

## 端点

```
GET /agents/{address}
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
curl "https://api.metaplex.com/v1/agents/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
```

## 响应

```json
{
  "success": true,
  "address": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN",
  "name": "Example Agent",
  "description": "An autonomous trading agent.",
  "image": "https://example.com/agent.png",
  "walletAddress": "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
  "owner": "4Nd1mYvJ9jVexjIXG5oJhanoGWyF7Cz6XkY8dEc4RsyG",
  "authority": "4Nd1mYvJ9jVexjIXG5oJhanoGWyF7Cz6XkY8dEc4RsyG",
  "agentMetadataUri": "https://api.metaplex.com/v1/agents/7nE9.../agent-card.json",
  "agentToken": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "a2aCard": { "…": "A2A AgentCard (spec §4.4), when hosted" },
  "verifiedAt": null,
  "tokens": [
    {
      "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "name": "Agent Token",
      "symbol": "AGT",
      "image": "https://example.com/token.png",
      "description": "The agent's primary token."
    }
  ],
  "agentTokenInfo": {
    "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "name": "Agent Token",
    "symbol": "AGT",
    "image": "https://example.com/token.png",
    "description": "The agent's primary token."
  }
}
```

## 响应类型

### TypeScript

```ts
interface AgentResponse {
  success: true;
  /** Core asset address (the NFT representing this agent) */
  address: string;
  name: string;
  description: string;
  image?: string;
  /** The agent's signer PDA wallet (derived from the Core asset) */
  walletAddress: string;
  /** Owner of the Core asset */
  owner: string;
  /** Update authority of the Core asset */
  authority?: string;
  agentMetadataUri?: string;
  /** Primary token mint from on-chain agent identity */
  agentToken?: string;
  /** Hosted A2A AgentCard (spec §4.4) — only when hosted by Metaplex */
  a2aCard?: Record<string, unknown> | null;
  /** When an admin verified this agent */
  verifiedAt?: string | null;
  /** Tokens the agent has launched */
  tokens: BaseToken[];
  /** The agent's primary token, when set */
  agentTokenInfo?: BaseToken;
  // …plus any additional EIP-8004 registration fields
}

interface BaseToken {
  address: string;
  name: string;
  symbol: string;
  image: string;
  description: string;
}
```

## 使用示例

### TypeScript

```ts
const response = await fetch(
  "https://api.metaplex.com/v1/agents/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
);
const agent: AgentResponse = await response.json();
if (agent.success) {
  console.log(agent.name, agent.walletAddress);
  console.log(`${agent.tokens.length} tokens launched`);
}
```

### Rust

```rust
let agent = reqwest::get(
    "https://api.metaplex.com/v1/agents/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
)
.await?
.json::<serde_json::Value>()
.await?;

println!("{} — wallet {}", agent["name"], agent["walletAddress"]);
```

## 错误

| 状态码 | 响应体 | 含义 |
|--------|------|---------|
| `404` | `{ "success": false, "error": "Agent not found" }` | 在指定网络的该地址上没有注册的 Agent。 |
| `500` | `{ "success": false, "error": "Failed to fetch agent" }` | 服务器错误。 |

## Notes

- 响应将链上 Agent 身份与该 Agent 的 EIP-8004 注册 JSON 合并，因此除已记录的字段外，还可能出现额外的元数据字段。
- 当 Agent 代币不在该 Agent 自己的发行之中时，`agentTokenInfo` 会回退到链上代币元数据。
- 响应会被缓存；最近的链上变更可能需要短暂延迟后才会显示。
