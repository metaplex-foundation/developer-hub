---
title: 列出 Agent
metaTitle: Metaplex API - 列出 Agent | REST API | Metaplex
description: 浏览并搜索已注册的 AI Agent。返回带有元数据、过滤器和排序的分页 Agent 记录。
method: GET
created: '08-01-2026'
updated: '08-01-2026'
keywords:
  - Agent API
  - agent registry
  - agent search
  - agent listings
about:
  - API endpoint
  - Agent listings
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---

浏览并搜索 Agent 注册表。返回来自索引数据库的分页 Agent 记录，默认按最新注册时间排序。 {% .lead %}

## Summary

列出已注册的 Agent，支持可选的全文搜索、过滤器和排序。结果始终分页。

- 通过 `query` 按名称搜索
- 通过 `activeOnly`、`hasAgentToken`、`hasServices` 和 `spotlight` 过滤
- 按注册时间以 `latest`（默认）或 `oldest` 排序
- 默认为第 1 页，每页 24 条结果（`pageSize` 最大为 100）

## Quick Reference

| 项目 | 值 |
|------|-------|
| **方法** | `GET` |
| **路径** | `/agents` |
| **认证** | 无需 |
| **响应** | 分页的 `AgentRecord[]` |
| **分页** | `page` / `pageSize` |

## 端点

```
GET /agents
```

## 查询参数

| 参数 | 类型 | 必填 | 描述 |
|-----------|------|----------|-------------|
| `network` | `string` | 否 | 查询的网络。默认：`solana-mainnet`。使用 `solana-devnet` 查询 devnet。 |
| `page` | `number` | 否 | 页码，从 `1` 开始。默认：`1`。 |
| `pageSize` | `number` | 否 | 每页结果数，`1`–`100`。默认：`24`。 |
| `query` | `string` | 否 | 对 Agent 名称进行自由文本搜索。 |
| `sort` | `string` | 否 | `latest`（默认）或 `oldest` — 按注册时间。 |
| `activeOnly` | `boolean` | 否 | 仅返回 EIP-8004 元数据标记为活跃的 Agent。 |
| `hasAgentToken` | `boolean` | 否 | 仅返回已设置主 Agent 代币的 Agent。 |
| `hasServices` | `boolean` | 否 | 仅返回声明了服务端点的 Agent。 |
| `spotlight` | `boolean` | 否 | 仅返回在发现页面被精选推荐的 Agent。 |

## 请求示例

```bash
curl "https://api.metaplex.com/v1/agents?pageSize=10&sort=latest&activeOnly=true"
```

## 响应

```json
{
  "success": true,
  "data": {
    "agents": [
      {
        "mintAddress": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN",
        "network": "solana-mainnet",
        "name": "Example Agent",
        "description": "An autonomous trading agent.",
        "image": "https://example.com/agent.png",
        "walletAddress": "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        "authority": "4Nd1mYvJ9jVexjIXG5oJhanoGWyF7Cz6XkY8dEc4RsyG",
        "agentToken": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        "agentMetadataUri": "https://api.metaplex.com/v1/agents/7nE9.../agent-card.json",
        "metadata": { "…": "EIP-8004 registration JSON" },
        "a2aCard": { "…": "A2A AgentCard (spec §4.4)" },
        "isActive": true,
        "registrationSignature": "5J8…",
        "indexedAt": "2026-07-01T12:00:00.000Z",
        "spotlightedAt": null,
        "verifiedAt": null,
        "createdAt": "2026-07-01T11:59:58.000Z",
        "updatedAt": "2026-07-15T09:30:00.000Z"
      }
    ],
    "total": 132,
    "page": 1,
    "pageSize": 10,
    "totalPages": 14
  }
}
```

## 响应类型

### TypeScript

```ts
interface PaginatedAgentsResponse {
  success: true;
  data: {
    agents: AgentRecord[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

interface AgentRecord {
  /** Core asset mint address (the NFT representing this agent) */
  mintAddress: string;
  network: string;
  name: string;
  description: string;
  image: string | null;
  /** The agent's signer PDA wallet, derived from the Core asset */
  walletAddress: string;
  /** Update authority of the Core asset */
  authority: string | null;
  /** Primary token mint, set via the setAgentToken instruction */
  agentToken: string | null;
  agentMetadataUri: string | null;
  /** EIP-8004 agent registration JSON */
  metadata: Record<string, unknown> | null;
  /** Hosted A2A AgentCard (spec §4.4) */
  a2aCard: Record<string, unknown> | null;
  isActive: boolean;
  registrationSignature: string | null;
  indexedAt: string | null;
  spotlightedAt: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
```

## 使用示例

### TypeScript

```ts
const response = await fetch(
  "https://api.metaplex.com/v1/agents?pageSize=10&activeOnly=true"
);
const result: PaginatedAgentsResponse = await response.json();
if (result.success) {
  const { agents, total, totalPages } = result.data;
  console.log(`${agents.length} of ${total} agents (${totalPages} pages)`);
}
```

### Rust

```rust
let response = reqwest::get(
    "https://api.metaplex.com/v1/agents?pageSize=10&activeOnly=true"
)
.await?
.json::<serde_json::Value>()
.await?;

if response["success"].as_bool() == Some(true) {
    if let Some(agents) = response["data"]["agents"].as_array() {
        println!("{} agents on this page", agents.len());
    }
} else {
    eprintln!("API error: {}", response["error"]);
}
```

## Notes

- 结果来自索引数据库，而非实时链上扫描；新铸造的 Agent 在其注册交易被索引后才会出现。
- 布尔过滤器接受 `true`/`false` 字符串值。
- 响应使用 `success` 信封格式 — 详见 [Agent API 概览](/zh/api)。
