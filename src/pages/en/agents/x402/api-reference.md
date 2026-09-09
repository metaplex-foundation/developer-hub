---
title: Metaplex x402 API Reference
metaTitle: Metaplex x402 API Reference - Endpoints, Pricing, and Client Exports | Metaplex
description: Complete reference for the Metaplex x402 API - base URLs, the chat completions, image generation, and Solana RPC endpoints, the free discovery endpoints, delegation routes, payment challenge fields, live pricing, and the client's exported helpers and options.
keywords:
  - Metaplex x402 API
  - x402 endpoints
  - x402 pricing
  - OpenAI compatible endpoint
  - Solana RPC endpoint
  - MetaplexSvmExactScheme
  - payment required header
about:
  - Metaplex x402
  - API Reference
  - Solana
  - Metaplex
proficiencyLevel: Intermediate
programmingLanguage:
  - TypeScript
created: '09-08-2026'
updated: '09-08-2026'
---

The Metaplex x402 API is served at `https://api.metaplex.com/x402` and exposes three paid services, two free discovery endpoints, and four agent delegation routes. This page is the endpoint, pricing, and client-export reference; the [payment modes guide](/agents/x402/payment-modes) covers how to build the payment-aware `fetch` that paid endpoints require. {% .lead %}

## Summary

Every paid endpoint answers an unpaid request with HTTP `402` and a `PAYMENT-REQUIRED` header describing exactly what to pay; the client signs a USDC payment and retries. Discovery endpoints need no payment and no signer.

- **Base URLs** — `https://api.metaplex.com/x402` for the API, `https://api.metaplex.com/x402/rpc` for Solana JSON-RPC
- **Wire format** — canonical OpenAI request and response bodies for chat and images, standard Solana JSON-RPC for RPC
- **Settlement** — USDC on Solana mainnet, x402 protocol version 2, `exact` scheme
- **Client version** — `@metaplex-foundation/x402` `0.1.0`, Node.js 20.18+, ESM only

## Base URLs and Constants

The client exports both base URLs so applications do not hardcode them.

| Constant | Value |
|----------|-------|
| `METAPLEX_X402_BASE_URL` | `https://api.metaplex.com/x402` |
| `METAPLEX_X402_RPC_URL` | `https://api.metaplex.com/x402/rpc` |

## Endpoints

Paid endpoints require a payment-aware `fetch`; free endpoints do not.

| Method | Path | Payment | Description |
|--------|------|---------|-------------|
| `GET` | `/x402/models` | Free | Available model IDs |
| `GET` | `/x402/pricing` | Free | Model rates, request minimums, RPC method prices, legal URLs |
| `POST` | `/x402/chat/completions` | Paid | OpenAI-compatible chat completions |
| `POST` | `/x402/images/generations` | Paid | OpenAI-compatible image generation |
| `POST` | `/x402/rpc` | Paid | Solana JSON-RPC and DAS, HTTP only |
| `GET` | `/x402/core-execute-delegate/status` | Free | Delegation status for a Core asset |
| `POST` | `/x402/core-execute-delegate/approve` | Free | Approve execution delegation |
| `POST` | `/x402/core-execute-delegate/revoke` | Free | Revoke execution delegation |
| `POST` | `/x402/core-execute-delegate/auth` | Free | Exchange a Sign-In-With-X signature for a 24-hour bearer token |

The delegation routes are wrapped by the SDK helpers listed under [client exports](#client-exports); call those rather than the routes directly.

## Discovery Endpoints

Discovery endpoints are free to call and return typed data through the client's helpers.

```ts {% title="Read models and pricing without paying" %}
import { getModels, getPricing } from '@metaplex-foundation/x402';

// Available model IDs, e.g. 'openai/gpt-5.4-mini'.
const models = await getModels();

// Per-model token rates, request minimums, RPC method prices, and legal URLs.
const pricing = await getPricing();
```

`GET /x402/models` returns an OpenAI-shaped model list:

```json {% title="GET /x402/models response (excerpt)" %}
{
  "object": "list",
  "data": [
    { "id": "anthropic/claude-opus-4.8", "object": "model", "created": 0, "owned_by": "anthropic" },
    { "id": "openai/gpt-5.4-mini", "object": "model", "created": 0, "owned_by": "openai" }
  ]
}
```

## Chat Completions Endpoint

`POST /x402/chat/completions` accepts and returns canonical OpenAI chat completion bodies, with models addressed as `<provider>/<model>`.

```ts {% title="Chat completion through the OpenAI SDK" %}
import { METAPLEX_X402_BASE_URL } from '@metaplex-foundation/x402';
import OpenAI from 'openai';

const openai = new OpenAI({
  // The OpenAI SDK requires a value, but this gateway authenticates by payment.
  apiKey: 'x402',
  baseURL: METAPLEX_X402_BASE_URL,
  fetch: fetchWithPayment,
});

const completion = await openai.chat.completions.create({
  model: 'openai/gpt-5.4-mini',
  messages: [{ role: 'user', content: 'Say hi in one word.' }],
});
```

The Vercel AI SDK reaches the same endpoint through its OpenAI-compatible provider:

```ts {% title="Chat completion through the Vercel AI SDK" %}
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { METAPLEX_X402_BASE_URL } from '@metaplex-foundation/x402';
import { generateText } from 'ai';

const metaplex = createOpenAICompatible({
  name: 'metaplex-x402',
  apiKey: 'x402',
  baseURL: METAPLEX_X402_BASE_URL,
  fetch: fetchWithPayment,
});

const { text } = await generateText({
  model: metaplex.chatModel('openai/gpt-5.4-mini'),
  prompt: 'Say hi in one word.',
});
```

## Image Generation Endpoint

`POST /x402/images/generations` accepts canonical OpenAI image generation bodies.

```ts {% title="Image generation through the OpenAI SDK" %}
const image = await openai.images.generate({
  model: 'openai/gpt-image-1.5',
  prompt: 'A yellow square.',
  size: '1024x1024',
});
```

```ts {% title="Image generation through the Vercel AI SDK" %}
import { generateImage } from 'ai';

const { image } = await generateImage({
  model: metaplex.imageModel('openai/gpt-image-1.5'),
  prompt: 'A yellow square.',
  size: '1024x1024',
});
```

## Solana RPC Endpoint

`POST /x402/rpc` accepts standard Solana JSON-RPC requests and passes [DAS](/solana/rpcs-and-das) methods through, pricing and paying for each request independently.

```ts {% title="Solana RPC through Solana Kit" %}
import { createSolanaRpcFromTransport, type RpcTransport } from '@solana/kit';
import { METAPLEX_X402_RPC_URL } from '@metaplex-foundation/x402';

const rpcTransport: RpcTransport = async ({ payload, signal }) => {
  const response = await fetchWithPayment(METAPLEX_X402_RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: signal ?? null,
  });

  return response.json();
};

const rpc = createSolanaRpcFromTransport(rpcTransport);
const slot = await rpc.getSlot().send();
```

```ts {% title="Solana RPC through web3.js" %}
import { METAPLEX_X402_RPC_URL } from '@metaplex-foundation/x402';
import { Connection } from '@solana/web3.js';

const connection = new Connection(METAPLEX_X402_RPC_URL, {
  fetch: fetchWithPayment,
});
const slot = await connection.getSlot();
```

{% callout type="warning" title="The x402 RPC endpoint is HTTP-only" %}
WebSocket connections and subscriptions are not supported. Use a conventional RPC provider for `accountSubscribe`, `logsSubscribe`, and other subscription methods.
{% /callout %}

## Payment Challenge Fields

An unpaid request to a paid endpoint returns HTTP `402` with a base64 `PAYMENT-REQUIRED` header. Clients built with `@metaplex-foundation/x402` parse this automatically; the fields are documented here for debugging and for non-JavaScript clients.

| Field | Example value | Meaning |
|-------|---------------|---------|
| `x402Version` | `2` | Protocol version |
| `accepts[].scheme` | `exact` | Payment scheme |
| `accepts[].network` | `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` | CAIP-2 network identifier for Solana mainnet |
| `accepts[].asset` | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` | USDC mint |
| `accepts[].amount` | `1000` | Amount in the asset's atomic units — `1000` is `$0.001` |
| `accepts[].payTo` | `9AYgwvWMhZuir6rZoto13jrU1oZA1XxRDhqPznxyomHv` | Payee account |
| `accepts[].maxTimeoutSeconds` | `300` | Window in which the payment must be submitted |
| `accepts[].extra.quoteId` | UUID | Identifies the quote being paid |
| `accepts[].extra.usage` | OpenAI usage object | Measured token usage the quote was priced from |
| `accepts[].extra.memo` | `metaplex:x402:chat.completions` | Memo written with the settlement |
| `accepts[].extra.feePayer` | Public key | Account paying the payment transaction's network fee |
| `extensions["metaplex-core-execute-delegate"]` | Object | Delegation auth details — `sign-in-with-x`, bearer token, token endpoint, and the `X-METAPLEX-CORE-ASSET` header used to name the paying asset |

{% callout type="note" title="Quotes are priced from measured usage" %}
The `402` challenge for an inference request carries a `quoteId` and a populated `usage` object, so the amount reflects the tokens the request actually consumed rather than an estimate. Response headers `PAYMENT-REQUIRED` and `PAYMENT-RESPONSE` are both CORS-exposed.
{% /callout %}

## Chat Completion Pricing

Chat models are priced per million tokens with separate input, cached-input, and output rates, subject to a `$0.001` per-request minimum. The rates below were read from `GET /x402/pricing` on 2026-09-08.

| Model | Input | Cached input | Output |
|-------|-------|--------------|--------|
| `anthropic/claude-opus-4.8` | $5.00 | $0.50 | $25.00 |
| `anthropic/claude-opus-4.7` | $5.00 | $0.50 | $25.00 |
| `anthropic/claude-opus-4.6` | $5.00 | $0.50 | $25.00 |
| `anthropic/claude-opus-4.5` | $5.00 | $0.50 | $25.00 |
| `anthropic/claude-sonnet-4.6` | $3.00 | $0.30 | $15.00 |
| `anthropic/claude-sonnet-4.5` | $3.00 | $0.30 | $15.00 |
| `anthropic/claude-haiku-4.5` | $1.00 | $0.10 | $5.00 |
| `openai/gpt-5.5` | $5.00 | $0.50 | $30.00 |
| `openai/gpt-5.4` | $2.50 | $0.25 | $15.00 |
| `openai/gpt-5.4-mini` | $0.75 | $0.075 | $4.50 |
| `openai/gpt-5.4-nano` | $0.20 | $0.02 | $1.25 |

`openai/gpt-5.5` and `openai/gpt-5.4` carry higher long-context rates above 272,000 input tokens — $10.00 input and $45.00 output for `gpt-5.5`, and $5.00 input and $22.50 output for `gpt-5.4`.

## Image Generation Pricing

Image models are priced per million tokens across four categories, with the same `$0.001` per-request minimum.

| Model | Input text | Input image | Output image | Output text |
|-------|-----------|-------------|--------------|-------------|
| `openai/gpt-image-1.5` | $5.00 | $8.00 | $32.00 | $10.00 |
| `openai/gpt-image-2` | $5.00 | $8.00 | $30.00 | $10.00 |

## Solana RPC Pricing

RPC calls are priced per request at `$0.00001` by default, with higher rates for heavier methods.

| Method | Price per request |
|--------|-------------------|
| Default (any method not listed) | $0.00001 |
| `getBlockTime` | $0.00001 |
| `getTransaction` | $0.00002 |
| `getBlocks` | $0.00002 |
| `getBlocksWithLimit` | $0.00002 |
| `getConfirmedTransaction` | $0.00002 |
| `getBlock` | $0.00005 |
| `getConfirmedBlock` | $0.00005 |
| `getSignaturesForAddress` | $0.00010 |

## `MetaplexSvmExactScheme` Options {% #metaplexsvmexactscheme-options %}

`MetaplexSvmExactScheme` is the payment scheme used for Core asset and agent payments.

| Option | Required | Description |
|--------|----------|-------------|
| `rpcUrl` | Yes | RPC endpoint used to build payment transactions |
| `coreExecute.asset` | For Core asset payments | Core asset or agent whose signer PDA funds payments |
| `coreExecute.collection` | When the asset is in a collection | The asset's Core collection |
| `coreExecute.executionDelegateRecord` | No | Advanced: override the execution delegate record |
| `commitment` | No | Commitment for blockhash fetches; defaults to `confirmed` |
| `computeUnitLimit` | No | Defaults to 200,000 for Core `execute` payments, 20,000 otherwise |

The scheme accepts Umi signers and Solana Kit partial transaction signers, but not sign-and-send signers. Kit signers are adapted internally.

## Client Exports

`@metaplex-foundation/x402` centralizes its public API in the package root.

| Category | Exports |
|----------|---------|
| Payments | `MetaplexSvmExactScheme`, `MetaplexSvmSigner`, `kitPartialTransactionSignerToUmiSigner` |
| Agent delegation | `fetchMetaplexCoreExecuteDelegateStatus`, `approveMetaplexCoreExecuteDelegate`, `revokeMetaplexCoreExecuteDelegate`, `authorizeMetaplexCoreExecuteDelegate` |
| Agent payment transports | `createMetaplexCoreExecuteDelegateClientExtension`, `wrapFetchWithMetaplexCoreExecuteDelegate`, the token-store implementations |
| Discovery | `getModels`, `getPricing`, `METAPLEX_X402_BASE_URL`, `METAPLEX_X402_RPC_URL` |

Option and result types, protocol constants, and delegate route schemas are exported from the package root as well.

## Environment Variables

The runnable examples in the [x402 repository](https://github.com/metaplex-foundation/x402/tree/main/examples) read the following variables.

| Variable | Required | Description |
|----------|----------|-------------|
| `SVM_PRIVATE_KEY` | Yes | Base58-encoded 64-byte development keypair |
| `CORE_ASSET_ADDRESS` | Core asset and agent examples | Metaplex Core asset owned by the keypair |
| `SVM_RPC_URL` | No | Custom Solana RPC URL used by the x402 SVM scheme |
| `METAPLEX_X402_BASE_URL` | No | API base URL; defaults to `https://api.metaplex.com/x402` |
| `METAPLEX_X402_RPC_URL` | No | RPC URL; defaults to `https://api.metaplex.com/x402/rpc` |
| `METAPLEX_API_BASE_URL` | No | API-root override for local development, e.g. `http://localhost:3000/api` |

## Notes

- Prices in this reference are a snapshot read on 2026-09-08. `GET /x402/pricing` on the live service is the operative price list and is free to call.
- Payments settle in USDC from a classic SPL Token associated token account. Token-2022 payment mints are not currently supported.
- Core asset and agent payment modes require SOL in the asset signer PDA to cover Core `execute` fees; standard wallet payments do not.
- The hosted server is not open source. The client, its examples, and the protocol types are published under Apache-2.0.
- Using the API means agreeing to the [Metaplex.com Terms of Use](https://www.metaplex.com/terms-of-use) and [Privacy Policy](https://www.metaplex.com/privacy).

## Quick Reference

| Item | Value |
|------|-------|
| API base URL | `https://api.metaplex.com/x402` |
| RPC URL | `https://api.metaplex.com/x402/rpc` |
| JS client | `@metaplex-foundation/x402` (`0.1.0`) |
| Runtime | Node.js 20.18+, ESM |
| Protocol | x402 version 2, `exact` scheme |
| Network | `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` (Solana mainnet) |
| Payment mint | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` (USDC) |
| Operating agent | `MECHjj31U1hBapoVeJtZo5U5WGRd2293JEwRErvPTuF` |
| Source | [GitHub](https://github.com/metaplex-foundation/x402) (Apache-2.0) |

---

Maintained by Metaplex Foundation. Last verified: 2026-09-08. Client version: `@metaplex-foundation/x402` `0.1.0`. [View source on GitHub](https://github.com/metaplex-foundation/x402).
