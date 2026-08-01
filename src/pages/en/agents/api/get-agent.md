---
title: Get Agent
metaTitle: Agents - Get Agent | REST API | Metaplex
description: Fetch a single registered agent by Core asset address, including its EIP-8004 registration data, created tokens, and primary agent token.
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

Fetch a single registered agent by its Core asset address. Returns the agent's identity, EIP-8004 registration metadata, the tokens it has created, and its primary agent token. {% .lead %}

## Summary

Retrieve full details for one agent, combining on-chain identity with indexed metadata.

- Agent identity: name, description, image, owner, authority, and signer PDA wallet
- EIP-8004 registration JSON fields merged into the response
- `tokens` — every token the agent has launched, as `BaseToken` objects
- `agentTokenInfo` — the agent's primary token, resolved from launches or on-chain metadata

## Quick Reference

| Item | Value |
|------|-------|
| **Method** | `GET` |
| **Path** | `/agents/{address}` |
| **Auth** | None |
| **Response** | Agent detail object |
| **Pagination** | None |

## Endpoint

```
GET /agents/{address}
```

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `address` | `string` | Yes | The agent's Core asset mint address (base58). |

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `network` | `string` | No | Network to query. Default: `solana-mainnet`. Use `solana-devnet` for devnet. |

## Example Request

```bash
curl "https://api.metaplex.com/v1/agents/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
```

## Response

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

## Response Type

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

## Usage Examples

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

## Errors

| Status | Body | Meaning |
|--------|------|---------|
| `404` | `{ "success": false, "error": "Agent not found" }` | No agent registered at this address on the given network. |
| `500` | `{ "success": false, "error": "Failed to fetch agent" }` | Server error. |

## Notes

- The response merges on-chain agent identity with the agent's EIP-8004 registration JSON, so additional metadata fields may appear alongside the documented ones.
- `agentTokenInfo` falls back to on-chain token metadata when the agent token is not among the agent's own launches.
- Responses are cached; allow a short delay for recent on-chain changes to appear.
