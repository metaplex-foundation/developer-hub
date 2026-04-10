# Metaplex Core: Plugins

Use this agent page when the user wants to configure Core plugins, especially CLI `--pluginsFile` input.

Human page: https://metaplex.com/docs/smart-contracts/core/plugins

## Agent Routing

- Default to SDK or API instructions when the user is building an app, backend, script, or integration.
- Use CLI commands when the user asks for terminal commands, manual setup, debugging, one-off execution, or verification.
- If both apply, use SDK or API first and include the CLI quick reference as an operational fallback.

## Environment Prerequisites

- For SDK or API operations, Umi must be installed, configured with an RPC endpoint, and configured with a signer wallet before sending transactions.
- For CLI operations, the Metaplex CLI must be installed and configured with an RPC endpoint and wallet/keypair before running state-changing commands.
- If the user only needs code examples or conceptual guidance, do not assume live wallet access is available.

## When To Use

- The user asks for the plugin JSON file format.
- The user asks how to add royalties at asset or collection creation.
- The user asks which plugin types are available in Core CLI flows.

## CLI Plugin Quick Reference

Use this JSON shape with `--pluginsFile`:

```json
[{
  "type": "Royalties",
  "basisPoints": 500,
  "creators": [{"address": "<CREATOR_ADDRESS>", "percentage": 100}],
  "ruleSet": {"type": "None"}
}]
```

## Available Plugin Types

- `Royalties`
- `FreezeDelegate`
- `BurnDelegate`
- `TransferDelegate`
- `Attributes`
- `ImmutableMetadata`
- `PermanentFreezeDelegate`
- `PermanentTransferDelegate`
- `PermanentBurnDelegate`

## RuleSet Options

```json
{"type": "None"}
```

```json
{"type": "ProgramAllowList", "programs": ["<PROGRAM_ID>"]}
```

```json
{"type": "ProgramDenyList", "programs": ["<PROGRAM_ID>"]}
```

Notes:

- `basisPoints: 500` means 5%.
- Creator percentages must total 100.
- For complete CLI plugin examples, use /docs/dev-tools/cli/core/plugins

## Related Pages

- Create a Core Asset with plugins: /docs/smart-contracts/core/create-asset
- Create a Core Collection with plugins: /docs/smart-contracts/core/collections/create
- Add plugins after creation: /docs/smart-contracts/core/plugins/adding-plugins
- Full CLI plugin docs: /docs/dev-tools/cli/core/plugins
