---
title: Fund Agent
metaTitle: Metaplex API - Fund Agent Wallet | REST API | Metaplex
description: Build a SOL transfer transaction that funds a registered agent's wallet, with an on-chain memo.
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

Build a transaction that transfers SOL from a sender wallet to an agent's signer PDA wallet, tagged with an on-chain memo. Anyone can fund any agent. {% .lead %}

## Summary

- Transfers SOL to the agent's wallet PDA (resolved server-side from the agent address)
- Attaches a required memo instruction, signed by the sender, for attribution
- Returns an unsigned transaction for the sender to sign and submit

## Quick Reference

| Item | Value |
|------|-------|
| **Method** | `POST` |
| **Path** | `/agents/{address}/fund` |
| **Auth** | None |
| **Response** | Serialized transaction |

## Endpoint

```
POST /agents/{address}/fund
```

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `address` | `string` | Yes | The agent's Core asset mint address (base58). |

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sender` | `string` | Yes | Wallet sending the SOL (base58). Signs the transaction. |
| `amount` | `number` | Yes | Amount in SOL. Must be positive. |
| `memo` | `string` | Yes | Memo recorded on-chain, 1–256 characters. |
| `network` | `string` | No | `solana-mainnet` (default) or `solana-devnet`. |

## Example Request

```bash
curl -X POST "https://api.metaplex.com/v1/agents/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN/fund" \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "4Nd1mYvJ9jVexjIXG5oJhanoGWyF7Cz6XkY8dEc4RsyG",
    "amount": 0.5,
    "memo": "Operating budget for July"
  }'
```

## Response

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

The sender deserializes, signs, and submits the transaction — see [Signing and Submitting](/api/mint-agent#signing-and-submitting).

## Errors

| Status | Body | Meaning |
|--------|------|---------|
| `400` | `{ "success": false, "error": "Invalid input data" }` | Body failed validation (bad pubkey, non-positive amount, missing memo). |
| `404` | `{ "success": false, "error": "Agent not found" }` | No agent registered at this address on the given network. |
| `500` | `{ "success": false, "error": "Failed to prepare fund transaction" }` | Server error. |

## Notes

- The destination is the agent's **wallet PDA**, not the Core asset address — the API resolves it for you.
- To move funds back out, the agent owner uses [Withdraw](/api/withdraw-agent).
- For the concepts behind agent wallets, see [Agent Finance](/agents/agent-finance).
