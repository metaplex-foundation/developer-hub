---
title: Executive Delegation
metaTitle: Executive Delegation | Metaplex CLI
description: Register executive profiles and manage execution delegation for agents using the Metaplex CLI.
keywords:
  - agents executive
  - executive delegation
  - mplx agents executive
  - execution delegate
  - agent execution
  - Metaplex CLI
about:
  - Executive profile registration
  - Execution delegation
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '04-09-2026'
updated: '04-09-2026'
howToSteps:
  - Register an executive profile with mplx agents executive register
  - Delegate an agent to the executive with mplx agents executive delegate
  - Optionally revoke a delegation with mplx agents executive revoke
howToTools:
  - Metaplex CLI (mplx)
faqs:
  - q: What is an executive profile?
    a: A one-time on-chain PDA for a wallet that enables it to receive execution delegations from registered agents.
  - q: Can a wallet have multiple executive profiles?
    a: No. Each wallet can only have one executive profile. Registration is a one-time operation.
  - q: Who can revoke a delegation?
    a: Either the asset owner or the executive authority can revoke a delegation.
---

{% callout title="What You'll Do" %}
Manage execution delegation for registered agents:
- Register executive profiles (one-time per wallet)
- Delegate agent execution to an executive wallet
- Revoke delegations when no longer needed
{% /callout %}

## Summary

The `mplx agents executive` commands manage execution delegation — authorizing wallets to sign transactions on behalf of registered [agents](/agents). An executive must register a profile once, then the [MPL Core](/core) asset owner can delegate execution to them.

- **Register**: One-time executive profile creation per wallet
- **Delegate**: Link a registered agent to an executive (owner only)
- **Revoke**: Remove a delegation (owner or executive can revoke)

**Jump to:** [Register Executive Profile](#register-executive-profile) · [Delegate Execution](#delegate-execution) · [Revoke Delegation](#revoke-delegation) · [Common Errors](#common-errors) · [FAQ](#faq)

## Register Executive Profile

The `agents executive register` command creates a one-time on-chain executive profile PDA for the current wallet. This profile is required before any agent can be [delegated](/dev-tools/cli/agents/executive#delegate-execution) to this wallet.

```bash {% title="Register executive profile" %}
mplx agents executive register
```

No flags or arguments required — the profile is derived from the current signer's wallet.

### Output

```text {% title="Expected output" %}
--------------------------------
  Executive Profile: <profile_pda_address>
  Authority: <wallet_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
--------------------------------
```

## Delegate Execution

The `agents executive delegate` command links a registered agent to an executive profile, allowing the executive to sign transactions on behalf of the agent. Only the asset owner can delegate execution.

```bash {% title="Delegate execution" %}
mplx agents executive delegate <AGENT_MINT> --executive <EXECUTIVE_WALLET>
```

### Options

| Flag | Description | Required |
|------|-------------|----------|
| `--executive <string>` | The executive's wallet address (profile PDA is derived automatically) | Yes |

{% callout type="note" %}
The executive must have already registered their profile with `mplx agents executive register` before delegation.
{% /callout %}

### Output

```text {% title="Expected output" %}
--------------------------------
  Agent Mint: <agent_mint_address>
  Executive Profile: <profile_pda_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
--------------------------------
```

## Revoke Delegation

The `agents executive revoke` command removes an execution delegation, closing the delegation record and refunding rent. Either the asset owner or the executive authority can revoke.

```bash {% title="Revoke delegation (as owner)" %}
mplx agents executive revoke <AGENT_MINT> --executive <EXECUTIVE_WALLET>
```

```bash {% title="Revoke own delegation (as executive)" %}
mplx agents executive revoke <AGENT_MINT>
```

### Options

| Flag | Description | Required | Default |
|------|-------------|----------|---------|
| `--executive <string>` | The executive's wallet address | No | Current signer |
| `--destination <string>` | Wallet to receive refunded rent | No | Current signer |

### Output

```text {% title="Expected output" %}
--------------------------------
  Agent Mint: <agent_mint_address>
  Executive Wallet: <executive_wallet_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
--------------------------------
```

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Executive profile already exists | Calling `register` a second time | Each wallet can only have one profile — it's already registered |
| Not the asset owner | Trying to delegate from a non-owner wallet | Only the asset owner can delegate execution |
| Executive profile not found | Delegating to a wallet that hasn't registered | The executive must run `agents executive register` first |
| Delegation not found | Revoking a delegation that doesn't exist | Verify the agent asset and executive addresses |

## Notes

- Executive profiles are one-time per wallet — registering again will fail
- Each delegation is per-asset: an executive can be delegated multiple agents, but each requires a separate `delegate` call
- When revoking without `--executive`, the command defaults to the current signer (for executives revoking their own delegation)
- Rent from closed delegation records is refunded to the `--destination` wallet (defaults to the signer)

## FAQ

**What is an executive profile?**
A one-time on-chain PDA for a wallet that enables it to receive execution delegations from registered agents.

**Can a wallet have multiple executive profiles?**
No. Each wallet can only have one executive profile. Registration is a one-time operation.

**Who can revoke a delegation?**
Either the asset owner or the executive authority can revoke a delegation. When the executive revokes, `--executive` can be omitted (defaults to current signer).
