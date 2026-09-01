---
title: Nori Example Agents
metaTitle: Nori Example Agents - Inference, Image Generation, and RPC Consumers | Metaplex
description: Working examples of agents consuming each Nori service - an OpenAI-compatible inference agent using chat.completion, an artwork agent using image.generation, a portfolio analyzer using solana.rpc with DAS, and a raw A2A JSON-RPC caller.
keywords:
  - Nori examples
  - example agents
  - OpenAI-compatible agent
  - chat.completion
  - image.generation
  - solana.rpc
  - DAS API
  - A2A message/send
  - agent template
about:
  - Nori
  - Autonomous Agents
  - Agent Commerce
  - Solana
  - Metaplex
proficiencyLevel: Intermediate
created: '07-08-2026'
updated: '07-08-2026'
programmingLanguage:
  - TypeScript
faqs:
  - q: Which SDKs work with Nori's inference service?
    a: Any OpenAI-compatible client works — the Vercel AI SDK via createOpenAICompatible, the official OpenAI SDKs with a custom baseURL, or agent frameworks like Mastra that accept an OpenAI-compatible provider. Point the client at NORI_URL/v1 and attach the bearer token as the Authorization header.
  - q: Can my agent use DAS methods like getAssetsByOwner through Nori?
    a: Yes. The solana.rpc service is a transparent JSON-RPC pass-through to a DAS-capable upstream provider, so DAS methods (getAsset, getAssetsByOwner, and others) work exactly like standard Solana RPC methods — same endpoint, same per-call price.
  - q: Do these examples work without delegation?
    a: Yes, over the x402 fallback rail — the first call runs the request once and returns HTTP 402 with payment requirements; paying and retrying returns the cached result. The examples assume delegation because it removes the payment round-trip; see Delegate to Nori for the one-time setup.
  - q: Which models can I request through chat.completion?
    a: Any model on the rate card, addressed as <provider>/<model> — for example anthropic/claude-sonnet-4-6, openai/gpt-5.4, or google/gemini-2.5-flash. GET /v1/models lists the live directory, and GET /rate-card carries the per-token prices.
---

These examples show a consumer agent using each of Nori's three services — LLM inference, image generation, and Solana RPC — plus the raw A2A envelope for agent-to-agent callers. Each example assumes the one-time [delegation setup](/agents/nori/delegate-to-nori) is done and a bearer `token` is in hand; the same requests work without delegation over the x402 fallback, with a payment round-trip added. {% .lead %}

## Summary

Every example is a complete, paid Nori call — no provider API keys anywhere.

- **Inference agent** — points an OpenAI-compatible client at `NORI_URL/v1` and runs `chat.completion` with tool calls
- **Artwork agent** — generates images via `image.generation` (gpt-image-1)
- **Portfolio analyzer** — reads balances and token holdings via `solana.rpc`, including DAS methods
- **A2A caller** — invokes the same skills through JSON-RPC `message/send` for agent-to-agent integrations

## Inference Agent Using chat.completion

An agent's LLM brain can run entirely on Nori by pointing an OpenAI-compatible client at `NORI_URL/v1`. Models are addressed as `<provider>/<model>` and routed to Anthropic, OpenAI, or Google upstream; tool calls (`tools`, `tool_choice`, `tool_calls`) are supported across all three providers, so full agent loops work unmodified.

```typescript {% title="inference-agent.ts" %}
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText, tool } from 'ai';
import { z } from 'zod';

const nori = createOpenAICompatible({
  name: 'nori',
  baseURL: `${NORI_URL}/v1`,
  headers: { Authorization: `Bearer ${token}` }, // from /auth/handshake
});

const { text } = await generateText({
  model: nori('anthropic/claude-sonnet-4-6'),
  tools: {
    getSolPrice: tool({
      description: 'Get the current SOL price in USD',
      inputSchema: z.object({}),
      execute: async () => fetchSolPrice(),
    }),
  },
  prompt: 'Is SOL above $200 right now? Answer in one sentence.',
});
```

Each `generateText` call is one metered `chat.completion` — billed by actual input/output token counts at the [rate-card](/agents/nori/pricing-and-billing) price for the selected model, settled from the agent's PDA. Swapping models (or falling back to a non-Nori provider [during an outage](/agents/nori/#nori-as-a-single-point-of-failure)) is a one-line change because the wire format is canonical OpenAI.

## Artwork Agent Using image.generation

An agent that needs artwork — NFT images, avatars, generated content for its users — calls `POST /v1/images/generations` with the standard OpenAI images request shape. Nori routes to gpt-image-1 upstream and charges a flat per-image price.

```typescript {% title="artwork-agent.ts" %}
const response = await fetch(`${NORI_URL}/v1/images/generations`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    model: 'openai/gpt-image-1',
    prompt: 'Pixel-art portrait of a sea-otter plumber holding a wrench',
    n: 1,
    size: '1024x1024',
  }),
}).then((r) => r.json());

const imageB64 = response.data[0].b64_json;
```

A typical follow-up is uploading the image and minting it as an [MPL Core](/smart-contracts/core) asset — the generation step and the mint step are independent, and only the generation is a Nori charge.

## Portfolio Analyzer Using solana.rpc

Onchain-data agents get RPC and DAS access through the same billing pipe. `POST /v1/solana/rpc` is a transparent JSON-RPC pass-through to a DAS-capable upstream, so standard methods (`getBalance`) and DAS methods (`getAsset`, `getAssetsByOwner`) share one endpoint and one per-call price. This portfolio analyzer implements the gather step of a gather → enrich → summarize workflow:

```typescript {% title="portfolio-analyzer.ts" %}
async function noriRpc(method: string, params: unknown[]) {
  const res = await fetch(`${NORI_URL}/v1/solana/rpc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  }).then((r) => r.json());
  return res.result;
}

// Gather: SOL balance + all token holdings for a wallet.
const owner = '11111111111111111111111111111112'; // wallet under analysis
const balance = await noriRpc('getBalance', [owner]);

// DAS method — same endpoint, same per-call price.
const assets = await noriRpc('getAssetsByOwner', [
  { ownerAddress: owner, page: 1, limit: 100 },
]);

// Enrich/summarize: feed the holdings to the inference agent above
// for a natural-language portfolio breakdown.
```

Because each call is metered individually (flat per-call price), loop-style agents — a price watcher polling on an interval, an analyzer walking paginated holdings — should budget calls deliberately: the PDA balance is the spending limit, and an empty wallet [hard-stops](/agents/nori/pricing-and-billing#hard-stop-semantics) service.

## Agent-to-Agent Caller Using A2A message/send

Agents integrating at the protocol level (rather than through an OpenAI SDK) call the same skills via JSON-RPC 2.0 at `POST /a2a`, discovered from the [agent card](/agents/nori/#services-nori-provides). The skill input is byte-identical to the HTTP surface — the OpenAI request body simply travels inside a `message/send` envelope as a DataPart:

```typescript {% title="a2a-caller.ts" %}
const task = await fetch(`${NORI_URL}/a2a`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'message/send',
    params: {
      requestId: crypto.randomUUID(),
      message: {
        parts: [
          {
            kind: 'data',
            data: {
              skill: 'chat.completion',
              input: {
                model: 'anthropic/claude-sonnet-4-6',
                messages: [{ role: 'user', content: 'Hello from another agent.' }],
              },
            },
          },
        ],
      },
    },
  }),
}).then((r) => r.json());
```

`message/send` returns a completed task synchronously; `tasks/get` fetches a prior task by ID. Use `image.generation` or `solana.rpc` as the `skill` with the same input shapes as their HTTP counterparts.

{% callout type="note" title="Streaming is not available in v1" %}
`message/sendStream` is declared on the agent card but returns 501 in v1, and `/v1/chat/completions` is non-streaming. Design agent loops around complete responses.
{% /callout %}

## Quick Reference

| Example | Service | Endpoint | Billed as |
|---------|---------|----------|-----------|
| Inference agent | `chat.completion` | `POST /v1/chat/completions` | Per input/output token, by model |
| Artwork agent | `image.generation` | `POST /v1/images/generations` | Per image |
| Portfolio analyzer | `solana.rpc` | `POST /v1/solana/rpc` | Per call (DAS methods included) |
| A2A caller | any skill | `POST /a2a` (`message/send`) | Same as the underlying skill |

## Notes

- All examples assume `NORI_URL` (Nori's base URL) and `token` (a bearer from the [handshake flow](/agents/nori/delegate-to-nori#step-3-authenticate-with-a-bearer-token)); tokens expire after 15 minutes, so long-running agents re-handshake
- Without a bearer token the same requests work over the x402 rail: expect an HTTP 402 with payment requirements on first call, pay, and retry
- The Metaplex agent template packages these patterns as ready-made Mastra tools (`chat-completion`, `generate-image`, `solana-rpc-call`, `delegate-to-nori`) if you'd rather start from a running agent
- Charge-on-success applies to every example: a failed upstream call costs nothing — see [Pricing and Billing](/agents/nori/pricing-and-billing#charge-on-success-accounting)

Maintained by Metaplex Foundation. Last verified: 2026-07-08. [View source on GitHub](https://github.com/metaplex-foundation/agent-plumber).

## FAQ

Common questions about building against Nori's services.

### Which SDKs work with Nori's inference service?
Any OpenAI-compatible client works — the Vercel AI SDK via `createOpenAICompatible`, the official OpenAI SDKs with a custom `baseURL`, or agent frameworks like Mastra that accept an OpenAI-compatible provider. Point the client at `NORI_URL/v1` and attach the bearer token as the `Authorization` header.

### Can my agent use DAS methods like getAssetsByOwner through Nori?
Yes. The `solana.rpc` service is a transparent JSON-RPC pass-through to a DAS-capable upstream provider, so DAS methods (`getAsset`, `getAssetsByOwner`, and others) work exactly like standard Solana RPC methods — same endpoint, same per-call price.

### Do these examples work without delegation?
Yes, over the x402 fallback rail — the first call runs the request once and returns HTTP 402 with payment requirements; paying and retrying returns the cached result. The examples assume delegation because it removes the payment round-trip; see [Delegate to Nori](/agents/nori/delegate-to-nori) for the one-time setup.

### Which models can I request through chat.completion?
Any model on the rate card, addressed as `<provider>/<model>` — for example `anthropic/claude-sonnet-4-6`, `openai/gpt-5.4`, or `google/gemini-2.5-flash`. `GET /v1/models` lists the live directory, and [`GET /rate-card`](/agents/nori/pricing-and-billing) carries the per-token prices.
