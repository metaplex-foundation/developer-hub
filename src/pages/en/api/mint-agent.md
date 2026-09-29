---
title: Mint Agent
metaTitle: Metaplex API - Mint Agent | REST API | Metaplex
description: Build a partially signed transaction that mints an agent Core asset and registers its on-chain identity.
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

Build a transaction that mints an MPL Core asset for your agent and registers its identity with the Agent Registry in one step. The API stores the agent metadata off-chain and returns a partially signed transaction for the wallet to co-sign as payer. {% .lead %}

## Summary

This is the endpoint behind the [Mint an Agent](/agents/mint-agent) guide.

- Creates the Core asset and calls `registerIdentity` in a single transaction
- The asset keypair is generated server-side and pre-signed, so the response includes the final `assetAddress`
- Stores the EIP-8004 metadata and a hosted [A2A AgentCard](/api/get-agent-card) (yours, or synthesized from the metadata)
- The caller's wallet signs as payer and submits the transaction

## Quick Reference

| Item | Value |
|------|-------|
| **Method** | `POST` |
| **Path** | `/agents/mint` |
| **Auth** | None |
| **Response** | Serialized transaction + `assetAddress` |

## Endpoint

```
POST /agents/mint
```

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `wallet` | `string` | Yes | Wallet that will pay for and own the agent (base58). |
| `network` | `string` | Yes | `solana-mainnet` or `solana-devnet`. |
| `name` | `string` | Yes | Agent name for the Core asset. |
| `uri` | `string` | Yes | URI of the asset's off-chain JSON metadata. |
| `agentMetadata` | `object` | Yes | EIP-8004 agent registration JSON (name, description, image, services, registrations, active, …). |
| `collectionAddress` | `string` | No | Core collection to mint the agent into. |
| `a2aCard` | `object` | No | Pre-built A2A AgentCard. When omitted, one is synthesized from `agentMetadata`. |

## Example Request

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

## Response

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

## Signing and Submitting

The returned transaction is already signed by the asset keypair; your wallet co-signs as payer and submits:

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

## Errors

| Status | Body | Meaning |
|--------|------|---------|
| `400` | `{ "success": false, "error": "Invalid input data", "details": [...] }` | Request body failed validation; `details` lists the issues. |
| `400` | `{ "success": false, "error": "<message>" }` | Build failure (e.g. collection not found). |
| `500` | `{ "success": false, "error": "Failed to prepare mint agent" }` | Server error. |

## Notes

- The Metaplex registry entry (`solana:101:metaplex`) is automatically added to the front of `agentMetadata.registrations`.
- A hosted A2A service entry is spliced into `services[]` so EIP-8004 consumers can discover the [AgentCard endpoint](/api/get-agent-card); this is a no-op if you already authored one.
- The agent record is stored when you call this endpoint, but it only appears in [List Agents](/api/list-agents) once the signed transaction has been confirmed and indexed.
- For a guided walkthrough with the SDK, see [Mint an Agent](/agents/mint-agent).
