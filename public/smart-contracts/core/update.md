# Metaplex Core: Update Asset

Use this agent page when the user wants to update a Core Asset's name, metadata URI, image, or collection membership.

Human page: https://metaplex.com/docs/smart-contracts/core/update

## Agent Routing

- Default to SDK or API instructions when the user is building an app, backend, script, or integration.
- Use CLI commands when the user asks for terminal commands, manual setup, debugging, one-off execution, or verification.
- If both apply, use SDK or API first and include the CLI quick reference as an operational fallback.

## Environment Prerequisites

- For SDK or API operations, Umi must be installed, configured with an RPC endpoint, and configured with a signer wallet before sending transactions.
- For CLI operations, the Metaplex CLI must be installed and configured with an RPC endpoint and wallet/keypair before running state-changing commands.
- If the user only needs code examples or conceptual guidance, do not assume live wallet access is available.

## When To Use

- The user asks how to update Core Asset metadata.
- The user asks how to change a Core Asset's name or URI.
- The user asks how to re-upload an image through the CLI.
- The user asks how to move a Core Asset to another Collection.

## SDK Function

Use `update(umi, { asset, name, uri })` for SDK updates. Fetch the asset first when you need current state or collection data.

## CLI Commands

```bash
mplx core asset update <ASSETID> --name <NAME>
mplx core asset update <ASSETID> --uri <URI>
mplx core asset update <ASSETID> --image <PATH>
mplx core asset update <ASSETID> --collectionId <ADDR>
```

Notes:

- `--image <PATH>` re-uploads the image via Irys.
- `--collectionId <ADDR>` moves the asset to a different collection.
- Only the update authority or an authorized update delegate can update asset metadata.

## Related Pages

- Fetch a Core Asset first: /docs/smart-contracts/core/fetch.md
- Transfer ownership instead: /docs/smart-contracts/core/transfer.md
- Plugin updates: /docs/smart-contracts/core/plugins/update-plugins
