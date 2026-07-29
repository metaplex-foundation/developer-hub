---
title: Nori Pricing and Billing
metaTitle: Nori Pricing and Billing - Rate Card, Charge-on-Success, Hard Stops | Metaplex
description: How Nori prices and bills service calls - the published rate card at GET /rate-card, USD-to-SOL conversion at charge time, charge-on-success accounting, the price-change notice policy, and hard-stop semantics on undelegate and wallet-empty.
keywords:
  - Nori rate card
  - Nori pricing
  - charge-on-success
  - price-change notice
  - hard stop
  - wallet empty
  - undelegate
  - agent billing
  - pay-per-call
about:
  - Nori
  - Agent Commerce
  - Solana
  - Metaplex
proficiencyLevel: Intermediate
created: '07-08-2026'
updated: '07-08-2026'
faqs:
  - q: Am I charged if a Nori call fails?
    a: No. Nori runs the upstream call first and only charges on success. A failed upstream call returns an error with no charge. On the x402 rail, the result is computed once and cached, so a paid retry returns the cached result and is never re-run or double-billed.
  - q: How does Nori convert USD prices to SOL?
    a: The rate card is USD-denominated. At charge time Nori recomputes the SOL amount using the live SOL/USD spot price from the Jupiter price API, cached for 30 seconds. The exact lamports charged therefore track the market rate at the moment of the call.
  - q: How much notice does Nori give before a price change?
    a: The rate card carries a policy block with notice_period_days (7 by default). Price increases are committed with an effective_at timestamp at least the notice period in the future, and charges before effective_at continue at the previously published rate. Change history is available at the policy's notice_url.
  - q: What happens when my agent's wallet runs out of SOL?
    a: A hard stop. When the PDA cannot cover a charge, the delegate-pay charge fails and the call falls back to an HTTP 402 x402 challenge — service is not rendered on credit. Calls resume as soon as you top up the PDA.
  - q: What happens if I undelegate from Nori mid-flight?
    a: The next charge attempt fails onchain, Nori invalidates its cached delegate status, and the delegate-pay rail hard-stops. Subsequent calls receive x402 payment challenges. Nothing can be charged after revocation because the chain rejects the Execute transaction.
  - q: Where can I verify what Nori charged my agent?
    a: Every charge is a SOL transfer from your agent's PDA to Nori's service PDA with a Memo instruction carrying a structured receipt. Your agent's onchain transaction history is the complete, independently auditable billing record.
---

Nori prices every call in USD from a published, versioned rate card, converts to SOL at the moment of the charge, and bills only on success — a failed upstream call is never charged. Price changes follow a notice-period policy, and billing hard-stops immediately when a caller undelegates or their wallet cannot cover a charge. {% .lead %}

## Summary

Nori's billing model is designed to be auditable from the outside: public prices, onchain receipts, and no charges without service.

- **Rate card** — `GET /rate-card` serves the full USD pricebook with version, `effective_at`, markup factor, and the price-change policy
- **Charge-on-success** — the upstream call runs first; failures return errors with no charge, and paid x402 retries return a cached result rather than re-running the call
- **Price-change notice** — increases are committed with an `effective_at` at least `notice_period_days` (default 7) in the future; earlier charges stay at the previously published rate
- **Hard stops** — undelegation and wallet-empty both stop delegate-pay billing immediately; calls fall back to x402 challenges rather than accruing debt

## The Nori Rate Card

`GET /rate-card` is the canonical, machine-readable price list — always check it rather than relying on any snapshot in documentation. It serves the full pricebook plus policy metadata with a 5-minute cache:

```json {% title="GET /rate-card (abridged)" %}
{
  "version": 1,
  "effective_at": "2026-05-21T00:00:00.000Z",
  "policy": {
    "notice_period_days": 7,
    "notice_url": "https://github.com/metaplex-foundation/agent-plumber/blob/main/packages/shared/src/pricebook.json",
    "description": "Price changes are announced by editing this file..."
  },
  "markup_factor": 1.25,
  "llm": {
    "anthropic/claude-sonnet-4-6": {
      "inputPerMillion": 3.0,
      "outputPerMillion": 15.0,
      "cachedInputPerMillion": 0.3
    }
  },
  "image": { "openai/gpt-image-1": { "perImage": 0.04 } },
  "rpc": { "default": { "perCall": 0.0001 } }
}
```

### Rate Card Schema

| Field | Meaning |
|-------|---------|
| `version` | Monotonic card version; bumped on every price change |
| `effective_at` | ISO timestamp at which this card's prices take effect |
| `policy.notice_period_days` | Minimum days between committing a price increase and its `effective_at` (default 7) |
| `policy.notice_url` | Where the card (and its change history) is published |
| `markup_factor` | Uniform retail markup applied to the wholesale USD prices at charge time (1.25×) |
| `llm.<provider/model>` | Wholesale USD per million input / output / cached-input tokens |
| `image.<provider/model>` | Wholesale USD per generated image |
| `rpc.default` | Wholesale USD per RPC or DAS call |

Listed prices are **wholesale**; the amount charged is `wholesale × markup_factor`. `GET /v1/models` enumerates the available LLM model IDs from the same source for OpenAI-SDK clients.

### How a Charge Is Priced

Each service computes a USD cost from the rate card, then converts to SOL at charge time.

1. The service handler returns a result plus `costUsd` — token counts × per-million prices for `chat.completion`, per-image for `image.generation`, per-call for `solana.rpc`
2. The markup factor (1.25×) is applied to the wholesale cost
3. The USD amount converts to lamports using the live SOL/USD spot price from the Jupiter price API (30-second cache)
4. The charge lands as a SOL transfer from your agent's PDA to Nori's service PDA, with a Memo receipt

{% callout type="note" title="Every charge carries an onchain receipt" %}
The Memo instruction on each charge transaction encodes a structured receipt (service, request, and cost details). Your agent's transaction history against Nori's service PDA is a complete, independently auditable billing record — no trust in Nori's off-chain accounting required.
{% /callout %}

## Charge-on-Success Accounting

Nori never charges for a call it did not successfully serve. The ordering is upstream-first, charge-second, on both payment rails:

- **Delegate-pay rail** — Nori runs the upstream call (LLM, image, RPC); if it succeeds, Nori charges the PDA and returns the result. If the upstream call fails, the caller gets an error response and no charge.
- **x402 rail** — the first request (before payment) runs the upstream call and caches the result keyed by the payment challenge. The 402 response quotes the exact cost of the already-computed result. When the caller pays and retries, Nori returns the **cached** result — the upstream call is never re-run, so it can never be double-billed, and the price quoted is the price settled.

The failure case worth noting is the inverse: on the delegate-pay rail, if the upstream call succeeds but the charge itself fails (revoked delegation, empty wallet), the caller may receive that one result unpaid, and the rail then [hard-stops](#hard-stop-semantics). Nori absorbs that single-call loss rather than holding funds hostage in advance.

## Price-Change Notice Policy

Price changes are announced in advance through the rate card itself — there are no silent price increases on the delegate-pay rail. The policy, embedded in the card's `policy` block:

1. A price change is published by committing a new card with a bumped `version` and a future `effective_at`
2. For increases, `effective_at` must be at least `notice_period_days` (default **7 days**) after the commit
3. Charges before `effective_at` continue at the previously published rate
4. The full change history is public at `policy.notice_url`

Acceptance is implicit at delegation time: by delegating, an agent accepts the published card and its notice policy. If a published change is unacceptable, [revoke the delegation](/agents/nori/delegate-to-nori#revoking-delegation-from-nori) before `effective_at` — revocation is an immediate hard stop, so no charge can land at a rate you didn't accept.

To monitor for changes programmatically, poll `GET /rate-card` (it is cached for 5 minutes) and alert when `version` increments or `effective_at` moves.

## Hard-Stop Semantics

Two conditions stop delegate-pay billing immediately, by construction rather than by policy: the chain refuses the charge, so no debt can accrue.

### Hard Stop on Undelegate

Revoking the execution delegation ends Nori's charging authority at the chain level. The next charge attempt fails with `Neither the asset or any plugins have approved this operation`, Nori busts its cached delegate status for the asset, and subsequent calls fall through to the x402 rail — the caller receives HTTP 402 payment challenges instead of auto-charges. Because delegate status is cached for up to 5 minutes, one in-flight call may still attempt (and fail) a delegate charge right after revocation; the onchain check is what enforces the stop, so nothing can be charged post-revocation.

### Hard Stop on Wallet-Empty

When the agent's PDA cannot cover a charge, the delegate charge fails and the call is not served on credit. The caller receives an x402 challenge (HTTP 402) and can either pay that call directly or top up the PDA to resume delegate-pay. Nori extends no credit line — an underfunded agent degrades to pay-per-call-with-challenge, it does not accumulate debt.

{% callout type="note" title="Keep the PDA above the rent-exempt floor" %}
The PDA needs to stay above the system rent-exempt minimum (890,880 lamports) for transfers out of it to succeed. Budget the working balance as `expected calls × typical charge + rent-exempt floor`. The agent template seeds new delegations with 0.002 SOL for exactly this reason.
{% /callout %}

Operationally, treat both hard stops as monitoring signals in your agent: a sudden shift from 200 responses to 402 challenges on previously delegate-paid calls means the delegation is gone or the wallet is empty.

## Quick Reference

| Item | Value |
|------|-------|
| Rate card endpoint | `GET /rate-card` (5-minute cache) |
| Model directory | `GET /v1/models` |
| Denomination | USD prices, settled in SOL (Jupiter spot, 30s cache) |
| Markup | 1.25× wholesale, uniform |
| Notice period | 7 days (`policy.notice_period_days`) |
| Billing rule | Charge-on-success; x402 retries return cached results |
| Undelegate | Immediate hard stop → x402 fallback |
| Wallet-empty | Immediate hard stop → x402 challenge until top-up |
| Receipts | Memo instruction on every charge transaction |

## Notes

- The pricebook bundled in the [source repository](https://github.com/metaplex-foundation/agent-plumber) is a snapshot of published list prices at release; `GET /rate-card` on the live instance is the operative price list
- Rate-card prices are wholesale — multiply by `markup_factor` for the charged amount
- The exact lamports charged for the same call vary with the SOL/USD rate at charge time; the USD amount is what's fixed by the card
- Hard stops apply to the delegate-pay rail; the x402 rail is inherently prepaid per call and has no equivalent failure mode
- Operators forking Nori as a reference implementation edit `packages/shared/src/pricebook.json` directly and should honor the same `effective_at` notice discipline

Maintained by Metaplex Foundation. Last verified: 2026-07-08. [View source on GitHub](https://github.com/metaplex-foundation/agent-plumber).

## FAQ

Common questions about Nori pricing and billing.

### Am I charged if a Nori call fails?
No. Nori runs the upstream call first and only charges on success. A failed upstream call returns an error with no charge. On the x402 rail, the result is computed once and cached, so a paid retry returns the cached result and is never re-run or double-billed.

### How does Nori convert USD prices to SOL?
The rate card is USD-denominated. At charge time Nori recomputes the SOL amount using the live SOL/USD spot price from the Jupiter price API, cached for 30 seconds. The exact lamports charged therefore track the market rate at the moment of the call.

### How much notice does Nori give before a price change?
The rate card carries a `policy` block with `notice_period_days` (7 by default). Price increases are committed with an `effective_at` timestamp at least the notice period in the future, and charges before `effective_at` continue at the previously published rate. Change history is available at the policy's `notice_url`.

### What happens when my agent's wallet runs out of SOL?
A hard stop. When the PDA cannot cover a charge, the delegate-pay charge fails and the call falls back to an HTTP 402 x402 challenge — service is not rendered on credit. Calls resume as soon as you top up the PDA.

### What happens if I undelegate from Nori mid-flight?
The next charge attempt fails onchain, Nori invalidates its cached delegate status, and the delegate-pay rail hard-stops. Subsequent calls receive x402 payment challenges. Nothing can be charged after revocation because the chain rejects the Execute transaction.

### Where can I verify what Nori charged my agent?
Every charge is a SOL transfer from your agent's PDA to Nori's service PDA with a Memo instruction carrying a structured receipt. Your agent's onchain transaction history is the complete, independently auditable billing record.
