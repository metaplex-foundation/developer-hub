---
title: Metaplex x402 Payment Modes
metaTitle: Metaplex x402 Payment Modes - Wallet, Core Asset, and Delegated Agent | Metaplex
description: Configure the three Metaplex x402 payment modes - a standard Solana wallet, a Core asset or agent paying directly, or a delegated agent that pays without a per-request signature. Includes delegation approval, revocation, and common errors.
keywords:
  - x402 payment modes
  - delegated agent payments
  - Core asset payments
  - execution delegation
  - x402 client setup
  - agent wallet USDC
about:
  - Metaplex x402
  - Agent Commerce
  - Solana
  - Metaplex
proficiencyLevel: Intermediate
programmingLanguage:
  - TypeScript
created: '09-08-2026'
updated: '09-08-2026'
howToTools:
  - "@metaplex-foundation/x402"
  - Node.js 20.18+
  - A USDC-funded Solana wallet, Core asset, or registered agent
howToSteps:
  - Install the x402 client and the peer packages for your chosen Solana toolkit.
  - Fund the paying account with USDC, plus SOL in the signer PDA for Core asset and agent modes.
  - Build a payment-aware fetch by registering a payment scheme for your chosen mode.
  - For delegated agents, approve the onchain execution delegation once with approveMetaplexCoreExecuteDelegate.
  - Pass the payment-aware fetch to any HTTP client and make paid requests.
faqs:
  - q: Which Metaplex x402 payment mode should I use?
    a: Use a standard wallet when your app pays as itself, a Core asset or agent direct payment when you want an asset to hold its own budget under owner oversight, and a delegated agent when an autonomous agent must pay without a human signing each request.
  - q: Do I need SOL to pay for Metaplex x402 requests?
    a: Only for Core asset and agent payment modes, where the asset signer PDA needs SOL to cover Core execute transaction fees. Standard wallet payments need no SOL because the service's fee payer covers the payment transaction's network fee.
  - q: How long does a delegated agent auth token last?
    a: Authorization JWTs expire after 24 hours. Expired tokens are discarded and replaced automatically, and replacement requires only a message signature — not another onchain delegation approval.
  - q: Can I use the reactive extension and the proactive fetch wrapper together?
    a: No. They are alternatives and composing them breaks the flow. Use the reactive client extension when you already run an x402Client or want optional fallback to direct payment; use the proactive fetch wrapper for the simplest wiring against Metaplex endpoints only.
  - q: How do I stop a delegated agent from paying?
    a: Call revokeMetaplexCoreExecuteDelegate with the same signer, asset, and RPC options used to approve it. Delegation is an onchain grant, so revocation takes effect onchain and the server can no longer build payments from the agent's wallet.
  - q: Can I pay with Token-2022 USDC or another stablecoin?
    a: No. The payment source is always a classic SPL Token associated token account, and Token-2022 payment mints are not currently supported.
---

Metaplex x402 supports three payment modes — a standard Solana wallet, a [Core asset](/smart-contracts/core) or [agent](/agents/what-is-an-agent) paying directly, and a delegated agent paying without a per-request signature. Every mode produces the same artifact: a payment-aware `fetch` you hand to whatever HTTP client you already use. {% .lead %}

## Summary

Choosing a payment mode means deciding which account's USDC funds a request and how often its owner signs. The client wiring differs only in which payment scheme you register; the request code that follows is identical across all three.

- **Standard wallet** — vanilla x402 with `ExactSvmScheme`; the owner signs every payment, and no SOL is required
- **Core asset or agent (direct)** — `MetaplexSvmExactScheme` with a `coreExecute` target; funds come from the asset's signer PDA and the owner still signs each payment
- **Delegated agent (instant)** — a one-time onchain grant lets Mech approve payments from the agent's wallet; the client authenticates with a message signature instead
- **Revocable at any time** — delegation is an onchain grant, so revoking it stops payments onchain rather than by policy

{% callout type="note" title="What you will build" %}
By the end of this guide you will have a `fetchWithPayment` function that transparently pays for each request, wired to whichever account you want to spend from. Every recipe on this page produces that same function.
{% /callout %}

## Prerequisites

Metaplex x402 needs a funded Solana account and a signer that can build payment transactions.

- Node.js 20.18+ and an ESM project
- A Solana signer — a [Solana Kit](https://github.com/anza-xyz/kit) keypair signer or a [Umi](/dev-tools/umi) signer
- USDC in the paying account's classic SPL Token associated token account
- For Core asset and agent modes, a Core asset owned by that signer, and SOL in its signer PDA
- For delegated agent mode, a [registered agent identity](/agents/register-agent) — [mint a new agent](/agents/mint-agent) or register an existing Core asset

{% callout type="warning" title="Never embed a private key in browser code" %}
The examples read a development keypair from an environment variable. In a browser, use a wallet adapter signer instead — a private key shipped to the client is a private key you have published.
{% /callout %}

## Quick Start

Install the client, fund the paying account, then register the scheme for your chosen mode.

```sh {% title="Install the client and its peers" %}
pnpm add @metaplex-foundation/x402 \
  @metaplex-foundation/umi \
  @solana/kit \
  @x402/core \
  @x402/fetch \
  @x402/svm
```

Then add the client you plan to use:

| Client | Install |
|--------|---------|
| OpenAI SDK | `pnpm add openai` |
| Vercel AI SDK | `pnpm add ai @ai-sdk/openai-compatible` |
| Solana web3.js | `pnpm add @solana/web3.js` |

Jump to your mode: [standard wallet](#pay-with-a-standard-solana-wallet) · [Core asset or agent](#pay-directly-with-a-core-asset-or-agent) · [delegated agent](#pay-instantly-with-a-delegated-agent).

## Funding Requirements by Payment Mode

Each mode draws USDC from a different account, and only the Core `execute` modes need SOL.

| Payment mode | USDC source | SOL requirement |
|--------------|-------------|-----------------|
| Standard wallet | The wallet's USDC token account | None — the service's fee payer covers the network fee |
| Core asset or agent (direct or delegated) | The asset signer PDA's USDC token account | Required in the signer PDA for Core `execute` fees |

The payment source is always a classic SPL Token associated token account. Token-2022 payment mints are not currently supported.

## Pay with a Standard Solana Wallet

Register `ExactSvmScheme` from `@x402/svm` to pay from a wallet you control directly. This is vanilla x402 — the Metaplex client adds only endpoint constants and discovery helpers.

```ts {% title="Standard wallet payment" %}
import { createKeyPairSignerFromBytes, getBase58Encoder } from '@solana/kit';
import { x402Client } from '@x402/core/client';
import { wrapFetchWithPayment } from '@x402/fetch';
import { ExactSvmScheme } from '@x402/svm/exact/client';

const svmSigner = await createKeyPairSignerFromBytes(
  getBase58Encoder().encode(process.env.SVM_PRIVATE_KEY!),
);

const paymentClient = new x402Client();
paymentClient.register('solana:*', new ExactSvmScheme(svmSigner));

const fetchWithPayment = wrapFetchWithPayment(fetch, paymentClient);
```

## Pay Directly with a Core Asset or Agent

Register `MetaplexSvmExactScheme` with a `coreExecute` target to fund payments from a Core asset's own wallet while the owner still signs each one. Every Core asset has a built-in wallet — its [Asset Signer PDA](/smart-contracts/core/execute-asset-signing) — so funding that wallet isolates spending from your main wallet, and the budget travels with the asset if ownership changes.

```ts {% title="Core asset or agent direct payment" %}
import { MetaplexSvmExactScheme } from '@metaplex-foundation/x402';
import { x402Client } from '@x402/core/client';
import { wrapFetchWithPayment } from '@x402/fetch';

const paymentClient = new x402Client();
paymentClient.register(
  'solana:*',
  new MetaplexSvmExactScheme(svmSigner, {
    rpcUrl: svmRpcUrl,
    coreExecute: {
      asset: coreAssetAddress,
    },
  }),
);

const fetchWithPayment = wrapFetchWithPayment(fetch, paymentClient);
```

`svmSigner` controls the asset, `svmRpcUrl` is the Solana RPC endpoint used to build payment transactions, and `coreAssetAddress` is the Core asset or agent address.

{% callout type="note" title="Assets in a collection need the collection address" %}
Pass `coreExecute.collection` when the asset belongs to a Core collection. The [scheme options table](/agents/x402/api-reference#metaplexsvmexactscheme-options) lists every option.
{% /callout %}

## Pay Instantly with a Delegated Agent

Delegate your agent to Mech once so the server can approve payments from the agent's wallet without an owner signature on every request. This is the mode for autonomous agents and high-frequency workloads.

The agent must be a [registered agent identity](/agents/register-agent) owned by the approving signer. After delegation, the client authenticates with a Sign-In-With-X message signature and receives a 24-hour bearer token, and the server builds payments from the agent's wallet. The delegation is an onchain grant you can revoke at any time.

### Approve the Delegation Once

Check the current status before approving so repeat runs do not resubmit the transaction.

```ts {% title="One-time delegation approval" %}
import {
  approveMetaplexCoreExecuteDelegate,
  fetchMetaplexCoreExecuteDelegateStatus,
} from '@metaplex-foundation/x402';

const status = await fetchMetaplexCoreExecuteDelegateStatus(coreAssetAddress);

if (!status.isDelegated) {
  await approveMetaplexCoreExecuteDelegate(svmSigner, coreAssetAddress, {
    rpcUrl: svmRpcUrl,
  });
}
```

### Choose a Reactive or Proactive Integration Style

Reactive and proactive integrations are alternatives — use one, never both.

| Style | How it authenticates | Choose it when |
|-------|----------------------|----------------|
| **Reactive** | A client extension; the initial `402` response drives authentication and preserves the server's dynamic payment requirements | You already run an `x402Client` alongside other paid services, or want optional fallback to direct payment |
| **Proactive** | A `fetch` wrapper that authenticates before the resource request, so no `402` round trip is visible | You want the simplest wiring against Metaplex endpoints only |

In both snippets below, `solanaSigner` is a message-capable Solana signer used for authentication; a Solana Kit keypair signer works.

```ts {% title="Reactive delegated agent payment" %}
import {
  createMetaplexCoreExecuteDelegateClientExtension,
  InMemoryMetaplexCoreExecuteDelegateAuthTokenStore,
  MetaplexSvmExactScheme,
} from '@metaplex-foundation/x402';
import { x402Client } from '@x402/core/client';
import { wrapFetchWithPayment } from '@x402/fetch';

const authTokenStore = new InMemoryMetaplexCoreExecuteDelegateAuthTokenStore();
const paymentClient = new x402Client();

paymentClient.register(
  'solana:*',
  new MetaplexSvmExactScheme(svmSigner, { rpcUrl: svmRpcUrl }),
);
paymentClient.registerExtension(
  createMetaplexCoreExecuteDelegateClientExtension({
    signer: solanaSigner,
    asset: coreAssetAddress,
    authTokenStore,
  }),
);

const fetchWithPayment = wrapFetchWithPayment(fetch, paymentClient);
```

```ts {% title="Proactive delegated agent payment" %}
import {
  InMemoryMetaplexCoreExecuteDelegateAuthTokenStore,
  wrapFetchWithMetaplexCoreExecuteDelegate,
} from '@metaplex-foundation/x402';

const authTokenStore = new InMemoryMetaplexCoreExecuteDelegateAuthTokenStore();

const fetchWithPayment = wrapFetchWithMetaplexCoreExecuteDelegate(fetch, {
  signer: solanaSigner,
  asset: coreAssetAddress,
  authTokenStore,
});
```

Delegation approval is still required for the proactive style, and requests to other origins pass through untouched.

### Store Auth Tokens and Handle Expiry

Authorization JWTs expire after 24 hours, and the client replaces them automatically with a message signature — not another onchain approval.

- Use `InMemoryMetaplexCoreExecuteDelegateAuthTokenStore` in Node.js and `LocalStorageMetaplexCoreExecuteDelegateAuthTokenStore` in browser-only code
- Implement the `MetaplexCoreExecuteDelegateAuthTokenStore` interface for any other storage backend
- Reactive direct-payment fallback is off by default; set `fallback: true` only when the registered payment scheme should handle delegation failures
- Pass `onEvent` to observe authentication, cache, and fallback behavior

### Revoke the Delegation

Call `revokeMetaplexCoreExecuteDelegate` with the same signer, asset, and RPC options used to approve it.

```ts {% title="Revoke a delegation" %}
import { revokeMetaplexCoreExecuteDelegate } from '@metaplex-foundation/x402';

await revokeMetaplexCoreExecuteDelegate(svmSigner, coreAssetAddress, {
  rpcUrl: svmRpcUrl,
});
```

Because the grant lives onchain, revocation stops the server from building payments from the agent's wallet — it is not a policy the service chooses to honour.

## Common Errors

Payment construction failures almost always trace back to funding, network mismatch, or delegation state.

| Symptom | Cause | Fix |
|---------|-------|-----|
| Payment construction fails | The paying account has no USDC for the payment mint | Fund the wallet, Core asset, or agent signer PDA with USDC |
| Core `execute` payment fails | The asset signer PDA has no SOL for transaction fees | Send SOL to the asset signer PDA |
| Payment rejected as wrong network | `SVM_RPC_URL` targets a different network than the `402` response declares | Point the RPC URL at the network declared by the `402` response |
| Signature rejected for a Core asset | The asset is not controlled by the signer you passed | Pass the signer that owns the Core asset |
| Delegated payments fall back or fail | The asset is not a registered agent identity, or delegation was never approved | Confirm `fetchMetaplexCoreExecuteDelegateStatus()` returns `isDelegated: true` |
| Authentication loops or double-pays | The reactive extension and proactive wrapper are composed together | Use one integration style, never both |

## Tested Configuration

| Package | Version |
|---------|---------|
| `@metaplex-foundation/x402` | `0.1.0` |
| Node.js | 20.18+ (ESM) |
| Payment mint | USDC (classic SPL Token) |

## Notes

- `MetaplexSvmExactScheme` accepts Umi signers and Solana Kit partial transaction signers, but not sign-and-send signers. Kit signers are adapted internally.
- Every service, client, and payment mode combination has a runnable example in the [x402 repository](https://github.com/metaplex-foundation/x402/tree/main/examples), executable as `pnpm example:<name>`.
- Delegated agent examples may submit an approval transaction the first time they run.
- Delegation grants Mech authority to move USDC from the agent's wallet to pay for requests. Keep only a working balance in the signer PDA and revoke when the agent is idle.

## Quick Reference

| Item | Value |
|------|-------|
| Standard wallet scheme | `ExactSvmScheme` (from `@x402/svm`) |
| Core asset and agent scheme | `MetaplexSvmExactScheme` |
| Delegation helpers | `fetchMetaplexCoreExecuteDelegateStatus`, `approveMetaplexCoreExecuteDelegate`, `revokeMetaplexCoreExecuteDelegate` |
| Delegated transports | `createMetaplexCoreExecuteDelegateClientExtension`, `wrapFetchWithMetaplexCoreExecuteDelegate` |
| Auth token lifetime | 24 hours |
| Delegation endpoints | `/x402/core-execute-delegate/{status,approve,revoke,auth}` |

## FAQ

Common questions about Metaplex x402 payment modes.

### Which Metaplex x402 payment mode should I use?
Use a standard wallet when your app pays as itself, a Core asset or agent direct payment when you want an asset to hold its own budget under owner oversight, and a delegated agent when an autonomous agent must pay without a human signing each request.

### Do I need SOL to pay for Metaplex x402 requests?
Only for Core asset and agent payment modes, where the asset signer PDA needs SOL to cover Core `execute` transaction fees. Standard wallet payments need no SOL because the service's fee payer covers the payment transaction's network fee.

### How long does a delegated agent auth token last?
Authorization JWTs expire after 24 hours. Expired tokens are discarded and replaced automatically, and replacement requires only a message signature — not another onchain delegation approval.

### Can I use the reactive extension and the proactive fetch wrapper together?
No. They are alternatives and composing them breaks the flow. Use the reactive client extension when you already run an `x402Client` or want optional fallback to direct payment; use the proactive fetch wrapper for the simplest wiring against Metaplex endpoints only.

### How do I stop a delegated agent from paying?
Call `revokeMetaplexCoreExecuteDelegate` with the same signer, asset, and RPC options used to approve it. Delegation is an onchain grant, so revocation takes effect onchain and the server can no longer build payments from the agent's wallet.

### Can I pay with Token-2022 USDC or another stablecoin?
No. The payment source is always a classic SPL Token associated token account, and Token-2022 payment mints are not currently supported.

---

Maintained by Metaplex Foundation. Last verified: 2026-09-08. Client version: `@metaplex-foundation/x402` `0.1.0`. [View source on GitHub](https://github.com/metaplex-foundation/x402).
