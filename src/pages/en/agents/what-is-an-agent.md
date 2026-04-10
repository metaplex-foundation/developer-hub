---
title: What Is an Agent?
metaTitle: What Is an Agent on Solana? | Metaplex Agent Registry
description: Autonomous agents on Solana are MPL Core assets with built-in wallets and on-chain identity records. Learn how agent identity, wallets, and execution delegation work.
agentSkill: /agents/what-is-an-agent.md
keywords:
  - Solana agents
  - autonomous agents
  - agent identity
  - MPL Core
  - execution delegation
  - Asset Signer
about:
  - Autonomous Agents
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '03-12-2026'
updated: '03-12-2026'
---

Autonomous agents on Solana are [MPL Core](/smart-contracts/core) assets with built-in wallets and on-chain identity records managed by the [Metaplex Agent Registry](/smart-contracts/mpl-agent). {% .lead %}

## Summary

An agent is an MPL Core asset that has been registered with an on-chain identity and can hold funds in its own PDA-derived wallet. Execution is delegated to an off-chain operator so the agent can act autonomously without requiring the owner to approve every transaction.

- **Identity** — a PDA record and `AgentIdentity` plugin bind a verifiable identity to the Core asset
- **Wallet** — the asset's built-in PDA wallet (Asset Signer) holds SOL, tokens, and other assets with no private key exposure
- **Delegation** — an off-chain executive signs transactions on the agent's behalf through Core's Execute lifecycle hook
- **Owner control** — the owner can revoke or switch delegation at any time without changing the agent's identity or wallet

## How Agent Assets Work

Every [MPL Core](/smart-contracts/core) asset has a built-in wallet — a PDA derived from the asset's public key. No private key exists for it, so the wallet can't be stolen. Only the asset itself can sign for its own wallet through Core's [Execute](/smart-contracts/core/execute-asset-signing) lifecycle hook.

This makes Core assets a natural fit for autonomous agents:

- **The asset is the agent's identity** — registered on-chain with an [AgentIdentity](/agents/register-agent) plugin
- **The asset's PDA wallet holds the agent's funds** — SOL, tokens, and other assets controlled exclusively by the agent
- **Executives act on the agent's behalf** — since Solana has no background tasks or on-chain inference, a delegated [executive](/agents/run-an-agent) signs transactions for the agent. The owner doesn't need to approve every action.

The owner retains full control. They choose which executive to delegate to, and they can revoke or switch delegation at any time — all without changing the agent's identity or wallet.

## Next Steps

- **[Skill](/agents/skill)** — Give AI coding agents full knowledge of Metaplex programs
- **[Register an Agent](/agents/register-agent)** — Bind an identity record to an MPL Core asset
- **[Read Agent Data](/agents/run-agent)** — Verify registration and inspect agent identity on-chain
- **[Run an Agent](/agents/run-an-agent)** — Set up an executive profile and delegate execution

*Maintained by [Metaplex](https://github.com/metaplex-foundation) · Last verified March 2026*
