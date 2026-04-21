---
title: Agent Token
metaTitle: Agent Token | Metaplex CLI
description: Create a token for a registered agent and link it to the agent identity using the Metaplex CLI.
keywords:
  - agent token
  - agents set-agent-token
  - mplx agents set-agent-token
  - genesis launch agent
  - agent bonding curve
  - Metaplex CLI
about:
  - Agent token creation
  - Agent token linking
  - Genesis integration
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '04-09-2026'
updated: '04-09-2026'
howToSteps:
  - Create a token launch linked to the agent using genesis launch create with --agentAsset and --agentSetToken to permanently link the token
  - Or create a launch without --agentSetToken, then link it manually with agents set-agent-token
howToTools:
  - Metaplex CLI (mplx)
faqs:
  - q: Can I change the agent token after setting it?
    a: No. Each agent identity can only ever have one token, and it can only be set once. This action is irreversible.
  - q: What is the difference between --agentSetToken and set-agent-token?
    a: They do the same thing. --agentSetToken links the token during launch creation in one step. set-agent-token links it separately after launch, requiring asset-signer mode.
  - q: Why do I need asset-signer mode for set-agent-token?
    a: The set-agent-token instruction requires the Asset Signer PDA as authority. Asset-signer mode configures the CLI to derive and use this PDA automatically.
---

{% callout title="What You'll Do" %}
Create a token for a registered agent and link it to the agent identity:
- **One-step**: Create a bonding curve launch linked to the agent with `--agentAsset` and `--agentSetToken`
- **Two-step**: Create a token launch separately, then link it with `agents set-agent-token`
{% /callout %}

## Summary

An agent token is a [Genesis](/smart-contracts/genesis) token permanently linked to a registered [agent identity](/agents). There are two ways to create and link an agent token — a one-step flow during launch creation, or a two-step manual flow.

- **One-step** (recommended): `genesis launch create --agentAsset <ASSET> --agentSetToken`
- **Two-step**: Create a launch, then link with `agents set-agent-token`
- **Irreversible**: Each agent identity can only ever have one token, and it can only be set once

## Quick Start

**Jump to:** [One-Step: Launch with Agent](#one-step-launch-with-agent) · [Two-Step: Manual Linking](#two-step-manual-linking) · [Common Errors](#common-errors) · [FAQ](#faq)

## One-Step: Launch with Agent

The simplest way to create an agent token is to pass `--agentAsset` when creating the launch. This auto-derives the creator fee wallet from the agent's [Asset Signer PDA](/dev-tools/cli/config/asset-signer-wallets) and optionally links the token in the same transaction.

```bash {% title="Create bonding curve with agent token" %}
mplx genesis launch create --launchType bonding-curve \
  --name "Agent Token" \
  --symbol "AGT" \
  --image "https://gateway.irys.xyz/abc123" \
  --agentAsset <AGENT_ASSET> \
  --agentSetToken
```

{% callout type="warning" title="--agentSetToken is irreversible" %}
`--agentSetToken` permanently links the launched token to the agent. Omit it to launch without linking, then link later with `agents set-agent-token`.
{% /callout %}

This also works with launchpool launches:

```bash {% title="Launchpool with agent" %}
mplx genesis launch create \
  --name "Agent Token" \
  --symbol "AGT" \
  --image "https://gateway.irys.xyz/abc123" \
  --agentAsset <AGENT_ASSET> \
  --agentSetToken \
  --tokenAllocation 500000000 \
  --depositStartTime 2025-03-01T00:00:00Z \
  --raiseGoal 250 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS>
```

See [Launch (API) — Agent Launches](/dev-tools/cli/genesis/launch#agent-launches) for full details.

## Two-Step: Manual Linking

If you created a token launch without `--agentSetToken`, you can link it afterward using `agents set-agent-token`. This requires [asset-signer wallet mode](/dev-tools/cli/config/asset-signer-wallets).

### Step 1: Configure Asset-Signer Wallet

```bash {% title="Set up agent wallet" %}
mplx config wallets add my-agent --agent <AGENT_ASSET>
mplx config wallets set my-agent
```

### Step 2: Link the Token

```bash {% title="Link Genesis token to agent" %}
mplx agents set-agent-token <AGENT_ASSET> <GENESIS_ACCOUNT>
```

{% callout type="warning" title="Irreversible" %}
Each agent identity can only ever have one token, and it can only be set once. Double-check both addresses before running this command.
{% /callout %}

### Output

```text {% title="Expected output" %}
--------------------------------
  Agent Asset: <agent_asset_address>
  Genesis Account: <genesis_account_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
--------------------------------
```

## End-to-End Example

```bash {% title="Register agent and launch token" %}
# 1. Register a new agent
mplx agents register --name "My Agent" \
  --description "An autonomous trading agent" \
  --image "./avatar.png"
# Note the asset address from the output

# 2. Launch a bonding curve token linked to the agent
mplx genesis launch create --launchType bonding-curve \
  --name "Agent Token" --symbol "AGT" \
  --image "https://gateway.irys.xyz/abc123" \
  --agentAsset <AGENT_ASSET> --agentSetToken

# 3. Verify the agent has a token linked
mplx agents fetch <AGENT_ASSET>
```

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Agent token already set | Trying to set the token a second time | Each agent identity can only ever have one token — this is irreversible |
| Agent is not owned by the connected wallet | API hasn't indexed a freshly registered agent | Wait ~30 seconds and retry, or check `agents fetch` — the launch may have succeeded |
| Not in asset-signer mode | Running `set-agent-token` without configuring the wallet | Set up the asset-signer wallet first (see [prerequisites](#step-1-configure-asset-signer-wallet)) |

## Notes

- The one-step flow (`--agentAsset --agentSetToken`) is recommended — it handles everything in a single transaction
- The two-step flow requires asset-signer mode because the `set-agent-token` instruction uses the Asset Signer PDA as authority
- The Genesis account must already exist before running `set-agent-token`
- When using `--agentAsset`, the creator fee wallet is auto-derived from the agent's Asset Signer PDA

## FAQ

**Can I change the agent token after setting it?**
No. Each agent identity can only ever have one token, and it can only be set once. This action is irreversible.

**What is the difference between `--agentSetToken` and `set-agent-token`?**
They do the same thing. `--agentSetToken` links the token during launch creation in one step. `set-agent-token` links it separately after launch, requiring asset-signer mode.

**Why do I need asset-signer mode for `set-agent-token`?**
The `set-agent-token` instruction requires the Asset Signer PDA as authority. Asset-signer mode configures the CLI to derive and use this PDA automatically.
