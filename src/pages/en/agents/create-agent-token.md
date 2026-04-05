---
title: Create an Agent Token
metaTitle: Create an Agent Token on Solana | Metaplex Agent Kit
description: Launch a token from an agent's onchain wallet using Metaplex Genesis. Register your agent on Solana, then use the Genesis protocol to create and distribute a token.
keywords:
  - agent token
  - token launch
  - Genesis
  - agent wallet
  - Solana agents
  - Metaplex
about:
  - Agent Tokens
  - Genesis
  - Solana
proficiencyLevel: Beginner
created: '04-05-2026'
updated: '04-05-2026'
---

Create a token launched from an agent's onchain wallet using the Metaplex Genesis protocol. {% .lead %}

## Summary

An Agent Token is a token launched directly from an agent's onchain wallet. Agents use the [Metaplex Genesis](/smart-contracts/genesis) protocol to create and distribute tokens after registering their identity on Solana.

- **Register** an agent identity on Solana with [Metaplex Agent Registry](/agents/register-agent)
- **Launch** a token using the [Genesis](/smart-contracts/genesis) protocol via Metaplex APIs, SDKs, or CLI
- **Requires** a registered agent with an onchain wallet before token creation
- **Supports** all Genesis launch types including launch pools, presales, and auctions

## How Agent Token Creation Works

Agent token creation is a two-step process that combines agent identity registration with the Genesis token launch protocol.

### Step 1: Register the Agent on Solana

The agent must first [register on Solana with Metaplex](/agents/register-agent), which creates a public identity and onchain wallet. Registration binds an identity record to an MPL Core asset, making the agent discoverable on-chain. See the [Register an Agent](/agents/register-agent) guide for full instructions.

### Step 2: Launch a Token with Genesis

Once registered, the agent uses the [Metaplex Genesis](/smart-contracts/genesis) protocol to launch their token. Genesis supports multiple launch mechanisms including launch pools, presales, and uniform price auctions. The agent can interact with Genesis via:

- **[Metaplex APIs](/smart-contracts/genesis/integration-apis)** — programmatic token creation through REST endpoints
- **[Metaplex SDKs](/smart-contracts/genesis/sdk/javascript)** — JavaScript/TypeScript SDK integration
- **[Metaplex CLI](/dev-tools/cli/genesis)** — command-line token launch workflow

For full Genesis documentation, see the [Genesis overview](/smart-contracts/genesis).

{% callout type="note" %}
Full end-to-end documentation for agent token creation is coming soon. This page will be updated with complete code examples and step-by-step instructions.
{% /callout %}

## Notes

- An agent must be [registered](/agents/register-agent) before it can launch a token. The registration creates the onchain wallet used for token creation.
- Agent tokens are standard SPL tokens launched through [Genesis](/smart-contracts/genesis) — they are fully compatible with the Solana token ecosystem.
- The Genesis protocol handles all token distribution mechanics (launch pools, presales, auctions) regardless of whether the launcher is an agent or a human wallet.
