---
title: Delegate to Nori
metaTitle: Delegate to Nori - One-Time Onboarding to Delegate-Pay Billing | Metaplex
description: Register Nori as an execution delegate on your Metaplex agent so every LLM, image, and RPC call settles automatically from your agent's PDA wallet. Free onboarding — no SOL for fees, no RPC required.
keywords:
  - delegate to Nori
  - execution delegation
  - delegate-pay
  - agent onboarding
  - delegateExecutionV1
  - Nori bearer token
  - Metaplex agent billing
about:
  - Nori
  - Execution Delegation
  - Agent Commerce
  - Solana
  - Metaplex
proficiencyLevel: Intermediate
created: '07-08-2026'
updated: '07-08-2026'
programmingLanguage:
  - TypeScript
howToSteps:
  - Fetch Nori's agent card and read its serviceExecutiveAddress.
  - Build a transaction containing a single delegateExecutionV1 instruction pointing at Nori's executive profile, with Nori as fee payer.
  - Sign with your agent's executive keypair and submit the transaction to Nori's free /v1/delegate/submit endpoint.
  - Exchange a signed challenge for a bearer token at /auth/handshake.
  - Make paid calls with the bearer token — charges settle automatically from your agent's PDA wallet.
howToTools:
  - '@metaplex-foundation/mpl-agent-registry'
  - '@metaplex-foundation/umi'
faqs:
  - q: Does delegating to Nori cost anything?
    a: No. Nori pays the network fee on the delegation transaction (it co-signs as fee payer), and the onboarding endpoints are free and unauthenticated. You will want a working SOL balance on your agent's PDA wallet afterwards, because that is the account per-call charges draw from.
  - q: What authority does delegation give Nori?
    a: Delegation registers Nori's executive profile as an execution delegate on your agent asset, which lets Nori sign MPL Core Execute transactions that move SOL out of your agent's PDA wallet. Nori uses this to settle per-call charges, each with an onchain Memo receipt. Keep only a working balance on the PDA and audit the receipts.
  - q: How do I stop Nori from charging my agent?
    a: Revoke the execution delegation on your agent asset. The next charge attempt fails onchain, Nori's cached delegate status is invalidated, and the delegate-pay rail hard-stops — subsequent calls receive HTTP 402 x402 challenges instead of being auto-charged.
  - q: Why do my calls return HTTP 402 even though I delegated?
    a: A 402 means the delegate-pay rail was unavailable for that call — the bearer token is missing or expired (tokens last 15 minutes), the delegation was revoked, or the charge itself failed (usually an empty PDA wallet). Re-run the handshake, verify the delegation record exists, and check the PDA balance.
  - q: Can I use Nori without delegating at all?
    a: Yes. Non-delegated callers use the x402 fallback rail — the first request returns HTTP 402 with payment requirements, you pay in SOL or USDC, then retry. It costs the same but adds a payment round-trip to every call, whereas delegate-pay settles in-line.
---

Delegating to Nori is a one-time onchain setup that registers Nori as an [execution delegate](/smart-contracts/mpl-agent/tools) on your agent's asset. After it, every LLM, image, and RPC call your agent makes against Nori settles automatically from the agent's PDA wallet — no payment round-trips, no wallet prompts, no provider API keys. Onboarding is free: Nori pays the transaction fee and provides the blockhash, so your agent needs neither SOL on its keypair nor its own RPC. {% .lead %}

## Summary

Granting Nori execution delegation switches your agent from the two-trip [x402 fallback](/agents/nori/#how-nori-payments-work) to the in-line delegate-pay rail.

- **One-time setup** — a single `delegateExecutionV1` instruction pointing at Nori's executive profile, co-signed and submitted by Nori for free
- **Per-call settlement** — Nori charges your agent's [Asset Signer PDA](/agents/what-is-an-agent) via an MPL Core Execute transaction with a Memo receipt, only on [successful calls](/agents/nori/pricing-and-billing#charge-on-success-accounting)
- **Bearer-token auth** — a signed challenge/handshake mints a 15-minute bearer token that routes your calls to the delegate-pay rail
- **Revocable at any time** — the asset owner can revoke the delegation, which [hard-stops](#revoking-delegation-from-nori) auto-charging immediately

{% callout type="warning" title="Delegation grants billing authority" %}
An execution delegate can sign transfers out of your agent's PDA wallet. Treat the PDA as a spending account: keep a working balance, not your treasury, and audit the Memo receipt attached to every charge. See [the single-point-of-failure caveat](/agents/nori/#nori-as-a-single-point-of-failure) before making Nori your agent's only service provider.
{% /callout %}

## Quick Start

1. [Fetch Nori's agent card](#step-1-discover-noris-executive-address) and read `serviceExecutiveAddress`
2. [Build the delegation transaction](#step-2-build-and-submit-the-delegation-transaction) with your executive keypair as authority and Nori as fee payer, then submit it to `POST /v1/delegate/submit`
3. [Fund your agent's PDA wallet](#funding-the-agent-pda-wallet) with a working SOL balance
4. [Mint a bearer token](#step-3-authenticate-with-a-bearer-token) via `/auth/challenge` + `/auth/handshake`
5. [Make a paid call](#step-4-make-a-paid-call) with `Authorization: Bearer <token>`

## Prerequisites

Delegation requires an existing onchain agent identity; the delegation transaction references the asset and its identity PDA.

- A [registered agent](/agents/register-agent) — an MPL Core asset with an `AgentIdentity` record
- Your agent's **executive keypair** (the keypair your agent runs with, set up via [Run an Agent](/agents/run-an-agent)) — it signs the delegation as authority
- `@metaplex-foundation/mpl-agent-registry` and `@metaplex-foundation/umi` installed
- No SOL and no RPC endpoint are required for the delegation itself — Nori provides both

## Step 1: Discover Nori's Executive Address

Nori's agent card advertises the address you delegate to. Fetch `/.well-known/agent-card.json` and read two fields:

- `serviceExecutiveAddress` — Nori's executive keypair public key. Its executive profile PDA is what you register as a delegate on your asset.
- `serviceAssetAddress` — Nori's own agent asset. Its PDA is where your charges are paid to; you can verify every charge onchain against it.

```typescript {% title="fetch-nori-card.ts" %}
const NORI_URL = process.env.NORI_URL; // Nori's base URL

const card = await fetch(`${NORI_URL}/.well-known/agent-card.json`).then((r) =>
  r.json(),
);

const noriExecutive = card.serviceExecutiveAddress; // delegate to this
const noriServiceAsset = card.serviceAssetAddress; // charges are paid here
```

## Step 2: Build and Submit the Delegation Transaction

The delegation transaction contains exactly one `delegateExecutionV1` instruction: your executive keypair signs as authority, Nori's executive profile is the delegate, and Nori's keypair is the fee payer. You build and sign it offline (Nori's free `GET /v1/solana/blockhash` endpoint supplies the blockhash), then POST the partially-signed transaction to `POST /v1/delegate/submit`. Nori validates it, co-signs as fee payer, and submits it.

```typescript {% title="delegate-to-nori.ts" %}
import { createNoopSigner, publicKey } from '@metaplex-foundation/umi';
import {
  delegateExecutionV1,
  findAgentIdentityV1Pda,
  findExecutiveProfileV1Pda,
} from '@metaplex-foundation/mpl-agent-registry';

// `umi` is configured with your agent's executive keypair as identity.
const agentAsset = publicKey(process.env.AGENT_ASSET_ADDRESS);

// Nori's executive profile PDA, derived from the agent card address.
const noriProfile = findExecutiveProfileV1Pda(umi, {
  authority: publicKey(noriExecutive),
});
const agentIdentity = findAgentIdentityV1Pda(umi, { asset: agentAsset });

// Free blockhash — no RPC of your own needed.
const { blockhash } = await fetch(`${NORI_URL}/v1/solana/blockhash`).then((r) =>
  r.json(),
);

// Build with Nori as fee payer (a noop signer — Nori co-signs server-side),
// sign with your executive keypair.
const tx = await delegateExecutionV1(umi, {
  agentAsset,
  agentIdentity,
  executiveProfile: noriProfile,
})
  .setFeePayer(createNoopSigner(publicKey(noriExecutive)))
  .setBlockhash(blockhash)
  .buildAndSign(umi);

// Nori validates, co-signs, and submits — free of charge.
const result = await fetch(`${NORI_URL}/v1/delegate/submit`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    transaction: Buffer.from(umi.transactions.serialize(tx)).toString('base64'),
  }),
}).then((r) => r.json());

console.log(result);
// { success: true, signature: '...', agentAsset: '...', authority: '...' }
```

{% callout type="note" title="Strict transaction validation" %}
`POST /v1/delegate/submit` rejects anything that is not exactly one `delegateExecutionV1` instruction (discriminator 1 on the `mpl-agent-tools` program) pointing at Nori's own executive profile, with Nori as fee payer. The strict shape prevents the free endpoint from being abused as a transaction-submission service.
{% /callout %}

If you build agents from the Metaplex agent template, this entire step is packaged as the `delegate-to-nori` tool — one call, no manual transaction construction.

## Step 3: Authenticate with a Bearer Token

Paid calls route to the delegate-pay rail when they carry a bearer token minted through a Sign-In-With-Solana-style handshake. The token proves you control the executive keypair that is a registered delegate on the agent asset; it is valid for 15 minutes, so re-run the handshake on expiry.

```typescript {% title="nori-handshake.ts" %}
import { base58 } from '@metaplex-foundation/umi/serializers';

// 1. Get a fresh nonce.
const { nonce } = await fetch(`${NORI_URL}/auth/challenge`).then((r) => r.json());

// 2. Sign the handshake envelope with your executive keypair.
const now = Date.now();
const handshake = {
  pubkey: umi.identity.publicKey.toString(),
  agentAsset: agentAsset.toString(),
  audience: NORI_URL,
  nonce,
  issuedAt: new Date(now).toISOString(),
  expiresAt: new Date(now + 60_000).toISOString(),
};
const signature = base58.deserialize(
  await umi.identity.signMessage(
    new TextEncoder().encode(JSON.stringify(handshake)),
  ),
)[0];

// 3. Exchange for a bearer token (valid 15 minutes).
const { token } = await fetch(`${NORI_URL}/auth/handshake`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ handshake, signature }),
}).then((r) => r.json());
```

## Step 4: Make a Paid Call

With the bearer token attached, Nori runs the upstream call, then charges your agent's PDA in one Execute transaction — the response comes back in a single round-trip with no 402 challenge. The same header works on all `/v1/*` endpoints and on `/a2a`.

```typescript {% title="paid-call.ts" %}
const completion = await fetch(`${NORI_URL}/v1/chat/completions`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    model: 'anthropic/claude-sonnet-4-6',
    messages: [{ role: 'user', content: 'Hello from a delegated agent.' }],
  }),
}).then((r) => r.json());
```

On the first paid call for an asset, Nori checks onchain that it is still a registered delegate; the result is cached for 5 minutes, so subsequent calls skip the chain lookup. See [Example Agents](/agents/nori/example-agents) for full agents consuming each service, including pointing an OpenAI-compatible SDK client at Nori.

## Funding the Agent PDA Wallet

Charges draw from your agent's Asset Signer PDA, so it needs a SOL balance before the first paid call. The PDA must also stay above the system rent-exempt minimum (890,880 lamports for a 0-byte account) — the Metaplex agent template seeds it with 0.002 SOL at delegation time so small sub-rent charges never fail. Transfer SOL to the PDA from any wallet; if the balance runs dry, calls fall back to HTTP 402 challenges until you top up (see [hard-stop semantics](/agents/nori/pricing-and-billing#hard-stop-semantics)).

## Revoking Delegation from Nori

Revoking the execution delegation is the kill switch, and it takes effect as a hard stop. When the asset owner revokes the `ExecutionDelegateRecordV1` for Nori's executive profile, the next charge attempt fails onchain, Nori invalidates its cached delegate status for your asset, and the delegate-pay rail stops — from then on your calls receive x402 payment challenges instead of being auto-charged. Because of the 5-minute delegate-status cache, a call made immediately after revocation may still attempt (and fail) a delegate charge; no charge lands after revocation because the chain rejects it.

Revocation does not deregister your agent or touch its PDA balance — it only removes Nori's authority to charge it. You can re-delegate later by repeating [Step 2](#step-2-build-and-submit-the-delegation-transaction).

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `expected { transaction: <base64> }` (400) | Wrong body field on `/v1/delegate/submit` | Send `{ "transaction": "<base64-encoded signed tx>" }` |
| Delegation submit rejected with an `errorReason` | Transaction shape failed strict validation — extra instructions, wrong program, wrong executive profile, or wrong fee payer | Build exactly one `delegateExecutionV1` instruction pointing at Nori's executive profile with Nori as fee payer |
| `401` on paid calls | Missing or expired bearer token (15-minute lifetime) | Re-run the challenge/handshake flow |
| `402` on paid calls despite delegation | Delegation revoked, or charge failed (usually an empty PDA wallet) | Verify the delegation record exists and the PDA balance covers the call |
| `Neither the asset or any plugins have approved this operation` | Charge attempted after the delegation was revoked | Expected hard-stop behavior — re-delegate to resume delegate-pay |
| `insufficient funds for rent` on a charge | PDA balance below the rent-exempt minimum | Top up the PDA (keep it above 890,880 lamports plus a working balance) |

## Notes

- Onboarding endpoints (`GET /v1/solana/blockhash`, `POST /v1/delegate/submit`) are free and unauthenticated; everything else that does work is paid
- Bearer tokens are minted per executive keypair + agent asset pair and expire after 15 minutes — build re-handshaking into your client
- The delegate-status cache means delegation state changes (grant or revoke) can take up to 5 minutes to be reflected on the payment rail; onchain enforcement is immediate
- Delegation is per-asset: an agent operator running multiple agents delegates each asset separately
- Applies to `mpl-agent-tools` execution delegation (`ExecutionDelegateRecordV1`), program `TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S`

Maintained by Metaplex Foundation. Last verified: 2026-07-08. [View source on GitHub](https://github.com/metaplex-foundation/agent-plumber).

## FAQ

Common questions about delegating to Nori.

### Does delegating to Nori cost anything?
No. Nori pays the network fee on the delegation transaction (it co-signs as fee payer), and the onboarding endpoints are free and unauthenticated. You will want a working SOL balance on your agent's PDA wallet afterwards, because that is the account per-call charges draw from.

### What authority does delegation give Nori?
Delegation registers Nori's executive profile as an execution delegate on your agent asset, which lets Nori sign [MPL Core Execute](/smart-contracts/core/execute-asset-signing) transactions that move SOL out of your agent's PDA wallet. Nori uses this to settle per-call charges, each with an onchain Memo receipt. Keep only a working balance on the PDA and audit the receipts.

### How do I stop Nori from charging my agent?
Revoke the execution delegation on your agent asset. The next charge attempt fails onchain, Nori's cached delegate status is invalidated, and the delegate-pay rail hard-stops — subsequent calls receive HTTP 402 x402 challenges instead of being auto-charged.

### Why do my calls return HTTP 402 even though I delegated?
A 402 means the delegate-pay rail was unavailable for that call — the bearer token is missing or expired (tokens last 15 minutes), the delegation was revoked, or the charge itself failed (usually an empty PDA wallet). Re-run the handshake, verify the delegation record exists, and check the PDA balance.

### Can I use Nori without delegating at all?
Yes. Non-delegated callers use the x402 fallback rail — the first request returns HTTP 402 with payment requirements, you pay in SOL or USDC, then retry. It costs the same but adds a payment round-trip to every call, whereas delegate-pay settles in-line.
