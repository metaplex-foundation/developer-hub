# Metaplex Core: Create Collection

Use this agent page when the user wants to create a Core Collection.

Human page: https://metaplex.com/docs/smart-contracts/core/collections/create

## Agent Routing

- Default to SDK or API instructions when the user is building an app, backend, script, or integration.
- Use CLI commands when the user asks for terminal commands, manual setup, debugging, one-off execution, or verification.
- If both apply, use SDK or API first and include the CLI quick reference as an operational fallback.

## Environment Prerequisites

- For SDK or API operations, Umi must be installed, configured with an RPC endpoint, and configured with a signer wallet before sending transactions.
- For CLI operations, the Metaplex CLI must be installed and configured with an RPC endpoint and wallet/keypair before running state-changing commands.
- If the user only needs code examples or conceptual guidance, do not assume live wallet access is available.

## When To Use

- The user asks how to create a Core Collection.
- The user asks how to create a Collection with plugins or royalties.
- The user wants the CLI command to create a Collection.

## SDK Function

Use `createCollection(umi, { collection, name, uri })`. Use a fresh signer for the collection address.

## CLI Quick Reference

```bash
mplx core collection create --name <NAME> --uri <URI>
mplx core collection create --name <NAME> --uri <URI> --pluginsFile <PATH>
mplx core collection template
```

Notes:

- `--pluginsFile <PATH>` attaches plugins during Collection creation.
- `mplx core collection template` generates template files.
- Full CLI docs: /docs/dev-tools/cli/core/create-collection

## Royalties Plugin Quick Reference

```json
[{
  "type": "Royalties",
  "basisPoints": 500,
  "creators": [{"address": "<CREATOR_ADDRESS>", "percentage": 100}],
  "ruleSet": {"type": "None"}
}]
```

Notes:

- `basisPoints: 500` means 5%.
- Creator percentages must total 100.
- For the full CLI plugin creation flow, use /docs/dev-tools/cli/core/create-collection

## Related Pages

- Fetch a Core Collection: /docs/smart-contracts/core/collections/fetch
- Core plugins overview: /docs/smart-contracts/core/plugins
- Create an asset into the Collection: /docs/smart-contracts/core/create-asset
- Full CLI create collection docs: /docs/dev-tools/cli/core/create-collection
