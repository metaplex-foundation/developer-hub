---
title: Get Agent Card
metaTitle: Agents - Get A2A AgentCard | REST API | Metaplex
description: Fetch the hosted A2A AgentCard for a registered agent. Standards-compliant AgentCard JSON with ETag caching.
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

Fetch the hosted A2A AgentCard for a registered agent. Returns raw AgentCard JSON (A2A spec §4.4) so A2A clients can consume it directly. {% .lead %}

## Summary

Metaplex hosts an A2A AgentCard for agents registered through the app. EIP-8004 consumers discover this endpoint through the agent's `services[]` entry.

- Returns the AgentCard exactly as stored — no response envelope
- Supports conditional requests via `ETag` / `If-None-Match` (`304 Not Modified`)
- Returns `404` when the agent has no hosted card

## Quick Reference

| Item | Value |
|------|-------|
| **Method** | `GET` |
| **Path** | `/agents/{address}/agent-card.json` |
| **Auth** | None |
| **Response** | A2A AgentCard JSON |
| **Caching** | `max-age=60, stale-while-revalidate=600`, ETag |

## Endpoint

```
GET /agents/{address}/agent-card.json
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
curl "https://api.metaplex.com/v1/agents/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN/agent-card.json"
```

## Response

An [A2A AgentCard](https://a2a-protocol.org/latest/specification/#44-agentcard) object:

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

## Conditional Requests

The response includes an `ETag` header. Send it back as `If-None-Match` to receive `304 Not Modified` when the card is unchanged:

```bash
curl -H 'If-None-Match: "m3k9x1"' \
  "https://api.metaplex.com/v1/agents/7nE9.../agent-card.json"
```

## Errors

| Status | Meaning |
|--------|---------|
| `304` | Card unchanged since the ETag you supplied. |
| `404` | Agent not found, or the agent has no hosted AgentCard. |

## Notes

- This endpoint intentionally has **no** `success` envelope — the body is the AgentCard itself, per the A2A discovery convention.
- Cards are either authored by the agent creator at mint time or synthesized from the agent's registration metadata.
