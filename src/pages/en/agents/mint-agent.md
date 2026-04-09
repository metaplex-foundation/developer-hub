---
title: Mint an Agent
metaTitle: Mint an Agent | Metaplex
description: Create an onchain AI agent in a single transaction using the Metaplex API and the mpl-agent-registry SDK. The hosted API stores agent metadata and returns an unsigned transaction you sign and submit.
keywords:
  - mint agent
  - agent registration
  - Metaplex API
  - mpl-agent-registry
  - mintAgent
  - mintAndSubmitAgent
  - Core asset
  - agent identity
  - Solana
about:
  - Agent Registration
  - Metaplex API
  - Solana
programmingLanguage:
  - JavaScript
  - TypeScript
cli: /dev-tools/cli/agents/register
proficiencyLevel: Beginner
created: '03-27-2026'
updated: '03-27-2026'
howToSteps:
  - Install mpl-agent-registry and configure a Umi instance
  - Call mintAndSubmitAgent with your wallet, agent name, metadata URI, and agentMetadata
  - The Metaplex API stores the metadata and returns an unsigned Solana transaction
  - Sign and submit the transaction to create the Core asset and register the agent identity onchain
howToTools:
  - Node.js
  - Umi framework
  - mpl-agent-registry SDK v0.2.0+
faqs:
  - q: What is the difference between mintAndSubmitAgent and mintAgent?
    a: mintAndSubmitAgent is a convenience wrapper that calls mintAgent then signs and submits the transaction in one step. Use mintAgent directly when you need manual signing control, a custom transaction sender, or the ability to inspect the transaction before submitting.
  - q: What is the difference between minting via the Metaplex API and using registerIdentityV1 directly?
    a: The Metaplex API flow creates both the Core asset and the agent identity in a single transaction — no pre-existing asset is required. The registerIdentityV1 approach attaches an identity plugin to a Core asset you already own.
  - q: Do I need to create a Core asset before calling mintAndSubmitAgent?
    a: No. The API creates the Core asset and registers the agent identity together in one transaction. You only need a wallet address, agent name, metadata URI, and agentMetadata object.
  - q: What is the difference between the uri field and agentMetadata?
    a: The uri is stored directly in the Core asset's onchain metadata — it should point to a publicly hosted JSON file, just like a standard NFT. The agentMetadata object is sent to the Metaplex API and stored off-chain alongside the agent record. Both are set during minting.
  - q: Can I test on devnet before going to mainnet?
    a: Yes. Pass network "solana-devnet" in the input and point your Umi instance at the Solana devnet RPC endpoint.
  - q: What happens if the API returns a transaction but the submission fails onchain?
    a: A failed onchain transaction means the Core asset was not created and no identity was registered. Call mintAgent again to get a fresh transaction with a new blockhash, then retry.
  - q: Which networks does the Metaplex API support?
    a: Solana Mainnet, Solana Devnet, Localnet, Eclipse Mainnet, Sonic Mainnet, Sonic Devnet, Fogo Mainnet, and Fogo Testnet.
  - q: What does it cost to mint an agent?
    a: Minting an agent costs the standard Solana transaction fee plus rent for the Core asset account and the Agent Identity PDA. There is no additional protocol fee charged by the Metaplex API for minting.
---

Register an AI agent onchain in a single call using the Metaplex API and the `mpl-agent-registry` SDK. {% .lead %}

## Summary

The Metaplex API provides a hosted endpoint that stores agent metadata and returns an unsigned Solana transaction. Signing and submitting that transaction creates an [MPL Core](/core) asset representing the agent and registers an [Agent Identity](/smart-contracts/mpl-agent/identity) PDA in a single atomic operation.

- **Creates** an MPL Core asset and registers the Agent Identity PDA together in one transaction — no pre-existing asset required
- **Hosted API** at `https://api.metaplex.com` handles metadata storage — no separate upload step before minting
- **Two SDK functions** — `mintAndSubmitAgent` for a one-call flow, `mintAgent` for manual signing control
- **Multi-network** — supports Solana mainnet and devnet, Eclipse, Sonic, and Fogo
- **Requires** `@metaplex-foundation/mpl-agent-registry` v0.2.0+

{% callout title="What You'll Build" %}
A registered onchain AI agent: an MPL Core asset with a linked Agent Identity PDA, created via the Metaplex API and the `mpl-agent-registry` SDK.
{% /callout %}

## Quick Start

1. [Understand the flow](#how-it-works)
2. [Install the SDK](#installation)
3. [Configure a Umi instance](#umi-setup)
4. [Mint and register in one call](#mint-and-submit-an-agent)
5. [Verify the result](#verify-the-result)

## How It Works

Minting an agent through the Metaplex API is a three-step flow orchestrated by the SDK:

1. **API call** — The SDK sends your agent details to `POST /v1/agents/mint` on `https://api.metaplex.com`. The API stores the `agentMetadata` off-chain and constructs an unsigned Solana transaction.
2. **Unsigned transaction returned** — The API returns the transaction without signing it. Your private key never leaves your environment — the API only builds the instruction set.
3. **Sign and submit** — You (or `mintAndSubmitAgent` automatically) sign the transaction with your keypair and submit it. Onchain, this creates the Core asset and registers the Agent Identity PDA in a single atomic operation.

### Two fields, two destinations

When calling `mintAndSubmitAgent` or `mintAgent`, you provide two distinct pieces of metadata:

| Field | Where it's stored | Purpose |
|-------|------------------|---------|
| `uri` | Onchain, in the Core asset's metadata | Points to a publicly hosted JSON file — the agent's NFT metadata. Works like any standard Core asset URI. |
| `agentMetadata` | Off-chain, stored by the Metaplex API | Describes the agent's capabilities, services, and trust model. Indexed by the registry for discovery. |

Both are set during minting and cannot be changed independently after the fact without updating the agent.

{% callout type="note" %}
This guide creates a new Core asset and registers the agent identity together in one transaction. If you already own a Core asset and only want to attach an identity to it, use [`registerIdentityV1`](/agents/register-agent) instead.
{% /callout %}

## Prerequisites

The following are required before minting:

- Node.js 18 or later
- A funded Solana wallet keypair — this wallet pays for the transaction and becomes the agent owner
- A publicly accessible `uri` for the Core asset's NFT metadata JSON

## Installation

Install the three required packages: the Agent Registry SDK, the core Umi framework, and the default Umi bundle that provides an RPC client and transaction sender.

```bash {% title="Terminal" %}
npm install @metaplex-foundation/mpl-agent-registry @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults
```

## Umi Setup

[Umi](/umi) is the Metaplex JavaScript framework used to interact with Solana programs. Configure it with your RPC endpoint and keypair before calling any SDK function.

The `mplAgentIdentity()` plugin registers the Agent Identity program's instruction builders and account deserializers with your Umi instance. Without it, Umi cannot construct or read Agent Identity program instructions.

```typescript {% title="setup.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity } from '@metaplex-foundation/umi';
import { mplAgentIdentity } from '@metaplex-foundation/mpl-agent-registry';

// Point Umi at your preferred RPC
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplAgentIdentity());

// Load your keypair — this wallet pays for the transaction and becomes the agent owner
const keypair = umi.eddsa.createKeypairFromSecretKey(mySecretKeyBytes);
umi.use(keypairIdentity(keypair));
```

The example above uses `keypairIdentity` — loading a raw secret key directly into Umi. This is the standard approach for server-side scripts and backend integrations. Umi also supports two other identity patterns depending on your environment:

| Approach | How | Best for |
|----------|-----|----------|
| **Raw keypair** (this example) | `keypairIdentity` + `createKeypairFromSecretKey` | Server-side scripts, backends |
| **Filesystem wallet** | `createSignerFromKeypair` + `signerIdentity` with a JSON key file | Local development and CLI tools |
| **Browser wallet adapter** | `walletAdapterIdentity` from `umi-signer-wallet-adapters` | Web dApps with Phantom, Backpack, etc. |

See [Connecting a Wallet](/dev-tools/umi/getting-started#connecting-a-wallet) in the Umi docs for full code examples of each approach, including how to load a filesystem keypair from a `.json` file and how to wire up a wallet adapter.

## Mint and Submit an Agent

`mintAndSubmitAgent` calls the Metaplex API, signs the returned transaction, and submits it to the network in one step. Use this for most integrations.

{% code-tabs-imported from="agents/mint_and_submit" frameworks="umi" filename="mintAndSubmitAgent" /%}

## Mint an Agent with Manual Signing

`mintAgent` returns the unsigned transaction without submitting it. Use this when you need to add priority fees, use a hardware wallet, or integrate custom retry logic.

{% code-tabs-imported from="agents/mint_manual" frameworks="umi" filename="mintAgent" /%}

## Verify the Result

After minting, confirm the agent identity was registered by fetching the Core asset and checking the `AgentIdentity` plugin. A successful registration attaches lifecycle hooks for Transfer, Update, and Execute — these are the signals to check.

{% code-tabs-imported from="agents/verify" frameworks="umi" filename="verifyRegistration" /%}

If `agentIdentities` is undefined or empty, the identity was not registered — the transaction may have failed silently or not confirmed. Check the transaction signature onchain before retrying.

## Agent Metadata Fields

The `agentMetadata` object is sent to the Metaplex API and stored off-chain alongside the agent record. It is separate from the Core asset's `uri` (the NFT metadata file) — see [How It Works](#how-it-works) for the distinction.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | `string` | Yes | Schema identifier. Use `'agent'`. |
| `name` | `string` | Yes | Agent display name |
| `description` | `string` | Yes | What the agent does and how to interact with it |
| `services` | `AgentService[]` | No | Service endpoints the agent exposes |
| `registrations` | `AgentRegistration[]` | No | Links to external registry entries |
| `supportedTrust` | `string[]` | No | Trust mechanisms supported — e.g. `'tee'`, `'reputation'` |

### Agent Service Fields

Each entry in `services` describes one way to interact with the agent.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | Yes | Service type — e.g. `'trading'`, `'chat'`, `'MCP'`, `'A2A'` |
| `endpoint` | `string` | Yes | URL where the service can be reached |

## Supported Networks

Pass the `network` value in the input object. It defaults to `'solana-mainnet'` when omitted. Make sure your Umi RPC endpoint matches the network you select.

| Network | `network` Value |
|---------|-----------------|
| Solana Mainnet | `solana-mainnet` (default) |
| Solana Devnet | `solana-devnet` |
| Localnet | `localnet` |
| Eclipse Mainnet | `eclipse-mainnet` |
| Sonic Mainnet | `sonic-mainnet` |
| Sonic Devnet | `sonic-devnet` |
| Fogo Mainnet | `fogo-mainnet` |
| Fogo Testnet | `fogo-testnet` |

## Devnet Testing

Test your integration on Solana devnet before going to mainnet. Point your Umi instance at the devnet RPC and pass `network: 'solana-devnet'` so the API registers the agent against the devnet cluster. Agents minted on devnet have separate asset addresses from mainnet and will not appear in mainnet explorers.

{% code-tabs-imported from="agents/devnet" frameworks="umi" filename="devnetTest" /%}

## Custom API Base URL

Target a staging or self-hosted API by passing `baseUrl` in the config argument (the second parameter to `mintAgent` or `mintAndSubmitAgent`). Use this when integrating against a non-production environment.

{% code-tabs-imported from="agents/custom_api_url" frameworks="umi" filename="customApiUrl" /%}

## Custom Transaction Sender

Pass a `txSender` function as the fourth argument to `mintAndSubmitAgent` to use your own signing and submission infrastructure. This is the right hook for adding Jito bundle tips, priority fees, or custom confirmation polling.

{% code-tabs-imported from="agents/custom_sender" frameworks="umi" filename="customSender" /%}

## Error Handling

The SDK exports typed error guards so you can handle each failure mode explicitly rather than catching a generic error.

{% code-tabs-imported from="agents/error_handling" frameworks="umi" filename="errorHandling" /%}

## Common Errors

These are the most frequent failure modes and how to resolve them.

| Error | Cause | Fix |
|-------|-------|-----|
| `isAgentValidationError` | A required input field is missing or malformed | Check `err.field` and ensure all required `agentMetadata` fields are provided |
| `isAgentApiNetworkError` | The API endpoint was unreachable | Verify network connectivity; inspect `err.cause` for the underlying error |
| `isAgentApiError` | The API returned a non-2xx status | Inspect `err.statusCode` and `err.responseBody`; verify the `uri` is publicly accessible |
| Blockhash expired | The transaction was not submitted before the blockhash expired | Call `mintAgent` again to get a fresh transaction, then retry submission |
| `agentIdentities` empty after mint | Transaction confirmed but identity plugin not attached | Fetch the transaction receipt to confirm it succeeded; if it failed silently, retry the full mint |

## Full Example

A complete end-to-end snippet — setup, mint, and verify — ready to copy and run.

{% code-tabs-imported from="agents/full_example" frameworks="umi" filename="fullExample" /%}

## Notes

- `mintAndSubmitAgent` creates a new Core asset on every call — there is no deduplication. Calling it twice with the same input creates two separate agents at two different asset addresses.
- The `uri` field is stored in the Core asset's onchain metadata and must point to a publicly accessible JSON document. If you do not have a hosted metadata URI yet, upload the file to Arweave or another permanent storage provider first.
- To attach an agent identity to an existing Core asset without creating a new one, use [`registerIdentityV1`](/agents/register-agent) instead.
- The Metaplex API base URL defaults to `https://api.metaplex.com`. No API key is required.
- Minting costs the standard Solana transaction fee plus rent for the Core asset account and the Agent Identity PDA.
- Requires `@metaplex-foundation/mpl-agent-registry` v0.2.0+.

## FAQ

### What is the difference between `mintAndSubmitAgent` and `mintAgent`?
`mintAndSubmitAgent` is a convenience wrapper that calls `mintAgent` then signs and submits the transaction in one step. Use `mintAgent` directly when you need manual signing control, a custom transaction sender, or the ability to inspect the transaction before submitting.

### What is the difference between minting via the Metaplex API and using `registerIdentityV1` directly?
The Metaplex API flow (`mintAgent` / `mintAndSubmitAgent`) creates the Core asset **and** registers the agent identity in a single transaction — no pre-existing Core asset is required. The [`registerIdentityV1`](/agents/register-agent) approach attaches an identity plugin to an MPL Core asset you already own.

### What is the difference between the `uri` field and `agentMetadata`?
The `uri` is stored directly in the Core asset's onchain metadata — it should point to a publicly hosted JSON file, just like a standard NFT. The `agentMetadata` object is sent to the Metaplex API and stored off-chain alongside the agent record. Both are set during minting. See [How It Works](#how-it-works) for the full breakdown.

### Do I need to create a Core asset before calling `mintAndSubmitAgent`?
No. The API creates the Core asset and registers the agent identity together. You only need a wallet address, an agent name, a metadata URI, and the `agentMetadata` object.

### Can I test on devnet before going to mainnet?
Yes. Pass `network: 'solana-devnet'` in the input and point your Umi instance at `https://api.devnet.solana.com`.

### What happens if the API returns a transaction but the submission fails onchain?
A failed onchain transaction means the Core asset was not created and no identity was registered. Call `mintAgent` again to get a fresh transaction with a new blockhash, then retry.

### Which networks does the Metaplex API support?
Solana Mainnet, Solana Devnet, Localnet, Eclipse Mainnet, Sonic Mainnet, Sonic Devnet, Fogo Mainnet, and Fogo Testnet. See [Supported Networks](#supported-networks) for the exact values to pass.

### What does it cost to mint an agent?
Minting costs the standard Solana transaction fee plus rent for the Core asset account and the Agent Identity PDA. There is no additional protocol fee charged by the Metaplex API for minting.
