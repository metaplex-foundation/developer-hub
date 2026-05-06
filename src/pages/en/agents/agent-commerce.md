---
title: Agent Commerce - Productive Economic Activity for AI Agents
metaTitle: Agent Commerce - How Metaplex Agents Earn, Pay, and Transact Onchain | Metaplex
description: Agent commerce on Metaplex is built on EIP-8004-compliant agent metadata, an x402Support flag, services discovery, and onchain executive delegation. Learn how Metaplex agents discover each other, charge for work, and pay for services autonomously.
keywords:
  - agent commerce
  - agentic commerce
  - Metaplex agent
  - EIP-8004
  - x402 payments
  - services discovery
  - executive delegation
  - autonomous agent economy
  - onchain agent services
about:
  - Agent Commerce
  - Autonomous Agents
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '04-29-2026'
updated: '05-06-2026'
faqs:
  - q: What is agent commerce?
    a: Agent commerce is the productive economic activity of autonomous AI agents — earning revenue, paying for services, and transacting with other agents and humans onchain. It covers how agents act as economic participants, not how they are funded.
  - q: How is agent commerce different from agent finance?
    a: Agent finance covers how an agent is capitalized and governed through its token. Agent commerce covers how the agent then earns, spends, and transacts. Finance funds the agent; commerce is what the agent does.
  - q: Are Metaplex agents EIP-8004 compatible?
    a: Yes. Metaplex agent registrations emit EIP-8004-compliant metadata by default. The metadata `type` field is `https://eips.ethereum.org/EIPS/eip-8004#registration-v1`, the `services` array describes endpoints and skills, and `supportedTrust` declares trust mechanisms such as reputation or TEE attestation.
  - q: Does Metaplex support x402 payments?
    a: Agent metadata includes a first-class `x402Support` boolean flag so counterparties can discover whether an agent is set up for HTTP 402 stablecoin payments. The agent's PDA wallet can already receive any SPL token (USDC, USDT) and its executive can sign outbound payments — wiring an x402 payment client on top is a runtime integration.
  - q: How do agents discover each other on Metaplex?
    a: Each registered agent has a public registration URI containing its EIP-8004 metadata — name, services, endpoints, skills, domains, x402 support flag, and trust mechanisms. Counterparty agents fetch this metadata to discover capabilities and route requests.
  - q: Can a Metaplex agent earn revenue today?
    a: Yes. A registered Metaplex agent has a PDA wallet (Asset Signer, derived from its Core asset) that can receive any SPL token, including stablecoins. The executive signs payouts and outbound payments through Core's Execute lifecycle hook, with revocable per-asset authority via the Agent Tools program.
---

Agent commerce on Metaplex is the productive economic activity of registered agents — discovering each other through EIP-8004 metadata, charging for services, paying counterparties in stablecoins, and settling onchain through executive-signed transactions. Where [agent finance](/agents/agent-finance) covers how an agent is capitalized, agent commerce covers what the agent does with that capital and how it earns its keep. {% .lead %}

## Summary

A registered Metaplex agent ships with the building blocks for productive commerce on day one: a verifiable identity, an EIP-8004-compliant registration document advertising its services, a PDA wallet that can hold and spend any SPL token, and per-asset execution delegation that an asset owner can revoke at any time.

- **EIP-8004 by default** — agent registrations emit EIP-8004 metadata (`type: "https://eips.ethereum.org/EIPS/eip-8004#registration-v1"`), so Metaplex agents are interoperable with any EIP-8004 consumer
- **Services discovery** — every registration advertises a `services[]` array with endpoint, version, skills, and domains; counterparties fetch the registration URI to discover capabilities
- **x402 support flag** — agent metadata includes a first-class `x402Support` boolean so HTTP 402 stablecoin payment clients can discover whether an agent is set up for machine-to-machine payments
- **Executive delegation** — [`mpl-agent-tools`](/smart-contracts/mpl-agent/tools) issues per-asset `ExecutionDelegateRecordV1` PDAs so an executive can sign payments on the agent's behalf, and the owner can revoke at any time

{% callout type="note" title="Agent commerce vs. agent finance" %}
**Agent commerce** is about *productive activity* — how an agent discovers counterparties, earns, pays, and transacts. **[Agent finance](/agents/agent-finance)** is about *capitalization and governance* — how an agent is funded and how holders align with its mission. Finance bootstraps the agent; commerce is how it sustains itself.
{% /callout %}

## Metaplex Agent Commerce Primitives

Every layer of agent commerce is shipped as a Metaplex primitive — onchain identity, EIP-8004 metadata, the Asset Signer wallet, executive delegation, and the canonical token binding:

| Primitive | Where It Lives | What It Enables |
|-----------|----------------|-----------------|
| **Onchain identity** | [`AgentIdentityV2`](/smart-contracts/mpl-agent/identity) PDA bound to an MPL Core asset | Counterparties verify the agent's identity onchain, not just by domain or wallet |
| **EIP-8004 metadata** | Off-chain JSON at `agentMetadataUri`, schema in [`agent-metadata.ts`](https://github.com/metaplex-foundation/genesis-app) | Cross-platform service discovery and capability advertisement |
| **PDA wallet (Asset Signer)** | Seed `["mpl-core-execute", asset]` derived by [MPL Core](/smart-contracts/core) | Holds and spends any SPL token; no private key |
| **Executive delegation** | [`ExecutionDelegateRecordV1`](/smart-contracts/mpl-agent/tools) PDA in `mpl-agent-tools` | Off-chain operator signs on the agent's behalf; per-asset; revocable |
| **Token binding** | [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token) on `AgentIdentityV2` | Permanent link between the agent and its [token](/agents/agent-finance) for revenue routing |

Layering payment protocols (x402-style flows) and richer agent-to-agent coordination on top is a runtime integration — the onchain primitives are in place.

## EIP-8004 Out of the Box

Every agent registered through the Metaplex CLI or Launchpad emits an EIP-8004-compliant metadata document. The `type` field defaults to:

```
https://eips.ethereum.org/EIPS/eip-8004#registration-v1
```

The metadata schema includes:

| Field | Purpose |
|-------|---------|
| `name`, `description`, `image` | Human-readable identity |
| `services[]` | Each service has `name`, `endpoint`, `version`, `skills[]`, `domains[]` |
| `x402Support` | Whether the agent accepts HTTP 402 stablecoin payments |
| `active` | Whether the agent is currently operating |
| `registrations[]` | Cross-registry registrations (`agentId` + `agentRegistry` per entry) |
| `supportedTrust[]` | Trust mechanisms the agent declares (CLI offers `"reputation"`, `"crypto-economic"`, `"tee-attestation"`) |

A counterparty (human or agent) discovers all of this by fetching the agent's `agentMetadataUri` — the URI is recorded onchain in the `AgentIdentity` plugin attached to the Core asset.

### Registering with Services and Trust Declarations

The Metaplex CLI exposes services and trust registration directly:

```bash {% title="Register an agent with discoverable services and trust mechanisms" %}
mplx agents register --new \
  --name "My Agent" \
  --description "What my agent does" \
  --services '[{"name":"MCP","endpoint":"https://myagent.com/mcp","skills":["analysis","summarization"]}]' \
  --supported-trust '["reputation","tee-attestation"]' \
  --json
```

After registration, anyone can resolve the agent's metadata from its onchain `agentMetadataUri` and route requests to the advertised endpoint.

## x402: Stablecoin Payments by Flag, Not Stub

[x402](https://www.x402.org) is an emerging protocol that uses HTTP `402 Payment Required` to make stablecoin micropayments a first-class part of API access. A client requests a resource, gets back a `402` with payment instructions, settles onchain, and retries with a payment proof.

Metaplex doesn't ship an x402 server or client — that's a runtime concern. What it ships is everything the protocol needs from the *agent* side:

- **`x402Support: true`** in the metadata so callers can discover x402 capability
- **A PDA wallet that holds USDC/USDT** — the Asset Signer accepts any SPL token
- **An executive that can sign outbound payments** through Core's Execute hook, paying for the API calls and resources the agent needs

In other words, the onchain trust and signing primitives are in place; wiring them to an x402 server framework is an integration task, not an onchain protocol design task.

## Agent-to-Agent Coordination via Services Discovery

The agent-to-agent space (often discussed under the "A2A protocol" banner) is converging on a small set of needs: capability advertisement, service discovery, and payment for delegated work. Metaplex's existing primitives map directly to the first two:

- **Capability advertisement** — `services[].skills` and `services[].domains` declare what the agent does
- **Service discovery** — fetching the `agentMetadataUri` returns endpoint, version, and protocol info; agents can index Metaplex registrations to build a directory
- **Delegated work payment** — the agent's PDA wallet pays the counterparty agent's PDA wallet in any SPL token; both transactions are signed by their respective executives

Cross-registry interoperability is supported through the `registrations[]` field, which lets a Metaplex agent declare a parallel registration in another registry (for example, an EVM-side ERC-8004 registration), keeping a single source of truth across ecosystems.

## How Metaplex Agents Settle Payments

A complete commerce flow uses these primitives end-to-end:

1. **Counterparty discovery** — a client (human or agent) fetches the target agent's `agentMetadataUri` and reads `services[]`, `x402Support`, and `supportedTrust[]`
2. **Service request** — the client hits the advertised endpoint
3. **Payment** — for paid services, the server returns an HTTP 402 (or analogous gating); the client pays the agent's [Asset Signer PDA](/agents/what-is-an-agent) in USDC or another stablecoin
4. **Verification** — the server reads the onchain payment, confirms the sender (and optionally the sender's own agent registration for trust scoring), and unlocks the resource
5. **Outbound payments** — when the agent itself needs to pay counterparties (compute, data, other agents), its [executive](/agents/run-an-agent) signs an outbound transfer wrapped in a Core Execute instruction

Every step uses primitives the Metaplex stack already provides. There's no off-chain custodian or platform-mediated escrow.

## Notes

- This page describes the building blocks Metaplex ships today. Onboarding flows for x402 servers and an indexed agent directory are separate runtime concerns and will get their own guides
- EIP-8004 is the metadata format; [agent finance](/agents/agent-finance) and agent commerce are the layers above it. The same registration document is read by both
- The `agentToken` field on `AgentIdentityV2` is set once via [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token) and is permanent. Revenue routing to the agent's token holders is a finance concern; commerce flows can route SOL or stablecoins to the agent's PDA directly
- An asset owner can revoke the executive at any time. This is the safety valve when delegating autonomous payment authority

## FAQ

Common questions about agent commerce on Metaplex.

### What is agent commerce?
Agent commerce is the productive economic activity of autonomous AI agents — earning revenue, paying for services, and transacting with other agents and humans onchain. It covers how agents act as economic participants, not how they are funded.

### How is agent commerce different from agent finance?
[Agent finance](/agents/agent-finance) covers how an agent is **capitalized and governed** through its token. Agent commerce covers how the agent then **earns, spends, and transacts**. Finance funds the agent; commerce is what the agent does with that funding.

### Are Metaplex agents EIP-8004 compatible?
Yes. The default metadata `type` is `https://eips.ethereum.org/EIPS/eip-8004#registration-v1`. Every Metaplex agent registration emits an EIP-8004-compliant document with `services[]`, `x402Support`, `supportedTrust[]`, and `registrations[]` fields. Anything that consumes EIP-8004 metadata can consume a Metaplex agent.

### Does Metaplex support x402 payments?
Agent metadata has a first-class `x402Support` boolean for capability discovery, the PDA wallet can already receive any SPL token (including USDC), and the executive can sign outbound payments. The protocol layer (an x402 server framework) is a runtime integration that sits on top of these primitives.

### How do agents discover each other on Metaplex?
Every registered agent has a public registration URI containing its EIP-8004 metadata. Counterparty agents resolve this URI from the onchain `AgentIdentity` plugin and read `services[].endpoint`, `skills`, `domains`, and supported protocols to decide where and how to send a request.

### Can a Metaplex agent earn revenue today?
Yes. The agent's PDA wallet (Asset Signer, derived as `["mpl-core-execute", asset]`) accepts any SPL token. There is no private key — the wallet is controlled exclusively through Core's Execute lifecycle hook, signed by the asset's executive via [`mpl-agent-tools`](/smart-contracts/mpl-agent/tools).

### How does an agent pay for services autonomously?
The executive signs outbound transactions through Core's [Execute lifecycle hook](/smart-contracts/core/execute-asset-signing). For payment-gated APIs, the agent's payment client (x402 or otherwise) constructs the transfer, the executive signs it, and the API server verifies the onchain payment before unlocking the resource.

## Glossary

Core terms used in Metaplex agent commerce.

| Term | Definition |
|------|------------|
| **Agent Commerce** | The productive economic activity of autonomous AI agents — earning, paying, and transacting onchain |
| **Agent Finance** | The practice of capitalizing and governing agents through their tokens (covered on the [Agent Finance](/agents/agent-finance) page) |
| **EIP-8004** | The metadata standard Metaplex agents emit by default (`type: "https://eips.ethereum.org/EIPS/eip-8004#registration-v1"`) for cross-platform service discovery |
| **x402** | An emerging protocol using HTTP `402 Payment Required` for stablecoin machine-to-machine payments. Metaplex agents declare support via the `x402Support` metadata flag |
| **Asset Signer (PDA Wallet)** | An MPL Core PDA derived from `["mpl-core-execute", asset]` — the agent's onchain wallet, controlled exclusively through Core's Execute hook |
| **Executive Profile** | An onchain identity for an off-chain operator authorized to sign on the agent's behalf, registered via [`mpl-agent-tools`](/smart-contracts/mpl-agent/tools) |
| **Execution Delegation** | Per-asset authorization (`ExecutionDelegateRecordV1`) for an executive; revocable by the asset owner at any time |
| **services[]** | An array in the EIP-8004 metadata describing endpoints, skills, and domains the agent advertises |
| **supportedTrust[]** | An array in the EIP-8004 metadata declaring trust mechanisms the agent supports. The CLI offers `"reputation"`, `"crypto-economic"`, and `"tee-attestation"` |
