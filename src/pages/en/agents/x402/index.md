---
title: Metaplex x402 - Pay-Per-Request AI and Solana RPC
metaTitle: Metaplex x402 - Pay-Per-Request AI Inference and Solana RPC for Agents | Metaplex
description: Metaplex x402 sells LLM inference, image generation, and Solana RPC over HTTP with no API keys and no accounts. Every request pays for itself in USDC from a wallet, a Core asset, or a delegated agent.
keywords:
  - Metaplex x402
  - x402 payments
  - pay per request API
  - agent payments
  - OpenAI compatible API
  - Solana RPC
  - USDC micropayments
  - Mech agent
about:
  - Metaplex x402
  - Agent Commerce
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '09-08-2026'
updated: '09-08-2026'
faqs:
  - q: What is Metaplex x402?
    a: Metaplex x402 is a pay-per-request HTTP API selling LLM inference, image generation, and Solana RPC access. There are no API keys, accounts, or subscriptions — each request settles in USDC on Solana using the x402 protocol, which turns the HTTP 402 Payment Required status into a machine-payable flow.
  - q: Do I need an API key or an account to use Metaplex x402?
    a: No. Payment is the authentication. You need a Solana wallet, Core asset, or registered agent holding USDC. The OpenAI SDK requires a non-empty apiKey value, so the examples pass the literal string 'x402', which the gateway ignores.
  - q: What is Mech?
    a: Mech is the onchain Metaplex agent that operates the x402 services. Payments settle in USDC to Mech's Core wallet — its asset signer PDA. Mech is an agent selling services to your agent or wallet, at address MECHjj31U1hBapoVeJtZo5U5WGRd2293JEwRErvPTuF.
  - q: What happened to the Nori service agent documentation?
    a: The Nori pages documented an early prototype that was never released publicly and is no longer maintained. Metaplex x402 is the shipped service that replaced it. The name Nori now refers to the Metaplex AI copilot at metaplex.com/nori, which is a separate product unrelated to paid inference and RPC.
  - q: Does Metaplex x402 charge in SOL or USDC?
    a: USDC. Payments are made from a classic SPL Token associated token account; Token-2022 payment mints are not supported. Core asset and agent payment modes additionally need a small SOL balance in the asset signer PDA to cover Core execute transaction fees.
  - q: Is the Metaplex x402 server open source?
    a: The client is. The TypeScript client, its examples, and the protocol types are published at github.com/metaplex-foundation/x402 under Apache-2.0. The server that runs the hosted service is not currently published.
  - q: How much does a request cost?
    a: Inference pricing mirrors the upstream providers' token rates with a $0.001 per-request minimum, and RPC calls are priced per request from $0.00001 with higher per-method rates for heavier calls. GET /x402/pricing returns the live rates and is free to call.
---

Metaplex x402 is a pay-per-request HTTP API for LLM inference, image generation, and Solana RPC — no API keys, no accounts, no subscriptions. Bring a USDC-funded Solana wallet, [Core asset](/smart-contracts/core), or [registered agent](/agents/register-agent), and every request pays for itself in USDC as it is made. {% .lead %}

## Summary

Metaplex x402 turns HTTP's `402 Payment Required` status into a machine-payable flow: your app calls an endpoint, the server responds `402` with payment requirements, the client signs a USDC payment and retries, and the server settles on Solana and returns the response. The service is operated by [Mech](#mech-the-agent-that-operates-metaplex-x402), an onchain Metaplex agent.

- **Three services** — OpenAI-compatible chat completions, OpenAI-compatible image generation, and Solana JSON-RPC with [DAS](/solana/rpcs-and-das) pass-through
- **Three payment modes** — a standard wallet, a Core asset or agent paying directly, or a [delegated agent](/agents/x402/payment-modes#pay-instantly-with-a-delegated-agent) that pays without a per-request signature
- **USDC settlement** — payments come from a classic SPL Token associated token account; Token-2022 payment mints are not supported
- **Open-source client** — [`@metaplex-foundation/x402`](https://github.com/metaplex-foundation/x402) is Apache-2.0 with 12 runnable examples; the hosted server is not published

{% callout type="note" title="Metaplex x402 and the name Nori" %}
Metaplex x402 replaces an earlier service-agent prototype that was documented here as "Nori". That prototype was never released publicly and is no longer maintained; its SOL-denominated billing, `/a2a` surface, and agent card do not exist in this service. **[Nori](https://www.metaplex.com/nori) is now the Metaplex AI copilot** — a separate product, unrelated to paid inference and RPC.
{% /callout %}

## Services Metaplex x402 Provides

Metaplex x402 exposes three paid services and two free discovery endpoints under a single base URL, `https://api.metaplex.com/x402`.

| Service | Endpoint | Payment | Upstream |
|---------|----------|---------|----------|
| Chat completions | `POST /x402/chat/completions` | Paid | Anthropic and OpenAI models, addressed as `<provider>/<model>` |
| Image generation | `POST /x402/images/generations` | Paid | OpenAI `gpt-image-1.5` and `gpt-image-2` |
| Solana RPC and DAS | `POST /x402/rpc` | Paid | Solana JSON-RPC, HTTP only |
| Model discovery | `GET /x402/models` | Free | Available model IDs |
| Pricing discovery | `GET /x402/pricing` | Free | Token rates, request minimums, RPC method prices |

The chat and image endpoints speak canonical OpenAI wire format, so any OpenAI-compatible client works by changing `baseURL` and supplying a payment-aware `fetch`. See the [API reference](/agents/x402/api-reference) for full request and response detail.

## Mech: The Agent That Operates Metaplex x402

Mech is the onchain Metaplex agent that sells the x402 services, and USDC payments settle to Mech's Core wallet. Mech is itself a [registered agent](/agents/what-is-an-agent) with an [Asset Signer PDA wallet](/smart-contracts/core/execute-asset-signing) — an agent selling services to your agent, which is the [agent commerce](/agents/agent-commerce) model working end to end.

| Property | Value |
|----------|-------|
| Agent address | `MECHjj31U1hBapoVeJtZo5U5WGRd2293JEwRErvPTuF` |
| Public page | [metaplex.com/agents/MECHjj…](https://www.metaplex.com/agents/MECHjj31U1hBapoVeJtZo5U5WGRd2293JEwRErvPTuF) |
| Settlement asset | USDC |

## Quick Start

Install the client and point an OpenAI SDK at Metaplex x402 with a payment-aware `fetch`. This example pays from a standard wallet; the [payment modes guide](/agents/x402/payment-modes) covers all three modes in full.

```sh {% title="Install the client and its peers" %}
pnpm add @metaplex-foundation/x402 \
  @metaplex-foundation/umi \
  @solana/kit \
  @x402/core \
  @x402/fetch \
  @x402/svm \
  openai
```

```ts {% title="Paid chat completion from a standard wallet" %}
import { METAPLEX_X402_BASE_URL } from '@metaplex-foundation/x402';
import { createKeyPairSignerFromBytes, getBase58Encoder } from '@solana/kit';
import { x402Client } from '@x402/core/client';
import { wrapFetchWithPayment } from '@x402/fetch';
import { ExactSvmScheme } from '@x402/svm/exact/client';
import OpenAI from 'openai';

// A Solana signer whose token account holds USDC.
const svmSigner = await createKeyPairSignerFromBytes(
  getBase58Encoder().encode(process.env.SVM_PRIVATE_KEY!),
);

const paymentClient = new x402Client();
paymentClient.register('solana:*', new ExactSvmScheme(svmSigner));

const openai = new OpenAI({
  // The OpenAI SDK requires a value, but this gateway authenticates by payment.
  apiKey: 'x402',
  baseURL: METAPLEX_X402_BASE_URL,
  fetch: wrapFetchWithPayment(fetch, paymentClient),
});

const completion = await openai.chat.completions.create({
  model: 'openai/gpt-5.4-mini',
  messages: [{ role: 'user', content: 'Say hi in one word.' }],
});
```

Payment happens inside the wrapped `fetch`; your code only sees the final API response.

## Payment Modes at a Glance

Metaplex x402 supports three ways to pay, differing in where the USDC comes from and how often the owner signs.

| Mode | Funds come from | Owner signs | Best for |
|------|-----------------|-------------|----------|
| **Standard wallet** | Your wallet's USDC token account | Every payment | Apps and scripts paying as themselves |
| **Core asset or agent (direct)** | The asset's signer PDA token account | Every payment | Giving an asset its own budget, with owner oversight |
| **Delegated agent (instant)** | The agent's signer PDA token account | Once, at delegation | Autonomous agents paying without supervision |

Delegation is an onchain grant you can revoke at any time. The [payment modes guide](/agents/x402/payment-modes) has the setup, code, and revocation flow for each.

## How Metaplex x402 Prices Requests

Metaplex x402 prices inference at the upstream providers' token rates and RPC per request, with the live rate card published free at `GET /x402/pricing`.

- **Chat completions** — priced per million tokens with separate input, cached-input, and output rates, subject to a `$0.001` per-request minimum
- **Image generation** — priced per million tokens across input text, input image, output image, and output text, with the same `$0.001` minimum
- **Solana RPC** — `$0.00001` per request by default, with higher rates for heavier methods such as `getSignaturesForAddress` at `$0.0001`

{% callout type="note" title="Treat the live endpoint as the price list" %}
Rates published in documentation are a snapshot. `GET /x402/pricing` on the live service is the operative price list, it requires no payment or signer, and the SDK exposes it as `getPricing()`.
{% /callout %}

## Notes

- Payments settle in USDC from a classic SPL Token associated token account. Token-2022 payment mints are not currently supported.
- Core asset and agent payment modes need a small SOL balance in the asset signer PDA to cover Core `execute` transaction fees. Standard wallet payments need no SOL — the service's fee payer covers the network fee.
- The x402 RPC endpoint supports HTTP requests only. WebSocket connections and subscriptions are not supported.
- The hosted server is not open source. The client, its examples, and the protocol types are published under Apache-2.0.
- Using the services means agreeing to the [Metaplex.com Terms of Use](https://www.metaplex.com/terms-of-use) and [Privacy Policy](https://www.metaplex.com/privacy).

## Quick Reference

| Item | Value |
|------|-------|
| API base URL | `https://api.metaplex.com/x402` |
| RPC URL | `https://api.metaplex.com/x402/rpc` |
| JS client | `@metaplex-foundation/x402` (`0.1.0`) |
| Runtime | Node.js 20.18+, ESM |
| Settlement asset | USDC (classic SPL Token) |
| Operating agent | `MECHjj31U1hBapoVeJtZo5U5WGRd2293JEwRErvPTuF` |
| Source | [GitHub](https://github.com/metaplex-foundation/x402) (Apache-2.0) |

## FAQ

Common questions about Metaplex x402.

### What is Metaplex x402?
Metaplex x402 is a pay-per-request HTTP API selling LLM inference, image generation, and Solana RPC access. There are no API keys, accounts, or subscriptions — each request settles in USDC on Solana using the [x402 protocol](https://www.x402.org), which turns the HTTP `402 Payment Required` status into a machine-payable flow.

### Do I need an API key or an account to use Metaplex x402?
No. Payment is the authentication. You need a Solana wallet, Core asset, or registered agent holding USDC. The OpenAI SDK requires a non-empty `apiKey` value, so the examples pass the literal string `'x402'`, which the gateway ignores.

### What is Mech?
Mech is the onchain Metaplex agent that operates the x402 services. Payments settle in USDC to Mech's Core wallet — its Asset Signer PDA. Mech is an agent selling services to your agent or wallet, at address `MECHjj31U1hBapoVeJtZo5U5WGRd2293JEwRErvPTuF`.

### What happened to the Nori service agent documentation?
The Nori pages documented an early prototype that was never released publicly and is no longer maintained. Metaplex x402 is the shipped service that replaced it. The name **Nori** now refers to the [Metaplex AI copilot](https://www.metaplex.com/nori), a separate product unrelated to paid inference and RPC.

### Does Metaplex x402 charge in SOL or USDC?
USDC. Payments are made from a classic SPL Token associated token account; Token-2022 payment mints are not supported. Core asset and agent payment modes additionally need a small SOL balance in the asset signer PDA to cover Core `execute` transaction fees.

### Is the Metaplex x402 server open source?
The client is. The TypeScript client, its examples, and the protocol types are published at [github.com/metaplex-foundation/x402](https://github.com/metaplex-foundation/x402) under Apache-2.0. The server that runs the hosted service is not currently published.

### How much does a request cost?
Inference pricing mirrors the upstream providers' token rates with a `$0.001` per-request minimum, and RPC calls are priced per request from `$0.00001` with higher per-method rates for heavier calls. `GET /x402/pricing` returns the live rates and is free to call.

## Glossary

Terms used across the Metaplex x402 documentation.

| Term | Definition |
|------|------------|
| **x402** | An open protocol that uses the HTTP `402 Payment Required` status to make stablecoin micropayments part of an API request/response cycle |
| **Metaplex x402** | The Metaplex-hosted x402 service at `https://api.metaplex.com/x402` selling inference, image generation, and Solana RPC |
| **Mech** | The onchain Metaplex agent that operates Metaplex x402 and receives USDC payments |
| **Asset Signer PDA** | An MPL Core PDA derived from `["mpl-core-execute", asset]` — a Core asset's onchain wallet, controlled through Core's [Execute lifecycle hook](/smart-contracts/core/execute-asset-signing) |
| **Payment mode** | Which account funds a payment and how often its owner signs — standard wallet, Core asset or agent direct, or delegated agent |
| **Execution delegation** | A revocable onchain grant (`ExecutionDelegateRecordV1`) letting Mech approve payments from a registered agent's wallet without a per-request owner signature |
| **Facilitator** | The x402 component that verifies and settles a submitted payment onchain before the resource is returned |
| **DAS** | The [Digital Asset Standard](/solana/rpcs-and-das) read API, available through the x402 RPC endpoint as a pass-through |

---

Maintained by Metaplex Foundation. Last verified: 2026-09-08. Client version: `@metaplex-foundation/x402` `0.1.0`. [View source on GitHub](https://github.com/metaplex-foundation/x402).
