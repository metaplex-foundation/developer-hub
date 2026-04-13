---
title: Agentic Commerce - Raise Funds for Your AI Agent
metaTitle: Agentic Commerce - Raise Funds for Your AI Agent on Solana | Metaplex
description: Launch an agent token through a bonding curve on Metaplex to fund your AI agent. Compare agent fundraising methods and learn why on-chain agent tokens outperform off-chain alternatives.
keywords:
  - agentic commerce
  - agent token
  - AI agent funding
  - raise funds for agent
  - agent bonding curve
  - agent token launch
  - make money with agents
  - AI agent token
  - Solana agent token
  - agent fundraising
  - autonomous agent economy
about:
  - Agentic Commerce
  - Agent Tokens
  - Genesis bonding curve
  - Solana
proficiencyLevel: Beginner
created: '04-13-2026'
updated: '04-13-2026'
faqs:
  - q: What is agentic commerce?
    a: Agentic commerce is the economy around autonomous AI agents that hold their own wallets, launch tokens, and transact on-chain. On Metaplex, agents raise funds by launching tokens through Genesis bonding curves.
  - q: How does an agent raise funds on Metaplex?
    a: An agent registers on-chain with the Metaplex Agent Registry, which creates a PDA wallet. The agent then launches a token through a Genesis bonding curve. As buyers purchase the token, SOL flows into the curve and the agent's creator fee wallet.
  - q: Why use a bonding curve instead of a presale or fair launch?
    a: Bonding curves start trading immediately with no deposit window, provide continuous price discovery, and auto-graduate to a Raydium liquidity pool when fully filled. This gives agent tokens instant liquidity and a clear path to open-market trading.
  - q: What happens to the funds raised?
    a: Creator fees accrue in the bonding curve bucket during trading and are claimable by the creator wallet. After graduation to Raydium, the agent token trades on the open market with full liquidity.
  - q: Can any AI agent launch a token on Metaplex?
    a: Yes. Any agent registered on the Metaplex Agent Registry can launch a token. The agent needs an MPL Core asset with a registered identity and an executive profile for autonomous operation.
---

Agentic commerce is the emerging economy where AI agents raise funds, hold assets, and transact autonomously on-chain. On Metaplex, agents launch tokens through [Genesis bonding curves](/smart-contracts/genesis) to fund their operations — no manual token management, no centralized intermediaries. {% .lead %}

## Summary

Agentic commerce lets AI agents raise funds by launching their own tokens on Solana. Metaplex provides the full stack: agent identity, a PDA wallet with no private key exposure, and token launches via Genesis bonding curves that start trading immediately.

- **Agent identity**: register your agent on-chain with the [Metaplex Agent Registry](/smart-contracts/mpl-agent), creating a verifiable identity and built-in wallet
- **Token launch**: launch a token from the agent's wallet using a [Genesis bonding curve](/dev-tools/cli/genesis/bonding-curve) with instant trading and automatic price discovery
- **Creator fees**: earn fees on every swap during the bonding curve phase, directed to a creator wallet
- **Graduation to open market**: when the curve fills, liquidity auto-migrates to a [Raydium](https://raydium.io) CPMM pool for continued trading

## Why Launch an Agent Token?

An agent token turns your AI agent into an investable, autonomous economic actor. Holders back the agent's mission, whether that is trading, content creation, data analysis, or any on-chain service, and the token's value reflects the agent's performance and adoption.

**For agent builders:**
- Raise funds without giving up ownership of the agent itself
- Earn ongoing creator fees from bonding curve trading
- Build a community of token holders aligned with the agent's success
- Give the agent a treasury it controls autonomously through its PDA wallet

**For token holders:**
- Back specific AI agents you believe will perform
- Trade in and out via the bonding curve with instant liquidity
- Participate in an agent's economy from launch

## Agent Token Lifecycle on Metaplex

The Metaplex stack handles the full lifecycle from agent creation to token trading:

1. **Create an agent**: a single call to [`mintAndSubmitAgent`](/agents/mint-agent) creates the MPL Core asset and registers the agent identity in one transaction, giving the agent a verifiable on-chain identity and a PDA wallet
2. **Set up execution**: [register an executive profile](/agents/run-an-agent) and delegate execution so the agent can sign transactions autonomously
3. **Launch a token**: use [Genesis](/smart-contracts/genesis) to create a bonding curve from the agent's wallet ([guide](/agents/create-agent-token)) — trading starts immediately
4. **Graduation**: when the bonding curve fills 100%, liquidity auto-migrates to a Raydium CPMM pool and the token trades on the open market

{% callout type="note" title="One token per agent" %}
An agent token is permanently linked to the agent via the [`set-agent-token`](/dev-tools/cli/agents/set-agent-token) command. This is irreversible!
{% /callout %}

## Comparing Agent Fundraising Methods

Not all token launch methods are equal for AI agents. The table below compares Metaplex agent tokens with common alternatives.

| Feature | Metaplex Agent Token | Generic Launchpad | Manual Token + DEX Listing | Off-Chain Fundraising |
|---------|---------------------|-------------------|---------------------------|----------------------|
| **On-chain agent identity** | Verifiable via Agent Registry | No agent identity | No agent identity | No on-chain record |
| **Agent-owned wallet** | PDA wallet, no private key | Wallet controlled by human | Wallet controlled by human | No wallet |
| **Instant trading** | Bonding curve starts immediately | Depends on platform | Requires manual LP setup | N/A |
| **Price discovery** | Automatic via constant-product curve | Varies | Manual pricing | N/A |
| **Liquidity graduation** | Auto-migrates to Raydium CPMM | Platform-dependent | Must manage LP manually | N/A |
| **Creator fees** | Built-in, configurable per launch | Platform takes cut | No built-in mechanism | Platform fees |
| **Token-agent link** | Permanent on-chain binding | No binding | No binding | No binding |
| **Autonomous operation** | Executive delegation via Core | Not supported | Not supported | Not supported |
| **Open-source contracts** | Fully auditable on-chain | Often closed-source | Varies | N/A |

### Why Metaplex Stands Out

**Verifiable agent identity.** The [Agent Registry](/smart-contracts/mpl-agent) binds a cryptographic identity to your agent's MPL Core asset. Anyone can verify on-chain that a token was launched by a specific registered agent — not an anonymous wallet. This is critical for trust in agentic commerce where the agent operates autonomously.

**No private key exposure.** The agent's wallet is a PDA derived from its Core asset. There is no private key to leak, lose, or steal. The wallet is controlled exclusively through Core's [Execute lifecycle hook](/smart-contracts/core/execute-asset-signing), and the owner can revoke delegation at any time.

**Instant liquidity with graduation.** Genesis bonding curves provide immediate trading from the moment of launch. There is no deposit window or waiting period. When the curve fills 100%, it auto-graduates to a Raydium CPMM pool — no manual liquidity provisioning required.

**Permanent token-agent binding.** The [`set-agent-token`](/dev-tools/cli/agents/set-agent-token) instruction creates an irreversible on-chain link between the agent and its token. This prevents rug-pull scenarios where a token gets quietly swapped out.

**Full-stack integration.** Metaplex provides every layer: identity ([Agent Registry](/smart-contracts/mpl-agent)), asset management ([Core](/smart-contracts/core)), token launch ([Genesis](/smart-contracts/genesis)), execution delegation ([Agent Tools](/smart-contracts/mpl-agent/tools)), and developer tooling ([CLI](/dev-tools/cli/agents), [Skill](/agents/skill)). No need to stitch together third-party services.

## Launch an Agent Token

### Launch an Agent Token on metaplex.com

[metaplex.com](https://www.metaplex.com) provides a no-code interface to launch agent tokens with bonding curves. Connect your wallet, register your agent, configure your token, and launch — no coding required.

### Launch an Agent Token with the CLI

The [Metaplex CLI](/dev-tools/cli) launches an agent token in a single command:

```bash {% title="Launch an agent token via bonding curve" %}
mplx genesis launch create --launchType bonding-curve \
  --name "My Agent Token" \
  --symbol "MAT" \
  --image "https://gateway.irys.xyz/your-image-hash" \
  --agentMint <AGENT_CORE_ASSET_ADDRESS> \
  --agentSetToken
```

This creates a bonding curve, mints the token supply, and permanently links it to your agent all in one command.

See the full [bonding curve CLI guide](/dev-tools/cli/genesis/bonding-curve) for swap commands, status checks, and lifecycle management.

### Launch an Agent Token with the SDK

For programmatic launches, use the [Genesis JavaScript SDK](/smart-contracts/genesis/sdk/javascript) to integrate agent token launches into your own application or agent framework.

## Agent Token Economics

Agent token economics combine creator-fee accrual during bonding curve trading with automatic liquidity migration after graduation.

### Creator Fees

Every bonding curve launch supports configurable creator fees. A percentage of each swap is directed to a creator wallet during the bonding curve phase:

- Fees accrue in the bonding curve bucket
- The creator wallet claims accumulated fees
- Fee percentage is set at launch and visible on-chain

### Graduation

When all tokens on the bonding curve are purchased, the curve auto-graduates:

1. Liquidity migrates to a Raydium CPMM pool
2. Trading continues on the open market
3. The token is fully tradeable on any Solana DEX aggregator

### Agent Treasury

The agent's PDA wallet can hold SOL, tokens, and other assets. Through execution delegation, the agent can autonomously use its treasury: paying for compute, acquiring resources, or interacting with other protocols.

## Build with the Metaplex Agent Stack

The Metaplex Agent Stack combines identity, execution, launch, and tooling components for autonomous agent token operations.

| Tool | Purpose | Link |
|------|---------|------|
| **Agent Registry** | On-chain identity and wallet | [Docs](/smart-contracts/mpl-agent) |
| **Genesis** | Token launches via bonding curves | [Docs](/smart-contracts/genesis) |
| **Core** | Asset management and execution | [Docs](/smart-contracts/core) |
| **CLI** | Command-line agent and token management | [Agents CLI](/dev-tools/cli/agents) · [Genesis CLI](/dev-tools/cli/genesis) |
| **Skill** | AI coding agent knowledge base | [Docs](/agents/skill) |
| **Metaplex Launchpad** | No-code token launch interface | [metaplex.com](https://www.metaplex.com) |

## Notes

- Agent tokens use the [Genesis](/smart-contracts/genesis) bonding curve mechanism — the same infrastructure used for all token launches on Metaplex
- The `set-agent-token` binding is irreversible. Once set, the agent is permanently associated with that token
- Bonding curves use a constant-product formula; price rises as tokens are bought and falls as they are sold
- After graduation, Metaplex has no control over the token — it trades freely on Raydium and DEX aggregators
- Creator fees are configured at launch time and cannot be changed after the bonding curve is created
- The agent's PDA wallet has no private key — it can only be controlled through Core's Execute lifecycle hook

## FAQ

### What is agentic commerce?
Agentic commerce is the economy around autonomous AI agents that hold their own wallets, launch tokens, and transact on-chain. On Metaplex, agents raise funds by launching tokens through Genesis bonding curves.

### How does an agent raise funds on Metaplex?
An agent [registers on-chain](/agents/register-agent) with the Metaplex Agent Registry, which creates a PDA wallet. The agent then launches a token through a [Genesis bonding curve](/dev-tools/cli/genesis/bonding-curve). As buyers purchase the token, SOL flows into the curve and the agent's creator fee wallet.

### Why use a bonding curve instead of a presale or fair launch?
Bonding curves start trading immediately with no deposit window, provide continuous price discovery, and auto-graduate to a Raydium liquidity pool when fully filled. This gives agent tokens instant liquidity and a clear path to open-market trading.

### What happens to the funds raised?
Creator fees accrue in the bonding curve bucket during trading and are claimable by the creator wallet. After graduation to Raydium, the agent token trades on the open market with full liquidity.

### Can any AI agent launch a token on Metaplex?
Yes. Any agent registered on the Metaplex Agent Registry can launch a token. The agent needs an [MPL Core asset](/smart-contracts/core) with a [registered identity](/agents/register-agent) and an [executive profile](/agents/run-an-agent) for autonomous operation.

### How is this different from launching on pump.fun or other launchpads?
Metaplex agent tokens are bound to a verifiable on-chain identity through the Agent Registry. The agent's wallet is a PDA with no private key, and the token-agent link is permanent and auditable. Generic launchpads have no concept of agent identity, agent-owned wallets, or execution delegation.

## Glossary

Core terms used in the Metaplex agentic commerce workflow.

| Term | Definition |
|------|------------|
| **Agentic Commerce** | The economy of autonomous AI agents that raise funds, hold assets, and transact on-chain |
| **Agent Token** | A token launched from an agent's PDA wallet via Genesis bonding curve, permanently linked to the agent |
| **Agent Registry** | Metaplex on-chain programs for registering agent identity and delegating execution |
| **PDA Wallet (Asset Signer)** | A program-derived address that serves as the agent's wallet — no private key exists |
| **Bonding Curve** | A constant-product AMM that prices tokens based on supply; auto-graduates to Raydium when fully filled |
| **Graduation** | When all tokens on the curve are sold, liquidity auto-migrates to a Raydium CPMM pool |
| **Executive Profile** | An on-chain identity for an off-chain operator authorized to sign transactions on the agent's behalf |
| **Execution Delegation** | Per-asset authorization for an executive to act on the agent's behalf via Core's Execute hook |
| **Creator Fee** | A configurable percentage of each bonding curve swap directed to the creator wallet |
