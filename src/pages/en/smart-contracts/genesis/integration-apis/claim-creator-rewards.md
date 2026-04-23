---
title: Claim Creator Rewards
metaTitle: Genesis - Claim Creator Rewards | REST API | Metaplex
description: Claim accrued creator rewards for a wallet across all Genesis bonding-curve and Raydium buckets in a single API call. Returns ready-to-sign Solana transactions.
method: POST
created: '04-23-2026'
updated: '04-23-2026'
keywords:
  - Genesis API
  - claim creator rewards
  - creator fees
  - claimCreatorRewards
  - v1/creator-rewards/claim
  - payer
about:
  - API endpoint
  - Creator rewards
  - Bonding curve fees
  - Raydium CPMM fees
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Bash
---

Claim accrued creator rewards for a wallet across every Genesis bonding-curve and Raydium CPMM bucket the wallet is entitled to, in a single call. The endpoint returns a list of base64-encoded Solana transactions that the wallet (or a designated payer) must sign and submit. {% .lead %}

{% callout type="note" title="SDK wrapper available" %}
Most integrators should use [`claimCreatorRewards`](/smart-contracts/genesis/sdk/api-client#claim-creator-rewards) from the Genesis JavaScript SDK — it deserializes the transactions, handles error parsing, and plugs directly into a [Umi identity](dev-tools/umi/getting-started#connecting-a-wallet) for signing. Call this endpoint directly only if you cannot depend on the SDK.
{% /callout %}

## Endpoint

```
POST /v1/creator-rewards/claim
```

| Environment | Base URL |
|-------------|----------|
| Devnet & Mainnet | `https://api.metaplex.com` |

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `wallet` | `string` | Yes | Base58-encoded public key of the creator fee wallet to claim for. This is the wallet set as `creatorFeeWallet` on the bucket — or the launching wallet if no override was configured. |
| `network` | `string` | No | `'solana-mainnet'` (default) or `'solana-devnet'`. Must match the base URL's cluster. |
| `payer` | `string` | No | Base58-encoded public key that covers transaction fees and any rent on the returned transactions. Defaults to `wallet` when omitted. |

### When to set `payer`

Set `payer` to a different wallet when the creator fee wallet does not hold SOL (for example, an agent PDA or a cold wallet). The payer must sign the returned transactions, so it is typically the wallet submitting the claim on behalf of the creator. The creator fee recipient still receives the claimed SOL — `payer` only covers fees and rent.

## Example Request

{% code-tabs-imported from="genesis/api_claim_creator_rewards" frameworks="umi,curl" defaultFramework="umi" /%}

## Success Response

```json
{
  "data": {
    "transactions": ["<base64 transaction>", "<base64 transaction>"],
    "blockhash": {
      "blockhash": "ERKYmtrmNSKaw3VpnFYAfK3jvWGnd15Nf9kJxZqJ7JHx",
      "lastValidBlockHeight": 445407640
    }
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `data.transactions` | `string[]` | Base64-encoded Solana transactions. Each must be deserialized, signed by the payer (and the creator fee wallet if it is a separate signer), and submitted. |
| `data.blockhash.blockhash` | `string` | Recent blockhash the transactions were built against. Use this with `confirmTransaction` — do not replace it with a freshly fetched blockhash. |
| `data.blockhash.lastValidBlockHeight` | `number` | Slot height after which the blockhash expires. |

{% callout type="note" %}
The API returns one transaction per bucket being claimed — often two (bonding-curve plus Raydium). Submit them sequentially; their order is not significant.
{% /callout %}

## Error Response

Errors are returned with HTTP status `400` and the shape:

```json
{ "error": { "message": "No rewards available to claim" } }
```

### Known Error Messages

| Message | HTTP | Cause |
|---------|------|-------|
| `No rewards available to claim` | `400` | The wallet has no accrued-and-unclaimed creator rewards on any bucket. This is returned instead of an empty `transactions` array, so callers must handle it as a non-exceptional outcome. |
| `✖ Invalid wallet address` | `400` | `wallet` is not a valid base58 Solana public key. |

{% callout type="warning" title="No-rewards is a 400, not an empty array" %}
The endpoint returns HTTP `400` with the message `No rewards available to claim` when a wallet has nothing to claim — it does **not** return `200` with `transactions: []`. Callers must catch the error (or inspect `response.status` and `body.error.message`) and treat this case as "nothing to do" rather than a failure. The SDK surfaces this as a typed `GenesisApiError`; see [error handling](/smart-contracts/genesis/creator-fees#handling-the-no-rewards-case).
{% /callout %}

## Notes

- The endpoint is idempotent at the bucket level — calling it again immediately after a successful claim returns `No rewards available to claim` until new fees accrue.
- The returned transactions use the blockhash in `data.blockhash`. If confirmation takes longer than ~60–90 seconds, the blockhash will expire and the call must be repeated to get a fresh set of transactions.
- Creator rewards accrue on every swap (bonding curve) and from LP trading activity (Raydium CPMM) — this endpoint aggregates both. For the underlying accrual mechanics and per-bucket fetch helpers, see [Creator Fees on the Genesis Bonding Curve](/smart-contracts/genesis/creator-fees).
- The creator fee wallet is set at bucket creation via `creatorFeeWallet` and cannot be changed after a curve goes live.

## Recommended: Use the SDK

Instead of calling this endpoint directly, use [`claimCreatorRewards`](/smart-contracts/genesis/sdk/api-client#claim-creator-rewards) from `@metaplex-foundation/genesis`:

{% code-tabs-imported from="genesis/api_claim_creator_rewards" frameworks="umi" filename="claimCreatorRewards" /%}

See the [API Client](/smart-contracts/genesis/sdk/api-client) page for the full SDK surface, and [Creator Fees](/smart-contracts/genesis/creator-fees) for the end-to-end claim guide.
