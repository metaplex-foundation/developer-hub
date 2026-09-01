---
title: Nori - Pay-As-You-Go Services for Metaplex Agents
metaTitle: Nori - Pay-As-You-Go LLM, Image, and RPC Services for Agents | Metaplex
description: Nori is a Metaplex service agent that sells LLM inference, image generation, and Solana RPC access to other agents, metered in SOL per call. Learn how delegate-pay billing works and how to use Nori as a reference implementation for your own service agent.
keywords:
  - Nori
  - service agent
  - agent plumber
  - pay-as-you-go inference
  - delegate-pay
  - x402 payments
  - A2A protocol
  - agent-to-agent services
  - Metaplex agent
about:
  - Nori
  - Agent Commerce
  - Autonomous Agents
  - Solana
  - Metaplex
proficiencyLevel: Intermediate
created: '07-08-2026'
updated: '07-08-2026'
faqs:
  - q: What is Nori?
    a: Nori is a pay-as-you-go service agent operated by the Metaplex Foundation. It sells LLM inference, image generation, and Solana RPC access to other agents, priced in USD and settled in SOL per call against the calling agent's onchain PDA wallet. It is also the open-source reference implementation for building Metaplex service agents.
  - q: Do I need my own LLM provider API keys to use Nori?
    a: No. Nori holds the upstream provider keys (Anthropic, OpenAI, Google, image generation, paid Solana RPC). A consumer agent only needs a Solana keypair and a registered agent asset — every call settles per-use in SOL against the agent's PDA wallet.
  - q: What happens to my agent if Nori goes down?
    a: A delegated agent that relies on Nori for inference, images, or RPC loses those capabilities while Nori is unavailable. Nori's surfaces are OpenAI-compatible and standard Solana JSON-RPC, so a break-glass fallback is pointing your client at any other OpenAI-compatible provider or RPC endpoint with your own keys. Self-hosting your own Nori instance is planned for v2.
  - q: Is delegating to Nori safe? Can Nori drain my wallet?
    a: Delegation grants Nori billing authority over your agent's PDA wallet, so only keep a working balance there. Every charge carries an onchain Memo receipt you can audit, charges are only taken for successful calls, and the asset owner can revoke the delegation at any time, which hard-stops the delegate-pay rail.
  - q: What is the difference between the delegate-pay rail and the x402 rail?
    a: Delegate-pay is the primary rail — after a one-time onchain delegation, Nori charges your agent's PDA directly per call with no payment round-trip. x402 is the fallback for non-delegated callers — the first request returns HTTP 402 with payment requirements, the caller pays, then retries.
---

Nori is a pay-as-you-go **service agent** operated by the Metaplex Foundation. It sells LLM inference, image generation, and Solana RPC access to other agents — priced in USD, settled in SOL per call against the calling agent's onchain wallet. Nori is also the open-source reference implementation of a Metaplex service agent: agent builders can study (and copy) its [A2A surface](/agents/agent-commerce), delegate-pay billing, x402 fallback, and rate-card patterns. {% .lead %}

## Summary

Nori removes the plumbing every agent operator otherwise wires up themselves — LLM provider keys, an image-generation account, paid Solana RPC, and per-call billing. A consumer agent needs only a Solana keypair and a [registered agent asset](/agents/register-agent).

- **Three metered services** — `chat.completion` (Anthropic / OpenAI / Google, tool calls supported), `image.generation` (gpt-image-1), and `solana.rpc` (RPC + DAS pass-through)
- **Two payment rails** — [delegate-pay](/agents/nori/delegate-to-nori) (primary, one-time onchain setup) and x402 v2 (fallback, per-call HTTP 402 flow)
- **Charge-on-success billing** — the upstream call runs first; failed calls are never charged, and every charge carries an onchain Memo receipt
- **Single point of failure caveat** — a delegated agent depends on Nori's availability for inference, images, and RPC; see [Nori as a single point of failure](#nori-as-a-single-point-of-failure) for mitigations

{% callout type="note" title="Two audiences, one page" %}
Use this section if you are **consuming** Nori's services from your own agent, or if you are **building a service agent** and want a working reference for A2A skills, per-call billing, and rate-card publication. The [source repository](https://github.com/metaplex-foundation/agent-plumber) is open source.
{% /callout %}

## Services Nori Provides

Nori exposes three services over two surfaces that share one handler stack. Skill input/output uses canonical OpenAI wire format for chat and images, and standard Solana JSON-RPC for RPC — an A2A caller and an OpenAI-SDK caller send byte-identical payloads.

| Service | Skill ID | Endpoint | Upstream |
|---------|----------|----------|----------|
| LLM inference (tool calls supported) | `chat.completion` | `POST /v1/chat/completions` | Anthropic, OpenAI, Google — routed by `<provider>/<model>` prefix |
| Image generation | `image.generation` | `POST /v1/images/generations` | OpenAI gpt-image-1 |
| Solana RPC + DAS | `solana.rpc` | `POST /v1/solana/rpc` | Operator-configured RPC provider (DAS methods pass through) |

Both surfaces reach the same services:

- **OpenAI-compatible HTTP** (`/v1/*`) — point any OpenAI SDK or AI framework at Nori with `baseURL`. This is the surface most consumer agents use.
- **A2A JSON-RPC** (`/a2a`) — programmatic agent-to-agent calls. Discovery starts at `GET /.well-known/agent-card.json`, which advertises skills, payment schemes, and Nori's `serviceExecutiveAddress` (the address you register as a delegate).

## How Nori Payments Work

Nori picks a payment rail per call: delegate-pay when the caller has onboarded, x402 otherwise.

| Rail | When it fires | How it settles |
|------|---------------|----------------|
| **Delegate-pay** (primary) | Caller presents a valid bearer token and Nori is a registered [execution delegate](/smart-contracts/mpl-agent/tools) on the caller's agent asset | Nori signs an MPL Core Execute transaction transferring SOL from the caller's PDA to Nori's service PDA, with a Memo receipt — no payment round-trip |
| **x402 v2** (fallback) | No bearer token, invalid token, or delegation not set up | First request returns HTTP 402 with payment requirements; caller pays (SOL or USDC), retries, and receives the cached result |

The delegate-pay rail is what makes Nori invisible to your agent's end users: after a [one-time delegation](/agents/nori/delegate-to-nori), every call settles automatically with no wallet prompts and no over-quoted holds. Pricing is published on a versioned [rate card](/agents/nori/pricing-and-billing) with a price-change notice policy.

## Nori as a Single Point of Failure

A delegated agent that sources its inference, image generation, and RPC from Nori has made Nori a single point of failure: if Nori is unavailable, the agent loses those capabilities until Nori recovers. This is the top-ranked risk in Nori's own risk register, and the v1 mitigation is documentation and portable interfaces rather than redundancy.

Plan for it explicitly:

- **Interfaces are portable by design.** `chat.completion` is canonical OpenAI wire format and `solana.rpc` is standard Solana JSON-RPC. A break-glass fallback is a config change: point your OpenAI-compatible client at another provider (with your own key) and your RPC calls at any public or paid endpoint.
- **Keep break-glass credentials.** Zero-BYOK is Nori's convenience, not a requirement of your architecture. Holding a low-tier provider key and a free RPC URL in reserve keeps your agent degraded-but-alive during a Nori outage.
- **The x402 rail is an independent fallback for payment, not availability.** It removes the delegation dependency but still depends on Nori being up.
- **Delegation is revocable at any time.** If you migrate off Nori, the asset owner revokes the delegation record and the delegate-pay rail [hard-stops](/agents/nori/pricing-and-billing#hard-stop-semantics).

{% callout type="warning" title="Self-hosting is deferred to v2" %}
Running your own Nori instance (eliminating the shared dependency entirely) is planned for v2. In v1, the mitigation is the portable OpenAI/JSON-RPC interfaces above — design your agent so Nori's base URL is a config value, not an assumption.
{% /callout %}

## Using Nori as a Reference Implementation

Nori is the working blueprint for a Metaplex service agent — an agent that charges other agents for work. The [source repository](https://github.com/metaplex-foundation/agent-plumber) demonstrates each pattern end-to-end:

| Pattern | What Nori demonstrates |
|---------|------------------------|
| Agent card discovery | `/.well-known/agent-card.json` advertising skills, payment schemes, `serviceAssetAddress`, and `serviceExecutiveAddress` |
| Delegate-pay billing | Charging a caller's PDA via MPL Core Execute CPI with Memo receipts, with a 5-minute delegate-status cache |
| x402 v2 fallback | Canonical HTTP 402 flow with facilitator endpoints (`/verify`, `/settle`) and facilitator-as-feePayer so callers need no SOL for network fees |
| Rate card publication | `GET /rate-card` serving a versioned pricebook with a notice-period policy |
| Charge-on-success accounting | Upstream call first, charge second; failed calls return errors with no charge |
| Free delegation onboarding | Strictly-validated `POST /v1/delegate/submit` that co-signs the caller's delegation transaction as fee payer |

To add a new paid service in your own fork: write a payment-agnostic handler that returns a result plus `costUsd`, add pricing to the pricebook, wire it into the A2A skill dispatch, and declare it on the agent card.

## Quick Reference

| Item | Value |
|------|-------|
| Agent card | `GET /.well-known/agent-card.json` |
| Rate card | `GET /rate-card` |
| Services | `chat.completion`, `image.generation`, `solana.rpc` |
| OpenAI-compatible base URL | `<NORI_URL>/v1` |
| A2A endpoint | `POST /a2a` (JSON-RPC 2.0, `message/send`) |
| Payment rails | Delegate-pay (primary), x402 v2 (fallback) |
| Delegation program | `mpl-agent-tools` — `TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S` |
| Source | [GitHub](https://github.com/metaplex-foundation/agent-plumber) |

## Notes

- Nori's deployed base URL is published via its agent registration; examples across this section use `NORI_URL` as a placeholder for the base URL
- Charges are priced in USD and converted to SOL at charge time using the live Jupiter SOL/USD price (30-second cache) — see [Pricing and Billing](/agents/nori/pricing-and-billing)
- Delegation grants Nori billing authority over your agent's PDA wallet. Keep only a working balance there and audit the Memo receipts on each charge
- `message/sendStream` is declared on the agent card but returns 501 in v1; A2A calls are synchronous
- Nori (the hosted Metaplex service) and agent-plumber (the open-source implementation) are the same codebase; this documentation uses "Nori" for both

Maintained by Metaplex Foundation. Last verified: 2026-07-08.

## FAQ

Common questions about Nori.

### What is Nori?
Nori is a pay-as-you-go service agent operated by the Metaplex Foundation. It sells LLM inference, image generation, and Solana RPC access to other agents, priced in USD and settled in SOL per call against the calling agent's onchain PDA wallet. It is also the open-source reference implementation for building Metaplex service agents.

### Do I need my own LLM provider API keys to use Nori?
No. Nori holds the upstream provider keys (Anthropic, OpenAI, Google, image generation, paid Solana RPC). A consumer agent only needs a Solana keypair and a [registered agent asset](/agents/register-agent) — every call settles per-use in SOL against the agent's PDA wallet.

### What happens to my agent if Nori goes down?
A delegated agent that relies on Nori for inference, images, or RPC loses those capabilities while Nori is unavailable. Nori's surfaces are OpenAI-compatible and standard Solana JSON-RPC, so a break-glass fallback is pointing your client at any other OpenAI-compatible provider or RPC endpoint with your own keys. Self-hosting your own Nori instance is planned for v2.

### Is delegating to Nori safe? Can Nori drain my wallet?
Delegation grants Nori billing authority over your agent's PDA wallet, so only keep a working balance there. Every charge carries an onchain Memo receipt you can audit, [charges are only taken for successful calls](/agents/nori/pricing-and-billing#charge-on-success-accounting), and the asset owner can [revoke the delegation](/agents/nori/delegate-to-nori#revoking-delegation-from-nori) at any time, which hard-stops the delegate-pay rail.

### What is the difference between the delegate-pay rail and the x402 rail?
Delegate-pay is the primary rail — after a one-time onchain delegation, Nori charges your agent's PDA directly per call with no payment round-trip. x402 is the fallback for non-delegated callers — the first request returns HTTP 402 with payment requirements, the caller pays (SOL or USDC), then retries.

## Glossary

Core terms used across the Nori documentation.

| Term | Definition |
|------|------------|
| **Nori** | The Metaplex Foundation's pay-as-you-go service agent, and the reference implementation (agent-plumber) for Metaplex service agents |
| **Service agent** | An agent that sells services to other agents and charges per call |
| **Delegate-pay** | Nori's primary payment rail — after a one-time execution delegation, Nori charges the caller's PDA directly via an MPL Core Execute transaction |
| **x402** | An HTTP `402 Payment Required` protocol for machine-to-machine payments; Nori's fallback rail for non-delegated callers |
| **Rate card** | Nori's published price list at `GET /rate-card` — versioned, USD-denominated, with a price-change notice policy |
| **Charge-on-success** | Nori's billing rule: the upstream call runs first, and only successful calls are charged |
| **Hard stop** | Immediate end of delegate-pay service when the caller undelegates or the caller's PDA wallet cannot cover a charge |
| **Asset Signer (PDA wallet)** | The agent's onchain wallet, an [MPL Core](/smart-contracts/core) PDA derived from `["mpl-core-execute", asset]` — the account Nori's charges draw from |
| **Executive profile** | The onchain identity of an off-chain signer in [`mpl-agent-tools`](/smart-contracts/mpl-agent/tools); you delegate to Nori's executive profile |
| **Agent card** | The A2A discovery document at `/.well-known/agent-card.json` advertising skills, payment schemes, and Nori's service addresses |
