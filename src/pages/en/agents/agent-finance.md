---
title: Agent Finance - Capitalize and Govern Your AI Agent
metaTitle: Agent Finance - Capitalize and Govern AI Agents on Solana | Metaplex
description: Capitalize and govern an AI agent through its own onchain token. Launch an agent token through a Genesis bonding curve, bind it permanently to the agent via setAgentTokenV1, and route revenue to the Asset Signer PDA — all on Metaplex.
keywords:
  - agent finance
  - agent token
  - AI agent capitalization
  - AI agent governance
  - raise funds for agent
  - agent bonding curve
  - agent token launch
  - AI agent token
  - Solana agent token
  - agent fundraising
  - autonomous agent economy
  - setAgentTokenV1
  - AgentIdentityV2
about:
  - Agent Finance
  - Agent Tokens
  - Genesis bonding curve
  - Solana
proficiencyLevel: Beginner
created: '04-13-2026'
updated: '05-06-2026'
faqs:
  - q: What is agent finance?
    a: Agent finance is the practice of capitalizing and governing autonomous AI agents through their own onchain tokens. On Metaplex, agents raise funds by launching a token through a Genesis bonding curve and bind it permanently to the agent via setAgentTokenV1, so revenue and creator fees route through onchain primitives rather than off-chain agreements.
  - q: How does agent finance differ from agent commerce?
    a: Agent finance covers how an agent is funded and governed through its token — capitalization, treasury, and holder alignment. Agent commerce covers how an agent earns revenue and generates economic activity. The two share the same agent identity, PDA wallet, and EIP-8004 metadata.
  - q: How is the agent's wallet derived?
    a: The agent's operational wallet is the Asset Signer — an MPL Core PDA derived from seeds ["mpl-core-execute", asset]. There is no private key. The wallet can hold SOL, SPL tokens, and other assets, and is controlled exclusively through Core's Execute lifecycle hook.
  - q: How is the agent token bound to the agent?
    a: The setAgentTokenV1 instruction writes the token mint into the agentToken field on the AgentIdentityV2 PDA. The binding is permanent — once set, the agent is irreversibly linked to that token mint. The same field is exposed in the agent's EIP-8004 metadata so counterparties can resolve the canonical token from the agent's registration.
  - q: Why use a bonding curve instead of a presale or fair launch?
    a: Bonding curves start trading immediately with no deposit window, provide continuous price discovery via a constant-product curve, and auto-graduate to a Raydium CPMM pool when fully filled. This gives agent tokens instant liquidity and a clear path to open-market trading.
  - q: What happens to the funds raised?
    a: Creator fees accrue in the bonding curve bucket during trading and are claimable by the creator wallet. After graduation to Raydium, the creator continues earning post-graduation creator fees from the CPMM pool. When the agent is set as creator, fees route directly to the agent's PDA wallet.
---

Agent finance on Metaplex is how autonomous AI agents are capitalized and governed through their own onchain tokens. Agents register a verifiable identity, launch a token through a [Genesis bonding curve](/smart-contracts/genesis), and bind that token permanently to themselves via the `setAgentTokenV1` instruction — giving the agent a treasury, aligning a holder community with its mission, and creating a transparent record of who has skin in the game. {% .lead %}

## Summary

Agent finance covers how an AI agent is capitalized and governed. The Metaplex stack ships every primitive end-to-end: agent identity, an Asset Signer PDA derived from the Core asset, a Genesis bonding curve from the agent's wallet, and a permanent token-agent binding through `setAgentTokenV1`.

- **Agent identity**: register on-chain through [`mpl-agent-identity`](/smart-contracts/mpl-agent/identity), creating an [`AgentIdentityV2`](/smart-contracts/mpl-agent/identity) PDA bound to the Core asset and an EIP-8004 metadata document
- **Asset Signer PDA**: the agent's wallet is derived from seeds `["mpl-core-execute", asset]` by [MPL Core](/smart-contracts/core) — no private key, controlled exclusively through Core's Execute lifecycle hook
- **Token launch**: call [`createAndRegisterLaunch`](/smart-contracts/genesis) with the `agent` parameter to spin up a [Genesis bonding curve](/dev-tools/cli/genesis/bonding-curve) from the agent's wallet, with creator fees routed to the agent
- **Permanent binding**: [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token) writes the token mint into the `agentToken: Option<Pubkey>` field on `AgentIdentityV2` — irreversible, public, and part of the agent's EIP-8004 metadata
- **Graduation to open market**: when the curve fills, liquidity auto-migrates to a [Raydium](https://raydium.io) CPMM pool for continued trading

{% callout type="note" title="Agent finance vs. agent commerce" %}
**Agent finance** is about how an agent is *capitalized and governed* — fundraising, treasury, and holder alignment through the agent's token. **[Agent commerce](/agents/agent-commerce)** is about how an agent generates *economic activity* — paying for services, transacting with other agents, and earning revenue from productive work. This page covers agent finance.
{% /callout %}

## Metaplex Agent Finance Primitives

Every layer of the agent finance flow is shipped as a Metaplex primitive — onchain identity, the Asset Signer wallet, the launch program, and the irreversible token-agent binding:

| Primitive | Where It Lives | What It Enables |
|-----------|----------------|-----------------|
| **Onchain identity** | [`AgentIdentityV2`](/smart-contracts/mpl-agent/identity) PDA at seeds `["agent_identity", asset]` | Verifiable binding between a launched token and a specific registered agent |
| **EIP-8004 metadata** | Off-chain JSON at `agentMetadataUri`, recorded onchain in the `AgentIdentity` plugin | Token holders and counterparties resolve the agent's identity, services, and bound token from a single document |
| **Asset Signer (PDA wallet)** | Seed `["mpl-core-execute", asset]` derived by [MPL Core](/smart-contracts/core) | Holds SOL, the agent's token, creator-fee revenue, and any SPL token; no private key |
| **Token binding** | [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token) on `AgentIdentityV2` | Permanent onchain link — `agentToken` field can never be reassigned |
| **Token launch** | [Genesis](/smart-contracts/genesis) `createAndRegisterLaunch` with `agent: { mint, setToken }` | One transaction creates the bonding curve, mints supply, and (optionally) binds the token to the agent |
| **Executive delegation** | [`mpl-agent-tools`](/smart-contracts/mpl-agent/tools) `ExecutionDelegateRecordV1` | Off-chain operator signs creator-fee claims and treasury operations on the agent's behalf; revocable per-asset |
| **Graduation** | Automatic Raydium CPMM migration when the bonding curve fills | Open-market trading and continued creator-fee accrual without manual liquidity provisioning |

## Why Launch an Agent Token?

An agent token turns your AI agent into an investable, autonomous economic actor. Holders back the agent's mission — whether that is trading, content creation, data analysis, or any onchain service — and the token's value reflects the agent's performance and adoption.

**For agent builders:**
- Raise funds without giving up ownership of the agent itself
- Earn creator fees from both bonding curve trading and post-graduation Raydium trading
- Build a community of token holders aligned with the agent's success
- Give the agent a treasury (the Asset Signer PDA) it controls autonomously

**For token holders:**
- Back specific AI agents you believe will perform
- Trade in and out via the bonding curve with instant liquidity
- Resolve the canonical token mint from the agent's [EIP-8004 registration](/agents/agent-commerce) — no off-chain trust required

## Agent Token Lifecycle on Metaplex

The Metaplex stack handles the full lifecycle from agent creation to token trading:

1. **Create an agent**: a single call to [`mintAndSubmitAgent`](/agents/mint-agent) creates the MPL Core asset and registers `AgentIdentityV2` in one transaction, attaching the EIP-8004 metadata URI as a Core plugin
2. **Set up execution**: [register an executive profile](/agents/run-an-agent) via `mpl-agent-tools` and create an `ExecutionDelegateRecordV1` so the agent can sign autonomously
3. **Launch a token**: call [`createAndRegisterLaunch`](/smart-contracts/genesis) on Genesis with the `agent` parameter — `agent: { mint: agentAssetAddress, setToken: true }` creates a bonding curve from the agent's PDA wallet and emits the `setAgentTokenV1` instruction in the same transaction
4. **Graduation**: when the bonding curve fills 100%, liquidity migrates to a Raydium CPMM pool and the token trades on the open market with continued creator-fee accrual

{% callout type="note" title="One token per agent" %}
The `agentToken` field on `AgentIdentityV2` can only be set once — [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token) is irreversible. The same field is read into the agent's EIP-8004 metadata, so counterparties always see the canonical token mint.
{% /callout %}

## Comparing Agent Fundraising Methods

Not all token launch methods are equal for AI agents. The table below compares Metaplex agent tokens with common alternatives.

| Feature | Metaplex Agent Token | Generic Launchpad | Manual Token + DEX Listing | Off-Chain Fundraising |
|---------|---------------------|-------------------|---------------------------|----------------------|
| **Onchain agent identity** | `AgentIdentityV2` PDA + EIP-8004 metadata | None | None | None |
| **Agent-owned wallet** | Asset Signer PDA, no private key | Wallet controlled by human | Wallet controlled by human | No wallet |
| **Token-agent binding** | `setAgentTokenV1`, irreversible | None | None | None |
| **Instant trading** | Bonding curve starts immediately | Depends on platform | Requires manual LP setup | N/A |
| **Price discovery** | Constant-product curve | Varies | Manual pricing | N/A |
| **Liquidity graduation** | Auto-migrates to Raydium CPMM | Platform-dependent | Manual LP management | N/A |
| **Creator fees** | Built-in, configurable, route to agent PDA | Fixed, platform-determined | No built-in mechanism | Platform-determined |
| **Autonomous operation** | `ExecutionDelegateRecordV1` via `mpl-agent-tools` | Not supported | Not supported | Not supported |

### Why Metaplex Stands Out

**Verifiable agent identity.** [`mpl-agent-identity`](/smart-contracts/mpl-agent/identity) binds the `AgentIdentityV2` PDA to a specific MPL Core asset and attaches an `AgentIdentity` external plugin to the asset. Anyone can verify on-chain that a token was launched by a specific registered agent — and resolve the canonical token mint from the agent's `agentToken` field.

**No private key exposure.** The Asset Signer PDA is derived from `["mpl-core-execute", asset]`. There is no private key to leak, lose, or steal. The wallet is controlled exclusively through Core's [Execute lifecycle hook](/smart-contracts/core/execute-asset-signing), and the asset owner can revoke executive delegation at any time.

**Permanent token-agent binding.** `setAgentTokenV1` writes into a one-shot field on `AgentIdentityV2` — once set, the binding cannot be changed. This eliminates rug-pull scenarios where the canonical token gets quietly swapped, and it lets EIP-8004 consumers resolve the bound token from a single source of truth.

**Instant liquidity with graduation.** Genesis bonding curves provide immediate trading from the moment of launch — no deposit window, no waiting period. When the curve fills 100%, it auto-graduates to a Raydium CPMM pool with no manual liquidity provisioning required.

**Full-stack integration.** Metaplex provides every layer: identity ([`mpl-agent-identity`](/smart-contracts/mpl-agent)), asset management ([Core](/smart-contracts/core)), token launch ([Genesis](/smart-contracts/genesis)), execution delegation ([`mpl-agent-tools`](/smart-contracts/mpl-agent/tools)), and developer tooling ([CLI](/dev-tools/cli/agents), [Skill](/agents/skill)). No third-party services to stitch together.

## Launch an Agent Token

Agent token launches on Metaplex are available through no-code, CLI, and SDK workflows.

### Launch an Agent Token on metaplex.com

[metaplex.com](https://www.metaplex.com) provides a no-code interface to launch agent tokens with bonding curves. Connect your wallet, register your agent, configure your token, and launch — no coding required.

### Launch an Agent Token with the CLI

The [Metaplex CLI](/dev-tools/cli) launches an agent token in a single command. The `--agentAsset` flag wraps the launch in a Core Execute instruction so the agent's PDA is the creator; `--agentSetToken` emits `setAgentTokenV1` in the same transaction.

```bash {% title="Launch an agent token via bonding curve" %}
mplx genesis launch create --launchType bonding-curve \
  --name "My Agent Token" \
  --symbol "MAT" \
  --image "https://gateway.irys.xyz/your-image-hash" \
  --agentAsset <AGENT_CORE_ASSET_ADDRESS> \
  --agentSetToken
```

This creates the bonding curve, mints the token supply from the agent's PDA, and permanently links it to the agent via `setAgentTokenV1` — all in one transaction.

See the full [bonding curve CLI guide](/dev-tools/cli/genesis/bonding-curve) for swap commands, status checks, and lifecycle management.

### Launch an Agent Token with the SDK

For programmatic launches, use the [Genesis JavaScript SDK](/smart-contracts/genesis/sdk/javascript) and pass the `agent` parameter to `createAndRegisterLaunch`:

```ts
await createAndRegisterLaunch(umi, {
  // ...launch params
  agent: {
    mint: agentAssetAddress,
    setToken: true,
  },
}).sendAndConfirm(umi);
```

Setting `setToken: true` triggers a `setAgentTokenV1` instruction in the same transaction so the launch and the binding are atomic.

## Agent Token Economics

Agent token economics combine creator-fee accrual during bonding curve trading with automatic liquidity migration after graduation.

### Creator Fees

Every bonding curve launch supports configurable creator fees. A percentage of each swap is directed to a creator wallet during the bonding curve phase. When the agent is set as creator, fees flow into the Asset Signer PDA:

- Fees accrue in the bonding curve bucket and are claimable by the creator
- Fee percentage is set at launch and visible on-chain
- Creator fees continue accruing from post-graduation Raydium trading
- Because the creator wallet can be any address, agents can route fees to their own PDA, a multisig, or a separate treasury

### Graduation

When all tokens on the bonding curve are purchased, the curve auto-graduates:

1. Liquidity migrates to a Raydium CPMM pool
2. Trading continues on the open market
3. The token is fully tradeable on any Solana DEX aggregator
4. The creator wallet continues to earn creator fees from post-graduation trading

### Agent Treasury

The Asset Signer PDA can hold SOL, the agent's own token, stablecoins, NFTs, and any other SPL token. Through `ExecutionDelegateRecordV1`, the agent's executive can autonomously deploy treasury funds: paying for compute, acquiring resources, or interacting with other protocols — all signed through Core's Execute hook with revocable per-asset authority.

## Build with the Metaplex Agent Stack

The Metaplex Agent Stack combines identity, execution, launch, and tooling components for autonomous agent token operations.

| Tool | Purpose | Link |
|------|---------|------|
| **`mpl-agent-identity`** | `AgentIdentityV2` PDA, EIP-8004 metadata, `setAgentTokenV1` | [Docs](/smart-contracts/mpl-agent/identity) |
| **`mpl-agent-tools`** | Executive profiles and execution delegation records | [Docs](/smart-contracts/mpl-agent/tools) |
| **MPL Core** | Asset Signer PDA and Execute lifecycle hook | [Docs](/smart-contracts/core) |
| **Genesis** | Bonding curves and launchpools with `agent` parameter | [Docs](/smart-contracts/genesis) |
| **CLI** | Command-line agent and token management | [Agents CLI](/dev-tools/cli/agents) · [Genesis CLI](/dev-tools/cli/genesis) |
| **Skill** | AI coding agent knowledge base | [Docs](/agents/skill) |
| **Metaplex Launchpad** | No-code token launch interface | [metaplex.com](https://www.metaplex.com) |

## Notes

These notes cover critical constraints and lifecycle details for agent token launches on Metaplex.

- The end-to-end agent-token binding flow is built around [Genesis](/smart-contracts/genesis) bonding curves. Genesis launchpools are also supported, but the atomic launch + `setAgentTokenV1` flow is most commonly used with bonding curves
- The `agentToken` field on `AgentIdentityV2` is `Option<Pubkey>`. It is `None` until `setAgentTokenV1` is called, then `Some(mint)` permanently — there is no instruction to clear or reassign it
- Bonding curves use a constant-product formula; price rises as tokens are bought and falls as they are sold
- After graduation, Metaplex has no control over the token — it trades freely on Raydium and DEX aggregators
- Creator fees are configured at launch time and cannot be changed after the bonding curve is created. The recipient can be any wallet, including the agent's PDA
- The Asset Signer has no private key — it can only be controlled through Core's Execute lifecycle hook, with executive authority granted via `ExecutionDelegateRecordV1` and revocable by the asset owner

## FAQ

Common implementation and design questions about agent finance on Metaplex.

### What is agent finance?
Agent finance is the practice of capitalizing and governing autonomous AI agents through their own onchain tokens. On Metaplex, agents launch tokens through Genesis bonding curves and bind them via `setAgentTokenV1`, so revenue and creator fees route through onchain primitives.

### How does agent finance differ from agent commerce?
Agent finance covers how an agent is **funded and governed** through its token — capitalization, treasury, and holder alignment. [Agent commerce](/agents/agent-commerce) covers how an agent **earns revenue and generates economic activity** — paying for services, transacting with other agents, and participating in onchain markets. The two share the same agent identity, PDA wallet, and EIP-8004 metadata; finance gives the agent the resources to operate, commerce is what the agent does with them.

### How is the agent's wallet derived?
The agent's operational wallet is the Asset Signer — an MPL Core PDA derived from seeds `["mpl-core-execute", asset]`. There is no private key. The wallet is controlled exclusively through Core's [Execute lifecycle hook](/smart-contracts/core/execute-asset-signing), with executive authority delegated via [`mpl-agent-tools`](/smart-contracts/mpl-agent/tools).

### How is the agent token bound to the agent?
The [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token) instruction writes the token mint into the `agentToken` field on the [`AgentIdentityV2`](/smart-contracts/mpl-agent/identity) PDA. The binding is permanent and exposed in the agent's EIP-8004 metadata, so counterparties resolve the canonical token from a single source of truth.

### Why use a bonding curve instead of a presale or fair launch?
Bonding curves start trading immediately with no deposit window, provide continuous price discovery via a constant-product curve, and auto-graduate to a Raydium CPMM pool when fully filled. This gives agent tokens instant liquidity and a clear path to open-market trading.

### What happens to the funds raised?
Creator fees accrue in the bonding curve bucket during trading and are claimable by the creator wallet. After graduation to Raydium, the creator continues earning post-graduation creator fees from the CPMM pool. When the agent is set as creator, fees route directly to the Asset Signer PDA.

### Can any AI agent launch a token on Metaplex?
Yes. Any agent registered via [`mpl-agent-identity`](/smart-contracts/mpl-agent/identity) can launch a token. The agent needs an MPL Core asset with `AgentIdentityV2` registered and an `ExecutionDelegateRecordV1` for autonomous operation.

### How is this different from launching on pump.fun or other launchpads?
Metaplex agent tokens are bound to a verifiable onchain identity through `AgentIdentityV2`. The agent's wallet is a PDA with no private key, and the `setAgentTokenV1` binding is permanent and auditable. Generic launchpads have no concept of agent identity, agent-owned wallets, or execution delegation.

## Glossary

Core terms used in the Metaplex agent finance workflow.

| Term | Definition |
|------|------------|
| **Agent Finance** | The practice of capitalizing and governing autonomous AI agents through their own onchain tokens — fundraising, treasury, and holder alignment |
| **Agent Commerce** | The economic activity an agent generates — paying for services, transacting with other agents, and earning revenue from productive work (covered on the [Agent Commerce](/agents/agent-commerce) page) |
| **Agent Token** | A token launched from an agent's PDA wallet via Genesis bonding curve, permanently linked to the agent through `setAgentTokenV1` |
| **`AgentIdentityV2`** | The Metaplex Agent Registry PDA bound to an MPL Core asset; carries the `agentToken: Option<Pubkey>` field set by `setAgentTokenV1` |
| **Asset Signer (PDA Wallet)** | An MPL Core PDA derived from `["mpl-core-execute", asset]` — the agent's onchain wallet, controlled exclusively through Core's Execute hook |
| **`setAgentTokenV1`** | The `mpl-agent-identity` instruction that writes the token mint into the `agentToken` field on `AgentIdentityV2`. One-shot and irreversible |
| **`createAndRegisterLaunch`** | The Genesis SDK call that creates a bonding curve and (when `agent.setToken: true`) atomically emits `setAgentTokenV1` |
| **EIP-8004 Metadata** | The off-chain JSON document describing the agent (services, x402 support, registrations, supportedTrust); the bound `agentToken` is part of this document via the `AgentIdentityV2` PDA |
| **Bonding Curve** | A constant-product AMM that prices tokens based on supply; auto-graduates to Raydium when fully filled |
| **Graduation** | When all tokens on the curve are sold, liquidity auto-migrates to a Raydium CPMM pool |
| **Executive Profile** | An onchain identity for an off-chain operator authorized to sign transactions on the agent's behalf, registered via `mpl-agent-tools` |
| **`ExecutionDelegateRecordV1`** | The per-asset PDA in `mpl-agent-tools` that grants an executive permission to act on the agent's behalf; revocable by the asset owner |
| **Creator Fee** | A configurable percentage of each bonding curve swap directed to the creator wallet (often the agent's PDA) |
