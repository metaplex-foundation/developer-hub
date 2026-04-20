---
title: Overview
metaTitle: Agent Commands Overview | Metaplex CLI
description: Overview of agents CLI commands for registering and managing on-chain agent identities using the Metaplex CLI (mplx).
keywords:
  - agents CLI
  - mplx agents
  - agent identity
  - agent registration
  - executive delegation
  - Metaplex CLI
  - Solana agents
about:
  - Agent identity registration
  - Executive delegation
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '04-09-2026'
updated: '04-09-2026'
faqs:
  - q: What is the mplx agents command?
    a: The mplx agents command group lets you register agent identities on MPL Core assets, link Genesis tokens to agents, and manage executive delegation — all from your terminal.
  - q: What is an executive profile?
    a: An executive profile is a one-time on-chain PDA that allows a wallet to receive execution delegations from registered agents. Once registered, the executive can sign transactions on behalf of delegated agents.
  - q: Can I register an agent without uploading to Irys?
    a: Yes. By default, the register command uses the Metaplex Agent API which handles storage automatically. You only need Irys when using the --use-ix flag for direct on-chain registration.
  - q: Can an agent token be changed after it is set?
    a: No. The agent token can only be set once per identity using the set-agent-token command. This is irreversible.
---

{% callout title="What This Covers" %}
The complete CLI reference for agent identity management:
- **Registration**: Create and register agent identities on MPL Core assets
- **Token linking**: Associate Genesis token launches with agent identities
- **Executive delegation**: Authorize wallets to act on behalf of registered agents
{% /callout %}

## Summary

The `mplx agents` commands let you register agent identities on [MPL Core](/core) assets, link [Genesis](/smart-contracts/genesis) tokens, and manage executive delegation — all from your terminal.

- **Tool**: Metaplex CLI (`mplx`) with the `agents` command group
- **Identity**: Each agent identity is stored as a PDA derived from an MPL Core asset
- **Delegation**: Executives can be authorized to sign transactions on behalf of agents
- **Token linking**: A Genesis token can be permanently linked to an agent identity

**Jump to:** [Prerequisites](#prerequisites) · [General Flow](#general-flow) · [Command Reference](#command-reference) · [Common Errors](#common-errors) · [FAQ](#faq) · [Glossary](#glossary)

## Prerequisites

- The Metaplex CLI installed and on your `PATH`
- A Solana keypair file (e.g., `~/.config/solana/id.json`)
- SOL for transaction fees
- An RPC endpoint configured via `mplx config rpcs add` or passed with `-r`

Check your setup:

```bash {% title="Check CLI" %}
mplx agents --help
```

## General Flow

### Register an Agent Identity

Use `agents register` to create an MPL Core asset and register an agent identity in a single command. By default this uses the Metaplex Agent API — no Irys upload needed.

```bash {% title="Register an agent (API mode)" %}
mplx agents register \
  --name "My Agent" \
  --description "An autonomous trading agent" \
  --image "./avatar.png"
```

For advanced workflows (existing assets, custom documents, interactive wizard), use the `--use-ix` flag to send the `registerIdentityV1` instruction directly. See [Register Agent](/dev-tools/cli/agents/register) for full details.

### Link a Genesis Token

After registering an agent and creating a Genesis token launch, link them with `set-agent-token`. This permanently associates the token with the agent identity.

```bash {% title="Link Genesis token to agent" %}
mplx agents set-agent-token <AGENT_MINT> <GENESIS_ACCOUNT>
```

{% callout type="warning" title="Irreversible" %}
Each agent identity can only ever have one token, and the agent token can only be set once. This action cannot be undone.
{% /callout %}

### Set Up Executive Delegation

Executive delegation allows a wallet to sign transactions on behalf of a registered agent:

1. **Register** an executive profile (one-time per wallet):
```bash {% title="Register executive profile" %}
mplx agents executive register
```

2. **Delegate** an agent to the executive (run by the asset owner):
```bash {% title="Delegate execution" %}
mplx agents executive delegate <AGENT_MINT> --executive <EXECUTIVE_WALLET>
```

3. **Revoke** a delegation (run by either the owner or executive):
```bash {% title="Revoke delegation" %}
mplx agents executive revoke <AGENT_MINT>
```

See [Executive Delegation](/dev-tools/cli/agents/executive) for full details.

## Command Reference

| Command | Description |
|---------|-------------|
| [`agents register`](/dev-tools/cli/agents/register) | Register an agent identity on an MPL Core asset |
| [`agents fetch`](/dev-tools/cli/agents/fetch) | Fetch and display agent identity data |
| [`agents set-agent-token`](/dev-tools/cli/agents/set-agent-token) | Link a Genesis token to a registered agent |
| [`agents executive register`](/dev-tools/cli/agents/executive) | Create an executive profile for the current wallet |
| [`agents executive delegate`](/dev-tools/cli/agents/executive) | Authorize an executive to act on behalf of an agent |
| [`agents executive revoke`](/dev-tools/cli/agents/executive) | Remove an execution delegation |

## Notes

- Agent identities are stored as PDAs derived from MPL Core assets via the [Agent Registry](/agents) program
- The default registration flow uses the Metaplex Agent API — use `--use-ix` for direct on-chain registration
- `set-agent-token` requires the wallet to be in asset-signer mode — see [Asset-Signer Wallets](/dev-tools/cli/config/asset-signer-wallets)
- Run `mplx agents <command> --help` for full flag documentation on any command
- See the [Agent Kit documentation](/agents) for concepts, architecture, and SDK guides

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| No agent identity found | Asset is not registered as an agent | Register the asset first with `agents register` |
| Agent token already set | Trying to set the token a second time | Agent token can only be set once per identity — this is irreversible |
| Executive profile already exists | Calling `executive register` twice from the same wallet | Each wallet can only have one executive profile — it's already set up |
| Not the asset owner | Trying to delegate from a non-owner wallet | Only the asset owner can delegate execution |
| Delegation not found | Revoking a delegation that doesn't exist | Check the agent and executive addresses are correct |

## FAQ

**What is the mplx agents command?**
The `mplx agents` command group lets you register agent identities on MPL Core assets, link Genesis tokens to agents, and manage executive delegation — all from your terminal.

**What is an executive profile?**
An executive profile is a one-time on-chain PDA that allows a wallet to receive execution delegations from registered agents. Once registered, the executive can sign transactions on behalf of delegated agents.

**Can I register an agent without uploading to Irys?**
Yes. By default, the `register` command uses the Metaplex Agent API which handles storage automatically. You only need Irys when using the `--use-ix` flag for direct on-chain registration.

**Can an agent token be changed after it is set?**
No. The agent token can only be set once per identity using the `set-agent-token` command. This is irreversible.

**What is the difference between the API and direct IX registration paths?**
The API path (default) creates a Core asset and registers the identity in a single API call with no Irys upload needed. The direct IX path (`--use-ix`) sends the `registerIdentityV1` instruction directly, which is needed for existing assets, custom document workflows, or the interactive wizard.

## Glossary

| Term | Definition |
|------|------------|
| **Agent Identity** | An on-chain PDA derived from an MPL Core asset that stores the agent's registration data, lifecycle hooks, and token association |
| **Executive Profile** | A one-time on-chain PDA for a wallet, required before that wallet can receive execution delegations |
| **Execution Delegation** | A per-asset link between a registered agent and an executive profile, allowing the executive to sign transactions on behalf of the agent |
| **Asset Signer PDA** | A PDA derived from the Core asset that acts as the agent's built-in wallet — used for `set-agent-token` |
| **Registration Document** | A JSON document containing the agent's name, description, image, services, and trust models — uploaded and stored as the identity URI |
