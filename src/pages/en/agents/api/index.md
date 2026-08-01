---
title: Agent API
metaTitle: Agents - Public API | Agent Registry | Metaplex
description: Query registered AI agents and build agent transactions through the Metaplex public REST API. No authentication required.
created: '08-01-2026'
updated: '08-01-2026'
keywords:
  - Agent API
  - agent registry
  - AI agents
  - agent data
  - A2A AgentCard
about:
  - API integration
  - Agent registry
  - Agent wallets
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---

The Agent API exposes the Metaplex Agent Registry over public REST endpoints. Browse registered agents, fetch a single agent's identity and hosted A2A AgentCard, and build mint, fund, and withdraw transactions for agent wallets. {% .lead %}

## Summary

The Agent API is part of the Metaplex public API and is served from the same base URL as the [Genesis Integration APIs](/smart-contracts/genesis/integration-apis).

- Browse and search the agent registry with pagination, filters, and sorting
- Fetch a single agent's EIP-8004 registration data, created tokens, and primary agent token
- Serve the hosted A2A AgentCard (spec §4.4) for any registered agent
- Build unsigned transactions to mint an agent, fund its wallet, or withdraw from it
- Public API — no authentication required
- Supports Solana mainnet (default) and devnet via the `network` query parameter

## Base URL

```
https://api.metaplex.com/v1
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | [`/agents`](/agents/api/list-agents) | List and search registered agents (paginated) |
| `GET` | [`/agents/{address}`](/agents/api/get-agent) | Get a single agent with tokens and metadata |
| `GET` | [`/agents/{address}/agent-card.json`](/agents/api/get-agent-card) | Get the hosted A2A AgentCard |
| `POST` | [`/agents/mint`](/agents/api/mint-agent) | Build an agent mint + registration transaction |
| `POST` | [`/agents/{address}/fund`](/agents/api/fund-agent) | Build a SOL transfer to the agent's wallet |
| `POST` | [`/agents/{address}/withdraw`](/agents/api/withdraw-agent) | Build a withdrawal from the agent's wallet (owner only) |

## Network Selection

By default, endpoints return data from Solana mainnet. To target devnet instead, add the `network` query parameter (for `GET` requests) or the `network` body field (for `POST` requests):

```
?network=solana-devnet
```

## Authentication

No authentication is required. The API is public with rate limits. If you receive a `429` response, reduce your request frequency.

## Response Envelope

Agent endpoints wrap responses in a `success` discriminator:

```json
// Success
{ "success": true, ... }

// Error
{ "success": false, "error": "Agent not found" }
```

This differs from the Genesis launch endpoints, which use a `data`/`error` envelope. The exception is `GET /agents/{address}/agent-card.json`, which returns the raw AgentCard JSON with no envelope so it can be consumed directly by A2A clients.

## Transaction-Building Endpoints

The `POST` endpoints never hold user keys and never submit transactions. Each returns a base64-serialized transaction plus the blockhash used to build it:

```json
{
  "success": true,
  "tx": "<base64-encoded transaction>",
  "blockhash": {
    "blockhash": "…",
    "lastValidBlockHeight": 123456789
  }
}
```

Your application deserializes the transaction, has the user's wallet sign it, and submits it to the network.

## Error Codes

| Status | Meaning |
|--------|---------|
| `400` | Invalid input or malformed request body |
| `403` | Caller is not authorized for the operation (e.g. withdrawing from an agent you don't own) |
| `404` | Agent not found |
| `429` | Rate limited — reduce request frequency |
| `500` | Server error |
