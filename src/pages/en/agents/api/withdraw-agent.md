---
title: Withdraw from Agent
metaTitle: Agents - Withdraw from Agent Wallet | REST API | Metaplex
description: Build a transaction that withdraws SOL from an agent's wallet back to its owner. Owner-only.
method: POST
created: '08-01-2026'
updated: '08-01-2026'
keywords:
  - Agent API
  - withdraw
  - agent wallet
  - execute
about:
  - API endpoint
  - Agent finance
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

Build a transaction that transfers SOL from an agent's signer PDA wallet back to the agent's owner. Only the current owner of the agent's Core asset can withdraw. {% .lead %}

## Summary

- Wraps a SOL transfer in an `execute` instruction so the agent's wallet PDA can sign
- Ownership is verified server-side against the Core asset before the transaction is built
- Returns an unsigned transaction for the owner to sign and submit

## Quick Reference

| Item | Value |
|------|-------|
| **Method** | `POST` |
| **Path** | `/agents/{address}/withdraw` |
| **Auth** | None (ownership enforced on-chain and at build time) |
| **Response** | Serialized transaction |

## Endpoint

```
POST /agents/{address}/withdraw
```

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `address` | `string` | Yes | The agent's Core asset mint address (base58). |

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sender` | `string` | Yes | The agent owner's wallet (base58). Receives the SOL and signs the transaction. |
| `amount` | `number` | Yes | Amount in SOL. Must be positive. |
| `network` | `string` | No | `solana-mainnet` (default) or `solana-devnet`. |

## Example Request

```bash
curl -X POST "https://api.metaplex.com/v1/agents/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN/withdraw" \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "4Nd1mYvJ9jVexjIXG5oJhanoGWyF7Cz6XkY8dEc4RsyG",
    "amount": 0.25
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

The owner deserializes, signs, and submits the transaction — see [Signing and Submitting](/agents/api/mint-agent#signing-and-submitting).

## Errors

| Status | Body | Meaning |
|--------|------|---------|
| `400` | `{ "success": false, "error": "Invalid input data" }` | Body or address failed validation. |
| `403` | `{ "success": false, "error": "Only the agent owner can withdraw funds" }` | `sender` does not own the agent's Core asset. |
| `404` | `{ "success": false, "error": "Agent not found" }` | No Core asset at this address on the given network. |
| `500` | `{ "success": false, "error": "Failed to prepare withdraw transaction" }` | Server error. |

## Notes

- The build-time ownership check is a convenience; the `execute` instruction enforces ownership on-chain regardless, so a forged request cannot move funds.
- The withdrawal destination is always the `sender` (the owner) — funds cannot be redirected to a third party.
- To add funds, see [Fund Agent](/agents/api/fund-agent).
