---
title: Fetch Agent
metaTitle: Fetch Agent | Metaplex CLI
description: Fetch and display agent identity data for a registered MPL Core asset using the Metaplex CLI.
keywords:
  - agents fetch
  - mplx agents fetch
  - agent identity
  - agent data
  - Metaplex CLI
about:
  - Agent identity lookup
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '04-09-2026'
updated: '04-09-2026'
howToSteps:
  - Run mplx agents fetch with the Core asset address
  - Review the identity PDA, wallet PDA, registration URI, and lifecycle hooks
howToTools:
  - Metaplex CLI (mplx)
---

{% callout title="What You'll Do" %}
Fetch and inspect a registered agent's on-chain identity data:
- View the agent identity PDA and Asset Signer wallet
- Check registration URI and lifecycle hooks
- Verify whether an asset has a registered agent identity
{% /callout %}

## Summary

The `mplx agents fetch` command reads the on-chain [agent identity](/agents) PDA for an [MPL Core](/core) asset and displays registration info, lifecycle hooks, and the agent's built-in wallet ([Asset Signer PDA](/dev-tools/cli/config/asset-signer-wallets)).

- **Input**: An MPL Core asset address (from [`agents register`](/dev-tools/cli/agents/register))
- **Output**: Identity PDA, wallet PDA, registration URI, lifecycle hooks
- **No flags**: Only requires the asset address as an argument

**Jump to:** [Usage](#usage) · [Output](#output) · [Notes](#notes)

## Usage

```bash {% title="Fetch agent identity" %}
mplx agents fetch <ASSET_ADDRESS>
```

## Output

```text {% title="Expected output (registered agent)" %}
{
  registered: true,
  asset: '<asset_address>',
  owner: '<owner_address>',
  identityPda: '<identity_pda_address>',
  wallet: '<asset_signer_pda_address>',
  registrationUri: 'https://...',
  lifecycleChecks: { ... }
}
```

If the asset does not have a registered agent identity:

```text {% title="Expected output (not registered)" %}
No agent identity found for this asset. The asset may not be registered.
```

## Notes

- The `wallet` field is the Asset Signer PDA — the agent's built-in wallet used for signing transactions and holding funds
- The `registrationUri` points to the JSON document uploaded during registration containing the agent's name, description, services, and trust models
- Use `--json` for machine-readable output
