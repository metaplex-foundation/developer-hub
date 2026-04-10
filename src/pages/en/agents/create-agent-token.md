---
title: Create an Agent Token
metaTitle: Create an Agent Token with Metaplex Genesis | Metaplex Agents
description: How to launch a bonding curve token on behalf of a Metaplex agent using the Genesis SDK — including automatic creator fee routing, first buy, devnet testing, and error handling.
agentSkill: /agents/create-agent-token.md
keywords:
  - agent token
  - token launch
  - Genesis
  - bonding curve
  - agent wallet
  - Solana agents
  - Metaplex
  - createAndRegisterLaunch
  - creator fee
  - first buy
about:
  - Agent Tokens
  - Genesis
  - Bonding Curve
  - Solana
programmingLanguage:
  - JavaScript
  - TypeScript
  - Bash
cli: /dev-tools/cli/agents/set-agent-token
proficiencyLevel: Intermediate
created: '04-05-2026'
updated: '04-07-2026'
howToSteps:
  - Register your agent on Solana to get its Core asset address
  - Install the Genesis SDK and configure a Umi instance
  - Call createAndRegisterLaunch with the agent field and your token metadata
  - Read mintAddress and launch.link from the result
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
  - Metaplex API
faqs:
  - q: What is an Agent Token?
    a: An Agent Token is a token launched from an agent's onchain wallet using the Metaplex Genesis protocol. When you pass the agent field to createAndRegisterLaunch, the SDK automatically routes creator fees to the agent's Core asset signer PDA and wraps the launch transactions in Core execute instructions so the agent executes them onchain.
  - q: Where do creator fees go when launching an agent token?
    a: Creator fees are automatically routed to the agent's Core asset signer PDA — derived from seeds ['mpl-core-execute', <agent_mint>]. You do not need to set creatorFeeWallet manually; passing the agent field is sufficient. The fee wallet can be overridden by setting launch.creatorFeeWallet explicitly.
  - q: Is setToken reversible?
    a: No. Each agent can have only ever have one token — the association is permanent\. Setting setToken to true cannot be undone, replaced, or reassigned, and there is no instruction to change or remove it. Do not set setToken to true until you are certain this is the correct, final token for the agent.
  - q: Can I test an agent token launch on devnet first?
    a: Yes. Pass network 'solana-devnet' in the launch input and point your Umi instance at the devnet RPC. The API routes the request to devnet infrastructure. Fund the agent wallet with devnet SOL before sending transactions.
  - q: Can I combine a first buy with creator fees on an agent launch?
    a: Yes. Set firstBuyAmount in the launch object alongside the agent field. The first buy itself is fee-free — no protocol fee or creator fee is charged on that initial purchase. The first buy buyer defaults to the agent PDA when agent is provided.
---

Launch a token from an agent's onchain wallet using the [Genesis](/smart-contracts/genesis) protocol and the Metaplex API. {% .lead %}

{% callout title="What You'll Build" %}
By the end of this guide you will have:
- Launched a bonding curve token on behalf of a Metaplex agent
- Routed creator fees automatically to the agent's onchain wallet
- Optionally reserved the first swap for the agent at a fee-free rate
{% /callout %}

## Summary

`createAndRegisterLaunch` with the `agent` field creates a new token, routes creator fees to the agent's [Core](/core) asset PDA, and wraps the launch transactions in Core execute instructions so the agent executes them onchain.

- **One call** — `createAndRegisterLaunch` handles create, sign, send, and register in sequence
- **Automatic fee routing** — creator fees go to the agent PDA; no manual wallet address needed
- **One token per agent, forever** — each agent can only ever have one token; once set with `setToken: true` it cannot be changed, replaced, or unset
- **Applies to** `@metaplex-foundation/genesis` 1.x · Last verified April 2026

## Quick Start

**Jump to:** [Installation](#installation) · [Umi Setup](#umi-setup) · [Launch](#launching-an-agent-token) · [First Buy](#first-buy) · [Token Metadata](#token-metadata) · [Devnet](#devnet-testing) · [Errors](#error-handling)

1. [Register your agent on Solana](/agents/register-agent) to get its Core asset address
2. Install the Genesis SDK and configure a Umi instance with your keypair
3. Call `createAndRegisterLaunch` with `agent: { mint: agentAssetAddress, setToken: true }`
4. Read `result.mintAddress` and `result.launch.link` from the response

## Prerequisites

- A [registered Metaplex agent](/agents/register-agent) — you need its Core asset address
- **Node.js 18+** — required for native `BigInt` support
- A Solana wallet keypair funded with SOL for transaction fees and any first buy amount
- A Solana RPC endpoint (mainnet-beta or devnet)
- A token image pre-uploaded to [Irys](https://irys.xyz) — the `image` field must be an Irys gateway URL

## Installation

```bash {% title="Terminal" %}
npm install @metaplex-foundation/genesis \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults
```

## Umi Setup

Configure a Umi instance with your keypair identity before calling any Genesis function.

```typescript {% title="setup.ts" showLineNumbers=true %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity } from '@metaplex-foundation/umi';

const umi = createUmi('https://api.mainnet-beta.solana.com');

// Load your keypair — use your preferred key management solution in production.
const keypair = umi.eddsa.createKeypairFromSecretKey(mySecretKeyBytes);
umi.use(keypairIdentity(keypair));
```

{% callout type="note" %}
The Genesis API functions talk to the hosted Metaplex API over HTTP rather than submitting instructions directly. The Umi instance is used only for its signer identity and transaction-sending capability — the `genesis()` plugin is not required.
{% /callout %}

## Launching an Agent Token

Pass the `agent` field to `createAndRegisterLaunch` with your agent's [Core](/core) asset address. The SDK automatically:

- Sets the creator fee wallet to the agent's Core asset signer PDA (derived from `['mpl-core-execute', <agent_mint>]`)
- Wraps the launch transactions in Core execute instructions for the agent to execute onchain

{% code-tabs-imported from="agents/create_agent_token" frameworks="umi,cli" defaultFramework="umi" /%}

{% callout type="warning" %}
**An agent can only ever have one token.** Setting `setToken: true` permanently associates this token with the agent — it cannot be changed, replaced, or unset after the transaction confirms. Do not set `setToken: true` until you are certain this is the correct, final token for the agent.
{% /callout %}

All protocol parameters — supply splits, virtual reserves, and lock schedules — are set to protocol defaults when `launch: {}` is empty.

For a complete explanation of how the bonding curve pricing, fees, and graduation work, see [Bonding Curve — Theory of Operation](/smart-contracts/genesis/bonding-curve).

## First Buy

The first buy reserves the initial swap on the curve for the agent PDA at a specified SOL amount, with all fees waived.

Set `firstBuyAmount` to the SOL amount for the fee-free initial purchase. When `agent` is provided, the first buy buyer defaults to the agent PDA automatically.

{% code-tabs-imported from="agents/create_agent_token_first_buy" frameworks="umi,cli" defaultFramework="umi" /%}

The first buy is executed as part of the launch transaction flow — the curve already has the initial purchase applied once the transactions confirm. When `firstBuyAmount` is omitted or `0`, no first buy is applied and any wallet can make the first swap.

## Token Metadata

Every launch requires a `token` object with the following fields.

| Field | Required | Constraints |
|-------|----------|-------------|
| `name` | Yes | 1–32 characters |
| `symbol` | Yes | 1–10 characters |
| `image` | Yes | Must be an Irys URL (`https://gateway.irys.xyz/...`) |
| `description` | No | Max 250 characters |
| `externalLinks` | No | Optional `website`, `twitter`, and `telegram` URLs |

{% code-tabs-imported from="agents/create_agent_token_metadata" frameworks="umi,cli" defaultFramework="umi" /%}

The `image` field must point to an Irys gateway URL. Upload your image to [Irys](https://irys.xyz) first and use the returned `https://gateway.irys.xyz/<id>` URL. Other hosts will fail API validation.

## Devnet Testing

Pass `network: 'solana-devnet'` and point the Umi instance at the devnet RPC endpoint to route the launch through devnet infrastructure. For the CLI, the network is determined by your configured RPC endpoint.

{% code-tabs-imported from="agents/create_agent_token_devnet" frameworks="umi,cli" defaultFramework="umi" /%}

## Error Handling

The SDK provides typed errors for different failure modes.

| Error type | Guard | Cause |
|------------|-------|-------|
| Validation error | `isGenesisValidationError` | Invalid input (e.g. non-Irys image URL, name too long) |
| Network error | `isGenesisApiNetworkError` | Cannot reach `https://api.metaplex.com` |
| API error (4xx) | `isGenesisApiError` | Request rejected by the API; check `err.responseBody` |
| API error (5xx) | `isGenesisApiError` | Metaplex API unavailable; retry with back-off |

```typescript {% title="error-handling.ts" showLineNumbers=true %}
import {
  createAndRegisterLaunch,
  isGenesisApiError,
  isGenesisApiNetworkError,
  isGenesisValidationError,
} from '@metaplex-foundation/genesis/api';

try {
  const result = await createAndRegisterLaunch(umi, {}, input);
} catch (err) {
  if (isGenesisValidationError(err)) {
    console.error(`Validation error on "${err.field}": ${err.message}`);
  } else if (isGenesisApiNetworkError(err)) {
    console.error('Network error:', err.message);
  } else if (isGenesisApiError(err)) {
    console.error(`API error (${err.statusCode}): ${err.message}`);
    console.error('Details:', err.responseBody);
  } else {
    throw err;
  }
}
```

## Notes

- Each agent can only ever have **one token** — `setToken: true` is permanent and cannot be changed, replaced, or unset; there is no instruction to remove or reassign it
- `createAndRegisterLaunch` makes two API calls internally — if the create transactions confirm but `registerLaunch` fails, the token exists onchain but is not visible on metaplex.com; use `createLaunch` + `registerLaunch` separately with [manual signing](/smart-contracts/genesis/bonding-curve-launch#manual-signing-flow) to handle this case
- The creator fee wallet can be overridden by setting `launch.creatorFeeWallet` explicitly — it takes precedence over the agent PDA
- First buy is configured at launch creation and cannot be added after the curve is live
- Creator fees are accrued in the bucket, not transferred per-swap; claim via the permissionless `claimBondingCurveCreatorFeeV2` (bonding curve) and `claimRaydiumCreatorFeeV2` (post-graduation Raydium) instructions — see [Creator Fees](/smart-contracts/genesis/creator-fees) for the full claiming flow
- The Metaplex API constructs and returns unsigned transactions; the caller always holds the signing keys


## FAQ

### What is an Agent Token?

An Agent Token is a token launched from an agent's onchain wallet using the [Genesis](/smart-contracts/genesis) protocol. Passing the `agent` field to `createAndRegisterLaunch` automatically routes creator fees to the agent's [Core](/core) asset signer PDA and wraps the launch transactions in Core execute instructions so the agent executes them onchain.

### Where do creator fees go when launching an agent token?

Creator fees are automatically routed to the agent's Core asset signer PDA — derived from seeds `['mpl-core-execute', <agent_mint>]`. You do not need to set `creatorFeeWallet` manually; passing the `agent` field is sufficient. The fee wallet can still be overridden by setting `launch.creatorFeeWallet` explicitly.

### Is `setToken` reversible?

No. Each agent can only ever have **one token**, and the association is permanent. Setting `setToken: true` cannot be undone, replaced, or reassigned after the transaction confirms — there is no instruction to change or remove it. If you are unsure, set `setToken: false` and do not set the token until you are certain.

### Can I test an agent token launch on devnet first?

Yes. Pass `network: 'solana-devnet'` in the launch input and point your Umi instance at `https://api.devnet.solana.com`. Fund the agent wallet with devnet SOL before sending transactions.

### Can I combine a first buy with creator fees on an agent launch?

Yes. Set `firstBuyAmount` in the `launch` object alongside the `agent` field. The first buy itself is fee-free — no protocol fee or creator fee is charged on that purchase. Creator fees apply normally to all subsequent swaps on the curve.
