---
title: MPL Agent Registry
metaTitle: MPL Agent Registry — On-Chain Agent Identity for Solana | Metaplex
description: On-chain program for registering agent identity on Solana using MPL Core assets.
created: '02-25-2026'
updated: '02-25-2026'
---

The **MPL Agent Registry** is an on-chain program that registers verifiable identity records for agents represented as MPL Core assets. {% .lead %}

{% callout title="Choose Your Path" %}
- **Quick start?** See [Getting Started](/smart-contracts/mpl-agent/getting-started) for installation and first registration
- **Register an agent?** Follow the [Register an Agent](/agents/register-agent) guide
- **Read agent data?** Follow the [Read Agent Data](/agents/run-agent) guide
{% /callout %}

## What is the Agent Registry?

The Agent Registry binds a verifiable on-chain identity record to an MPL Core asset. It creates a PDA (Program Derived Address) linked to the asset and attaches an `AppData` plugin to the Core asset. This two-way binding is tamper-evident:

- The PDA stores a reference to the asset, making agents discoverable on-chain
- The asset's AppData plugin authority points back to the PDA
- Anyone can verify the binding by deriving the PDA and checking the plugin

## Program

| Program | Address |
|---------|---------|
| **[Agent Identity](/smart-contracts/mpl-agent/identity)** | `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p` |

## How It Works

1. You call the `RegisterIdentityV1` instruction with an MPL Core asset
2. The program creates a PDA derived from seeds `["agent_identity", <asset>]`
3. The program CPIs into MPL Core to attach an `AppData` external plugin to the asset, with the PDA as the data authority
4. The PDA stores the asset's public key for reverse lookups

```
Asset ──── AppData plugin (data_authority: PDA) ────→ PDA
  ↑                                                    │
  └────────────── asset field ─────────────────────────┘
```

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
