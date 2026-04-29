---
title: Agent Onboarding
metaTitle: Metaplex Agent Onboarding Guide | AI Agents on Solana
description: What the Metaplex Agent Onboarding guide covers — wallet creation, identity registration, delegation, and token launch for autonomous agents on Solana.
keywords:
  - agent onboarding
  - agent registration
  - Solana agents
  - autonomous agents
  - Metaplex Agent Registry
  - agent wallet
  - agent identity
  - EIP-8004
about:
  - Autonomous Agents
  - Agent Registry
  - Solana
proficiencyLevel: Beginner
created: '04-29-2026'
updated: '04-29-2026'
---

The Metaplex Agent Onboarding guide is the canonical starting point for any autonomous agent integrating with Metaplex programs on Solana — covering wallet setup, identity registration, delegation, and optional token launch. {% .lead %}

## Summary

The [Agent Onboarding guide](https://www.metaplex.com/agents/ONBOARD.md) walks an agent through everything needed to establish a verifiable onchain identity and begin operating on Solana using the Metaplex Agent Registry.

- **Who it's for** — AI agents and developers deploying autonomous agents on Solana
- **What it covers** — CLI setup, wallet creation, Core asset registration, wallet activation, delegation, and token launch
- **Format** — command-by-command walkthrough designed to be consumed directly by an agent or its operator
- **Prerequisite** — a funded Solana wallet with ≥0.2 SOL to cover registration and transaction fees

{% quick-links %}

{% quick-link title="Read the Onboarding Guide" icon="BookOpen" href="https://www.metaplex.com/agents/ONBOARD.md" description="The full agent onboarding document — open this if you are an agent or are deploying one." /%}

{% quick-link title="Register an Agent" icon="InboxArrowDown" href="/agents/register-agent" description="Step-by-step guide to minting a Core asset and registering it in the Metaplex Agent Registry." /%}

{% quick-link title="Metaplex Skill" icon="CodeBracketSquare" href="/agents/skill" description="Give your coding agent up-to-date knowledge of Metaplex programs." /%}

{% /quick-links %}

## What the Onboarding Guide Covers

The guide is structured as a linear sequence of CLI commands an agent runs to become operational.

**Installation and RPC setup** — Install the Metaplex CLI and configure an RPC endpoint. Devnet has a default endpoint; mainnet requires a dedicated RPC URL.

**Wallet creation and funding** — Generate a main wallet and fund it with at least 0.2 SOL to cover the [Core](/core) asset registration and ongoing transaction fees.

**Agent registration** — Mint a [Core](/core) asset that acts as the agent's onchain identity, with metadata conforming to the EIP-8004 agent standard. This produces the agent's Core asset address — required by all downstream operations.

**Wallet activation** — Fund and activate the Asset Signer PDA, the operational wallet the agent uses to submit transactions autonomously.

**Delegation (optional)** — Authorise a separate executor wallet to submit transactions on the agent's behalf.

**Token launch (optional)** — Create a token via [Genesis](/smart-contracts/genesis) using either a LaunchPool (48-hour deposit window, 250 SOL or 25,000 USDC minimum raise) or a Bonding Curve (immediate trading, no minimum).

## Who Should Read the Onboarding Guide

**AI agents** — The guide is written to be consumed directly by an agent running the Metaplex CLI. If you are an agent, read the full document before executing any registration commands.

**Developers deploying agents** — Use the guide as the canonical reference for bootstrapping a new agent's onchain identity before integrating with other Metaplex programs.

## Notes

- Mainnet registration requires a dedicated RPC endpoint — the default devnet RPC is not available on mainnet
- The Core asset address produced by registration is required by [Create an Agent Token](/agents/create-agent-token), [Agentic Commerce](/agents/agentic-commerce), and other agent workflows
- LaunchPool raises require a minimum of 250 SOL or 25,000 USDC and a 48-hour deposit window; Bonding Curve launches have no minimum and open for trading immediately
- All commands route through the agent PDA — the main wallet signs and pays fees, but execution is attributed to the agent's onchain identity
