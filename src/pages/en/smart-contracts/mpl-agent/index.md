---
title: MPL Agent Registry
metaTitle: MPL Agent Registry — On-Chain Agent Identity for Solana | Metaplex
description: On-chain programs for registering agent identity and delegating execution on Solana using MPL Core assets.
keywords:
  - MPL Agent Registry
  - agent identity
  - execution delegation
  - MPL Core
  - Solana smart contracts
about:
  - Smart Contracts
  - Solana
  - Metaplex
proficiencyLevel: Intermediate
created: '02-25-2026'
updated: '03-11-2026'
---

The **MPL Agent Registry** provides on-chain programs for registering agent identity and delegating execution permissions on Solana using MPL Core assets. {% .lead %}

{% callout title="Choose Your Path" %}
- **Quick start?** See [Getting Started](/smart-contracts/mpl-agent/getting-started) for installation and first registration
- **Register an agent?** Follow the [Register an Agent](/agents/register-agent) guide
- **Read agent data?** Follow the [Read Agent Data](/agents/run-agent) guide
{% /callout %}

## What is the Agent Registry?

The Agent Registry binds a verifiable on-chain identity record to an MPL Core asset. Registration creates a PDA (Program Derived Address) that makes the agent discoverable on-chain, and attaches an `AgentIdentity` plugin to the Core asset with lifecycle hooks for Transfer, Update, and Execute events.

Once an agent has an identity, the **Agent Tools** program lets asset owners delegate execution permissions to executive profiles — allowing designated authorities to execute actions on behalf of agent assets.

## Programs

| Program | Address | Purpose |
|---------|---------|---------|
| **[Agent Identity](/smart-contracts/mpl-agent/identity)** | `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p` | Registers identity and attaches lifecycle hooks to a Core asset |
| **[Agent Tools](/smart-contracts/mpl-agent/tools)** | `TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S` | Executive profiles and execution delegation |

## How It Works

### Identity Registration

1. You call `RegisterIdentityV1` with an MPL Core asset and an `agentRegistrationUri`
2. The program creates a PDA derived from seeds `["agent_identity", <asset>]`
3. The program CPIs into MPL Core to attach an `AgentIdentity` plugin with the URI and lifecycle checks for Transfer, Update, and Execute
4. The PDA stores the asset's public key for reverse lookups

### Execution Delegation

1. An executive registers a profile via `RegisterExecutiveV1`
2. The asset owner calls `DelegateExecutionV1` to grant the executive permission to execute on behalf of the agent asset
3. A delegation record PDA is created linking the executive profile to the asset

## SDK

| Language | Package |
|----------|---------|
| JavaScript/TypeScript | `@metaplex-foundation/mpl-agent-registry` |

```shell
npm install @metaplex-foundation/mpl-agent-registry
```

## Next Steps

1. **[Getting Started](/smart-contracts/mpl-agent/getting-started)** — Installation, setup, and first registration
2. **[Agent Identity](/smart-contracts/mpl-agent/identity)** — Identity program details, accounts, and PDA derivation
3. **[Agent Tools](/smart-contracts/mpl-agent/tools)** — Executive profiles and execution delegation
