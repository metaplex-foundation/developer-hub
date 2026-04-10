# Metaplex Core: Burn Asset

Use this agent page when the user wants to burn, destroy, or remove a Core Asset.

Human page: https://metaplex.com/docs/smart-contracts/core/burn

## Agent Routing

- Default to SDK or API instructions when the user is building an app, backend, script, or integration.
- Use CLI commands when the user asks for terminal commands, manual setup, debugging, one-off execution, or verification.
- If both apply, use SDK or API first and include the CLI quick reference as an operational fallback.

## Environment Prerequisites

- For SDK or API operations, Umi must be installed, configured with an RPC endpoint, and configured with a signer wallet before sending transactions.
- For CLI operations, the Metaplex CLI must be installed and configured with an RPC endpoint and wallet/keypair before running state-changing commands.
- If the user only needs code examples or conceptual guidance, do not assume live wallet access is available.

## When To Use

- The user asks how to burn a Core Asset.
- The user asks for the CLI command to burn one Core Asset.
- The user asks how to burn assets from a list.

## SDK Function

Use `burn(umi, { asset })` for SDK burns. Burning is permanent.

## CLI Commands

```bash
mplx core asset burn <ADDR>
mplx core asset burn <ADDR> --collection <ADDR>
mplx core asset burn --list <file.json>
```

Notes:

- Burning is irreversible.
- Use `--collection <ADDR>` when collection context is required.
- Use `--list <file.json>` for a list-based burn flow.
- Only the owner or an authorized Burn Delegate can burn the asset.

## Related Pages

- Fetch before burn: /docs/smart-contracts/core/fetch.md
- Burn Delegate plugin: /docs/smart-contracts/core/plugins/burn-delegate
