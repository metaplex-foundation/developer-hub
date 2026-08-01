---
title: List Agents
metaTitle: Agents - List Agents | REST API | Metaplex
description: Browse and search registered AI agents. Returns paginated agent records with metadata, filters, and sorting.
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

Browse and search the agent registry. Returns paginated agent records from the indexed database, sorted by latest registration by default. {% .lead %}

## Summary

List registered agents with optional full-text search, filters, and sorting. Results are always paginated.

- Search by name with `query`
- Filter by `activeOnly`, `hasAgentToken`, `hasServices`, and `spotlight`
- Sort by `latest` (default) or `oldest` registration
- Defaults to page 1 with 24 results per page (max `pageSize` is 100)

## Quick Reference

| Item | Value |
|------|-------|
| **Method** | `GET` |
| **Path** | `/agents` |
| **Auth** | None |
| **Response** | Paginated `AgentRecord[]` |
| **Pagination** | `page` / `pageSize` |

## Endpoint

```
GET /agents
```

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `network` | `string` | No | Network to query. Default: `solana-mainnet`. Use `solana-devnet` for devnet. |
| `page` | `number` | No | Page number, starting at `1`. Default: `1`. |
| `pageSize` | `number` | No | Results per page, `1`–`100`. Default: `24`. |
| `query` | `string` | No | Free-text search over agent names. |
| `sort` | `string` | No | `latest` (default) or `oldest` — by registration time. |
| `activeOnly` | `boolean` | No | Only agents whose EIP-8004 metadata marks them active. |
| `hasAgentToken` | `boolean` | No | Only agents with a primary agent token set. |
| `hasServices` | `boolean` | No | Only agents advertising service endpoints. |
| `spotlight` | `boolean` | No | Only agents spotlighted on the discover page. |

## Example Request

```bash
curl "https://api.metaplex.com/v1/agents?pageSize=10&sort=latest&activeOnly=true"
```

## Response

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

## Response Type

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

## Usage Examples

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

let agents = &response["data"]["agents"];
println!("{} agents on this page", agents.as_array().unwrap().len());
```

## Notes

- Results come from the indexed database, not a live on-chain scan; newly minted agents appear once their registration transaction has been indexed.
- Boolean filters accept `true`/`false` string values.
- The response uses the `success` envelope — see the [Agent API overview](/agents/api) for details.
