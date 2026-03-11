---
title: Solana Agents
metaTitle: Create & Run Agents on Solana | Agent Registry | Metaplex
description: Create, register, and run autonomous agents on Solana. Use the Metaplex Agent skills and agent registry to manage your autonomous agents.
tableOfContents: false
---

Build and run autonomous agents on Solana using MPL Core assets as the foundation for agent identity, wallets, and execution. {% .lead %}

## How Agent Assets Work

Every [MPL Core](/smart-contracts/core) asset has a built-in wallet — a PDA derived from the asset's public key. Because it's a PDA, no private key exists for it, which means the wallet is **unstealable**. Only the asset itself can sign for its own wallet through MPL Core's [Execute](/smart-contracts/core/plugins) lifecycle hook.

This makes Core assets a natural fit for autonomous agents:

- **The asset is the agent's identity** — registered on-chain with an [AgentIdentity](/agents/register-agent) plugin
- **The asset's PDA wallet holds the agent's funds** — SOL, tokens, and other assets controlled exclusively by the agent
- **Executives act on the agent's behalf** — since Solana has no background tasks or on-chain inference, a delegated [executive](/agents/run-an-agent) signs transactions for the agent. The owner doesn't need to approve every action.

The owner retains full control. They choose which executive to delegate to, and they can revoke or switch delegation at any time — all without changing the agent's identity or wallet.

{% product-card-grid category="Agents" /%}
